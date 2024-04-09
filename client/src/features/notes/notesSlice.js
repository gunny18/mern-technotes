import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_NOTES_URL = "http://localhost:3500/notes";

const initialState = {
  notes: [],
  status: "idle",
  error: null,
};

export const fetchNotes = createAsyncThunk("notes/fetchNotes", async () => {
  const response = await axios.get(BASE_NOTES_URL);
  return response.data;
});

const notesSlice = createSlice({
  name: "notes",
  initialState,
  extraReducers(builder) {
    builder
      .addCase(fetchNotes.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(fetchNotes.fulfilled, (state, action) => {
        state.status = "succeeded";
        const loadedNotes = action.payload.map((note) => {
          note.id = note._id;
          return note;
        });
        state.notes = loadedNotes;
      })
      .addCase(fetchNotes.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const selectAllNotes = (state) => state.notes.notes;
export const selectNotesStatus = (state) => state.notes.status;
export const selectNotesError = (state) => state.notes.error;
export const selectNoteById = (state, id) =>
  state.notes.notes.find((note) => note.id === id);

export default notesSlice.reducer;
