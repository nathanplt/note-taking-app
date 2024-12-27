import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editNoteId, setEditNoteId] = useState(null);

  const API_URL = "http://localhost:3000/api/notes";

  const fetchNotes = async () => {
    const response = await axios.get(API_URL);
    setNotes(response.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editNoteId) {
      await axios.put(`${API_URL}/${editNoteId}`, { title, content });
      setEditNoteId(null);
    } else {
      await axios.post(API_URL, { title, content });
    }
    setTitle("");
    setContent("");
    fetchNotes();
  };

  const handleEdit = (note) => {
    setEditNoteId(note._id);
    setTitle(note.title);
    setContent(note.content);
  };

  const handleDelete = async (id) => {
    await axios.delete(`${API_URL}/${id}`);
    setTitle("");
    setContent("");
    setEditNoteId(null);
    fetchNotes();
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  return (
    <div className="container">
      <h1>Note Taking App</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
        <button type="submit">
          {editNoteId ? "Update Note" : "Add Note"}
        </button>
      </form>
      <ul>
        {[...notes].reverse().map((note) => (
          <li key={note._id}>
            <h3>{note.title}</h3>
            <p>{note.createdAt.substring(0, 10)}</p>
            <p>{note.content}</p>
            <button onClick={() => handleEdit(note)}>Edit</button>
            <button 
              className="delete"
              onClick={() => handleDelete(note._id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;