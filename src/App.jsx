import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/header/Header";
import Layout from "./components/layout/Layout";

function App() {
  return (
    <Router basename="/StellarView">
      <Routes>
        <Route path="/" element={<Layout />} />
        <Route path="/apod" element={<Layout section="apod" />} />
        <Route path="/mars" element={<Layout section="mars" />} />
        <Route path="/earth" element={<Layout section="earth" />} />
      </Routes>
    </Router>
  );
}

export default App;
