require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const Note = require("./models/Note.js");

const app = express();

app.use(express.json());
app.use(cors());

mongoose
  .connect(process.env.MONGO_URI, { useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(`MongoDB connection error: ${err}`));

app.get("/api/notes", async (req, res) => {
  const notes = await Note.find();
  res.json(notes);
});

app.post("/api/notes", async (req, res) => {
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).json({ error: "Title and content required" });
  }

  const newNote = new Note({ title, content });
  await newNote.save();
  res.status(201).json(newNote);
});

app.put("/api/notes/:id", async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;
  const updatedNote = await Note.findByIdAndUpdate(id, { title, content }, { new: true });
  res.json(updatedNote);
});

app.delete("/api/notes/:id", async (req, res) => {
  const { id } =  req.params;
  await Note.findByIdAndDelete(id);
  res.json({ message: "Note deleted" });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on https://localhost:${PORT}`));