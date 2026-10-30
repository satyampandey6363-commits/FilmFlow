import './globals.css';
import { Outfit } from 'next/font/google';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit', display: 'swap' });
const site = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export const metadata = {
  metadataBase: new URL(site),
  title: { default: 'FilmFlow – Find Your Favourite Movies', template: '%s | FilmFlow' },
  description: 'FilmFlow helps you find your favourite movies and web series across Bollywood, Hollywood and South cinema.',
  openGraph: { siteName: 'FilmFlow', type: 'website' }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={outfit.variable}>
      <body className="font-sans antialiased">
        <Header />
        <main className="mx-auto max-w-7xl px-4 pt-6">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
