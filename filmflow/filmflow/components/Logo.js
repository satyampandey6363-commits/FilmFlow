import Link from 'next/link';

export default function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2" aria-label="FilmFlow home">
      <svg width="30" height="30" viewBox="0 0 32 32" aria-hidden="true">
        <rect width="32" height="32" rx="8" fill="#2f6bff" />
        <path d="M12 9.5v13l11-6.5z" fill="#04060c" />
        <path d="M5 25c4-3 8-3 11-1s7 2 11-1" stroke="#04060c" strokeWidth="1.6" fill="none" strokeLinecap="round" opacity=".55" />
      </svg>
      <span className="text-xl font-bold tracking-tight">Film<span className="text-brand2">Flow</span></span>
    </Link>
  );
}
