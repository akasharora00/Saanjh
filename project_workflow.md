# UniSphere — Complete Project Workflow & System Data Flows

This document details the end-to-end operational workflows and data flow pipelines for **UniSphere – Smart University Collaboration & Management Platform**.

---

## 1. Overall System Architecture

```
[ BROWSER / CLIENT ]
         │ (HTTP / HTTPS + JSON / FormData)
         ▼
[ FRONTEND SPA (Vite + React 19 + Tailwind CSS) ]
         │ (Axios Instance: withCredentials = true)
         ▼
[ BACKEND API (Express 5 Node.js Server on Port 5000 / Port 80 in Docker) ]
         │
    ├── [ CORS & Cookie Parser Middleware ]
    ├── [ Authentication Middleware (JWT in HttpOnly Cookie) ]
    ├── [ Authorization Middleware (Role Enforcement) ]
    ├── [ Multer Upload Middlewares ]
    └── [ Controllers ]
         │ (Mongoose Schema Models)
         ▼
[ MONGODB DATABASE (Atlas Cloud Cluster / Local Port 27017 Fallback) ]
```

---

## 2. User Registration Workflow

```
USER ACTION: Fills registration form with Name, Email, Password, Department, Semester, Phone.
         ↓
FRONTEND: Validates inputs locally (email domain verification) and calls `authApi.registerUser(formData)`.
         ↓
API: POST `/api/auth/register`
         ↓
BACKEND: `authController.register` receives request. Checks if user exists. Hashes password using bcrypt (10 rounds). Generates 6-digit OTP via `generateOTP()`. Saves pending user to database with `isVerified: false`. Sends OTP email via Nodemailer.
         ↓
DATABASE: User record created in `users` collection with `isVerified: false` and active `otp` + `otpExpires`.
         ↓
RESPONSE: `{ success: true, message: "Registration successful. Please verify OTP sent to your email." }`
         ↓
FRONTEND UPDATE: Transition to OTP verification step in Register UI modal/screen.
```

---

## 3. OTP Verification Workflow

```
USER ACTION: Inputs 6-digit OTP code received in email.
         ↓
FRONTEND: Sends email and 6-digit OTP via `authApi.verifyOTP({ email, otp })`.
         ↓
API: POST `/api/auth/verify-otp`
         ↓
BACKEND: `authController.verifyOTP` fetches user by email. Checks if OTP matches and `otpExpires > Date.now()`. Updates `isVerified: true`, clears OTP fields. Generates JWT token and sets `jwt` HttpOnly cookie.
         ↓
DATABASE: User document updated with `isVerified: true`, `otp: null`, `otpExpires: null`.
         ↓
RESPONSE: `{ success: true, message: "Email verified successfully.", user }` + `Set-Cookie: jwt=...`
         ↓
FRONTEND UPDATE: AuthContext updates state `user`, redirects student to `/student` dashboard.
```

---

## 4. Login Workflow

```
USER ACTION: Enters email and password on `/login` page.
         ↓
FRONTEND: Submits login request via `authApi.loginUser({ email, password })`.
         ↓
API: POST `/api/auth/login`
         ↓
BACKEND: `authController.login` checks email existence. Compares password via `bcrypt.compare()`. Verifies `user.isVerified === true`. Generates JWT containing `{ userId, role }`. Sets `jwt` HttpOnly cookie.
         ↓
DATABASE: User record queried for email and credentials matching.
         ↓
RESPONSE: `{ success: true, user: { _id, name, email, role, department, semester } }` + `Set-Cookie: jwt=...`
         ↓
FRONTEND UPDATE: AuthContext sets `user` state. AppRoutes redirects to role dashboard (`/student`, `/faculty`, or `/admin`).
```

---

## 5. JWT & Cookie Authentication Workflow

```
USER ACTION: Navigates around application or refreshes browser.
         ↓
FRONTEND: App loads `AuthContext` which issues background check `authApi.getMe()`. Axios attaches HttpOnly `jwt` cookie automatically (`withCredentials: true`).
         ↓
API: GET `/api/auth/me`
         ↓
BACKEND: `authMiddleware` extracts token from `req.cookies.jwt` or `Authorization: Bearer <token>`. Decodes token with `jwt.verify(token, JWT_SECRET)`. Fetches user from DB excluding password (`select("-password")`). Attaches user to `req.user`.
         ↓
DATABASE: User query by ID (`User.findById(decoded.userId)`).
         ↓
RESPONSE: `{ success: true, user }`
         ↓
FRONTEND UPDATE: `AuthContext` populates user state without requiring re-login. If invalid token, clears state and redirects to `/login`.
```

