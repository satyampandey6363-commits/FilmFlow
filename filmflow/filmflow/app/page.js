import { Suspense } from 'react';
import { getMovies } from '@/lib/db';
import MovieCard from '@/components/MovieCard';
import Slider from '@/components/Slider';
import FilterBar from '@/components/FilterBar';

export const dynamic = 'force-dynamic';

export default async function Home({ searchParams }) {
  const { q = '', cat = '', genre = '', year = '' } = searchParams;
  const all = await getMovies();
  const filtered = all.filter((m) =>
    (!q || m.title.toLowerCase().includes(q.toLowerCase())) &&
    (!cat || m.category === cat) &&
    (!genre || m.genre.split(',').map((g) => g.trim()).includes(genre)) &&
    (!year || String(m.year) === year));
  const filtering = q || cat || genre || year;
  const trending = all.filter((m) => m.trending).slice(0, 6);
  const genres = [...new Set(all.flatMap((m) => m.genre.split(',').map((g) => g.trim())).filter(Boolean))].sort();
  const years = [...new Set(all.map((m) => m.year))].sort((a, b) => b - a);

  return (
    <>
      {!filtering && <Slider movies={trending.length ? trending : all.slice(0, 5)} />}
      <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">{q ? `Results for “${q}”` : cat || 'Latest movies'}</h1>
        <Suspense><FilterBar genres={genres} years={years} /></Suspense>
      </div>
      {filtered.length ? (
        <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {filtered.map((m) => <MovieCard key={m.id} m={m} />)}
        </div>
      ) : (
        <p className="mt-10 text-slate-400">No movies match these filters. Try a different search or clear the filters.</p>
      )}
    </>
  );
}
