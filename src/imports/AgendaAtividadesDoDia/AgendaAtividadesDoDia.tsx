import { useState, useMemo } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import svgPaths from "./svg-qtw4au3g97";
import imgTopBar from "./4a664b1820bfb04f20dc4f636db105ede4311f14.png";
import imgAvatar from "./87b552f8867f96fa4d2ca833ef943c5aa1ab172b.png";
import { mockActivities, allHolidays } from "../../mocks/agenda";
import type { Activity, ActivityStatus } from "../../types/agenda";

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
      <div className="content-stretch flex flex-col font-['Helvetica_Neue:Regular',sans-serif] gap-[6px] items-start justify-center leading-[normal] not-italic relative shrink-0">
        <p className="relative shrink-0 text-[#62748e] text-[12px]">{label}</p>
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
  return (
    <div className="absolute content-stretch flex gap-[24px] items-center pl-[248px] pr-[24px] py-[24px] left-0 right-0 top-0" data-name="TopBar">
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
    <div className="content-stretch flex font-['Helvetica_Neue:Regular',sans-serif] gap-[5px] items-center leading-[0] not-italic relative shrink-0 text-[#252b37] text-[18px] whitespace-nowrap">
      <div className="flex flex-col justify-center relative shrink-0">
        <p className="leading-[normal]">Trilha Pico do Itambé</p>
      </div>
      <div className="flex flex-col justify-center relative shrink-0">
        <p className="leading-[normal]">(0/0)</p>
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
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0 text-[14px]">
      <p className="relative shrink-0 text-[#252b37]">24/02/2026</p>
      <p className="relative shrink-0 text-[#717680]">(Dia 3 de 5)</p>
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
    <div className="content-stretch flex gap-[6px] items-start relative shrink-0 text-[14px] w-full whitespace-nowrap">
      <p className="relative shrink-0 text-[#252b37]">08:00 - 11:00</p>
      <p className="relative shrink-0 text-[#717680]">(GMT+5:30)</p>
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
    <div className="content-stretch flex font-['Helvetica_Neue:Regular',sans-serif] gap-[5px] items-center not-italic relative shrink-0 text-[#252b37] text-[18px] whitespace-nowrap">
      <p className="leading-[normal] relative shrink-0">Trilha Pico do Itacolomi</p>
      <div className="flex flex-col justify-center leading-[0] relative shrink-0">
        <p className="leading-[normal]">(220/200)</p>
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
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0 text-[14px]">
      <p className="relative shrink-0 text-[#252b37]">26/02/2026</p>
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
    <div className="content-stretch flex gap-[6px] items-start relative shrink-0 text-[14px] w-full whitespace-nowrap">
      <p className="relative shrink-0 text-[#252b37]">08:00- 11:00</p>
      <p className="relative shrink-0 text-[#717680]">(GMT+5:30)</p>
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

const DIA_STATUS_CONFIG: Record<ActivityStatus, { label: string; bg: string; border: string; text: string; dotColor: string }> = {
  confirmed: { label: "Atividade Não Iniciada", bg: "#fafafa", border: "#f5f5f5", text: "#535862", dotColor: "#22c55e" },
  pending:   { label: "Atividade em Andamento", bg: "#fffaeb", border: "#fef0c7", text: "#dc6803", dotColor: "#fdb022" },
  full:      { label: "Atividade Não Iniciada", bg: "#fafafa", border: "#f5f5f5", text: "#535862", dotColor: "#e50000" },
  blocked:   { label: "Atividade Cancelada", bg: "#fef3f2", border: "#fee4e2", text: "#d92d20", dotColor: "#838891" },
};

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

function DiaActivityCard({ a, expanded, onToggle, onViewDetails, onGoToCheckIn }: {
  a: Activity; expanded: boolean;
  onToggle: () => void; onViewDetails?: (activityId?: string) => void; onGoToCheckIn?: (activityId?: string) => void;
}) {
  const cfg = DIA_STATUS_CONFIG[a.status];
  const isFull = a.status === "full";
  const isBlocked = a.status === "blocked";
  const isMultiDay = !!a.dayNumber && !!a.totalDays;

  return (
    <div className="relative w-full">
      {/* Time label */}
      <div className="content-stretch flex gap-[8px] items-center mb-[12px] relative">
        <div className="rounded-[9999px] shrink-0 size-[12px]" style={{ backgroundColor: cfg.dotColor }} />
        <p className="font-['Helvetica_Neue:Medium',sans-serif] leading-[normal] not-italic text-[14px] text-[#252b37]">{a.startTime}</p>
      </div>
      {/* Card */}
      <div className="bg-white relative rounded-[16px] w-full">
        <div aria-hidden="true" className="absolute border border-[#e9eaeb] border-solid inset-0 pointer-events-none rounded-[16px] shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)]" />
        <div className="content-stretch flex flex-col relative rounded-[inherit] size-full">
          {/* Card header */}
          <div className="content-stretch flex items-center justify-between px-[24px] py-[16px] relative shrink-0 w-full">
            <div className="content-stretch flex flex-col gap-[6px] items-start relative shrink-0">
              <div className="content-stretch flex gap-[12px] items-center relative shrink-0">
                <p className="font-['Helvetica_Neue:Medium',sans-serif] leading-[normal] not-italic text-[18px] text-[#181d27]">
                  {a.name} ({a.occupancy}/{a.capacity})
                </p>
                {/* Status badge */}
                <div className="rounded-[999px] shrink-0" style={{ backgroundColor: cfg.bg }}>
                  <div aria-hidden="true" className="absolute border border-solid inset-0 pointer-events-none rounded-[999px]" style={{ borderColor: cfg.border, position: "relative" }} />
                  <div className="content-stretch flex gap-[4px] items-center px-[10px] py-[2px] relative size-full">
                    <div className="rounded-[9999px] shrink-0 size-[8px]" style={{ backgroundColor: cfg.text }} />
                    <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic text-[12px] whitespace-nowrap" style={{ color: cfg.text }}>{cfg.label}</p>
                  </div>
                </div>
              </div>
              {/* Sub-info */}
              <div className="content-stretch flex gap-[8px] items-center relative shrink-0">
                <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic text-[13px] text-[#535862]">
                  {isMultiDay ? "Atividade multi-dias" : "Atividade comum"}
                </p>
                {isFull && (
                  <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic text-[13px] text-[#dc6803]">· Vagas excedidas</p>
                )}
              </div>
            </div>
            {/* Actions */}
            <div className="content-stretch flex gap-[12px] items-center relative shrink-0">
              <button
                onClick={() => onViewDetails?.(a.id)}
                className="bg-white relative rounded-[8px] shrink-0 cursor-pointer hover:bg-[#f8fafc] transition-colors"
              >
                <div aria-hidden="true" className="absolute border border-[#e2e8f0] border-solid inset-0 pointer-events-none rounded-[8px]" />
                <div className="content-stretch flex gap-[8px] items-center justify-center px-[16px] py-[10px] relative size-full">
                  <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic text-[14px] text-[#414651] whitespace-nowrap">Ver Detalhes</p>
                </div>
              </button>
              {!isBlocked && (
                <button
                  onClick={() => onGoToCheckIn?.(a.id)}
                  className="bg-[#edf0ff] relative rounded-[8px] shrink-0 cursor-pointer hover:bg-[#d5dcfe] transition-colors"
                >
                  <div className="content-stretch flex gap-[8px] items-center justify-center px-[16px] py-[10px] relative size-full">
                    <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic text-[14px] text-[#1b71fd] whitespace-nowrap">Ir para Check-In</p>
                  </div>
                </button>
              )}
              <button onClick={onToggle} className="cursor-pointer shrink-0 size-[24px] relative">
                <svg className="block size-full" fill="none" viewBox="0 0 24 24">
                  <path d={expanded ? "M18 15L12 9L6 15" : "M6 9L12 15L18 9"} stroke="#717680" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                </svg>
              </button>
            </div>
          </div>
          {/* Expanded details */}
          {expanded && (
            <>
              <div className="border-t border-[#e9eaeb] mx-[24px]" />
              <div className="content-stretch flex gap-[24px] items-start px-[24px] py-[16px] relative shrink-0 w-full">
                <InfoField
                  icon={<svg className="block size-full" fill="none" viewBox="0 0 20 20"><rect x="2" y="2" width="16" height="16" rx="4" stroke="#535862" strokeWidth="1.5"/><path d="M2 8h16" stroke="#535862" strokeWidth="1.5"/><path d="M7 1v3M13 1v3" stroke="#535862" strokeWidth="1.5" strokeLinecap="round"/></svg>}
                  label="Data da atividade"
                  value={isMultiDay ? `${format(new Date(a.date), "dd/MM/yyyy")} (Dia ${a.dayNumber} de ${a.totalDays})` : format(new Date(a.date), "dd/MM/yyyy")}
                />
                <div className="bg-[#e9eaeb] h-[40px] shrink-0 w-px" />
                <InfoField
                  icon={<svg className="block size-full" fill="none" viewBox="0 0 20 20"><circle cx="10" cy="10" r="8" stroke="#535862" strokeWidth="1.5"/><path d="M10 6v4l3 2" stroke="#535862" strokeWidth="1.5" strokeLinecap="round"/></svg>}
                  label="Hora da atividade"
                  value={`${a.startTime} - ${a.endTime}`}
                />
                <div className="bg-[#e9eaeb] h-[40px] shrink-0 w-px" />
                <InfoField
                  icon={<svg className="block size-full" fill="none" viewBox="0 0 20 20"><circle cx="7" cy="7" r="3" stroke="#535862" strokeWidth="1.5"/><circle cx="14" cy="7" r="3" stroke="#535862" strokeWidth="1.5"/><path d="M1 17c0-3 3-5 6-5s6 2 6 5" stroke="#535862" strokeWidth="1.5" strokeLinecap="round"/></svg>}
                  label="Participantes"
                  value={a.occupancy > 0 ? `${a.occupancy} participantes` : "Nenhum participante"}
                />
                <div className="bg-[#e9eaeb] h-[40px] shrink-0 w-px" />
                <InfoField
                  icon={<svg className="block size-full" fill="none" viewBox="0 0 20 20"><circle cx="7" cy="7" r="3" stroke="#535862" strokeWidth="1.5"/><circle cx="14" cy="7" r="3" stroke="#535862" strokeWidth="1.5"/><path d="M1 17c0-3 3-5 6-5s6 2 6 5" stroke="#535862" strokeWidth="1.5" strokeLinecap="round"/></svg>}
                  label="Equipe responsável"
                  value={a.guideName || "Sem equipe atribuída"}
                  valueColor={a.guideName ? "#252b37" : "#dc6803"}
                />
              </div>
            </>
          )}
          {/* Alert badges footer */}
          <div className="bg-[#fafafa] border-t border-[#e9eaeb] content-stretch flex gap-[16px] items-center px-[24px] py-[10px] relative rounded-b-[16px] shrink-0 w-full">
            {a.requiresInsurance ? (
              <div className="flex gap-[6px] items-center shrink-0">
                <svg className="shrink-0 size-[14px]" fill="none" viewBox="0 0 14 14"><path d="M7 1l5 2v4c0 3-2.5 5-5 6-2.5-1-5-3-5-6V3l5-2z" stroke="#F04438" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic text-[12px] text-[#d92d20]">Seguro obrigatório</p>
              </div>
            ) : (
              <div className="flex gap-[6px] items-center shrink-0">
                <svg className="shrink-0 size-[14px]" fill="none" viewBox="0 0 14 14"><path d="M7 1l5 2v4c0 3-2.5 5-5 6-2.5-1-5-3-5-6V3l5-2z" stroke="#414651" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic text-[12px] text-[#414651]">Seguro opcional</p>
              </div>
            )}
            {!a.guideName && (
              <div className="flex gap-[6px] items-center shrink-0">
                <svg className="shrink-0 size-[14px]" fill="none" viewBox="0 0 14 14"><circle cx="7" cy="7" r="6" stroke="#DC6803" strokeWidth="1.2"/><path d="M7 4v3M7 9v.5" stroke="#DC6803" strokeWidth="1.2" strokeLinecap="round"/></svg>
                <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic text-[12px] text-[#dc6803]">Equipe responsável deve ser atribuída</p>
              </div>
            )}
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

  const [expandedIds, setExpandedIds] = useState<Set<string>>(() => {
    // First 2 cards expanded by default (matching Figma)
    const initial = new Set<string>();
    dayActivities.slice(0, 2).forEach((a) => initial.add(a.id));
    return initial;
  });

  const toggleCard = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

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
          <div className="bg-white relative rounded-[10px] shrink-0">
            <div aria-hidden="true" className="absolute border border-[#e2e8f0] border-solid inset-0 pointer-events-none rounded-[10px]" />
            <div className="content-stretch flex flex-col items-center overflow-clip relative rounded-[inherit] size-full">
              <div className="bg-[#f1f5f9] content-stretch flex items-center justify-center px-[12px] py-[2px] relative shrink-0 w-full">
                <p className="font-['Helvetica_Neue:Medium',sans-serif] leading-[normal] not-italic text-[10px] text-[#62748e] tracking-[0.5px]">{monthAbbr}</p>
              </div>
              <div className="content-stretch flex items-center justify-center px-[12px] py-[4px] relative shrink-0 w-full">
                <p className="font-['Helvetica_Neue:Medium',sans-serif] leading-[normal] not-italic text-[20px] text-[#0b5ed7]">{refDay}</p>
              </div>
            </div>
          </div>
          {/* Title */}
          <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0">
            <div className="content-stretch flex gap-[12px] items-center relative shrink-0">
              <p className="font-['Helvetica_Neue:Medium',sans-serif] leading-[normal] not-italic text-[24px] text-[#0f172b]">Atividades do dia</p>
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
                expanded={expandedIds.has(a.id)}
                onToggle={() => toggleCard(a.id)}
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