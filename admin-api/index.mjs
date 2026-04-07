import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_PATH = path.join(__dirname, 'data', 'database.json');
const UPLOAD_DIR = path.join(__dirname, 'uploads');
const TMP_DIR = path.join(UPLOAD_DIR, 'tmp');

const ALLOWED_SLOTS = new Set([
  'hero-retrato',
  'sobre-retrato',
  'servicos-antes-1',
  'servicos-depois-1',
  ...Array.from({ length: 10 }, (_, i) => `galeria-foto-${i + 1}`),
]);

function readDb() {
  return JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));
}

function writeDb(db) {
  fs.mkdirSync(path.dirname(DATA_PATH), { recursive: true });
  fs.writeFileSync(DATA_PATH, JSON.stringify(db, null, 2), 'utf8');
}

function ensureDb() {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  fs.mkdirSync(TMP_DIR, { recursive: true });
  if (!fs.existsSync(DATA_PATH)) {
    const hash =
      process.env.ADMIN_PASSWORD_HASH ||
      '$2b$10$jGdTEAUoxMAHJkj3GBQ.7ODBF5llxEtJP/IuSEV0kBhYrgUBWGUHa';
    writeDb({
      users: [
        {
          id: '1',
          email: process.env.ADMIN_EMAIL || 'admin@clinica.local',
          passwordHash: hash,
          role: 'admin',
          nivel: 0,
          nomeExibicao: 'Administrador',
          createdAt: new Date().toISOString(),
        },
      ],
      overrides: {},
    });
  }
}

ensureDb();

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-altere-em-producao';
const PORT = Number(process.env.PORT) || 3333;

const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use('/uploads', express.static(UPLOAD_DIR));

const upload = multer({
  storage: multer.diskStorage({
    destination: (_, __, cb) => cb(null, TMP_DIR),
    filename: (_, f, cb) => cb(null, `tmp-${uuidv4()}`),
  }),
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const ok = /^image\/(jpeg|png|webp|gif)$/i.test(file.mimetype);
    cb(ok ? null : new Error('Tipo não permitido'), ok);
  },
});

function authMiddleware(req, res, next) {
  const h = req.headers.authorization;
  if (!h?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Não autorizado' });
  }
  try {
    req.user = jwt.verify(h.slice(7), JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ error: 'Token inválido' });
  }
}

function requireAdminNivel0(req, res, next) {
  if (req.user.role !== 'admin' || req.user.nivel !== 0) {
    return res.status(403).json({ error: 'Apenas administrador nível 0' });
  }
  next();
}

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ error: 'Email e senha obrigatórios' });
  }
  const db = readDb();
  const user = db.users.find((u) => u.email === email);
  if (!user || !bcrypt.compareSync(password, user.passwordHash)) {
    return res.status(401).json({ error: 'Credenciais inválidas' });
  }
  const token = jwt.sign(
    { sub: user.id, email: user.email, role: user.role, nivel: user.nivel },
    JWT_SECRET,
    { expiresIn: '8h' }
  );
  res.json({
    token,
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
      nivel: user.nivel,
      nomeExibicao: user.nomeExibicao,
    },
  });
});

app.get('/api/auth/me', authMiddleware, (req, res) => {
  const db = readDb();
  const user = db.users.find((u) => u.id === req.user.sub);
  if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });
  res.json({
    id: user.id,
    email: user.email,
    role: user.role,
    nivel: user.nivel,
    nomeExibicao: user.nomeExibicao,
  });
});

app.get('/api/site-images', (_req, res) => {
  const db = readDb();
  const overrides = {};
  for (const [slotId, rec] of Object.entries(db.overrides || {})) {
    if (rec?.publicPath) overrides[slotId] = rec.publicPath;
  }
  res.json({ overrides });
});

app.post(
  '/api/admin/images/:slotId',
  authMiddleware,
  requireAdminNivel0,
  (req, res, next) => {
    upload.single('file')(req, res, (err) => {
      if (err) {
        return res.status(400).json({ error: String(err.message || err) });
      }
      next();
    });
  },
  (req, res) => {
    const { slotId } = req.params;
    if (!ALLOWED_SLOTS.has(slotId)) {
      if (req.file?.path) fs.unlinkSync(req.file.path);
      return res.status(400).json({ error: 'Slot inválido' });
    }
    if (!req.file) {
      return res.status(400).json({ error: 'Arquivo obrigatório (campo file)' });
    }
    const ext = path.extname(req.file.originalname).toLowerCase() || '.jpg';
    const safeExt = ['.jpg', '.jpeg', '.png', '.webp', '.gif'].includes(ext) ? ext : '.jpg';
    const name = `${slotId.replace(/[^a-z0-9-]/gi, '-')}-${uuidv4()}${safeExt}`;
    const finalPath = path.join(UPLOAD_DIR, name);
    try {
      fs.renameSync(req.file.path, finalPath);
    } catch (e) {
      if (req.file.path) fs.unlinkSync(req.file.path);
      throw e;
    }

    const publicPath = `/uploads/${name}`;
    const db = readDb();
    const prev = db.overrides?.[slotId];
    if (prev?.publicPath) {
      const prevFile = path.join(UPLOAD_DIR, path.basename(prev.publicPath));
      if (fs.existsSync(prevFile)) fs.unlinkSync(prevFile);
    }
    if (!db.overrides) db.overrides = {};
    db.overrides[slotId] = {
      publicPath,
      updatedBy: req.user.sub,
      updatedAt: new Date().toISOString(),
    };
    writeDb(db);
    res.json({ slotId, publicPath });
  }
);

app.delete('/api/admin/images/:slotId', authMiddleware, requireAdminNivel0, (req, res) => {
  const { slotId } = req.params;
  if (!ALLOWED_SLOTS.has(slotId)) {
    return res.status(400).json({ error: 'Slot inválido' });
  }
  const db = readDb();
  const rec = db.overrides?.[slotId];
  if (rec?.publicPath) {
    const fpath = path.join(UPLOAD_DIR, path.basename(rec.publicPath));
    if (fs.existsSync(fpath)) fs.unlinkSync(fpath);
  }
  if (db.overrides) delete db.overrides[slotId];
  writeDb(db);
  res.json({ ok: true });
});

app.listen(PORT, () => {
  console.log(`admin-api em http://localhost:${PORT}`);
  console.log(`Login padrão: ${readDb().users[0]?.email} / senha: AltereEstaSenha! (se DB recém-criado)`);
});
