import { detailImages, getGradeKey, getStableImages } from '@/data/imageMap';
import pages from '@/data/pages.json';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ConsultationForm from '../ConsultationForm';
import JsonLd from '../JsonLd';
import QuickConsultActions from '../QuickConsultActions';
import {
  createBreadcrumbSchema,
  createFaqPageSchema,
  createWebPageSchema,
} from '@/lib/structured-data';

type PageItem = {
  slug: string;
  title: string;
  metaDescription: string;
  grade: string;
  subject: string;
  goal: string;
  mainKeyword: string;
  heroTitle: string;
  intro: string;
  body1: string;
  body2: string;
  body3: string;
  faq1: string;
  q1: string;
  a1: string;
  q2: string;
  a2: string;
  q3: string;
  a3: string;
};

type RelatedLink = {
  href: string;
  label: string;
  meta: string;
};

type DetailPageProps = {
  params: Promise<{ slug: string }>;
};

const allPages = pages as PageItem[];
const siteUrl = 'https://online-tutoring-seo-site.vercel.app';
const siteName = '온라인 과외 전문';
const ogImage = `${siteUrl}/images/online/main-01.png`;
const subjectOrder = ['국어', '영어', '수학', '사회', '과학', '한국사'];
const gradeOrder = ['초등', '중등', '고등'];
const goalOrder = [
  '기초',
  '개념',
  '문법',
  '어휘',
  '독해',
  '문제풀이',
  '시험대비',
  '내신',
  '수행평가',
  '심화',
  '학습습관',
  '입시',
];
const goalLabels: Record<string, string> = {
  시험대비: '시험 대비',
  문제풀이: '문제 풀이',
  학습습관: '학습 습관 관리',
};
const similarGoals: Record<string, string[]> = {
  시험대비: ['시험대비', '내신', '문제풀이', '개념'],
  내신: ['내신', '시험대비', '수행평가', '개념'],
  문제풀이: ['문제풀이', '개념', '시험대비', '심화'],
  기초: ['기초', '개념', '학습습관', '문제풀이'],
  개념: ['개념', '기초', '문제풀이', '문법'],
  문법: ['문법', '개념', '어휘', '문제풀이'],
  어휘: ['어휘', '독해', '개념', '문법'],
  독해: ['독해', '어휘', '문제풀이', '개념'],
  수행평가: ['수행평가', '내신', '개념', '문제풀이'],
  심화: ['심화', '문제풀이', '개념', '입시'],
  학습습관: ['학습습관', '기초', '개념', '내신'],
  입시: ['입시', '심화', '내신', '시험대비'],
};

const gradeHeadlines: Record<string, string[]> = {
  초등: [
    '기초 개념부터 공부 습관까지 차근차근 잡는 온라인 수업',
    '스스로 설명하고 푸는 힘을 기르는 1대1 온라인 과외',
    '낯선 개념도 천천히 확인하며 자신감을 키우는 수업',
    '이해 과정에 집중해 학습 흐름을 만드는 초등 맞춤 수업',
    '집에서도 학습 흐름을 놓치지 않도록 관리하는 온라인 과외',
  ],
  중등: [
    '내신과 수행평가를 함께 준비하는 중등 맞춤 온라인 수업',
    '개념 이해와 시험 대비를 균형 있게 관리하는 1대1 과외',
    '학년이 올라갈수록 필요한 풀이 습관을 정리하는 수업',
    '진도와 개인 약점을 함께 확인하는 온라인 과외',
    '중등 과정의 개념 연결을 놓치지 않게 잡아주는 수업',
  ],
  고등: [
    '심화 개념과 시험 대비를 목표에 맞게 관리하는 온라인 수업',
    '내신과 입시 준비를 함께 고려하는 고등 맞춤 과외',
    '문제 접근 방식과 오답 원인을 함께 정리하는 1대1 수업',
    '과목별 약점을 분석해 학습 방향을 잡는 온라인 과외',
    '실전 대비와 개념 정리를 함께 진행하는 고등 수업',
  ],
};

