const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const path = require("path");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();

const app = express();
const allowedOrigins = ["http://localhost:5173", "https://backlog.a4c.ch"];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      callback(new Error("CORS policy: This origin is not allowed"));
    },
  })
);

app.use(express.json());

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  charset: "utf8mb4",
});

pool.on("error", (err) => {
  console.error("MySQL Pool Error: ", err);
});

// Fetch all ideas
app.get("/ideas", (req, res) => {
  pool.query("SELECT * FROM ideas ORDER BY created_at DESC", (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

// Insert only `story` — let MySQL defaults fill the rest
app.post("/ideas", (req, res) => {
  const { story } = req.body;

  console.log("🔧 POST /ideas – body:", story);

  pool.query(
    `INSERT INTO ideas (story) VALUES (?)`,
    [story],
    (err, results) => {
      if (err) return res.status(500).json({ error: err });

      const newId   = results.insertId;
      const usNumber = `US-${String(newId).padStart(3, "0")}`;

      pool.query(
        `UPDATE ideas SET usNumber = ? WHERE id = ?`,
        [usNumber, newId],
        (err) => {
          if (err) return res.status(500).json({ error: err });

          pool.query(
            `SELECT * FROM ideas WHERE id = ?`,
            [newId],
            (err, rows) => {
              if (err) return res.status(500).json({ error: err });
              res.status(201).json(rows[0]);
            }
          );
        }
      );
    }
  );
});

// PUT /ideas/:id — full update (admin only)
app.put("/ideas/:id", authenticate, (req, res) => {
  const { role } = req.user;
  if (role !== "admin") {
    return res.status(403).json({ error: "Forbidden" });
  }

  const { id } = req.params;
  // pull only the fields we allow
  const { epic, story, criteria, priority, storyPoints, moscow, state } = req.body;


  // build dynamic SET clause
  const fields = [];
  const values = [];

  if (epic !== undefined)       { fields.push("epic = ?");       values.push(epic); }
  if (story !== undefined)      { fields.push("story = ?");      values.push(story); }
  if (criteria !== undefined)   { fields.push("criteria = ?");   values.push(criteria); }
  if (priority !== undefined)   { fields.push("priority = ?");   values.push(priority); }
  if (storyPoints !== undefined){ fields.push("storyPoints = ?");values.push(storyPoints); }
  if (moscow !== undefined)     { fields.push("moscow = ?");     values.push(moscow); }
  if (state !== undefined)      { fields.push("state = ?");      values.push(state); }

  if (fields.length === 0) {
    return res.status(400).json({ error: "No fields to update" });
  }

  const sql = `UPDATE ideas SET ${fields.join(", ")} WHERE id = ?`;
  values.push(id);

  pool.query(sql, values, (err) => {
    if (err) return res.status(500).json({ error: err });
    pool.query("SELECT * FROM ideas WHERE id = ?", [id], (err2, rows) => {
      if (err2) return res.status(500).json({ error: err2 });
      res.json(rows[0]);
    });
  });
});

app.post("/auth/register", async (req, res) => {
  const { username, password, role } = req.body;
  if (!username || !password || !role) {
    return res
      .status(400)
      .json({ error: "username, password and role are required" });
  }

  if (!["admin", "po", "developer"].includes(role)) {
    return res.status(400).json({ error: "Invalid role" });
  }

  try {
    const hash = await bcrypt.hash(password, 10);

    pool.query(
      "INSERT INTO users (username, password, role) VALUES (?, ?, ?)",
      [username, hash, role],
      (err, results) => {
        if (err) {
          if (err.code === "ER_DUP_ENTRY") {
            return res.status(409).json({ error: "Username already taken" });
          }
          return res.status(500).json({ error: err });
        }
        res.status(201).json({ message: "User registered" });
      }
    );
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/auth/login", (req, res) => {
  const { username, password } = req.body;
  pool.query(
    "SELECT * FROM users WHERE username = ?",
    [username],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err });
      if (rows.length === 0)
        return res.status(401).json({ error: "Invalid credentials" });

      const user = rows[0];
      bcrypt.compare(password, user.password).then((match) => {
        if (!match)
          return res.status(401).json({ error: "Invalid credentials" });
        const token = jwt.sign(
          { id: user.id, role: user.role },
          process.env.JWT_SECRET,
          { expiresIn: "2h" }
        );
        res.json({ token, role: user.role });
      });
    }
  );
});

function authenticate(req, res, next) {
  const auth = req.headers.authorization?.split(" ")[1];
  if (!auth) return res.status(401).end();
  jwt.verify(auth, process.env.JWT_SECRET, (err, payload) => {
    if (err) return res.status(401).end();
    req.user = payload;
    next();
  });
}

app.put("/ideas/:id/priority", authenticate, (req, res) => {
  const { role } = req.user;
  if (!(role === "po" || role === "admin")) {
    return res.status(403).json({ error: "Forbidden" });
  }
  const { id } = req.params;
  const { priority } = req.body;
  pool.query(
    `UPDATE ideas SET priority = ? WHERE id = ?`,
    [priority, id],
    (err) => {
      if (err) return res.status(500).json({ error: err });
      res.status(204).end();
    }
  );
});

app.use("/", express.static(path.join(__dirname, "frontend/dist")));

app.listen(process.env.PORT, () =>
  console.log("Server running on port " + process.env.PORT)
);
