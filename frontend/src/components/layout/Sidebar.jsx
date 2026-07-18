import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { LayoutDashboard, FileText, Calendar, UserCircle } from "lucide-react";

const Sidebar = () => {
  const { user } = useAuth();
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
      { path: "/student/notes", label: "Notes", icon: FileText },
      { path: "/student/events", label: "Events", icon: Calendar },
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
        path: "/faculty/profile",
        label: "Profile",
        icon: UserCircle,
      },
    ],
    admin: [
      { path: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
    ],
  };

  const links = menuItems[role] || [];

  return (
    <aside className="w-64 bg-slate-950/20 border-r border-slate-900 text-slate-100 min-h-[calc(100vh-64px)] flex flex-col p-4 shadow-sm relative z-20">
      <div className="mb-6 px-4 pt-2">
        <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
          Menu ({role})
        </h3>
      </div>
      <nav className="flex-1 space-y-1">
        {links.map((item, index) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={index}
              to={item.path}
              end={item.end}
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
    </aside>
  );
};

export default Sidebar;
