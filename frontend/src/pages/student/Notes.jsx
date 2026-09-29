import { useEffect, useState } from "react";
import { getAllNotes } from "../../api/noteApi";
import NoteCard from "../../components/notes/NoteCard";
import { Search, Filter, Inbox } from "lucide-react";

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filter States
  const [search, setSearch] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const data = await getAllNotes();
      setNotes(data.notes || []);
    } catch (error) {
      console.error("Failed to fetch notes:", error);
    } finally {
      setLoading(false);
    }
  };

  // Extract unique subjects dynamically for dropdown filter
  const subjects = [...new Set(notes.map((note) => note.subject))].filter(Boolean);

  // Apply filters locally
  const filteredNotes = notes.filter((note) => {
    const matchesSearch =
      note.title?.toLowerCase().includes(search.toLowerCase()) ||
      note.subject?.toLowerCase().includes(search.toLowerCase()) ||
      note.description?.toLowerCase().includes(search.toLowerCase());

    const matchesSemester = selectedSemester
      ? String(note.semester) === selectedSemester
      : true;

    const matchesSubject = selectedSubject
      ? note.subject === selectedSubject
      : true;

    return matchesSearch && matchesSemester && matchesSubject;
  });

  return (
    <div className="space-y-8 animate-fadeIn text-slate-100 font-sans">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Browse Notes</h1>
        <p className="text-slate-400 mt-1">Access lecture notes, study materials, and reference guides shared by faculty.</p>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-slate-900/60 border border-slate-850 rounded-3xl p-5 shadow-sm space-y-4 md:space-y-0 md:flex md:items-center md:gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search by title, subject, description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-955/50 border border-slate-800 rounded-2xl pl-11 pr-4 py-3 text-slate-200 placeholder:text-slate-500 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition duration-200 text-sm font-semibold"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 sm:flex-none">
            <select
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-4 pr-10 py-3 text-slate-300 outline-none focus:border-blue-500 transition text-sm font-semibold appearance-none cursor-pointer sm:min-w-[150px]"
            >
              <option value="" className="bg-[#0F172A]">All Semesters</option>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                <option key={sem} value={sem} className="bg-[#0F172A]">
                  Semester {sem}
                </option>
              ))}
            </select>
            <Filter size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
          </div>

          {/* Subject Filter */}
          <div className="relative flex-1 sm:flex-none">
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-4 pr-10 py-3 text-slate-300 outline-none focus:border-blue-500 transition text-sm font-semibold appearance-none cursor-pointer sm:min-w-[150px]"
            >
              <option value="" className="bg-[#0F172A]">All Subjects</option>
              {subjects.map((sub) => (
                <option key={sub} value={sub} className="bg-[#0F172A]">
                  {sub}
                </option>
              ))}
            </select>
            <Filter size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Grid Content */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((skeleton) => (
            <div key={skeleton} className="glass-card border border-slate-850 rounded-3xl p-6 bg-slate-900 space-y-4 animate-pulse">
              <div className="h-6 bg-slate-800 rounded-lg w-3/4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-slate-800 rounded-lg w-1/2"></div>
                <div className="h-4 bg-slate-800 rounded-lg w-2/3"></div>
                <div className="h-4 bg-slate-800 rounded-lg w-1/3"></div>
              </div>
              <div className="h-10 bg-slate-800 rounded-xl w-full pt-4"></div>
            </div>
          ))}
        </div>
      ) : filteredNotes.length === 0 ? (
        /* Empty State Illustration */
        <div className="flex flex-col items-center justify-center py-16 bg-slate-900/40 border border-slate-850 rounded-[30px] p-8 shadow-sm">
          <div className="w-20 h-20 rounded-3xl bg-slate-950 border border-slate-850 flex items-center justify-center text-slate-500 mb-6">
            <Inbox size={40} className="stroke-[1.5]" />
          </div>
          <h3 className="text-xl font-bold text-white">No notes found</h3>
          <p className="text-slate-500 text-sm text-center mt-2 max-w-sm">
            We couldn't find any study materials matching your search criteria. Try modifying your search keywords or filters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNotes.map((note) => (
            <NoteCard key={note._id} note={note} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Notes;