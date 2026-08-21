import Link from 'next/link';

export default function SiteFooter() {
  return (
    <footer className="siteFooter">
      <div className="siteFooterInner">
        <div>
          <strong>호빈샘 온라인 과외</strong>
          <p>초등·중등·고등 실시간 1대1 맞춤수업</p>
        </div>
        <div className="siteFooterLinks">
          <a href="tel:01082867620">전화상담 010-8286-7620</a>
          <Link href="/privacy">개인정보처리방침</Link>
        </div>
      </div>
    </footer>
  );
}
