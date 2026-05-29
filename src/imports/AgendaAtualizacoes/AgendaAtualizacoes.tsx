// @ts-nocheck
import React, { useState, useMemo, useReducer, useRef, useEffect } from "react";
import svgPaths from "./svg-axule6rb2z";
import imgTopBar from "./4a664b1820bfb04f20dc4f636db105ede4311f14.png";
import AgendaVisaoGeral from "../AgendaVisaoGeral/AgendaVisaoGeral";
import { mockReservations, mockActivities, isEligibleForBulkAction, reservationStateMachine } from "../../mocks/agenda";
import type { Activity, Reservation, Participant, CheckInStatus, BulkAction, ReservationStatus } from "../../types/agenda";
import { ParticipantCountBadge } from "../../components/ui/participant-count-badge";
import { ParticipantAttributeBadge } from "../../components/ui/participant-attribute-badge";
import type { ImageTermStatus } from "../../types/agenda";

// ─── Reservation state management ───────────────────────────────────────────

type ResAction =
  | { type: "CHECK_IN"; participantId: string }
  | { type: "UNDO_CHECK_IN"; participantId: string };

function reservationsReducer(state: Reservation[], action: ResAction): Reservation[] {
  return state.map((r) => {
    // Check-in actions target participants
    if (action.type !== "CHECK_IN" && action.type !== "UNDO_CHECK_IN") return r;
    const hasTarget = r.participants.some((p) => p.id === action.participantId);
    if (!hasTarget) return r;
    const newParticipants = r.participants.map((p) => {
      if (p.id !== action.participantId) return p;
      if (action.type === "CHECK_IN") return { ...p, checkInStatus: "Done" as CheckInStatus };
      if (action.type === "UNDO_CHECK_IN") return { ...p, checkInStatus: "Pending" as CheckInStatus };
      return p;
    });
    // r.status (sale cycle) does NOT change during check-in — only participants update
    return { ...r, participants: newParticipants };
  });
}

// Toast
function Toast({ message, type, onClose }: { message: string; type: "success" | "error"; onClose: () => void }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
  }, []);
  const handleClose = () => { setVisible(false); setTimeout(onClose, 200); };

  return (
    <div
      className={`fixed top-[24px] right-[24px] z-[60] w-[384px] flex overflow-clip rounded-[8px] border border-[#e4e4e7] border-solid bg-white shadow-[0px_4px_6px_-4px_rgba(0,0,0,0.1),0px_10px_15px_-3px_rgba(0,0,0,0.1)] transition-all duration-200 ${visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-[8px]"}`}
    >
      {/* Left color stripe with icon */}
      <div className={`flex items-center justify-center shrink-0 w-[60px] ${type === "success" ? "bg-[#ecfdf3]" : "bg-[#fef3f2]"}`}>
        {type === "success" ? (
          <svg className="size-[28px]" viewBox="0 0 28 28" fill="none"><path d="M23.8004 11.3614C25.0444 12.6053 25.6663 13.2273 25.6663 14.0001C25.6663 14.773 25.0443 15.395 23.8004 16.639C22.9641 17.4752 22.7073 18.0152 22.7073 19.1894C22.7073 20.1186 22.8876 21.4407 22.1553 22.1668C21.4288 22.8872 20.1122 22.7078 19.1889 22.7078C18.0556 22.7078 17.5098 22.9295 16.701 23.7384C16.0123 24.4271 15.089 25.6668 13.9997 25.6668C12.9104 25.6668 11.9871 24.4271 11.2983 23.7384C10.4895 22.9295 9.94375 22.7078 8.81042 22.7078C7.88713 22.7078 6.57056 22.8872 5.84408 22.1668C5.11178 21.4407 5.292 20.1186 5.292 19.1894C5.292 18.0152 5.03519 17.4752 4.19895 16.639C2.955 15.395 2.33303 14.773 2.33301 14.0001C2.33302 13.2273 2.95499 12.6053 4.19892 11.3614C4.94541 10.6149 5.292 9.87515 5.292 8.8109C5.292 7.88759 5.11258 6.571 5.83301 5.84452C6.55917 5.11224 7.88121 5.29246 8.81043 5.29246C9.87466 5.29246 10.6144 4.9459 11.3609 4.19943C12.6048 2.95547 13.2268 2.3335 13.9997 2.3335C14.7726 2.3335 15.3945 2.95547 16.6385 4.19943M22.1553 22.1668H22.1663" stroke="#079455" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M9.91699 11.0833L14.0003 15.1667L24.5006 3.5" stroke="#079455" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        ) : (
          <svg className="size-[28px]" viewBox="0 0 28 28" fill="none"><path d="M2.91699 13.9998C2.91699 8.7751 2.91699 6.16274 4.54011 4.53962C6.16323 2.9165 8.77559 2.9165 14.0003 2.9165C19.2251 2.9165 21.8374 2.9165 23.4605 4.53962C25.0837 6.16274 25.0837 8.7751 25.0837 13.9998C25.0837 19.2246 25.0837 21.8369 23.4605 23.4601C21.8374 25.0832 19.2251 25.0832 14.0003 25.0832C8.77559 25.0832 6.16323 25.0832 4.54011 23.4601C2.91699 21.8369 2.91699 19.2246 2.91699 13.9998Z" stroke="#D92D20" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M14 9.3335V14.5835" stroke="#D92D20" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M14 18.6528V18.6645" stroke="#D92D20" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
        )}
      </div>
      {/* Content area */}
      <div className="flex flex-col justify-center gap-[4px] flex-1 px-[16px] py-[16px]">
        <p className="font-['Helvetica_Neue:Medium',sans-serif] leading-[normal] not-italic text-[14px] text-[#252b37]">{message}</p>
      </div>
      {/* Close button */}
      <button onClick={handleClose} className="cursor-pointer flex items-center justify-center shrink-0 w-[40px] hover:bg-[#f8fafc] transition-colors">
        <svg className="size-[16px]" fill="none" viewBox="0 0 16 16"><path d="M4 4l8 8M12 4l-8 8" stroke="#717680" strokeWidth="1.5" strokeLinecap="round"/></svg>
      </button>
    </div>
  );
}

// Initials avatar
function InitialsAvatar({ name }: { name: string }) {
  const initials = name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
  return (
    <div className="bg-[#fafafa] border border-[#f5f5f5] border-solid flex items-center justify-center rounded-[9999px] shrink-0 size-[40px]">
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[24px] not-italic text-[16px] text-[#252b37]">{initials}</p>
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
    <div className="bg-white drop-shadow-[0px_1px_1px_rgba(10,13,18,0.05)] flex-[1_0_0] min-w-px relative rounded-[16px]" data-name="Search bar">
      <div aria-hidden="true" className="absolute border border-[#f5f5f5] border-solid inset-0 pointer-events-none rounded-[16px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[8px] items-center px-[17px] py-[18px] relative size-full">
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
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 2);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <div className={`fixed content-stretch flex gap-[24px] items-center pl-[248px] pr-[24px] py-[24px] left-0 right-0 top-0 z-10 transition-[background-color,box-shadow] duration-200 ${scrolled ? "bg-white shadow-[0px_2px_8px_0px_rgba(0,0,0,0.08)]" : "bg-[#f8fafc]"}`} data-name="TopBar">
      <SearchBar />
      <TopBar1 />
      <SlotClone />
      <Container />
    </div>
  );
}

function Frame() {
  return (
    <div className="absolute bottom-0 right-0 size-[10px]">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10 10">
        <g id="Frame 7">
          <path clipRule="evenodd" d={svgPaths.p2f32ec80} fill="var(--fill-0, #71717A)" fillRule="evenodd" id="Icon" />
          <path clipRule="evenodd" d={svgPaths.p2f386d80} fill="var(--fill-0, #71717A)" fillRule="evenodd" id="Icon_2" />
        </g>
      </svg>
    </div>
  );
}

function Avatar() {
  return (
    <div className="relative shrink-0 size-[32px]" data-name="avatar">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
        <g id="Ellipse 1">
          <circle cx="16" cy="16" fill="var(--fill-0, #FFFAEB)" r="15.5" />
          <circle cx="16" cy="16" r="15.5" stroke="url(#paint0_linear_11_2759)" />
          <circle cx="16" cy="16" r="15.5" stroke="var(--stroke-1, #F5F5F5)" />
          <circle cx="16" cy="16" r="15.5" stroke="url(#paint1_linear_11_2759)" />
          <circle cx="16" cy="16" r="15.5" stroke="var(--stroke-3, #FEF0C7)" />
        </g>
        <defs>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_11_2759" x1="16" x2="16" y1="0" y2="32">
            <stop stopColor="white" stopOpacity="0.12" />
            <stop offset="1" stopColor="white" stopOpacity="0" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint1_linear_11_2759" x1="16" x2="16" y1="0" y2="32">
            <stop stopColor="white" stopOpacity="0.12" />
            <stop offset="1" stopColor="white" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
      <p className="-translate-x-1/2 absolute font-['Inter:Medium',sans-serif] font-medium leading-[19.2px] left-1/2 not-italic overflow-hidden text-[#252b37] text-[12.8px] text-center text-ellipsis top-[calc(50%-9.6px)] w-[22.4px] whitespace-nowrap">🛠️</p>
    </div>
  );
}

function Container2() {
  return <div className="absolute bg-[#e2e8f0] h-[40px] left-[16px] top-[46px] w-px" data-name="Container" />;
}

function Frame9() {
  return (
    <div className="h-full relative shrink-0">
      <div className="flex flex-col items-center size-full">
        <div className="content-stretch flex flex-col gap-[4px] items-center pt-[6px] relative size-full">
          <Avatar />
          <Container2 />
        </div>
      </div>
    </div>
  );
}

function Frame10() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[6px] items-center min-w-px not-italic relative whitespace-nowrap">
      <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] overflow-hidden relative shrink-0 text-[#314158] text-[14px] text-ellipsis">Equipamentos pendentes</p>
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[13.5px] relative shrink-0 text-[#717680] text-[12px] text-center tracking-[0.167px]">•</p>
      <div className="flex flex-col font-['Helvetica_Neue:Regular',sans-serif] justify-center leading-[0] overflow-hidden relative shrink-0 text-[#535862] text-[12px] text-ellipsis">
        <p className="leading-[normal] overflow-hidden text-ellipsis">10:15, 07/04/2026</p>
      </div>
    </div>
  );
}

function App1() {
  return (
    <div className="bg-[#fba12c] relative rounded-[9999px] shrink-0 size-[10px]" data-name="App">
      <div aria-hidden="true" className="absolute border-[0.556px] border-solid border-white inset-0 pointer-events-none rounded-[9999px]" />
    </div>
  );
}

function Frame19() {
  return (
    <div className="content-stretch flex gap-[6px] items-start justify-end relative shrink-0 w-full">
      <Frame10 />
      <App1 />
    </div>
  );
}

function Frame4() {
  return (
    <div className="bg-[#fffaeb] flex-[1_0_0] min-w-px relative rounded-[10px]">
      <div aria-hidden="true" className="absolute border border-[#fef0c7] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <div className="flex flex-col items-end size-full">
        <div className="content-stretch flex flex-col gap-[6px] items-end px-[16px] py-[12px] relative size-full">
          <Frame19 />
          <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#535862] text-[12px] w-full">2 kits de rapel ainda não foram verificados para esta atividade. Confirme a disponibilidade antes da saída.</p>
        </div>
      </div>
    </div>
  );
}

function Container1() {
  return (
    <div className="content-stretch flex gap-[12px] h-[68px] items-start relative shrink-0 w-full" data-name="Container">
      <Frame9 />
      <Frame4 />
    </div>
  );
}

function Avatar1() {
  return (
    <div className="relative shrink-0 size-[32px]" data-name="avatar">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
        <g id="Ellipse 1">
          <circle cx="16" cy="16" fill="var(--fill-0, #F4F3FF)" r="15.5" />
          <circle cx="16" cy="16" r="15.5" stroke="url(#paint0_linear_11_2752)" />
          <circle cx="16" cy="16" r="15.5" stroke="var(--stroke-1, #F5F5F5)" />
          <circle cx="16" cy="16" r="15.5" stroke="url(#paint1_linear_11_2752)" />
          <circle cx="16" cy="16" r="15.5" stroke="var(--stroke-3, #EBE9FE)" />
        </g>
        <defs>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_11_2752" x1="16" x2="16" y1="0" y2="32">
            <stop stopColor="white" stopOpacity="0.12" />
            <stop offset="1" stopColor="white" stopOpacity="0" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint1_linear_11_2752" x1="16" x2="16" y1="0" y2="32">
            <stop stopColor="white" stopOpacity="0.12" />
            <stop offset="1" stopColor="white" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
      <p className="-translate-x-1/2 absolute font-['Inter:Medium',sans-serif] font-medium leading-[19.2px] left-1/2 not-italic overflow-hidden text-[#252b37] text-[12.8px] text-center text-ellipsis top-[calc(50%-9.6px)] w-[22.4px] whitespace-nowrap">🩺️</p>
    </div>
  );
}

function Container4() {
  return <div className="absolute bg-[#e2e8f0] h-[57px] left-[16px] top-[46px] w-px" data-name="Container" />;
}

function Frame11() {
  return (
    <div className="relative self-stretch shrink-0">
      <div className="flex flex-col items-center size-full">
        <div className="content-stretch flex flex-col gap-[4px] items-center pt-[6px] relative size-full">
          <Avatar1 />
          <Container4 />
        </div>
      </div>
    </div>
  );
}

