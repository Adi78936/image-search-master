import { Router } from 'express';
import ensureAuth from '../middleware/ensureAuth.js';
import fetch from 'node-fetch';

const router = Router();

router.get('/top-searches', (_req, res) => {
  res.json([]);
});

router.post('/search', ensureAuth, async (req, res) => {
  try {
    const { term } = req.body || {};
    if (!term || typeof term !== 'string') {
      return res.status(400).json({ error: 'term is required' });
    }

    const url = new URL('https://api.unsplash.com/search/photos');
    url.searchParams.set('query', term);
    url.searchParams.set('per_page', '30');

    const response = await fetch(url, {
      headers: { Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}` },
    });
    const data = await response.json();

    const results = (data?.results || []).map((img) => ({
      id: img.id,
      alt: img.alt_description || img.description || 'Image',
      thumb: img.urls?.small,
      full: img.urls?.full,
      author: img.user?.name,
      link: img.links?.html,
    }));

    res.json({ term, total: data?.total || results.length, results });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Search failed' });
  }
});

router.get('/history', ensureAuth, (_req, res) => {
  res.json([]);
});

export default router;
