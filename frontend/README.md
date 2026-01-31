# 📇 Contact Management App (React + GraphQL)

A modern **Contact Management Web Application** built using **React**, **Apollo Client**, and **GraphQL** with secure authentication and protected routes.

This app allows users to **sign up, log in, and manage contacts** (add, edit, delete) using a clean and scalable GraphQL-based architecture.

---

## 🚀 Tech Stack

### Frontend
- React 18
- React Router DOM
- Apollo Client
- GraphQL
- JWT Authentication
- CSS

### Backend (Expected)
- Node.js
- Express
- GraphQL
- Sequelize ORM
- MySQL
- JWT Authentication Middleware

---

## ✨ Features

### 🔐 Authentication
- User Signup & Login
- JWT-based authentication
- Token stored in `localStorage`
- JWT token automatically attached to every GraphQL request
- Protected routes using a custom `PrivateRoute`

### 📞 Contact Management
- View all contacts
- Add a new contact
- Edit existing contacts
- Delete contacts
- Fetch a single contact by ID

### 🧠 GraphQL Advantages
- Single `/graphql` endpoint
- Typed queries and mutations
- No over-fetching or under-fetching
- Auto caching and smart re-rendering using Apollo Client

