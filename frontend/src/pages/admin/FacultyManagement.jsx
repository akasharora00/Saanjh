import React, { useState, useEffect } from "react";
import { getFaculties, createFaculty } from "../../api/authApi";
import InputField from "../../components/auth/InputField";
import Modal from "../../components/common/Modal";
import { UserCheck, Plus, Search, Mail, User, CheckCircle2, AlertCircle, RefreshCw } from "lucide-react";
import { DEPARTMENTS } from "../../constants/departments";

const FacultyManagement = () => {
  const [faculties, setFaculties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [department, setDepartment] = useState("CSE");
  const [modalError, setModalError] = useState("");

  useEffect(() => {
    fetchFaculties();
  }, []);

  const fetchFaculties = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await getFaculties();
      setFaculties(res.data.faculties || []);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch faculty list.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateFaculty = async (e) => {
    e.preventDefault();
    setModalError("");

    if (!name.trim()) return setModalError("Faculty Name is required.");
    if (!email.endsWith("@chitkarauniversity.edu.in")) {
      return setModalError("Only Chitkara University emails (@chitkarauniversity.edu.in) are allowed.");
    }

    try {
      setCreateLoading(true);
      await createFaculty({ name, email, department });
      setSuccess("Faculty created successfully.");
      setIsModalOpen(false);
      setName("");
      setEmail("");
      setDepartment("CSE");
      fetchFaculties();
      setTimeout(() => setSuccess(""), 4000);
    } catch (err) {
      setModalError(err.response?.data?.message || "Failed to create faculty.");
    } finally {
      setCreateLoading(false);
    }
  };

  const filteredFaculties = faculties.filter(
    (f) =>
      f.name?.toLowerCase().includes(search.toLowerCase()) ||
      f.email?.toLowerCase().includes(search.toLowerCase()) ||
      f.department?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-fadeIn text-slate-100 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Faculty Management</h1>
          <p className="text-slate-400 mt-1 text-sm">Provision faculty accounts and view active academic staff.</p>
        </div>

        <button
          onClick={() => {
            setModalError("");
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-violet-650 hover:from-blue-500 hover:to-violet-500 text-white font-bold px-5 py-3 rounded-2xl text-xs transition shadow-lg shadow-blue-500/20 cursor-pointer"
        >
          <Plus size={16} />
          <span>Create Faculty</span>
        </button>
      </div>

      {/* Alerts */}
      {success && (
        <div className="flex items-center gap-3 bg-emerald-500/10 border border-emerald-550/20 text-emerald-400 p-4 rounded-2xl text-xs font-semibold animate-fadeIn">
          <CheckCircle2 size={16} className="shrink-0" />
          <span>{success}</span>
        </div>
      )}
      {error && (
        <div className="flex items-center gap-3 bg-rose-500/10 border border-rose-550/20 text-rose-450 p-4 rounded-2xl text-xs font-semibold animate-fadeIn">
          <AlertCircle size={16} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Search & Actions */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-5 shadow-sm space-y-4 md:space-y-0 md:flex md:items-center md:justify-between md:gap-4">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search faculty by name, email or department..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl pl-11 pr-4 py-3 text-slate-200 placeholder:text-slate-500 outline-none focus:border-blue-500 transition text-xs font-semibold"
          />
        </div>

        <button
          onClick={fetchFaculties}
          className="flex items-center gap-2 bg-slate-800 hover:bg-slate-750 border border-slate-700 px-4 py-3 rounded-2xl text-xs font-bold text-slate-300 transition cursor-pointer"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Table Section */}
      <div className="glass-card border border-slate-800 rounded-[28px] overflow-hidden shadow-xl">
        {loading ? (
          <div className="p-12 text-center text-slate-500 font-semibold animate-pulse">
            Loading faculty directory...
          </div>
        ) : filteredFaculties.length === 0 ? (
          <div className="p-12 text-center text-slate-500 space-y-2">
            <UserCheck size={32} className="mx-auto text-slate-600" />
            <p className="font-bold text-slate-300">No faculty accounts found</p>
            <p className="text-xs">Click "+ Create Faculty" to add faculty members.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="p-4 sm:p-5">Faculty Name</th>
                  <th className="p-4 sm:p-5">University Email</th>
                  <th className="p-4 sm:p-5">Department</th>
                  <th className="p-4 sm:p-5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredFaculties.map((fac) => (
                  <tr key={fac._id} className="hover:bg-slate-800/20 font-medium transition">
                    <td className="p-4 sm:p-5 font-bold text-white flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-xs select-none">
                        {fac.name ? fac.name[0].toUpperCase() : "F"}
                      </div>
                      <span>{fac.name}</span>
                    </td>
                    <td className="p-4 sm:p-5 text-slate-300">{fac.email}</td>
                    <td className="p-4 sm:p-5">
                      <span className="bg-slate-800 border border-slate-700 px-2.5 py-1 rounded-lg text-[11px] font-bold text-slate-300">
                        {fac.department}
                      </span>
                    </td>
                    <td className="p-4 sm:p-5">
                      {fac.mustChangePassword ? (
                        <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2.5 py-1 rounded-lg font-bold text-[10px] uppercase">
                          Temp Password Active
                        </span>
                      ) : (
                        <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-550/20 px-2.5 py-1 rounded-lg font-bold text-[10px] uppercase">
                          Active & Verified
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* CREATE FACULTY MODAL */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create Faculty Account"
      >
        <form onSubmit={handleCreateFaculty} className="space-y-4">
          {modalError && (
            <div className="flex items-center gap-2 bg-rose-500/10 border border-rose-550/20 text-rose-450 p-3 rounded-xl text-xs font-semibold">
              <AlertCircle size={14} className="shrink-0" />
              <span>{modalError}</span>
            </div>
          )}

          <InputField
            label="Faculty Name"
            type="text"
            icon={User}
            name="name"
            placeholder="e.g. Dr. Ramesh Sharma"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <InputField
            label="Faculty Email"
            type="email"
            icon={Mail}
            name="email"
            placeholder="faculty@chitkarauniversity.edu.in"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Department
            </label>
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full bg-slate-950/50 border border-slate-800 rounded-xl p-3 text-slate-200 text-xs font-semibold outline-none focus:border-blue-500 cursor-pointer"
            >
              {DEPARTMENTS.map((dept) => (
                <option key={dept.value} value={dept.value} className="bg-[#0F172A]">
                  {dept.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-3 justify-end pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2.5 rounded-xl border border-slate-800 hover:bg-slate-800 text-slate-400 text-xs font-bold transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createLoading}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-violet-650 text-white font-bold text-xs transition shadow-md cursor-pointer disabled:opacity-60"
            >
              {createLoading ? "Creating..." : "Create Faculty"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default FacultyManagement;