const subjectHeadlines: Record<string, string[]> = {
  국어: ['독해력과 어휘력을 함께 다지는', '지문 분석과 서술형 정리를 연결하는', '핵심 문장과 근거를 정확히 찾는'],
  영어: ['문법과 독해의 연결을 탄탄하게 만드는', '어휘와 해석 습관을 함께 정리하는', '문장 구조를 이해하며 독해력을 키우는'],
  수학: ['개념 이해와 풀이 과정을 꼼꼼히 확인하는', '유형별 접근법과 오답 원인을 정리하는', '풀이의 근거를 스스로 설명하게 만드는'],
  사회: ['개념 흐름과 용어를 차근차근 연결하는', '자료 해석과 핵심 개념을 함께 익히는', '단원 흐름을 이해하며 개념을 정리하는'],
  과학: ['개념 원리와 문제 적용을 함께 다루는', '실험과 탐구 과정을 개념으로 연결하는', '과학 원리를 이해하고 풀이에 적용하는'],
  한국사: ['시대 흐름과 사건의 연결을 이해하는', '핵심 개념과 주요 사건을 함께 정리하는', '시대별 흐름을 바탕으로 자료를 해석하는'],
};

const subjectSummaries: Record<string, string[]> = {
  국어: ['독해력과 어휘력을 바탕으로 지문 분석과 서술형 정리를 함께 연습합니다.', '핵심 문장과 근거를 찾으며 글의 구조를 정확히 읽는 힘을 기릅니다.'],
  영어: ['문법과 어휘를 문장 해석에 연결해 안정적인 독해 습관을 만듭니다.', '문장 구조를 이해하고 핵심 내용을 자신의 말로 해석하는 과정을 확인합니다.'],
  수학: ['개념 이해부터 풀이 과정, 오답 원인과 유형별 접근법까지 확인합니다.', '답만 맞히기보다 풀이의 근거를 설명하고 실수를 바로잡는 데 집중합니다.'],
  사회: ['개념 흐름과 용어를 정리하고 다양한 자료를 해석하는 힘을 기릅니다.', '단원별 핵심 개념을 사례와 자료에 연결해 이해하도록 돕습니다.'],
  과학: ['개념 원리를 실험과 탐구, 문제 상황에 연결해 이해합니다.', '과학 용어와 원리를 정확히 정리한 뒤 문제에 적용하는 과정을 연습합니다.'],
  한국사: ['시대 흐름과 사건의 원인을 연결하고 핵심 개념을 정리합니다.', '주요 사건과 시대적 배경을 함께 이해하며 자료 해석력을 기릅니다.'],
};

const goalSummaries: Record<string, string[]> = {
  기초: ['처음부터 기본 개념을 다시 확인하며 학습 공백을 보완합니다.', '쉬운 개념부터 단계적으로 연결해 기초를 안정적으로 다집니다.'],
  문법: ['규칙을 이해한 뒤 예문에 적용하고 자주 틀리는 부분을 정리합니다.', '헷갈리는 규칙을 비교하며 정확한 적용 방법을 익힙니다.'],
  독해: ['지문 읽는 순서와 핵심 문장, 답의 근거를 찾는 과정을 연습합니다.', '글의 구조를 파악하고 필요한 정보를 정확히 찾는 힘을 기릅니다.'],
  어휘: ['단순 암기보다 문맥 속 뜻과 활용 방법을 함께 익힙니다.', '핵심 어휘와 개념어를 문장 안에서 이해하고 활용합니다.'],
  개념: ['원리를 이해하고 핵심 개념 사이의 연결을 분명하게 정리합니다.', '개념의 근거를 설명하며 문제에 적용할 수 있는지 확인합니다.'],
  문제풀이: ['풀이 과정을 점검하고 유형별 접근법과 오답 원인을 분석합니다.', '문제마다 필요한 개념을 찾고 실수를 줄이는 풀이 순서를 익힙니다.'],
  수행평가: ['과제 방향과 평가 기준을 이해하고 발표와 서술형 준비를 진행합니다.', '준비 순서를 세워 보고서와 발표 내용을 구체적으로 정리합니다.'],
  내신: ['시험 범위의 핵심 개념과 서술형, 객관식 유형을 함께 준비합니다.', '단원별 핵심을 정리하고 자주 틀리는 유형을 반복 점검합니다.'],
  시험대비: ['시험 범위와 빈출 유형을 정리하고 실전 풀이를 반복합니다.', '핵심 개념을 빠르게 점검한 뒤 시간 안에 푸는 연습을 진행합니다.'],
  심화: ['고난도 개념을 응용 문제에 적용하며 사고력을 확장합니다.', '여러 개념이 연결된 문제를 분석하고 새로운 접근법을 익힙니다.'],
  입시: ['내신과 수능, 입시 목표를 연결해 학습 우선순위를 정합니다.', '현재 수준과 목표를 비교해 실전 대비 방향을 구체적으로 설계합니다.'],
  학습습관: ['수업 후 복습과 오답 정리를 이어가며 학습 루틴을 만듭니다.', '계획과 실행, 복습이 반복되는 안정적인 공부 흐름을 형성합니다.'],
};

