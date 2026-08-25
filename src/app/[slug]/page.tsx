import { getDetailImages } from '@/data/imageMap';
import pages from '@/data/pages.json';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ConsultationForm from '../ConsultationForm';
import JsonLd from '../JsonLd';
import QuickConsultActions from '../QuickConsultActions';
import TutoringDecisionGuide from '../TutoringDecisionGuide';
import {
  createBreadcrumbSchema,
  createFaqPageSchema,
  createWebPageSchema,
} from '@/lib/structured-data';
import {
  getContextualGoalLabel,
  getContextualMetaDescription,
  normalizeKoreanParticles,
} from '@/lib/tutoring-labels';

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

const bodyFields: Array<keyof Pick<PageItem, 'intro' | 'body1' | 'body2' | 'body3' | 'faq1' | 'a1' | 'a2' | 'a3'>> = [
  'intro',
  'body1',
  'body2',
  'body3',
  'faq1',
  'a1',
  'a2',
  'a3',
];

function getRepeatedBodySentences() {
  const sentenceCounts = new Map<string, number>();

  for (const page of allPages) {
    for (const field of bodyFields) {
      const sentences = page[field]
        .split(/(?<=[.!?])\s+/)
        .map((sentence) => sentence.trim())
        .filter((sentence) => sentence.length >= 20);

      for (const sentence of sentences) {
        sentenceCounts.set(sentence, (sentenceCounts.get(sentence) ?? 0) + 1);
      }
    }
  }

  return new Set(
    [...sentenceCounts.entries()]
      .filter(([, count]) => count >= 12)
      .map(([sentence]) => sentence),
  );
}

const repeatedBodySentences = getRepeatedBodySentences();

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

const subjectSearchTopics: Record<string, string> = {
  국어: '비문학 독해, 문학 작품 분석, 어휘와 서술형 답안',
  영어: '영어 어휘, 문법, 문장 구조와 독해',
  수학: '개념 이해, 유형별 문제풀이와 오답관리',
  사회: '교과 개념, 지도·도표·그래프 자료 해석',
  과학: '과학 개념, 실험·탐구 과정과 자료 해석',
  한국사: '시대 흐름, 핵심 사건, 사료와 연표 해석',
};

const goalSearchFocus: Record<string, string> = {
  기초: '학습 공백을 찾고 쉬운 개념부터 다시 연결하는 과정',
  개념: '용어를 외우는 데서 끝내지 않고 원리를 설명하는 과정',
  문법: '규칙을 예문과 실제 문제에 정확히 적용하는 과정',
  어휘: '핵심 어휘를 문맥과 문제 조건 안에서 익히는 과정',
  독해: '글과 자료의 구조를 읽고 답의 근거를 찾는 과정',
  문제풀이: '풀이 순서와 선택 근거를 확인하며 실수를 줄이는 과정',
  시험대비: '시험 범위와 남은 기간에 맞춰 복습 순서를 정하는 과정',
  내신: '학교 진도와 시험 범위, 서술형과 오답을 함께 관리하는 과정',
  수행평가: '평가 기준을 확인하고 발표·보고서·서술 과정을 나누는 준비',
  심화: '여러 개념이 연결된 문제에서 접근 근거를 설명하는 과정',
  학습습관: '계획과 실행, 복습 여부를 수업마다 확인하는 과정',
  입시: '현재 성적과 목표를 비교해 학습 우선순위를 세우는 과정',
};

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

function getDisplayMainKeyword(page: PageItem) {
  return `온라인 ${page.grade} ${page.subject} ${getContextualGoalLabel(page)} 과외`;
}

const subjectLearningFocus: Record<string, string> = {
  국어: '지문 근거, 핵심 문장, 서술형 표현',
  영어: '어휘 뜻, 문장 구조, 해석 근거',
  수학: '개념 연결, 식 세우기, 풀이 과정',
  사회: '교과 용어, 사례 연결, 자료 해석',
  과학: '원리 이해, 실험 조건, 탐구 자료',
  한국사: '시대 흐름, 사건 관계, 사료 근거',
};

