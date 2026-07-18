const FacultyNoteCard = ({ note, onDelete }) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6">

      <div className="flex justify-between items-center mb-3">
        <h2 className="text-xl font-bold">
          {note.title}
        </h2>

        <span className="text-sm text-gray-500">
          {new Date(note.createdAt).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </span>
      </div>

      <p><b>Subject:</b> {note.subject}</p>
      <p><b>Department:</b> {note.department}</p>
      <p><b>Semester:</b> {note.semester}</p>

      <p className="mt-3 text-gray-600">
        {note.description}
      </p>

      <div className="flex gap-3 mt-5">

        <a
          href={`http://localhost:5000/${note.fileUrl}`}
          target="_blank"
          rel="noreferrer"
          className="bg-violet-600 text-white px-4 py-2 rounded-lg"
        >
          Download
        </a>

        <button
          className="bg-red-600 text-white px-4 py-2 rounded-lg"
          onClick={() => onDelete(note._id)}
        >
          Delete
        </button>

      </div>

    </div>
  );
};

export default FacultyNoteCard;