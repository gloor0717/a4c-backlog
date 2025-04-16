import { Link } from "react-router-dom";
import { useState } from "react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-white border-b shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
        <div className="text-xl font-semibold text-blue-600">All4Backlog</div>

        <button
          className="md:hidden text-gray-800"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
            />
          </svg>
        </button>

        <ul className="hidden md:flex space-x-6 text-sm font-medium">
          <li><Link to="/" className="hover:text-blue-500">Backlog</Link></li>
          <li><Link to="/ajouter" className="hover:text-blue-500">Ajouter</Link></li>
          <li><Link to="/connexion" className="hover:text-blue-500">Connexion</Link></li>
        </ul>
      </div>

      {menuOpen && (
        <ul className="md:hidden px-4 pb-4 space-y-2 text-sm font-medium">
          <li><Link to="/" onClick={() => setMenuOpen(false)} className="block hover:text-blue-500">Backlog</Link></li>
          <li><Link to="/ajouter" onClick={() => setMenuOpen(false)} className="block hover:text-blue-500">Ajouter</Link></li>
          <li><Link to="/connexion" onClick={() => setMenuOpen(false)} className="block hover:text-blue-500">Connexion</Link></li>
        </ul>
      )}
    </nav>
  );
}
