import { useEffect, useState } from "react";
import { getAllNotes } from "../../api/noteApi";
import NoteCard from "../../components/notes/NoteCard";

const Notes = () => {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const data = await getAllNotes();
      setNotes(data.notes);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="p-6">

      <h1 className="text-3xl font-bold mb-6">
        Notes
      </h1>

      {
        notes.length === 0 ? (
          <h2>No Notes Available</h2>
        ) : (
          notes.map((note) => (
            <NoteCard
              key={note._id}
              note={note}
            />
          ))
        )
      }

    </div>
  );
};

export default Notes;