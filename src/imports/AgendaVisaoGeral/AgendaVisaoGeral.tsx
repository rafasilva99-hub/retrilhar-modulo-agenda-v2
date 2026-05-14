import svgPaths from "./svg-3hal38zdc4";
import imgTopBar from "./4a664b1820bfb04f20dc4f636db105ede4311f14.png";
import { mockActivities } from "../../mocks/agenda";

// Module-level activity data — set by the export component, read by static sub-components
let _dynActName = "Trilha Pico do Itacolomi";
let _dynActDate = "18/02/2026, 08:00";
let _dynActDuration = "08:00 - 11:00 (2h)";

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
    <div className="bg-white content-stretch drop-shadow-[0px_1px_1px_rgba(10,13,18,0.05)] flex gap-[8px] items-center px-[17px] py-[18px] relative rounded-[16px] shrink-0 w-[866.566px]" data-name="Search bar">
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

function SlotClone() {
  return (
    <div className="bg-white content-stretch drop-shadow-[0px_1px_1px_rgba(10,13,18,0.05)] flex items-center p-[10px] relative rounded-[16px] shrink-0" data-name="SlotClone">
      <div aria-hidden="true" className="absolute border border-[#f5f5f5] border-solid inset-0 pointer-events-none rounded-[16px]" />
      <div className="relative rounded-[9999px] shrink-0 size-[35.998px]" data-name="Notification component">
        <div className="-translate-x-1/2 -translate-y-1/2 absolute left-1/2 size-[24px] top-1/2" data-name="notification-01">
          <Elements1 />
        </div>
        <App />
      </div>
    </div>
  );
}

function Container() {
  return <div className="absolute h-0 left-[1333.36px] top-[51.99px] w-[23.993px]" data-name="Container" />;
}

function TopBar() {
  return (
    <div className="absolute content-stretch flex gap-[24px] items-center pl-[248px] pr-[24px] py-[24px] left-0 right-0 top-0" data-name="TopBar">
      <SearchBar />
      <TopBar1 />
      <SlotClone />
      <Container />
    </div>
  );
}

function Elements2() {
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

function Frame40() {
  return (
    <div className="content-stretch flex gap-[6px] items-center relative shrink-0 w-full">
      <div className="overflow-clip relative shrink-0 size-[16px]" data-name="location-04">
        <Elements2 />
      </div>
      <p className="flex-[1_0_0] font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] min-w-px not-italic relative text-[#535862] text-[14px]">Parque Municipal, Sabará - Belo Horizonte</p>
    </div>
  );
}

function Container1() {
  return (
    <div className="flex-[1_0_0] min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[6px] items-start relative size-full">
        <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#0f172b] text-[20px] whitespace-nowrap">{_dynActName}</p>
        <Frame40 />
      </div>
    </div>
  );
}

function DashboardContent() {
  return (
    <div className="relative shrink-0 w-full" data-name="DashboardContent">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex gap-[12px] items-center justify-center relative size-full">
          <Container1 />
        </div>
      </div>
    </div>
  );
}

function Elements3() {
  return (
    <div className="absolute inset-[8.33%_12.5%]" data-name="elements">
      <div className="absolute inset-[-4.5%_-5%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16.5 18.1667">
          <g id="elements">
            <path d={svgPaths.p3f24a500} id="Vector" stroke="var(--stroke-0, #535862)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            <path d={svgPaths.p14c0c180} id="Vector 9260" stroke="var(--stroke-0, #535862)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            <path d="M0.750001 7.41667H15.75" id="Vector 4046" stroke="var(--stroke-0, #535862)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            <path d={svgPaths.p221b4700} id="Vector_2" stroke="var(--stroke-0, #535862)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Frame16() {
  return (
    <div className="bg-[#fafafa] content-stretch flex items-center p-[6px] relative rounded-[8px] shrink-0">
      <div aria-hidden="true" className="absolute border border-[#f5f5f5] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="relative shrink-0 size-[20px]" data-name="calendar-time">
        <Elements3 />
      </div>
    </div>
  );
}

function Frame58() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0 text-[14px]">
      <p className="relative shrink-0 text-[#252b37]">{_dynActDate}</p>
      <p className="relative shrink-0 text-[#717680]">(GMT+5:30)</p>
    </div>
  );
}

function Frame15() {
  return (
    <div className="content-stretch flex flex-col font-['Helvetica_Neue:Regular',sans-serif] gap-[2px] items-start leading-[normal] not-italic relative shrink-0 whitespace-nowrap">
      <p className="relative shrink-0 text-[#535862] text-[12px]">Data / hora da atividade</p>
      <Frame58 />
    </div>
  );
}

function Frame21() {
  return (
    <div className="content-stretch flex gap-[10px] items-start relative rounded-[8px] shrink-0">
      <Frame16 />
      <Frame15 />
    </div>
  );
}

function Frame17() {
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

function Frame18() {
  return (
    <div className="content-stretch flex flex-col font-['Helvetica_Neue:Regular',sans-serif] gap-[2px] items-start leading-[normal] not-italic relative shrink-0 whitespace-nowrap">
      <p className="relative shrink-0 text-[#535862] text-[12px]">Duração da atividade</p>
      <p className="relative shrink-0 text-[#252b37] text-[14px]">{_dynActDuration}</p>
    </div>
  );
}

function Frame19() {
  return (
    <div className="content-stretch flex gap-[10px] items-start relative rounded-[8px] shrink-0">
      <Frame17 />
      <Frame18 />
    </div>
  );
}

function Frame20() {
  return (
    <div className="content-stretch flex gap-[24px] items-center relative shrink-0 w-full">
      <Frame21 />
      <Frame19 />
    </div>
  );
}

function Frame62() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full">
      <DashboardContent />
      <div className="h-0 relative shrink-0 w-full">
        <div className="absolute inset-[-1px_0_0_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 478 1">
            <line id="Line 1" stroke="var(--stroke-0, #F5F5F5)" x2="478" y1="0.5" y2="0.5" />
          </svg>
        </div>
      </div>
      <Frame20 />
    </div>
  );
}

function Frame57() {
  return (
    <div className="bg-white border border-[#f5f5f5] border-solid content-stretch flex flex-col gap-[12px] items-start p-[24px] relative rounded-[16px] w-full">
      <p className="font-['Helvetica_Neue:Medium',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#62748e] text-[12px] w-full">ESPECIFICAÇÕES DA ATIVIDADE</p>
      <Frame62 />
    </div>
  );
}

