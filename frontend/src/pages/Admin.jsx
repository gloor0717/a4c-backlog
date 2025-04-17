import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

const apiUrl = import.meta.env.VITE_API_URL;

export default function Admin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const navigate                = useNavigate();
  const { login }               = useContext(AuthContext);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch(`${apiUrl}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (!res.ok) throw new Error();
      const { token, role } = await res.json();

      login({ token, role, username });
      navigate("/");
    } catch {
      setError("Identifiants invalides");
    }
  };

  return (
    <main className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">🛠️ Connexion</h1>
      {error && <p className="text-red-600">{error}</p>}
      <form onSubmit={submit} className="space-y-4">
        <input
          type="text"
          placeholder="Nom d'utilisateur"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full px-3 py-2 border rounded"
          required
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-3 py-2 border rounded"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded"
        >
          Se connecter
        </button>
      </form>
    </main>
  );
}
