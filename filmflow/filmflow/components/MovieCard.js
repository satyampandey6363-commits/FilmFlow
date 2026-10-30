import Link from 'next/link';
import { bestQuality } from '@/lib/db';

export default function MovieCard({ m }) {
  const q = bestQuality(m);
  return (
    <Link href={`/movie/${m.slug}`} className="group block">
      <div className="relative aspect-[2/3] overflow-hidden rounded-lg border border-line bg-gradient-to-br from-brand/30 to-panel">
        {m.poster
          ? <img src={m.poster} alt={`${m.title} poster`} loading="lazy" decoding="async" className="h-full w-full object-cover transition duration-300 group-hover:scale-105" />
          : <div className="flex h-full items-center justify-center p-3 text-center font-semibold text-slate-300">{m.title}</div>}
        {q && <span className="absolute left-2 top-2 rounded bg-brand px-2 py-0.5 text-xs font-bold text-white">{q}</span>}
        {m.rating > 0 && <span className="absolute right-2 top-2 rounded bg-black/75 px-2 py-0.5 text-xs font-semibold text-amber-300">★ {m.rating.toFixed(1)}</span>}
      </div>
      <h3 className="mt-2 line-clamp-1 text-sm font-semibold group-hover:text-brand2">{m.title}</h3>
      <p className="text-xs text-slate-400">{m.year}</p>
    </Link>
  );
}
