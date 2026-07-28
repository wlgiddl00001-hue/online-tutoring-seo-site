import { getStableImage, mainImages } from '@/data/imageMap';
import pages from '@/data/pages.json';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import JsonLd from './JsonLd';
import QuickConsultActions from './QuickConsultActions';
import ConsultationForm from './ConsultationForm';
import SubjectTabs from './SubjectTabs';
import { createOrganizationSchema, createWebsiteSchema } from '@/lib/structured-data';

type PageItem = {
  slug: string;
  title: string;
  metaDescription: string;
  grade: string;
  subject: string;
  goal: string;
  mainKeyword: string;
};

type GradeSection = {
  grade: string;
  id: string;
  title: string;
  description: string;
};

const allPages = pages as PageItem[];
const siteUrl = 'https://online-tutoring-seo-site.vercel.app';
const siteName = '온라인 과외 전문';
const mainTitle = '호빈샘 온라인 과외 | 초등·중등·고등 1대1 수업';
const mainDescription =
  '초등 기초부터 중등 내신, 고등 심화와 입시 준비까지 학생 수준과 목표에 맞춰 진행하는 1대1 온라인 과외입니다.';
const ogImage = `${siteUrl}/images/online/main-01.png`;
const subjects = ['국어', '영어', '수학', '사회', '과학', '한국사'];
const gradeSections: GradeSection[] = [
  {
    grade: '초등',
    id: 'elementary-section',
    title: '초등 온라인 과외',
    description: '기초 개념과 공부 습관을 잡고, 스스로 설명하고 푸는 힘을 기릅니다.',
  },
  {
    grade: '중등',
    id: 'middle-section',
    title: '중등 온라인 과외',
    description: '내신과 수행평가를 함께 준비하며 과목별 약점을 정리합니다.',
  },
  {
    grade: '고등',
    id: 'high-section',
    title: '고등 온라인 과외',
    description: '심화 개념과 시험 대비, 입시 준비까지 목표에 맞춰 관리합니다.',
  },
];

const goalLabels: Record<string, string> = {
  시험대비: '시험 대비',
  문제풀이: '문제 풀이',
  학습습관: '학습 습관 관리',
};

const featuredLinkTargets = [
  { grade: '초등', subject: '국어', goal: '어휘', group: '초등 과목' },
  { grade: '초등', subject: '수학', goal: '기초', group: '초등 기초' },
  { grade: '초등', subject: '영어', goal: '수행평가', group: '초등 수행평가' },
  { grade: '초등', subject: '사회', goal: '독해', group: '초등 과목' },
  { grade: '초등', subject: '과학', goal: '개념', group: '초등 과목' },
  { grade: '초등', subject: '한국사', goal: '어휘', group: '초등 과목' },
  { grade: '중등', subject: '국어', goal: '기초', group: '중등 기초' },
  { grade: '중등', subject: '영어', goal: '문법', group: '중등 문법' },
  { grade: '중등', subject: '수학', goal: '시험대비', group: '중등 시험 대비' },
  { grade: '중등', subject: '사회', goal: '심화', group: '중등 심화' },
  { grade: '중등', subject: '과학', goal: '기초', group: '중등 과목' },
  { grade: '중등', subject: '한국사', goal: '수행평가', group: '중등 과목' },
  { grade: '고등', subject: '국어', goal: '입시', group: '고등 입시' },
  { grade: '고등', subject: '영어', goal: '입시', group: '고등 입시' },
  { grade: '고등', subject: '수학', goal: '심화', group: '고등 심화' },
  { grade: '고등', subject: '과학', goal: '내신', group: '고등 내신' },
  { grade: '고등', subject: '한국사', goal: '내신', group: '고등 내신' },
  { grade: '고등', subject: '사회', goal: '입시', group: '고등 입시' },
];

function getGoalLabel(goal: string) {
  return goalLabels[goal] ?? goal;
}

function getFeaturedLinks() {
  return featuredLinkTargets
    .map((target) => {
      const page = allPages.find(
        (item) =>
          item.grade === target.grade &&
          item.subject === target.subject &&
          item.goal === target.goal,
      );

      if (!page) {
        return null;
      }

      return {
        ...target,
        slug: page.slug,
        label: `${page.grade} ${page.subject} ${getGoalLabel(page.goal)} 온라인 과외`,
      };
    })
    .filter((item): item is NonNullable<typeof item> => Boolean(item));
}