---

## 6. Protected Route Workflow

```
USER ACTION: Direct URL entry or link click to `/student/broadcast`, `/faculty/upload-notes`, or `/admin`.
         ↓
FRONTEND: React Router evaluates `AppRoutes.jsx` wrapper component `<ProtectedRoute allowedRoles={['student']}>`.
         ↓
FRONTEND EVALUATION: Checks `user` state from `AuthContext`.
  - If `loading`: Renders `BrandedLoader`.
  - If `!user`: Redirects to `/login`.
  - If `user.role` not in `allowedRoles`: Redirects to user's authorized home dashboard.
  - If authorized: Renders child layout and page component.
```

---

## 7. Student Workflow

- **Portal Base**: `/student`
- **Capabilities**:
  1. Access student home dashboard with announcement banners, quick metrics, and recent activity.
  2. Browse, search, filter, download academic notes uploaded by faculty (`/student/notes`).
  3. Explore university events, register/RSVP for events (`/student/events`).
  4. Participate in **Student Broadcast** discussion board (`/student/broadcast`): create doubts, share posts, post comments, reply to threads, edit/delete owned posts.
  5. Report lost items or search found campus items (`/student/lost-found`).
  6. View and update student profile details (`/student/profile`).

---

## 8. Faculty Workflow

- **Portal Base**: `/faculty`
- **Capabilities**:
  1. Access faculty dashboard with uploaded notes count, event management overview.
  2. Upload academic notes (PDF documents) tagged with department, subject, semester (`/faculty/upload-notes`).
  3. Manage owned notes (`/faculty/my-notes`) — edit details or delete notes.
  4. Post official campus events with banners (`/faculty/events`).
  5. Browse campus Lost & Found board.
  6. Manage faculty profile settings and initial mandatory password change (`/faculty/change-password`).

---

## 9. Admin Workflow

- **Portal Base**: `/admin`
- **Capabilities**:
  1. Overview university system metrics (total students, faculty, notes, events, system health).
  2. Faculty Management (`/admin/faculty`): Provision new faculty accounts with system credentials.
  3. Student Management (`/admin/students`): Search, inspect, activate, or deactivate student accounts.
  4. System Content Oversight: Audit academic notes, events, and lost & found reports across the university.

---

## 10. Notes Workflow

```
USER ACTION (Faculty): Fills note upload form (title, subject, department, semester, description, PDF file).
         ↓
FRONTEND: Builds `FormData` object and invokes `noteApi.uploadNote(formData)`.
         ↓
API: POST `/api/notes` (Multipart/form-data)
         ↓
BACKEND: `uploadMiddleware` (Multer) stores PDF in `uploads/`. `noteController.uploadNote` extracts path, title, subject, department, semester, author (`req.user._id`).
         ↓
DATABASE: Saves new document in `notes` collection.
         ↓
RESPONSE: `{ success: true, message: "Note uploaded successfully.", note }`
         ↓
FRONTEND UPDATE: `UploadNotes.jsx` notifies success and resets form; `Notes.jsx` displays newly listed note card.
```

---

## 11. Events Workflow

```
USER ACTION (Faculty/Admin): Creates event with title, description, category, date, time, location, poster image.
         ↓
FRONTEND: Submits form with poster image via `eventApi.createEvent(formData)`.
         ↓
API: POST `/api/events`
         ↓
BACKEND: `eventPosterUpload` (Multer) stores banner image in `uploads/events/`. `eventController.createEvent` saves event document.
         ↓
DATABASE: Created in `events` collection.
         ↓
RESPONSE: `{ success: true, message: "Event created successfully.", event }`
         ↓
FRONTEND UPDATE: Event feed (`/student/events`, `/faculty/events`) refetches or appends new event object seamlessly.
```

---

## 12. Broadcast Workflow (Discussion Board)