function Frame12() {
  return (
    <div className="content-stretch flex gap-[6px] items-center relative shrink-0 w-full whitespace-nowrap">
      <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] overflow-hidden relative shrink-0 text-[#314158] text-[14px] text-ellipsis">Análise de saúde dos participantes</p>
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[13.5px] relative shrink-0 text-[#717680] text-[12px] text-center tracking-[0.167px]">•</p>
      <div className="flex flex-col font-['Helvetica_Neue:Regular',sans-serif] justify-center leading-[0] overflow-hidden relative shrink-0 text-[#535862] text-[12px] text-ellipsis">
        <p className="leading-[normal] overflow-hidden text-ellipsis">12:15, 07/04/2026</p>
      </div>
    </div>
  );
}

function Frame5() {
  return (
    <div className="bg-[#f4f3ff] flex-[1_0_0] min-w-px relative rounded-[10px]">
      <div aria-hidden="true" className="absolute border border-[#ebe9fe] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col gap-[4px] items-start justify-center not-italic px-[16px] py-[12px] relative size-full">
          <Frame12 />
          <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[0] relative shrink-0 text-[#535862] text-[0px] w-full">
            <span className="leading-[normal] text-[12px]">{`O participante `}</span>
            <span className="font-['Helvetica_Neue:Medium',sans-serif] leading-[normal] text-[#252b37] text-[12px]">Pedro Almeida</span>
            <span className="leading-[normal] text-[12px]">{` informou uso contínuo de medicamento controlado (anticoagulante). Avaliar riscos para atividade de rapel.`}</span>
          </p>
        </div>
      </div>
    </div>
  );
}

function Container3() {
  return (
    <div className="content-stretch flex gap-[12px] items-start relative shrink-0 w-full" data-name="Container">
      <Frame11 />
      <Frame5 />
    </div>
  );
}

function Avatar2() {
  return (
    <div className="relative shrink-0 size-[32px]" data-name="avatar">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
        <circle cx="16" cy="16" fill="var(--fill-0, #FFFAEB)" id="Ellipse 1" r="15.5" stroke="var(--stroke-0, #FEF0C7)" />
      </svg>
      <p className="-translate-x-1/2 absolute font-['Inter:Medium',sans-serif] font-medium leading-[19.2px] left-1/2 not-italic overflow-hidden text-[#252b37] text-[12.8px] text-center text-ellipsis top-[calc(50%-9.6px)] w-[22.4px] whitespace-nowrap">🧗</p>
    </div>
  );
}

function Container6() {
  return <div className="absolute bg-[#e2e8f0] h-[57px] left-[16px] top-[46px] w-px" data-name="Container" />;
}

function Frame13() {
  return (
    <div className="h-full relative shrink-0">
      <div className="flex flex-col items-center size-full">
        <div className="content-stretch flex flex-col gap-[4px] items-center pt-[6px] relative size-full">
          <Avatar2 />
          <Container6 />
        </div>
      </div>
    </div>
  );
}

function Frame14() {
  return (
    <div className="content-stretch flex gap-[6px] items-center relative shrink-0 w-full whitespace-nowrap">
      <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] overflow-hidden relative shrink-0 text-[#314158] text-[14px] text-ellipsis">Equipe incompleta</p>
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[13.5px] relative shrink-0 text-[#717680] text-[12px] text-center tracking-[0.167px]">•</p>
      <div className="flex flex-col font-['Helvetica_Neue:Regular',sans-serif] justify-center leading-[0] overflow-hidden relative shrink-0 text-[#535862] text-[12px] text-ellipsis">
        <p className="leading-[normal] overflow-hidden text-ellipsis">15:15, 07/04/2026</p>
      </div>
    </div>
  );
}

function Frame6() {
  return (
    <div className="bg-[#fffaeb] flex-[1_0_0] min-w-px relative rounded-[10px]">
      <div aria-hidden="true" className="absolute border border-[#fef0c7] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col gap-[4px] items-start justify-center not-italic px-[16px] py-[12px] relative size-full">
          <Frame14 />
          <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[0] relative shrink-0 text-[#535862] text-[0px] w-full">
            <span className="leading-[normal] text-[12px]">{`O guia `}</span>
            <span className="font-['Helvetica_Neue:Medium',sans-serif] leading-[normal] text-[#414651] text-[12px]">João Silva</span>
            <span className="leading-[normal] text-[12px]">{` cancelou participação (motivo: doença). Encontre um substituto para a atividade de rapel.`}</span>
          </p>
        </div>
      </div>
    </div>
  );
}

function Container5() {
  return (
    <div className="content-stretch flex gap-[12px] h-[85px] items-start relative shrink-0 w-full" data-name="Container">
      <Frame13 />
      <Frame6 />
    </div>
  );
}

function Avatar3() {
  return (
    <div className="relative shrink-0 size-[32px]" data-name="avatar">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
        <circle cx="16" cy="16" fill="var(--fill-0, #FFFAEB)" id="Ellipse 1" r="15.5" stroke="var(--stroke-0, #FEF0C7)" />
      </svg>
      <p className="-translate-x-1/2 absolute font-['Inter:Medium',sans-serif] font-medium leading-[19.2px] left-1/2 not-italic overflow-hidden text-[#252b37] text-[12.8px] text-center text-ellipsis top-[calc(50%-9.6px)] w-[22.4px] whitespace-nowrap">🚐</p>
    </div>
  );
}

function Container8() {
  return <div className="absolute bg-[#e2e8f0] h-[56px] left-[16px] top-[46px] w-px" data-name="Container" />;
}

function Frame15() {
  return (
    <div className="h-full relative shrink-0">
      <div className="flex flex-col items-center size-full">
        <div className="content-stretch flex flex-col gap-[4px] items-center pt-[6px] relative size-full">
          <Avatar3 />
          <Container8 />
        </div>
      </div>
    </div>
  );
}

function Frame16() {
  return (
    <div className="content-stretch flex gap-[6px] items-center relative shrink-0 w-full whitespace-nowrap">
      <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] overflow-hidden relative shrink-0 text-[#314158] text-[14px] text-ellipsis">Transporte pendente de confirmação</p>
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[13.5px] relative shrink-0 text-[#717680] text-[12px] text-center tracking-[0.167px]">•</p>
      <div className="flex flex-col font-['Helvetica_Neue:Regular',sans-serif] justify-center leading-[0] overflow-hidden relative shrink-0 text-[#535862] text-[12px] text-ellipsis">
        <p className="leading-[normal] overflow-hidden text-ellipsis">09:35, 07/04/2026</p>
      </div>
    </div>
  );
}

function Frame7() {
  return (
    <div className="bg-[#fffaeb] flex-[1_0_0] min-w-px relative rounded-[10px]">
      <div aria-hidden="true" className="absolute border border-[#fef0c7] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col gap-[4px] items-start justify-center not-italic px-[16px] py-[12px] relative size-full">
          <Frame16 />
          <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] relative shrink-0 text-[#535862] text-[12px] w-full">O transporte para o Parque Estadual ainda não foi confirmado. É necessário ao menos 1 van para 8 participantes + equipe.</p>
        </div>
      </div>
    </div>
  );
}

function Container7() {
  return (
    <div className="content-stretch flex gap-[12px] h-[84px] items-start relative shrink-0 w-full" data-name="Container">
      <Frame15 />
      <Frame7 />
    </div>
  );
}

function Avatar4() {
  return (
    <div className="relative shrink-0 size-[32px]" data-name="avatar">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
        <circle cx="16" cy="16" fill="var(--fill-0, #EFF8FF)" id="Ellipse 1" r="15.5" stroke="var(--stroke-0, #D1E9FF)" />
      </svg>
      <p className="-translate-x-1/2 absolute font-['Inter:Medium',sans-serif] font-medium leading-[19.2px] left-1/2 not-italic overflow-hidden text-[#252b37] text-[12.8px] text-center text-ellipsis top-[calc(50%-9.6px)] w-[22.4px] whitespace-nowrap">💳</p>
    </div>
  );
}

function Frame17() {
  return (
    <div className="h-full relative shrink-0">
      <div className="flex flex-col items-center size-full">
        <div className="content-stretch flex flex-col gap-[4px] items-center pt-[6px] relative size-full">
          <Avatar4 />
        </div>
      </div>
    </div>
  );
}

function Frame18() {
  return (
    <div className="content-stretch flex gap-[6px] items-center relative shrink-0 w-full whitespace-nowrap">
      <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] overflow-hidden relative shrink-0 text-[#314158] text-[14px] text-ellipsis">Reserva não paga</p>
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[13.5px] relative shrink-0 text-[#717680] text-[12px] text-center tracking-[0.167px]">•</p>
      <div className="flex flex-col font-['Helvetica_Neue:Regular',sans-serif] justify-center leading-[0] overflow-hidden relative shrink-0 text-[#535862] text-[12px] text-ellipsis">
        <p className="leading-[normal] overflow-hidden text-ellipsis">1 semana atrás</p>
      </div>
    </div>
  );
}

function Frame8() {
  return (
    <div className="bg-[#eff8ff] flex-[1_0_0] min-w-px relative rounded-[10px]">
      <div aria-hidden="true" className="absolute border border-[#d1e9ff] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col gap-[4px] items-start justify-center not-italic px-[16px] py-[12px] relative size-full">
          <Frame18 />
          <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[0] relative shrink-0 text-[#535862] text-[0px] w-full">
            <span className="leading-[normal] text-[12px]">{`O boleto do participante `}</span>
            <span className="font-['Helvetica_Neue:Medium',sans-serif] leading-[normal] text-[#414651] text-[12px]">Carlos Eduardo</span>
            <span className="leading-[normal] text-[12px]">{` vence hoje. Se não for pago, a reserva será cancelada automaticamente às 23:59.`}</span>
          </p>
        </div>
      </div>
    </div>
  );
}

function Container9() {
  return (
    <div className="content-stretch flex gap-[12px] h-[85px] items-start relative shrink-0 w-full" data-name="Container">
      <Frame17 />
      <Frame8 />
    </div>
  );
}

function Frame21() {
  return (
    <div className="content-stretch flex flex-col gap-[20px] items-start relative shrink-0 w-full">
      <Container1 />
      <Container3 />
      <Container5 />
      <Container7 />
      <Container9 />
    </div>
  );
}

function Frame22() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full">
      <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#0f172b] text-[18px] w-full">Registro de atividades (05)</p>
      <Frame21 />
    </div>
  );
}

function Frame23() {
  const [isActive, setIsActive] = useState(false);
  const [text, setText] = useState("");

  if (isActive) {
    return (
      <div className="absolute content-stretch flex flex-col gap-[20px] h-[843px] items-start left-[248px] top-[157px] w-[743px]">
        <div className="bg-white flex-[1_0_0] min-h-[52px] relative rounded-[12px] w-full" data-name="Text field area">
          <div aria-hidden="true" className="absolute border border-[#e4e4e7] border-solid inset-0 pointer-events-none rounded-[12px]" />
          <div className="content-stretch flex gap-[12px] items-start min-h-[inherit] px-[16px] py-[12px] relative size-full">
            <textarea
              autoFocus
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Digite sua mensagem"
              className="flex flex-[1_0_0] font-['Helvetica_Neue:Regular',sans-serif] min-w-px not-italic text-[#414651] text-[14px] bg-transparent outline-none resize-none leading-normal placeholder:text-[#71717a]"
            />
            <div className="content-stretch flex gap-[2px] items-center relative shrink-0" data-name="Toggle Group/Default">
              <button className="content-stretch flex h-[24px] items-center justify-center px-[7.2px] py-[4.8px] relative rounded-[3.6px] shrink-0 hover:bg-[#f4f4f5] transition-colors" data-name="Toggle/Default">
                <div aria-hidden="true" className="absolute border-[#e4e4e7] border-[0.6px] border-solid inset-0 pointer-events-none rounded-[3.6px]" />
                <div className="overflow-clip relative rounded-[10px] shrink-0 size-[9.6px]" data-name="bold">
                  <div className="absolute bottom-[16.67%] left-1/4 right-[20.83%] top-[16.67%]" data-name="Vector">
                    <div className="absolute inset-[-4.69%_-5.77%]">
                      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 5.8 7">
                        <path d="M2.82333 3.85833C3.09333 3.85833 3.35667 3.795 3.595 3.66833C3.83333 3.54167 4.02 3.36833 4.155 3.14833C4.29 2.92833 4.35833 2.68 4.35833 2.40667C4.35833 2.13333 4.29 1.885 4.155 1.665C4.02 1.445 3.83333 1.27333 3.595 1.15C3.35667 1.02667 3.09167 0.965 2.8 0.965H1.15V3.85833H2.82333ZM2.95833 6.035C3.26333 6.035 3.54833 5.96667 3.81333 5.83C4.07833 5.69333 4.29333 5.50833 4.45833 5.275C4.62333 5.04167 4.70583 4.77333 4.70583 4.47C4.70583 4.15333 4.62 3.87 4.44833 3.62C4.27667 3.37 4.04833 3.17667 3.76333 3.04C3.47833 2.90333 3.16333 2.835 2.81833 2.835H1.15V6.035H2.95833ZM2.89167 7H0.15V0H2.85333C3.34 0 3.78667 0.0966669 4.19333 0.29C4.6 0.483334 4.92167 0.751667 5.155 1.095C5.38833 1.43833 5.505 1.82667 5.505 2.26C5.505 2.78 5.345 3.22333 5.025 3.59C4.705 3.95667 4.28667 4.19667 3.77 4.31C4.03667 4.37 4.285 4.47667 4.515 4.63C4.745 4.78333 4.93 4.98667 5.075 5.24C5.22 5.49333 5.29333 5.79167 5.29333 6.135C5.29333 6.595 5.17167 7.00667 4.92833 7.37C4.685 7.73333 4.345 8.02 3.90833 8.23C3.47167 8.44 2.97167 8.545 2.40833 8.545H0.15V7.545H2.89167V7Z" fill="var(--fill-0, #09090B)" id="Vector" />
                      </svg>
                    </div>
                  </div>
                </div>
              </button>
              <button className="content-stretch flex h-[24px] items-center justify-center px-[7.2px] py-[4.8px] relative rounded-[3.6px] shrink-0 hover:bg-[#f4f4f5] transition-colors" data-name="Toggle/Default">
                <div aria-hidden="true" className="absolute border-[#e4e4e7] border-[0.6px] border-solid inset-0 pointer-events-none rounded-[3.6px]" />
                <div className="overflow-clip relative shrink-0 size-[9.6px]" data-name="italic">
                  <div className="absolute inset-[16.67%_20.83%]" data-name="Vector">
                    <div className="absolute inset-[-4.69%_-5.36%]">
                      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6.2 7.00016">
                        <path d="M3.3 7.00016H0.3V6.00016H1.5L2.9 1.00016H1.7V0.00015831H4.7V1.00016H3.5L2.1 6.00016H3.3V7.00016Z" fill="var(--fill-0, #09090B)" id="Vector" />
                      </svg>
                    </div>
                  </div>
                </div>
              </button>
              <button className="content-stretch flex h-[24px] items-center justify-center px-[7.2px] py-[4.8px] relative rounded-[3.6px] shrink-0 hover:bg-[#f4f4f5] transition-colors" data-name="Toggle/Default">
                <div aria-hidden="true" className="absolute border-[#e4e4e7] border-[0.6px] border-solid inset-0 pointer-events-none rounded-[3.6px]" />
                <div className="overflow-clip relative shrink-0 size-[9.6px]" data-name="underline">
                  <div className="absolute inset-[16.67%]" data-name="Vector">
                    <div className="absolute inset-[-4.69%]">
                      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 7 7">
                        <path d="M0.3 7H6.7V6H0.3V7ZM3.5 5C2.87667 5 2.35 4.78 1.92 4.34C1.49 3.9 1.275 3.36 1.275 2.72V0H2.275V2.73C2.275 3.11 2.39 3.42833 2.62 3.685C2.85 3.94167 3.14333 4.07 3.5 4.07C3.85667 4.07 4.15 3.94167 4.38 3.685C4.61 3.42833 4.725 3.11 4.725 2.73V0H5.725V2.72C5.725 3.36 5.51 3.9 5.08 4.34C4.65 4.78 4.12333 5 3.5 5Z" fill="var(--fill-0, #09090B)" id="Vector" />
                      </svg>
                    </div>
                  </div>
                </div>
              </button>
            </div>
            <div className="absolute bottom-0 right-0 size-[10px]">
              <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10 10">
                <g id="Frame 7">
                  <path clipRule="evenodd" d="M10 7C10 8.65685 8.65685 10 7 10V7H10Z" fill="var(--fill-0, #71717A)" fillRule="evenodd" id="Icon" />
                  <path clipRule="evenodd" d="M7 10H0L7 3V10Z" fill="var(--fill-0, #71717A)" fillRule="evenodd" id="Icon_2" />
                </g>
              </svg>
            </div>
          </div>
        </div>
        <div className="content-stretch flex gap-[16px] h-[40px] items-center justify-center relative shrink-0 w-full">
          <button className="bg-white content-stretch cursor-pointer drop-shadow-[0px_1px_1px_rgba(10,13,18,0.05)] flex gap-[4px] h-[24px] items-center px-[8px] py-[5px] relative rounded-[6px] shrink-0" data-name="Category select component">
            <div aria-hidden="true" className="absolute border border-[#d5d7da] border-solid inset-0 pointer-events-none rounded-[6px]" />
            <div className="flex flex-col font-['Helvetica_Neue:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#71717a] text-[12px] text-left whitespace-nowrap">
              <p className="leading-[normal]">Categoria:</p>
            </div>
            <p className="font-['Helvetica_Neue:Medium',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#414651] text-[12px] text-center whitespace-nowrap">Observação</p>
            <div className="overflow-clip relative shrink-0 size-[12px]" data-name="arrow-down-01-round">
              <div className="absolute bottom-[37.5%] left-1/4 right-1/4 top-[37.5%]" data-name="elements">
                <div className="absolute inset-[-25%_-12.5%]">
                  <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 7.5001 4.50005">
                    <g id="elements">
                      <path d="M6.75 0.75L3.75 3.75L0.75 0.75" id="Vector" stroke="var(--stroke-0, #414651)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                    </g>
                  </svg>
                </div>
              </div>
            </div>
          </button>
          <div className="content-stretch flex flex-[1_0_0] gap-[12px] items-center justify-end min-w-px relative">
            <button onClick={() => { setIsActive(false); setText(""); }} className="bg-white content-stretch cursor-pointer flex gap-[8px] items-center justify-center px-[16px] py-[10px] relative rounded-[6px] shrink-0 hover:bg-[#f8fafc] transition-colors" data-name="button">
              <div aria-hidden="true" className="absolute border border-[#e2e8f0] border-solid inset-0 pointer-events-none rounded-[6px]" />
              <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#414651] text-[16px] whitespace-nowrap">Cancelar</p>
            </button>
            <button className="bg-[#f0f5ff] content-stretch cursor-pointer flex gap-[8px] items-center justify-center px-[16px] py-[10px] relative rounded-[6px] shrink-0 hover:bg-[#dbe4ff] transition-colors" data-name="button">
              <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#0b5ed7] text-[16px] whitespace-nowrap">Salvar registro</p>
            </button>
          </div>
        </div>
        <Frame22 />
      </div>
    );
  }

  return (
    <div className="absolute content-stretch flex flex-col gap-[20px] h-[843px] items-start left-[248px] top-[157px] w-[743px]">
      <div
        className="bg-white h-[96px] min-h-[52px] relative rounded-[12px] shrink-0 w-full"
        data-name="Text field area"
      >
        <div aria-hidden="true" className="absolute border border-[#e4e4e7] border-solid inset-0 pointer-events-none rounded-[12px]" />
        <div className="absolute top-0 left-0 right-0 flex items-start px-[16px] py-[12px]">
          <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic text-[#71717a] text-[14px] text-left">Digite sua mensagem</p>
        </div>
        <Frame />
      </div>
      <Frame22 />
    </div>
  );
}

function Elements2() {
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

function Container10({ onBackToActivities }: { onBackToActivities?: () => void }) {
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
                    <Elements2 />
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

function Frame2({ isActive }: { isActive?: boolean }) {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[2px] items-start justify-center min-w-px relative">
      <p className={`font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[14px] whitespace-nowrap ${isActive ? "text-[#0b5ed7]" : "text-[#414651]"}`}>Resumo</p>
    </div>
  );
}

function Elements3() {
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

function Frame3({ isActive }: { isActive?: boolean }) {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[2px] items-start justify-center min-w-px relative">
      <p className={`font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[14px] whitespace-nowrap ${isActive ? "text-[#0b5ed7]" : "text-[#414651]"}`}>Participantes</p>
    </div>
  );
}

function Elements4() {
  return (
    <div className="absolute inset-[10.42%]" data-name="elements">
      <div className="absolute inset-[-4.74%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 17.3333 17.3333">
          <g id="elements">
            <g id="Rectangle 2059">
              <path d={svgPaths.p1cbe4300} stroke="var(--stroke-0, #414651)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
              <path d={svgPaths.p1cbe4300} stroke="var(--stroke-1, #0B5ED7)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            </g>
            <g id="Ellipse 40">
              <path d={svgPaths.p2167cf00} stroke="var(--stroke-0, #414651)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
              <path d={svgPaths.p2167cf00} stroke="var(--stroke-1, #0B5ED7)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            </g>
            <g id="Vector 4052">
              <path d="M4.91667 9.08333H8.25" stroke="var(--stroke-0, #414651)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
              <path d="M4.91667 9.08333H8.25" stroke="var(--stroke-1, #0B5ED7)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            </g>
            <g id="Vector 4053">
              <path d="M4.91667 12.4167H11.5833" stroke="var(--stroke-0, #414651)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
              <path d="M4.91667 12.4167H11.5833" stroke="var(--stroke-1, #0B5ED7)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            </g>
          </g>
        </svg>
      </div>
    </div>
  );
}

function Frame1({ isActive }: { isActive?: boolean }) {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[2px] items-start justify-center min-w-px relative">
      <p className={`font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[14px] whitespace-nowrap ${isActive ? "text-[#0b5ed7]" : "text-[#414651]"}`}>Atualizações</p>
    </div>
  );
}

function Badge() {
  return (
    <div className="bg-[#f04438] relative rounded-[6px] shrink-0 size-[20px]" data-name="Badge">
      <div className="content-stretch flex items-center justify-center overflow-clip px-[8.556px] py-[2.556px] relative rounded-[inherit] size-full">
        <div className="flex flex-col font-['Helvetica_Neue:Medium',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-white whitespace-nowrap">
          <p className="leading-[normal]">+4</p>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border-[0.556px] border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[6px]" />
    </div>
  );
}

function Container11() {
  return <div className="absolute bg-[#1b71fd] h-[24px] left-0 rounded-br-[9999px] rounded-tr-[9999px] top-[12px] w-[4px]" data-name="Container" />;
}

function Frame20({ activeTab, setActiveTab }: { activeTab: string; setActiveTab: (tab: string) => void }) {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full">
      {/* 1. Participantes (first position) */}
      <button
        onClick={() => setActiveTab("participantes")}
        className={`${activeTab === "participantes" ? "bg-[#f0f5ff]" : "bg-white"} h-[48px] relative rounded-[14px] shrink-0 w-full cursor-pointer hover:bg-[#f8fafc] transition-colors`}
        data-name="Menu action component"
      >
        <div className="flex flex-row items-center size-full">
          <div className="content-stretch flex gap-[12px] items-center pl-[16px] pr-[12px] py-[14px] relative size-full">
            <div className="relative shrink-0 size-[20px]" data-name="user-group-02" style={{ "--stroke-0": activeTab === "participantes" ? "#0b5ed7" : "#414651" } as React.CSSProperties}>
              <Elements3 />
            </div>
            <Frame3 isActive={activeTab === "participantes"} />
            {activeTab === "participantes" && <Container11 />}
          </div>
        </div>
      </button>
      {/* 2. Resumo (second position, formerly "Visão Geral") */}
      <button
        onClick={() => setActiveTab("visao-geral")}
        className={`${activeTab === "visao-geral" ? "bg-[#f0f5ff]" : "bg-white"} h-[48px] relative rounded-[14px] shrink-0 w-full cursor-pointer hover:bg-[#f8fafc] transition-colors`}
        data-name="Menu action component"
      >
        <div className="flex flex-row items-center size-full">
          <div className="content-stretch flex gap-[12px] items-center pl-[16px] pr-[12px] py-[14px] relative size-full">
            <div className="relative shrink-0 size-[20px]" data-name="file-view" style={{ "--stroke-0": activeTab === "visao-geral" ? "#0b5ed7" : "#414651" } as React.CSSProperties}>
              <div className="absolute inset-[8.33%_20.83%_8.33%_12.5%]" data-name="Vector">
                <div className="absolute inset-[-4.5%_-5.63%]">
                  <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14.8335 18.1668">
                    <path d={svgPaths.p382a88c0} id="Vector" stroke="var(--stroke-0, #414651)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                  </svg>
                </div>
              </div>
              <div className="absolute inset-[66.67%_12.5%_8.33%_45.83%]" data-name="Vector">
                <div className="absolute inset-[-15%_-9%]">
                  <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 9.83333 6.5">
                    <path d={svgPaths.p2c30b280} id="Vector" stroke="var(--stroke-0, #414651)" strokeLinejoin="round" strokeWidth="1.5" />
                  </svg>
                </div>
              </div>
              <div className="absolute inset-[79.17%_33.33%_20.83%_66.63%]" data-name="Vector">
                <div className="absolute inset-[-1px]">
                  <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2.0075 2">
                    <path d="M1 1H1.0075" id="Vector" stroke="var(--stroke-0, #414651)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                  </svg>
                </div>
              </div>
            </div>
            <Frame2 isActive={activeTab === "visao-geral"} />
            {activeTab === "visao-geral" && <Container11 />}
          </div>
        </div>
      </button>
      {/* 3. Atualizações (third position) */}
      <button
        onClick={() => setActiveTab("atualizacoes")}
        className={`${activeTab === "atualizacoes" ? "bg-[#f0f5ff]" : "bg-white"} h-[48px] relative rounded-[14px] shrink-0 w-full cursor-pointer hover:bg-[#f8fafc] transition-colors`}
        data-name="Component 4"
      >
        <div className="flex flex-row items-center size-full">
          <div className="content-stretch flex gap-[12px] items-center pl-[16px] pr-[12px] py-[14px] relative size-full">
            <div className="overflow-clip relative shrink-0 size-[20px]" data-name="notification-square" style={{ "--stroke-0": activeTab === "atualizacoes" ? "#0b5ed7" : "#414651", "--stroke-1": activeTab === "atualizacoes" ? "#0b5ed7" : "#414651" } as React.CSSProperties}>
              <Elements4 />
            </div>
            <Frame1 isActive={activeTab === "atualizacoes"} />
            <Badge />
            {activeTab === "atualizacoes" && <Container11 />}
          </div>
        </div>
      </button>
    </div>
  );
}

function PrimitiveDiv({ activeTab, setActiveTab }: { activeTab: string; setActiveTab: (tab: string) => void }) {
  return (
    <div className="flex-[1_0_0] min-h-px relative w-full" data-name="Primitive.div">
      <div className="flex flex-col items-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col items-center pb-[16px] pt-[20px] px-[15.998px] relative size-full">
          <Frame20 activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
      </div>
    </div>
  );
}

function SidebarAdmin({ activeTab, setActiveTab, onBackToActivities }: { activeTab: string; setActiveTab: (tab: string) => void; onBackToActivities?: () => void }) {
  return (
    <div className="fixed bg-white content-stretch flex flex-col h-[745px] items-start left-[24px] rounded-[16px] top-[24px] w-[200px] z-20" data-name="Sidebar - Admin">
      <div aria-hidden="true" className="absolute border border-[#fafafa] border-solid inset-0 pointer-events-none rounded-[16px] shadow-[0px_1px_3px_0px_rgba(10,13,18,0.1),0px_1px_2px_0px_rgba(10,13,18,0.1)]" />
      <Container10 onBackToActivities={onBackToActivities} />
      <PrimitiveDiv activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}

function App2() {
  return (
    <div className="bg-[#fba12c] relative rounded-[9999px] shrink-0 size-[10px]" data-name="App">
      <div aria-hidden="true" className="absolute border-[0.556px] border-solid border-white inset-0 pointer-events-none rounded-[9999px]" />
    </div>
  );
}

function Frame29() {
  return (
    <div className="h-[4px] relative shrink-0 w-[242.889px]">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 242.889 4">
        <g id="Frame 2121453153">
          <line id="Line 38" stroke="var(--stroke-0, #F5F5F5)" strokeDasharray="4 4" x1="242.889" y1="2.5" y2="2.5" />
        </g>
      </svg>
    </div>
  );
}

function Badge1() {
  return (
    <div className="bg-[#fafafa] relative rounded-[8px] shrink-0" data-name="Badge">
      <div className="content-stretch flex items-center justify-center overflow-clip px-[8.556px] py-[1.556px] relative rounded-[inherit] size-full">
        <div className="flex flex-col font-['Helvetica_Neue:Medium',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#252b37] text-[12px] whitespace-nowrap">
          <p className="leading-[normal]">02</p>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border-[0.556px] border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Frame26() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[8px] items-end min-w-px relative">
      <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#252b37] text-[14px] whitespace-nowrap">Avisos</p>
      <Frame29 />
      <Badge1 />
    </div>
  );
}

function Frame25() {
  return (
    <div className="content-stretch flex gap-[12px] items-center relative shrink-0 w-full">
      <App2 />
      <Frame26 />
    </div>
  );
}

function App3() {
  return (
    <div className="bg-[#8d2cfb] relative rounded-[9999px] shrink-0 size-[10px]" data-name="App">
      <div aria-hidden="true" className="absolute border-[0.556px] border-solid border-white inset-0 pointer-events-none rounded-[9999px]" />
    </div>
  );
}

function Frame30() {
  return (
    <div className="flex-[1_0_0] h-[4px] min-w-px relative">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 182.889 4">
        <g id="Frame 2121453153">
          <line id="Line 38" stroke="var(--stroke-0, #F5F5F5)" strokeDasharray="4 4" x1="182.889" y1="2.5" y2="2.5" />
        </g>
      </svg>
    </div>
  );
}

function Badge2() {
  return (
    <div className="bg-[#fafafa] relative rounded-[8px] shrink-0" data-name="Badge">
      <div className="content-stretch flex items-center justify-center overflow-clip px-[8.556px] py-[1.556px] relative rounded-[inherit] size-full">
        <div className="flex flex-col font-['Helvetica_Neue:Medium',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#252b37] text-[12px] whitespace-nowrap">
          <p className="leading-[normal]">01</p>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border-[0.556px] border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Frame28() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[8px] items-end min-w-px relative">
      <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#252b37] text-[14px] whitespace-nowrap">Alerta de Saúde</p>
      <Frame30 />
      <Badge2 />
    </div>
  );
}

function Frame27() {
  return (
    <div className="content-stretch flex gap-[12px] items-center relative shrink-0 w-full">
      <App3 />
      <Frame28 />
    </div>
  );
}

function App4() {
  return (
    <div className="bg-[#53b1fd] relative rounded-[9999px] shrink-0 size-[10px]" data-name="App">
      <div aria-hidden="true" className="absolute border-[0.556px] border-solid border-white inset-0 pointer-events-none rounded-[9999px]" />
    </div>
  );
}

function Frame33() {
  return (
    <div className="flex-[1_0_0] h-[4px] min-w-px relative">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 146.889 4">
        <g id="Frame 2121453153">
          <line id="Line 38" stroke="var(--stroke-0, #F5F5F5)" strokeDasharray="4 4" x1="146.889" y1="2.5" y2="2.5" />
        </g>
      </svg>
    </div>
  );
}

function Badge3() {
  return (
    <div className="bg-[#fafafa] relative rounded-[8px] shrink-0" data-name="Badge">
      <div className="content-stretch flex items-center justify-center overflow-clip px-[8.556px] py-[1.556px] relative rounded-[inherit] size-full">
        <div className="flex flex-col font-['Helvetica_Neue:Medium',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#252b37] text-[12px] whitespace-nowrap">
          <p className="leading-[normal]">01</p>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border-[0.556px] border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Frame32() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[8px] items-end min-w-px relative">
      <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#252b37] text-[14px] whitespace-nowrap">Avisos de Pagamento</p>
      <Frame33 />
      <Badge3 />
    </div>
  );
}

function Frame31() {
  return (
    <div className="content-stretch flex gap-[12px] items-center relative shrink-0 w-full">
      <App4 />
      <Frame32 />
    </div>
  );
}

function App5() {
  return (
    <div className="bg-[#6172f3] relative rounded-[9999px] shrink-0 size-[10px]" data-name="App">
      <div aria-hidden="true" className="absolute border-[0.556px] border-solid border-white inset-0 pointer-events-none rounded-[9999px]" />
    </div>
  );
}

function Frame36() {
  return (
    <div className="flex-[1_0_0] h-[4px] min-w-px relative">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 151.889 4">
        <g id="Frame 2121453153">
          <line id="Line 38" stroke="var(--stroke-0, #F5F5F5)" strokeDasharray="4 4" x1="151.889" y1="2.5" y2="2.5" />
        </g>
      </svg>
    </div>
  );
}

function Badge4() {
  return (
    <div className="bg-[#fafafa] relative rounded-[8px] shrink-0" data-name="Badge">
      <div className="content-stretch flex items-center justify-center overflow-clip px-[8.556px] py-[1.556px] relative rounded-[inherit] size-full">
        <div className="flex flex-col font-['Helvetica_Neue:Medium',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#252b37] text-[12px] whitespace-nowrap">
          <p className="leading-[normal]">01</p>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border-[0.556px] border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Frame35() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[8px] items-end min-w-px relative">
      <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#252b37] text-[14px] whitespace-nowrap">Avisos de Transporte</p>
      <Frame36 />
      <Badge4 />
    </div>
  );
}

function Frame34() {
  return (
    <div className="content-stretch flex gap-[12px] items-center relative shrink-0 w-full">
      <App5 />
      <Frame35 />
    </div>
  );
}

function Frame24() {
  return (
    <div className="absolute bg-white content-stretch flex flex-col gap-[12px] items-start left-[1015px] px-[24px] py-[20px] rounded-[12px] top-[157px] w-[401px]">
      <div aria-hidden="true" className="absolute border border-[#e2e8f0] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <p className="font-['Helvetica_Neue:Medium',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#62748e] text-[12px] w-full">SUMÁRIO</p>
      <Frame25 />
      <Frame27 />
      <Frame31 />
      <Frame34 />
    </div>
  );
}

// ─── Participantes Tab ──────────────────────────────────────────────────────

// ─── Participant Drawer ─────────────────────────────────────────────────────

function DrawerField({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-[4px] relative">
      <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic text-[12px] text-[#717680]">{label}</p>
      <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic text-[14px] text-[#181d27]">{value}</p>
    </div>
  );
}

function ParticipantDrawer({ participant, reservation, onClose }: {
  participant: Participant;
  reservation: Reservation;
  onClose: () => void;
}) {
  useEffect(() => { document.body.style.overflow = "hidden"; return () => { document.body.style.overflow = ""; }; }, []);
  const initials = participant.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
  const phone = "(31) 99999-9999";
  const email = participant.name.split(" ")[0].toLowerCase() + "." + (participant.name.split(" ").pop() || "").toLowerCase() + "@email.com";
  const hasInsurance = reservation.insuranceStatus === "Contracted";

  // Static mock data for the drawer (kept for backward compat)
  const mockDetails = {
    cpf: "123.456.789-00",
    phone: "(31) 99876-5432",
    email: participant.name.toLowerCase().replace(/\s+/g, ".") + "@email.com",
    birthDate: "15/03/1990",
    age: "36 anos",
    street: "Rua das Palmeiras",
    number: "456",
    neighborhood: "Centro",
    city: "Belo Horizonte",
    state: "MG",
    cep: "30130-000",
    healthIssue: participant.hasHealthIssue ? "Sim" : "Não",
    healthDesc: participant.hasHealthIssue ? (participant.notes || "Condição informada pelo participante") : "—",
    healthPlan: "Unimed BH",
    emergencyContact: "(31) 99888-7766 (Maria - Esposa)",
    paymentStatus: reservation.paymentStatus === "Paid" ? "Pago" : "Pendente",
    paymentValue: "R$ 350,00",
    paymentMethod: "Cartão de crédito (3x sem juros)",
    transactionId: "TXN-" + reservation.orderId.replace("#", ""),
    imageAuth: participant.hasImageAuth,
    imageAuthDate: "10/05/2026, 14:32",
    imageAuthIp: "189.40.102.55",
    observations: participant.notes || "Sem observações registradas.",
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end p-[24px]" onKeyDown={(e) => e.key === "Escape" && onClose()}>
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="bg-white border border-[#e9eaeb] border-solid flex flex-col max-h-full relative rounded-[16px] shadow-[-8px_0px_24px_0px_rgba(0,0,0,0.1)] w-[672px] z-10">
        {/* Container with uniform 24px padding and 16px gap */}
        <div className="flex flex-col gap-[16px] overflow-y-auto p-[24px]">
        {/* Title bar */}
        <div className="flex items-center justify-between shrink-0">
          <p className="font-['Helvetica_Neue:Medium',sans-serif] leading-[normal] not-italic text-[18px] text-[#181d27]">Detalhes da reserva</p>
          <button onClick={onClose} className="cursor-pointer flex items-center justify-center rounded-[6px] shrink-0 size-[32px] hover:bg-[#f1f5f9] transition-colors">
            <svg className="size-[18px]" fill="none" viewBox="0 0 18 18"><path d="M4 4l10 10M14 4L4 14" stroke="#717680" strokeWidth="1.5" strokeLinecap="round"/></svg>
          </button>
        </div>
        {/* Participant header card */}
        <div className="bg-[#fafafa] border border-[#f5f5f5] border-solid rounded-[16px]">
          <div className="flex gap-[16px] items-center p-[20px]">
            <div className="bg-[#f0f5ff] border border-[#d5dcfe] border-solid flex items-center justify-center rounded-[9999px] shrink-0 size-[48px]">
              <p className="font-['Inter:Medium',sans-serif] font-medium leading-[normal] not-italic text-[18px] text-[#0b5ed7]">{initials}</p>
            </div>
            <div className="flex flex-col gap-[4px]">
              <p className="font-['Helvetica_Neue:Medium',sans-serif] leading-[normal] not-italic text-[16px] text-[#181d27]">{participant.name}</p>
              <div className="flex gap-[12px] items-center">
                <div className="flex gap-[4px] items-center">
                  <svg className="shrink-0 size-[14px]" fill="none" viewBox="0 0 14 14"><rect x="3" y="1" width="8" height="12" rx="2" stroke="#717680" strokeWidth="1.2"/></svg>
                  <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic text-[13px] text-[#535862]">{phone}</p>
                </div>
                <div className="flex gap-[4px] items-center">
                  <svg className="shrink-0 size-[14px]" fill="none" viewBox="0 0 14 14"><rect x="1" y="3" width="12" height="8" rx="2" stroke="#717680" strokeWidth="1.2"/><path d="M1 5l6 3 6-3" stroke="#717680" strokeWidth="1.2" strokeLinecap="round"/></svg>
                  <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic text-[13px] text-[#535862]">{email}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-[#f5f5f5] flex items-center px-[20px] py-[14px]">
            <div className="flex flex-1 gap-[10px] items-center">
              <svg className="shrink-0 size-[18px]" fill="none" viewBox="0 0 18 18"><rect x="2" y="2" width="14" height="14" rx="3" stroke="#717680" strokeWidth="1.2"/><path d="M6 6h6M6 9h4M6 12h2" stroke="#717680" strokeWidth="1.2" strokeLinecap="round"/></svg>
              <DrawerField label="Documento" value="123.456.789-00" />
            </div>
            <div className="flex flex-1 gap-[10px] items-center justify-end">
              <DrawerField label="Data de nascimento" value="08/01/2000" />
              <svg className="shrink-0 size-[18px]" fill="none" viewBox="0 0 18 18"><rect x="2" y="2" width="14" height="14" rx="3" stroke="#717680" strokeWidth="1.2"/><path d="M2 7h14" stroke="#717680" strokeWidth="1.2"/><path d="M6 1v3M12 1v3" stroke="#717680" strokeWidth="1.2" strokeLinecap="round"/></svg>
            </div>
          </div>
        </div>
        {/* Content sections */}
        <div className="flex flex-col gap-[16px]">
          {/* DADOS DE SAÚDE */}
          <div className="flex flex-col gap-[16px]">
            <p className="font-['Helvetica_Neue:Medium',sans-serif] leading-[normal] not-italic text-[12px] text-[#535862] tracking-[0.5px] uppercase">Dados de saúde</p>
            <div className="grid grid-cols-2 gap-x-[24px] gap-y-[20px]">
              <div className="flex gap-[10px] items-start">
                <svg className="mt-[2px] shrink-0 size-[18px]" fill="none" viewBox="0 0 18 18"><circle cx="9" cy="9" r="7" stroke="#535862" strokeWidth="1.2"/><path d="M9 6v3M9 12v.5" stroke="#535862" strokeWidth="1.2" strokeLinecap="round"/></svg>
                <DrawerField label="Alertas de Saúde" value={participant.hasHealthIssue ? `Sim - ${participant.notes || "Hipertensão"}` : "Não"} />
              </div>
              <div className="flex gap-[10px] items-start">
                <svg className="mt-[2px] shrink-0 size-[18px]" fill="none" viewBox="0 0 18 18"><path d="M6 2C4 4 2 7 2 10a7 7 0 0014 0c0-3-2-6-4-8" stroke="#535862" strokeWidth="1.2" strokeLinecap="round"/></svg>
                <DrawerField label="Restrições alimentares" value="Sim - Intolerância a Lactose" />
              </div>
              <div className="flex gap-[10px] items-start">
                <svg className="mt-[2px] shrink-0 size-[18px]" fill="none" viewBox="0 0 18 18"><circle cx="9" cy="9" r="7" stroke="#535862" strokeWidth="1.2"/><path d="M9 5v4l3 2" stroke="#535862" strokeWidth="1.2" strokeLinecap="round"/></svg>
                <DrawerField label="Necessidades especiais" value="Sim - Mobilidade Reduzida" />
              </div>
              <div className="flex gap-[10px] items-start">
                <svg className="mt-[2px] shrink-0 size-[18px]" fill="none" viewBox="0 0 18 18"><path d="M9 2l5 2v4c0 2.5-2 4.5-5 5.5-3-1-5-3-5-5.5V4l5-2z" stroke="#535862" strokeWidth="1.2"/></svg>
                <DrawerField label="Possui plano de saúde" value="Sim" />
              </div>
            </div>
            <div className="flex gap-[10px] items-start">
              <svg className="mt-[2px] shrink-0 size-[18px]" fill="none" viewBox="0 0 18 18"><circle cx="9" cy="5" r="3" stroke="#535862" strokeWidth="1.2"/><path d="M3 16c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="#535862" strokeWidth="1.2" strokeLinecap="round"/></svg>
              <DrawerField label="Observações adicionais" value={participant.hasHealthIssue ? `ATENÇÃO: esse participante faz uso de medicação de uso contínuo.` : "Sem observações."} />
            </div>
            <div className="flex gap-[10px] items-start">
              <svg className="mt-[2px] shrink-0 size-[18px]" fill="none" viewBox="0 0 18 18"><rect x="3" y="1" width="8" height="12" rx="2" stroke="#535862" strokeWidth="1.2"/><path d="M13 5v10a2 2 0 01-2 2H5" stroke="#535862" strokeWidth="1.2" strokeLinecap="round"/></svg>
              <DrawerField label="Contato de emergência" value="(31) 99999-9999" />
            </div>
          </div>
          <div className="bg-[#e9eaeb] h-px w-full" />
          {/* DADOS OPERACIONAIS */}
          <div className="flex flex-col gap-[16px]">
            <p className="font-['Helvetica_Neue:Medium',sans-serif] leading-[normal] not-italic text-[12px] text-[#535862] tracking-[0.5px] uppercase">Dados operacionais</p>
            <div className="grid grid-cols-2 gap-x-[24px] gap-y-[20px]">
              <div className="flex gap-[10px] items-start">
                <svg className="mt-[2px] shrink-0 size-[18px]" fill="none" viewBox="0 0 18 18"><circle cx="9" cy="5" r="3" stroke="#535862" strokeWidth="1.2"/><path d="M3 16c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="#535862" strokeWidth="1.2" strokeLinecap="round"/></svg>
                <DrawerField label="Tipo(s) de Tarifa(s)" value={`${participant.tariffType} - 1x`} />
              </div>
              <div className="flex gap-[10px] items-start">
                <svg className="mt-[2px] shrink-0 size-[18px]" fill="none" viewBox="0 0 18 18"><rect x="3" y="2" width="12" height="14" rx="2" stroke="#535862" strokeWidth="1.2"/><path d="M7 6h4M7 9h4M7 12h2" stroke="#535862" strokeWidth="1.2" strokeLinecap="round"/></svg>
                <DrawerField label="Idade" value={`${participant.age} anos`} />
              </div>
              <div className="flex gap-[10px] items-start">
                <svg className="mt-[2px] shrink-0 size-[18px]" fill="none" viewBox="0 0 18 18"><path d="M9 2l5 2v4c0 2.5-2 4.5-5 5.5-3-1-5-3-5-5.5V4l5-2z" stroke="#535862" strokeWidth="1.2"/></svg>
                <div className="flex flex-col gap-[4px]">
                  <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic text-[12px] text-[#717680]">Seguro contratado</p>
                  <div className="flex gap-[6px] items-center">
                    <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic text-[14px] text-[#181d27]">{hasInsurance ? "Sim" : "Não"}</p>
                    {!hasInsurance && <p className="cursor-pointer font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic text-[14px] text-[#dc6803] underline">Contratar seguro</p>}
                  </div>
                </div>
              </div>
              <div className="flex gap-[10px] items-start">
                <svg className="mt-[2px] shrink-0 size-[18px]" fill="none" viewBox="0 0 18 18"><path d="M5 2h8M5 6h8M5 10h8M5 14h8" stroke="#535862" strokeWidth="1.2" strokeLinecap="round"/></svg>
                <DrawerField label="Pedidos adicionais" value="Sim" />
              </div>
              <div className="flex gap-[10px] items-start">
                <svg className="mt-[2px] shrink-0 size-[18px]" fill="none" viewBox="0 0 18 18"><rect x="2" y="3" width="14" height="12" rx="3" stroke="#535862" strokeWidth="1.2"/><circle cx="7" cy="8" r="2" stroke="#535862" strokeWidth="1.2"/></svg>
                <div className="flex flex-col gap-[4px]">
                  <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic text-[12px] text-[#717680]">Termo de uso de imagem</p>
                  <p className={`font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic text-[14px] ${participant.hasImageAuth ? "text-[#181d27]" : "text-[#dc6803]"}`}>
                    {participant.hasImageAuth ? "Aceito" : "Pendente pelo participante"}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex gap-[10px] items-start">
              <svg className="mt-[2px] shrink-0 size-[18px]" fill="none" viewBox="0 0 18 18"><path d="M8 2v8M5 7l3 3 3-3" stroke="#535862" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/><path d="M3 12h12" stroke="#535862" strokeWidth="1.2" strokeLinecap="round"/></svg>
              <DrawerField label="Itens pedidos adicionais" value="Botas - 2x , Kit lanche - 2x" />
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}

// ─── Badge System ───────────────────────────────────────────────────────────

// 2.2 — Status → badge mapping
// Figma-exact primary badges — from BADGES PRIMÁRIOS section (15513:515241)
// All badges: bg #fffaeb, border #e9eaeb 0.5px, radius 4, px:6 py:2, gap:5, fontSize:12
const STATUS_BADGE_MAP: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  CheckedIn:       { label: "Check-in realizado",   color: "#0b5ed7", icon: <svg className="shrink-0 size-[16px]" viewBox="0 0 16 16" fill="none"><path d="M3.3335 9.6665C3.3335 9.6665 4.3335 9.6665 5.66683 11.9998C5.66683 11.9998 9.37271 5.88873 12.6668 4.6665" stroke="#0B5ED7" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg> },
  Confirmed:       { label: "Check-in pendente",    color: "#dc6803", icon: <svg className="shrink-0 size-[16px]" viewBox="0 0 16 16" fill="none"><path d="M3.3335 9.6665C3.3335 9.6665 4.66683 9.99984 5.66683 11.9998C5.66683 11.9998 6.77471 10.1729 8.31741 8.31708M12.6668 4.6665C11.6361 5.04894 10.565 5.91004 9.57981 6.91282" stroke="#DC6803" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/><path d="M3.3335 3.3335L12.6668 12.6668" stroke="#DC6803" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg> },
  AwaitingPayment: { label: "Reserva agendada",     color: "#dc6803", icon: <svg className="shrink-0 size-[16px]" viewBox="0 0 16 19" fill="none"><path d="M10.6668 1.3335V4.00016M5.3335 1.3335L5.3335 4.00016" stroke="#DC6803" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/><path d="M14 8.6665V7.99984C14 5.48568 14 4.2286 13.219 3.44755C12.4379 2.6665 11.1808 2.6665 8.66667 2.6665L7.33333 2.6665C4.81918 2.6665 3.5621 2.6665 2.78105 3.44755C2 4.2286 2 5.48568 2 7.99984L2 9.33317C2 11.8473 2 13.1044 2.78105 13.8855C3.5621 14.6665 4.81918 14.6665 7.33333 14.6665H8" stroke="#DC6803" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/><path d="M2 6.6665L14 6.6665" stroke="#DC6803" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/><path d="M12.0002 16.0668V15.3335M12.0002 13.9366V13.934M14.6668 15.0002C14.6668 16.4729 13.4729 17.6668 12.0002 17.6668C10.5274 17.6668 9.3335 16.4729 9.3335 15.0002C9.3335 13.5274 10.5274 12.3335 12.0002 12.3335C13.4729 12.3335 14.6668 13.5274 14.6668 15.0002Z" stroke="#DC6803" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg> },
  Draft:           { label: "Pré-reservada",         color: "#535862", icon: <svg className="shrink-0 size-[16px]" viewBox="0 0 16 16" fill="none"><path d="M10.6668 1.3335V4.00016M5.3335 1.3335V4.00016" stroke="#535862" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/><path d="M14 8.00033C14 5.48617 14 4.22909 13.219 3.44804C12.4379 2.66699 11.1808 2.66699 8.66667 2.66699H7.33333C4.81918 2.66699 3.5621 2.66699 2.78105 3.44804C2 4.22909 2 5.48617 2 8.00033V9.33366C2 11.8478 2 13.1049 2.78105 13.8859C3.5621 14.667 4.81918 14.667 7.33333 14.667H7.66667" stroke="#535862" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/><path d="M2 6.66699H14" stroke="#535862" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/><path d="M10.4905 10.7834L10.4905 9.85653C10.4905 9.71962 10.4962 9.58101 10.5453 9.45316C10.6759 9.11284 11.0219 8.66699 11.6519 8.66699C12.2818 8.66699 12.6415 9.11284 12.7721 9.45316C12.8212 9.58101 12.8269 9.71962 12.8269 9.85653L12.8269 10.7834M10.5368 14.6654H12.7941C13.4587 14.6654 13.9974 14.1276 13.9974 13.4643V12.1301C13.9974 11.4668 13.4587 10.9291 12.7941 10.9291H10.5368C9.87223 10.9291 9.3335 11.4668 9.3335 12.1301V13.4643C9.3335 14.1276 9.87223 14.6654 10.5368 14.6654Z" stroke="#535862" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg> },
  Performed:       { label: "Realizou a atividade", color: "#079455", icon: <svg className="shrink-0 size-[16px]" viewBox="0 0 16 16" fill="none"><path d="M12.0004 12.3333L12.1853 11.4092C12.2831 10.9204 12.5444 10.4699 12.6376 9.98019C12.6569 9.87865 12.6671 9.77384 12.6671 9.66667C12.6671 8.74619 11.9209 8 11.0004 8C10.0799 8 9.33372 8.74619 9.33372 9.66667C9.33372 9.77384 9.34383 9.87865 9.36316 9.98019C9.45637 10.4699 9.71769 10.9204 9.81549 11.4092L10.0004 12.3333M12.0004 12.3333H10.0004M12.0004 12.3333L13.6646 12.7773C14.2502 12.9074 14.6668 13.4268 14.6668 14.0267C14.6668 14.3801 14.3803 14.6667 14.0269 14.6667H13.6646H8.3335H7.97345C7.62001 14.6667 7.3335 14.3801 7.3335 14.0267C7.3335 13.4268 7.75015 12.9074 8.33576 12.7773L10.0004 12.3333" stroke="#079455" strokeWidth="1.2"/><path d="M11.3335 6.00016V5.3335C11.3335 3.44788 11.3335 2.50507 10.7477 1.91928C10.1619 1.3335 9.21911 1.3335 7.3335 1.3335H5.3335C3.44788 1.3335 2.50507 1.3335 1.91928 1.91928C1.3335 2.50507 1.3335 3.44788 1.3335 5.3335V10.6668C1.3335 12.5524 1.3335 13.4953 1.91928 14.081C2.50507 14.6668 3.44788 14.6668 5.3335 14.6668" stroke="#079455" strokeWidth="1.2" strokeLinecap="round"/><path d="M4.6665 5.77778C4.6665 5.77778 5.08317 5.77778 5.49984 6.66667C5.49984 6.66667 6.82337 4.44444 7.99984 4" stroke="#079455" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/><path d="M4 9.3335H6.66667" stroke="#079455" strokeWidth="1.2" strokeLinecap="round"/><path d="M4 11.3335H6.66667" stroke="#079455" strokeWidth="1.2" strokeLinecap="round"/></svg> },
  Cancelled:       { label: "Reserva cancelada",    color: "#d92d20", icon: <svg className="shrink-0 size-[16px]" viewBox="0 0 16 16" fill="none"><path d="M10.6668 1.3335V4.00016M5.3335 1.3335V4.00016" stroke="#D92D20" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/><path d="M14 9.33366V8.00033C14 5.48617 14 4.22909 13.219 3.44804C12.4379 2.66699 11.1808 2.66699 8.66667 2.66699H7.33333C4.81918 2.66699 3.5621 2.66699 2.78105 3.44804C2 4.22909 2 5.48617 2 8.00033V9.33366C2 11.8478 2 13.1049 2.78105 13.8859C3.5621 14.667 4.81918 14.667 7.33333 14.667H8" stroke="#D92D20" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/><path d="M2 6.66699H14" stroke="#D92D20" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/><path d="M13.1855 10.8147L10.1618 13.8384M14.0002 12.3333C14.0002 13.622 12.9555 14.6667 11.6668 14.6667C10.3782 14.6667 9.3335 13.622 9.3335 12.3333C9.3335 11.0447 10.3782 10 11.6668 10C12.9555 10 14.0002 11.0447 14.0002 12.3333Z" stroke="#D92D20" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg> },
  NoShow:          { label: "Não compareceu",       color: "#d92d20", icon: <svg className="shrink-0 size-[16px]" viewBox="0 0 16 16" fill="none"><path d="M10.6668 1.3335V4.00016M5.3335 1.3335V4.00016" stroke="#D92D20" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/><path d="M14 8.6665V7.99984C14 5.48568 14 4.2286 13.219 3.44755C12.4379 2.6665 11.1808 2.6665 8.66667 2.6665L7.33333 2.6665C4.81918 2.6665 3.5621 2.6665 2.78105 3.44755C2 4.2286 2 5.48568 2 7.99984L2 9.33317C2 11.8473 2 13.1044 2.78105 13.8855C3.5621 14.6665 4.81918 14.6665 7.33333 14.6665H8" stroke="#D92D20" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/><path d="M2 6.6665H14" stroke="#D92D20" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/><path d="M14 10.6665L12 12.6665M12 12.6665L10 14.6665M12 12.6665L14 14.6665M12 12.6665L10 10.6665" stroke="#D92D20" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg> },
  Expired:         { label: "Reserva cancelada",    color: "#535862", icon: <svg className="shrink-0 size-[16px]" viewBox="0 0 16 16" fill="none"><path d="M10.6668 1.3335V4.00016M5.3335 1.3335V4.00016" stroke="#535862" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/><path d="M14 9.33366V8.00033C14 5.48617 14 4.22909 13.219 3.44804C12.4379 2.66699 11.1808 2.66699 8.66667 2.66699H7.33333C4.81918 2.66699 3.5621 2.66699 2.78105 3.44804C2 4.22909 2 5.48617 2 8.00033V9.33366C2 11.8478 2 13.1049 2.78105 13.8859C3.5621 14.667 4.81918 14.667 7.33333 14.667H8" stroke="#535862" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/><path d="M2 6.66699H14" stroke="#535862" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/><path d="M13.1855 10.8147L10.1618 13.8384M14.0002 12.3333C14.0002 13.622 12.9555 14.6667 11.6668 14.6667C10.3782 14.6667 9.3335 13.622 9.3335 12.3333C9.3335 11.0447 10.3782 10 11.6668 10C12.9555 10 14.0002 11.0447 14.0002 12.3333Z" stroke="#535862" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg> },
};

function ReservationStatusBadge({ status, tooltip }: { status: string; tooltip?: string }) {
  const cfg = STATUS_BADGE_MAP[status] || STATUS_BADGE_MAP.Confirmed;
  return (
    <div className="bg-white border-[0.5px] border-[#e9eaeb] border-solid flex gap-[5px] items-center px-[6px] py-[2px] rounded-[4px] shrink-0" title={tooltip}>
      {cfg.icon}
      <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic text-[12px] whitespace-nowrap" style={{ color: cfg.color }}>{cfg.label}</p>
    </div>
  );
}

// 3 — Attribute badges (secondary) with rich tooltips

const TOOLTIP_CONTENT: Record<string, { title: string; subtitle: string }> = {
  "image-authorized":              { title: "Termo de Uso de Imagem", subtitle: "Autorizado pelo Participante" },
  "image-refused":                 { title: "Termo de Uso de Imagem", subtitle: "Recusado pelo Participante" },
  "image-pending":                 { title: "Termo de Uso de Imagem", subtitle: "Pendente pelo Participante" },
  "health-alert":                  { title: "Possui Alerta de Saúde", subtitle: "" },
  "insurance-optional":            { title: "Sem seguro (opcional)", subtitle: "Não é obrigatório para essa atividade" },
  "insurance-mandatory-missing":   { title: "Sem seguro (obrigatório)", subtitle: "Contratação obrigatória para essa atividade" },
  "insurance-mandatory-contracted":{ title: "Seguro contratado (obrigatório)", subtitle: "Seguro ativo para essa atividade" },
  "insurance-contracted":          { title: "Seguro contratado", subtitle: "Seguro contratado pelo participante" },
  "additional-items":              { title: "Itens adicionais solicitados", subtitle: "Participante solicitou itens extras" },
  "health-plan":                   { title: "Possui plano de saúde", subtitle: "Plano de saúde informado" },
  "special-needs":                 { title: "Possui necessidades especiais", subtitle: "Necessidades especiais informadas" },
  "dietary-restriction":           { title: "Possui restrição alimentar", subtitle: "Restrição alimentar informada" },
  "minor":                         { title: "Menor de idade", subtitle: "Participante é menor de 18 anos" },
  "payment-paid":                  { title: "Pagamento confirmado", subtitle: "Pagamento processado com sucesso" },
  "payment-pending":               { title: "Pagamento pendente", subtitle: "Aguardando confirmação do pagamento" },
};

function AttrBadge({ icon, stroke, tooltipKey }: { icon: React.ReactNode; stroke: string; tooltipKey: string }) {
  const [show, setShow] = useState(false);
  const content = TOOLTIP_CONTENT[tooltipKey];

  return (
    <div
      className="relative"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      onFocus={() => setShow(true)}
      onBlur={() => setShow(false)}
      tabIndex={0}
      role="button"
      aria-describedby={show ? `tooltip-${tooltipKey}` : undefined}
    >
      <div className="bg-white border-[0.5px] border-[#e9eaeb] border-solid flex items-center justify-center rounded-[20px] shrink-0 size-[28px] cursor-default">
        <div style={{ color: stroke }}>{icon}</div>
      </div>
      {show && content && (
        <div
          id={`tooltip-${tooltipKey}`}
          role="tooltip"
          className="absolute bg-[#181d27] bottom-full left-1/2 -translate-x-1/2 mb-[8px] px-[12px] py-[8px] rounded-[8px] shadow-[0px_4px_12px_0px_rgba(0,0,0,0.2)] w-max max-w-[240px] z-50 pointer-events-none text-center"
        >
          <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic text-[13px] text-white whitespace-nowrap">{content.title}</p>
          {content.subtitle && (
            <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] mt-[4px] not-italic text-[12px] text-[#a4a7ae]">{content.subtitle}</p>
          )}
          {/* Arrow */}
          <div className="absolute left-1/2 -translate-x-1/2 top-full size-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-[#181d27]" />
        </div>
      )}
    </div>
  );
}

function PaymentBadge({ isPaid, onClick }: { isPaid: boolean; onClick: () => void }) {
  const [show, setShow] = useState(false);
  const tooltipKey = isPaid ? "payment-paid" : "payment-pending";
  const stroke = isPaid ? "#079455" : "#dc6803";
  const content = TOOLTIP_CONTENT[tooltipKey];

  return (
    <div
      className="relative"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      <button
        onClick={(e) => { e.stopPropagation(); onClick(); }}
        className="bg-white border border-[#e9e9eb] border-solid flex items-center justify-center rounded-[20px] shrink-0 size-[28px] cursor-pointer hover:bg-[#f8fafc] transition-colors"
      >
        <svg className="size-[16px]" fill="none" viewBox="0 0 48 48" style={{ color: stroke }}>
          <path d="M36.8333 16.2963C36.8333 11.7144 31.0877 8 24 8C16.9123 8 11.1667 11.7144 11.1667 16.2963C11.1667 20.8782 14.6667 23.4074 24 23.4074C33.3333 23.4074 38 25.7778 38 31.7037C38 37.6296 31.732 40 24 40C16.268 40 10 36.2856 10 31.7037" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
          <path d="M24 4V44" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      {show && content && (
        <div
          role="tooltip"
          className="absolute bg-[#181d27] bottom-full left-1/2 -translate-x-1/2 mb-[8px] px-[12px] py-[8px] rounded-[8px] shadow-[0px_4px_12px_0px_rgba(0,0,0,0.2)] w-max max-w-[240px] z-50 pointer-events-none text-center"
        >
          <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic text-[13px] text-white whitespace-nowrap">{content.title}</p>
          {content.subtitle && (
            <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] mt-[4px] not-italic text-[12px] text-[#a4a7ae]">{content.subtitle}</p>
          )}
          <div className="absolute left-1/2 -translate-x-1/2 top-full size-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-[#181d27]" />
        </div>
      )}
    </div>
  );
}

// Figma-exact reservation status icons (from BADGES SECUNDÁRIOS section)
const RESERVATION_STATUS_ICON: Record<string, { stroke: string; tooltipKey: string; icon: React.ReactNode }> = {
  Confirmed:       { stroke: "#079455", tooltipKey: "res-confirmed", icon: <svg className="size-[16px]" viewBox="0 0 16 16" fill="none"><path d="M10.6668 1.3335V4.00016M5.3335 1.3335L5.3335 4.00016" stroke="#079455" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/><path d="M14 8.6665V7.99984C14 5.48568 14 4.2286 13.219 3.44755C12.4379 2.6665 11.1808 2.6665 8.66667 2.6665L7.33333 2.6665C4.81918 2.6665 3.5621 2.6665 2.78105 3.44755C2 4.2286 2 5.48568 2 7.99984L2 9.33317C2 11.8473 2 13.1044 2.78105 13.8855C3.5621 14.6665 4.81918 14.6665 7.33333 14.6665" stroke="#079455" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/><path d="M2 6.6665L14 6.6665" stroke="#079455" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/><path d="M8.6665 12.9998C8.6665 12.9998 9.56547 13.3376 9.99984 14.6665C9.99984 14.6665 12.1175 11.3332 13.9998 10.6665" stroke="#079455" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg> },
  AwaitingPayment: { stroke: "#dc6803", tooltipKey: "res-awaiting", icon: <svg className="size-[16px]" viewBox="0 0 16 19" fill="none"><path d="M10.6668 1.3335V4.00016M5.3335 1.3335L5.3335 4.00016" stroke="#DC6803" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/><path d="M14 8.6665V7.99984C14 5.48568 14 4.2286 13.219 3.44755C12.4379 2.6665 11.1808 2.6665 8.66667 2.6665L7.33333 2.6665C4.81918 2.6665 3.5621 2.6665 2.78105 3.44755C2 4.2286 2 5.48568 2 7.99984L2 9.33317C2 11.8473 2 13.1044 2.78105 13.8855C3.5621 14.6665 4.81918 14.6665 7.33333 14.6665H8" stroke="#DC6803" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/><path d="M2 6.6665L14 6.6665" stroke="#DC6803" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/><path d="M12.0002 16.0668V15.3335M12.0002 13.9366V13.934M14.6668 15.0002C14.6668 16.4729 13.4729 17.6668 12.0002 17.6668C10.5274 17.6668 9.3335 16.4729 9.3335 15.0002C9.3335 13.5274 10.5274 12.3335 12.0002 12.3335C13.4729 12.3335 14.6668 13.5274 14.6668 15.0002Z" stroke="#DC6803" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg> },
  Cancelled:       { stroke: "#d92d20", tooltipKey: "res-cancelled", icon: <svg className="size-[16px]" viewBox="0 0 16 16" fill="none"><path d="M10.6668 1.3335V4.00016M5.3335 1.3335V4.00016" stroke="#D92D20" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/><path d="M14 9.33366V8.00033C14 5.48617 14 4.22909 13.219 3.44804C12.4379 2.66699 11.1808 2.66699 8.66667 2.66699H7.33333C4.81918 2.66699 3.5621 2.66699 2.78105 3.44804C2 4.22909 2 5.48617 2 8.00033V9.33366C2 11.8478 2 13.1049 2.78105 13.8859C3.5621 14.667 4.81918 14.667 7.33333 14.667H8" stroke="#D92D20" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/><path d="M2 6.66699H14" stroke="#D92D20" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/><path d="M13.1855 10.8147L10.1618 13.8384M14.0002 12.3333C14.0002 13.622 12.9555 14.6667 11.6668 14.6667C10.3782 14.6667 9.3335 13.622 9.3335 12.3333C9.3335 11.0447 10.3782 10 11.6668 10C12.9555 10 14.0002 11.0447 14.0002 12.3333Z" stroke="#D92D20" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg> },
  Draft:           { stroke: "#535862", tooltipKey: "res-draft", icon: <svg className="size-[16px]" viewBox="0 0 16 16" fill="none"><path d="M10.6668 1.3335V4.00016M5.3335 1.3335V4.00016" stroke="#535862" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/><path d="M14 8.00033C14 5.48617 14 4.22909 13.219 3.44804C12.4379 2.66699 11.1808 2.66699 8.66667 2.66699H7.33333C4.81918 2.66699 3.5621 2.66699 2.78105 3.44804C2 4.22909 2 5.48617 2 8.00033V9.33366C2 11.8478 2 13.1049 2.78105 13.8859C3.5621 14.667 4.81918 14.667 7.33333 14.667H7.66667" stroke="#535862" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/><path d="M2 6.66699H14" stroke="#535862" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/><path d="M10.4905 10.7834L10.4905 9.85653C10.4905 9.71962 10.4962 9.58101 10.5453 9.45316C10.6759 9.11284 11.0219 8.66699 11.6519 8.66699C12.2818 8.66699 12.6415 9.11284 12.7721 9.45316C12.8212 9.58101 12.8269 9.71962 12.8269 9.85653L12.8269 10.7834M10.5368 14.6654H12.7941C13.4587 14.6654 13.9974 14.1276 13.9974 13.4643V12.1301C13.9974 11.4668 13.4587 10.9291 12.7941 10.9291H10.5368C9.87223 10.9291 9.3335 11.4668 9.3335 12.1301V13.4643C9.3335 14.1276 9.87223 14.6654 10.5368 14.6654Z" stroke="#535862" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg> },
  CheckedIn:       { stroke: "#079455", tooltipKey: "res-confirmed", icon: <svg className="size-[16px]" viewBox="0 0 16 16" fill="none"><path d="M10.6668 1.3335V4.00016M5.3335 1.3335L5.3335 4.00016" stroke="#079455" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/><path d="M14 8.6665V7.99984C14 5.48568 14 4.2286 13.219 3.44755C12.4379 2.6665 11.1808 2.6665 8.66667 2.6665L7.33333 2.6665C4.81918 2.6665 3.5621 2.6665 2.78105 3.44755C2 4.2286 2 5.48568 2 7.99984L2 9.33317C2 11.8473 2 13.1044 2.78105 13.8855C3.5621 14.6665 4.81918 14.6665 7.33333 14.6665" stroke="#079455" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/><path d="M2 6.6665L14 6.6665" stroke="#079455" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/><path d="M8.6665 12.9998C8.6665 12.9998 9.56547 13.3376 9.99984 14.6665C9.99984 14.6665 12.1175 11.3332 13.9998 10.6665" stroke="#079455" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg> },
  Performed:       { stroke: "#079455", tooltipKey: "res-performed", icon: <svg className="size-[16px]" viewBox="0 0 16 16" fill="none"><path d="M10.6668 1.3335V4.00016M5.3335 1.3335L5.3335 4.00016" stroke="#079455" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/><path d="M14 8.6665V7.99984C14 5.48568 14 4.2286 13.219 3.44755C12.4379 2.6665 11.1808 2.6665 8.66667 2.6665L7.33333 2.6665C4.81918 2.6665 3.5621 2.6665 2.78105 3.44755C2 4.2286 2 5.48568 2 7.99984L2 9.33317C2 11.8473 2 13.1044 2.78105 13.8855C3.5621 14.6665 4.81918 14.6665 7.33333 14.6665" stroke="#079455" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/><path d="M2 6.6665L14 6.6665" stroke="#079455" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/><path d="M8.6665 12.9998C8.6665 12.9998 9.56547 13.3376 9.99984 14.6665C9.99984 14.6665 12.1175 11.3332 13.9998 10.6665" stroke="#079455" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg> },
  NoShow:          { stroke: "#d92d20", tooltipKey: "res-noshow", icon: <svg className="size-[16px]" viewBox="0 0 16 16" fill="none"><path d="M10.6668 1.3335V4.00016M5.3335 1.3335V4.00016" stroke="#D92D20" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/><path d="M14 9.33366V8.00033C14 5.48617 14 4.22909 13.219 3.44804C12.4379 2.66699 11.1808 2.66699 8.66667 2.66699H7.33333C4.81918 2.66699 3.5621 2.66699 2.78105 3.44804C2 4.22909 2 5.48617 2 8.00033V9.33366C2 11.8478 2 13.1049 2.78105 13.8859C3.5621 14.667 4.81918 14.667 7.33333 14.667H8" stroke="#D92D20" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/><path d="M2 6.66699H14" stroke="#D92D20" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/><path d="M13.1855 10.8147L10.1618 13.8384M14.0002 12.3333C14.0002 13.622 12.9555 14.6667 11.6668 14.6667C10.3782 14.6667 9.3335 13.622 9.3335 12.3333C9.3335 11.0447 10.3782 10 11.6668 10C12.9555 10 14.0002 11.0447 14.0002 12.3333Z" stroke="#D92D20" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg> },
  Expired:         { stroke: "#535862", tooltipKey: "res-expired", icon: <svg className="size-[16px]" viewBox="0 0 16 16" fill="none"><path d="M10.6668 1.3335V4.00016M5.3335 1.3335V4.00016" stroke="#535862" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/><path d="M14 8.00033C14 5.48617 14 4.22909 13.219 3.44804C12.4379 2.66699 11.1808 2.66699 8.66667 2.66699H7.33333C4.81918 2.66699 3.5621 2.66699 2.78105 3.44804C2 4.22909 2 5.48617 2 8.00033V9.33366C2 11.8478 2 13.1049 2.78105 13.8859C3.5621 14.667 4.81918 14.667 7.33333 14.667H7.66667" stroke="#535862" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/><path d="M2 6.66699H14" stroke="#535862" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/><path d="M10.4905 10.7834L10.4905 9.85653C10.4905 9.71962 10.4962 9.58101 10.5453 9.45316C10.6759 9.11284 11.0219 8.66699 11.6519 8.66699C12.2818 8.66699 12.6415 9.11284 12.7721 9.45316C12.8212 9.58101 12.8269 9.71962 12.8269 9.85653L12.8269 10.7834M10.5368 14.6654H12.7941C13.4587 14.6654 13.9974 14.1276 13.9974 13.4643V12.1301C13.9974 11.4668 13.4587 10.9291 12.7941 10.9291H10.5368C9.87223 10.9291 9.3335 11.4668 9.3335 12.1301V13.4643C9.3335 14.1276 9.87223 14.6654 10.5368 14.6654Z" stroke="#535862" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg> },
};

// Add reservation status tooltips to the content map
Object.assign(TOOLTIP_CONTENT, {
  "res-confirmed":  { title: "Reserva confirmada", subtitle: "Pagamento processado, vaga garantida" },
  "res-awaiting":   { title: "Reserva não confirmada", subtitle: "Aguardando pagamento" },
  "res-cancelled":  { title: "Reserva cancelada", subtitle: "Vaga estornada e devolvida" },
  "res-draft":      { title: "Pré-reservada", subtitle: "Carrinho iniciado, não finalizado" },
  "res-performed":  { title: "Atividade realizada", subtitle: "Atividade concluída com sucesso" },
  "res-noshow":     { title: "Não compareceu", subtitle: "Participante não apareceu" },
  "res-expired":    { title: "Reserva expirada", subtitle: "Expirada por inatividade" },
});

function LabeledBadge({ icon, label, color, tooltipTitle, tooltipSub, onClick }: { icon: React.ReactNode; label: string; color: string; tooltipTitle?: string; tooltipSub?: string; onClick?: () => void }) {
  const [show, setShow] = useState(false);
  const Tag = onClick ? "button" : "div";
  return (
    <div className="relative" onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      <Tag
        {...(onClick ? { onClick: (e: React.MouseEvent) => { e.stopPropagation(); onClick(); } } : {})}
        className={`flex gap-[4px] items-center shrink-0 border border-[#e2e5ea] rounded-[4px] px-[5px] py-[2px] transition-opacity ${onClick ? "cursor-pointer hover:opacity-70" : ""}`}
      >
        <div style={{ color }} className="shrink-0">{icon}</div>
        <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic text-[10px] text-[#a1a1aa] whitespace-nowrap">{label}</p>
      </Tag>
      {show && tooltipTitle && (
        <div className="absolute bg-[#181d27] bottom-full left-1/2 -translate-x-1/2 mb-[8px] px-[10px] py-[6px] rounded-[8px] shadow-[0px_4px_12px_0px_rgba(0,0,0,0.2)] w-max max-w-[220px] z-50 pointer-events-none text-center">
          <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic text-[12px] text-white whitespace-nowrap">{tooltipTitle}</p>
          {tooltipSub && <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] mt-[3px] not-italic text-[11px] text-[#a4a7ae]">{tooltipSub}</p>}
          <div className="absolute left-1/2 -translate-x-1/2 top-full size-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[5px] border-t-[#181d27]" />
        </div>
      )}
    </div>
  );
}

function ParticipantBadgesRow({ participant, insuranceStatus, requiresInsurance, reservationStatus, paymentStatus, onPaymentClick, isBuyer }: {
  participant: Participant; insuranceStatus: string; requiresInsurance: boolean; reservationStatus: string;
  paymentStatus: string; onPaymentClick: () => void; isBuyer: boolean;
}) {
  // Map old hasImageAuth boolean to new imageTermStatus enum if needed
  const imageStatus: ImageTermStatus = participant.imageTermStatus || (participant.hasImageAuth ? "Authorized" : "Pending");

  // Determine insurance variant
  let insuranceVariant: "contracted" | "mandatory-missing" | "optional-missing" = "optional-missing";
  let insuranceLabel = "Sem seguro (opcional)";

  if (requiresInsurance) {
    if (insuranceStatus === "Contracted" || participant.insuranceStatus === "Contracted") {
      insuranceVariant = "contracted";
      insuranceLabel = "Seguro contratado (obrigatório)";
    } else {
      insuranceVariant = "mandatory-missing";
      insuranceLabel = "Sem seguro (obrigatório)";
    }
  } else {
    if (insuranceStatus === "Contracted" || participant.insuranceStatus === "Contracted") {
      insuranceVariant = "contracted";
      insuranceLabel = "Seguro contratado (opcional)";
    }
  }

  return (
    <div className="flex gap-[8px] items-center" style={{ padding: "10px 12px" }}>
      {/* 1. Image term — always present */}
      <ParticipantAttributeBadge
        category="image-term"
        variant={imageStatus === "Authorized" ? "authorized" : imageStatus === "Refused" ? "refused" : "pending"}
        tooltipLabel={
          imageStatus === "Authorized" ? "Termo de Uso de Imagem — Autorizado" :
          imageStatus === "Refused" ? "Termo de Uso de Imagem — Recusado" :
          "Termo de Uso de Imagem — Pendente"
        }
      />

      {/* 2. Insurance — always present */}
      <ParticipantAttributeBadge
        category="insurance"
        variant={insuranceVariant}
        tooltipLabel={insuranceLabel}
      />

      {/* 3. Health alert — when applicable */}
      {participant.hasHealthIssue && (
        <ParticipantAttributeBadge
          category="health-alert"
          variant="alert"
          tooltipLabel="Alerta de Saúde — Condição informada pelo participante"
        />
      )}

      {/* 4. Health plan — when applicable */}
      {participant.hasHealthPlan && (
        <ParticipantAttributeBadge
          category="health-plan"
          variant="present"
          tooltipLabel="Plano de Saúde — Cobertura ativa"
        />
      )}

      {/* 5. Special needs — when applicable */}
      {participant.hasSpecialNeeds && (
        <ParticipantAttributeBadge
          category="special-needs"
          variant="present"
          tooltipLabel="Necessidades Especiais — Acessibilidade ou mobilidade"
        />
      )}

      {/* 6. Dietary restriction — when applicable */}
      {participant.hasDietaryRestriction && (
        <ParticipantAttributeBadge
          category="dietary-restriction"
          variant="present"
          tooltipLabel="Restrição Alimentar — Informada pelo participante"
        />
      )}

      {/* 7. Additional items — when applicable */}
      {(participant.hasAdditionalItems || isBuyer) && (
        <ParticipantAttributeBadge
          category="additional-items"
          variant="present"
          tooltipLabel="Itens Adicionais — Equipamentos ou serviços extras"
        />
      )}
    </div>
  );
}

// ─── Payment Drawer ─────────────────────────────────────────────────────────

function PaymentDrawer({ reservation, onClose }: { reservation: Reservation; onClose: () => void }) {
  useEffect(() => { document.body.style.overflow = "hidden"; return () => { document.body.style.overflow = ""; }; }, []);
  const isGroup = reservation.type === "group";
  const pCount = reservation.participants.length;
  const adults = reservation.participants.filter((p) => p.tariffType === "Adulto").length;
  const children = reservation.participants.filter((p) => p.tariffType === "Infantil").length;
  const courtesy = reservation.participants.filter((p) => p.tariffType === "Cortesia").length;
  const isPaid = reservation.paymentStatus === "Paid";

  return (
    <div className="fixed inset-0 z-50 flex justify-end p-[24px]" onKeyDown={(e) => e.key === "Escape" && onClose()}>
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="bg-white border border-[#e9eaeb] border-solid flex flex-col max-h-full relative rounded-[16px] shadow-[-8px_0px_24px_0px_rgba(0,0,0,0.1)] w-[720px] z-10">
        <div className="flex flex-col flex-1 gap-[16px] overflow-y-auto p-[24px]">
          {/* Title bar */}
          <div className="flex items-center justify-between shrink-0">
            <p className="font-['Helvetica_Neue:Medium',sans-serif] leading-[normal] not-italic text-[18px] text-[#181d27]">Informações do pedido</p>
            <div className="flex gap-[16px] items-center">
              <p className="cursor-pointer font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic text-[14px] text-[#0b5ed7] hover:underline">Ir para central de vendas</p>
              <button onClick={onClose} className="cursor-pointer flex items-center justify-center rounded-[6px] shrink-0 size-[32px] hover:bg-[#f1f5f9] transition-colors">
                <svg className="size-[18px]" fill="none" viewBox="0 0 18 18"><path d="M4 4l10 10M14 4L4 14" stroke="#717680" strokeWidth="1.5" strokeLinecap="round"/></svg>
              </button>
            </div>
          </div>
          {/* Reservation type card */}
          <div className="border border-[#e9eaeb] border-solid rounded-[12px]">
            <div className="flex items-center justify-between px-[20px] py-[16px]">
              <div className="flex flex-col gap-[6px]">
                <p className="font-['Helvetica_Neue:Medium',sans-serif] leading-[normal] not-italic text-[16px] text-[#181d27]">{isGroup ? "Reserva em grupo" : "Reserva individual"}</p>
                <div className="flex gap-[6px] items-center">
                  <svg className="shrink-0 size-[16px]" fill="none" viewBox="0 0 16 16"><circle cx="5" cy="6" r="2.5" stroke="#717680" strokeWidth="1.2"/><circle cx="11" cy="6" r="2.5" stroke="#717680" strokeWidth="1.2"/><path d="M1 14c0-2.2 2-4 4-4s4 1.8 4 4" stroke="#717680" strokeWidth="1.2" strokeLinecap="round"/></svg>
                  <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic text-[13px] text-[#535862]">{pCount} participantes</p>
                </div>
              </div>
              <svg className="shrink-0 size-[20px]" fill="none" viewBox="0 0 20 20"><path d="M6 8l4 4 4-4" stroke="#717680" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            {/* Tariff breakdown */}
            <div className="border-t border-[#f5f5f5] flex gap-[24px] items-center px-[20px] py-[14px]">
              <div className="flex gap-[8px] items-center">
                <svg className="shrink-0 size-[18px]" fill="none" viewBox="0 0 18 18"><circle cx="9" cy="6" r="3.5" stroke="#535862" strokeWidth="1.2"/><path d="M3 17c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="#535862" strokeWidth="1.2" strokeLinecap="round"/></svg>
                <div className="flex flex-col">
                  <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic text-[12px] text-[#717680]">Adulto(s)</p>
                  <p className="font-['Helvetica_Neue:Medium',sans-serif] leading-[normal] not-italic text-[16px] text-[#181d27]">{adults}</p>
                </div>
              </div>
              <div className="flex gap-[8px] items-center">
                <svg className="shrink-0 size-[18px]" fill="none" viewBox="0 0 18 18"><circle cx="9" cy="9" r="7" stroke="#535862" strokeWidth="1.2"/><path d="M6 8c0 0 1.5 2 3 2s3-2 3-2" stroke="#535862" strokeWidth="1.2" strokeLinecap="round"/></svg>
                <div className="flex flex-col">
                  <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic text-[12px] text-[#717680]">Criança(s)</p>
                  <p className="font-['Helvetica_Neue:Medium',sans-serif] leading-[normal] not-italic text-[16px] text-[#181d27]">{children}</p>
                </div>
              </div>
              <div className="flex gap-[8px] items-center">
                <svg className="shrink-0 size-[18px]" fill="none" viewBox="0 0 18 18"><rect x="2" y="4" width="14" height="10" rx="3" stroke="#535862" strokeWidth="1.2"/><path d="M6 9h6" stroke="#535862" strokeWidth="1.2" strokeLinecap="round"/></svg>
                <div className="flex flex-col">
                  <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic text-[12px] text-[#717680]">Cortesia(s)</p>
                  <p className="font-['Helvetica_Neue:Medium',sans-serif] leading-[normal] not-italic text-[16px] text-[#181d27]">{courtesy}</p>
                </div>
              </div>
            </div>
          </div>
          {/* Payment data card */}
          <div className="border border-[#e9eaeb] border-solid rounded-[12px]">
            <div className="flex items-center justify-between px-[20px] py-[14px]">
              <p className="font-['Helvetica_Neue:Medium',sans-serif] leading-[normal] not-italic text-[12px] text-[#535862] tracking-[0.5px] uppercase">Dados de pagamento</p>
              <div className="border border-[#e9eaeb] border-solid flex gap-[6px] items-center px-[10px] py-[4px] rounded-[6px]">
                <div className={`rounded-[9999px] size-[6px] ${isPaid ? "bg-[#17b26a]" : "bg-[#fba12c]"}`} />
                <p className={`font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic text-[12px] whitespace-nowrap ${isPaid ? "text-[#535862]" : "text-[#dc6803]"}`}>{isPaid ? "Pagamento confirmado" : "Pagamento pendente"}</p>
              </div>
            </div>
            <div className="border-t border-[#f5f5f5] flex items-center justify-between px-[20px] py-[14px]">
              <div className="flex gap-[10px] items-center">
                <svg className="shrink-0 size-[18px]" fill="none" viewBox="0 0 18 18"><rect x="2" y="2" width="14" height="14" rx="3" stroke="#717680" strokeWidth="1.2"/><path d="M6 6h6M6 9h4M6 12h2" stroke="#717680" strokeWidth="1.2" strokeLinecap="round"/></svg>
                <div className="flex flex-col gap-[2px]">
                  <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic text-[12px] text-[#717680]">ID do pedido</p>
                  <p className="font-['Helvetica_Neue:Medium',sans-serif] leading-[normal] not-italic text-[14px] text-[#181d27]">{reservation.orderId}</p>
                </div>
              </div>
              <div className="flex gap-[10px] items-center">
                <div className="flex flex-col gap-[2px] items-end">
                  <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic text-[12px] text-[#717680]">Forma de pagamento</p>
                  <p className="font-['Helvetica_Neue:Medium',sans-serif] leading-[normal] not-italic text-[14px] text-[#181d27]">PIX</p>
                </div>
                <svg className="shrink-0 size-[18px]" fill="none" viewBox="0 0 18 18"><rect x="2" y="2" width="14" height="14" rx="3" stroke="#717680" strokeWidth="1.2"/><circle cx="9" cy="9" r="3" stroke="#717680" strokeWidth="1.2"/></svg>
              </div>
            </div>
            {/* Pricing */}
            <div className="border-t border-[#f5f5f5] flex flex-col gap-[8px] px-[20px] py-[14px]">
              <div className="flex items-center justify-between">
                <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic text-[14px] text-[#535862]">Subtotal</p>
                <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic text-[14px] text-[#181d27]">R$ 1.350,00</p>
              </div>
              <div className="flex items-center justify-between">
                <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic text-[14px] text-[#535862]">Desconto</p>
                <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic text-[14px] text-[#17b26a]">- R$ 100,00</p>
              </div>
              <div className="border-t border-[#f5f5f5] flex items-center justify-between pt-[8px]">
                <p className="font-['Helvetica_Neue:Medium',sans-serif] leading-[normal] not-italic text-[14px] text-[#181d27]">Total</p>
                <p className="font-['Helvetica_Neue:Medium',sans-serif] leading-[normal] not-italic text-[16px] text-[#181d27]">R$ 1.450,00</p>
              </div>
            </div>
          </div>
          {/* Payment history card */}
          <div className="border border-[#e9eaeb] border-solid flex-1 rounded-[12px]">
            <div className="flex items-center justify-between px-[20px] py-[14px]">
              <p className="font-['Helvetica_Neue:Medium',sans-serif] leading-[normal] not-italic text-[12px] text-[#535862] tracking-[0.5px] uppercase">Histórico de pagamento</p>
              <svg className="shrink-0 size-[20px]" fill="none" viewBox="0 0 20 20"><path d="M6 12l4-4 4 4" stroke="#717680" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <div className="border-t border-[#f5f5f5] flex flex-col gap-[16px] px-[20px] py-[16px]">
              {[
                { label: "Agendamento realizado", date: "20/01/2026 às 11:54 AM" },
                { label: "Pré-agendamento realizado", date: "20/01/2026 às 11:55 AM" },
                { label: "E-mail de agendamento realizado", date: "20/01/2026 às 11:56 AM" },
                { label: "Reserva confirmada", date: "20/01/2026 às 11:57 AM" },
              ].map((item, i) => (
                <div key={i} className="flex gap-[12px] items-start">
                  <div className="bg-[#17b26a] mt-[6px] rounded-[9999px] shrink-0 size-[8px]" />
                  <div className="flex flex-col gap-[2px]">
                    <p className="font-['Helvetica_Neue:Medium',sans-serif] leading-[normal] not-italic text-[14px] text-[#181d27]">{item.label}</p>
                    <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic text-[12px] text-[#717680]">{item.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Footer buttons */}
        <div className="border-t border-[#e9eaeb] flex gap-[12px] items-center justify-end px-[24px] py-[16px] shrink-0">
          <button onClick={onClose} className="bg-white border border-[#e2e8f0] border-solid cursor-pointer font-['Helvetica_Neue:Regular',sans-serif] hover:bg-[#f8fafc] leading-[normal] not-italic px-[24px] py-[12px] rounded-[8px] text-[14px] text-[#414651] transition-colors">Fechar aba</button>
          <button className="cursor-pointer flex gap-[8px] items-center justify-center px-[24px] py-[12px] rounded-[8px] transition-colors hover:opacity-90" style={{ backgroundImage: "linear-gradient(rgb(11,94,215), rgb(8,79,183))" }}>
            <svg className="shrink-0 size-[16px]" fill="none" viewBox="0 0 16 16"><path d="M8 2v8M5 7l3 3 3-3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M3 12h10" stroke="white" strokeWidth="1.5" strokeLinecap="round"/></svg>
            <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic text-[14px] text-white whitespace-nowrap">Baixar comprovante (PDF)</p>
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Filters Drawer ─────────────────────────────────────────────────────────

function FilterChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`cursor-pointer font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic px-[14px] py-[8px] rounded-[8px] text-[14px] transition-colors whitespace-nowrap ${
        active ? "border-[1.5px] border-[#0b5ed7] border-solid text-[#0b5ed7]" : "border border-[#e9eaeb] border-solid text-[#414651] hover:bg-[#f8fafc]"
      }`}
    >{label}</button>
  );
}

function CheckInButton({ isDone, disabled, onCheckIn, onUndo }: { isDone: boolean; disabled?: boolean; insured?: boolean; onCheckIn: () => void; onUndo: () => void }) {
  return (
    <div className="relative" onClick={(e) => e.stopPropagation()}>
      <button
        onClick={() => disabled ? undefined : isDone ? onUndo() : onCheckIn()}
        disabled={disabled}
        className={`flex gap-[8px] items-center justify-center rounded-[6px] shrink-0 transition-colors ${disabled ? "cursor-not-allowed border border-[#e9eaeb] border-solid" : isDone ? "cursor-pointer bg-white border border-[#e4e4e7] border-solid hover:bg-[#f8fafc]" : "cursor-pointer hover:bg-[#d5dcfe]"}`}
        style={{ width: "158.48px", padding: "10px 12px", ...(!isDone ? { backgroundColor: disabled ? "#fafafa" : "#edf0ff" } : {}) }}
      >
        {isDone && !disabled ? (
          <>
            <svg className="shrink-0 size-[16px]" fill="none" viewBox="0 0 16 16"><circle cx="8" cy="8" r="6" stroke="#535862" strokeWidth="1.3"/><path d="M6 6l4 4M10 6l-4 4" stroke="#535862" strokeWidth="1.3" strokeLinecap="round"/></svg>
            <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic text-[14px] text-[#414651] whitespace-nowrap">Desfazer Check-in</p>
          </>
        ) : (
          <>
            <svg className="shrink-0 size-[16px]" fill="none" viewBox="0 0 16 16"><circle cx="8" cy="8" r="6" stroke={disabled ? "#a4a7ae" : "#0b5ed7"} strokeWidth="1.3"/><path d="M5.5 8l1.8 1.8L10.5 6" stroke={disabled ? "#a4a7ae" : "#0b5ed7"} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
            <p className={`font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic text-[14px] whitespace-nowrap ${disabled ? "text-[#a4a7ae]" : "text-[#0b5ed7]"}`}>Realizar Check-in</p>
          </>
        )}
      </button>
    </div>
  );
}

function FiltersDrawer({ onClose }: { onClose: () => void }) {
  useEffect(() => { document.body.style.overflow = "hidden"; return () => { document.body.style.overflow = ""; }; }, []);
  const [alertas, setAlertas] = useState<Set<string>>(new Set());
  const [tarifa, setTarifa] = useState<Set<string>>(new Set());
  const [imagem, setImagem] = useState("");
  const [seguro, setSeguro] = useState("");
  const [pedidos, setPedidos] = useState("");
  const [periodo, setPeriodo] = useState("");

  const toggleSet = (set: Set<string>, val: string, setter: (s: Set<string>) => void) => {
    const next = new Set(set);
    if (next.has(val)) next.delete(val); else next.add(val);
    setter(next);
  };

  const hasAnyFilter = !!(alertas.size || tarifa.size || imagem || seguro || pedidos || periodo);
  const limpar = () => { setAlertas(new Set()); setTarifa(new Set()); setImagem(""); setSeguro(""); setPedidos(""); setPeriodo(""); };

  return (
    <div className="fixed inset-0 z-50 flex justify-end p-[24px]" onKeyDown={(e) => e.key === "Escape" && onClose()}>
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="bg-white border border-[#e9eaeb] border-solid flex flex-col max-h-full relative rounded-[16px] shadow-[-8px_0px_24px_0px_rgba(0,0,0,0.1)] w-[720px] z-10">
        {/* Header */}
        <div className="flex items-center justify-between px-[24px] py-[20px] shrink-0">
          <p className="font-['Helvetica_Neue:Medium',sans-serif] leading-[normal] not-italic text-[18px] text-[#181d27]">Filtros</p>
          <button onClick={onClose} className="cursor-pointer flex items-center justify-center rounded-[6px] shrink-0 size-[32px] hover:bg-[#f1f5f9] transition-colors">
            <svg className="size-[18px]" fill="none" viewBox="0 0 18 18"><path d="M4 4l10 10M14 4L4 14" stroke="#717680" strokeWidth="1.5" strokeLinecap="round"/></svg>
          </button>
        </div>
        {/* Content */}
        <div className="flex-1 overflow-y-auto px-[24px] pb-[24px]">
          <div className="border border-[#e9eaeb] border-solid flex flex-col gap-[24px] p-[20px] rounded-[12px]">
            {/* Por alertas */}
            <div className="flex flex-col gap-[10px]">
              <p className="font-['Helvetica_Neue:Medium',sans-serif] leading-[normal] not-italic text-[14px] text-[#181d27]">Por alertas</p>
              <div className="flex flex-wrap gap-[8px]">
                {["Problemas de Saúde", "Restrições Alimentares", "Necessidades Especiais"].map((o) => (
                  <FilterChip key={o} label={o} active={alertas.has(o)} onClick={() => toggleSet(alertas, o, setAlertas)} />
                ))}
              </div>
            </div>
            {/* Por tipos de tarifa */}
            <div className="flex flex-col gap-[10px]">
              <p className="font-['Helvetica_Neue:Medium',sans-serif] leading-[normal] not-italic text-[14px] text-[#181d27]">Por tipos de tarifa</p>
              <div className="flex flex-wrap gap-[8px]">
                {["Adulto", "Infantil", "Cortesia"].map((o) => (
                  <FilterChip key={o} label={o} active={tarifa.has(o)} onClick={() => toggleSet(tarifa, o, setTarifa)} />
                ))}
              </div>
            </div>
            {/* Termos de Uso de Imagem */}
            <div className="flex flex-col gap-[10px]">
              <p className="font-['Helvetica_Neue:Medium',sans-serif] leading-[normal] not-italic text-[14px] text-[#181d27]">Termos de Uso de Imagem</p>
              <div className="flex flex-wrap gap-[8px]">
                {["Termo Autorizado", "Termo Não Autorizado", "Termo Pendente"].map((o) => (
                  <FilterChip key={o} label={o} active={imagem === o} onClick={() => setImagem(imagem === o ? "" : o)} />
                ))}
              </div>
            </div>
            {/* Seguro */}
            <div className="flex flex-col gap-[10px]">
              <p className="font-['Helvetica_Neue:Medium',sans-serif] leading-[normal] not-italic text-[14px] text-[#181d27]">Seguro</p>
              <div className="flex flex-wrap gap-[8px]">
                {["Contratado", "Não contratado"].map((o) => (
                  <FilterChip key={o} label={o} active={seguro === o} onClick={() => setSeguro(seguro === o ? "" : o)} />
                ))}
              </div>
            </div>
            {/* Pedidos adicionais */}
            <div className="flex flex-col gap-[10px]">
              <p className="font-['Helvetica_Neue:Medium',sans-serif] leading-[normal] not-italic text-[14px] text-[#181d27]">Pedidos adicionais</p>
              <div className="flex flex-wrap gap-[8px]">
                {["Solicitado", "Não solicitado"].map((o) => (
                  <FilterChip key={o} label={o} active={pedidos === o} onClick={() => setPedidos(pedidos === o ? "" : o)} />
                ))}
              </div>
            </div>
            {/* Período */}
            <div className="flex flex-col gap-[10px]">
              <p className="font-['Helvetica_Neue:Medium',sans-serif] leading-[normal] not-italic text-[14px] text-[#181d27]">Período</p>
              <div className="flex flex-wrap gap-[8px]">
                {["Últimas 24 Horas", "Últimos 7 Dias", "Último Mês"].map((o) => (
                  <FilterChip key={o} label={o} active={periodo === o} onClick={() => setPeriodo(periodo === o ? "" : o)} />
                ))}
              </div>
            </div>
          </div>
        </div>
        {/* Footer */}
        <div className="border-t border-[#e9eaeb] flex items-center justify-between px-[24px] py-[16px] shrink-0">
          {hasAnyFilter ? (
            <button onClick={limpar} className="cursor-pointer flex gap-[6px] items-center font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic text-[14px] text-[#0b5ed7] hover:underline">
              <svg className="shrink-0 size-[16px]" fill="none" viewBox="0 0 16 16"><path d="M2 2l12 12M14 2L2 14" stroke="#0b5ed7" strokeWidth="1.5" strokeLinecap="round"/></svg>
              Limpar filtro
            </button>
          ) : <div />}
          <div className="flex gap-[12px]">
            <button onClick={onClose} className="bg-white border border-[#e2e8f0] border-solid cursor-pointer font-['Helvetica_Neue:Regular',sans-serif] hover:bg-[#f8fafc] leading-[normal] not-italic px-[20px] py-[10px] rounded-[8px] text-[14px] text-[#414651] transition-colors">Cancelar</button>
            <button onClick={hasAnyFilter ? onClose : undefined} disabled={!hasAnyFilter} className={`font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic px-[20px] py-[10px] rounded-[8px] text-[14px] text-white transition-colors ${hasAnyFilter ? "cursor-pointer" : "cursor-not-allowed opacity-50"}`} style={{ backgroundImage: "linear-gradient(rgb(11,94,215), rgb(8,79,183))" }}>Aplicar filtros</button>
          </div>
        </div>
      </div>
    </div>
  );
}

type ParticipantesFilter = "todos" | "a-fazer-checkin" | "checkin-realizado" | "canceladas";

// ─── Three-dot menu — slot-based system ─────────────────────────────────────

interface MenuSlot { id: string; label: string; icon: React.ReactNode; enabled: boolean; tooltip: string | null; destructive?: boolean; separator?: boolean; hasExtIcon?: boolean }

function getMenuSlots(r: Reservation, insuranceStatus: string): MenuSlot[] {
  const s = r.status;
  const sm = reservationStateMachine;
  const canTo = (target: ReservationStatus) => (sm[s] || []).includes(target);
  const inactive = s === "Cancelled" || s === "NoShow" || s === "Expired";
  const iconConfirm = <svg className="size-[16px]" fill="none" viewBox="0 0 16 16"><circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.2"/><path d="M5.5 8l1.8 1.8L10.5 6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>;
  const iconDouble = <svg className="size-[16px]" fill="none" viewBox="0 0 16 16"><path d="M2 8l4 4L14 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/><path d="M6 8l4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>;
  const iconPayment = <svg className="size-[16px]" fill="none" viewBox="0 0 16 16"><path d="M8 3v10M5 6l3-3 3 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/><path d="M3 12h10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>;
  const iconCal = <svg className="size-[16px]" fill="none" viewBox="0 0 16 16"><rect x="2" y="2" width="12" height="12" rx="3" stroke="currentColor" strokeWidth="1.2"/><path d="M2 6h12" stroke="currentColor" strokeWidth="1.2"/><path d="M5.5 1v2M10.5 1v2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>;
  const iconShield = <svg className="size-[16px]" fill="none" viewBox="0 0 16 16"><path d="M8 2l5 2v4c0 2.5-2 4.5-5 5.5-3-1-5-3-5-5.5V4l5-2z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>;
  const iconSend = <svg className="size-[16px]" fill="none" viewBox="0 0 16 16"><path d="M14 2L7 9M14 2l-4 12-3-5-5-3 12-4z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>;
  const iconDownload = <svg className="size-[16px]" fill="none" viewBox="0 0 16 16"><path d="M8 2v8M5 7l3 3 3-3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/><path d="M3 12h10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>;
  const iconPerson = <svg className="size-[16px]" fill="none" viewBox="0 0 16 16"><circle cx="8" cy="5" r="3" stroke="currentColor" strokeWidth="1.2"/><path d="M3 14c0-2.8 2.2-5 5-5s5 2.2 5 5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>;
  const iconContact = <svg className="size-[16px]" fill="none" viewBox="0 0 16 16"><path d="M13.5 2.5l-11 5 4 1.5 1.5 4 5-11z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>;
  const iconCalX = <svg className="size-[16px]" fill="none" viewBox="0 0 16 16"><rect x="2" y="2" width="12" height="12" rx="3" stroke="currentColor" strokeWidth="1.2"/><path d="M6 6l4 4M10 6l-4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>;
  const iconPersonX = <svg className="size-[16px]" fill="none" viewBox="0 0 16 16"><circle cx="8" cy="5" r="3" stroke="currentColor" strokeWidth="1.2"/><path d="M3 14c0-2.8 2.2-5 5-5s5 2.2 5 5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/><path d="M12 3l-2 2M10 3l2 2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>;

  // Slot 1 — Confirmar ↔ Desfazer confirmação
  const slot1 = s === "Confirmed" || s === "CheckedIn" || s === "Performed"
    ? { id: "undo-confirm", label: "Desfazer confirmação de reserva", icon: iconConfirm, enabled: s === "Confirmed" && canTo("AwaitingPayment"), tooltip: s === "CheckedIn" ? "Desfaça o check-in antes de desfazer a confirmação" : s === "Performed" ? "A atividade já foi realizada" : null }
    : { id: "confirm", label: "Confirmar reserva", icon: iconConfirm, enabled: canTo("Confirmed"), tooltip: s === "Draft" ? "Carrinho ainda não finalizado" : inactive ? `Reserva ${s === "Cancelled" ? "cancelada" : s === "NoShow" ? "marcada como não compareceu" : "expirada"} não pode ser confirmada` : null };

  // Slot 2 — Definir realizado ↔ Desfazer
  const slot2 = s === "Performed"
    ? { id: "undo-performed", label: "Desfazer definição de realização", icon: iconDouble, enabled: canTo("Confirmed"), tooltip: null }
    : { id: "mark-performed", label: "Definir como realizado", icon: iconDouble, enabled: s === "CheckedIn" && canTo("Performed") && (insuranceStatus === "Contracted" || insuranceStatus === "NotRequired"), tooltip: s === "CheckedIn" && insuranceStatus !== "Contracted" && insuranceStatus !== "NotRequired" ? "É necessário contratar o seguro do participante antes de realizar essa ação" : s !== "CheckedIn" ? "É necessário realizar o check-in antes de definir como realizado" : null };

  // Slot 3 — Registrar pagamento ↔ Desfazer
  const slot3 = (s === "Confirmed" || s === "CheckedIn" || s === "Performed")
    ? { id: "undo-payment", label: "Desfazer registro de pagamento", icon: iconPayment, enabled: canTo("AwaitingPayment"), tooltip: null }
    : { id: "register-payment", label: "Registrar pagamento", icon: iconPayment, enabled: s === "AwaitingPayment" && canTo("Confirmed"), tooltip: s === "Draft" ? "Finalize o carrinho antes de registrar pagamento" : inactive ? "Reserva inativa não permite registro de pagamento" : null };

  // Slot 4 — Remarcar ↔ Desfazer remarcação
  const slot4: MenuSlot = { id: "reschedule", label: "Remarcar reserva", icon: iconCal, enabled: (s === "AwaitingPayment" || s === "Confirmed") && !inactive, tooltip: s === "CheckedIn" ? "Desfaça o check-in antes de remarcar" : (s === "Performed" || inactive) ? "Reserva não pode ser remarcada no estado atual" : null };

  // Slot 5 — Contratar seguro ↔ Desfazer
  const slot5 = insuranceStatus === "Contracted"
    ? { id: "undo-insurance", label: "Desfazer contratação de seguro", icon: iconShield, separator: true, enabled: !inactive && s !== "Draft" && s !== "Performed", tooltip: inactive || s === "Draft" || s === "Performed" ? "Reserva inativa não permite operação de seguro" : null }
    : { id: "add-insurance", label: "Contratar seguro", icon: iconShield, separator: true, enabled: !inactive && s !== "Draft" && s !== "Performed", tooltip: inactive || s === "Draft" || s === "Performed" ? "Reserva inativa não permite operação de seguro" : null };

  // Slot 6 — Reenviar voucher
  const slot6: MenuSlot = { id: "resend-voucher", label: "Reenviar voucher", icon: iconSend, enabled: s === "Confirmed" || s === "CheckedIn" || s === "Performed", tooltip: s === "AwaitingPayment" ? "Confirme a reserva antes de enviar o voucher" : "Não há voucher disponível para envio" };

  // Slot 7 — Baixar comprovante
  const slot7: MenuSlot = { id: "download", label: "Baixar comprovante", icon: iconDownload, enabled: s === "Confirmed" || s === "CheckedIn" || s === "Performed" || s === "Cancelled", tooltip: "Comprovante disponível apenas após confirmação da reserva" };

  // Slot 8 — Dados do participante (always enabled)
  const slot8: MenuSlot = { id: "participant-data", label: "Dados do participante", icon: iconPerson, enabled: true, tooltip: null };

  // Slot 9 — Entrar em contato (always enabled)
  const slot9: MenuSlot = { id: "contact", label: "Entrar em contato", icon: iconContact, separator: true, enabled: true, tooltip: null, hasExtIcon: true };

  // Slot 10 — Não compareceu ↔ Desfazer
  const slot10 = s === "NoShow"
    ? { id: "undo-noshow", label: "Desfazer não comparecimento", icon: iconCalX, separator: true, destructive: true, enabled: true, tooltip: null }
    : { id: "no-show", label: "Não compareceu", icon: iconCalX, separator: true, destructive: true, enabled: s === "Confirmed", tooltip: s === "CheckedIn" || s === "Performed" ? "Participante já realizou check-in" : s !== "Confirmed" ? "Não aplicável ao estado atual" : null };

  // Slot 11 — Cancelar ↔ Desfazer cancelamento
  const slot11 = s === "Cancelled"
    ? { id: "undo-cancel", label: "Desfazer cancelamento de reserva", icon: iconPersonX, destructive: true, enabled: true, tooltip: null }
    : { id: "cancel", label: "Cancelar reserva", icon: iconPersonX, destructive: true, enabled: s === "AwaitingPayment" || s === "Confirmed" || s === "CheckedIn", tooltip: s === "Performed" ? "Atividade já realizada não pode ser cancelada" : s === "NoShow" ? "Reserva marcada como não compareceu" : (s === "Expired" || s === "Draft") ? "Reserva inativa" : null };

  return [slot1, slot2, slot3, slot4, slot5, slot6, slot7, slot8, slot9, slot10, slot11];
}

function ParticipantMenu({ reservation, participant, onAction, participantInsured }: {
  reservation: Reservation;
  participant: Participant;
  onAction: (actionId: string, r: Reservation, p: Participant) => void;
  participantInsured: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [hoveredDisabled, setHoveredDisabled] = useState<string | null>(null);
  const slots = useMemo(() => getMenuSlots(reservation, participantInsured ? "Contracted" : "Required"), [reservation, participantInsured]);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu on outside click without blocking the target click
  useEffect(() => {
    if (!open) return;
    const handleMouseDown = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleMouseDown);
    return () => document.removeEventListener("mousedown", handleMouseDown);
  }, [open]);

  return (
    <div className="relative" ref={menuRef} onClick={(e) => e.stopPropagation()}>
      <button
        onClick={() => setOpen(!open)}
        className="bg-white border border-[#e4e4e7] border-solid cursor-pointer flex items-center justify-center rounded-[6px] shrink-0 size-[40px] hover:bg-[#f8fafc] transition-colors"
      >
        <svg className="size-[16px]" fill="none" viewBox="0 0 16 16"><circle cx="8" cy="3" r="1.2" fill="#717680"/><circle cx="8" cy="8" r="1.2" fill="#717680"/><circle cx="8" cy="13" r="1.2" fill="#717680"/></svg>
      </button>
      {open && (
        <>
          <div className="absolute bg-white border border-[#e9eaeb] border-solid mt-[4px] right-0 rounded-[12px] shadow-[0px_4px_16px_0px_rgba(0,0,0,0.12)] w-[300px] z-40 py-[4px]">
            {slots.map((slot) => (
              <div key={slot.id}>
                {slot.separator && <div className="bg-[#f5f5f5] h-px mx-[8px] my-[4px]" />}
                <div className="relative"
                  onMouseEnter={() => { if (!slot.enabled && slot.tooltip) setHoveredDisabled(slot.id); }}
                  onMouseLeave={() => setHoveredDisabled(null)}
                >
                  <button
                    onClick={() => {
                      if (!slot.enabled) return;
                      onAction(slot.id, reservation, participant);
                    }}
                    className={`flex gap-[10px] items-center px-[14px] py-[10px] transition-colors w-full ${
                      !slot.enabled ? "opacity-40 cursor-not-allowed" : slot.destructive ? "cursor-pointer hover:bg-[#fef3f2]" : "cursor-pointer hover:bg-[#f8fafc]"
                    } ${slot.destructive ? "text-[#d92d20]" : "text-[#414651]"}`}
                    aria-disabled={!slot.enabled || undefined}
                  >
                    {slot.icon}
                    <p className={`font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic text-[14px] whitespace-nowrap ${slot.destructive ? "text-[#d92d20]" : "text-[#414651]"}`}>{slot.label}</p>
                    {slot.hasExtIcon && (
                      <svg className="ml-auto size-[14px]" fill="none" viewBox="0 0 14 14"><path d="M4 10L10 4M10 4H5M10 4v5" stroke="#717680" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    )}
                  </button>
                  {/* Tooltip for disabled items */}
                  {hoveredDisabled === slot.id && slot.tooltip && (
                    <div role="tooltip" className="absolute bg-[#181d27] left-[-8px] -translate-x-full px-[12px] py-[8px] rounded-[8px] shadow-[0px_4px_12px_0px_rgba(0,0,0,0.2)] top-1/2 -translate-y-1/2 w-max max-w-[220px] z-50 pointer-events-none">
                      <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[1.4] not-italic text-[12px] text-white">{slot.tooltip}</p>
                      <div className="absolute right-[-6px] top-1/2 -translate-y-1/2 size-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-l-[6px] border-l-[#181d27]" />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function ParticipantesTab({ onBackToActivities, activity }: { onBackToActivities?: () => void; activity: Activity }) {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<ParticipantesFilter>("todos");
  const [showFilters, setShowFilters] = useState(false);
  const [showSort, setShowSort] = useState(false);
  const [reservations, dispatch] = useReducer(reservationsReducer, mockReservations);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(() => new Set(mockReservations.filter((r) => r.type === "group").map((r) => r.id)));
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [showMoreActions, setShowMoreActions] = useState(false);
  const [showMoreActionsStickyBar, setShowMoreActionsStickyBar] = useState(false);
  const [showBulkCheckInTip, setShowBulkCheckInTip] = useState(false);
  const [showBulkCheckInTipStickyBar, setShowBulkCheckInTipStickyBar] = useState(false);

  // Sticky bulk bar: track when original bar scrolls out of view
  const bulkBarRef = useRef<HTMLDivElement>(null);
  const [bulkBarHidden, setBulkBarHidden] = useState(false);
  useEffect(() => {
    const el = bulkBarRef.current;
    if (!el) return;
    // rootMargin -1px avoids flicker when element is exactly at viewport edge (no scroll)
    const observer = new IntersectionObserver(([entry]) => setBulkBarHidden(!entry.isIntersecting), { threshold: 0, rootMargin: "-1px 0px 0px 0px" });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Sticky TopBar: track when search+sort+filters scrolls out of view
  const searchBarRef = useRef<HTMLDivElement>(null);
  const [searchBarHidden, setSearchBarHidden] = useState(false);
  useEffect(() => {
    const el = searchBarRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setSearchBarHidden(!entry.isIntersecting), { threshold: 0, rootMargin: "-1px 0px 0px 0px" });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Selection helpers
  const allParticipantIds = useMemo(() => reservations.flatMap((r) => r.participants.map((p) => p.id)), [reservations]);
  const isAllSelected = selectedIds.size > 0 && selectedIds.size === allParticipantIds.length;
  const hasSelection = selectedIds.size > 0;

  const toggleSelectAll = () => {
    if (isAllSelected) setSelectedIds(new Set());
    else setSelectedIds(new Set(allParticipantIds));
  };

  const toggleSelectParticipant = (pid: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(pid)) next.delete(pid); else next.add(pid);
      return next;
    });
  };

  const toggleSelectReservation = (r: Reservation) => {
    const pids = r.participants.map((p) => p.id);
    const allSelected = pids.every((id) => selectedIds.has(id));
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (allSelected) pids.forEach((id) => next.delete(id));
      else pids.forEach((id) => next.add(id));
      return next;
    });
  };

  const clearSelection = () => { setSelectedIds(new Set()); setShowMoreActions(false); };

  // Bulk action eligibility
  const selectedReservations = useMemo(() => {
    return reservations.filter((r) => r.participants.some((p) => selectedIds.has(p.id)));
  }, [reservations, selectedIds]);

  const bulkEligibility = useMemo(() => {
    if (selectedReservations.length === 0) return {} as Record<BulkAction, { eligible: number; total: number; reason: string }>;
    const actions: BulkAction[] = ["check-in", "undo-check-in", "confirm", "undo-confirm", "mark-performed", "add-insurance", "resend-voucher", "reschedule", "no-show", "cancel"];
    const result: Record<string, { eligible: number; total: number; reason: string }> = {};
    for (const action of actions) {
      const { eligible, reason } = isEligibleForBulkAction(selectedReservations, action);
      result[action] = { eligible: eligible.length, total: selectedReservations.length, reason };
    }
    return result;
  }, [selectedReservations]);

  const getBadgeLabel = (action: BulkAction): string => {
    const e = bulkEligibility[action];
    if (!e) return "";
    if (action === "resend-voucher") return "Para todos";
    return `${e.eligible} de ${e.total}`;
  };

  const handleBulkAction = (action: BulkAction, label: string) => {
    // Special handling for undo insurance bulk
    if (action === "undo-bulk-insurance" as any) {
      let undone = 0;
      for (const r of selectedReservations) {
        for (const p of r.participants) {
          if (selectedIds.has(p.id) && isParticipantInsured(p.id)) {
            undoInsurance(p.id);
            if (p.checkInStatus === "Done") dispatch({ type: "UNDO_CHECK_IN", participantId: p.id });
            undone++;
          }
        }
      }
      showToast(undone > 0 ? `Contratação de seguro desfeita para ${undone} participante(s).` : "Nenhum selecionado possui seguro contratado.");
      return;
    }

    // Special handling for insurance bulk
    if (action === "add-insurance") {
      let contracted = 0;
      for (const r of selectedReservations) {
        for (const p of r.participants) {
          if (selectedIds.has(p.id) && !isParticipantInsured(p.id)) {
            contractInsurance(p.id);
            contracted++;
          }
        }
      }
      showToast(contracted > 0 ? `Seguro contratado para ${contracted} participante(s).` : "Todos os selecionados já possuem seguro.");
      return;
    }

    // Special handling for check-in — open confirmation modal with eligible participants
    if (action === "check-in") {
      const eligible: Participant[] = [];
      for (const r of selectedReservations) {
        if (r.status !== "Confirmed") continue;
        for (const p of r.participants) {
          if (!selectedIds.has(p.id) || p.checkInStatus === "Done") continue;
          eligible.push(p);
        }
      }
      if (eligible.length === 0) {
        showToast("Nenhum participante elegível para check-in.", "error");
        return;
      }
      setCheckInModal(eligible);
      return;
    }

    if (action === "undo-check-in") {
      let undone = 0;
      for (const r of selectedReservations) {
        for (const p of r.participants) {
          if (!selectedIds.has(p.id) || p.checkInStatus !== "Done") continue;
          dispatch({ type: "UNDO_CHECK_IN", participantId: p.id });
          undone++;
        }
      }
      showToast(`Check-in desfeito para ${undone} participante(s).`);
      return;
    }

    const e = bulkEligibility[action];
    if (!e || e.eligible === 0) {
      showToast(`Nenhuma das reservas selecionadas pode receber esta ação. ${e?.reason || ""}`, "error");
      return;
    }
    const ignored = e.total - e.eligible;
    if (ignored > 0) {
      showToast(`${label} para ${e.eligible} de ${e.total} selecionados. ${ignored} reservas ignoradas.`);
    } else {
      showToast(`${label} para ${e.eligible} selecionados.`);
    }
    setShowMoreActions(false);
  };

  // Determine primary inline actions labels — based on participant checkInStatus, not r.status
  const checkInLabel = useMemo(() => {
    let done = 0, pending = 0;
    for (const r of selectedReservations) {
      for (const p of r.participants) {
        if (!selectedIds.has(p.id)) continue;
        if (p.checkInStatus === "Done") done++;
        else pending++;
      }
    }
    return done > pending ? "Desfazer Check-in's" : "Realizar Check-in's";
  }, [selectedReservations, selectedIds]);

  const confirmLabel = useMemo(() => {
    const awaiting = selectedReservations.filter((r) => r.status === "AwaitingPayment").length;
    const confirmed = selectedReservations.filter((r) => r.status === "Confirmed").length;
    return awaiting > confirmed ? "Confirmar reservas" : "Desfazer confirmação de reservas";
  }, [selectedReservations]);

  const [cancelModal, setCancelModal] = useState<{ r: Reservation; p: Participant } | null>(null);
  const [cancelReason, setCancelReason] = useState("");
  const [noShowModal, setNoShowModal] = useState<{ r: Reservation; p: Participant } | null>(null);
  const [checkInModal, setCheckInModal] = useState<Participant[] | null>(null);
  const [drawerData, setDrawerData] = useState<{ r: Reservation; p: Participant } | null>(null);
  const [paymentDrawerRes, setPaymentDrawerRes] = useState<Reservation | null>(null);

  // Block body scroll when any modal is open
  useEffect(() => {
    if (cancelModal || noShowModal || checkInModal) {
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = ""; };
    }
  }, [cancelModal, noShowModal, checkInModal]);
  // Per-participant insurance tracking — all start uninsured so user must contract
  const [insuredParticipants, setInsuredParticipants] = useState<Set<string>>(new Set());
  const isParticipantInsured = (pid: string) => insuredParticipants.has(pid);
  const contractInsurance = (pid: string) => setInsuredParticipants((prev) => new Set([...prev, pid]));
  const undoInsurance = (pid: string) => setInsuredParticipants((prev) => { const next = new Set(prev); next.delete(pid); return next; });

  // Count selected participants who have insurance for bulk eligibility
  const selectedInsuredCount = useMemo(() => {
    let count = 0;
    for (const r of selectedReservations) {
      for (const p of r.participants) {
        if (selectedIds.has(p.id) && isParticipantInsured(p.id)) count++;
      }
    }
    return count;
  }, [selectedReservations, selectedIds, insuredParticipants]);

  const selectedUninsuredCount = useMemo(() => {
    let count = 0;
    for (const r of selectedReservations) {
      for (const p of r.participants) {
        if (selectedIds.has(p.id) && !isParticipantInsured(p.id)) count++;
      }
    }
    return count;
  }, [selectedReservations, selectedIds, insuredParticipants]);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleMenuAction = (actionId: string, r: Reservation, p: Participant) => {
    const name = p.name.split(" ")[0];
    if (actionId === "cancel") { setCancelModal({ r, p }); setCancelReason(""); return; }
    if (actionId === "no-show") { setNoShowModal({ r, p }); return; }
    if (actionId === "contact") { showToast("Abrindo WhatsApp..."); return; }
    if (actionId === "download") { showToast("Comprovante baixado."); return; }
    if (actionId === "participant-data") { setDrawerData({ r, p }); return; }
    if (actionId === "add-insurance") { contractInsurance(p.id); showToast(`Seguro contratado para ${name}!`); return; }
    if (actionId === "undo-insurance") {
      undoInsurance(p.id);
      if (p.checkInStatus === "Done") {
        dispatch({ type: "UNDO_CHECK_IN", participantId: p.id });
        showToast(`Contratação de seguro de ${name} desfeita. Check-in também desfeito.`);
      } else {
        showToast(`Contratação de seguro de ${name} desfeita.`);
      }
      return;
    }
    if (actionId === "resend-voucher") { showToast(`Voucher reenviado para ${name}.`); return; }
    if (actionId === "confirm" || actionId === "register-payment") { showToast(`Reserva de ${name} confirmada.`); return; }
    if (actionId === "undo-confirm") { showToast(`Confirmação de ${name} desfeita.`); return; }
    if (actionId === "mark-performed") { showToast(`Reserva de ${name} marcada como realizada.`); return; }
    if (actionId === "undo-performed") { showToast(`Definição de realização de ${name} desfeita.`); return; }
    if (actionId === "undo-payment") { showToast(`Pagamento de ${name} desfeito.`); return; }
    if (actionId === "reschedule") { showToast(`Reserva de ${name} remarcada.`); return; }
    if (actionId === "undo-noshow") { showToast(`Não comparecimento de ${name} desfeito.`); return; }
    if (actionId === "undo-cancel") { showToast(`Cancelamento de ${name} desfeito.`); return; }
  };

  const confirmCancel = () => {
    if (!cancelModal) return;
    showToast(`Reserva de ${cancelModal.p.name.split(" ")[0]} cancelada.`);
    setCancelModal(null);
  };

  const confirmNoShow = () => {
    if (!noShowModal) return;
    showToast(`${noShowModal.p.name.split(" ")[0]} marcado como não compareceu.`);
    setNoShowModal(null);
  };

  const handleCheckIn = (p: Participant) => {
    setCheckInModal([p]);
  };

  const handleUndoCheckIn = (p: Participant) => {
    dispatch({ type: "UNDO_CHECK_IN", participantId: p.id });
    showToast(`Check-in de ${p.name.split(" ")[0]} desfeito.`);
  };

  const handleCopyId = (orderId: string) => {
    navigator.clipboard?.writeText(orderId);
    setCopiedId(orderId);
    showToast("Copiado!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleGroup = (id: string) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  // Count all participants
  const totalCount = useMemo(() => reservations.reduce((s, r) => s + r.participants.length, 0), [reservations]);

  // Filter counts
  const counts = useMemo(() => {
    let pending = 0, done = 0, cancelled = 0;
    for (const r of reservations) {
      if (r.status === "Cancelled") { cancelled += r.participants.length; continue; }
      for (const p of r.participants) {
        if (p.checkInStatus === "Done") done++;
        else pending++;
      }
    }
    return { todos: totalCount, pending, done, cancelled };
  }, [reservations, totalCount]);

  // Filtered reservations
  const filteredReservations = useMemo(() => {
    let result = reservations;
    // Tab filter
    if (activeFilter === "a-fazer-checkin") result = result.filter((r) => r.status !== "Cancelled" && r.participants.some((p) => p.checkInStatus === "Pending"));
    else if (activeFilter === "checkin-realizado") result = result.filter((r) => r.status !== "Cancelled" && r.participants.some((p) => p.checkInStatus === "Done"));
    else if (activeFilter === "canceladas") result = result.filter((r) => r.status === "Cancelled");
    // Search filter
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((r) => r.buyerName.toLowerCase().includes(q) || r.orderId.toLowerCase().includes(q) || r.participants.some((p) => p.name.toLowerCase().includes(q)));
    }
    return result;
  }, [reservations, activeFilter, search]);

  const filteredParticipantCount = filteredReservations.reduce((sum, r) => sum + r.participants.length, 0);

  const filters: { key: ParticipantesFilter; label: string; count: number }[] = [
    { key: "todos", label: "Todos", count: counts.todos },
    { key: "a-fazer-checkin", label: "A fazer check-in", count: counts.pending },
    { key: "checkin-realizado", label: "Check-in realizado", count: counts.done },
    { key: "canceladas", label: "Reservas canceladas", count: counts.cancelled },
  ];

  return (
    <div className="w-full" style={{ paddingBottom: "40px" }}>
      {/* ── Sticky TopBar: search + sort + filters (+ bulk actions when selected) ── */}
      {searchBarHidden && (
        <div
          className="fixed left-0 right-0 top-0 z-[11] bg-white shadow-[0px_2px_8px_0px_rgba(0,0,0,0.08)] animate-[fadeSlideDown_350ms_cubic-bezier(0.22,1,0.36,1)]"
          style={{ animationFillMode: "both" }}
        >
          {/* Search + Sort + Filters row */}
          <div className="flex gap-[12px] items-center" style={{ padding: "24px 24px 20px 248px" }}>
            <div className="bg-white flex-1 min-w-0 relative rounded-[10px]">
              <div aria-hidden="true" className="absolute border border-[#e9eaeb] border-solid inset-0 pointer-events-none rounded-[10px]" />
              <div className="content-stretch flex gap-[8px] items-center px-[14px] py-[10px] relative size-full">
                <svg className="shrink-0 size-[20px]" fill="none" viewBox="0 0 20 20"><circle cx="9" cy="9" r="6" stroke="#717680" strokeWidth="1.5"/><path d="M14 14l3 3" stroke="#717680" strokeWidth="1.5" strokeLinecap="round"/></svg>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Buscar por nome, ID do pedido, etc..."
                  className="flex-1 font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] min-w-0 not-italic outline-none text-[14px] text-[#414651] placeholder:text-[#a4a7ae] bg-transparent"
                />
              </div>
            </div>
            <div className="relative">
              <button
                onClick={() => { setShowSort(!showSort); setShowFilters(false); }}
                className="bg-white relative rounded-[8px] shrink-0 cursor-pointer hover:bg-[#f8fafc] transition-colors"
              >
                <div aria-hidden="true" className="absolute border border-[#e9eaeb] border-solid inset-0 pointer-events-none rounded-[8px]" />
                <div className="content-stretch flex gap-[6px] items-center px-[14px] py-[10px] relative size-full">
                  <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic text-[14px] text-[#414651] whitespace-nowrap">Ordenar Por</p>
                  <svg className="shrink-0 size-[16px]" fill="none" viewBox="0 0 16 16"><path d="M4 6l4 4 4-4" stroke="#717680" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
              </button>
              {showSort && (
                <div className="absolute bg-white border border-[#e9eaeb] border-solid mt-[4px] right-0 rounded-[10px] shadow-[0px_4px_12px_0px_rgba(0,0,0,0.1)] w-[200px] z-20">
                  {["Alfabética", "Número de pedido", "Data da reserva"].map((opt) => (
                    <button key={opt} onClick={() => setShowSort(false)} className="cursor-pointer font-['Helvetica_Neue:Regular',sans-serif] hover:bg-[#f8fafc] leading-[normal] not-italic px-[14px] py-[10px] text-[14px] text-[#414651] text-left transition-colors w-full">
                      {opt}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="relative">
              <button
                onClick={() => { setShowFilters(!showFilters); setShowSort(false); }}
                className="bg-white relative rounded-[8px] shrink-0 cursor-pointer hover:bg-[#f8fafc] transition-colors"
              >
                <div aria-hidden="true" className="absolute border border-[#e9eaeb] border-solid inset-0 pointer-events-none rounded-[8px]" />
                <div className="content-stretch flex gap-[6px] items-center px-[14px] py-[10px] relative size-full">
                  <svg className="shrink-0 size-[16px]" fill="none" viewBox="0 0 16 16"><path d="M2 3h12M4 8h8M6 13h4" stroke="#717680" strokeWidth="1.5" strokeLinecap="round"/></svg>
                  <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic text-[14px] text-[#414651] whitespace-nowrap">Filtros</p>
                </div>
              </button>
              {showFilters && <FiltersDrawer onClose={() => setShowFilters(false)} />}
            </div>
          </div>
          {/* Bulk actions row — only when selected + scrolled past bulk bar */}
          {hasSelection && bulkBarHidden && (
            <div className="animate-[slideDown_250ms_ease-out]" style={{ animationFillMode: "both" }}>
              <div className="border-t border-[#f5f5f5]" style={{ marginLeft: "248px", marginRight: "24px" }} />
              <div className="flex items-center gap-[12px] w-full" style={{ padding: "12px 40px 16px 264px" }}>
                <button onClick={toggleSelectAll} className="cursor-pointer flex items-center justify-center shrink-0" style={{ padding: "1px 0", width: "20px" }}>
                  <div className="flex items-center justify-center rounded-[4px] size-[20px] bg-[#0b5ed7]">
                    <svg className="size-[12px]" fill="none" viewBox="0 0 12 12"><path d="M2.5 6l2.5 2.5L9.5 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </div>
                </button>
                <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic text-[14px] text-[#252b37] whitespace-nowrap">Todos os {selectedIds.size} selecionados</p>
                <div className="flex items-center gap-[12px] ml-auto">
                  {(() => {
                    const isRealizarMode = checkInLabel === "Realizar Check-in's";
                    const checkInDisabled = isRealizarMode && selectedInsuredCount === 0;
                    const badgeText = isRealizarMode ? `${selectedInsuredCount} de ${selectedIds.size}` : getBadgeLabel("undo-check-in");
                    return (
                      <div className="relative"
                        onMouseEnter={() => checkInDisabled && setShowBulkCheckInTipStickyBar(true)}
                        onMouseLeave={() => setShowBulkCheckInTipStickyBar(false)}
                      >
                        <button
                          onClick={() => !checkInDisabled && handleBulkAction(isRealizarMode ? "check-in" : "undo-check-in", checkInLabel)}
                          disabled={checkInDisabled}
                          className={`flex gap-[8px] items-center px-[12px] py-[6px] rounded-[8px] shrink-0 transition-colors ${checkInDisabled ? "cursor-not-allowed opacity-50" : "cursor-pointer hover:bg-[#f8fafc]"}`}
                        >
                          {isRealizarMode ? (
                            <svg className="shrink-0 size-[16px]" fill="none" viewBox="0 0 16 16"><circle cx="8" cy="8" r="6" stroke={checkInDisabled ? "#727685" : "#0b5ed7"} strokeWidth="1.3"/><path d="M5.5 8l1.8 1.8L10.5 6" stroke={checkInDisabled ? "#727685" : "#0b5ed7"} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
                          ) : (
                            <svg className="shrink-0 size-[16px]" fill="none" viewBox="0 0 16 16"><circle cx="8" cy="8" r="6" stroke="#535862" strokeWidth="1.3"/><path d="M6 6l4 4M10 6l-4 4" stroke="#535862" strokeWidth="1.3" strokeLinecap="round"/></svg>
                          )}
                          <p className={`font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic text-[14px] whitespace-nowrap ${checkInDisabled ? "text-[#727685]" : isRealizarMode ? "text-[#0b5ed7]" : "text-[#414651]"}`}>{checkInLabel}</p>
                          <div className="bg-[#f1f5f9] px-[6px] py-[1px] rounded-[6px]">
                            <p className="font-['Helvetica_Neue:Medium',sans-serif] leading-[normal] not-italic text-[12px] text-[#717680]">{badgeText}</p>
                          </div>
                        </button>
                        {showBulkCheckInTipStickyBar && checkInDisabled && (
                          <div className="absolute bg-[#181d27] bottom-full left-1/2 -translate-x-1/2 mb-[8px] px-[12px] py-[8px] rounded-[8px] shadow-[0px_4px_12px_0px_rgba(0,0,0,0.2)] w-max max-w-[300px] z-50 pointer-events-none text-center">
                            <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[1.4] not-italic text-[12px] text-white">É necessário contratar o seguro dos participantes antes de realizar essa ação</p>
                            <div className="absolute left-1/2 -translate-x-1/2 top-full size-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-[#181d27]" />
                          </div>
                        )}
                      </div>
                    );
                  })()}
                  <button
                    onClick={() => handleBulkAction(confirmLabel === "Confirmar reservas" ? "confirm" : "undo-confirm", confirmLabel)}
                    className="cursor-pointer flex gap-[8px] items-center px-[12px] py-[6px] rounded-[8px] shrink-0 hover:bg-[#f8fafc] transition-colors"
                  >
                    <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic text-[14px] text-[#535862] whitespace-nowrap">{confirmLabel}</p>
                    <div className="bg-[#f1f5f9] px-[6px] py-[1px] rounded-[6px]">
                      <p className="font-['Helvetica_Neue:Medium',sans-serif] leading-[normal] not-italic text-[12px] text-[#717680]">{getBadgeLabel(confirmLabel === "Confirmar reservas" ? "confirm" : "undo-confirm")}</p>
                    </div>
                  </button>
                  <div className="relative">
                    <button onClick={() => setShowMoreActionsStickyBar(!showMoreActionsStickyBar)} className="cursor-pointer flex gap-[6px] items-center px-[12px] py-[6px] rounded-[8px] shrink-0 hover:bg-[#f8fafc] transition-colors">
                      <svg className="shrink-0 size-[16px]" fill="none" viewBox="0 0 16 16"><circle cx="3" cy="8" r="1.2" fill="#535862"/><circle cx="8" cy="8" r="1.2" fill="#535862"/><circle cx="13" cy="8" r="1.2" fill="#535862"/></svg>
                      <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic text-[14px] text-[#535862] whitespace-nowrap">Mais ações</p>
                    </button>
                    {showMoreActionsStickyBar && (
                      <div className="absolute bg-white border border-[#e9eaeb] border-solid mt-[4px] right-0 rounded-[10px] shadow-[0px_4px_12px_0px_rgba(0,0,0,0.1)] w-[260px] z-20">
                        {([
                          { action: "mark-performed" as BulkAction, label: "Definir como realizados", destructive: false },
                          selectedUninsuredCount >= selectedInsuredCount
                            ? { action: "add-insurance" as BulkAction, label: "Contratar seguros", destructive: false }
                            : { action: "undo-bulk-insurance" as BulkAction, label: "Desfazer contratação de seguros", destructive: false },
                          { action: "resend-voucher" as BulkAction, label: "Reenviar vouchers", destructive: false },
                          { action: "reschedule" as BulkAction, label: "Remarcar reservas", destructive: false },
                          { action: "no-show" as BulkAction, label: "Não compareceram", destructive: true },
                          { action: "cancel" as BulkAction, label: "Cancelar reservas", destructive: true },
                        ]).map(({ action, label, destructive }) => (
                          <button
                            key={action}
                            onClick={() => handleBulkAction(action, label)}
                            className={`cursor-pointer flex items-center justify-between px-[14px] py-[10px] transition-colors w-full hover:bg-[#f8fafc] ${destructive ? "text-[#d92d20]" : "text-[#414651]"}`}
                          >
                            <p className={`font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic text-[14px] ${destructive ? "text-[#d92d20]" : "text-[#414651]"}`}>{label}</p>
                            <div className="bg-[#f1f5f9] px-[6px] py-[1px] rounded-[6px]">
                              <p className="font-['Helvetica_Neue:Medium',sans-serif] leading-[normal] not-italic text-[11px] text-[#717680]">{getBadgeLabel(action)}</p>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <button onClick={clearSelection} className="cursor-pointer flex items-center justify-center rounded-[6px] shrink-0 size-[28px] hover:bg-[#f1f5f9] transition-colors">
                    <svg className="size-[16px]" fill="none" viewBox="0 0 16 16"><path d="M4 4l8 8M12 4l-8 8" stroke="#717680" strokeWidth="1.5" strokeLinecap="round"/></svg>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Header — Activity banner */}
      <div className="relative w-full overflow-hidden border-b border-[#e9eaeb]" style={{ background: "linear-gradient(135deg, #edf0ff 0%, #f0f5ff 30%, #f8fafc 60%, #ecfdf3 100%)" }}>
        {/* Decorative shapes */}
        <div className="absolute right-[80px] top-[-20px] size-[120px] rounded-full opacity-[0.06] pointer-events-none" style={{ background: "radial-gradient(circle, #0b5ed7 0%, transparent 70%)" }} />
        <div className="absolute right-[20px] bottom-[-30px] size-[80px] rounded-full opacity-[0.05] pointer-events-none" style={{ background: "radial-gradient(circle, #079455 0%, transparent 70%)" }} />
        {/* Decorative emoji */}
        <div className="absolute right-[32px] top-[50%] -translate-y-[50%] text-[56px] opacity-[0.1] select-none pointer-events-none">🌙</div>
        <div className="flex items-center justify-between relative z-[1]" style={{ padding: "20px 32px" }}>
          <div className="flex items-center gap-[16px]">
            {/* Activity icon */}
            <div className="flex items-center justify-center shrink-0 size-[44px] rounded-[12px] bg-white/80 border border-[#e9eaeb]/60 shadow-[0px_1px_3px_0px_rgba(0,0,0,0.04)]">
              <svg className="size-[22px]" fill="none" viewBox="0 0 24 24">
                <path d="M12 2C8 2 4 6 4 10c0 6 8 12 8 12s8-6 8-12c0-4-4-8-8-8z" stroke="#0b5ed7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M9 10l2 2 4-4" stroke="#0b5ed7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="flex flex-col gap-[4px]">
              {/* Row 1: Name + capacity */}
              <div className="flex items-center gap-[10px]">
                <p className="font-['Helvetica_Neue:Medium',sans-serif] leading-[normal] not-italic text-[18px] text-[#0f172b]">{activity.name}</p>
                <div className="flex items-center gap-[4px] bg-white/70 border border-[#e9eaeb]/60 rounded-[6px] px-[8px] py-[2px]">
                  <p className="font-['Helvetica_Neue:Medium',sans-serif] leading-[normal] not-italic text-[13px] text-[#0b5ed7]">{totalCount}</p>
                  <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic text-[13px] text-[#c0c5ce]">/</p>
                  <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic text-[13px] text-[#a1a1aa]">{activity.capacity}</p>
                </div>
              </div>
              {/* Row 2: Metadata */}
              <div className="flex items-center gap-[12px]">
                <div className="flex items-center gap-[5px]">
                  <svg className="shrink-0 size-[13px]" fill="none" viewBox="0 0 16 16"><path d="M10.667 1.333V4M5.333 1.333V4M2 6.667h12M14 8c0-2.514 0-3.771-.781-4.552C12.438 2.667 11.18 2.667 8.667 2.667H7.333c-2.514 0-3.771 0-4.552.781C2 4.229 2 5.486 2 8v1.333c0 2.514 0 3.771.781 4.552.781.781 2.038.781 4.552.781" stroke="#a1a1aa" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic text-[13px] text-[#717680]">{activity.date.split("-").reverse().join("/")}</p>
                </div>
                <div className="flex items-center gap-[5px]">
                  <svg className="shrink-0 size-[13px]" fill="none" viewBox="0 0 16 16"><circle cx="8" cy="8" r="6.5" stroke="#a1a1aa" strokeWidth="1.2"/><path d="M8 5v3l2 2" stroke="#a1a1aa" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic text-[13px] text-[#717680]">{activity.startTime} - {activity.endTime}</p>
                </div>
                {activity.requiresInsurance && (
                  <div className="flex items-center gap-[5px]">
                    <svg className="shrink-0 size-[13px]" viewBox="0 0 16 16" fill="none"><path d="M12.473 2.331C11.211 1.703 9.667 1.334 8 1.334c-1.667 0-3.211.37-4.473.997-.618.308-.928.462-1.228.946C2 3.76 2 4.229 2 5.166v2.326c0 3.789 3.028 5.895 4.782 6.798.489.251.734.377 1.218.377s.729-.126 1.218-.377C10.972 13.387 14 11.281 14 7.492V5.166c0-.937 0-1.406-.3-1.89-.3-.483-.609-.637-1.227-.945Z" stroke="#079455" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic text-[13px] text-[#079455]">Seguro obrigatório</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          {/* Buttons — untouched */}
          <div className="flex gap-[12px] items-center shrink-0">
            <div className="bg-white relative rounded-[8px] shrink-0">
              <div aria-hidden="true" className="absolute border border-[#e2e8f0] border-solid inset-0 pointer-events-none rounded-[8px]" />
              <div className="content-stretch flex gap-[8px] items-center justify-center px-[16px] py-[10px] relative size-full">
                <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic text-[14px] text-[#414651] whitespace-nowrap">Listas e Manifestos</p>
              </div>
            </div>
            <div className="relative rounded-[8px] shrink-0" style={{ backgroundImage: "linear-gradient(rgb(11,94,215), rgb(8,79,183))" }}>
              <div className="content-stretch flex gap-[8px] items-center justify-center px-[16px] py-[10px] relative size-full">
                <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic text-[14px] text-white whitespace-nowrap">Concluir atividade</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search bar + Sort + Filters */}
      <div ref={searchBarRef} className="content-stretch flex gap-[12px] items-center mt-[24px] relative w-full" style={{ padding: "0 32px" }}>
        <div className="bg-white flex-1 min-w-0 relative rounded-[10px]">
          <div aria-hidden="true" className="absolute border border-[#e9eaeb] border-solid inset-0 pointer-events-none rounded-[10px]" />
          <div className="content-stretch flex gap-[8px] items-center px-[14px] py-[10px] relative size-full">
            <svg className="shrink-0 size-[20px]" fill="none" viewBox="0 0 20 20"><circle cx="9" cy="9" r="6" stroke="#717680" strokeWidth="1.5"/><path d="M14 14l3 3" stroke="#717680" strokeWidth="1.5" strokeLinecap="round"/></svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por nome, ID do pedido, etc..."
              className="flex-1 font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] min-w-0 not-italic outline-none text-[14px] text-[#414651] placeholder:text-[#a4a7ae] bg-transparent"
            />
          </div>
        </div>
        {/* Ordenar Por (visual only) */}
        <div className="relative">
          <button
            onClick={() => { setShowSort(!showSort); setShowFilters(false); }}
            className="bg-white relative rounded-[8px] shrink-0 cursor-pointer hover:bg-[#f8fafc] transition-colors"
          >
            <div aria-hidden="true" className="absolute border border-[#e9eaeb] border-solid inset-0 pointer-events-none rounded-[8px]" />
            <div className="content-stretch flex gap-[6px] items-center px-[14px] py-[10px] relative size-full">
              <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic text-[14px] text-[#414651] whitespace-nowrap">Ordenar Por</p>
              <svg className="shrink-0 size-[16px]" fill="none" viewBox="0 0 16 16"><path d="M4 6l4 4 4-4" stroke="#717680" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
          </button>
          {showSort && (
            <div className="absolute bg-white border border-[#e9eaeb] border-solid mt-[4px] right-0 rounded-[10px] shadow-[0px_4px_12px_0px_rgba(0,0,0,0.1)] w-[200px] z-20">
              {["Alfabética", "Número de pedido", "Data da reserva"].map((opt) => (
                <button key={opt} onClick={() => setShowSort(false)} className="cursor-pointer font-['Helvetica_Neue:Regular',sans-serif] hover:bg-[#f8fafc] leading-[normal] not-italic px-[14px] py-[10px] text-[14px] text-[#414651] text-left transition-colors w-full">
                  {opt}
                </button>
              ))}
            </div>
          )}
        </div>
        {/* Filtros (visual only) */}
        <div className="relative">
          <button
            onClick={() => { setShowFilters(!showFilters); setShowSort(false); }}
            className="bg-white relative rounded-[8px] shrink-0 cursor-pointer hover:bg-[#f8fafc] transition-colors"
          >
            <div aria-hidden="true" className="absolute border border-[#e9eaeb] border-solid inset-0 pointer-events-none rounded-[8px]" />
            <div className="content-stretch flex gap-[6px] items-center px-[14px] py-[10px] relative size-full">
              <svg className="shrink-0 size-[16px]" fill="none" viewBox="0 0 16 16"><path d="M2 3h12M4 8h8M6 13h4" stroke="#717680" strokeWidth="1.5" strokeLinecap="round"/></svg>
              <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic text-[14px] text-[#414651] whitespace-nowrap">Filtros</p>
            </div>
          </button>
          {showFilters && <FiltersDrawer onClose={() => setShowFilters(false)} />}
        </div>
      </div>

      {/* Filter tabs OR Bulk actions bar */}
      <div ref={bulkBarRef} className="mt-[16px] relative w-full bg-white rounded-[12px] h-[40px] flex items-center" style={{ padding: "0 8px 0 16px", margin: "16px 32px 0 32px", width: "calc(100% - 64px)" }}>
        <div aria-hidden="true" className="absolute border border-[#f5f5f5] border-solid inset-0 pointer-events-none rounded-[12px]" />
        {hasSelection ? (
          /* ── Bulk actions bar ── */
          <div className="flex items-center gap-[12px] relative transition-all duration-200 w-full">
            {/* Select all checkbox */}
            <button onClick={toggleSelectAll} className="cursor-pointer flex items-center justify-center shrink-0" style={{ padding: "1px 0", width: "20px" }}>
              <div className={`flex items-center justify-center rounded-[4px] size-[20px] ${isAllSelected ? "bg-[#0b5ed7]" : "bg-[#0b5ed7]"}`}>
                <svg className="size-[12px]" fill="none" viewBox="0 0 12 12"><path d="M2.5 6l2.5 2.5L9.5 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
            </button>
            <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic text-[14px] text-[#252b37] whitespace-nowrap">Todos os {selectedIds.size} selecionados</p>
            {/* Actions group — aligned right */}
            <div className="flex items-center gap-[12px] ml-auto">
            {/* Primary inline actions — Check-in */}
            {(() => {
              const isRealizarMode = checkInLabel === "Realizar Check-in's";
              const checkInDisabled = isRealizarMode && selectedInsuredCount === 0;
              const badgeText = isRealizarMode ? `${selectedInsuredCount} de ${selectedIds.size}` : getBadgeLabel("undo-check-in");
              return (
              <div className="relative"
                onMouseEnter={() => checkInDisabled && setShowBulkCheckInTip(true)}
                onMouseLeave={() => setShowBulkCheckInTip(false)}
              >
                <button
                  onClick={() => !checkInDisabled && handleBulkAction(isRealizarMode ? "check-in" : "undo-check-in", checkInLabel)}
                  disabled={checkInDisabled}
                  className={`flex gap-[8px] items-center px-[12px] py-[6px] rounded-[8px] shrink-0 transition-colors ${checkInDisabled ? "cursor-not-allowed opacity-50" : "cursor-pointer hover:bg-[#f8fafc]"}`}
                >
                  {isRealizarMode ? (
                    <svg className="shrink-0 size-[16px]" fill="none" viewBox="0 0 16 16"><circle cx="8" cy="8" r="6" stroke={checkInDisabled ? "#727685" : "#0b5ed7"} strokeWidth="1.3"/><path d="M5.5 8l1.8 1.8L10.5 6" stroke={checkInDisabled ? "#727685" : "#0b5ed7"} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  ) : (
                    <svg className="shrink-0 size-[16px]" fill="none" viewBox="0 0 16 16"><circle cx="8" cy="8" r="6" stroke="#535862" strokeWidth="1.3"/><path d="M6 6l4 4M10 6l-4 4" stroke="#535862" strokeWidth="1.3" strokeLinecap="round"/></svg>
                  )}
                  <p className={`font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic text-[14px] whitespace-nowrap ${checkInDisabled ? "text-[#727685]" : isRealizarMode ? "text-[#0b5ed7]" : "text-[#414651]"}`}>{checkInLabel}</p>
                  <div className="bg-[#f1f5f9] px-[6px] py-[1px] rounded-[6px]">
                    <p className="font-['Helvetica_Neue:Medium',sans-serif] leading-[normal] not-italic text-[12px] text-[#717680]">{badgeText}</p>
                  </div>
                </button>
                {showBulkCheckInTip && checkInDisabled && (
                  <div className="absolute bg-[#181d27] bottom-full left-1/2 -translate-x-1/2 mb-[8px] px-[12px] py-[8px] rounded-[8px] shadow-[0px_4px_12px_0px_rgba(0,0,0,0.2)] w-max max-w-[300px] z-50 pointer-events-none text-center">
                    <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[1.4] not-italic text-[12px] text-white">É necessário contratar o seguro dos participantes antes de realizar essa ação</p>
                    <div className="absolute left-1/2 -translate-x-1/2 top-full size-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-[#181d27]" />
                  </div>
                )}
              </div>
              );
            })()}
            <button
              onClick={() => handleBulkAction(confirmLabel === "Confirmar reservas" ? "confirm" : "undo-confirm", confirmLabel)}
              className="cursor-pointer flex gap-[8px] items-center px-[12px] py-[6px] rounded-[8px] shrink-0 hover:bg-[#f8fafc] transition-colors"
            >
              <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic text-[14px] text-[#535862] whitespace-nowrap">{confirmLabel}</p>
              <div className="bg-[#f1f5f9] px-[6px] py-[1px] rounded-[6px]">
                <p className="font-['Helvetica_Neue:Medium',sans-serif] leading-[normal] not-italic text-[12px] text-[#717680]">{getBadgeLabel(confirmLabel === "Confirmar reservas" ? "confirm" : "undo-confirm")}</p>
              </div>
            </button>
            {/* More actions dropdown */}
            <div className="relative">
              <button onClick={() => setShowMoreActions(!showMoreActions)} className="cursor-pointer flex gap-[6px] items-center px-[12px] py-[6px] rounded-[8px] shrink-0 hover:bg-[#f8fafc] transition-colors">
                <svg className="shrink-0 size-[16px]" fill="none" viewBox="0 0 16 16"><circle cx="3" cy="8" r="1.2" fill="#535862"/><circle cx="8" cy="8" r="1.2" fill="#535862"/><circle cx="13" cy="8" r="1.2" fill="#535862"/></svg>
                <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic text-[14px] text-[#535862] whitespace-nowrap">Mais ações</p>
              </button>
              {showMoreActions && (
                <div className="absolute bg-white border border-[#e9eaeb] border-solid mt-[4px] right-0 rounded-[10px] shadow-[0px_4px_12px_0px_rgba(0,0,0,0.1)] w-[260px] z-20">
                  {([
                    { action: "mark-performed" as BulkAction, label: "Definir como realizados", destructive: false },
                    selectedUninsuredCount >= selectedInsuredCount
                      ? { action: "add-insurance" as BulkAction, label: "Contratar seguros", destructive: false }
                      : { action: "undo-bulk-insurance" as BulkAction, label: "Desfazer contratação de seguros", destructive: false },
                    { action: "resend-voucher" as BulkAction, label: "Reenviar vouchers", destructive: false },
                    { action: "reschedule" as BulkAction, label: "Remarcar reservas", destructive: false },
                    { action: "no-show" as BulkAction, label: "Não compareceram", destructive: true },
                    { action: "cancel" as BulkAction, label: "Cancelar reservas", destructive: true },
                  ]).map(({ action, label, destructive }) => (
                    <button
                      key={action}
                      onClick={() => handleBulkAction(action, label)}
                      className={`cursor-pointer flex items-center justify-between px-[14px] py-[10px] transition-colors w-full hover:bg-[#f8fafc] ${destructive ? "text-[#d92d20]" : "text-[#414651]"}`}
                    >
                      <p className={`font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic text-[14px] ${destructive ? "text-[#d92d20]" : "text-[#414651]"}`}>{label}</p>
                      <div className="bg-[#f1f5f9] px-[6px] py-[1px] rounded-[6px]">
                        <p className="font-['Helvetica_Neue:Medium',sans-serif] leading-[normal] not-italic text-[11px] text-[#717680]">{getBadgeLabel(action)}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
            {/* Clear selection */}
            <button onClick={clearSelection} className="cursor-pointer flex items-center justify-center rounded-[6px] shrink-0 size-[28px] hover:bg-[#f1f5f9] transition-colors">
              <svg className="size-[16px]" fill="none" viewBox="0 0 16 16"><path d="M4 4l8 8M12 4l-8 8" stroke="#717680" strokeWidth="1.5" strokeLinecap="round"/></svg>
            </button>
            </div>
          </div>
        ) : (
          /* ── Filter tabs ── */
          <div className="content-stretch flex gap-[4px] items-center relative transition-all duration-200">
            {/* Select-all checkbox (unchecked) */}
            <button onClick={toggleSelectAll} className="cursor-pointer flex items-center justify-center shrink-0 mr-[8px]" style={{ padding: "1px 0", width: "20px" }}>
              <div className="flex items-center justify-center rounded-[6px] size-[20px] border border-[#d5d7da] bg-white hover:border-[#a4a7ae] transition-colors" />
            </button>
            {filters.map(({ key, label, count }) => (
              <button
                key={key}
                onClick={() => setActiveFilter(key)}
                className={`cursor-pointer flex gap-[6px] items-center px-[12px] py-[6px] relative rounded-[8px] shrink-0 transition-colors ${activeFilter === key ? "bg-[#f0f5ff]" : "hover:bg-[#f8fafc]"}`}
              >
                <p className={`font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic text-[14px] whitespace-nowrap ${activeFilter === key ? "text-[#0b5ed7]" : "text-[#535862]"}`}>{label}</p>
                <div className={`rounded-[6px] shrink-0 ${activeFilter === key ? "bg-[#d5dcfe]" : "bg-[#f1f5f9]"}`}>
                  <div className="px-[6px] py-[1px]">
                    <p className={`font-['Helvetica_Neue:Medium',sans-serif] leading-[normal] not-italic text-[12px] ${activeFilter === key ? "text-[#0b5ed7]" : "text-[#717680]"}`}>{count}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Reservation list — Figma-faithful layout */}
      <div className="content-stretch flex flex-col items-start mt-[20px] relative w-full" style={{ minHeight: "calc(100vh - 320px)", padding: "0 32px" }}>
        {filteredReservations.map((r, idx) => {
          const isGroup = r.type === "group";
          const expanded = expandedGroups.has(r.id);
          const pendingCount = r.participants.filter((p) => p.checkInStatus === "Pending").length;
          const doneCount = r.participants.filter((p) => p.checkInStatus === "Done").length;

          return (
            <div key={r.id} className={`relative rounded-[12px] shrink-0 w-full mb-[20px] border border-solid shadow-[0px_1px_2px_0px_rgba(10,13,18,0.03)] transition-all duration-150 hover:shadow-[0px_2px_4px_0px_rgba(10,13,18,0.08)] ${r.participants.some((p) => selectedIds.has(p.id)) ? "bg-[#f0f5ff] border-[#c7d4f4]" : "bg-white border-[#EEF0F4]"}`}>
              {/* ── Reservation header ── */}
              <div className={`flex h-[40px] items-center relative w-full rounded-t-[12px] overflow-hidden transition-colors ${r.participants.some((p) => selectedIds.has(p.id)) ? "bg-[#f0f5ff]" : ""}`}>
                {/* Left bar — blue for groups, green for individual */}
                <div className={`absolute left-0 top-0 bottom-0 w-[3px] rounded-tl-[12px] ${isGroup ? "bg-[#0b5ed7]" : "bg-[#079455]"}`} />
                <div className="flex gap-[8px] items-center size-full" style={{ padding: "0 16px 0 16px" }}>
                  {/* Type icon */}
                  <div className="shrink-0 size-[14px]">
                    {isGroup ? (
                      <svg className="size-full" fill="none" viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2" stroke="#a1a1aa" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><circle cx="9" cy="7" r="4" stroke="#a1a1aa" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M22 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="#a1a1aa" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    ) : (
                      <svg className="size-full" fill="none" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" stroke="#a1a1aa" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><circle cx="12" cy="7" r="4" stroke="#a1a1aa" strokeWidth="1.5"/></svg>
                    )}
                  </div>
                  {/* Title */}
                  <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic text-[13px] text-[#252b37] whitespace-nowrap">{isGroup ? "Reserva em grupo" : "Reserva individual"}</p>
                  {r.status === "Cancelled" && (
                    <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic text-[11px] text-[#a1a1aa] whitespace-nowrap">· Cancelada</p>
                  )}
                  <button onClick={() => setPaymentDrawerRes(r)} className="cursor-pointer font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic text-[12px] text-[#c0c5ce] whitespace-nowrap hover:text-[#0b5ed7] transition-colors">{r.orderId}</button>
                  <div className="relative group">
                    <button onClick={() => handleCopyId(r.orderId)} className="cursor-pointer shrink-0 size-[12px] hover:opacity-70 transition-opacity">
                      <svg className="block size-full" fill="none" viewBox="0 0 16 16"><rect x="4.5" y="4.5" width="9" height="9" rx="1.5" stroke="#d5d7da" strokeWidth="1.2"/><path d="M11 4.5V3a1.5 1.5 0 00-1.5-1.5H3.5A1.5 1.5 0 002 3v6.5A1.5 1.5 0 003.5 11H5" stroke="#d5d7da" strokeWidth="1.2"/></svg>
                    </button>
                    <div className="absolute bg-[#181d27] bottom-full left-1/2 -translate-x-1/2 mb-[6px] px-[8px] py-[4px] rounded-[6px] text-center opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none whitespace-nowrap z-50">
                      <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic text-[11px] text-white">{copiedId === r.orderId ? "Copiado!" : "Copiar ID"}</p>
                      <div className="absolute left-1/2 -translate-x-1/2 top-full size-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[4px] border-t-[#181d27]" />
                    </div>
                  </div>
                  {/* Spacer */}
                  <div className="flex-1" />
                  {/* Participant count badge — right side (only for groups) */}
                  {isGroup && <ParticipantCountBadge count={r.participants.length} />}
                </div>
              </div>
              {/* ── Participant rows ── */}
              {(() => {
                const allParticipants = r.participants;
                const firstParticipant = r.participants.filter((p) => p.notes?.includes("Comprador")).slice(0, 1).length > 0
                  ? r.participants.filter((p) => p.notes?.includes("Comprador"))[0]
                  : r.participants[0];
                const restParticipants = isGroup ? allParticipants.filter((p) => p.id !== firstParticipant.id) : [];
                const visibleParticipants = isGroup ? [firstParticipant] : allParticipants;

                return (
                  <>
                    {visibleParticipants.map((p, pIdx) => {
                const isCancelled = r.status === "Cancelled";
                const isDone = p.checkInStatus === "Done";
                const checkInDisabled = isCancelled || r.status === "AwaitingPayment" || r.status === "NoShow";
                const isLastRow = pIdx === visibleParticipants.length - 1;
                return (
                  <div key={p.id} className={`border-t border-[#f5f5f5] flex min-h-[52px] items-center relative w-full cursor-pointer transition-colors ${selectedIds.has(p.id) ? "bg-[#f0f5ff] hover:bg-[#e8eeff]" : "hover:bg-[#f8fafc]"} ${isLastRow ? "rounded-b-[12px]" : ""}`} style={{ paddingLeft: "16px" }} onClick={() => setDrawerData({ r, p })}>
                    {/* Blue left bar — only when selected */}
                    {selectedIds.has(p.id) && (
                      <div className="absolute left-0 top-0 bottom-0 w-[4px] bg-[#0b5ed7]" />
                    )}
                    {/* Checkbox cell */}
                    <button onClick={(e) => { e.stopPropagation(); (isGroup && !expanded) ? toggleSelectReservation(r) : toggleSelectParticipant(p.id); }} className="cursor-pointer flex items-center justify-center shrink-0" style={{ padding: "1px 0", width: "24px" }}>
                      {(isGroup && !expanded) ? (
                        r.participants.every((pp) => selectedIds.has(pp.id)) ? (
                          <div className="bg-[#0b5ed7] flex items-center justify-center rounded-[6px] shrink-0 size-[22px]">
                            <svg className="size-[12px]" fill="none" viewBox="0 0 12 12"><path d="M2.5 6l2.5 2.5L9.5 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                          </div>
                        ) : r.participants.some((pp) => selectedIds.has(pp.id)) ? (
                          <div className="bg-[#0b5ed7] flex items-center justify-center rounded-[6px] shrink-0 size-[22px]">
                            <div className="bg-white h-[2px] rounded-[1px] w-[10px]" />
                          </div>
                        ) : (
                          <div className="bg-white border border-[#d5d7da] border-solid rounded-[6px] shrink-0 size-[22px]" />
                        )
                      ) : selectedIds.has(p.id) ? (
                        <div className="bg-[#0b5ed7] flex items-center justify-center rounded-[6px] shrink-0 size-[22px]">
                          <svg className="size-[12px]" fill="none" viewBox="0 0 12 12"><path d="M2.5 6l2.5 2.5L9.5 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        </div>
                      ) : (
                        <div className="bg-white border border-[#d5d7da] border-solid rounded-[6px] shrink-0 size-[22px]" />
                      )}
                    </button>
                    {/* Name cell */}
                    <div className="flex gap-[12px] items-center shrink-0" style={{ width: "286px", padding: "8px 16px" }}>
                      <div className="flex flex-col gap-[2px] items-start min-w-0 flex-1">
                        <div className="flex gap-[6px] items-center w-full min-w-0">
                          <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic overflow-hidden text-[14px] text-[#0a0a0a] text-ellipsis whitespace-nowrap min-w-0">{p.name}</p>
                          {isGroup && r.participants[0].id === p.id && (
                            <span className="flex gap-[4px] items-center font-['Helvetica_Neue:Regular',sans-serif] text-[10px] text-[#a1a1aa] shrink-0 border border-[#e2e5ea] rounded-[4px] px-[5px] py-[0px] leading-[16px]"><span className="bg-[#0b5ed7] rounded-[9999px] size-[5px] shrink-0 inline-block" />comprador</span>
                          )}
                        </div>
                        <div className="flex gap-[4px] items-center">
                          {!isGroup ? (
                            <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic text-[12px] text-[#a1a1aa]">{p.tariffType} · {p.age} anos</p>
                          ) : (
                            <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic text-[12px] text-[#a1a1aa]">{p.tariffType} · {p.age} anos</p>
                          )}
                        </div>
                      </div>
                    </div>
                    {/* Vertical divider */}
                    <div className="w-[1px] h-[32px] bg-[#e9eaeb] shrink-0" />
                    {/* Badges — atributos do participante */}
                    <div className="flex flex-1 items-center min-w-0" style={{ padding: "10px 12px" }}>
                      <ParticipantBadgesRow participant={p} insuranceStatus={isParticipantInsured(p.id) ? "Contracted" : "Required"} requiresInsurance={true} reservationStatus={r.status} paymentStatus={r.paymentStatus} onPaymentClick={() => setPaymentDrawerRes(r)} isBuyer={r.participants[0].id === p.id} />
                    </div>
                    {/* Actions cell */}
                    <div className="flex gap-[8px] items-center shrink-0" style={{ padding: "14px 16px 14px 12px" }}>
                      <CheckInButton isDone={isDone} disabled={checkInDisabled} onCheckIn={() => handleCheckIn(p)} onUndo={() => handleUndoCheckIn(p)} />
                      {/* Three-dot menu */}
                      <ParticipantMenu reservation={r} participant={p} onAction={handleMenuAction} participantInsured={isParticipantInsured(p.id)} />
                    </div>
                  </div>
                );
              })}
                    {/* Expandable rest of group */}
                    {isGroup && restParticipants.length > 0 && (
                      <div
                        className="overflow-hidden transition-all duration-300 ease-in-out"
                        style={{ maxHeight: expanded ? `${restParticipants.length * 60}px` : "0px", opacity: expanded ? 1 : 0 }}
                      >
                        {restParticipants.map((p, pIdx) => {
                          const isCancelled = r.status === "Cancelled";
                          const isDone = p.checkInStatus === "Done";
                          const checkInDisabled = isCancelled || r.status === "AwaitingPayment" || r.status === "NoShow";
                          const isLastRow = pIdx === restParticipants.length - 1;
                          return (
                            <div key={p.id} className={`border-t border-[#f5f5f5] flex min-h-[52px] items-center relative w-full cursor-pointer transition-colors ${selectedIds.has(p.id) ? "bg-[#f0f5ff] hover:bg-[#e8eeff]" : "hover:bg-[#f8fafc]"}`} style={{ paddingLeft: "16px" }} onClick={() => setDrawerData({ r, p })}>
                              {selectedIds.has(p.id) && (
                                <div className="absolute left-0 top-0 bottom-0 w-[4px] bg-[#0b5ed7]" />
                              )}
                              <button onClick={(e) => { e.stopPropagation(); toggleSelectParticipant(p.id); }} className="cursor-pointer flex items-center justify-center shrink-0" style={{ padding: "1px 0", width: "24px" }}>
                                {selectedIds.has(p.id) ? (
                                  <div className="bg-[#0b5ed7] flex items-center justify-center rounded-[6px] shrink-0 size-[22px]">
                                    <svg className="size-[12px]" fill="none" viewBox="0 0 12 12"><path d="M2.5 6l2.5 2.5L9.5 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                                  </div>
                                ) : (
                                  <div className="bg-white border border-[#d5d7da] border-solid rounded-[6px] shrink-0 size-[22px]" />
                                )}
                              </button>
                              <div className="flex gap-[12px] items-center shrink-0" style={{ width: "286px", padding: "8px 16px" }}>
                                <div className="flex flex-col gap-[2px] items-start min-w-0 flex-1">
                                  <div className="flex gap-[6px] items-center w-full min-w-0">
                                    <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic overflow-hidden text-[14px] text-[#0a0a0a] text-ellipsis whitespace-nowrap min-w-0">{p.name}</p>
                                  </div>
                                  <div className="flex gap-[4px] items-center">
                                    <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic text-[12px] text-[#a1a1aa]">{p.tariffType} · {p.age} anos</p>
                                  </div>
                                </div>
                              </div>
                              <div className="w-[1px] h-[32px] bg-[#e9eaeb] shrink-0" />
                              <div className="flex flex-1 items-center min-w-0" style={{ padding: "8px 12px" }}>
                                <ParticipantBadgesRow participant={p} insuranceStatus={isParticipantInsured(p.id) ? "Contracted" : "Required"} requiresInsurance={true} reservationStatus={r.status} paymentStatus={r.paymentStatus} onPaymentClick={() => setPaymentDrawerRes(r)} isBuyer={false} />
                              </div>
                              <div className="flex gap-[8px] items-center shrink-0" style={{ padding: "10px 16px 10px 12px" }}>
                                <CheckInButton isDone={isDone} disabled={checkInDisabled} onCheckIn={() => handleCheckIn(p)} onUndo={() => handleUndoCheckIn(p)} />
                                <ParticipantMenu reservation={r} participant={p} onAction={handleMenuAction} participantInsured={isParticipantInsured(p.id)} />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </>
                );
              })()}
              {/* Collapsed: +X participantes / Expanded: Recolher */}
              {isGroup && r.participants.length > 1 && (
                <button
                  onClick={() => toggleGroup(r.id)}
                  className="flex items-center justify-center gap-[6px] px-[16px] py-[8px] w-full cursor-pointer hover:bg-[#f8fafc] transition-colors rounded-b-[12px] border-t border-[#f5f5f5]"
                >
                  <svg className="size-[14px] text-[#0b5ed7]" fill="none" viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="1.5"/><path d="M22 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic text-[12px] text-[#0b5ed7]">
                    {expanded ? `Recolher (${r.participants.length})` : `+${r.participants.length - 1} participante${r.participants.length - 1 > 1 ? "s" : ""}`}
                  </p>
                  <svg className={`size-[12px] text-[#0b5ed7] transition-transform duration-200 ${expanded ? "rotate-180" : ""}`} fill="none" viewBox="0 0 16 16"><path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </button>
              )}
            </div>
          );
        })}
      </div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      {/* Participant data drawer */}
      {drawerData && <ParticipantDrawer participant={drawerData.p} reservation={drawerData.r} onClose={() => setDrawerData(null)} />}
      {/* Payment drawer */}
      {paymentDrawerRes && <PaymentDrawer reservation={paymentDrawerRes} onClose={() => setPaymentDrawerRes(null)} />}
      {/* Cancel confirmation modal */}
      {/* Check-in confirmation modal */}
      {checkInModal && (() => {
        const participants = checkInModal;
        const isBulk = participants.length > 1;
        const requiresIns = activity.requiresInsurance;
        const insuredList = participants.filter(p => isParticipantInsured(p.id));
        const pendingList = participants.filter(p => !isParticipantInsured(p.id));
        const allInsured = pendingList.length === 0;
        const insuranceCost = 29.90; // valor mock do seguro por participante

        const CheckInModalContent = () => {
          const [insuranceAccepted, setInsuranceAccepted] = useState(allInsured);
          const canConfirm = !requiresIns || insuranceAccepted;

          const handleConfirm = () => {
            // Contract insurance for pending participants
            if (requiresIns && !allInsured) {
              for (const p of pendingList) contractInsurance(p.id);
            }
            // Execute check-in for all
            for (const p of participants) {
              dispatch({ type: "CHECK_IN", participantId: p.id });
            }
            setCheckInModal(null);
            showToast(isBulk
              ? `Check-in realizado para ${participants.length} participante(s).`
              : `Check-in de ${participants[0].name.split(" ")[0]} realizado com sucesso!`
            );
          };

          return (
            <div className="fixed inset-0 z-50 flex items-center justify-center" onKeyDown={(e) => e.key === "Escape" && setCheckInModal(null)}>
              <div className="absolute inset-0 bg-black/40" onClick={() => setCheckInModal(null)} />
              <div className="bg-white max-w-[520px] relative rounded-[16px] shadow-[0px_8px_24px_0px_rgba(0,0,0,0.15)] w-full z-10 flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="flex flex-col gap-[6px] px-[24px] pt-[24px] pb-[16px] border-b border-[#f5f5f5] shrink-0">
                  <div className="flex items-center justify-between">
                    <p className="font-['Helvetica_Neue:Medium',sans-serif] leading-[normal] not-italic text-[18px] text-[#181d27]">Confirmar check-in</p>
                    <button onClick={() => setCheckInModal(null)} className="cursor-pointer flex items-center justify-center rounded-[6px] shrink-0 size-[32px] hover:bg-[#f1f5f9] transition-colors">
                      <svg className="size-[18px]" fill="none" viewBox="0 0 18 18"><path d="M4 4l10 10M14 4L4 14" stroke="#717680" strokeWidth="1.5" strokeLinecap="round"/></svg>
                    </button>
                  </div>
                  <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[1.5] not-italic text-[14px] text-[#535862]">Confirme a chegada {isBulk ? `de ${participants.length} participantes` : "do participante"} para registrar o check-in.</p>
                </div>
                {/* Body */}
                <div className="flex flex-col gap-[16px] px-[24px] py-[16px] overflow-y-auto flex-1">
                  {/* Participant list */}
                  {isBulk ? (
                    <div className="flex flex-col gap-[8px]">
                      <p className="font-['Helvetica_Neue:Medium',sans-serif] leading-[normal] not-italic text-[14px] text-[#414651]">{participants.length} participantes selecionados</p>
                      <div className="flex flex-col gap-[4px] max-h-[180px] overflow-y-auto border border-[#f5f5f5] border-solid rounded-[8px] p-[12px]">
                        {participants.map(p => (
                          <div key={p.id} className="flex items-center gap-[8px] py-[4px]">
                            <svg className="shrink-0 size-[14px]" fill="none" viewBox="0 0 14 14"><circle cx="7" cy="5" r="2.5" stroke="#535862" strokeWidth="1.2"/><path d="M2 13c0-2.8 2.2-5 5-5s5 2.2 5 5" stroke="#535862" strokeWidth="1.2" strokeLinecap="round"/></svg>
                            <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic text-[13px] text-[#414651]">{p.name}</p>
                            {requiresIns && isParticipantInsured(p.id) && (
                              <svg className="shrink-0 size-[14px] ml-auto" fill="none" viewBox="0 0 14 14"><path d="M4 7l2 2 4-4" stroke="#079455" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-[10px] bg-[#f8fafc] border border-[#f5f5f5] border-solid rounded-[10px] px-[16px] py-[12px]">
                      <svg className="shrink-0 size-[20px]" fill="none" viewBox="0 0 20 20"><circle cx="10" cy="7" r="3.5" stroke="#535862" strokeWidth="1.5"/><path d="M3 18c0-3.9 3.1-7 7-7s7 3.1 7 7" stroke="#535862" strokeWidth="1.5" strokeLinecap="round"/></svg>
                      <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic text-[15px] text-[#181d27]">{participants[0].name}</p>
                    </div>
                  )}
                  {/* Insurance section — only for activities with required insurance */}
                  {requiresIns && (
                    <>
                      {allInsured ? (
                        /* B.2 — all already insured */
                        <div className="flex items-center gap-[10px] bg-[#ecfdf3] border border-[#dcfae6] border-solid rounded-[10px] px-[16px] py-[12px]">
                          <svg className="shrink-0 size-[20px]" viewBox="0 0 20 20" fill="none"><path d="M15.5908 2.91298C13.8888 2.12838 11.8341 1.6665 9.75 1.6665C7.66589 1.6665 5.61125 2.12838 3.90931 2.91298C3.1356 3.28525 2.74874 3.49014 2.37467 4.09503C2.00059 4.69991 2 5.28561 2 6.45702L2 9.36441C2 14.1007 5.78531 16.7339 7.97754 17.8618C8.58891 18.1762 8.89459 18.3335 9.75 18.3335C10.6054 18.3335 10.9111 18.1762 11.5225 17.8618C13.7147 16.7339 17.5 14.1007 17.5 9.36441L17.5 6.45702C17.5 5.28561 17.5 4.69991 17.1253 4.09503C16.7513 3.49013 16.364 3.28524 15.5908 2.91298Z" stroke="#079455" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M7.5 9.58333C7.5 9.58333 8.67326 9.79349 9.16667 11.2498C9.16667 11.2498 10.4167 8.74984 12.5 7.9165" stroke="#079455" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                          <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[1.5] not-italic text-[14px] text-[#079455]">
                            {isBulk ? "Todos os participantes já possuem seguro contratado" : "Seguro já contratado para este participante"}
                          </p>
                        </div>
                      ) : (
                        /* B.1 / B.3 — some or all need insurance */
                        <div className="flex flex-col gap-[12px]">
                          {/* Warning banner */}
                          <div className="flex gap-[10px] bg-[#fef3c7] border border-[#fde68a] border-solid rounded-[10px] px-[16px] py-[12px]">
                            <svg className="shrink-0 size-[20px] mt-[2px]" viewBox="0 0 20 20" fill="none"><path d="M10 7.5V10.833M10 13.333v.5M18.333 10c0 4.602-3.731 8.333-8.333 8.333S1.667 14.602 1.667 10 5.398 1.667 10 1.667 18.333 5.398 18.333 10z" stroke="#92400E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                            <div className="flex flex-col gap-[4px]">
                              <p className="font-['Helvetica_Neue:Medium',sans-serif] leading-[normal] not-italic text-[14px] text-[#92400E]">Seguro obrigatório</p>
                              <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[1.5] not-italic text-[13px] text-[#92400E]">
                                Esta atividade exige contratação de seguro. {pendingList.length === 1 ? "1 participante precisa" : `${pendingList.length} participantes precisam`} de contratação.
                              </p>
                            </div>
                          </div>
                          {/* B.3 — mixed: show already insured count */}
                          {isBulk && insuredList.length > 0 && (
                            <div className="flex items-center gap-[8px] px-[4px]">
                              <svg className="shrink-0 size-[16px]" fill="none" viewBox="0 0 16 16"><path d="M4 8l2.5 2.5L12 5" stroke="#079455" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
                              <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic text-[13px] text-[#079455]">{insuredList.length} participante(s) com seguro já contratado</p>
                            </div>
                          )}
                          {/* Cost summary */}
                          <div className="flex items-center justify-between bg-[#f8fafc] border border-[#f5f5f5] border-solid rounded-[10px] px-[16px] py-[12px]">
                            <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic text-[14px] text-[#414651]">
                              Seguro obrigatório · {pendingList.length} participante{pendingList.length > 1 ? "s" : ""}
                            </p>
                            <p className="font-['Helvetica_Neue:Medium',sans-serif] leading-[normal] not-italic text-[14px] text-[#181d27]">
                              R$ {(pendingList.length * insuranceCost).toFixed(2).replace(".", ",")}
                            </p>
                          </div>
                          {/* Checkbox to accept insurance */}
                          <label className="flex items-start gap-[10px] cursor-pointer px-[4px]">
                            <button
                              type="button"
                              onClick={() => setInsuranceAccepted(!insuranceAccepted)}
                              className={`shrink-0 size-[20px] rounded-[4px] flex items-center justify-center mt-[1px] transition-colors ${insuranceAccepted ? "bg-[#0b5ed7]" : "bg-white border border-[#d5d7da] border-solid"}`}
                            >
                              {insuranceAccepted && <svg className="size-[12px]" fill="none" viewBox="0 0 12 12"><path d="M2.5 6l2.5 2.5L9.5 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                            </button>
                            <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[1.5] not-italic text-[13px] text-[#414651]">
                              Confirmo a contratação do seguro obrigatório para o(s) participante(s) listado(s) acima.
                            </p>
                          </label>
                        </div>
                      )}
                    </>
                  )}
                </div>
                {/* Footer */}
                <div className="flex items-center justify-end gap-[12px] px-[24px] pt-[16px] pb-[24px] border-t border-[#f5f5f5] shrink-0">
                  <div className="flex gap-[12px]">
                    <button onClick={() => setCheckInModal(null)} className="bg-white border border-[#d92d20] border-solid cursor-pointer font-['Helvetica_Neue:Regular',sans-serif] hover:bg-[#fef3f2] not-italic px-[16px] py-[10px] rounded-[8px] text-[14px] text-[#d92d20] transition-colors">Cancelar</button>
                    <button
                      onClick={handleConfirm}
                      disabled={!canConfirm}
                      className={`font-['Helvetica_Neue:Regular',sans-serif] not-italic px-[16px] py-[10px] rounded-[8px] text-[14px] text-white transition-colors ${canConfirm ? "bg-[#0b5ed7] cursor-pointer hover:bg-[#084fb7]" : "bg-[#93b4ed] cursor-not-allowed"}`}
                    >Confirmar check-in</button>
                  </div>
                </div>
              </div>
            </div>
          );
        };
        return <CheckInModalContent />;
      })()}
      {cancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setCancelModal(null)} />
          <div className="bg-white max-w-[480px] relative rounded-[16px] shadow-[0px_8px_24px_0px_rgba(0,0,0,0.15)] w-full z-10">
            <div className="flex flex-col gap-[16px] p-[24px]">
              <p className="font-['Helvetica_Neue:Medium',sans-serif] leading-[normal] not-italic text-[18px] text-[#181d27]">Cancelar reserva</p>
              <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[1.5] not-italic text-[14px] text-[#535862]">
                Tem certeza que deseja cancelar a reserva de <strong>{cancelModal.p.name}</strong>? O valor será retido para possível reembolso conforme a política vigente.
              </p>
              <div className="flex flex-col gap-[6px]">
                <p className="font-['Helvetica_Neue:Medium',sans-serif] leading-[normal] not-italic text-[13px] text-[#414651]">Motivo do cancelamento *</p>
                <select value={cancelReason} onChange={(e) => setCancelReason(e.target.value)} className="bg-white border border-[#e9eaeb] border-solid font-['Helvetica_Neue:Regular',sans-serif] not-italic outline-none px-[12px] py-[10px] rounded-[8px] text-[14px] text-[#414651]">
                  <option value="">Selecione um motivo...</option>
                  <option value="solicitacao-cliente">Solicitação do cliente</option>
                  <option value="condicoes-climaticas">Condições climáticas</option>
                  <option value="falta-quorum">Falta de quórum</option>
                  <option value="problemas-operacionais">Problemas operacionais</option>
                  <option value="outro">Outro</option>
                </select>
              </div>
              <div className="flex gap-[12px] justify-end mt-[8px]">
                <button onClick={() => setCancelModal(null)} className="bg-white border border-[#e2e8f0] border-solid cursor-pointer font-['Helvetica_Neue:Regular',sans-serif] hover:bg-[#f8fafc] not-italic px-[16px] py-[10px] rounded-[8px] text-[14px] text-[#414651] transition-colors">Voltar</button>
                <button onClick={confirmCancel} disabled={!cancelReason} className={`cursor-pointer font-['Helvetica_Neue:Regular',sans-serif] not-italic px-[16px] py-[10px] rounded-[8px] text-[14px] text-white transition-colors ${cancelReason ? "bg-[#d92d20] hover:bg-[#b42318]" : "bg-[#fda29b] cursor-not-allowed"}`}>Confirmar cancelamento</button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* No-show confirmation modal */}
      {noShowModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setNoShowModal(null)} />
          <div className="bg-white max-w-[440px] relative rounded-[16px] shadow-[0px_8px_24px_0px_rgba(0,0,0,0.15)] w-full z-10">
            <div className="flex flex-col gap-[16px] p-[24px]">
              <p className="font-['Helvetica_Neue:Medium',sans-serif] leading-[normal] not-italic text-[18px] text-[#181d27]">Marcar como não compareceu</p>
              <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[1.5] not-italic text-[14px] text-[#535862]">
                Confirma que <strong>{noShowModal.p.name}</strong> não compareceu à atividade? Diferente de cancelar, o valor será retido para possível remarcação.
              </p>
              <div className="flex gap-[12px] justify-end mt-[8px]">
                <button onClick={() => setNoShowModal(null)} className="bg-white border border-[#e2e8f0] border-solid cursor-pointer font-['Helvetica_Neue:Regular',sans-serif] hover:bg-[#f8fafc] not-italic px-[16px] py-[10px] rounded-[8px] text-[14px] text-[#414651] transition-colors">Voltar</button>
                <button onClick={confirmNoShow} className="bg-[#d92d20] cursor-pointer font-['Helvetica_Neue:Regular',sans-serif] hover:bg-[#b42318] not-italic px-[16px] py-[10px] rounded-[8px] text-[14px] text-white transition-colors">Confirmar</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AgendaAtualizacoes({ initialTab = "atualizacoes", onBackToActivities, activityId = "act-001" }: { initialTab?: string; onBackToActivities?: () => void; activityId?: string }) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const activity = mockActivities.find((a) => a.id === activityId) || mockActivities[0];

  return (
    <div className="fixed inset-0 z-50 bg-[#f8fafc] flex flex-col" data-name="AGENDA - ATUALIZAÇÕES">
      {/* ── Fullscreen header ── */}
      <header className="shrink-0 border-b border-[#e9eaeb] bg-white">
        <div className="flex h-[56px] items-center px-[20px]">
          {/* Left: title */}
          <div className="flex items-center gap-[12px]">
            <div className="h-[20px] w-[3px] bg-[#0b5ed7] rounded-[2px]" />
            <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic text-[15px] text-[#252b37]">{activity.name}</p>
            <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic text-[13px] text-[#a1a1aa]">Participantes e check-in</p>
          </div>
          {/* Right: close */}
          <button
            onClick={onBackToActivities}
            className="ml-auto flex gap-[6px] items-center px-[14px] py-[8px] rounded-[8px] border border-[#e9eaeb] bg-white cursor-pointer hover:bg-[#f8fafc] transition-colors"
          >
            <svg className="size-[14px]" fill="none" viewBox="0 0 18 18"><path d="M4 4l10 10M14 4L4 14" stroke="#717680" strokeWidth="1.5" strokeLinecap="round"/></svg>
            <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic text-[13px] text-[#535862]">Fechar</p>
          </button>
        </div>
      </header>

      {/* ── Body: sidebar + content ── */}
      <div className="flex flex-1 min-h-0">
        {/* Sidebar */}
        <nav className="flex flex-col w-[220px] shrink-0 border-r border-[#e9eaeb] bg-white py-[16px] px-[12px] overflow-y-auto gap-[4px]">
          <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic text-[10px] text-[#a1a1aa] uppercase tracking-[1px] px-[10px] pb-[8px]">Navegação</p>
          {([
            { id: "participantes", label: "Participantes", icon: <svg className="size-[16px]" fill="none" viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="1.5"/><path d="M22 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg> },
            { id: "atualizacoes", label: "Atualizações", icon: <svg className="size-[16px]" fill="none" viewBox="0 0 24 24"><path d="M12 8v4l3 3M3 12a9 9 0 1018 0 9 9 0 00-18 0z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg> },
            { id: "visao-geral", label: "Visão geral", icon: <svg className="size-[16px]" fill="none" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><polyline points="14,2 14,8 20,8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg> },
          ] as { id: string; label: string; icon: React.ReactNode }[]).map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-[8px] px-[10px] py-[8px] rounded-[8px] text-left transition-colors cursor-pointer ${
                activeTab === item.id
                  ? "bg-[#edf0ff] text-[#0b5ed7]"
                  : "text-[#717680] hover:text-[#252b37] hover:bg-[#f8fafc]"
              }`}
            >
              <div className="shrink-0">{item.icon}</div>
              <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic text-[14px]">{item.label}</p>
            </button>
          ))}
        </nav>

        {/* Content */}
        <main className="flex-1 overflow-y-auto">
          {activeTab === "atualizacoes" && (
            <div className="relative">
              <Frame23 />
              <Frame24 />
            </div>
          )}
          {activeTab === "visao-geral" && (
            <AgendaVisaoGeral onAtualizacoesClick={() => setActiveTab("atualizacoes")} onBackToActivities={onBackToActivities} hideSidebar activityId={activityId} />
          )}
          {activeTab === "participantes" && (
            <ParticipantesTab onBackToActivities={onBackToActivities} activity={activity} />
          )}
        </main>
      </div>
    </div>
  );
}