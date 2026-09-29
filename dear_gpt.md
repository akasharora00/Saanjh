# Dear GPT — UniSphere Project Context & Developer Handover

> **Message for Future AI Assistant**:
> If a developer opens a new conversation with you and provides this file, use this document as the single authoritative source of truth regarding project context, architecture, database schemas, API routes, design decisions, and strict guidelines.

---

## 1. Project Identity

- **Project Name**: UniSphere — Smart University Collaboration & Management Platform
- **Former Name**: Saanjh (Legacy workspace folder name preserved for repository stability)
- **Primary Institution Domain**: `chitkarauniversity.edu.in` / `@chitkara.edu.in`

---

## 2. Project Purpose

UniSphere is an integrated academic and campus management platform designed for university students, faculty members, and administrators. It consolidates academic note sharing, campus event organization, peer-to-peer discussion boards (Student Broadcast), lost and found asset tracking, and role-based user management into a unified responsive web application.

---

## 3. System Architecture Overview

- **Architecture Pattern**: Decoupled MERN SPA (Single Page Application) with RESTful API backend.
- **Frontend Layer**: React 19 + Vite 8 SPA styled with Tailwind CSS v4, Lucide React icons, and Framer Motion animations.
- **Backend Layer**: Node.js 20 runtime with Express 5 REST API using ES Modules (`import`/`export`).
- **Database Layer**: MongoDB via Mongoose 9 ODM. Primary connection targets MongoDB Atlas cloud cluster with automated connection string repair and local MongoDB fallback (`mongodb://127.0.0.1:27017/unisphere`).
- **Authentication**: Dual JWT authentication strategy (HttpOnly Cookie `jwt` + Bearer token header fallback). Passwords hashed using `bcryptjs` (10 salt rounds). Email verification via 6-digit OTP sent through `Nodemailer`.
- **File Storage**: Local disk storage under `Backend/uploads/` (serves static uploads via `/uploads/` route) using `Multer`. Persistent volume `backend-uploads` in Docker.
- **Containerization**: Multi-container Docker deployment using `docker-compose` (Node 20 Alpine backend container + Multi-stage Node/Nginx Alpine frontend container).

---

## 4. Actual Installed Tech Stack

### Frontend
- **Framework**: React 19.0.0 + React Router 7.2.0
- **Build Tool**: Vite 8.0.0
- **Styling**: Tailwind CSS 4.0.9 + `@tailwindcss/vite`
- **HTTP Client**: Axios 1.7.9 (`withCredentials: true`)
- **UI Components & Icons**: Lucide React 0.475.0, Framer Motion 12.4.7
- **Notifications**: React Hot Toast 2.5.2

### Backend
- **Runtime**: Node.js (v20+ recommended)
- **Framework**: Express 5.0.1
- **Database ODM**: Mongoose 9.0.0
- **Security & Auth**: JsonWebToken 9.0.2, Bcryptjs 3.0.2, Cookie-Parser 1.4.7, CORS 2.8.5
- **File Processing**: Multer 1.4.5-lts.1
- **Email Delivery**: Nodemailer 6.10.0
- **Environment**: Dotenv 16.4.7

---

## 5. Directory Structure