const deliverySummaries = [
  '실시간 화면 공유로 이해와 풀이 과정을 바로 확인합니다.',
  '학생이 직접 설명하고 질문하는 1대1 흐름으로 진행합니다.',
  '수업 후 복습 자료로 핵심 내용을 다시 점검합니다.',
  '현재 수준에 맞춰 설명 속도와 문제 난도를 조정합니다.',
  '개념 확인부터 오답 정리까지 한 흐름으로 관리합니다.',
];

function getStableHash(value: string) {
  let hash = 0;

  for (const character of value) {
    hash = (hash * 31 + character.charCodeAt(0)) >>> 0;
  }

  return hash;
}

function getStableIndex(value: string, length: number) {
  return getStableHash(value) % length;
}

function pickStable<T>(options: T[], key: string) {
  return options[getStableIndex(key, options.length)] as T;
}

function getDetailCopy(page: PageItem) {
  const gradeOptions = gradeHeadlines[page.grade] ?? gradeHeadlines.초등;
  const subjectOptions = subjectHeadlines[page.subject] ?? subjectHeadlines.국어;
  const subjectSummaryOptions = subjectSummaries[page.subject] ?? subjectSummaries.국어;
  const goalSummaryOptions = goalSummaries[page.goal] ?? goalSummaries.개념;
  const gradeHeadline = pickStable(gradeOptions, `${page.slug}:grade`);
  const subjectHeadline = pickStable(subjectOptions, `${page.slug}:subject`);
  const alternateSubjectHeadline = subjectOptions[
    (getStableIndex(`${page.slug}:subject`, subjectOptions.length) + 1) % subjectOptions.length
  ] as string;
  const subjectSummary = pickStable(subjectSummaryOptions, `${page.slug}:subject-summary`);
  const goalSummary = pickStable(goalSummaryOptions, `${page.slug}:goal-summary`);

  return {
    heroTitle: pickStable(
      [
        `온라인 ${page.grade} ${page.subject}과외, ${page.goal} ${subjectHeadline} 수업`,
        `${page.grade} ${page.subject} ${page.goal} 온라인 과외, ${subjectHeadline} 수업`,
        `온라인 ${page.grade} ${page.subject}과외, ${page.goal} ${alternateSubjectHeadline} 수업`,
        `${page.grade} ${page.subject} ${page.goal} 온라인 과외, ${alternateSubjectHeadline} 1대1 수업`,
      ],
      `${page.slug}:hero`,
    ),
    overviewLabel: pickStable(
      ['수업 핵심 안내', `${page.subject} 학습 방향`, `${page.goal} 수업 한눈에 보기`, '온라인 수업 핵심 정리'],
      `${page.slug}:overview`,
    ),
    summaryTitle: pickStable(
      [
        `${page.grade} ${page.subject} ${page.goal} 학습 한눈에 보기`,
        `${page.goal} 목표에 맞춘 ${page.subject} 학습 관리`,
        `${page.subject} ${page.goal}, 이번 수업의 핵심`,
        `온라인 ${page.grade} ${page.subject}${page.goal} 과외 핵심 정리`,
      ],
      `${page.slug}:summary-title`,
    ),
    summaryIntro: pickStable(
      [
        `${goalSummary} ${subjectSummary}`,
        `온라인 ${page.grade} ${page.subject}${page.goal} 과외는 현재 수준을 확인한 뒤 목표에 맞는 순서로 학습을 진행합니다.`,
        `${gradeHeadline} ${goalSummary}`,
      ],
      `${page.slug}:summary-intro`,
    ),
    summaryPoints: [
      subjectSummary,
      goalSummary,
      pickStable(deliverySummaries, `${page.slug}:delivery`),
    ],
    introHeading: pickStable(
      [
        `${page.grade} ${page.subject} ${page.goal} 수업이 필요한 순간`,
        `${page.subject} ${page.goal}, 먼저 확인할 학습 상태`,
        `${page.goal} 준비 전에 살펴볼 ${page.subject} 학습 흐름`,
      ],
      `${page.slug}:intro-heading`,
    ),
    directionHeading: pickStable(
      [
        `${page.subject} ${page.goal} 목표에 맞춘 수업 방향`,
        `${page.mainKeyword} 학습 설계`,
        `${page.grade} ${page.subject}, ${page.goal} 과정을 정리하는 방법`,
      ],
      `${page.slug}:direction-heading`,
    ),
    managementHeading: pickStable(
      [
        `온라인 ${page.subject} 수업에서 확인하는 학습 과정`,
        `${page.subject} 개념과 ${page.goal} 준비를 관리하는 방식`,
        `1대1 수업에서 놓치지 않는 ${page.subject} 학습 포인트`,
      ],
      `${page.slug}:management-heading`,
    ),
    outcomeHeading: pickStable(
      [
        `${page.subject} ${page.goal} 학습으로 기대하는 변화`,
        '풀이와 복습 과정이 달라지는 지점',
        `${page.grade} ${page.subject} 학습의 다음 단계`,
      ],
      `${page.slug}:outcome-heading`,
    ),
    learningHeading: pickStable(
      [
        `${page.grade} ${page.subject} 학습 포인트`,
        `${page.subject} ${page.goal} 핵심 관리 항목`,
        `${page.goal} 목표를 위한 ${page.subject} 체크 포인트`,
      ],
      `${page.slug}:learning-heading`,
    ),
    seoHeading: pickStable(
      [
        `${page.grade} ${page.subject}과외, ${page.goal} 목표에 맞는 관리가 중요합니다`,
        `온라인 ${page.grade} ${page.subject}과외를 선택할 때 확인할 점`,
        `${page.subject} ${page.goal} 수업, 설명과 복습이 이어져야 합니다`,
      ],
      `${page.slug}:seo-heading`,
    ),
    keywordHeading: pickStable(
      [
        '함께 보면 좋은 온라인 과외',
        '같은 학년에서 이어서 볼 수업',
        `${page.grade} 학생에게 맞는 다른 수업`,
        `${page.subject}와 함께 많이 보는 과외`,
        '목표에 맞춰 이어서 살펴볼 수업',
        `${page.grade} 온라인 과외 더 살펴보기`,
        '비슷한 학습 목표의 온라인 수업',
        '과목별로 함께 비교해볼 수업',
      ],
      `${page.slug}:keyword-heading`,
    ),
    faqHeading: pickStable(
      [
        `${page.grade} ${page.subject} 수업 자주 묻는 질문`,
        `${page.subject} ${page.goal} 과외 FAQ`,
        `온라인 ${page.subject} 수업 전 확인할 질문`,
      ],
      `${page.slug}:faq-heading`,
    ),
    relatedHeading: pickStable(
      [
        `${page.grade} 과정의 다른 온라인 과외`,
        `${page.subject} 학습과 함께 살펴볼 수업`,
        `${page.goal} 목표와 연결되는 온라인 과외`,
      ],
      `${page.slug}:related-heading`,
    ),
  };
}

