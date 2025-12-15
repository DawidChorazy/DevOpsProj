const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

let scores = { X: 0, O: 0, D: 0 };

app.get('/api/scores', (req, res) => {
  res.json(scores);
});

app.post('/api/scores', (req, res) => {
  const { winner } = req.body;
  if (winner === 'X') scores.X += 1;
  else if (winner === 'O') scores.O += 1;
  else if (winner === 'D') scores.D += 1;
  res.json(scores);
});

app.post('/api/reset-scores', (req, res) => {
  scores = { X: 0, O: 0, D: 0 };
  res.json(scores);
});

app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});