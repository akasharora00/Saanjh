import { Routes, Route } from "react-router-dom";

import Landing from "../pages/shared/Landing";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ForgotPassword from "../pages/auth/ForgotPassword";
import FacultyChangePassword from "../pages/auth/FacultyChangePassword";
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
import FacultyManagement from "../pages/admin/FacultyManagement";
import StudentManagement from "../pages/admin/StudentManagement";
import UploadNotes from "../pages/faculty/UploadNotes";
import MyNotes from "../pages/faculty/MyNotes";
import FacultyEvents from "../pages/faculty/Events";
import FacultyProfile from "../pages/faculty/Profile";

import LostFoundList from "../pages/LostFound/LostFoundList";
import ReportItem from "../pages/LostFound/ReportItem";
import ItemDetails from "../pages/LostFound/ItemDetails";

import Broadcast from "../pages/student/Broadcast";
import BroadcastPost from "../pages/student/BroadcastPost";

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

      <Route
        path="/forgot-password"
        element={
          <PublicRoute>
            <PageTransition>
              <ForgotPassword />
            </PageTransition>
          </PublicRoute>
        }
      />

      {/* ================= FORCED FACULTY PASSWORD CHANGE ================= */}
      <Route
        path="/faculty/change-password"
        element={
          <ProtectedRoute allowedRoles={["faculty"]}>
            <PageTransition>
              <FacultyChangePassword />
            </PageTransition>
          </ProtectedRoute>
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
        <Route path="broadcast" element={<PageTransition><Broadcast /></PageTransition>} />
        <Route path="broadcast/:id" element={<PageTransition><BroadcastPost /></PageTransition>} />
        <Route path="notes" element={<PageTransition><Notes /></PageTransition>} />
        <Route path="events" element={<PageTransition><Events /></PageTransition>} />
        <Route path="lost-found" element={<PageTransition><LostFoundList /></PageTransition>} />
        <Route path="lost-found/report" element={<PageTransition><ReportItem /></PageTransition>} />
        <Route path="lost-found/:id" element={<PageTransition><ItemDetails /></PageTransition>} />
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
        <Route path="lost-found" element={<PageTransition><LostFoundList /></PageTransition>} />
        <Route path="lost-found/report" element={<PageTransition><ReportItem /></PageTransition>} />
        <Route path="lost-found/:id" element={<PageTransition><ItemDetails /></PageTransition>} />
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
        <Route path="faculty" element={<PageTransition><FacultyManagement /></PageTransition>} />
        <Route path="students" element={<PageTransition><StudentManagement /></PageTransition>} />
        <Route path="notes" element={<PageTransition><Notes /></PageTransition>} />
        <Route path="events" element={<PageTransition><FacultyEvents /></PageTransition>} />
        <Route path="lost-found" element={<PageTransition><LostFoundList /></PageTransition>} />
        <Route path="lost-found/:id" element={<PageTransition><ItemDetails /></PageTransition>} />
      </Route>

      {/* ================= 404 PAGE ================= */}
      <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
    </Routes>
  );
};

export default AppRoutes;
