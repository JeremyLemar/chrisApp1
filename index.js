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

app.get('/', (req, res) => {
  res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Search</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #f5f5f5;
      display: flex;
      justify-content: center;
      padding-top: 80px;
      min-height: 100vh;
    }
    .container { width: 100%; max-width: 560px; padding: 0 16px; }
    h1 { text-align: center; margin-bottom: 24px; color: #333; }
    .search-box {
      position: relative;
      width: 100%;
    }
    .search-box input {
      width: 100%;
      padding: 12px 16px 12px 42px;
      font-size: 16px;
      border: 2px solid #ddd;
      border-radius: 8px 0 0 8px;
      outline: none;
      transition: border-color 0.2s;
    }
    .search-box input:focus { border-color: #4a90d9; }
    .search-box button {
      position: absolute;
      right: 0;
      top: 0;
      height: 100%;
      padding: 0 20px;
      font-size: 16px;
      background: #4a90d9;
      color: #fff;
      border: none;
      border-radius: 0 8px 8px 0;
      cursor: pointer;
      transition: background 0.2s;
    }
    .search-box button:hover { background: #357abd; }
    .search-box svg {
      position: absolute;
      left: 14px;
      top: 50%;
      transform: translateY(-50%);
      width: 18px;
      height: 18px;
      fill: #999;
    }
    .results {
      margin-top: 16px;
      background: #fff;
      border-radius: 8px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
      overflow: hidden;
    }
    .results:empty { display: none; }
    .result-item {
      padding: 12px 16px;
      border-bottom: 1px solid #eee;
      color: #333;
    }
    .result-item:last-child { border-bottom: none; }
    .no-results { padding: 12px 16px; color: #999; }
  </style>
</head>
<body>
  <div class="container">
    <h1>Search</h1>
    <div class="search-box">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27A6.47 6.47 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
      <input type="text" id="searchInput" placeholder="Search items..." autofocus>
      <button id="searchBtn">Search</button>
    </div>
    <div class="results" id="results"></div>
  </div>
  <script>
    const input = document.getElementById('searchInput');
    const resultsDiv = document.getElementById('results');
    const searchBtn = document.getElementById('searchBtn');

    searchBtn.addEventListener('click', doSearch);
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') doSearch();
    });

    async function doSearch() {
      const query = input.value.trim();
      if (!query) {
        resultsDiv.innerHTML = '';
        return;
      }
      try {
        const resp = await fetch('/api/search?q=' + encodeURIComponent(query));
        const data = await resp.json();
        if (data.results.length === 0) {
          resultsDiv.innerHTML = '<div class="no-results">No results found</div>';
        } else {
          resultsDiv.innerHTML = data.results
            .map(r => '<div class="result-item">' + r + '</div>')
            .join('');
        }
      } catch (err) {
        resultsDiv.innerHTML = '<div class="no-results">Search error</div>';
      }
    }
  </script>
</body>
</html>`);
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
