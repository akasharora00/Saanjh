import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { loginUser } from "../../api/authApi";
import { useAuth } from "../../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();

  const { checkAuth, user } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // Redirect if already logged in
  useEffect(() => {
    if (!user) return;

    if (user.role === "student") {
      navigate("/student");
    } else if (user.role === "faculty") {
      navigate("/faculty");
    } else {
      navigate("/admin");
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await loginUser(formData);

      await checkAuth();

      const role = res.data.user.role;

      if (role === "student") {
        navigate("/student");
      } else if (role === "faculty") {
        navigate("/faculty");
      } else {
        navigate("/admin");
      }
    } catch (error) {
      alert(error.response?.data?.message || "Login Failed");
    }
  };

  return (
    <div>
      <h1>Login</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
        />

        <br />
        <br />

        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
        />

        <br />
        <br />

        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
