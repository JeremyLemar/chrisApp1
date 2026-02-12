const path = require('path');
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

const items = [
  'Apple', 'Banana', 'Cherry', 'Date', 'Elderberry',
  'Fig', 'Grape', 'Honeydew', 'Kiwi', 'Lemon',
  'Mango', 'Nectarine', 'Orange', 'Papaya', 'Quince',
  'Raspberry', 'Strawberry', 'Tangerine', 'Watermelon'
];

app.get('/api/search', (req, res) => {
  const query = (req.query.q || '').trim();
  if (!query) {
    return res.json({ results: [] });
  }
  const count = Math.floor(Math.random() * items.length) + 1;
  const shuffled = [...items].sort(() => Math.random() - 0.5);
  const results = shuffled.slice(0, count);
  res.json({ results });
});

app.use(express.static(path.join(__dirname, 'public')));

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
