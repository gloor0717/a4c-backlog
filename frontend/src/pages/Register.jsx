import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const apiUrl = import.meta.env.VITE_API_URL;

export default function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole]         = useState('po');
  const [error, setError]       = useState(null);
  const [message, setMessage]   = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    try {
      const res = await fetch(`${apiUrl}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type':'application/json' },
        body: JSON.stringify({ username, password, role })
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Registration failed');
      setMessage('Registration successful! You can now log in.');
      // Optionally redirect to login:
      setTimeout(() => navigate('/admin'), 1500);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <main className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">📝 Register</h1>
      {error && <p className="mb-4 text-red-600">{error}</p>}
      {message && <p className="mb-4 text-green-600">{message}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Username</label>
          <input
            type="text"
            value={username}
            onChange={e=>setUsername(e.target.value)}
            required
            className="mt-1 w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Password</label>
          <input
            type="password"
            value={password}
            onChange={e=>setPassword(e.target.value)}
            required
            className="mt-1 w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Role</label>
          <select
            value={role}
            onChange={e=>setRole(e.target.value)}
            className="mt-1 w-full border rounded px-3 py-2"
          >
            <option value="po">Product Owner</option>
            <option value="developer">Developer</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Register
        </button>
      </form>
    </main>
  );
}
