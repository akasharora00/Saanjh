import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Calendar, MapPin, Tag, Plus, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { getAllReports } from "../../api/lostFoundApi";
import { useAuth } from "../../context/AuthContext";

const LostFoundList = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filters & Search
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("all"); // all, lost, found, resolved
  const [categoryFilter, setCategoryFilter] = useState("");
  const [sortOrder, setSortOrder] = useState("newest"); // newest, oldest

  const rolePrefix = user ? `/${user.role}` : "/student";

  const categories = [
    "ID Card",
    "Wallet",
    "Keys",
    "Laptop",
    "Phone",
    "Earbuds",
    "Watch",
    "Books",
    "Notebook",
    "Calculator",
    "Water Bottle",
    "Clothes",
    "Others",
  ];

  useEffect(() => {
    fetchReports();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, categoryFilter, sortOrder]);

  const fetchReports = async () => {
    try {
      setLoading(true);
      setError("");

      const params = {
        category: categoryFilter || undefined,
        sort: sortOrder,
      };

      // Set status and type params based on the active tab
      if (activeTab === "lost") {
        params.type = "lost";
        params.status = "active";
      } else if (activeTab === "found") {
        params.type = "found";
        params.status = "active";
      } else if (activeTab === "resolved") {
        params.status = "resolved";
      } else {
        // "all" tab: we can return both active/resolved but let's query all
      }

      const res = await getAllReports(params);
      setReports(res.data.reports || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load reports. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getFileUrl = (url) => {
    if (!url) return "https://images.unsplash.com/photo-1595079676339-1534801ad6cf?w=600";
    if (url.startsWith("http://") || url.startsWith("https://")) return url;
    return `http://localhost:5000/${url.replace(/\\/g, "/")}`;
  };

  const filteredReports = reports.filter((item) => {
    const matchesSearch =
      item.itemName?.toLowerCase().includes(search.toLowerCase()) ||
      item.category?.toLowerCase().includes(search.toLowerCase()) ||
      item.location?.toLowerCase().includes(search.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="space-y-8 animate-fadeIn text-slate-100 font-sans pb-12">
      {/* Top Title & Subtitle Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Lost & Found</h1>
          <p className="text-slate-400 mt-1 text-sm">Helping students and faculty reconnect with their belongings.</p>
        </div>

        {user?.role !== "admin" && (
          <div className="flex flex-wrap gap-3">
            <Link
              to={`${rolePrefix}/lost-found/report?type=lost`}
              className="flex items-center gap-2 bg-rose-600 hover:bg-rose-550 text-white font-bold px-5 py-3 rounded-2xl text-xs transition shadow-lg shadow-rose-500/10 cursor-pointer"
            >
              <Plus size={16} />
              <span>Report Lost Item</span>
            </Link>
            <Link
              to={`${rolePrefix}/lost-found/report?type=found`}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-550 text-white font-bold px-5 py-3 rounded-2xl text-xs transition shadow-lg shadow-blue-500/10 cursor-pointer"
            >
              <Plus size={16} />
              <span>Report Found Item</span>
            </Link>
          </div>
        )}
      </div>

      {error && (
        <div className="flex items-center gap-3 bg-rose-500/10 border border-rose-550/20 text-rose-450 p-4 rounded-2xl text-xs font-semibold animate-fadeIn">
          <AlertCircle size={16} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Tabs Menu */}
      <div className="flex border-b border-slate-800 gap-6">
        {["all", "lost", "found", "resolved"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-4 text-xs font-extrabold uppercase tracking-wider transition-all duration-200 cursor-pointer relative ${
              activeTab === tab
                ? "text-blue-500 font-bold border-b-2 border-blue-500"
                : "text-slate-450 hover:text-slate-200"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Search & Filter controls */}
      <div className="bg-slate-900/60 border border-slate-850 rounded-3xl p-5 shadow-sm space-y-4 md:space-y-0 md:flex md:items-center md:gap-4">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search by name, category, or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl pl-11 pr-4 py-3 text-slate-200 placeholder:text-slate-500 outline-none focus:border-blue-500 transition text-xs font-semibold"
          />
        </div>

        {/* Dropdown Filters */}
        <div className="flex flex-wrap gap-3">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-slate-955 border border-slate-800 rounded-2xl p-3 text-slate-350 text-xs font-semibold outline-none focus:border-blue-500 cursor-pointer"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="bg-slate-955 border border-slate-800 rounded-2xl p-3 text-slate-350 text-xs font-semibold outline-none focus:border-blue-500 cursor-pointer"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>
      </div>

      {/* Item Listing Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, idx) => (
            <div key={idx} className="glass-card rounded-[24px] border border-slate-850 p-5 space-y-4 animate-pulse">
              <div className="w-full h-44 rounded-2xl bg-slate-800"></div>
              <div className="h-5 bg-slate-800 w-2/3 rounded"></div>
              <div className="h-4 bg-slate-800 w-1/3 rounded"></div>
              <div className="h-4 bg-slate-800 w-full rounded"></div>
            </div>
          ))}
        </div>
      ) : filteredReports.length === 0 ? (
        <div className="glass-card border border-slate-850 rounded-[28px] p-16 text-center text-slate-400 space-y-4">
          <div className="w-16 h-16 rounded-full bg-slate-800/40 flex items-center justify-center mx-auto text-slate-600 text-2xl">
            🔍
          </div>
          <h3 className="text-lg font-bold text-white">No items found</h3>
          <p className="text-xs max-w-sm mx-auto">Try refining your search text or selecting another category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReports.map((item) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="group glass-card rounded-[24px] border border-slate-800 overflow-hidden shadow-sm hover:border-blue-500/20 hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Item Image */}
                <div className="h-48 w-full relative overflow-hidden bg-slate-900 border-b border-slate-850">
                  <img
                    src={getFileUrl(item.images[0])}
                    alt={item.itemName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Status Badge */}
                  <span
                    className={`absolute top-4 right-4 text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full border ${
                      item.status === "resolved"
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                        : item.type === "lost"
                        ? "bg-rose-500/10 text-rose-450 border-rose-500/20"
                        : "bg-blue-500/10 text-blue-400 border-blue-500/20"
                    }`}
                  >
                    {item.status === "resolved" ? "Resolved" : item.type}
                  </span>
                </div>

                {/* Card Content */}
                <div className="p-5 space-y-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                      <Tag size={10} />
                      {item.category}
                    </span>
                    <h3 className="text-lg font-bold text-white mt-1.5 tracking-tight group-hover:text-blue-400 transition-colors">
                      {item.itemName}
                    </h3>
                  </div>

                  <p className="text-slate-400 text-xs leading-relaxed line-clamp-2">
                    {item.description}
                  </p>

                  <div className="space-y-2 pt-2 border-t border-slate-800/80 text-[11px] font-semibold text-slate-400">
                    <div className="flex items-center gap-2">
                      <MapPin size={13} className="text-slate-550 shrink-0" />
                      <span>{item.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar size={13} className="text-slate-550 shrink-0" />
                      <span>{new Date(item.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="p-5 pt-0">
                <button
                  onClick={() => navigate(`${rolePrefix}/lost-found/${item._id}`)}
                  className="w-full bg-slate-800 hover:bg-slate-750 border border-slate-700 hover:border-slate-600 transition px-4 py-2.5 rounded-xl font-bold text-xs text-white cursor-pointer shadow-sm text-center"
                >
                  View Details
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LostFoundList;
