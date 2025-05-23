import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import EditModal from "../components/editModal";

// 1) Centralize your colour maps by category
const PRIORITY_COLORS = {
  "non défini": "bg-gray-400",
  Bas: "bg-green-400",
  Moyen: "bg-yellow-400",
  Élevé: "bg-red-500",
};

const POINTS_COLORS = {
  "?": "bg-gray-400",
  XS: "bg-gray-200",
  S: "bg-gray-300",
  M: "bg-blue-200",
  L: "bg-blue-400",
  XL: "bg-blue-600",
};

const MOSCOW_COLORS = {
  "à définir": "bg-gray-400",
  "Doit-avoir": "bg-red-400",
  "Devrait-avoir": "bg-yellow-300",
  "Pourrait-avoir": "bg-green-300",
  "N'aura pas": "bg-gray-500",
};

const STATE_COLORS = {
  "à valider": "bg-indigo-200",
  "en cours": "bg-blue-300",
  terminé: "bg-green-300",
  "à archiver": "bg-gray-500",
};

const PRIORITY_ORDER = {
  Élevé: 1,
  Moyen: 2,
  Bas: 3,
  "non défini": 4,
};

// default fallback
const DEFAULT_BADGE = "bg-gray-400";

// 2) helper to pick the right map
function getBadgeClass(type, value) {
  let map;
  switch (type) {
    case "priority":
      map = PRIORITY_COLORS;
      break;
    case "storyPoints":
      map = POINTS_COLORS;
      break;
    case "moscow":
      map = MOSCOW_COLORS;
      break;
    case "state":
      map = STATE_COLORS;
      break;
    default:
      return DEFAULT_BADGE;
  }
  return map[value] || DEFAULT_BADGE;
}