function findPage(slug: string) {
  return allPages.find((page) => page.slug === slug);
}

function getGoalLabel(goal: string) {
  return goalLabels[goal] ?? goal;
}

function sortByLearningPath(firstPage: PageItem, secondPage: PageItem) {
  const firstGrade = gradeOrder.indexOf(firstPage.grade);
  const secondGrade = gradeOrder.indexOf(secondPage.grade);
  const firstSubject = subjectOrder.indexOf(firstPage.subject);
  const secondSubject = subjectOrder.indexOf(secondPage.subject);
  const firstGoal = goalOrder.indexOf(firstPage.goal);
  const secondGoal = goalOrder.indexOf(secondPage.goal);

  return (
    firstGrade - secondGrade ||
    firstSubject - secondSubject ||
    firstGoal - secondGoal ||
    firstPage.slug.localeCompare(secondPage.slug)
  );
}

function toRelatedLink(page: PageItem): RelatedLink {
  return {
    href: `/${page.slug}`,
    label: `${page.grade} ${page.subject} ${getGoalLabel(page.goal)} 온라인 과외`,
    meta: `${page.grade} · ${page.subject} · ${getGoalLabel(page.goal)}`,
  };
}

function addUniquePage(target: PageItem[], candidate: PageItem | undefined, currentPage: PageItem) {
  if (!candidate || candidate.slug === currentPage.slug) {
    return;
  }

  if (target.some((page) => page.slug === candidate.slug)) {
    return;
  }

  target.push(candidate);
}

