'use client';
import { useRouter, useSearchParams } from 'next/navigation';

export default function FilterBar({ genres, years }) {
  const router = useRouter();
  const sp = useSearchParams();
  const set = (k, v) => {
    const p = new URLSearchParams(sp.toString());
    v ? p.set(k, v) : p.delete(k);
    router.push(`/?${p.toString()}`);
  };
  const sel = 'input w-auto min-w-[140px]';
  return (
    <div className="flex flex-wrap items-center gap-3">
      <select aria-label="Filter by genre" className={sel} value={sp.get('genre') || ''} onChange={(e) => set('genre', e.target.value)}>
        <option value="">All genres</option>
        {genres.map((g) => <option key={g}>{g}</option>)}
      </select>
      <select aria-label="Filter by year" className={sel} value={sp.get('year') || ''} onChange={(e) => set('year', e.target.value)}>
        <option value="">All years</option>
        {years.map((y) => <option key={y}>{y}</option>)}
      </select>
      {(sp.get('genre') || sp.get('year') || sp.get('q') || sp.get('cat')) && (
        <button onClick={() => router.push('/')} className="text-sm text-brand2 hover:underline">Clear filters</button>
      )}
    </div>
  );
}
