import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar";
import Home from "./pages/Home";
import Submit from "./pages/Submit";
import Admin from "./pages/Admin";
import Register from "./pages/Register";
import Footer from "./components/footer";

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />

        <div className="flex-grow">
          <Routes>
            <Route path="/enregistrement" element={<Register />} />
            <Route path="/" element={<Home />} />
            <Route path="/ajouter" element={<Submit />} />
            <Route path="/connexion" element={<Admin />} />
          </Routes>
        </div>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
