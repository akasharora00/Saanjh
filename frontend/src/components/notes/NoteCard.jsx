import React from "react";
import { BookOpen, Calendar, Folder, GraduationCap, User, Download } from "lucide-react";
import { getAssetUrl } from "../../utils/url";

const NoteCard = ({ note }) => {
  const uploadDate = note.createdAt
    ? new Date(note.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "Recently";

  return (
    <div className="group relative bg-[#1E293B]/45 border border-slate-850 rounded-[28px] p-6 shadow-sm hover:shadow-xl hover:border-blue-500/20 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between h-full">
      <div>
        {/* Department Badge */}
        <div className="flex items-center gap-2 mb-4">
          <span className="inline-flex items-center gap-1.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 px-3 py-1 rounded-xl text-[10px] font-extrabold uppercase tracking-wider">
            <Folder size={11} />
            {note.department}
          </span>
          <span className="inline-flex items-center gap-1 bg-slate-950 border border-slate-850 text-slate-400 px-2.5 py-1 rounded-xl text-[10px] font-bold">
            <GraduationCap size={11} />
            Sem {note.semester}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-white leading-snug group-hover:text-blue-400 transition-colors duration-250">
          {note.title}
        </h3>

        {/* Subject */}
        <div className="flex items-center gap-2 text-slate-350 text-sm mt-3 font-semibold">
          <BookOpen size={14} className="text-slate-500" />
          <span>{note.subject}</span>
        </div>

        {/* Description */}
        {note.description && (
          <p className="mt-3 text-slate-400 text-xs md:text-sm leading-relaxed line-clamp-2 italic">
            "{note.description}"
          </p>
        )}
      </div>

      {/* Footer Info */}
      <div className="mt-6 pt-4 border-t border-slate-855">
        <div className="flex items-center justify-between text-xxs md:text-xs text-slate-500 font-bold uppercase tracking-wider mb-4">
          <div className="flex items-center gap-1.5">
            <User size={13} className="text-slate-550" />
            <span className="truncate max-w-[120px]">
              By {note.uploadedBy?.name || "Faculty"}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar size={13} className="text-slate-550" />
            <span>{uploadDate}</span>
          </div>
        </div>

        {/* Download Action */}
        <a
          href={getAssetUrl(note.fileUrl)}
          target="_blank"
          rel="noopener noreferrer"
          download
          className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-violet-650 hover:from-blue-500 hover:to-violet-500 text-white py-3 rounded-2xl font-bold shadow-lg shadow-blue-500/15 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 text-sm cursor-pointer"
        >
          <Download size={16} />
          Download PDF
        </a>
      </div>
    </div>
  );
};

export default NoteCard;