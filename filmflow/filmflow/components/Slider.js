'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Slider({ movies }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (movies.length < 2 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const t = setInterval(() => setI((n) => (n + 1) % movies.length), 5500);
    return () => clearInterval(t);
  }, [movies.length]);
  if (!movies.length) return null;
  const m = movies[i];
  return (
    <section aria-label="Trending movies" className="relative overflow-hidden rounded-2xl border border-line bg-panel">
      {m.poster && <img src={m.poster} alt="" className="absolute inset-0 h-full w-full object-cover opacity-30 blur-sm" />}
      <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/80 to-brand/20" />
      <div className="relative flex min-h-[320px] items-end gap-6 p-6 sm:min-h-[380px] sm:p-10">
        {m.poster && <img src={m.poster} alt={`${m.title} poster`} className="hidden aspect-[2/3] w-44 rounded-lg border border-line object-cover shadow-2xl sm:block" />}
        <div className="max-w-xl">
          <p className="text-sm font-semibold text-brand2">Trending now</p>
          <h2 className="mt-1 text-3xl font-extrabold sm:text-5xl">{m.title}</h2>
          <p className="mt-2 text-sm text-slate-300">{m.year} · {m.genre} · {m.language}{m.rating > 0 && ` · ★ ${m.rating.toFixed(1)}`}</p>
          <p className="mt-3 line-clamp-3 text-sm text-slate-300">{m.description}</p>
          <Link href={`/movie/${m.slug}`} className="mt-5 inline-block rounded-lg bg-brand px-6 py-2.5 font-semibold text-white hover:bg-brand2">View details</Link>
        </div>
      </div>
      <div className="relative flex justify-center gap-2 pb-4">
        {movies.map((x, n) => (
          <button key={x.id} onClick={() => setI(n)} aria-label={`Show ${x.title}`} className={`h-2 rounded-full transition-all ${n === i ? 'w-6 bg-brand2' : 'w-2 bg-slate-600'}`} />
        ))}
      </div>
    </section>
  );
}
