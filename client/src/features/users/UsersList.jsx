import { useSelector, useDispatch } from "react-redux";
import {
  fetchUsers,
  selectAllUsers,
  selectUsersStatus,
  selectUsersError,
} from "./usersSlice";
import User from "./User";
import { useEffect } from "react";

const UsersList = () => {
  const dispatch = useDispatch();

  const users = useSelector(selectAllUsers);
  const usersStatus = useSelector(selectUsersStatus);
  const usersError = useSelector(selectUsersError);

  useEffect(() => {
    if (usersStatus === "idle") {
      dispatch(fetchUsers());
    }
  }, [usersStatus, dispatch]);

  let content;

  if (usersStatus === "loading") content = <p>Loading....</p>;

  if (usersStatus === "failed") {
    content = <p className="errmsg">{usersError}</p>;
  }

  if (usersStatus === "succeeded") {
    const ids = users.map((user) => user.id);

    const tableContent = ids?.length
      ? ids.map((userId) => <User key={userId} userId={userId} />)
      : null;

      content = (
        <table className="table table--users">
          <thead className="table__thead">
            <tr>
              <th scope="col" className="table__th user__username">
                Username
              </th>
              <th scope="col" className="table__th user__roles">
                Roles
              </th>
              <th scope="col" className="table__th user__edit">
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

export default UsersList;
