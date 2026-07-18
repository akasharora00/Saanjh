# Version 1

## Week 1
- Backend Setup
- MongoDB
- Authentication
- Frontend Setup
- Role Based Login


## Week 2
- Dashboard
- Notes Module


## Week 3
- Events
- Announcements


## Week 4
Testing
Deployment
PPT
Documentation


# Version 2
- Assignments
- Attendance
- Timetable

# Version 3
- Chat
- Clubs
- Student Directory

# Version 4
- AI Assistant
- Resume Review
- Quiz Generator
- Study Planner

# Version 5
- Placement Portal
- Lost & Found
- Notifications


Step 1:

POST /register
    ↓
Validate Input
    ↓
Check Email Exists
    ↓
Hash Password
    ↓
Save User
    ↓
Generate JWT
    ↓
Send Cookie
    ↓
Response


# multer : 
Multer is a Node.js middleware used with Express.js to handle file uploads from the client, such as images, PDFs, videos, or documents.

Normally, express.json() can only handle JSON data. If a user uploads a file, the request is sent as multipart/form-data, which Express cannot process by itself. Multer parses this data and makes the uploaded files available in your backend.