function findSimilarGoalPage(grade: string, subject: string, currentGoal: string) {
  const goals = similarGoals[currentGoal] ?? [currentGoal];

  for (const goal of goals) {
    const page = allPages.find(
      (item) => item.grade === grade && item.subject === subject && item.goal === goal,
    );

    if (page) {
      return page;
    }
  }

  return allPages
    .filter((item) => item.grade === grade && item.subject === subject)
    .sort(sortByLearningPath)[0];
}

function getRelatedLinks(currentPage: PageItem): RelatedLink[] {
  const selectedPages: PageItem[] = [];
  const sameGradeAndSubject = allPages
    .filter(
      (page) =>
        page.slug !== currentPage.slug &&
        page.grade === currentPage.grade &&
        page.subject === currentPage.subject,
    )
    .sort((firstPage, secondPage) => {
      const currentGoalIndex = goalOrder.indexOf(currentPage.goal);
      const firstDistance = Math.abs(goalOrder.indexOf(firstPage.goal) - currentGoalIndex);
      const secondDistance = Math.abs(goalOrder.indexOf(secondPage.goal) - currentGoalIndex);

      return firstDistance - secondDistance || sortByLearningPath(firstPage, secondPage);
    });

  for (const page of sameGradeAndSubject.slice(0, 3)) {
    addUniquePage(selectedPages, page, currentPage);
  }

  for (const subject of subjectOrder.filter((subject) => subject !== currentPage.subject)) {
    addUniquePage(
      selectedPages,
      findSimilarGoalPage(currentPage.grade, subject, currentPage.goal),
      currentPage,
    );

    if (selectedPages.length >= 5) {
      break;
    }
  }

  for (const grade of gradeOrder.filter((grade) => grade !== currentPage.grade)) {
    addUniquePage(
      selectedPages,
      findSimilarGoalPage(grade, currentPage.subject, currentPage.goal),
      currentPage,
    );
  }

  for (const page of [...allPages].sort(sortByLearningPath)) {
    if (selectedPages.length >= 7) {
      break;
    }

    addUniquePage(selectedPages, page, currentPage);
  }

  return [
    ...selectedPages.slice(0, 7).map(toRelatedLink),
    {
      href: '/',
      label: '온라인 과외 전체 보기',
      meta: '홈',
    },
  ];
}

const subjectLearningPoint: Record<string, string> = {
  국어: '핵심 내용을 정확히 읽고 자신의 말로 설명하는 과정을 확인합니다.',
  영어: '어휘와 문장 구조를 연결해 독해와 문법의 기초를 함께 다집니다.',
  수학: '개념 이해와 문제풀이 과정을 함께 확인합니다.',
  사회: '핵심 개념과 자료 해석 과정을 연결해 이해합니다.',
  과학: '개념과 원리를 문제 상황에 적용하는 과정을 확인합니다.',
  한국사: '시대 흐름과 핵심 개념을 연결해 정리합니다.',
};

const gradeLearningPoint: Record<string, string> = {
  초등: '기초 개념과 학습습관을 함께 다져 스스로 공부하는 힘을 기릅니다.',
  중등: '내신과 수행평가를 함께 준비하며 과목별 약점을 정리합니다.',
  고등: '시험대비와 심화 학습, 입시 목표에 맞춰 우선순위를 관리합니다.',
};

