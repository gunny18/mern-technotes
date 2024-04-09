import { User } from "../models/User.js";
import { Note } from "../models/Note.js";

export const getAllNotes = async (req, res, next) => {
  try {
    const notes = await Note.find().lean();
    if (!notes?.length) {
      return res.status(400).json({ message: "No notes present!" });
    }
    const notesWithUser = await Promise.all(
      notes.map(async (note) => {
        const user = await User.findById({ _id: note.user }).lean().exec();
        return { ...note, username: user.username };
      })
    );
    res.json(notesWithUser);
  } catch (error) {
    next(error);
  }
};

export const createNewNote = async (req, res, next) => {
  try {
    const { user, title, text } = req.body;
    if (!user || !title || !text) {
      return res.status(400).json({ message: "All fields are required!" });
    }
    const foundUser = await User.findById({ _id: user }).lean().exec();
    if (!foundUser) {
      return res.status(400).json({ message: "No such user found!" });
    }
    const duplicate = await Note.findOne({ title })
      .collation({
        locale: "en",
        strength: 2,
      })
      .lean()
      .exec();
    if (duplicate) {
      return res.status(409).json({ message: "Duplicate Note title" });
    }
    const createdNote = await Note.create({ user, title, text });
    if (createdNote) {
      return res.status(201).json({ message: `New Note ${title} created` });
    } else {
      res.status(400).json({ message: "Invalid data received  create Note" });
    }
  } catch (error) {
    next(error);
  }
};

export const updateNote = async (req, res, next) => {
  try {
    const { id, user, title, text, completed } = req.body;
    if (!id || !user || !title || !text || typeof completed !== "boolean") {
      return res.status(400).json({ message: "All fields required!" });
    }
    const foundUser = await User.findById({ _id: user }).lean().exec();
    if (!foundUser) {
      return res.status(400).json({ message: "No such user found!" });
    }
    const note = await Note.findById(id).exec();
    if (!note) {
      return res.status(400).json({ message: "No note found!" });
    }
    const duplicate = await Note.findOne({ title })
      .collation({ locale: "en", strength: 2 })
      .lean()
      .exec();
    if (duplicate && duplicate?._id.toString() !== id) {
      return res.status(409).json({ message: "Duplicate Note title" });
    }
    note.user = user;
    note.title = title;
    note.text = text;
    note.completed = completed;
    const updatedNote = await note.save();
    res.json({ message: `Updated Note ${updatedNote.title}` });
  } catch (error) {
    next(error);
  }
};

export const deleteNote = async (req, res, next) => {
  try {
    const { id } = req.body;
    if (!id) {
      return res.status(400).json({ message: "All fields required!" });
    }
    const note = await Note.findById(id).exec();
    if (!note) {
      return res.status(400).json({ message: "No note found" });
    }
    await note.deleteOne();
    res.json({ message: `Deleted note ${note.title} with ID ${note.id}` });
  } catch (error) {
    next(error);
  }
};
