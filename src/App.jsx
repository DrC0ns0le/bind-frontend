import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./Home";
import Zones from "./zones/Zones";
import Zone from "./zones/Zone";
import Apply from "./Apply";
import WrongPage from "./Errors";
import { NotificationProviderWithStyles } from "./components/Alert";

function App() {
  return (
    <NotificationProviderWithStyles>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/zones" element={<Zones />} />
          <Route path="/zone">
            <Route path=":zone" element={<Zone />} />
          </Route>
          <Route path="/apply" element={<Apply />} />
          <Route path="*" element={<WrongPage />} />
        </Routes>
      </Router>
    </NotificationProviderWithStyles>
  );
}

export default App;
