import { useState } from "react";

const apiUrl = import.meta.env.VITE_API_URL;

export default function Submit() {
  const [story, setStory] = useState("");
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    try {
      const res = await fetch(`${apiUrl}/ideas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ story }),       // ← only story!
      });
      if (!res.ok) throw new Error("Erreur lors de la soumission");

      await res.json();
      setMessage("Votre idée a bien été ajoutée au backlog !");
      setStory("");
    } catch (err) {
      console.error(err);
      setError("Il y a eu une erreur. Veuillez réessayer.");
    }
  };

  return (
    <main className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-4">💡 Envoyer une nouvelle idée</h1>
      <p className="text-gray-600 mb-6">
        Cette page vous permet de suggérer de nouvelles fonctionnalités ou idées.
      </p>

      {message && <p className="mb-4 text-green-600">{message}</p>}
      {error && <p className="mb-4 text-red-600">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Votre idée ou fonctionnalité
          </label>
          <textarea
            value={story}
            onChange={(e) => setStory(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded shadow-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="4"
            placeholder="Ex : En tant que [rôle], je souhaite [action] afin de [objectif]"
            required
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Soumettre
        </button>
      </form>
    </main>
  );
}
