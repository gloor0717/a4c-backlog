import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar";
import Home from "./pages/Home";
import Submit from "./pages/Submit";
import Admin from "./pages/Admin";
import Register from "./pages/Register";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/enregistrement" element={<Register />} />
        <Route path="/" element={<Home />} />
        <Route path="/ajouter" element={<Submit />} />
        <Route path="/connexion" element={<Admin />} />
      </Routes>
    </Router>
  );
}

export default App;
