type TutoringDecisionGuideProps = {
  grade: string;
  subject: string;
  goal: string;
};

export default function TutoringDecisionGuide({
  grade,
  subject,
  goal,
}: TutoringDecisionGuideProps) {
  const lessonName = `${grade} ${subject} ${goal}`;

  return (
    <aside className="decisionGuide">
      <p className="sectionLabel">상담 전 확인하기</p>
      <h2>{lessonName} 온라인 과외, 이렇게 결정합니다</h2>
      <p className="decisionGuideIntro">
        상담을 신청했다고 {lessonName} 수업이 바로 결정되는 것은 아닙니다. 학생의 현재
        상태와 온라인 학습 환경을 확인한 뒤 {lessonName} 지도 가능 선생님의 프로필과
        조건을 안내받고 선택할 수 있습니다.
      </p>
      <div className="decisionGuideGrid">
        <article>
          <span>01</span>
          <strong>현재 학습 상태 확인</strong>
          <p>{subject}에서 막히는 단원과 {goal} 준비 상황, 최근 오답을 먼저 살펴봅니다.</p>
        </article>
        <article>
          <span>02</span>
          <strong>선생님 프로필과 일정</strong>
          <p>{grade} 과정 지도 가능 범위와 수업 경력, 가능한 시간을 안내합니다.</p>
        </article>
        <article>
          <span>03</span>
          <strong>실시간 수업 환경 점검</strong>
          <p>화면·음성·필기 공유와 학생의 집중도를 무료 모의수업에서 확인합니다.</p>
        </article>
        <article>
          <span>04</span>
          <strong>수업료 안내 후 결정</strong>
          <p>회당 시간과 월 수업 횟수에 따른 비용을 먼저 확인한 뒤 정규수업을 결정합니다.</p>
        </article>
      </div>
      <div className="decisionGuideActions">
        <a href="#consult" className="primaryBtn">무료 상담 신청</a>
        <a href="tel:01082867620" className="secondaryBtn">전화로 먼저 문의</a>
      </div>
    </aside>
  );
}
