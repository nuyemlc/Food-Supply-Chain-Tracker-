const express = require('express');
const cors = require('cors');
const db = require('./database');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.get('/foods', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM foods');
    res.json(rows);
  } catch (err) {
    console.error('SQL Query Error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
