import { RouterProvider, createHashRouter } from "react-router-dom";
import useWeb5Store from "./stores/useWeb5Store";
import { useEffect } from "react";
import Connect from "./pages/connect";
import Remedy from "./pages/remedy";
import MedicPage from "./pages/medic";
import Doctors from "./pages/nearbyDoctor";
import HomePage from "./pages/Home";
import SharedLayout from "./pages/SharedLayout/";
import Records from "./pages/Records";
import Chat from "./pages/Chat/";

const router = createHashRouter([
  {
    path: "/",
    element: <SharedLayout />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/records", element: <Records /> },
      { path: "/connect", element: <Connect /> },
      { path: "/remedies", element: <Remedy /> },
      { path: "/medic", element: <MedicPage /> },
      { path: "/contact", element: <Doctors /> },
      { path: "/chat", element: <Chat /> },
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

  return <>{web5 ? <RouterProvider router={router} /> : <div>Error</div>}</>;
}

export default App;
