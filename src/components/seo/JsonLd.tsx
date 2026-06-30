import { SITE_URL, SITE_NAME } from '@/lib/constants';

export function WebSiteJsonLd() {
  // 검색 라우트가 아직 없으므로 SearchAction(potentialAction) 블록 제거.
  // 검색 라우트 추가 시 복원: { '@type': 'SearchAction', target: ..., 'query-input': 'required name=search_term_string' }
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    description: 'Free online financial calculators for mortgage, auto loans, compound interest, and more.',
    inLanguage: 'en-US',
    publisher: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
  };

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
}

export function OrganizationJsonLd() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/icon.png`,
    contactPoint: { '@type': 'ContactPoint', email: 'contact@calcpick.com', contactType: 'customer service' },
  };

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
}

export function WebApplicationJsonLd({
  name,
  description,
  url,
  applicationCategory,
}: {
  name: string;
  description: string;
  url: string;
  applicationCategory: 'FinanceApplication' | 'UtilitiesApplication';
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name,
    description,
    url,
    applicationCategory,
    operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    provider: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
  };

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
}

export function FAQJsonLd({ questions }: { questions: { question: string; answer: string }[] }) {
  if (questions.length === 0) return null;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: questions.map((q) => ({
      '@type': 'Question',
      name: q.question,
      acceptedAnswer: { '@type': 'Answer', text: q.answer },
    })),
  };

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
}

export function BreadcrumbJsonLd({ items }: { items: { name: string; url: string }[] }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
}
