import { NextResponse } from 'next/server';
import { checkPassword, token } from '@/lib/auth';

export async function POST(req) {
  const { password } = await req.json().catch(() => ({}));
  if (!checkPassword(password)) return NextResponse.json({ error: 'Wrong password' }, { status: 401 });
  const res = NextResponse.json({ ok: true });
  res.cookies.set('ff_admin', token(), { httpOnly: true, sameSite: 'strict', secure: process.env.NODE_ENV === 'production', path: '/', maxAge: 60 * 60 * 8 });
  return res;
}
export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.delete('ff_admin');
  return res;
}
