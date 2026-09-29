# UniSphere – Project Technical Notes

## 1. Project Overview

- **Project Name**: UniSphere – Smart University Collaboration & Management Platform
- **Project Type**: Full-Stack MERN Single Page Application (SPA)
- **Architecture**: Decoupled Client-Server RESTful Architecture with Docker Containerization
- **Purpose**: A centralized university platform connecting Students, Faculty, and Administration for academic notes distribution, campus event management, lost & found item tracking, and student peer-to-peer discussion broadcasting.

---

## 2. Actual Tech Stack

### Frontend
- **React.js (v19)** — Component-based library used to build the responsive user interface.
- **React Router (v7)** — Client-side router handling declarative navigation and protected layouts without page reloads.
- **Tailwind CSS (v4)** — Utility-first CSS framework for modern dark-themed glassmorphism styling.
- **Axios** — Promise-based HTTP client handling asynchronous REST API requests with credentials.
- **Context API (`AuthContext`)** — Global state container managing user session, loading, login, and logout states.
- **Lucide React** — Modern vector icon library.
- **Framer Motion** — Animation library for page transitions and interactive UI elements.
- **Vite (v8)** — Next-generation frontend build tool and dev server.

### Backend
- **Node.js (v20/22)** — Asynchronous event-driven JavaScript runtime environment.
- **Express.js (v5)** — Backend web framework routing HTTP requests, middleware pipelines, and controllers.
- **CORS** — Cross-Origin Resource Sharing middleware enabling safe cookie credentials transfer.
- **Cookie Parser** — Middleware parsing incoming request cookies into `req.cookies`.
- **dotenv** — Environment variable manager for sensitive configuration parameters.

### Database
- **MongoDB (Atlas / Local)** — NoSQL document database storing JSON-like documents.
- **Mongoose (v9)** — Object Data Modeling (ODM) library enforcing schemas, data validation, and queries.

### Authentication
- **JSON Web Token (JWT)** — Signed tokens stored inside `HttpOnly`, `SameSite: Lax` cookies for secure session tracking.
- **bcryptjs** — 10-round salted password hashing library for secure credential storage.

### File Storage
- **Multer** — Multipart form-data middleware handling PDF notes, lost & found photos, profile pictures, and broadcast attachments. Local disk storage served via Express static routing (`uploads/`).

### Email
- **Nodemailer** — Node.js module dispatching verification OTPs and temporary faculty passwords over Gmail SMTP.

### Development Tools
- **Git & GitHub** — Distributed version control and source code management.
- **Nodemon** — Automatic server restarter during backend development.
- **oxlint** — Ultra-fast JavaScript/React code linter.

### Deployment & Infrastructure
- **Docker** — Containerization platform packaging frontend and backend services into isolated lightweight containers.
- **Docker Compose** — Multi-container orchestration tool running frontend and backend services together.
- **Nginx** — High-performance web server used inside the frontend container to serve Vite static build assets and handle SPA routing fallbacks (`try_files $uri $uri/ /index.html`).

---

## 3. Architecture

```
                    ┌──────────────────────────────────────────────┐
                    │            Client Browser (User UI)          │
                    └──────────────────────┬───────────────────────┘
                                           │  HTTP REST Requests (JSON / FormData)
                                           │  + HTTP-Only JWT Cookie
                                           ▼
                    ┌──────────────────────────────────────────────┐
                    │               Nginx Container                │
                    │         (Frontend Docker - Port 80)          │
                    │        Serves Vite Static React Build        │
                    └──────────────────────┬───────────────────────┘
                                           │  API Request Proxy / Cross-Origin Call
                                           ▼
                    ┌──────────────────────────────────────────────┐
                    │              Express.js Backend              │
                    │        (Node Docker - Port 5000)             │
                    │  (Middlewares → Controllers → Services)      │
                    └──────────────────────┬───────────────────────┘
                                           │
                        ┌──────────────────┴──────────────────┐
                        │                                     │
                        ▼                                     ▼
     ┌────────────────────────────────────┐    ┌──────────────────────────────────┐
     │       Mongoose / MongoDB Atlas     │    │      Docker Uploads Volume       │
     │   (Database Cloud/Local Storage)   │    │  (Persistent /app/uploads Mount) │
     └────────────────────────────────────┘    └──────────────────────────────────┘
```