function getLearningPoints(page: PageItem) {
  return [
    subjectLearningPoint[page.subject],
    gradeLearningPoint[page.grade],
    `${page.goal} 목표에 맞춰 오답 원인을 정리하고 반복 실수를 줄입니다.`,
  ];
}

export function generateStaticParams() {
  return allPages.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: DetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = findPage(slug);

  if (!page) {
    notFound();
  }

  const detailCopy = getDetailCopy(page);
  const pageTitle = `${detailCopy.heroTitle} | 호빈샘`;
  const pageUrl = `${siteUrl}/${page.slug}`;

  return {
    title: pageTitle,
    description: page.metaDescription,
    alternates: {
      canonical: pageUrl,
    },
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      type: 'website',
      locale: 'ko_KR',
      siteName,
      url: pageUrl,
      title: pageTitle,
      description: page.metaDescription,
      images: [
        {
          url: ogImage,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: pageTitle,
      description: page.metaDescription,
      images: [ogImage],
    },
  };
}

export default async function DetailPage({ params }: DetailPageProps) {
  const { slug } = await params;
  const page = findPage(slug);

  if (!page) {
    notFound();
  }

  const gradeKey = getGradeKey(page.grade);
  const [heroImage, inlineImage] = getStableImages(
    detailImages[gradeKey],
    page.slug,
    2,
  );
  const relatedLinks = getRelatedLinks(page);
  const learningPoints = getLearningPoints(page);
  const detailCopy = getDetailCopy(page);
  const pageTitle = `${detailCopy.heroTitle} | 호빈샘`;
  const pageUrl = `${siteUrl}/${page.slug}`;
  const faqs = [
    { question: page.q1, answer: page.a1 },
    { question: page.q2, answer: page.a2 },
    { question: page.q3, answer: page.a3 },
  ];
  const webPageSchema = createWebPageSchema({
    siteName,
    siteUrl,
    pageUrl,
    pageName: pageTitle,
    description: page.metaDescription,
  });
  const breadcrumbSchema = createBreadcrumbSchema({
    siteUrl,
    pageUrl,
    pageName: detailCopy.heroTitle,
  });
  const faqPageSchema = createFaqPageSchema(faqs);

  return (
    <main className="site detailSite">
      <JsonLd id="webpage-json-ld" data={webPageSchema} />
      <JsonLd id="breadcrumb-json-ld" data={breadcrumbSchema} />
      {faqPageSchema ? <JsonLd id="faq-json-ld" data={faqPageSchema} /> : null}
      <QuickConsultActions />

      <article className="blogArticle">
        <header className="blogHero">
          <div className="blogHeroCopy">
            <div className="detailBadges">
              <span>{page.grade}</span>
              <span>{page.subject}</span>
              <span>{page.goal}</span>
            </div>
            <h1>{detailCopy.heroTitle}</h1>
            <div className="metaDescriptionBox">
              <strong>{detailCopy.overviewLabel}</strong>
              <p>{page.metaDescription}</p>
            </div>
            <div className="heroButtons">
              <a href="#consult" className="primaryBtn">상담 신청하기</a>
              <a href="tel:01082867620" className="secondaryBtn">전화 상담하기 010-8286-7620</a>
            </div>
          </div>

          <div className="detailHeroImage">
            <Image
              src={heroImage}
              alt={`${page.grade} ${page.subject} 1대1 온라인 과외 수업`}
              fill
              className="detailImage"
              sizes="(max-width: 900px) 100vw, 48vw"
              priority
            />
          </div>
        </header>

        <div className="blogContent">
          <aside className="detailSummaryBox">
            <p className="sectionLabel">3줄 요약</p>
            <h2>{detailCopy.summaryTitle}</h2>
            <p>{detailCopy.summaryIntro}</p>
            <ul>
              {detailCopy.summaryPoints.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </aside>

          <section className="articleSection">
            <h2>{detailCopy.introHeading}</h2>
            <p>{page.intro}</p>
          </section>

          <section className="articleSection">
            <h2>{detailCopy.directionHeading}</h2>
            <p>{page.body1}</p>
          </section>

          <section className="articleSection">
            <h2>{detailCopy.managementHeading}</h2>
            <p>{page.body2}</p>
          </section>

          <div className="detailInlineImage">
            <Image
              src={inlineImage}
              alt={`${page.grade} ${page.subject} 화상 수업 학습 관리`}
              fill
              className="detailImage"
              sizes="(max-width: 900px) 100vw, 820px"
            />
          </div>

          <section className="articleSection">
            <h2>{detailCopy.outcomeHeading}</h2>
            <p>{page.body3}</p>
          </section>

          <aside className="learningPointBox">
            <p className="sectionLabel">맞춤 학습 관리</p>
            <h2>{detailCopy.learningHeading}</h2>
            <ul>
              {learningPoints.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </aside>

          <aside className="seoKeywordBox">
            <p className="sectionLabel">온라인 수업 선택 기준</p>
            <h2>{detailCopy.seoHeading}</h2>
            <p>
              온라인 {page.grade} {page.subject}과외를 찾는 경우에는 단순히 진도만
              빠르게 나가기보다 현재 개념 이해도와 {page.goal} 준비 상태, 문제를
              푸는 습관부터 확인하는 과정이 중요합니다. 호빈샘 온라인 과외는
              {` ${page.grade} 온라인 ${page.subject}과외`}와
              {` ${page.grade}${page.subject}과외`},
              {` ${page.grade} ${page.subject} 온라인 과외`}를 알아보는 학생에게
              맞춰 설명과 실시간 풀이 확인, 오답 정리를 함께 진행합니다. 1대1
              {` ${page.grade} ${page.subject}과외`}는 물론 화상
              {` ${page.grade} ${page.subject}과외`}와 비대면
              {` ${page.grade} ${page.subject}과외`}를 고민할 때도 학생이 직접
              이해하고 설명할 수 있는지를 중심으로 수업을 설계합니다.
            </p>
          </aside>

          <section className="articleSection faqSection">
            <p className="sectionLabel">FAQ</p>
            <h2>{detailCopy.faqHeading}</h2>
            <p className="faqIntro">{page.faq1}</p>
            <div className="faqList">
              {faqs.map((faq, index) => (
                <article className="faqCard" key={faq.question}>
                  <span>Q{index + 1}</span>
                  <div>
                    <strong>{faq.question}</strong>
                    <p>{faq.answer}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>
      </article>

      <section className="relatedSection">
        <div className="sectionHeading">
          <p className="sectionLabel">함께 살펴보기</p>
          <h2>함께 살펴보면 좋은 온라인 과외</h2>
        </div>
        <div className="relatedGrid">
          {relatedLinks.map((relatedLink) => (
            <Link href={relatedLink.href} className="relatedCard" key={relatedLink.href}>
              <small>{relatedLink.meta}</small>
              <strong>{relatedLink.label}</strong>
              <span>자세히 보기 →</span>
            </Link>
          ))}
        </div>
      </section>

      <section id="consult" className="consultSection detailConsultSection">
        <div className="consultCopy">
          <p className="sectionLabel">1대1 상담</p>
          <h2>{page.grade} {page.subject} 온라인 과외 상담</h2>
          <p>
            현재 학습 상황과 {page.goal} 목표를 알려주시면 온라인 수업에서 먼저
            관리할 부분을 안내해드립니다.
          </p>
          <div className="consultProcess">
            <h3 className="consultProcessTitle">수업 시작 전 절차</h3>
            <p className="consultProcessDesc">
              상담과 무료 모의수업을 거친 뒤 정식 수업 여부를 결정할 수 있습니다.
            </p>
            <ol className="consultProcessSteps">
              {['상담신청', '전화상담', '선생님 배정', '무료 모의수업', '수업 결정'].map(
                (step, index) => (
                  <li className="consultProcessStep" key={step}>
                    <span className="consultProcessNumber">{index + 1}</span>
                    <strong>{step}</strong>
                  </li>
                ),
              )}
            </ol>
          </div>
        </div>

        <ConsultationForm
          showHeader={false}
          gradePlaceholder="예: 초4, 중2, 고1"
          phonePlaceholder="예: 010-0000-0000"
        />
      </section>
    </main>
  );
}
