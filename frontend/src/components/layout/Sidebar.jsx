import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div
      style={{
        width: "220px",
        backgroundColor: "#374151",
        color: "white",
        minHeight: "calc(100vh - 60px)",
        padding: "20px",
      }}
    >
      <h3>Menu</h3>
      <ul style={{ listStyle: "none", padding: 0 }}>
        <li>
          <Link to="/student" style={{ color: "white" }}>
            Dashboard
          </Link>
        </li>
        <br />
        <li>
          <Link to="/student/notes" style={{ color: "white" }}>
            Notes
          </Link>
        </li>
        <br />
        <li>
          <Link to="/student/events" style={{ color: "white" }}>
            Events
          </Link>
        </li>
        <br />
        <li>
          <Link to="/student/profile" style={{ color: "white" }}>
            Profile
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;