---

## 4. Folder Structure

```
Saanjh/
├── docker-compose.yml          # Multi-container orchestration config
├── .env.example                # Safe environment variable placeholders template
├── Notes.md                    # Project technical documentation
├── about_project.md            # Developer handover reference document
├── Backend/
│   ├── Dockerfile              # Production Node 20 Alpine container build recipe
│   ├── .dockerignore           # Files ignored during backend container build
│   ├── .env                    # Real server secrets (JWT, DB URI, Email)
│   ├── package.json            # Node.js backend dependencies & start scripts
│   └── src/
│       ├── app.js              # Express app setup, CORS, cookieParser & static routing
│       ├── server.js           # Server entry point, DB connector & listener
│       ├── config/db.js        # Mongoose MongoDB connection & admin auto-seeding
│       ├── controllers/        # Business logic handlers (auth, note, event, lostFound, broadcast)
│       ├── models/             # Mongoose schemas (User, Note, Event, LostFound, BroadcastPost, BroadcastComment)
│       ├── routes/             # Express API route endpoints
│       ├── middlewares/        # Auth, role authorization, and Multer upload configurations
│       ├── services/           # Nodemailer email dispatch service (sendOTPEmail, sendFacultyCredentialsEmail)
│       └── utils/              # Token generation (generateToken.js) & OTP generator (generateOTP.js)
└── frontend/
    ├── Dockerfile              # Multi-stage build (Node Vite build → Nginx Alpine serve)
    ├── nginx.conf              # Nginx server configuration with SPA routing fallback
    ├── .dockerignore           # Files ignored during frontend container build
    ├── package.json            # React frontend dependencies & Vite scripts
    ├── vite.config.js          # Vite bundler configuration
    └── src/
        ├── App.jsx             # Root component
        ├── main.jsx            # Entry point initializing BrowserRouter & AuthProvider
        ├── api/                # Centralized Axios API wrappers (authApi, noteApi, eventApi, lostFoundApi, broadcastApi)
        ├── components/         # Reusable UI elements (auth, common, landing, layout, notes)
        ├── context/            # AuthContext.jsx managing global session state
        ├── layouts/            # Master layout shells (StudentLayout, FacultyLayout, AdminLayout)
        ├── pages/              # View pages (auth, student, faculty, admin, shared, LostFound)
        └── routes/             # AppRoutes, ProtectedRoute (RBAC guard), PublicRoute
```

---

## 5. Authentication Flow

1. **Student Registration**:
   - Student enters `@chitkarauniversity.edu.in` email (`POST /api/auth/send-otp`).
   - Server generates 6-digit OTP, stores bcrypt-hashed OTP in DB, and sends email via Nodemailer.
   - Student submits OTP (`POST /api/auth/verify-otp`). Backend verifies code and expiration window (5 minutes).
   - Student submits password & profile details (`POST /api/auth/register`). Password is salted and hashed via Mongoose pre-save hook.
2. **Faculty Provisioning**:
   - Admin creates account (`POST /api/auth/create-faculty`). Server generates temporary password (`Faculty@XXXX`) and emails credentials via Nodemailer.
   - On first login, `mustChangePassword === true` triggers mandatory redirect to `/faculty/change-password`.
3. **Login & Session Management**:
   - User submits credentials (`POST /api/auth/login`). Server verifies email and bcrypt password match.
   - Backend generates signed JWT and attaches it to response as an `HttpOnly`, `SameSite: Lax` cookie.
   - Subsequent client requests automatically include the cookie, verified by `protect` middleware.
   - Logged-in user session details fetched via `GET /api/auth/me`.
   - Logout (`POST /api/auth/logout`) clears the HTTP-Only cookie.

---

## 6. Database Models

