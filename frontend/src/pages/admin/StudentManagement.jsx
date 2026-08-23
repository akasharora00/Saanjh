import React, { useState, useEffect } from "react";
import { getStudents } from "../../api/authApi";
import { GraduationCap, Search, AlertCircle, RefreshCw } from "lucide-react";

const StudentManagement = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await getStudents();
      setStudents(res.data.students || []);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch student directory.");
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = students.filter(
    (s) =>
      s.name?.toLowerCase().includes(search.toLowerCase()) ||
      s.email?.toLowerCase().includes(search.toLowerCase()) ||
      s.department?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-fadeIn text-slate-100 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Student Directory</h1>
          <p className="text-slate-400 mt-1 text-sm">Monitor registered student profiles and academic departments.</p>
        </div>
      </div>

      {/* Alert */}
      {error && (
        <div className="flex items-center gap-3 bg-rose-500/10 border border-rose-550/20 text-rose-455 p-4 rounded-2xl text-xs font-semibold animate-fadeIn">
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
            placeholder="Search students by name, email or department..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl pl-11 pr-4 py-3 text-slate-200 placeholder:text-slate-500 outline-none focus:border-blue-500 transition text-xs font-semibold"
          />
        </div>

        <button
          onClick={fetchStudents}
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
            Loading student directory...
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className="p-12 text-center text-slate-500 space-y-2">
            <GraduationCap size={32} className="mx-auto text-slate-600 animate-bounce" />
            <p className="font-bold text-slate-350">No students found</p>
            <p className="text-xs">No matching student accounts registered in the database.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="p-4 sm:p-5">Student Name</th>
                  <th className="p-4 sm:p-5">University Email</th>
                  <th className="p-4 sm:p-5">Department</th>
                  <th className="p-4 sm:p-5">Semester</th>
                  <th className="p-4 sm:p-5">Verification</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredStudents.map((stud) => (
                  <tr key={stud._id} className="hover:bg-slate-800/20 font-medium transition">
                    <td className="p-4 sm:p-5 font-bold text-white flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-xs select-none">
                        {stud.name ? stud.name[0].toUpperCase() : "S"}
                      </div>
                      <span>{stud.name || "Pending Registration"}</span>
                    </td>
                    <td className="p-4 sm:p-5 text-slate-300">{stud.email}</td>
                    <td className="p-4 sm:p-5">
                      <span className="bg-slate-800 border border-slate-700 px-2.5 py-1 rounded-lg text-[11px] font-bold text-slate-300">
                        {stud.department || "N/A"}
                      </span>
                    </td>
                    <td className="p-4 sm:p-5 text-slate-300 font-semibold">{stud.semester || "N/A"}</td>
                    <td className="p-4 sm:p-5">
                      {stud.isVerified ? (
                        <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-550/20 px-2.5 py-1 rounded-lg font-bold text-[10px] uppercase">
                          Verified Student
                        </span>
                      ) : (
                        <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2.5 py-1 rounded-lg font-bold text-[10px] uppercase">
                          OTP Pending
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
    </div>
  );
};

export default StudentManagement;
