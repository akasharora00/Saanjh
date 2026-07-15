const NoteCard = ({ note }) => {
  return (
    <div className="border rounded-lg p-4 mb-4 shadow-sm bg-white">

      <h2 className="text-xl font-semibold">
        {note.title}
      </h2>

      <p className="text-gray-600">
        Subject: {note.subject}
      </p>

      <p className="text-gray-600">
        Department: {note.department}
      </p>

      <p className="text-gray-600">
        Semester: {note.semester}
      </p>

      <p className="text-gray-600">
        Uploaded By: {note.uploadedBy?.name}
      </p>

      <button
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
      >
        Download
      </button>

    </div>
  );
};

export default NoteCard;