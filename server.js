const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DB_PATH = path.join(__dirname, '.data', 'db.json');

app.use(express.json());
app.use(express.static('public'));

function ensureDB() {
  const dir = path.join(__dirname, '.data');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir);
  if (!fs.existsSync(DB_PATH)) {
    const initial = { stars: [0, 0], history: [] };
    fs.writeFileSync(DB_PATH, JSON.stringify(initial, null, 2));
  }
}

function readDB() {
  ensureDB();
  try {
    return JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
  } catch(e) {
    return { stars: [0, 0], history: [] };
  }
}

function writeDB(data) {
  ensureDB();
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

app.get('/api/state', (req, res) => {
  res.json(readDB());
});

app.post('/api/state', (req, res) => {
  const { stars, history } = req.body;
  if (!Array.isArray(stars) || stars.length !== 2) {
    return res.status(400).json({ error: 'Invalid state' });
  }
  const data = { stars, history: history || [] };
  writeDB(data);
  res.json({ ok: true });
});

app.listen(PORT, () => {
  console.log(`⭐ Star Power running on port ${PORT}`);
});
