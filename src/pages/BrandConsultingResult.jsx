// src/pages/BrandConsultingResult.jsx
import React, { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import SiteHeader from "../components/SiteHeader.jsx";
import SiteFooter from "../components/SiteFooter.jsx";
import PolicyModal from "../components/PolicyModal.jsx";
import { PrivacyContent, TermsContent } from "../components/PolicyContents.jsx";

/** ✅ 결과용 저장 키(Analyze 버튼 누를 때 저장되는 key) */
const RESULT_KEY_MAP = {
  logo: "brandInterview_logo_v1",
  naming: "brandInterview_naming_v1",
  homepage: "brandInterview_homepage_v1",
};

/** ✅ 인터뷰 임시저장(draft) 키(자동 저장되는 key) - Reset 시 같이 지우면 “진짜 초기화” 됨 */
const DRAFT_KEY_MAP = {
  logo: "logoConsultingInterviewDraft_v1",
  naming: "namingConsultingInterviewDraft_v1",
  homepage: "homepageConsultingInterviewDraft_v1",
};

const LABEL_MAP = {
  logo: "로고 컨설팅",
  naming: "네이밍 컨설팅",
  homepage: "홈페이지 컨설팅",
};

const INTERVIEW_ROUTE = {
  logo: "/logoconsulting",
  naming: "/nameconsulting",
  homepage: "/homepageconsulting",
};

export default function BrandConsultingResult({ onLogout }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // ✅ 약관/방침 모달
  const [openType, setOpenType] = useState(null);
  const closeModal = () => setOpenType(null);

  const service = useMemo(() => {
    const s = searchParams.get("service");
    if (s === "logo" || s === "naming" || s === "homepage") return s;
    return "logo";
  }, [searchParams]);

  const storageKey = RESULT_KEY_MAP[service];
  const draftKey = DRAFT_KEY_MAP[service];
  const title = LABEL_MAP[service];

  /** ✅ 결과 페이지는 brandInterview_*_v1 을 읽는다 */
  const saved = useMemo(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }, [storageKey]);

  const form = saved?.form || {};

  const lastSaved = useMemo(() => {
    const t = saved?.updatedAt;
    if (!t) return "-";
    const d = new Date(t);
    return Number.isNaN(d.getTime()) ? "-" : d.toLocaleString();
  }, [saved]);

  /** ✅ service별로 “실제 인터뷰 폼 키”에 맞게 요약 아이템 구성 */
  const summaryItems = useMemo(() => {
    if (service === "logo") {
      return [
        { label: "회사/프로젝트명", value: form.companyName },
        { label: "산업/분야", value: form.industry },
        { label: "성장 단계", value: form.stage },
        { label: "한 줄 소개", value: form.oneLine },
        { label: "타깃 고객", value: form.targetCustomer },
        { label: "브랜드 성격", value: form.brandPersonality },
        { label: "핵심 키워드", value: form.keywords },
        { label: "로고 목표", value: form.goal },
        { label: "추가 메모", value: form.notes },
      ];
    }

    if (service === "naming") {
      return [
        { label: "회사/프로젝트명", value: form.companyName },
        { label: "산업/분야", value: form.industry },
        { label: "성장 단계", value: form.stage },
        { label: "한 줄 소개", value: form.oneLine },
        { label: "타깃 고객", value: form.targetCustomer },
        { label: "원하는 톤", value: form.tone },
        { label: "핵심 키워드", value: form.keywords },
        { label: "네이밍 목표", value: form.goal },
        { label: "추가 메모", value: form.notes },
      ];
    }

    // homepage
    return [
      { label: "회사/프로젝트명", value: form.companyName },
      { label: "산업/분야", value: form.industry },
      { label: "성장 단계", value: form.stage },
      { label: "한 줄 소개", value: form.oneLine },
      { label: "사이트 목표", value: form.siteGoal },
      { label: "핵심 CTA", value: form.primaryAction },
      { label: "타깃 고객", value: form.targetCustomer },
      { label: "필요한 섹션", value: form.mainSections },
      { label: "추가 메모", value: form.notes },
    ];
  }, [service, form]);

  const handleGoInterview = () => navigate(INTERVIEW_ROUTE[service]);
  const handleGoBrandHome = () => navigate("/brandconsulting");

  /** ✅ 초기화: 결과키 + draft키 둘 다 삭제해야 “완전 초기화” */
  const handleReset = () => {
    localStorage.removeItem(storageKey);
    localStorage.removeItem(draftKey);
    alert("해당 브랜드 인터뷰 데이터를 초기화했습니다.");
    navigate(INTERVIEW_ROUTE[service]);
  };

  return (
    <div className="brandResult">
      <PolicyModal
        open={openType === "privacy"}
        title="개인정보 처리방침"
        onClose={closeModal}
      >
        <PrivacyContent />
      </PolicyModal>

      <PolicyModal
        open={openType === "terms"}
        title="이용약관"
        onClose={closeModal}
      >
        <TermsContent />
      </PolicyModal>

      <SiteHeader onLogout={onLogout} />

      <main className="brandResult__main">
        <div className="brandResult__container">
          <div className="brandResult__titleRow">
            <div>
              <h1 className="brandResult__title">{title} 결과 리포트</h1>
              <p className="brandResult__sub">
                입력한 답변 기반 요약(현재는 UI/연결용 더미 리포트)
              </p>
            </div>

            <div className="brandResult__topActions">
              <button
                type="button"
                className="btn ghost"
                onClick={handleGoBrandHome}
              >
                브랜드 컨설팅 홈
              </button>
              <button type="button" className="btn" onClick={handleGoInterview}>
                인터뷰로 돌아가기
              </button>
            </div>
          </div>

          {/* ✅ 저장된 데이터가 없을 때 안내 */}
          {!saved ? (
            <div className="card">
              <div className="card__head">
                <h2>저장된 결과가 없습니다</h2>
                <p>
                  인터뷰에서 <b>AI 분석 요청</b> 버튼을 누르면 결과가
                  생성됩니다.
                </p>
              </div>

              <div style={{ display: "flex", gap: 10 }}>
                <button
                  type="button"
                  className="btn primary"
                  onClick={handleGoInterview}
                >
                  인터뷰 작성하러 가기
                </button>
                <button
                  type="button"
                  className="btn ghost"
                  onClick={handleGoBrandHome}
                >
                  브랜드 컨설팅 홈
                </button>
              </div>
            </div>
          ) : (
            <div className="promoResult__grid">
              {/* left */}
              <section className="promoResult__left">
                <div className="card">
                  <div className="card__head">
                    <h2>입력 요약</h2>
                    <p>작성한 답변을 그대로 보여줍니다.</p>
                  </div>

                  <div className="qa">
                    {summaryItems.map((it) => (
                      <div className="qa__item" key={it.label}>
                        <div className="q">{it.label}</div>
                        <div className="a">
                          {it.value?.trim?.() ? it.value : "—"}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div
                    style={{ marginTop: 12, fontSize: 12, color: "#6b7280" }}
                  >
                    마지막 저장: {lastSaved}
                  </div>
                </div>

                <div className="card">
                  <div className="card__head">
                    <h2>다음 추천 액션(더미)</h2>
                    <p>이후 실제 AI 결과/가이드로 교체하면 됩니다.</p>
                  </div>

                  <ul className="recoList">
                    <li>
                      핵심 메시지(한 문장)와 CTA를 먼저 고정하고, 전체
                      레이아웃을 잡아보세요.
                    </li>
                    <li>
                      타깃/톤을 기준으로 컬러/폰트/이미지 분위기를 통일하면
                      완성도가 확 올라갑니다.
                    </li>
                    <li>
                      피해야 할 요소(금지사항)를 리스트로 만들면 시안 품질이
                      빠르게 좋아져요.
                    </li>
                  </ul>

                  <div className="note">
                    * 추후 “시안 생성/템플릿 추천/카피라이팅” 등으로 확장하기
                    좋습니다.
                  </div>
                </div>
              </section>

              {/* right sticky */}
              <aside className="promoResult__right">
                <div className="sideCard">
                  <div className="sideCard__titleRow">
                    <h3>상태</h3>
                    <span className="badge">{service}</span>
                  </div>

                  <div className="sideMeta">
                    <div className="sideMeta__row">
                      <span className="k">마지막 저장</span>
                      <span className="v">{lastSaved}</span>
                    </div>
                  </div>

                  <div className="divider" />

                  <button
                    type="button"
                    className="btn primary w100"
                    onClick={handleGoInterview}
                  >
                    입력 수정하기
                  </button>

                  <button
                    type="button"
                    className="btn ghost w100"
                    style={{ marginTop: 10 }}
                    onClick={handleReset}
                  >
                    처음부터 다시하기(초기화)
                  </button>

                  <p className="hint">
                    * 인터뷰에서 “AI 분석 요청”을 누르면 이 결과 리포트가
                    갱신됩니다.
                  </p>
                </div>
              </aside>
            </div>
          )}
        </div>
      </main>

      <SiteFooter onOpenPolicy={setOpenType} />
    </div>
  );
}
