import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./components/Layout";
import Public from "./components/Public";
import Login from "./features/auth/Login";
import DashLayout from "./components/DashLayout";
import Welcome from "./features/auth/Welcome";
import NotesList from "./features/notes/NotesList";
import UsersList from "./features/users/UsersList";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Public />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "dash",
        element: <DashLayout />,
        children: [
          {
            index: true,
            element: <Welcome />,
          },
          {
            path: "notes",
            children: [
              {
                index: true,
                element: <NotesList />,
              },
            ],
          },
          {
            path: "users",
            children: [{ index: true, element: <UsersList /> }],
          },
        ],
      },
    ],
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
