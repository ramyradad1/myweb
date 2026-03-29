import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://technify.space'),
  title: {
    default: "Technify | Premium Editorial & Global News",
    template: "%s | Technify"
  },
  description: "A premier digital magazine delivering expert-curated news, insights, and analysis across technology, business, and health.",
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: 'Technify | Premium Editorial',
    description: 'Expert-curated global news and technology insights.',
    locale: 'en_US',
    siteName: 'Technify',
    type: 'website',
  },
  other: {
    'geo.region': 'US-NY',
    'geo.placename': 'New York',
    'geo.position': '40.7128;-74.0060',
    'ICBM': '40.7128, -74.0060'
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // WebSite schema for sitelinks search box and organization identity
  const organizationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Technify',
    url: 'https://technify.space',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://technify.space/search?q={search_term_string}',
      'query-input': 'required name=search_term_string'
    }
  };

  return (
    <html lang="en" dir="ltr" className={inter.variable}>
      <head>
        <script async src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}></script>
        <script dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}', {
              page_path: window.location.pathname,
            });
          `
        }} />
      </head>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <Navbar />
        <main className="main-content">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
