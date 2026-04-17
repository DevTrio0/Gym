import { motion } from "framer-motion";
import { ArrowLeft, Trash2, Edit2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { CLIENT_QUICK_MAP } from "@/constants/mockClients";

interface Note {
  id: string;
  text: string;
  createdAt: string;
}

export default function ClientNotes() {
  const navigate = useNavigate();
  const { clientId } = useParams();
  const [noteText, setNoteText] = useState("");
  const [notes, setNotes] = useState<Note[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  const clientName = Object.values(CLIENT_QUICK_MAP).find(
    (c: any) => c.id === parseInt(clientId || "0")
  )?.name || "Client";

  useEffect(() => {
    const stored = localStorage.getItem(`clientNotes_${clientId}`);
    if (stored) {
      setNotes(JSON.parse(stored));
    }
  }, [clientId]);

  const handleAddNote = () => {
    if (!noteText.trim()) return;

    if (editingId) {
      setNotes(
        notes.map((n) =>
          n.id === editingId
            ? { ...n, text: noteText, createdAt: new Date().toLocaleString() }
            : n
        )
      );
      setEditingId(null);
    } else {
      setNotes([
        ...notes,
        {
          id: Date.now().toString(),
          text: noteText,
          createdAt: new Date().toLocaleString(),
        },
      ]);
    }

    localStorage.setItem(`clientNotes_${clientId}`, JSON.stringify(notes));
    setNoteText("");
  };

  const handleDelete = (id: string) => {
    setNotes(notes.filter((n) => n.id !== id));
    localStorage.setItem(
      `clientNotes_${clientId}`,
      JSON.stringify(notes.filter((n) => n.id !== id))
    );
  };

  const handleEdit = (note: Note) => {
    setNoteText(note.text);
    setEditingId(note.id);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
      <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Notes for {clientName}
          </h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-3xl">
        {/* Note Input */}
        <div className="p-6 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 mb-8">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Add Training Note
          </label>
          <textarea
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            placeholder="Write observations, progress, recommendations..."
            rows={5}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
          <div className="flex gap-3 mt-4">
            <button
              onClick={handleAddNote}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              {editingId ? "Update Note" : "Add Note"}
            </button>
            {editingId && (
              <button
                onClick={() => {
                  setEditingId(null);
                  setNoteText("");
                }}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
              >
                Cancel
              </button>
            )}
          </div>
        </div>

        {/* Notes List */}
        {notes.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Notes History
            </h2>
            {[...notes].reverse().map((note, idx) => (
              <motion.div
                key={note.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-blue-500 dark:hover:border-blue-500 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {note.createdAt}
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(note)}
                      className="p-1 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(note.id)}
                      className="p-1 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <p className="text-gray-700 dark:text-gray-300 text-sm whitespace-pre-wrap">
                  {note.text}
                </p>
              </motion.div>
            ))}
          </div>
        )}

        {notes.length === 0 && noteText === "" && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">
              No notes yet. Add your first note above.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
