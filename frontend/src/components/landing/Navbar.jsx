import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Navbar = () => {
  const { user } = useAuth();

  const getDashboardPath = () => {
    if (!user) return "/";
    if (user.role === "admin") return "/admin";
    if (user.role === "faculty") return "/faculty";
    return "/student";
  };

  return (
    <header className="sticky top-0 z-50 bg-[#0F172A]/75 backdrop-blur-xl border-b border-slate-800/60 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 md:px-8 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-violet-600 flex items-center justify-center shadow-lg shadow-blue-500/25 group-hover:scale-105 transition-transform duration-300">
            <span className="text-white text-xl font-bold">⌘</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white group-hover:text-blue-450 transition-colors">
            Saanjh
          </h1>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex gap-8 text-slate-300 font-medium">
          <a href="#features" className="hover:text-blue-500 hover:translate-y-[-1px] transition-all duration-200">
            Features
          </a>
          <a href="#about" className="hover:text-blue-500 hover:translate-y-[-1px] transition-all duration-200">
            About
          </a>
          <a href="#testimonials" className="hover:text-blue-500 hover:translate-y-[-1px] transition-all duration-200">
            Testimonials
          </a>
        </nav>

        {/* Buttons */}
        <div className="flex items-center gap-4">
          {user ? (
            <Link
              to={getDashboardPath()}
              className="bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 transition-all duration-300 text-white px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-blue-500/20 text-sm hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              Dashboard
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="text-slate-300 hover:text-white font-bold transition-colors text-sm px-3 py-2"
              >
                Log In
              </Link>
              <Link
                to="/register"
                className="bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 transition-all duration-300 text-white px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-blue-500/20 text-sm hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
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
