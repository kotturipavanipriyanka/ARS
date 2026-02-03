# SmartCart AI — Frontend

Quick start:

1. Copy `.env.example` to `.env` or `.env.local` and fill in your Supabase values:

```
VITE_SUPABASE_URL=your_url
VITE_SUPABASE_ANON_KEY=your_key
```

2. Install dependencies:

```bash
npm install
```

3. Start dev server:

```bash
npm run dev
```

Notes:
- This project expects a Supabase backend with `products` and `ratings` tables.
- If you don't have Supabase set up, a static list of products can be used temporarily in `src/services/recommendationService.ts`.
