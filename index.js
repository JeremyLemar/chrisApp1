require('dotenv').config();
const path = require('path');
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
const GOOGLE_CX = process.env.GOOGLE_CX;

app.get('/api/search', async (req, res) => {
  const query = (req.query.q || '').trim();
  if (!query) {
    return res.json({ results: [] });
  }

  if (!GOOGLE_API_KEY || !GOOGLE_CX) {
    return res.status(500).json({ error: 'Google Search API is not configured. Set GOOGLE_API_KEY and GOOGLE_CX environment variables.' });
  }

  try {
    const url = `https://www.googleapis.com/customsearch/v1?key=${encodeURIComponent(GOOGLE_API_KEY)}&cx=${encodeURIComponent(GOOGLE_CX)}&q=${encodeURIComponent(query)}`;
    const response = await fetch(url);

    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      return res.status(502).json({ error: 'Google Search API returned an unexpected response. Verify that GOOGLE_API_KEY is a valid API key.' });
    }

    const data = await response.json();

    if (!response.ok) {
      const message = data.error?.message || 'Google Search API request failed';
      if (data.error?.status === 'PERMISSION_DENIED' || response.status === 403) {
        return res.status(response.status).json({
          error: 'Access denied to Custom Search JSON API. Possible causes: '
            + '(1) The API is not enabled — visit https://console.developers.google.com/apis/api/customsearch.googleapis.com/overview to enable it. '
            + '(2) Your API key has restrictions (IP, referrer, or allowed-APIs list) that block this request — check APIs & Services > Credentials in the Cloud Console. '
            + '(3) The API key belongs to a different project than the one where the API is enabled.'
        });
      }
      if (data.error?.status === 'INVALID_ARGUMENT') {
        return res.status(response.status).json({ error: 'Invalid API configuration. Verify that GOOGLE_CX is a valid Programmable Search Engine ID and GOOGLE_API_KEY has the Custom Search API enabled.' });
      }
      return res.status(response.status).json({ error: message });
    }

    const results = (data.items || []).map(item => ({
      title: item.title,
      snippet: item.snippet,
      link: item.link,
      displayLink: item.displayLink,
    }));

    res.json({ results });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch search results' });
  }
});

app.use(express.static(path.join(__dirname, 'public')));

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
