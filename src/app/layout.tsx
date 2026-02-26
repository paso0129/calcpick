import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ThemeProvider from "@/components/ui/ThemeProvider";
import { WebSiteJsonLd, OrganizationJsonLd } from "@/components/seo/JsonLd";
import CookieConsent from "@/components/ads/CookieConsent";
import { SITE_NAME, SITE_URL, SITE_DESCRIPTION } from "@/lib/constants";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} - Free Online Financial Calculators`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "mortgage calculator", "auto loan calculator", "compound interest calculator",
    "debt payoff calculator", "personal loan calculator", "student loan calculator",
    "financial calculator", "loan calculator", "free calculator",
  ],
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  alternates: {
    canonical: '/',
    languages: { 'en': '/', 'x-default': '/' },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} - Free Online Financial Calculators`,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} - Free Online Financial Calculators`,
    description: SITE_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  other: {
    'theme-color': '#3b82f6',
    'color-scheme': 'light dark',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var t=localStorage.getItem('theme')||'light';document.documentElement.className=t;})();`,
          }}
        />
        {/* Google Analytics GA4 */}
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-4M9GBNY406"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-4M9GBNY406');`,
          }}
        />
        {/* Google AdSense */}
        <meta name="google-adsense-account" content="ca-pub-7151553772512263" />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7151553772512263"
          crossOrigin="anonymous"
        ></script>
        <WebSiteJsonLd />
        <OrganizationJsonLd />
      </head>
      <body className={inter.className}>
        <ThemeProvider>
          <div className="min-h-screen flex flex-col bg-dark-base">
            <Header />
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
          </div>
          <CookieConsent />
        </ThemeProvider>
      </body>
    </html>
  );
}