| Model | Purpose | Important Fields | Relationships |
|-------|---------|------------------|---------------|
| **User** | User account storage | `name`, `email`, `password`, `role`, `department`, `semester`, `profilePic`, `bio`, `phone`, `isVerified`, `mustChangePassword`, `otpHash`, `otpExpiry` | Primary user identity for all entities |
| **Note** | PDF study material metadata | `title`, `subject`, `department`, `semester`, `description`, `fileUrl`, `uploadedBy`, `downloads` | `uploadedBy` references `User` |
| **Event** | Campus event details & registrations | `title`, `description`, `category`, `department`, `venue`, `date`, `time`, `registrationDeadline`, `maxParticipants`, `poster`, `circular`, `createdBy`, `registeredStudents` | `createdBy` ref `User`, `registeredStudents` array ref `User` |
| **LostFound** | Lost and found reports | `owner`, `type`, `itemName`, `category`, `description`, `location`, `date`, `images`, `status`, `phone`, `claimedBy` | `owner` ref `User`, `claimedBy` ref `User` |
| **BroadcastPost** | Student discussion posts | `author`, `title`, `category`, `description`, `attachment`, `commentCount` | `author` ref `User` |
| **BroadcastComment** | Threaded comments & replies | `post`, `author`, `parentComment`, `content` | `post` ref `BroadcastPost`, `author` ref `User`, `parentComment` ref `BroadcastComment` |

---

## 7. API Structure

| Method | Endpoint | Purpose | Authorization |
|--------|----------|---------|---------------|
| `POST` | `/api/auth/send-otp` | Request student registration OTP | Public |
| `POST` | `/api/auth/verify-otp` | Verify 6-digit OTP code | Public |
| `POST` | `/api/auth/register` | Complete student account registration | Public |
| `POST` | `/api/auth/login` | Authenticate user & issue JWT cookie | Public |
| `POST` | `/api/auth/forgot-password/send-otp` | Send password reset OTP | Public |
| `POST` | `/api/auth/forgot-password/verify-otp` | Verify password reset OTP | Public |
| `POST` | `/api/auth/forgot-password/reset` | Reset account password | Public |
| `GET` | `/api/auth/me` | Get active authenticated user details | Authenticated |
| `POST` | `/api/auth/logout` | Clear auth cookie and end session | Authenticated |
| `PUT` | `/api/auth/profile` | Update profile information & picture | Authenticated |
| `POST` | `/api/auth/change-password` | Change user password | Authenticated |
| `POST` | `/api/auth/create-faculty` | Provision faculty account & email credentials | Admin Only |
| `GET` | `/api/auth/faculties` | Fetch registered faculty members | Admin Only |
| `GET` | `/api/auth/students` | Fetch registered students list | Admin Only |
| `GET` | `/api/notes` | Get published study notes | Authenticated |
| `GET` | `/api/notes/my-notes` | Get faculty member's uploaded notes | Faculty Only |
| `POST` | `/api/notes/upload` | Upload PDF study note file | Faculty Only |
| `GET` | `/api/notes/:id` | Get note details | Authenticated |
| `PATCH` | `/api/notes/:id` | Edit note metadata | Faculty/Admin |
| `DELETE` | `/api/notes/:id` | Delete note & file reference | Faculty/Admin |
| `GET` | `/api/events` | Get all campus events | Authenticated |
| `POST` | `/api/events` | Create new event with poster/circular | Faculty/Admin |
| `GET` | `/api/events/:id` | Get event details & registered list | Authenticated |
| `PATCH` | `/api/events/:id` | Update event details | Faculty/Admin |
| `DELETE` | `/api/events/:id` | Delete campus event | Faculty/Admin |
| `POST` | `/api/events/:id/register` | Register student for event | Student Only |
| `DELETE` | `/api/events/:id/register` | Cancel event seat reservation | Student Only |
| `GET` | `/api/events/:id/students` | Get registered students roster | Faculty/Admin |
| `GET` | `/api/lost-found` | Get lost & found items list | Authenticated |
| `POST` | `/api/lost-found` | Create lost or found report | Authenticated |
| `GET` | `/api/lost-found/:id` | Get single report details | Authenticated |
| `PATCH` | `/api/lost-found/:id` | Update item report details | Owner/Admin |
| `DELETE` | `/api/lost-found/:id` | Delete item report | Owner/Admin |
| `PATCH` | `/api/lost-found/:id/claim` | Submit claim for lost item | Authenticated |
| `PATCH` | `/api/lost-found/:id/resolve` | Mark report as resolved | Owner Only |
| `GET` | `/api/broadcast` | Get broadcast posts (search/filter/sort) | Authenticated |
| `POST` | `/api/broadcast` | Create broadcast discussion post | Student Only |
| `GET` | `/api/broadcast/:id` | Get post details and comment thread | Authenticated |
| `PATCH` | `/api/broadcast/:id` | Edit own broadcast post | Student Owner |
| `DELETE` | `/api/broadcast/:id` | Delete own broadcast post & comments | Student Owner |
| `POST` | `/api/broadcast/:id/comments` | Add top-level comment | Student Only |
| `POST` | `/api/broadcast/comments/:commentId/reply` | Reply to a comment | Student Only |
| `PATCH` | `/api/broadcast/comments/:commentId` | Edit own comment / reply | Student Owner |
| `DELETE` | `/api/broadcast/comments/:commentId` | Delete own comment / reply | Student Owner |

