# MyBlog — Full-Stack MERN Capstone Project

This is a full-stack blog application built with MongoDB, Express, React, and Node.js (MERN) as a Capstone Training Project.

### 🌐 Live Production Deployment
* **Website Link**: [blog-capstone-project-b45.vercel.app](https://blog-capstone-project-b45.vercel.app/)
* **Backend Host**: Render.com (Web Service)
* **Database Host**: MongoDB Atlas Cloud (Shared Tier)

It has two parts:
- **[Blog_Backend](file:///d:/MERN%20Training/BLOG/Blog_Backend)** (Node.js, Express, MongoDB)
- **[Blog_Frontend](file:///d:/MERN%20Training/BLOG/Blog_Frontend)** (React, Vite, Tailwind CSS)

## What this app does

- Users can register and login
- Authors can create, update, delete/restore their own articles
- Users can read articles and add comments
- Admin can view users/authors and block or activate them

## Tech used

Backend:
- Node.js
- Express
- MongoDB + Mongoose
- JWT + cookie based auth
- bcrypt

Frontend:
- React
- React Router
- Zustand (auth state)
- Axios
- Tailwind CSS

## Project structure

- Blog_Backend
  - APIs
  - Models
  - Middleware
  - config
  - server.js
- Blog_Frontend
  - src/Components
  - src/store
  - src/styles

## How to run

### 1. Backend

Go to backend folder:

```bash
cd Blog_Backend
```

Install packages:

```bash
npm install
```

Create .env file and add:

- PORT
- DB_URL
- SECRET_KEY
- CLOUDINARY_CLOUD_NAME
- CLOUDINARY_API_KEY
- CLOUDINARY_API_SECRET

Start backend:

```bash
node server.js
```

Backend runs on:
- http://localhost:5000

### 2. Frontend

Open new terminal and go to frontend folder:

```bash
cd Blog_Frontend
```

Install packages:

```bash
npm install
```

Run frontend:

```bash
npm run dev
```

Frontend runs on:
- http://localhost:5173

## Main API groups

- /common-api
  - register
  - login
  - logout
  - change password
- /user-api
  - read all active articles
  - add comment
- /author-api
  - create article
  - read own articles
  - update article
  - soft delete/restore article
- /admin-api
  - list users/authors
  - block/activate user or author

## Notes

- Auth is handled using JWT token in httpOnly cookie.
- Role based access is used in protected routes.
- Request sample files are available inside Blog_Backend folder.
