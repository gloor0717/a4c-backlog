import { Link, useNavigate } from "react-router-dom";
import { useState, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout }        = useContext(AuthContext);
  const navigate                = useNavigate();

  const guestLinks = (
    <>
      <li><Link to="/">Backlog</Link></li>
      <li><Link to="/ajouter">Ajouter</Link></li>
      <li><Link to="/connexion">Connexion</Link></li>
      <li><Link to="/enregistrement">S'enregistrer</Link></li>
    </>
  );

  const userLinks = (
    <>
      <li><Link to="/">Backlog</Link></li>
      <li><Link to="/ajouter">Ajouter</Link></li>
      <li>
        <button onClick={() => { logout(); navigate("/connexion"); }}>
          Déconnexion
        </button>
      </li>
    </>
  );

  return (
    <nav className="bg-white border-b shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <div className="text-xl font-semibold text-blue-600">All4Backlog</div>
        <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
        </button>

        <ul className="hidden md:flex space-x-6 items-center">
          { user ? userLinks : guestLinks }
          { user && (
            <li className="text-gray-600">
              Salut <span className="font-semibold">{user.role}</span>{" "}
              <span className="italic">{user.username}</span>
            </li>
          )}
        </ul>
      </div>

      {menuOpen && (
        <ul className="md:hidden px-4 pb-4 space-y-2">
          { user ? userLinks : guestLinks }
          { user && (
            <li className="text-gray-600">
              Salut <span className="font-semibold">{user.role}</span>{" "}
              <span className="italic">{user.username}</span>
            </li>
          )}
        </ul>
      )}
    </nav>
  );
}
