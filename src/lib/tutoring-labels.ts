type LearningPage = {
  grade: string;
  subject: string;
  goal: string;
};

type JosaPair = '을/를' | '이/가' | '은/는' | '과/와';

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

const josaPairs: Record<JosaPair, [string, string]> = {
  '을/를': ['을', '를'],
  '이/가': ['이', '가'],
  '은/는': ['은', '는'],
  '과/와': ['과', '와'],
};

const particleTargets = [
  '발표·과제 준비',
  '용어·개념 표현',
  '자료와 도표 독해',
  '공식·기호 이해',
  '문제 조건 해석',
  '교과 용어 정리',
  '시대 용어 정리',
  '학습 습관 관리',
  '단원평가 대비',
  '학교 평가 대비',
  '수학 용어',
  '교과 어휘',
  '핵심 용어',
  '자료 해석',
  '역사 어휘',
  '사료 독해',
  '시험 대비',
  '문제 풀이',
  '시험대비',
  '문제풀이',
  '수행평가',
  '학습습관',
  '고입 준비',
  '진학 대비',
  '어휘 학습',
  '문법 학습',
  '개념 학습',
  '독해 학습',
  '학습',
  '문법',
  '어휘',
  '개념',
  '독해',
  '내신',
  '심화',
  '입시',
].sort((first, second) => second.length - first.length);

function hasFinalConsonant(value: string) {
  const lastHangul = [...value].reverse().find((character) => {
    const code = character.charCodeAt(0);
    return code >= 0xac00 && code <= 0xd7a3;
  });

  if (!lastHangul) {
    return false;
  }

  return (lastHangul.charCodeAt(0) - 0xac00) % 28 !== 0;
}

export function withJosa(value: string, pair: JosaPair) {
  const [withBatchim, withoutBatchim] = josaPairs[pair];

  return `${value}${hasFinalConsonant(value) ? withBatchim : withoutBatchim}`;
}

export function normalizeKoreanParticles(text: string) {
  let normalized = text
    .split('을을')
    .join('을')
    .split('를를')
    .join('를')
    .split('맞는수업')
    .join('맞는 수업');

  for (const target of particleTargets) {
    normalized = normalized
      .split(`${target}을`)
      .join(withJosa(target, '을/를'))
      .split(`${target}를`)
      .join(withJosa(target, '을/를'))
      .split(`${target}이`)
      .join(withJosa(target, '이/가'))
      .split(`${target}가`)
      .join(withJosa(target, '이/가'))
      .split(`${target}은`)
      .join(withJosa(target, '은/는'))
      .split(`${target}는`)
      .join(withJosa(target, '은/는'))
      .split(`${target}과`)
      .join(withJosa(target, '과/와'))
      .split(`${target}와`)
      .join(withJosa(target, '과/와'));
  }

  return normalized;
}

const subjectMetaFocus: Record<string, string> = {
  국어: '지문 근거와 서술형 표현',
  영어: '어휘와 문장 구조, 독해 근거',
  수학: '개념 이해와 풀이 과정',
  사회: '교과 개념과 자료 해석',
  과학: '원리 이해와 탐구 자료 해석',
  한국사: '시대 흐름과 사료 해석',
};

export function getContextualMetaDescription(page: LearningPage & { metaDescription: string }) {
  const goalLabel = getContextualGoalLabel(page);
  const subjectFocus = subjectMetaFocus[page.subject] ?? '개념 이해와 풀이 과정';

  return normalizeKoreanParticles(
    `${page.grade} ${page.subject} ${goalLabel} 온라인 1대1 과외는 현재 수준과 학교 진도를 함께 확인하고, ${withJosa(
      subjectFocus,
      '을/를',
    )} 수업 중 바로 점검합니다. 개념 설명, 문제 적용, 오답 복습을 학생 목표에 맞춰 관리합니다.`,
  );
}
