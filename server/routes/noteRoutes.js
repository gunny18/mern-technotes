import express from "express";
import {
  getAllNotes,
  createNewNote,
  updateNote,
  deleteNote,
} from "../controller/noteController.js";

export const router = express.Router();

router
  .route("/")
  .get(getAllNotes)
  .post(createNewNote)
  .patch(updateNote)
  .delete(deleteNote);
