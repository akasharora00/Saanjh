import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        gap: "20px",
      }}
    >
      <h1>Saanjh</h1>

      <h2>Connecting Campus, Empowering Every Student</h2>

      <p>
        A centralized platform for students, faculty and university
        administration.
      </p>

      <div>
        <Link to="/register">
          <button>Get Started</button>
        </Link>

        <Link to="/login">
          <button style={{ marginLeft: "10px" }}>Login</button>
        </Link>
      </div>
    </div>
  );
};

export default Landing;