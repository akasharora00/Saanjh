import React from "react";
import { useAuth } from "../../context/AuthContext";
import { LogOut, User as UserIcon } from "lucide-react";

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="h-16 bg-slate-900 border-b border-slate-800 text-white flex items-center justify-between px-6 shadow-md">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center font-bold text-lg">
          ⌘
        </div>
        <h2 className="text-xl font-bold tracking-tight bg-gradient-to-r from-white to-violet-300 bg-clip-text text-transparent">
          Saanjh
        </h2>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 bg-slate-800/80 px-4 py-1.5 rounded-full border border-slate-700/50">
          <div className="w-6 h-6 rounded-full bg-violet-500/20 text-violet-300 flex items-center justify-center">
            <UserIcon size={14} />
          </div>
          <span className="text-sm font-medium text-slate-200">
            Welcome, <span className="text-violet-300 font-semibold">{user?.name || "User"}</span> 👋
          </span>
          <span className="text-xs uppercase bg-violet-600/30 text-violet-300 px-2 py-0.5 rounded-md border border-violet-500/20 font-bold ml-1">
            {user?.role}
          </span>
        </div>

        <button
          onClick={logout}
          className="flex items-center gap-2 bg-rose-600/10 hover:bg-rose-600 hover:text-white text-rose-400 border border-rose-500/20 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;