```
USER ACTION (Student): Posts academic doubt with optional attachment image/file.
         ↓
FRONTEND: Submits post data to `broadcastApi.createPost(formData)`.
         ↓
API: POST `/api/broadcast`
         ↓
BACKEND: `broadcastUpload` saves attachment to `uploads/broadcast/`. `broadcastController.createPost` creates post attached to `req.user._id`.
         ↓
DATABASE: Inserted into `broadcastposts` collection.
         ↓
RESPONSE: `{ success: true, message: "Post created successfully.", post }`
         ↓
FRONTEND UPDATE: State `posts` updated in-memory without page reload. User can click into thread `/student/broadcast/:id` to leave comments (`POST /api/broadcast/:id/comments`) or replies (`POST /api/broadcast/comments/:commentId/reply`), cascading comment counts automatically.
```

---

## 13. Lost & Found Workflow

```
USER ACTION: Student or Faculty reports a lost or found item with image, category, date, location.
         ↓
FRONTEND: Sends request via `lostFoundApi.createItem(formData)`.
         ↓
API: POST `/api/lost-found`
         ↓
BACKEND: `lostFoundUpload` processes image. `lostFoundController.createItem` sets status (`Lost` or `Found`), attaches reporter ID.
         ↓
DATABASE: Saved in `lostfounds` collection.
         ↓
RESPONSE: `{ success: true, item }`
         ↓
FRONTEND UPDATE: Item becomes searchable in `/student/lost-found` list with filter tabs for Lost vs Found.
```

---

## 14. File Upload Pipeline Workflow

```
[ FRONTEND FORM ] ──(FormData / multipart)──► [ EXPRESS MULTER MIDDLEWARE ]
                                                       │
                                          Creates destination directory if missing
                                          Generates unique timestamp filename
                                          Validates file extension / MIME type
                                                       │
                                                       ▼
                                         [ LOCAL DISK STORAGE: /app/uploads ]
                                         [ DOCKER VOLUME: backend-uploads ]
                                                       │
                                                       ▼
                                         [ EXPRESS STATIC ROUTE: /uploads ]
```

---

## 15. Docker Workflow

```
             ┌────────────────────────────────────────────────────────┐
             │                   DOCKER COMPOSE                       │
             │                                                        │
             │   ┌───────────────────┐        ┌───────────────────┐   │
             │   │ FRONTEND CONTAINER│        │ BACKEND CONTAINER │   │
             │   │                   │        │                   │   │
  HTTP :80   │   │  Nginx 1.25 Alpine│        │  Node 20 Alpine   │   │
 ───────────►│──►│  Serves /dist     │───────►│  Express Server   │   │
             │   │  SPA try_files    │ Proxy  │  Port 5000        │   │
             │   └───────────────────┘        └─────────┬─────────┘   │
             │                                          │             │
             └──────────────────────────────────────────┼─────────────┘
                                                        │
                                                        ▼
                                       [ MONGODB ATLAS / DOCKER HOST DB ]
```

---

## 16. Complete User Journey Maps

### Student Persona
1. Visit `/` landing page $\rightarrow$ Register at `/register` with `@chitkarauniversity.edu.in` email.
2. Enter OTP sent via email $\rightarrow$ Logged in & redirected to `/student`.
3. View recent announcements on Dashboard $\rightarrow$ Click Notes to download exam revisions.
4. Go to Broadcast $\rightarrow$ Ask a doubt about Data Structures $\rightarrow$ View replies from peers.
5. Check Lost & Found for misplaced ID card $\rightarrow$ Update profile settings.

### Faculty Persona
1. Login via `/login` using provisioned faculty credentials.
2. If first login, automatically prompted for mandatory password change `/faculty/change-password`.
3. Land on `/faculty` dashboard $\rightarrow$ Click Upload Notes.
4. Select PDF file, subject "Operating Systems", department "CSE", semester "4" $\rightarrow$ Submit.
5. Create university event banner for upcoming Hackathon in `/faculty/events`.

### Admin Persona
1. Login via `/login` with System Administrator credentials.
2. Land on `/admin` dashboard $\rightarrow$ Inspect total user statistics.
3. Access `/admin/faculty` $\rightarrow$ Provision new faculty account (auto-generates temporary password & hashes account).
4. Access `/admin/students` $\rightarrow$ Inspect student registrations & account status.