const deliverySummaryTemplates: Record<string, string[]> = {
  초등: [
    '{subjectFocus} 중심으로 짧은 질문과 적용 문제를 확인합니다.',
    '{goalLabel}에 필요한 개념을 말로 설명하고 예시 문제에 바로 써 봅니다.',
    '화면에 남긴 표시를 보며 {subject} 표현과 풀이 과정을 천천히 정리합니다.',
  ],
  중등: [
    '학교 진도에 맞춰 {subjectFocus} 항목을 확인하고 오답을 다음 과제로 연결합니다.',
    '{goalLabel} 준비 과정에서 풀이 근거와 과제 진행 상황을 함께 점검합니다.',
    '수업 중 표시한 {subject} 오답을 내신과 수행평가 준비 흐름에 맞춰 정리합니다.',
  ],
  고등: [
    '내신과 모의고사 흐름을 함께 보며 {subjectFocus}의 우선순위를 정합니다.',
    '{goalLabel} 목표에 맞춰 개념 연결과 실전 적용 과정을 수업 중 점검합니다.',
    '심화 문제 접근 과정에서 {subject} 근거와 시간 배분을 함께 확인합니다.',
  ],
};

function getDeliverySummary(page: PageItem) {
  const goalLabel = getContextualGoalLabel(page);
  const subjectFocus = subjectLearningFocus[page.subject] ?? '개념 이해와 적용 과정';
  const templates = deliverySummaryTemplates[page.grade] ?? deliverySummaryTemplates.초등;
  const template = pickStable(templates, `${page.slug}:delivery`);

  return template
    .split('{subjectFocus}')
    .join(subjectFocus)
    .split('{goalLabel}')
    .join(goalLabel)
    .split('{subject}')
    .join(page.subject);
}