export default function Home() {
  const { user } = useContext(AuthContext);
  const isAdmin = user?.role === "admin";
  const apiUrl = import.meta.env.VITE_API_URL;

  const [backlog, setBacklog] = useState([]);
  const [sortBy, setSortBy] = useState("usNumber");
  const [sortDirection, setSortDirection] = useState("asc");
  const [search, setSearch] = useState("");

  // modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    fetch(`${apiUrl}/ideas`)
      .then((r) => r.json())
      .then(setBacklog)
      .catch(console.error);
  }, []);

  function openEdit(item) {
    setSelected(item);
    setModalOpen(true);
  }
  function closeEdit() {
    setModalOpen(false);
    setSelected(null);
  }

  async function handleSave(updatedValues) {
    try {
      const res = await fetch(`${apiUrl}/ideas/${selected.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(updatedValues),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || res.statusText);
      }
      const updated = await res.json();
      setBacklog((bs) => bs.map((i) => (i.id === updated.id ? updated : i)));
      closeEdit();
    } catch (e) {
      console.error(e);
      alert("Erreur lors de la sauvegarde : " + e.message);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Supprimer définitivement cette idée ?")) return;
    try {
      const res = await fetch(`${apiUrl}/ideas/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || res.statusText);
      }
      // remove locally
      setBacklog((bs) => bs.filter((i) => i.id !== id));
    } catch (e) {
      console.error(e);
      alert("Erreur lors de la suppression : " + e.message);
    }
  }

  function handleSort(key) {
    if (sortBy === key) {
      setSortDirection((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(key);
      setSortDirection("asc");
    }
  }

async function handleVote(id) {
  try {
    const res = await fetch(`${apiUrl}/ideas/${id}/vote`, {
      method: "POST",
    });
    if (res.status === 409) {
      alert("Vous avez déjà voté pour cette idée.");
      return;
    }
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || res.statusText);
    }
    const updated = await res.json();
    setBacklog(bs => bs.map(i => (i.id === updated.id ? updated : i)));
  } catch (e) {
    console.error(e);
    alert("Erreur lors du vote : " + e.message);
  }
}


  const baseHeaders = [
    { label: "US", key: "usNumber", nowrap: true },
    { label: "Catégorie", key: "epic" },
    { label: "User Story", key: "story", minW: true },
    { label: "Critères", key: "criteria", minW: true },
    { label: "Priorité", key: "priority", nowrap: true },
    { label: "Points", key: "storyPoints", nowrap: true },
    { label: "MoSCoW", key: "moscow", nowrap: true },
    { label: "État", key: "state", nowrap: true },
    { label: "Votes", key: "votes", nowrap: true },
  ];
  const headers = isAdmin
    ? [...baseHeaders, { label: "Actions", key: null, nowrap: true }]
    : baseHeaders;

  const sorted = [...backlog].sort((a, b) => {
    let aV = a[sortBy];
    let bV = b[sortBy];

    if (sortBy === "priority") {
      const aRank = PRIORITY_ORDER[aV] ?? 999;
      const bRank = PRIORITY_ORDER[bV] ?? 999;
      return sortDirection === "asc" ? aRank - bRank : bRank - aRank;
    }

    if (sortBy === "votes") {
      return sortDirection === "asc" ? a.votes - b.votes : b.votes - a.votes;
    }

    aV = (aV || "").toString().toLowerCase();
    bV = (bV || "").toString().toLowerCase();
    return sortDirection === "asc"
      ? aV.localeCompare(bV)
      : bV.localeCompare(aV);
  });
  const filtered = sorted.filter((i) =>
    i.story.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="max-w-7xl mx-auto px-4 py-8 overflow-x-auto">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold">📋 Backlog</h1>
        <input
          type="text"
          placeholder="Rechercher..."
          className="w-full sm:w-64 px-3 py-2 border rounded"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <table className="min-w-full bg-white border rounded-lg shadow">
        <thead>
          <tr className="bg-gray-100">
            {headers.map(({ label, key, nowrap, minW }) => (
              <th
                key={label}
                onClick={() => key && handleSort(key)}
                className={`
                  px-4 py-3 font-semibold
                  ${nowrap ? "whitespace-nowrap" : ""}
                  ${minW ? "min-w-[200px]" : ""}
                  cursor-pointer select-none
                `}
              >
                <div className="flex items-center justify-between">
                  <span>{label}</span>
                  {key && (
                    <span className="ml-2">
                      {sortBy === key
                        ? sortDirection === "asc"
                          ? "▲"
                          : "▼"
                        : "⇅"}
                    </span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filtered.map((item) => (
            <tr key={item.id} className="border-t hover:bg-gray-50 transition">
              <td className="px-4 py-3 font-mono whitespace-nowrap">
                {item.usNumber}
              </td>
              <td className="px-4 py-3">{item.epic}</td>
              <td className="px-4 py-3 min-w-[200px]">{item.story}</td>
              <td className="px-4 py-3 min-w-[200px]">{item.criteria}</td>
              <td className="px-4 py-3 whitespace-nowrap">
                <span
                  className={`text-white px-2 py-1 rounded text-xs ${getBadgeClass(
                    "priority",
                    item.priority
                  )}`}
                >
                  {item.priority}
                </span>
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                <span
                  className={`text-white px-2 py-1 rounded text-xs ${getBadgeClass(
                    "storyPoints",
                    item.storyPoints
                  )}`}
                >
                  {item.storyPoints}
                </span>
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                <span
                  className={`text-white px-2 py-1 rounded text-xs ${getBadgeClass(
                    "moscow",
                    item.moscow
                  )}`}
                >
                  {item.moscow}
                </span>
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                <span
                  className={`text-white px-2 py-1 rounded text-xs ${getBadgeClass(
                    "state",
                    item.state
                  )}`}
                >
                  {item.state}
                </span>
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-center">
                <button
                  onClick={() => handleVote(item.id)}
                  className="text-dark hover:border-primary p-2 rounded border"
                  title="Voter"
                >
                  👍 {item.votes}
                </button>
              </td>
              {isAdmin && (
                <td className="px-4 py-3 whitespace-nowrap space-x-2">
                  <button
                    onClick={() => openEdit(item)}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-800 p-2 rounded"
                    title="Modifier"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="bg-red-100 hover:bg-red-200 text-red-800 p-2 rounded"
                    title="Supprimer"
                  >
                    🗑️
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      <EditModal
        isOpen={modalOpen}
        onClose={closeEdit}
        initialData={selected}
        onSave={handleSave}
      />
    </main>
  );
}
