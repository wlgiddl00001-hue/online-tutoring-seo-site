'use client';

import Link from 'next/link';
import { useId, useState } from 'react';

type SubjectPage = {
  slug: string;
  goal: string;
  mainKeyword: string;
};

export type SubjectTabItem = {
  subject: string;
  pages: SubjectPage[];
};

type SubjectTabsProps = {
  grade: string;
  items: SubjectTabItem[];
};

export default function SubjectTabs({ grade, items }: SubjectTabsProps) {
  const instanceId = useId();
  const [activeSubject, setActiveSubject] = useState(items[0]?.subject ?? '');
  const activeItem = items.find((item) => item.subject === activeSubject) ?? items[0];
  const activeIndex = Math.max(0, items.indexOf(activeItem));
  const panelId = `${instanceId}-panel`;

  if (!activeItem) {
    return null;
  }

  return (
    <div className="subjectTabs">
      <div className="subjectTabList" role="tablist" aria-label={`${grade} 과목 선택`}>
        {items.map((item, index) => {
          const isActive = item.subject === activeItem.subject;

          return (
            <button
              type="button"
              className={`subjectTab${isActive ? ' subjectTabActive' : ''}`}
              id={`${instanceId}-tab-${index}`}
              role="tab"
              aria-selected={isActive}
              aria-controls={panelId}
              onClick={() => setActiveSubject(item.subject)}
              key={item.subject}
            >
              {item.subject}
            </button>
          );
        })}
      </div>

      <div
        className="subjectTabPanel"
        id={panelId}
        role="tabpanel"
        aria-labelledby={`${instanceId}-tab-${activeIndex}`}
      >
        <h3>{grade} {activeItem.subject} 과외</h3>
        <div className="subjectTabLinks">
          {activeItem.pages.map((page) => (
            <Link href={`/${page.slug}`} key={page.slug}>
              <span>{page.goal}</span>
              <strong>{page.mainKeyword}</strong>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
