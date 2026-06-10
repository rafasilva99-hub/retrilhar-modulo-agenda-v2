// @ts-nocheck
import React, { useState, useMemo, useReducer, useRef, useEffect } from "react";
import svgPaths from "./svg-axule6rb2z";
import imgTopBar from "./4a664b1820bfb04f20dc4f636db105ede4311f14.png";
import AgendaVisaoGeral from "../AgendaVisaoGeral/AgendaVisaoGeral";
import { mockReservations, mockActivities, isEligibleForBulkAction, reservationStateMachine } from "../../mocks/agenda";
import type { Activity, Reservation, Participant, CheckInStatus, BulkAction, ReservationStatus, InsuranceStatus } from "../../types/agenda";
import { ParticipantCountBadge } from "../../components/ui/participant-count-badge";
import { ParticipantAttributeBadge } from "../../components/ui/participant-attribute-badge";
import type { ImageTermStatus } from "../../types/agenda";

// ─── Reservation state management ───────────────────────────────────────────

type ResAction =
  | { type: "CHECK_IN"; participantId: string }
  | { type: "UNDO_CHECK_IN"; participantId: string };

const TARIFF_VARIANTS = [
  "Adulto Meia-Entrada Estudante com Transporte e Seguro Incluso",
  "Criança até 12 anos acompanhada",
  "Cortesia Operacional / Convidado",
  "Excursão Escolar Educativa (turma)",
] as const;

function getParticipantReservationId(participantId: string) {
  const numericSeed = participantId.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const id = 1000 + ((numericSeed * 73) % 9000);
  return `#${id}`;
}

function formatActivityDate(date: string) {
  const [year, month, day] = date.split("-");
  if (!year || !month || !day) return date;
  return `${day}/${month}/${year}`;
}

function getActivityHeaderStatus(activity: Activity) {
  if (activity.lifecycleStatus === "EmAndamento") return "ongoing";
  if (activity.lifecycleStatus === "Realizada") return "completed";
  if (activity.lifecycleStatus === "Cancelada") return "cancelled";
  return "upcoming";
}

function getActivityHeaderAlerts(activity: Activity) {
  const alerts: string[] = [];

  if (activity.requiresInsurance) alerts.push("Seguro obrigatório");
  if (!activity.allParticipantsInsured) alerts.push("Seguro pendente");
  if (activity.participantsNeedingMedicalAttention > 0) {
    alerts.push(`${activity.participantsNeedingMedicalAttention} participante(s) com atenção médica`);
  }
  if (activity.cancellationReason) alerts.push(activity.cancellationReason);

  return alerts;
}

function getGuideInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function getActivityHeaderTeam(activity: Activity) {
  const colors = ["#0b5ed7", "#7c3aed", "#059669", "#d97706"];
  const guides = activity.assignedGuides.length > 0 ? activity.assignedGuides : [activity.guideName].filter(Boolean);

  if (guides.length === 0) {
    return {
      team: [{ initials: "NA", color: "#94a3b8" }],
      teamNames: "Equipe não alocada",
    };
  }

  return {
    team: guides.map((guide, index) => ({
      initials: getGuideInitials(guide),
      color: colors[index % colors.length],
    })),
    teamNames: guides.join(", "),
  };
}

function getActivityHeaderStats(activity: Activity, reservations: Reservation[]) {
  const participants = reservations.flatMap((reservation) => reservation.participants);
  const checkedIn = participants.filter((participant) => participant.checkInStatus === "Done").length;
  const waitingCheckIn = participants.filter((participant) => participant.checkInStatus === "Pending").length;
  const insured = participants.filter((participant) => participant.insuranceStatus === "Contracted").length;

  return {
    totalParticipants: activity.occupancy,
    confirmedReservations: reservations.filter((reservation) =>
      ["Confirmed", "CheckedIn", "Performed"].includes(reservation.status)
    ).length,
    checkedIn,
    waitingCheckIn,
    nextParticipant: participants.find((participant) => participant.checkInStatus === "Pending")?.name,
    insured,
  };
}

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

