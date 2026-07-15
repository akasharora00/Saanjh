import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();

  const getDashboardPath = () => {
    if (!user) return "/";
    if (user.role === "admin") return "/admin";
    if (user.role === "faculty") return "/faculty";
    return "/student";
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-8 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-violet-600 flex items-center justify-center shadow-md shadow-violet-500/10">
            <span className="text-white text-xl font-bold">⌘</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Saanjh</h1>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex gap-10 text-slate-600 font-medium">
          <a href="#features" className="hover:text-violet-600 transition">
            Features
          </a>
          <a href="#about" className="hover:text-violet-600 transition">
            About
          </a>
          <a href="#testimonials" className="hover:text-violet-600 transition">
            Testimonials
          </a>
        </nav>

        {/* Buttons */}
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Link
                to={getDashboardPath()}
                className="text-slate-700 hover:text-violet-650 font-semibold transition text-sm"
              >
                Dashboard
              </Link>
              <button
                onClick={logout}
                className="bg-violet-600 hover:bg-violet-755 hover:shadow-violet-600/30 transition-all duration-300 text-white px-6 py-2.5 rounded-full font-semibold shadow-lg shadow-violet-500/15 text-sm cursor-pointer"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-slate-700 hover:text-violet-600 font-semibold transition text-sm"
              >
                Log In
              </Link>
              <Link
                to="/register"
                className="bg-violet-600 hover:bg-violet-700 duration-300 text-white px-6 py-2.5 rounded-full font-semibold shadow-lg shadow-violet-500/15 text-sm"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;

