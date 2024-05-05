import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./Home";
import Zones from "./zones/Zones";
import Zone from "./zones/Zone";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/zones" element={<Zones />} />
        <Route path="/zone">
          <Route path=":zone" element={<Zone />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
