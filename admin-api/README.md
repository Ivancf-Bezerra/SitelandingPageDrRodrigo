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

Hospede esta API em um serviço com HTTPS. Defina no build do Angular `environment.apiUrl` com a URL pública da API e `JWT_SECRET` forte no servidor.
