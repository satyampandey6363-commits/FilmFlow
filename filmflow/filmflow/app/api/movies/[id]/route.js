import { NextResponse } from 'next/server';
import { isAdmin } from '@/lib/auth';
import { getMovies, saveMovies, clean } from '@/lib/db';

const no = () => NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

export async function PUT(req, { params }) {
  if (!isAdmin()) return no();
  const data = clean(await req.json());
  const list = await getMovies();
  const i = list.findIndex((m) => m.id === params.id);
  if (i < 0) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  list[i] = { ...list[i], ...data };
  await saveMovies(list);
  return NextResponse.json(list[i]);
}
export async function DELETE(_, { params }) {
  if (!isAdmin()) return no();
  await saveMovies((await getMovies()).filter((m) => m.id !== params.id));
  return NextResponse.json({ ok: true });
}
