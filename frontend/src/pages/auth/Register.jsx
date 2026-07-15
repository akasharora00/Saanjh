import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { registerUser } from "../../api/authApi";
import { useAuth } from "../../context/AuthContext";
import { useEffect } from "react";
const Register = () => {
  const navigate = useNavigate();
  const { checkAuth, user } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
    department: "",
    semester: "",
  });

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
      await registerUser(formData);

      await checkAuth();

      alert("Registration Successful");

      // No navigate here
    } catch (error) {
      alert(error.response?.data?.message || "Registration Failed");
    }
  };

  return (
    <div>
      <h1>Register</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          onChange={handleChange}
        />

        <br />
        <br />

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

        <input
          type="text"
          name="department"
          placeholder="Department"
          onChange={handleChange}
        />

        <br />
        <br />

        <input
          type="number"
          name="semester"
          placeholder="Semester"
          onChange={handleChange}
        />

        <br />
        <br />

        <select name="role" onChange={handleChange}>
          <option value="student">Student</option>
          <option value="faculty">Faculty</option>
        </select>

        <br />
        <br />

        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
