import useWeb5Store from "../../stores/useWeb5Store";
import { useState, useEffect } from "react";

import "./index.css";
import { Outlet } from "react-router-dom";
import Navbar from "../../components/Navbar";
import MobileNavbar from "../../components/MobileNavbar";
import FootNavbar from "../../components/FootNavbar";

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
      <svg
        className="b-wave-m"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 320"
      >
        <path
          fill="#000"
          fill-opacity="1"
          d="M0,64L8.6,74.7C17.1,85,34,107,51,133.3C68.6,160,86,192,103,197.3C120,203,137,181,154,165.3C171.4,149,189,139,206,133.3C222.9,128,240,128,257,122.7C274.3,117,291,107,309,122.7C325.7,139,343,181,360,208C377.1,235,394,245,411,218.7C428.6,192,446,128,463,96C480,64,497,64,514,58.7C531.4,53,549,43,566,58.7C582.9,75,600,117,617,160C634.3,203,651,245,669,250.7C685.7,256,703,224,720,202.7C737.1,181,754,171,771,154.7C788.6,139,806,117,823,96C840,75,857,53,874,53.3C891.4,53,909,75,926,90.7C942.9,107,960,117,977,128C994.3,139,1011,149,1029,154.7C1045.7,160,1063,160,1080,149.3C1097.1,139,1114,117,1131,133.3C1148.6,149,1166,203,1183,192C1200,181,1217,107,1234,85.3C1251.4,64,1269,96,1286,112C1302.9,128,1320,128,1337,138.7C1354.3,149,1371,171,1389,192C1405.7,213,1423,235,1431,245.3L1440,256L1440,320L1431.4,320C1422.9,320,1406,320,1389,320C1371.4,320,1354,320,1337,320C1320,320,1303,320,1286,320C1268.6,320,1251,320,1234,320C1217.1,320,1200,320,1183,320C1165.7,320,1149,320,1131,320C1114.3,320,1097,320,1080,320C1062.9,320,1046,320,1029,320C1011.4,320,994,320,977,320C960,320,943,320,926,320C908.6,320,891,320,874,320C857.1,320,840,320,823,320C805.7,320,789,320,771,320C754.3,320,737,320,720,320C702.9,320,686,320,669,320C651.4,320,634,320,617,320C600,320,583,320,566,320C548.6,320,531,320,514,320C497.1,320,480,320,463,320C445.7,320,429,320,411,320C394.3,320,377,320,360,320C342.9,320,326,320,309,320C291.4,320,274,320,257,320C240,320,223,320,206,320C188.6,320,171,320,154,320C137.1,320,120,320,103,320C85.7,320,69,320,51,320C34.3,320,17,320,9,320L0,320Z"
        ></path>
      </svg>
      <FootNavbar />
    </div>
  );
};

export default index;
