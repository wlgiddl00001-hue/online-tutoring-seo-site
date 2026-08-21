"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";

const CONSULTATION_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbz_qksThrgOh0ukEi1tQGmqnKk5laZ2-7QaqCA94zoHPxRPI-SqqtaFID1woM9RylxD/exec";

type ConsultationFormProps = {
  showHeader?: boolean;
  gradePlaceholder?: string;
  phonePlaceholder?: string;
  sourceLabel?: string;
};

type SubmissionStatus = "success" | "error" | null;

export default function ConsultationForm({
  showHeader = true,
  gradePlaceholder = "예: 초6, 중2, 고1",
  phonePlaceholder = "예: 010-1234-5678",
  sourceLabel = "온라인 과외 메인페이지",
}: ConsultationFormProps) {
  const [submissionStatus, setSubmissionStatus] =
    useState<SubmissionStatus>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const messageRef = useRef<HTMLDivElement>(null);

  const isSuccess = submissionStatus === "success";
  const isError = submissionStatus === "error";

  useEffect(() => {
    if (submissionStatus !== "success") {
      return;
    }

    messageRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }, [submissionStatus]);

  function handleChange() {
    if (submissionStatus) {
      setSubmissionStatus(null);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    const name = String(formData.get("name") ?? "").trim();
    const grade = String(formData.get("grade") ?? "").trim();
    const subject = String(formData.get("subject") ?? "").trim();
    const phone = String(formData.get("phone") ?? "").trim();
    const agree = formData.get("agree") === "on";

    if (!name || !grade || !subject || !phone) {
      alert("이름, 학생 학년, 희망 과목, 연락처를 모두 입력해주세요.");
      return;
    }

    if (!agree) {
      alert("개인정보 수집 및 이용에 동의해주세요.");
      return;
    }

    setIsSubmitting(true);

    try {
      await fetch(CONSULTATION_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        body: JSON.stringify({
          siteType: "온라인과외 홈페이지",
          sourceLabel,
          pageTitle: document.title,
          pageUrl: window.location.href,
          name,
          grade,
          subject,
          phone,
          agree: "동의",
        }),
      });

      setSubmissionStatus("success");
      form.reset();
    } catch (error) {
      console.error(error);
      setSubmissionStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="consultForm" onSubmit={handleSubmit} onChange={handleChange}>
      {showHeader && (
        <div className="consultFormHead">
          <strong>온라인 과외 상담 신청</strong>
          <p>
            학생의 학년, 희망 과목, 현재 고민을 남겨주시면
            수업 방향을 확인한 뒤 상담을 도와드립니다.
          </p>
        </div>
      )}

      <label>
        이름
        <input name="name" type="text" placeholder="예: 홍길동" autoComplete="name" required />
      </label>

      <label>
        학생 학년
        <input name="grade" type="text" placeholder={gradePlaceholder} required />
      </label>

      <label>
        희망 과목
        <input name="subject" type="text" placeholder="예: 수학, 영어, 국어" required />
      </label>

      <label>
        상담 가능한 연락처
        <input
          name="phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder={phonePlaceholder}
          required
        />
      </label>

      <label className="checkLabel">
        <input name="agree" type="checkbox" required />
        <span>
          <Link href="/privacy">개인정보 수집 및 이용 안내</Link>를 확인했으며 이에 동의합니다.
        </span>
      </label>

      <p className="consultNotice">
        상담은 무료이며, 수업료와 가능한 일정은 무료 모의수업 전에 안내합니다.
      </p>

      <button type="submit" className="primaryBtn fullBtn" disabled={isSubmitting} aria-busy={isSubmitting}>
        {isSubmitting
          ? "접수 중..."
          : submissionStatus === "success"
            ? "접수 완료"
            : "무료 상담 신청하기"}
      </button>
      {(isSuccess || isError) && (
        <div
          ref={messageRef}
          className={`consultMessage consultMessage--${submissionStatus}`}
          role={submissionStatus === "error" ? "alert" : "status"}
          aria-live="polite"
        >
          {isSuccess ? (
            <>
              상담 신청이 정상적으로 접수되었습니다.
              <br />
              확인 후 빠르게 연락드리겠습니다.
            </>
          ) : (
            <>
              접수 중 오류가 발생했습니다.
              <br />
              잠시 후 다시 시도해주세요.
            </>
          )}
        </div>
      )}

      <a href="tel:01082867620" className="consultPhoneBtn">
        전화상담 010-8286-7620
      </a>
    </form>
  );
}
