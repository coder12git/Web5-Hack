import useWeb5Store from "./stores/useWeb5Store";
import { useEffect } from "react";

function App() {
  const web5 = useWeb5Store((state) => state.web5);
  const connect = useWeb5Store((state) => state.connect);
  const did = useWeb5Store((state) => state.did);

  useEffect(() => {
    if (!web5) connect();
  }, []);

  return (
    <div>
      {did}
    </div>
  )
}

export default App;
