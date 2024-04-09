import { useSelector, useDispatch } from "react-redux";
import {
  fetchNotes,
  selectAllNotes,
  selectNotesError,
  selectNotesStatus,
} from "./notesSlice";
import Note from "./Note";
import { useEffect } from "react";

const NotesList = () => {
  const dispatch = useDispatch();
  const notes = useSelector(selectAllNotes);
  const notesStatus = useSelector(selectNotesStatus);
  const notesError = useSelector(selectNotesError);

  useEffect(() => {
    if (notesStatus === "idle") {
      dispatch(fetchNotes());
    }
  }, [notesStatus, dispatch]);

  let content;

  if (notesStatus === "loading") content = <p>Loading......</p>;
  if (notesStatus === "failed") {
    content = <p className="errmsg">{notesError}</p>;
  }

  if (notesStatus === "succeeded") {
    const ids = notes.map((note) => note.id);

    const tableContent = ids?.length
      ? ids.map((noteId) => <Note key={noteId} noteId={noteId} />)
      : null;

    content = (
      <table className="table table--notes">
        <thead className="table__thead">
          <tr>
            <th scope="col" className="table__th note__status">
              Username
            </th>
            <th scope="col" className="table__th note__created">
              Created
            </th>
            <th scope="col" className="table__th note__updated">
              Updated
            </th>
            <th scope="col" className="table__th note__title">
              Title
            </th>
            <th scope="col" className="table__th note__username">
              Owner
            </th>
            <th scope="col" className="table__th note__edit">
              Edit
            </th>
          </tr>
        </thead>
        <tbody>{tableContent}</tbody>
      </table>
    );
  }
  return content;
};

export default NotesList;