function Elements4() {
  return (
    <div className="absolute inset-[8.33%]" data-name="elements">
      <div className="absolute inset-[-4.5%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14.5333 14.5333">
          <g id="elements">
            <circle cx="7.26667" cy="7.26667" id="Ellipse 1112" r="6.66667" stroke="var(--stroke-0, #717680)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" />
            <path d="M7.26667 9.93333V6.93333" id="Vector" stroke="var(--stroke-0, #717680)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" />
            <path d="M7.26667 4.60781V4.60115" id="Vector_2" stroke="var(--stroke-0, #717680)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Frame38() {
  return (
    <div className="content-stretch flex gap-[6px] items-center relative shrink-0">
      <div className="flex flex-col font-['Helvetica_Neue:Medium',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#62748e] text-[12px] whitespace-nowrap">
        <p className="leading-[normal]">PREVISÃO CLIMÁTICA</p>
      </div>
      <div className="relative shrink-0 size-[16px]" data-name="information-circle">
        <Elements4 />
      </div>
    </div>
  );
}

function Elements5() {
  return (
    <div className="absolute inset-[12.5%_8.33%]" data-name="elements">
      <div className="absolute inset-[-3.33%_-3%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 26.5002 24.0002">
          <g id="elements">
            <path d={svgPaths.p2afd6400} id="Vector" stroke="var(--stroke-0, #F8A12E)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            <path d={svgPaths.p2464ac80} id="Vector_2" stroke="var(--stroke-0, #F8A12E)" strokeLinecap="round" strokeWidth="1.5" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Container3() {
  return (
    <div className="bg-[#fff7ed] relative rounded-[12px] shrink-0 size-[60px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#ffd6a8] border-[1.25px] border-solid inset-0 pointer-events-none rounded-[12px] shadow-[0px_0.75px_2.25px_0px_rgba(0,0,0,0.1),0px_0.75px_1.5px_0px_rgba(0,0,0,0.1)]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <div className="-translate-x-1/2 -translate-y-1/2 absolute left-1/2 overflow-clip size-[30px] top-[calc(50%+0.01px)]" data-name="sun-cloud-02">
          <Elements5 />
        </div>
      </div>
    </div>
  );
}

function Container5() {
  return (
    <div className="content-stretch flex gap-[4px] items-start leading-[0] relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col justify-center relative shrink-0 text-[#0f172b] text-[36px] tracking-[-0.72px] whitespace-nowrap">
        <p className="leading-[normal]">26</p>
      </div>
      <div className="flex flex-col h-[34px] justify-center relative shrink-0 text-[#90a1b9] text-[20px] w-[23px]">
        <p className="leading-[normal]">°C</p>
      </div>
    </div>
  );
}

function Frame3() {
  return (
    <div className="content-stretch flex gap-[4px] items-center leading-[normal] relative shrink-0 text-[12px] whitespace-nowrap">
      <p className="relative shrink-0 text-[#62748e]">Sensação térmica:</p>
      <p className="relative shrink-0 text-[#314158]">28°C</p>
    </div>
  );
}

function Container4() {
  return (
    <div className="flex-[1_0_0] min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col font-['Helvetica_Neue:Regular',sans-serif] gap-[4px] items-start not-italic relative size-full">
        <Container5 />
        <Frame3 />
      </div>
    </div>
  );
}

function Container2() {
  return (
    <div className="flex-[1_0_0] min-w-px relative" data-name="Container">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[16px] items-center relative size-full">
          <Container3 />
          <Container4 />
        </div>
      </div>
    </div>
  );
}

function Container6() {
  return (
    <div className="content-stretch flex flex-col font-['Helvetica_Neue:Regular',sans-serif] h-[66px] items-end justify-between leading-[0] not-italic relative shrink-0 text-[#62748e] text-[0px] text-right whitespace-nowrap" data-name="Container">
      <p className="relative shrink-0">
        <span className="leading-[normal] text-[12px]">{`💧 Umidade: `}</span>
        <span className="leading-[normal] text-[#314158] text-[12px]">65%</span>
      </p>
      <p className="relative shrink-0">
        <span className="leading-[normal] text-[12px]">{`💨 Vento: `}</span>
        <span className="leading-[normal] text-[#314158] text-[12px]">18 km/h</span>
      </p>
      <p className="relative shrink-0">
        <span className="leading-[normal] text-[12px]">{`🌧️ Chuva: `}</span>
        <span className="leading-[normal] text-[#314158] text-[12px]">20%</span>
      </p>
    </div>
  );
}

function Frame59() {
  return (
    <div className="content-stretch flex gap-[8px] items-start relative shrink-0 w-full">
      <Container2 />
      <Container6 />
    </div>
  );
}

function Frame4() {
  return (
    <div className="content-stretch flex flex-col font-['Helvetica_Neue:Regular',sans-serif] gap-[2px] items-center not-italic relative shrink-0 w-[22px]">
      <p className="leading-[normal] relative shrink-0 text-[#1447e6] text-[12px] w-full">Seg</p>
      <p className="leading-[15px] relative shrink-0 text-[#62748e] text-[10px] text-center w-full">12</p>
    </div>
  );
}

function Elements6() {
  return (
    <div className="absolute inset-[12.5%_8.33%]" data-name="elements">
      <div className="absolute inset-[-4.17%_-3.75%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 21.5002 19.5002">
          <g id="elements">
            <path d={svgPaths.pfaa3f00} id="Vector" stroke="var(--stroke-0, #F8A12E)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            <path d={svgPaths.p6cefd80} id="Vector_2" stroke="var(--stroke-0, #F8A12E)" strokeLinecap="round" strokeWidth="1.5" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Container10() {
  return (
    <div className="bg-[#fff7ed] content-stretch flex items-center p-[8px] relative rounded-[10px] shrink-0" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[#ffd6a8] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <div className="overflow-clip relative shrink-0 size-[24px]" data-name="sun-cloud-02">
        <Elements6 />
      </div>
    </div>
  );
}

function Container11() {
  return (
    <div className="content-stretch flex flex-col font-['Helvetica_Neue:Regular',sans-serif] gap-[2px] items-center leading-[normal] not-italic relative shrink-0 text-center" data-name="Container">
      <p className="relative shrink-0 text-[#0f172b] text-[14px] whitespace-nowrap">28°</p>
      <p className="relative shrink-0 text-[#90a1b9] text-[12px] w-[19px]">18°</p>
    </div>
  );
}

function Container9() {
  return (
    <div className="bg-[#f6faff] flex-[1_0_0] min-h-[160px] min-w-px relative rounded-[14px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#bedbff] border-[0.5px] border-solid inset-0 pointer-events-none rounded-[14px] shadow-[0px_0px_0px_0px_#dbeafe]" />
      <div className="flex flex-col items-center size-full">
        <div className="content-stretch flex flex-col items-center justify-between px-[10px] py-[20px] relative size-full">
          <Frame4 />
          <Container10 />
          <Container11 />
        </div>
      </div>
    </div>
  );
}

function Frame5() {
  return (
    <div className="content-stretch flex flex-col font-['Helvetica_Neue:Regular',sans-serif] gap-[2px] items-center not-italic relative shrink-0 text-center w-[16px]">
      <p className="leading-[normal] relative shrink-0 text-[#45556c] text-[12px] w-full">Ter</p>
      <p className="leading-[15px] relative shrink-0 text-[#62748e] text-[10px] w-full">13</p>
    </div>
  );
}

function Elements7() {
  return (
    <div className="absolute inset-[16.67%_8.33%_20.83%_8.33%]" data-name="elements">
      <div className="absolute inset-[-5%_-3.75%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 21.5 16.5">
          <g id="elements">
            <path d={svgPaths.p24d76d80} id="Vector" stroke="var(--stroke-0, #45556C)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Container13() {
  return (
    <div className="bg-[#f8fafc] content-stretch flex items-center p-[8px] relative rounded-[10px] shrink-0" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#e2e8f0] border-[0.556px] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <div className="overflow-clip relative shrink-0 size-[24px]" data-name="cloud">
        <Elements7 />
      </div>
    </div>
  );
}

function Container14() {
  return (
    <div className="content-stretch flex flex-col font-['Helvetica_Neue:Regular',sans-serif] gap-[1.997px] items-center leading-[normal] not-italic relative shrink-0 text-center" data-name="Container">
      <p className="relative shrink-0 text-[#0f172b] text-[14px] whitespace-nowrap">26°</p>
      <p className="relative shrink-0 text-[#90a1b9] text-[12px] w-[19px]">17°</p>
    </div>
  );
}

function Container12() {
  return (
    <div className="bg-white flex-[1_0_0] min-h-[160px] min-w-px relative rounded-[14px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#e2e8f0] border-[0.5px] border-solid inset-0 pointer-events-none rounded-[14px]" />
      <div className="flex flex-col items-center size-full">
        <div className="content-stretch flex flex-col items-center justify-between px-[10px] py-[20px] relative size-full">
          <Frame5 />
          <Container13 />
          <Container14 />
        </div>
      </div>
    </div>
  );
}

function Frame6() {
  return (
    <div className="content-stretch flex flex-col font-['Helvetica_Neue:Regular',sans-serif] gap-[2px] items-center not-italic relative shrink-0 text-center w-[23px]">
      <p className="leading-[normal] relative shrink-0 text-[#45556c] text-[12px] w-full">Qua</p>
      <p className="leading-[15px] relative shrink-0 text-[#62748e] text-[10px] w-full">14</p>
    </div>
  );
}

function Elements8() {
  return (
    <div className="absolute inset-[12.5%_8.33%]" data-name="elements">
      <div className="absolute inset-[-4.17%_-3.75%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 21.5 19.5">
          <g id="elements">
            <path d={svgPaths.p292f4a00} id="Vector" stroke="var(--stroke-0, #5286C6)" strokeLinecap="round" strokeWidth="1.5" />
            <path d={svgPaths.p11aff100} id="Vector_2" stroke="var(--stroke-0, #5286C6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Container16() {
  return (
    <div className="bg-[#eff6ff] content-stretch flex items-center p-[8px] relative rounded-[10px] shrink-0" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#bedbff] border-[0.556px] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <div className="overflow-clip relative shrink-0 size-[24px]" data-name="cloud-little-rain">
        <Elements8 />
      </div>
    </div>
  );
}

function Container17() {
  return (
    <div className="content-stretch flex flex-col font-['Helvetica_Neue:Regular',sans-serif] gap-[1.997px] items-center leading-[normal] not-italic relative shrink-0 text-center" data-name="Container">
      <p className="relative shrink-0 text-[#0f172b] text-[14px] whitespace-nowrap">24°</p>
      <p className="relative shrink-0 text-[#90a1b9] text-[12px] w-[19px]">16°</p>
    </div>
  );
}

function Container15() {
  return (
    <div className="bg-white flex-[1_0_0] min-h-[160px] min-w-px relative rounded-[14px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#e2e8f0] border-[0.5px] border-solid inset-0 pointer-events-none rounded-[14px]" />
      <div className="flex flex-col items-center size-full">
        <div className="content-stretch flex flex-col items-center justify-between px-[10px] py-[20px] relative size-full">
          <Frame6 />
          <Container16 />
          <Container17 />
        </div>
      </div>
    </div>
  );
}

function Frame7() {
  return (
    <div className="content-stretch flex flex-col font-['Helvetica_Neue:Regular',sans-serif] gap-[2px] items-center not-italic relative shrink-0 text-center w-[22px]">
      <p className="leading-[normal] relative shrink-0 text-[#45556c] text-[12px] w-full">Qui</p>
      <p className="leading-[15px] relative shrink-0 text-[#62748e] text-[10px] w-full">15</p>
    </div>
  );
}

function Elements9() {
  return (
    <div className="absolute inset-[8.33%]" data-name="elements">
      <div className="absolute inset-[-2.5%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 21 21">
          <g id="elements">
            <path d={svgPaths.pf45e980} id="Ellipse 1199" stroke="var(--stroke-0, #F8A12E)" strokeWidth="1.5" />
            <path d={svgPaths.p13683080} id="Vector" stroke="var(--stroke-0, #F8A12E)" strokeLinecap="round" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Container19() {
  return (
    <div className="bg-[#fefce8] content-stretch flex items-center p-[8px] relative rounded-[10px] shrink-0" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[#fee685] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <div className="overflow-clip relative shrink-0 size-[24px]" data-name="sun-03">
        <Elements9 />
      </div>
    </div>
  );
}

function Container20() {
  return (
    <div className="content-stretch flex flex-col font-['Helvetica_Neue:Regular',sans-serif] gap-[2px] items-center leading-[normal] not-italic relative shrink-0 text-center" data-name="Container">
      <p className="relative shrink-0 text-[#0f172b] text-[14px] whitespace-nowrap">29°</p>
      <p className="relative shrink-0 text-[#90a1b9] text-[12px] w-[19px]">18°</p>
    </div>
  );
}

function Container18() {
  return (
    <div className="flex-[1_0_0] min-h-[160px] min-w-px relative rounded-[14px]" style={{ backgroundImage: "linear-gradient(90deg, rgb(255, 255, 255) 0%, rgb(255, 255, 255) 100%), linear-gradient(90deg, rgb(246, 250, 255) 0%, rgb(246, 250, 255) 100%)" }} data-name="Container">
      <div aria-hidden="true" className="absolute border-[#e2e8f0] border-[0.5px] border-solid inset-0 pointer-events-none rounded-[14px] shadow-[0px_0px_0px_0px_#dbeafe]" />
      <div className="flex flex-col items-center size-full">
        <div className="content-stretch flex flex-col items-center justify-between px-[10px] py-[20px] relative size-full">
          <Frame7 />
          <Container19 />
          <Container20 />
        </div>
      </div>
    </div>
  );
}

function Frame8() {
  return (
    <div className="content-stretch flex flex-col font-['Helvetica_Neue:Regular',sans-serif] gap-[2px] items-center not-italic relative shrink-0 text-center w-[22px]">
      <p className="leading-[normal] relative shrink-0 text-[#45556c] text-[12px] w-full">Sex</p>
      <p className="leading-[15px] relative shrink-0 text-[#62748e] text-[10px] w-full">16</p>
    </div>
  );
}

function Elements10() {
  return (
    <div className="absolute inset-[12.5%_8.33%]" data-name="elements">
      <div className="absolute inset-[-4.17%_-3.75%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 21.5002 19.5002">
          <g id="elements">
            <path d={svgPaths.pfaa3f00} id="Vector" stroke="var(--stroke-0, #F8A12E)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            <path d={svgPaths.p6cefd80} id="Vector_2" stroke="var(--stroke-0, #F8A12E)" strokeLinecap="round" strokeWidth="1.5" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Container22() {
  return (
    <div className="bg-[#fff7ed] content-stretch flex items-center p-[8px] relative rounded-[10px] shrink-0" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[#ffd6a8] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <div className="overflow-clip relative shrink-0 size-[24px]" data-name="sun-cloud-02">
        <Elements10 />
      </div>
    </div>
  );
}

function Container23() {
  return (
    <div className="content-stretch flex flex-col font-['Helvetica_Neue:Regular',sans-serif] gap-[2px] items-center leading-[normal] not-italic relative shrink-0 text-center" data-name="Container">
      <p className="relative shrink-0 text-[#0f172b] text-[14px] whitespace-nowrap">27°</p>
      <p className="relative shrink-0 text-[#90a1b9] text-[12px] w-[19px]">18°</p>
    </div>
  );
}

function Container21() {
  return (
    <div className="flex-[1_0_0] min-h-[160px] min-w-px relative rounded-[14px]" style={{ backgroundImage: "linear-gradient(90deg, rgb(255, 255, 255) 0%, rgb(255, 255, 255) 100%), linear-gradient(90deg, rgb(246, 250, 255) 0%, rgb(246, 250, 255) 100%)" }} data-name="Container">
      <div aria-hidden="true" className="absolute border-[#e2e8f0] border-[0.5px] border-solid inset-0 pointer-events-none rounded-[14px] shadow-[0px_0px_0px_0px_#dbeafe]" />
      <div className="flex flex-col items-center size-full">
        <div className="content-stretch flex flex-col items-center justify-between px-[10px] py-[20px] relative size-full">
          <Frame8 />
          <Container22 />
          <Container23 />
        </div>
      </div>
    </div>
  );
}

function Frame9() {
  return (
    <div className="content-stretch flex flex-col font-['Helvetica_Neue:Regular',sans-serif] gap-[2px] items-center not-italic relative shrink-0 text-center w-[22px]">
      <p className="leading-[normal] relative shrink-0 text-[#45556c] text-[12px] w-full">Sáb</p>
      <p className="leading-[15px] relative shrink-0 text-[#62748e] text-[10px] w-full">17</p>
    </div>
  );
}

function Elements11() {
  return (
    <div className="absolute inset-[8.33%]" data-name="elements">
      <div className="absolute inset-[-2.5%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 21 21">
          <g id="elements">
            <path d={svgPaths.pf45e980} id="Ellipse 1199" stroke="var(--stroke-0, #F8A12E)" strokeWidth="1.5" />
            <path d={svgPaths.p13683080} id="Vector" stroke="var(--stroke-0, #F8A12E)" strokeLinecap="round" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Container25() {
  return (
    <div className="bg-[#fefce8] content-stretch flex items-center p-[8px] relative rounded-[10px] shrink-0" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[#fee685] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <div className="overflow-clip relative shrink-0 size-[24px]" data-name="sun-03">
        <Elements11 />
      </div>
    </div>
  );
}

function Container26() {
  return (
    <div className="content-stretch flex flex-col font-['Helvetica_Neue:Regular',sans-serif] gap-[2px] items-center leading-[normal] not-italic relative shrink-0 text-center" data-name="Container">
      <p className="relative shrink-0 text-[#0f172b] text-[14px] whitespace-nowrap">30°</p>
      <p className="relative shrink-0 text-[#90a1b9] text-[12px] w-[19px]">20°</p>
    </div>
  );
}

function Container24() {
  return (
    <div className="flex-[1_0_0] min-h-[160px] min-w-px relative rounded-[14px]" style={{ backgroundImage: "linear-gradient(90deg, rgb(255, 255, 255) 0%, rgb(255, 255, 255) 100%), linear-gradient(90deg, rgb(246, 250, 255) 0%, rgb(246, 250, 255) 100%)" }} data-name="Container">
      <div aria-hidden="true" className="absolute border-[#e2e8f0] border-[0.5px] border-solid inset-0 pointer-events-none rounded-[14px] shadow-[0px_0px_0px_0px_#dbeafe]" />
      <div className="flex flex-col items-center size-full">
        <div className="content-stretch flex flex-col items-center justify-between px-[10px] py-[20px] relative size-full">
          <Frame9 />
          <Container25 />
          <Container26 />
        </div>
      </div>
    </div>
  );
}

function Frame10() {
  return (
    <div className="content-stretch flex flex-col font-['Helvetica_Neue:Regular',sans-serif] gap-[2px] items-center not-italic relative shrink-0 text-center">
      <p className="leading-[normal] relative shrink-0 text-[#45556c] text-[12px] whitespace-nowrap">Dom</p>
      <p className="leading-[15px] min-w-full relative shrink-0 text-[#62748e] text-[10px] w-[min-content]">18</p>
    </div>
  );
}

function Elements12() {
  return (
    <div className="absolute inset-[12.5%_8.33%]" data-name="elements">
      <div className="absolute inset-[-4.17%_-3.75%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 21.5002 19.5002">
          <g id="elements">
            <path d={svgPaths.pfaa3f00} id="Vector" stroke="var(--stroke-0, #F8A12E)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            <path d={svgPaths.p6cefd80} id="Vector_2" stroke="var(--stroke-0, #F8A12E)" strokeLinecap="round" strokeWidth="1.5" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Container28() {
  return (
    <div className="bg-[#fff7ed] content-stretch flex items-center p-[8px] relative rounded-[10px] shrink-0" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[#ffd6a8] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <div className="overflow-clip relative shrink-0 size-[24px]" data-name="sun-cloud-02">
        <Elements12 />
      </div>
    </div>
  );
}

function Container29() {
  return (
    <div className="content-stretch flex flex-col font-['Helvetica_Neue:Regular',sans-serif] gap-[2px] items-center leading-[normal] not-italic relative shrink-0 text-center" data-name="Container">
      <p className="relative shrink-0 text-[#0f172b] text-[14px] whitespace-nowrap">28°</p>
      <p className="relative shrink-0 text-[#90a1b9] text-[12px] w-[19px]">19°</p>
    </div>
  );
}

function Container27() {
  return (
    <div className="flex-[1_0_0] min-h-[160px] min-w-px relative rounded-[14px]" style={{ backgroundImage: "linear-gradient(90deg, rgb(255, 255, 255) 0%, rgb(255, 255, 255) 100%), linear-gradient(90deg, rgb(246, 250, 255) 0%, rgb(246, 250, 255) 100%)" }} data-name="Container">
      <div aria-hidden="true" className="absolute border-[#e2e8f0] border-[0.5px] border-solid inset-0 pointer-events-none rounded-[14px] shadow-[0px_0px_0px_0px_#dbeafe]" />
      <div className="flex flex-col items-center size-full">
        <div className="content-stretch flex flex-col items-center justify-between px-[10px] py-[20px] relative size-full">
          <Frame10 />
          <Container28 />
          <Container29 />
        </div>
      </div>
    </div>
  );
}

function Container8() {
  return (
    <div className="content-stretch flex gap-[8px] items-start relative w-full" data-name="Container">
      <Container9 />
      <Container12 />
      <Container15 />
      <Container18 />
      <Container21 />
      <Container24 />
      <Container27 />
    </div>
  );
}

function Container7() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start relative w-full" data-name="Container">
      <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#45556c] text-[12px] whitespace-nowrap">Próximos 7 dias</p>
      <Container8 />
    </div>
  );
}

function Frame63() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start relative w-full">
      <Frame59 />
      <Container7 />
    </div>
  );
}

function Frame2() {
  return (
    <div className="content-stretch flex flex-col gap-[12px] items-start relative w-full">
      <Frame38 />
      <Frame63 />
    </div>
  );
}

function Elements13() {
  return (
    <div className="absolute inset-[8.33%]" data-name="elements">
      <div className="absolute inset-[-3.6%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 17.8667 17.8667">
          <g id="elements">
            <circle cx="8.93333" cy="8.93333" id="Ellipse 1112" r="8.33333" stroke="var(--stroke-0, #62748E)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" />
            <path d="M8.93333 12.2667V8.51667" id="Vector" stroke="var(--stroke-0, #62748E)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" />
            <path d="M8.93333 5.60977V5.60143" id="Vector_2" stroke="var(--stroke-0, #62748E)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Frame1() {
  return (
    <div className="content-stretch flex flex-col gap-[10px] items-start relative shrink-0 w-full">
      <div className="bg-[#f5f5f5] h-px shrink-0 w-full" />
      <div className="flex gap-[8px] items-center justify-center px-[16px] py-[10px] w-full">
        <div className="relative shrink-0 size-[20px]" data-name="information-circle">
          <Elements13 />
        </div>
        <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic text-[#62748e] text-[14px] whitespace-nowrap">Dados de OpenWeather API</p>
      </div>
    </div>
  );
}

function Frame() {
  return (
    <div className="bg-white border border-[#f5f5f5] border-solid content-stretch flex flex-col gap-[20px] items-start pb-[20px] pt-[24px] px-[24px] relative rounded-[16px] w-full">
      <Frame2 />
      <Frame1 />
    </div>
  );
}

function Elements14() {
  return (
    <div className="absolute bottom-[37.5%] left-1/4 right-1/4 top-[37.5%]" data-name="elements">
      <div className="absolute inset-[-12.5%_-6.25%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 9.00007 5.00003">
          <g id="elements">
            <path d={svgPaths.p110dce00} id="Vector" stroke="var(--stroke-0, #141B34)" strokeLinecap="round" strokeLinejoin="round" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Icon() {
  return (
    <div className="content-stretch flex items-center pl-[8px] relative shrink-0" data-name="Icon">
      <div className="opacity-50 overflow-clip relative shrink-0 size-[16px]" data-name="arrow-down-01-round">
        <Elements14 />
      </div>
    </div>
  );
}

function Select() {
  return (
    <div className="bg-white relative rounded-[6px] shrink-0 w-full" data-name="Select">
      <div aria-hidden="true" className="absolute border border-[#cbd5e1] border-solid inset-0 pointer-events-none rounded-[6px]" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center px-[12px] py-[8px] relative size-full">
          <div className="flex flex-[1_0_0] flex-col font-['Helvetica_Neue:Regular',sans-serif] h-[20px] justify-center leading-[0] min-w-px not-italic relative text-[#94a3b8] text-[14px]">
            <p className="leading-[normal]">Busque os guias</p>
          </div>
          <Icon />
        </div>
      </div>
    </div>
  );
}

function Frame44() {
  return (
    <div className="bg-white content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full">
      <p className="font-['Helvetica_Neue:Medium',sans-serif] h-[15px] leading-[normal] not-italic relative shrink-0 text-[#62748e] text-[12px] w-full">EQUIPE ESCALADA (3)</p>
      <div className="content-stretch flex flex-col gap-[6px] items-start relative shrink-0 w-full" data-name="Select">
        <Select />
      </div>
    </div>
  );
}

function Elements15() {
  return (
    <div className="absolute bottom-[20.83%] left-1/4 right-[24.96%] top-1/4" data-name="elements">
      <div className="absolute inset-[-11.54%_-12.49%_-3.85%_-12.49%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12.5075 12.5">
          <g id="elements">
            <path d="M6.24675 11.25H6.25423" id="Vector" stroke="var(--stroke-0, #A4A7AE)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
            <path d="M11.25 11.25H11.2575" id="Vector_2" stroke="var(--stroke-0, #A4A7AE)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
            <path d="M1.25 11.25H1.25748" id="Vector_3" stroke="var(--stroke-0, #A4A7AE)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
            <path d="M6.24675 6.25H6.25423" id="Vector_4" stroke="var(--stroke-0, #A4A7AE)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
            <path d="M6.25 1.25H6.25748" id="Vector_5" stroke="var(--stroke-0, #A4A7AE)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
            <path d="M11.25 6.25H11.2575" id="Vector_6" stroke="var(--stroke-0, #A4A7AE)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
            <path d="M11.25 1.25H11.2575" id="Vector_7" stroke="var(--stroke-0, #A4A7AE)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
            <path d="M1.25 6.25H1.25748" id="Vector_8" stroke="var(--stroke-0, #A4A7AE)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
            <path d="M1.25 1.25H1.25748" id="Vector_9" stroke="var(--stroke-0, #A4A7AE)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Text() {
  return (
    <div className="bg-[#ecfdf3] relative rounded-[4px] shrink-0" data-name="Text">
      <div className="content-stretch flex items-center justify-center overflow-clip px-[6.5px] py-[2.5px] relative rounded-[inherit] size-full">
        <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#079455] text-[12px] whitespace-nowrap">Disponível p/ atividade</p>
      </div>
      <div aria-hidden="true" className="absolute border-[#dcfae6] border-[0.5px] border-solid inset-0 pointer-events-none rounded-[4px]" />
    </div>
  );
}

function Frame65() {
  return (
    <div className="content-stretch flex gap-[6px] items-center relative shrink-0 w-full">
      <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#314158] text-[14px] whitespace-nowrap">João Silva</p>
      <Text />
    </div>
  );
}

function Frame32() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-start justify-center min-w-px relative">
      <Frame65 />
      <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#535862] text-[12px] whitespace-nowrap">Guia Líder</p>
    </div>
  );
}

function Frame47() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[10px] items-center min-w-px relative">
      <Frame32 />
    </div>
  );
}

function Elements16() {
  return (
    <div className="relative size-full" data-name="elements">
      <div className="absolute inset-[-4.5%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18.1667 18.1667">
          <g id="elements">
            <path d={svgPaths.p1a2b0480} id="Ellipse 1794" stroke="var(--stroke-0, #075E54)" strokeLinejoin="round" strokeWidth="1.5" />
            <path d={svgPaths.p273fd780} id="Vector" stroke="var(--stroke-0, #075E54)" strokeWidth="1.5" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Elements17() {
  return (
    <div className="relative size-full" data-name="elements">
      <div className="absolute inset-[-6.25%_-5.92%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14.1667 13.5">
          <g id="elements">
            <path d={svgPaths.pfb30e00} id="Vector" stroke="var(--stroke-0, #F04438)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            <path d={svgPaths.p241cbb00} id="Vector_2" stroke="var(--stroke-0, #F04438)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            <path d={svgPaths.p31fc0800} id="Vector_3" stroke="var(--stroke-0, #F04438)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Frame45() {
  return (
    <div className="content-stretch flex gap-[12px] items-start relative shrink-0">
      <div className="bg-[#f3fffa] content-stretch flex gap-[8px] items-center justify-center px-[12px] py-[8px] relative rounded-[6px] shrink-0" data-name="button">
        <div aria-hidden="true" className="absolute border border-[#f5f5f5] border-solid inset-0 pointer-events-none rounded-[6px]" />
        <div className="overflow-clip relative shrink-0 size-[20px]" data-name="whatsapp">
          <div className="absolute flex inset-[8.33%] items-center justify-center" style={{ containerType: "size" }}>
            <div className="-rotate-180 -scale-x-100 flex-none h-[100cqh] w-[100cqw]">
              <Elements16 />
            </div>
          </div>
        </div>
        <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#075e54] text-[14px] whitespace-nowrap">Falar via WhatsApp</p>
      </div>
      <div className="bg-[#fef3f2] content-stretch flex gap-[8px] items-center justify-center p-[10px] relative rounded-[6px] shrink-0" data-name="button">
        <div aria-hidden="true" className="absolute border border-[#fee4e2] border-solid inset-0 pointer-events-none rounded-[6px]" />
        <div className="relative shrink-0 size-[16px]" data-name="user-remove-01">
          <div className="absolute flex inset-[12.5%_10.42%] items-center justify-center" style={{ containerType: "size" }}>
            <div className="-rotate-180 -scale-x-100 flex-none h-[100cqh] w-[100cqw]">
              <Elements17 />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Frame52() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[16px] items-center min-w-px relative">
      <Frame47 />
      <Frame45 />
    </div>
  );
}

function Frame29() {
  return (
    <div className="content-stretch flex gap-[16px] items-center relative shrink-0 w-full">
      <div className="overflow-clip relative shrink-0 size-[20px]" data-name="more-01">
        <Elements15 />
      </div>
      <Frame52 />
    </div>
  );
}

function Container30() {
  return (
    <div className="relative rounded-[10px] shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[#f5f5f5] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <div className="content-stretch flex flex-col items-start px-[15.998px] py-[14px] relative size-full">
        <Frame29 />
      </div>
    </div>
  );
}

function Elements18() {
  return (
    <div className="absolute bottom-[20.83%] left-1/4 right-[24.96%] top-1/4" data-name="elements">
      <div className="absolute inset-[-11.54%_-12.49%_-3.85%_-12.49%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12.5075 12.5">
          <g id="elements">
            <path d="M6.24675 11.25H6.25423" id="Vector" stroke="var(--stroke-0, #A4A7AE)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
            <path d="M11.25 11.25H11.2575" id="Vector_2" stroke="var(--stroke-0, #A4A7AE)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
            <path d="M1.25 11.25H1.25748" id="Vector_3" stroke="var(--stroke-0, #A4A7AE)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
            <path d="M6.24675 6.25H6.25423" id="Vector_4" stroke="var(--stroke-0, #A4A7AE)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
            <path d="M6.25 1.25H6.25748" id="Vector_5" stroke="var(--stroke-0, #A4A7AE)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
            <path d="M11.25 6.25H11.2575" id="Vector_6" stroke="var(--stroke-0, #A4A7AE)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
            <path d="M11.25 1.25H11.2575" id="Vector_7" stroke="var(--stroke-0, #A4A7AE)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
            <path d="M1.25 6.25H1.25748" id="Vector_8" stroke="var(--stroke-0, #A4A7AE)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
            <path d="M1.25 1.25H1.25748" id="Vector_9" stroke="var(--stroke-0, #A4A7AE)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Text1() {
  return (
    <div className="bg-[#fffaeb] relative rounded-[4px] shrink-0" data-name="Text">
      <div className="content-stretch flex items-center justify-center overflow-clip px-[6.5px] py-[2.5px] relative rounded-[inherit] size-full">
        <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#dc6803] text-[12px] whitespace-nowrap">Conflito de horário</p>
      </div>
      <div aria-hidden="true" className="absolute border-[#fef0c7] border-[0.5px] border-solid inset-0 pointer-events-none rounded-[4px]" />
    </div>
  );
}

function Frame64() {
  return (
    <div className="content-stretch flex gap-[6px] items-center relative shrink-0 w-full">
      <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic overflow-hidden relative shrink-0 text-[#314158] text-[14px] text-ellipsis whitespace-nowrap">Maria Costa</p>
      <Text1 />
    </div>
  );
}

function Frame33() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-start justify-center min-w-px relative">
      <Frame64 />
      <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#535862] text-[12px] whitespace-nowrap">Guia de Apoio</p>
    </div>
  );
}

function Frame48() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[10px] items-center min-w-px relative">
      <Frame33 />
    </div>
  );
}

function Elements19() {
  return (
    <div className="relative size-full" data-name="elements">
      <div className="absolute inset-[-4.5%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18.1667 18.1667">
          <g id="elements">
            <path d={svgPaths.p1a2b0480} id="Ellipse 1794" stroke="var(--stroke-0, #075E54)" strokeLinejoin="round" strokeWidth="1.5" />
            <path d={svgPaths.p273fd780} id="Vector" stroke="var(--stroke-0, #075E54)" strokeWidth="1.5" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Elements20() {
  return (
    <div className="relative size-full" data-name="elements">
      <div className="absolute inset-[-6.25%_-5.92%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14.1667 13.5">
          <g id="elements">
            <path d={svgPaths.pfb30e00} id="Vector" stroke="var(--stroke-0, #F04438)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            <path d={svgPaths.p241cbb00} id="Vector_2" stroke="var(--stroke-0, #F04438)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            <path d={svgPaths.p31fc0800} id="Vector_3" stroke="var(--stroke-0, #F04438)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Frame49() {
  return (
    <div className="content-stretch flex gap-[12px] items-start relative shrink-0">
      <div className="bg-[#f3fffa] content-stretch flex gap-[8px] items-center justify-center px-[12px] py-[8px] relative rounded-[6px] shrink-0" data-name="button">
        <div aria-hidden="true" className="absolute border border-[#f5f5f5] border-solid inset-0 pointer-events-none rounded-[6px]" />
        <div className="overflow-clip relative shrink-0 size-[20px]" data-name="whatsapp">
          <div className="absolute flex inset-[8.33%] items-center justify-center" style={{ containerType: "size" }}>
            <div className="-rotate-180 -scale-x-100 flex-none h-[100cqh] w-[100cqw]">
              <Elements19 />
            </div>
          </div>
        </div>
        <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#075e54] text-[14px] whitespace-nowrap">Falar via WhatsApp</p>
      </div>
      <div className="bg-[#fef3f2] content-stretch flex gap-[8px] items-center justify-center p-[10px] relative rounded-[6px] shrink-0" data-name="button">
        <div aria-hidden="true" className="absolute border border-[#fee4e2] border-solid inset-0 pointer-events-none rounded-[6px]" />
        <div className="relative shrink-0 size-[16px]" data-name="user-remove-01">
          <div className="absolute flex inset-[12.5%_10.42%] items-center justify-center" style={{ containerType: "size" }}>
            <div className="-rotate-180 -scale-x-100 flex-none h-[100cqh] w-[100cqw]">
              <Elements20 />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Frame54() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[16px] items-center min-w-px relative">
      <Frame48 />
      <Frame49 />
    </div>
  );
}

function Frame30() {
  return (
    <div className="content-stretch flex gap-[16px] items-center relative shrink-0 w-full">
      <div className="overflow-clip relative shrink-0 size-[20px]" data-name="more-01">
        <Elements18 />
      </div>
      <Frame54 />
    </div>
  );
}

function Container31() {
  return (
    <div className="bg-white relative rounded-[10px] shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[#f5f5f5] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <div className="content-stretch flex flex-col items-start px-[15.998px] py-[14px] relative size-full">
        <Frame30 />
      </div>
    </div>
  );
}

function Elements21() {
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

function Text2() {
  return (
    <div className="relative rounded-[4px] shrink-0" style={{ backgroundImage: "linear-gradient(90deg, rgb(255, 255, 255) 0%, rgb(255, 255, 255) 100%), linear-gradient(90deg, rgb(255, 250, 235) 0%, rgb(255, 250, 235) 100%)" }} data-name="Text">
      <div className="content-stretch flex gap-[6px] items-center justify-center overflow-clip pb-[3.5px] pt-[2.5px] px-[6.5px] relative rounded-[inherit] size-full">
        <div className="relative shrink-0 size-[16px]" data-name="alert-circle">
          <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
            <Elements21 />
          </div>
        </div>
        <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[0] not-italic relative shrink-0 text-[#535862] text-[0px] whitespace-nowrap">
          <span className="leading-[normal] text-[#dc6803] text-[12px]">Já escalado em</span>
          <span className="leading-[normal] text-[#dc6803] text-[12px]">{` `}</span>
          <span className="font-['Helvetica_Neue:Medium',sans-serif] leading-[normal] text-[#dc6803] text-[12px]">{`"Rapel Cachoeira Alta"`}</span>
          <span className="leading-[normal] text-[#dc6803] text-[12px]">, das 09:00 às 12:00.</span>
        </p>
      </div>
      <div aria-hidden="true" className="absolute border-[#e9eaeb] border-[0.5px] border-solid inset-0 pointer-events-none rounded-[4px]" />
    </div>
  );
}

function Frame61() {
  return (
    <div className="bg-[#fafafa] relative rounded-bl-[6px] rounded-br-[6px] shrink-0 w-full">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-center px-[16px] py-[12px] relative size-full">
          <Text2 />
        </div>
      </div>
    </div>
  );
}

function Frame66() {
  return (
    <div className="bg-[#fafafa] relative rounded-[10px] shrink-0 w-full">
      <div className="content-stretch flex flex-col items-center justify-center overflow-clip relative rounded-[inherit] size-full">
        <Container31 />
        <Frame61 />
      </div>
      <div aria-hidden="true" className="absolute border border-[#f5f5f5] border-solid inset-0 pointer-events-none rounded-[10px]" />
    </div>
  );
}

function Elements22() {
  return (
    <div className="absolute bottom-[20.83%] left-1/4 right-[24.96%] top-1/4" data-name="elements">
      <div className="absolute inset-[-11.54%_-12.49%_-3.85%_-12.49%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12.5075 12.5">
          <g id="elements">
            <path d="M6.24675 11.25H6.25423" id="Vector" stroke="var(--stroke-0, #A4A7AE)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
            <path d="M11.25 11.25H11.2575" id="Vector_2" stroke="var(--stroke-0, #A4A7AE)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
            <path d="M1.25 11.25H1.25748" id="Vector_3" stroke="var(--stroke-0, #A4A7AE)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
            <path d="M6.24675 6.25H6.25423" id="Vector_4" stroke="var(--stroke-0, #A4A7AE)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
            <path d="M6.25 1.25H6.25748" id="Vector_5" stroke="var(--stroke-0, #A4A7AE)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
            <path d="M11.25 6.25H11.2575" id="Vector_6" stroke="var(--stroke-0, #A4A7AE)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
            <path d="M11.25 1.25H11.2575" id="Vector_7" stroke="var(--stroke-0, #A4A7AE)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
            <path d="M1.25 6.25H1.25748" id="Vector_8" stroke="var(--stroke-0, #A4A7AE)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
            <path d="M1.25 1.25H1.25748" id="Vector_9" stroke="var(--stroke-0, #A4A7AE)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Text3() {
  return (
    <div className="bg-[#ecfdf3] relative rounded-[4px] shrink-0" data-name="Text">
      <div className="content-stretch flex items-center justify-center overflow-clip px-[6.5px] py-[2.5px] relative rounded-[inherit] size-full">
        <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#079455] text-[12px] whitespace-nowrap">Disponível p/ atividade</p>
      </div>
      <div aria-hidden="true" className="absolute border-[#dcfae6] border-[0.5px] border-solid inset-0 pointer-events-none rounded-[4px]" />
    </div>
  );
}

function Frame67() {
  return (
    <div className="content-stretch flex gap-[6px] items-center relative shrink-0 w-full">
      <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#314158] text-[14px] whitespace-nowrap">Pedro Santos</p>
      <Text3 />
    </div>
  );
}

function Frame34() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-start justify-center min-w-px relative">
      <Frame67 />
      <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#535862] text-[12px] whitespace-nowrap">Guia de Apoio</p>
    </div>
  );
}

function Frame50() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[10px] items-center min-w-px relative">
      <Frame34 />
    </div>
  );
}

function Elements23() {
  return (
    <div className="relative size-full" data-name="elements">
      <div className="absolute inset-[-4.5%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18.1667 18.1667">
          <g id="elements">
            <path d={svgPaths.p1a2b0480} id="Ellipse 1794" stroke="var(--stroke-0, #075E54)" strokeLinejoin="round" strokeWidth="1.5" />
            <path d={svgPaths.p273fd780} id="Vector" stroke="var(--stroke-0, #075E54)" strokeWidth="1.5" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Elements24() {
  return (
    <div className="relative size-full" data-name="elements">
      <div className="absolute inset-[-6.25%_-5.92%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14.1667 13.5">
          <g id="elements">
            <path d={svgPaths.pfb30e00} id="Vector" stroke="var(--stroke-0, #F04438)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            <path d={svgPaths.p241cbb00} id="Vector_2" stroke="var(--stroke-0, #F04438)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            <path d={svgPaths.p31fc0800} id="Vector_3" stroke="var(--stroke-0, #F04438)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Frame51() {
  return (
    <div className="content-stretch flex gap-[12px] items-start relative shrink-0">
      <div className="bg-[#f3fffa] content-stretch flex gap-[8px] items-center justify-center px-[12px] py-[8px] relative rounded-[6px] shrink-0" data-name="button">
        <div aria-hidden="true" className="absolute border border-[#f5f5f5] border-solid inset-0 pointer-events-none rounded-[6px]" />
        <div className="overflow-clip relative shrink-0 size-[20px]" data-name="whatsapp">
          <div className="absolute flex inset-[8.33%] items-center justify-center" style={{ containerType: "size" }}>
            <div className="-rotate-180 -scale-x-100 flex-none h-[100cqh] w-[100cqw]">
              <Elements23 />
            </div>
          </div>
        </div>
        <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#075e54] text-[14px] whitespace-nowrap">Falar via WhatsApp</p>
      </div>
      <div className="bg-[#fef3f2] content-stretch flex gap-[8px] items-center justify-center p-[10px] relative rounded-[6px] shrink-0" data-name="button">
        <div aria-hidden="true" className="absolute border border-[#fee4e2] border-solid inset-0 pointer-events-none rounded-[6px]" />
        <div className="relative shrink-0 size-[16px]" data-name="user-remove-01">
          <div className="absolute flex inset-[12.5%_10.42%] items-center justify-center" style={{ containerType: "size" }}>
            <div className="-rotate-180 -scale-x-100 flex-none h-[100cqh] w-[100cqw]">
              <Elements24 />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Frame55() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[16px] items-center min-w-px relative">
      <Frame50 />
      <Frame51 />
    </div>
  );
}

function Frame31() {
  return (
    <div className="content-stretch flex gap-[16px] items-center relative shrink-0 w-full">
      <div className="overflow-clip relative shrink-0 size-[20px]" data-name="more-01">
        <Elements22 />
      </div>
      <Frame55 />
    </div>
  );
}

function Container32() {
  return (
    <div className="relative rounded-[10px] shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[#f5f5f5] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <div className="content-stretch flex flex-col items-start px-[15.998px] py-[14px] relative size-full">
        <Frame31 />
      </div>
    </div>
  );
}

function Frame53() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full">
      <Container30 />
      <Frame66 />
      <Container32 />
    </div>
  );
}

function Frame56() {
  return (
    <div className="bg-white border border-[#f5f5f5] border-solid relative rounded-[16px] w-full">
      <div className="content-stretch flex flex-col gap-[20px] items-start overflow-clip p-[24px] rounded-[inherit] size-full">
        <Frame44 />
        <Frame53 />
      </div>
    </div>
  );
}

function Elements25() {
  return (
    <div className="relative size-full" data-name="elements">
      <div className="absolute inset-[-7.5%_-6.43%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.1667 11.5001">
          <g id="elements">
            <path d={svgPaths.p8050f80} id="Vector" stroke="var(--stroke-0, #141B34)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            <path d={svgPaths.paf0eea0} id="Vector_2" stroke="var(--stroke-0, #141B34)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Container33({ onBackToActivities }: { onBackToActivities?: () => void }) {
  return (
    <div className="relative rounded-tl-[16px] rounded-tr-[16px] shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#f5f5f5] border-b border-solid inset-0 pointer-events-none rounded-tl-[16px] rounded-tr-[16px]" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center pb-[17px] pt-[16px] px-[16px] relative size-full">
          <button onClick={onBackToActivities} className="bg-[rgba(255,255,255,0)] relative rounded-[6px] shrink-0 cursor-pointer hover:bg-[#f8fafc] transition-colors" data-name="button">
            <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center justify-center px-[16px] py-[10px] relative size-full">
              <div className="relative shrink-0 size-[20px]" data-name="arrow-left-02">
                <div className="absolute flex inset-[25.01%_20.83%_24.99%_20.83%] items-center justify-center" style={{ containerType: "size" }}>
                  <div className="-rotate-180 -scale-x-100 flex-none h-[100cqh] w-[100cqw]">
                    <Elements25 />
                  </div>
                </div>
              </div>
              <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#0f172a] text-[16px] whitespace-nowrap">Voltar as atividades</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

function Frame12() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[2px] items-start justify-center min-w-px relative">
      <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#0b5ed7] text-[14px] w-full">Visão Geral</p>
    </div>
  );
}

function Container34() {
  return <div className="absolute bg-[#1b71fd] h-[24px] left-0 rounded-br-[9999px] rounded-tr-[9999px] top-[12px] w-[4px]" data-name="Container" />;
}

function Elements26() {
  return (
    <div className="absolute inset-[18.75%_10.42%]" data-name="elements">
      <div className="absolute inset-[-6%_-4.74%_-5.99%_-4.74%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 17.3333 14">
          <g id="elements">
            <path d={svgPaths.p105a55a0} id="Ellipse 1" stroke="var(--stroke-0, #414651)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            <circle cx="8.66667" cy="6.16667" id="Ellipse 2" r="2.08333" stroke="var(--stroke-0, #414651)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            <path d={svgPaths.p1c8c1d80} id="Ellipse 5" stroke="var(--stroke-0, #414651)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            <circle cx="13.25" cy="2.41667" id="Ellipse 6" r="1.66667" stroke="var(--stroke-0, #414651)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            <path d={svgPaths.p108f0800} id="Ellipse 7" stroke="var(--stroke-0, #414651)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            <circle cx="4.08333" cy="2.41667" id="Ellipse 8" r="1.66667" stroke="var(--stroke-0, #414651)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Frame13() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[2px] items-start justify-center min-w-px relative">
      <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#414651] text-[14px] whitespace-nowrap">Participantes</p>
    </div>
  );
}

function Elements27() {
  return (
    <div className="absolute inset-[10.42%]" data-name="elements">
      <div className="absolute inset-[-4.74%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 17.3333 17.3333">
          <g id="elements">
            <path d={svgPaths.p1cbe4300} id="Rectangle 2059" stroke="var(--stroke-0, #414651)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            <path d={svgPaths.p2167cf00} id="Ellipse 40" stroke="var(--stroke-0, #414651)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            <path d="M4.91667 9.08333H8.25" id="Vector 4052" stroke="var(--stroke-0, #414651)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            <path d="M4.91667 12.4167H11.5833" id="Vector 4053" stroke="var(--stroke-0, #414651)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Frame14() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[2px] items-start justify-center min-w-px relative">
      <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#414651] text-[14px] whitespace-nowrap">Atualizações</p>
    </div>
  );
}

function Badge() {
  return (
    <div className="bg-[#f04438] relative rounded-[6px] shrink-0 size-[20px]" data-name="Badge">
      <div className="content-stretch flex items-center justify-center overflow-clip px-[8.556px] py-[2.556px] relative rounded-[inherit] size-full">
        <div className="flex flex-col font-['Helvetica_Neue:Medium',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-white whitespace-nowrap">
          <p className="leading-[normal]">+9</p>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border-[0.556px] border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[6px]" />
    </div>
  );
}

function Frame46({ onAtualizacoesClick }: { onAtualizacoesClick?: () => void }) {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full">
      <div className="bg-[#edf0ff] h-[48px] relative rounded-[14px] shrink-0 w-full" data-name="Menu action component">
        <div className="flex flex-row items-center size-full">
          <div className="content-stretch flex gap-[12px] items-center pl-[16px] pr-[12px] py-[14px] relative size-full">
            <div className="relative shrink-0 size-[20px]" data-name="file-view">
              <div className="absolute inset-[8.33%_20.83%_8.33%_12.5%]" data-name="Vector">
                <div className="absolute inset-[-4.5%_-5.63%]">
                  <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14.8335 18.1668">
                    <path d={svgPaths.p382a88c0} id="Vector" stroke="var(--stroke-0, #0B5ED7)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                  </svg>
                </div>
              </div>
              <div className="absolute inset-[66.67%_12.5%_8.33%_45.83%]" data-name="Vector">
                <div className="absolute inset-[-15%_-9%]">
                  <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 9.83333 6.5">
                    <path d={svgPaths.p2c30b280} id="Vector" stroke="var(--stroke-0, #0B5ED7)" strokeLinejoin="round" strokeWidth="1.5" />
                  </svg>
                </div>
              </div>
              <div className="absolute inset-[79.17%_33.33%_20.83%_66.63%]" data-name="Vector">
                <div className="absolute inset-[-1px]">
                  <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2.0075 2">
                    <path d="M1 1H1.0075" id="Vector" stroke="var(--stroke-0, #0B5ED7)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                  </svg>
                </div>
              </div>
            </div>
            <Frame12 />
            <Container34 />
          </div>
        </div>
      </div>
      <div className="bg-white h-[48px] relative rounded-[14px] shrink-0 w-full" data-name="Menu action component">
        <div className="flex flex-row items-center size-full">
          <div className="content-stretch flex gap-[12px] items-center pl-[16px] pr-[12px] py-[14px] relative size-full">
            <div className="relative shrink-0 size-[20px]" data-name="user-group-02">
              <Elements26 />
            </div>
            <Frame13 />
          </div>
        </div>
      </div>
      <button onClick={onAtualizacoesClick} className="bg-white h-[48px] relative rounded-[14px] shrink-0 w-full cursor-pointer hover:bg-[#f8fafc] transition-colors" data-name="Component 4">
        <div className="flex flex-row items-center size-full">
          <div className="content-stretch flex gap-[12px] items-center pl-[16px] pr-[12px] py-[14px] relative size-full">
            <div className="overflow-clip relative shrink-0 size-[20px]" data-name="notification-square">
              <Elements27 />
            </div>
            <Frame14 />
            <Badge />
          </div>
        </div>
      </button>
    </div>
  );
}

function PrimitiveDiv({ onAtualizacoesClick }: { onAtualizacoesClick?: () => void }) {
  return (
    <div className="flex-[1_0_0] min-h-px relative w-full" data-name="Primitive.div">
      <div className="flex flex-col items-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col items-center pb-[16px] pt-[20px] px-[15.998px] relative size-full">
          <Frame46 onAtualizacoesClick={onAtualizacoesClick} />
        </div>
      </div>
    </div>
  );
}

function SidebarAdmin({ onAtualizacoesClick, onBackToActivities }: { onAtualizacoesClick?: () => void; onBackToActivities?: () => void }) {
  return (
    <div className="fixed bg-white content-stretch flex flex-col h-[745px] items-start left-[24px] rounded-[16px] top-[24px] w-[200px] z-20" data-name="Sidebar - Admin">
      <div aria-hidden="true" className="absolute border border-[#fafafa] border-solid inset-0 pointer-events-none rounded-[16px] shadow-[0px_1px_3px_0px_rgba(10,13,18,0.1),0px_1px_2px_0px_rgba(10,13,18,0.1)]" />
      <Container33 onBackToActivities={onBackToActivities} />
      <PrimitiveDiv onAtualizacoesClick={onAtualizacoesClick} />
    </div>
  );
}

function Text4() {
  return (
    <div className="bg-[#fffaeb] relative rounded-[4px] shrink-0" data-name="Text">
      <div className="content-stretch flex items-center justify-center overflow-clip px-[6.5px] py-[2.5px] relative rounded-[inherit] size-full">
        <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#dc6803] text-[12px] whitespace-nowrap">08/12</p>
      </div>
      <div aria-hidden="true" className="absolute border-[#fef0c7] border-[0.5px] border-solid inset-0 pointer-events-none rounded-[4px]" />
    </div>
  );
}

function Frame26() {
  return (
    <div className="content-stretch flex gap-[12px] items-center relative shrink-0 w-full">
      <div className="flex flex-col font-['Helvetica_Neue:Medium',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#62748e] text-[12px] whitespace-nowrap">
        <p className="leading-[normal]">RESERVAS DA ATIVIDADE</p>
      </div>
      <Text4 />
    </div>
  );
}

function Frame11() {
  return (
    <div className="-translate-x-1/2 -translate-y-1/2 absolute h-[59px] left-[calc(50%-16px)] top-[calc(50%-0.5px)] w-[487px]">
      <div className="absolute inset-[-8.39%_-3.89%_0_0]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 505.95 63.9497">
          <g id="Frame 1771">
            <line id="Line 10" stroke="var(--stroke-0, white)" strokeOpacity="0.18" strokeWidth="7" x1="2.47487" x2="61.4749" y1="2.47487" y2="61.4749" />
            <line id="Line 11" stroke="var(--stroke-0, white)" strokeOpacity="0.18" strokeWidth="7" x1="19.4749" x2="78.4749" y1="2.47487" y2="61.4749" />
            <line id="Line 12" stroke="var(--stroke-0, white)" strokeOpacity="0.18" strokeWidth="7" x1="36.4749" x2="95.4749" y1="2.47487" y2="61.4749" />
            <line id="Line 13" stroke="var(--stroke-0, white)" strokeOpacity="0.18" strokeWidth="7" x1="53.4749" x2="112.475" y1="2.47487" y2="61.4749" />
            <line id="Line 14" stroke="var(--stroke-0, white)" strokeOpacity="0.18" strokeWidth="7" x1="70.4749" x2="129.475" y1="2.47487" y2="61.4749" />
            <line id="Line 15" stroke="var(--stroke-0, white)" strokeOpacity="0.18" strokeWidth="7" x1="87.4749" x2="146.475" y1="2.47487" y2="61.4749" />
            <line id="Line 16" stroke="var(--stroke-0, white)" strokeOpacity="0.18" strokeWidth="7" x1="104.475" x2="163.475" y1="2.47487" y2="61.4749" />
            <line id="Line 17" stroke="var(--stroke-0, white)" strokeOpacity="0.18" strokeWidth="7" x1="121.475" x2="180.475" y1="2.47487" y2="61.4749" />
            <line id="Line 18" stroke="var(--stroke-0, white)" strokeOpacity="0.18" strokeWidth="7" x1="138.475" x2="197.475" y1="2.47487" y2="61.4749" />
            <line id="Line 19" stroke="var(--stroke-0, white)" strokeOpacity="0.18" strokeWidth="7" x1="155.475" x2="214.475" y1="2.47487" y2="61.4749" />
            <line id="Line 20" stroke="var(--stroke-0, white)" strokeOpacity="0.18" strokeWidth="7" x1="172.475" x2="231.475" y1="2.47487" y2="61.4749" />
            <line id="Line 21" stroke="var(--stroke-0, white)" strokeOpacity="0.18" strokeWidth="7" x1="189.475" x2="248.475" y1="2.47487" y2="61.4749" />
            <line id="Line 22" stroke="var(--stroke-0, white)" strokeOpacity="0.18" strokeWidth="7" x1="206.475" x2="265.475" y1="2.47487" y2="61.4749" />
            <line id="Line 23" stroke="var(--stroke-0, white)" strokeOpacity="0.18" strokeWidth="7" x1="223.475" x2="282.475" y1="2.47487" y2="61.4749" />
            <line id="Line 24" stroke="var(--stroke-0, white)" strokeOpacity="0.18" strokeWidth="7" x1="240.475" x2="299.475" y1="2.47487" y2="61.4749" />
            <line id="Line 25" stroke="var(--stroke-0, white)" strokeOpacity="0.18" strokeWidth="7" x1="257.475" x2="316.475" y1="2.47487" y2="61.4749" />
            <line id="Line 26" stroke="var(--stroke-0, white)" strokeOpacity="0.18" strokeWidth="7" x1="274.475" x2="333.475" y1="2.47487" y2="61.4749" />
            <line id="Line 27" stroke="var(--stroke-0, white)" strokeOpacity="0.18" strokeWidth="7" x1="291.475" x2="350.475" y1="2.47487" y2="61.4749" />
            <line id="Line 28" stroke="var(--stroke-0, white)" strokeOpacity="0.18" strokeWidth="7" x1="308.475" x2="367.475" y1="2.47487" y2="61.4749" />
            <line id="Line 29" stroke="var(--stroke-0, white)" strokeOpacity="0.18" strokeWidth="7" x1="325.475" x2="384.475" y1="2.47487" y2="61.4749" />
            <line id="Line 30" stroke="var(--stroke-0, white)" strokeOpacity="0.18" strokeWidth="7" x1="342.475" x2="401.475" y1="2.47487" y2="61.4749" />
            <line id="Line 31" stroke="var(--stroke-0, white)" strokeOpacity="0.18" strokeWidth="7" x1="359.475" x2="418.475" y1="2.47487" y2="61.4749" />
            <line id="Line 32" stroke="var(--stroke-0, white)" strokeOpacity="0.18" strokeWidth="7" x1="376.475" x2="435.475" y1="2.47487" y2="61.4749" />
            <line id="Line 33" stroke="var(--stroke-0, white)" strokeOpacity="0.18" strokeWidth="7" x1="393.475" x2="452.475" y1="2.47487" y2="61.4749" />
            <line id="Line 34" stroke="var(--stroke-0, white)" strokeOpacity="0.18" strokeWidth="7" x1="410.475" x2="469.475" y1="2.47487" y2="61.4749" />
            <line id="Line 35" stroke="var(--stroke-0, white)" strokeOpacity="0.18" strokeWidth="7" x1="427.475" x2="486.475" y1="2.47487" y2="61.4749" />
            <line id="Line 36" stroke="var(--stroke-0, white)" strokeOpacity="0.18" strokeWidth="7" x1="444.475" x2="503.475" y1="2.47487" y2="61.4749" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function ProgressBar() {
  return (
    <div className="h-[16px] overflow-clip relative rounded-[4px] shrink-0 w-full" data-name="Progress Bar">
      <div className="absolute bg-[#17b26a] h-[19px] left-0 right-[-73px] rounded-[4px] top-0" />
      <Frame11 />
    </div>
  );
}

function Frame22() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[6px] items-start min-w-px relative">
      <ProgressBar />
      <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#414651] text-[12px] whitespace-nowrap">85% ocupado</p>
    </div>
  );
}

function Frame23() {
  return (
    <div className="content-stretch flex flex-col gap-[6px] items-start relative shrink-0">
      <div className="h-[16px] overflow-clip relative rounded-[4px] shrink-0 w-[81px]" data-name="Progress Bar">
        <div className="-translate-y-1/2 absolute bg-[#e9eaeb] h-[19px] left-[-17px] right-[-56px] rounded-[4px] top-[calc(50%+0.5px)]" />
      </div>
      <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#414651] text-[12px] whitespace-nowrap">15% vago</p>
    </div>
  );
}

function Frame27() {
  return (
    <div className="content-stretch flex gap-[8px] items-start relative shrink-0 w-full">
      <Frame22 />
      <Frame23 />
    </div>
  );
}

function PrimitiveDiv1() {
  return <div className="bg-[#f5f5f5] h-[0.998px] relative shrink-0 w-full" data-name="Primitive.div" />;
}

function Elements28() {
  return (
    <div className="relative size-full" data-name="elements">
      <div className="absolute inset-[-5%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16.5 16.5">
          <g id="elements">
            <path d={svgPaths.p2ea59920} id="Vector" stroke="var(--stroke-0, #535862)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            <path d={svgPaths.p31f75480} id="Vector_2" stroke="var(--stroke-0, #535862)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            <path d={svgPaths.p3cffa980} id="Vector_3" stroke="var(--stroke-0, #535862)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            <path d={svgPaths.p3bd08380} id="Vector_4" stroke="var(--stroke-0, #535862)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Frame28() {
  return (
    <div className="bg-[#fafafa] content-stretch flex items-center p-[6px] relative rounded-[8px] shrink-0">
      <div aria-hidden="true" className="absolute border border-[#f5f5f5] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="relative shrink-0 size-[20px]" data-name="user-multiple">
        <div className="absolute flex inset-[12.5%] items-center justify-center" style={{ containerType: "size" }}>
          <div className="-rotate-180 -scale-x-100 flex-none h-[100cqh] w-[100cqw]">
            <Elements28 />
          </div>
        </div>
      </div>
    </div>
  );
}

function Frame35() {
  return (
    <div className="content-stretch flex flex-col gap-[2px] items-start justify-center leading-[normal] not-italic relative shrink-0 whitespace-nowrap">
      <p className="font-['Helvetica_Neue:Regular',sans-serif] relative shrink-0 text-[#535862] text-[12px]">Adulto(s)</p>
      <p className="font-['Helvetica_Neue:Medium',sans-serif] relative shrink-0 text-[#252b37] text-[14px]">4</p>
    </div>
  );
}

function Frame25() {
  return (
    <div className="content-stretch flex gap-[12px] items-start relative shrink-0">
      <Frame28 />
      <Frame35 />
    </div>
  );
}

function Elements29() {
  return (
    <div className="relative size-full" data-name="elements">
      <div className="absolute inset-[-4.5%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18.1667 18.1667">
          <g id="elements">
            <circle cx="8.33333" cy="8.33333" id="Ellipse 1770" r="8.33333" stroke="var(--stroke-0, #535862)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" transform="matrix(1 0 0 -1 0.75 17.4167)" />
            <path d={svgPaths.p1162500} id="Vector 6306" stroke="var(--stroke-0, #535862)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            <path d={svgPaths.p3a7ea3e0} id="Vector" stroke="var(--stroke-0, #535862)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            <path d={svgPaths.p2bde3200} id="Ellipse 1772" stroke="var(--stroke-0, #535862)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Frame37() {
  return (
    <div className="bg-[#fafafa] content-stretch flex items-center p-[6px] relative rounded-[8px] shrink-0">
      <div aria-hidden="true" className="absolute border border-[#f5f5f5] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="overflow-clip relative shrink-0 size-[20px]" data-name="kid">
        <div className="absolute flex inset-[8.33%] items-center justify-center" style={{ containerType: "size" }}>
          <div className="-rotate-180 -scale-x-100 flex-none h-[100cqh] w-[100cqw]">
            <Elements29 />
          </div>
        </div>
      </div>
    </div>
  );
}

function Frame39() {
  return (
    <div className="content-stretch flex flex-col gap-[2px] items-start justify-center leading-[normal] not-italic relative shrink-0 whitespace-nowrap">
      <p className="font-['Helvetica_Neue:Regular',sans-serif] relative shrink-0 text-[#535862] text-[12px]">Criança(s)</p>
      <p className="font-['Helvetica_Neue:Medium',sans-serif] relative shrink-0 text-[#252b37] text-[14px]">3</p>
    </div>
  );
}

function Frame36() {
  return (
    <div className="content-stretch flex gap-[12px] items-start relative shrink-0">
      <Frame37 />
      <Frame39 />
    </div>
  );
}

function Elements30() {
  return (
    <div className="absolute inset-[14.58%_8.33%]" data-name="elements">
      <div className="absolute inset-[-5.29%_-4.5%_-5.3%_-4.5%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18.1664 15.6667">
          <g id="elements">
            <path d={svgPaths.p3f317ff0} id="Vector" stroke="var(--stroke-0, #535862)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            <path d="M5.74973 12L5.74973 14.9167" id="Vector 4044" stroke="var(--stroke-0, #535862)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            <path d="M5.74973 0.750001V3.66667" id="Vector 4045" stroke="var(--stroke-0, #535862)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            <path d={svgPaths.p2e02da00} id="Subtract" stroke="var(--stroke-0, #535862)" strokeLinejoin="round" strokeWidth="1.5" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Frame42() {
  return (
    <div className="bg-[#fafafa] content-stretch flex items-center p-[6px] relative rounded-[8px] shrink-0">
      <div aria-hidden="true" className="absolute border border-[#f5f5f5] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="overflow-clip relative shrink-0 size-[20px]" data-name="ticket-star">
        <Elements30 />
      </div>
    </div>
  );
}

function Frame43() {
  return (
    <div className="content-stretch flex flex-col gap-[2px] items-start justify-center leading-[normal] not-italic relative shrink-0 whitespace-nowrap">
      <p className="font-['Helvetica_Neue:Regular',sans-serif] relative shrink-0 text-[#535862] text-[12px]">Cortesia(s)</p>
      <p className="font-['Helvetica_Neue:Medium',sans-serif] relative shrink-0 text-[#252b37] text-[14px]">1</p>
    </div>
  );
}

function Frame41() {
  return (
    <div className="content-stretch flex gap-[12px] items-start relative shrink-0">
      <Frame42 />
      <Frame43 />
    </div>
  );
}

function Frame24() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
      <Frame25 />
      <Frame36 />
      <Frame41 />
    </div>
  );
}

function Frame60() {
  return (
    <div className="bg-white border border-[#f5f5f5] border-solid content-stretch flex flex-col gap-[12px] items-start p-[24px] relative rounded-[16px] w-full">
      <Frame26 />
      <Frame27 />
      <PrimitiveDiv1 />
      <Frame24 />
    </div>
  );
}

export default function AgendaVisaoGeral({ onAtualizacoesClick, onBackToActivities, hideSidebar, activityId }: { onAtualizacoesClick?: () => void; onBackToActivities?: () => void; hideSidebar?: boolean; activityId?: string }) {
  const _act = activityId ? mockActivities.find((a) => a.id === activityId) : undefined;
  const actName = _act?.name || "Trilha Pico do Itacolomi";
  const actDate = _act ? _act.date.split("-").reverse().join("/") + ", " + _act.startTime : "18/02/2026, 08:00";
  const _durH = _act ? Math.floor((parseInt(_act.endTime.split(":")[0]) * 60 + parseInt(_act.endTime.split(":")[1]) - parseInt(_act.startTime.split(":")[0]) * 60 - parseInt(_act.startTime.split(":")[1])) / 60) : 2;
  const actDurationFull = _act ? `${_act.startTime} - ${_act.endTime} (${_durH}h)` : "08:00 - 11:00 (2h)";
  // Set module-level vars for static Figma Make sub-components
  _dynActName = actName;
  _dynActDate = actDate;
  _dynActDuration = actDurationFull;
  return (
    <div className="bg-[#f8fafc] relative size-full overflow-auto" data-name="AGENDA - VISÃO GERAL">
      <TopBar />
      <div className="absolute content-stretch flex gap-[10px] items-center left-[248px] top-[116px]" data-name="Breadcrumb">
        <div className="flex flex-col font-['Helvetica_Neue:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#71717a] text-[14px] whitespace-nowrap">
          <p className="leading-[normal]">Início</p>
        </div>
        <div className="overflow-clip relative shrink-0 size-[16px]" data-name="chevron-right">
          <div className="absolute bottom-1/4 left-[37.5%] right-[37.5%] top-1/4" data-name="Vector">
            <div className="absolute inset-[-6.25%_-12.5%]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 5 9">
                <path d="M0.5 8.5L4.5 4.5L0.5 0.5" id="Vector" stroke="var(--stroke-0, #71717A)" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        </div>
        <div className="overflow-clip relative shrink-0 size-[16px]" data-name="ellipsis">
          <div className="absolute inset-[45.83%]" data-name="Vector">
            <div className="absolute inset-[-37.5%]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2.33333 2.33333">
                <path d={svgPaths.padc050} fill="var(--fill-0, #71717A)" id="Vector" stroke="var(--stroke-0, #71717A)" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
          <div className="absolute bottom-[45.83%] left-3/4 right-[16.67%] top-[45.83%]" data-name="Vector">
            <div className="absolute inset-[-37.5%]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2.33333 2.33333">
                <path d={svgPaths.padc050} fill="var(--fill-0, #71717A)" id="Vector" stroke="var(--stroke-0, #71717A)" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
          <div className="absolute bottom-[45.83%] left-[16.67%] right-3/4 top-[45.83%]" data-name="Vector">
            <div className="absolute inset-[-37.5%]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2.33333 2.33333">
                <path d={svgPaths.padc050} fill="var(--fill-0, #71717A)" id="Vector" stroke="var(--stroke-0, #71717A)" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        </div>
        <div className="overflow-clip relative shrink-0 size-[16px]" data-name="chevron-right">
          <div className="absolute bottom-1/4 left-[37.5%] right-[37.5%] top-1/4" data-name="Vector">
            <div className="absolute inset-[-6.25%_-12.5%]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 5 9">
                <path d="M0.5 8.5L4.5 4.5L0.5 0.5" id="Vector" stroke="var(--stroke-0, #71717A)" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        </div>
        <button onClick={onBackToActivities} className="flex flex-col font-['Helvetica_Neue:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#71717a] text-[14px] whitespace-nowrap cursor-pointer hover:text-[#0b5ed7] transition-colors">
          <p className="leading-[normal]">Atividades do Dia</p>
        </button>
        <div className="overflow-clip relative shrink-0 size-[16px]" data-name="chevron-right">
          <div className="absolute bottom-1/4 left-[37.5%] right-[37.5%] top-1/4" data-name="Vector">
            <div className="absolute inset-[-6.25%_-12.5%]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 5 9">
                <path d="M0.5 8.5L4.5 4.5L0.5 0.5" id="Vector" stroke="var(--stroke-0, #71717A)" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        </div>
        <div className="flex flex-col font-['Helvetica_Neue:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#09090b] text-[14px] whitespace-nowrap">
          <p className="leading-[normal]">{actName}</p>
        </div>
      </div>
      {/* Content wrapper — responsive 2-column layout */}
      <div className="absolute flex gap-[24px] left-[248px] right-[24px] top-[153px]" style={{ paddingBottom: "40px" }}>
        {/* Left column */}
        <div className="flex flex-col flex-1 gap-[24px] min-w-0">
          <Frame57 />
          <Frame60 />
          <Frame />
        </div>
        {/* Right column — Equipe Escalada */}
        <div className="shrink-0 w-[45%] max-w-[618px]">
          <Frame56 />
        </div>
      </div>
      {!hideSidebar && <SidebarAdmin onAtualizacoesClick={onAtualizacoesClick} onBackToActivities={onBackToActivities} />}
    </div>
  );
}