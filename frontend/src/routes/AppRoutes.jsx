import { Routes, Route } from "react-router-dom";

import Landing from "../pages/shared/Landing";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import NotFound from "../pages/shared/NotFound";

import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";

// Layouts
import StudentLayout from "../layouts/StudentLayout";
import FacultyLayout from "../layouts/FacultyLayout";
import AdminLayout from "../layouts/AdminLayout";

// Pages
import StudentDashboard from "../pages/student/Dashboard";
import Notes from "../pages/student/Notes";
import Events from "../pages/student/Events";
import Profile from "../pages/student/Profile";

import FacultyDashboard from "../pages/faculty/Dashboard";
import AdminDashboard from "../pages/admin/Dashboard";
import UploadNotes from "../pages/faculty/UploadNotes";
import MyNotes from "../pages/faculty/MyNotes";
import FacultyEvents from "../pages/faculty/Events";
import FacultyProfile from "../pages/faculty/Profile";

const AppRoutes = () => {
  return (
    <Routes>
      {/* ================= PUBLIC ROUTES ================= */}
      <Route path="/" element={<Landing />} />

      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />

      <Route
        path="/register"
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        }
      />

      {/* ================= STUDENT ROUTES ================= */}
      <Route
        path="/student"
        element={
          <ProtectedRoute allowedRoles={["student"]}>
            <StudentLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<StudentDashboard />} />
        <Route path="notes" element={<Notes />} />
        <Route path="events" element={<Events />} />
        <Route path="profile" element={<Profile />} />
      </Route>

      {/* ================= FACULTY ROUTES ================= */}
      <Route
        path="/faculty"
        element={
          <ProtectedRoute allowedRoles={["faculty"]}>
            <FacultyLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<FacultyDashboard />} />
        <Route path="upload-notes" element={<UploadNotes />} />
        <Route path="my-notes" element={<MyNotes />} />
        <Route path="events" element={<FacultyEvents />} />
        <Route path="profile" element={<FacultyProfile />} />
      </Route>

      {/* ================= ADMIN ROUTES ================= */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
      </Route>

      {/* ================= 404 PAGE ================= */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
