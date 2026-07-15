import React from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  return (
    <nav
      style={{
        height: "60px",
        backgroundColor: "#1f2937",
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 20px",
      }}
    >
      <h2>Saanjh</h2>

      <h3>Welcome {user?.name} 👋</h3>
      <button
        onClick={async () => {
          await logout();
          navigate("/login");
        }}
      >
        Logout
      </button>
    </nav>
  );
};

export default Navbar;
