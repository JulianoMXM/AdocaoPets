# Adoção de Pets API

API RESTful desenvolvida para um sistema de adoção de animais. O projeto permite cadastro de usuário, gerenciamento de pets, agendamento de visitas e conclusão de adoções, com autenticação usando JWT e regras de negócio.

# Funcionalidades

- **Usuários:**
  - Cadastro e Login (com Hash de senha).
  - Autenticação via Token JWT.
  - Edição de perfil (apenas o próprio usuário).
  - Exclusão de conta.

- **Pets:**
  - Cadastro de pets com características físicas.
  - Listagem de todos os pets disponíveis.
  - Listagem de pets do próprio dono.
  - Busca de pets por ID.
  - Edição e Remoção (Apenas o dono pode realizar).

- **Adoção (Regras de Negócio):**
  - Agendamento de visitas (Não permite agendar o próprio pet).
  - Conclusão de adoção (Apenas o dono original pode concluir).
  - Cancelamento de agendamento (Dono ou visitante podem cancelar).

# Requisitos

- Node.js
- MongoDB

# 1. Passo

```bash
git clone [https://github.com/JulianoMXM/AdocaoPets.git](https://github.com/JulianoMXM/AdocaoPets.git)
cd AdocaoPets/backend
```

# 2. Passo

```npm install```

# 3. Passo

Criar um arquivo .env na raiz da pasta backend e preencha seguindo o modelo abaixo:

DB_USER=seu_usuario_mongoatlas
DB_PASSWORD=sua_senha_mongoatlas
JWT_TOKEN=sua_chave_secreta_jwt

# 4. Passo

Inicie o servidor usando ```npm run dev```

# Rotas Users

- POST -> users/register
  - Cria um novo usuário, rota pública

- POST -> users/login
  - Login e retorno do token, rota pública

- GET -> users/checkUser
  - Verifica o usuário logado, rota pública

- GET -> users/:id
  - Busca usuário por ID, rota pública

- PATCH -> users/:id
  - Atualiza dados do usuário, autenticação via token

- DELETE -> users/:id
  - Deleta dados do usuário, autenticação via token

# Rotas Pets

- POST -> pets/create
  - Cria um novo pet, autenticação via token

- GET -> pets
  - Busca todos os pets cadastrados, rota pública

- GET -> pets/mypets
  - Busca os pets do usuário logado, autenticação via token

- GET -> pets/:id
  - Busca pet por ID, rota pública

- PATCH -> pets/:id
  - Atualiza dados do pet por ID, autenticação via token

- PATCH -> pets/schedule/:id
  - Agenda visita com o pet, autenticação via token

- PATCH -> pets/removeSchedule/:id
  - Remove agendamento da visita com o pet, autenticação via token

- PATCH -> pets/conclude/:id
  - Conclui a adoção do pet, autenticação via token

- DELETE -> pets/:id
  - Apaga os dados do pet, autenticação via token