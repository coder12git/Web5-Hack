import { RouterProvider, createHashRouter, Navigate } from "react-router-dom";
import useWeb5Store from "./stores/useWeb5Store";
import { useEffect } from "react";
import Connect from "./pages/connect";
import Remedy from "./pages/remedy";
import Doctors from "./pages/nearbyDoctor";
import HomePage from "./pages/Home";
import SharedLayout from "./pages/SharedLayout/";
import Records from "./pages/Records";
import Chat from "./pages/Chat/";
import { Toaster } from "react-hot-toast";
import ProfileGuard from "./components/Auth/Profile/Guard";

const router = createHashRouter([
  {
    path: "/",
    element: <SharedLayout />,
    children: [
      { path: "/", element: <HomePage /> },
      {
        path: "/records",
        element: <Records />,
      },
      { path: "/connect", element: <Connect /> },
      {
        path: "/remedies",
        element: <Remedy />,
      },
      { path: "/contact", element: <Doctors /> },
      {
        path: "/chat",
        element: (
          <ProfileGuard>
            <Chat />
          </ProfileGuard>
        ),
      }
    ],
  },
]);

function App() {
  const web5 = useWeb5Store((state) => state.web5);
  const connect = useWeb5Store((state) => state.connect);
  // const did = useWeb5Store((state) => state.did);

  useEffect(() => {
    if (!web5) connect();
  }, []);

  return (
    <>
      <>
        {true ? <RouterProvider router={router} /> : <div>Connecting...</div>}
      </>
      <Toaster position="top-center" reverseOrder={false} />
    </>
  );
}

export default App;
