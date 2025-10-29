import React, { useEffect, useState } from "react";
import "../styles/notes.scss";


type Priority = "important" | "normal" | "delayed";

type Note = {
  id: string;
  text: string;
  priority: Priority;
  createdAt: number;
};

const NOTES_KEY = "notes";

const defaultNotes: Note[] = [
  // optional starter notes (you can remove)
  // { id: "1", text: "Welcome! Try adding a note", priority: "normal", createdAt: Date.now() }
];

function readNotesFromStorage(): Note[] {
  try {
    const raw = localStorage.getItem(NOTES_KEY);
    if (!raw) return defaultNotes;
    return JSON.parse(raw) as Note[];
  } catch {
    return defaultNotes;
  }
}

function writeNotesToStorage(notes: Note[]) {
  localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
}

export const NoteManager: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>(() => readNotesFromStorage());
  const [text, setText] = useState("");
  const [priority, setPriority] = useState<Priority>("normal");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    writeNotesToStorage(notes);
  }, [notes]);

  const addNote = () => {
    const trimmed = text.trim();
    if (!trimmed) {
      setError("Note cannot be empty");
      return;
    }

    const newNote: Note = {
      id: String(Date.now()), 
      text: trimmed,
      priority,
      createdAt: Date.now(),
    };

    setNotes((prev) => [newNote, ...prev]);
    setText("");
    setPriority("normal");
    setError(null);
  };

  const deleteNote = (id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
  };

  const changeNotePriority = (id: string, next: Priority) => {
    setNotes((prev) => prev.map((n) => (n.id === id ? { ...n, priority: next } : n)));
  };


  const notesByPriority = (p: Priority) => notes.filter((n) => n.priority === p);

  return (
    <div className="note-card">
      <h3>Note Manager</h3>

      <div className="note-input">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write a note..."
          aria-label="note text"
        />

        <select value={priority} onChange={(e) => setPriority(e.target.value as Priority)} aria-label="priority">
          <option value="important">important</option>
          <option value="normal">normal</option>
          <option value="delayed">delayed</option>
        </select>

        <button className="btn" onClick={addNote}>
          Add note
        </button>
      </div>

      {error && <div className="note-error">{error}</div>}

      <div className="note-columns">
        <div className="note-column">
          <h4>Important</h4>
          {notesByPriority("important").length === 0 && <div className="empty">No important notes</div>}
          {notesByPriority("important").map((n) => (
            <div key={n.id} className="note-item">
              <div className="note-text">{n.text}</div>
              <div className="note-actions">
                <select
                  value={n.priority}
                  onChange={(e) => changeNotePriority(n.id, e.target.value as Priority)}
                >
                  <option value="important">important</option>
                  <option value="normal">normal</option>
                  <option value="delayed">delayed</option>
                </select>
                <button className="small" onClick={() => deleteNote(n.id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="note-column">
          <h4>Normal</h4>
          {notesByPriority("normal").length === 0 && <div className="empty">No normal notes</div>}
          {notesByPriority("normal").map((n) => (
            <div key={n.id} className="note-item">
              <div className="note-text">{n.text}</div>
              <div className="note-actions">
                <select
                  value={n.priority}
                  onChange={(e) => changeNotePriority(n.id, e.target.value as Priority)}
                >
                  <option value="important">important</option>
                  <option value="normal">normal</option>
                  <option value="delayed">delayed</option>
                </select>
                <button className="small" onClick={() => deleteNote(n.id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="note-column">
          <h4>Delayed</h4>
          {notesByPriority("delayed").length === 0 && <div className="empty">No delayed notes</div>}
          {notesByPriority("delayed").map((n) => (
            <div key={n.id} className="note-item">
              <div className="note-text">{n.text}</div>
              <div className="note-actions">
                <select
                  value={n.priority}
                  onChange={(e) => changeNotePriority(n.id, e.target.value as Priority)}
                >
                  <option value="important">important</option>
                  <option value="normal">normal</option>
                  <option value="delayed">delayed</option>
                </select>
                <button className="small" onClick={() => deleteNote(n.id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NoteManager;
