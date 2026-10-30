# FilmFlow

Next.js 14 + Tailwind CSS. Run: `npm install && cp .env.example .env.local && npm run dev`
Admin: `/admin` (password from `ADMIN_PASSWORD`). Movies are stored in `data/movies.json`.

Note: JSON storage works on your own computer/VPS. Serverless hosts (Vercel, Netlify) have a read-only
filesystem, so swap `lib/db.js` (getMovies/saveMovies) for a hosted database such as Supabase before deploying there.
