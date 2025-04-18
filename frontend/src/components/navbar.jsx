import { Link, useNavigate } from "react-router-dom";
import { useState, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  // shared links
  const commonLinks = user
    ? [
        { to: "/", label: "Backlog" },
        { to: "/ajouter", label: "Ajouter" },
      ]
    : [
        { to: "/", label: "Backlog" },
        { to: "/ajouter", label: "Ajouter" },
        { to: "/connexion", label: "Connexion" },
      ];

  return (
    <nav className="bg-white border-b shadow sticky top-0 z-50 font-sans">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* logo + title */}
        <Link to="/" className="flex items-center space-x-1">
          <img src="/all4club.svg" alt="Logo" className="h-8" />
          <span className="text-xl font-bold text-dark">
            All<span className="text-primary">4</span>Backlog
          </span>
        </Link>

        {/* desktop */}
        <ul className="hidden md:flex items-center space-x-6 text-dark">
          {commonLinks.map(({ to, label }) => (
            <li key={label}>
              <Link to={to} className="hover:text-primary transition">
                {label}
              </Link>
            </li>
          ))}
          {user && (
            <li>
              <button
                onClick={() => {
                  logout();
                  navigate("/connexion");
                }}
                className="hover:text-red-600 transition"
              >
                Déconnexion
              </button>
            </li>
          )}
          {user && (
            <li className="pl-4 border-l border-gray-200">
              <span className="text-dark">
                Salut <span className="font-semibold">{user.role}</span>{" "}
                <span className="italic">{user.username}</span>
              </span>
            </li>
          )}
        </ul>

        {/* mobile hamburger */}
        <button
          className="md:hidden p-2 text-dark"
          onClick={() => setMenuOpen(true)}
          aria-label="Open menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>

      {menuOpen && (
        <div
          className="fixed inset-0 z-40"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          onClick={() => setMenuOpen(false)}
        />
      )}

      <div
        className={`
          fixed inset-y-0 right-0 w-64 bg-white shadow-lg transform
          ${menuOpen ? "translate-x-0" : "translate-x-full"}
          transition-transform duration-300 ease-in-out z-50
        `}
      >
        <div className="flex justify-end p-4">
          <button
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
            className="p-2 text-dark"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <ul className="flex flex-col space-y-4 px-6">
          {commonLinks.map(({ to, label }) => (
            <li key={label}>
              <Link
                to={to}
                onClick={() => setMenuOpen(false)}
                className="block text-lg text-dark hover:text-primary transition"
              >
                {label}
              </Link>
            </li>
          ))}
          {user && (
            <li>
              <button
                onClick={() => {
                  logout();
                  setMenuOpen(false);
                  navigate("/connexion");
                }}
                className="text-lg text-red-500 hover:text-red-700 transition"
              >
                Déconnexion
              </button>
            </li>
          )}
          {user && (
            <li className="pt-4 text-dark">
              Salut <span className="font-semibold">{user.role}</span>{" "}
              <span className="italic">{user.username}</span>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
}