function getDetailCopy(page: PageItem) {
  const goalLabel = getContextualGoalLabel(page);
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
        `온라인 ${page.grade} ${page.subject}과외, ${goalLabel} ${subjectHeadline} 수업`,
        `${page.grade} ${page.subject} ${goalLabel} 온라인 과외, ${subjectHeadline} 수업`,
        `온라인 ${page.grade} ${page.subject}과외, ${goalLabel} ${alternateSubjectHeadline} 수업`,
        `${page.grade} ${page.subject} ${goalLabel} 온라인 과외, ${alternateSubjectHeadline} 1대1 수업`,
      ],
      `${page.slug}:hero`,
    ),
    overviewLabel: pickStable(
      ['수업 핵심 안내', `${page.subject} 학습 방향`, `${goalLabel} 수업 한눈에 보기`, '온라인 수업 핵심 정리'],
      `${page.slug}:overview`,
    ),
    summaryTitle: pickStable(
      [
        `${page.grade} ${page.subject} ${goalLabel} 학습 한눈에 보기`,
        `${goalLabel} 목표에 맞춘 ${page.subject} 학습 관리`,
        `${page.subject} ${goalLabel}, 이번 수업의 핵심`,
        `온라인 ${page.grade} ${page.subject} ${goalLabel} 과외 핵심 정리`,
      ],
      `${page.slug}:summary-title`,
    ),
    summaryIntro: pickStable(
      [
        `${goalSummary} ${subjectSummary}`,
        `온라인 ${page.grade} ${page.subject} ${goalLabel} 과외는 현재 수준을 확인한 뒤 목표에 맞는 순서로 학습을 진행합니다.`,
        `${gradeHeadline} ${goalSummary}`,
      ],
      `${page.slug}:summary-intro`,
    ),
    summaryPoints: [
      subjectSummary,
      goalSummary,
      getDeliverySummary(page),
    ],
    introHeading: pickStable(
      [
        `${page.grade} ${page.subject} ${goalLabel} 수업이 필요한 순간`,
        `${page.subject} ${goalLabel}, 먼저 확인할 학습 상태`,
        `${goalLabel} 준비 전에 살펴볼 ${page.subject} 학습 흐름`,
      ],
      `${page.slug}:intro-heading`,
    ),
    directionHeading: pickStable(
      [
        `${page.subject} ${goalLabel} 목표에 맞춘 수업 방향`,
        `${getDisplayMainKeyword(page)} 학습 설계`,
        `${page.grade} ${page.subject}, ${goalLabel} 과정을 정리하는 방법`,
      ],
      `${page.slug}:direction-heading`,
    ),
    managementHeading: pickStable(
      [
        `온라인 ${page.subject} 수업에서 확인하는 학습 과정`,
        `${page.subject} 개념과 ${goalLabel} 준비를 관리하는 방식`,
        `1대1 수업에서 놓치지 않는 ${page.subject} 학습 포인트`,
      ],
      `${page.slug}:management-heading`,
    ),
    outcomeHeading: pickStable(
      [
        `${page.subject} ${goalLabel} 학습으로 기대하는 변화`,
        '풀이와 복습 과정이 달라지는 지점',
        `${page.grade} ${page.subject} 학습의 다음 단계`,
      ],
      `${page.slug}:outcome-heading`,
    ),
    learningHeading: pickStable(
      [
        `${page.grade} ${page.subject} 학습 포인트`,
        `${page.subject} ${goalLabel} 핵심 관리 항목`,
        `${goalLabel} 목표를 위한 ${page.subject} 체크 포인트`,
      ],
      `${page.slug}:learning-heading`,
    ),
    seoHeading: pickStable(
      [
        `${page.grade} ${page.subject}과외, ${goalLabel} 목표에 맞는 관리가 중요합니다`,
        `온라인 ${page.grade} ${page.subject}과외를 선택할 때 확인할 점`,
        `${page.subject} ${goalLabel} 수업, 설명과 복습이 이어져야 합니다`,
      ],
      `${page.slug}:seo-heading`,
    ),
    seoParagraph: pickStable(
      [
        `${page.grade} ${page.subject} 온라인 과외를 알아볼 때는 진도 속도보다 ${goalSearchFocus[page.goal]} 중심으로 현재 상태를 먼저 확인하는 것이 좋습니다. ${subjectSearchTopics[page.subject]} 항목을 ${page.grade} 학생이 ${goalLabel} 목표에 맞춰 직접 설명하고 적용하는지 살펴야 수업 이후 복습도 이어질 수 있습니다. 실시간 1대1 ${page.subject} 수업에서는 답만 확인하지 않고 필기와 풀이 순서, 질문 반응을 함께 보며 ${goalLabel}에 맞는 과제량을 조정합니다.`,
        `온라인 ${page.grade} ${page.subject}과외는 장소의 편리함만으로 선택하기보다 ${goalSearchFocus[page.goal]} 중심으로 수업이 진행되는지 비교해야 합니다. ${page.grade} ${page.subject} ${goalLabel} 수업 중에는 ${subjectSearchTopics[page.subject]} 내용을 화면에 표시하고, 학생이 이해한 부분을 말과 글로 다시 표현하도록 확인합니다. 이 기록을 ${page.grade} ${page.subject} 오답과 복습에 연결하면 ${goalLabel} 준비가 단순 반복으로 끝나는 것을 줄일 수 있습니다.`,
        `${page.grade} 학생의 ${page.subject} ${goalLabel} 수업에서는 현재 점수만 보는 것보다 어느 단계에서 풀이가 멈추는지 진단하는 일이 먼저입니다. ${page.grade} ${page.subject} ${goalLabel} 학습에서는 ${subjectSearchTopics[page.subject]} 내용을 중심으로 이해, 적용, 오답 정리의 순서를 만들고 실시간 질문으로 상태를 확인합니다. 온라인 ${page.grade} ${page.subject} 수업 전에는 ${goalLabel} 지도 범위와 일정, 과제 확인 방식도 함께 비교하는 것이 좋습니다.`,
        `${page.subject} 온라인 과외를 찾는 ${page.grade} 학생이라면 ${goalSearchFocus[page.goal]} 중심의 수업 후 관리 방식을 함께 살펴보세요. 화면 공유로 ${page.grade} ${page.subject} ${goalLabel}에 필요한 ${subjectSearchTopics[page.subject]} 내용을 확인하고, 학생이 직접 풀이 근거를 설명하도록 합니다. 무료 모의수업에서는 ${page.grade} ${page.subject} ${goalLabel}에 맞는 설명 속도와 질문 방식, 화면 집중도도 먼저 확인할 수 있습니다.`,
      ],
      `${page.slug}:seo-paragraph`,
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
        `${page.subject} ${goalLabel} 과외 FAQ`,
        `온라인 ${page.subject} 수업 전 확인할 질문`,
      ],
      `${page.slug}:faq-heading`,
    ),
    relatedHeading: pickStable(
      [
        `${page.grade} 과정의 다른 온라인 과외`,
        `${page.subject} 학습과 함께 살펴볼 수업`,
        `${goalLabel} 목표와 연결되는 온라인 과외`,
      ],
      `${page.slug}:related-heading`,
    ),
    metaDescription: getContextualMetaDescription(page),
  };
}

