import { getStableImage, mainImages } from '@/data/imageMap';
import pages from '@/data/pages.json';
import type { Metadata } from 'next';
import Image from 'next/image';
import QuickConsultActions from './QuickConsultActions';
import SubjectTabs from './SubjectTabs';

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

export const metadata: Metadata = {
  title: '호빈샘 온라인 과외 | 초등·중등·고등 1대1 수업',
  description:
    '초등 기초부터 중등 내신, 고등 심화와 입시 준비까지 학생 수준과 목표에 맞춰 진행하는 1대1 온라인 과외입니다.',
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

      <form className="consultForm">
        <label>
          이름
          <input type="text" placeholder="예: 홍길동" />
        </label>
        <label>
          학생 학년
          <input type="text" placeholder="예: 초4, 중2, 고1" />
        </label>
        <label>
          희망 과목
          <input type="text" placeholder="예: 수학, 영어, 국어" />
        </label>
        <label>
          상담 가능한 연락처
          <input type="text" placeholder="예: 010-0000-0000" />
        </label>
        <label className="checkLabel">
          <input type="checkbox" />
          개인정보 수집 및 이용에 동의합니다.
        </label>
        <button type="submit" className="primaryBtn fullBtn">
          상담 신청하기
        </button>
        <a href="tel:01082867620" className="consultPhoneBtn">
          전화상담 010-8286-7620
        </a>
      </form>
    </section>
  );
}

export default function Home() {
  const heroImage = getStableImage(mainImages, 'main-online-tutoring');

  return (
    <main className="site">
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

      <ConsultationSection />
    </main>
  );
}
