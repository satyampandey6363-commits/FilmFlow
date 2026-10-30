import { notFound } from 'next/navigation';
import { getMovies, ytId } from '@/lib/db';
import MovieCard from '@/components/MovieCard';

export const dynamic = 'force-dynamic';

async function find(slug) { return (await getMovies()).find((m) => m.slug === slug); }

export async function generateMetadata({ params }) {
  const m = await find(params.slug);
  if (!m) return {};
  const title = `${m.title} (${m.year})`;
  return {
    title,
    description: m.description.slice(0, 155),
    alternates: { canonical: `/movie/${m.slug}` },
    openGraph: { title, description: m.description.slice(0, 155), images: m.poster ? [m.poster] : [] }
  };
}

export default async function MoviePage({ params }) {
  const all = await getMovies();
  const m = all.find((x) => x.slug === params.slug);
  if (!m) notFound();
  const vid = ytId(m.trailer);
  const genres = m.genre.split(',').map((g) => g.trim());
  const related = all.filter((x) => x.id !== m.id && (x.category === m.category || x.genre.split(',').some((g) => genres.includes(g.trim())))).slice(0, 6);
  const dls = [['480p', m.dl480], ['720p', m.dl720], ['1080p', m.dl1080]];
  const ld = { '@context': 'https://schema.org', '@type': 'Movie', name: m.title, description: m.description, image: m.poster || undefined, genre: genres, dateCreated: String(m.year), inLanguage: m.language, aggregateRating: m.rating ? { '@type': 'AggregateRating', ratingValue: m.rating, bestRating: 10, ratingCount: 1 } : undefined };

  return (
    <article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <div className="grid gap-8 md:grid-cols-[300px_1fr]">
        <div className="aspect-[2/3] overflow-hidden rounded-xl border border-line bg-gradient-to-br from-brand/30 to-panel">
          {m.poster ? <img src={m.poster} alt={`${m.title} poster`} className="h-full w-full object-cover" /> : <div className="flex h-full items-center justify-center p-4 text-center text-lg font-semibold text-slate-300">{m.title}</div>}
        </div>
        <div>
          <h1 className="text-3xl font-extrabold sm:text-4xl">{m.title} <span className="font-normal text-slate-400">({m.year})</span></h1>
          <dl className="mt-4 grid grid-cols-[110px_1fr] gap-y-2 text-sm">
            <dt className="text-slate-400">Genre</dt><dd>{m.genre}</dd>
            <dt className="text-slate-400">Language</dt><dd>{m.language}</dd>
            <dt className="text-slate-400">Category</dt><dd>{m.category}</dd>
            <dt className="text-slate-400">IMDb rating</dt><dd className="font-semibold text-amber-300">{m.rating ? `★ ${m.rating.toFixed(1)} / 10` : 'Not rated'}</dd>
          </dl>
          <h2 className="mt-6 text-lg font-bold">Storyline</h2>
          <p className="mt-1 max-w-2xl leading-relaxed text-slate-300">{m.description}</p>

          <h2 className="mt-8 text-lg font-bold">Downloads</h2>
          <div className="mt-3 flex flex-wrap gap-3">
            {dls.map(([q, link]) => link
              ? <a key={q} href={link} target="_blank" rel="nofollow noopener noreferrer" className="rounded-lg bg-brand px-5 py-3 font-semibold text-white hover:bg-brand2">Download {q}</a>
              : <span key={q} className="cursor-not-allowed rounded-lg border border-line px-5 py-3 text-slate-500" aria-disabled="true">Download {q}</span>)}
          </div>
          <p className="mt-2 text-xs text-slate-500">Links open on an external site. FilmFlow does not host any files.</p>
        </div>
      </div>

      {vid && (
        <section className="mt-10">
          <h2 className="mb-3 text-lg font-bold">Trailer</h2>
          <div className="aspect-video max-w-3xl overflow-hidden rounded-xl border border-line">
            <iframe src={`https://www.youtube-nocookie.com/embed/${vid}`} title={`${m.title} trailer`} loading="lazy" allowFullScreen className="h-full w-full" />
          </div>
        </section>
      )}

      {related.length > 0 && (
        <section className="mt-12">
          <h2 className="mb-4 text-lg font-bold">Related movies</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {related.map((r) => <MovieCard key={r.id} m={r} />)}
          </div>
        </section>
      )}
    </article>
  );
}
