import { useState, useEffect } from "react";

// 🎨 Styling helpers for badge colors
const badgeColors = {
  High: "bg-red-500",
  Medium: "bg-yellow-400",
  Low: "bg-green-400",
  XS: "bg-gray-200",
  S: "bg-gray-300",
  M: "bg-blue-200",
  L: "bg-blue-400",
  XL: "bg-blue-600",
  Must: "bg-red-400",
  Should: "bg-yellow-300",
  Could: "bg-green-300"
};

// Vite exposes env variables with the VITE_ prefix
const apiUrl = import.meta.env.VITE_API_URL;

export default function Home() {
  // Start with an empty list (data is loaded from the API)
  const [backlog, setBacklog] = useState([]);
  const [sortBy, setSortBy] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");
  const [search, setSearch] = useState("");

  // Fetch data from the API when the component mounts
  useEffect(() => {
    fetch(`${apiUrl}/ideas`)
      .then((response) => response.json())
      .then((data) => setBacklog(data))
      .catch((error) =>
        console.error("Error fetching backlog data from the API:", error)
      );
  }, []);

  // Sorting logic (with toggling)
  const sortedBacklog = [...backlog].sort((a, b) => {
    if (!sortBy) return 0;
    const aVal = a[sortBy].toString().toLowerCase();
    const bVal = b[sortBy].toString().toLowerCase();
    return sortDirection === "asc"
      ? aVal.localeCompare(bVal)
      : bVal.localeCompare(aVal);
  });

  // Filter by search text on the user story
  const filteredBacklog = sortedBacklog.filter((item) =>
    item.story.toLowerCase().includes(search.toLowerCase())
  );

  // Voting logic: send a vote action to the backend, and update the corresponding item in state.
  const vote = (id, type) => {
    fetch(`${apiUrl}/ideas/${id}/vote`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ vote: type })
    })
      .then((response) => response.json())
      .then((updatedItem) => {
        setBacklog((prev) =>
          prev.map((item) => (item.id === updatedItem.id ? updatedItem : item))
        );
      })
      .catch((error) => console.error("Error updating vote:", error));
  };

  // Toggle sorting when a header is clicked
  const handleSort = (key) => {
    if (sortBy === key) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(key);
      setSortDirection("asc");
    }
  };

  // Define the header configuration, including min-width for "User Story" and "Acceptance Criteria"
  const headers = [
    { label: "US Nb", key: "usNumber", nowrap: true },
    { label: "Epic", key: "epic", nowrap: false },
    { label: "User Story", key: "story", nowrap: false, minW: true },
    { label: "Acceptance Criteria", key: "criteria", nowrap: false, minW: true },
    { label: "Priority", key: "priority", nowrap: true },
    { label: "Points", key: "storyPoints", nowrap: true },
    { label: "MoSCoW", key: "moscow", nowrap: true },
    { label: "👍", key: null, nowrap: true },
    { label: "👎", key: null, nowrap: true },
    { label: "State", key: "state", nowrap: true }
  ];

  return (
    <main className="max-w-7xl mx-auto px-4 py-8 overflow-x-auto">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold">📋 Backlog</h1>
        <input
          type="text"
          placeholder="Search stories..."
          className="w-full sm:w-64 px-3 py-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="text-sm text-gray-700 overflow-x-auto">
        <table className="min-w-full bg-white border rounded-lg shadow">
          <thead>
            <tr className="bg-gray-100">
              {headers.map(({ label, key, nowrap, minW }) => (
                <th
                  key={label}
                  onClick={() => key && handleSort(key)}
                  className={`px-4 py-3 font-semibold cursor-pointer select-none ${
                    nowrap ? "whitespace-nowrap" : ""
                  } ${minW ? "min-w-[200px]" : ""}`}
                >
                  <div className="flex items-center justify-between">
                    <span>{label}</span>
                    {key && (
                      <span className="ml-2 inline-flex items-center">
                        {sortBy === key ? (
                          sortDirection === "asc" ? (
                            <svg
                              className="w-4 h-4 text-blue-600"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M5 15l7-7 7 7"
                              />
                            </svg>
                          ) : (
                            <svg
                              className="w-4 h-4 text-blue-600"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M19 9l-7 7-7-7"
                              />
                            </svg>
                          )
                        ) : (
                          <svg
                            className="w-4 h-4 opacity-50"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M7 10l5-5 5 5M7 14l5 5 5-5"
                            />
                          </svg>
                        )}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredBacklog.map((item) => (
              <tr
                key={item.id}
                className="border-t hover:bg-gray-50 transition"
              >
                <td className="px-4 py-3 font-mono whitespace-nowrap">
                  {item.usNumber}
                </td>
                <td className="px-4 py-3">{item.epic}</td>
                {/* Add min-width for User Story */}
                <td className="px-4 py-3 min-w-[200px]">{item.story}</td>
                {/* Add min-width for Acceptance Criteria */}
                <td className="px-4 py-3 min-w-[200px]">{item.criteria}</td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span
                    className={`text-white px-2 py-1 rounded text-xs ${badgeColors[item.priority]}`}
                  >
                    {item.priority}
                  </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span
                    className={`text-white px-2 py-1 rounded text-xs ${badgeColors[item.storyPoints]}`}
                  >
                    {item.storyPoints}
                  </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span
                    className={`text-white px-2 py-1 rounded text-xs ${badgeColors[item.moscow]}`}
                  >
                    {item.moscow}
                  </span>
                </td>
                <td className="px-4 py-3 text-center whitespace-nowrap">
                  <button
                    onClick={() => vote(item.id, "up")}
                    className="text-green-600 hover:text-green-800 hover:scale-110 transition"
                    title="Upvote"
                  >
                    {item.upvotes} ▲
                  </button>
                </td>
                <td className="px-4 py-3 text-center whitespace-nowrap">
                  <button
                    onClick={() => vote(item.id, "down")}
                    className="text-red-600 hover:text-red-800 hover:scale-110 transition"
                    title="Downvote"
                  >
                    {item.downvotes} ▼
                  </button>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className="inline-block bg-gray-200 text-gray-800 px-2 py-1 rounded text-xs">
                    {item.state}
                  </span>
                </td>
              </tr>
            ))}
            {filteredBacklog.length === 0 && (
              <tr>
                <td colSpan="10" className="text-center py-6 text-gray-400">
                  No matching user stories found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
