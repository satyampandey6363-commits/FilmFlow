import { NextResponse } from 'next/server';
import { isAdmin } from '@/lib/auth';
import { getMovies, saveMovies, slugify, clean } from '@/lib/db';

const no = () => NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

export async function GET() {
  if (!isAdmin()) return no();
  return NextResponse.json(await getMovies());
}
export async function POST(req) {
  if (!isAdmin()) return no();
  const data = clean(await req.json());
  if (!data.title) return NextResponse.json({ error: 'Title is required' }, { status: 400 });
  const list = await getMovies();
  let slug = slugify(data.title), n = 2;
  while (list.some((m) => m.slug === slug)) slug = `${slugify(data.title)}-${n++}`;
  const movie = { id: Date.now().toString(36), slug, createdAt: Date.now(), ...data };
  await saveMovies([movie, ...list]);
  return NextResponse.json(movie);
}
