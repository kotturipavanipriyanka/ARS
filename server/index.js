import express from 'express';
import fs from 'fs/promises';
import path from 'path';
import cors from 'cors';
import { fileURLToPath } from 'url';

const app = express();
app.use(cors());
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, 'data');
const PRODUCTS_FILE = path.join(DATA_DIR, 'products.json');
const RATINGS_FILE = path.join(DATA_DIR, 'ratings.json');

async function readJSON(file) {
  try {
    const content = await fs.readFile(file, 'utf8');
    return JSON.parse(content);
  } catch (e) {
    return null;
  }
}

async function writeJSON(file, data) {
  await fs.writeFile(file, JSON.stringify(data, null, 2), 'utf8');
}

app.get('/api/products', async (req, res) => {
  const products = (await readJSON(PRODUCTS_FILE)) || [];
  res.json(products);
});

function productMatchesQuery(product, q) {
  if (!q) return true;
  const s = String(q).trim().toLowerCase();
  if (!s) return true;
  const inTitle = String(product.title || '').toLowerCase().includes(s);
  const inCategory = String(product.category || '').toLowerCase().includes(s);
  const inDesc = String(product.description || '').toLowerCase().includes(s);
  const inAsin = String(product.asin || '').toLowerCase().includes(s);
  const tags = Array.isArray(product.tags) ? product.tags.map(String) : [];
  const inTags = tags.some((t) => String(t).toLowerCase().includes(s));
  return inTitle || inCategory || inDesc || inAsin || inTags;
}

app.get('/api/search', async (req, res) => {
  const rawQ = req.query.q ? String(req.query.q) : '';
  const q = rawQ.trim().toLowerCase();
  const minRating = req.query.minRating ? parseFloat(String(req.query.minRating)) : undefined;
  const limit = req.query.limit ? Math.max(1, parseInt(String(req.query.limit), 10)) : 50;

  const products = (await readJSON(PRODUCTS_FILE)) || [];

  // If no query provided, behave like before (filter by minRating and return top by rating)
  if (!q) {
    let results = products.slice();
    if (typeof minRating === 'number' && !Number.isNaN(minRating)) {
      results = results.filter((p) => (typeof p.rating === 'number' ? p.rating >= minRating : Number(p.rating) >= minRating));
    }
    results.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    return res.json(results.slice(0, limit));
  }

  const qTokens = q.split(/\s+/).filter(Boolean);

  function wholeWordCount(text, token) {
    if (!text) return 0;
    const re = new RegExp(`\\b${token.replace(/[-\\/\\^$*+?.()|[\\]{}]/g, '\\$&')}\\b`, 'i');
    return re.test(text) ? 1 : 0;
  }

  // Score each product for relevance
  const scored = products.map((p) => {
    let score = 0;
    const title = String(p.title || '').toLowerCase();
    const category = String(p.category || '').toLowerCase();
    const desc = String(p.description || '').toLowerCase();
    const asin = String(p.asin || '').toLowerCase();
    const tags = Array.isArray(p.tags) ? p.tags.map(String).join(' ').toLowerCase() : '';

    // Exact matches get highest priority
    if (title === q || category === q || asin === q) score += 200;

    // ASIN partial match
    if (asin.includes(q)) score += 80;

    // Phrase match
    if (title.includes(q)) score += 60;
    if (desc.includes(q)) score += 30;
    if (category.includes(q)) score += 40;
    if (tags.includes(q)) score += 50;

    // Token overlap (whole-word) adds relevance but less than phrase/exact
    for (const t of qTokens) {
      score += wholeWordCount(title, t) * 12;
      score += wholeWordCount(desc, t) * 6;
      score += wholeWordCount(category, t) * 8;
      score += wholeWordCount(tags, t) * 10;
    }

    // Add a small contribution from product rating and review_count
    score += (Number(p.rating || 0) / 5) * 5;
    score += Math.log10((Number(p.review_count || 0) + 1)) * 2;

    return { product: p, score };
  });

  // Filter by minRating if requested
  let filtered = scored;
  if (typeof minRating === 'number' && !Number.isNaN(minRating)) {
    filtered = filtered.filter((s) => (typeof s.product.rating === 'number' ? s.product.rating >= minRating : Number(s.product.rating) >= minRating));
  }

  filtered.sort((a, b) => b.score - a.score || (b.product.rating || 0) - (a.product.rating || 0));

  const results = filtered.slice(0, limit).map((s) => s.product);
  res.json(results);
});

