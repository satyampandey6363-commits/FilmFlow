import { getMovies } from '@/lib/db';

export default async function sitemap() {
  const site = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const movies = await getMovies();
  return [
    { url: site }, { url: `${site}/disclaimer` }, { url: `${site}/contact` },
    ...movies.map((m) => ({ url: `${site}/movie/${m.slug}`, lastModified: new Date(m.createdAt || Date.now()) }))
  ];
}
