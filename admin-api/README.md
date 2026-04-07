# API do administrador (fotos)

## Executar

```bash
cd admin-api
npm install
npm start
```

Porta padrão: **3333**. O front em desenvolvimento usa `http://localhost:3333` (veja `landing-page/src/environments/environment.development.ts`).

## Credenciais iniciais

Se o arquivo `data/database.json` for gerado automaticamente na primeira execução:

- **Email:** `admin@clinica.local` (ou `ADMIN_EMAIL`)
- **Senha:** `AltereEstaSenha!`

Altere a senha trocando o hash em `data/database.json` ou removendo o arquivo para regerar (defina `ADMIN_PASSWORD_HASH` com `bcryptjs.hashSync(suaSenha, 10)`).

## Variáveis de ambiente

| Variável | Descrição |
|----------|-----------|
| `PORT` | Porta do servidor (default 3333) |
| `JWT_SECRET` | Segredo para assinar JWT (obrigatório em produção) |
| `ADMIN_EMAIL` | Email do seed |
| `ADMIN_PASSWORD_HASH` | Hash bcrypt da senha do seed |

## Produção

Hospede esta API em um serviço com HTTPS (Railway, Render, VPS, etc.). No servidor: `JWT_SECRET` forte e CORS já reflete a origem (`cors({ origin: true })`), compatível com GitHub Pages.

**Site no GitHub Pages:** a API **não** roda no Pages; só o Angular estático. O front lê a URL da API em `landing-page/public/api-config.json` (campo `apiUrl`, sem barra no final). Depois de editar, rode `npm run deploy:gh-pages` na pasta `landing-page`. Se preferir, defina `environment.apiUrl` no build — esse valor tem prioridade sobre o JSON.

Exemplo de `api-config.json`:

```json
{ "apiUrl": "https://sua-api.onrender.com" }
```
