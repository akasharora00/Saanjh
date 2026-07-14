import { BrowserRouter, Routes, Route } from "react-router-dom";

import Landing from "../pages/shared/Landing";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

import StudentDashboard from "../pages/student/Dashboard";
import FacultyDashboard from "../pages/faculty/Dashboard";
import AdminDashboard from "../pages/admin/Dashboard";
import ProtectedRoute from "./ProtectedRoute";

import NotFound from "../pages/shared/NotFound";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
            path="/student/dashboard"
            element={
                <ProtectedRoute allowedRoles={["student"]}>
                    <StudentDashboard />
                </ProtectedRoute>
            }
        />
        <Route
          path="/faculty/dashboard"
          element={
            <ProtectedRoute allowedRoles={["faculty"]}>
              <FacultyDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;