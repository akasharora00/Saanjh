import React from "react";
import { useAuth } from "../../context/AuthContext";
import { LogOut, Menu, X } from "lucide-react";
import { getAssetUrl } from "../../utils/url";


const Navbar = ({ toggleMobileMenu, isMobileMenuOpen }) => {
  const { user, logout } = useAuth();

  return (
    <nav className="h-16 bg-[#0F172A]/90 backdrop-blur-xl border-b border-slate-900 text-white flex items-center justify-between px-4 sm:px-6 md:px-8 shadow-sm sticky top-0 z-50">
      {/* Left: Brand Logo & Mobile Toggle */}
      <div className="flex items-center gap-3">
        {/* Mobile Hamburger Toggle Button */}
        <button
          onClick={toggleMobileMenu}
          className="p-2 text-slate-300 hover:text-white hover:bg-slate-800/60 rounded-xl md:hidden transition cursor-pointer"
          aria-label="Toggle Navigation Menu"
        >
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        <div className="w-8 h-8 rounded-lg bg-[#0F172A] border border-slate-850/80 overflow-hidden flex items-center justify-center shadow-lg shadow-blue-500/10 shrink-0">
          <img src="/logo.png" alt="Logo" className="w-full h-full object-cover" />
        </div>
        <h2 className="text-lg font-bold tracking-tight text-white select-none">
          UniSphere
        </h2>
      </div>

      {/* Right: User Session Indicators & Actions */}
      <div className="flex items-center gap-2 sm:gap-4">
        <div className="flex items-center gap-2 bg-slate-955/40 px-2.5 sm:px-3.5 py-1.5 rounded-xl border border-slate-800/80">
          {user?.profilePic ? (
            <img
              src={getAssetUrl(user.profilePic)}
              alt="Avatar"
              className="w-6 h-6 rounded-lg object-cover border border-blue-500/20 shrink-0"
            />
          ) : (
            <div className="w-6 h-6 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-xs select-none shrink-0">
              {user?.name ? user.name[0].toUpperCase() : "U"}
            </div>
          )}
          <span className="text-xs font-semibold text-slate-300 hidden sm:inline">
            Welcome, <span className="text-white font-bold">{user?.name || "User"}</span> 👋
          </span>
          <span className="text-[10px] uppercase tracking-wider bg-blue-500/10 text-blue-400 px-1.5 sm:px-2 py-0.5 rounded border border-blue-500/20 font-extrabold">
            {user?.role}
          </span>
        </div>

        {/* Logout */}
        <button
          onClick={logout}
          className="flex items-center gap-1.5 bg-rose-500/10 border border-rose-500/25 hover:bg-rose-600 hover:text-white hover:border-transparent text-rose-400 px-2.5 sm:px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer shadow-md"
        >
          <LogOut size={13} />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
