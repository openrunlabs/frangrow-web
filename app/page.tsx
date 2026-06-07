"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

type ViewState = "home" | "services" | "contact";

export default function FrangrowPage() {
  const [currentView, setCurrentView] = useState<ViewState>("home");
  const [activeTab, setActiveTab] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [trackingData, setTrackingData] = useState({
    utm_source: "",
    utm_medium: "",
    utm_campaign: "",
    utm_content: "",
    landing_url: "",
    referrer: "",
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
        referrer: document.referrer || "직접 주소창 타이핑",
      });
    }
  }, []);

  useEffect(() => {
    const onScroll = () => {
      document.querySelectorAll(".reveal").forEach((el) => {
        const top = el.getBoundingClientRect().top;
        if (top < window.innerHeight - 120) el.classList.add("active");
      });
    };
    window.addEventListener("scroll", onScroll);
    setTimeout(onScroll, 300);
    return () => window.removeEventListener("scroll", onScroll);
  }, [currentView, activeTab]);

const router = useRouter();
const go = useCallback((v: ViewState) => {
  if (v === "home") router.push("/");
  if (v === "services") router.push("/services");
  if (v === "contact") router.push("/contact");
}, [router]);

const goService = useCallback((tab: number) => {
  router.push(`/services`);
  setTimeout(() => setActiveTab(tab), 100);
}, [router]);

  const goContactWithSol = useCallback((solIdx: number) => {
    setCurrentView("contact");
    window.scrollTo({ top: 0, behavior: "smooth" });
    setTimeout(() => {
      const cbs = document.querySelectorAll<HTMLInputElement>(".sol-cb");
      cbs.forEach((cb, i) => (cb.checked = i === solIdx));
    }, 200);
  }, []);

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
    form.querySelectorAll<HTMLInputElement>(".sol-cb:checked").forEach((cb) => sols.push(cb.value));

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
        throw new Error(d.error || "전송에 실패했습니다.");
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "알 수 없는 오류";
      setErrorMsg(message);
      setShowError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ─── Shared Components ─── */
  const Nav = () => (
    <nav className="bg-white/80 backdrop-blur-md text-brand-black sticky top-0 z-50 border-b border-brand-border">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          <button onClick={() => go("home")} className="font-black text-xl sm:text-2xl tracking-tight uppercase">
            FRAN<span className="text-brand-red">GROW</span>
          </button>
          <div className="flex items-center space-x-6 sm:space-x-10 text-sm sm:text-base font-bold">
            <button onClick={() => go("home")} className="hidden sm:inline-block hover:text-brand-red transition-colors py-2">HOME</button>
            <button onClick={() => goService(0)} className="hover:text-brand-red transition-colors py-2">서비스 소개</button>
            <button onClick={() => go("contact")} className="bg-brand-red text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm font-black tracking-wider hover:bg-red-700 transition-all shadow-md active:scale-95">
              상담신청
            </button>
          </div>
        </div>
      </div>
    </nav>
  );

  const Footer = () => (
    <footer className="bg-brand-grayBg text-zinc-500 py-16 border-t border-brand-border text-xs sm:text-sm">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div className="space-y-3">
            <p className="font-black text-zinc-800 text-base sm:text-lg tracking-tight">제이와이베스트(주) | FRANGROW (프차그로우)</p>
            <p className="text-zinc-600">프랜차이즈 본사 성장 시스템 설계 및 컴퍼니 빌더</p>
            <p className="text-zinc-400">서울특별시 디지털로 178, 가산퍼블릭 B동</p>
          </div>
          <div className="text-left md:text-right space-y-2 text-zinc-600">
            <p className="font-bold text-zinc-800">대표 CS 메일: <span className="text-brand-red">frangrow@naver.com</span></p>
          </div>
        </div>
        <div className="border-t border-zinc-200 pt-8 flex flex-col sm:flex-row justify-between text-zinc-400 text-xs gap-4">
          <p>© 2026 FRANGROW. All rights reserved.</p>
          <div className="flex space-x-6">
            <span>서비스이용약관</span>
            <span>개인정보처리방침</span>
          </div>
        </div>
      </div>
    </footer>
  );

  const TargetGrid = ({ fits, nots }: { fits: string[]; nots: string[] }) => (
    <div className="max-w-4xl mx-auto px-5 sm:px-8 grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="border border-brand-border rounded-brand p-8 bg-white">
        <h4 className="text-base sm:text-lg font-black text-emerald-600 mb-6">☑ 이런 분들에게 적합합니다</h4>
        <ul className="space-y-3 text-xs sm:text-sm text-zinc-600">
          {fits.map((f, i) => <li key={i} className="flex items-start"><span className="text-emerald-500 mr-2 font-bold">✓</span>{f}</li>)}
        </ul>
      </div>
      <div className="border border-brand-border rounded-brand p-8 bg-white">
        <h4 className="text-base sm:text-lg font-black text-brand-red mb-6">☒ 적합하지 않은 경우</h4>
        <ul className="space-y-3 text-xs sm:text-sm text-zinc-600">
          {nots.map((n, i) => <li key={i} className="flex items-start"><span className="text-brand-red mr-2 font-bold">✕</span>{n}</li>)}
        </ul>
      </div>
    </div>
  );

  /* ─── SERVICES DATA ─── */
  const services = [
    {
      num: "01", chip: "DB 마케팅", title: "가맹확장 DB 마케팅",
      heroTitle: "가맹문의가 없다면, 광고비보다 구조를 먼저 봐야 합니다.",
      desc: "브랜드가 좋아도 문의는 저절로 오지 않습니다. 예비 점주가 발견하고, 신뢰하고, 상담신청까지 남기게 만드는 흐름이 필요합니다. 광고를 해도 문의가 없다면 광고비 부족이 아니라, 메시지·랜딩페이지·DB 수집·상담관리 구조가 끊겨 있을 가능성이 높습니다.",
      provides: ["검색광고 및 SEO 최적화 구조 설계", "메타, 당근 등 DB 수집 광고 운영", "가맹확장 전용 랜딩페이지 제작", "상담신청 폼 및 DB 관리 구조 설계", "광고 효율 보고서 제공 및 데이터 분석"],
      effects: ["가맹문의 유입 구조 확보", "광고비 대비 DB 수집 효율 개선", "상담 가능한 문의 선별", "랜딩페이지 전환율 개선", "본사가 직접 확인 가능한 광고 리포트 확보"],
      fits: ["가맹점 확장을 본격적으로 준비 중인 외식 프랜차이즈 본사", "가맹 문의 DB 수집 통로가 빈약한 초기 브랜드", "현재 광고를 돌리고 있으나 전환율이 낮은 본사"],
      nots: ["단순히 저렴한 광고대행이나 편법 트래픽만을 원하는 경우", "브랜드 내부에 수집된 DB에 응대할 상담 조직이 부재한 경우", "투명하지 않은 방식을 통해 가맹 계약 보장만을 원하는 경우"],
      cta: "가맹확장 구조 진단받기", ctaSub: "광고비를 더 태우기 전에, 가맹문의가 새는 구조부터 진단하세요.",
    },
    {
      num: "02", chip: "AEO / GEO", title: "AEO/GEO 최적화",
      heroTitle: "AI가 모르는 브랜드는 예비 점주의 선택지에도 오르기 어렵습니다.",
      desc: "예비 창업자는 네이버와 구글뿐 아니라 ChatGPT, Gemini, Claude 같은 AI 검색 환경에서 브랜드를 비교합니다. AI가 아무 브랜드나 추천하지 않습니다. 홈페이지, 블로그, 기사, 지도 정보가 일관되게 정리되어 있지 않으면 AI는 브랜드의 강점을 이해하기 어렵습니다.",
      provides: ["홈페이지 및 웹사이트 검색 크롤링 구조 점검", "브랜드 기본 정보 구조화 설계", "AEO 대응 콘텐츠 기획", "GEO 기반 지도 정보 및 로컬 노출 정비", "네이버 스마트플레이스, 구글맵 정보 점검", "검색 노출 지수 개선 데이터 리포트 제공"],
      effects: ["브랜드 검색 신뢰도 개선", "AI 검색 환경 대응 및 추천 목록 선점 기반 마련", "홈페이지와 외부 콘텐츠의 정보 일관성 강화", "예비 가맹점주가 브랜드를 객관적으로 검토할 근거 확보"],
      fits: ["AI 검색 노출을 선제적으로 강화하고 싶은 기업", "브랜드명이 검색되어도 신뢰성 있는 정보가 노출되지 않는 본사", "홈페이지와 대외 콘텐츠 구조가 파편화된 브랜드"],
      nots: ["단기간의 검색 결과 보장이나 순위 조작을 희망하는 경우", "회사 정보를 정비하는 기획 과정에 조력하기 어려운 경우", "일회성의 임시방편 상위 노출 기법만 고수하고자 하는 브랜드"],
      cta: "AEO/GEO 무료 진단 신청하기", ctaSub: "AI가 모르면, 점주도 모릅니다.",
    },
    {
      num: "03", chip: "정책자금", title: "정책자금 / 성장자금 로드맵",
      heroTitle: "지금 받은 소액 자금이, 나중에 받을 10억 한도를 막을 수 있습니다.",
      desc: "정책자금은 단순히 공고를 찾아 신청하는 싸움이 아닙니다. 같은 기업이라도 어떤 인증을 먼저 준비하고, 어떤 자금을 어떤 순서로 신청하느냐에 따라 받을 수 있는 한도와 가능성이 달라집니다. 프차그로우는 기업의 현재 상태를 기준으로 자금 조달 로드맵을 설계합니다.",
      highlight: "정책자금은 빨리 신청하는 것보다, 놓치지 않도록 순서를 설계하는 것이 먼저입니다.",
      provides: ["기업 신용도, 재무 상태, 업력, 매출 구조 사전 진단", "현재 신청 가능한 자금과 미뤄야 할 자금 구분", "벤처인증, 메인비즈, 기업부설연구소 등 가점 요소 로드맵 수립", "정책자금, 보증, 융자, 정부지원사업 신청 순서 설계", "심사 대응 사업계획서 방향 및 논리 구조 설계"],
      effects: ["10억 규모 성장자금 기회를 놓치지 않기 위한 사전 로드맵 확보", "소액 자금 신청으로 인한 한도·평점·심사 흐름 왜곡 방지", "기업 상태에 맞는 자금 조달 우선순위 정리", "무분별한 공고 신청으로 인한 탈락 리스크 완화"],
      fits: ["정책자금으로 안정적인 성장 동력을 만들고 싶은 본사", "3천만 원 소액 자금보다 중장기 성장자금 로드맵이 필요한 기업", "R&D, 인프라 고도화 비용이 필요해 심사 대응 가점이 필요한 대표님"],
      nots: ["당장 받을 수 있는 소액 단기 대출만 찾는 경우", "승인이나 한도, 금리 등의 100% 보장을 요구하는 경우", "핵심 서류나 재무자료 제공 및 사업 기획 개선 의지가 없는 브랜드"],
      cta: "정책자금 가능성 무료 진단 신청하기", ctaSub: "정책자금은 먼저 신청하는 순간, 더 큰 기회가 닫힐 수 있습니다.",
    },
    {
      num: "04", chip: "본부 구축", title: "AI 본부 구축 시스템",
      heroTitle: "1인 대표도 운영 가능한 프랜차이즈 본부, AI ERP로 먼저 구축해야 합니다.",
      desc: "가맹점 계약이 많아지면 무조건 본사가 탄탄해질 거라 착각합니다. 현실은 정보공개서의 허점, 물류 계약 구조, 지점 관리 매뉴얼 부재로 인해 점포가 늘어나는 시점에 분쟁과 리스크가 늘어납니다.",
      highlight: "프차그로우는 가맹점 200개를 무조건 만드는 법을 말하지 않습니다. 대신 가맹점 50개까지 가장 빠르고 안정적으로 가기 위해 필요한 구조, 그리고 물류수익을 만들 수 있는 본부 수익 시스템을 설계합니다.",
      provides: ["정보공개서 및 가맹계약 기본 구조 점검", "물류공급 수수료 정산 및 가맹본부 고유 수익모델 최적 조율", "가맹 지점 관리 통제 표준 프로세스 가이드", "핵심 슈퍼바이저 매뉴얼 구축 제안", "자체 AI ERP 및 가맹 경영관리 시스템 구축 모델 제안"],
      effects: ["초기 인건비 부담 절감", "대표 중심의 본부 통제력 강화", "가맹상담부터 점포관리까지 업무 흐름 표준화", "물류정산 및 가맹점 관리 리스크 완화"],
      fits: ["직영점에서 가맹사업으로 전환하려는 대표님", "직원 채용 전, 먼저 본부 시스템을 만들고 싶은 초기 본사", "AI ERP와 자동화를 구축해 본사 통제력을 극대화하고픈 대표님"],
      nots: ["체계적인 가맹 관리 시스템 구축 없이 점포 확장만 희망하는 경우", "본부 내부 프로세스를 개선하거나 데이터를 정비할 의지가 없는 경우", "정산 투명성 및 가맹 법무 공정 스크리닝 요건을 무시하려는 브랜드"],
      cta: "AI 본부 구축 무료 진단 신청하기", ctaSub: "직원 뽑기 전에, AI로 굴러가는 본부 구조부터 진단하세요.",
    },
  ];

  const exps = [
    { num: "01", title: "가맹확장 구조 설계", desc: "예비 가맹점주 DB 수집, 광고 운영, 상담 전환 구조까지 가맹확장에 필요한 실행 흐름을 설계한 경험이 있습니다." },
    { num: "02", title: "정책자금 · 성장자금 대응", desc: "기업 상황에 맞는 정책자금 신청 순서, 사업계획서 방향, 심사 대응 구조를 정리한 경험이 있습니다. (누적 20억)" },
    { num: "03", title: "기업인증 로드맵 구축", desc: "벤처인증, 메인비즈, 기업부설연구소 등 성장 단계에 필요한 인증 구조를 검토하고 추진한 경험이 있습니다." },
    { num: "04", title: "물류수익 · 본부 수익모델 설계", desc: "가맹본부가 지속 가능한 수익을 만들 수 있도록 물류마진, 정산, 본부 수익 구조를 설계한 경험이 있습니다. (월 1억)" },
    { num: "05", title: "브랜드 마케팅 협업 실행", desc: "대형 제조사와의 협업, 브랜드 캠페인, 온·오프라인 마케팅 실행을 통해 브랜드 신뢰도를 높인 경험이 있습니다." },
    { num: "06", title: "ERP · 경영관리 시스템 구축", desc: "가맹점 관리, 정산, 물류, 데이터 관리를 연결하는 본부형 경영관리 시스템 구축 경험이 있습니다. (AI 활용)" },
  ];

  const s = services[activeTab];

  return (
    <div className="bg-white text-brand-black antialiased overflow-x-hidden">
      <style jsx global>{`
        .reveal { opacity: 0; transform: translateY(20px); transition: opacity 0.8s ease, transform 0.8s ease; }
        .reveal.active { opacity: 1; transform: translateY(0); }
      `}</style>

      <Nav />

      {/* ═══ HOME ═══ */}
      {currentView === "home" && (
        <main>
          {/* HERO */}
          <section className="relative bg-white py-20 sm:py-32 lg:py-40 overflow-hidden flex items-center border-b border-brand-border">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] sm:w-[800px] sm:h-[800px] bg-brand-red/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="relative max-w-5xl mx-auto px-5 sm:px-8 text-center z-10 space-y-6 sm:space-y-8">
              <p className="text-xs sm:text-sm uppercase tracking-[0.25em] text-brand-red font-extrabold">FRANGROW</p>
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight text-brand-black">
                프랜차이즈 본사의 성장은{" "}
                <span className="text-brand-red block mt-2 sm:inline sm:mt-0">좋은 브랜드만으로 완성되지 않습니다.</span>
              </h1>
              <p className="text-zinc-600 text-sm sm:text-base lg:text-lg max-w-3xl mx-auto leading-relaxed px-2 font-medium">
                가맹점 확장, AI 검색 노출, 정책자금, 본부 시스템 구축까지. 프차그로우는 프랜차이즈 본사가 다음 단계로 성장하기 위해 필요한 실행 구조를 함께 설계합니다.
              </p>
              <div className="flex flex-col sm:flex-row justify-center items-center gap-5 px-4 max-w-2xl mx-auto">
                <button onClick={() => go("contact")} className="w-full sm:w-auto bg-brand-red text-white text-sm sm:text-base font-bold px-10 py-5 rounded-full hover:bg-red-700 transition-all text-center shadow-xl active:scale-95">무료 성장 진단 신청하기</button>
                <button onClick={() => { const el = document.getElementById("services-summary"); if (el) el.scrollIntoView({ behavior: "smooth" }); }} className="w-full sm:w-auto bg-white border border-brand-border text-brand-black text-sm sm:text-base font-semibold px-10 py-5 rounded-full transition-all text-center active:scale-95">제공 서비스 보기</button>
              </div>
            </div>
          </section>

          {/* EXPERIENCE */}
          <section className="bg-brand-grayBg py-20 sm:py-32 border-b border-brand-border">
            <div className="max-w-4xl mx-auto px-5 sm:px-8">
              <div className="space-y-6 reveal mb-16">
                <p className="text-xs sm:text-sm font-extrabold uppercase tracking-[0.15em] text-brand-red">EXPERIENCE</p>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-brand-black leading-tight">
                  프차그로우는 프랜차이즈 본사의 성장 과정을 <span className="text-brand-red">직접 경험한 실행 기반 솔루션입니다.</span>
                </h2>
                <p className="text-sm sm:text-base text-brand-muted leading-relaxed">프랜차이즈 본사의 성장은 광고 하나로 완성되지 않습니다. 가맹점 확장, 자금 조달, 기업인증, 물류수익 구조, 브랜드 마케팅, 본부 시스템이 함께 정리되어야 합니다.</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 reveal">
                {exps.map((e) => (
                  <div key={e.num} className="bg-white p-8 border border-brand-border rounded-brand shadow-sm hover:border-brand-red/10 transition-colors">
                    <span className="text-xs sm:text-sm font-extrabold text-brand-red block mb-2">{e.num}</span>
                    <div className="text-lg sm:text-xl font-black text-brand-black mb-2">{e.title}</div>
                    <p className="text-xs sm:text-sm text-brand-muted leading-relaxed">{e.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* SERVICES OVERVIEW */}
          <section id="services-summary" className="bg-white py-20 sm:py-32 border-b border-brand-border">
            <div className="max-w-5xl mx-auto px-5 sm:px-8 space-y-16">
              <div className="text-center space-y-4">
                <p className="text-xs sm:text-sm font-extrabold uppercase tracking-[0.15em] text-brand-red">4 CORE SERVICES</p>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-brand-black">프차그로우 핵심 서비스</h2>
                <p className="text-sm sm:text-base text-zinc-500 max-w-2xl mx-auto">각 성장 단계와 비즈니스 요건에 맞춰 실제 동작 가능한 실행 구조를 정리합니다.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10">
                {services.map((sv, i) => (
                  <div key={sv.num} className="bg-brand-grayBg p-8 sm:p-10 border border-brand-border rounded-brand flex flex-col justify-between space-y-8 hover:shadow-lg transition-all reveal">
                    <div className="space-y-6">
                      <div className="w-12 h-12 bg-brand-black text-white flex items-center justify-center font-black text-base rounded-full">{sv.num}</div>
                      <h3 className="text-xl sm:text-2xl font-black text-brand-black">{sv.title}</h3>
                      <p className="text-sm sm:text-base text-brand-muted leading-relaxed">{sv.desc.slice(0, 80)}...</p>
                    </div>
                    <button onClick={() => goService(i)} className="text-xs sm:text-sm font-extrabold text-brand-red border-b-2 border-brand-red pb-1 self-start hover:text-red-700 transition-colors">
                      {sv.title} 자세히 보기 →
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* PHILOSOPHY */}
          <section className="bg-brand-grayBg py-16 sm:py-24">
            <div className="max-w-5xl mx-auto px-5 sm:px-8">
              <div className="bg-brand-black text-white p-8 sm:p-16 rounded-brand shadow-xl relative overflow-hidden reveal">
                <div className="absolute -right-16 -bottom-16 w-64 h-64 bg-brand-red/10 rounded-full blur-[80px]" />
                <div className="relative z-10 space-y-6 sm:space-y-8 max-w-3xl">
                  <span className="text-xs sm:text-sm font-black tracking-widest text-brand-red uppercase">OUR PHILOSOPHY</span>
                  <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-snug">지속가능한 본사 비즈니스 구조를 지향합니다.</h2>
                  <p className="text-sm sm:text-base text-zinc-300 leading-relaxed font-light">프차그로우는 가맹점 수 증가라는 지표에만 매몰되지 않습니다. 본사의 탄탄한 시스템과 체계적인 AI 자동화 솔루션이 가동될 때 비로소 확장이 진정한 성장으로 이어집니다.</p>
                  <button onClick={() => go("contact")} className="bg-brand-red text-white text-xs sm:text-sm font-black tracking-wider px-8 py-4 rounded-full hover:bg-red-700 transition-all active:scale-95">지속 가능한 구조 가능성 진단받기 →</button>
                </div>
              </div>
            </div>
          </section>
        </main>
      )}

      {/* ═══ SERVICES ═══ */}
      {currentView === "services" && (
        <main>
          {/* Tabs */}
          <div className="bg-brand-grayBg border-b border-brand-border sticky top-16 sm:top-20 z-40">
            <div className="max-w-5xl mx-auto px-5 sm:px-8">
              <div className="flex overflow-x-auto space-x-8 sm:space-x-12 py-4 text-sm sm:text-base font-extrabold text-brand-muted">
                {services.map((sv, i) => (
                  <button key={i} onClick={() => { setActiveTab(i); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                    className={`whitespace-nowrap pb-1 border-b-2 transition-all ${activeTab === i ? "text-brand-red border-brand-red" : "border-transparent hover:text-brand-red"}`}>
                    {sv.num}. {sv.chip}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Active Service Detail */}
          <div className="py-16 sm:py-24 space-y-16 sm:space-y-24">
            <div className="max-w-4xl mx-auto px-5 sm:px-8 space-y-6">
              <span className="text-xs sm:text-sm font-extrabold uppercase tracking-widest text-brand-red">SOLUTION {s.num}</span>
              <h1 className="text-3xl sm:text-5xl font-black text-brand-black leading-tight">{s.heroTitle}</h1>
              <p className="text-sm sm:text-base lg:text-lg text-brand-muted leading-relaxed font-medium">{s.desc}</p>
              {(s as typeof s & {highlight?: string}).highlight && (
                <div className="border-l-4 border-brand-red pl-4 py-1 bg-brand-grayBg rounded-r-lg">
                  <p className="text-sm sm:text-base font-bold text-brand-black">{(s as typeof s & {highlight?: string}).highlight}</p>
                </div>
              )}
            </div>

            <div className="bg-brand-grayBg py-16 border-y border-brand-border">
              <div className="max-w-4xl mx-auto px-5 sm:px-8 grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-4">
                  <h3 className="text-lg sm:text-xl font-black text-brand-black">제공 내용</h3>
                  <ul className="space-y-2 text-sm sm:text-base text-zinc-600">
                    {s.provides.map((p, i) => <li key={i} className="flex items-start"><span className="text-brand-red mr-2 font-bold">•</span>{p}</li>)}
                  </ul>
                </div>
                <div className="space-y-4">
                  <h3 className="text-lg sm:text-xl font-black text-brand-black">기대 효과</h3>
                  <ul className="space-y-2 text-sm sm:text-base text-zinc-600">
                    {s.effects.map((e, i) => <li key={i} className="flex items-start"><span className="text-brand-red mr-2 font-bold">•</span>{e}</li>)}
                  </ul>
                </div>
              </div>
            </div>

            <TargetGrid fits={s.fits} nots={s.nots} />

            <div className="max-w-4xl mx-auto px-5 sm:px-8 text-center pt-8">
              <p className="text-sm sm:text-base text-brand-muted mb-6">{s.ctaSub}</p>
              <button onClick={() => goContactWithSol(activeTab)} className="bg-brand-red text-white text-sm sm:text-base font-black px-10 py-5 rounded-full hover:bg-red-700 transition-all active:scale-95 shadow-md">{s.cta}</button>
            </div>
          </div>
        </main>
      )}

      {/* ═══ CONTACT ═══ */}
      {currentView === "contact" && (
        <main className="py-16 sm:py-24">
          <div className="max-w-3xl mx-auto px-5 sm:px-8 space-y-12">
            <div className="text-center space-y-4">
              <p className="text-xs sm:text-sm font-extrabold uppercase tracking-[0.15em] text-brand-red">FRANGROW GROWTH CHECK</p>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-brand-black">프차그로우 브랜드 확장 가능성 진단 신청</h2>
              <p className="text-sm sm:text-base text-zinc-500 max-w-2xl mx-auto leading-relaxed">프차그로우는 단순 상담이 아니라 현재 브랜드의 가맹확장, 검색 노출, 성장자금, AI 본부 시스템 가능성을 기준으로 실행 가능한 다음 단계를 진단합니다.</p>
            </div>

            <div className="bg-brand-grayBg border border-brand-border p-8 sm:p-12 rounded-brand shadow-md">
              <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div><label className="block text-xs sm:text-sm font-bold text-brand-black mb-2">이름 *</label><input required type="text" name="name" className="w-full text-sm p-4 bg-white border border-brand-border rounded-brand focus:outline-none focus:border-brand-red" placeholder="김성장 대표" /></div>
                  <div><label className="block text-xs sm:text-sm font-bold text-brand-black mb-2">직책 *</label><input required type="text" name="role" className="w-full text-sm p-4 bg-white border border-brand-border rounded-brand focus:outline-none focus:border-brand-red" placeholder="대표이사 / 본부장" /></div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div><label className="block text-xs sm:text-sm font-bold text-brand-black mb-2">연락처 *</label><input required type="tel" name="phone" className="w-full text-sm p-4 bg-white border border-brand-border rounded-brand focus:outline-none focus:border-brand-red" placeholder="010-0000-0000" /></div>
                  <div><label className="block text-xs sm:text-sm font-bold text-brand-black mb-2">회사명 (브랜드명) *</label><input required type="text" name="company_name" className="w-full text-sm p-4 bg-white border border-brand-border rounded-brand focus:outline-none focus:border-brand-red" placeholder="주식회사 에프앤비코리아" /></div>
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-bold text-brand-black mb-2">업종 *</label>
                  <select required name="industry" className="w-full text-sm p-4 bg-white border border-brand-border rounded-brand focus:outline-none focus:border-brand-red">
                    <option value="">업종을 선택해 주세요</option>
                    <option>한식 / 일식 / 중식 외식 체인본부</option>
                    <option>카페 / 베이커리 / 식품 유통</option>
                    <option>서비스 / 뷰티 / 생활 체인</option>
                    <option>HMR / 가공공장 / 제조업 기타</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-bold text-brand-black mb-3">가장 긴급히 해결을 희망하시는 솔루션 (중복 선택 가능) *</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {["가맹확장 마케팅 (DB 마케팅)", "AEO/GEO 최적화 마케팅", "정부지원사업 / 자금조달 컨설팅", "AI 본부 구축 시스템 (AI ERP)"].map((sol) => (
                      <label key={sol} className="border border-brand-border p-4 bg-white rounded-brand flex items-center space-x-3 cursor-pointer hover:border-brand-red/30 transition-all">
                        <input type="checkbox" value={sol} className="sol-cb w-4 h-4 accent-brand-red" />
                        <span className="text-xs sm:text-sm font-bold text-zinc-700">{sol}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-bold text-brand-black mb-2">문의 및 애로사항 *</label>
                  <textarea required name="content" rows={5} className="w-full text-sm p-4 bg-white border border-brand-border rounded-brand focus:outline-none focus:border-brand-red leading-relaxed" placeholder="현재 가맹점 수와 확장의 가장 큰 허들을 입력해주세요." />
                </div>
                <div className="border border-brand-border bg-white p-5 rounded-brand space-y-4">
                  <div className="text-[11px] sm:text-xs text-zinc-500 leading-relaxed max-h-36 overflow-y-auto space-y-2">
                    <p className="font-extrabold text-zinc-700">[개인정보 수집 및 이용 동의]</p>
                    <p>제이와이베스트(주)는 상담 신청 및 대안 레포트 제공을 위해 개인정보를 수집·이용합니다.</p>
                    <p><strong>수집 항목:</strong> 이름, 직책, 연락처, 회사명, 업종, 문의 내용, UTM 정보</p>
                    <p><strong>보유 기간:</strong> 목적 달성 후 지체 없이 파기 (최대 3년)</p>
                  </div>
                  <div className="flex items-center space-x-2.5 pt-2 border-t border-brand-border">
                    <input required type="checkbox" id="privacy-agree" className="w-5 h-5 accent-brand-red cursor-pointer" />
                    <label htmlFor="privacy-agree" className="text-xs sm:text-sm font-bold text-brand-black cursor-pointer select-none">개인정보 수집 및 이용에 동의합니다. (필수)</label>
                  </div>
                </div>
                <div className="bg-rose-50 border border-brand-red/10 p-6 rounded-brand text-xs sm:text-sm text-zinc-700 leading-relaxed space-y-2">
                  <p className="font-extrabold text-brand-red">🔒 안내</p>
                  <p>프차그로우는 단순 저가 광고대행보다 브랜드의 성장 구조를 함께 설계할 수 있는 파트너십을 중요하게 생각합니다. 브랜드의 다음 성장을 진지하게 고민하고 계신 대표님이라면 현재 상황을 먼저 진단해 드리겠습니다.</p>
                </div>
                <button type="submit" disabled={isSubmitting} className="w-full bg-brand-red text-white py-5 text-sm sm:text-base font-black rounded-brand tracking-widest uppercase hover:bg-red-700 transition-all shadow-lg active:scale-95 disabled:bg-zinc-400">
                  {isSubmitting ? "안전 전송 중..." : "상담 신청하기"}
                </button>
              </form>
            </div>
          </div>
        </main>
      )}

      <Footer />

      {/* SUCCESS MODAL */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white p-8 rounded-brand max-w-md w-full text-center shadow-2xl space-y-6">
            <div className="w-16 h-16 bg-brand-red text-white flex items-center justify-center rounded-full mx-auto text-2xl font-black">✓</div>
            <h3 className="text-xl font-black text-brand-black">상담 신청이 완료되었습니다!</h3>
            <p className="text-xs sm:text-sm text-zinc-500 leading-relaxed">24시간 내 담당 파트너가 연락드리겠습니다.</p>
            <button onClick={() => setShowSuccess(false)} className="w-full bg-brand-red text-white py-4 text-sm font-bold rounded-full hover:bg-red-700">확인 및 닫기</button>
          </div>
        </div>
      )}

      {/* ERROR MODAL */}
      {showError && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white p-8 rounded-brand max-w-md w-full text-center shadow-2xl space-y-6">
            <div className="w-16 h-16 bg-brand-grayBg text-brand-red border-2 border-brand-red/30 flex items-center justify-center rounded-full mx-auto text-2xl font-black">✕</div>
            <h3 className="text-xl font-black text-brand-black">신청 오류</h3>
            <p className="text-xs sm:text-sm text-zinc-500">{errorMsg}</p>
            <button onClick={() => setShowError(false)} className="w-full bg-brand-black text-white py-4 text-sm font-bold rounded-full hover:bg-zinc-800">다시 확인하기</button>
          </div>
        </div>
      )}
    </div>
  );
}