```
Saanjh/
├── .env.example
├── docker-compose.yml
├── Notes.md
├── about_project.md
├── project_workflow.md
├── dear_gpt.md
├── Backend/
│   ├── .dockerignore
│   ├── .env.example
│   ├── Dockerfile
│   ├── package.json
│   ├── uploads/
│   └── src/
│       ├── app.js
│       ├── server.js
│       ├── config/
│       │   └── db.js
│       ├── controllers/
│       │   ├── authController.js
│       │   ├── broadcastController.js
│       │   ├── eventController.js
│       │   ├── lostFoundController.js
│       │   └── noteController.js
│       ├── middlewares/
│       │   ├── authMiddleware.js
│       │   ├── broadcastUpload.js
│       │   ├── eventPosterUpload.js
│       │   ├── imageUploadMiddleware.js
│       │   ├── lostFoundUpload.js
│       │   ├── roleMiddleware.js
│       │   └── uploadMiddleware.js
│       ├── models/
│       │   ├── BroadcastComment.js
│       │   ├── BroadcastPost.js
│       │   ├── Event.js
│       │   ├── LostFound.js
│       │   ├── Note.js
│       │   └── User.js
│       ├── routes/
│       │   ├── authRoutes.js
│       │   ├── broadcastRoutes.js
│       │   ├── eventRoutes.js
│       │   ├── lostFoundRoutes.js
│       │   └── noteRoutes.js
│       ├── services/
│       │   └── emailService.js
│       └── utils/
│           ├── generateOTP.js
│           └── generateToken.js
└── frontend/
    ├── .dockerignore
    ├── Dockerfile
    ├── nginx.conf
    ├── package.json
    ├── vite.config.js
    └── src/
        ├── App.jsx
        ├── main.jsx
        ├── api/
        │   ├── axios.js
        │   ├── authApi.js
        │   ├── broadcastApi.js
        │   ├── eventApi.js
        │   ├── lostFoundApi.js
        │   └── noteApi.js
        ├── components/
        │   ├── auth/
        │   ├── common/
        │   ├── landing/
        │   ├── layout/
        │   └── notes/
        ├── context/
        │   └── AuthContext.jsx
        ├── layouts/
        │   ├── AdminLayout.jsx
        │   ├── FacultyLayout.jsx
        │   └── StudentLayout.jsx
        ├── pages/
        │   ├── LostFound/
        │   ├── admin/
        │   ├── auth/
        │   ├── faculty/
        │   ├── shared/
        │   └── student/
        └── routes/
            ├── AppRoutes.jsx
            ├── ProtectedRoute.jsx
            └── PublicRoute.jsx
```

---

## 6. User Roles & Access Control

1. **Student** (`role: "student"`):
   - Access to `/student/*` routes.
   - Can view notes, RSVP events, report/view lost-found items, post and reply in Student Broadcast.
2. **Faculty** (`role: "faculty"`):
   - Access to `/faculty/*` routes.
   - Can upload and manage academic notes, post university events, view lost-found items. Forced password change on initial login.
3. **Admin** (`role: "admin"`):
   - Access to `/admin/*` routes.
   - System administration, provision faculty accounts, manage student accounts, audit overall platform. Auto-seeded default admin: `admin@chitkarauniversity.edu.in`.

---

## 7. Database Schemas Overview

- **User**: `name`, `email` (unique), `password` (hashed), `role` (enum: student/faculty/admin), `department`, `semester`, `phone`, `isVerified` (boolean), `otp`, `otpExpires`, `isMustChangePassword` (boolean).
- **Note**: `title`, `subject`, `department`, `semester`, `description`, `fileUrl`, `uploadedBy` (ref User).
- **Event**: `title`, `description`, `category`, `date`, `time`, `location`, `posterUrl`, `createdBy` (ref User), `organizer`.
- **LostFound**: `title`, `category` (enum: Lost/Found), `itemType`, `date`, `location`, `description`, `contactPhone`, `imageUrl`, `reportedBy` (ref User).
- **BroadcastPost**: `author` (ref User), `title`, `category`, `description`, `attachment`, `commentCount`.
- **BroadcastComment**: `post` (ref BroadcastPost), `author` (ref User), `parentComment` (ref BroadcastComment), `content`.

---

## 8. Essential API Registry

