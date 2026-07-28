type SchemaObject = Record<string, unknown>;

export type FaqItem = {
  question?: string;
  answer?: string;
};

type SiteSchemaInput = {
  siteName: string;
  siteUrl: string;
  description: string;
};

type OrganizationSchemaInput = {
  siteName: string;
  siteUrl: string;
  telephone: string;
};

type DetailSchemaInput = {
  siteName: string;
  siteUrl: string;
  pageUrl: string;
  pageName: string;
  description: string;
};

type BreadcrumbSchemaInput = {
  pageUrl: string;
  pageName: string;
  siteUrl: string;
};

function cleanText(value?: string) {
  return String(value ?? '').replace(/<[^>]*>/g, '').trim();
}

export function createWebsiteSchema({
  siteName,
  siteUrl,
  description,
}: SiteSchemaInput): SchemaObject {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteName,
    url: siteUrl,
    inLanguage: 'ko-KR',
    description,
  };
}

export function createOrganizationSchema({
  siteName,
  siteUrl,
  telephone,
}: OrganizationSchemaInput): SchemaObject {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteName,
    url: siteUrl,
    telephone,
  };
}

export function createWebPageSchema({
  siteName,
  siteUrl,
  pageUrl,
  pageName,
  description,
}: DetailSchemaInput): SchemaObject {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: pageName,
    description,
    url: pageUrl,
    inLanguage: 'ko-KR',
    isPartOf: {
      '@type': 'WebSite',
      name: siteName,
      url: siteUrl,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': pageUrl,
    },
  };
}

export function createBreadcrumbSchema({
  pageUrl,
  pageName,
  siteUrl,
}: BreadcrumbSchemaInput): SchemaObject {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: '홈',
        item: siteUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: pageName,
        item: pageUrl,
      },
    ],
  };
}

export function createFaqPageSchema(faqs: FaqItem[]): SchemaObject | null {
  const seenQuestions = new Set<string>();
  const mainEntity = faqs.reduce<SchemaObject[]>((items, faq) => {
    const question = cleanText(faq.question);
    const answer = cleanText(faq.answer);

    if (!question || !answer || seenQuestions.has(question)) {
      return items;
    }

    seenQuestions.add(question);
    items.push({
      '@type': 'Question',
      name: question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: answer,
      },
    });

    return items;
  }, []);

  if (mainEntity.length === 0) {
    return null;
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity,
  };
}
