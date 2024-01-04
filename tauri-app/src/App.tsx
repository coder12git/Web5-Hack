import { RouterProvider, createHashRouter } from "react-router-dom";
import useWeb5Store from "./stores/useWeb5Store";
import { useEffect } from "react";
import Home from "./pages/home";
import Connect from "./pages/connect";
import Remedy from "./pages/remedy";
import MedicPage from "./pages/medic";
import Doctors from "./pages/nearbyDoctor";
import HomePage from "./pages/Home";
import SharedLayout from "./pages/SharedLayout/";
import Records from "./pages/Records";
import Remedies from "./pages/Remedies";
import Chat from "./pages/Chat/";
import Contact from "./pages/Contact/";

const router = createHashRouter([
  {
    path: "/",
    element: <SharedLayout />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/records", element: <Records /> },
      { path: "/remedies", element: <Remedies /> },
      { path: "/connect", element: <Connect /> },
      { path: "/remedy", element: <Remedy /> },
      { path: "/medic", element: <MedicPage /> },
      { path: "/nearbyDoctors", element: <Doctors /> },
      { path: "/chat", element: <Chat /> },
      { path: "/contact", element: <Contact /> },
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

  return <>{true ? <RouterProvider router={router} /> : <div>Error</div>}</>;
}

export default App;
