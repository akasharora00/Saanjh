import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { LayoutDashboard, FileText, Calendar, UserCircle, Users, LogOut, Search, MessageSquare } from "lucide-react";

const Sidebar = ({ isMobileMenuOpen, closeMobileMenu }) => {
  const { user, logout } = useAuth();
  const role = user?.role || "student";

  // Define sidebar links based on role
  const menuItems = {
    student: [
      {
        path: "/student",
        label: "Dashboard",
        icon: LayoutDashboard,
        end: true,
      },
      { path: "/student/broadcast", label: "Broadcast", icon: MessageSquare },
      { path: "/student/notes", label: "Notes", icon: FileText },
      { path: "/student/events", label: "Events", icon: Calendar },
      { path: "/student/lost-found", label: "Lost & Found", icon: Search },
      { path: "/student/profile", label: "Profile", icon: UserCircle },
    ],
    faculty: [
      {
        path: "/faculty",
        label: "Dashboard",
        icon: LayoutDashboard,
        end: true,
      },
      {
        path: "/faculty/upload-notes",
        label: "Upload Notes",
        icon: FileText,
      },
      {
        path: "/faculty/my-notes",
        label: "My Notes",
        icon: FileText,
      },
      {
        path: "/faculty/events",
        label: "Events",
        icon: Calendar,
      },
      {
        path: "/faculty/lost-found",
        label: "Lost & Found",
        icon: Search,
      },
      {
        path: "/faculty/profile",
        label: "Profile",
        icon: UserCircle,
      },
    ],
    admin: [
      { path: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
      { path: "/admin/faculty", label: "Faculty Management", icon: Users },
      { path: "/admin/students", label: "Students", icon: Users },
      { path: "/admin/notes", label: "Notes", icon: FileText },
      { path: "/admin/events", label: "Events", icon: Calendar },
      { path: "/admin/lost-found", label: "Lost & Found", icon: Search },
    ],
  };

  const links = menuItems[role] || [];

  const handleLinkClick = () => {
    if (closeMobileMenu) {
      closeMobileMenu();
    }
  };

  const sidebarContent = (
    <div className="flex flex-col justify-between h-full p-4">
      <div>
        <div className="mb-6 px-4 pt-2">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
            Menu ({role})
          </h3>
        </div>
        <nav className="space-y-1">
          {links.map((item, index) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={index}
                to={item.path}
                end={item.end}
                onClick={handleLinkClick}
                className={({ isActive }) => `
                  flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer
                  ${
                    isActive
                      ? "bg-gradient-to-r from-blue-600 to-violet-650 text-white shadow-lg shadow-blue-500/15 border border-blue-500/20"
                      : "text-slate-400 hover:text-white hover:bg-slate-800/40 border border-transparent"
                  }
                `}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Logout Action in Sidebar */}
      <div className="pt-4 border-t border-slate-900">
        <button
          onClick={() => {
            handleLinkClick();
            logout();
          }}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-rose-450 hover:bg-rose-500/10 hover:text-rose-400 transition cursor-pointer"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Fixed Sidebar */}
      <aside className="hidden md:flex w-64 bg-slate-955/20 border-r border-slate-900 text-slate-100 min-h-[calc(100vh-64px)] flex-col justify-between shadow-sm relative z-20 shrink-0">
        {sidebarContent}
      </aside>

      {/* Mobile Slide-Over Drawer Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          {/* Backdrop Blur Overlay */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={closeMobileMenu}
          />

          {/* Drawer Sidebar */}
          <aside className="relative w-64 max-w-[80vw] bg-[#0F172A] border-r border-slate-800 text-slate-100 h-full shadow-2xl z-10 animate-fadeIn">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
};

export default Sidebar;
