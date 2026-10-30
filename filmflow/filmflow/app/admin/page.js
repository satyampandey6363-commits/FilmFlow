'use client';
import { useEffect, useState } from 'react';

const CATS = ['Bollywood', 'Hollywood', 'South', 'Web Series'];
const empty = { title: '', poster: '', description: '', genre: '', year: new Date().getFullYear(), language: '', category: 'Bollywood', rating: '', trailer: '', dl480: '', dl720: '', dl1080: '', trending: false };
const text = [['title', 'Title'], ['poster', 'Poster image URL'], ['genre', 'Genre (comma separated)'], ['year', 'Year'], ['language', 'Language'], ['rating', 'IMDb rating (0–10)'], ['trailer', 'YouTube trailer link'], ['dl480', 'Download link 480p'], ['dl720', 'Download link 720p'], ['dl1080', 'Download link 1080p']];

export default function Admin() {
  const [auth, setAuth] = useState(null);
  const [movies, setMovies] = useState([]);
  const [q, setQ] = useState('');
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState(null);
  const [pw, setPw] = useState('');
  const [msg, setMsg] = useState('');

  async function load() {
    const r = await fetch('/api/movies');
    if (r.status === 401) return setAuth(false);
    setMovies(await r.json());
    setAuth(true);
  }
  useEffect(() => { load(); }, []);

  async function login(e) {
    e.preventDefault();
    const r = await fetch('/api/login', { method: 'POST', body: JSON.stringify({ password: pw }) });
    r.ok ? (setMsg(''), load()) : setMsg('Wrong password');
  }
  async function logout() { await fetch('/api/login', { method: 'DELETE' }); setAuth(false); }
  async function save(e) {
    e.preventDefault();
    const r = await fetch(editId ? `/api/movies/${editId}` : '/api/movies', { method: editId ? 'PUT' : 'POST', body: JSON.stringify(form) });
    if (r.ok) { setMsg(editId ? 'Movie updated' : 'Movie added'); setForm(empty); setEditId(null); load(); }
    else setMsg((await r.json()).error || 'Could not save movie');
  }
  async function del(m) {
    if (!confirm(`Delete "${m.title}"?`)) return;
    await fetch(`/api/movies/${m.id}`, { method: 'DELETE' });
    load();
  }
  function edit(m) { setForm({ ...empty, ...m }); setEditId(m.id); window.scrollTo({ top: 0, behavior: 'smooth' }); }

  if (auth === null) return <p className="p-8 text-slate-400">Loading…</p>;
  if (!auth) return (
    <form onSubmit={login} className="mx-auto mt-24 max-w-sm space-y-3 rounded-xl border border-line bg-panel p-6">
      <h1 className="text-xl font-bold">FilmFlow admin</h1>
      <input type="password" className="input" placeholder="Admin password" value={pw} onChange={(e) => setPw(e.target.value)} autoFocus />
      {msg && <p className="text-sm text-red-400">{msg}</p>}
      <button className="w-full rounded-lg bg-brand py-2.5 font-semibold text-white hover:bg-brand2">Log in</button>
    </form>
  );

  const shown = movies.filter((m) => m.title.toLowerCase().includes(q.toLowerCase()));
  return (
    <div className="mx-auto max-w-6xl p-4">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">FilmFlow admin</h1>
        <div className="flex gap-4 text-sm"><a href="/" className="text-brand2">View site</a><button onClick={logout} className="text-slate-400">Log out</button></div>
      </div>

      <form onSubmit={save} className="grid gap-3 rounded-xl border border-line bg-panel p-5 sm:grid-cols-2">
        <h2 className="text-lg font-bold sm:col-span-2">{editId ? 'Edit movie' : 'Add new movie'}</h2>
        {text.map(([k, label]) => (
          <label key={k} className="text-sm text-slate-300">{label}
            <input className="input mt-1" value={form[k]} onChange={(e) => setForm({ ...form, [k]: e.target.value })} required={k === 'title'} />
          </label>
        ))}
        <label className="text-sm text-slate-300">Category
          <select className="input mt-1" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>{CATS.map((c) => <option key={c}>{c}</option>)}</select>
        </label>
        <label className="flex items-center gap-2 self-end pb-2 text-sm text-slate-300">
          <input type="checkbox" checked={form.trending} onChange={(e) => setForm({ ...form, trending: e.target.checked })} /> Show in trending slider
        </label>
        <label className="text-sm text-slate-300 sm:col-span-2">Description / storyline
          <textarea rows={4} className="input mt-1" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        </label>
        <div className="flex items-center gap-3 sm:col-span-2">
          <button className="rounded-lg bg-brand px-6 py-2.5 font-semibold text-white hover:bg-brand2">{editId ? 'Save changes' : 'Add movie'}</button>
          {editId && <button type="button" onClick={() => { setForm(empty); setEditId(null); }} className="text-sm text-slate-400">Cancel</button>}
          {msg && <span className="text-sm text-brand2">{msg}</span>}
        </div>
      </form>

      <div className="mt-8 flex items-center justify-between gap-3">
        <h2 className="text-lg font-bold">All movies ({shown.length})</h2>
        <input className="input max-w-xs" type="search" placeholder="Search movies" value={q} onChange={(e) => setQ(e.target.value)} />
      </div>
      <ul className="mt-3 divide-y divide-line rounded-xl border border-line">
        {shown.map((m) => (
          <li key={m.id} className="flex items-center justify-between gap-3 p-3">
            <div className="min-w-0"><p className="truncate font-semibold">{m.title} <span className="font-normal text-slate-400">({m.year})</span></p><p className="text-xs text-slate-500">{m.category} · {m.language}</p></div>
            <div className="flex shrink-0 gap-3 text-sm"><button onClick={() => edit(m)} className="text-brand2">Edit</button><button onClick={() => del(m)} className="text-red-400">Delete</button></div>
          </li>
        ))}
        {!shown.length && <li className="p-4 text-sm text-slate-400">No movies found.</li>}
      </ul>
    </div>
  );
}