function findPage(slug: string) {
  return allPages.find((page) => page.slug === slug);
}

function personalizeParagraph(
  page: PageItem,
  paragraph: string,
  sectionLabel: string,
) {
  const goalLabel = getContextualGoalLabel(page);
  const context = `${page.grade} ${page.subject} ${goalLabel}`;

  return normalizeKoreanParticles(paragraph)
    .split(/(?<=[.!?])\s+/)
    .map((sentence, index) => {
      const trimmedSentence = sentence.trim();

      if (!repeatedBodySentences.has(trimmedSentence)) {
        return trimmedSentence;
      }

      return rewriteRepeatedSentence(page, context, sectionLabel, index);
    })
    .join(' ');
}

const sectionRewriteTemplates: Record<string, string[]> = {
  '학습 진단': [
    '{context} 수업을 시작할 때는 최근에 막힌 단원과 답을 고른 이유를 먼저 듣고, 바로 확인할 문제를 짧게 정합니다.',
    '{grade} 학생의 {subject} 흐름을 보며 읽기, 설명, 풀이 중 어느 단계에서 멈추는지 나누어 확인합니다.',
    '{goal} 목표에 필요한 준비 상태를 과제량보다 이해 과정 중심으로 살펴보고 첫 수업의 우선순위를 정합니다.',
  ],
  '수업 설계': [
    '{context} 과정은 설명, 적용 문제, 짧은 피드백이 이어지도록 구성해 수업 중 바로 이해도를 확인합니다.',
    '{grade} {subject} 수업에서는 {subjectFocus} 중심으로 설명할 부분과 바로 풀어볼 문제를 나누어 둡니다.',
    '{subject} {goal} 과정은 먼저 볼 개념과 적용 문제를 구분해 학생이 근거를 말해보는 시간까지 확보합니다.',
    '{goal} 준비에 맞춰 {subjectFocus}를 다루는 순서와 확인 문제의 난도를 수업 안에서 조정합니다.',
    '{goal} 준비에 필요한 단원부터 순서를 잡고, 이미 아는 내용은 빠르게 지나가며 막힌 부분에 시간을 둡니다.',
  ],
  '실시간 관리': [
    '화면 공유 중에는 {subject} 풀이 흔적과 답변을 함께 보며 다음 질문의 난도와 설명 속도를 조정합니다.',
    '{grade} {subject} 수업에서는 학생의 설명과 화면 필기를 함께 보며 {subjectFocus} 중 다시 볼 지점을 가릅니다.',
    '{goal} 학습 중 나온 답변은 말로 확인한 근거와 필기 흔적을 나누어 보고 다음 예시를 정합니다.',
    '학생이 직접 정리한 {subject} 풀이와 질문 반응을 보며 이해한 내용과 보완할 내용을 구분합니다.',
    '1대1 온라인 수업에서는 {goal}에 필요한 자료를 바로 표시하고 학생 반응에 맞춰 예시를 바꿔 봅니다.',
  ],
  '복습 관리': [
    '수업 뒤에는 {context}에서 다시 볼 문제와 개념을 짧게 남기고 다음 시간 첫 순서로 확인합니다.',
    '{subject} 오답은 틀린 답만 모으지 않고, 왜 그 선택을 했는지까지 적어 다음 복습의 기준으로 삼습니다.',
    '{goal} 학습이 이어지도록 과제량을 무리하게 늘리기보다 반복해서 흔들린 유형을 우선 점검합니다.',
  ],
  '상담 안내': [
    '상담에서는 {context}에 필요한 수업 범위, 과제 확인 방식, 복습 흐름을 함께 정리합니다.',
    '{grade} {subject} 수업 전에는 현재 진도와 원하는 목표를 듣고 온라인 수업에서 먼저 볼 지점을 안내합니다.',
    '{goal} 준비가 필요한 이유를 확인한 뒤 학생에게 맞는 설명 방식과 수업 간격을 조정합니다.',
  ],
};

