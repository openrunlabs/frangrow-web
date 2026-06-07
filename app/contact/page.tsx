"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function ContactPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [trackingData, setTrackingData] = useState({
    utm_source: "", utm_medium: "", utm_campaign: "",
    utm_content: "", landing_url: "", referrer: "",
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const p = new URLSearchParams(window.location.search);
      setTrackingData({
        utm_source: p.get("utm_source") || "자연검색유입",
        utm_medium: p.get("utm_medium") || "없음",
        utm_campaign: p.get("utm_campaign") || "없음",
        utm_content: p.get("utm_content") || "없음",
        landing_url: window.location.href,
        referrer: document.referrer || "직접 유입",
      });
    }
  }, []);

  const formatPhone = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nums = e.target.value.replace(/[^0-9]/g, "");
    let formatted = nums;
    if (nums.length <= 3) formatted = nums;
    else if (nums.length <= 7) formatted = nums.slice(0,3) + "-" + nums.slice(3);
    else formatted = nums.slice(0,3) + "-" + nums.slice(3,7) + "-" + nums.slice(7,11);
    e.target.value = formatted;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const agreed = (form.querySelector("#privacy-agree") as HTMLInputElement)?.checked;
    if (!agreed) {
      setErrorMsg("개인정보 수집 및 이용 동의가 필요합니다.");
      setShowError(true);
      return;
    }
    setIsSubmitting(true);
    const sols: string[] = [];
    form.querySelectorAll<HTMLInputElement>(".sol-cb:checked").forEach(cb => sols.push(cb.value));
    const payload = {
      name: fd.get("name"),
      role: fd.get("role"),
      phone: fd.get("phone"),
      company_name: fd.get("company_name"),
      industry: fd.get("industry"),
      content: fd.get("content"),
      target_solutions: sols,
      ...trackingData,
    };
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setShowSuccess(true);
        form.reset();
      } else {
        const d = await res.json();
        throw new Error(d.error || "전송 실패");
      }
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "오류 발생");
      setShowError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white antialiased overflow-x-hidden">
      <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-[#EBEBEB]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <button onClick={() => router.push("/")} className="font-black text-xl sm:text-2xl tracking-tight uppercase text-[#111111]">
              FRAN<span className="text-[#D0190F]">GROW</span>
            </button>
            <div className="flex items-center space-x-6 text-sm font-bold">
              <button onClick={() => router.push("/")} className="hidden sm:inline-block hover:text-[#D0190F] transition-colors text-[#71717A]">HOME</button>
              <button onClick={() => router.push("/services")} className="hover:text-[#D0190F] transition-colors text-[#71717A]">서비스 소개</button>
              <button onClick={() => router.push("/contact")} className="bg-[#D0190F] text-white px-5 py-2.5 rounded-full text-xs font-black">상담신청</button>
            </div>
          </div>
        </div>
      </nav>

      <main className="py-16 sm:py-24">
        <div className="max-w-3xl mx-auto px-5 sm:px-8 space-y-12">
          <div className="text-center space-y-4">
            <p className="text-xs font-extrabold uppercase tracking-[0.15em] text-[#D0190F]">FRANGROW GROWTH CHECK</p>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-[#111111]">프차그로우 브랜드 확장 가능성 진단 신청</h1>
            <p className="text-sm text-zinc-500 max-w-2xl mx-auto leading-relaxed">
              프차그로우는 현재 브랜드의 가맹확장, 검색 노출, 성장자금, AI 본부 시스템 가능성을 기준으로 실행 가능한 다음 단계를 진단합니다.
            </p>
          </div>

          <div className="bg-[#FAFAFA] border border-[#EBEBEB] p-8 sm:p-12 rounded-[18px] shadow-md">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-[#111111] mb-2">이름 *</label>
                  <input required type="text" name="name" className="w-full text-sm p-4 bg-white border border-[#EBEBEB] rounded-[18px] focus:outline-none focus:border-[#D0190F]" placeholder="김성장 대표" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#111111] mb-2">직책 *</label>
                  <input required type="text" name="role" className="w-full text-sm p-4 bg-white border border-[#EBEBEB] rounded-[18px] focus:outline-none focus:border-[#D0190F]" placeholder="대표이사 / 본부장" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-[#111111] mb-2">연락처 *</label>
                  <input
                    required
                    type="tel"
                    name="phone"
                    maxLength={13}
                    onChange={formatPhone}
                    pattern="\d{3}-\d{4}-\d{4}"
                    title="010-0000-0000 형식으로 입력해주세요"
                    className="w-full text-sm p-4 bg-white border border-[#EBEBEB] rounded-[18px] focus:outline-none focus:border-[#D0190F]"
                    placeholder="010-0000-0000"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#111111] mb-2">회사명 (브랜드명) *</label>
                  <input required type="text" name="company_name" className="w-full text-sm p-4 bg-white border border-[#EBEBEB] rounded-[18px] focus:outline-none focus:border-[#D0190F]" placeholder="주식회사 에프앤비코리아" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#111111] mb-2">업종 *</label>
                <select required name="industry" className="w-full text-sm p-4 bg-white border border-[#EBEBEB] rounded-[18px] focus:outline-none focus:border-[#D0190F]">
                  <option value="">업종을 선택해 주세요</option>
                  <option>한식 / 일식 / 중식 외식 체인본부</option>
                  <option>카페 / 베이커리 / 식품 유통</option>
                  <option>서비스 / 뷰티 / 생활 체인</option>
                  <option>HMR / 가공공장 / 제조업 기타</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#111111] mb-3">관심 솔루션 (중복 선택 가능) *</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {["가맹확장 마케팅 (DB 마케팅)", "AEO/GEO 최적화 마케팅", "정부지원사업 / 자금조달 컨설팅", "AI 본부 구축 시스템 (AI ERP)"].map((sol) => (
                    <label key={sol} className="border border-[#EBEBEB] p-4 bg-white rounded-[18px] flex items-center space-x-3 cursor-pointer hover:border-[#D0190F] transition-all">
                      <input type="checkbox" value={sol} className="sol-cb w-4 h-4 accent-[#D0190F]" />
                      <span className="text-xs font-bold text-zinc-700">{sol}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#111111] mb-2">문의 및 애로사항 *</label>
                <textarea required name="content" rows={5} className="w-full text-sm p-4 bg-white border border-[#EBEBEB] rounded-[18px] focus:outline-none focus:border-[#D0190F] leading-relaxed" placeholder="현재 가맹점 수와 확장의 가장 큰 허들을 입력해주세요." />
              </div>

              <div className="border border-[#EBEBEB] bg-white p-5 rounded-[18px] space-y-4">
                <div className="text-[11px] text-zinc-500 leading-relaxed space-y-2">
                  <p className="font-extrabold text-zinc-700">[개인정보 수집 및 이용 동의]</p>
                  <p>수집 항목: 이름, 직책, 연락처, 회사명, 업종, 문의 내용 / 보유 기간: 목적 달성 후 즉시 파기 (최대 3년)</p>
                </div>
                <div className="flex items-center space-x-2.5 pt-2 border-t border-[#EBEBEB]">
                  <input required type="checkbox" id="privacy-agree" className="w-5 h-5 accent-[#D0190F] cursor-pointer" />
                  <label htmlFor="privacy-agree" className="text-xs font-bold text-[#111111] cursor-pointer">개인정보 수집 및 이용에 동의합니다. (필수)</label>
                </div>
              </div>

              <div className="bg-rose-50 border border-red-100 p-6 rounded-[18px] text-xs text-zinc-700 leading-relaxed">
                <p className="font-extrabold text-[#D0190F] mb-2">안내</p>
                <p>프차그로우는 브랜드의 성장 구조를 함께 설계할 수 있는 파트너십을 중요하게 생각합니다. 브랜드의 다음 성장을 진지하게 고민하고 계신 대표님이라면 현재 상황을 먼저 진단해 드리겠습니다.</p>
              </div>

              <button type="submit" disabled={isSubmitting} className="w-full bg-[#D0190F] text-white py-5 text-sm font-black rounded-[18px] hover:bg-red-700 transition-all shadow-lg disabled:bg-zinc-400">
                {isSubmitting ? "전송 중..." : "상담 신청하기"}
              </button>
            </form>
          </div>
        </div>
      </main>

      <footer className="bg-[#FAFAFA] py-12 border-t border-[#EBEBEB] text-xs">
        <div className="max-w-7xl mx-auto px-5 flex flex-col md:flex-row justify-between gap-6">
          <p className="font-black text-zinc-800 text-sm">제이와이베스트(주) | FRANGROW (프차그로우)</p>
          <p className="text-zinc-400">2026 FRANGROW. All rights reserved.</p>
        </div>
      </footer>

      {showSuccess && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-white p-8 rounded-[18px] max-w-md w-full text-center shadow-2xl space-y-6">
            <div className="w-16 h-16 bg-[#D0190F] text-white flex items-center justify-center rounded-full mx-auto text-2xl font-black">V</div>
            <h3 className="text-xl font-black text-[#111111]">상담 신청이 완료되었습니다!</h3>
            <p className="text-xs text-zinc-500">24시간 내 담당 파트너가 연락드리겠습니다.</p>
            <button onClick={() => setShowSuccess(false)} className="w-full bg-[#D0190F] text-white py-4 text-sm font-bold rounded-full hover:bg-red-700">확인 및 닫기</button>
          </div>
        </div>
      )}

      {showError && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-white p-8 rounded-[18px] max-w-md w-full text-center shadow-2xl space-y-6">
            <div className="w-16 h-16 bg-zinc-100 text-[#D0190F] flex items-center justify-center rounded-full mx-auto text-2xl font-black">X</div>
            <h3 className="text-xl font-black text-[#111111]">신청 오류</h3>
            <p className="text-xs text-zinc-500">{errorMsg}</p>
            <button onClick={() => setShowError(false)} className="w-full bg-[#111111] text-white py-4 text-sm font-bold rounded-full">다시 확인하기</button>
          </div>
        </div>
      )}
    </div>
  );
}