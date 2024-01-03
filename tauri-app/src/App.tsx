import { RouterProvider, createHashRouter } from "react-router-dom";
import useWeb5Store from "./stores/useWeb5Store";
import { useEffect } from "react";
import Home from "./pages/home";
import Connect from "./pages/connect";
import Remedy from "./pages/remedy";
import MedicPage from "./pages/medic";
import Doctors from "./pages/nearbyDoctor";

const router = createHashRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/connect",
    element: <Connect />,
  },
  {
    path: "/remedy",
    element: <Remedy />,
  },
  {
    path: "/medic",
    element: <MedicPage />,
  },
  {
    path: "/nearbyDoctors",
    element: <Doctors />,
  }
]);

function App() {
  const web5 = useWeb5Store((state) => state.web5);
  const connect = useWeb5Store((state) => state.connect);
  // const did = useWeb5Store((state) => state.did);

  useEffect(() => {
    if (!web5) connect();
  }, []);

  return <>{web5 ? <RouterProvider router={router} /> : <div>error</div>}</>;
 
}

export default App;
