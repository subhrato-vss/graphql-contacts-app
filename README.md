# 📇 GraphQL Contact Manager API

A secure and scalable **GraphQL API** built with **Node.js, Express, Sequelize, and JWT authentication** for managing users and their contacts.  
Supports authentication, authorization, and full CRUD operations using GraphQL.

---

## 🚀 Features

- 🔐 JWT Authentication (Signup / Login)
- 🧑 User Account System
- 📇 Contact Management (CRUD)
- 🛡️ Protected GraphQL Resolvers
- 🧩 GraphQL Schema & Resolvers Architecture
- 🗄️ Sequelize ORM (MySQL / PostgreSQL compatible)
- 🌍 CORS enabled
- 📊 GraphiQL Playground
- 🩺 Health Check API

---

## 🛠️ Tech Stack

- **Backend:** Node.js, Express
- **GraphQL:** express-graphql, graphql
- **Database:** Sequelize ORM
- **Auth:** JWT, bcryptjs
- **Logging:** Morgan
- **Env Management:** dotenv

---

## 📁 Project Structure

```bash
project-root/
│
├── graphql/
│   ├── schema.js
│   └── resolvers.js
│
├── middleware/
│   └── auth.js
│
├── models/
│   ├── index.js
│   ├── user.js
│   └── contact.js
│
├── app.js
├── .env
└── package.json