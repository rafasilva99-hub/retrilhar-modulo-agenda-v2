// @ts-nocheck
import { useState, useMemo, useEffect } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import svgPaths from "./svg-qtw4au3g97";
import imgTopBar from "./4a664b1820bfb04f20dc4f636db105ede4311f14.png";
import imgAvatar from "./87b552f8867f96fa4d2ca833ef943c5aa1ab172b.png";
import { mockActivities, allHolidays } from "../../mocks/agenda";
import type { Activity, ActivityStatus } from "../../types/agenda";
import {
  getActivityStatusBadge,
  getOccupancyDisplay,
  getContextualBadges,
  getTeamDisplay,
  getDateDisplay,
  getMultiDayRange,
} from "../../lib/agenda/activityCard";
import type { ContextualBadge as ContextualBadgeType } from "../../lib/agenda/activityCard";

// Componentes padronizados para informações dos cards
function InfoField({ icon, label, value, valueColor = "#252b37" }: { icon: React.ReactNode; label: string; value: string; valueColor?: string }) {
  return (
    <div className="content-stretch flex gap-[12px] items-start relative shrink-0">
      <div className="bg-[#fafafa] content-stretch flex items-center p-[6px] relative rounded-[8px] shrink-0">
        <div aria-hidden="true" className="absolute border border-[#f5f5f5] border-solid inset-0 pointer-events-none rounded-[8px]" />
        <div className="relative shrink-0 size-[20px]">
          {icon}
        </div>
      </div>
      <div className="content-stretch flex flex-col font-['Helvetica_Neue:Regular',sans-serif] gap-[2px] items-start justify-center leading-[normal] not-italic relative shrink-0">
        <p className="relative shrink-0 text-[#535862] text-[12px]">{label}</p>
        <p className="relative shrink-0 text-[14px]" style={{ color: valueColor }}>{value}</p>
      </div>
    </div>
  );
}

