import Link from 'next/link';

export default function SiteHeader() {
  return (
    <header className="siteHeader">
      <div className="siteHeaderInner">
        <Link href="/" className="siteBrand" aria-label="호빈샘 온라인 과외 홈">
          <span className="siteBrandMark">H</span>
          <span>
            <strong>호빈샘 온라인 과외</strong>
            <small>실시간 1대1 맞춤수업</small>
          </span>
        </Link>
        <nav className="siteNav" aria-label="주요 메뉴">
          <Link href="/#elementary-section">초등</Link>
          <Link href="/#middle-section">중등</Link>
          <Link href="/#high-section">고등</Link>
          <a href="tel:01082867620">전화 상담</a>
          <Link href="/#consult" className="siteHeaderConsult">무료 상담</Link>
        </nav>
      </div>
    </header>
  );
}