export const metadata: Metadata = {
  title: mainTitle,
  description: mainDescription,
  alternates: {
    canonical: siteUrl,
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    siteName,
    url: siteUrl,
    title: mainTitle,
    description: mainDescription,
    images: [
      {
        url: ogImage,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: mainTitle,
    description: mainDescription,
    images: [ogImage],
  },
};

function ConsultationSection() {
  return (
    <section id="consult" className="consultSection">
      <div className="consultCopy">
        <p className="sectionLabel">온라인 상담</p>
        <h2>학생에게 맞는 수업 방향부터 확인하세요</h2>
        <p>
          학년과 희망 과목, 현재 고민을 알려주시면 온라인 수업에서 어떤 부분부터
          관리하면 좋을지 안내해드립니다.
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

      <ConsultationForm />
    </section>
  );
}

export default function Home() {
  const heroImage = getStableImage(mainImages, 'main-online-tutoring');
  const featuredLinks = getFeaturedLinks();
  const websiteSchema = createWebsiteSchema({
    siteName,
    siteUrl,
    description: mainDescription,
  });
  const organizationSchema = createOrganizationSchema({
    siteName,
    siteUrl,
    telephone: '010-8286-7620',
  });

  return (
    <main className="site">
      <JsonLd id="website-json-ld" data={websiteSchema} />
      <JsonLd id="organization-json-ld" data={organizationSchema} />
      <QuickConsultActions />

      <section className="hero">
        <div className="heroText">
          <p className="eyebrow heroEyebrow">장소보다 학습 과정에 집중하는 온라인 과외</p>
          <h1>호빈샘 온라인 과외</h1>
          <p className="heroDesc">
            초등 기초부터 중등 내신, 고등 심화와 입시 준비까지 학생의 현재
            수준과 목표를 확인하고 1대1 온라인 수업으로 꾸준히 관리합니다.
          </p>
          <div className="heroBenefits">
            <div className="heroBenefit">실시간 화면 공유 수업</div>
            <div className="heroBenefit">수업 후 복습 자료로 다시 확인</div>
            <div className="heroBenefit">집에서도 집중되는 1대1 관리</div>
            <div className="heroBenefit">개념 설명부터 오답 관리까지</div>
          </div>
          <div className="heroButtons">
            <a href="#consult" className="primaryBtn">상담 신청하기</a>
            <a href="tel:01082867620" className="secondaryBtn">전화 상담하기 010-8286-7620</a>
          </div>
        </div>

        <div className="heroCard">
          <div className="heroImageWrap">
            <Image
              src={heroImage}
              alt="호빈샘 1대1 온라인 과외 수업"
              fill
              className="heroImage"
              sizes="(max-width: 900px) 100vw, 46vw"
              priority
            />
          </div>
        </div>
      </section>

      <section className="section gradePickerSection">
        <div className="sectionHeading">
          <p className="sectionLabel">학년별 수업 찾기</p>
          <h2>지금 필요한 학년 과목으로 바로 이동하세요</h2>
          <p>온라인 수업은 학년에 따라 진도보다 먼저 확인할 지점이 달라집니다.</p>
        </div>
        <div className="gradePickerGrid">
          {gradeSections.map((section, index) => (
            <a className={`gradePicker gradePicker${index + 1}`} href={`#${section.id}`} key={section.id}>
              <span>0{index + 1}</span>
              <h3>{section.title}</h3>
              <p>{section.description}</p>
              <strong>과목 살펴보기 →</strong>
            </a>
          ))}
        </div>
      </section>

      {gradeSections.map((section, gradeIndex) => (
        <section
          id={section.id}
          className={`section gradeSubjectSection gradeSubjectSection${gradeIndex + 1}`}
          key={section.id}
        >
          <div className="sectionHeading gradeSectionHeading">
            <div>
              <p className="sectionLabel">{section.grade} 맞춤 관리</p>
              <h2>{section.title} 과목별 안내</h2>
            </div>
            <p>{section.description}</p>
          </div>

          <SubjectTabs
            grade={section.grade}
            items={subjects.map((subject) => ({
              subject,
              pages: allPages
                .filter((page) => page.grade === section.grade && page.subject === subject)
                .slice(0, 5)
                .map(({ slug, goal, mainKeyword }) => ({ slug, goal, mainKeyword })),
            }))}
          />
        </section>
      ))}

      <section className="section featuredLinkSection">
        <div className="sectionHeading">
          <p className="sectionLabel">대표 수업 바로가기</p>
          <h2>학년·과목·목표별 온라인 과외를 바로 살펴보세요</h2>
          <p>
            자주 찾는 조합을 학년, 과목, 학습목표가 골고루 보이도록 정리했습니다.
          </p>
        </div>
        <div className="featuredLinkGrid">
          {featuredLinks.map((item) => (
            <Link href={`/${item.slug}`} className="featuredLinkCard" key={item.slug}>
              <small>{item.group}</small>
              <strong>{item.label}</strong>
            </Link>
          ))}
        </div>
      </section>

      <ConsultationSection />
    </main>
  );
}