app.get('/api/ratings', async (req, res) => {
  const userId = req.query.userId;
  const ratings = (await readJSON(RATINGS_FILE)) || [];
  if (userId) {
    const userRatings = ratings.filter((r) => r.user_id === String(userId));
    res.json(userRatings);
  } else {
    res.json(ratings);
  }
});

app.post('/api/ratings', async (req, res) => {
  const { user_id, product_id, rating, review_text } = req.body;
  if (!user_id || !product_id || typeof rating !== 'number') {
    return res.status(400).json({ error: 'Missing fields' });
  }

  const ratings = (await readJSON(RATINGS_FILE)) || [];
  const idx = ratings.findIndex(
    (r) => r.user_id === user_id && r.product_id === product_id
  );
  if (idx >= 0) {
    ratings[idx] = { user_id, product_id, rating, review_text };
  } else {
    ratings.push({ user_id, product_id, rating, review_text });
  }

  await writeJSON(RATINGS_FILE, ratings);
  res.json({ success: true });
});

app.get('/api/recommendations', async (req, res) => {
  const userId = req.query.userId;
  const limit = parseInt(req.query.limit || '6', 10);
  const q = req.query.q ? String(req.query.q) : '';

  const products = (await readJSON(PRODUCTS_FILE)) || [];
  const ratings = (await readJSON(RATINGS_FILE)) || [];

  // First, filter candidate products by search query if provided
  const baseCandidates = products.filter((p) => productMatchesQuery(p, q));

  if (!userId) {
    // No user: return top matches for query or popular
    const top = baseCandidates
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, limit)
      .map((p) => ({ product: p, score: p.rating || 0, reason: q ? 'Matches search query' : 'Popular' }));
    return res.json(top);
  }

  const userRatings = ratings.filter((r) => r.user_id === String(userId));

  // exclude products the user already rated
  const ratedProductIds = new Set(userRatings.map((r) => r.product_id));
  let candidates = baseCandidates.filter((p) => !ratedProductIds.has(p.id));

  if (!userRatings || userRatings.length < 3) {
    // Cold start: not enough user history — prefer search matches then popular
    const recsCold = candidates
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, limit)
      .map((p) => ({ product: p, score: p.rating || 0, reason: q ? 'Matches search query (cold start)' : 'Popular (cold start)' }));
    return res.json(recsCold);
  }

  // Build user preference signals
  const highRated = userRatings.filter((r) => r.rating >= 4).map((r) => r.product_id);
  const likedProducts = products.filter((p) => highRated.includes(p.id));
  const likedCategories = new Set(likedProducts.map((p) => p.category));

  // Helper: token overlap between titles
  function titleTokenOverlap(a, b) {
    const tokenize = (s) => String(s || '').toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);
    const as = new Set(tokenize(a));
    const bs = new Set(tokenize(b));
    let overlap = 0;
    for (const t of as) if (bs.has(t)) overlap++;
    return overlap;
  }

  // Score candidates combining product rating, search match, category affinity, and title similarity
  const scored = candidates.map((p) => {
    let score = Number(p.rating || 0);
    const reasons = [];

    if (q && productMatchesQuery(p, q)) {
      score += 1.5;
      reasons.push('Matches your search');
    }

    if (likedCategories.has(p.category)) {
      score += 2.0;
      reasons.push(`Matches category you liked: ${p.category}`);
    }

    // title similarity to any liked product
    let bestOverlap = 0;
    let bestLiked = null;
    for (const lp of likedProducts) {
      const ov = titleTokenOverlap(p.title, lp.title);
      if (ov > bestOverlap) {
        bestOverlap = ov;
        bestLiked = lp;
      }
    }
    if (bestOverlap > 0) {
      score += bestOverlap * 0.5;
      reasons.push(bestLiked ? `Similar to products you liked: ${bestLiked.title}` : 'Similar to products you liked');
    }

    // Add a fallback reason if none
    if (reasons.length === 0) reasons.push('High overall rating');

    return { product: p, score, reason: reasons.join('; ') };
  });

  scored.sort((a, b) => b.score - a.score || (b.product.rating || 0) - (a.product.rating || 0));

  res.json(scored.slice(0, limit));
});

const PORT = process.env.PORT || 3333;
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
