import { configureStore } from "@reduxjs/toolkit";
import usersReducer from "../features/users/usersSlice";
import notesReducer from "../features/notes/notesSlice";

export const store = configureStore({
  reducer: {
    users: usersReducer,
    notes: notesReducer,
  },
});
