# 🚀 The Notes App API (Microservices Architecture)

> A robust, enterprise-grade distributed system refactored from a monolithic architecture. This project demonstrates the **Database-per-Service** pattern, **API Gateway** implementation, and synchronous inter-service communication using Node.js, Express, and TypeScript.

---

## 🏗️ Architecture Overview

The application is split into three distinct domain services, unified by a single entry point (API Gateway).

| Service | Port | Responsibility | Database |
| :--- | :--- | :--- | :--- |
| **API Gateway** | `8000` | Unified Entry Point, Request Routing, Rate Limiting | N/A |
| **Auth Service** | `3001` | Registration, Login, JWT Issuance, Password Reset | `micro-auth-db` |
| **User Service** | `3002` | User Profiles (Bio, Avatar), Admin Management | `micro-user-db` |
| **Notes Service** | `3003` | Notes CRUD, Tagging, Archiving (Stateless Auth) | `micro-notes-db` |

---

## 🛠️ Tech Stack

* **Runtime:** Node.js
* **Language:** TypeScript
* **Framework:** Express.js
* **Database:** MongoDB Atlas (Multi-tenant cluster with logical database separation)
* **Communication:** Synchronous HTTP (Axios) via Internal Routes
* **Gateway:** `http-proxy-middleware`
* **Validation:** Zod
* **Security:** Helmet, HPP, CORS, JWT

---

## 📡 API Endpoints (Via Gateway)

All requests are made to port `8000`.

### 🔐 Auth Service
* `POST /api/auth/register` - Register a new user
* `POST /api/auth/login` - Login & receive JWT
* `POST /api/auth/forgot-password` - Request password reset email
* `PATCH /api/auth/reset-password/:token` - Set new password using token
* `PATCH /api/auth/update-password` - Update password (requires login)

### 👤 User Service
**Current User**
* `GET /api/users/me` - Get current profile
* `PATCH /api/users/update-me` - Update bio, avatar, or username
* `DELETE /api/users/delete-me` - Soft delete account

**Admin Operations**
* `GET /api/users` - Get all users
* `GET /api/users/:id` - Get specific user details
* `PATCH /api/users/:id` - Update a specific user
* `DELETE /api/users/:id` - Permanently delete a user

### 📒 Notes Service
* `GET /api/notes` - Get all notes (Supports pagination/filtering)
* `POST /api/notes` - Create a new note
* `GET /api/notes/:id` - Get a single note
* `PATCH /api/notes/:id` - Update a note
* `DELETE /api/notes/:id` - Delete a note