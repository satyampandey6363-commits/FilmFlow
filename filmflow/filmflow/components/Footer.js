import Link from 'next/link';
import Logo from './Logo';

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-line bg-panel">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Logo />
          <p className="mt-2 text-sm text-slate-400">Find Your Favourite Movies</p>
        </div>
        <nav className="flex gap-6 text-sm text-slate-300" aria-label="Footer">
          <Link href="/disclaimer" className="hover:text-white">Disclaimer</Link>
          <Link href="/contact" className="hover:text-white">Contact</Link>
        </nav>
        <p className="text-xs text-slate-500">© {new Date().getFullYear()} FilmFlow</p>
      </div>
    </footer>
  );
}
