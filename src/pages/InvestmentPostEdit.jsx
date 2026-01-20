// src/pages/InvestmentPostEdit.jsx
// 2026-01-20
// 게시글 수정 페이지 구현
import React, { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import SiteHeader from "../components/SiteHeader.jsx";
import SiteFooter from "../components/SiteFooter.jsx";
import PolicyModal from "../components/PolicyModal.jsx";
import { PrivacyContent, TermsContent } from "../components/PolicyContents.jsx";

const LOCATION_OPTIONS = ["서울", "경기", "인천", "대전", "대구", "부산", "광주"];
const COMPANY_SIZE_OPTIONS = [
  "예비 창업 / 개인",
  "스타트업",
  "중소기업",
  "중견기업",
  "대기업",
];
const POSTS_STORAGE_KEY = "investmentPosts";

export default function InvestmentPostEdit({ onLogout }) {
  const navigate = useNavigate();
  const { id } = useParams();

  const [openType, setOpenType] = useState(null);
  const closeModal = () => setOpenType(null);

  const [form, setForm] = useState({
    company: "",
    oneLiner: "",
    location: "서울",
    companySize: "스타트업",
    logoImageUrl: "",
    hashtags: ["", "", "", "", ""],
    website: "",
    contactName: "",
    contactEmail: "",
    summary: "",
  });
  const [errors, setErrors] = useState({
    logoImageUrl: "",
    website: "",
  });
  const [loaded, setLoaded] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const updateField = (key) => (event) => {
    setForm((prev) => ({ ...prev, [key]: event.target.value }));
  };

  const validateUrl = (value) => {
    if (!value) return "";
    return value.startsWith("http://") || value.startsWith("https://")
      ? ""
      : "http:// 또는 https://로 시작해야 합니다.";
  };

  const handleUrlBlur = (key) => (event) => {
    setErrors((prev) => ({ ...prev, [key]: validateUrl(event.target.value) }));
  };

  const tagList = useMemo(() => {
    return form.hashtags.map((tag) => tag.trim()).filter(Boolean);
  }, [form.hashtags]);

  const previewLogo = (form.company || "회사").slice(0, 2).toUpperCase();
  const logoSrc = form.logoImageUrl;

  const loadPost = () => {
    if (loaded) return;
    setLoaded(true);
    try {
      const saved = localStorage.getItem(POSTS_STORAGE_KEY);
      const list = saved ? JSON.parse(saved) : [];
      const item = Array.isArray(list) ? list.find((p) => p.id === id) : null;
      if (!item) {
        setNotFound(true);
        return;
      }
      setForm((prev) => ({
        ...prev,
        company: item.company || "",
        oneLiner: item.oneLiner || "",
        location: item.location || "서울",
        companySize: item.companySize || "스타트업",
        logoImageUrl: item.logoImageUrl || "",
        hashtags: Array.isArray(item.hashtags)
          ? [...item.hashtags, "", "", "", "", ""].slice(0, 5)
          : prev.hashtags,
        website: item.website || "",
        contactName: item.contactName || "",
        contactEmail: item.contactEmail || "",
        summary: item.summary || "",
      }));
    } catch (error) {
      console.error(error);
      setNotFound(true);
    }
  };

  if (!loaded) loadPost();

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextErrors = {
      logoImageUrl: validateUrl(form.logoImageUrl),
      website: validateUrl(form.website),
    };
    setErrors(nextErrors);
    if (nextErrors.logoImageUrl || nextErrors.website) return;

    try {
      const saved = localStorage.getItem(POSTS_STORAGE_KEY);
      const list = saved ? JSON.parse(saved) : [];
      if (!Array.isArray(list)) return;
      const nextList = list.map((item) =>
        item.id === id
          ? {
              ...item,
              company: form.company,
              oneLiner: form.oneLiner,
              logoImageUrl: form.logoImageUrl,
              hashtags: form.hashtags,
              location: form.location,
              companySize: form.companySize,
              website: form.website,
              contactName: form.contactName,
              contactEmail: form.contactEmail,
              summary: form.summary,
              updatedAt: new Date().toISOString().slice(0, 10),
            }
          : item
      );
      localStorage.setItem(POSTS_STORAGE_KEY, JSON.stringify(nextList));
    } catch (error) {
      console.error(error);
    }

    navigate("/investment");
  };

  const handleDelete = () => {
    const ok = window.confirm("정말 삭제하시겠습니까?");
    if (!ok) return;
    try {
      const saved = localStorage.getItem(POSTS_STORAGE_KEY);
      const list = saved ? JSON.parse(saved) : [];
      if (!Array.isArray(list)) return;
      const nextList = list.filter((item) => item.id !== id);
      localStorage.setItem(POSTS_STORAGE_KEY, JSON.stringify(nextList));
    } catch (error) {
      console.error(error);
    }
    navigate("/investment");
  };

  return (
    <div className="invest-create-page">
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

      <main className="invest-create-main">
        <section className="invest-create-hero">
          <div>
            <h1 className="invest-create-title">투자 게시글 수정</h1>
            <p className="invest-create-sub">
              작성한 투자 게시글을 수정하거나 삭제할 수 있습니다.
            </p>
          </div>
          <div className="invest-create-hero-actions">
            <button
              type="button"
              className="btn ghost"
              onClick={() => navigate("/investment")}
            >
              목록으로
            </button>
            <button type="button" className="btn primary">
              미리보기
            </button>
          </div>
        </section>

        {notFound ? (
          <section className="invest-create-card">
            <p>수정할 게시글을 찾을 수 없습니다.</p>
            <div className="invest-form-actions">
              <button
                type="button"
                className="btn"
                onClick={() => navigate("/investment")}
              >
                목록으로
              </button>
            </div>
          </section>
        ) : (
          <section className="invest-create-grid">
            <form
              id="invest-edit"
              className="invest-create-card"
              onSubmit={handleSubmit}
            >
              <div className="invest-form-row two-col">
                <label className="invest-form-label">
                  회사명
                  <input
                    type="text"
                    value={form.company}
                    onChange={updateField("company")}
                    placeholder="브랜드 파일럿"
                    required
                  />
                </label>
                <label className="invest-form-label">
                  한 줄 소개
                  <input
                    type="text"
                    value={form.oneLiner}
                    onChange={updateField("oneLiner")}
                    placeholder="예: AI 기반 B2B 영업 효율화 SaaS"
                  />
                </label>
              </div>

              <div className="invest-form-row">
                <label className="invest-form-label">
                  로고 이미지 URL
                  <input
                    type="url"
                    value={form.logoImageUrl}
                    onChange={updateField("logoImageUrl")}
                    onBlur={handleUrlBlur("logoImageUrl")}
                    placeholder="https://"
                  />
                </label>
                {errors.logoImageUrl ? (
                  <div className="invest-form-error">{errors.logoImageUrl}</div>
                ) : null}
              </div>

              <div className="invest-form-row two-col">
                <label className="invest-form-label">
                  지역
                  <select
                    value={form.location}
                    onChange={updateField("location")}
                  >
                    {LOCATION_OPTIONS.map((loc) => (
                      <option key={loc} value={loc}>
                        {loc}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="invest-form-label">
                  회사 규모
                  <select
                    value={form.companySize}
                    onChange={updateField("companySize")}
                  >
                    {COMPANY_SIZE_OPTIONS.map((size) => (
                      <option key={size} value={size}>
                        {size}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="invest-form-row">
                <label className="invest-form-label">
                  태그 (최대 5개)
                  <div className="invest-tag-grid">
                    {form.hashtags.map((value, index) => (
                      <input
                        key={`hashtag-${index}`}
                        type="text"
                        value={value}
                        onChange={(event) => {
                          const next = [...form.hashtags];
                          next[index] = event.target.value;
                          setForm((prev) => ({ ...prev, hashtags: next }));
                        }}
                        placeholder={`해시태그 ${index + 1}`}
                      />
                    ))}
                  </div>
                </label>
              </div>

              <div className="invest-form-row two-col">
                <label className="invest-form-label">
                  공식 홈페이지
                  <input
                    type="url"
                    value={form.website}
                    onChange={updateField("website")}
                    onBlur={handleUrlBlur("website")}
                    placeholder="https://"
                  />
                </label>
                <label className="invest-form-label">
                  담당자 이름
                  <input
                    type="text"
                    value={form.contactName}
                    onChange={updateField("contactName")}
                    placeholder="홍길동"
                  />
                </label>
              </div>
              {errors.website ? (
                <div className="invest-form-error">{errors.website}</div>
              ) : null}

              <div className="invest-form-row">
                <label className="invest-form-label">
                  담당자 이메일
                  <input
                    type="email"
                    value={form.contactEmail}
                    onChange={updateField("contactEmail")}
                    placeholder="contact@brandpilot.kr"
                  />
                </label>
              </div>

              <div className="invest-form-row">
                <label className="invest-form-label">
                  상세 소개
                  <textarea
                    value={form.summary}
                    onChange={updateField("summary")}
                    placeholder="사업 모델, traction, 지표 등 투자자가 바로 이해할 수 있도록 작성해 주세요."
                    rows={5}
                  />
                </label>
              </div>

              <div className="invest-form-actions">
                <button type="button" className="btn ghost" onClick={handleDelete}>
                  삭제
                </button>
                <button type="submit" className="btn primary">
                  수정 저장
                </button>
              </div>
            </form>

            <aside className="invest-create-side">
              <div className="invest-preview invest-preview--board">
                <div className="invest-preview-top">
                  <div className="invest-preview-text">
                    <h3>{form.company || "회사명 입력"}</h3>
                    <p className="invest-preview-oneliner">
                      {form.oneLiner || "한 줄 소개가 표시됩니다."}
                    </p>
                  </div>
                  <div className="invest-preview-logo" aria-hidden="true">
                    {logoSrc ? (
                      <img src={logoSrc} alt="로고 미리보기" />
                    ) : (
                      previewLogo
                    )}
                  </div>
                </div>
                <div className="invest-preview-tags">
                  {tagList.length === 0 ? (
                    <span className="empty">태그를 입력해 주세요.</span>
                  ) : (
                    tagList.map((tag) => <span key={tag}>#{tag}</span>)
                  )}
                </div>
                <div className="invest-preview-bottom">
                  <div className="invest-preview-meta">
                    <div className="invest-preview-status">
                      {[form.location, form.companySize]
                        .filter(Boolean)
                        .join(", ")}
                    </div>
                    <div className="invest-preview-updated">
                      업데이트: {new Date().toISOString().slice(0, 10)}
                    </div>
                  </div>
                  <span className="invest-preview-link" aria-hidden="true">
                    ↗
                  </span>
                </div>
              </div>
            </aside>
          </section>
        )}
      </main>

      <SiteFooter onOpenPolicy={setOpenType} />
    </div>
  );
}
