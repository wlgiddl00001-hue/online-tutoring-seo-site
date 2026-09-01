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
import { getContextualGoalLabel } from '@/lib/tutoring-labels';

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
        label: `${page.grade} ${page.subject} ${getContextualGoalLabel(page)} 온라인 과외`,
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

      <ConsultationForm sourceLabel="온라인 과외 메인페이지" />
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
          <h1>
  <span>호빈샘</span>
  <span>초등·중등·고등</span>
  <span>1대1 온라인 과외</span>
</h1>
          <p className="heroDesc">
            초등 기초부터 중등 내신, 고등 심화와 입시 준비까지 학생의 현재
            수준과 목표를 확인하고 1대1 온라인 수업으로 꾸준히 관리합니다.
          </p>
          <div className="heroBenefits">
  <div className="heroBenefit">무료 모의수업 후 결정</div>
  <div className="heroBenefit">학생 수준·성향에 맞는 선생님 배정</div>
  <div className="heroBenefit">숙제·오답·시험대비 관리</div>
  <div className="heroBenefit">1대1 실시간 질문·풀이 확인</div>
</div>
          <div className="heroButtons">
            <a href="#consult" className="primaryBtn">무료 모의수업 상담신청</a>
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
<section className="consultProcessSection">
  <div className="consultProcess">
    <h2 className="consultProcessTitle">온라인 과외, 이렇게 진행됩니다</h2>
    <p className="consultProcessDesc">
      학생의 현재 학습상황을 확인한 뒤 선생님을 배정하고,
      무료 모의수업 후 정규수업 여부를 결정할 수 있습니다.
    </p>

    <ol className="consultProcessSteps">
      {['상담신청', '선생님 배정', '무료 모의수업', '정규수업 및 관리'].map(
        (step, index) => (
          <li className="consultProcessStep" key={step}>
            <span className="consultProcessNumber">{index + 1}</span>
            <strong>{step}</strong>
          </li>
        ),
      )}
    </ol>
  </div>
</section>
<section className="section">
  <div className="sectionHeading">
    <p className="sectionLabel">맞춤 선생님 배정</p>
    <h2>학생에게 맞는 선생님을 찾습니다</h2>
    <p>
      단순히 과목이 같은 선생님을 연결하는 것이 아니라
      학생의 현재 학습상황과 성향을 확인한 뒤 수업 방향을 맞춰 배정합니다.
    </p>
  </div>

  <div className="heroBenefits">
    <div className="heroBenefit">학생 학년과 현재 성적</div>
    <div className="heroBenefit">취약단원과 학습 고민</div>
    <div className="heroBenefit">학생 성향과 수업 스타일</div>
    <div className="heroBenefit">희망 수업시간과 학습 목표</div>
  </div>

  <div className="heroButtons">
    <a href="#consult" className="primaryBtn">
      선생님 배정 상담하기
    </a>
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
<section className="section">
  <div className="sectionHeading">
    <p className="sectionLabel">온라인 과외 FAQ</p>
    <h2>온라인 과외가 처음이라 걱정되시나요?</h2>
    <p>
      처음 시작하는 학부모님들이 많이 궁금해하시는 내용을 정리했습니다.
    </p>
  </div>

  <div className="faqList">
    <div className="faqItem">
      <h3>온라인인데 집중이 가능한가요?</h3>
      <p>
        1대1 실시간 수업으로 진행되기 때문에 학생의 반응과 문제풀이 과정을
        확인하면서 수업을 진행할 수 있습니다.
      </p>
    </div>

    <div className="faqItem">
      <h3>온라인 수업이 처음이어도 가능한가요?</h3>
      <p>
        수업 전 접속 방법을 안내받은 뒤 노트북이나 태블릿 등으로 참여할 수 있습니다.
      </p>
    </div>

    <div className="faqItem">
      <h3>모르는 문제를 바로 질문할 수 있나요?</h3>
      <p>
        녹화된 강의를 보는 방식이 아니라 선생님과 실시간으로 진행되기 때문에
        수업 중 궁금한 내용을 바로 질문할 수 있습니다.
      </p>
    </div>

    <div className="faqItem">
      <h3>학교 시험 대비도 가능한가요?</h3>
      <p>
        학생의 학교 시험범위와 현재 수준을 확인한 뒤 내신과 시험 대비 수업을
        진행할 수 있습니다.
      </p>
    </div>

    <div className="faqItem">
      <h3>선생님과 잘 맞지 않으면 어떻게 하나요?</h3>
      <p>
        수업 진행 중 어려움이 있다면 담당자와 상담 후 선생님 변경 가능 여부를
        안내받을 수 있습니다.
      </p>
    </div>
  </div>
</section>
<section className="section">
  <div className="sectionHeading">
    <p className="sectionLabel">무료 모의수업</p>
    <h2>바로 시작하지 않아도 됩니다</h2>
    <h3>무료 모의수업 후 결정하세요</h3>
    <p>
      온라인 과외가 처음이거나 학생과 선생님의 수업 방식이 잘 맞을지 걱정된다면,
      먼저 무료 모의수업을 진행해 본 뒤 정규수업 여부를 결정할 수 있습니다.
    </p>
  </div>

  <div className="heroButtons">
    <a href="#consult" className="primaryBtn">
      무료 모의수업 상담신청
    </a>
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
                .map((page) => ({
                  slug: page.slug,
                  goal: getContextualGoalLabel(page),
                  mainKeyword: `온라인 ${page.grade} ${page.subject} ${getContextualGoalLabel(page)} 과외`,
                })),
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
