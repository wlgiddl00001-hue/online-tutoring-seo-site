import fs from 'node:fs';

const pagePath = new URL('../src/data/pages.json', import.meta.url);
const pages = JSON.parse(fs.readFileSync(pagePath, 'utf8'));

const subjectGoalLabels = {
  수학: { 문법: '공식·기호 이해', 어휘: '수학 용어', 독해: '문제 조건 해석' },
  사회: { 문법: '교과 용어 정리', 어휘: '교과 어휘', 독해: '자료와 도표 독해' },
  과학: { 문법: '용어·개념 표현', 어휘: '핵심 용어', 독해: '자료 해석' },
  한국사: { 문법: '시대 용어 정리', 어휘: '역사 어휘', 독해: '사료 독해' },
};

const gradeGoalLabels = {
  초등: {
    시험대비: '단원평가 대비',
    내신: '학교 평가 대비',
    수행평가: '발표·과제 준비',
    입시: '진학 대비',
  },
  중등: { 입시: '고입 준비' },
};

const textFields = ['title', 'metaDescription', 'mainKeyword', 'heroTitle'];

for (const page of pages) {
  const replacement =
    gradeGoalLabels[page.grade]?.[page.goal] ??
    subjectGoalLabels[page.subject]?.[page.goal];

  if (!replacement || replacement === page.goal) {
    continue;
  }

  for (const field of textFields) {
    page[field] = page[field].split(page.goal).join(replacement);
  }
}

fs.writeFileSync(pagePath, `${JSON.stringify(pages, null, 2)}\n`, 'utf8');
console.log(`normalized ${pages.length} page labels`);
