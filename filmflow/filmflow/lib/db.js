import fs from 'fs/promises';
import path from 'path';

const file = path.join(process.cwd(), 'data', 'movies.json');

export async function getMovies() {
  try {
    const list = JSON.parse(await fs.readFile(file, 'utf8'));
    return list.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
  } catch { return []; }
}
export async function saveMovies(list) {
  await fs.writeFile(file, JSON.stringify(list, null, 2));
}
export const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
export const qualities = (m) => [['480p', m.dl480], ['720p', m.dl720], ['1080p', m.dl1080]].filter((x) => x[1]).map((x) => x[0]);
export const bestQuality = (m) => qualities(m).slice(-1)[0] || null;
export const ytId = (url) => ((url || '').match(/(?:v=|youtu\.be\/|embed\/)([\w-]{11})/) || [])[1] || null;
export const CATEGORIES = ['Bollywood', 'Hollywood', 'South', 'Web Series'];

const url = (v) => (/^https?:\/\//i.test((v || '').trim()) ? v.trim() : '');
export function clean(b) {
  return {
    title: String(b.title || '').trim(),
    poster: url(b.poster),
    description: String(b.description || '').trim(),
    genre: String(b.genre || '').split(',').map((g) => g.trim()).filter(Boolean).join(', '),
    year: parseInt(b.year, 10) || new Date().getFullYear(),
    language: String(b.language || '').trim(),
    category: CATEGORIES.includes(b.category) ? b.category : 'Bollywood',
    rating: Math.min(10, Math.max(0, parseFloat(b.rating) || 0)),
    trailer: url(b.trailer),
    dl480: url(b.dl480), dl720: url(b.dl720), dl1080: url(b.dl1080),
    trending: !!b.trending
  };
}
