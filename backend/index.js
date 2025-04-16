const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const path = require("path");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// Create a connection pool for MySQL
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Optional: add an error event listener for the pool
pool.on("error", (err) => {
  console.error("MySQL Pool Error: ", err);
});

// API endpoints

// GET /ideas: Fetch all ideas
app.get("/ideas", (req, res) => {
  pool.query("SELECT * FROM ideas ORDER BY created_at DESC", (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

// POST /ideas: Add a new idea
app.post("/ideas", (req, res) => {
  const {
    usNumber,
    epic,
    story,
    criteria,
    priority,
    storyPoints,
    moscow,
    state,
  } = req.body;
  pool.query(
    `INSERT INTO ideas 
     (usNumber, epic, story, criteria, priority, storyPoints, moscow, upvotes, downvotes, state, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, 0, 0, ?, NOW())`,
    [usNumber, epic, story, criteria, priority, storyPoints, moscow, state],
    (err, results) => {
      if (err) return res.status(500).json({ error: err });
      res.status(201).json({ id: results.insertId });
    }
  );
});

// POST /ideas/:id/vote: Update vote count for an idea
app.post("/ideas/:id/vote", (req, res) => {
  const { id } = req.params;
  const { vote } = req.body;
  let column;

  if (vote === "up") {
    column = "upvotes";
  } else if (vote === "down") {
    column = "downvotes";
  } else {
    return res.status(400).json({ error: "Invalid vote type" });
  }

  const updateQuery = `UPDATE ideas SET ${column} = ${column} + 1 WHERE id = ?`;
  pool.query(updateQuery, [id], (err, updateResults) => {
    if (err) return res.status(500).json({ error: err });
    pool.query("SELECT * FROM ideas WHERE id = ?", [id], (err, selectResults) => {
      if (err) return res.status(500).json({ error: err });
      if (selectResults.length === 0) {
        return res.status(404).json({ error: "Idea not found" });
      }
      res.json(selectResults[0]);
    });
  });
});

// Serve the frontend build from the "frontend/dist" folder
app.use("/", express.static(path.join(__dirname, "frontend/dist")));

app.listen(process.env.PORT, () =>
  console.log("Server running on port " + process.env.PORT)
);
