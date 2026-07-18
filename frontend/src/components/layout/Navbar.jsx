import React from "react";
import { useAuth } from "../../context/AuthContext";
import { LogOut } from "lucide-react";

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="h-16 bg-[#0F172A]/75 backdrop-blur-xl border-b border-slate-900 text-white flex items-center justify-between px-6 md:px-8 shadow-sm sticky top-0 z-50">
      {/* Brand Logo */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-violet-650 flex items-center justify-center font-bold text-base shadow-lg shadow-blue-500/20">
          ⌘
        </div>
        <h2 className="text-lg font-bold tracking-tight text-white">
          Saanjh
        </h2>
      </div>

      {/* User Session Indicators */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2.5 bg-slate-950/40 px-3.5 py-1.5 rounded-xl border border-slate-800/80">
          {user?.profilePic ? (
            <img
              src={`http://localhost:5000/${user.profilePic}`}
              alt="Avatar"
              className="w-6 h-6 rounded-lg object-cover border border-blue-500/20"
            />
          ) : (
            <div className="w-6 h-6 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-xs select-none">
              {user?.name ? user.name[0].toUpperCase() : "U"}
            </div>
          )}
          <span className="text-xs font-semibold text-slate-300">
            Welcome, <span className="text-white font-bold">{user?.name || "User"}</span> 👋
          </span>
          <span className="text-[10px] uppercase tracking-wider bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded border border-blue-500/20 font-extrabold">
            {user?.role}
          </span>
        </div>

        {/* Logout */}
        <button
          onClick={logout}
          className="flex items-center gap-1.5 bg-rose-500/10 border border-rose-500/25 hover:bg-rose-600 hover:text-white hover:border-transparent text-rose-400 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer shadow-md"
        >
          <LogOut size={13} />
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
