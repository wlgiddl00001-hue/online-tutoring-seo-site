type LearningPage = {
  grade: string;
  subject: string;
  goal: string;
};

const subjectGoalLabels: Record<string, Record<string, string>> = {
  수학: {
    문법: '공식·기호 이해',
    어휘: '수학 용어',
    독해: '문제 조건 해석',
  },
  사회: {
    문법: '교과 용어 정리',
    어휘: '교과 어휘',
    독해: '자료와 도표 독해',
  },
  과학: {
    문법: '용어·개념 표현',
    어휘: '핵심 용어',
    독해: '자료 해석',
  },
  한국사: {
    문법: '시대 용어 정리',
    어휘: '역사 어휘',
    독해: '사료 독해',
  },
};

const gradeGoalLabels: Record<string, Record<string, string>> = {
  초등: {
    시험대비: '단원평가 대비',
    내신: '학교 평가 대비',
    수행평가: '발표·과제 준비',
    입시: '진학 대비',
  },
  중등: {
    입시: '고입 준비',
  },
};

const defaultGoalLabels: Record<string, string> = {
  시험대비: '시험 대비',
  문제풀이: '문제 풀이',
  학습습관: '학습 습관 관리',
};

export function getContextualGoalLabel(page: LearningPage) {
  return (
    gradeGoalLabels[page.grade]?.[page.goal] ??
    subjectGoalLabels[page.subject]?.[page.goal] ??
    defaultGoalLabels[page.goal] ??
    page.goal
  );
}

export function getContextualMetaDescription(page: LearningPage & { metaDescription: string }) {
  const goalLabel = getContextualGoalLabel(page);

  if (goalLabel === page.goal) {
    return page.metaDescription;
  }

  return page.metaDescription.split(page.goal).join(goalLabel);
}
