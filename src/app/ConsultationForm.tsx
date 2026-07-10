"use client";

import { useState, type FormEvent } from "react";

const CONSULTATION_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbz_qksThrgOh0ukEi1tQGmqnKk5laZ2-7QaqCA94zoHPxRPI-SqqtaFID1woM9RylxD/exec";

type ConsultationFormProps = {
  showHeader?: boolean;
  gradePlaceholder?: string;
  phonePlaceholder?: string;
};

export default function ConsultationForm({
  showHeader = true,
  gradePlaceholder = "예: 초6, 중2, 고1",
  phonePlaceholder = "예: 010-1234-5678",
}: ConsultationFormProps) {
  const [message, setMessage] = useState("");
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

    try {
      await fetch(CONSULTATION_SCRIPT_URL, {
        method: "POST",
        body: JSON.stringify({
          siteType: "온라인과외 홈페이지",
          name,
          grade,
          subject,
          phone,
          agree: "동의",
        }),
      });

      setMessage("상담 신청이 정상적으로 접수되었습니다.");
      form.reset();
    } catch (error) {
      console.error(error);
      setMessage("상담 신청 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
    }
  }

  return (
    <form className="consultForm" onSubmit={handleSubmit}>
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
        <input name="name" type="text" placeholder="예: 홍길동" />
      </label>

      <label>
        학생 학년
        <input name="grade" type="text" placeholder={gradePlaceholder} />
      </label>

      <label>
        희망 과목
        <input name="subject" type="text" placeholder="예: 수학, 영어, 국어" />
      </label>

      <label>
        상담 가능한 연락처
        <input name="phone" type="text" placeholder={phonePlaceholder} />
      </label>

      <label className="checkLabel">
        <input name="agree" type="checkbox" />
        개인정보 수집 및 이용에 동의합니다.
      </label>

      <button type="submit" className="primaryBtn fullBtn">
        상담 신청하기
      </button>
      {message && <p className="consultMessage">{message}</p>}

      <a href="tel:01082867620" className="consultPhoneBtn">
        전화상담 010-8286-7620
      </a>
    </form>
  );
}
