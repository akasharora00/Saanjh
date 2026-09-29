import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, MapPin, Phone, Mail, ShieldAlert, CheckCircle, Trash2, Tag, AlertCircle } from "lucide-react";
import { getReportById, claimItem, resolveReport, deleteReport } from "../../api/lostFoundApi";
import { useAuth } from "../../context/AuthContext";
import { getAssetUrl } from "../../utils/url";


const ItemDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [activeImageIdx, setActiveImageIdx] = useState(0);

  const rolePrefix = user ? `/${user.role}` : "/student";
  const isOwner = item && user && item.owner?._id === user._id;
  const isAdmin = user && user.role === "admin";

  useEffect(() => {
    fetchItemDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchItemDetails = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await getReportById(id);
      setItem(res.data.report);
      setActiveImageIdx(0);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch item details.");
    } finally {
      setLoading(false);
    }
  };

  const handleClaim = async () => {
    try {
      setError("");
      setSuccess("");
      await claimItem(id);
      setSuccess(item.type === "lost" ? "Reported as found! Owner notified." : "Claim submitted! Owner notified.");
      fetchItemDetails();
      setTimeout(() => setSuccess(""), 4000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit claim.");
    }
  };

  const handleResolve = async () => {
    try {
      setError("");
      setSuccess("");
      await resolveReport(id);
      setSuccess("Report marked as resolved successfully!");
      fetchItemDetails();
      setTimeout(() => setSuccess(""), 4000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to resolve report.");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this report?")) return;
    try {
      setError("");
      await deleteReport(id);
      alert("Report deleted successfully.");
      navigate(`${rolePrefix}/lost-found`);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete report.");
    }
  };

  const getFileUrl = (url) => {
    if (!url) return "https://images.unsplash.com/photo-1595079676339-1534801ad6cf?w=900";
    return getAssetUrl(url);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-slate-500 font-semibold animate-pulse">
        Loading details...
      </div>
    );
  }

  if (!item) {
    return (
      <div className="text-center p-12 text-slate-400 space-y-4">
        <p className="font-bold text-white text-lg">Report not found</p>
        <button
          onClick={() => navigate(`${rolePrefix}/lost-found`)}
          className="text-blue-500 font-bold hover:underline"
        >
          Back to list
        </button>
      </div>
    );
  }

  const images = item.images && item.images.length > 0 ? item.images : [null];

  return (
    <div className="space-y-8 animate-fadeIn text-slate-100 font-sans pb-12 max-w-4xl mx-auto">
      {/* Header Back link */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(`${rolePrefix}/lost-found`)}
            className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 transition flex items-center justify-center cursor-pointer text-slate-400"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">Item Details</h1>
            <p className="text-slate-400 text-xs">View full description and contact links.</p>
          </div>
        </div>

        {isAdmin && (
          <button
            onClick={handleDelete}
            className="flex items-center gap-2 bg-rose-500/10 border border-rose-500/25 hover:bg-rose-600 hover:text-white hover:border-transparent text-rose-400 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-md"
          >
            <Trash2 size={14} />
            <span>Delete Spam</span>
          </button>
        )}
      </div>

      {/* Success/Error Alerts */}
      {success && (
        <div className="flex items-center gap-3 bg-emerald-500/10 border border-emerald-555/20 text-emerald-400 p-4 rounded-2xl text-xs font-semibold animate-fadeIn">
          <CheckCircle size={16} className="shrink-0" />
          <span>{success}</span>
        </div>
      )}
      {error && (
        <div className="flex items-center gap-3 bg-rose-500/10 border border-rose-550/20 text-rose-455 p-4 rounded-2xl text-xs font-semibold animate-fadeIn">
          <AlertCircle size={16} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Detail Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Left Column: Image Gallery */}
        <div className="md:col-span-6 space-y-4">
          <div className="rounded-3xl border border-slate-800 bg-slate-900/60 overflow-hidden h-72 md:h-96 w-full flex items-center justify-center relative">
            <img
              src={getFileUrl(images[activeImageIdx])}
              alt={item.itemName}
              className="w-full h-full object-cover"
            />
            {/* Status absolute badge */}
            <span
              className={`absolute top-4 right-4 text-[10px] font-extrabold uppercase px-3 py-1.5 rounded-full border shadow-md ${
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

          {/* Gallery Thumbnails */}
          {images.length > 1 && (
            <div className="flex gap-3">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIdx(idx)}
                  className={`w-20 h-16 rounded-xl overflow-hidden border transition cursor-pointer ${
                    activeImageIdx === idx ? "border-blue-550 scale-105" : "border-slate-800 hover:border-slate-700"
                  }`}
                >
                  <img src={getFileUrl(img)} alt="Thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Info details */}
        <div className="md:col-span-6 space-y-6">
          <div className="glass-card border border-slate-800 rounded-[28px] p-6 md:p-8 space-y-6 shadow-sm">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Tag size={12} />
                {item.category}
              </span>
              <h2 className="text-2xl font-extrabold text-white mt-2 tracking-tight">
                {item.itemName}
              </h2>
            </div>

            <p className="text-slate-350 text-xs leading-relaxed border-t border-slate-800/60 pt-4">
              {item.description}
            </p>

            <div className="grid grid-cols-2 gap-4 border-t border-slate-800/60 pt-4 text-xs font-medium text-slate-450">
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-500">Location</span>
                <div className="flex items-center gap-2 text-slate-200">
                  <MapPin size={14} className="text-blue-500 shrink-0" />
                  <span>{item.location}</span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-500">Date {item.type === "lost" ? "Lost" : "Found"}</span>
                <div className="flex items-center gap-2 text-slate-200">
                  <Calendar size={14} className="text-blue-500 shrink-0" />
                  <span>{new Date(item.date).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Reporter Contact Info */}
          <div className="glass-card border border-slate-800 rounded-[28px] p-6 shadow-sm space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Reported By</h3>
            <div className="flex items-center gap-4">
              {item.owner?.profilePic ? (
                <img
                  src={getAssetUrl(item.owner.profilePic)}
                  alt="Reporter avatar"
                  className="w-11 h-11 rounded-2xl object-cover border border-slate-800"
                />
              ) : (
                <div className="w-11 h-11 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-base select-none">
                  {item.owner?.name ? item.owner.name[0].toUpperCase() : "U"}
                </div>
              )}
              <div>
                <h4 className="font-bold text-white text-sm">{item.owner?.name || "Reporter"}</h4>
                <p className="text-slate-450 text-[11px] font-semibold mt-0.5">{item.owner?.email}</p>
              </div>
            </div>

            {/* Display Contact details ONLY if claimant has connected or current user is owner/admin */}
            {(isOwner || isAdmin || item.claimedBy) ? (
              <div className="space-y-2 pt-3 border-t border-slate-800/80 text-xs font-medium text-slate-350">
                {item.phone && (
                  <div className="flex items-center gap-2">
                    <Phone size={13} className="text-slate-500 shrink-0" />
                    <span>Phone: <a href={`tel:${item.phone}`} className="text-blue-500 hover:underline">{item.phone}</a></span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Mail size={13} className="text-slate-500 shrink-0" />
                  <span>Email: <a href={`mailto:${item.owner?.email}`} className="text-blue-500 hover:underline">{item.owner?.email}</a></span>
                </div>
              </div>
            ) : (
              <div className="pt-3 border-t border-slate-800/80 flex items-center gap-2 text-slate-500 text-[11px] font-semibold">
                <ShieldAlert size={14} className="shrink-0" />
                <span>Contact details will be visible once you claim or report this item.</span>
              </div>
            )}
          </div>

          {/* Action buttons */}
          {item.status !== "resolved" && (
            <div className="pt-2">
              {isOwner ? (
                <button
                  onClick={handleResolve}
                  className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-550 text-white font-bold text-xs transition shadow-lg shadow-emerald-500/10 cursor-pointer text-center"
                >
                  Mark as Resolved
                </button>
              ) : (
                <>
                  {item.claimedBy ? (
                    <div className="glass-card border border-emerald-500/20 bg-emerald-500/5 rounded-2xl p-4 text-center text-emerald-400 text-xs font-semibold flex items-center justify-center gap-2">
                      <CheckCircle size={16} />
                      <span>{item.type === "lost" ? "Reported as Found" : "Claim Request Submitted"}</span>
                    </div>
                  ) : (
                    <button
                      onClick={handleClaim}
                      className="w-full py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-550 text-white font-bold text-xs transition shadow-lg shadow-blue-500/10 cursor-pointer text-center"
                    >
                      {item.type === "lost" ? "I Found This" : "Claim This Item"}
                    </button>
                  )}
                </>
              )}
            </div>
          )}

          {item.status === "resolved" && (
            <div className="glass-card border border-slate-800 bg-slate-950/40 rounded-2xl p-4 text-center text-slate-500 text-xs font-semibold flex items-center justify-center gap-2">
              <CheckCircle size={16} className="text-emerald-555" />
              <span>Resolved Belonging • Case Closed</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ItemDetails;