function ResizeGrip({ onMouseDown }: { onMouseDown?: React.MouseEventHandler }) {
  return (
    <div
      onMouseDown={onMouseDown}
      className={`absolute bottom-[2px] right-[2px] size-[12px] ${onMouseDown ? "cursor-ns-resize" : "pointer-events-none"}`}
    >
      <svg className="block size-full" fill="none" viewBox="0 0 10 10">
        <path d="M9 1L1 9" stroke="#71717A" strokeWidth="1" strokeLinecap="round" />
        <path d="M9 5L5 9" stroke="#71717A" strokeWidth="1" strokeLinecap="round" />
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

function Frame21() {
  const records = [
    {
      avatar: <Avatar />,
      card: <Frame4 />,
      hasStroke: true,
    },
    {
      avatar: (
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
      ),
      card: <Frame5 />,
      hasStroke: true,
    },
    {
      avatar: (
        <div className="relative shrink-0 size-[32px]" data-name="avatar">
          <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
            <circle cx="16" cy="16" fill="var(--fill-0, #FFFAEB)" id="Ellipse 1" r="15.5" stroke="var(--stroke-0, #FEF0C7)" />
          </svg>
          <p className="-translate-x-1/2 absolute font-['Inter:Medium',sans-serif] font-medium leading-[19.2px] left-1/2 not-italic overflow-hidden text-[#252b37] text-[12.8px] text-center text-ellipsis top-[calc(50%-9.6px)] w-[22.4px] whitespace-nowrap">🧗</p>
        </div>
      ),
      card: <Frame6 />,
      hasStroke: true,
    },
    {
      avatar: (
        <div className="relative shrink-0 size-[32px]" data-name="avatar">
          <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
            <circle cx="16" cy="16" fill="var(--fill-0, #FFFAEB)" id="Ellipse 1" r="15.5" stroke="var(--stroke-0, #FEF0C7)" />
          </svg>
          <p className="-translate-x-1/2 absolute font-['Inter:Medium',sans-serif] font-medium leading-[19.2px] left-1/2 not-italic overflow-hidden text-[#252b37] text-[12.8px] text-center text-ellipsis top-[calc(50%-9.6px)] w-[22.4px] whitespace-nowrap">🚐</p>
        </div>
      ),
      card: <Frame7 />,
      hasStroke: true,
    },
    {
      avatar: (
        <div className="relative shrink-0 size-[32px]" data-name="avatar">
          <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
            <circle cx="16" cy="16" fill="var(--fill-0, #EFF8FF)" id="Ellipse 1" r="15.5" stroke="var(--stroke-0, #D1E9FF)" />
          </svg>
          <p className="-translate-x-1/2 absolute font-['Inter:Medium',sans-serif] font-medium leading-[19.2px] left-1/2 not-italic overflow-hidden text-[#252b37] text-[12.8px] text-center text-ellipsis top-[calc(50%-9.6px)] w-[22.4px] whitespace-nowrap">💳</p>
        </div>
      ),
      card: <Frame8 />,
      hasStroke: false,
    },
  ];

  return (
    <div className="flex gap-[12px] w-full">
      {/* Timeline column: avatars + strokes */}
      <div className="flex flex-col items-center pt-[6px] shrink-0 w-[32px]">
        {records.map((record, i) => (
          <React.Fragment key={i}>
            {record.avatar}
            {record.hasStroke && <div className="bg-[#e2e8f0] w-px flex-1 my-[8px]" />}
          </React.Fragment>
        ))}
      </div>
      {/* Cards column */}
      <div className="flex flex-col gap-[24px] flex-1 min-w-0">
        {records.map((record, i) => (
          <React.Fragment key={i}>{record.card}</React.Fragment>
        ))}
      </div>
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

type UserRecord = {
  id: string;
  text: string;
  category: string;
  categoryLabel: string;
  timestamp: string;
};

const CATEGORY_OPTIONS = [
  { id: "observacao", label: "Observação", color: "#0b5ed7" },
  { id: "avisos", label: "Avisos", color: "#fba12c" },
  { id: "saude", label: "Saúde", color: "#8d2cfb" },
  { id: "pagamento", label: "Pagamento", color: "#53b1fd" },
  { id: "equipamento", label: "Equipamento", color: "#d444f1" },
  { id: "transporte", label: "Transporte", color: "#6172f3" },
] as const;

function Frame23() {
  const [isActive, setIsActive] = useState(false);
  const [text, setText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("observacao");
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [userRecords, setUserRecords] = useState<UserRecord[]>([]);
  const [inputHeight, setInputHeight] = useState(96);
  const categoryRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!categoryOpen) return;
    function handleClickOutside(e: MouseEvent) {
      if (categoryRef.current && !categoryRef.current.contains(e.target as Node)) {
        setCategoryOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [categoryOpen]);

  const currentCategory = CATEGORY_OPTIONS.find((c) => c.id === selectedCategory) || CATEGORY_OPTIONS[0];

  function handleSave() {
    if (!text.trim() || isSaving) return;
    setIsSaving(true);
    setTimeout(() => {
      setUserRecords((prev) => [
        {
          id: `rec-${Date.now()}`,
          text: text.trim(),
          category: selectedCategory,
          categoryLabel: currentCategory.label,
          timestamp: "Agora mesmo",
        },
        ...prev,
      ]);
      setIsSaving(false);
      setIsActive(false);
      setText("");
      setSelectedCategory("observacao");
    }, 1500);
  }

  function handleResizeMouseDown(e: React.MouseEvent) {
    e.preventDefault();
    const startY = e.clientY;
    const startHeight = inputHeight;
    function onMouseMove(ev: MouseEvent) {
      const newHeight = Math.max(96, startHeight + (ev.clientY - startY));
      setInputHeight(newHeight);
    }
    function onMouseUp() {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    }
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  }

  if (isActive) {
    return (
      <div className="content-stretch flex flex-col gap-[20px] items-start w-full">
        <div className="flex flex-col gap-[12px] w-full">
        <div ref={containerRef} style={{ height: inputHeight }} className="bg-white relative rounded-[12px] w-full" data-name="Text field area">
          <div aria-hidden="true" className="absolute border border-[#e4e4e7] border-solid inset-0 pointer-events-none rounded-[12px]" />
          <div className="content-stretch flex gap-[12px] items-start px-[16px] py-[12px] relative size-full">
            <textarea
              autoFocus
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Digite sua mensagem"
              className="flex-1 min-w-0 h-full font-['Helvetica_Neue:Regular',sans-serif] not-italic text-[#414651] text-[14px] bg-transparent outline-none resize-none leading-normal placeholder:text-[#71717a]"
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
          </div>
          <ResizeGrip onMouseDown={handleResizeMouseDown} />
        </div>
        <div className="content-stretch flex gap-[16px] items-center justify-center relative shrink-0 w-full">
          {/* Category dropdown */}
          <div ref={categoryRef} className="relative">
            <button
              onClick={() => setCategoryOpen(!categoryOpen)}
              className="bg-white content-stretch cursor-pointer drop-shadow-[0px_1px_1px_rgba(10,13,18,0.05)] flex gap-[4px] h-[24px] items-center px-[8px] py-[5px] relative rounded-[6px] shrink-0"
              data-name="Category select component"
            >
              <div aria-hidden="true" className="absolute border border-[#d5d7da] border-solid inset-0 pointer-events-none rounded-[6px]" />
              <div className="flex flex-col font-['Helvetica_Neue:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#71717a] text-[12px] text-left whitespace-nowrap">
                <p className="leading-[normal]">Categoria:</p>
              </div>
              <p className="font-['Helvetica_Neue:Medium',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#414651] text-[12px] text-center whitespace-nowrap">{currentCategory.label}</p>
              <svg className={`shrink-0 size-[12px] transition-transform ${categoryOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24">
                <path d="M18 9C18 9 13.5811 15 12 15C10.4189 15 6 9 6 9" stroke="#414651" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
              </svg>
            </button>
            {categoryOpen && (
              <div className="absolute top-[calc(100%+4px)] left-0 w-[159px] bg-white border border-[#d5d7da] rounded-[8px] z-50 overflow-hidden">
                {CATEGORY_OPTIONS.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => { setSelectedCategory(option.id); setCategoryOpen(false); }}
                    className="w-full flex items-center gap-[6px] px-[10px] py-[8px] h-[32px] cursor-pointer hover:bg-[#f8fafc] transition-colors"
                  >
                    <div className="shrink-0 size-[8px] rounded-full" style={{ backgroundColor: option.color }} />
                    <p className="font-['Helvetica_Neue:Regular',sans-serif] text-[12px] text-[#252b37] flex-1 text-left">{option.label}</p>
                    {selectedCategory === option.id && (
                      <svg className="shrink-0 size-[14px] text-[#414651]" fill="none" viewBox="0 0 16 16"><path d="M3.5 8.5L6.5 11.5L12.5 5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="content-stretch flex flex-[1_0_0] gap-[12px] items-center justify-end min-w-px relative">
            <button
              onClick={() => { if (!isSaving) { setIsActive(false); setText(""); setCategoryOpen(false); } }}
              disabled={isSaving}
              className={`bg-white content-stretch flex gap-[8px] items-center justify-center px-[16px] py-[10px] relative rounded-[6px] shrink-0 transition-colors ${isSaving ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:bg-[#f8fafc]"}`}
              data-name="button"
            >
              <div aria-hidden="true" className="absolute border border-[#e2e8f0] border-solid inset-0 pointer-events-none rounded-[6px]" />
              <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#414651] text-[16px] whitespace-nowrap">Cancelar</p>
            </button>
            <button
              onClick={handleSave}
              disabled={!text.trim() || isSaving}
              className={`bg-[#edf0ff] content-stretch flex gap-[8px] items-center justify-center px-[16px] py-[10px] relative rounded-[6px] shrink-0 transition-colors ${
                !text.trim() || isSaving ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:bg-[#dbe4ff]"
              }`}
              data-name="button"
            >
              {isSaving && (
                <svg className="animate-spin shrink-0 size-[20px] text-[#0b5ed7]" fill="none" viewBox="0 0 20 20">
                  <circle className="opacity-25" cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="2" />
                  <path className="opacity-75" fill="currentColor" d="M10 2a8 8 0 018 8h-2a6 6 0 00-6-6V2z" />
                </svg>
              )}
              <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#0b5ed7] text-[16px] whitespace-nowrap">
                {isSaving ? "Carregando" : "Salvar registro"}
              </p>
            </button>
          </div>
        </div>
        </div>
        {/* User-created records */}
        {userRecords.length > 0 && (
          <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full">
            {userRecords.map((record) => {
              const cat = CATEGORY_OPTIONS.find((c) => c.id === record.category);
              return (
                <div key={record.id} className="flex gap-[12px] items-start w-full">
                  {/* Avatar */}
                  <div className="relative shrink-0 size-[32px] mt-[2px]">
                    <svg className="absolute block inset-0 size-full" fill="none" viewBox="0 0 32 32">
                      <circle cx="16" cy="16" fill="#F2F4F7" r="15.5" stroke="#E4E7EC" />
                    </svg>
                    <p className="-translate-x-1/2 absolute font-['Helvetica_Neue:Medium',sans-serif] font-medium left-1/2 text-[#414651] text-[11px] text-center top-1/2 -translate-y-1/2">CT</p>
                  </div>
                  {/* Content */}
                  <div className="flex-1 min-w-0 flex flex-col gap-[8px]">
                    {/* Header row */}
                    <div className="flex items-center gap-[6px] w-full">
                      <div className="flex items-center gap-[6px] flex-1 min-w-0">
                        <p className="font-['Helvetica_Neue:Regular',sans-serif] text-[14px] text-[#414651] shrink-0">
                          <span className="font-['Helvetica_Neue:Medium',sans-serif] text-[#252b37]">Cristiano Teles</span>
                          {` registrou uma ${record.categoryLabel.toLowerCase()} na atividade`}
                        </p>
                        <p className="font-['Inter:Regular',sans-serif] text-[12px] text-[#717680] shrink-0">•</p>
                        <p className="font-['Helvetica_Neue:Regular',sans-serif] text-[12px] text-[#535862] shrink-0 whitespace-nowrap">{record.timestamp}</p>
                      </div>
                      <div className="flex items-center gap-[4px] shrink-0">
                        <button className="font-['Helvetica_Neue:Regular',sans-serif] text-[12px] text-[#535862] underline cursor-pointer hover:text-[#252b37] transition-colors">Editar</button>
                        <p className="font-['Inter:Regular',sans-serif] text-[12px] text-[#717680]">•</p>
                        <button className="font-['Helvetica_Neue:Regular',sans-serif] text-[12px] text-[#535862] underline cursor-pointer hover:text-[#252b37] transition-colors">Excluir</button>
                      </div>
                    </div>
                    {/* Quote card */}
                    <div className="relative bg-white rounded-[10px] w-full">
                      <div aria-hidden="true" className="absolute border border-[#e2e8f0] border-solid inset-0 pointer-events-none rounded-[10px]" />
                      <div className="flex">
                        <div className="w-[3px] shrink-0 rounded-l-[10px]" style={{ backgroundColor: cat?.color || "#0b5ed7" }} />
                        <div className="px-[16px] py-[12px] flex-1">
                          <p className="font-['Helvetica_Neue:Regular',sans-serif] text-[13px] text-[#535862] leading-[20px]">{record.text}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        <Frame22 />
      </div>
    );
  }

  return (
    <div className="content-stretch flex flex-col gap-[20px] items-start w-full">
      <div
        onClick={() => setIsActive(true)}
        className="bg-white h-[96px] min-h-[52px] relative rounded-[12px] shrink-0 w-full cursor-text"
        data-name="Text field area"
      >
        <div aria-hidden="true" className="absolute border border-[#e4e4e7] border-solid inset-0 pointer-events-none rounded-[12px]" />
        <div className="absolute top-0 left-0 right-0 flex items-start px-[16px] py-[12px]">
          <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic text-[#71717a] text-[14px] text-left">Digite sua mensagem</p>
        </div>
        <ResizeGrip />
      </div>
      {/* User-created records */}
      {userRecords.length > 0 && (
        <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full">
          {userRecords.map((record) => {
            const cat = CATEGORY_OPTIONS.find((c) => c.id === record.category);
            return (
              <div key={record.id} className="flex gap-[12px] items-start w-full">
                <div className="relative shrink-0 size-[32px] mt-[2px]">
                  <svg className="absolute block inset-0 size-full" fill="none" viewBox="0 0 32 32">
                    <circle cx="16" cy="16" fill="#F2F4F7" r="15.5" stroke="#E4E7EC" />
                  </svg>
                  <p className="-translate-x-1/2 absolute font-['Helvetica_Neue:Medium',sans-serif] font-medium left-1/2 text-[#414651] text-[11px] text-center top-1/2 -translate-y-1/2">CT</p>
                </div>
                <div className="flex-1 min-w-0 flex flex-col gap-[8px]">
                  <div className="flex items-center gap-[6px] w-full">
                    <div className="flex items-center gap-[6px] flex-1 min-w-0">
                      <p className="font-['Helvetica_Neue:Regular',sans-serif] text-[14px] text-[#414651] shrink-0">
                        <span className="font-['Helvetica_Neue:Medium',sans-serif] text-[#252b37]">Cristiano Teles</span>
                        {` registrou uma ${record.categoryLabel.toLowerCase()} na atividade`}
                      </p>
                      <p className="font-['Inter:Regular',sans-serif] text-[12px] text-[#717680] shrink-0">•</p>
                      <p className="font-['Helvetica_Neue:Regular',sans-serif] text-[12px] text-[#535862] shrink-0 whitespace-nowrap">{record.timestamp}</p>
                    </div>
                    <div className="flex items-center gap-[4px] shrink-0">
                      <button className="font-['Helvetica_Neue:Regular',sans-serif] text-[12px] text-[#535862] underline cursor-pointer hover:text-[#252b37] transition-colors">Editar</button>
                      <p className="font-['Inter:Regular',sans-serif] text-[12px] text-[#717680]">•</p>
                      <button className="font-['Helvetica_Neue:Regular',sans-serif] text-[12px] text-[#535862] underline cursor-pointer hover:text-[#252b37] transition-colors">Excluir</button>
                    </div>
                  </div>
                  <div className="relative bg-white rounded-[10px] w-full">
                    <div aria-hidden="true" className="absolute border border-[#e2e8f0] border-solid inset-0 pointer-events-none rounded-[10px]" />
                    <div className="flex">
                      <div className="w-[3px] shrink-0 rounded-l-[10px]" style={{ backgroundColor: cat?.color || "#0b5ed7" }} />
                      <div className="px-[16px] py-[12px] flex-1">
                        <p className="font-['Helvetica_Neue:Regular',sans-serif] text-[13px] text-[#535862] leading-[20px]">{record.text}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
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

function DashedSeparator() {
  return (
    <div className="flex-1 min-w-[20px] h-[4px] relative">
      <div className="absolute inset-0 border-b border-dashed border-[#f5f5f5]" />
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
      <DashedSeparator />
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
      <DashedSeparator />
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
      <DashedSeparator />
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
      <DashedSeparator />
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
    <div className="relative bg-white content-stretch flex flex-col gap-[12px] items-start px-[24px] py-[20px] rounded-[12px] w-[400px] h-fit">
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

function DrawerSection({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-[#f5f5f5]">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between px-6 py-3 cursor-pointer hover:bg-[#fafafa] transition-colors">
        <p className="font-['Helvetica_Neue:Medium',sans-serif] text-[11px] text-[#535862] uppercase tracking-wider">{title}</p>
        <svg className={`size-4 text-[#717680] transition-transform duration-200 ${open ? "" : "-rotate-90"}`} fill="none" viewBox="0 0 16 16"><path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </button>
      {open && <div className="px-6 pb-4">{children}</div>}
    </div>
  );
}

function DrawerStatusChip({ label, variant }: { label: string; variant: "green" | "amber" | "red" | "blue" | "gray" }) {
  const styles = {
    green: "bg-[#ecfdf3] text-[#17b26a] border-[#a7f3d0]",
    amber: "bg-[#fffbeb] text-[#dc6803] border-[#fbd38d]",
    red: "bg-[#fef3f2] text-[#d92d20] border-[#fecdc9]",
    blue: "bg-[#eff6ff] text-[#0b5ed7] border-[#bfdbfe]",
    gray: "bg-[#f5f5f5] text-[#535862] border-[#e9eaeb]",
  };
  return (
    <div className={`${styles[variant]} border rounded-full px-2.5 py-0.5 shrink-0`}>
      <p className="font-['Helvetica_Neue:Regular',sans-serif] text-[10px] leading-[16px] whitespace-nowrap">{label}</p>
    </div>
  );
}

function getOperationalStatus(r: Reservation, p: Participant): { label: string; variant: "green" | "amber" | "red" | "blue" | "gray" } {
  if (r.status === "Cancelled") return { label: "Cancelada", variant: "gray" };
  if (r.status === "Expired") return { label: "Expirada", variant: "gray" };
  if (r.status === "Performed") return { label: "Realizada", variant: "gray" };
  if (p.checkInStatus === "Absent") return { label: "Não compareceu", variant: "amber" };
  if (p.checkInStatus === "Done") return { label: "Check-in realizado", variant: "green" };
  if (r.status === "Confirmed") return { label: "Aguardando check-in", variant: "blue" };
  if (r.status === "AwaitingPayment") return { label: "Aguardando pagamento", variant: "amber" };
  return { label: "Agendada", variant: "blue" };
}

function getFinancialStatus(r: Reservation): { label: string; variant: "green" | "amber" | "red" | "gray" } {
  if (r.paymentStatus === "Paid") return { label: "Pago", variant: "green" };
  if (r.paymentStatus === "Partial") return { label: "Pagamento parcial", variant: "amber" };
  if (r.paymentStatus === "Refunded") return { label: "Reembolsado", variant: "gray" };
  if (r.paymentStatus === "Failed") return { label: "Falha no pagamento", variant: "red" };
  return { label: "Aguardando pagamento", variant: "amber" };
}

function getInsuranceStatusConfig(status: InsuranceStatus | undefined): { label: string; variant: "green" | "amber" | "red" | "gray" } {
  if (status === "Contracted") return { label: "Seguro contratado", variant: "green" };
  if (status === "Required") return { label: "Seguro pendente", variant: "amber" };
  if (status === "Pending") return { label: "Seguro em análise", variant: "amber" };
  if (status === "Declined") return { label: "Seguro recusado", variant: "red" };
  return { label: "Sem seguro", variant: "gray" };
}

function ParticipantDrawer({ participant, reservation, onClose, activity, isInsured, onCheckIn, onUndoCheckIn, onNoShow }: {
  participant: Participant;
  reservation: Reservation;
  onClose: () => void;
  activity?: Activity;
  isInsured?: boolean;
  onCheckIn?: (p: Participant) => void;
  onUndoCheckIn?: (p: Participant) => void;
  onNoShow?: (r: Reservation, p: Participant) => void;
}) {
  useEffect(() => { document.body.style.overflow = "hidden"; return () => { document.body.style.overflow = ""; }; }, []);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [historyOpen, setHistoryOpen] = useState(false);
  const p = participant;
  const r = reservation;
  const initials = p.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
  const phone = p.phone || "(31) 99999-9999";
  const email = p.email || (p.name.split(" ")[0].toLowerCase() + "." + (p.name.split(" ").pop() || "").toLowerCase() + "@email.com");
  const participantDoc = p.document;
  const effectiveInsurance = isInsured ? "Contracted" as InsuranceStatus : (p.insuranceStatus || r.insuranceStatus);
  const hasInsurance = effectiveInsurance === "Contracted";

  const opStatus = getOperationalStatus(r, p);
  const finStatus = getFinancialStatus(r);
  const insStatus = getInsuranceStatusConfig(effectiveInsurance);

  const basePrice = r.basePrice ?? 150;
  const insPrice = hasInsurance ? (r.insurancePrice ?? 25) : 0;
  const additionalsTotal = (r.additionalItems || []).reduce((s, i) => s + i.price, 0);
  const subtotal = basePrice + insPrice + additionalsTotal;
  const feePercent = r.serviceFeePercent ?? 10;
  const couponDiscount = r.coupon ? (r.coupon.type === "percentual" ? subtotal * r.coupon.value / 100 : r.coupon.value) : 0;
  const total = Math.round((subtotal - couponDiscount) * (1 + feePercent / 100));

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const activityName = activity?.name || "Trilha Pico do Itacolomi";

  // Determine primary + secondary actions based on state
  const isCheckedIn = p.checkInStatus === "Done";
  const isCancelled = r.status === "Cancelled";
  const isNoShow = p.checkInStatus === "Absent";
  const isPerformed = r.status === "Performed";
  const isExpired = r.status === "Expired";
  const isTerminal = isCancelled || isPerformed || isExpired;

  // Birth date mock (derived from age)
  const birthYear = new Date().getFullYear() - (p.age || 26);
  const birthDateStr = `08/01/${birthYear} - ${p.age || 26} anos`;

  // Participant reservation ID for display
  const reservationDisplayId = getParticipantReservationId(p.id);

  // Copy icon helper
  const CopyIcon = ({ field, value }: { field: string; value: string }) => (
    <button onClick={() => copyToClipboard(value, field)} className="cursor-pointer ml-1.5 hover:bg-[#fafafa] rounded p-0.5 transition-colors shrink-0">
      {copiedField === field ? (
        <svg className="size-3.5 text-[#17b26a]" fill="none" viewBox="0 0 14 14"><path d="M3 7l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
      ) : (
        <svg className="size-3.5 text-[#9ca3af]" fill="none" viewBox="0 0 14 14"><rect x="5" y="1.5" width="7.5" height="7.5" rx="1.5" stroke="currentColor" strokeWidth="1"/><rect x="1.5" y="5" width="7.5" height="7.5" rx="1.5" stroke="currentColor" strokeWidth="1"/></svg>
      )}
    </button>
  );

  // Documents list
  const documents = [
    { label: "Voucher.pdf", icon: "voucher", available: r.paymentStatus === "Paid" || r.status === "Confirmed" || r.status === "CheckedIn" },
    { label: "Comprovante_pagamento.pdf", icon: "receipt", available: r.paymentStatus === "Paid" },
    { label: "Termo de responsabilidade", icon: "doc", available: true },
  ].filter(d => d.available);

  return (
    <div className="fixed inset-0 z-50 flex justify-end py-[12px] pl-[24px]" onKeyDown={(e) => e.key === "Escape" && onClose()}>
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="bg-white border border-[#e9eaeb] border-solid flex flex-col max-h-full relative rounded-l-[16px] shadow-[-8px_0px_24px_0px_rgba(0,0,0,0.1)] w-[720px] z-10 animate-in slide-in-from-right duration-200 overflow-hidden">

        {/* ── 1. HEADER ── */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-[#e9eaeb] shrink-0">
          <p className="font-['Helvetica_Neue:Medium',sans-serif] text-[16px] text-[#181d27]">Detalhes do participante</p>
          <button onClick={onClose} className="cursor-pointer flex items-center justify-center rounded-[6px] size-[32px] hover:bg-[#f5f5f5] transition-colors shrink-0">
            <svg className="size-[18px]" fill="none" viewBox="0 0 18 18"><path d="M4 4l10 10M14 4L4 14" stroke="#717680" strokeWidth="1.5" strokeLinecap="round"/></svg>
          </button>
        </div>

        {/* ── Content ── */}
        <div className="flex-1 overflow-y-auto">

          {/* ── 2. IDENTITY SECTION ── */}
          <div className="px-6 py-5 border-b border-[#e9eaeb]">
            {/* Top row: avatar + name + tariff */}
            <div className="flex items-start gap-4">
              <div className="bg-gradient-to-br from-[#0b5ed7] to-[#3b82f6] flex items-center justify-center rounded-full size-12 shrink-0">
                <p className="font-['Helvetica_Neue:Medium',sans-serif] text-[16px] text-white">{initials}</p>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-['Helvetica_Neue:Medium',sans-serif] text-[15px] text-[#181d27]">{p.name}</p>
                  <div className="size-2 rounded-full bg-[#17b26a] shrink-0" />
                  {p.notes === "Comprador" && (
                    <p className="font-['Helvetica_Neue:Regular',sans-serif] text-[12px] text-[#17b26a]">Comprador</p>
                  )}
                </div>
                <div className="flex items-center gap-1.5 mt-1">
                  <svg className="size-3.5 text-[#9ca3af] shrink-0" fill="none" viewBox="0 0 14 14"><path d="M7 1a6 6 0 016 6c0 4-6 6-6 6S1 11 1 7a6 6 0 016-6z" stroke="currentColor" strokeWidth="1"/><circle cx="7" cy="7" r="2" stroke="currentColor" strokeWidth="1"/></svg>
                  <p className="font-['Helvetica_Neue:Light',sans-serif] text-[13px] text-[#535862]">{p.tariffType}</p>
                </div>
              </div>
            </div>

            {/* Two columns: Documento + Data de nascimento */}
            <div className="grid grid-cols-2 gap-6 mt-5">
              <div>
                <p className="font-['Helvetica_Neue:Regular',sans-serif] text-[12px] text-[#717680] mb-1">Documento</p>
                <div className="flex items-center">
                  <p className="font-['Helvetica_Neue:Regular',sans-serif] text-[14px] text-[#181d27]">{participantDoc || "123.456.789-00"}</p>
                  <CopyIcon field="doc" value={participantDoc || "123.456.789-00"} />
                </div>
              </div>
              <div>
                <p className="font-['Helvetica_Neue:Regular',sans-serif] text-[12px] text-[#717680] mb-1">Data de nascimento</p>
                <p className="font-['Helvetica_Neue:Regular',sans-serif] text-[14px] text-[#181d27]">{birthDateStr}</p>
              </div>
            </div>

            {/* Status badges */}
            <div className="mt-4">
              <p className="font-['Helvetica_Neue:Regular',sans-serif] text-[12px] text-[#717680] mb-2">Status</p>
              <div className="flex items-center gap-2 flex-wrap">
                <div className="flex items-center gap-1.5 bg-[#ecfdf3] border border-[#a7f3d0] rounded-full px-2.5 py-1">
                  <svg className="size-3.5 text-[#17b26a]" fill="none" viewBox="0 0 14 14"><path d="M3 7l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  <p className="font-['Helvetica_Neue:Regular',sans-serif] text-[12px] text-[#17b26a]">{opStatus.label === "Aguardando check-in" ? "Reserva confirmada" : opStatus.label}</p>
                </div>
                {hasInsurance && (
                  <div className="flex items-center gap-1.5 bg-[#ecfdf3] border border-[#a7f3d0] rounded-full px-2.5 py-1">
                    <svg className="size-3.5 text-[#17b26a]" fill="none" viewBox="0 0 14 14"><path d="M3 7l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    <p className="font-['Helvetica_Neue:Regular',sans-serif] text-[12px] text-[#17b26a]">Seguro contratado</p>
                  </div>
                )}
                {!hasInsurance && (
                  <DrawerStatusChip label={insStatus.label} variant={insStatus.variant} />
                )}
              </div>
            </div>
          </div>

          {/* ── 3. ANEXOS SECTION ── */}
          <div className="px-6 py-5 border-b border-[#e9eaeb]">
            <div className="flex items-center justify-between mb-4">
              <p className="font-['Helvetica_Neue:Medium',sans-serif] text-[12px] text-[#535862] uppercase tracking-[0.5px]">ANEXOS</p>
              <button className="font-['Helvetica_Neue:Regular',sans-serif] text-[13px] text-[#0b5ed7] hover:text-[#0a4fb3] cursor-pointer transition-colors">Baixar todos</button>
            </div>
            <div className="flex gap-3 overflow-x-auto">
              {documents.map((doc, i) => (
                <div key={i} className="flex flex-col gap-2 min-w-[160px] max-w-[200px] bg-[#fafafa] border border-[#e9eaeb] rounded-[8px] p-3">
                  <div className="flex items-center gap-2">
                    <svg className="size-5 text-[#717680] shrink-0" fill="none" viewBox="0 0 20 20"><path d="M5 2h6.5l4.5 4.5V16a2 2 0 01-2 2H5a2 2 0 01-2-2V4a2 2 0 012-2z" stroke="currentColor" strokeWidth="1.2"/><path d="M11.5 2v4.5H16" stroke="currentColor" strokeWidth="1.2"/></svg>
                    <p className="font-['Helvetica_Neue:Regular',sans-serif] text-[12px] text-[#414651] truncate">{doc.label}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="font-['Helvetica_Neue:Regular',sans-serif] text-[11px] text-[#0b5ed7] hover:text-[#0a4fb3] cursor-pointer transition-colors">Baixar</button>
                    <span className="text-[#d5d7da] text-[11px]">·</span>
                    <button className="font-['Helvetica_Neue:Regular',sans-serif] text-[11px] text-[#717680] hover:text-[#535862] cursor-pointer transition-colors">Reenviar</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── 4. DADOS DE SAUDE SECTION ── */}
          <div className="px-6 py-5 border-b border-[#e9eaeb]">
            <p className="font-['Helvetica_Neue:Medium',sans-serif] text-[12px] text-[#535862] uppercase tracking-[0.5px] mb-4">DADOS DE SAÚDE</p>

            {/* Emergency contact */}
            <div className="flex items-center gap-3 mb-4">
              <svg className="size-5 text-[#717680] shrink-0" fill="none" viewBox="0 0 20 20"><rect x="3" y="1" width="14" height="18" rx="2.5" stroke="currentColor" strokeWidth="1.2"/><path d="M9 15h2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
              <div>
                <p className="font-['Helvetica_Neue:Regular',sans-serif] text-[13px] text-[#414651]">Contato de emergência</p>
                <p className="font-['Helvetica_Neue:Light',sans-serif] text-[13px] text-[#535862]">
                  {p.emergencyContact ? `${p.emergencyContact.phone}` : phone}
                </p>
              </div>
            </div>

            {/* Health chips */}
            <div className="flex flex-wrap gap-2">
              {/* Allergies */}
              <div className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 border ${
                p.healthDetails?.allergies && p.healthDetails.allergies.length > 0
                  ? "bg-[#fffbeb] border-[#fbd38d]"
                  : "bg-[#fef3f2] border-[#fecdc9]"
              }`}>
                {p.healthDetails?.allergies && p.healthDetails.allergies.length > 0 ? (
                  <svg className="size-3.5 text-[#dc6803]" fill="none" viewBox="0 0 14 14"><path d="M7 3v5M7 10h.01" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>
                ) : (
                  <svg className="size-3.5 text-[#d92d20]" fill="none" viewBox="0 0 14 14"><path d="M4 4l6 6M10 4l-6 6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>
                )}
                <p className={`font-['Helvetica_Neue:Regular',sans-serif] text-[12px] ${
                  p.healthDetails?.allergies && p.healthDetails.allergies.length > 0 ? "text-[#dc6803]" : "text-[#d92d20]"
                }`}>
                  Alergias - {p.healthDetails?.allergies && p.healthDetails.allergies.length > 0 ? p.healthDetails.allergies.join(", ") : "não"}
                </p>
              </div>

              {/* Dietary restrictions */}
              <div className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 border ${
                p.dietaryRestrictions && p.dietaryRestrictions.length > 0
                  ? "bg-[#ecfdf3] border-[#a7f3d0]"
                  : "bg-[#fef3f2] border-[#fecdc9]"
              }`}>
                {p.dietaryRestrictions && p.dietaryRestrictions.length > 0 ? (
                  <svg className="size-3.5 text-[#17b26a]" fill="none" viewBox="0 0 14 14"><path d="M3 7l3 3 5-5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
                ) : (
                  <svg className="size-3.5 text-[#d92d20]" fill="none" viewBox="0 0 14 14"><path d="M4 4l6 6M10 4l-6 6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>
                )}
                <p className={`font-['Helvetica_Neue:Regular',sans-serif] text-[12px] ${
                  p.dietaryRestrictions && p.dietaryRestrictions.length > 0 ? "text-[#17b26a]" : "text-[#d92d20]"
                }`}>
                  Restrição alimentar - {p.dietaryRestrictions && p.dietaryRestrictions.length > 0 ? p.dietaryRestrictions.join(", ") : "não"}
                </p>
              </div>

              {/* Physical/mental disability */}
              <div className="flex items-center gap-1.5 rounded-full px-3 py-1.5 border bg-[#fef3f2] border-[#fecdc9]">
                <svg className="size-3.5 text-[#d92d20]" fill="none" viewBox="0 0 14 14"><path d="M4 4l6 6M10 4l-6 6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>
                <p className="font-['Helvetica_Neue:Regular',sans-serif] text-[12px] text-[#d92d20]">
                  Incapacidade física / mental - {p.accessibility ? p.accessibility.type : "não"}
                </p>
              </div>

              {/* Health plan */}
              <div className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 border ${
                p.healthDetails?.healthPlanProvider
                  ? "bg-[#ecfdf3] border-[#a7f3d0]"
                  : "bg-[#fef3f2] border-[#fecdc9]"
              }`}>
                {p.healthDetails?.healthPlanProvider ? (
                  <svg className="size-3.5 text-[#17b26a]" fill="none" viewBox="0 0 14 14"><path d="M3 7l3 3 5-5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
                ) : (
                  <svg className="size-3.5 text-[#d92d20]" fill="none" viewBox="0 0 14 14"><path d="M4 4l6 6M10 4l-6 6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>
                )}
                <p className={`font-['Helvetica_Neue:Regular',sans-serif] text-[12px] ${
                  p.healthDetails?.healthPlanProvider ? "text-[#17b26a]" : "text-[#d92d20]"
                }`}>
                  Plano de saúde - {p.healthDetails?.healthPlanProvider || "não"}
                </p>
              </div>

              {/* Continuous medication */}
              <div className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 border ${
                p.healthDetails?.medications && p.healthDetails.medications.length > 0
                  ? "bg-[#fffbeb] border-[#fbd38d]"
                  : "bg-[#fef3f2] border-[#fecdc9]"
              }`}>
                {p.healthDetails?.medications && p.healthDetails.medications.length > 0 ? (
                  <svg className="size-3.5 text-[#dc6803]" fill="none" viewBox="0 0 14 14"><path d="M7 3v5M7 10h.01" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>
                ) : (
                  <svg className="size-3.5 text-[#d92d20]" fill="none" viewBox="0 0 14 14"><path d="M4 4l6 6M10 4l-6 6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>
                )}
                <p className={`font-['Helvetica_Neue:Regular',sans-serif] text-[12px] ${
                  p.healthDetails?.medications && p.healthDetails.medications.length > 0 ? "text-[#dc6803]" : "text-[#d92d20]"
                }`}>
                  Medicação de uso contínuo - {p.healthDetails?.medications && p.healthDetails.medications.length > 0 ? p.healthDetails.medications.join(", ") : "não"}
                </p>
              </div>
            </div>
          </div>

          {/* ── 5. DADOS DE PAGAMENTO SECTION ── */}
          <div className="px-6 py-5 border-b border-[#e9eaeb]">
            <p className="font-['Helvetica_Neue:Medium',sans-serif] text-[12px] text-[#535862] uppercase tracking-[0.5px] mb-4">DADOS DE PAGAMENTO</p>

            {/* Two columns: Order ID + Payment status */}
            <div className="grid grid-cols-2 gap-6 mb-4">
              <div>
                <p className="font-['Helvetica_Neue:Regular',sans-serif] text-[12px] text-[#717680] mb-1">ID do pedido</p>
                <div className="flex items-center">
                  <p className="font-['Helvetica_Neue:Regular',sans-serif] text-[14px] text-[#181d27]">{r.orderId}</p>
                  <CopyIcon field="orderId" value={r.orderId} />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className={`size-2 rounded-full ${finStatus.variant === "green" ? "bg-[#17b26a]" : finStatus.variant === "amber" ? "bg-[#dc6803]" : finStatus.variant === "red" ? "bg-[#d92d20]" : "bg-[#717680]"}`} />
                  <p className={`font-['Helvetica_Neue:Regular',sans-serif] text-[12px] ${finStatus.variant === "green" ? "text-[#17b26a]" : finStatus.variant === "amber" ? "text-[#dc6803]" : finStatus.variant === "red" ? "text-[#d92d20]" : "text-[#717680]"}`}>
                    {finStatus.label === "Pago" ? "Pagamento confirmado" : finStatus.label}
                  </p>
                </div>
                <p className="font-['Helvetica_Neue:Regular',sans-serif] text-[12px] text-[#717680] mb-1">Forma de pagamento</p>
                <p className="font-['Helvetica_Neue:Regular',sans-serif] text-[14px] text-[#181d27]">{r.paymentMethod || "PIX"}</p>
              </div>
            </div>

            {/* Pricing breakdown */}
            <div className="space-y-2 mt-4">
              <div className="flex justify-between py-1">
                <p className="font-['Helvetica_Neue:Light',sans-serif] text-[13px] text-[#535862]">Subtotal</p>
                <p className="font-['Helvetica_Neue:Regular',sans-serif] text-[13px] text-[#181d27]">R$ {subtotal.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</p>
              </div>
              {(couponDiscount > 0 || r.coupon) && (
                <div className="flex justify-between py-1">
                  <p className="font-['Helvetica_Neue:Light',sans-serif] text-[13px] text-[#535862]">Desconto</p>
                  <p className="font-['Helvetica_Neue:Regular',sans-serif] text-[13px] text-[#17b26a]">- R$ {Math.round(couponDiscount).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</p>
                </div>
              )}
              <div className="border-t border-[#e9eaeb] pt-3 mt-2 flex justify-between">
                <p className="font-['Helvetica_Neue:Medium',sans-serif] text-[14px] text-[#181d27]">Total</p>
                <p className="font-['Helvetica_Neue:Medium',sans-serif] text-[18px] text-[#181d27]">R$ {total.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</p>
              </div>
            </div>
          </div>

          {/* ── 6. HISTORICO DE PAGAMENTO SECTION (collapsible) ── */}
          {r.history && r.history.length > 0 && (
            <div className="border-b border-[#e9eaeb]">
              <button onClick={() => setHistoryOpen(!historyOpen)} className="w-full flex items-center justify-between px-6 py-4 cursor-pointer hover:bg-[#fafafa] transition-colors">
                <p className="font-['Helvetica_Neue:Medium',sans-serif] text-[12px] text-[#535862] uppercase tracking-[0.5px]">HISTÓRICO DE PAGAMENTO</p>
                <svg className={`size-4 text-[#717680] transition-transform duration-200 ${historyOpen ? "" : "-rotate-90"}`} fill="none" viewBox="0 0 16 16"><path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
              {historyOpen && (
                <div className="px-6 pb-5">
                  <div className="relative">
                    <div className="absolute left-[5px] top-2 bottom-2 w-px bg-[#e9eaeb]" />
                    <div className="space-y-4">
                      {[...r.history].reverse().map((event) => (
                        <div key={event.id} className="flex gap-3 relative">
                          <div className="size-[11px] rounded-full bg-[#17b26a] shrink-0 mt-0.5 z-10" />
                          <div className="flex-1 min-w-0">
                            <p className="font-['Helvetica_Neue:Regular',sans-serif] text-[13px] text-[#414651]">{event.action}</p>
                            <p className="font-['Helvetica_Neue:Light',sans-serif] text-[12px] text-[#9ca3af]">
                              {new Date(event.timestamp).toLocaleDateString("pt-BR")} às {event.timestamp.slice(11, 16)}
                              {event.actor ? ` · ${event.actor}` : ""}
                            </p>
                            {event.detail && (
                              <p className="font-['Helvetica_Neue:Light',sans-serif] text-[11px] text-[#9ca3af] mt-0.5">{event.detail}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>

        {/* ── 7. FOOTER (sticky) ── */}
        <div className="px-6 py-4 border-t border-[#e9eaeb] bg-white flex items-center justify-end gap-3 shrink-0">
          {isTerminal ? (
            <p className="font-['Helvetica_Neue:Light',sans-serif] text-[13px] text-[#9ca3af] flex-1 text-center">
              {isCancelled ? "Reserva cancelada" : isPerformed ? "Atividade realizada" : "Reserva expirada"}
            </p>
          ) : isCheckedIn ? (
            <>
              <button onClick={() => onUndoCheckIn?.(p)} className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-[#e9eaeb] bg-white hover:bg-[#fafafa] transition-colors cursor-pointer">
                <span className="font-['Helvetica_Neue:Regular',sans-serif] text-[13px] text-[#414651]">Desfazer check-in</span>
              </button>
            </>
          ) : (
            <>
              <button className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-[#fecdc9] bg-white hover:bg-[#fef3f2] transition-colors cursor-pointer">
                <span className="font-['Helvetica_Neue:Regular',sans-serif] text-[13px] text-[#d92d20]">Cancelar reserva</span>
              </button>
              <button onClick={() => onNoShow?.(r, p)} className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-[#fecdc9] bg-white hover:bg-[#fef3f2] transition-colors cursor-pointer">
                <span className="font-['Helvetica_Neue:Regular',sans-serif] text-[13px] text-[#d92d20]">Não compareceu</span>
              </button>
              <button onClick={() => onCheckIn?.(p)} className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#0b5ed7] hover:bg-[#0a4fb3] transition-colors cursor-pointer shrink-0">
                <svg className="size-4" fill="none" viewBox="0 0 16 16"><path d="M4 8l3 3 5-5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                <span className="font-['Helvetica_Neue:Regular',sans-serif] text-[13px] text-white">Realizar check-in</span>
              </button>
            </>
          )}
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
  const effectiveIns = participant.insuranceStatus || insuranceStatus;
  const isNotRequired = effectiveIns === "NotRequired";
  const isDeclined = effectiveIns === "Declined";
  let insuranceVariant: "contracted" | "mandatory-missing" | "optional-missing" | "insurance-pending" | "insurance-rejected" = "optional-missing";
  let insuranceLabel = "Sem seguro (opcional)";

  if (isDeclined) {
    insuranceVariant = "insurance-rejected";
    insuranceLabel = requiresInsurance ? "Seguro recusado (obrigatório)" : "Seguro recusado";
  } else if (requiresInsurance) {
    if (insuranceStatus === "Contracted" || participant.insuranceStatus === "Contracted") {
      insuranceVariant = "contracted";
      insuranceLabel = "Seguro contratado (obrigatório)";
    } else if (insuranceStatus === "Pending" || participant.insuranceStatus === "Pending") {
      insuranceVariant = "insurance-pending";
      insuranceLabel = "Seguro pendente — aguardando confirmação";
    } else {
      insuranceVariant = "mandatory-missing";
      insuranceLabel = "Sem seguro (obrigatório)";
    }
  } else {
    if (insuranceStatus === "Contracted" || participant.insuranceStatus === "Contracted") {
      insuranceVariant = "contracted";
      insuranceLabel = "Seguro contratado (opcional)";
    } else if (insuranceStatus === "Pending" || participant.insuranceStatus === "Pending") {
      insuranceVariant = "insurance-pending";
      insuranceLabel = "Seguro pendente — aguardando confirmação";
    }
  }

  return (
    <div className="flex gap-[6px] items-center flex-wrap" style={{ padding: "10px 12px" }}>
      {/* 1. Pagamento — sempre presente */}
      <ParticipantAttributeBadge
        category="payment"
        variant={
          paymentStatus === "Paid" ? "paid"
          : paymentStatus === "Partial" ? "partial-payment"
          : paymentStatus === "Refunded" ? "refunded"
          : paymentStatus === "Failed" ? "alert"
          : "awaiting-payment"
        }
        tooltipLabel={
          paymentStatus === "Paid" ? "Pago — Pagamento confirmado"
          : paymentStatus === "Partial" ? "Pagamento parcial — Saldo em aberto"
          : paymentStatus === "Refunded" ? "Reembolsado — Valor devolvido"
          : paymentStatus === "Failed" ? "Falha no pagamento — Cartão recusado"
          : "Aguardando pagamento — Pendente de confirmação"
        }
        showLabel
      />

      {/* 2. Seguro — oculto quando NotRequired */}
      {!isNotRequired && (
        <ParticipantAttributeBadge
          category="insurance"
          variant={insuranceVariant}
          tooltipLabel={insuranceLabel}
          showLabel
        />
      )}

      {/* 3. Uso de imagem — sempre presente */}
      <ParticipantAttributeBadge
        category="image-term"
        variant={imageStatus === "Authorized" ? "authorized" : imageStatus === "Refused" ? "refused" : "pending"}
        tooltipLabel={
          imageStatus === "Authorized" ? "Uso de Imagem — Autorizado"
          : imageStatus === "Refused" ? "Uso de Imagem — Recusado"
          : "Uso de Imagem — Pendente de autorização"
        }
        showLabel
      />

    </div>
  );
}

function ParticipantTariffCell({ tariffType }: { tariffType: string }) {
  return (
    <div className="flex items-center shrink-0 min-w-0" style={{ width: "240px", padding: "8px 12px" }}>
      <div className="flex flex-col gap-[1px] min-w-0 w-full">
        <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic text-[13px] text-[#252b37] truncate w-full">{tariffType}</p>
        <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic text-[12px] text-[#a1a1aa] whitespace-nowrap">Tipo de tarifa</p>
      </div>
    </div>
  );
}

function getParticipantReservationStatusText(
  reservation: Reservation,
  participant: Participant,
): { title: string; subtitle: string } {
  const isCancelled = reservation.status === "Cancelled";
  const isNoShow = reservation.status === "NoShow";
  const isExpired = reservation.status === "Expired";
  const isPerformed = reservation.status === "Performed";
  const isIndividualAbsent = !isCancelled && !isNoShow && participant.checkInStatus === "Absent";
  const isDone = participant.checkInStatus === "Done";

  if (isCancelled) return { title: "Reserva cancelada", subtitle: "Status da reserva" };
  if (isExpired) return { title: "Reserva expirada", subtitle: "Status da reserva" };
  if (isNoShow) return { title: "Não compareceu", subtitle: "Status da reserva" };
  if (isIndividualAbsent) return { title: "Cancelado individualmente", subtitle: "Status da reserva" };
  if (isPerformed) return { title: "Atividade realizada", subtitle: "Status da reserva" };
  if (isDone) return { title: "Check-in realizado", subtitle: "Status da reserva" };
  if (reservation.status === "AwaitingPayment") return { title: "Aguardando pagamento", subtitle: "Status da reserva" };
  if (reservation.status === "Draft") return { title: "Pré-reservada", subtitle: "Status da reserva" };

  return { title: "Reserva confirmada", subtitle: "Status da reserva" };
}

function ParticipantReservationStatusCell({ reservation, participant }: { reservation: Reservation; participant: Participant }) {
  const status = getParticipantReservationStatusText(reservation, participant);

  return (
    <div className="flex items-center shrink-0 min-w-0" style={{ width: "180px", padding: "8px 12px" }}>
      <div className="flex flex-col gap-[1px] min-w-0 w-full">
        <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic text-[13px] text-[#252b37] truncate w-full">{status.title}</p>
        <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic text-[12px] text-[#a1a1aa] whitespace-nowrap">{status.subtitle}</p>
      </div>
    </div>
  );
}

// ─── Payment Drawer ─────────────────────────────────────────────────────────

function PaymentDrawer({ reservation, onClose }: { reservation: Reservation; onClose: () => void }) {
  useEffect(() => { document.body.style.overflow = "hidden"; return () => { document.body.style.overflow = ""; }; }, []);
  const isGroup = reservation.type === "group";
  const pCount = reservation.participants.length;
  const adults = reservation.participants.filter((p) => p.tariffType === TARIFF_VARIANTS[0]).length;
  const children = reservation.participants.filter((p) => p.tariffType === TARIFF_VARIANTS[1]).length;
  const courtesy = reservation.participants.filter((p) => p.tariffType === TARIFF_VARIANTS[2]).length;
  const schoolTrip = reservation.participants.filter((p) => p.tariffType === TARIFF_VARIANTS[3]).length;
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
                  <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic text-[12px] text-[#717680]">Adulto meia</p>
                  <p className="font-['Helvetica_Neue:Medium',sans-serif] leading-[normal] not-italic text-[16px] text-[#181d27]">{adults}</p>
                </div>
              </div>
              <div className="flex gap-[8px] items-center">
                <svg className="shrink-0 size-[18px]" fill="none" viewBox="0 0 18 18"><circle cx="9" cy="9" r="7" stroke="#535862" strokeWidth="1.2"/><path d="M6 8c0 0 1.5 2 3 2s3-2 3-2" stroke="#535862" strokeWidth="1.2" strokeLinecap="round"/></svg>
                <div className="flex flex-col">
                  <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic text-[12px] text-[#717680]">Criança</p>
                  <p className="font-['Helvetica_Neue:Medium',sans-serif] leading-[normal] not-italic text-[16px] text-[#181d27]">{children}</p>
                </div>
              </div>
              <div className="flex gap-[8px] items-center">
                <svg className="shrink-0 size-[18px]" fill="none" viewBox="0 0 18 18"><rect x="2" y="4" width="14" height="10" rx="3" stroke="#535862" strokeWidth="1.2"/><path d="M6 9h6" stroke="#535862" strokeWidth="1.2" strokeLinecap="round"/></svg>
                <div className="flex flex-col">
                  <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic text-[12px] text-[#717680]">Cortesia</p>
                  <p className="font-['Helvetica_Neue:Medium',sans-serif] leading-[normal] not-italic text-[16px] text-[#181d27]">{courtesy}</p>
                </div>
              </div>
              <div className="flex gap-[8px] items-center">
                <svg className="shrink-0 size-[18px]" fill="none" viewBox="0 0 18 18"><path d="M3 5.5h12M4 5.5V14h10V5.5M6.5 5.5V4a1.5 1.5 0 011.5-1.5h2A1.5 1.5 0 0111.5 4v1.5" stroke="#535862" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                <div className="flex flex-col">
                  <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic text-[12px] text-[#717680]">Excursão</p>
                  <p className="font-['Helvetica_Neue:Medium',sans-serif] leading-[normal] not-italic text-[16px] text-[#181d27]">{schoolTrip}</p>
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
        className={`group flex items-center justify-center rounded-[8px] shrink-0 transition-all duration-200 ease-out ${
          disabled
            ? "cursor-not-allowed bg-[#f5f5f5] border border-[#e5e5e5]"
            : isDone
              ? "cursor-pointer bg-emerald-50 border border-emerald-200 hover:bg-emerald-100"
              : "cursor-pointer bg-[#eff6ff] border border-[#bfdbfe] hover:bg-[#dbeafe] hover:border-[#93c5fd]"
        }`}
        style={{ padding: "6px 14px" }}
      >
        {isDone && !disabled ? (
          <>
            <svg className="shrink-0 size-[14px] mr-[6px]" fill="none" viewBox="0 0 16 16">
              <path d="M4.5 8l2.5 2.5 4.5-5" stroke="#059669" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="font-['Helvetica_Neue:Regular',sans-serif] text-[12px] text-emerald-700">Feito</span>
          </>
        ) : (
          <>
            <svg className="shrink-0 size-[14px] mr-[6px]" fill="none" viewBox="0 0 16 16">
              <path d="M4.5 8l2.5 2.5 4.5-5" stroke={disabled ? "#a1a1aa" : "#0b5ed7"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className={`font-['Helvetica_Neue:Regular',sans-serif] text-[12px] ${disabled ? "text-zinc-400" : "text-[#0b5ed7]"}`}>Check-in</span>
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
    <div className="fixed inset-0 z-50 flex justify-end pl-[24px] pt-0 pr-0 pb-0" onKeyDown={(e) => e.key === "Escape" && onClose()}>
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="bg-white border border-[#e9eaeb] border-solid flex flex-col max-h-full relative rounded-[16px] rounded-r-none shadow-[-8px_0px_24px_0px_rgba(0,0,0,0.1)] w-[720px] z-10">
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
                {TARIFF_VARIANTS.map((o) => (
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
  const iconConfirm = <svg className="size-[20px] shrink-0" fill="none" viewBox="0 0 48 48"><path d="M24 40C24 40 26 40 28 44C28 44 34.3529 34 40 32" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/><path d="M40 26.0096V21.3212C40 19.6855 40 18.8677 39.6955 18.1323C39.391 17.3969 38.813 16.8185 37.6569 15.6619L28.1838 6.18472C27.186 5.18651 26.6871 4.68741 26.069 4.39166C25.9405 4.33015 25.8087 4.27556 25.6744 4.22812C25.0283 4 24.3228 4 22.9117 4C16.4216 4 13.1766 4 10.9787 5.77292C10.5346 6.13108 10.1302 6.53573 9.77215 6.97995C8 9.17886 8 12.4253 8 18.9182V28.0104C8 35.5562 8 39.3291 10.3431 41.6732C12.2293 43.5602 15.0409 43.9282 20 44M26 5.00043V6.00087C26 11.6602 26 14.4898 27.7574 16.248C29.5147 18.0061 32.3431 18.0061 38 18.0061H39" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>;
  const iconUndoConfirm = <svg className="size-[20px] shrink-0" fill="none" viewBox="0 0 48 48"><path d="M40 28.0104V21.3212C40 19.6855 40 18.8677 39.6955 18.1323C39.391 17.3969 38.813 16.8185 37.6569 15.6619L28.1838 6.18472C27.186 5.18651 26.6871 4.68741 26.069 4.39166C25.9405 4.33015 25.8087 4.27556 25.6744 4.22812C25.0283 4 24.3228 4 22.9117 4C16.4216 4 13.1766 4 10.9787 5.77292C10.5346 6.13108 10.1302 6.53573 9.77215 6.97995C8 9.17886 8 12.4253 8 18.9182V28.0104C8 35.5562 8 39.3291 10.3431 41.6732C12.2293 43.5602 15.0409 43.9282 20 44M26 5.00043V6.00087C26 11.6602 26 14.4898 27.7574 16.248C29.5147 18.0061 32.3431 18.0061 38 18.0061H39" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/><path d="M22 32L24 36C24.4852 32.6077 27.4735 30 31 30C33.3787 30 35.4803 31.1865 36.7453 33M40 42L38 38C37.5148 41.3923 34.5264 44 31 44C28.6212 44 26.5196 42.8135 25.2547 41" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>;
  const iconPerformed = <svg className="size-[20px] shrink-0" fill="none" viewBox="0 0 48 48"><path d="M6 26.6667C6 26.6667 9 28 13 34C13 34 13.5697 33.0384 14.6427 31.5053M34 12C29.4169 14.2915 24.6238 19.1036 20.7758 23.6446" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/><path d="M16 26.6667C16 26.6667 19 28 23 34C23 34 34 17 44 12" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>;
  const iconUndoPerformed = <svg className="size-[20px] shrink-0" fill="none" viewBox="0 0 48 48"><path d="M36 12L12.0016 35.9983M35.9984 36L12 12.0017" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>;
  const iconPayment = <svg className="size-[20px] shrink-0" fill="none" viewBox="0 0 48 48"><path d="M4.03516 28C8.4343 28 12.0005 31.5662 12.0005 35.9654" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/><path d="M12.0005 8.03125C12.0005 12.4304 8.4343 15.9966 4.03516 15.9966" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/><path d="M36 8.03125C36 12.3919 39.5381 15.9341 43.8847 15.9958" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/><path d="M44 22V20C44 14.3431 44 11.5147 42.2426 9.75736C40.4853 8 37.6569 8 32 8H16C10.3431 8 7.51472 8 5.75736 9.75736C4 11.5147 4 14.3431 4 20V24C4 29.6569 4 32.4853 5.75736 34.2426C7.51472 36 10.3431 36 16 36H22" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/><path d="M30 22C30 25.3137 27.3137 28 24 28C20.6863 28 18 25.3137 18 22C18 18.6863 20.6863 16 24 16C27.3137 16 30 18.6863 30 22Z" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/><path d="M28 36C28 36 30 36 32 40C32 40 38.3529 30 44 28" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>;
  const iconUndoPayment = <svg className="size-[20px] shrink-0" fill="none" viewBox="0 0 48 48"><path d="M4.03516 28C8.4343 28 12.0005 31.5662 12.0005 35.9654" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/><path d="M12.0005 8.03125C12.0005 12.4304 8.4343 15.9966 4.03516 15.9966" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/><path d="M36 8.03125C36 12.3919 39.5381 15.9341 43.8847 15.9958" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/><path d="M44 25V20C44 14.3431 44 11.5147 42.2426 9.75736C40.4853 8 37.6569 8 32 8H16C10.3431 8 7.51472 8 5.75736 9.75736C4 11.5147 4 14.3431 4 20V24C4 29.6569 4 32.4853 5.75736 34.2426C7.51472 36 10.3431 36 16 36H30" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/><path d="M30 22C30 25.3137 27.3137 28 24 28C20.6863 28 18 25.3137 18 22C18 18.6863 20.6863 16 24 16C27.3137 16 30 18.6863 30 22Z" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/><path d="M44 31L39.5 35.5M39.5 35.5L35 40M39.5 35.5L35 31M39.5 35.5L44 40" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>;
  const iconCal = <svg className="size-[20px] shrink-0" fill="none" viewBox="0 0 48 48"><path d="M32 4V12M16 4V12" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/><path d="M42 30V24C42 16.4575 42 12.6863 39.6569 10.3431C37.3137 8 33.5425 8 26 8H22C14.4575 8 10.6863 8 8.34315 10.3431C6 12.6863 6 16.4575 6 24V28C6 35.5425 6 39.3137 8.34315 41.6569C10.6863 44 14.4575 44 22 44H24" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/><path d="M6 20H42" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/><path d="M37 44C38.0114 43.0169 42 40.4005 42 39C42 37.5995 38.0114 34.9831 37 34M41 39H28" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>;
  const iconUndoCal = <svg className="size-[20px] shrink-0" fill="none" viewBox="0 0 48 48"><path d="M32 4V12M16 4V12" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/><path d="M42 32V24C42 16.4575 42 12.6863 39.6569 10.3431C37.3137 8 33.5425 8 26 8H22C14.4575 8 10.6863 8 8.34315 10.3431C6 12.6863 6 16.4575 6 24V28C6 35.5425 6 39.3137 8.34315 41.6569C10.6863 44 14.4575 44 22 44H24" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/><path d="M6 20H42" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/><path d="M42 39H29M33 44C31.9886 43.0169 28 40.4005 28 39C28 37.5995 31.9886 34.9831 33 34" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>;
  const iconFileSecurity = <svg className="size-[20px] shrink-0" fill="none" viewBox="0 0 48 48"><path d="M40 24V21.3137C40 19.6787 40 18.8612 39.6955 18.1261C39.391 17.391 38.813 16.813 37.6569 15.6569L28.1838 6.18377C27.186 5.18599 26.6871 4.68711 26.069 4.39149C25.9405 4.33001 25.8087 4.27544 25.6744 4.22802C25.0283 4 24.3228 4 22.9117 4C16.4216 4 13.1766 4 10.9787 5.77215C10.5346 6.13016 10.1302 6.53463 9.77215 6.97866C8 9.17661 8 12.4216 8 18.9117V28C8 35.5425 8 39.3137 10.3431 41.6569C12.6863 44 16.4575 44 24 44M26 5V6C26 11.6569 26 14.4853 27.7574 16.2426C29.5147 18 32.3431 18 38 18H39" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/><path d="M40 35.2448V31.3025C40 30.6825 39.5446 30.1679 38.954 30.0623C36.5739 29.6368 34.598 28.6901 33.6341 28.1651C33.2393 27.9502 32.7607 27.9502 32.3659 28.1651C31.402 28.6901 29.4261 29.6368 27.046 30.0623C26.4554 30.1679 26 30.6825 26 31.3025V35.2448C26 40.3875 31.0848 43.1926 32.5869 43.9091C32.852 44.0355 33.148 44.0355 33.4131 43.9091C34.9152 43.1926 40 40.3875 40 35.2448Z" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/></svg>;
  const iconFileRemove = <svg className="size-[20px] shrink-0" fill="none" viewBox="0 0 48 48"><path d="M8 23.9899L8 29.0808C8 35.5741 8 38.8208 9.77215 41.0198C10.1302 41.4641 10.5346 41.8688 10.9787 42.227C13.1766 44 16.4216 44 22.9117 44C24.3228 44 25.0283 44 25.6744 43.7719C25.8087 43.7244 25.9405 43.6698 26.069 43.6083C26.6871 43.3125 27.186 42.8134 28.1838 41.8151L37.6569 32.3373C38.813 31.1806 39.391 30.6022 39.6955 29.8667C40 29.1313 40 28.3134 40 26.6775V19.9879C40 12.4416 40 8.66846 37.6569 6.32413C35.7941 4.46044 33.0288 4.07834 28.1838 4M26 42.9995V41.999C26 36.3393 26 33.5094 27.7574 31.7512C29.5147 29.9929 32.3431 29.9929 38 29.9929H39" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/><path d="M22 18L8 4M22 4L8 18" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>;
  const iconPerson = <svg className="size-[20px] shrink-0" fill="none" viewBox="0 0 48 48"><path d="M28 17C28 11.4772 23.5228 7 18 7C12.4772 7 8 11.4772 8 17C8 22.5228 12.4772 27 18 27C23.5228 27 28 22.5228 28 17Z" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/><path d="M40.6747 27.6767L44 31M42 24C42 21.2386 39.7614 19 37 19C34.2386 19 32 21.2386 32 24C32 26.7614 34.2386 29 37 29C39.7614 29 42 26.7614 42 24Z" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/><path d="M32 41C32 33.268 25.732 27 18 27C10.268 27 4 33.268 4 41" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>;
  const iconCalRemove = <svg className="size-[20px] shrink-0" fill="none" viewBox="0 0 48 48"><path d="M32 4V12M16 4V12" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/><path d="M42 26V24C42 16.4575 42 12.6863 39.6569 10.3431C37.3137 8 33.5425 8 26 8H22C14.4575 8 10.6863 8 8.34315 10.3431C6 12.6863 6 16.4575 6 24V28C6 35.5425 6 39.3137 8.34315 41.6569C10.6863 44 14.4575 44 22 44H24" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/><path d="M6 20H42" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/><path d="M42 32L36 38M36 38L30 44M36 38L42 44M36 38L30 32" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>;
  const iconCalSync = <svg className="size-[20px] shrink-0" fill="none" viewBox="0 0 48 48"><path d="M32 4V12M16 4V12M24 44H22C14.458 44 10.686 44 8.344 41.656C6.002 39.312 6 35.542 6 28V24C6 16.458 6 12.686 8.344 10.344C10.688 8.002 14.458 8 22 8H26C33.542 8 37.314 8 39.656 10.344C41.784 12.47 41.98 15.772 42 22M6 20H42" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/><path d="M28.77 31.572C29.3949 30.2528 30.3688 29.1297 31.5863 28.3243C32.8038 27.519 34.2184 27.0621 35.677 27.0032C37.1355 26.9443 38.5824 27.2856 39.8609 27.9901C41.1394 28.6946 42.2007 29.7355 42.93 31M28 26V28C28 29.886 28 30.828 28.586 31.414C28.6441 31.4703 28.7055 31.5231 28.77 31.572C29.366 32 30.3 32 32 32H34M43.23 38.43C42.6049 39.7491 41.6308 40.8721 40.4132 41.6772C39.1956 42.4824 37.7809 42.939 36.3224 42.9977C34.8639 43.0564 33.417 42.715 32.1387 42.0103C30.8603 41.3056 29.7991 40.2646 29.07 39M44 44V42C44 40.114 44 39.172 43.414 38.586C43.3559 38.5303 43.2944 38.4783 43.23 38.43C42.634 38 41.7 38 40 38H38" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>;
  const iconUserRemove = <svg className="size-[20px] shrink-0" fill="none" viewBox="0 0 48 48"><path d="M28 17C28 11.4772 23.5228 7 18 7C12.4772 7 8 11.4772 8 17C8 22.5228 12.4772 27 18 27C23.5228 27 28 22.5228 28 17Z" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/><path d="M32 41C32 33.268 25.732 27 18 27C10.268 27 4 33.268 4 41" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/><path d="M44 18L39 23M39 23L34 28M39 23L44 28M39 23L34 18" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>;
  const iconAccountRecovery = <svg className="size-[20px] shrink-0" fill="none" viewBox="0 0 48 48"><path d="M7 40.6877H12.9692V35M35.0308 13V7.31233L41 7M30 4.91692C23.1215 2.76058 15.3082 4.40756 9.85786 9.85786C2.04738 17.6684 2.04738 30.3316 9.85787 38.1421C10.536 38.8203 11.2508 39.4396 11.9958 40M18 43.0831C24.8785 45.2394 32.6918 43.5924 38.1421 38.1421C45.9526 30.3316 45.9526 17.6683 38.1421 9.85786C37.464 9.17969 36.7492 8.5604 36.0042 8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/><path d="M24 23C26.7614 23 29 20.7614 29 18C29 15.2386 26.7614 13 24 13C21.2386 13 19 15.2386 19 18C19 20.7614 21.2386 23 24 23ZM24 23C19.5817 23 16 26.5817 16 31M24 23C28.4183 23 32 26.5817 32 31" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>;

  // Slot 1 — Confirmar ↔ Desfazer confirmação
  const slot1 = s === "Confirmed" || s === "CheckedIn" || s === "Performed"
    ? { id: "undo-confirm", label: "Desfazer confirmação de reserva", icon: iconUndoConfirm, enabled: s === "Confirmed" && canTo("AwaitingPayment"), tooltip: s === "CheckedIn" ? "Desfaça o check-in antes de desfazer a confirmação" : s === "Performed" ? "A atividade já foi realizada" : null }
    : { id: "confirm", label: "Confirmar reserva", icon: iconConfirm, enabled: canTo("Confirmed"), tooltip: s === "Draft" ? "Carrinho ainda não finalizado" : inactive ? `Reserva ${s === "Cancelled" ? "cancelada" : s === "NoShow" ? "marcada como não compareceu" : "expirada"} não pode ser confirmada` : null };

  // Slot 2 — Definir realizado ↔ Desfazer
  const slot2 = s === "Performed"
    ? { id: "undo-performed", label: "Desfazer definição de realização", icon: iconUndoPerformed, enabled: canTo("Confirmed"), tooltip: null }
    : { id: "mark-performed", label: "Definir como realizado", icon: iconPerformed, enabled: s === "CheckedIn" && canTo("Performed") && (insuranceStatus === "Contracted" || insuranceStatus === "NotRequired"), tooltip: s === "CheckedIn" && insuranceStatus !== "Contracted" && insuranceStatus !== "NotRequired" ? "É necessário contratar o seguro do participante antes de realizar essa ação" : s !== "CheckedIn" ? "É necessário realizar o check-in antes de definir como realizado" : null };

  // Slot 3 — Registrar pagamento ↔ Desfazer
  const slot3 = (s === "Confirmed" || s === "CheckedIn" || s === "Performed")
    ? { id: "undo-payment", label: "Desfazer registro de pagamento", icon: iconUndoPayment, enabled: canTo("AwaitingPayment"), tooltip: null }
    : { id: "register-payment", label: "Registrar pagamento", icon: iconPayment, enabled: s === "AwaitingPayment" && canTo("Confirmed"), tooltip: s === "Draft" ? "Finalize o carrinho antes de registrar pagamento" : inactive ? "Reserva inativa não permite registro de pagamento" : null };

  // Slot 4 — Remarcar ↔ Desfazer remarcação
  const slot4: MenuSlot = { id: "reschedule", label: "Remarcar reserva", icon: iconCal, enabled: (s === "AwaitingPayment" || s === "Confirmed") && !inactive, tooltip: s === "CheckedIn" ? "Desfaça o check-in antes de remarcar" : (s === "Performed" || inactive) ? "Reserva não pode ser remarcada no estado atual" : null };

  // Slot 5 — Contratar seguro ↔ Desfazer
  const slot5 = insuranceStatus === "Contracted"
    ? { id: "undo-insurance", label: "Desfazer contratação de seguro", icon: iconFileRemove, separator: true, enabled: !inactive && s !== "Draft" && s !== "Performed", tooltip: inactive || s === "Draft" || s === "Performed" ? "Reserva inativa não permite operação de seguro" : null }
    : { id: "add-insurance", label: "Contratar seguro", icon: iconFileSecurity, separator: true, enabled: !inactive && s !== "Draft" && s !== "Performed", tooltip: inactive || s === "Draft" || s === "Performed" ? "Reserva inativa não permite operação de seguro" : null };

  // Slot 6 — Dados do participante (always enabled)
  const slot6: MenuSlot = { id: "participant-data", label: "Dados do participante", icon: iconPerson, enabled: true, tooltip: null };

  // Slot 7 — Não compareceu ↔ Desfazer
  const slot7 = s === "NoShow"
    ? { id: "undo-noshow", label: "Desfazer não comparecimento", icon: iconCalSync, separator: true, destructive: true, enabled: true, tooltip: null }
    : { id: "no-show", label: "Não compareceu", icon: iconCalRemove, separator: true, destructive: true, enabled: s === "Confirmed", tooltip: s === "CheckedIn" || s === "Performed" ? "Participante já realizou check-in" : s !== "Confirmed" ? "Não aplicável ao estado atual" : null };

  // Slot 8 — Cancelar ↔ Desfazer cancelamento
  const slot8 = s === "Cancelled"
    ? { id: "undo-cancel", label: "Desfazer cancelamento de reserva", icon: iconAccountRecovery, destructive: true, enabled: true, tooltip: null }
    : { id: "cancel", label: "Cancelar reserva", icon: iconUserRemove, destructive: true, enabled: s === "AwaitingPayment" || s === "Confirmed" || s === "CheckedIn", tooltip: s === "Performed" ? "Atividade já realizada não pode ser cancelada" : s === "NoShow" ? "Reserva marcada como não compareceu" : (s === "Expired" || s === "Draft") ? "Reserva inativa" : null };

  return [slot1, slot2, slot3, slot4, slot5, slot6, slot7, slot8];
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
        className="bg-white border border-[#e4e4e7] cursor-pointer flex items-center justify-center rounded-[8px] shrink-0 size-[32px] hover:bg-[#f8fafc] transition-colors"
      >
        <svg className="size-[14px]" fill="none" viewBox="0 0 16 16"><circle cx="8" cy="3.5" r="1" fill="#717680"/><circle cx="8" cy="8" r="1" fill="#717680"/><circle cx="8" cy="12.5" r="1" fill="#717680"/></svg>
      </button>
      {open && (
        <>
          <div className="absolute bg-white border border-[#f5f5f5] border-solid mt-[4px] right-0 rounded-[8px] shadow-[0px_4px_16px_0px_rgba(0,0,0,0.12)] w-max min-w-[265px] z-40 p-[6px] flex flex-col gap-[4px]">
            {slots.map((slot) => (
              <div key={slot.id}>
                {slot.separator && <div className="bg-[#f5f5f5] h-px w-full" />}
                <div className="relative"
                  onMouseEnter={() => { if (!slot.enabled && slot.tooltip) setHoveredDisabled(slot.id); }}
                  onMouseLeave={() => setHoveredDisabled(null)}
                >
                  <button
                    onClick={() => {
                      if (!slot.enabled) return;
                      onAction(slot.id, reservation, participant);
                    }}
                    className={`flex gap-[12px] items-center h-[40px] px-[12px] rounded-[6px] transition-colors w-full ${
                      !slot.enabled ? "opacity-40 cursor-not-allowed" : slot.destructive ? "cursor-pointer hover:bg-[#fef3f2]" : "cursor-pointer hover:bg-[#f8fafc]"
                    } ${slot.destructive ? "text-[#d92d20]" : "text-[#414651]"}`}
                    aria-disabled={!slot.enabled || undefined}
                  >
                    {slot.icon}
                    <p className={`font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic text-[14px] whitespace-nowrap ${slot.destructive ? "text-[#d92d20]" : "text-[#414651]"}`}>{slot.label}</p>
                    {slot.hasExtIcon && (
                      <svg className="ml-auto size-[16px] text-[#717680]" fill="none" viewBox="0 0 24 24"><path d="M7 17L17 7M17 7H9M17 7v8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
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

function ParticipantesTab({ onBackToActivities, activity, initialOverlay }: { onBackToActivities?: () => void; activity: Activity; initialOverlay?: string }) {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<ParticipantesFilter>("todos");
  const [showFilters, setShowFilters] = useState(false);
  const [showSort, setShowSort] = useState(false);
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [reservations, dispatch] = useReducer(reservationsReducer, mockReservations);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(() => new Set(mockReservations.filter((r) => r.type === "group").map((r) => r.id)));
  const [animatingGroups, setAnimatingGroups] = useState<Set<string>>(new Set());
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [showHeaderMoreActions, setShowHeaderMoreActions] = useState(false);
  const [showMoreActions, setShowMoreActions] = useState(false);
  const [showMoreActionsStickyBar, setShowMoreActionsStickyBar] = useState(false);
  const [showBulkCheckInTip, setShowBulkCheckInTip] = useState(false);
  const [showBulkCheckInTipStickyBar, setShowBulkCheckInTipStickyBar] = useState(false);
  const [showQrScanner, setShowQrScanner] = useState(false);
  const [qrScenario, setQrScenario] = useState(0);
  const [isQrDrawerClosing, setIsQrDrawerClosing] = useState(false);
  const [isConfirmingCheckIn, setIsConfirmingCheckIn] = useState(false);
  const [isQrInstructionEntering, setIsQrInstructionEntering] = useState(false);
  const qrDrawerCloseTimeoutRef = useRef<number | null>(null);
  const qrInstructionEnterTimeoutRef = useRef<number | null>(null);
  const QR_SCENARIOS = ["camera-blocked", "scanning", "valid-reservation", "checkin-success", "reservation-cancelled", "qr-not-recognized", "wrong-date"] as const;

  // Preview-mode overlay injection. Map slug → state setter on mount only.
  useEffect(() => {
    if (!initialOverlay) return;
    const firstRes = mockReservations.find((r) => r.participants?.length > 0) || mockReservations[0];
    const firstPart = firstRes?.participants?.[0];
    if (initialOverlay === "filters") setShowFilters(true);
    else if (initialOverlay === "sort") setShowSort(true);
    else if (initialOverlay === "team") setShowTeamModal(true);
    else if (initialOverlay === "more-actions") setShowMoreActions(true);
    else if (initialOverlay === "bulk-tip") setShowBulkCheckInTip(true);
    else if (initialOverlay === "toast-success") {
      setToast({ message: "Check-in realizado com sucesso", type: "success" });
    }
    else if (initialOverlay === "toast-error") {
      setToast({ message: "Falha ao realizar check-in. Tente novamente.", type: "error" });
    }
    else if (initialOverlay === "cancel" && firstRes && firstPart) {
      setCancelModal({ r: firstRes, p: firstPart });
    }
    else if (initialOverlay === "no-show" && firstRes && firstPart) {
      setNoShowModal({ r: firstRes, p: firstPart });
    }
    else if (initialOverlay === "checkin-single" && firstPart) {
      setCheckInModal([firstPart]);
    }
    else if (initialOverlay === "checkin-bulk") {
      const bulk = mockReservations
        .flatMap((r) => r.participants ?? [])
        .slice(0, 3);
      if (bulk.length > 0) setCheckInModal(bulk);
    }
    else if (initialOverlay === "payment-drawer" && firstRes) {
      setPaymentDrawerRes(firstRes);
    }
    else if (initialOverlay === "details-drawer" && firstRes && firstPart) {
      setDrawerData({ r: firstRes, p: firstPart });
    }
    else if (initialOverlay.startsWith("qr-")) {
      const scenario = initialOverlay.replace("qr-", "");
      const idx = QR_SCENARIOS.findIndex((s) => s === scenario);
      setShowQrScanner(true);
      if (idx >= 0) setQrScenario(idx);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!showQrScanner) setSearchBarHidden(false);
  }, [showQrScanner]);

  useEffect(() => {
    return () => {
      if (qrDrawerCloseTimeoutRef.current) window.clearTimeout(qrDrawerCloseTimeoutRef.current);
      if (qrInstructionEnterTimeoutRef.current) window.clearTimeout(qrInstructionEnterTimeoutRef.current);
    };
  }, []);

  function handleQrDrawerCancel() {
    if (isQrDrawerClosing) return;
    setIsQrDrawerClosing(true);
    if (qrDrawerCloseTimeoutRef.current) window.clearTimeout(qrDrawerCloseTimeoutRef.current);
    qrDrawerCloseTimeoutRef.current = window.setTimeout(() => {
      setQrScenario(1);
      setIsQrDrawerClosing(false);
      setIsQrInstructionEntering(true);
      qrDrawerCloseTimeoutRef.current = null;
      qrInstructionEnterTimeoutRef.current = window.setTimeout(() => {
        setIsQrInstructionEntering(false);
        qrInstructionEnterTimeoutRef.current = null;
      }, 30);
    }, 520);
  }

  // Sticky bulk bar: track when original bar scrolls out of view
  const bulkBarRef = useRef<HTMLDivElement>(null);
  const headerMoreActionsRef = useRef<HTMLDivElement>(null);
  const [bulkBarHidden, setBulkBarHidden] = useState(false);
  useEffect(() => {
    if (!showHeaderMoreActions) return;
    const handleMouseDown = (e: MouseEvent) => {
      if (headerMoreActionsRef.current && !headerMoreActionsRef.current.contains(e.target as Node)) {
        setShowHeaderMoreActions(false);
      }
    };
    document.addEventListener("mousedown", handleMouseDown);
    return () => document.removeEventListener("mousedown", handleMouseDown);
  }, [showHeaderMoreActions]);
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
  const stickyTopBarRef = useRef<HTMLDivElement>(null);
  const [searchBarHidden, setSearchBarHidden] = useState(false);
  const [stickyTopBarHeight, setStickyTopBarHeight] = useState(0);
  useEffect(() => {
    if (!searchBarHidden || !stickyTopBarRef.current) { setStickyTopBarHeight(0); return; }
    setStickyTopBarHeight(stickyTopBarRef.current.offsetHeight);
  }, [searchBarHidden]);
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
    setAnimatingGroups((prev) => new Set(prev).add(id));
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
    window.setTimeout(() => {
      setAnimatingGroups((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }, 320);
  };

  // Count all participants
  const totalCount = useMemo(() => reservations.reduce((s, r) => s + r.participants.length, 0), [reservations]);

  // Filter counts
  const inactiveStatuses = new Set(["Cancelled", "Expired", "NoShow"]);
  const counts = useMemo(() => {
    let pending = 0, done = 0, cancelled = 0;
    for (const r of reservations) {
      if (inactiveStatuses.has(r.status)) { cancelled += r.participants.length; continue; }
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
    if (activeFilter === "a-fazer-checkin") result = result.filter((r) => !inactiveStatuses.has(r.status) && r.status !== "Performed" && r.participants.some((p) => p.checkInStatus === "Pending"));
    else if (activeFilter === "checkin-realizado") result = result.filter((r) => !inactiveStatuses.has(r.status) && r.participants.some((p) => p.checkInStatus === "Done"));
    else if (activeFilter === "canceladas") result = result.filter((r) => inactiveStatuses.has(r.status));
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

  if (showQrScanner) {
    return (
      <div className="fixed inset-0 z-[100] flex flex-col" style={{ backgroundColor: "#212121" }}>
        {/* Header bar */}
        <header className="relative z-10 shrink-0 flex items-center h-[64px] px-[32px]" style={{ backgroundColor: "rgba(62, 62, 66, 0.6)" }}>
          <button
            onClick={() => setShowQrScanner(false)}
            className="flex items-center gap-[10px] px-[12px] py-[8px] rounded-[8px] cursor-pointer hover:bg-white/10 transition-colors"
          >
            <svg className="size-[16px] text-white" fill="none" viewBox="0 0 24 24">
              <path d="M15 6C15 6 9 10.4188 9 12C9 13.5811 15 18 15 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <p className="font-['Helvetica_Neue:Regular',sans-serif] text-[15px] text-white leading-[normal]">Voltar aos participantes</p>
          </button>
          {/* Temp: scenario navigation */}
          <div className="ml-auto flex items-center gap-[8px]">
            <button
              onClick={() => setQrScenario((prev) => Math.max(0, prev - 1))}
              className="flex items-center justify-center size-[36px] rounded-[8px] cursor-pointer hover:bg-white/10 transition-colors"
            >
              <svg className="size-[20px] text-white" fill="none" viewBox="0 0 24 24">
                <path d="M15 6C15 6 9 10.4188 9 12C9 13.5811 15 18 15 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <p className="font-['Helvetica_Neue:Regular',sans-serif] text-[13px] text-white/60 leading-[normal] whitespace-nowrap">{qrScenario + 1}/{QR_SCENARIOS.length}</p>
            <button
              onClick={() => setQrScenario((prev) => Math.min(QR_SCENARIOS.length - 1, prev + 1))}
              className="flex items-center justify-center size-[36px] rounded-[8px] cursor-pointer hover:bg-white/10 transition-colors"
            >
              <svg className="size-[20px] text-white" fill="none" viewBox="0 0 24 24">
                <path d="M9 6C9 6 15 10.419 15 12C15 13.5812 9 18 9 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </header>

        {/* Scenario: camera-blocked */}
        {QR_SCENARIOS[qrScenario] === "camera-blocked" && (
          <div className="flex-1 flex items-center justify-center mt-[122px]">
            <div className="flex flex-col items-center gap-[24px] max-w-[442px]">
              <div className="flex flex-col items-center gap-[16px]">
                <div className="relative flex items-center justify-center">
                  {[420, 360, 300, 240, 180, 120].map((size) => (
                    <div
                      key={size}
                      className="absolute rounded-full border border-white/[0.06]"
                      style={{ width: size, height: size }}
                    />
                  ))}
                  <div className="relative size-[48px] bg-white rounded-[10px] flex items-center justify-center border border-[#d6d8da] shadow-[0_1px_2px_rgba(10,13,18,0.05)]">
                    <svg className="size-[24px] text-[#414651]" fill="none" viewBox="0 0 48 48">
                      <path d="M19.4317 19.4297C17.3574 20.8751 16 23.278 16 25.998C16 30.4162 19.5817 33.998 24 33.998C26.72 33.998 29.1229 32.6406 30.5683 30.5662" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M38 19V19.02" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M4 4L44 44" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M12.9919 12.9919C12.7629 13 12.4834 13 12.1074 13C10.1472 13 9.16715 13 8.36578 13.2268C6.3611 13.7943 4.79431 15.3611 4.22684 17.3658C4 18.1671 4 19.1472 4 21.1074V29C4 34.6569 4 37.4853 5.75736 39.2426C7.51472 41 10.3431 41 16 41H32C36 41 38.5858 41 40.3787 40.3787M43.7561 35.7561C44 34.0997 44 31.929 44 29V21.1074C44 19.1472 44 18.1671 43.7732 17.3658C43.2057 15.3611 41.6389 13.7943 39.6342 13.2268C38.8329 13 37.8528 13 35.8926 13C35.1607 13 34.7947 13 34.4538 12.9406C33.6091 12.7933 32.8341 12.3785 32.243 11.7574C32.0045 11.5067 31.406 10.609 31 10C30.2073 8.81088 29.8109 8.21633 29.269 7.80733C28.9381 7.55758 28.5704 7.36078 28.179 7.224C27.5382 7 26.8236 7 25.3944 7H22.6056C21.1764 7 20.4618 7 19.821 7.224C19.4296 7.36078 19.0619 7.55758 18.731 7.80733C18.2889 8.14101 17.9437 8.5982 17.401 9.40101" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>
                <div className="flex flex-col items-center gap-[8px]">
                  <p className="font-['Helvetica_Neue:Medium',sans-serif] text-[18px] text-white text-center leading-[normal]">Câmera bloqueada</p>
                  <p className="font-['Helvetica_Neue:Regular',sans-serif] text-[16px] text-[#FAFAFA] text-center leading-[19px]">Para usar o scanner, permita o acesso à câmera nas configurações do navegador.</p>
                </div>
              </div>
              <button className="bg-white border border-[#e2e8f0] rounded-[6px] px-[16px] h-[48px] flex items-center justify-center cursor-pointer hover:bg-[#f8fafc] transition-colors">
                <p className="font-['Helvetica_Neue:Medium',sans-serif] text-[16px] text-[#414651] leading-[normal] whitespace-nowrap">Permitir acesso a câmera novamente</p>
              </button>
            </div>
          </div>
        )}

        {/* Scenario: scanning */}
        {QR_SCENARIOS[qrScenario] === "scanning" && (
          <div className="flex-1 relative overflow-hidden">
            {/* Simulated camera background */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#8b9dc3] via-[#a8b5cc] to-[#6b7d99]" />
            {/* Dark overlay with cutout */}
            <div className="absolute inset-0 bg-black/50 backdrop-blur-[16px]" />
            {/* Transparent scan area cutout */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[420px] rounded-[8px]">
              {/* Clear cutout background */}
              <div className="absolute inset-0 bg-black/50 backdrop-blur-none mix-blend-difference rounded-[8px]" style={{ backdropFilter: "none" }} />
              {/* Corner brackets from Figma */}
              <svg className="absolute inset-[-8px]" style={{ width: "calc(100% + 16px)", height: "calc(100% + 16px)" }} viewBox="0 0 1080 1080" fill="none">
                <path d="M0 33.75C0 24.7989 3.55579 16.2145 9.88515 9.88515C16.2145 3.55579 24.7989 0 33.75 0L236.25 0C245.201 0 253.786 3.55579 260.115 9.88515C266.444 16.2145 270 24.7989 270 33.75C270 42.7011 266.444 51.2855 260.115 57.6149C253.786 63.9442 245.201 67.5 236.25 67.5H109.5C86.304 67.5 67.5 86.304 67.5 109.5V236.25C67.5 245.201 63.9442 253.786 57.6149 260.115C51.2855 266.444 42.7011 270 33.75 270C24.7989 270 16.2145 266.444 9.88515 260.115C3.55579 253.786 0 245.201 0 236.25V33.75ZM810 33.75C810 24.7989 813.556 16.2145 819.885 9.88515C826.215 3.55579 834.799 0 843.75 0L1046.25 0C1055.2 0 1063.79 3.55579 1070.11 9.88515C1076.44 16.2145 1080 24.7989 1080 33.75V236.25C1080 245.201 1076.44 253.786 1070.11 260.115C1063.79 266.444 1055.2 270 1046.25 270C1037.3 270 1028.71 266.444 1022.39 260.115C1016.06 253.786 1012.5 245.201 1012.5 236.25V109.5C1012.5 86.304 993.696 67.5 970.5 67.5H843.75C834.799 67.5 826.215 63.9442 819.885 57.6149C813.556 51.2855 810 42.7011 810 33.75ZM33.75 810C42.7011 810 51.2855 813.556 57.6149 819.885C63.9442 826.214 67.5 834.799 67.5 843.75V970.5C67.5 993.696 86.304 1012.5 109.5 1012.5H236.25C245.201 1012.5 253.786 1016.06 260.115 1022.39C266.444 1028.71 270 1037.3 270 1046.25C270 1055.2 266.444 1063.79 260.115 1070.11C253.786 1076.44 245.201 1080 236.25 1080H33.75C24.7989 1080 16.2145 1076.44 9.88515 1070.11C3.55579 1063.79 0 1055.2 0 1046.25V843.75C0 834.799 3.55579 826.214 9.88515 819.885C16.2145 813.556 24.7989 810 33.75 810ZM1046.25 810C1055.2 810 1063.79 813.556 1070.11 819.885C1076.44 826.214 1080 834.799 1080 843.75V1046.25C1080 1055.2 1076.44 1063.79 1070.11 1070.11C1063.79 1076.44 1055.2 1080 1046.25 1080H843.75C834.799 1080 826.215 1076.44 819.885 1070.11C813.556 1063.79 810 1055.2 810 1046.25C810 1037.3 813.556 1028.71 819.885 1022.39C826.215 1016.06 834.799 1012.5 843.75 1012.5H970.5C993.696 1012.5 1012.5 993.696 1012.5 970.5V843.75C1012.5 834.799 1016.06 826.214 1022.39 819.885C1028.71 813.556 1037.3 810 1046.25 810Z" fill="#FAC515" />
              </svg>
              {/* Scan area with overflow clip for gradient/line */}
              <div className="absolute inset-0 overflow-hidden rounded-[8px]">
                {/* Scan sweep - gradient band trailing behind the line */}
                <div className="absolute left-0 right-0 h-[160px] animate-[scanGlow_2.8s_linear_infinite] pointer-events-none" style={{ top: "50%", transform: "translateY(-100%)", background: "linear-gradient(to bottom, transparent 0%, rgba(250,197,21,0.08) 30%, rgba(250,197,21,0.2) 60%, rgba(250,197,21,0.35) 85%, rgba(250,197,21,0.5) 100%)" }} />
                {/* Scan line */}
                <div className="absolute left-0 right-0 h-[2px] bg-[#FAC515] animate-[scanLine_2.8s_linear_infinite] shadow-[0_0_16px_4px_rgba(250,197,21,0.5),0_0_4px_1px_rgba(250,197,21,0.8)]" style={{ top: "50%" }} />
              </div>
            </div>

            {/* Instruction panel - right of scan area */}
            <div
              className="absolute top-1/2 flex items-center gap-[24px] transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
              style={{
                left: "calc(50% + 240px)",
                opacity: isQrInstructionEntering ? 0 : 1,
                transform: isQrInstructionEntering ? "translateY(calc(-50% + 12px))" : "translateY(-50%)",
              }}
            >
              {/* QR icon card with side tab */}
              <div className="flex items-center -mr-[1px]">
                <svg className="shrink-0" width="13" height="54" viewBox="0 0 24 108" fill="none">
                  <path d="M23.3633 0L2.28922 44.7418C-0.823597 51.3506 -0.756981 59.0173 2.47021 65.571L23.3633 108V0Z" fill="white" />
                </svg>
                <div className="size-[96px] bg-white rounded-[8px] flex items-center justify-center -ml-[1px] p-[10px]">
                  <svg className="size-[76px]" viewBox="0 0 153 153" fill="none">
                    <path d="M0 4.78122C0 3.51316 0.503734 2.29704 1.40039 1.40039C2.29704 0.503734 3.51316 0 4.78122 0L33.4685 0C34.7366 0 35.9527 0.503734 36.8493 1.40039C37.746 2.29704 38.2497 3.51316 38.2497 4.78122C38.2497 6.04927 37.746 7.26539 36.8493 8.16205C35.9527 9.0587 34.7366 9.56243 33.4685 9.56243H16.6787C12.7485 9.56243 9.56243 12.7485 9.56243 16.6787V33.4685C9.56243 34.7366 9.0587 35.9527 8.16205 36.8493C7.26539 37.746 6.04927 38.2497 4.78122 38.2497C3.51316 38.2497 2.29704 37.746 1.40039 36.8493C0.503734 35.9527 0 34.7366 0 33.4685V4.78122ZM114.749 4.78122C114.749 3.51316 115.253 2.29704 116.15 1.40039C117.046 0.503734 118.262 0 119.53 0L148.218 0C149.486 0 150.702 0.503734 151.599 1.40039C152.495 2.29704 152.999 3.51316 152.999 4.78122V33.4685C152.999 34.7366 152.495 35.9527 151.599 36.8493C150.702 37.746 149.486 38.2497 148.218 38.2497C146.95 38.2497 145.734 37.746 144.837 36.8493C143.94 35.9527 143.436 34.7366 143.436 33.4685V16.6787C143.436 12.7485 140.25 9.56243 136.32 9.56243H119.53C118.262 9.56243 117.046 9.0587 116.15 8.16205C115.253 7.26539 114.749 6.04927 114.749 4.78122ZM4.78122 114.749C6.04927 114.749 7.26539 115.253 8.16205 116.15C9.0587 117.046 9.56243 118.262 9.56243 119.53V136.32C9.56243 140.25 12.7485 143.436 16.6787 143.436H33.4685C34.7366 143.436 35.9527 143.94 36.8493 144.837C37.746 145.734 38.2497 146.95 38.2497 148.218C38.2497 149.486 37.746 150.702 36.8493 151.599C35.9527 152.495 34.7366 152.999 33.4685 152.999H4.78122C3.51316 152.999 2.29704 152.495 1.40039 151.599C0.503734 150.702 0 149.486 0 148.218V119.53C0 118.262 0.503734 117.046 1.40039 116.15C2.29704 115.253 3.51316 114.749 4.78122 114.749ZM148.218 114.749C149.486 114.749 150.702 115.253 151.599 116.15C152.495 117.046 152.999 118.262 152.999 119.53V148.218C152.999 149.486 152.495 150.702 151.599 151.599C150.702 152.495 149.486 152.999 148.218 152.999H119.53C118.262 152.999 117.046 152.495 116.15 151.599C115.253 150.702 114.749 149.486 114.749 148.218C114.749 146.95 115.253 145.734 116.15 144.837C117.046 143.94 118.262 143.436 119.53 143.436H136.32C140.25 143.436 143.436 140.25 143.436 136.32V119.53C143.436 118.262 143.94 117.046 144.837 116.15C145.734 115.253 146.95 114.749 148.218 114.749Z" fill="#252B37" />
                    <path d="M19.5703 19.5663V58.9793H58.9832V19.5663H19.5703ZM67.7417 19.5663V28.3248H76.5001V19.5663H67.7417ZM76.5001 28.3248V37.0832H67.7417V54.6001H76.5001V45.8417H85.2585V28.3248H76.5001ZM76.5001 54.6001V67.7377H37.0871V76.4962H28.3287V85.2546H45.8456V76.4962H54.604V85.2546H76.5001V76.4962H85.2585V85.2546H98.3962V76.4962H107.155V67.7377H85.2585V54.6001H76.5001ZM107.155 76.4962V85.2546H133.43V76.4962H124.671V67.7377H115.913V76.4962H107.155ZM28.3287 76.4962V67.7377H19.5703V76.4962H28.3287ZM94.017 19.5663V58.9793H133.43V19.5663H94.017ZM28.3287 28.3248H50.2248V50.2209H28.3287V28.3248ZM102.775 28.3248H124.671V50.2209H102.775V28.3248ZM32.7079 32.704V45.8417H45.8456V32.704H32.7079ZM107.155 32.704V45.8417H120.292V32.704H107.155ZM67.7417 89.6338V98.3923H76.5001V89.6338H67.7417ZM76.5001 98.3923V107.151H67.7417V124.668H76.5001V115.909H94.017V107.151H102.775V98.3923H111.534V107.151H102.775V115.909H94.017V133.426H102.775V124.668H111.534V115.909H115.913V124.668H111.534V133.426H120.292V124.668H124.671V115.909H133.43V98.3923H124.671V89.6338H94.017V98.3923H76.5001ZM124.671 124.668V133.426H133.43V124.668H124.671ZM76.5001 124.668V133.426H85.2585V124.668H76.5001ZM19.5703 94.013V133.426H58.9832V94.013H19.5703ZM28.3287 102.771H50.2248V124.668H28.3287V102.771ZM32.7079 107.151V120.288H45.8456V107.151H32.7079Z" fill="#252B37" />
                  </svg>
                </div>
              </div>
              {/* Text */}
              <p className="font-['Helvetica_Neue:Regular',sans-serif] text-[30px] text-white leading-[36px] w-[246px]">Escaneie o QR code para realizar o check-in.</p>
            </div>
          </div>
        )}

        {/* Scenario: valid-reservation */}
        {QR_SCENARIOS[qrScenario] === "valid-reservation" && (
          <>
            {/* Scanner background (same as scanning) */}
            <div className="flex-1 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[#8b9dc3] via-[#a8b5cc] to-[#6b7d99]" />
              <div className="absolute inset-0 bg-black/50 backdrop-blur-[16px]" />
              <div
                className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 size-[420px] rounded-[8px] transition-[left] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
                style={{ left: isQrDrawerClosing ? "50%" : "calc(50% - 240px)" }}
              >
                <div className="absolute inset-0 bg-black/50 backdrop-blur-none mix-blend-difference rounded-[8px]" style={{ backdropFilter: "none" }} />
                <svg className="absolute inset-[-8px]" style={{ width: "calc(100% + 16px)", height: "calc(100% + 16px)" }} viewBox="0 0 1080 1080" fill="none">
                  <path d="M0 33.75C0 24.7989 3.55579 16.2145 9.88515 9.88515C16.2145 3.55579 24.7989 0 33.75 0L236.25 0C245.201 0 253.786 3.55579 260.115 9.88515C266.444 16.2145 270 24.7989 270 33.75C270 42.7011 266.444 51.2855 260.115 57.6149C253.786 63.9442 245.201 67.5 236.25 67.5H109.5C86.304 67.5 67.5 86.304 67.5 109.5V236.25C67.5 245.201 63.9442 253.786 57.6149 260.115C51.2855 266.444 42.7011 270 33.75 270C24.7989 270 16.2145 266.444 9.88515 260.115C3.55579 253.786 0 245.201 0 236.25V33.75ZM810 33.75C810 24.7989 813.556 16.2145 819.885 9.88515C826.215 3.55579 834.799 0 843.75 0L1046.25 0C1055.2 0 1063.79 3.55579 1070.11 9.88515C1076.44 16.2145 1080 24.7989 1080 33.75V236.25C1080 245.201 1076.44 253.786 1070.11 260.115C1063.79 266.444 1055.2 270 1046.25 270C1037.3 270 1028.71 266.444 1022.39 260.115C1016.06 253.786 1012.5 245.201 1012.5 236.25V109.5C1012.5 86.304 993.696 67.5 970.5 67.5H843.75C834.799 67.5 826.215 63.9442 819.885 57.6149C813.556 51.2855 810 42.7011 810 33.75ZM33.75 810C42.7011 810 51.2855 813.556 57.6149 819.885C63.9442 826.214 67.5 834.799 67.5 843.75V970.5C67.5 993.696 86.304 1012.5 109.5 1012.5H236.25C245.201 1012.5 253.786 1016.06 260.115 1022.39C266.444 1028.71 270 1037.3 270 1046.25C270 1055.2 266.444 1063.79 260.115 1070.11C253.786 1076.44 245.201 1080 236.25 1080H33.75C24.7989 1080 16.2145 1076.44 9.88515 1070.11C3.55579 1063.79 0 1055.2 0 1046.25V843.75C0 834.799 3.55579 826.214 9.88515 819.885C16.2145 813.556 24.7989 810 33.75 810ZM1046.25 810C1055.2 810 1063.79 813.556 1070.11 819.885C1076.44 826.214 1080 834.799 1080 843.75V1046.25C1080 1055.2 1076.44 1063.79 1070.11 1070.11C1063.79 1076.44 1055.2 1080 1046.25 1080H843.75C834.799 1080 826.215 1076.44 819.885 1070.11C813.556 1063.79 810 1055.2 810 1046.25C810 1037.3 813.556 1028.71 819.885 1022.39C826.215 1016.06 834.799 1012.5 843.75 1012.5H970.5C993.696 1012.5 1012.5 993.696 1012.5 970.5V843.75C1012.5 834.799 1016.06 826.214 1022.39 819.885C1028.71 813.556 1037.3 810 1046.25 810Z" fill="#FAC515" />
                </svg>
                <div className="absolute inset-0 overflow-hidden rounded-[8px]">
                  <div className="absolute left-0 right-0 h-[160px] animate-[scanGlow_2.8s_linear_infinite] pointer-events-none" style={{ top: "50%", transform: "translateY(-100%)", background: "linear-gradient(to bottom, transparent 0%, rgba(250,197,21,0.08) 30%, rgba(250,197,21,0.2) 60%, rgba(250,197,21,0.35) 85%, rgba(250,197,21,0.5) 100%)" }} />
                  <div className="absolute left-0 right-0 h-[2px] bg-[#FAC515] animate-[scanLine_2.8s_linear_infinite] shadow-[0_0_16px_4px_rgba(250,197,21,0.5),0_0_4px_1px_rgba(250,197,21,0.8)]" style={{ top: "50%" }} />
                </div>
              </div>
            </div>

            {/* Right panel - reservation details */}
            <div className={`absolute right-0 top-[64px] bottom-0 w-[576px] bg-white rounded-tl-[16px] shadow-[0_4px_8px_rgba(113,128,150,0.08),0_0_1px_rgba(113,128,150,0.04)] flex flex-col z-20 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${isQrDrawerClosing ? "translate-x-full" : "translate-x-0"}`}>
              {/* Scrollable content */}
              <div className="flex-1 overflow-y-auto px-[20px] pt-[24px] pb-[32px] flex flex-col gap-[24px]">
                {/* Title - hidden */}

                {/* Participant card */}
                <div className="border border-[#f5f5f5] rounded-[16px] p-[16px] flex flex-col gap-[16px]">
                  {/* Participant header */}
                  <div className="flex items-center gap-[12px]">
                    <div className="relative size-[40px] shrink-0">
                      <svg className="absolute inset-0 size-full" fill="none" viewBox="0 0 40 40"><circle cx="20" cy="20" r="19.5" fill="#EDF0FF" stroke="#D5DAFF"/></svg>
                      <p className="absolute inset-0 flex items-center justify-center font-['Helvetica_Neue:Medium',sans-serif] text-[14px] text-[#0b5ed7]">JS</p>
                    </div>
                    <div>
                      <p className="font-['Helvetica_Neue:Medium',sans-serif] text-[16px] text-[#181d27] leading-[normal]">João Silva</p>
                      <div className="flex items-center gap-[8px] mt-[2px]">
                        <div className="flex items-center gap-[6px]">
                          <svg className="size-[16px] text-[#717680] rotate-180 scale-x-[-1]" fill="none" viewBox="0 0 17.3334 17.3334">
                            <path d="M11.1667 0.750024C12.3288 0.750024 12.9098 0.750024 13.3894 0.86515C14.9129 1.23092 16.1025 2.42046 16.4682 3.944C16.5834 4.42353 16.5834 5.00459 16.5834 6.16669M6.16669 0.750024C5.00459 0.750024 4.42353 0.750024 3.944 0.86515C2.42047 1.23092 1.23092 2.42046 0.86515 3.944C0.750025 4.42353 0.750025 5.00459 0.750025 6.16669M6.16669 16.5834C5.00459 16.5834 4.42353 16.5834 3.944 16.4682C2.42047 16.1025 1.23092 14.9129 0.86515 13.3894C0.750025 12.9098 0.750025 12.3288 0.750025 11.1667M11.1667 16.5834C12.3288 16.5834 12.9098 16.5834 13.3894 16.4682C14.9129 16.1025 16.1025 14.9129 16.4682 13.3894C16.5834 12.9098 16.5834 12.3288 16.5834 11.1667" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M11.1667 10.7501C11.1667 12.1308 10.0474 13.2501 8.66669 13.2501C7.28598 13.2501 6.16669 12.1308 6.16669 10.7501C6.16669 9.3694 7.28598 8.25011 8.66669 8.25011C10.0474 8.25011 11.1667 9.3694 11.1667 10.7501Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M12.8334 4.08344C12.8334 6.38463 10.9679 8.25011 8.66669 8.25011C6.3655 8.25011 4.50002 6.38463 4.50002 4.08344" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          <p className="font-['Helvetica_Neue:Regular',sans-serif] text-[12px] text-[#717680]">ID: #8823</p>
                        </div>
                        <div className="flex items-center gap-[6px]">
                          <svg className="size-[16px] text-[#717680]" fill="none" viewBox="0 0 48 48">
                            <path d="M39.4171 15.3008C39.7314 14.9865 40.2729 14.9544 40.5915 15.3019C42.4569 17.3365 43.4892 18.843 43.8292 20.5115C44.0248 21.4713 44.0526 22.4485 43.9114 23.3988C43.5297 25.9673 41.4488 28.0482 37.2869 32.2102L32.2102 37.2869C28.0482 41.4488 25.9673 43.5297 23.3988 43.9114C22.4485 44.0526 21.4713 44.0248 20.5115 43.8292C18.8432 43.4893 17.3368 42.4571 15.3025 40.5921C14.9547 40.2732 14.9868 39.731 15.3015 39.4163C17.0539 37.664 16.9706 34.7396 15.1155 32.8845C13.2604 31.0294 10.336 30.9461 8.58367 32.6985C8.26902 33.0132 7.72682 33.0453 7.40791 32.6975C5.54291 30.6632 4.51072 29.1568 4.17077 27.4885C3.97518 26.5287 3.94736 25.5515 4.08857 24.6012C4.47025 22.0327 6.55121 19.9518 10.7131 15.7898L15.7898 10.7131C19.9518 6.55121 22.0327 4.47025 24.6012 4.08857C25.5515 3.94736 26.5287 3.97518 27.4885 4.17078C29.157 4.51076 30.6635 5.54315 32.6981 7.40853C33.0456 7.72709 33.0135 8.26864 32.6993 8.58293C30.9469 10.3353 31.0301 13.2597 32.8852 15.1148C34.7403 16.9699 37.6647 17.0531 39.4171 15.3008Z" stroke="currentColor" strokeWidth="4" strokeLinejoin="round"/>
                            <path d="M38 30L18 10" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          <p className="font-['Helvetica_Neue:Regular',sans-serif] text-[12px] text-[#717680]">Tarifa: Infantil</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="h-px bg-[#f5f5f5] -mt-[4px]" />

                  {/* Info grid */}
                  <div className="grid grid-cols-2 gap-[16px]">
                    <div className="flex items-start gap-[10px]">
                      <div className="size-[32px] bg-white border border-[#f5f5f5] rounded-[8px] flex items-center justify-center shrink-0">
                        <svg className="size-[20px] text-[#535862]" fill="none" viewBox="0 0 40 40"><path d="M21.669 3.33203C23.5089 3.33203 25.0004 4.88413 25.0004 6.79875C25.0004 8.38062 25.0603 9.78828 23.782 10.952C19.5978 14.7609 17.5057 16.6654 15.0004 16.6654C12.4952 16.6654 10.4031 14.7609 6.21888 10.952C4.94044 9.78819 5.00044 8.38037 5.00044 6.79839C5.00044 4.88397 6.49183 3.33203 8.33155 3.33203" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/><path d="M15 23.332V29.165C15 33.3074 18.3581 36.6655 22.5006 36.6655C26.643 36.6655 30.0011 33.3074 30.0011 29.165V26.6654" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/><path d="M23.3346 11.668L21.1643 17.0939C20.5873 18.5363 20.2988 19.2575 19.8157 19.85C19.3326 20.4426 18.6844 20.8705 17.3878 21.7262L14.9506 23.3346L12.556 21.7219C11.2883 20.8681 10.6544 20.4412 10.1816 19.8557C9.70884 19.2702 9.42502 18.5606 8.85738 17.1415L6.66797 11.668" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/><path d="M35 21.668C35 24.4294 32.7614 26.668 30 26.668C27.2386 26.668 25 24.4294 25 21.668C25 18.9065 27.2386 16.668 30 16.668C32.7614 16.668 35 18.9065 35 21.668Z" stroke="currentColor" strokeWidth="3"/><path d="M30.012 21.668L29.9971 21.668" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </div>
                      <div className="flex flex-col gap-[4px]">
                        <p className="font-['Helvetica_Neue:Regular',sans-serif] text-[12px] text-[#717680] leading-[normal]">Alertas de Saúde</p>
                        <p className="font-['Helvetica_Neue:Regular',sans-serif] text-[14px] text-[#181d27] leading-[normal]">Sim - alergias</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-[10px]">
                      <div className="size-[32px] bg-white border border-[#f5f5f5] rounded-[8px] flex items-center justify-center shrink-0">
                        <svg className="size-[20px] text-[#535862]" fill="none" viewBox="0 0 40 40"><path d="M3.33203 28.3359H36.6654" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/><path d="M20 11.6667C20 11.6667 22.5 9.94397 22.5 7.81892C22.5 4.06036 17.5 4.06036 17.5 7.81892C17.5 9.94397 20 11.6667 20 11.6667Z" stroke="currentColor" strokeWidth="3" strokeLinejoin="round"/><path d="M5 28.3359L6.03545 32.4777C6.40642 33.9616 7.7397 35.0026 9.26925 35.0026H30.7307C32.2603 35.0026 33.5936 33.9616 33.9646 32.4777L35 28.3359" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/><path d="M34.1654 24.168C33.3348 17.1294 27.3089 11.668 19.9987 11.668C12.6885 11.668 6.6626 17.1294 5.83203 24.168" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/></svg>
                      </div>
                      <div className="flex flex-col gap-[4px]">
                        <p className="font-['Helvetica_Neue:Regular',sans-serif] text-[12px] text-[#717680] leading-[normal]">Restrições alimentares</p>
                        <p className="font-['Helvetica_Neue:Regular',sans-serif] text-[14px] text-[#181d27] leading-[normal]">Sim - alergias</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-[10px]">
                      <div className="size-[32px] bg-white border border-[#f5f5f5] rounded-[8px] flex items-center justify-center shrink-0">
                        <svg className="size-[20px] text-[#535862]" fill="none" viewBox="0 0 40 40"><path d="M31.6667 14.9987V13.029C31.6667 10.2069 31.6667 8.7959 31.2463 7.66894C30.5706 5.85719 29.1415 4.42811 27.3298 3.75237C26.2028 3.33203 24.7918 3.33203 21.9697 3.33203C17.0311 3.33203 14.5618 3.33203 12.5896 4.06762C9.41904 5.25017 6.91814 7.75107 5.73559 10.9216C5 12.8938 5 15.3631 5 20.3017L5 24.5442C5 29.6598 5 32.2176 6.32972 33.9939C6.71071 34.5028 7.16254 34.9546 7.67148 35.3356C9.44779 36.6654 12.0056 36.6654 17.1212 36.6654H18.3333C20.2829 36.6654 24.1667 36.6654 24.1667 36.6654" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/><path d="M18.332 23.8889H19.7326C20.8352 23.8889 21.3864 23.8889 21.8295 24.1793C22.2725 24.4697 22.519 24.9927 23.0121 26.0386L25.6654 31.6667L29.332 20L31.9853 25.6281C32.4783 26.674 32.7249 27.197 33.1679 27.4874C33.6109 27.7778 34.1622 27.7778 35.2648 27.7778H36.6654" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/><path d="M5 19.9987C5 16.9304 7.48731 14.4431 10.5556 14.4431L12.4074 14.4431C13.2685 14.4431 13.699 14.4431 14.0523 14.3485C15.0109 14.0916 15.7596 13.3429 16.0165 12.3843C16.1111 12.0311 16.1111 11.6005 16.1111 10.7394V8.88759C16.1111 5.81934 18.5984 3.33203 21.6667 3.33203" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </div>
                      <div className="flex flex-col gap-[4px]">
                        <p className="font-['Helvetica_Neue:Regular',sans-serif] text-[12px] text-[#717680] leading-[normal]">Necessidades especiais</p>
                        <p className="font-['Helvetica_Neue:Regular',sans-serif] text-[14px] text-[#181d27] leading-[normal]">Não</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-[10px]">
                      <div className="size-[32px] bg-white border border-[#f5f5f5] rounded-[8px] flex items-center justify-center shrink-0">
                        <svg className="size-[20px] text-[#535862]" fill="none" viewBox="0 0 40 40"><path d="M20 7.5V10M20 10V12.5M20 10H22.5M20 10H17.5" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/><path d="M14.3083 4.30834C13.332 5.28465 13.332 6.856 13.332 9.9987C13.332 13.1414 13.332 14.7127 14.3083 15.6891C15.2847 16.6654 16.856 16.6654 19.9987 16.6654C23.1414 16.6654 24.7127 16.6654 25.6891 15.6891C26.6654 14.7127 26.6654 13.1414 26.6654 9.9987C26.6654 6.856 26.6654 5.28465 25.6891 4.30834C24.7127 3.33203 23.1414 3.33203 19.9987 3.33203C16.856 3.33203 15.2847 3.33203 14.3083 4.30834Z" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/><path d="M6.66797 36.6654V19.9499C6.66797 14.4341 6.66797 11.6762 8.37651 9.96263C9.46239 8.87358 10.9689 8.47668 13.3346 8.33203M33.3346 36.6654V19.9499C33.3346 14.4341 33.3346 11.6762 31.6261 9.96263C30.5402 8.87358 29.0337 8.47668 26.668 8.33203" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/><path d="M5 36.668H35" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/><path d="M15.832 36.6654V32.4987C15.832 30.941 15.832 30.1622 16.167 29.582C16.3864 29.202 16.702 28.8864 17.082 28.667C17.6622 28.332 18.441 28.332 19.9987 28.332C21.5564 28.332 22.3352 28.332 22.9154 28.667C23.2954 28.8864 23.611 29.202 23.8304 29.582C24.1654 30.1622 24.1654 30.941 24.1654 32.4987V36.6654" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/><path d="M13.347 21.668H13.332M19.9987 21.668H19.9838M26.6673 21.668H26.6523" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </div>
                      <div className="flex flex-col gap-[4px]">
                        <p className="font-['Helvetica_Neue:Regular',sans-serif] text-[12px] text-[#717680] leading-[normal]">Possui plano de saúde</p>
                        <p className="font-['Helvetica_Neue:Regular',sans-serif] text-[14px] text-[#181d27] leading-[normal]">Sim</p>
                      </div>
                    </div>
                  </div>

                  {/* Observations */}
                  <div className="flex items-start gap-[10px]">
                    <div className="size-[32px] bg-white border border-[#f5f5f5] rounded-[8px] flex items-center justify-center shrink-0">
                      <svg className="size-[20px] text-[#535862]" fill="none" viewBox="0 0 40 40"><path d="M24.9987 12.5013C24.9987 7.89893 21.2677 4.16797 16.6654 4.16797C12.063 4.16797 8.33203 7.89893 8.33203 12.5013C8.33203 17.1037 12.063 20.8346 16.6654 20.8346C21.2677 20.8346 24.9987 17.1037 24.9987 12.5013Z" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/><path d="M34.9987 35.8346L32.4987 33.3346M33.332 29.168C33.332 26.4065 31.0935 24.168 28.332 24.168C25.5706 24.168 23.332 26.4065 23.332 29.168C23.332 31.9294 25.5706 34.168 28.332 34.168C31.0935 34.168 33.332 31.9294 33.332 29.168Z" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/><path d="M5 32.5026C5 26.0593 10.2233 20.8359 16.6667 20.8359C18.456 20.8359 20.1512 21.2388 21.6667 21.9587" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </div>
                    <div className="flex flex-col gap-[4px]">
                      <p className="font-['Helvetica_Neue:Regular',sans-serif] text-[12px] text-[#717680] leading-[normal]">Observações adicionais</p>
                      <p className="font-['Helvetica_Neue:Regular',sans-serif] text-[14px] text-[#181d27] leading-[normal]">ATENÇÃO: esse participante é alérgico a amendoim e frutos do mar.</p>
                    </div>
                  </div>
                </div>

                {/* Activity card */}
                <div className="border border-[#f5f5f5] rounded-[16px] p-[16px] flex flex-col gap-[12px]">
                  <p className="font-['Helvetica_Neue:Medium',sans-serif] text-[12px] text-[#717680] uppercase tracking-[0.5px]">DADOS DA ATIVIDADE</p>

                  {/* Activity name + location */}
                  <div className="flex items-start gap-[10px]">
                    <div className="size-[32px] bg-white border border-[#f5f5f5] rounded-[8px] flex items-center justify-center shrink-0"><svg className="size-[20px] text-[#535862]" fill="none" viewBox="0 0 48 48"><path d="M37.437 21.4303C37.0516 21.7957 36.5364 22 36.0002 22C35.464 22 34.9488 21.7957 34.5633 21.4303C31.0335 18.0634 26.3031 14.3022 28.61 8.8417C29.8573 5.88924 32.8514 4 36.0002 4C39.149 4 42.1431 5.88924 43.3904 8.8417C45.6944 14.2953 40.9756 18.075 37.437 21.4303Z" stroke="currentColor" strokeWidth="3"/><path d="M36 12H36.018" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/><circle cx="10" cy="38" r="6" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/><path d="M22 14H19C15.134 14 12 16.6863 12 20C12 23.3137 15.134 26 19 26H25C28.866 26 32 28.6863 32 32C32 35.3137 28.866 38 25 38H22" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg></div>
                    <div>
                      <p className="font-['Helvetica_Neue:Regular',sans-serif] text-[16px] text-[#181d27] leading-[normal]">Trilha Pico do Itacolomi</p>
                      <div className="flex items-center mt-[2px]">
                        <p className="font-['Helvetica_Neue:Regular',sans-serif] text-[12px] text-[#717680]">Parque Municipal, Sabará - Belo Horizonte</p>
                      </div>
                    </div>
                  </div>

                  <div className="h-px bg-[#f5f5f5]" />

                  {/* Info rows */}
                  <div className="grid grid-cols-2 gap-[16px]">
                    <div className="flex items-start gap-[10px]">
                      <div className="size-[32px] bg-white border border-[#f5f5f5] rounded-[8px] flex items-center justify-center shrink-0"><svg className="size-[20px] text-[#535862]" fill="none" viewBox="0 0 40 40"><path d="M13.332 28.332L26.6654 28.332" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/><path d="M13.332 21.668H19.9987" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/><path d="M21.668 4.16536V4.9987C21.668 9.71274 21.668 12.0698 23.1324 13.5342C24.5969 14.9987 26.9539 14.9987 31.668 14.9987L32.5013 14.9987M33.3346 17.7601V23.332C33.3346 29.6174 33.3346 32.7601 31.382 34.7127C29.4294 36.6654 26.2867 36.6654 20.0013 36.6654C13.7159 36.6654 10.5732 36.6654 8.62059 34.7127C6.66797 32.7601 6.66797 29.6174 6.66797 23.332L6.66797 15.7584C6.66797 10.3501 6.66797 7.64588 8.14476 5.81425C8.4431 5.44422 8.78016 5.10716 9.15019 4.80882C10.9818 3.33203 13.686 3.33203 19.0944 3.33203C20.2703 3.33203 20.8582 3.33203 21.3966 3.52205C21.5086 3.56156 21.6184 3.60704 21.7255 3.65827C22.2406 3.90462 22.6563 4.32036 23.4878 5.15184L31.382 13.0461C32.3454 14.0095 32.8272 14.4912 33.0809 15.1038C33.3346 15.7164 33.3346 16.3976 33.3346 17.7601Z" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg></div>
                      <div className="flex flex-col gap-[4px]">
                        <p className="font-['Helvetica_Neue:Regular',sans-serif] text-[12px] text-[#717680] leading-[normal]">ID do pedido</p>
                        <p className="font-['Helvetica_Neue:Regular',sans-serif] text-[14px] text-[#181d27] leading-[normal]">#RE-9920</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-[10px]">
                      <div className="size-[32px] bg-white border border-[#f5f5f5] rounded-[8px] flex items-center justify-center shrink-0"><svg className="size-[20px] text-[#535862]" fill="none" viewBox="0 0 40 40"><path d="M36.6654 19.9987C36.6654 29.2034 29.2034 36.6654 19.9987 36.6654C10.794 36.6654 3.33203 29.2034 3.33203 19.9987C3.33203 10.794 10.794 3.33203 19.9987 3.33203C29.2034 3.33203 36.6654 10.794 36.6654 19.9987Z" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="4 4"/></svg></div>
                      <div className="flex flex-col gap-[4px]">
                        <p className="font-['Helvetica_Neue:Regular',sans-serif] text-[12px] text-[#717680] leading-[normal]">Status de pagamento</p>
                        <div className="flex items-center gap-[6px]">
                          <div className="size-[8px] rounded-full bg-[#17b26a]" />
                          <p className="font-['Helvetica_Neue:Regular',sans-serif] text-[14px] text-[#181d27] leading-[normal]">Pagamento confirmado</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start gap-[10px]">
                      <div className="size-[32px] bg-white border border-[#f5f5f5] rounded-[8px] flex items-center justify-center shrink-0"><svg className="size-[20px] text-[#535862]" fill="none" viewBox="0 0 40 40"><path d="M26.6654 3.33203V9.9987M13.332 3.33203L13.332 9.9987" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/><path d="M35 20.0013C35 13.7159 35 10.5732 33.0474 8.62059C31.0948 6.66797 27.9521 6.66797 21.6667 6.66797L18.3333 6.66797C12.0479 6.66797 8.90524 6.66797 6.95262 8.62059C5 10.5732 5 13.7159 5 20.0013L5 23.3346C5 29.62 5 32.7627 6.95262 34.7153C8.90524 36.668 12.0479 36.668 18.3333 36.668" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/><path d="M5 16.668L35 16.668" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/><path d="M30.4465 31.1672L28.3346 29.9987V27.11M35.0013 29.9987C35.0013 33.6806 32.0165 36.6654 28.3346 36.6654C24.6527 36.6654 21.668 33.6806 21.668 29.9987C21.668 26.3168 24.6527 23.332 28.3346 23.332C32.0165 23.332 35.0013 26.3168 35.0013 29.9987Z" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg></div>
                      <div className="flex flex-col gap-[4px]">
                        <p className="font-['Helvetica_Neue:Regular',sans-serif] text-[12px] text-[#717680] leading-[normal]">Data / hora da atividade</p>
                        <p className="font-['Helvetica_Neue:Regular',sans-serif] text-[14px] text-[#181d27] leading-[normal]">18/02/2026, 08:00 AM (GMT+5:30)</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-[10px]">
                      <div className="size-[32px] bg-white border border-[#f5f5f5] rounded-[8px] flex items-center justify-center shrink-0"><svg className="size-[20px] text-[#535862]" fill="none" viewBox="0 0 40 40"><path d="M19.9987 36.6654C29.2034 36.6654 36.6654 29.2034 36.6654 19.9987C36.6654 10.794 29.2034 3.33203 19.9987 3.33203C10.794 3.33203 3.33203 10.794 3.33203 19.9987C3.33203 29.2034 10.794 36.6654 19.9987 36.6654Z" stroke="currentColor" strokeWidth="3"/><path d="M20.0117 17.5127C18.631 17.5127 17.5117 18.6319 17.5117 20.0127C17.5117 21.3934 18.631 22.5127 20.0117 22.5127C21.3924 22.5127 22.5117 21.3934 22.5117 20.0127C22.5117 18.6319 21.3924 17.5127 20.0117 17.5127ZM20.0117 17.5127V11.6641M25.0232 25.0321L21.7755 21.7844" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg></div>
                      <div className="flex flex-col gap-[4px]">
                        <p className="font-['Helvetica_Neue:Regular',sans-serif] text-[12px] text-[#717680] leading-[normal]">Duração da atividade</p>
                        <p className="font-['Helvetica_Neue:Regular',sans-serif] text-[14px] text-[#181d27] leading-[normal]">08:00 AM - 11:00 AM (2h)</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer actions */}
              <div className="shrink-0 h-[88px] flex items-center justify-between px-[24px] border-t border-[#eaecf0] bg-[#fafbfc]">
                <button onClick={handleQrDrawerCancel} disabled={isQrDrawerClosing} className={`flex-1 h-[48px] flex items-center justify-center rounded-[8px] border border-[#e2e8f0] bg-white hover:bg-[#f8fafc] transition-colors mr-[12px] ${isQrDrawerClosing ? "cursor-default" : "cursor-pointer"}`}>
                  <p className="font-['Helvetica_Neue:Regular',sans-serif] text-[16px] text-[#414651]">Cancelar</p>
                </button>
                <button
                  onClick={() => {
                    if (isConfirmingCheckIn) return;
                    setIsConfirmingCheckIn(true);
                    setTimeout(() => {
                      setIsConfirmingCheckIn(false);
                      setQrScenario(3);
                    }, 2000);
                  }}
                  disabled={isConfirmingCheckIn || isQrDrawerClosing}
                  className={`flex-1 h-[48px] flex items-center justify-center gap-[8px] rounded-[8px] bg-[#0b5ed7] transition-colors ${isConfirmingCheckIn || isQrDrawerClosing ? "opacity-80 cursor-not-allowed" : "cursor-pointer hover:bg-[#0a4fb3]"}`}
                >
                  {isConfirmingCheckIn && (
                    <svg className="animate-spin shrink-0 size-[20px] text-white" fill="none" viewBox="0 0 20 20">
                      <circle className="opacity-25" cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="2" />
                      <path className="opacity-75" fill="currentColor" d="M10 2a8 8 0 018 8h-2a6 6 0 00-6-6V2z" />
                    </svg>
                  )}
                  <p className="font-['Helvetica_Neue:Medium',sans-serif] text-[16px] text-white">
                    {isConfirmingCheckIn ? "Carregando" : "Confirmar check-in"}
                  </p>
                </button>
              </div>
            </div>
          </>
        )}

        {/* Scenario: checkin-success */}
        {QR_SCENARIOS[qrScenario] === "checkin-success" && (
          <>
            {/* Scanner background */}
            <div className="flex-1 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[#8b9dc3] via-[#a8b5cc] to-[#6b7d99]" />
              <div className="absolute inset-0 bg-black/50 backdrop-blur-[16px]" />
            </div>

            {/* Right panel - success */}
            <div className="absolute right-0 top-[64px] bottom-0 w-[576px] bg-white rounded-tl-[16px] shadow-[0_4px_8px_rgba(113,128,150,0.08),0_0_1px_rgba(113,128,150,0.04)] flex flex-col z-20">
              {/* Content */}
              <div className="flex-1 flex flex-col items-center justify-center px-[24px]">
                {/* Success icon with halo */}
                <div className="relative flex items-center justify-center mb-[24px] size-[96px]">
                  <div className="absolute inset-0 rounded-full bg-[#ecfdf3] border border-[#abf0c1]" />
                  <div className="absolute inset-0 rounded-full" style={{ background: "linear-gradient(to bottom, transparent 0%, rgba(255,255,255,0.8) 100%)" }} />
                  <div className="relative size-[62px] rounded-full bg-[#079455] flex items-center justify-center">
                    <svg className="size-[34px]" fill="none" viewBox="0 0 20 20">
                      <circle cx="10" cy="10" r="8.5" stroke="white" strokeWidth="1.875" />
                      <path d="M7 10.5l2 2 4-4" stroke="white" strokeWidth="1.875" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>

                {/* Text */}
                <p className="font-['Helvetica_Neue:Medium',sans-serif] text-[18px] text-[#181d27] text-center leading-[normal]">Check-in realizado com sucesso</p>
                <p className="font-['Helvetica_Neue:Regular',sans-serif] text-[16px] text-[#717680] text-center leading-[normal] mt-[8px]">O check-in de João Silva foi feito hoje, as 07:42.</p>

                {/* Participant card */}
                <div className="bg-[#fafafa] border border-[#f5f5f5] rounded-[16px] p-[16px] mt-[24px] w-full max-w-[480px]">
                  <div className="flex items-center gap-[12px]">
                    <div className="relative size-[40px] shrink-0">
                      <svg className="absolute inset-0 size-full" fill="none" viewBox="0 0 40 40"><circle cx="20" cy="20" r="19.5" fill="#EDF0FF" stroke="#D5DAFF"/></svg>
                      <p className="absolute inset-0 flex items-center justify-center font-['Helvetica_Neue:Medium',sans-serif] text-[14px] text-[#0b5ed7]">JS</p>
                    </div>
                    <div>
                      <p className="font-['Helvetica_Neue:Medium',sans-serif] text-[16px] text-[#181d27] leading-[normal]">João Silva</p>
                      <div className="flex items-center gap-[8px] mt-[2px]">
                        <div className="flex items-center gap-[6px]">
                          <svg className="size-[16px] text-[#717680] rotate-180 scale-x-[-1]" fill="none" viewBox="0 0 17.3334 17.3334">
                            <path d="M11.1667 0.750024C12.3288 0.750024 12.9098 0.750024 13.3894 0.86515C14.9129 1.23092 16.1025 2.42046 16.4682 3.944C16.5834 4.42353 16.5834 5.00459 16.5834 6.16669M6.16669 0.750024C5.00459 0.750024 4.42353 0.750024 3.944 0.86515C2.42047 1.23092 1.23092 2.42046 0.86515 3.944C0.750025 4.42353 0.750025 5.00459 0.750025 6.16669M6.16669 16.5834C5.00459 16.5834 4.42353 16.5834 3.944 16.4682C2.42047 16.1025 1.23092 14.9129 0.86515 13.3894C0.750025 12.9098 0.750025 12.3288 0.750025 11.1667M11.1667 16.5834C12.3288 16.5834 12.9098 16.5834 13.3894 16.4682C14.9129 16.1025 16.1025 14.9129 16.4682 13.3894C16.5834 12.9098 16.5834 12.3288 16.5834 11.1667" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M11.1667 10.7501C11.1667 12.1308 10.0474 13.2501 8.66669 13.2501C7.28598 13.2501 6.16669 12.1308 6.16669 10.7501C6.16669 9.3694 7.28598 8.25011 8.66669 8.25011C10.0474 8.25011 11.1667 9.3694 11.1667 10.7501Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M12.8334 4.08344C12.8334 6.38463 10.9679 8.25011 8.66669 8.25011C6.3655 8.25011 4.50002 6.38463 4.50002 4.08344" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          <p className="font-['Helvetica_Neue:Regular',sans-serif] text-[12px] text-[#717680]">ID: #8823</p>
                        </div>
                        <div className="flex items-center gap-[6px]">
                          <svg className="size-[16px] text-[#717680]" fill="none" viewBox="0 0 48 48">
                            <path d="M39.4171 15.3008C39.7314 14.9865 40.2729 14.9544 40.5915 15.3019C42.4569 17.3365 43.4892 18.843 43.8292 20.5115C44.0248 21.4713 44.0526 22.4485 43.9114 23.3988C43.5297 25.9673 41.4488 28.0482 37.2869 32.2102L32.2102 37.2869C28.0482 41.4488 25.9673 43.5297 23.3988 43.9114C22.4485 44.0526 21.4713 44.0248 20.5115 43.8292C18.8432 43.4893 17.3368 42.4571 15.3025 40.5921C14.9547 40.2732 14.9868 39.731 15.3015 39.4163C17.0539 37.664 16.9706 34.7396 15.1155 32.8845C13.2604 31.0294 10.336 30.9461 8.58367 32.6985C8.26902 33.0132 7.72682 33.0453 7.40791 32.6975C5.54291 30.6632 4.51072 29.1568 4.17077 27.4885C3.97518 26.5287 3.94736 25.5515 4.08857 24.6012C4.47025 22.0327 6.55121 19.9518 10.7131 15.7898L15.7898 10.7131C19.9518 6.55121 22.0327 4.47025 24.6012 4.08857C25.5515 3.94736 26.5287 3.97518 27.4885 4.17078C29.157 4.51076 30.6635 5.54315 32.6981 7.40853C33.0456 7.72709 33.0135 8.26864 32.6993 8.58293C30.9469 10.3353 31.0301 13.2597 32.8852 15.1148C34.7403 16.9699 37.6647 17.0531 39.4171 15.3008Z" stroke="currentColor" strokeWidth="4" strokeLinejoin="round"/>
                            <path d="M38 30L18 10" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          <p className="font-['Helvetica_Neue:Regular',sans-serif] text-[12px] text-[#717680]">Tarifa: Infantil</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer actions */}
              <div className="shrink-0 flex flex-col gap-[12px] px-[24px] py-[24px]">
                <button
                  onClick={() => setShowQrScanner(false)}
                  className="w-full h-[48px] flex items-center justify-center rounded-[8px] border border-[#e2e8f0] bg-white cursor-pointer hover:bg-[#f8fafc] transition-colors"
                >
                  <p className="font-['Helvetica_Neue:Regular',sans-serif] text-[16px] text-[#414651]">Voltar aos participantes</p>
                </button>
                <button
                  onClick={() => setQrScenario(1)}
                  className="w-full h-[48px] flex items-center justify-center rounded-[8px] bg-[#0b5ed7] cursor-pointer hover:bg-[#0a4fb3] transition-colors"
                >
                  <p className="font-['Helvetica_Neue:Medium',sans-serif] text-[16px] text-white">Realizar novo check-in</p>
                </button>
              </div>
            </div>
          </>
        )}

        {/* Scenario: reservation-cancelled */}
        {QR_SCENARIOS[qrScenario] === "reservation-cancelled" && (
          <>
            <div className="flex-1 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[#8b9dc3] via-[#a8b5cc] to-[#6b7d99]" />
              <div className="absolute inset-0 bg-black/50 backdrop-blur-[16px]" />
            </div>

            <div className="absolute right-0 top-[64px] bottom-0 w-[576px] bg-white rounded-tl-[16px] shadow-[0_4px_8px_rgba(113,128,150,0.08),0_0_1px_rgba(113,128,150,0.04)] flex flex-col z-20">
              <div className="flex-1 flex flex-col items-center justify-center px-[24px]">
                {/* Error icon with halo */}
                <div className="relative flex items-center justify-center mb-[24px] size-[96px]">
                  <div className="absolute inset-0 rounded-full bg-[#fef3f2] border border-[#fecdca]" />
                  <div className="absolute inset-0 rounded-full" style={{ background: "linear-gradient(to bottom, transparent 0%, rgba(255,255,255,0.8) 100%)" }} />
                  <div className="relative size-[62px] rounded-full bg-[#d92d20] flex items-center justify-center">
                    <svg className="size-[34px]" fill="none" viewBox="0 0 20 20">
                      <path d="M6 6l8 8M14 6l-8 8" stroke="white" strokeWidth="1.875" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>

                <p className="font-['Helvetica_Neue:Medium',sans-serif] text-[18px] text-[#181d27] text-center leading-[normal]">Reserva cancelada</p>
                <p className="font-['Helvetica_Neue:Regular',sans-serif] text-[16px] text-[#717680] text-center leading-[normal] mt-[8px]">Esta reserva foi cancelada em 22/02. o Check-in não pode ser efetuado.</p>
              </div>

              <div className="shrink-0 flex flex-col gap-[12px] px-[24px] py-[24px]">
                <button
                  onClick={() => setShowQrScanner(false)}
                  className="w-full h-[48px] flex items-center justify-center rounded-[8px] border border-[#e2e8f0] bg-white cursor-pointer hover:bg-[#f8fafc] transition-colors"
                >
                  <p className="font-['Helvetica_Neue:Regular',sans-serif] text-[16px] text-[#414651]">Voltar aos participantes</p>
                </button>
                <button
                  onClick={() => setQrScenario(1)}
                  className="w-full h-[48px] flex items-center justify-center rounded-[8px] bg-[#0b5ed7] cursor-pointer hover:bg-[#0a4fb3] transition-colors"
                >
                  <p className="font-['Helvetica_Neue:Medium',sans-serif] text-[16px] text-white">Realizar novo check-in</p>
                </button>
              </div>
            </div>
          </>
        )}

        {/* Scenario: qr-not-recognized */}
        {QR_SCENARIOS[qrScenario] === "qr-not-recognized" && (
          <>
            <div className="flex-1 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[#8b9dc3] via-[#a8b5cc] to-[#6b7d99]" />
              <div className="absolute inset-0 bg-black/50 backdrop-blur-[16px]" />
            </div>

            <div className="absolute right-0 top-[64px] bottom-0 w-[576px] bg-white rounded-tl-[16px] shadow-[0_4px_8px_rgba(113,128,150,0.08),0_0_1px_rgba(113,128,150,0.04)] flex flex-col z-20">
              <div className="flex-1 flex flex-col items-center justify-center px-[24px]">
                {/* Gray icon with halo */}
                <div className="relative flex items-center justify-center mb-[24px] size-[96px]">
                  <div className="absolute inset-0 rounded-full bg-[#f9fafb] border border-[#eaecf0]" />
                  <div className="absolute inset-0 rounded-full" style={{ background: "linear-gradient(to bottom, transparent 0%, rgba(255,255,255,0.8) 100%)" }} />
                  <div className="relative size-[62px] rounded-full bg-[#535862] flex items-center justify-center">
                    <svg className="size-[34px]" fill="none" viewBox="0 0 48 48">
                      <path d="M16 8H18C18.5304 8 19.0391 8.21071 19.4142 8.58579C19.7893 8.96086 20 9.46957 20 10V12M19.406 19.422C19.0317 19.7922 18.5265 19.9999 18 20H10C9.46957 20 8.96086 19.7893 8.58579 19.4142C8.21071 19.0391 8 18.5304 8 18V10C8 9.45 8.22 8.952 8.58 8.59M14 34V34.02M14 14V14.02M34 14V14.02M40 28V28.02M28 28V34M28 40H34M6 6L42 42M28 10C28 9.46957 28.2107 8.96086 28.5858 8.58579C28.9609 8.21071 29.4696 8 30 8H38C38.5304 8 39.0391 8.21071 39.4142 8.58579C39.7893 8.96086 40 9.46957 40 10V18C40 18.5304 39.7893 19.0391 39.4142 19.4142C39.0391 19.7893 38.5304 20 38 20H30C29.4696 20 28.9609 19.7893 28.5858 19.4142C28.2107 19.0391 28 18.5304 28 18V10ZM8 30C8 29.4696 8.21071 28.9609 8.58579 28.5858C8.96086 28.2107 9.46957 28 10 28H18C18.5304 28 19.0391 28.2107 19.4142 28.5858C19.7893 28.9609 20 29.4696 20 30V38C20 38.5304 19.7893 39.0391 19.4142 39.4142C19.0391 39.7893 18.5304 40 18 40H10C9.46957 40 8.96086 39.7893 8.58579 39.4142C8.21071 39.0391 8 38.5304 8 38V30Z" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>

                <p className="font-['Helvetica_Neue:Medium',sans-serif] text-[18px] text-[#181d27] text-center leading-[normal]">QR code não reconhecido</p>
                <p className="font-['Helvetica_Neue:Regular',sans-serif] text-[16px] text-[#717680] text-center leading-[normal] mt-[8px]">Este código não pertence a Retrilhar ou está corrompido.</p>
              </div>

              <div className="shrink-0 flex flex-col gap-[12px] px-[24px] py-[24px]">
                <button
                  onClick={() => setShowQrScanner(false)}
                  className="w-full h-[48px] flex items-center justify-center rounded-[8px] border border-[#e2e8f0] bg-white cursor-pointer hover:bg-[#f8fafc] transition-colors"
                >
                  <p className="font-['Helvetica_Neue:Regular',sans-serif] text-[16px] text-[#414651]">Voltar aos participantes</p>
                </button>
                <button
                  onClick={() => setQrScenario(1)}
                  className="w-full h-[48px] flex items-center justify-center rounded-[8px] bg-[#0b5ed7] cursor-pointer hover:bg-[#0a4fb3] transition-colors"
                >
                  <p className="font-['Helvetica_Neue:Medium',sans-serif] text-[16px] text-white">Tentar novamente</p>
                </button>
              </div>
            </div>
          </>
        )}

        {/* Scenario: wrong-date */}
        {QR_SCENARIOS[qrScenario] === "wrong-date" && (
          <>
            <div className="flex-1 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[#8b9dc3] via-[#a8b5cc] to-[#6b7d99]" />
              <div className="absolute inset-0 bg-black/50 backdrop-blur-[16px]" />
            </div>

            <div className="absolute right-0 top-[64px] bottom-0 w-[576px] bg-white rounded-tl-[16px] shadow-[0_4px_8px_rgba(113,128,150,0.08),0_0_1px_rgba(113,128,150,0.04)] flex flex-col z-20">
              <div className="flex-1 flex flex-col items-center justify-center px-[24px]">
                {/* Warning icon with halo */}
                <div className="relative flex items-center justify-center mb-[24px] size-[96px]">
                  <div className="absolute inset-0 rounded-full bg-[#fefdf0] border border-[#fedf89]" />
                  <div className="absolute inset-0 rounded-full" style={{ background: "linear-gradient(to bottom, transparent 0%, rgba(255,255,255,0.8) 100%)" }} />
                  <div className="relative size-[62px] rounded-full bg-[#dc6803] flex items-center justify-center">
                    <svg className="size-[34px]" fill="none" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="9" stroke="white" strokeWidth="1.875" />
                      <path d="M12 8v4M12 16h.01" stroke="white" strokeWidth="1.875" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>

                <p className="font-['Helvetica_Neue:Medium',sans-serif] text-[18px] text-[#181d27] text-center leading-[normal]">Reserva confirmada para outra data</p>
                <p className="font-['Helvetica_Neue:Regular',sans-serif] text-[16px] text-[#717680] text-center leading-[normal] mt-[8px]">O participante João Silva está reservado para a atividade do dia 26/02. A atividade de hoje é 24/02.</p>

                {/* Participant card */}
                <div className="border border-[#f5f5f5] rounded-[16px] p-[16px] mt-[24px] w-full max-w-[480px]">
                  <div className="flex items-center gap-[12px]">
                    <div className="relative size-[40px] shrink-0">
                      <svg className="absolute inset-0 size-full" fill="none" viewBox="0 0 40 40"><circle cx="20" cy="20" r="19.5" fill="#EDF0FF" stroke="#D5DAFF"/></svg>
                      <p className="absolute inset-0 flex items-center justify-center font-['Helvetica_Neue:Medium',sans-serif] text-[14px] text-[#0b5ed7]">JS</p>
                    </div>
                    <div>
                      <p className="font-['Helvetica_Neue:Medium',sans-serif] text-[16px] text-[#181d27] leading-[normal]">João Silva</p>
                      <div className="flex items-center gap-[8px] mt-[2px]">
                        <div className="flex items-center gap-[6px]">
                          <svg className="size-[16px] text-[#717680] rotate-180 scale-x-[-1]" fill="none" viewBox="0 0 17.3334 17.3334">
                            <path d="M11.1667 0.750024C12.3288 0.750024 12.9098 0.750024 13.3894 0.86515C14.9129 1.23092 16.1025 2.42046 16.4682 3.944C16.5834 4.42353 16.5834 5.00459 16.5834 6.16669M6.16669 0.750024C5.00459 0.750024 4.42353 0.750024 3.944 0.86515C2.42047 1.23092 1.23092 2.42046 0.86515 3.944C0.750025 4.42353 0.750025 5.00459 0.750025 6.16669M6.16669 16.5834C5.00459 16.5834 4.42353 16.5834 3.944 16.4682C2.42047 16.1025 1.23092 14.9129 0.86515 13.3894C0.750025 12.9098 0.750025 12.3288 0.750025 11.1667M11.1667 16.5834C12.3288 16.5834 12.9098 16.5834 13.3894 16.4682C14.9129 16.1025 16.1025 14.9129 16.4682 13.3894C16.5834 12.9098 16.5834 12.3288 16.5834 11.1667" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M11.1667 10.7501C11.1667 12.1308 10.0474 13.2501 8.66669 13.2501C7.28598 13.2501 6.16669 12.1308 6.16669 10.7501C6.16669 9.3694 7.28598 8.25011 8.66669 8.25011C10.0474 8.25011 11.1667 9.3694 11.1667 10.7501Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M12.8334 4.08344C12.8334 6.38463 10.9679 8.25011 8.66669 8.25011C6.3655 8.25011 4.50002 6.38463 4.50002 4.08344" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          <p className="font-['Helvetica_Neue:Regular',sans-serif] text-[12px] text-[#717680]">ID: #8823</p>
                        </div>
                        <div className="flex items-center gap-[6px]">
                          <svg className="size-[16px] text-[#717680]" fill="none" viewBox="0 0 48 48">
                            <path d="M39.4171 15.3008C39.7314 14.9865 40.2729 14.9544 40.5915 15.3019C42.4569 17.3365 43.4892 18.843 43.8292 20.5115C44.0248 21.4713 44.0526 22.4485 43.9114 23.3988C43.5297 25.9673 41.4488 28.0482 37.2869 32.2102L32.2102 37.2869C28.0482 41.4488 25.9673 43.5297 23.3988 43.9114C22.4485 44.0526 21.4713 44.0248 20.5115 43.8292C18.8432 43.4893 17.3368 42.4571 15.3025 40.5921C14.9547 40.2732 14.9868 39.731 15.3015 39.4163C17.0539 37.664 16.9706 34.7396 15.1155 32.8845C13.2604 31.0294 10.336 30.9461 8.58367 32.6985C8.26902 33.0132 7.72682 33.0453 7.40791 32.6975C5.54291 30.6632 4.51072 29.1568 4.17077 27.4885C3.97518 26.5287 3.94736 25.5515 4.08857 24.6012C4.47025 22.0327 6.55121 19.9518 10.7131 15.7898L15.7898 10.7131C19.9518 6.55121 22.0327 4.47025 24.6012 4.08857C25.5515 3.94736 26.5287 3.97518 27.4885 4.17078C29.157 4.51076 30.6635 5.54315 32.6981 7.40853C33.0456 7.72709 33.0135 8.26864 32.6993 8.58293C30.9469 10.3353 31.0301 13.2597 32.8852 15.1148C34.7403 16.9699 37.6647 17.0531 39.4171 15.3008Z" stroke="currentColor" strokeWidth="4" strokeLinejoin="round"/>
                            <path d="M38 30L18 10" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          <p className="font-['Helvetica_Neue:Regular',sans-serif] text-[12px] text-[#717680]">Tarifa: Infantil</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer actions - 2 outline side by side + 1 primary full width */}
              <div className="shrink-0 flex flex-col gap-[12px] px-[24px] py-[24px]">
                <div className="flex gap-[12px]">
                  <button
                    onClick={() => setShowQrScanner(false)}
                    className="flex-1 h-[48px] flex items-center justify-center rounded-[8px] border border-[#e2e8f0] bg-white cursor-pointer hover:bg-[#f8fafc] transition-colors"
                  >
                    <p className="font-['Helvetica_Neue:Regular',sans-serif] text-[16px] text-[#414651]">Voltar aos participantes</p>
                  </button>
                  <button className="flex-1 h-[48px] flex items-center justify-center rounded-[8px] border border-[#e2e8f0] bg-white cursor-pointer hover:bg-[#f8fafc] transition-colors">
                    <p className="font-['Helvetica_Neue:Regular',sans-serif] text-[16px] text-[#414651]">Visualizar reserva</p>
                  </button>
                </div>
                <button
                  onClick={() => setQrScenario(1)}
                  className="w-full h-[48px] flex items-center justify-center rounded-[8px] bg-[#0b5ed7] cursor-pointer hover:bg-[#0a4fb3] transition-colors"
                >
                  <p className="font-['Helvetica_Neue:Medium',sans-serif] text-[16px] text-white">Realizar novo check-in</p>
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="w-full" style={{ paddingBottom: "40px" }}>
      {/* ── Sticky TopBar: search + QR check-in ── */}
      {searchBarHidden && (
        <div
          ref={stickyTopBarRef}
          className="sticky top-0 z-[11] bg-white shadow-[0px_2px_8px_0px_rgba(0,0,0,0.08)] animate-[fadeSlideDown_350ms_cubic-bezier(0.22,1,0.36,1)]"
          style={{ animationFillMode: "both" }}
        >
          {/* Search + QR row */}
          <div className="content-stretch flex gap-[16px] items-center relative w-full" style={{ padding: "16px 32px" }}>
            <div className="bg-white flex-1 min-w-0 relative rounded-[12px] border border-[#e5e7eb] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.04)]">
              <div className="content-stretch flex gap-[12px] items-center px-[18px] py-[14px] relative size-full">
                <svg className="shrink-0 size-[20px]" fill="none" viewBox="0 0 20 20"><circle cx="9" cy="9" r="6" stroke="#9ca3af" strokeWidth="1.5"/><path d="M13.5 13.5l3.5 3.5" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round"/></svg>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Buscar por nome, ID do pedido, etc..."
                  className="flex-1 font-['Helvetica_Neue:Light',sans-serif] leading-[normal] min-w-0 not-italic outline-none text-[15px] text-[#1f2937] placeholder:text-[#9ca3af] bg-transparent"
                />
              </div>
            </div>
            <button onClick={() => setShowQrScanner(true)} className="bg-white hover:bg-[#f8fafc] border border-[#e5e7eb] relative rounded-[12px] shrink-0 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.04)] transition-all duration-200 cursor-pointer">
              <div className="content-stretch flex gap-[8px] items-center justify-center px-[16px] py-[14px] relative size-full">
                <svg className="size-[20px] text-[#0b5ed7]" fill="none" viewBox="0 0 48 48" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round"><path d="M6 12C6 9.17157 6 7.75736 6.87868 6.87868C7.75736 6 9.17157 6 12 6C14.8284 6 16.2426 6 17.1213 6.87868C18 7.75736 18 9.17157 18 12C18 14.8284 18 16.2426 17.1213 17.1213C16.2426 18 14.8284 18 12 18C9.17157 18 7.75736 18 6.87868 17.1213C6 16.2426 6 14.8284 6 12Z"/><path d="M6 36C6 33.1716 6 31.7574 6.87868 30.8787C7.75736 30 9.17157 30 12 30C14.8284 30 16.2426 30 17.1213 30.8787C18 31.7574 18 33.1716 18 36C18 38.8284 18 40.2426 17.1213 41.1213C16.2426 42 14.8284 42 12 42C9.17157 42 7.75736 42 6.87868 41.1213C6 40.2426 6 38.8284 6 36Z"/><path d="M6 24L18 24" strokeLinejoin="round"/><path d="M24 6V16" strokeLinejoin="round"/><path d="M30 12C30 9.17157 30 7.75736 30.8787 6.87868C31.7574 6 33.1716 6 36 6C38.8284 6 40.2426 6 41.1213 6.87868C42 7.75736 42 9.17157 42 12C42 14.8284 42 16.2426 41.1213 17.1213C40.2426 18 38.8284 18 36 18C33.1716 18 31.7574 18 30.8787 17.1213C30 16.2426 30 14.8284 30 12Z"/><path d="M42 24H30C27.1716 24 25.7574 24 24.8787 24.8787C24 25.7574 24 27.1716 24 30M24 35.5385V41.0769M30 30V33C30 35.8927 31.5673 36 34 36C35.1046 36 36 36.8954 36 38M32 42H30M36 30C38.8284 30 40.2426 30 41.1213 30.88C42 31.7599 42 33.1762 42 36.0087C42 38.8412 42 40.2575 41.1213 41.1374C40.48 41.7796 39.5534 41.9531 38 42"/></svg>
                <p className="font-['Helvetica_Neue:Medium',sans-serif] leading-[normal] not-italic text-[14px] text-[#0b5ed7] whitespace-nowrap">Check-in via QR Code</p>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* Header — Activity banner with pattern */}
      <div className="relative w-full overflow-visible rounded-b-[24px]" style={{ background: "linear-gradient(135deg, #0b5ed7 0%, #084fb7 100%)" }}>
        {/* Topographic pattern SVG */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.08] pointer-events-none rounded-b-[24px] overflow-hidden" preserveAspectRatio="xMidYMid slice">
          <defs>
            <pattern id="topo-pattern" x="0" y="0" width="200" height="200" patternUnits="userSpaceOnUse">
              <path d="M0,50 Q50,40 100,50 T200,50" fill="none" stroke="white" strokeWidth="1.5" opacity="0.6"/>
              <path d="M0,80 Q50,70 100,80 T200,80" fill="none" stroke="white" strokeWidth="1.5" opacity="0.4"/>
              <path d="M0,110 Q50,100 100,110 T200,110" fill="none" stroke="white" strokeWidth="1.5" opacity="0.3"/>
              <path d="M0,140 Q50,130 100,140 T200,140" fill="none" stroke="white" strokeWidth="1.5" opacity="0.2"/>
              <circle cx="60" cy="60" r="3" fill="white" opacity="0.3"/>
              <circle cx="140" cy="90" r="2" fill="white" opacity="0.3"/>
              <circle cx="180" cy="130" r="2.5" fill="white" opacity="0.3"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#topo-pattern)"/>
        </svg>

        {/* Mountain silhouette decoration */}
        <div className="absolute bottom-0 left-0 right-0 h-[60px] opacity-[0.12] pointer-events-none rounded-b-[24px] overflow-hidden">
          <svg width="100%" height="100%" preserveAspectRatio="none" viewBox="0 0 1200 60">
            <path d="M0,60 L0,40 L150,15 L300,35 L450,10 L600,30 L750,20 L900,40 L1050,25 L1200,45 L1200,60 Z" fill="white"/>
          </svg>
        </div>

        <div className="flex flex-col gap-[12px] relative z-[1]" style={{ padding: "24px 32px 32px" }}>
            {/* Row 1: Breadcrumb */}
            <div className="flex items-center justify-between">
            <div className="flex items-center gap-[8px]">
              <button onClick={onBackToActivities} className="font-['Helvetica_Neue:Regular',sans-serif] text-[13px] text-white/60 hover:text-white transition-colors cursor-pointer">Agenda</button>
              <svg className="size-[12px] text-white/40" fill="none" viewBox="0 0 12 12"><path d="M4.5 2.5l4 4.5-4 4.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              <span className="font-['Helvetica_Neue:Regular',sans-serif] text-[13px] text-white/60">29 de maio</span>
              <svg className="size-[12px] text-white/40" fill="none" viewBox="0 0 12 12"><path d="M4.5 2.5l4 4.5-4 4.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              <span className="font-['Helvetica_Neue:Regular',sans-serif] text-[13px] text-white">Detalhes da atividade</span>
            </div>
            </div>
            {/* Title + capacity badge */}
            <div className="flex items-center gap-[12px]">
              <h1 className="font-['Helvetica_Neue:Medium',sans-serif] leading-[1.2] not-italic text-[24px] text-white">{activity.name}</h1>
              <div className="flex items-center gap-[4px] bg-white/15 backdrop-blur-sm border border-white/20 rounded-[6px] px-[8px] py-[4px]">
                <p className="font-['Helvetica_Neue:Regular',sans-serif] text-[12px] leading-none text-white">{totalCount}</p>
                <p className="font-['Helvetica_Neue:Regular',sans-serif] text-[11px] leading-none text-white/50">/</p>
                <p className="font-['Helvetica_Neue:Regular',sans-serif] text-[11px] leading-none text-white/70">{activity.capacity}</p>
                <p className="font-['Helvetica_Neue:Regular',sans-serif] text-[10px] leading-none text-white/50 ml-[2px]">participantes</p>
              </div>
            </div>

            {/* Enhanced metadata row + Concluir atividade */}
            <div className="flex items-center justify-between gap-[16px]">
            <div className="flex items-center gap-[16px] flex-wrap">
              {/* Info card - Date | Time | Location | Guide */}
              <div className="relative z-[1] flex items-center gap-[14px] bg-white/10 backdrop-blur-sm border border-white/15 rounded-[12px] px-[14px] py-[10px]">
                <div className="flex flex-col">
                  <p className="font-['Helvetica_Neue:Light',sans-serif] text-[10px] text-white/50 uppercase tracking-[0.5px]">Hoje</p>
                  <p className="font-['Helvetica_Neue:Regular',sans-serif] text-[14px] text-white">{(() => {
                    const [y, m, d] = activity.date.split("-");
                    const months = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];
                    return `${parseInt(d)} de ${months[parseInt(m) - 1]}`;
                  })()}</p>
                </div>
                <div className="w-[1px] h-[28px] bg-white/20" />
                <div className="flex flex-col">
                  <p className="font-['Helvetica_Neue:Light',sans-serif] text-[10px] text-white/50 uppercase tracking-[0.5px]">Horário</p>
                  <p className="font-['Helvetica_Neue:Regular',sans-serif] text-[14px] text-white">{activity.startTime} <span className="text-white/40">→</span> {activity.endTime}</p>
                </div>
                <div className="w-[1px] h-[28px] bg-white/20" />
                <div className="flex flex-col">
                  <p className="font-['Helvetica_Neue:Light',sans-serif] text-[10px] text-white/50 uppercase tracking-[0.5px]">Local</p>
                  <p className="font-['Helvetica_Neue:Regular',sans-serif] text-[14px] text-white">Portaria · Parque do Itacolomi</p>
                </div>
                <div className="w-[1px] h-[28px] bg-white/20" />
                <button onClick={() => setShowTeamModal(true)} className="flex flex-col items-start cursor-pointer hover:opacity-80 transition-opacity">
                  <p className="font-['Helvetica_Neue:Light',sans-serif] text-[10px] text-white/50 uppercase tracking-[0.5px]">Equipe responsável</p>
                  <div className="flex items-center gap-[6px]">
                    <p className="font-['Helvetica_Neue:Regular',sans-serif] text-[14px] text-white">{activity.assignedGuides.length} atribuído(s)</p>
                    <div className="group/info relative">
                      <svg className="size-[16px] text-white/40 hover:text-white/70 transition-colors" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M12 16v-4M12 8h.01" />
                      </svg>
                      <div className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-[8px] rounded-full bg-[#181d27] px-[14px] py-[6px] text-center whitespace-nowrap opacity-0 transition-opacity duration-150 group-hover/info:opacity-100 shadow-[0px_4px_12px_0px_rgba(0,0,0,0.25)] z-50">
                        <p className="font-['Helvetica_Neue:Regular',sans-serif] text-[11px] leading-[16px] text-white">{activity.assignedGuides.length} seguro(s) contratado(s)</p>
                        <div className="absolute top-full left-1/2 size-0 -translate-x-1/2 border-t-[5px] border-r-[5px] border-l-[5px] border-t-[#181d27] border-r-transparent border-l-transparent" />
                      </div>
                    </div>
                  </div>
                </button>
              </div>

              {/* Weather widget - contextual based on activity timing */}
              {(() => {
                const activityDate = new Date(activity.date + "T" + activity.startTime);
                const now = new Date();
                const isPast = activityDate < now && (now.getTime() - activityDate.getTime()) > 3 * 60 * 60 * 1000;
                const isNow = !isPast && Math.abs(now.getTime() - activityDate.getTime()) <= 3 * 60 * 60 * 1000;
                const weatherLabel = isPast ? "Estava" : isNow ? "Agora" : "Previsão";
                const weatherCondition = "Ensolarado";
                const temp = 16;

                return (
                  <div className="flex items-center gap-[10px] bg-gradient-to-r from-amber-400/15 to-orange-400/10 backdrop-blur-sm border border-amber-300/20 rounded-[12px] px-[14px] py-[10px]">
                    <div className="group relative">
                      <svg className="size-[28px] cursor-default" viewBox="0 0 32 32" fill="none">
                        <circle cx="16" cy="16" r="6" fill="#fbbf24" />
                        <g stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" opacity="0.8">
                          <path d="M16 5v3" /><path d="M16 24v3" />
                          <path d="M5 16h3" /><path d="M24 16h3" />
                          <path d="M8.2 8.2l2 2" /><path d="M21.8 21.8l2 2" />
                          <path d="M8.2 23.8l2-2" /><path d="M21.8 10.2l2-2" />
                        </g>
                      </svg>
                      <div className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-[8px] rounded-full bg-[#181d27] px-[14px] py-[6px] text-center whitespace-nowrap opacity-0 transition-opacity duration-150 group-hover:opacity-100 shadow-[0px_4px_12px_0px_rgba(0,0,0,0.25)] z-50">
                        <p className="font-['Helvetica_Neue:Regular',sans-serif] text-[11px] leading-[16px] text-white">{weatherCondition}</p>
                        <div className="absolute top-full left-1/2 size-0 -translate-x-1/2 border-t-[5px] border-r-[5px] border-l-[5px] border-t-[#181d27] border-r-transparent border-l-transparent" />
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <p className="font-['Helvetica_Neue:Light',sans-serif] text-[10px] text-amber-200/70 uppercase tracking-[0.5px]">Previsão</p>
                      <p className="font-['Helvetica_Neue:Regular',sans-serif] text-[14px] text-white">{temp}°C</p>
                    </div>
                  </div>
                );
              })()}

              {activity.requiresInsurance && (
                <div className="flex items-center gap-[6px] bg-emerald-500/15 backdrop-blur-sm border border-emerald-400/25 rounded-[10px] px-[12px] py-[8px]">
                  <svg className="shrink-0 size-[14px]" viewBox="0 0 16 16" fill="none">
                    <path d="M8 1.5c-1.5 0-2.9.33-4 .9-.5.25-.8.4-1 .8-.2.4-.2.8-.2 1.5v2.1c0 3.4 2.7 5.3 4.3 6.1.4.2.7.3 1 .3s.6-.1 1-.3c1.6-.8 4.3-2.7 4.3-6.1v-2.1c0-.7 0-1.1-.2-1.5-.2-.4-.5-.55-1-.8-1.1-.57-2.5-.9-4-.9Z" stroke="#86efac" strokeWidth="1.2"/>
                    <path d="M6 8l1.5 1.5L10 6" stroke="#86efac" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <p className="font-['Helvetica_Neue:Light',sans-serif] text-[12px] text-emerald-300">Seguro obrigatório</p>
                </div>
              )}
            </div>
            <div className="flex gap-[16px] items-end shrink-0 self-end">
              <div className="relative" ref={headerMoreActionsRef}>
                <button
                  onClick={() => setShowHeaderMoreActions(!showHeaderMoreActions)}
                  className="bg-white/10 backdrop-blur-sm hover:bg-white/15 border border-white/20 h-[40px] relative rounded-[8px] shrink-0 transition-all duration-200 cursor-pointer"
                >
                  <div className="content-stretch flex gap-[8px] items-center justify-center px-[16px] py-[10px] relative size-full">
                    <p className="font-['Helvetica_Neue:Medium',sans-serif] leading-[normal] not-italic text-[14px] text-white whitespace-nowrap">Mais ações</p>
                    <svg className={`size-[14px] text-white transition-transform duration-200 ${showHeaderMoreActions ? "rotate-180" : ""}`} fill="none" viewBox="0 0 16 16"><path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </div>
                </button>
                {showHeaderMoreActions && (
                  <div className="absolute bg-white border border-[#f5f5f5] border-solid mt-[4px] right-0 rounded-[8px] shadow-[0px_4px_16px_0px_rgba(0,0,0,0.12)] w-max min-w-[220px] z-40 p-[6px] flex flex-col gap-[4px]">
                    {[
                      "Listas e Manifestos",
                      "Editar atividade",
                      "Exportar participantes",
                      "Enviar comunicado",
                    ].map((label) => (
                      <button
                        key={label}
                        onClick={() => setShowHeaderMoreActions(false)}
                        className="cursor-pointer flex gap-[12px] items-center h-[40px] px-[12px] rounded-[6px] transition-colors w-full hover:bg-[#f8fafc] text-[#414651]"
                      >
                        <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic text-[14px] whitespace-nowrap text-[#414651]">{label}</p>
                      </button>
                    ))}
                    <div className="bg-[#f5f5f5] h-px w-full" />
                    <button
                      onClick={() => setShowHeaderMoreActions(false)}
                      className="cursor-pointer flex gap-[12px] items-center h-[40px] px-[12px] rounded-[6px] transition-colors w-full hover:bg-[#fef3f2] text-[#d92d20]"
                    >
                      <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic text-[14px] whitespace-nowrap text-[#d92d20]">Cancelar atividade</p>
                    </button>
                  </div>
                )}
              </div>
              <button className="bg-white hover:bg-white/95 h-[40px] relative rounded-[8px] shrink-0 shadow-[0_4px_12px_rgba(0,0,0,0.15)] transition-all duration-200 hover:shadow-[0_6px_16px_rgba(0,0,0,0.2)]">
                <div className="content-stretch flex gap-[8px] items-center justify-center px-[16px] relative size-full">
                  <p className="font-['Helvetica_Neue:Medium',sans-serif] leading-[normal] not-italic text-[14px] text-[#0b5ed7] whitespace-nowrap">Concluir atividade</p>
                </div>
              </button>
            </div>
            </div>
        </div>
      </div>

      {/* Search bar */}
      <div ref={searchBarRef} className="content-stretch flex gap-[16px] items-center mt-[24px] relative w-full" style={{ padding: "0 32px" }}>
        <div className="bg-white flex-1 min-w-0 relative rounded-[12px] border border-[#e5e7eb] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.04)]">
          <div className="content-stretch flex gap-[12px] items-center px-[18px] py-[14px] relative size-full">
            <svg className="shrink-0 size-[20px]" fill="none" viewBox="0 0 20 20"><circle cx="9" cy="9" r="6" stroke="#9ca3af" strokeWidth="1.5"/><path d="M13.5 13.5l3.5 3.5" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round"/></svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por nome, ID do pedido, etc..."
              className="flex-1 font-['Helvetica_Neue:Light',sans-serif] leading-[normal] min-w-0 not-italic outline-none text-[15px] text-[#1f2937] placeholder:text-[#9ca3af] bg-transparent"
            />
          </div>
        </div>
        <button onClick={() => setShowQrScanner(true)} className="bg-white hover:bg-[#f8fafc] border border-[#e5e7eb] relative rounded-[12px] shrink-0 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.04)] transition-all duration-200 cursor-pointer">
          <div className="content-stretch flex gap-[8px] items-center justify-center px-[16px] py-[14px] relative size-full">
            <svg className="size-[20px] text-[#0b5ed7]" fill="none" viewBox="0 0 48 48" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round"><path d="M6 12C6 9.17157 6 7.75736 6.87868 6.87868C7.75736 6 9.17157 6 12 6C14.8284 6 16.2426 6 17.1213 6.87868C18 7.75736 18 9.17157 18 12C18 14.8284 18 16.2426 17.1213 17.1213C16.2426 18 14.8284 18 12 18C9.17157 18 7.75736 18 6.87868 17.1213C6 16.2426 6 14.8284 6 12Z"/><path d="M6 36C6 33.1716 6 31.7574 6.87868 30.8787C7.75736 30 9.17157 30 12 30C14.8284 30 16.2426 30 17.1213 30.8787C18 31.7574 18 33.1716 18 36C18 38.8284 18 40.2426 17.1213 41.1213C16.2426 42 14.8284 42 12 42C9.17157 42 7.75736 42 6.87868 41.1213C6 40.2426 6 38.8284 6 36Z"/><path d="M6 24L18 24" strokeLinejoin="round"/><path d="M24 6V16" strokeLinejoin="round"/><path d="M30 12C30 9.17157 30 7.75736 30.8787 6.87868C31.7574 6 33.1716 6 36 6C38.8284 6 40.2426 6 41.1213 6.87868C42 7.75736 42 9.17157 42 12C42 14.8284 42 16.2426 41.1213 17.1213C40.2426 18 38.8284 18 36 18C33.1716 18 31.7574 18 30.8787 17.1213C30 16.2426 30 14.8284 30 12Z"/><path d="M42 24H30C27.1716 24 25.7574 24 24.8787 24.8787C24 25.7574 24 27.1716 24 30M24 35.5385V41.0769M30 30V33C30 35.8927 31.5673 36 34 36C35.1046 36 36 36.8954 36 38M32 42H30M36 30C38.8284 30 40.2426 30 41.1213 30.88C42 31.7599 42 33.1762 42 36.0087C42 38.8412 42 40.2575 41.1213 41.1374C40.48 41.7796 39.5534 41.9531 38 42"/></svg>
            <p className="font-['Helvetica_Neue:Medium',sans-serif] leading-[normal] not-italic text-[14px] text-[#0b5ed7] whitespace-nowrap">Check-in via QR Code</p>
          </div>
        </button>
      </div>

      {/* Filter tabs OR Bulk actions bar */}
      <div className={`${hasSelection ? "sticky z-[10]" : "relative"}`} style={{ padding: `${hasSelection && stickyTopBarHeight > 0 ? "0px" : "16px"} 32px 0 32px`, ...(hasSelection ? { top: stickyTopBarHeight > 0 ? `${stickyTopBarHeight + 16}px` : "0px" } : {}) }}>
      <div ref={bulkBarRef} className={`w-full rounded-[12px] h-[52px] flex items-center transition-colors ${hasSelection ? "bg-[#181d27] shadow-[0px_4px_16px_0px_rgba(0,0,0,0.15)]" : "bg-white"}`} style={{ padding: "0 16px" }}>
        {!hasSelection && <div aria-hidden="true" className="absolute border border-[#f5f5f5] border-solid inset-0 pointer-events-none rounded-[12px]" />}
        {hasSelection ? (
          /* ── Bulk actions bar — dark style ── */
          <div className="flex items-center gap-[16px] relative transition-all duration-200 w-full">
            {/* Select all checkbox */}
            <button onClick={toggleSelectAll} className="cursor-pointer flex items-center justify-center shrink-0">
              <div className="flex items-center justify-center rounded-[6px] size-[24px] bg-[#0b5ed7]">
                {isAllSelected ? (
                  <svg className="size-[14px]" fill="none" viewBox="0 0 14 14"><path d="M3 7l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                ) : (
                  <svg className="size-[14px]" fill="none" viewBox="0 0 14 14"><path d="M4 7h6" stroke="white" strokeWidth="2" strokeLinecap="round"/></svg>
                )}
              </div>
            </button>
            <p className="font-['Helvetica_Neue:Regular',sans-serif] text-[14px] text-white whitespace-nowrap">{selectedIds.size} selecionados <span className="text-white/50">de {allParticipantIds.length}</span></p>
            {/* Divider */}
            <div className="w-px h-[24px] bg-white/20" />
            {/* Actions group */}
            <div className="flex items-center gap-[8px]">
            {/* Check-in button — white bg */}
            {(() => {
              const isRealizarMode = checkInLabel === "Realizar Check-in's";
              return (
              <button
                onClick={() => handleBulkAction(isRealizarMode ? "check-in" : "undo-check-in", checkInLabel)}
                className="flex gap-[6px] items-center px-[14px] py-[8px] rounded-[8px] shrink-0 cursor-pointer bg-white hover:bg-white/90 transition-all"
              >
                <svg className="shrink-0 size-[16px]" fill="none" viewBox="0 0 16 16"><path d="M4.5 8l2.5 2.5 4.5-5" stroke="#0b5ed7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                <span className="font-['Helvetica_Neue:Regular',sans-serif] text-[13px] text-[#181d27] whitespace-nowrap">{isRealizarMode ? "Realizar Check-in" : "Desfazer Check-in"}</span>
              </button>
              );
            })()}
            {/* Confirm/Undo button — outline style, red when undoing */}
            {(() => {
              const isUndoMode = confirmLabel !== "Confirmar reservas";
              return (
                <button
                  onClick={() => handleBulkAction(isUndoMode ? "undo-confirm" : "confirm", confirmLabel)}
                  className={`cursor-pointer flex gap-[6px] items-center px-[14px] py-[8px] rounded-[8px] shrink-0 border transition-colors ${
                    isUndoMode
                      ? "border-[#f87171] bg-transparent hover:bg-[#fef2f2]/20 text-[#f87171]"
                      : "border-white/30 bg-transparent hover:bg-white/10"
                  }`}
                >
                  <svg className="shrink-0 size-[16px]" fill="none" viewBox="0 0 16 16">
                    <path d="M4 8l2.5 2.5M6.5 10.5L12 4" stroke={isUndoMode ? "#f87171" : "white"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span className={`font-['Helvetica_Neue:Regular',sans-serif] text-[13px] whitespace-nowrap ${isUndoMode ? "text-[#f87171]" : "text-white"}`}>{confirmLabel}</span>
                </button>
              );
            })()}
            {/* More actions dropdown — dark bg */}
            <div className="relative">
              <button onClick={() => setShowMoreActions(!showMoreActions)} className="cursor-pointer flex gap-[6px] items-center px-[14px] py-[8px] rounded-[8px] shrink-0 bg-[#414651] hover:bg-[#535862] transition-colors">
                <span className="font-['Helvetica_Neue:Regular',sans-serif] text-[13px] text-white whitespace-nowrap">Mais ações</span>
                <svg className="shrink-0 size-[12px]" fill="none" viewBox="0 0 12 12"><path d="M3 4.5l3 3 3-3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
              {showMoreActions && (
                <div className="absolute bg-white border border-[#e9eaeb] mt-[4px] right-0 rounded-[10px] shadow-[0px_4px_16px_0px_rgba(0,0,0,0.12)] w-[260px] z-20 py-[4px]">
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
                      <p className={`font-['Helvetica_Neue:Regular',sans-serif] text-[14px] ${destructive ? "text-[#d92d20]" : "text-[#414651]"}`}>{label}</p>
                    </button>
                  ))}
                </div>
              )}
            </div>
            </div>
            {/* Spacer + Clear selection — right aligned */}
            <div className="flex-1" />
            <button onClick={clearSelection} className="cursor-pointer flex items-center gap-[6px] px-[12px] py-[6px] rounded-[6px] hover:bg-white/10 transition-colors">
              <svg className="size-[14px]" fill="none" viewBox="0 0 14 14"><path d="M3.5 3.5l7 7M10.5 3.5l-7 7" stroke="white" strokeWidth="1.3" strokeLinecap="round"/></svg>
              <span className="font-['Helvetica_Neue:Regular',sans-serif] text-[13px] text-white/80 whitespace-nowrap">Limpar seleção</span>
            </button>
          </div>
        ) : (
          /* ── Filter tabs + Sort/Filters ── */
          <div className="flex items-center justify-between w-full">
            {/* Left: Tabs */}
            <div className="content-stretch flex gap-[3px] items-center relative transition-all duration-200">
              {/* Select-all checkbox (unchecked) */}
              <button onClick={toggleSelectAll} className="cursor-pointer flex items-center justify-center shrink-0 mr-[10px]" style={{ padding: "1px 0", width: "18px" }}>
                <div className="flex items-center justify-center rounded-[4px] size-[18px] border border-[#dfe3e8] bg-white hover:border-[#b8bcc4] transition-colors" />
              </button>
              {filters.map(({ key, label, count }) => (
                <button
                  key={key}
                  onClick={() => setActiveFilter(key)}
                  className={`cursor-pointer flex gap-[6px] items-center px-[10px] py-[5px] relative rounded-[6px] shrink-0 transition-all ${activeFilter === key ? "bg-[#f8fafc]" : "hover:bg-[#fafbfc]"}`}
                >
                  <p className={`font-['Helvetica_Neue:Light',sans-serif] leading-[normal] not-italic text-[13px] whitespace-nowrap ${activeFilter === key ? "text-[#1a202c] font-['Helvetica_Neue:Regular',sans-serif]" : "text-[#64748b]"}`}>{label}</p>
                  <div className={`rounded-[4px] shrink-0 px-[5px] py-[1px] ${activeFilter === key ? "bg-[#e2e8f0]" : "bg-[#f1f5f9]"}`}>
                    <p className={`font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic text-[11px] ${activeFilter === key ? "text-[#475569]" : "text-[#94a3b8]"}`}>{count}</p>
                  </div>
                </button>
              ))}
            </div>
            {/* Right: Ordenar + Filtros */}
            <div className="flex items-center gap-[8px]">
              {/* Ordenar */}
              <div className="relative">
                <button
                  onClick={() => { setShowSort(!showSort); setShowFilters(false); }}
                  className="flex gap-[6px] items-center px-[12px] py-[6px] rounded-[6px] shrink-0 cursor-pointer hover:bg-[#f8fafc] transition-all"
                >
                  <p className="font-['Helvetica_Neue:Light',sans-serif] leading-[normal] not-italic text-[13px] text-[#64748b] whitespace-nowrap">Ordenar</p>
                  <svg className="shrink-0 size-[12px]" fill="none" viewBox="0 0 12 12"><path d="M3 4.5l3 3 3-3" stroke="#94a3b8" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </button>
                {showSort && (
                  <div className="absolute bg-white border border-[#e9ecef] border-solid mt-[4px] right-0 rounded-[8px] shadow-[0px_2px_8px_0px_rgba(0,0,0,0.08)] w-[180px] z-20 overflow-hidden">
                    {["Alfabética", "Número de pedido", "Data da reserva"].map((opt) => (
                      <button key={opt} onClick={() => setShowSort(false)} className="cursor-pointer font-['Helvetica_Neue:Light',sans-serif] hover:bg-[#f8f9fa] leading-[normal] not-italic px-[12px] py-[8px] text-[13px] text-[#4a5568] text-left transition-colors w-full">
                        {opt}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {/* Filtros */}
              <div className="relative">
                <button
                  onClick={() => { setShowFilters(!showFilters); setShowSort(false); }}
                  className="flex gap-[6px] items-center px-[12px] py-[6px] rounded-[6px] shrink-0 cursor-pointer hover:bg-[#f8fafc] transition-all"
                >
                  <svg className="shrink-0 size-[14px]" fill="none" viewBox="0 0 14 14"><path d="M1.75 2.625h10.5M3.5 7h7M4.9 11.375h4.2" stroke="#94a3b8" strokeWidth="1.3" strokeLinecap="round"/></svg>
                  <p className="font-['Helvetica_Neue:Light',sans-serif] leading-[normal] not-italic text-[13px] text-[#64748b] whitespace-nowrap">Filtros</p>
                </button>
                {showFilters && <FiltersDrawer onClose={() => setShowFilters(false)} />}
              </div>
            </div>
          </div>
        )}
      </div>
      </div>

      {/* Reservation list — Figma-faithful layout */}
      <div className="content-stretch flex flex-col items-start mt-[20px] relative w-full" style={{ minHeight: "calc(100vh - 320px)", padding: "0 32px" }}>
        {filteredReservations.map((r, idx) => {
          const isGroup = r.type === "group";
          const expanded = expandedGroups.has(r.id);
          const isGroupAnimating = animatingGroups.has(r.id);
          const pendingCount = r.participants.filter((p) => p.checkInStatus === "Pending").length;
          const doneCount = r.participants.filter((p) => p.checkInStatus === "Done").length;

          return (
            <div key={r.id} className={`relative rounded-[12px] shrink-0 w-full mb-[20px] border border-solid shadow-[0px_1px_2px_0px_rgba(10,13,18,0.03)] transition-all duration-150 hover:shadow-[0px_2px_4px_0px_rgba(10,13,18,0.08)] overflow-visible ${r.participants.some((p) => selectedIds.has(p.id)) ? "bg-[#f0f5ff] border-[#c7d4f4]" : "bg-white border-[#EEF0F4]"}`}>
              {/* ── Reservation header ── */}
              <div className={`flex h-[40px] items-center relative w-full rounded-t-[12px] transition-colors ${r.participants.some((p) => selectedIds.has(p.id)) ? "bg-[#f0f5ff]" : ""}`}>
                {/* Left bar removed per design update */}
                <div className="flex gap-[8px] items-center size-full" style={{ padding: "0 16px 0 16px" }}>
                  {/* Type chip — icon + count */}
                  <div className="flex items-center gap-[4px] rounded-[6px] shrink-0 px-[6px] py-[3px] border bg-[#f8fafc] border-[#e2e8f0]">
                    <svg className="size-[12px]" fill="none" viewBox="0 0 24 24">
                      {isGroup ? (
                        <>
                          <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2" stroke="#64748b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          <circle cx="9" cy="7" r="4" stroke="#64748b" strokeWidth="1.5"/>
                          <path d="M22 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="#64748b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </>
                      ) : (
                        <>
                          <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" stroke="#64748b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          <circle cx="12" cy="7" r="4" stroke="#64748b" strokeWidth="1.5"/>
                        </>
                      )}
                    </svg>
                    <span className="font-['Helvetica_Neue:Regular',sans-serif] text-[11px] leading-none text-[#475569]">{r.participants.length}</span>
                  </div>
                  {/* Title */}
                  <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic text-[13px] text-[#252b37] whitespace-nowrap">{isGroup ? "Reserva em grupo" : "Reserva individual"}</p>
                  {/* Large group chip (10+) */}
                  {isGroup && r.participants.length >= 10 && (
                    <span className="bg-[#eff6ff] text-[#0b5ed7] text-[10px] font-['Helvetica_Neue:Medium',sans-serif] px-[6px] py-[2px] rounded-[4px]">Grupo grande</span>
                  )}
                  <div className="relative group flex items-center gap-[4px]">
                    <button onClick={() => handleCopyId(r.orderId)} className="cursor-pointer font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic text-[12px] text-[#717680] whitespace-nowrap hover:text-[#0b5ed7] transition-colors">{r.orderId}</button>
                    <button onClick={() => handleCopyId(r.orderId)} className="cursor-pointer shrink-0 size-[12px] hover:opacity-70 transition-opacity">
                      <svg className="block size-full" fill="none" viewBox="0 0 16 16"><rect x="4.5" y="4.5" width="9" height="9" rx="1.5" stroke="#717680" strokeWidth="1.2"/><path d="M11 4.5V3a1.5 1.5 0 00-1.5-1.5H3.5A1.5 1.5 0 002 3v6.5A1.5 1.5 0 003.5 11H5" stroke="#717680" strokeWidth="1.2"/></svg>
                    </button>
                    <div className={`absolute bg-[#181d27] bottom-full left-1/2 -translate-x-1/2 mb-[6px] px-[8px] py-[4px] rounded-[6px] text-center transition-opacity duration-150 pointer-events-none whitespace-nowrap z-50 ${copiedId === r.orderId ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}>
                      <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic text-[11px] text-white">{copiedId === r.orderId ? "Copiado!" : "Copiar ID"}</p>
                      <div className="absolute left-1/2 -translate-x-1/2 top-full size-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[5px] border-t-[#181d27]" />
                    </div>
                  </div>
                  {/* Spacer */}
                  <div className="flex-1" />
                  {/* Payment status chip (right edge) */}
                  {r.status !== "Cancelled" && r.paymentStatus === "Paid" && (
                    <span className="bg-[#ecfdf3] text-[#079455] text-[10px] font-['Helvetica_Neue:Medium',sans-serif] px-[6px] py-[2px] rounded-[4px]">Pedido pago</span>
                  )}
                  {r.status !== "Cancelled" && r.paymentStatus === "Partial" && (
                    <span className="bg-[#fef3c7] text-[#d97706] text-[10px] font-['Helvetica_Neue:Medium',sans-serif] px-[6px] py-[2px] rounded-[4px]">Pagamento parcial</span>
                  )}
                  {r.status !== "Cancelled" && r.paymentStatus === "Pending" && (
                    <span className="bg-[#fef3c7] text-[#d97706] text-[10px] font-['Helvetica_Neue:Medium',sans-serif] px-[6px] py-[2px] rounded-[4px]">Aguardando pagamento</span>
                  )}
                  {r.status === "Cancelled" && (
                    <span className="bg-[#f3f4f6] text-[#6b7280] text-[10px] font-['Helvetica_Neue:Medium',sans-serif] px-[6px] py-[2px] rounded-[4px]">Cancelada</span>
                  )}
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
                const isNoShow = r.status === "NoShow";
                const isExpired = r.status === "Expired";
                const isPerformed = r.status === "Performed";
                const isIndividualAbsent = !isCancelled && !isNoShow && p.checkInStatus === "Absent";
                const isDone = p.checkInStatus === "Done";
                const checkInDisabled = isCancelled || r.status === "AwaitingPayment" || isNoShow || isExpired || isPerformed;
                const isLastRow = pIdx === visibleParticipants.length - 1;
                const hasExpandButton = isGroup && r.participants.length > 1;
                return (
                  <div key={p.id} className={`border-t border-[#f5f5f5] flex min-h-[52px] items-center relative w-full cursor-pointer transition-colors ${selectedIds.has(p.id) ? "bg-[#f0f5ff] hover:bg-[#e8eeff]" : "hover:bg-[#f8fafc]"} ${isLastRow && !hasExpandButton ? "rounded-b-[12px]" : ""}`} style={{ paddingLeft: "16px" }} onClick={() => setDrawerData({ r, p })}>
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
                    <div className="flex gap-[12px] items-center shrink-0 overflow-hidden" style={{ width: "240px", padding: "8px 16px" }}>
                      <div className="flex flex-col gap-0 items-start min-w-0 flex-1 overflow-hidden">
                        <p className={`font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic text-[14px] text-[#0a0a0a] truncate w-full ${isCancelled || isIndividualAbsent ? "line-through" : ""}`}>{p.name}</p>
                        <div className={`flex gap-[4px] items-center min-w-0 overflow-hidden ${isGroup && r.participants[0].id === p.id ? "mt-[-2px]" : ""}`}>
                          {isGroup && r.participants[0].id === p.id && (
                            <>
                              <span className="size-[5px] rounded-full bg-[#0b5ed7] shrink-0" />
                              <span className="font-['Helvetica_Neue:Regular',sans-serif] text-[12px] text-[#0b5ed7] shrink-0">Comprador</span>
                              <span className="text-[#a1a1aa] shrink-0">·</span>
                            </>
                          )}
                          <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic text-[12px] text-[#a1a1aa] whitespace-nowrap">{getParticipantReservationId(p.id)} · {p.age} anos</p>
                        </div>
                      </div>
                    </div>
                    {/* Vertical divider */}
                    <div className="w-[1px] h-[32px] bg-[#e9eaeb] shrink-0" />
                    {/* Tariff type */}
                    <ParticipantTariffCell tariffType={p.tariffType} />
                    {/* Vertical divider */}
                    <div className="w-[1px] h-[32px] bg-[#e9eaeb] shrink-0" />
                    {/* Reservation status */}
                    <ParticipantReservationStatusCell reservation={r} participant={p} />
                    {/* Vertical divider */}
                    <div className="w-[1px] h-[32px] bg-[#e9eaeb] shrink-0" />
                    {/* Badges — atributos do participante */}
                    <div className="flex flex-1 items-center min-w-0" style={{ padding: "10px 12px" }}>
                      <ParticipantBadgesRow participant={p} insuranceStatus={isParticipantInsured(p.id) ? "Contracted" : "Required"} requiresInsurance={true} reservationStatus={r.status} paymentStatus={r.paymentStatus} onPaymentClick={() => setPaymentDrawerRes(r)} isBuyer={r.participants[0].id === p.id} />
                    </div>
                    {/* Actions cell */}
                    <div className="flex gap-[10px] items-center shrink-0" style={{ padding: "14px 16px 14px 12px" }}>
                      {/* Three-dot menu */}
                      <ParticipantMenu reservation={r} participant={p} onAction={handleMenuAction} participantInsured={isParticipantInsured(p.id)} />
                      <CheckInButton isDone={isDone} disabled={checkInDisabled} onCheckIn={() => handleCheckIn(p)} onUndo={() => handleUndoCheckIn(p)} />
                    </div>
                  </div>
                );
              })}
                    {/* Expandable rest of group */}
                    {isGroup && restParticipants.length > 0 && (
                      <div
                        className={`grid transition-[grid-template-rows,opacity] duration-300 ease-in-out ${expanded ? "opacity-100" : "opacity-0"} ${expanded && !isGroupAnimating ? "overflow-visible" : "overflow-hidden"}`}
                        style={{ gridTemplateRows: expanded ? "1fr" : "0fr" }}
                      >
                        <div className="min-h-0 overflow-visible">
                          {restParticipants.map((p) => {
                            const isCancelled = r.status === "Cancelled";
                            const isNoShow = r.status === "NoShow";
                            const isExpired = r.status === "Expired";
                            const isPerformed = r.status === "Performed";
                            const isIndividualAbsent = !isCancelled && !isNoShow && p.checkInStatus === "Absent";
                            const isDone = p.checkInStatus === "Done";
                            const checkInDisabled = isCancelled || r.status === "AwaitingPayment" || isNoShow || isExpired || isPerformed;
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
                                <div className="flex gap-[12px] items-center shrink-0 overflow-hidden" style={{ width: "240px", padding: "8px 16px" }}>
                                  <div className="flex flex-col gap-0 items-start min-w-0 flex-1 overflow-hidden">
                                    <p className={`font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic text-[14px] text-[#0a0a0a] truncate w-full ${isCancelled || isIndividualAbsent ? "line-through" : ""}`}>{p.name}</p>
                                    <div className="flex gap-[4px] items-center">
                                      <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic text-[12px] text-[#a1a1aa] whitespace-nowrap">{getParticipantReservationId(p.id)} · {p.age} anos</p>
                                    </div>
                                  </div>
                                </div>
                                <div className="w-[1px] h-[32px] bg-[#e9eaeb] shrink-0" />
                                <ParticipantTariffCell tariffType={p.tariffType} />
                                <div className="w-[1px] h-[32px] bg-[#e9eaeb] shrink-0" />
                                {/* Reservation status */}
                                <ParticipantReservationStatusCell reservation={r} participant={p} />
                                <div className="w-[1px] h-[32px] bg-[#e9eaeb] shrink-0" />
                                <div className="flex flex-1 items-center min-w-0" style={{ padding: "8px 12px" }}>
                                  <ParticipantBadgesRow participant={p} insuranceStatus={isParticipantInsured(p.id) ? "Contracted" : "Required"} requiresInsurance={true} reservationStatus={r.status} paymentStatus={r.paymentStatus} onPaymentClick={() => setPaymentDrawerRes(r)} isBuyer={false} />
                                </div>
                                <div className="flex gap-[10px] items-center shrink-0" style={{ padding: "10px 16px 10px 12px" }}>
                                  <ParticipantMenu reservation={r} participant={p} onAction={handleMenuAction} participantInsured={isParticipantInsured(p.id)} />
                                  <CheckInButton isDone={isDone} disabled={checkInDisabled} onCheckIn={() => handleCheckIn(p)} onUndo={() => handleUndoCheckIn(p)} />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </>
                );
              })()}
              {/* Collapsed: +X participantes / Expanded: Recolher */}
              {isGroup && r.participants.length > 1 && (
                <button
                  onClick={() => toggleGroup(r.id)}
                  className={`group/expand flex items-center justify-center gap-[6px] px-[16px] py-[10px] w-full cursor-pointer transition-all duration-200 rounded-b-[12px] border-t ${
                    expanded
                      ? "border-[#e9eaeb] bg-[#f5f5f5] hover:bg-[#ebebeb]"
                      : "border-[#e9eaeb] bg-[#f5f5f5] hover:bg-[#ebebeb]"
                  }`}
                >
                  <svg className="size-[14px] transition-colors duration-200 text-[#414651]" fill="none" viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="1.5"/><path d="M22 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  <p className="font-['Helvetica_Neue:Medium',sans-serif] leading-[normal] not-italic text-[12px] transition-colors duration-200 text-[#414651]">
                    {expanded ? `Recolher (${r.participants.length})` : `+${r.participants.length - 1} participante${r.participants.length - 1 > 1 ? "s" : ""}`}
                  </p>
                  <svg className={`size-[12px] transition-all duration-200 text-[#414651] ${expanded ? "rotate-180" : ""}`} fill="none" viewBox="0 0 16 16"><path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </button>
              )}
            </div>
          );
        })}
      </div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      {/* Participant data drawer */}
      {drawerData && (
        <ParticipantDrawer
          participant={drawerData.p}
          reservation={drawerData.r}
          onClose={() => setDrawerData(null)}
          activity={activity}
          isInsured={isParticipantInsured(drawerData.p.id)}
          onCheckIn={(pp) => { setDrawerData(null); setCheckInModal([pp]); }}
          onUndoCheckIn={(pp) => { dispatch({ type: "UNDO_CHECK_IN", participantId: pp.id }); showToast(`Check-in de ${pp.name.split(" ")[0]} desfeito.`); setDrawerData(null); }}
          onNoShow={(rr, pp) => { setDrawerData(null); setNoShowModal({ r: rr, p: pp }); }}
        />
      )}
      {/* Payment drawer */}
      {paymentDrawerRes && <PaymentDrawer reservation={paymentDrawerRes} onClose={() => setPaymentDrawerRes(null)} />}
      {/* Team modal */}
      {showTeamModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" onKeyDown={(e) => e.key === "Escape" && setShowTeamModal(false)}>
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowTeamModal(false)} />
          <div className="bg-white max-w-[480px] relative rounded-[16px] shadow-[0px_8px_24px_0px_rgba(0,0,0,0.15)] w-full z-10">
            {/* Header */}
            <div className="flex items-center justify-between p-[24px] pb-[16px]">
              <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic text-[16px] text-[#181d27]">Equipe responsável</p>
              <button onClick={() => setShowTeamModal(false)} className="cursor-pointer flex items-center justify-center rounded-full size-[32px] hover:bg-[#f5f5f5] transition-colors">
                <svg className="size-[16px]" fill="none" viewBox="0 0 16 16"><path d="M4 4l8 8M12 4l-8 8" stroke="#717680" strokeWidth="1.5" strokeLinecap="round"/></svg>
              </button>
            </div>
            {/* Search + dropdown */}
            <div className="px-[24px] pb-[8px]">
              <div className="bg-white relative rounded-[10px] border border-[#e9eaeb]">
                <div className="flex gap-[8px] items-center px-[14px] py-[10px]">
                  <svg className="shrink-0 size-[16px]" fill="none" viewBox="0 0 20 20"><circle cx="9" cy="9" r="6" stroke="#a4a7ae" strokeWidth="1.5"/><path d="M14 14l3 3" stroke="#a4a7ae" strokeWidth="1.5" strokeLinecap="round"/></svg>
                  <input type="text" placeholder="Buscar por nome..." className="flex-1 font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] min-w-0 not-italic outline-none text-[14px] text-[#414651] placeholder:text-[#a4a7ae] bg-transparent" />
                  <svg className="shrink-0 size-[16px] text-[#a4a7ae] cursor-pointer hover:text-[#717680] transition-colors" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </div>
              </div>
            </div>
            {/* Team list */}
            <div className="px-[24px] pb-[24px] pt-[8px]">
              <p className="font-['Helvetica_Neue:Regular',sans-serif] text-[12px] text-[#a4a7ae] uppercase tracking-[0.5px] mb-[12px]">Equipe atribuída</p>
              <div className="flex flex-col gap-[8px]">
                {activity.assignedGuides.map((guide, i) => {
                  const hasInsurance = i === 0;
                  const hasConflict = i === 1;
                  return (
                    <div key={i} className="rounded-[10px] border border-[#f5f5f5] bg-[#fafafa] overflow-hidden">
                      <div className="flex items-center gap-[16px] bg-white border border-[#f5f5f5] rounded-[10px] px-[16px] py-[14px]">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-[6px]">
                            <p className="font-['Helvetica_Neue:Regular',sans-serif] text-[14px] text-[#314158]">{guide}</p>
                            {hasInsurance ? (
                              <div className="flex items-center gap-[4px] bg-[#ecfdf3] border-[0.5px] border-[#a6f4c5] rounded-[4px] px-[6px] py-[2px]">
                                <p className="font-['Helvetica_Neue:Regular',sans-serif] text-[12px] text-[#079455] whitespace-nowrap">Seguro contratado</p>
                              </div>
                            ) : (
                              <div className="flex items-center gap-[4px] bg-[#fff7eb] border-[0.5px] border-[#fef0c7] rounded-[4px] px-[6px] py-[2px]">
                                <p className="font-['Helvetica_Neue:Regular',sans-serif] text-[12px] text-[#dc6803] whitespace-nowrap">Sem seguro</p>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-[8px] shrink-0">
                          {!hasInsurance && (
                            <button className="cursor-pointer flex items-center gap-[6px] px-[12px] py-[6px] rounded-[8px] border border-[#e9eaeb] bg-white hover:bg-[#f8fafc] transition-colors">
                              <svg className="shrink-0 size-[14px]" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#414651" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z M9 12l2 2 4-4"/></svg>
                              <p className="font-['Helvetica_Neue:Regular',sans-serif] text-[13px] text-[#414651] whitespace-nowrap">Contratar seguro</p>
                            </button>
                          )}
                          <button className="cursor-pointer flex items-center justify-center rounded-full size-[28px] hover:bg-[#fef3f2] transition-colors">
                            <svg className="size-[14px]" fill="none" viewBox="0 0 14 14"><path d="M3.5 3.5l7 7M10.5 3.5l-7 7" stroke="#d92d20" strokeWidth="1.3" strokeLinecap="round"/></svg>
                          </button>
                        </div>
                      </div>
                      {hasConflict && (
                        <div className="flex items-center gap-[6px] px-[12px] py-[12px] bg-[#fafafa]">
                          <div className="flex items-center gap-[6px] bg-[#fff7eb] border-[0.5px] border-[#fef0c7] rounded-[4px] px-[6px] py-[2px]">
                            <svg className="shrink-0 size-[16px]" fill="none" viewBox="0 0 24 24" strokeWidth="1.2" stroke="#dc6803" strokeLinecap="round" strokeLinejoin="round">
                              <circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/>
                            </svg>
                            <p className="font-['Helvetica_Neue:Regular',sans-serif] text-[12px] text-[#536278]">Já escalado em <strong className="text-[#1b71fd]">"Rapel Cachoeira Alta"</strong>, das 09:00 às 12:00.</p>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
            {/* Footer — insurance info */}
            <div className="border-t border-[#f5f5f5] px-[24px] py-[16px] flex items-center justify-between">
              <div className="flex items-center gap-[6px]">
                <svg className="size-[16px] text-emerald-500" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z M9 12l2 2 4-4"/></svg>
                <p className="font-['Helvetica_Neue:Regular',sans-serif] text-[13px] text-[#414651]">{activity.assignedGuides.length} seguro(s) contratado(s)</p>
              </div>
            </div>
          </div>
        </div>
      )}
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

export default function AgendaAtualizacoes({ initialTab = "atualizacoes", onBackToActivities, activityId = "act-001", initialOverlay }: { initialTab?: string; onBackToActivities?: () => void; activityId?: string; initialOverlay?: string }) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const activity = mockActivities.find((a) => a.id === activityId) || mockActivities[0];
  const activityHeaderTeam = getActivityHeaderTeam(activity);

  return (
    <div className="fixed inset-0 z-50 bg-[#f8fafc] flex flex-col" data-name="AGENDA - ATUALIZAÇÕES">
      {/* ── Fullscreen header ── */}
      <header className="shrink-0 border-b border-[#e9eaeb] bg-white">
        <div className="flex h-[56px] items-center px-[20px]">
          {/* Left: logo + title */}
          <div className="flex items-center gap-[16px]">
            <img src="/src/assets/retrilhar-logo.png" alt="Retrilhar" className="h-[24px]" />
            <div className="w-px h-[20px] bg-[#e9eaeb]" />
            <p className="font-['Helvetica_Neue:Regular',sans-serif] text-[14px] text-[#252b37]">Detalhes da atividade</p>
          </div>
          {/* Right: close */}
          <button
            onClick={onBackToActivities}
            className="ml-auto flex gap-[6px] items-center px-[14px] py-[8px] rounded-[8px] border border-[#e9eaeb] bg-white cursor-pointer hover:bg-[#f8fafc] transition-colors"
          >
            <svg className="size-[14px]" fill="none" viewBox="0 0 18 18"><path d="M4 4l10 10M14 4L4 14" stroke="#717680" strokeWidth="1.5" strokeLinecap="round"/></svg>
            <p className="font-['Helvetica_Neue:Regular',sans-serif] text-[13px] text-[#535862]">Fechar</p>
          </button>
        </div>
      </header>

      {/* ── Body: sidebar + content ── */}
      <div className="flex flex-1 min-h-0">
        {/* Sidebar */}
        <nav className={`flex flex-col shrink-0 border-r border-[#e9eaeb] bg-white py-[16px] gap-[4px] transition-all duration-300 ease-in-out ${sidebarCollapsed ? "w-[56px] px-[8px] overflow-visible" : "w-[220px] px-[12px] overflow-y-auto"}`}>
          {/* Header with toggle */}
          <div className={`flex items-center mb-[4px] ${sidebarCollapsed ? "justify-center" : "justify-between px-[10px]"}`}>
            {!sidebarCollapsed && (
              <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic text-[10px] text-[#a1a1aa] uppercase tracking-[1px]">Navegação</p>
            )}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="group/toggle relative flex items-center justify-center size-[28px] rounded-[6px] text-[#717680] hover:text-[#252b37] hover:bg-[#f0f1f3] transition-colors cursor-pointer"
            >
              <svg className={`size-[16px] transition-transform duration-300 ${sidebarCollapsed ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24">
                <path d="M11 17l-5-5 5-5M18 17l-5-5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              {sidebarCollapsed && (
                <div className="pointer-events-none absolute left-full ml-[10px] top-1/2 -translate-y-1/2 rounded-full bg-[#181d27] px-[14px] py-[6px] text-center whitespace-nowrap opacity-0 transition-opacity duration-150 group-hover/toggle:opacity-100 shadow-[0px_4px_12px_0px_rgba(0,0,0,0.25)] z-50">
                  <p className="font-['Helvetica_Neue:Regular',sans-serif] text-[12px] leading-[16px] text-white">Expandir menu</p>
                  <div className="absolute top-1/2 right-full size-0 -translate-y-1/2 border-r-[5px] border-t-[5px] border-b-[5px] border-r-[#181d27] border-t-transparent border-b-transparent" />
                </div>
              )}
            </button>
          </div>
          {([
            { id: "participantes", label: "Participantes", icon: <svg className="size-[16px]" fill="none" viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="1.5"/><path d="M22 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg> },
            { id: "atualizacoes", label: "Atualizações", icon: <svg className="size-[16px]" fill="none" viewBox="0 0 24 24"><path d="M12 8v4l3 3M3 12a9 9 0 1018 0 9 9 0 00-18 0z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg> },
            { id: "visao-geral", label: "Visão geral", icon: <svg className="size-[16px]" fill="none" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><polyline points="14,2 14,8 20,8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg> },
          ] as { id: string; label: string; icon: React.ReactNode }[]).map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`group/nav relative flex items-center gap-[8px] py-[8px] rounded-[8px] text-left transition-colors cursor-pointer ${
                sidebarCollapsed ? "justify-center px-[8px]" : "px-[10px]"
              } ${
                activeTab === item.id
                  ? "bg-[#edf0ff] text-[#0b5ed7]"
                  : "text-[#717680] hover:text-[#252b37] hover:bg-[#f8fafc]"
              }`}
            >
              <div className="shrink-0">{item.icon}</div>
              {!sidebarCollapsed && (
                <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic text-[14px] whitespace-nowrap overflow-hidden">{item.label}</p>
              )}
              {sidebarCollapsed && (
                <div className="pointer-events-none absolute left-full ml-[10px] top-1/2 -translate-y-1/2 rounded-full bg-[#181d27] px-[14px] py-[6px] text-center whitespace-nowrap opacity-0 transition-opacity duration-150 group-hover/nav:opacity-100 shadow-[0px_4px_12px_0px_rgba(0,0,0,0.25)] z-50">
                  <p className="font-['Helvetica_Neue:Regular',sans-serif] text-[12px] leading-[16px] text-white">{item.label}</p>
                  <div className="absolute top-1/2 right-full size-0 -translate-y-1/2 border-r-[5px] border-t-[5px] border-b-[5px] border-r-[#181d27] border-t-transparent border-b-transparent" />
                </div>
              )}
            </button>
          ))}
        </nav>

        {/* Content */}
        <main className="flex-1 overflow-y-auto">
          {activeTab === "atualizacoes" && (
            <div className="flex flex-col">
              <div className="flex items-center gap-[8px] px-[24px] pt-[20px] pb-[4px]">
                <button onClick={onBackToActivities} className="font-['Helvetica_Neue:Regular',sans-serif] text-[14px] text-[#535862] hover:text-[#252b37] cursor-pointer transition-colors">Início</button>
                <svg className="size-[14px] text-[#a4a7ae] shrink-0" fill="none" viewBox="0 0 24 24"><path d="M9 6C9 6 15 10.419 15 12C15 13.5812 9 18 9 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                <span className="font-['Helvetica_Neue:Regular',sans-serif] text-[14px] text-[#535862]">···</span>
                <svg className="size-[14px] text-[#a4a7ae] shrink-0" fill="none" viewBox="0 0 24 24"><path d="M9 6C9 6 15 10.419 15 12C15 13.5812 9 18 9 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                <button onClick={onBackToActivities} className="font-['Helvetica_Neue:Regular',sans-serif] text-[14px] text-[#535862] hover:text-[#252b37] cursor-pointer transition-colors">Atividades do Dia</button>
                <svg className="size-[14px] text-[#a4a7ae] shrink-0" fill="none" viewBox="0 0 24 24"><path d="M9 6C9 6 15 10.419 15 12C15 13.5812 9 18 9 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                <p className="font-['Helvetica_Neue:Medium',sans-serif] text-[14px] text-[#252b37]">{activity.name}</p>
              </div>
              <div className="flex gap-[24px] p-[24px] pt-[16px]">
              <div className="flex-1 min-w-0">
                <Frame23 />
              </div>
              <div className="shrink-0">
                <Frame24 />
              </div>
            </div>
            </div>
          )}
          {activeTab === "visao-geral" && (
            <AgendaVisaoGeral onAtualizacoesClick={() => setActiveTab("atualizacoes")} onBackToActivities={onBackToActivities} hideSidebar activityId={activityId} />
          )}
          {activeTab === "participantes" && (
            <ParticipantesTab onBackToActivities={onBackToActivities} activity={activity} initialOverlay={initialOverlay} />
          )}
        </main>
      </div>
    </div>
  );
}
