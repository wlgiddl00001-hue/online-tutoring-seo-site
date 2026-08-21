import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '개인정보처리방침 | 호빈샘 온라인 과외',
  description: '호빈샘 온라인 과외 상담 신청 과정에서 수집하는 개인정보와 이용 목적을 안내합니다.',
  alternates: {
    canonical: 'https://online-tutoring-seo-site.vercel.app/privacy',
  },
};

export default function PrivacyPage() {
  return (
    <main className="privacyPage">
      <p className="sectionLabel">개인정보 안내</p>
      <h1>개인정보처리방침</h1>
      <p className="privacyLead">
        호빈샘 온라인 과외는 상담 신청과 선생님 배정 안내를 위해 필요한 최소한의
        개인정보만 수집합니다.
      </p>
      <section>
        <h2>수집하는 개인정보</h2>
        <p>이름, 학생 학년, 희망 과목, 상담 가능한 연락처</p>
      </section>
      <section>
        <h2>수집 및 이용 목적</h2>
        <p>과외 상담, 학생에게 맞는 수업 방향 안내, 선생님 배정과 일정 조율에 이용합니다.</p>
      </section>
      <section>
        <h2>보유 및 이용 기간</h2>
        <p>상담 목적 달성 후 지체 없이 파기하며, 관련 법령에서 정한 경우 해당 기간 동안 보관합니다.</p>
      </section>
      <section>
        <h2>동의를 거부할 권리</h2>
        <p>개인정보 수집에 동의하지 않을 수 있으나, 이 경우 온라인 상담 신청이 제한될 수 있습니다.</p>
      </section>
      <Link href="/" className="secondaryBtn privacyHomeLink">홈으로 돌아가기</Link>
    </main>
  );
}
