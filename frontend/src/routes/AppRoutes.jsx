import { BrowserRouter, Routes, Route } from "react-router-dom";

import Landing from "../pages/shared/Landing";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import NotFound from "../pages/shared/NotFound";

import ProtectedRoute from "./ProtectedRoute";

// Student Layout
import StudentLayout from "../layouts/StudentLayout";

// Student Pages
import StudentDashboard from "../pages/student/Dashboard";
import Notes from "../pages/student/Notes";
import Events from "../pages/student/Events";
import Profile from "../pages/student/Profile";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>

        {/* ================= PUBLIC ROUTES ================= */}

        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ================= STUDENT ROUTES ================= */}

        <Route
          path="/student"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <StudentLayout />
            </ProtectedRoute>
          }
        >
          {/* Dashboard */}
          <Route index element={<StudentDashboard />} />

          {/* Student Modules */}
          <Route path="notes" element={<Notes />} />
          <Route path="events" element={<Events />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        {/* ================= 404 PAGE ================= */}

        <Route path="*" element={<NotFound />} />

      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;