- `/api/auth`: `POST /register`, `POST /verify-otp`, `POST /resend-otp`, `POST /login`, `POST /logout`, `GET /me`, `PUT /profile`, `POST /forgot-password`, `POST /reset-password`, `POST /change-password`, `POST /create-faculty`, `GET /faculty`, `DELETE /faculty/:id`, `GET /students`, `PATCH /students/:id/status`.
- `/api/notes`: `POST /` (upload), `GET /`, `GET /my-notes`, `GET /:id`, `PATCH /:id`, `DELETE /:id`.
- `/api/events`: `POST /` (create), `GET /`, `GET /:id`, `PUT /:id`, `DELETE /:id`.
- `/api/lost-found`: `POST /` (report), `GET /`, `GET /:id`, `PATCH /:id`, `DELETE /:id`.
- `/api/broadcast`: `POST /` (create post), `GET /` (list posts with search/filter/sort), `GET /:id` (post details & nested comments), `PATCH /:id`, `DELETE /:id`, `POST /:id/comments`, `POST /comments/:commentId/reply`, `PATCH /comments/:commentId`, `DELETE /comments/:commentId`.

---

## 9. Feature Implementation Status Classification

| Feature Module | Status | Notes |
| :--- | :--- | :--- |
| **Authentication & Authorization** | `WORKING` | Email OTP, JWT cookies, role guards fully functional. |
| **Academic Notes Management** | `WORKING` | Faculty upload PDF, student browse/search/download. |
| **Event Management** | `WORKING` | Event listing, faculty post creation with poster images. |
| **Lost & Found Tracker** | `WORKING` | Item reporting, photo attachment, status filters. |
| **Student Broadcast (Discussion Board)** | `WORKING` | Posts, threaded comments, replies, search, filter, inline updates. |
| **Admin Control Panel** | `WORKING` | Faculty provisioning & student account management. |
| **Real-time Chat Socket System** | `PLANNED` | Planned for future socket.io integration. |
| **Student Clubs Directory** | `PLANNED` | Planned for future release. |

---

## 10. Important Architectural Rules & Decisions

1. **SPA Routing**: React Router v7 routes MUST be served via Nginx `try_files $uri $uri/ /index.html;` in Docker so direct page reloads do not trigger 404s.
2. **CORS & Credentials**: `cors({ origin: allowedOrigins, credentials: true })` MUST match exact frontend origins; wildcard `*` is strictly forbidden when sending cookies.
3. **No Forced Browser Reloads**: UI state updates (such as submitting broadcast posts or navigating between routes) MUST be handled via React state and React Router navigation. NEVER introduce `window.location.reload()`.
4. **Local Disk Storage**: Files uploaded via Multer are stored in `Backend/uploads/`. Persistent volume `backend-uploads:/app/uploads` is mounted in Docker Compose.
5. **MongoDB Connection Resiliency**: Connection logic in `Backend/src/config/db.js` handles Atlas SRV domain fixes and automatically falls back to local MongoDB on port 27017 if campus firewalls block port 27017.

---

## 11. Environment Variables Template

```env
# Server
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# Database
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/unisphere?retryWrites=true&w=majority

# Security
JWT_SECRET=your_super_secret_jwt_key_unisphere
JWT_EXPIRE=7d

# Email / OTP
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password
```

---

## 12. Instructions for Future GPT Assistants

When working on this codebase:
1. **Inspect Before Changing**: Always check existing frontend components and backend controllers before modifying APIs or data schemas.
2. **Do Not Invent APIs/Features**: Only use existing API routes documented here or implement user-requested features cleanly following current patterns.
3. **Preserve Architecture**: Keep ES Modules in backend (`import/export`), keep React Router v7 structure, keep Tailwind CSS styling conventions.
4. **Check Full Data Pipeline**: When editing a feature, verify Frontend (`api/`, `pages/`) $\rightarrow$ Backend Route $\rightarrow$ Controller $\rightarrow$ Model.
5. **Never Expose Secrets**: Do not commit real passwords, API keys, or JWT secrets in code or documentation.
6. **Prefer Root Cause Fixes**: Fix underlying logic or state issues rather than wrapping code in artificial workarounds or browser reloads.
