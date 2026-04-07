# Plano: administrador (nível 0), login e edição de fotos no site

## Objetivo

Implementar um **usuário administrador com role `admin` nível 0** (maior privilégio), autenticado por **login e senha**, que veja no front-end um botão **“Editar foto”** (ou equivalente) **apenas quando autenticado**, permitindo **substituir/atualizar todas as imagens usadas no projeto** — com persistência **associada ao perfil do admin** (servidor), sem depender de rebuild manual do site para cada troca de arquivo.

## Escopo atual do projeto (contexto)

- Site Angular com páginas Home, Galeria, Agendamento, Contato.
- Imagens referenciadas principalmente por **caminhos estáticos** (`assets/fotos/...`) e possivelmente URLs externas (ex.: embed de mapa).
- Deploy possível em **GitHub Pages** (hash routing): hospedagem **estática** — **não** há backend nem banco no repositório hoje.

**Conclusão:** persistência “no perfil do usuário admin” implica **introduzir um backend ou BaaS** (ou fluxo híbrido). O plano abaixo assume isso explicitamente.

---

## Princípios de segurança

1. **Nunca** armazenar senha em texto plano; usar **hash** adequado (Argon2, bcrypt ou similar) no servidor.
2. **JWT** (curta duração) + **refresh token** (httpOnly, secure) ou **sessão server-side** com cookie seguro — evitar guardar senha ou refresh em `localStorage` quando possível.
3. Role **`admin`** com **`nivel: 0`** no **payload verificável no servidor** (claim no token ou consulta à base em cada operação sensível).
4. Upload de imagens: validar **tipo MIME**, **tamanho máximo**, opcionalmente **dimensões**; servir via **URL assinada** ou CDN; escanear vírus se o risco justificar.
5. Botão “Editar foto”: renderizado só se `authService.isAdminNivel0()` for verdadeiro; **a API deve recusar** qualquer upload se o usuário não for admin nível 0 (não confiar só no front).

---

## Arquitetura sugerida (alto nível)

| Camada | Responsabilidade |
|--------|------------------|
| **Front (Angular)** | Login, guard de rota, estado de sessão, UI de edição (overlay modal ou painel), upload via `FormData`, lista de “slots” de imagem do site. |
| **API** (Node/Nest, .NET, etc.) ou **BaaS** (Firebase Auth + Storage, Supabase Auth + Storage) | Autenticação, verificação de role, CRUD de metadados, upload para storage, URLs públicas ou assinadas. |
| **Storage** | Objetos binários (S3, GCS, Azure Blob, ou storage do BaaS). |
| **Banco** | Usuário admin, perfil, mapeamento `slotId → urlAtual → versão/histórico`. |

**Alternativa MVP:** sem storage próprio no primeiro momento — apenas salvar **URL** editável no perfil (menos ideal para “upload direto”).

---

## Modelo de dados (exemplo)

### Usuário / perfil

```text
users
  id
  email (login)
  password_hash
  role                 // "admin" | "user" | ...
  nivel                // 0 = admin máximo; inteiro para futuras granularidades
  nome_exibicao
  created_at
  updated_at
```

### Catálogo de imagens do site (“slots”)

Tabela ou coleção fixa no código + seeds no banco:

```text
site_image_slots
  id                   // ex. "hero-dr", "servicos-antes-1", "galeria-thumb-3"
  descricao
  categoria            // hero | galeria | antes-depois | clinica | ...
  url_default          // fallback se não houver override
  ordem
```

### Overrides por ambiente (ou global)

```text
site_image_overrides
  id
  slot_id
  url                  // URL final servida (CDN/storage)
  updated_by_user_id
  updated_at
```

- Se a política for “uma única versão global”, não precisa de `updated_by` por slot por usuário — mas o requisito diz **salvo no perfil do admin**: pode significar **auditoria** (`updated_by` = admin) ou **preferências por admin** (mais raro). Recomendação: **uma fonte de verdade global** + **campo `updated_by` no registro de override** para rastrear o admin.

---

## Fluxo do administrador

1. Acessar **`/admin/login`** (ou modal na home) — URL não indexada, `robots` se necessário.
2. **Login** → API retorna token/sessão com claims `role=admin`, `nivel=0`.
3. Em qualquer página (ou só nas que têm imagem), componente consulta auth e exibe **botão flutuante discreto** ou **barra “Modo edição”** com **“Editar foto”** por imagem (ou lista no painel).
4. Ao clicar: abrir modal com **preview**, **upload** novo arquivo ou **URL**, **salvar** → API valida admin, grava storage + `site_image_overrides`, invalida cache CDN se houver.
5. Front passa a **resolver URL**: `resolveImageUrl(slotId)` → override se existir, senão `assets/...` default.

