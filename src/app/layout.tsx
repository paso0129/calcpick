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

const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
const GSC_VERIFICATION = process.env.NEXT_PUBLIC_GSC_VERIFICATION;

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
  // GSC 검증 토큰은 NEXT_PUBLIC_GSC_VERIFICATION env 변수로 주입.
  // 미설정 시 verification 필드를 출력하지 않음(DNS TXT 검증 등 메타 태그 외 방식 호환).
  ...(GSC_VERIFICATION
    ? { verification: { google: GSC_VERIFICATION } }
    : {}),
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
        {/* Google Consent Mode v2 — default denied. CookieConsent UI에서 사용자 동의 시 update.
            GA_ID 유무와 관계없이 항상 dataLayer/gtag shim을 정의해 다른 스크립트가 안전하게 호출 가능하도록 한다. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;gtag('consent','default',{'analytics_storage':'denied','ad_storage':'denied','ad_user_data':'denied','ad_personalization':'denied','wait_for_update':500});`,
          }}
        />
        {/* Google Analytics GA4 — NEXT_PUBLIC_GA_MEASUREMENT_ID 설정 시에만 렌더 */}
        {GA_ID && (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `gtag('js',new Date());gtag('config','${GA_ID}');`,
              }}
            />
          </>
        )}
        {/* Google AdSense — script loaded by CookieConsent after user consent */}
        <meta name="google-adsense-account" content="ca-pub-7151553772512263" />
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
