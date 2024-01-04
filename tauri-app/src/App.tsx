import { Route, Routes, BrowserRouter } from "react-router-dom";

import SharedLayout from "./pages/SharedLayout/";
import Home from "./pages/Home/";
import Records from "./pages/Records/";
import Remedies from "./pages/Remedies/";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="" element={<SharedLayout />}>
            <Route path="" element={<Home />} />
            <Route path="records" element={<Records />} />
            <Route path="remedies" element={<Remedies />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