---

## 8. Implemented Features Breakdown

1. **Authentication & User Management**:
   - Purpose: University email validation (`@chitkarauniversity.edu.in`), OTP verification, multi-role access control.
   - Frontend: `Login.jsx`, `Register.jsx`, `ForgotPassword.jsx`, `AuthContext.jsx`.
   - Backend: `authController.js`, `authRoutes.js`, `emailService.js`.
   - Model: `User`.
2. **Notes Management**:
   - Purpose: Semester PDF notes sharing and downloading.
   - Frontend: `Notes.jsx`, `UploadNotes.jsx`, `MyNotes.jsx`, `noteApi.js`.
   - Backend: `noteController.js`, `noteRoutes.js`, `uploadMiddleware.js`.
   - Model: `Note`.
3. **Campus Events**:
   - Purpose: Event publishing, poster uploads, seat reservations.
   - Frontend: `Events.jsx`, `FacultyEvents.jsx`, `eventApi.js`.
   - Backend: `eventController.js`, `eventRoutes.js`, `eventPosterUpload.js`.
   - Model: `Event`.
4. **Lost & Found**:
   - Purpose: Reporting missing items with photos, claiming, and marking resolved.
   - Frontend: `LostFoundList.jsx`, `ReportItem.jsx`, `ItemDetails.jsx`, `lostFoundApi.js`.
   - Backend: `lostFoundController.js`, `lostFoundRoutes.js`, `lostFoundUpload.js`.
   - Model: `LostFound`.
5. **Student Broadcast**:
   - Purpose: Peer-to-peer Q&A and 2-tier threaded discussion board.
   - Frontend: `Broadcast.jsx`, `BroadcastPost.jsx`, `broadcastApi.js`.
   - Backend: `broadcastController.js`, `broadcastRoutes.js`, `broadcastUpload.js`.
   - Models: `BroadcastPost`, `BroadcastComment`.
6. **Admin Faculty Management**:
   - Purpose: Provisioning faculty accounts with temporary passwords.
   - Frontend: `FacultyManagement.jsx`, `StudentManagement.jsx`, `AdminDashboard.jsx`.
   - Backend: `authController.js` (`createFaculty`, `getFaculties`, `getStudents`).
   - Model: `User`.

---

## 9. Security

- **Password Hashing**: Passwords stored using `bcryptjs` 10-round salt hash via Mongoose pre-save hooks.
- **JWT HTTP-Only Cookies**: Signed JWT tokens stored in `HttpOnly`, `SameSite: Lax` cookies preventing XSS token theft.
- **Protected Routes & RBAC**: `protect` middleware verifies JWT cookie and `authorize(...roles)` enforces role permissions.
- **Resource Ownership Authorization**: Backend controllers verify `resource.author.toString() === req.user._id.toString()` before PATCH/DELETE operations.
- **University Email Restriction**: Registration strictly restricts domain suffix to `@chitkarauniversity.edu.in`.
- **OTP Verification**: 6-digit hashed OTP with 5-minute expiration window.
- **CORS Protection**: Restricted to configured whitelist origins with `credentials: true`.
- **Environment Variables**: Sensitive credentials managed via `.env` files kept out of version control.

---

## 10. Docker Configuration & Management

### Docker Architecture

- **Frontend Container**: Nginx Alpine image serving Vite React static build assets (`dist/`) on port 80 with SPA client routing fallback (`try_files $uri $uri/ /index.html;`).
- **Backend Container**: Node 20 Alpine container running production server (`node src/server.js`) on port 5000.
- **Uploads Volume**: Docker named volume (`backend-uploads`) mapped to `/app/uploads` ensuring uploaded files persist across container restarts.
- **Database**: MongoDB Atlas cloud cluster connected securely via `MONGO_URI`.

