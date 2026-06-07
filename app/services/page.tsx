"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ServicesPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(0);

  const services = [
    {
      num: "01", chip: "DB 마케팅", title: "가맹확장 DB 마케팅",
      heroTitle: "가맹문의가 없다면, 광고비보다 구조를 먼저 봐야 합니다.",
      desc: "브랜드가 좋아도 문의는 저절로 오지 않습니다. 예비 점주가 발견하고, 신뢰하고, 상담신청까지 남기게 만드는 흐름이 필요합니다.",
      provides: ["검색광고 및 SEO 최적화 구조 설계", "메타, 당근 등 DB 수집 광고 운영", "가맹확장 전용 랜딩페이지 제작", "상담신청 폼 및 DB 관리 구조 설계", "광고 효율 보고서 제공"],
      effects: ["가맹문의 유입 구조 확보", "광고비 대비 DB 수집 효율 개선", "상담 가능한 문의 선별", "랜딩페이지 전환율 개선"],
      fits: ["가맹점 확장을 본격적으로 준비 중인 외식 프랜차이즈 본사", "가맹 문의 DB 수집 통로가 빈약한 초기 브랜드", "현재 광고를 돌리고 있으나 전환율이 낮은 본사"],
      nots: ["단순히 저렴한 광고대행이나 편법 트래픽만을 원하는 경우", "브랜드 내부에 수집된 DB에 응대할 상담 조직이 부재한 경우", "투명하지 않은 방식을 통해 가맹 계약 보장만을 원하는 경우"],
      cta: "가맹확장 구조 진단받기", ctaSub: "광고비를 더 태우기 전에, 가맹문의가 새는 구조부터 진단하세요.",
    },
    {
      num: "02", chip: "AEO / GEO", title: "AEO/GEO 최적화",
      heroTitle: "AI가 모르는 브랜드는 예비 점주의 선택지에도 오르기 어렵습니다.",
      desc: "예비 창업자는 네이버와 구글뿐 아니라 ChatGPT, Gemini, Claude 같은 AI 검색 환경에서 브랜드를 비교합니다.",
      provides: ["홈페이지 및 웹사이트 검색 크롤링 구조 점검", "브랜드 기본 정보 구조화 설계", "AEO 대응 콘텐츠 기획", "GEO 기반 지도 정보 및 로컬 노출 정비", "검색 노출 지수 개선 데이터 리포트 제공"],
      effects: ["브랜드 검색 신뢰도 개선", "AI 검색 환경 대응 기반 마련", "홈페이지와 외부 콘텐츠의 정보 일관성 강화"],
      fits: ["AI 검색 노출을 선제적으로 강화하고 싶은 기업", "브랜드명이 검색되어도 신뢰성 있는 정보가 노출되지 않는 본사", "홈페이지와 대외 콘텐츠 구조가 파편화된 브랜드"],
      nots: ["단기간의 검색 결과 보장이나 순위 조작을 희망하는 경우", "회사 정보를 정비하는 기획 과정에 조력하기 어려운 경우", "일회성의 임시방편 상위 노출 기법만 고수하고자 하는 브랜드"],
      cta: "AEO/GEO 무료 진단 신청하기", ctaSub: "AI가 모르면, 점주도 모릅니다.",
    },
    {
      num: "03", chip: "정책자금", title: "정책자금 / 성장자금 로드맵",
      heroTitle: "지금 받은 소액 자금이, 나중에 받을 10억 한도를 막을 수 있습니다.",
      desc: "정책자금은 단순히 공고를 찾아 신청하는 싸움이 아닙니다. 같은 기업이라도 어떤 인증을 먼저 준비하고, 어떤 자금을 어떤 순서로 신청하느냐에 따라 받을 수 있는 한도와 가능성이 달라집니다.",
      provides: ["기업 신용도, 재무 상태, 업력, 매출 구조 사전 진단", "현재 신청 가능한 자금과 미뤄야 할 자금 구분", "벤처인증, 메인비즈, 기업부설연구소 등 가점 요소 로드맵 수립", "정책자금, 보증, 융자, 정부지원사업 신청 순서 설계"],
      effects: ["10억 규모 성장자금 기회를 놓치지 않기 위한 사전 로드맵 확보", "기업 상태에 맞는 자금 조달 우선순위 정리", "무분별한 공고 신청으로 인한 탈락 리스크 완화"],
      fits: ["정책자금으로 안정적인 성장 동력을 만들고 싶은 본사", "3천만 원 소액 자금보다 중장기 성장자금 로드맵이 필요한 기업", "벤처인증, 메인비즈를 검토 중인 기업"],
      nots: ["당장 받을 수 있는 소액 단기 대출만 찾는 경우", "승인이나 한도, 금리 등의 100% 보장을 요구하는 경우", "핵심 서류나 재무자료 제공 의지가 없는 브랜드"],
      cta: "정책자금 가능성 무료 진단 신청하기", ctaSub: "정책자금은 먼저 신청하는 순간, 더 큰 기회가 닫힐 수 있습니다.",
    },
    {
      num: "04", chip: "본부 구축", title: "AI 본부 구축 시스템",
      heroTitle: "1인 대표도 운영 가능한 프랜차이즈 본부, AI ERP로 먼저 구축해야 합니다.",
      desc: "가맹점 계약이 많아지면 무조건 본사가 탄탄해질 거라 착각합니다. 현실은 정보공개서의 허점, 물류 계약 구조, 지점 관리 매뉴얼 부재로 인해 점포가 늘어나는 시점에 분쟁과 리스크가 늘어납니다.",
      provides: ["정보공개서 및 가맹계약 기본 구조 점검", "물류공급 수수료 정산 및 가맹본부 고유 수익모델 최적 조율", "가맹 지점 관리 통제 표준 프로세스 가이드", "핵심 슈퍼바이저 매뉴얼 구축 제안", "자체 AI ERP 및 가맹 경영관리 시스템 구축 모델 제안"],
      effects: ["초기 인건비 부담 절감", "대표 중심의 본부 통제력 강화", "가맹상담부터 점포관리까지 업무 흐름 표준화"],
      fits: ["직영점에서 가맹사업으로 전환하려는 대표님", "직원 채용 전, 먼저 본부 시스템을 만들고 싶은 초기 본사", "AI ERP와 자동화를 구축해 본사 통제력을 극대화하고픈 대표님"],
      nots: ["체계적인 가맹 관리 시스템 구축 없이 점포 확장만 희망하는 경우", "본부 내부 프로세스를 개선하거나 데이터를 정비할 의지가 없는 경우", "정산 투명성 및 가맹 법무 공정 스크리닝 요건을 무시하려는 브랜드"],
      cta: "AI 본부 구축 무료 진단 신청하기", ctaSub: "직원 뽑기 전에, AI로 굴러가는 본부 구조부터 진단하세요.",
    },
  ];

  const s = services[activeTab];

  return (
    <div className="bg-white text-brand-black antialiased overflow-x-hidden">
      <style jsx global>{`
        :root {
          --color-brand-red: #D0190F;
          --color-brand-black: #111111;
          --color-brand-grayBg: #FAFAFA;
          --color-brand-border: #EBEBEB;
          --color-brand-muted: #71717A;
        }
      `}</style>

      {/* NAV */}
      <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-brand-border">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <button onClick={() => router.push("/")} className="font-black text-xl sm:text-2xl tracking-tight uppercase">
              FRAN<span className="text-brand-red">GROW</span>
            </button>
            <div className="flex items-center space-x-6 sm:space-x-10 text-sm sm:text-base font-bold">
              <button onClick={() => router.push("/")} className="hidden sm:inline-block hover:text-brand-red transition-colors">HOME</button>
              <button onClick={() => router.push("/services")} className="text-brand-red">서비스 소개</button>
              <button onClick={() => router.push("/contact")} className="bg-brand-red text-white px-5 sm:px-6 py-2.5 rounded-full text-xs sm:text-sm font-black hover:bg-red-700 transition-all">상담신청</button>
            </div>
          </div>
        </div>
      </nav>

      {/* TABS */}
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

      {/* SERVICE DETAIL */}
      <div className="py-16 sm:py-24 space-y-16 sm:space-y-24">
        <div className="max-w-4xl mx-auto px-5 sm:px-8 space-y-6">
          <span className="text-xs sm:text-sm font-extrabold uppercase tracking-widest text-brand-red">SOLUTION {s.num}</span>
          <h1 className="text-3xl sm:text-5xl font-black text-brand-black leading-tight">{s.heroTitle}</h1>
          <p className="text-sm sm:text-base text-brand-muted leading-relaxed">{s.desc}</p>
        </div>

        <div className="bg-brand-grayBg py-16 border-y border-brand-border">
          <div className="max-w-4xl mx-auto px-5 sm:px-8 grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-4">
              <h3 className="text-lg sm:text-xl font-black text-brand-black">제공 내용</h3>
              <ul className="space-y-2 text-sm text-zinc-600">
                {s.provides.map((p, i) => <li key={i} className="flex items-start"><span className="text-brand-red mr-2 font-bold">•</span>{p}</li>)}
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg sm:text-xl font-black text-brand-black">기대 효과</h3>
              <ul className="space-y-2 text-sm text-zinc-600">
                {s.effects.map((e, i) => <li key={i} className="flex items-start"><span className="text-brand-red mr-2 font-bold">•</span>{e}</li>)}
              </ul>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-5 sm:px-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="border border-brand-border rounded-[18px] p-8 bg-white">
            <h4 className="text-base font-black text-emerald-600 mb-6">☑ 이런 분들에게 적합합니다</h4>
            <ul className="space-y-3 text-xs sm:text-sm text-zinc-600">
              {s.fits.map((f, i) => <li key={i} className="flex items-start"><span className="text-emerald-500 mr-2 font-bold">✓</span>{f}</li>)}
            </ul>
          </div>
          <div className="border border-brand-border rounded-[18px] p-8 bg-white">
            <h4 className="text-base font-black text-brand-red mb-6">☒ 적합하지 않은 경우</h4>
            <ul className="space-y-3 text-xs sm:text-sm text-zinc-600">
              {s.nots.map((n, i) => <li key={i} className="flex items-start"><span className="text-brand-red mr-2 font-bold">✕</span>{n}</li>)}
            </ul>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-5 sm:px-8 text-center pt-8">
          <p className="text-sm text-brand-muted mb-6">{s.ctaSub}</p>
          <button onClick={() => router.push("/contact")} className="bg-brand-red text-white text-sm sm:text-base font-black px-10 py-5 rounded-full hover:bg-red-700 transition-all shadow-md">{s.cta}</button>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="bg-brand-grayBg py-12 border-t border-brand-border text-xs sm:text-sm">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 flex flex-col md:flex-row justify-between gap-6">
          <div className="space-y-2">
            <p className="font-black text-zinc-800 text-sm">제이와이베스트(주) | FRANGROW (프차그로우)</p>
            <p className="text-zinc-500">서울특별시 디지털로 178, 가산퍼블릭 B동</p>
          </div>
          <p className="text-zinc-400 text-xs">© 2026 FRANGROW. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}