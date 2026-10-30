import Link from 'next/link';
import Logo from './Logo';

const menu = [['Home', '/'], ['Bollywood', '/?cat=Bollywood'], ['Hollywood', '/?cat=Hollywood'], ['South', '/?cat=South'], ['Web Series', '/?cat=Web Series']];

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-ink/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3">
        <Logo />
        <nav className="ml-6 hidden gap-5 text-sm text-slate-300 md:flex" aria-label="Main">
          {menu.map(([n, h]) => <Link key={n} href={h} className="hover:text-white">{n}</Link>)}
        </nav>
        <form action="/" className="ml-auto flex w-full max-w-xs" role="search">
          <input name="q" type="search" placeholder="Search movies" aria-label="Search movies" className="input rounded-r-none" />
          <button className="rounded-r-lg bg-brand px-4 text-sm font-semibold text-white hover:bg-brand2">Search</button>
        </form>
      </div>
      <nav className="no-scrollbar flex gap-5 overflow-x-auto border-t border-line px-4 py-2 text-sm text-slate-300 md:hidden" aria-label="Main mobile">
        {menu.map(([n, h]) => <Link key={n} href={h} className="whitespace-nowrap">{n}</Link>)}
      </nav>
    </header>
  );
}
