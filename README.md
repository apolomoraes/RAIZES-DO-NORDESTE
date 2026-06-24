<h1 align="center">RAÍZES DO NORDESTE (Back-End)</h1>

<p align="center">
UNINTER: PROJETO MULTIDISCIPLINAR | TRILHA: BACK-END | REDE "RAÍZES DO NORDESTE"
</p>

## 💻 Projeto

API REST desenvolvida como projeto de conclusão de curso (Projeto Multidisciplinar) na UNINTER, trilha Back-End. O sistema simula a operação de uma rede de lanchonetes nordestinas, contemplando múltiplos canais de atendimento, controle de estoque por unidade, programa de fidelização, pagamento via gateway mock e conformidade com a LGPD.

---

## 🚀 Tecnologias

- Node.js
- Express
- SQLite
- Knex
- JSON Web Token (JWT)
- Bcryptjs
- Swagger UI Express + Swagger JSDoc
- Dotenv

---

## ⚙️ Requisitos

- Node.js v18 ou superior
- NPM v9 ou superior

---

## 🔧 Configuração

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/raizesdonordeste.git
cd raizesdonordeste
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto com base no `.env.example`:

```bash
cp .env.example .env
```

Edite o `.env` com os valores desejados:

```
PORT=3000
JWT_SECRET=sua_chave_secreta_aqui
```

### 4. Crie o banco de dados e execute as migrations

```bash
npx knex migrate:latest
```

### 5. Popule o banco com os dados iniciais (seed)

```bash
npx knex seed:run
```

Usuários criados pelo seed:

| E-mail               | Senha  | Role      |
| -------------------- | ------ | --------- |
| admin@raizes.com     | 123456 | admin     |
| gerente@raizes.com   | 123456 | gerente   |
| cozinha@raizes.com   | 123456 | cozinha   |
| atendente@raizes.com | 123456 | atendente |
| joao@email.com       | 123456 | cliente   |

### 6. Inicie o servidor

```bash
npm run dev
```

O servidor estará disponível em `http://localhost:3000`

---

## 📄 Documentação da API (Swagger)

Com o servidor rodando, acesse:
http://localhost:3000/api-docs

---

## 🧪 Testes

A coleção de testes está disponível no repositório em:

```
Insomnia:
/collection/raizes_do_nordeste_insomnia-collection.yaml
```

```
Postman:
/collection/raizes_do_nordeste.postman_collection.json
```

Importe o arquivo no Insomnia ou Postman para executar os testes.

**Ordem recomendada de execução:**

1. `POST /auth/login` — faça login e copie o token
2. `POST /usuarios` — cadastre um novo usuário
3. `GET /unidades` — liste as unidades disponíveis
4. `GET /produtos?unidade_id=1` — consulte o cardápio da unidade
5. `POST /pedidos` — crie um pedido
6. `POST /pagamento/solicitar` — solicite o pagamento mock
7. `PATCH /pedidos/:id/status` — atualize o status do pedido
8. `GET /fidelidade/saldo` — consulte os pontos do cliente

---

## 🔑 Autenticação nos Testes

Todas as rotas protegidas exigem um token JWT válido. Antes de executar qualquer teste que exija autenticação, siga os passos abaixo:

### 1. Faça login

Execute o request **Auth/Login** com um dos usuários do seed:

```json
POST /auth/login
{
  "email": "admin@raizes.com",
  "password": "123456"
}
```

### 2. Copie o token retornado

A resposta será algo como:

```json
{
  "usuario": { ... },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

Copie o valor do campo `token`.

### 3. Configure o token

**No Postman:**

- Abra qualquer request protegido
- Vá em **Authorization**
- Selecione o tipo **Bearer Token**
- Cole o token no campo **Token**
- Salve

**No Insomnia:**

- Abra qualquer request protegido
- No campo **Authorization → Bearer Token**
- Substitua `<token>` pelo token copiado
- Repita para os demais requests protegidos

### ⚠️ Atenção

O token expira em **1 dia**. Se receber erro `401 Token inválido`, repita o processo de login para obter um novo token.

---

## 💡 Utilização

Todas as rotas protegidas exigem o token JWT no header:

```
Authorization: Bearer <token>
```

O token é obtido via `POST /auth/login`.

---

## 📁 Estrutura do Projeto

```
src/
├── api/
│   ├── controllers/    ← recebem req/res e chamam os services
│   ├── middlewares/    ← autenticação JWT e autorização por role
│   └── routes/         ← definição dos endpoints e documentação Swagger
├── application/
│   └── services/       ← regras de negócio e validações
├── infrastructure/
│   └── database/
│       └── knex/
│           ├── migrations/   ← estrutura do banco de dados
│           └── seeds/        ← dados iniciais para testes
├── configs/            ← configurações de JWT e Swagger
├── utils/              ← AppError e utilitários
└── server.js           ← entrada da aplicação
```