function Elements() {
  return (
    <div className="relative size-full" data-name="elements">
      <div className="absolute inset-[-5%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16.5 16.5">
          <g id="elements">
            <path d="M12.4167 4.08333L15.75 0.75" id="Vector" stroke="var(--stroke-0, #A4A7AE)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            <path d={svgPaths.pa7b4f80} id="Vector_2" stroke="var(--stroke-0, #A4A7AE)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function SearchBar() {
  return (
    <div className="bg-white content-stretch drop-shadow-[0px_1px_1px_rgba(10,13,18,0.05)] flex gap-[8px] items-center px-[17px] py-[18px] relative rounded-[16px] flex-1" data-name="Search bar">
      <div aria-hidden="true" className="absolute border border-[#f5f5f5] border-solid inset-0 pointer-events-none rounded-[16px]" />
      <p className="flex-[1_0_0] font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] min-w-px not-italic relative text-[#a4a7ae] text-[14px]">Buscar...</p>
      <div className="relative shrink-0 size-[20px]" data-name="search-01">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
          <div className="absolute flex inset-[12.5%] items-center justify-center" style={{ containerType: "size" }}>
            <div className="-rotate-180 -scale-x-100 flex-none h-[100cqh] w-[100cqw]">
              <Elements />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TopBar2() {
  return (
    <div className="relative rounded-[18641400px] shrink-0 size-[40px]" data-name="TopBar">
      <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[18641400px] size-full" src={imgTopBar} />
    </div>
  );
}

function TopBar3() {
  return (
    <div className="content-stretch flex flex-col font-['Helvetica_Neue:Regular',sans-serif] items-start leading-[normal] not-italic relative shrink-0 w-[103px]" data-name="TopBar">
      <p className="overflow-hidden relative shrink-0 text-[#000f2f] text-[14px] text-ellipsis w-full whitespace-nowrap">EliasTurismo</p>
      <p className="relative shrink-0 text-[#a4a7ae] text-[12px] w-full">Empresa Vinculada</p>
    </div>
  );
}

function TopBar1() {
  return (
    <div className="bg-white content-stretch drop-shadow-[0px_1px_1px_rgba(10,13,18,0.05)] flex gap-[10px] items-center px-[20px] py-[8px] relative rounded-[16px] shrink-0" data-name="TopBar">
      <div aria-hidden="true" className="absolute border border-[#f5f5f5] border-solid inset-0 pointer-events-none rounded-[16px]" />
      <TopBar2 />
      <TopBar3 />
    </div>
  );
}

function Elements1() {
  return (
    <div className="absolute inset-[10.42%_12.5%]" data-name="elements">
      <div className="absolute inset-[-5.92%_-6.25%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20.25 21.25">
          <g id="elements">
            <path d={svgPaths.pdeb6800} id="Vector" stroke="var(--stroke-0, #141B34)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.25" />
            <path d={svgPaths.p3bec1770} id="Vector 9718" stroke="var(--stroke-0, #141B34)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.25" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function App() {
  return <div className="absolute bg-[#fb2c36] border-[0.556px] border-solid border-white left-[22px] rounded-[18641400px] size-[8px] top-[6px]" data-name="App" />;
}

function Container() {
  return <div className="absolute h-0 left-[1333.36px] top-[51.99px] w-[23.993px]" data-name="Container" />;
}

function TopBar() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 0);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <div className={`fixed content-stretch flex gap-[24px] items-center pl-[248px] pr-[24px] py-[24px] left-0 right-0 top-0 z-10 transition-[background-color,box-shadow] duration-200 ${scrolled ? "bg-white shadow-[0px_2px_8px_0px_rgba(0,0,0,0.08)]" : "bg-[#f8fafc]"}`} data-name="TopBar">
      <SearchBar />
      <TopBar1 />
      <button className="bg-white content-stretch cursor-pointer drop-shadow-[0px_1px_1px_rgba(10,13,18,0.05)] flex items-center p-[10px] relative rounded-[16px] shrink-0" data-name="Notification">
        <div aria-hidden="true" className="absolute border border-[#f5f5f5] border-solid inset-0 pointer-events-none rounded-[16px]" />
        <div className="relative rounded-[9999px] shrink-0 size-[35.998px]" data-name="Notification component">
          <div className="-translate-x-1/2 -translate-y-1/2 absolute left-1/2 size-[24px] top-1/2" data-name="notification-01">
            <Elements1 />
          </div>
          <App />
        </div>
      </button>
      <Container />
    </div>
  );
}

function Container1() {
  return (
    <div className="relative rounded-[9999px] shrink-0 size-[16px]" style={{ backgroundImage: "linear-gradient(90deg, rgb(131, 136, 141) 0%, rgb(131, 136, 141) 100%), linear-gradient(90deg, rgb(11, 94, 215) 0%, rgb(11, 94, 215) 100%)" }} data-name="Container">
      <div aria-hidden="true" className="absolute border-2 border-solid border-white inset-0 pointer-events-none rounded-[9999px] shadow-[0px_0px_0px_0px_#dcfae6,0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_0px_rgba(0,0,0,0.1)]" />
    </div>
  );
}

function Frame21() {
  return (
    <div className="content-stretch flex font-['Helvetica_Neue:Regular',sans-serif] gap-[4px] items-center leading-[normal] not-italic relative shrink-0 whitespace-nowrap">
      <p className="relative shrink-0 text-[#252b37] text-[14px]">08:00 AM</p>
      <p className="relative shrink-0 text-[#717680] text-[12px]">(GMT+5:30)</p>
    </div>
  );
}

function Container2() {
  return <div className="absolute bg-[#e2e8f0] h-[10px] left-[15.5px] top-[22px] w-px" data-name="Container" />;
}

function Frame50() {
  return (
    <div className="content-stretch flex gap-[12px] items-center px-[8px] relative shrink-0">
      <Container1 />
      <Frame21 />
      <Container2 />
    </div>
  );
}

function Frame93() {
  return (
    <div className="content-stretch flex font-['Helvetica_Neue:Light',sans-serif] gap-[3px] items-baseline leading-[0] not-italic relative shrink-0 text-[16px] whitespace-nowrap">
      <div className="flex flex-col justify-center relative shrink-0">
        <p className="leading-[normal] text-[#1a1f2e]">Trilha Pico do Itambé</p>
      </div>
      <div className="flex flex-col justify-center relative shrink-0">
        <p className="leading-[normal] text-[13px] text-[#8b92a4] font-['Helvetica_Neue:Light',sans-serif]">(0/0)</p>
      </div>
    </div>
  );
}

function Elements2() {
  return (
    <div className="absolute inset-[8.33%]" data-name="elements">
      <div className="absolute inset-[-4.5%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14.5335 14.5333">
          <g id="elements">
            <path d={svgPaths.p2beaa1e0} id="Ellipse 1335" stroke="var(--stroke-0, #079455)" strokeLinecap="round" strokeWidth="1.2" />
            <path d={svgPaths.p2e0e2800} id="Vector 6664" stroke="var(--stroke-0, #079455)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Frame34() {
  return (
    <div className="content-stretch flex gap-[10px] items-center relative shrink-0">
      <Frame93 />
      <div className="bg-[#ecfdf3] content-stretch flex gap-[5px] items-center justify-center px-[8px] py-[3px] relative rounded-[4px] shrink-0" data-name="Status activity badge">
        <div aria-hidden="true" className="absolute border border-[#dcfae6] border-solid inset-0 pointer-events-none rounded-[4px]" />
        <div className="overflow-clip relative shrink-0 size-[16px]" data-name="checkmark-circle-03">
          <Elements2 />
        </div>
        <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#079455] text-[12px] whitespace-nowrap">Atividade Realizada</p>
      </div>
    </div>
  );
}

function Elements3() {
  return (
    <div className="absolute inset-[8.33%_12.5%]" data-name="elements">
      <div className="absolute inset-[-5.63%_-6.25%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.5 14.8333">
          <g id="elements">
            <g id="Ellipse 1633">
              <circle cx="10.75" cy="2.75" r="2" stroke="var(--stroke-0, #0B5ED7)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
              <circle cx="10.75" cy="2.75" r="2" stroke="var(--stroke-1, #535862)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            </g>
            <g id="Ellipse 1634">
              <circle cx="2.75" cy="12.0833" r="2" stroke="var(--stroke-0, #0B5ED7)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
              <circle cx="2.75" cy="12.0833" r="2" stroke="var(--stroke-1, #535862)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            </g>
            <g id="Vector 4874">
              <path d={svgPaths.pa265d80} stroke="var(--stroke-0, #0B5ED7)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
              <path d={svgPaths.pa265d80} stroke="var(--stroke-1, #535862)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            </g>
          </g>
        </svg>
      </div>
    </div>
  );
}

function Frame16() {
  return (
    <div className="content-stretch flex gap-[6px] items-center relative shrink-0">
      <div className="overflow-clip relative shrink-0 size-[16px]" data-name="route-01">
        <Elements3 />
      </div>
      <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#535862] text-[14px] whitespace-nowrap">Atividade multi-dias</p>
    </div>
  );
}

function Elements4() {
  return (
    <div className="absolute inset-[8.33%_12.5%]" data-name="elements">
      <div className="absolute inset-[-4.51%_-5%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.2 14.5333">
          <g id="elements">
            <path d={svgPaths.p26db77c0} id="Vector" stroke="var(--stroke-0, #535862)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" />
            <path d={svgPaths.p2259200} id="Vector 9260" stroke="var(--stroke-0, #535862)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" />
            <path d="M0.600001 5.93333H12.6" id="Vector 4046" stroke="var(--stroke-0, #535862)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" />
            <path d={svgPaths.pd3f8180} id="Vector_2" stroke="var(--stroke-0, #535862)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Frame17() {
  return (
    <div className="content-stretch flex gap-[6px] items-center relative shrink-0">
      <div className="relative shrink-0 size-[16px]" data-name="calendar-02">
        <Elements4 />
      </div>
      <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#535862] text-[14px] whitespace-nowrap">23/03/2026 - 28/03/2026 (5 dias)</p>
    </div>
  );
}

function Frame90() {
  return (
    <div className="content-stretch flex items-start relative shrink-0 w-full">
      <Frame16 />
      <ul className="block font-['Helvetica_Neue:Regular',sans-serif] leading-[0] not-italic relative shrink-0 text-[#717680] text-[14px] whitespace-nowrap">
        <li className="list-disc ms-[21px]">
          <span className="leading-[normal] text-[14px]">​</span>
        </li>
      </ul>
      <Frame17 />
    </div>
  );
}

function Frame63() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[6px] items-start min-w-px relative">
      <Frame34 />
      <Frame90 />
    </div>
  );
}

function Frame60({ onClick }: { onClick?: () => void }) {
  return (
    <div className="content-stretch flex gap-[16px] items-center relative shrink-0">
      <button onClick={onClick} className="bg-white content-stretch flex gap-[8px] h-[40px] items-center justify-center px-[16px] py-[10px] relative rounded-[6px] shrink-0 w-[148px] cursor-pointer hover:bg-[#f8fafc] transition-colors" data-name="button">
        <div aria-hidden="true" className="absolute border border-[#e2e8f0] border-solid inset-0 pointer-events-none rounded-[6px]" />
        <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#414651] text-[16px] whitespace-nowrap">Ver Detalhes</p>
      </button>
    </div>
  );
}

function Elements5() {
  return (
    <div className="absolute bottom-[37.5%] left-1/4 right-1/4 top-[37.5%]" data-name="elements">
      <div className="absolute inset-[-12.5%_-6.25%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.5001 7.50005">
          <g id="elements">
            <path d={svgPaths.p36ac4360} id="Vector" stroke="var(--stroke-0, #141B34)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Frame64({ onViewDetails }: { onViewDetails?: () => void }) {
  return (
    <div className="relative shrink-0 w-full">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex gap-[16px] items-center justify-center px-[20px] relative size-full">
          <Frame63 />
          <Frame60 onClick={onViewDetails} />
          <div className="overflow-clip relative shrink-0 size-[24px]" data-name="arrow-up-01-round">
            <Elements5 />
          </div>
        </div>
      </div>
    </div>
  );
}

function Elements6() {
  return (
    <div className="absolute inset-[8.33%_12.5%]" data-name="elements">
      <div className="absolute inset-[-4.5%_-5.01%_-4.5%_-5%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16.5015 18.1682">
          <g id="elements">
            <path d={svgPaths.p3f24a500} id="Vector" stroke="var(--stroke-0, #535862)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            <path d={svgPaths.p68fb000} id="Vector 9260" stroke="var(--stroke-0, #535862)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            <path d="M0.750001 7.41667H15.75" id="Vector 4046" stroke="var(--stroke-0, #535862)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            <path d={svgPaths.p78ec180} id="Vector_2" stroke="var(--stroke-0, #535862)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Frame36() {
  return (
    <div className="bg-[#fafafa] content-stretch flex items-center p-[6px] relative rounded-[8px] shrink-0">
      <div aria-hidden="true" className="absolute border border-[#f5f5f5] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="relative shrink-0 size-[20px]" data-name="calendar-favorite-01">
        <Elements6 />
      </div>
    </div>
  );
}

function Frame22() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0 text-[13px] font-['Helvetica_Neue:Light',sans-serif]">
      <p className="relative shrink-0 text-[#4a5568]">24/02/2026</p>
      <p className="relative shrink-0 text-[#9ca3af]">(Dia 3 de 5)</p>
    </div>
  );
}

function Frame8() {
  return (
    <div className="content-stretch flex flex-col font-['Helvetica_Neue:Regular',sans-serif] gap-[6px] items-start leading-[normal] not-italic relative shrink-0 whitespace-nowrap">
      <p className="relative shrink-0 text-[#62748e] text-[12px]">Data da atividade</p>
      <Frame22 />
    </div>
  );
}

function Frame69() {
  return (
    <div className="content-stretch flex gap-[12px] items-start relative shrink-0">
      <Frame36 />
      <Frame8 />
    </div>
  );
}

function Frame9() {
  return (
    <div className="bg-[#fafafa] content-stretch flex items-center p-[6px] relative rounded-[8px] shrink-0">
      <div aria-hidden="true" className="absolute border border-[#f5f5f5] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="relative shrink-0 size-[20px]" data-name="time-02">
        <div className="absolute inset-[8.33%]" data-name="Vector">
          <div className="absolute inset-[-4.5%]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18.1667 18.1667">
              <path d={svgPaths.p287d0900} id="Vector" stroke="var(--stroke-0, #535862)" strokeWidth="1.5" />
            </svg>
          </div>
        </div>
        <div className="absolute inset-[29.16%_37.44%_37.42%_43.78%]" data-name="Vector">
          <div className="absolute inset-[-11.22%_-19.97%]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 5.25574 8.184">
              <path d={svgPaths.p207949ea} id="Vector" stroke="var(--stroke-0, #535862)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

function Frame91() {
  return (
    <div className="content-stretch flex gap-[6px] items-start relative shrink-0 text-[13px] font-['Helvetica_Neue:Light',sans-serif] w-full whitespace-nowrap">
      <p className="relative shrink-0 text-[#4a5568]">08:00 - 11:00</p>
      <p className="relative shrink-0 text-[#9ca3af]">(GMT+5:30)</p>
    </div>
  );
}

function Frame33() {
  return (
    <div className="content-stretch flex flex-col font-['Helvetica_Neue:Regular',sans-serif] gap-[6px] items-start justify-center leading-[normal] not-italic relative shrink-0">
      <p className="relative shrink-0 text-[#62748e] text-[12px]">Hora da atividade</p>
      <Frame91 />
    </div>
  );
}

function Frame66() {
  return (
    <div className="content-stretch flex gap-[12px] items-start relative shrink-0">
      <Frame9 />
      <Frame33 />
    </div>
  );
}

function Elements7() {
  return (
    <div className="absolute inset-[18.75%_10.42%]" data-name="elements">
      <div className="absolute inset-[-6%_-4.74%_-5.99%_-4.74%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 17.3333 14">
          <g id="elements">
            <path d={svgPaths.p105a55a0} id="Ellipse 1" stroke="var(--stroke-0, #535862)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            <circle cx="8.66667" cy="6.16667" id="Ellipse 2" r="2.08333" stroke="var(--stroke-0, #535862)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            <path d={svgPaths.p1c8c1d80} id="Ellipse 5" stroke="var(--stroke-0, #535862)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            <circle cx="13.25" cy="2.41667" id="Ellipse 6" r="1.66667" stroke="var(--stroke-0, #535862)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            <path d={svgPaths.p108f0800} id="Ellipse 7" stroke="var(--stroke-0, #535862)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            <circle cx="4.08333" cy="2.41667" id="Ellipse 8" r="1.66667" stroke="var(--stroke-0, #535862)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Frame10() {
  return (
    <div className="bg-[#fafafa] content-stretch flex items-center p-[6px] relative rounded-[8px] shrink-0">
      <div aria-hidden="true" className="absolute border border-[#f5f5f5] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="relative shrink-0 size-[20px]" data-name="user-group-02">
        <Elements7 />
      </div>
    </div>
  );
}

function Frame35() {
  return (
    <div className="content-stretch flex flex-col font-['Helvetica_Neue:Regular',sans-serif] gap-[6px] items-start justify-center leading-[normal] not-italic relative shrink-0">
      <p className="relative shrink-0 text-[#62748e] text-[12px]">Participantes</p>
      <p className="relative shrink-0 text-[#252b37] text-[14px]">Nenhum participante</p>
    </div>
  );
}

function Frame67() {
  return (
    <div className="content-stretch flex gap-[12px] items-start relative shrink-0">
      <Frame10 />
      <Frame35 />
    </div>
  );
}

function Elements8() {
  return (
    <div className="absolute inset-[18.75%_10.42%]" data-name="elements">
      <div className="absolute inset-[-6%_-4.74%_-5.99%_-4.74%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 17.3333 14">
          <g id="elements">
            <path d={svgPaths.p105a55a0} id="Ellipse 1" stroke="var(--stroke-0, #535862)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            <circle cx="8.66667" cy="6.16667" id="Ellipse 2" r="2.08333" stroke="var(--stroke-0, #535862)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            <path d={svgPaths.p1c8c1d80} id="Ellipse 5" stroke="var(--stroke-0, #535862)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            <circle cx="13.25" cy="2.41667" id="Ellipse 6" r="1.66667" stroke="var(--stroke-0, #535862)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            <path d={svgPaths.p108f0800} id="Ellipse 7" stroke="var(--stroke-0, #535862)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            <circle cx="4.08333" cy="2.41667" id="Ellipse 8" r="1.66667" stroke="var(--stroke-0, #535862)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Frame11() {
  return (
    <div className="bg-[#fafafa] content-stretch flex items-center p-[6px] relative rounded-[8px] shrink-0">
      <div aria-hidden="true" className="absolute border border-[#f5f5f5] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="relative shrink-0 size-[20px]" data-name="user-group-02">
        <Elements8 />
      </div>
    </div>
  );
}

function Frame32() {
  return (
    <div className="content-stretch flex flex-col font-['Helvetica_Neue:Regular',sans-serif] gap-[6px] items-start justify-center leading-[normal] not-italic relative shrink-0">
      <p className="relative shrink-0 text-[#62748e] text-[12px]">Equipe atribuída</p>
      <p className="relative shrink-0 text-[#dc6803] text-[14px]">Sem equipe atribuída</p>
    </div>
  );
}

function Frame68() {
  return (
    <div className="content-stretch flex gap-[12px] items-start relative shrink-0">
      <Frame11 />
      <Frame32 />
    </div>
  );
}

function Frame65() {
  return (
    <div className="bg-white relative rounded-[8px] shrink-0 w-full">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[32px] items-center px-[20px] relative size-full">
          <Frame69 />
          <div className="flex flex-row items-center self-stretch">
            <div className="flex h-full items-center justify-center relative shrink-0 w-0" style={{ containerType: "size", "--transform-inner-width": "1185", "--transform-inner-height": "18" } as React.CSSProperties}>
              <div className="flex-none rotate-90 w-[100cqh]">
                <div className="h-0 relative w-full">
                  <div className="absolute inset-[-1px_0_0_0]">
                    <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 37 1">
                      <line id="Line 40" stroke="var(--stroke-0, #F5F5F5)" x2="37" y1="0.5" y2="0.5" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Frame66 />
          <div className="flex flex-row items-center self-stretch">
            <div className="flex h-full items-center justify-center relative shrink-0 w-0" style={{ containerType: "size", "--transform-inner-width": "1185", "--transform-inner-height": "18" } as React.CSSProperties}>
              <div className="flex-none rotate-90 w-[100cqh]">
                <div className="h-0 relative w-full">
                  <div className="absolute inset-[-1px_0_0_0]">
                    <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 37 1">
                      <line id="Line 40" stroke="var(--stroke-0, #F5F5F5)" x2="37" y1="0.5" y2="0.5" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Frame67 />
          <div className="flex flex-row items-center self-stretch">
            <div className="flex h-full items-center justify-center relative shrink-0 w-0" style={{ containerType: "size", "--transform-inner-width": "1185", "--transform-inner-height": "18" } as React.CSSProperties}>
              <div className="flex-none rotate-90 w-[100cqh]">
                <div className="h-0 relative w-full">
                  <div className="absolute inset-[-1px_0_0_0]">
                    <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 37 1">
                      <line id="Line 40" stroke="var(--stroke-0, #F5F5F5)" x2="37" y1="0.5" y2="0.5" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Frame68 />
        </div>
      </div>
    </div>
  );
}

function Text() {
  return (
    <div className="relative rounded-[4px] shrink-0" style={{ backgroundImage: "linear-gradient(90deg, rgb(255, 255, 255) 0%, rgb(255, 255, 255) 100%), linear-gradient(90deg, rgb(254, 243, 242) 0%, rgb(254, 243, 242) 100%)" }} data-name="Text">
      <div className="content-stretch flex gap-[6px] items-center justify-center overflow-clip pb-[3.5px] pt-[2.5px] px-[6.5px] relative rounded-[inherit] size-full">
        <div className="relative shrink-0 size-[16px]" data-name="security-warning">
          <div className="bg-clip-padding border-0 border-[transparent] border-solid overflow-clip relative rounded-[inherit] size-full">
            <div className="absolute inset-[8.33%_12.5%]" data-name="Vector">
              <div className="absolute inset-[-4.5%_-5%]">
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.2002 14.5333">
                  <path d={svgPaths.p38f00f80} id="Vector" stroke="var(--stroke-0, #F04438)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" />
                </svg>
              </div>
            </div>
            <div className="absolute inset-[60.42%_48.96%_37.5%_48.96%]" data-name="Vector">
              <div className="absolute inset-[-225%]">
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1.83333 1.83333">
                  <path d={svgPaths.p15064c80} id="Vector" stroke="var(--stroke-0, #F04438)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                </svg>
              </div>
            </div>
          </div>
        </div>
        <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#d92d20] text-[12px] whitespace-nowrap">Seguro obrigatório</p>
      </div>
      <div aria-hidden="true" className="absolute border-[#e9eaeb] border-[0.5px] border-solid inset-0 pointer-events-none rounded-[4px]" />
    </div>
  );
}

function Elements9() {
  return (
    <div className="absolute inset-[8.33%]" data-name="elements">
      <div className="absolute inset-[-4.5%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14.5333 14.5333">
          <g id="elements">
            <circle cx="7.26667" cy="7.26667" id="Ellipse 1112" r="6.66667" stroke="var(--stroke-0, #DC6803)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" />
            <path d="M7.26667 4.6V7.6" id="Vector" stroke="var(--stroke-0, #DC6803)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" />
            <path d="M7.26667 9.92552V9.93219" id="Vector_2" stroke="var(--stroke-0, #DC6803)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Text1() {
  return (
    <div className="relative rounded-[4px] shrink-0" style={{ backgroundImage: "linear-gradient(90deg, rgb(255, 255, 255) 0%, rgb(255, 255, 255) 100%), linear-gradient(90deg, rgb(255, 250, 235) 0%, rgb(255, 250, 235) 100%)" }} data-name="Text">
      <div className="content-stretch flex gap-[6px] items-center justify-center overflow-clip pb-[3.5px] pt-[2.5px] px-[6.5px] relative rounded-[inherit] size-full">
        <div className="relative shrink-0 size-[16px]" data-name="alert-circle">
          <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
            <Elements9 />
          </div>
        </div>
        <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#dc6803] text-[12px] whitespace-nowrap">Equipe responsável deve ser atribuída até 20/03/2026</p>
      </div>
      <div aria-hidden="true" className="absolute border-[#e9eaeb] border-[0.5px] border-solid inset-0 pointer-events-none rounded-[4px]" />
    </div>
  );
}

function Frame62() {
  return (
    <div className="bg-[#fafafa] relative shrink-0 w-full">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[12px] items-center px-[20px] py-[12px] relative size-full">
          <Text />
          <Text1 />
        </div>
      </div>
    </div>
  );
}

function Frame51({ onViewDetails }: { onViewDetails?: () => void }) {
  return (
    <div className="bg-white relative rounded-[12px] shrink-0 w-full">
      <div className="content-stretch flex flex-col gap-[16px] items-center justify-center overflow-clip pt-[16px] relative rounded-[inherit] size-full">
        <Frame64 onViewDetails={onViewDetails} />
        <div className="flex items-center justify-center relative shrink-0">
          <div className="flex-none rotate-180">
            <div className="h-0 relative w-full">
              <div className="absolute inset-[-1px_0_0_0]">
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1128 1">
                  <line id="Line 40" stroke="var(--stroke-0, #F5F5F5)" x2="1128" y1="0.5" y2="0.5" />
                </svg>
              </div>
            </div>
          </div>
        </div>
        <Frame65 />
        <Frame62 />
      </div>
      <div aria-hidden="true" className="absolute border border-[#e2e8f0] border-solid inset-0 pointer-events-none rounded-[12px]" />
    </div>
  );
}

function Frame37({ onViewDetails }: { onViewDetails?: () => void }) {
  return (
    <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full">
      <Frame50 />
      <Frame51 onViewDetails={onViewDetails} />
    </div>
  );
}

function Container3() {
  return <div className="absolute bg-[#e2e8f0] h-[14px] left-[16px] top-[246px] w-px" data-name="Container" />;
}

function Container4() {
  return <div className="absolute bg-[#e2e8f0] h-[14px] left-[15px] top-[508px] w-px" data-name="Container" />;
}

function Container5() {
  return (
    <div className="relative rounded-[9999px] shrink-0 size-[16px]" style={{ backgroundImage: "linear-gradient(90deg, rgb(253, 176, 34) 0%, rgb(253, 176, 34) 100%), linear-gradient(90deg, rgb(23, 178, 106) 0%, rgb(23, 178, 106) 100%), linear-gradient(90deg, rgb(11, 94, 215) 0%, rgb(11, 94, 215) 100%)" }} data-name="Container">
      <div aria-hidden="true" className="absolute border-2 border-solid border-white inset-0 pointer-events-none rounded-[9999px] shadow-[0px_0px_0px_0px_#dcfae6,0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_0px_rgba(0,0,0,0.1)]" />
    </div>
  );
}

function Frame23() {
  return (
    <div className="content-stretch flex font-['Helvetica_Neue:Regular',sans-serif] gap-[4px] items-center leading-[normal] not-italic relative shrink-0 whitespace-nowrap">
      <p className="relative shrink-0 text-[#252b37] text-[14px]">10:15 AM</p>
      <p className="relative shrink-0 text-[#717680] text-[12px]">(GMT+5:30)</p>
    </div>
  );
}

function Container6() {
  return <div className="absolute bg-[#e2e8f0] h-[10px] left-[16px] top-[22px] w-px" data-name="Container" />;
}

function Frame52() {
  return (
    <div className="content-stretch flex gap-[12px] items-center px-[8px] relative shrink-0">
      <Container5 />
      <Frame23 />
      <Container6 />
    </div>
  );
}

function Frame94() {
  return (
    <div className="content-stretch flex font-['Helvetica_Neue:Light',sans-serif] gap-[3px] items-baseline not-italic relative shrink-0 text-[16px] whitespace-nowrap">
      <p className="leading-[normal] relative shrink-0 text-[#1a1f2e]">Trilha Pico do Itacolomi</p>
      <div className="flex flex-col justify-center leading-[0] relative shrink-0">
        <p className="leading-[normal] text-[13px] text-[#8b92a4] font-['Helvetica_Neue:Light',sans-serif]">(220/200)</p>
      </div>
    </div>
  );
}

function Elements10() {
  return (
    <div className="absolute inset-[8.33%]" data-name="elements">
      <div className="absolute inset-[-4.5%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14.5334 14.5333">
          <g id="elements">
            <path d={svgPaths.pd9dcd00} id="Vector" stroke="var(--stroke-0, #DC6803)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" />
            <path d={svgPaths.p1c207b80} id="Vector_2" stroke="var(--stroke-0, #DC6803)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" />
            <path d={svgPaths.p124a8900} id="Vector_3" stroke="var(--stroke-0, #DC6803)" strokeWidth="1.2" />
            <path d="M7.26417 6.93333H7.2684" id="Vector_4" stroke="var(--stroke-0, #DC6803)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Frame95() {
  return (
    <div className="content-stretch flex gap-[10px] items-center relative shrink-0">
      <Frame94 />
      <div className="bg-[#fffaeb] content-stretch flex gap-[5px] items-center justify-center px-[8px] py-[3px] relative rounded-[4px] shrink-0" data-name="Status activity badge">
        <div aria-hidden="true" className="absolute border border-[#fef0c7] border-solid inset-0 pointer-events-none rounded-[4px]" />
        <div className="overflow-clip relative shrink-0 size-[16px]" data-name="share-location-01">
          <Elements10 />
        </div>
        <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#dc6803] text-[12px] whitespace-nowrap">Atividade em Andamento</p>
      </div>
    </div>
  );
}

function Elements11() {
  return (
    <div className="absolute bottom-[12.5%] left-1/4 right-1/4 top-[12.5%]" data-name="elements">
      <div className="absolute inset-[-6.25%_-9.39%_-6.26%_-9.39%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 9.5017 13.5">
          <g id="elements">
            <circle cx="4.75085" cy="3.41667" id="Ellipse 1540" r="2.66667" stroke="var(--stroke-0, #535862)" strokeWidth="1.5" />
            <path d={svgPaths.p1e727680} id="Vector 4237" stroke="var(--stroke-0, #535862)" strokeLinecap="round" strokeWidth="1.5" />
            <path d={svgPaths.p1b0c2a00} id="Vector 4653" stroke="var(--stroke-0, #535862)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Frame96() {
  return (
    <div className="content-stretch flex gap-[6px] items-center relative shrink-0">
      <div className="overflow-clip relative shrink-0 size-[16px]" data-name="pin-location-01">
        <Elements11 />
      </div>
      <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#535862] text-[14px] whitespace-nowrap">Atividade comum</p>
    </div>
  );
}

function Elements12() {
  return (
    <div className="absolute inset-[8.33%]" data-name="elements">
      <div className="absolute inset-[-5.63%_-5.62%_-5.62%_-5.63%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14.8333 14.8333">
          <g id="elements">
            <circle cx="7.41667" cy="7.41667" id="Ellipse 1112" r="6.66667" stroke="var(--stroke-0, #535862)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            <path d="M7.41667 4.75V7.75" id="Vector" stroke="var(--stroke-0, #535862)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            <path d="M7.41667 10.0755V10.0822" id="Vector_2" stroke="var(--stroke-0, #535862)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Frame97() {
  return (
    <div className="content-stretch flex gap-[6px] items-center relative shrink-0">
      <div className="relative shrink-0 size-[16px]" data-name="alert-circle">
        <Elements12 />
      </div>
      <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#535862] text-[14px] whitespace-nowrap">Vagas excedidas</p>
    </div>
  );
}

function Frame102() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <Frame96 />
      <ul className="block font-['Helvetica_Neue:Regular',sans-serif] leading-[0] not-italic relative shrink-0 text-[#717680] text-[14px] whitespace-nowrap">
        <li className="list-disc ms-[21px]">
          <span className="leading-[normal] text-[14px]">​</span>
        </li>
      </ul>
      <Frame97 />
    </div>
  );
}

function Frame71() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[6px] items-start min-w-px relative">
      <Frame95 />
      <Frame102 />
    </div>
  );
}

function Frame72({ onClick }: { onClick?: () => void }) {
  return (
    <div className="content-stretch flex gap-[16px] items-center relative shrink-0">
      <button onClick={onClick} className="bg-white content-stretch flex gap-[8px] h-[40px] items-center justify-center px-[16px] py-[10px] relative rounded-[6px] shrink-0 w-[148px] cursor-pointer hover:bg-[#f8fafc] transition-colors" data-name="button">
        <div aria-hidden="true" className="absolute border border-[#e2e8f0] border-solid inset-0 pointer-events-none rounded-[6px]" />
        <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#414651] text-[16px] whitespace-nowrap">Ver Detalhes</p>
      </button>
      <div className="bg-[#edf0ff] content-stretch flex gap-[6px] items-center justify-center px-[20px] py-[10px] relative rounded-[6px] shrink-0" data-name="button">
        <p className="font-['Helvetica_Neue:Medium',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#1b71fd] text-[16px] whitespace-nowrap">Ir para Check-In</p>
      </div>
    </div>
  );
}

function Elements13() {
  return (
    <div className="absolute bottom-[37.5%] left-1/4 right-1/4 top-[37.5%]" data-name="elements">
      <div className="absolute inset-[-12.5%_-6.25%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.5001 7.50005">
          <g id="elements">
            <path d={svgPaths.p36ac4360} id="Vector" stroke="var(--stroke-0, #141B34)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Frame70({ onViewDetails }: { onViewDetails?: () => void }) {
  return (
    <div className="relative shrink-0 w-full">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex gap-[16px] items-center justify-center px-[20px] relative size-full">
          <Frame71 />
          <Frame72 onClick={onViewDetails} />
          <div className="overflow-clip relative shrink-0 size-[24px]" data-name="arrow-up-01-round">
            <Elements13 />
          </div>
        </div>
      </div>
    </div>
  );
}

function Elements14() {
  return (
    <div className="absolute inset-[8.33%_12.5%]" data-name="elements">
      <div className="absolute inset-[-4.5%_-5.01%_-4.5%_-5%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16.5015 18.1682">
          <g id="elements">
            <path d={svgPaths.p3f24a500} id="Vector" stroke="var(--stroke-0, #535862)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            <path d={svgPaths.p68fb000} id="Vector 9260" stroke="var(--stroke-0, #535862)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            <path d="M0.750001 7.41667H15.75" id="Vector 4046" stroke="var(--stroke-0, #535862)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            <path d={svgPaths.p78ec180} id="Vector_2" stroke="var(--stroke-0, #535862)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Frame38() {
  return (
    <div className="bg-[#fafafa] content-stretch flex items-center p-[6px] relative rounded-[8px] shrink-0">
      <div aria-hidden="true" className="absolute border border-[#f5f5f5] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="relative shrink-0 size-[20px]" data-name="calendar-favorite-01">
        <Elements14 />
      </div>
    </div>
  );
}

function Frame24() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0 text-[13px] font-['Helvetica_Neue:Light',sans-serif]">
      <p className="relative shrink-0 text-[#4a5568]">26/02/2026</p>
      <p className="relative shrink-0 text-[transparent]">(Dia 3 de 5)</p>
    </div>
  );
}

function Frame12() {
  return (
    <div className="content-stretch flex flex-col font-['Helvetica_Neue:Regular',sans-serif] gap-[6px] items-start leading-[normal] not-italic relative shrink-0 whitespace-nowrap">
      <p className="relative shrink-0 text-[#62748e] text-[12px]">Data da atividade</p>
      <Frame24 />
    </div>
  );
}

function Frame74() {
  return (
    <div className="content-stretch flex gap-[12px] items-start relative shrink-0">
      <Frame38 />
      <Frame12 />
    </div>
  );
}

function Frame13() {
  return (
    <div className="bg-[#fafafa] content-stretch flex items-center p-[6px] relative rounded-[8px] shrink-0">
      <div aria-hidden="true" className="absolute border border-[#f5f5f5] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="relative shrink-0 size-[20px]" data-name="time-02">
        <div className="absolute inset-[8.33%]" data-name="Vector">
          <div className="absolute inset-[-4.5%]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18.1667 18.1667">
              <path d={svgPaths.p287d0900} id="Vector" stroke="var(--stroke-0, #535862)" strokeWidth="1.5" />
            </svg>
          </div>
        </div>
        <div className="absolute inset-[29.16%_37.44%_37.42%_43.78%]" data-name="Vector">
          <div className="absolute inset-[-11.22%_-19.97%]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 5.25574 8.184">
              <path d={svgPaths.p207949ea} id="Vector" stroke="var(--stroke-0, #535862)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

function Frame92() {
  return (
    <div className="content-stretch flex gap-[6px] items-start relative shrink-0 text-[13px] font-['Helvetica_Neue:Light',sans-serif] w-full whitespace-nowrap">
      <p className="relative shrink-0 text-[#4a5568]">08:00- 11:00</p>
      <p className="relative shrink-0 text-[#9ca3af]">(GMT+5:30)</p>
    </div>
  );
}

function Frame41() {
  return (
    <div className="content-stretch flex flex-col font-['Helvetica_Neue:Regular',sans-serif] gap-[6px] items-start justify-center leading-[normal] not-italic relative shrink-0">
      <p className="relative shrink-0 text-[#62748e] text-[12px]">Hora da atividade</p>
      <Frame92 />
    </div>
  );
}

function Frame75() {
  return (
    <div className="content-stretch flex gap-[12px] items-start relative shrink-0">
      <Frame13 />
      <Frame41 />
    </div>
  );
}

function Elements15() {
  return (
    <div className="absolute inset-[18.75%_10.42%]" data-name="elements">
      <div className="absolute inset-[-6%_-4.74%_-5.99%_-4.74%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 17.3333 14">
          <g id="elements">
            <path d={svgPaths.p105a55a0} id="Ellipse 1" stroke="var(--stroke-0, #535862)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            <circle cx="8.66667" cy="6.16667" id="Ellipse 2" r="2.08333" stroke="var(--stroke-0, #535862)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            <path d={svgPaths.p1c8c1d80} id="Ellipse 5" stroke="var(--stroke-0, #535862)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            <circle cx="13.25" cy="2.41667" id="Ellipse 6" r="1.66667" stroke="var(--stroke-0, #535862)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            <path d={svgPaths.p108f0800} id="Ellipse 7" stroke="var(--stroke-0, #535862)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            <circle cx="4.08333" cy="2.41667" id="Ellipse 8" r="1.66667" stroke="var(--stroke-0, #535862)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Frame14() {
  return (
    <div className="bg-[#fafafa] content-stretch flex items-center p-[6px] relative rounded-[8px] shrink-0">
      <div aria-hidden="true" className="absolute border border-[#f5f5f5] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="relative shrink-0 size-[20px]" data-name="user-group-02">
        <Elements15 />
      </div>
    </div>
  );
}

function Frame42() {
  return (
    <div className="content-stretch flex flex-col font-['Helvetica_Neue:Regular',sans-serif] gap-[6px] items-start justify-center leading-[normal] not-italic relative shrink-0">
      <p className="relative shrink-0 text-[#62748e] text-[12px]">Participantes</p>
      <p className="relative shrink-0 text-[#252b37] text-[14px]">12 participantes</p>
    </div>
  );
}

function Frame76() {
  return (
    <div className="content-stretch flex gap-[12px] items-start relative shrink-0">
      <Frame14 />
      <Frame42 />
    </div>
  );
}

function Elements16() {
  return (
    <div className="absolute inset-[18.75%_10.42%]" data-name="elements">
      <div className="absolute inset-[-6%_-4.74%_-5.99%_-4.74%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 17.3333 14">
          <g id="elements">
            <path d={svgPaths.p105a55a0} id="Ellipse 1" stroke="var(--stroke-0, #535862)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            <circle cx="8.66667" cy="6.16667" id="Ellipse 2" r="2.08333" stroke="var(--stroke-0, #535862)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            <path d={svgPaths.p1c8c1d80} id="Ellipse 5" stroke="var(--stroke-0, #535862)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            <circle cx="13.25" cy="2.41667" id="Ellipse 6" r="1.66667" stroke="var(--stroke-0, #535862)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            <path d={svgPaths.p108f0800} id="Ellipse 7" stroke="var(--stroke-0, #535862)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            <circle cx="4.08333" cy="2.41667" id="Ellipse 8" r="1.66667" stroke="var(--stroke-0, #535862)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Frame15() {
  return (
    <div className="bg-[#fafafa] content-stretch flex items-center p-[6px] relative rounded-[8px] shrink-0">
      <div aria-hidden="true" className="absolute border border-[#f5f5f5] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="relative shrink-0 size-[20px]" data-name="user-group-02">
        <Elements16 />
      </div>
    </div>
  );
}

function Frame43() {
  return (
    <div className="content-stretch flex flex-col font-['Helvetica_Neue:Regular',sans-serif] gap-[6px] items-start justify-center leading-[normal] not-italic relative shrink-0">
      <p className="relative shrink-0 text-[#62748e] text-[12px]">Equipe atribuída</p>
      <p className="relative shrink-0 text-[#252b37] text-[14px]">2 guia(s) atribuído(s)</p>
    </div>
  );
}

function Frame77() {
  return (
    <div className="content-stretch flex gap-[12px] items-start relative shrink-0">
      <Frame15 />
      <Frame43 />
    </div>
  );
}

function Frame73() {
  return (
    <div className="bg-white relative rounded-[8px] shrink-0 w-full">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[32px] items-center px-[20px] relative size-full">
          <Frame74 />
          <div className="flex flex-row items-center self-stretch">
            <div className="flex h-full items-center justify-center relative shrink-0 w-0" style={{ containerType: "size", "--transform-inner-width": "1185", "--transform-inner-height": "18" } as React.CSSProperties}>
              <div className="flex-none rotate-90 w-[100cqh]">
                <div className="h-0 relative w-full">
                  <div className="absolute inset-[-1px_0_0_0]">
                    <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 37 1">
                      <line id="Line 40" stroke="var(--stroke-0, #F5F5F5)" x2="37" y1="0.5" y2="0.5" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Frame75 />
          <div className="flex flex-row items-center self-stretch">
            <div className="flex h-full items-center justify-center relative shrink-0 w-0" style={{ containerType: "size", "--transform-inner-width": "1185", "--transform-inner-height": "18" } as React.CSSProperties}>
              <div className="flex-none rotate-90 w-[100cqh]">
                <div className="h-0 relative w-full">
                  <div className="absolute inset-[-1px_0_0_0]">
                    <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 37 1">
                      <line id="Line 40" stroke="var(--stroke-0, #F5F5F5)" x2="37" y1="0.5" y2="0.5" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Frame76 />
          <div className="flex flex-row items-center self-stretch">
            <div className="flex h-full items-center justify-center relative shrink-0 w-0" style={{ containerType: "size", "--transform-inner-width": "1185", "--transform-inner-height": "18" } as React.CSSProperties}>
              <div className="flex-none rotate-90 w-[100cqh]">
                <div className="h-0 relative w-full">
                  <div className="absolute inset-[-1px_0_0_0]">
                    <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 37 1">
                      <line id="Line 40" stroke="var(--stroke-0, #F5F5F5)" x2="37" y1="0.5" y2="0.5" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Frame77 />
        </div>
      </div>
    </div>
  );
}

function Elements17() {
  return (
    <div className="absolute inset-[8.33%_12.5%]" data-name="elements">
      <div className="absolute inset-[-4.5%_-5%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.2002 14.5333">
          <g id="elements">
            <path d={svgPaths.p2e9d7600} id="Vector" stroke="var(--stroke-0, #414651)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Text2() {
  return (
    <div className="bg-white relative rounded-[4px] shrink-0" data-name="Text">
      <div className="content-stretch flex gap-[6px] items-center justify-center overflow-clip pb-[3.5px] pt-[2.5px] px-[6.5px] relative rounded-[inherit] size-full">
        <div className="relative shrink-0 size-[16px]" data-name="shield-01">
          <div className="bg-clip-padding border-0 border-[transparent] border-solid overflow-clip relative rounded-[inherit] size-full">
            <Elements17 />
          </div>
        </div>
        <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#414651] text-[12px] whitespace-nowrap">Seguro opcional</p>
      </div>
      <div aria-hidden="true" className="absolute border-[#e9eaeb] border-[0.5px] border-solid inset-0 pointer-events-none rounded-[4px]" />
    </div>
  );
}

function Elements18() {
  return (
    <div className="relative size-full" data-name="elements">
      <div className="absolute inset-[-4.5%_-5.01%_-4.5%_-5%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.2008 14.5334">
          <g id="elements">
            <path d={svgPaths.p1d09fa00} id="Vector" stroke="var(--stroke-0, #6941C6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" />
            <path d={svgPaths.p224e400} id="Vector_2" stroke="var(--stroke-0, #6941C6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" />
            <path d={svgPaths.p20c88b60} id="Vector_3" stroke="var(--stroke-0, #6941C6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" />
            <path d={svgPaths.p840d2f0} id="Ellipse 1696" stroke="var(--stroke-0, #6941C6)" strokeWidth="1.2" />
            <path d={svgPaths.p31a43800} id="Vector_4" stroke="var(--stroke-0, #6941C6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Text3() {
  return (
    <div className="relative rounded-[4px] shrink-0" style={{ backgroundImage: "linear-gradient(90deg, rgb(255, 255, 255) 0%, rgb(255, 255, 255) 100%), linear-gradient(90deg, rgb(249, 245, 255) 0%, rgb(249, 245, 255) 100%)" }} data-name="Text">
      <div className="content-stretch flex gap-[6px] items-center justify-center overflow-clip pb-[3.5px] pt-[2.5px] px-[6.5px] relative rounded-[inherit] size-full">
        <div className="relative shrink-0 size-[16px]" data-name="stethoscope">
          <div className="bg-clip-padding border-0 border-[transparent] border-solid overflow-clip relative rounded-[inherit] size-full">
            <div className="absolute flex inset-[8.33%_12.5%] items-center justify-center" style={{ containerType: "size" }}>
              <div className="-scale-x-100 flex-none h-[100cqh] w-[100cqw]">
                <Elements18 />
              </div>
            </div>
          </div>
        </div>
        <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#6941c6] text-[12px] whitespace-nowrap">2 participantes precisam de atenção médica</p>
      </div>
      <div aria-hidden="true" className="absolute border-[#e9eaeb] border-[0.5px] border-solid inset-0 pointer-events-none rounded-[4px]" />
    </div>
  );
}

function Frame78() {
  return (
    <div className="bg-[#fafafa] relative shrink-0 w-full">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[12px] items-center px-[20px] py-[12px] relative size-full">
          <Text2 />
          <Text3 />
        </div>
      </div>
    </div>
  );
}

function Frame28({ onViewDetails }: { onViewDetails?: () => void }) {
  return (
    <div className="bg-white relative rounded-[12px] shrink-0 w-full">
      <div className="content-stretch flex flex-col gap-[16px] items-center justify-center overflow-clip pt-[16px] relative rounded-[inherit] size-full">
        <Frame70 onViewDetails={onViewDetails} />
        <div className="flex items-center justify-center relative shrink-0">
          <div className="flex-none rotate-180">
            <div className="h-0 relative w-full">
              <div className="absolute inset-[-1px_0_0_0]">
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1128 1">
                  <line id="Line 40" stroke="var(--stroke-0, #F5F5F5)" x2="1128" y1="0.5" y2="0.5" />
                </svg>
              </div>
            </div>
          </div>
        </div>
        <Frame73 />
        <Frame78 />
      </div>
      <div aria-hidden="true" className="absolute border border-[#e2e8f0] border-solid inset-0 pointer-events-none rounded-[12px]" />
    </div>
  );
}

function Frame39({ onViewDetails }: { onViewDetails?: () => void }) {
  return (
    <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full">
      <Frame52 />
      <Frame28 onViewDetails={onViewDetails} />
    </div>
  );
}

function Container7() {
  return (
    <div className="relative rounded-[9999px] shrink-0 size-[16px]" style={{ backgroundImage: "linear-gradient(90deg, rgb(23, 178, 106) 0%, rgb(23, 178, 106) 100%), linear-gradient(90deg, rgb(11, 94, 215) 0%, rgb(11, 94, 215) 100%)" }} data-name="Container">
      <div aria-hidden="true" className="absolute border-2 border-solid border-white inset-0 pointer-events-none rounded-[9999px] shadow-[0px_0px_0px_0px_#dcfae6,0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_0px_rgba(0,0,0,0.1)]" />
    </div>
  );
}

function Frame25() {
  return (
    <div className="content-stretch flex font-['Helvetica_Neue:Regular',sans-serif] gap-[4px] items-center leading-[normal] not-italic relative shrink-0 whitespace-nowrap">
      <p className="relative shrink-0 text-[#252b37] text-[14px]">13:30 PM</p>
      <p className="relative shrink-0 text-[#717680] text-[12px]">(GMT+5:30)</p>
    </div>
  );
}

function Container8() {
  return <div className="absolute bg-[#e2e8f0] h-[10px] left-[15.5px] top-[22px] w-px" data-name="Container" />;
}

function Frame53() {
  return (
    <div className="content-stretch flex gap-[12px] items-center px-[8px] relative shrink-0">
      <Container7 />
      <Frame25 />
      <Container8 />
    </div>
  );
}

function Frame45() {
  return (
    <div className="content-stretch flex font-['Helvetica_Neue:Regular',sans-serif] gap-[5px] items-center not-italic relative shrink-0 text-[#252b37] text-[18px] whitespace-nowrap">
      <p className="leading-[normal] relative shrink-0">Rapel Cachoeira Alta</p>
      <div className="flex flex-col justify-center leading-[0] relative shrink-0">
        <p className="leading-[normal]">(8/8)</p>
      </div>
    </div>
  );
}

function Elements19() {
  return (
    <div className="absolute inset-[8.33%_12.5%]" data-name="elements">
      <div className="absolute inset-[-4.5%_-5%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.2 14.5333">
          <g id="elements">
            <path d="M8.6 0.6H5.26667" id="Vector" stroke="var(--stroke-0, #535862)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" />
            <path d={svgPaths.p13041200} id="Vector_2" stroke="var(--stroke-0, #535862)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" />
            <path d="M3.93333 11.9333H0.6" id="Vector_3" stroke="var(--stroke-0, #535862)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" />
            <path d="M2.6 9.93333H0.6" id="Vector_4" stroke="var(--stroke-0, #535862)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" />
            <path d={svgPaths.p2714f000} id="Vector 9702" stroke="var(--stroke-0, #535862)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Frame98() {
  return (
    <div className="content-stretch flex gap-[10px] items-center relative shrink-0">
      <Frame45 />
      <div className="bg-[#fafafa] content-stretch flex gap-[5px] items-center justify-center px-[8px] py-[3px] relative rounded-[4px] shrink-0" data-name="Status activity badge">
        <div aria-hidden="true" className="absolute border border-[#f5f5f5] border-solid inset-0 pointer-events-none rounded-[4px]" />
        <div className="relative shrink-0 size-[16px]" data-name="timer-02">
          <Elements19 />
        </div>
        <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#535862] text-[12px] whitespace-nowrap">Atividade Não Iniciada</p>
      </div>
    </div>
  );
}

function Elements20() {
  return (
    <div className="absolute bottom-[12.5%] left-1/4 right-1/4 top-[12.5%]" data-name="elements">
      <div className="absolute inset-[-6.25%_-9.39%_-6.26%_-9.39%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 9.5017 13.5">
          <g id="elements">
            <circle cx="4.75085" cy="3.41667" id="Ellipse 1540" r="2.66667" stroke="var(--stroke-0, #535862)" strokeWidth="1.5" />
            <path d={svgPaths.p1e727680} id="Vector 4237" stroke="var(--stroke-0, #535862)" strokeLinecap="round" strokeWidth="1.5" />
            <path d={svgPaths.p1b0c2a00} id="Vector 4653" stroke="var(--stroke-0, #535862)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Frame99() {
  return (
    <div className="content-stretch flex gap-[6px] items-center relative shrink-0">
      <div className="overflow-clip relative shrink-0 size-[16px]" data-name="pin-location-01">
        <Elements20 />
      </div>
      <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#535862] text-[14px] whitespace-nowrap">Atividade comum</p>
    </div>
  );
}

function Frame80() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[6px] items-start min-w-px relative">
      <Frame98 />
      <Frame99 />
    </div>
  );
}

function Frame81({ onClick }: { onClick?: () => void }) {
  return (
    <div className="content-stretch flex gap-[16px] items-center relative shrink-0">
      <button onClick={onClick} className="bg-white content-stretch flex gap-[8px] h-[40px] items-center justify-center px-[16px] py-[10px] relative rounded-[6px] shrink-0 w-[148px] cursor-pointer hover:bg-[#f8fafc] transition-colors" data-name="button">
        <div aria-hidden="true" className="absolute border border-[#e2e8f0] border-solid inset-0 pointer-events-none rounded-[6px]" />
        <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#414651] text-[16px] whitespace-nowrap">Ver Detalhes</p>
      </button>
      <div className="bg-[#edf0ff] content-stretch flex gap-[6px] items-center justify-center px-[20px] py-[10px] relative rounded-[6px] shrink-0" data-name="button">
        <p className="font-['Helvetica_Neue:Medium',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#1b71fd] text-[16px] whitespace-nowrap">Ir para Check-In</p>
      </div>
    </div>
  );
}

function Elements21() {
  return (
    <div className="absolute bottom-[37.5%] left-1/4 right-1/4 top-[37.5%]" data-name="elements">
      <div className="absolute inset-[-12.5%_-6.25%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.5001 7.50005">
          <g id="elements">
            <path d={svgPaths.p1ce7e600} id="Vector" stroke="var(--stroke-0, #141B34)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Frame79({ onViewDetails }: { onViewDetails?: () => void }) {
  return (
    <div className="relative shrink-0 w-full">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex gap-[16px] items-center justify-center px-[20px] relative size-full">
          <Frame80 />
          <Frame81 onClick={onViewDetails} />
          <div className="overflow-clip relative shrink-0 size-[24px]" data-name="arrow-down-01-round">
            <Elements21 />
          </div>
        </div>
      </div>
    </div>
  );
}

function Elements22() {
  return (
    <div className="absolute inset-[8.33%_12.5%]" data-name="elements">
      <div className="absolute inset-[-4.5%_-5%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.2002 14.5333">
          <g id="elements">
            <path d={svgPaths.p2e9d7600} id="Vector" stroke="var(--stroke-0, #079455)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" />
            <path d={svgPaths.p16ea0100} id="Vector 6663" stroke="var(--stroke-0, #079455)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Text4() {
  return (
    <div className="bg-gradient-to-r from-white relative rounded-[4px] shrink-0 to-white" data-name="Text">
      <div className="content-stretch flex gap-[6px] items-center justify-center overflow-clip pb-[3.5px] pt-[2.5px] px-[6.5px] relative rounded-[inherit] size-full">
        <div className="relative shrink-0 size-[16px]" data-name="security-check">
          <div className="bg-clip-padding border-0 border-[transparent] border-solid overflow-clip relative rounded-[inherit] size-full">
            <Elements22 />
          </div>
        </div>
        <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#079455] text-[12px] whitespace-nowrap">Todos os participantes estão assegurados</p>
      </div>
      <div aria-hidden="true" className="absolute border-[#e9eaeb] border-[0.5px] border-solid inset-0 pointer-events-none rounded-[4px]" />
    </div>
  );
}

function Elements23() {
  return (
    <div className="relative size-full" data-name="elements">
      <div className="absolute inset-[-4.5%_-5.01%_-4.5%_-5%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.2008 14.5334">
          <g id="elements">
            <path d={svgPaths.p1d09fa00} id="Vector" stroke="var(--stroke-0, #6941C6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" />
            <path d={svgPaths.p224e400} id="Vector_2" stroke="var(--stroke-0, #6941C6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" />
            <path d={svgPaths.p20c88b60} id="Vector_3" stroke="var(--stroke-0, #6941C6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" />
            <path d={svgPaths.p840d2f0} id="Ellipse 1696" stroke="var(--stroke-0, #6941C6)" strokeWidth="1.2" />
            <path d={svgPaths.p31a43800} id="Vector_4" stroke="var(--stroke-0, #6941C6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Text5() {
  return (
    <div className="relative rounded-[4px] shrink-0" style={{ backgroundImage: "linear-gradient(90deg, rgb(255, 255, 255) 0%, rgb(255, 255, 255) 100%), linear-gradient(90deg, rgb(249, 245, 255) 0%, rgb(249, 245, 255) 100%)" }} data-name="Text">
      <div className="content-stretch flex gap-[6px] items-center justify-center overflow-clip pb-[3.5px] pt-[2.5px] px-[6.5px] relative rounded-[inherit] size-full">
        <div className="relative shrink-0 size-[16px]" data-name="stethoscope">
          <div className="bg-clip-padding border-0 border-[transparent] border-solid overflow-clip relative rounded-[inherit] size-full">
            <div className="absolute flex inset-[8.33%_12.5%] items-center justify-center" style={{ containerType: "size" }}>
              <div className="-scale-x-100 flex-none h-[100cqh] w-[100cqw]">
                <Elements23 />
              </div>
            </div>
          </div>
        </div>
        <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#6941c6] text-[12px] whitespace-nowrap">2 participantes precisam de atenção médica</p>
      </div>
      <div aria-hidden="true" className="absolute border-[#e9eaeb] border-[0.5px] border-solid inset-0 pointer-events-none rounded-[4px]" />
    </div>
  );
}

function Elements24() {
  return (
    <div className="absolute inset-[8.33%]" data-name="elements">
      <div className="absolute inset-[-4.5%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14.5333 14.5333">
          <g id="elements">
            <circle cx="7.26667" cy="7.26667" id="Ellipse 1112" r="6.66667" stroke="var(--stroke-0, #DC6803)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" />
            <path d="M7.26667 4.6V7.6" id="Vector" stroke="var(--stroke-0, #DC6803)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" />
            <path d="M7.26667 9.92552V9.93219" id="Vector_2" stroke="var(--stroke-0, #DC6803)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Text6() {
  return (
    <div className="relative rounded-[4px] shrink-0" style={{ backgroundImage: "linear-gradient(90deg, rgb(255, 255, 255) 0%, rgb(255, 255, 255) 100%), linear-gradient(90deg, rgb(255, 250, 235) 0%, rgb(255, 250, 235) 100%)" }} data-name="Text">
      <div className="content-stretch flex gap-[6px] items-center justify-center overflow-clip pb-[3.5px] pt-[2.5px] px-[6.5px] relative rounded-[inherit] size-full">
        <div className="relative shrink-0 size-[16px]" data-name="alert-circle">
          <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
            <Elements24 />
          </div>
        </div>
        <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#dc6803] text-[12px] whitespace-nowrap">Equipe responsável deve ser atribuída até 05/04</p>
      </div>
      <div aria-hidden="true" className="absolute border-[#e9eaeb] border-[0.5px] border-solid inset-0 pointer-events-none rounded-[4px]" />
    </div>
  );
}

function Frame82() {
  return (
    <div className="bg-[#fafafa] relative shrink-0 w-full">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[12px] items-center px-[20px] py-[12px] relative size-full">
          <Text4 />
          <Text5 />
          <Text6 />
        </div>
      </div>
    </div>
  );
}

function Frame29({ onViewDetails }: { onViewDetails?: () => void }) {
  return (
    <div className="bg-white relative rounded-[12px] shrink-0 w-full">
      <div className="content-stretch flex flex-col gap-[16px] items-center justify-center overflow-clip pt-[16px] relative rounded-[inherit] size-full">
        <Frame79 onViewDetails={onViewDetails} />
        <Frame82 />
      </div>
      <div aria-hidden="true" className="absolute border border-[#e2e8f0] border-solid inset-0 pointer-events-none rounded-[12px]" />
    </div>
  );
}

function Frame44({ onViewDetails }: { onViewDetails?: () => void }) {
  return (
    <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full">
      <Frame53 />
      <Frame29 onViewDetails={onViewDetails} />
    </div>
  );
}

function Container9() {
  return (
    <div className="relative rounded-[9999px] shrink-0 size-[16px]" style={{ backgroundImage: "linear-gradient(90deg, rgb(229, 0, 0) 0%, rgb(229, 0, 0) 100%), linear-gradient(90deg, rgb(253, 176, 34) 0%, rgb(253, 176, 34) 100%), linear-gradient(90deg, rgb(23, 178, 106) 0%, rgb(23, 178, 106) 100%), linear-gradient(90deg, rgb(11, 94, 215) 0%, rgb(11, 94, 215) 100%)" }} data-name="Container">
      <div aria-hidden="true" className="absolute border-2 border-solid border-white inset-0 pointer-events-none rounded-[9999px] shadow-[0px_0px_0px_0px_#dcfae6,0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_0px_rgba(0,0,0,0.1)]" />
    </div>
  );
}

function Frame26() {
  return (
    <div className="content-stretch flex font-['Helvetica_Neue:Regular',sans-serif] gap-[4px] items-center leading-[normal] not-italic relative shrink-0 whitespace-nowrap">
      <p className="relative shrink-0 text-[#252b37] text-[14px]">15:00 PM</p>
      <p className="relative shrink-0 text-[#717680] text-[12px]">(GMT+5:30)</p>
    </div>
  );
}

function Container10() {
  return <div className="absolute bg-[#e2e8f0] h-[10px] left-[15.5px] top-[22px] w-px" data-name="Container" />;
}

function Frame54() {
  return (
    <div className="content-stretch flex gap-[12px] items-center px-[8px] relative shrink-0">
      <Container9 />
      <Frame26 />
      <Container10 />
    </div>
  );
}

function Frame47() {
  return (
    <div className="content-stretch flex font-['Helvetica_Neue:Regular',sans-serif] gap-[5px] items-center not-italic relative shrink-0 text-[#252b37] text-[18px] whitespace-nowrap">
      <p className="leading-[normal] relative shrink-0">Bike Tour Vale Verde</p>
      <div className="flex flex-col justify-center leading-[0] relative shrink-0">
        <p className="leading-[normal]">(8/12)</p>
      </div>
    </div>
  );
}

function Elements25() {
  return (
    <div className="absolute inset-[8.33%]" data-name="elements">
      <div className="absolute inset-[-4.5%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14.5333 14.5333">
          <g id="elements">
            <path d={svgPaths.p23de7600} id="Ellipse 1334" stroke="var(--stroke-0, #D92D20)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" />
            <path d={svgPaths.p3475b9c0} id="Vector" stroke="var(--stroke-0, #D92D20)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Frame100() {
  return (
    <div className="content-stretch flex gap-[10px] items-center relative shrink-0">
      <Frame47 />
      <div className="bg-[#fef3f2] content-stretch flex gap-[5px] items-center justify-center px-[8px] py-[3px] relative rounded-[4px] shrink-0" data-name="Status activity badge">
        <div aria-hidden="true" className="absolute border border-[#fee4e2] border-solid inset-0 pointer-events-none rounded-[4px]" />
        <div className="relative shrink-0 size-[16px]" data-name="cancel-circle">
          <Elements25 />
        </div>
        <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#d92d20] text-[12px] whitespace-nowrap">Atividade Cancelada</p>
      </div>
    </div>
  );
}

function Elements26() {
  return (
    <div className="absolute bottom-[12.5%] left-1/4 right-1/4 top-[12.5%]" data-name="elements">
      <div className="absolute inset-[-6.25%_-9.39%_-6.26%_-9.39%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 9.5017 13.5">
          <g id="elements">
            <circle cx="4.75085" cy="3.41667" id="Ellipse 1540" r="2.66667" stroke="var(--stroke-0, #535862)" strokeWidth="1.5" />
            <path d={svgPaths.p1e727680} id="Vector 4237" stroke="var(--stroke-0, #535862)" strokeLinecap="round" strokeWidth="1.5" />
            <path d={svgPaths.p1b0c2a00} id="Vector 4653" stroke="var(--stroke-0, #535862)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Frame101() {
  return (
    <div className="content-stretch flex gap-[6px] items-center relative shrink-0">
      <div className="overflow-clip relative shrink-0 size-[16px]" data-name="pin-location-01">
        <Elements26 />
      </div>
      <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#535862] text-[14px] whitespace-nowrap">Atividade comum</p>
    </div>
  );
}

function Frame84() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[6px] items-start min-w-px relative">
      <Frame100 />
      <Frame101 />
    </div>
  );
}

function Frame85({ onClick }: { onClick?: () => void }) {
  return (
    <div className="content-stretch flex gap-[16px] items-center relative shrink-0">
      <button onClick={onClick} className="bg-white content-stretch flex gap-[8px] h-[40px] items-center justify-center px-[16px] py-[10px] relative rounded-[6px] shrink-0 w-[148px] cursor-pointer hover:bg-[#f8fafc] transition-colors" data-name="button">
        <div aria-hidden="true" className="absolute border border-[#e2e8f0] border-solid inset-0 pointer-events-none rounded-[6px]" />
        <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#414651] text-[16px] whitespace-nowrap">Ver Detalhes</p>
      </button>
    </div>
  );
}

function Elements27() {
  return (
    <div className="absolute bottom-[37.5%] left-1/4 right-1/4 top-[37.5%]" data-name="elements">
      <div className="absolute inset-[-12.5%_-6.25%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.5001 7.50005">
          <g id="elements">
            <path d={svgPaths.p1ce7e600} id="Vector" stroke="var(--stroke-0, #141B34)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Frame83({ onViewDetails }: { onViewDetails?: () => void }) {
  return (
    <div className="relative shrink-0 w-full">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex gap-[16px] items-center justify-center px-[20px] relative size-full">
          <Frame84 />
          <Frame85 onClick={onViewDetails} />
          <div className="overflow-clip relative shrink-0 size-[24px]" data-name="arrow-down-01-round">
            <Elements27 />
          </div>
        </div>
      </div>
    </div>
  );
}

function Elements28() {
  return (
    <div className="absolute inset-[8.33%_12.5%]" data-name="elements">
      <div className="absolute inset-[-4.5%_-5%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.2002 14.5333">
          <g id="elements">
            <path d={svgPaths.p2e9d7600} id="Vector" stroke="var(--stroke-0, #079455)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" />
            <path d={svgPaths.p16ea0100} id="Vector 6663" stroke="var(--stroke-0, #079455)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Text7() {
  return (
    <div className="bg-gradient-to-r from-white relative rounded-[4px] shrink-0 to-white" data-name="Text">
      <div className="content-stretch flex gap-[6px] items-center justify-center overflow-clip pb-[3.5px] pt-[2.5px] px-[6.5px] relative rounded-[inherit] size-full">
        <div className="relative shrink-0 size-[16px]" data-name="security-check">
          <div className="bg-clip-padding border-0 border-[transparent] border-solid overflow-clip relative rounded-[inherit] size-full">
            <Elements28 />
          </div>
        </div>
        <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#079455] text-[12px] whitespace-nowrap">Todos os participantes estão assegurados</p>
      </div>
      <div aria-hidden="true" className="absolute border-[#e9eaeb] border-[0.5px] border-solid inset-0 pointer-events-none rounded-[4px]" />
    </div>
  );
}

function Elements29() {
  return (
    <div className="relative size-full" data-name="elements">
      <div className="absolute inset-[-4.5%_-5.01%_-4.5%_-5%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.2008 14.5334">
          <g id="elements">
            <path d={svgPaths.p1d09fa00} id="Vector" stroke="var(--stroke-0, #6941C6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" />
            <path d={svgPaths.p224e400} id="Vector_2" stroke="var(--stroke-0, #6941C6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" />
            <path d={svgPaths.p20c88b60} id="Vector_3" stroke="var(--stroke-0, #6941C6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" />
            <path d={svgPaths.p840d2f0} id="Ellipse 1696" stroke="var(--stroke-0, #6941C6)" strokeWidth="1.2" />
            <path d={svgPaths.p31a43800} id="Vector_4" stroke="var(--stroke-0, #6941C6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Text8() {
  return (
    <div className="relative rounded-[4px] shrink-0" style={{ backgroundImage: "linear-gradient(90deg, rgb(255, 255, 255) 0%, rgb(255, 255, 255) 100%), linear-gradient(90deg, rgb(249, 245, 255) 0%, rgb(249, 245, 255) 100%)" }} data-name="Text">
      <div className="content-stretch flex gap-[6px] items-center justify-center overflow-clip pb-[3.5px] pt-[2.5px] px-[6.5px] relative rounded-[inherit] size-full">
        <div className="relative shrink-0 size-[16px]" data-name="stethoscope">
          <div className="bg-clip-padding border-0 border-[transparent] border-solid overflow-clip relative rounded-[inherit] size-full">
            <div className="absolute flex inset-[8.33%_12.5%] items-center justify-center" style={{ containerType: "size" }}>
              <div className="-scale-x-100 flex-none h-[100cqh] w-[100cqw]">
                <Elements29 />
              </div>
            </div>
          </div>
        </div>
        <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#6941c6] text-[12px] whitespace-nowrap">2 participantes precisam de atenção médica</p>
      </div>
      <div aria-hidden="true" className="absolute border-[#e9eaeb] border-[0.5px] border-solid inset-0 pointer-events-none rounded-[4px]" />
    </div>
  );
}

function Elements30() {
  return (
    <div className="absolute inset-[8.33%]" data-name="elements">
      <div className="absolute inset-[-4.5%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14.5333 14.5333">
          <g id="elements">
            <circle cx="7.26667" cy="7.26667" id="Ellipse 1112" r="6.66667" stroke="var(--stroke-0, #DC6803)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" />
            <path d="M7.26667 4.6V7.6" id="Vector" stroke="var(--stroke-0, #DC6803)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" />
            <path d="M7.26667 9.92552V9.93219" id="Vector_2" stroke="var(--stroke-0, #DC6803)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Text9() {
  return (
    <div className="relative rounded-[4px] shrink-0" style={{ backgroundImage: "linear-gradient(90deg, rgb(255, 255, 255) 0%, rgb(255, 255, 255) 100%), linear-gradient(90deg, rgb(255, 250, 235) 0%, rgb(255, 250, 235) 100%)" }} data-name="Text">
      <div className="content-stretch flex gap-[6px] items-center justify-center overflow-clip pb-[3.5px] pt-[2.5px] px-[6.5px] relative rounded-[inherit] size-full">
        <div className="relative shrink-0 size-[16px]" data-name="alert-circle">
          <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
            <Elements30 />
          </div>
        </div>
        <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#dc6803] text-[12px] whitespace-nowrap">Equipe responsável deve ser atribuída até 05/04</p>
      </div>
      <div aria-hidden="true" className="absolute border-[#e9eaeb] border-[0.5px] border-solid inset-0 pointer-events-none rounded-[4px]" />
    </div>
  );
}

function Frame86() {
  return (
    <div className="bg-[#fafafa] relative shrink-0 w-full">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[12px] items-center px-[20px] py-[12px] relative size-full">
          <Text7 />
          <Text8 />
          <Text9 />
        </div>
      </div>
    </div>
  );
}

function Frame55({ onViewDetails }: { onViewDetails?: () => void }) {
  return (
    <div className="bg-white relative rounded-[12px] shrink-0 w-full">
      <div className="content-stretch flex flex-col gap-[16px] items-center justify-center overflow-clip pt-[16px] relative rounded-[inherit] size-full">
        <Frame83 onViewDetails={onViewDetails} />
        <Frame86 />
      </div>
      <div aria-hidden="true" className="absolute border border-[#e2e8f0] border-solid inset-0 pointer-events-none rounded-[12px]" />
    </div>
  );
}

function Frame46({ onViewDetails }: { onViewDetails?: () => void }) {
  return (
    <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full">
      <Frame54 />
      <Frame55 onViewDetails={onViewDetails} />
    </div>
  );
}

function Container11() {
  return (
    <div className="relative rounded-[9999px] shrink-0 size-[16px]" style={{ backgroundImage: "linear-gradient(90deg, rgb(253, 176, 34) 0%, rgb(253, 176, 34) 100%), linear-gradient(90deg, rgb(23, 178, 106) 0%, rgb(23, 178, 106) 100%), linear-gradient(90deg, rgb(11, 94, 215) 0%, rgb(11, 94, 215) 100%)" }} data-name="Container">
      <div aria-hidden="true" className="absolute border-2 border-solid border-white inset-0 pointer-events-none rounded-[9999px] shadow-[0px_0px_0px_0px_#dcfae6,0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_0px_rgba(0,0,0,0.1)]" />
    </div>
  );
}

function Frame27() {
  return (
    <div className="content-stretch flex font-['Helvetica_Neue:Regular',sans-serif] gap-[4px] items-center leading-[normal] not-italic relative shrink-0 whitespace-nowrap">
      <p className="relative shrink-0 text-[#252b37] text-[14px]">15:00 PM</p>
      <p className="relative shrink-0 text-[#717680] text-[12px]">(GMT+5:30)</p>
    </div>
  );
}

function Container12() {
  return <div className="absolute bg-[#e2e8f0] h-[10px] left-[15.5px] top-[22px] w-px" data-name="Container" />;
}

function Frame56() {
  return (
    <div className="content-stretch flex gap-[12px] items-center px-[8px] relative shrink-0">
      <Container11 />
      <Frame27 />
      <Container12 />
    </div>
  );
}

function Text10() {
  return (
    <div className="bg-[#fffaeb] relative rounded-[4px] shrink-0" data-name="Text">
      <div className="content-stretch flex items-center justify-center overflow-clip px-[6.5px] py-[2.5px] relative rounded-[inherit] size-full">
        <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#dc6803] text-[12px] whitespace-nowrap">08/12</p>
      </div>
      <div aria-hidden="true" className="absolute border-[#fef0c7] border-[0.5px] border-solid inset-0 pointer-events-none rounded-[4px]" />
    </div>
  );
}

function Frame49() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0">
      <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#252b37] text-[18px] whitespace-nowrap">Escalada Morro Alto</p>
      <Text10 />
    </div>
  );
}

function Elements31() {
  return (
    <div className="absolute inset-[8.33%_16.67%]" data-name="elements">
      <div className="absolute inset-[-4.51%_-5.63%_-4.5%_-5.62%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11.8667 14.5333">
          <g id="elements">
            <path d={svgPaths.p2aa7d480} id="Ellipse 1592" stroke="var(--stroke-0, #535862)" strokeLinecap="round" strokeWidth="1.2" />
            <path d={svgPaths.p3650a580} id="Ellipse 1590" stroke="var(--stroke-0, #535862)" strokeWidth="1.2" />
            <path d={svgPaths.p3e7fe000} id="Vector" stroke="var(--stroke-0, #535862)" strokeWidth="1.2" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Frame18() {
  return (
    <div className="content-stretch flex gap-[6px] items-center relative shrink-0 w-full">
      <div className="overflow-clip relative shrink-0 size-[16px]" data-name="location-04">
        <Elements31 />
      </div>
      <p className="flex-[1_0_0] font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] min-w-px not-italic relative text-[#535862] text-[14px]">Parque Municipal, Sabará - Belo Horizonte</p>
    </div>
  );
}

function Frame88() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[6px] items-start min-w-px relative">
      <Frame49 />
      <Frame18 />
    </div>
  );
}

function Frame61({ onClick }: { onClick?: () => void }) {
  return (
    <div className="content-stretch flex gap-[16px] items-center relative shrink-0">
      <button onClick={onClick} className="bg-white content-stretch flex gap-[8px] items-center justify-center px-[16px] py-[10px] relative rounded-[6px] shrink-0 w-[148px] cursor-pointer hover:bg-[#f8fafc] transition-colors" data-name="button">
        <div aria-hidden="true" className="absolute border border-[#e2e8f0] border-solid inset-0 pointer-events-none rounded-[6px]" />
        <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#414651] text-[16px] whitespace-nowrap">Ver Detalhes</p>
      </button>
      <div className="bg-[#edf0ff] content-stretch flex gap-[6px] items-center justify-center px-[20px] py-[8px] relative rounded-[6px] shrink-0" data-name="button">
        <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#1b71fd] text-[16px] whitespace-nowrap">Ir para Check-In</p>
      </div>
    </div>
  );
}

function Elements32() {
  return (
    <div className="absolute bottom-[37.5%] left-1/4 right-1/4 top-[37.5%]" data-name="elements">
      <div className="absolute inset-[-12.5%_-6.25%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.5001 7.50005">
          <g id="elements">
            <path d={svgPaths.p1ce7e600} id="Vector" stroke="var(--stroke-0, #141B34)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Frame87({ onViewDetails }: { onViewDetails?: () => void }) {
  return (
    <div className="relative shrink-0 w-full">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex gap-[16px] items-center justify-center px-[20px] relative size-full">
          <Frame88 />
          <Frame61 onClick={onViewDetails} />
          <div className="overflow-clip relative shrink-0 size-[24px]" data-name="arrow-down-01-round">
            <Elements32 />
          </div>
        </div>
      </div>
    </div>
  );
}

function Frame30({ onViewDetails }: { onViewDetails?: () => void }) {
  return (
    <div className="bg-white relative rounded-[12px] shrink-0 w-full">
      <div className="content-stretch flex flex-col items-center justify-center overflow-clip py-[16px] relative rounded-[inherit] size-full">
        <Frame87 onViewDetails={onViewDetails} />
      </div>
      <div aria-hidden="true" className="absolute border border-[#e2e8f0] border-solid inset-0 pointer-events-none rounded-[12px]" />
    </div>
  );
}

function Frame48({ onViewDetails }: { onViewDetails?: () => void }) {
  return (
    <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full">
      <Frame56 />
      <Frame30 onViewDetails={onViewDetails} />
    </div>
  );
}

function Container13() {
  return <div className="absolute bg-[#e2e8f0] h-[18px] left-[16px] top-[690px] w-px" data-name="Container" />;
}

function Frame40({ onViewDetails }: { onViewDetails?: () => void }) {
  return (
    <div className="absolute content-stretch flex flex-col gap-[20px] h-[812px] items-start left-[248px] right-[24px] top-[242px]">
      <Frame37 onViewDetails={onViewDetails} />
      <Container3 />
      <Container4 />
      <Frame39 onViewDetails={onViewDetails} />
      <Frame44 onViewDetails={onViewDetails} />
      <Frame46 onViewDetails={onViewDetails} />
      <Frame48 onViewDetails={onViewDetails} />
      <Container13 />
    </div>
  );
}

function MonthWrapper() {
  return (
    <div className="bg-[#fafafa] relative shrink-0 w-full" data-name="Month wrapper">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center pb-px pt-[2px] px-[6px] relative size-full">
          <p className="font-['Helvetica_Neue:Medium',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#717680] text-[12px] whitespace-nowrap">MAR</p>
        </div>
      </div>
    </div>
  );
}

function DateWrapper() {
  return (
    <div className="relative shrink-0 w-full" data-name="Date wrapper">
      <div className="flex flex-col items-center justify-center size-full">
        <div className="content-stretch flex flex-col items-center justify-center pb-[2px] pt-px px-[6px] relative size-full">
          <p className="font-['Helvetica_Neue:Medium',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#0b5ed7] text-[16px] whitespace-nowrap">24</p>
        </div>
      </div>
    </div>
  );
}

function CalendarDateIcon() {
  return (
    <div className="bg-white relative rounded-[6px] shrink-0 w-[53.566px]" data-name="_Calendar date icon">
      <div className="content-stretch flex flex-col items-center overflow-clip relative rounded-[inherit] size-full">
        <MonthWrapper />
        <DateWrapper />
      </div>
      <div aria-hidden="true" className="absolute border-[#e9eaeb] border-[0.837px] border-solid inset-0 pointer-events-none rounded-[6px]" />
    </div>
  );
}

function Badge() {
  return (
    <div className="bg-[#f04438] relative rounded-[8px] shrink-0" data-name="Badge">
      <div className="content-stretch flex items-center justify-center overflow-clip px-[8.556px] py-[2.556px] relative rounded-[inherit] size-full">
        <p className="font-['Helvetica_Neue:Medium',sans-serif] leading-[normal] not-italic relative shrink-0 text-[14px] text-white whitespace-nowrap">5</p>
      </div>
      <div aria-hidden="true" className="absolute border-[0.556px] border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Frame58() {
  return (
    <div className="content-stretch flex gap-[10px] items-center relative shrink-0">
      <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#0f172b] text-[24px] whitespace-nowrap">Atividades do dia</p>
      <Badge />
    </div>
  );
}

function Frame59() {
  return (
    <div className="content-stretch flex font-['Helvetica_Neue:Regular',sans-serif] gap-[6px] items-start leading-[normal] not-italic relative shrink-0 text-[14px] whitespace-nowrap">
      <p className="relative shrink-0 text-[#181d27]">24/03/2026</p>
      <p className="relative shrink-0 text-[#62748e]">(Sem feriados)</p>
    </div>
  );
}

function Container14() {
  return (
    <div className="flex-[1_0_0] min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[4px] items-start relative size-full">
        <Frame58 />
        <Frame59 />
      </div>
    </div>
  );
}

function DashboardContent() {
  return (
    <div className="flex-[1_0_0] min-w-px relative" data-name="DashboardContent">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between relative size-full">
          <Container14 />
        </div>
      </div>
    </div>
  );
}

function DateAndText() {
  return (
    <div className="content-stretch flex gap-[12px] items-center relative shrink-0 w-[717px]" data-name="Date and text">
      <CalendarDateIcon />
      <DashboardContent />
    </div>
  );
}

function Elements33() {
  return (
    <div className="absolute inset-[8.33%_16.67%]" data-name="elements">
      <div className="absolute inset-[-4.5%_-5.63%_-4.5%_-5.62%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14.8335 18.1668">
          <g id="elements">
            <path d="M4.08333 13.2501H10.75" id="Vector" stroke="var(--stroke-0, #414651)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            <path d="M4.08333 9.91681H7.41667" id="Vector_2" stroke="var(--stroke-0, #414651)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            <path d={svgPaths.p2127a300} id="Vector_3" stroke="var(--stroke-0, #414651)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Elements34() {
  return (
    <div className="absolute inset-[8.33%_12.5%]" data-name="elements">
      <div className="absolute inset-[-4.5%_-5%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16.5002 18.1667">
          <g id="elements">
            <path d={svgPaths.p3f24a500} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            <path d={svgPaths.p7f84b00} id="Vector 9260" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            <path d="M0.750001 7.41667H15.75" id="Vector 4046" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            <path d={svgPaths.p17e1ec00} id="Vector 7435" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Frame89() {
  return (
    <div className="content-stretch flex gap-[16px] items-center relative shrink-0">
      <div className="bg-white content-stretch flex gap-[8px] items-center justify-center px-[16px] py-[10px] relative rounded-[6px] shrink-0" data-name="button">
        <div aria-hidden="true" className="absolute border border-[#e2e8f0] border-solid inset-0 pointer-events-none rounded-[6px]" />
        <div className="relative shrink-0 size-[20px]" data-name="file-02">
          <Elements33 />
        </div>
        <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#414651] text-[16px] whitespace-nowrap">Ficha de Operação</p>
      </div>
      <div className="content-stretch flex gap-[8px] items-center justify-center px-[16px] py-[10px] relative rounded-[8px] shrink-0" style={{ backgroundImage: "linear-gradient(rgb(11, 94, 215) 0%, rgb(8, 79, 183) 100%), linear-gradient(90deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0) 100%)" }} data-name="button">
        <div className="relative shrink-0 size-[20px]" data-name="appointment-01">
          <Elements34 />
        </div>
        <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[16px] text-white whitespace-nowrap">Concluir Atividades do Dia</p>
      </div>
    </div>
  );
}

function Frame31() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
      <DateAndText />
      <Frame89 />
    </div>
  );
}

function Frame57() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[20px] items-start left-[248px] right-[24px] top-[148px]">
      <Frame31 />
      <div className="h-0 relative shrink-0 w-full">
        <div className="absolute inset-[-1px_0_0_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1168 1">
            <line id="Line 42" stroke="var(--stroke-0, #F5F5F5)" x2="1168" y1="0.5" y2="0.5" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Container15() {
  return (
    <div className="relative rounded-tl-[16px] rounded-tr-[16px] shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#f5f5f5] border-b border-solid inset-0 pointer-events-none rounded-tl-[16px] rounded-tr-[16px]" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center pb-[17px] pt-[16px] px-[16px] relative size-full">
          <div className="h-[40px] relative shrink-0 w-[161px]" data-name="Logo variação II (Default)">
            <div className="bg-clip-padding border-0 border-[transparent] border-solid overflow-clip relative rounded-[inherit] size-full">
              <div className="absolute inset-[0_80.75%_0_0]" data-name="Vector">
                <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 31 40">
                  <path d={svgPaths.p269ed300} fill="var(--fill-0, #0A5F45)" id="Vector" />
                </svg>
              </div>
              <div className="absolute inset-[12.86%_85.71%_70.31%_10.08%]" data-name="Vector">
                <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6.7714 6.73201">
                  <path d={svgPaths.p148e6b00} fill="var(--fill-0, #A7C72B)" id="Vector" />
                </svg>
              </div>
              <div className="absolute inset-[35.42%_92.28%_48.61%_2.13%]" data-name="Vector">
                <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8.99803 6.38889">
                  <path d={svgPaths.p1f476d00} fill="var(--fill-0, #A7C72B)" id="Vector" />
                </svg>
              </div>
              <div className="absolute inset-[38.43%_87.61%_44.97%_8.47%]" data-name="Vector">
                <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6.3079 6.6407">
                  <path d={svgPaths.p35e35100} fill="var(--fill-0, #A7C72B)" id="Vector" />
                </svg>
              </div>
              <div className="-translate-y-1/2 absolute h-[24px] right-0 top-1/2 w-[118px]" data-name="Vector">
                <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 118 24">
                  <g id="Vector">
                    <path d={svgPaths.p2c532b80} fill="var(--fill-0, #0A5F45)" />
                    <path d={svgPaths.p22f8f500} fill="#0A5F45" />
                    <path d={svgPaths.p13ec1d00} fill="var(--fill-0, #0A5F45)" />
                    <path d={svgPaths.p2e8eb100} fill="var(--fill-0, #0A5F45)" />
                    <path d={svgPaths.p9abef00} fill="var(--fill-0, #0A5F45)" />
                    <path d={svgPaths.p30356c00} fill="#0A5F45" />
                    <path d={svgPaths.pb618a00} fill="#0A5F45" />
                    <path d={svgPaths.p31999d00} fill="#0A5F45" />
                    <path d={svgPaths.p20c19600} fill="#0A5F45" />
                    <path d={svgPaths.pf06d380} fill="var(--fill-0, #0A5F45)" />
                  </g>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Elements35() {
  return (
    <div className="absolute inset-[10.42%_12.5%]" data-name="elements">
      <div className="absolute inset-[-4.74%_-5%_-4.73%_-5%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16.5003 17.3333">
          <g id="elements">
            <path d={svgPaths.pa41cf00} id="Vector 3" stroke="var(--stroke-0, #414651)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            <path d={svgPaths.p232a7180} id="Ellipse 1281" stroke="var(--stroke-0, #414651)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Frame1() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[2px] items-start justify-center min-w-px relative">
      <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#414651] text-[14px] whitespace-nowrap">Início</p>
    </div>
  );
}

function Elements36() {
  return (
    <div className="absolute inset-[8.33%_12.5%]" data-name="elements">
      <div className="absolute inset-[-4.5%_-5%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16.5 18.1667">
          <g id="elements">
            <path d={svgPaths.p3f24a500} id="Vector" stroke="var(--stroke-0, #0B5ED7)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            <path d={svgPaths.p17982b00} id="Vector 9260" stroke="var(--stroke-0, #0B5ED7)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            <path d="M0.750001 7.41667H15.75" id="Vector 4046" stroke="var(--stroke-0, #0B5ED7)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Frame() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[2px] items-start justify-center min-w-px relative">
      <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#0b5ed7] text-[14px] w-full">Agenda</p>
    </div>
  );
}

function Container16() {
  return <div className="absolute bg-[#1b71fd] h-[24px] left-0 rounded-br-[9999px] rounded-tr-[9999px] top-[12px] w-[4px]" data-name="Container" />;
}

function Elements37() {
  return (
    <div className="absolute inset-[12.5%]" data-name="elements">
      <div className="absolute inset-[-5%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16.4998 16.5002">
          <g id="elements">
            <path d={svgPaths.p345c3070} id="Vector" stroke="var(--stroke-0, #414651)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            <path d={svgPaths.p12132d48} id="Vector 9780" stroke="var(--stroke-0, #414651)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Frame2() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[2px] items-start justify-center min-w-px relative">
      <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#414651] text-[14px] whitespace-nowrap">Vendas</p>
    </div>
  );
}

function Elements38() {
  return (
    <div className="absolute bottom-[37.5%] left-1/4 right-1/4 top-[37.5%]" data-name="elements">
      <div className="absolute inset-[-18.75%_-9.38%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 9.5001 5.50005">
          <g id="elements">
            <path d={svgPaths.p3e9d200} id="Vector" stroke="var(--stroke-0, #414651)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Elements39() {
  return (
    <div className="relative size-full" data-name="elements">
      <div className="absolute inset-[-6%_-4.5%_-5.99%_-4.5%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18.1667 14">
          <g id="elements">
            <path d={svgPaths.p2e63c00} id="Vector" stroke="var(--stroke-0, #414651)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            <path d={svgPaths.p348f5200} id="Vector_2" stroke="var(--stroke-0, #414651)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            <path d={svgPaths.p20b57e00} id="Vector_3" stroke="var(--stroke-0, #414651)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            <path d={svgPaths.p1c2e0880} id="Vector_4" stroke="var(--stroke-0, #414651)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            <path d={svgPaths.p21559d80} id="Vector_5" stroke="var(--stroke-0, #414651)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            <path d={svgPaths.p2ea56200} id="Vector_6" stroke="var(--stroke-0, #414651)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Frame3() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[2px] items-start justify-center min-w-px relative">
      <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#414651] text-[14px] whitespace-nowrap">Clientes</p>
    </div>
  );
}

function Elements40() {
  return (
    <div className="relative size-full" data-name="elements">
      <div className="absolute inset-[-4.5%_-5%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16.5 18.1667">
          <g id="elements">
            <path d={svgPaths.p110276c0} id="Vector 5355" stroke="var(--stroke-0, #414651)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            <path d={svgPaths.p3b79ab00} id="Vector 5356" stroke="var(--stroke-0, #414651)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            <path d="M3.25 9.08333L4.91667 8.25" id="Vector 5357" stroke="var(--stroke-0, #414651)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            <path d={svgPaths.p101fb180} id="Vector 5358" stroke="var(--stroke-0, #414651)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Frame4() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[2px] items-start justify-center min-w-px relative">
      <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#414651] text-[14px] whitespace-nowrap">Produtos</p>
    </div>
  );
}

function Elements41() {
  return (
    <div className="relative size-full" data-name="elements">
      <div className="absolute inset-[-4.74%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 17.3334 17.3334">
          <g id="elements">
            <path d={svgPaths.p6cac380} id="Vector" stroke="var(--stroke-0, #414651)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            <path d={svgPaths.p15b51100} id="Vector_2" stroke="var(--stroke-0, #414651)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            <path d={svgPaths.p3932dd80} id="Vector_3" stroke="var(--stroke-0, #414651)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Frame5() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[2px] items-start justify-center min-w-px relative">
      <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#414651] text-[14px] whitespace-nowrap">Vendedores</p>
    </div>
  );
}

function Elements42() {
  return (
    <div className="relative size-full" data-name="elements">
      <div className="absolute inset-[-5.01%_-5.01%_-5%_-5%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16.5015 16.5015">
          <g id="elements">
            <path d={svgPaths.p3010b300} id="Vector" stroke="var(--stroke-0, #414651)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            <path d={svgPaths.p248b2500} id="Vector_2" stroke="var(--stroke-0, #414651)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            <path d={svgPaths.p34c2aa00} id="Vector_3" stroke="var(--stroke-0, #414651)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Frame6() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[2px] items-start justify-center min-w-px relative">
      <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#414651] text-[14px] whitespace-nowrap">Afiliados</p>
    </div>
  );
}

function Elements43() {
  return (
    <div className="absolute inset-[12.5%_14.58%]" data-name="elements">
      <div className="absolute inset-[-5%_-5.29%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15.6667 16.5">
          <g id="elements">
            <path d={svgPaths.p3d9eab80} id="Vector 9305" stroke="var(--stroke-0, #414651)" strokeLinecap="square" strokeLinejoin="round" strokeWidth="1.5" />
            <path d={svgPaths.p3ba90880} id="Vector 9306" stroke="var(--stroke-0, #414651)" strokeLinecap="square" strokeLinejoin="round" strokeWidth="1.5" />
            <path d={svgPaths.p1023600} id="Vector 9307" stroke="var(--stroke-0, #414651)" strokeLinecap="square" strokeLinejoin="round" strokeWidth="1.5" />
            <path d={svgPaths.p5cf5570} id="Ellipse 2441" stroke="var(--stroke-0, #414651)" strokeWidth="1.5" />
            <path d={svgPaths.p18fa1400} id="Ellipse 2442" stroke="var(--stroke-0, #414651)" strokeWidth="1.5" />
            <path d={svgPaths.p197e9d70} id="Ellipse 2443" stroke="var(--stroke-0, #414651)" strokeWidth="1.5" />
            <path d={svgPaths.p29a8e0c0} id="Vector" stroke="var(--stroke-0, #414651)" strokeWidth="1.5" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Frame7() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[2px] items-start justify-center min-w-px relative">
      <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#414651] text-[14px] whitespace-nowrap">Indicadores</p>
    </div>
  );
}

function Frame20() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full">
      <div className="bg-white h-[48px] relative rounded-[14px] shrink-0 w-full" data-name="Menu action component">
        <div className="flex flex-row items-center size-full">
          <div className="content-stretch flex gap-[12px] items-center pl-[16px] pr-[12px] py-[14px] relative size-full">
            <div className="relative shrink-0 size-[20px]" data-name="home-01">
              <Elements35 />
            </div>
            <Frame1 />
          </div>
        </div>
      </div>
      <div className="bg-[#edf0ff] h-[48px] relative rounded-[14px] shrink-0 w-full" data-name="Component 2">
        <div className="flex flex-row items-center size-full">
          <div className="content-stretch flex gap-[12px] items-center pl-[16px] pr-[12px] py-[14px] relative size-full">
            <div className="relative shrink-0 size-[20px]" data-name="calendar-04">
              <Elements36 />
            </div>
            <Frame />
            <Container16 />
          </div>
        </div>
      </div>
      <div className="content-stretch flex h-[48px] items-start relative shrink-0" data-name="Vendas dropdown">
        <div className="bg-white relative rounded-[14px] self-stretch shrink-0 w-[168.003px]" data-name="Component 2">
          <div className="flex flex-row items-center size-full">
            <div className="content-stretch flex gap-[12px] items-center pl-[16px] pr-[12px] py-[14px] relative size-full">
              <div className="overflow-clip relative shrink-0 size-[20px]" data-name="shopping-bag-01">
                <Elements37 />
              </div>
              <Frame2 />
              <div className="overflow-clip relative shrink-0 size-[16px]" data-name="arrow-down-01-round">
                <Elements38 />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white h-[48px] relative rounded-[14px] shrink-0 w-full" data-name="Component 4">
        <div className="flex flex-row items-center size-full">
          <div className="content-stretch flex gap-[12px] items-center pl-[16px] pr-[12px] py-[14px] relative size-full">
            <div className="relative shrink-0 size-[20px]" data-name="user-group">
              <div className="absolute flex inset-[18.75%_8.33%] items-center justify-center" style={{ containerType: "size" }}>
                <div className="-scale-x-100 flex-none h-[100cqh] w-[100cqw]">
                  <Elements39 />
                </div>
              </div>
            </div>
            <Frame3 />
          </div>
        </div>
      </div>
      <div className="bg-white h-[48px] relative rounded-[14px] shrink-0 w-full" data-name="Component 5">
        <div className="flex flex-row items-center size-full">
          <div className="content-stretch flex gap-[12px] items-center pl-[16px] pr-[12px] py-[14px] relative size-full">
            <div className="overflow-clip relative shrink-0 size-[20px]" data-name="package">
              <div className="absolute flex inset-[8.33%_12.5%] items-center justify-center" style={{ containerType: "size" }}>
                <div className="-rotate-180 -scale-x-100 flex-none h-[100cqh] w-[100cqw]">
                  <Elements40 />
                </div>
              </div>
            </div>
            <Frame4 />
          </div>
        </div>
      </div>
      <div className="bg-white h-[48px] relative rounded-[14px] shrink-0 w-full" data-name="Component 4">
        <div className="flex flex-row items-center size-full">
          <div className="content-stretch flex gap-[12px] items-center pl-[16px] pr-[12px] py-[14px] relative size-full">
            <div className="relative shrink-0 size-[20px]" data-name="user-id-verification">
              <div className="absolute flex inset-[10.42%] items-center justify-center" style={{ containerType: "size" }}>
                <div className="-rotate-180 -scale-x-100 flex-none h-[100cqh] w-[100cqw]">
                  <Elements41 />
                </div>
              </div>
            </div>
            <Frame5 />
          </div>
        </div>
      </div>
      <div className="bg-white h-[48px] relative rounded-[14px] shrink-0 w-full" data-name="Component 7">
        <div className="flex flex-row items-center size-full">
          <div className="content-stretch flex gap-[12px] items-center pl-[16px] pr-[12px] py-[14px] relative size-full">
            <div className="relative shrink-0 size-[20px]" data-name="user-star-01">
              <div className="absolute flex inset-[12.5%] items-center justify-center" style={{ containerType: "size" }}>
                <div className="-rotate-180 -scale-x-100 flex-none h-[100cqh] w-[100cqw]">
                  <Elements42 />
                </div>
              </div>
            </div>
            <Frame6 />
          </div>
        </div>
      </div>
      <div className="bg-white h-[48px] relative rounded-[14px] shrink-0 w-full" data-name="Component 6">
        <div className="flex flex-row items-center size-full">
          <div className="content-stretch flex gap-[12px] items-center pl-[16px] pr-[12px] py-[14px] relative size-full">
            <div className="relative shrink-0 size-[20px]" data-name="chart-02">
              <Elements43 />
            </div>
            <Frame7 />
          </div>
        </div>
      </div>
    </div>
  );
}

function PrimitiveDiv() {
  return (
    <div className="flex-[1_0_0] min-h-px relative w-full" data-name="Primitive.div">
      <div className="flex flex-col items-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col items-center pb-[16px] pt-[20px] px-[15.998px] relative size-full">
          <Frame20 />
        </div>
      </div>
    </div>
  );
}

function SidebarMenu() {
  return (
    <div className="content-stretch flex flex-col h-[35.99px] items-start leading-[normal] not-italic relative shrink-0 text-center whitespace-nowrap" data-name="SidebarMenu">
      <p className="font-['Helvetica_Neue:Medium',sans-serif] relative shrink-0 text-[#0f172b] text-[14px]">Katiely Pinheiro</p>
      <p className="font-['Helvetica_Neue:Regular',sans-serif] relative shrink-0 text-[#62748e] text-[12px]">Gestor Comercial</p>
    </div>
  );
}

function Frame19() {
  return (
    <div className="relative rounded-[8px] shrink-0">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center px-[8px] py-[6px] relative size-full">
        <div className="relative shrink-0 size-[40px]" data-name="avatar">
          <img alt="" className="absolute block inset-0 max-w-none size-full" height="40" src={imgAvatar} width="40" />
        </div>
        <SidebarMenu />
      </div>
    </div>
  );
}

// ─── Dynamic Atividades do Dia ──────────────────────────────────────────────

const DIA_HOLIDAYS = allHolidays;

// Status config moved to src/lib/agenda/activityCard.ts (getActivityStatusBadge)

function DiaChevron() {
  return (
    <div className="overflow-clip relative shrink-0 size-[16px]" data-name="chevron-right">
      <div className="absolute bottom-1/4 left-[37.5%] right-[37.5%] top-1/4">
        <div className="absolute inset-[-6.25%_-12.5%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 5 9">
            <path d="M0.5 8.5L4.5 4.5L0.5 0.5" stroke="var(--stroke-0, #71717A)" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
    </div>
  );
}

// ─── Figma-exact Badge Icon Components ─────────────────────────────────────

function BadgeIcon({ badge }: { badge: ContextualBadgeType }) {
  // security-warning (Seguro obrigatório — red)
  if (badge.icon === 'shield-alert') {
    return (
      <svg className="shrink-0 size-[16px]" viewBox="0 0 16 16" fill="none">
        <path d="M8 7.3335V4.66683M12.4727 2.33016C11.2113 1.70283 9.66667 1.3335 8 1.3335C6.33333 1.3335 4.78933 1.70283 3.52733 2.33016C2.90867 2.63816 2.59933 2.79216 2.3 3.27616C2.00067 3.76016 2 4.22816 2 5.1655V7.49216C2 11.2808 5.028 13.3868 6.782 14.2895C7.27133 14.5408 7.51533 14.6668 8 14.6668C8.48467 14.6668 8.72867 14.5408 9.218 14.2895C10.9713 13.3868 14 11.2802 14 7.4915V5.1655C14 4.22816 14 3.76016 13.7 3.27616C13.4 2.79216 13.0913 2.63816 12.4727 2.33016Z" stroke="#F04438" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M8.083 9.83317H8M8.16634 9.83317C8.16634 9.87737 8.14878 9.91977 8.11753 9.95102C8.08627 9.98228 8.04388 9.99984 8 9.99984C7.95547 9.99984 7.91308 9.98228 7.88182 9.95102C7.85057 9.91977 7.83301 9.87737 7.83301 9.83317C7.83301 9.78897 7.85057 9.74658 7.88182 9.71532C7.91308 9.68406 7.95547 9.6665 8 9.6665C8.04388 9.6665 8.08627 9.68406 8.11753 9.71532C8.14878 9.74658 8.16634 9.78897 8.16634 9.83317Z" stroke="#F04438" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    );
  }
  // shield-01 (Seguro opcional — gray)
  if (badge.icon === 'shield') {
    return (
      <svg className="shrink-0 size-[16px]" viewBox="0 0 16 16" fill="none">
        <path d="M12.4726 2.33039C11.211 1.70271 9.66727 1.3335 8 1.3335C6.33273 1.3335 4.789 1.70271 3.52744 2.33039C2.90879 2.6382 2.59946 2.79211 2.29973 3.27602C2 3.75993 2 4.22848 2 5.16559L2 7.49153C2 11.2805 5.02824 13.3871 6.78203 14.2894C7.27112 14.541 7.51567 14.6668 7.99999 14.6668C8.48431 14.6668 8.72886 14.541 9.21796 14.2894C10.9717 13.3871 14 11.2805 14 7.49153L14 5.16559C14 4.22849 14 3.75993 13.7003 3.27602C13.4005 2.7921 13.0912 2.6382 12.4726 2.33039Z" stroke="#414651" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    );
  }
  // security-check (Todos assegurados — green)
  if (badge.icon === 'shield-check') {
    return (
      <svg className="shrink-0 size-[16px]" viewBox="0 0 16 16" fill="none">
        <path d="M12.4726 2.33039C11.211 1.70271 9.66727 1.3335 8 1.3335C6.33273 1.3335 4.789 1.70271 3.52744 2.33039C2.90879 2.6382 2.59946 2.79211 2.29973 3.27602C2 3.75993 2 4.22848 2 5.16559L2 7.49153C2 11.2805 5.02824 13.3871 6.78203 14.2894C7.27112 14.541 7.51567 14.6668 7.99999 14.6668C8.48431 14.6668 8.72886 14.541 9.21796 14.2894C10.9717 13.3871 14 11.2805 14 7.49153L14 5.16559C14 4.22849 14 3.75993 13.7003 3.27602C13.4005 2.7921 13.0912 2.6382 12.4726 2.33039Z" stroke="#079455" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M6 7.66683C6 7.66683 6.93861 7.83479 7.33333 9.00016C7.33333 9.00016 8.33333 7.00016 10 6.3335" stroke="#079455" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    );
  }
  // stethoscope (Atenção médica — purple)
  if (badge.icon === 'stethoscope') {
    return (
      <svg className="shrink-0 size-[16px]" viewBox="0 0 16 16" fill="none">
        <path d="M8.66759 1.3335C9.40356 1.3335 10.0002 1.95434 10.0002 2.72018C10.0002 3.35293 10.0241 3.91599 9.5128 4.38147C7.83911 5.90504 7.00226 6.66683 6.00018 6.66683C4.99809 6.66683 4.16125 5.90504 2.48755 4.38147C1.97617 3.91596 2.00018 3.35283 2.00018 2.72004C2.00018 1.95427 2.59673 1.3335 3.33262 1.3335" stroke="#6941C6" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M6 9.3335L6 11.6667C6 13.3236 7.34325 14.6669 9.00022 14.6669C10.6572 14.6669 12.0004 13.3236 12.0004 11.6667V10.6668" stroke="#6941C6" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M9.33366 4.6665L8.46551 6.83687C8.23473 7.41382 8.11934 7.7023 7.9261 7.93933C7.73286 8.17636 7.47355 8.3475 6.95492 8.68978L5.98006 9.33317L5.02221 8.68807C4.51513 8.34655 4.26158 8.17579 4.07246 7.94159C3.88334 7.70738 3.76981 7.42356 3.54276 6.85592L2.66699 4.6665" stroke="#6941C6" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M14 8.6665C14 9.77107 13.1046 10.6665 12 10.6665C10.8954 10.6665 10 9.77107 10 8.6665C10 7.56193 10.8954 6.6665 12 6.6665C13.1046 6.6665 14 7.56193 14 8.6665Z" stroke="#6941C6" strokeWidth="1.2"/>
        <path d="M12.005 8.6665L11.999 8.6665" stroke="#6941C6" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    );
  }
  // alert-circle (team deadline — orange / cancellation — orange)
  const stroke = badge.color === 'orange' ? '#DC6803' : '#535862';
  return (
    <svg className="shrink-0 size-[16px]" viewBox="0 0 16 16" fill="none">
      <circle cx="7.99967" cy="8.00016" r="6.66667" stroke={stroke} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M8 5.3335V8.3335" stroke={stroke} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M8 10.6587V10.6654" stroke={stroke} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function ContextualBadgeItem({ badge }: { badge: ContextualBadgeType }) {
  // Figma-exact contextual badge styling
  // Layout: px:6 pt:2 pb:3 gap:6 radius:4 clip:true strokeWeight:0.5px
  const styleMap: Record<string, { bg: string; borderColor: string; textColor: string }> = {
    red:    { bg: '#fef3f2', borderColor: '#e9eaeb', textColor: '#d92d20' },   // Seguro obrigatório
    gray:   { bg: '#ffffff', borderColor: '#e9eaeb', textColor: '#414651' },   // Seguro opcional
    green:  { bg: '#ffffff', borderColor: '#e9eaeb', textColor: '#079455' },   // Todos assegurados
    purple: { bg: '#f9f5ff', borderColor: '#e9d7fe', textColor: '#6941c6' },   // Atenção médica
    orange: { bg: '#fffaeb', borderColor: '#fef0c7', textColor: '#dc6803' },   // Equipe / Cancelamento
  };
  const s = styleMap[badge.color] || styleMap.gray;

  return (
    <div
      className="content-stretch flex gap-[6px] items-center overflow-clip pb-[3px] pt-[2px] px-[6px] rounded-[4px] shrink-0 border-[0.5px] border-solid"
      style={{ backgroundColor: s.bg, borderColor: s.borderColor }}
    >
      <BadgeIcon badge={badge} />
      <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic text-[12px] whitespace-nowrap" style={{ color: s.textColor }}>{badge.label}</p>
    </div>
  );
}

// ─── Figma-exact Status Badge Icons ────────────────────────────────────────

function StatusBadgeIcon({ icon, color }: { icon: string; color: string }) {
  // checkmark-circle-03 (Realizada)
  if (icon === 'check-circle') {
    return (
      <svg className="shrink-0 size-[16px]" viewBox="0 0 16 16" fill="none">
        <path d="M11.333 2.22505C10.3524 1.65782 9.21396 1.33317 7.99967 1.33317C4.31778 1.33317 1.33301 4.31794 1.33301 7.99984C1.33301 11.6817 4.31778 14.6665 7.99967 14.6665C11.6816 14.6665 14.6663 11.6817 14.6663 7.99984C14.6663 7.54322 14.6204 7.09732 14.533 6.6665" stroke={color} strokeWidth="1.2" strokeLinecap="round"/>
        <path d="M5.33301 8.3335C5.33301 8.3335 6.33301 8.3335 7.66634 10.6668C7.66634 10.6668 11.3722 4.55572 14.6663 3.3335" stroke={color} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    );
  }
  // share-location-01 (Em Andamento)
  if (icon === 'activity') {
    return (
      <svg className="shrink-0 size-[16px]" viewBox="0 0 16 16" fill="none">
        <path d="M8 1.3335C11.6825 1.3335 14.6667 4.31868 14.6667 8.00016C14.6667 11.6816 11.6825 14.6668 8 14.6668" stroke={color} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M5.99967 14.3332C5.20743 14.0633 4.46322 13.6736 3.81502 13.1639M3.81502 2.83574C4.46322 2.33356 5.20743 1.93633 5.99967 1.6665M1.33301 6.83058C1.47705 6.05859 1.77313 5.30908 2.19726 4.62703M1.33301 9.16909C1.47705 9.94109 1.77313 10.6906 2.19726 11.3726" stroke={color} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M8.47869 10.8101C8.3502 10.9319 8.17846 11 7.99973 11C7.821 11 7.64927 10.9319 7.52078 10.8101C6.34417 9.68779 4.76737 8.43408 5.53633 6.6139C5.9521 5.62975 6.95013 5 7.99973 5C9.04934 5 10.0474 5.62975 10.4631 6.6139C11.2311 8.43178 9.6582 9.69166 8.47869 10.8101Z" stroke={color} strokeWidth="1.2"/>
        <path d="M7.99707 7.6665H8.0013" stroke={color} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    );
  }
  // timer-02 (Não Iniciada)
  if (icon === 'timer') {
    return (
      <svg className="shrink-0 size-[16px]" viewBox="0 0 16 16" fill="none">
        <path d="M10.0003 1.3335H6.66699" stroke={color} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M2 14.6668H8.33333C11.4629 14.6668 14 12.1298 14 9.00016C14 7.43536 13.3657 6.01869 12.3403 4.99322C11.3148 3.96776 9.89814 3.3335 8.33333 3.3335C5.20372 3.3335 2.66667 5.87055 2.66667 9.00016M12.3403 4.99322L13.3333 4.00016" stroke={color} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M5.33333 12.6665H2" stroke={color} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M4 10.6665H2" stroke={color} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M8.33301 8.99984L10.6663 6.6665" stroke={color} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    );
  }
  // cancel-circle (Cancelada)
  return (
    <svg className="shrink-0 size-[16px]" viewBox="0 0 16 16" fill="none">
      <path d="M14.6663 7.99984C14.6663 4.31794 11.6816 1.33317 7.99967 1.33317C4.31778 1.33317 1.33301 4.31794 1.33301 7.99984C1.33301 11.6817 4.31778 14.6665 7.99967 14.6665C11.6816 14.6665 14.6663 11.6817 14.6663 7.99984Z" stroke={color} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M9.99957 10L6 6M6.00043 10L10 6" stroke={color} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

// ─── Figma-exact Activity Type Icons ───────────────────────────────────────

function ActivityTypeIcon({ type }: { type: string }) {
  // route-01 (multi-dias)
  if (type === 'multi-dias') {
    return (
      <svg className="shrink-0 size-[16px]" viewBox="0 0 16 16" fill="none">
        <circle cx="12" cy="3.3335" r="2" stroke="#535862" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="4" cy="12.6665" r="2" stroke="#535862" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M7.99967 3.3335H5.66634C4.37768 3.3335 3.33301 4.37817 3.33301 5.66683C3.33301 6.95549 4.37768 8.00016 5.66634 8.00016H10.333C11.6217 8.00016 12.6663 9.04483 12.6663 10.3335C12.6663 11.6222 11.6217 12.6668 10.333 12.6668H7.99967" stroke="#535862" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    );
  }
  // pin-location-01 (comum)
  return (
    <svg className="shrink-0 size-[16px]" viewBox="0 0 16 16" fill="none">
      <circle cx="7.99967" cy="4.66667" r="2.66667" stroke="#535862" strokeWidth="1.5"/>
      <path d="M8 7.3335L8 12.0002" stroke="#535862" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M10.5647 10.6665C11.6629 12.0752 12.212 12.7795 11.9243 13.3372C11.8977 13.3887 11.8666 13.4384 11.8313 13.4858C11.4482 13.9998 10.4583 13.9998 8.47852 13.9998H7.52149C5.54167 13.9998 4.55177 13.9998 4.16874 13.4858C4.13337 13.4384 4.10226 13.3887 4.0757 13.3372C3.78804 12.7795 4.33714 12.0752 5.43534 10.6665" stroke="#535862" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function DiaActivityCard({ a, onViewDetails, onGoToCheckIn }: {
  a: Activity;
  onViewDetails?: (activityId?: string) => void;
  onGoToCheckIn?: (activityId?: string) => void;
}) {
  const statusBadge = getActivityStatusBadge(a);
  const occupancy = getOccupancyDisplay(a);
  const contextualBadges = getContextualBadges(a);
  const team = getTeamDisplay(a);
  const dateDisplay = getDateDisplay(a);
  const multiDayRange = getMultiDayRange(a);

  const navigateToDetails = () => onViewDetails?.(a.id);
  const navigateToCheckIn = () => onGoToCheckIn?.(a.id);

  // Lifecycle status dot color (timeline indicator)
  const dotColorMap: Record<string, string> = {
    Realizada: '#22c55e',
    EmAndamento: '#fdb022',
    NaoIniciada: '#0b5ed7',
    Cancelada: '#e50000',
  };
  const dotColor = dotColorMap[a.lifecycleStatus] || '#0b5ed7';

  return (
    <div className="relative w-full">
      {/* Time label */}
      <div className="content-stretch flex gap-[8px] items-center mb-[12px] relative">
        <div className="rounded-[9999px] shrink-0 size-[12px]" style={{ backgroundColor: dotColor }} />
        <p className="font-['Helvetica_Neue:Medium',sans-serif] leading-[normal] not-italic text-[14px] text-[#252b37]">{a.startTime}</p>
      </div>
      {/* Card — entire surface clickable */}
      <div
        role="link"
        tabIndex={0}
        aria-label={`Abrir atividade ${a.name}`}
        onClick={navigateToDetails}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); navigateToDetails(); } }}
        className="bg-white relative rounded-[12px] w-full cursor-pointer transition-[background-color,box-shadow] duration-150 hover:shadow-[0px_4px_12px_0px_rgba(10,13,18,0.1)] hover:bg-[#fafcff] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1b71fd] border border-[#E2E8F0] border-solid"
      >
        <div className="content-stretch flex flex-col gap-[20px] relative rounded-[inherit] size-full overflow-clip pt-[20px]">
          {/* Região 1 — Cabeçalho */}
          <div className="content-stretch flex items-center justify-between px-[20px] relative shrink-0 w-full">
            <div className="content-stretch flex flex-col gap-[6px] items-start relative shrink-0 flex-1 min-w-0">
              {/* Title + status badge */}
              <div className="content-stretch flex gap-[12px] items-center relative shrink-0 flex-wrap">
                <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic text-[18px] text-[#252b37]">
                  {a.name} {occupancy.counter}
                </p>
                {/* Status badge — Figma: px:8 py:3 gap:5 radius:4 border:1px */}
                <div
                  className="content-stretch flex gap-[5px] items-center px-[8px] py-[3px] rounded-[4px] shrink-0 border border-solid"
                  style={{ backgroundColor: statusBadge.bg, borderColor: statusBadge.border }}
                >
                  <StatusBadgeIcon icon={statusBadge.icon} color={statusBadge.text} />
                  <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic text-[12px] whitespace-nowrap" style={{ color: statusBadge.text }}>{statusBadge.label}</p>
                </div>
              </div>
              {/* Subtitle: type + optional alerts */}
              <div className="content-stretch flex gap-[6px] items-center relative shrink-0">
                <ActivityTypeIcon type={a.activityType} />
                <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic text-[14px] text-[#535862]">
                  {a.activityType === 'multi-dias' ? 'Atividade multi-dias' : 'Atividade comum'}
                </p>
                {multiDayRange && (
                  <>
                    <span className="text-[#717680] text-[14px]">·</span>
                    <svg className="shrink-0 size-[16px]" viewBox="0 0 16 16" fill="none"><path d="M10.6663 1.3335V4.00016M5.33301 1.3335V4.00016" stroke="#535862" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/><path d="M8.66667 2.6665H7.33333C4.81918 2.6665 3.5621 2.6665 2.78105 3.44755C2 4.2286 2 5.48568 2 7.99984V9.33317C2 11.8473 2 13.1044 2.78105 13.8855C3.5621 14.6665 4.81918 14.6665 7.33333 14.6665H8.66667C11.1808 14.6665 12.4379 14.6665 13.219 13.8855C14 13.1044 14 11.8473 14 9.33317V7.99984C14 5.48568 14 4.2286 13.219 3.44755C12.4379 2.6665 11.1808 2.6665 8.66667 2.6665Z" stroke="#535862" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/><path d="M2 6.6665H14" stroke="#535862" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/><path d="M7.33301 9.3335H10.6663M5.33301 9.3335H5.339M8.66634 12.0002H5.33301M10.6663 12.0002H10.6604" stroke="#535862" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic text-[14px] text-[#535862]">{multiDayRange}</p>
                  </>
                )}
                {occupancy.hasExceededCapacity && (
                  <>
                    <span className="text-[#717680] text-[14px]">·</span>
                    <div className="flex gap-[6px] items-center">
                      <svg className="shrink-0 size-[16px]" viewBox="0 0 16 16" fill="none"><circle cx="7.99967" cy="8.00016" r="6.66667" stroke="#535862" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M8 5.3335V8.3335" stroke="#535862" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M8 10.6587V10.6654" stroke="#535862" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic text-[14px] text-[#535862]">Vagas excedidas</p>
                    </div>
                  </>
                )}
              </div>
            </div>
            {/* Arrow icon button — matches Figma: 32x32, border #E2E8F0, radius 6, padding 8 */}
            <button
              type="button"
              aria-label={`Abrir atividade ${a.name}`}
              onClick={(e) => { e.stopPropagation(); navigateToDetails(); }}
              className="bg-white shrink-0 size-[32px] flex items-center justify-center rounded-[6px] cursor-pointer hover:bg-[#f1f5f9] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1b71fd] relative"
            >
              <div aria-hidden="true" className="absolute border border-[#E2E8F0] border-solid inset-0 pointer-events-none rounded-[6px]" />
              <svg className="size-[16px] relative" fill="none" viewBox="0 0 16 16">
                <path d="M4.667 11.333L11.333 4.667M11.333 4.667H6M11.333 4.667V10" stroke="#535862" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
          {/* Região 2 — Metadados (Figma-exact icons) */}
          <div className="content-stretch flex gap-[32px] items-center px-[20px] relative shrink-0 w-full">
            <InfoField
              icon={<svg className="block size-full" viewBox="0 0 20 20" fill="none"><path d="M13.3337 1.6665V4.99984M6.66699 1.6665L6.66699 4.99984" stroke="#535862" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M17.5 11.6668V10.0002C17.5 6.85747 17.5 5.28612 16.5237 4.30981C15.5474 3.3335 13.976 3.3335 10.8333 3.3335L9.16667 3.3335C6.02397 3.3335 4.45262 3.3335 3.47631 4.30981C2.5 5.28612 2.5 6.85747 2.5 10.0002L2.5 11.6668C2.5 14.8095 2.5 16.3809 3.47631 17.3572C4.45262 18.3335 6.02397 18.3335 9.16667 18.3335H10" stroke="#535862" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M2.5 8.3335L17.5 8.3335" stroke="#535862" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M15.0876 12.9212L15.6008 13.9563C15.6708 14.1003 15.8575 14.2385 16.015 14.265L16.9453 14.4208C17.5402 14.5208 17.6802 14.956 17.2515 15.3853L16.5282 16.1145C16.4057 16.238 16.3387 16.4762 16.3766 16.6468L16.5836 17.5495C16.747 18.264 16.3707 18.5404 15.7437 18.167L14.8717 17.6465C14.7143 17.5524 14.4547 17.5524 14.2943 17.6465L13.4223 18.167C12.7982 18.5404 12.4191 18.2611 12.5824 17.5495L12.7895 16.6468C12.8274 16.4762 12.7603 16.238 12.6378 16.1145L11.9146 15.3853C11.4888 14.956 11.6259 14.5208 12.2208 14.4208L13.1511 14.265C13.3057 14.2385 13.4923 14.1003 13.5623 13.9563L14.0756 12.9212C14.3556 12.3596 14.8105 12.3596 15.0876 12.9212Z" stroke="#535862" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
              label="Data da atividade"
              value={dateDisplay}
            />
            <div className="bg-[#f5f5f5] self-stretch shrink-0 w-px" />
            <InfoField
              icon={<svg className="block size-full" viewBox="0 0 20 20" fill="none"><path d="M10.0003 18.3332C14.6027 18.3332 18.3337 14.6022 18.3337 9.99984C18.3337 5.39746 14.6027 1.6665 10.0003 1.6665C5.39795 1.6665 1.66699 5.39746 1.66699 9.99984C1.66699 14.6022 5.39795 18.3332 10.0003 18.3332Z" stroke="#535862" strokeWidth="1.5"/><path d="M10.0068 8.75682C9.31648 8.75682 8.75684 9.31646 8.75684 10.0068C8.75684 10.6972 9.31648 11.2568 10.0068 11.2568C10.6972 11.2568 11.2568 10.6972 11.2568 10.0068C11.2568 9.31646 10.6972 8.75682 10.0068 8.75682ZM10.0068 8.75682V5.83252M12.5126 12.5165L10.8887 10.8927" stroke="#535862" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
              label="Hora da atividade"
              value={`${a.startTime} - ${a.endTime} (${a.timezone})`}
            />
            <div className="bg-[#f5f5f5] self-stretch shrink-0 w-px" />
            <InfoField
              icon={<svg className="block size-full" viewBox="0 0 20 20" fill="none"><path d="M6.25 16.2502C6.25 15.4455 6.52378 14.6315 7.19243 14.1838C7.99435 13.6469 8.96035 13.3335 10 13.3335C11.0397 13.3335 12.0057 13.6469 12.8076 14.1838C13.4762 14.6315 13.75 15.4455 13.75 16.2502" stroke="#535862" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><circle cx="9.99935" cy="9.16683" r="2.08333" stroke="#535862" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M14.583 9.1665C15.5081 9.1665 16.3676 9.48057 17.0809 10.0185C17.6855 10.4745 17.9163 11.2458 17.9163 12.003V12.0832" stroke="#535862" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><circle cx="14.5827" cy="5.41667" r="1.66667" stroke="#535862" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M5.41634 9.1665C4.49123 9.1665 3.63173 9.48057 2.91847 10.0185C2.31389 10.4745 2.08301 11.2458 2.08301 12.003V12.0832" stroke="#535862" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><circle cx="5.41667" cy="5.41667" r="1.66667" stroke="#535862" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
              label="Participantes"
              value={a.occupancy > 0 ? `${a.occupancy} participante${a.occupancy > 1 ? 's' : ''}` : 'Nenhum participante'}
            />
            <div className="bg-[#f5f5f5] self-stretch shrink-0 w-px" />
            <InfoField
              icon={<svg className="block size-full" viewBox="0 0 20 20" fill="none"><path d="M6.25 16.2502C6.25 15.4455 6.52378 14.6315 7.19243 14.1838C7.99435 13.6469 8.96035 13.3335 10 13.3335C11.0397 13.3335 12.0057 13.6469 12.8076 14.1838C13.4762 14.6315 13.75 15.4455 13.75 16.2502" stroke="#535862" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><circle cx="9.99935" cy="9.16683" r="2.08333" stroke="#535862" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M14.583 9.1665C15.5081 9.1665 16.3676 9.48057 17.0809 10.0185C17.6855 10.4745 17.9163 11.2458 17.9163 12.003V12.0832" stroke="#535862" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><circle cx="14.5827" cy="5.41667" r="1.66667" stroke="#535862" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M5.41634 9.1665C4.49123 9.1665 3.63173 9.48057 2.91847 10.0185C2.31389 10.4745 2.08301 11.2458 2.08301 12.003V12.0832" stroke="#535862" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><circle cx="5.41667" cy="5.41667" r="1.66667" stroke="#535862" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
              label="Equipe responsável"
              value={team.label}
              valueColor={team.color}
            />
          </div>
          {/* Região 3 — Faixa de badges contextuais */}
          <div className="bg-[#fafafa] content-stretch flex gap-[12px] items-center px-[20px] py-[12px] relative rounded-b-[12px] shrink-0 w-full">
            {contextualBadges.map((badge) => (
              <ContextualBadgeItem key={badge.type} badge={badge} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function DiaEmptyState({ onBack }: { onBack?: () => void }) {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-center justify-center py-[80px] relative w-full">
      <svg className="size-[64px]" fill="none" viewBox="0 0 64 64"><circle cx="32" cy="32" r="28" stroke="#e2e8f0" strokeWidth="2"/><path d="M22 28h20M22 36h12" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round"/></svg>
      <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic text-[16px] text-[#717680] text-center">Não há atividades agendadas para este dia</p>
      {onBack && (
        <button onClick={onBack} className="bg-white border border-[#e2e8f0] border-solid cursor-pointer font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic px-[16px] py-[10px] rounded-[8px] text-[14px] text-[#414651] hover:bg-[#f8fafc] transition-colors">
          Voltar para o calendário
        </button>
      )}
    </div>
  );
}

export default function AgendaAtividadesDoDia({ day, onBackToAgenda, onViewDetails, onGoToCheckIn }: {
  day?: number;
  onBackToAgenda?: () => void;
  onViewDetails?: (activityId?: string) => void;
  onGoToCheckIn?: (activityId?: string) => void;
}) {
  const refDay = day ?? 11;
  const today = new Date();
  const dateObj = new Date(today.getFullYear(), today.getMonth(), refDay);
  const iso = format(dateObj, "yyyy-MM-dd");
  const holiday = DIA_HOLIDAYS[iso];

  const dayActivities = useMemo(
    () => mockActivities.filter((a) => a.date === iso).sort((a, b) => a.startTime.localeCompare(b.startTime)),
    [iso]
  );

  // Cards are no longer expandable/collapsible — always show full info

  const formattedDate = format(dateObj, "dd/MM/yyyy");
  const monthAbbr = format(dateObj, "MMM", { locale: ptBR }).toUpperCase().replace(".", "");
  const holidayText = holiday ? `(${holiday})` : "(Sem feriados)";

  return (
    <div className="bg-[#f8fafc] relative size-full overflow-auto" data-name="AGENDA - ATIVIDADES DO DIA">
      <TopBar />
      {/* Header */}
      <div className="absolute content-stretch flex gap-[24px] items-end justify-between left-[248px] right-[24px] top-[148px]">
        <div className="content-stretch flex gap-[16px] items-center relative shrink-0">
          {/* Date icon */}
          <div className="bg-white relative rounded-[10px] shrink-0 border border-[#E2E8F0] border-solid overflow-clip">
            <div className="bg-[#f1f5f9] content-stretch flex items-center justify-center px-[12px] py-[2px] relative shrink-0 w-full">
              <p className="font-['Helvetica_Neue:Medium',sans-serif] leading-[normal] not-italic text-[10px] text-[#62748e] tracking-[0.5px]">{monthAbbr}</p>
            </div>
            <div className="content-stretch flex items-center justify-center px-[12px] py-[4px] relative shrink-0 w-full">
              <p className="font-['Helvetica_Neue:Medium',sans-serif] leading-[normal] not-italic text-[20px] text-[#0b5ed7]">{refDay}</p>
            </div>
          </div>
          {/* Title */}
          <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0">
            <div className="content-stretch flex gap-[12px] items-center relative shrink-0">
              <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic text-[24px] text-[#0f172b]">Atividades do dia</p>
              <div className="bg-[#f04438] rounded-[8px] shrink-0">
                <div className="content-stretch flex items-center justify-center px-[8px] py-[2px] relative size-full">
                  <p className="font-['Helvetica_Neue:Medium',sans-serif] leading-[normal] not-italic text-[12px] text-white">{dayActivities.length}</p>
                </div>
              </div>
            </div>
            <div className="flex gap-[6px] items-center">
              <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic text-[14px] text-[#181d27]">{formattedDate}</p>
              <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic text-[14px] text-[#62748e]">{holidayText}</p>
            </div>
          </div>
        </div>
        {/* Header buttons */}
        <div className="content-stretch flex gap-[16px] items-center relative shrink-0">
          <div className="bg-white relative rounded-[8px] shrink-0">
            <div aria-hidden="true" className="absolute border border-[#e2e8f0] border-solid inset-0 pointer-events-none rounded-[8px]" />
            <div className="content-stretch flex gap-[8px] items-center justify-center px-[16px] py-[10px] relative size-full">
              <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic text-[14px] text-[#414651] whitespace-nowrap">Ficha de Operação</p>
            </div>
          </div>
          <div className="relative rounded-[8px] shrink-0" style={{ backgroundImage: "linear-gradient(rgb(11,94,215), rgb(8,79,183))" }}>
            <div className="content-stretch flex gap-[8px] items-center justify-center px-[16px] py-[10px] relative size-full">
              <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic text-[14px] text-white whitespace-nowrap">Concluir Atividades do Dia</p>
            </div>
          </div>
        </div>
      </div>
      {/* Divider */}
      <div className="absolute bg-[#e9eaeb] h-px left-[248px] right-[24px] top-[234px]" />
      {/* Activity cards */}
      <div className="absolute left-[248px] right-[24px] top-[258px]" style={{ paddingBottom: "40px" }}>
        {dayActivities.length === 0 ? (
          <DiaEmptyState onBack={onBackToAgenda} />
        ) : (
          <div className="content-stretch flex flex-col gap-[24px] items-start relative w-full">
            {dayActivities.map((a) => (
              <DiaActivityCard
                key={a.id}
                a={a}
                onViewDetails={onViewDetails}
                onGoToCheckIn={onGoToCheckIn}
              />
            ))}
          </div>
        )}
      </div>
      {/* Breadcrumb */}
      <div className="absolute content-stretch flex gap-[10px] items-center left-[248px] top-[112px]" data-name="Breadcrumb">
        <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic text-[#71717a] text-[14px] whitespace-nowrap">Início</p>
        <DiaChevron />
        <button onClick={onBackToAgenda} className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic text-[#71717a] text-[14px] whitespace-nowrap cursor-pointer hover:text-[#09090b] transition-colors">Agenda</button>
        <DiaChevron />
        <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic text-[#09090b] text-[14px] whitespace-nowrap">Atividades do Dia</p>
      </div>
      {/* Sidebar */}
      <div className="fixed bg-white content-stretch flex flex-col h-[745px] items-start left-[24px] rounded-[16px] top-[24px] w-[200px] z-20" data-name="Sidebar - Admin">
        <div aria-hidden="true" className="absolute border border-[#fafafa] border-solid inset-0 pointer-events-none rounded-[16px] shadow-[0px_1px_3px_0px_rgba(10,13,18,0.1),0px_1px_2px_0px_rgba(10,13,18,0.1)]" />
        <Container15 />
        <PrimitiveDiv />
        <div className="content-stretch flex h-[85px] items-center justify-center pb-[24px] pt-[21px] px-[20px] relative rounded-bl-[16px] rounded-br-[16px] shrink-0 w-[200px]" data-name="User component">
          <div aria-hidden="true" className="absolute border-[#f5f5f5] border-solid border-t inset-0 pointer-events-none rounded-bl-[16px] rounded-br-[16px]" />
          <Frame19 />
        </div>
      </div>
    </div>
  );
}
