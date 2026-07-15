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
    <aside className="w-64 bg-slate-900 border-r border-slate-800 text-white min-h-[calc(100vh-64px)] flex flex-col p-4 shadow-lg">
      <div className="mb-6 px-4">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
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
                flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-250 cursor-pointer
                ${
                  isActive
                    ? "bg-violet-600 text-white shadow-lg shadow-violet-500/25 border border-violet-500/30"
                    : "text-slate-400 hover:text-white hover:bg-slate-800 border border-transparent"
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
