import useWeb5Store from "../../stores/useWeb5Store";
import { useState, useEffect } from "react";

import "./index.css";
import { Outlet } from "react-router-dom";
import Navbar from "../../../components/Navbar/";
import MobileNavbar from "../../../components/MobileNavbar/";

const index = () => {
  const web5 = useWeb5Store((state) => state.web5);
  const connect = useWeb5Store((state) => state.connect);
  const did = useWeb5Store((state) => state.did);

  useEffect(() => {
    if (!web5) connect();
  }, []);

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (window.innerWidth < 750) {
      setIsMobile(true);
      return;
    }

    setIsMobile(false);
  }, []);

  return (
    <div>
      <Navbar />
      <section>
        <Outlet />
      </section>
      {isMobile && <MobileNavbar />}
    </div>
  );
};

export default index;