---

## Front-end Angular (tarefas)

1. **Módulo / rotas** `admin`: `login`, opcional `dashboard`.
2. **AuthService**: `signIn`, `signOut`, `user$`, `isAdminNivel0()`, armazenamento de token (estrategy alinhada à API).
3. **AuthGuard** e **AdminNivel0Guard** nas rotas e/ou para exibir o botão (guard só para rota; botão usa `*ngIf` + service).
4. **ImageSlotRegistry** (serviço ou JSON): lista de todos os `slotId` usados no projeto mapeados aos componentes (Hero, Serviços, Galeria, etc.).
5. **Componente `EditableImage`** ou diretiva:
   - Inputs: `slotId`, `alt`, classes CSS.
   - Mostra `<img [src]="resolvedUrl()">`.
   - Se admin: overlay com botão “Editar foto”.
6. **Upload**: `HttpClient.post` multipart para `POST /api/admin/images/:slotId`.
7. **Interceptador HTTP**: anexar `Authorization` onde aplicável.

---

## Backend / BaaS (tarefas)

1. Criar usuário **admin nível 0** (seed ou primeiro setup).
2. Endpoints (exemplo REST):
   - `POST /auth/login`
   - `POST /auth/logout` / refresh
   - `GET /admin/images` — lista slots + URLs atuais
   - `POST /admin/images/:slotId` — multipart upload
   - `DELETE /admin/images/:slotId` — reverter ao default (opcional)
3. Middleware: verificar JWT + `role === admin` && `nivel === 0`.
4. Integração **storage** + atualização de `site_image_overrides`.
5. **CORS** configurado para o domínio do site.

---

## Inventário de imagens (ação de projeto)

Antes de codificar, fazer levantamento:

- [ ] Hero (placeholder / futura foto Dr.)
- [ ] Sobre (foto Dr.)
- [ ] Serviços — cards antes/depois (`assets/fotos/antes-depois/...`)
- [ ] Galeria — array em `galeria.ts` (fotos + thumbs)
- [ ] Contato / ícones (se houver imagens, não só SVG)
- [ ] Qualquer `background-image` em CSS

Cada uma vira um **`slotId`** estável documentado no `ImageSlotRegistry`.

---

## Deploy e GitHub Pages

- **Opção A:** front continua em GH Pages; **API + storage** em outro host (Railway, Render, AWS, etc.) — CORS apontando para o domínio GH Pages.
- **Opção B:** migrar front para host que permita **mesmo domínio** que a API (reverse proxy) para cookies same-site.
- **Opção C:** usar **Firebase/Supabase** com regras de storage restritas a `auth.token.role == admin` (expressões específicas da plataforma).

---

## Fases de implementação

| Fase | Entregas |
|------|----------|
| **F1 – Fundação** | Escolha BaaS vs API própria; modelo de dados; seed admin nível 0; login funcional. |
| **F2 – Storage** | Upload; URL estável por slot; política de acesso. |
| **F3 – Front** | `resolveImageUrl`, `EditableImage`, botão só para admin; substituir referências hardcoded gradualmente. |
| **F4 – Qualidade** | Preview, erro de upload, revert, auditoria, limites de tamanho, documentação para o cliente. |

---

## Testes recomendados

- Login com usuário não-admin → **não** vê botão; API retorna **403** em upload.
- Login admin nível 1 (futuro) → **não** pode upload se a regra for só nível 0.
- Troca de imagem → refresh da página mostra nova imagem (cache-bust via query `?v=timestamp` se necessário).
- Slot inexistente → 404 tratado no front.

---

## Riscos e decisões pendentes

1. **Custo** de storage e egress.
2. **LGPD**: dados do admin (e-mail) e logs de alteração.
3. **Histórico de versões** das imagens: apenas última versão vs. bucket versionado.
4. **Build estático:** após F3, o default pode continuar vindo de `assets/` até o primeiro override.

---

## Referência de nomenclatura

- **Role:** `admin`
- **Nível:** `0` (único nível com permissão de edição global de mídia neste plano)

---

*Documento gerado para alinhamento de implementação; ajustar conforme a stack (Angular + X) escolhida para auth e storage.*
