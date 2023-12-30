import { Route, Routes, BrowserRouter } from "react-router-dom";

import SharedLayout from "./pages/SharedLayout/";
import Home from "./pages/Home/";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="" element={<SharedLayout />}>
            <Route path="" element={<Home />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