function rewriteRepeatedSentence(
  page: PageItem,
  context: string,
  sectionLabel: string,
  sentenceIndex: number,
) {
  const templates = sectionRewriteTemplates[sectionLabel] ?? [
    '{context} 수업에서는 학생이 멈춘 지점을 확인하고 다음 설명과 복습 순서를 조정합니다.',
    '{grade} {subject} 학습 흐름에 맞춰 개념 확인, 적용, 오답 정리를 한 번에 이어 갑니다.',
    '{goal} 목표에 필요한 내용을 수업 중 바로 점검하고 다음 과제로 연결합니다.',
  ];
  const template = pickStable(templates, `${page.slug}:${sectionLabel}:${sentenceIndex}`);

  return template
    .split('{context}')
    .join(context)
    .split('{grade}')
    .join(page.grade)
    .split('{subject}')
    .join(page.subject)
    .split('{subjectFocus}')
    .join(subjectLearningFocus[page.subject] ?? '개념 이해와 적용 과정')
    .split('{goal}')
    .join(getContextualGoalLabel(page));
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
    label: `${page.grade} ${page.subject} ${getContextualGoalLabel(page)} 온라인 과외`,
    meta: `${page.grade} · ${page.subject} · ${getContextualGoalLabel(page)}`,
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

const gradeLearningPointTemplates: Record<string, string[]> = {
  초등: [
    '{subject} 기본 개념을 쉬운 예시로 확인하고, 학생이 직접 말하고 써 보는 시간을 둡니다.',
    '{goalLabel} 과정은 짧은 적용 문제와 복습 약속을 함께 남겨 공부 습관으로 이어지게 합니다.',
    '{subjectFocus} 중심으로 이해한 내용을 표현하고 다시 적용하는 연습을 반복합니다.',
  ],
  중등: [
    '학교 진도와 {goalLabel} 준비를 함께 보며 {subject} 오답 원인을 수업 후 과제로 연결합니다.',
    '{subjectFocus} 항목을 기준으로 내신 범위와 수행평가 준비 순서를 나누어 관리합니다.',
    '단원별 약점을 정리한 뒤 비슷한 {subject} 유형에서 같은 실수가 반복되는지 확인합니다.',
  ],
  고등: [
    '내신과 모의고사 흐름을 함께 살피며 {subject} 개념 연결과 {goalLabel} 우선순위를 정합니다.',
    '{subjectFocus} 중심으로 실전 문제에 적용하는 과정을 보며 심화 학습과 시험 준비를 조정합니다.',
    '{goalLabel} 목표에 맞춰 개념 정리, 오답 분석, 다음 학습 범위를 한 수업 안에서 구분합니다.',
  ],
};

function getGradeLearningPoint(page: PageItem) {
  const templates = gradeLearningPointTemplates[page.grade] ?? gradeLearningPointTemplates.초등;
  const template = pickStable(templates, `${page.slug}:grade-learning`);

  return template
    .split('{subject}')
    .join(page.subject)
    .split('{goalLabel}')
    .join(getContextualGoalLabel(page))
    .split('{subjectFocus}')
    .join(subjectLearningFocus[page.subject] ?? '개념 이해와 적용 과정');
}

function getLearningPoints(page: PageItem) {
  return [
    subjectLearningPoint[page.subject],
    getGradeLearningPoint(page),
    `${getContextualGoalLabel(page)} 목표에 맞춰 오답 원인을 정리하고 반복 실수를 줄입니다.`,
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
    description: detailCopy.metaDescription,
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
      description: detailCopy.metaDescription,
      images: [
        {
          url: ogImage,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: pageTitle,
      description: detailCopy.metaDescription,
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

  const [heroImage, inlineImage] = getDetailImages(page.grade, page.subject, page.slug, 2);
  const relatedLinks = getRelatedLinks(page);
  const learningPoints = getLearningPoints(page);
  const detailCopy = getDetailCopy(page);
  const goalLabel = getContextualGoalLabel(page);
  const pageTitle = `${detailCopy.heroTitle} | 호빈샘`;
  const pageUrl = `${siteUrl}/${page.slug}`;
  const content = {
    intro: personalizeParagraph(page, page.intro, '학습 진단'),
    body1: personalizeParagraph(page, page.body1, '수업 설계'),
    body2: personalizeParagraph(page, page.body2, '실시간 관리'),
    body3: personalizeParagraph(page, page.body3, '복습 관리'),
    faq1: personalizeParagraph(page, page.faq1, '상담 안내'),
  };
  const faqs = [
    { question: page.q1, answer: personalizeParagraph(page, page.a1, '첫 번째 답변') },
    { question: page.q2, answer: personalizeParagraph(page, page.a2, '두 번째 답변') },
    { question: page.q3, answer: personalizeParagraph(page, page.a3, '세 번째 답변') },
  ];
  const webPageSchema = createWebPageSchema({
    siteName,
    siteUrl,
    pageUrl,
    pageName: pageTitle,
    description: detailCopy.metaDescription,
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
              <span>{goalLabel}</span>
            </div>
            <h1>{detailCopy.heroTitle}</h1>
            <div className="metaDescriptionBox">
              <strong>{detailCopy.overviewLabel}</strong>
              <p>{detailCopy.metaDescription}</p>
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
            <p>{content.intro}</p>
          </section>

          <section className="articleSection">
            <h2>{detailCopy.directionHeading}</h2>
            <p>{content.body1}</p>
          </section>

          <section className="articleSection">
            <h2>{detailCopy.managementHeading}</h2>
            <p>{content.body2}</p>
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
            <p>{content.body3}</p>
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
            <p>{detailCopy.seoParagraph}</p>
          </aside>

          <TutoringDecisionGuide grade={page.grade} subject={page.subject} goal={goalLabel} />

          <section className="articleSection faqSection">
            <p className="sectionLabel">FAQ</p>
            <h2>{detailCopy.faqHeading}</h2>
            <p className="faqIntro">{content.faq1}</p>
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
            현재 학습 상황과 {goalLabel} 목표를 알려주시면 온라인 수업에서 먼저
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
          sourceLabel={`${page.grade} ${page.subject} ${goalLabel} 상세페이지`}
          gradePlaceholder="예: 초4, 중2, 고1"
          phonePlaceholder="예: 010-0000-0000"
        />
      </section>
    </main>
  );
}
