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

import PageTransition from "../components/common/PageTransition";

const AppRoutes = () => {
  return (
    <Routes>
      {/* ================= PUBLIC ROUTES ================= */}
      <Route path="/" element={<PageTransition><Landing /></PageTransition>} />

      <Route
        path="/login"
        element={
          <PublicRoute>
            <PageTransition>
              <Login />
            </PageTransition>
          </PublicRoute>
        }
      />

      <Route
        path="/register"
        element={
          <PublicRoute>
            <PageTransition>
              <Register />
            </PageTransition>
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
        <Route index element={<PageTransition><StudentDashboard /></PageTransition>} />
        <Route path="notes" element={<PageTransition><Notes /></PageTransition>} />
        <Route path="events" element={<PageTransition><Events /></PageTransition>} />
        <Route path="profile" element={<PageTransition><Profile /></PageTransition>} />
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
        <Route index element={<PageTransition><FacultyDashboard /></PageTransition>} />
        <Route path="upload-notes" element={<PageTransition><UploadNotes /></PageTransition>} />
        <Route path="my-notes" element={<PageTransition><MyNotes /></PageTransition>} />
        <Route path="events" element={<PageTransition><FacultyEvents /></PageTransition>} />
        <Route path="profile" element={<PageTransition><FacultyProfile /></PageTransition>} />
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
        <Route index element={<PageTransition><AdminDashboard /></PageTransition>} />
      </Route>

      {/* ================= 404 PAGE ================= */}
      <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
    </Routes>
  );
};

export default AppRoutes;