### Docker Files Present
- `Backend/Dockerfile` — Production Node 20 Alpine container recipe for backend.
- `Backend/.dockerignore` — Ignores `node_modules`, `.env`, and temporary build files.
- `frontend/Dockerfile` — Multi-stage build recipe (Vite build → Nginx serve).
- `frontend/nginx.conf` — Nginx server config for static asset delivery and SPA routing.
- `frontend/.dockerignore` — Ignores `node_modules`, `.env`, and `dist`.
- `docker-compose.yml` — Root orchestration file coordinating frontend and backend services.
- `.env.example` — Safe environment variable placeholders template.

### Management Commands

- **Build and Start Containers**:
  ```bash
  docker compose build
  docker compose up -d
  ```

- **Stop Containers**:
  ```bash
  docker compose down
  ```

- **View Logs**:
  ```bash
  docker compose logs -f
  ```

- **Rebuild and Restart**:
  ```bash
  docker compose up -d --build
  ```

---

## 11. Environment Variables

| Variable Name | Description | Excluded from Source Control |
|---------------|-------------|------------------------------|
| `PORT` | Backend server port (Default: 5000) | Yes |
| `MONGO_URI` | MongoDB Atlas / Local connection string | Yes |
| `JWT_SECRET` | Secret key used to sign JWT authentication cookies | Yes |
| `EMAIL_USER` | Gmail address for sending Nodemailer emails | Yes |
| `EMAIL_PASS` | Gmail App Password for SMTP authentication | Yes |
| `CLIENT_URL` | Frontend origin URL for CORS validation (e.g. http://localhost:80) | Yes |

---

## 12. Frontend Routing

All routes declared in `frontend/src/routes/AppRoutes.jsx`:

- **Public Routes**: `/`, `/login`, `/register`, `/forgot-password`
- **Forced Faculty Password Change**: `/faculty/change-password`
- **Student Layout Routes** (`ProtectedRoute: ["student"]`):
  - `/student` (Dashboard)
  - `/student/broadcast` (Broadcast List)
  - `/student/broadcast/:id` (Broadcast Post & Comments)
  - `/student/notes` (Study Notes)
  - `/student/events` (Events)
  - `/student/lost-found` (Lost & Found List)
  - `/student/lost-found/report` (Report Item)
  - `/student/lost-found/:id` (Item Details)
  - `/student/profile` (Profile)
- **Faculty Layout Routes** (`ProtectedRoute: ["faculty"]`):
  - `/faculty` (Dashboard)
  - `/faculty/upload-notes` (Upload Note)
  - `/faculty/my-notes` (My Notes)
  - `/faculty/events` (Faculty Events)
  - `/faculty/lost-found`, `/faculty/lost-found/report`, `/faculty/lost-found/:id`
  - `/faculty/profile` (Profile)
- **Admin Layout Routes** (`ProtectedRoute: ["admin"]`):
  - `/admin` (Dashboard)
  - `/admin/faculty` (Faculty Management)
  - `/admin/students` (Student Management)
  - `/admin/notes`, `/admin/events`, `/admin/lost-found`, `/admin/lost-found/:id`

---

## 13. Backend Middleware

- `authMiddleware.js` (`protect`) — Decodes JWT token from `req.cookies.token` and attaches authenticated user to `req.user`.
- `roleMiddleware.js` (`authorize(...roles)`) — Validates `req.user.role` against allowed roles array, returning `403 Forbidden` if unauthorized.
- `uploadMiddleware.js` — Multer instance configured for PDF study notes uploads into `uploads/notes/`.
- `imageUploadMiddleware.js` — Multer instance for profile avatar uploads into `uploads/profiles/`.
- `eventPosterUpload.js` — Multer instance for event posters and circular PDFs into `uploads/events/`.
- `lostFoundUpload.js` — Multer instance for lost & found item images into `uploads/lost-found/`.
- `broadcastUpload.js` — Multer instance for broadcast discussion attachments into `uploads/broadcast/`.
- `cors` — Cross-Origin Resource Sharing handling allowed origin validation and credentials header.
- `cookieParser` — Parses HTTP request headers and populates `req.cookies`.

---

## 14. File Upload Flow

```
User selects file in React UI
       ↓
FormData constructed with file binary
       ↓
Axios POST/PATCH request sent with `withCredentials: true`
       ↓
`protect` & `authorize` middlewares validate JWT & user role
       ↓
Multer middleware validates file mimetype/size and saves file to `uploads/<module>/`
       ↓
Controller stores relative path (e.g. `uploads/notes/12345.pdf`) in MongoDB document
       ↓
Express serves file statically (`app.use("/uploads", express.static("uploads"))`)
       ↓
Frontend renders image / PDF preview link via backend URL (`http://localhost:5000/uploads/...`)
```

---

## 15. Viva / Interview Quick Answers

- **What is React?** A component-based JavaScript frontend library used for rendering declarative, dynamic single-page applications.
- **What is Node.js?** An open-source, cross-platform JavaScript runtime environment executing JS code outside the browser.
- **What is Express?** A minimal, fast Node.js web framework for routing HTTP endpoints and constructing REST APIs.
- **What is MongoDB?** A flexible NoSQL document database storing data in JSON-like BSON format.
- **What is Mongoose?** An Object Data Modeling (ODM) library for MongoDB providing schema validation, type casting, and query building.
- **What is JWT?** A compact, URL-safe means of representing claims between two parties, signed with a secret key for session tracking.
- **What is bcrypt?** A password-hashing algorithm utilizing salt rounds to securely hash plain text passwords.
- **What is Axios?** A Promise-based HTTP client for the browser and Node.js used to send API requests.
- **What is Multer?** A Node.js middleware for handling `multipart/form-data` used for uploading files.
- **What is Nodemailer?** A module for Node.js applications allowing easy email sending via SMTP.
- **What is CORS?** Cross-Origin Resource Sharing, a browser security feature controlling how resources are requested from different origins.
- **What is Docker?** A platform that packages applications and dependencies into standardized containers.
- **What is Docker Compose?** A tool for defining and running multi-container Docker applications via YAML files.
- **What is Nginx?** A high-performance HTTP web server used to serve static frontend builds and handle SPA client routing.

---

## 16. Feature-Specific Viva Questions

- **Q: Why did you store JWT in HTTP-Only cookies instead of localStorage?**
  - *A*: Storing JWT in `HttpOnly` cookies prevents client-side JavaScript from reading the token via `document.cookie`, completely eliminating XSS token theft.
- **Q: How does the OTP verification workflow work?**
  - *A*: When a student enters their university email, the server generates a 6-digit OTP, stores a bcrypt hash of the OTP in MongoDB with a 5-minute expiry, and emails the code using Nodemailer. Upon submission, the server compares the submitted OTP against the stored hash.
- **Q: How does Nginx handle React Router routes in Docker?**
  - *A*: Nginx is configured with `try_files $uri $uri/ /index.html;`. When a user reloads `/student/broadcast` directly, Nginx falls back to serving `index.html`, allowing React Router to parse the client path cleanly without returning a 404 error.
- **Q: How are uploaded files kept safe across container restarts?**
  - *A*: A Docker named volume (`backend-uploads`) is mounted to `/app/uploads` inside the backend container, persisting uploaded files on the host system regardless of container rebuilds.

---

## 17. Implemented vs Planned Features

### Implemented Features ✅
- Student OTP Email Verification & Account Registration (`@chitkarauniversity.edu.in`)
- Multi-Role JWT Cookie Authentication & Authorization Guards (Student, Faculty, Admin)
- Forced First-Login Faculty Password Change (`mustChangePassword`)
- Profile Management & Profile Picture Uploads
- PDF Study Notes Upload, Filter, Preview, & Download
- Campus Events Creation, Poster Uploads, & Seat Reservations
- Lost & Found Item Reporting, Image Uploads, Claiming, & Resolving
- Student Broadcast Discussion Board with Categories, Search, Sorting, & Threaded Comments
- Admin Provisioning of Faculty Accounts & Student Roster Management
- Dockerization (Frontend Nginx SPA Container, Backend Node Container, Persistent Uploads Volume)

### Planned / Future Roadmap Features 🔮
- **Cloudinary Storage**: Migrating local disk uploads to Cloudinary cloud CDN storage.
- **Real-Time WebSockets Chat**: 1-on-1 private messaging between Students and Faculty.
- **Club Management Module**: Club registrations, admin approvals, society events, and member memberships.
- **Full Announcements CRUD API**: Dedicated announcements management controller and push notifications.
