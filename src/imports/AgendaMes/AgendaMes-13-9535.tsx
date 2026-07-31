// @ts-nocheck
import { useState, useMemo, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import svgPaths from "./svg-fmdffnj3gf";
import imgTopBar from "./4a664b1820bfb04f20dc4f636db105ede4311f14.png";
import imgAvatar from "./87b552f8867f96fa4d2ca833ef943c5aa1ab172b.png";
import {
  startOfMonth, endOfMonth, startOfWeek, endOfWeek,
  eachDayOfInterval, isSameMonth, isSameDay, format,
  addWeeks, subWeeks, addDays, subDays,
} from "date-fns";
import { ptBR } from "date-fns/locale";
import { ArrowDown01Icon, Search01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { mockActivities, allHolidays } from "../../mocks/agenda";
import type { Activity, ActivityStatus } from "../../types/agenda";

type ViewMode = "mes" | "semana" | "dia";

function Elements() {
  return (
    <div className="absolute inset-[8.33%_12.5%]" data-name="elements">
      <div className="absolute inset-[-3.76%_-4.17%_-3.75%_-4.17%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13 14.3333">
          <g id="elements">
            <path d={svgPaths.p3bf14e00} id="Vector" stroke="var(--stroke-0, #0B5ED7)" strokeLinecap="round" strokeLinejoin="round" />
            <path d={svgPaths.p292a3200} id="Vector 9260" stroke="var(--stroke-0, #0B5ED7)" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M0.5 5.83333H12.5" id="Vector 4046" stroke="var(--stroke-0, #0B5ED7)" strokeLinecap="round" strokeLinejoin="round" />
            <path d={svgPaths.p13ac7400} id="Vector_2" stroke="var(--stroke-0, #0B5ED7)" strokeLinecap="round" strokeLinejoin="round" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Container3() {
  return (
    <div className="bg-[rgba(239,246,255,0.4)] relative rounded-[10px] shrink-0 size-[32px]" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[rgba(190,219,255,0.5)] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <div className="-translate-x-1/2 -translate-y-1/2 absolute left-1/2 size-[16px] top-[calc(50%-0.25px)]" data-name="calendar-love-01">
          <Elements />
        </div>
      </div>
    </div>
  );
}

function Container4() {
  return (
    <div className="flex-[1_0_0] min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col font-['Helvetica_Neue:Regular',sans-serif] gap-px items-start leading-[normal] not-italic relative size-full whitespace-nowrap">
        <p className="relative shrink-0 text-[#314158] text-[14px]">Agendamentos Hoje</p>
        <p className="relative shrink-0 text-[#62748e] text-[12px]">Reservas confirmadas</p>
      </div>
    </div>
  );
}

function Container2() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[10px] items-center relative w-full" data-name="Container">
      <Container3 />
      <Container4 />
    </div>
  );
}

function Elements1() {
  return (
    <div className="absolute bottom-[37.5%] left-1/4 right-1/4 top-[37.5%]" data-name="elements">
      <div className="absolute inset-[-12.5%_-6.25%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 9.00007 5.00003">
          <g id="elements">
            <path d={svgPaths.p33a4a180} id="Vector" stroke="var(--stroke-0, #008236)" strokeLinecap="round" strokeLinejoin="round" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Container7() {
  return (
    <div className="bg-[#f0fdf4] relative rounded-[8px] shrink-0" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[#b9f8cf] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-px items-center px-[7px] py-[4px] relative size-full">
        <div className="overflow-clip relative shrink-0 size-[16px]" data-name="arrow-up-01-round">
          <Elements1 />
        </div>
        <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#008236] text-[12px] whitespace-nowrap">+4 hoje</p>
      </div>
    </div>
  );
}

function Container6() {
  return (
    <div className="content-stretch flex gap-[8px] h-[24px] items-center relative shrink-0 w-full" data-name="Container">
      <Container7 />
      <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#62748e] text-[12px] whitespace-nowrap">vs. período anterior</p>
    </div>
  );
}

function Container5() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full" data-name="Container">
      <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#0f172b] text-[24px] w-full">23</p>
      <Container6 />
    </div>
  );
}

function Container1() {
  return (
    <div className="bg-white drop-shadow-[0px_1px_1.5px_rgba(10,13,18,0.08),0px_1px_1px_rgba(10,13,18,0.06)] flex-[1_0_0] min-w-px relative rounded-[24px]" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[#e2e8f0] border-solid inset-0 pointer-events-none rounded-[24px]" />
      <div className="content-stretch flex flex-col gap-[10px] items-start pb-[16px] pt-[20px] px-[20px] relative size-full">
        <Container2 />
        <Container5 />
      </div>
    </div>
  );
}

function Elements2() {
  return (
    <div className="absolute inset-[8.33%_12.5%]" data-name="elements">
      <div className="absolute inset-[-3.75%_-4.17%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13 14.3333">
          <g id="elements">
            <path d={svgPaths.p3bf14e00} id="Vector" stroke="var(--stroke-0, #0B5ED7)" strokeLinecap="round" strokeLinejoin="round" />
            <path d={svgPaths.p1ce3e080} id="Vector 9260" stroke="var(--stroke-0, #0B5ED7)" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M0.5 5.83333H12.5" id="Vector 4046" stroke="var(--stroke-0, #0B5ED7)" strokeLinecap="round" strokeLinejoin="round" />
            <path d={svgPaths.p16c9ab00} id="Vector_2" stroke="var(--stroke-0, #0B5ED7)" strokeLinecap="round" strokeLinejoin="round" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Container10() {
  return (
    <div className="bg-[rgba(239,246,255,0.4)] relative rounded-[10px] shrink-0 size-[32px]" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[rgba(190,219,255,0.5)] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <div className="-translate-x-1/2 -translate-y-1/2 absolute left-1/2 size-[16px] top-[calc(50%-0.25px)]" data-name="calendar-time">
          <Elements2 />
        </div>
      </div>
    </div>
  );
}

function Container11() {
  return (
    <div className="flex-[1_0_0] min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col font-['Helvetica_Neue:Regular',sans-serif] gap-px items-start leading-[normal] not-italic relative size-full whitespace-nowrap">
        <p className="relative shrink-0 text-[#314158] text-[14px]">Agendamentos Última Hora</p>
        <p className="relative shrink-0 text-[#62748e] text-[12px]">Reservas recentes</p>
      </div>
    </div>
  );
}

function Container9() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[10px] items-center relative w-full" data-name="Container">
      <Container10 />
      <Container11 />
    </div>
  );
}

function Elements3() {
  return (
    <div className="absolute bottom-[37.5%] left-1/4 right-1/4 top-[37.5%]" data-name="elements">
      <div className="absolute inset-[-12.5%_-6.25%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 9.00007 5.00003">
          <g id="elements">
            <path d={svgPaths.p33a4a180} id="Vector" stroke="var(--stroke-0, #008236)" strokeLinecap="round" strokeLinejoin="round" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Container14() {
  return (
    <div className="bg-[#f0fdf4] relative rounded-[8px] shrink-0" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[#b9f8cf] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-px items-center px-[7px] py-[4px] relative size-full">
        <div className="overflow-clip relative shrink-0 size-[16px]" data-name="arrow-up-01-round">
          <Elements3 />
        </div>
        <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#008236] text-[12px] whitespace-nowrap">+2</p>
      </div>
    </div>
  );
}

function Container13() {
  return (
    <div className="content-stretch flex gap-[8px] h-[24px] items-center relative shrink-0 w-full" data-name="Container">
      <Container14 />
      <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#62748e] text-[12px] whitespace-nowrap">vs. período anterior</p>
    </div>
  );
}

function Container12() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full" data-name="Container">
      <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#0f172b] text-[24px] w-full">5</p>
      <Container13 />
    </div>
  );
}

function Container8() {
  return (
    <div className="bg-white drop-shadow-[0px_1px_1.5px_rgba(10,13,18,0.08),0px_1px_1px_rgba(10,13,18,0.06)] flex-[1_0_0] min-w-px relative rounded-[24px]" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[#e2e8f0] border-solid inset-0 pointer-events-none rounded-[24px]" />
      <div className="content-stretch flex flex-col gap-[10px] items-start pb-[16px] pt-[20px] px-[20px] relative size-full">
        <Container9 />
        <Container12 />
      </div>
    </div>
  );
}

function Elements4() {
  return (
    <div className="absolute inset-[8.33%_16.67%]" data-name="elements">
      <div className="absolute inset-[-3.75%_-4.69%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11.6667 14.3333">
          <g id="elements">
            <path d={svgPaths.p35088f80} id="Vector" stroke="var(--stroke-0, #0B5ED7)" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M8.5 3.16667L3.16667 3.16667" id="Vector 3999" stroke="var(--stroke-0, #0B5ED7)" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M4.5 5.83333H3.16667" id="Vector 4000" stroke="var(--stroke-0, #0B5ED7)" strokeLinecap="round" strokeLinejoin="round" />
            <path d={svgPaths.p5d04800} id="Vector_2" stroke="var(--stroke-0, #0B5ED7)" strokeLinecap="round" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Container17() {
  return (
    <div className="bg-[rgba(239,246,255,0.4)] relative rounded-[10px] shrink-0 size-[32px]" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[rgba(190,219,255,0.5)] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <div className="-translate-x-1/2 -translate-y-1/2 absolute left-1/2 overflow-clip size-[16px] top-[calc(50%-0.25px)]" data-name="invoice-02">
          <Elements4 />
        </div>
      </div>
    </div>
  );
}

function Container18() {
  return (
    <div className="flex-[1_0_0] min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col font-['Helvetica_Neue:Regular',sans-serif] gap-px items-start leading-[normal] not-italic relative size-full whitespace-nowrap">
        <p className="relative shrink-0 text-[#314158] text-[14px]">Receita Estimada Hoje</p>
        <p className="relative shrink-0 text-[#62748e] text-[12px]">Total de vendas</p>
      </div>
    </div>
  );
}

function Container16() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[10px] items-center relative w-full" data-name="Container">
      <Container17 />
      <Container18 />
    </div>
  );
}

function Elements5() {
  return (
    <div className="absolute bottom-[37.5%] left-1/4 right-1/4 top-[37.5%]" data-name="elements">
      <div className="absolute inset-[-12.5%_-6.25%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 9.00007 5.00003">
          <g id="elements">
            <path d={svgPaths.p33a4a180} id="Vector" stroke="var(--stroke-0, #008236)" strokeLinecap="round" strokeLinejoin="round" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Container21() {
  return (
    <div className="bg-[#f0fdf4] relative rounded-[8px] shrink-0" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[#b9f8cf] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-px items-center px-[7px] py-[4px] relative size-full">
        <div className="overflow-clip relative shrink-0 size-[16px]" data-name="arrow-up-01-round">
          <Elements5 />
        </div>
        <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#008236] text-[12px] whitespace-nowrap">+8.4%</p>
      </div>
    </div>
  );
}

function Container20() {
  return (
    <div className="content-stretch flex gap-[8px] h-[24px] items-center relative shrink-0 w-full" data-name="Container">
      <Container21 />
      <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#62748e] text-[12px] whitespace-nowrap">vs. período anterior</p>
    </div>
  );
}

function Container19() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full" data-name="Container">
      <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#0f172b] text-[24px] w-full">R$ 4.250</p>
      <Container20 />
    </div>
  );
}

function Container15() {
  return (
    <div className="bg-white drop-shadow-[0px_1px_1.5px_rgba(10,13,18,0.08),0px_1px_1px_rgba(10,13,18,0.06)] flex-[1_0_0] min-w-px relative rounded-[24px]" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[#e2e8f0] border-solid inset-0 pointer-events-none rounded-[24px]" />
      <div className="content-stretch flex flex-col gap-[10px] items-start pb-[16px] pt-[20px] px-[20px] relative size-full">
        <Container16 />
        <Container19 />
      </div>
    </div>
  );
}

function Elements6() {
  return (
    <div className="absolute inset-[8.33%_14.58%]" data-name="elements">
      <div className="absolute inset-[-3.75%_-4.41%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12.3333 14.3333">
          <g id="elements">
            <path d={svgPaths.p15ea3c80} id="Vector 9267" stroke="var(--stroke-0, #0B5ED7)" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M7.16667 10.5H9.83333" id="Vector 9269" stroke="var(--stroke-0, #0B5ED7)" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M7.16667 3.83333H9.83333" id="Vector 9270" stroke="var(--stroke-0, #0B5ED7)" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M7.16667 7.16667H9.83333" id="Vector 9271" stroke="var(--stroke-0, #0B5ED7)" strokeLinecap="round" strokeLinejoin="round" />
            <path d={svgPaths.p9a20c00} id="Vector 6661" stroke="var(--stroke-0, #0B5ED7)" strokeLinecap="round" strokeLinejoin="round" />
            <path d={svgPaths.p33d02aa0} id="Vector" stroke="var(--stroke-0, #0B5ED7)" strokeLinecap="round" strokeLinejoin="round" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Container24() {
  return (
    <div className="bg-[rgba(239,246,255,0.4)] relative rounded-[10px] shrink-0 size-[32px]" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[rgba(190,219,255,0.5)] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <div className="-translate-x-1/2 -translate-y-1/2 absolute left-1/2 size-[16px] top-[calc(50%-0.25px)]" data-name="add-to-list">
          <Elements6 />
        </div>
      </div>
    </div>
  );
}

function Container25() {
  return (
    <div className="flex-[1_0_0] min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col font-['Helvetica_Neue:Regular',sans-serif] gap-px items-start leading-[normal] not-italic relative size-full whitespace-nowrap">
        <p className="relative shrink-0 text-[#314158] text-[14px]">Ocupação Média</p>
        <p className="relative shrink-0 text-[#62748e] text-[12px]">Percentual de ocupação</p>
      </div>
    </div>
  );
}

function Container23() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[10px] items-center relative w-full" data-name="Container">
      <Container24 />
      <Container25 />
    </div>
  );
}

function Elements7() {
  return (
    <div className="absolute bottom-[37.5%] left-1/4 right-1/4 top-[37.5%]" data-name="elements">
      <div className="absolute inset-[-12.5%_-6.25%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 9.00007 5.00003">
          <g id="elements">
            <path d={svgPaths.p33a4a180} id="Vector" stroke="var(--stroke-0, #008236)" strokeLinecap="round" strokeLinejoin="round" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Container28() {
  return (
    <div className="bg-[#f0fdf4] relative rounded-[8px] shrink-0" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[#b9f8cf] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-px items-center px-[7px] py-[4px] relative size-full">
        <div className="overflow-clip relative shrink-0 size-[16px]" data-name="arrow-up-01-round">
          <Elements7 />
        </div>
        <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#008236] text-[12px] whitespace-nowrap">+12%</p>
      </div>
    </div>
  );
}

function Container27() {
  return (
    <div className="content-stretch flex gap-[8px] h-[24px] items-center relative shrink-0 w-full" data-name="Container">
      <Container28 />
      <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#62748e] text-[12px] whitespace-nowrap">vs. mês anterior</p>
    </div>
  );
}

function Container26() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full" data-name="Container">
      <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#0f172b] text-[24px] w-full">85%</p>
      <Container27 />
    </div>
  );
}

function Container22() {
  return (
    <div className="bg-white drop-shadow-[0px_1px_1.5px_rgba(10,13,18,0.08),0px_1px_1px_rgba(10,13,18,0.06)] flex-[1_0_0] min-w-px relative rounded-[24px]" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[#e2e8f0] border-solid inset-0 pointer-events-none rounded-[24px]" />
      <div className="content-stretch flex flex-col gap-[10px] items-start pb-[16px] pt-[20px] px-[20px] relative size-full">
        <Container23 />
        <Container26 />
      </div>
    </div>
  );
}

function Container() {
  return (
    <div className="absolute content-stretch flex gap-[16px] items-start left-[var(--shell-offset,248px)] right-[24px] top-[192px]" data-name="Container">
      <Container1 />
      <Container8 />
      <Container15 />
      <Container22 />
    </div>
  );
}

function Elements8() {
  return (
    <div className="absolute bottom-1/4 left-[37.5%] right-[37.5%] top-1/4" data-name="elements">
      <div className="absolute inset-[-9.38%_-18.75%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 5.50005 9.5001">
          <g id="elements">
            <path d={svgPaths.p23505500} id="Vector" stroke="var(--stroke-0, #90A1B9)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Button() {
  return (
    <div className="bg-white flex-[1_0_0] min-w-px relative rounded-[10px]" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[#e2e8f0] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center px-[24px] py-[10px] relative size-full">
          <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#314158] text-[14px] text-center whitespace-nowrap">Maio de 2026</p>
        </div>
      </div>
    </div>
  );
}

function Elements9() {
  return (
    <div className="absolute bottom-1/4 left-[37.5%] right-[37.5%] top-1/4" data-name="elements">
      <div className="absolute inset-[-9.38%_-18.75%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 5.50005 9.5001">
          <g id="elements">
            <path d={svgPaths.p3a927400} id="Vector" stroke="var(--stroke-0, #90A1B9)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function NavLabel({ label, onPrev, onNext }: { label: string; onPrev: () => void; onNext: () => void }) {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center relative size-full">
        <button onClick={onPrev} className="bg-white relative rounded-[6px] shrink-0 cursor-pointer" data-name="button">
          <div aria-hidden="true" className="absolute border border-[#e2e8f0] border-solid inset-0 pointer-events-none rounded-[6px]" />
          <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center justify-center p-[12px] relative size-full">
            <div className="overflow-clip relative shrink-0 size-[16px]" data-name="arrow-left-01-round">
              <Elements8 />
            </div>
          </div>
        </button>
        <div className="bg-white relative rounded-[10px] shrink-0 w-[170px]" data-name="Button">
          <div aria-hidden="true" className="absolute border border-[#e2e8f0] border-solid inset-0 pointer-events-none rounded-[10px]" />
          <div className="flex flex-row items-center justify-center size-full">
            <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center px-[24px] py-[10px] relative size-full">
              <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#314158] text-[14px] text-center whitespace-nowrap">{label}</p>
            </div>
          </div>
        </div>
        <button onClick={onNext} className="bg-white relative rounded-[6px] shrink-0 cursor-pointer" data-name="button">
          <div aria-hidden="true" className="absolute border border-[#e2e8f0] border-solid inset-0 pointer-events-none rounded-[6px]" />
          <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center justify-center p-[12px] relative size-full">
            <div className="overflow-clip relative shrink-0 size-[16px]" data-name="arrow-right-01-round">
              <Elements9 />
            </div>
          </div>
        </button>
      </div>
    </div>
  );
}

function ViewToggle({ view, onViewChange }: { view: ViewMode; onViewChange: (v: ViewMode) => void }) {
  const [open, setOpen] = useState(false);
  const items: { key: ViewMode; label: string }[] = [
    { key: "dia", label: "Dia" },
    { key: "semana", label: "Semana" },
    { key: "mes", label: "Mês" },
  ];
  const selected = items.find((item) => item.key === view) ?? items[0];

  return (
    <div className="flex flex-col gap-[12px] relative shrink-0 w-[132px]" data-name="ViewDropdown">
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen((current) => !current)}
          className={`flex items-center h-[40px] w-full rounded-[8px] border bg-[#fbfcfd] px-[12px] transition-colors ${open ? "border-[#155dfc]" : "border-[#e9eaeb]"} cursor-pointer`}
          aria-expanded={open}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="mr-[8px] shrink-0 size-[16px] text-[#314158]" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M16 2V6M8 2V6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M13 4H11C7.22876 4 5.34315 4 4.17157 5.17157C3 6.34315 3 8.22876 3 12V14C3 17.7712 3 19.6569 4.17157 20.8284C5.34315 22 7.22876 22 11 22H13C16.7712 22 18.6569 22 19.8284 20.8284C21 19.6569 21 17.7712 21 14V12C21 8.22876 21 6.34315 19.8284 5.17157C18.6569 4 16.7712 4 13 4Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M3 10H21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="flex-1 min-w-0 font-['Helvetica_Neue:Regular',sans-serif] text-[14px] text-[#252b37] text-left truncate">
            {selected.label}
          </span>
          <HugeiconsIcon icon={ArrowDown01Icon} size={16} className={`text-[#a4a7ae] transition-transform ${open ? "rotate-180" : ""}`} />
        </button>
        {open && (
          <div className="absolute bg-white border border-[#e9eaeb] border-solid left-0 overflow-hidden rounded-[8px] shadow-[0px_8px_16px_rgba(15,23,43,0.08)] top-[44px] w-full z-30">
            {items.map(({ key, label }) => (
              <button
                key={key}
                type="button"
                onClick={() => {
                  onViewChange(key);
                  setOpen(false);
                }}
                className={`content-stretch flex items-center px-[12px] py-[9px] relative w-full cursor-pointer hover:bg-[#f8fafc] ${key === view ? "bg-[#eff6ff]" : "bg-white"}`}
              >
                <p className={`font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic text-[13px] whitespace-nowrap ${key === view ? "text-[#084fb7]" : "text-[#314158]"}`}>
                  {label}
                </p>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ReservationsListIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="shrink-0 size-[16px] text-[#314158]" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M19.4999 10C19.4999 6.22876 19.4999 4.34315 18.3284 3.17157C17.1568 2 15.2712 2 11.4999 2H10.5C6.72883 2 4.84323 2 3.67166 3.17156C2.50008 4.34312 2.50007 6.22872 2.50004 9.99993L2.5 13.9999C2.49997 17.7712 2.49995 19.6568 3.67153 20.8284C4.8431 22 6.72873 22 10.5 22H12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7 7H15M7 12H13.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M15.8613 22H20.1387C21.0238 22 21.7723 21.3987 21.4039 20.753C20.8135 19.7186 19.5114 19 18 19C16.4886 19 15.1865 19.7186 14.5961 20.753C14.2277 21.3987 14.9762 22 15.8613 22Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M17.9969 16.5C18.9639 16.5 19.7477 15.7165 19.7477 14.75C19.7477 13.7835 18.9639 13 17.9969 13C17.03 13 16.2461 13.7835 16.2461 14.75C16.2461 15.7165 17.03 16.5 17.9969 16.5Z" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function HeaderIconButton({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className="bg-white border border-[#e2e8f0] border-solid content-stretch flex items-center justify-center relative rounded-[8px] shrink-0 size-[40px] cursor-pointer hover:bg-[#f8fafc] transition-colors"
      data-name="IconButton"
    >
      {children}
    </button>
  );
}

function CalendarHeader({ navLabel, onPrev, onNext, onToday, view, onViewChange }: {
  navLabel: string; onPrev: () => void; onNext: () => void; onToday: () => void;
  view: ViewMode; onViewChange: (v: ViewMode) => void;
}) {
  return (
    <div className="bg-[rgba(255,255,255,0.95)] relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between gap-[24px] pl-[20px] pr-[20px] py-[20px] relative size-full border-b border-[#e2e8f0]">
          <div className="flex gap-[8px] items-center shrink-0">
            <p className="font-['Helvetica_Neue:Medium',sans-serif] leading-[normal] not-italic text-[#0f172b] text-[16px] whitespace-nowrap">
              {navLabel}
            </p>
            <button onClick={onToday} className="relative rounded-[9999px] shrink-0 cursor-pointer border border-[#e2e8f0] hover:bg-[#f5f5f5] transition-colors" data-name="Button">
              <div className="content-stretch flex items-center justify-center px-[10px] py-[4px] relative size-full">
                <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#314158] text-[12px] text-center whitespace-nowrap">Hoje</p>
              </div>
            </button>
            <button onClick={onPrev} className="flex items-center justify-center size-[32px] rounded-[6px] shrink-0 cursor-pointer hover:bg-[#f5f5f5] transition-colors" data-name="button">
              <div className="overflow-clip relative shrink-0 size-[16px]" data-name="arrow-left-01-round">
                <Elements8 />
              </div>
            </button>
            <button onClick={onNext} className="flex items-center justify-center size-[32px] rounded-[6px] shrink-0 cursor-pointer hover:bg-[#f5f5f5] transition-colors" data-name="button">
              <div className="overflow-clip relative shrink-0 size-[16px]" data-name="arrow-right-01-round">
                <Elements9 />
              </div>
            </button>
          </div>
          <div className="content-stretch flex gap-[12px] items-center relative shrink-0">
            <ViewToggle view={view} onViewChange={onViewChange} />
            <button
              type="button"
              aria-label="Lista de reservas"
              title="Lista de reservas"
              className="bg-white border border-[#e2e8f0] border-solid flex items-center gap-[8px] relative rounded-[8px] shrink-0 h-[40px] px-[12px] cursor-pointer hover:bg-[#f8fafc] transition-colors"
              data-name="IconButton"
            >
              <ReservationsListIcon />
              <span className="font-['Helvetica_Neue:Regular',sans-serif] text-[14px] text-[#314158] whitespace-nowrap">Lista de reservas</span>
            </button>
            <HeaderIconButton label="Buscar atividade">
              <HugeiconsIcon icon={Search01Icon} className="size-[16px] text-[#314158]" />
            </HeaderIconButton>
          </div>
        </div>
      </div>
    </div>
  );
}

function CalendarColumnHeader() {
  return (
    <div className="bg-[#f8fafc] relative shrink-0 w-full" data-name="_Calendar column header">
      <div aria-hidden="true" className="absolute border-[#e9eaeb] border-b border-r border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex gap-[4px] items-center justify-center p-[8px] relative size-full">
          <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#90a1b9] text-[12px] whitespace-nowrap">DOM</p>
        </div>
      </div>
    </div>
  );
}

function CalendarCellDate() {
  return (
    <div className="relative rounded-[9999px] shrink-0 size-[24px]" data-name="_Calendar cell date">
      <p className="absolute font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] left-[4px] not-italic text-[#717680] text-[12px] top-[calc(50%-9px)] whitespace-nowrap">29</p>
    </div>
  );
}

function CalendarCellMonthView() {
  return (
    <div className="bg-white flex-[1_0_0] min-h-px relative w-full" data-name="_Calendar cell/Month view">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-start p-[8px] relative size-full">
          <CalendarCellDate />
        </div>
      </div>
      <div aria-hidden="true" className="absolute border-[#e9eaeb] border-b border-r border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function CalendarCellDate1() {
  return (
    <div className="relative rounded-[9999px] shrink-0 size-[24px]" data-name="_Calendar cell date">
      <p className="absolute font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] left-[4px] not-italic text-[#717680] text-[12px] top-[calc(50%-9px)] whitespace-nowrap">5</p>
    </div>
  );
}

function Container35() {
  return <div className="bg-[#d5d7da] relative rounded-[9999px] shrink-0 size-[5.998px]" data-name="Container" />;
}

function Frame14() {
  return (
    <div className="content-stretch flex items-center py-[6px] relative shrink-0">
      <Container35 />
    </div>
  );
}

function Frame21() {
  return (
    <div className="content-stretch flex flex-col font-['Helvetica_Neue:Regular',sans-serif] gap-[2px] items-start justify-center leading-[normal] not-italic relative shrink-0">
      <p className="relative shrink-0 text-[#414651] text-[12px] whitespace-nowrap">Trilha Pico</p>
      <p className="overflow-hidden relative shrink-0 text-[#919191] text-[10px] text-ellipsis w-[96.002px]">Interrompida para Feriado</p>
    </div>
  );
}

function Container34() {
  return (
    <div className="bg-[#fafafa] flex-[1_0_0] min-w-px relative rounded-[4px]" data-name="Container">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex gap-[4px] items-start p-[5px] relative size-full">
          <Frame14 />
          <Frame21 />
        </div>
      </div>
      <div aria-hidden="true" className="absolute border-[#f2f2f2] border-[0.556px] border-solid inset-0 pointer-events-none rounded-[4px]" />
    </div>
  );
}

function Frame19() {
  return (
    <div className="content-stretch flex gap-[4px] items-start relative shrink-0 w-full">
      <CalendarCellDate1 />
      <Container34 />
    </div>
  );
}

function Elements10() {
  return (
    <div className="absolute inset-[8.33%]" data-name="elements">
      <div className="absolute inset-[-4.29%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12.6667 12.6667">
          <g id="elements">
            <path d={svgPaths.p113f5f0} id="Ellipse 1334" stroke="var(--stroke-0, #8200DB)" />
            <path d={svgPaths.p2c4e4400} id="Vector" stroke="var(--stroke-0, #8200DB)" strokeLinecap="round" strokeLinejoin="round" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function CalendarCellMonthView1() {
  return (
    <div className="bg-white flex-[1_0_0] min-h-px relative w-full" data-name="_Calendar cell/Month view">
      <div aria-hidden="true" className="absolute border-[#e9eaeb] border-b border-r border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col items-end size-full">
        <div className="content-stretch flex flex-col items-end justify-between p-[8px] relative size-full">
          <Frame19 />
          <div className="bg-[#f3e8ff] relative rounded-[8px] shrink-0" data-name="Alert Badge, Contract">
            <div className="content-stretch flex gap-[4px] items-center justify-center overflow-clip px-[8.556px] py-[2.556px] relative rounded-[inherit] size-full">
              <div className="relative shrink-0 size-[14px]" data-name="star-circle">
                <div className="bg-clip-padding border-0 border-[transparent] border-solid overflow-clip relative rounded-[inherit] size-full">
                  <Elements10 />
                </div>
              </div>
              <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#8200db] text-[12px] whitespace-nowrap">Páscoa</p>
            </div>
            <div aria-hidden="true" className="absolute border-[#dab2ff] border-[0.556px] border-solid inset-0 pointer-events-none rounded-[8px]" />
          </div>
        </div>
      </div>
    </div>
  );
}

function CalendarCellDate2() {
  return (
    <div className="relative rounded-[9999px] shrink-0 size-[24px]" data-name="_Calendar cell date">
      <p className="absolute font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] left-[4px] not-italic text-[#717680] text-[12px] top-[calc(50%-9px)] whitespace-nowrap">12</p>
    </div>
  );
}

function CalendarCellMonthView2() {
  return (
    <div className="bg-white flex-[1_0_0] min-h-px relative w-full" data-name="_Calendar cell/Month view">
      <div aria-hidden="true" className="absolute border-[#e9eaeb] border-b border-r border-solid inset-0 pointer-events-none" />
      <div className="content-stretch flex gap-[4px] items-start p-[8px] relative size-full">
        <CalendarCellDate2 />
      </div>
    </div>
  );
}

function CalendarCellDate3() {
  return (
    <div className="relative rounded-[9999px] shrink-0 size-[24px]" data-name="_Calendar cell date">
      <p className="absolute font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] left-[4px] not-italic text-[#717680] text-[12px] top-[calc(50%-9px)] whitespace-nowrap">19</p>
    </div>
  );
}

function CalendarCellMonthView3() {
  return (
    <div className="bg-white flex-[1_0_0] min-h-px relative w-full" data-name="_Calendar cell/Month view">
      <div aria-hidden="true" className="absolute border-[#e9eaeb] border-b border-r border-solid inset-0 pointer-events-none" />
      <div className="content-stretch flex gap-[4px] items-start p-[8px] relative size-full">
        <CalendarCellDate3 />
      </div>
    </div>
  );
}

function CalendarCellDate4() {
  return (
    <div className="relative rounded-[9999px] shrink-0 size-[24px]" data-name="_Calendar cell date">
      <p className="absolute font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] left-[4px] not-italic text-[#717680] text-[12px] top-[calc(50%-9px)] whitespace-nowrap">26</p>
    </div>
  );
}

function CalendarCellMonthView4() {
  return (
    <div className="bg-white flex-[1_0_0] min-h-px relative w-full" data-name="_Calendar cell/Month view">
      <div aria-hidden="true" className="absolute border-[#e9eaeb] border-b border-r border-solid inset-0 pointer-events-none" />
      <div className="content-stretch flex gap-[4px] items-start p-[8px] relative size-full">
        <CalendarCellDate4 />
      </div>
    </div>
  );
}

function Column() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col h-full items-start min-w-px relative" data-name="Column">
      <CalendarColumnHeader />
      <CalendarCellMonthView />
      <CalendarCellMonthView1 />
      <CalendarCellMonthView2 />
      <CalendarCellMonthView3 />
      <CalendarCellMonthView4 />
    </div>
  );
}

function CalendarColumnHeader1() {
  return (
    <div className="bg-[#f8fafc] relative shrink-0 w-full" data-name="_Calendar column header">
      <div aria-hidden="true" className="absolute border-[#e9eaeb] border-b border-r border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex gap-[4px] items-center justify-center p-[8px] relative size-full">
          <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#90a1b9] text-[12px] whitespace-nowrap">SEG</p>
        </div>
      </div>
    </div>
  );
}

function CalendarCellDate5() {
  return (
    <div className="relative rounded-[9999px] shrink-0 size-[24px]" data-name="_Calendar cell date">
      <p className="absolute font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] left-[4px] not-italic text-[#717680] text-[12px] top-[calc(50%-9px)] whitespace-nowrap">30</p>
    </div>
  );
}

function CalendarCellMonthView5() {
  return (
    <div className="bg-white flex-[1_0_0] min-h-px relative w-full" data-name="_Calendar cell/Month view">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex gap-[4px] items-start p-[8px] relative size-full">
          <CalendarCellDate5 />
        </div>
      </div>
      <div aria-hidden="true" className="absolute border-[#e9eaeb] border-b border-r border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function CalendarCellDate6() {
  return (
    <div className="relative rounded-[9999px] shrink-0 size-[24px]" data-name="_Calendar cell date">
      <p className="absolute font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] left-[4px] not-italic text-[#414651] text-[12px] top-[calc(50%-9px)] whitespace-nowrap">6</p>
    </div>
  );
}

function Container37() {
  return <div className="bg-[#2b7fff] relative rounded-[18641400px] shrink-0 size-[5.998px]" data-name="Container" />;
}

function Container36() {
  return (
    <div className="bg-[#eff6ff] flex-[1_0_0] min-w-px relative rounded-[4px]" data-name="Container">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex gap-[4px] items-center p-[5px] relative size-full">
          <Container37 />
          <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#1447e6] text-[12px] whitespace-nowrap">Trilha Pico (8/12)</p>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border-[#dbeafe] border-[0.556px] border-solid inset-0 pointer-events-none rounded-[4px]" />
    </div>
  );
}

function CalendarCellMonthView6({ onDayClick }: { onDayClick?: (day: number) => void }) {
  return (
    <div onClick={() => onDayClick?.(6)} className="bg-white flex-[1_0_0] min-h-px relative w-full cursor-pointer hover:bg-[#f8fafc] transition-colors" data-name="_Calendar cell/Month view">
      <div aria-hidden="true" className="absolute border-[#e9eaeb] border-b border-r border-solid inset-0 pointer-events-none" />
      <div className="content-stretch flex gap-[4px] items-start p-[8px] relative size-full">
        <CalendarCellDate6 />
        <Container36 />
      </div>
    </div>
  );
}

function CalendarCellDate7() {
  return (
    <div className="relative rounded-[9999px] shrink-0 size-[24px]" data-name="_Calendar cell date">
      <p className="absolute font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] left-[4px] not-italic text-[#414651] text-[12px] top-[calc(50%-9px)] whitespace-nowrap">13</p>
    </div>
  );
}

function Container39() {
  return <div className="bg-[#2b7fff] relative rounded-[18641400px] shrink-0 size-[5.998px]" data-name="Container" />;
}

function Container38() {
  return (
    <div className="bg-[#eff6ff] flex-[1_0_0] min-w-px relative rounded-[4px]" data-name="Container">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex gap-[4px] items-center p-[5px] relative size-full">
          <Container39 />
          <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#1447e6] text-[12px] whitespace-nowrap">Trilha Pico (8/12)</p>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border-[#dbeafe] border-[0.556px] border-solid inset-0 pointer-events-none rounded-[4px]" />
    </div>
  );
}

function CalendarCellMonthView7({ onDayClick }: { onDayClick?: (day: number) => void }) {
  return (
    <div onClick={() => onDayClick?.(13)} className="bg-white flex-[1_0_0] min-h-px relative w-full cursor-pointer hover:bg-[#f8fafc] transition-colors" data-name="_Calendar cell/Month view">
      <div aria-hidden="true" className="absolute border-[#e9eaeb] border-b border-r border-solid inset-0 pointer-events-none" />
      <div className="content-stretch flex gap-[4px] items-start p-[8px] relative size-full">
        <CalendarCellDate7 />
        <Container38 />
      </div>
    </div>
  );
}

function CalendarCellDate8() {
  return (
    <div className="relative rounded-[9999px] shrink-0 size-[24px]" data-name="_Calendar cell date">
      <p className="absolute font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] left-[4px] not-italic text-[#414651] text-[12px] top-[calc(50%-9px)] whitespace-nowrap">20</p>
    </div>
  );
}

function CalendarCellMonthView8({ onDayClick }: { onDayClick?: (day: number) => void }) {
  return (
    <div onClick={() => onDayClick?.(20)} className="bg-white flex-[1_0_0] min-h-px relative w-full cursor-pointer hover:bg-[#f8fafc] transition-colors" data-name="_Calendar cell/Month view">
      <div aria-hidden="true" className="absolute border-[#e9eaeb] border-b border-r border-solid inset-0 pointer-events-none" />
      <div className="content-stretch flex gap-[4px] items-start p-[8px] relative size-full">
        <CalendarCellDate8 />
      </div>
    </div>
  );
}

function CalendarCellDate9() {
  return (
    <div className="relative rounded-[9999px] shrink-0 size-[24px]" data-name="_Calendar cell date">
      <p className="absolute font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] left-[4px] not-italic text-[#414651] text-[12px] top-[calc(50%-9px)] whitespace-nowrap">27</p>
    </div>
  );
}

function Container41() {
  return <div className="bg-[#2b7fff] relative rounded-[18641400px] shrink-0 size-[5.998px]" data-name="Container" />;
}

function Container40() {
  return (
    <div className="bg-[#eff6ff] flex-[1_0_0] min-w-px relative rounded-[4px]" data-name="Container">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex gap-[4px] items-center p-[5px] relative size-full">
          <Container41 />
          <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#1447e6] text-[12px] whitespace-nowrap">Trilha Pico (8/12)</p>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border-[#dbeafe] border-[0.556px] border-solid inset-0 pointer-events-none rounded-[4px]" />
    </div>
  );
}

function CalendarCellMonthView9({ onDayClick }: { onDayClick?: (day: number) => void }) {
  return (
    <div onClick={() => onDayClick?.(27)} className="bg-white flex-[1_0_0] min-h-px relative w-full cursor-pointer hover:bg-[#f8fafc] transition-colors" data-name="_Calendar cell/Month view">
      <div aria-hidden="true" className="absolute border-[#e9eaeb] border-b border-r border-solid inset-0 pointer-events-none" />
      <div className="content-stretch flex gap-[4px] items-start p-[8px] relative size-full">
        <CalendarCellDate9 />
        <Container40 />
      </div>
    </div>
  );
}

function Column1({ onDayClick }: { onDayClick?: (day: number) => void }) {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col h-full items-start min-w-px relative" data-name="Column">
      <CalendarColumnHeader1 />
      <CalendarCellMonthView5 />
      <CalendarCellMonthView6 onDayClick={onDayClick} />
      <CalendarCellMonthView7 onDayClick={onDayClick} />
      <CalendarCellMonthView8 onDayClick={onDayClick} />
      <CalendarCellMonthView9 onDayClick={onDayClick} />
    </div>
  );
}

function CalendarColumnHeader2() {
  return (
    <div className="bg-[#f8fafc] relative shrink-0 w-full" data-name="_Calendar column header">
      <div aria-hidden="true" className="absolute border-[#e9eaeb] border-b border-r border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex gap-[4px] items-center justify-center p-[8px] relative size-full">
          <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#90a1b9] text-[12px] whitespace-nowrap">TER</p>
        </div>
      </div>
    </div>
  );
}

function CalendarCellDate10() {
  return (
    <div className="relative rounded-[9999px] shrink-0 size-[24px]" data-name="_Calendar cell date">
      <p className="absolute font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] left-[4px] not-italic text-[#717680] text-[12px] top-[calc(50%-9px)] whitespace-nowrap">31</p>
    </div>
  );
}

function Events() {
  return <div className="content-stretch flex flex-[1_0_0] flex-col gap-[4px] h-[86px] items-start min-w-px relative" data-name="Events" />;
}

function CalendarCellMonthView10() {
  return (
    <div className="bg-white flex-[1_0_0] min-h-px relative w-full" data-name="_Calendar cell/Month view">
      <div aria-hidden="true" className="absolute border-[#e9eaeb] border-b border-r border-solid inset-0 pointer-events-none" />
      <div className="content-stretch flex gap-[4px] items-start p-[8px] relative size-full">
        <CalendarCellDate10 />
        <Events />
      </div>
    </div>
  );
}

function CalendarCellDate11() {
  return (
    <div className="relative rounded-[9999px] shrink-0 size-[24px]" data-name="_Calendar cell date">
      <p className="absolute font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] left-[4px] not-italic text-[#414651] text-[12px] top-[calc(50%-9px)] whitespace-nowrap">7</p>
    </div>
  );
}

function CalendarCellMonthView11({ onDayClick }: { onDayClick?: (day: number) => void }) {
  return (
    <div onClick={() => onDayClick?.(7)} className="bg-white flex-[1_0_0] min-h-px relative w-full cursor-pointer hover:bg-[#f8fafc] transition-colors" data-name="_Calendar cell/Month view">
      <div aria-hidden="true" className="absolute border-[#e9eaeb] border-b border-r border-solid inset-0 pointer-events-none" />
      <div className="content-stretch flex items-start p-[8px] relative size-full">
        <CalendarCellDate11 />
      </div>
    </div>
  );
}

function CalendarCellDate12() {
  return (
    <div className="relative rounded-[9999px] shrink-0 size-[24px]" data-name="_Calendar cell date">
      <p className="absolute font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] left-[4px] not-italic text-[#414651] text-[12px] top-[calc(50%-9px)] whitespace-nowrap">14</p>
    </div>
  );
}

function CalendarCellMonthView12({ onDayClick }: { onDayClick?: (day: number) => void }) {
  return (
    <div onClick={() => onDayClick?.(14)} className="bg-white flex-[1_0_0] min-h-px relative w-full cursor-pointer hover:bg-[#f8fafc] transition-colors" data-name="_Calendar cell/Month view">
      <div aria-hidden="true" className="absolute border-[#e9eaeb] border-b border-r border-solid inset-0 pointer-events-none" />
      <div className="content-stretch flex gap-[4px] items-start p-[8px] relative size-full">
        <CalendarCellDate12 />
      </div>
    </div>
  );
}

function CalendarCellDate13() {
  return (
    <div className="relative rounded-[9999px] shrink-0 size-[24px]" data-name="_Calendar cell date">
      <p className="absolute font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] left-[4px] not-italic text-[#414651] text-[12px] top-[calc(50%-9px)] whitespace-nowrap">21</p>
    </div>
  );
}

function Container43() {
  return <div className="bg-[#2b7fff] relative rounded-[18641400px] shrink-0 size-[5.998px]" data-name="Container" />;
}

function Container42() {
  return (
    <div className="bg-[#eff6ff] relative rounded-[4px] shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex gap-[4px] items-center p-[5px] relative size-full">
          <Container43 />
          <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#1447e6] text-[12px] whitespace-nowrap">Trilha Pico</p>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border-[#dbeafe] border-[0.556px] border-solid inset-0 pointer-events-none rounded-[4px]" />
    </div>
  );
}

function MoreEvents() {
  return (
    <div className="opacity-60 relative shrink-0 w-full" data-name="More events">
      <div className="content-stretch flex items-start px-[8px] relative size-full">
        <p className="flex-[1_0_0] font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] min-w-px not-italic overflow-hidden relative text-[#717680] text-[12px] text-ellipsis whitespace-nowrap">Mais 2...</p>
      </div>
    </div>
  );
}

function Frame1() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[6px] items-start min-w-px opacity-0 relative">
      <Container42 />
      <MoreEvents />
    </div>
  );
}

function Frame17() {
  return (
    <div className="content-stretch flex gap-[4px] items-start relative shrink-0 w-full">
      <CalendarCellDate13 />
      <Frame1 />
    </div>
  );
}

function Elements11() {
  return (
    <div className="absolute inset-[8.33%]" data-name="elements">
      <div className="absolute inset-[-4.29%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12.6667 12.6667">
          <g id="elements">
            <path d={svgPaths.p113f5f0} id="Ellipse 1334" stroke="var(--stroke-0, #8200DB)" />
            <path d={svgPaths.p2c4e4400} id="Vector" stroke="var(--stroke-0, #8200DB)" strokeLinecap="round" strokeLinejoin="round" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function CalendarCellMonthView13({ onDayClick }: { onDayClick?: (day: number) => void }) {
  return (
    <div onClick={() => onDayClick?.(21)} className="bg-white flex-[1_0_0] min-h-px relative w-full cursor-pointer hover:bg-[#f8fafc] transition-colors" data-name="_Calendar cell/Month view">
      <div aria-hidden="true" className="absolute border-[#e9eaeb] border-b border-r border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col items-end size-full">
        <div className="content-stretch flex flex-col items-end justify-between p-[8px] relative size-full">
          <Frame17 />
          <div className="bg-[#f3e8ff] relative rounded-[8px] shrink-0" data-name="Alert Badge, Contract">
            <div className="content-stretch flex gap-[4px] items-center justify-center overflow-clip px-[8.556px] py-[2.556px] relative rounded-[inherit] size-full">
              <div className="relative shrink-0 size-[14px]" data-name="star-circle">
                <div className="bg-clip-padding border-0 border-[transparent] border-solid overflow-clip relative rounded-[inherit] size-full">
                  <Elements11 />
                </div>
              </div>
              <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#8200db] text-[12px] whitespace-nowrap">Tiradentes</p>
            </div>
            <div aria-hidden="true" className="absolute border-[#dab2ff] border-[0.556px] border-solid inset-0 pointer-events-none rounded-[8px]" />
          </div>
        </div>
      </div>
    </div>
  );
}

function CalendarCellDate14() {
  return (
    <div className="relative rounded-[9999px] shrink-0 size-[24px]" data-name="_Calendar cell date">
      <p className="absolute font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] left-[4px] not-italic text-[#414651] text-[12px] top-[calc(50%-9px)] whitespace-nowrap">28</p>
    </div>
  );
}

function CalendarCellMonthView14({ onDayClick }: { onDayClick?: (day: number) => void }) {
  return (
    <div onClick={() => onDayClick?.(28)} className="bg-white flex-[1_0_0] min-h-px relative w-full cursor-pointer hover:bg-[#f8fafc] transition-colors" data-name="_Calendar cell/Month view">
      <div aria-hidden="true" className="absolute border-[#e9eaeb] border-b border-r border-solid inset-0 pointer-events-none" />
      <div className="content-stretch flex gap-[4px] items-start p-[8px] relative size-full">
        <CalendarCellDate14 />
      </div>
    </div>
  );
}

function Column2({ onDayClick }: { onDayClick?: (day: number) => void }) {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col h-full items-start min-w-px relative" data-name="Column">
      <CalendarColumnHeader2 />
      <CalendarCellMonthView10 />
      <CalendarCellMonthView11 onDayClick={onDayClick} />
      <CalendarCellMonthView12 onDayClick={onDayClick} />
      <CalendarCellMonthView13 onDayClick={onDayClick} />
      <CalendarCellMonthView14 onDayClick={onDayClick} />
    </div>
  );
}

function CalendarColumnHeader3() {
  return (
    <div className="bg-[#f8fafc] relative shrink-0 w-full" data-name="_Calendar column header">
      <div aria-hidden="true" className="absolute border-[#e9eaeb] border-b border-r border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex gap-[4px] items-center justify-center p-[8px] relative size-full">
          <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#90a1b9] text-[12px] whitespace-nowrap">QUA</p>
        </div>
      </div>
    </div>
  );
}

function CalendarCellDate15() {
  return (
    <div className="relative rounded-[9999px] shrink-0 size-[24px]" data-name="_Calendar cell date">
      <p className="absolute font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] left-[4px] not-italic text-[#414651] text-[12px] top-[calc(50%-9px)] whitespace-nowrap">1</p>
    </div>
  );
}

function Container45() {
  return <div className="bg-[#2b7fff] relative rounded-[18641400px] shrink-0 size-[5.998px]" data-name="Container" />;
}

function Container44() {
  return (
    <div className="bg-[#eff6ff] relative rounded-[4px] shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex gap-[4px] items-center p-[5px] relative size-full">
          <Container45 />
          <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#1447e6] text-[12px] whitespace-nowrap">Trilha Pico (8/12)</p>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border-[#dbeafe] border-[0.556px] border-solid inset-0 pointer-events-none rounded-[4px]" />
    </div>
  );
}

function Container47() {
  return <div className="bg-[#fb2c36] relative rounded-[18641400px] shrink-0 size-[5.998px]" data-name="Container" />;
}

function Container46() {
  return (
    <div className="bg-[#fef2f2] relative rounded-[4px] shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex gap-[4px] items-center p-[5px] relative size-full">
          <Container47 />
          <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#c10007] text-[12px] whitespace-nowrap">Rapel (Lotado)</p>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border-[#ffe2e2] border-[0.556px] border-solid inset-0 pointer-events-none rounded-[4px]" />
    </div>
  );
}

function Frame3() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full">
      <Container44 />
      <Container46 />
    </div>
  );
}

function MoreEvents1() {
  return (
    <div className="opacity-60 relative shrink-0 w-full" data-name="More events">
      <div className="content-stretch flex items-start px-[8px] relative size-full">
        <p className="flex-[1_0_0] font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] min-w-px not-italic overflow-hidden relative text-[#717680] text-[12px] text-ellipsis whitespace-nowrap">Mais 2...</p>
      </div>
    </div>
  );
}

function Frame2() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[6px] items-start min-w-px relative">
      <Frame3 />
      <MoreEvents1 />
    </div>
  );
}

function CalendarCellMonthView15({ onDayClick }: { onDayClick?: (day: number) => void }) {
  return (
    <div onClick={() => onDayClick?.(1)} className="bg-white flex-[1_0_0] min-h-px relative w-full cursor-pointer hover:bg-[#f8fafc] transition-colors" data-name="_Calendar cell/Month view">
      <div aria-hidden="true" className="absolute border-[#e9eaeb] border-b border-r border-solid inset-0 pointer-events-none" />
      <div className="content-stretch flex gap-[4px] items-start p-[8px] relative size-full">
        <CalendarCellDate15 />
        <Frame2 />
      </div>
    </div>
  );
}

function CalendarCellDate16() {
  return (
    <div className="relative rounded-[9999px] shrink-0 size-[24px]" data-name="_Calendar cell date">
      <p className="absolute font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] left-[4px] not-italic text-[#414651] text-[12px] top-[calc(50%-9px)] whitespace-nowrap">8</p>
    </div>
  );
}

function Container49() {
  return <div className="bg-[#2b7fff] relative rounded-[18641400px] shrink-0 size-[5.998px]" data-name="Container" />;
}

function Container48() {
  return (
    <div className="bg-[#eff6ff] relative rounded-[4px] shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex gap-[4px] items-center p-[5px] relative size-full">
          <Container49 />
          <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#1447e6] text-[12px] whitespace-nowrap">Trilha Pico (8/12)</p>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border-[#dbeafe] border-[0.556px] border-solid inset-0 pointer-events-none rounded-[4px]" />
    </div>
  );
}

function Container51() {
  return <div className="bg-[#fb2c36] relative rounded-[18641400px] shrink-0 size-[5.998px]" data-name="Container" />;
}

function Container50() {
  return (
    <div className="bg-[#fef2f2] relative rounded-[4px] shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex gap-[4px] items-center p-[5px] relative size-full">
          <Container51 />
          <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#c10007] text-[12px] whitespace-nowrap">Rapel (Lotado)</p>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border-[#ffe2e2] border-[0.556px] border-solid inset-0 pointer-events-none rounded-[4px]" />
    </div>
  );
}

function Frame4() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-start min-w-px relative">
      <Container48 />
      <Container50 />
    </div>
  );
}

function CalendarCellMonthView16({ onDayClick }: { onDayClick?: (day: number) => void }) {
  return (
    <div onClick={() => onDayClick?.(8)} className="bg-white flex-[1_0_0] min-h-px relative w-full cursor-pointer hover:bg-[#f8fafc] transition-colors" data-name="_Calendar cell/Month view">
      <div aria-hidden="true" className="absolute border-[#e9eaeb] border-b border-r border-solid inset-0 pointer-events-none" />
      <div className="content-stretch flex gap-[4px] items-start p-[8px] relative size-full">
        <CalendarCellDate16 />
        <Frame4 />
      </div>
    </div>
  );
}

function CalendarCellDate17() {
  return (
    <div className="bg-[#fafafa] relative rounded-[9999px] shrink-0 size-[24px]" data-name="_Calendar cell date">
      <p className="-translate-x-1/2 absolute font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] left-1/2 not-italic text-[#414651] text-[12px] text-center top-[calc(50%-9px)] w-[24px]">15</p>
    </div>
  );
}

function CalendarCellMonthView17({ onDayClick }: { onDayClick?: (day: number) => void }) {
  return (
    <div onClick={() => onDayClick?.(15)} className="bg-white flex-[1_0_0] min-h-px relative w-full cursor-pointer hover:bg-[#f8fafc] transition-colors" data-name="_Calendar cell/Month view">
      <div aria-hidden="true" className="absolute border-[#e9eaeb] border-b border-r border-solid inset-0 pointer-events-none" />
      <div className="content-stretch flex gap-[4px] items-start p-[8px] relative size-full">
        <CalendarCellDate17 />
      </div>
    </div>
  );
}

function CalendarCellDate18() {
  return (
    <div className="relative rounded-[9999px] shrink-0 size-[24px]" data-name="_Calendar cell date">
      <p className="absolute font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] left-[4px] not-italic text-[#414651] text-[12px] top-[calc(50%-9px)] whitespace-nowrap">22</p>
    </div>
  );
}

function Container54() {
  return <div className="bg-[#2b7fff] relative rounded-[18641400px] shrink-0 size-[5.998px]" data-name="Container" />;
}

function Container53() {
  return (
    <div className="bg-[#eff6ff] relative rounded-[4px] shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex gap-[4px] items-center p-[5px] relative size-full">
          <Container54 />
          <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#1447e6] text-[12px] whitespace-nowrap">Trilha Pico (8/12)</p>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border-[#dbeafe] border-[0.556px] border-solid inset-0 pointer-events-none rounded-[4px]" />
    </div>
  );
}

function Container56() {
  return <div className="bg-[#fb2c36] relative rounded-[18641400px] shrink-0 size-[5.998px]" data-name="Container" />;
}

function Container55() {
  return (
    <div className="bg-[#fef2f2] relative rounded-[4px] shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex gap-[4px] items-center p-[5px] relative size-full">
          <Container56 />
          <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#c10007] text-[12px] whitespace-nowrap">Rapel (Lotado)</p>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border-[#ffe2e2] border-[0.556px] border-solid inset-0 pointer-events-none rounded-[4px]" />
    </div>
  );
}

function Container52() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[4px] h-full items-start min-w-px relative" data-name="Container">
      <Container53 />
      <Container55 />
    </div>
  );
}

function CalendarCellMonthView18({ onDayClick }: { onDayClick?: (day: number) => void }) {
  return (
    <div onClick={() => onDayClick?.(22)} className="bg-white flex-[1_0_0] min-h-px relative w-full cursor-pointer hover:bg-[#f8fafc] transition-colors" data-name="_Calendar cell/Month view">
      <div aria-hidden="true" className="absolute border-[#e9eaeb] border-b border-r border-solid inset-0 pointer-events-none" />
      <div className="content-stretch flex gap-[4px] items-start p-[8px] relative size-full">
        <CalendarCellDate18 />
        <Container52 />
      </div>
    </div>
  );
}

function CalendarCellDate19() {
  return (
    <div className="relative rounded-[9999px] shrink-0 size-[24px]" data-name="_Calendar cell date">
      <p className="absolute font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] left-[4px] not-italic text-[#414651] text-[12px] top-[calc(50%-9px)] whitespace-nowrap">29</p>
    </div>
  );
}

function CalendarCellMonthView19({ onDayClick }: { onDayClick?: (day: number) => void }) {
  return (
    <div onClick={() => onDayClick?.(29)} className="bg-white flex-[1_0_0] min-h-px relative w-full cursor-pointer hover:bg-[#f8fafc] transition-colors" data-name="_Calendar cell/Month view">
      <div aria-hidden="true" className="absolute border-[#e9eaeb] border-b border-r border-solid inset-0 pointer-events-none" />
      <div className="content-stretch flex gap-[4px] items-start p-[8px] relative size-full">
        <CalendarCellDate19 />
      </div>
    </div>
  );
}

function Column3({ onDayClick }: { onDayClick?: (day: number) => void }) {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col h-full items-start min-w-px relative" data-name="Column">
      <CalendarColumnHeader3 />
      <CalendarCellMonthView15 onDayClick={onDayClick} />
      <CalendarCellMonthView16 onDayClick={onDayClick} />
      <CalendarCellMonthView17 onDayClick={onDayClick} />
      <CalendarCellMonthView18 onDayClick={onDayClick} />
      <CalendarCellMonthView19 onDayClick={onDayClick} />
    </div>
  );
}

function CalendarColumnHeader4() {
  return (
    <div className="bg-[#f8fafc] relative shrink-0 w-full" data-name="_Calendar column header">
      <div aria-hidden="true" className="absolute border-[#e9eaeb] border-b border-r border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex gap-[4px] items-center justify-center p-[8px] relative size-full">
          <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#90a1b9] text-[12px] whitespace-nowrap">QUI</p>
        </div>
      </div>
    </div>
  );
}

function CalendarCellDate20() {
  return (
    <div className="relative rounded-[9999px] shrink-0 size-[24px]" data-name="_Calendar cell date">
      <p className="absolute font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] left-[4px] not-italic text-[#414651] text-[12px] top-[calc(50%-9px)] whitespace-nowrap">2</p>
    </div>
  );
}

function Container58() {
  return <div className="bg-[#2b7fff] relative rounded-[18641400px] shrink-0 size-[5.998px]" data-name="Container" />;
}

function Container57() {
  return (
    <div className="bg-[#eff6ff] flex-[1_0_0] min-w-px relative rounded-[4px]" data-name="Container">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex gap-[4px] items-center p-[5px] relative size-full">
          <Container58 />
          <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#1447e6] text-[12px] whitespace-nowrap">Trilha Pico (8/12)</p>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border-[#dbeafe] border-[0.556px] border-solid inset-0 pointer-events-none rounded-[4px]" />
    </div>
  );
}

function CalendarCellMonthView20({ onDayClick }: { onDayClick?: (day: number) => void }) {
  return (
    <div onClick={() => onDayClick?.(2)} className="bg-white flex-[1_0_0] min-h-px relative w-full cursor-pointer hover:bg-[#f8fafc] transition-colors" data-name="_Calendar cell/Month view">
      <div aria-hidden="true" className="absolute border-[#e9eaeb] border-b border-r border-solid inset-0 pointer-events-none" />
      <div className="content-stretch flex gap-[4px] items-start p-[8px] relative size-full">
        <CalendarCellDate20 />
        <Container57 />
      </div>
    </div>
  );
}

function CalendarCellDate21() {
  return (
    <div className="bg-[#155dfc] relative rounded-[9999px] shrink-0 size-[24px]" data-name="_Calendar cell date">
      <div className="-translate-x-1/2 -translate-y-1/2 absolute flex flex-col font-['Helvetica_Neue:Medium',sans-serif] justify-center leading-[0] left-1/2 not-italic text-[12px] text-center text-white top-[calc(50%+0.5px)] w-[24px]">
        <p className="leading-[normal]">9</p>
      </div>
    </div>
  );
}

function Container60() {
  return <div className="bg-[#ff992b] relative rounded-[9999px] shrink-0 size-[5.998px]" data-name="Container" />;
}

function Frame15() {
  return (
    <div className="content-stretch flex items-center py-[6px] relative shrink-0">
      <Container60 />
    </div>
  );
}

function Frame20() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col font-['Helvetica_Neue:Regular',sans-serif] gap-[2px] items-start leading-[normal] min-w-px not-italic relative">
      <p className="min-w-full overflow-hidden relative shrink-0 text-[#e0850f] text-[12px] text-ellipsis w-[min-content]">Trilha Pico (8/12)</p>
      <p className="overflow-hidden relative shrink-0 text-[#ba8b4e] text-[10px] text-ellipsis w-[96.002px]">Sem equipe atribuída</p>
    </div>
  );
}

function Container59() {
  return (
    <div className="bg-[#fff2d3] flex-[1_0_0] min-w-px relative rounded-[4px]" data-name="Container">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex gap-[4px] items-start p-[5px] relative size-full">
          <Frame15 />
          <Frame20 />
        </div>
      </div>
      <div aria-hidden="true" className="absolute border-[#fef6db] border-[0.556px] border-solid inset-0 pointer-events-none rounded-[4px]" />
    </div>
  );
}

function CalendarCellMonthView21({ onDayClick }: { onDayClick?: (day: number) => void }) {
  return (
    <div onClick={() => onDayClick?.(9)} className="bg-white flex-[1_0_0] min-h-px relative w-full cursor-pointer hover:bg-[#f8fafc] transition-colors" data-name="_Calendar cell/Month view">
      <div aria-hidden="true" className="absolute border-[#e9eaeb] border-b border-r border-solid inset-0 pointer-events-none" />
      <div className="content-stretch flex gap-[4px] items-start p-[8px] relative size-full">
        <CalendarCellDate21 />
        <Container59 />
      </div>
    </div>
  );
}

function CalendarCellDate22() {
  return (
    <div className="relative rounded-[9999px] shrink-0 size-[24px]" data-name="_Calendar cell date">
      <p className="absolute font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] left-[4px] not-italic text-[#414651] text-[12px] top-[calc(50%-9px)] whitespace-nowrap">16</p>
    </div>
  );
}

function CalendarCellMonthView22({ onDayClick }: { onDayClick?: (day: number) => void }) {
  return (
    <div onClick={() => onDayClick?.(16)} className="bg-white flex-[1_0_0] min-h-px relative w-full cursor-pointer hover:bg-[#f8fafc] transition-colors" data-name="_Calendar cell/Month view">
      <div aria-hidden="true" className="absolute border-[#e9eaeb] border-b border-r border-solid inset-0 pointer-events-none" />
      <div className="content-stretch flex items-start p-[8px] relative size-full">
        <CalendarCellDate22 />
      </div>
    </div>
  );
}

function CalendarCellDate23() {
  return (
    <div className="relative rounded-[9999px] shrink-0 size-[24px]" data-name="_Calendar cell date">
      <p className="absolute font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] left-[4px] not-italic text-[#414651] text-[12px] top-[calc(50%-9px)] whitespace-nowrap">23</p>
    </div>
  );
}

function CalendarCellMonthView23({ onDayClick }: { onDayClick?: (day: number) => void }) {
  return (
    <div onClick={() => onDayClick?.(23)} className="bg-white flex-[1_0_0] min-h-px relative w-full cursor-pointer hover:bg-[#f8fafc] transition-colors" data-name="_Calendar cell/Month view">
      <div aria-hidden="true" className="absolute border-[#e9eaeb] border-b border-r border-solid inset-0 pointer-events-none" />
      <div className="content-stretch flex items-start p-[8px] relative size-full">
        <CalendarCellDate23 />
      </div>
    </div>
  );
}

function CalendarCellDate24() {
  return (
    <div className="relative rounded-[9999px] shrink-0 size-[24px]" data-name="_Calendar cell date">
      <p className="absolute font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] left-[4px] not-italic text-[#414651] text-[12px] top-[calc(50%-9px)] whitespace-nowrap">30</p>
    </div>
  );
}

function CalendarCellMonthView24({ onDayClick }: { onDayClick?: (day: number) => void }) {
  return (
    <div onClick={() => onDayClick?.(30)} className="bg-white flex-[1_0_0] min-h-px relative w-full cursor-pointer hover:bg-[#f8fafc] transition-colors" data-name="_Calendar cell/Month view">
      <div aria-hidden="true" className="absolute border-[#e9eaeb] border-b border-r border-solid inset-0 pointer-events-none" />
      <div className="content-stretch flex gap-[4px] items-start p-[8px] relative size-full">
        <CalendarCellDate24 />
      </div>
    </div>
  );
}

function Column4({ onDayClick }: { onDayClick?: (day: number) => void }) {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col h-full items-start min-w-px relative" data-name="Column">
      <CalendarColumnHeader4 />
      <CalendarCellMonthView20 onDayClick={onDayClick} />
      <CalendarCellMonthView21 onDayClick={onDayClick} />
      <CalendarCellMonthView22 onDayClick={onDayClick} />
      <CalendarCellMonthView23 onDayClick={onDayClick} />
      <CalendarCellMonthView24 onDayClick={onDayClick} />
    </div>
  );
}

function CalendarColumnHeader5() {
  return (
    <div className="bg-[#f8fafc] relative shrink-0 w-full" data-name="_Calendar column header">
      <div aria-hidden="true" className="absolute border-[#e9eaeb] border-b border-r border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex gap-[4px] items-center justify-center p-[8px] relative size-full">
          <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#90a1b9] text-[12px] whitespace-nowrap">SEX</p>
        </div>
      </div>
    </div>
  );
}

function CalendarCellDate25() {
  return (
    <div className="relative rounded-[9999px] shrink-0 size-[24px]" data-name="_Calendar cell date">
      <p className="absolute font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] left-[4px] not-italic text-[#414651] text-[12px] top-[calc(50%-9px)] whitespace-nowrap">3</p>
    </div>
  );
}

function Container62() {
  return <div className="bg-[#2b7fff] relative rounded-[18641400px] shrink-0 size-[5.998px]" data-name="Container" />;
}

function Container61() {
  return (
    <div className="bg-[#eff6ff] relative rounded-[4px] shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex gap-[4px] items-center p-[5px] relative size-full">
          <Container62 />
          <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#1447e6] text-[12px] whitespace-nowrap">Trilha Pico (8/12)</p>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border-[#dbeafe] border-[0.556px] border-solid inset-0 pointer-events-none rounded-[4px]" />
    </div>
  );
}

function MoreEvents2() {
  return (
    <div className="opacity-60 relative shrink-0 w-full" data-name="More events">
      <div className="content-stretch flex items-start px-[8px] relative size-full">
        <p className="flex-[1_0_0] font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] min-w-px not-italic overflow-hidden relative text-[#717680] text-[12px] text-ellipsis whitespace-nowrap">Mais 2...</p>
      </div>
    </div>
  );
}

function Frame5() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[6px] items-start min-w-px relative">
      <Container61 />
      <MoreEvents2 />
    </div>
  );
}

function Frame16() {
  return (
    <div className="content-stretch flex gap-[4px] items-start relative shrink-0 w-full">
      <CalendarCellDate25 />
      <Frame5 />
    </div>
  );
}

function Elements12() {
  return (
    <div className="absolute inset-[8.33%]" data-name="elements">
      <div className="absolute inset-[-4.29%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12.6667 12.6667">
          <g id="elements">
            <path d={svgPaths.p113f5f0} id="Ellipse 1334" stroke="var(--stroke-0, #8200DB)" />
            <path d={svgPaths.p2c4e4400} id="Vector" stroke="var(--stroke-0, #8200DB)" strokeLinecap="round" strokeLinejoin="round" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function CalendarCellMonthView25({ onDayClick }: { onDayClick?: (day: number) => void }) {
  return (
    <div onClick={() => onDayClick?.(3)} className="bg-white flex-[1_0_0] min-h-px relative w-full cursor-pointer hover:bg-[#f8fafc] transition-colors" data-name="_Calendar cell/Month view">
      <div aria-hidden="true" className="absolute border-[#e9eaeb] border-b border-r border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col items-end size-full">
        <div className="content-stretch flex flex-col items-end justify-between p-[8px] relative size-full">
          <Frame16 />
          <div className="bg-[#f3e8ff] relative rounded-[8px] shrink-0" data-name="Alert Badge, Contract">
            <div className="content-stretch flex gap-[4px] items-center justify-center overflow-clip px-[8.556px] py-[2.556px] relative rounded-[inherit] size-full">
              <div className="relative shrink-0 size-[14px]" data-name="star-circle">
                <div className="bg-clip-padding border-0 border-[transparent] border-solid overflow-clip relative rounded-[inherit] size-full">
                  <Elements12 />
                </div>
              </div>
              <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#8200db] text-[12px] whitespace-nowrap">Sexta-feira Santa</p>
            </div>
            <div aria-hidden="true" className="absolute border-[#dab2ff] border-[0.556px] border-solid inset-0 pointer-events-none rounded-[8px]" />
          </div>
        </div>
      </div>
    </div>
  );
}

function CalendarCellDate26() {
  return (
    <div className="relative rounded-[9999px] shrink-0 size-[24px]" data-name="_Calendar cell date">
      <p className="absolute font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] left-[4px] not-italic text-[#414651] text-[12px] top-[calc(50%-9px)] whitespace-nowrap">10</p>
    </div>
  );
}

function CalendarCellMonthView26({ onDayClick }: { onDayClick?: (day: number) => void }) {
  return (
    <div onClick={() => onDayClick?.(10)} className="bg-white flex-[1_0_0] min-h-px relative w-full cursor-pointer hover:bg-[#f8fafc] transition-colors" data-name="_Calendar cell/Month view">
      <div aria-hidden="true" className="absolute border-[#e9eaeb] border-b border-r border-solid inset-0 pointer-events-none" />
      <div className="content-stretch flex gap-[4px] items-start p-[8px] relative size-full">
        <CalendarCellDate26 />
      </div>
    </div>
  );
}

function CalendarCellDate27() {
  return (
    <div className="relative rounded-[9999px] shrink-0 size-[24px]" data-name="_Calendar cell date">
      <p className="absolute font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] left-[4px] not-italic text-[#414651] text-[12px] top-[calc(50%-9px)] whitespace-nowrap">17</p>
    </div>
  );
}

function Container64() {
  return <div className="bg-[#2b7fff] relative rounded-[18641400px] shrink-0 size-[5.998px]" data-name="Container" />;
}

function Container63() {
  return (
    <div className="bg-[#eff6ff] flex-[1_0_0] min-w-px relative rounded-[4px]" data-name="Container">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex gap-[4px] items-center p-[5px] relative size-full">
          <Container64 />
          <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#1447e6] text-[12px] whitespace-nowrap">Trilha Pico (8/12)</p>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border-[#dbeafe] border-[0.556px] border-solid inset-0 pointer-events-none rounded-[4px]" />
    </div>
  );
}

function CalendarCellMonthView27({ onDayClick }: { onDayClick?: (day: number) => void }) {
  return (
    <div onClick={() => onDayClick?.(17)} className="bg-white flex-[1_0_0] min-h-px relative w-full cursor-pointer hover:bg-[#f8fafc] transition-colors" data-name="_Calendar cell/Month view">
      <div aria-hidden="true" className="absolute border-[#e9eaeb] border-b border-r border-solid inset-0 pointer-events-none" />
      <div className="content-stretch flex gap-[4px] items-start p-[8px] relative size-full">
        <CalendarCellDate27 />
        <Container63 />
      </div>
    </div>
  );
}

function CalendarCellDate28() {
  return (
    <div className="relative rounded-[9999px] shrink-0 size-[24px]" data-name="_Calendar cell date">
      <p className="absolute font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] left-[4px] not-italic text-[#414651] text-[12px] top-[calc(50%-9px)] whitespace-nowrap">24</p>
    </div>
  );
}

function Events1() {
  return <div className="content-stretch flex flex-[1_0_0] flex-col gap-[4px] h-[86px] items-start min-w-px relative" data-name="Events" />;
}

function CalendarCellMonthView28({ onDayClick }: { onDayClick?: (day: number) => void }) {
  return (
    <div onClick={() => onDayClick?.(24)} className="bg-white flex-[1_0_0] min-h-px relative w-full cursor-pointer hover:bg-[#f8fafc] transition-colors" data-name="_Calendar cell/Month view">
      <div aria-hidden="true" className="absolute border-[#e9eaeb] border-b border-r border-solid inset-0 pointer-events-none" />
      <div className="content-stretch flex gap-[4px] items-start p-[8px] relative size-full">
        <CalendarCellDate28 />
        <Events1 />
      </div>
    </div>
  );
}

function CalendarCellDate29() {
  return (
    <div className="relative rounded-[9999px] shrink-0 size-[24px]" data-name="_Calendar cell date">
      <p className="absolute font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] left-[4px] not-italic text-[#717680] text-[12px] top-[calc(50%-9px)] whitespace-nowrap">1</p>
    </div>
  );
}

function Container67() {
  return <div className="bg-[#2b7fff] relative rounded-[18641400px] shrink-0 size-[5.998px]" data-name="Container" />;
}

function Container66() {
  return (
    <div className="bg-[#eff6ff] relative rounded-[4px] shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex gap-[4px] items-center p-[5px] relative size-full">
          <Container67 />
          <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#1447e6] text-[12px] whitespace-nowrap">Trilha Pico</p>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border-[#dbeafe] border-[0.556px] border-solid inset-0 pointer-events-none rounded-[4px]" />
    </div>
  );
}

function Container69() {
  return <div className="bg-[#fb2c36] relative rounded-[18641400px] shrink-0 size-[5.998px]" data-name="Container" />;
}

function Container68() {
  return (
    <div className="bg-[#fef2f2] relative rounded-[4px] shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex gap-[4px] items-center p-[5px] relative size-full">
          <Container69 />
          <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#c10007] text-[12px] whitespace-nowrap">Rapel (Lotado)</p>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border-[#ffe2e2] border-[0.556px] border-solid inset-0 pointer-events-none rounded-[4px]" />
    </div>
  );
}

function Container65() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-start min-w-px opacity-0 relative self-stretch" data-name="Container">
      <Container66 />
      <Container68 />
    </div>
  );
}

function Frame18() {
  return (
    <div className="content-stretch flex gap-[4px] items-start relative shrink-0 w-full">
      <CalendarCellDate29 />
      <Container65 />
    </div>
  );
}

function Elements13() {
  return (
    <div className="absolute inset-[8.33%]" data-name="elements">
      <div className="absolute inset-[-4.29%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12.6667 12.6667">
          <g id="elements">
            <path d={svgPaths.p113f5f0} id="Ellipse 1334" stroke="var(--stroke-0, #8200DB)" />
            <path d={svgPaths.p2c4e4400} id="Vector" stroke="var(--stroke-0, #8200DB)" strokeLinecap="round" strokeLinejoin="round" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function CalendarCellMonthView29() {
  return (
    <div className="bg-white flex-[1_0_0] min-h-px relative w-full" data-name="_Calendar cell/Month view">
      <div className="flex flex-col items-end overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col items-end justify-between p-[8px] relative size-full">
          <Frame18 />
          <div className="bg-[#f3e8ff] relative rounded-[8px] shrink-0" data-name="Alert Badge, Contract">
            <div className="content-stretch flex gap-[4px] items-center justify-center overflow-clip px-[8.556px] py-[2.556px] relative rounded-[inherit] size-full">
              <div className="relative shrink-0 size-[14px]" data-name="star-circle">
                <div className="bg-clip-padding border-0 border-[transparent] border-solid overflow-clip relative rounded-[inherit] size-full">
                  <Elements13 />
                </div>
              </div>
              <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#8200db] text-[12px] whitespace-nowrap">Dia do trabalho</p>
            </div>
            <div aria-hidden="true" className="absolute border-[#dab2ff] border-[0.556px] border-solid inset-0 pointer-events-none rounded-[8px]" />
          </div>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border-[#e9eaeb] border-b border-r border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Column5({ onDayClick }: { onDayClick?: (day: number) => void }) {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col h-full items-start min-w-px relative" data-name="Column">
      <CalendarColumnHeader5 />
      <CalendarCellMonthView25 onDayClick={onDayClick} />
      <CalendarCellMonthView26 onDayClick={onDayClick} />
      <CalendarCellMonthView27 onDayClick={onDayClick} />
      <CalendarCellMonthView28 onDayClick={onDayClick} />
      <CalendarCellMonthView29 />
    </div>
  );
}

function CalendarColumnHeader6() {
  return (
    <div className="bg-[#f8fafc] relative shrink-0 w-full" data-name="_Calendar column header">
      <div aria-hidden="true" className="absolute border-[#e9eaeb] border-b border-r border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex gap-[4px] items-center justify-center p-[8px] relative size-full">
          <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#90a1b9] text-[12px] whitespace-nowrap">SÁB</p>
        </div>
      </div>
    </div>
  );
}

function CalendarCellDate30() {
  return (
    <div className="relative rounded-[9999px] shrink-0 size-[24px]" data-name="_Calendar cell date">
      <p className="absolute font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] left-[4px] not-italic text-[#717680] text-[12px] top-[calc(50%-9px)] whitespace-nowrap">4</p>
    </div>
  );
}

function Container71() {
  return <div className="bg-[#2b7fff] relative rounded-[18641400px] shrink-0 size-[5.998px]" data-name="Container" />;
}

function Container70() {
  return (
    <div className="bg-[#eff6ff] flex-[1_0_0] min-w-px relative rounded-[4px]" data-name="Container">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex gap-[4px] items-center p-[5px] relative size-full">
          <Container71 />
          <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#1447e6] text-[12px] whitespace-nowrap">Trilha Pico (8/12)</p>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border-[#dbeafe] border-[0.556px] border-solid inset-0 pointer-events-none rounded-[4px]" />
    </div>
  );
}

function CalendarCellMonthView30() {
  return (
    <div className="bg-white flex-[1_0_0] min-h-px relative w-full" data-name="_Calendar cell/Month view">
      <div aria-hidden="true" className="absolute border-[#e9eaeb] border-b border-r border-solid inset-0 pointer-events-none" />
      <div className="content-stretch flex gap-[4px] items-start p-[8px] relative size-full">
        <CalendarCellDate30 />
        <Container70 />
      </div>
    </div>
  );
}

function CalendarCellDate31() {
  return (
    <div className="relative rounded-[9999px] shrink-0 size-[24px]" data-name="_Calendar cell date">
      <p className="absolute font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] left-[4px] not-italic text-[#717680] text-[12px] top-[calc(50%-9px)] whitespace-nowrap">11</p>
    </div>
  );
}

function CalendarCellMonthView31() {
  return (
    <div className="bg-white flex-[1_0_0] min-h-px relative w-full" data-name="_Calendar cell/Month view">
      <div aria-hidden="true" className="absolute border-[#e9eaeb] border-b border-r border-solid inset-0 pointer-events-none" />
      <div className="content-stretch flex gap-[4px] items-start p-[8px] relative size-full">
        <CalendarCellDate31 />
      </div>
    </div>
  );
}

function CalendarCellDate32() {
  return (
    <div className="relative rounded-[9999px] shrink-0 size-[24px]" data-name="_Calendar cell date">
      <p className="absolute font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] left-[4px] not-italic text-[#717680] text-[12px] top-[calc(50%-9px)] whitespace-nowrap">18</p>
    </div>
  );
}

function Events2() {
  return <div className="content-stretch flex flex-[1_0_0] flex-col gap-[4px] h-[86px] items-start min-w-px relative" data-name="Events" />;
}

function CalendarCellMonthView32() {
  return (
    <div className="bg-white flex-[1_0_0] min-h-px relative w-full" data-name="_Calendar cell/Month view">
      <div aria-hidden="true" className="absolute border-[#e9eaeb] border-b border-r border-solid inset-0 pointer-events-none" />
      <div className="content-stretch flex gap-[4px] items-start p-[8px] relative size-full">
        <CalendarCellDate32 />
        <Events2 />
      </div>
    </div>
  );
}

function CalendarCellDate33() {
  return (
    <div className="relative rounded-[9999px] shrink-0 size-[24px]" data-name="_Calendar cell date">
      <p className="absolute font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] left-[4px] not-italic text-[#717680] text-[12px] top-[calc(50%-9px)] whitespace-nowrap">25</p>
    </div>
  );
}

function Events3() {
  return <div className="content-stretch flex flex-[1_0_0] flex-col gap-[4px] h-[86px] items-start min-w-px relative" data-name="Events" />;
}

function CalendarCellMonthView33() {
  return (
    <div className="bg-white flex-[1_0_0] min-h-px relative w-full" data-name="_Calendar cell/Month view">
      <div aria-hidden="true" className="absolute border-[#e9eaeb] border-b border-r border-solid inset-0 pointer-events-none" />
      <div className="content-stretch flex gap-[4px] items-start p-[8px] relative size-full">
        <CalendarCellDate33 />
        <Events3 />
      </div>
    </div>
  );
}

function CalendarCellDate34() {
  return (
    <div className="relative rounded-[9999px] shrink-0 size-[24px]" data-name="_Calendar cell date">
      <p className="absolute font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] left-[4px] not-italic text-[#717680] text-[12px] top-[calc(50%-9px)] whitespace-nowrap">2</p>
    </div>
  );
}

function CalendarCellMonthView34() {
  return (
    <div className="bg-white flex-[1_0_0] min-h-px relative w-full" data-name="_Calendar cell/Month view">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex gap-[4px] items-start p-[8px] relative size-full">
          <CalendarCellDate34 />
        </div>
      </div>
      <div aria-hidden="true" className="absolute border-[#e9eaeb] border-b border-r border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Column6() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col h-full items-start min-w-px relative" data-name="Column">
      <CalendarColumnHeader6 />
      <CalendarCellMonthView30 />
      <CalendarCellMonthView31 />
      <CalendarCellMonthView32 />
      <CalendarCellMonthView33 />
      <CalendarCellMonthView34 />
    </div>
  );
}

// ─── Dynamic May 2026 calendar grid ─────────────────────────────────────────
// Replaces the static April 2026 Column0-6 with a date-fns-powered grid.
// CSS classes are verbatim copies from the Figma Make components above.
// Everything outside Content() is untouched.

const CAL_TODAY = new Date(); // Dynamic "today"
const CAL_REF = new Date(CAL_TODAY.getFullYear(), CAL_TODAY.getMonth(), 1); // Current month

// Use centralized holidays from mock
const CAL_HOLIDAYS = allHolidays;

const CAL_WD = ["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SÁB"] as const;

// Grid builder — called dynamically per refDate
function buildCalGrid(ref: Date) {
  const mStart = startOfMonth(ref);
  const mEnd = endOfMonth(ref);
  const gStart = startOfWeek(mStart, { weekStartsOn: 0 });
  const gEnd = endOfWeek(mEnd, { weekStartsOn: 0 });
  return eachDayOfInterval({ start: gStart, end: gEnd }).map((d) => ({
    date: d,
    day: d.getDate(),
    iso: format(d, "yyyy-MM-dd"),
    inMonth: isSameMonth(d, ref),
    isToday: isSameDay(d, CAL_TODAY),
  }));
}

function calGetActs(iso: string): Activity[] {
  return mockActivities.filter((a) => a.date === iso);
}

function calLabel(a: Activity): { name: string; info: string } {
  const words = a.name.split(" ");
  const short = words.length > 2 ? `${words[0]} ${words[1]}` : a.name;
  const dayTag = a.dayNumber ? ` D${a.dayNumber}` : "";
  if (a.status === "full") return { name: short, info: "(Lotado)" };
  if (a.status === "blocked") return { name: short, info: "" };
  return { name: `${short}${dayTag}`, info: `(${a.occupancy}/${a.capacity})` };
}

const CAL_COLORS: Record<ActivityStatus, { bg: string; dot: string; txt: string; bdr: string; sub?: string }> = {
  confirmed: { bg: "#eff6ff", dot: "#2b7fff", txt: "#1447e6", bdr: "#dbeafe" },
  pending:   { bg: "#fff2d3", dot: "#ff992b", txt: "#e0850f", bdr: "#fef6db", sub: "#ba8b4e" },
  full:      { bg: "#fef2f2", dot: "#fb2c36", txt: "#c10007", bdr: "#ffe2e2" },
  blocked:   { bg: "#fafafa", dot: "#d5d7da", txt: "#414651", bdr: "#f2f2f2", sub: "#919191" },
};

// Single-line chip (confirmed / full)
function CalSingleChip({ name, info, c }: { name: string; info: string; c: (typeof CAL_COLORS)[ActivityStatus] }) {
  return (
    <div className="relative rounded-[6px] shrink-0 w-full" style={{ backgroundColor: c.dot }}>
      <div className="flex items-center overflow-hidden rounded-[inherit] w-full">
        <div className="flex gap-[4px] items-center min-w-0 px-[7px] py-[3px] w-full">
          <p className="flex-1 font-['Helvetica_Neue:Medium',sans-serif] leading-[normal] min-w-0 not-italic overflow-hidden text-[10px] text-ellipsis whitespace-nowrap text-white">{name}</p>
          {info && <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic shrink-0 text-[10px] whitespace-nowrap text-white/70">{info}</p>}
        </div>
      </div>
    </div>
  );
}

// Two-line chip (pending / blocked)
function CalDoubleChip({ name, info, sub, c }: { name: string; info: string; sub: string; c: (typeof CAL_COLORS)[ActivityStatus] }) {
  return (
    <div className="min-w-0 relative rounded-[6px] w-full" style={{ backgroundColor: c.dot }}>
      <div className="overflow-hidden rounded-[inherit] w-full">
        <div className="flex flex-col gap-[1px] px-[7px] py-[3px] w-full">
          <div className="flex gap-[4px] items-center min-w-0 w-full">
            <p className="flex-1 font-['Helvetica_Neue:Medium',sans-serif] leading-[normal] min-w-0 not-italic overflow-hidden text-[10px] text-ellipsis whitespace-nowrap text-white">{name}</p>
            {info && <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic shrink-0 text-[10px] whitespace-nowrap text-white/70">{info}</p>}
          </div>
          <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic overflow-hidden text-[9px] text-ellipsis whitespace-nowrap text-white/60">{sub}</p>
        </div>
      </div>
    </div>
  );
}

// Holiday badge (purple)
function CalHolidayBadge({ label }: { label: string }) {
  return (
    <div className="bg-[#8200db] max-w-full overflow-hidden relative rounded-[6px]">
      <div className="flex gap-[4px] items-center overflow-hidden px-[8px] py-[4px] relative rounded-[inherit]">
        <p className="font-['Helvetica_Neue:Medium',sans-serif] leading-[normal] min-w-0 not-italic overflow-hidden relative text-white text-[11px] text-ellipsis whitespace-nowrap">{label}</p>
      </div>
    </div>
  );
}

// Activity chips (max 2 visible + overflow)
function CalChips({ acts }: { acts: Activity[] }) {
  const maxContentHeight = 76;
  const moreRowHeight = 16;
  let usedHeight = 0;
  const visible: Activity[] = [];

  for (const activity of acts) {
    const chipHeight = activity.status === "pending" || activity.status === "blocked" ? 29 : 22;
    const gapHeight = visible.length > 0 ? 4 : 0;
    const remainingAfterThis = acts.length - visible.length - 1;
    const reservedMoreHeight = remainingAfterThis > 0 ? moreRowHeight + 4 : 0;

    if (usedHeight + gapHeight + chipHeight + reservedMoreHeight > maxContentHeight) break;
    visible.push(activity);
    usedHeight += gapHeight + chipHeight;
  }

  const overflow = acts.length - visible.length;
  return (
    <div className="flex w-full flex-col gap-[4px] items-start min-w-0 overflow-hidden relative">
      {visible.map((a) => {
        const c = CAL_COLORS[a.status];
        const { name, info } = calLabel(a);
        if (a.status === "pending") {
          const sub = a.requiresInsurance ? "Seguro pendente" : "Sem equipe atribuída";
          return <CalDoubleChip key={a.id} name={name} info={info} sub={sub} c={c} />;
        }
        if (a.status === "blocked") {
          return <CalDoubleChip key={a.id} name={name} info={info} sub="Interrompida p/ Feriado" c={c} />;
        }
        return <CalSingleChip key={a.id} name={name} info={info} c={c} />;
      })}
      {overflow > 0 && (
        <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic opacity-60 px-[5px] text-[#717680] text-[12px] whitespace-nowrap">
          Mais {overflow}...
        </p>
      )}
    </div>
  );
}

// Single day cell
function CalDayCell({
  cell,
  onDayClick,
  showWeekday,
}: {
  cell: (typeof CAL_GRID)[number];
  onDayClick?: (day: number) => void;
  showWeekday?: boolean;
}) {
  const holiday = cell.inMonth ? CAL_HOLIDAYS[cell.iso] : undefined;
  const acts = cell.inMonth ? calGetActs(cell.iso) : [];
  const clickable = cell.inMonth;
  const weekday = showWeekday ? CAL_WD[cell.date.getDay()] : undefined;

  return (
    <div
      onClick={clickable ? () => onDayClick?.(cell.day) : undefined}
      className={`bg-white h-[120px] min-w-[108px] overflow-hidden relative shrink-0 w-full${clickable ? " cursor-pointer hover:bg-[#fafbfc] transition-colors" : ""}`}
      data-name="_Calendar cell/Month view"
    >
      <div aria-hidden="true" className="absolute border-[#e9eaeb] border-b border-r border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col gap-[6px] px-[12px] pb-[10px] pt-[10px] relative size-full">
        {/* Header row: weekday label (left) + day number (right) */}
        <div className="flex items-center justify-between w-full mb-[2px]">
          {weekday ? (
            <p className="font-['Helvetica_Neue:Medium',sans-serif] leading-[normal] not-italic text-[#535862] text-[12px] whitespace-nowrap">{weekday[0] + weekday.slice(1).toLowerCase()}</p>
          ) : (
            <span />
          )}
          {cell.isToday ? (
            <div className="bg-[#155dfc] rounded-[9999px] size-[24px] flex items-center justify-center">
              <p className="font-['Helvetica_Neue:Medium',sans-serif] leading-[normal] not-italic text-[12px] text-white">{cell.day}</p>
            </div>
          ) : (
            <p className={`font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic text-[12px] whitespace-nowrap ${cell.inMonth ? "text-[#414651]" : "text-[#a4a7ae]"}`}>
              {cell.day}
            </p>
          )}
        </div>
        {/* Activity chips */}
        {acts.length > 0 && <CalChips acts={acts} />}
        {holiday && <CalHolidayBadge label={holiday} />}
      </div>
    </div>
  );
}

function Content({ onDayClick, refDate }: { onDayClick?: (day: number) => void; refDate: Date }) {
  const grid = useMemo(() => buildCalGrid(refDate), [refDate]);
  return (
    <div className="grid grid-cols-[repeat(7,minmax(108px,1fr))] justify-start relative w-full overflow-hidden" data-name="Content">
      {grid.map((cell, i) => (
        <CalDayCell key={cell.iso} cell={cell} onDayClick={onDayClick} showWeekday={i < 7} />
      ))}
    </div>
  );
}

function Main({ onDayClick, refDate }: { onDayClick?: (day: number) => void; refDate: Date }) {
  return (
    <div className="bg-white relative rounded-[16px] w-full" data-name="Main">
      <div className="content-stretch flex flex-col items-start overflow-clip relative rounded-[inherit] w-full">
        <Content onDayClick={onDayClick} refDate={refDate} />
      </div>
      <div aria-hidden="true" className="absolute border border-[#e2e8f0] border-solid inset-0 pointer-events-none rounded-[16px]" />
    </div>
  );
}

// ─── Week View ──────────────────────────────────────────────────────────────

const WEEK_DAY_NAMES = ["DOMINGO", "SEGUNDA", "TERÇA", "QUARTA", "QUINTA", "SEXTA", "SÁBADO"] as const;

const WEEK_STATUS_BORDER: Record<ActivityStatus, string> = {
  confirmed: "#2b7fff",
  pending:   "#ff992b",
  full:      "#fb2c36",
  blocked:   "#d5d7da",
};

function WeekActivityCard({ a, onClick }: { a: Activity; onClick?: () => void }) {
  const c = CAL_COLORS[a.status];
  const borderColor = WEEK_STATUS_BORDER[a.status];
  const isBlocked = a.status === "blocked";
  const isFull = a.status === "full";

  let statusLine = `${a.occupancy}/${a.capacity}`;
  if (isFull) statusLine = "Lotado";
  if (isBlocked) statusLine = "Interrompida p/ Feriado";

  const hasMissingGuide = a.status === "pending" && !a.guideName;

  return (
    <div
      onClick={onClick}
      className={`relative rounded-[12px] w-full shrink-0${onClick ? " cursor-pointer hover:shadow-md transition-shadow" : ""}`}
      style={{
        backgroundColor: isBlocked ? "#fafafa" : "white",
        borderLeft: `4px ${isBlocked ? "dashed" : "solid"} ${borderColor}`,
      }}
    >
      <div aria-hidden="true" className="absolute border border-[#e9eaeb] border-solid inset-0 pointer-events-none rounded-[12px]" style={isBlocked ? { borderStyle: "dashed" } : undefined} />
      <div className="content-stretch flex flex-col gap-[6px] p-[12px] relative size-full">
        <p className="font-['Helvetica_Neue:Medium',sans-serif] leading-[normal] not-italic text-[13px] whitespace-nowrap overflow-hidden text-ellipsis" style={{ color: c.txt }}>
          {a.name}
        </p>
        <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic text-[11px] text-[#717680]">
          {a.startTime} às {a.endTime}
        </p>
        <div className="content-stretch flex items-center gap-[6px]">
          <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic text-[11px] text-[#717680]">
            {statusLine}
          </p>
          {hasMissingGuide && (
            <span className="bg-[#fff2d3] border border-[#fef6db] border-solid font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic px-[6px] py-[1px] rounded-[4px] text-[10px] text-[#e0850f] whitespace-nowrap">
              Sem guia
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function WeekTimeEvent({ a, onClick }: { a: Activity; onClick?: () => void }) {
  const c = CAL_COLORS[a.status];
  const isFull = a.status === "full";
  const isBlocked = a.status === "blocked";
  const label = isFull ? "Lotado" : isBlocked ? "Bloqueado" : `${a.occupancy}/${a.capacity}`;

  return (
    <button
      onClick={onClick}
      className="relative w-full rounded-[10px] text-left cursor-pointer transition-shadow hover:shadow-sm"
      style={{ backgroundColor: c.bg }}
    >
      <div aria-hidden="true" className="absolute border-[0.556px] border-solid inset-0 pointer-events-none rounded-[10px]" style={{ borderColor: c.bdr }} />
      <div className="content-stretch flex flex-col gap-[8px] overflow-hidden px-[12px] py-[10px] relative rounded-[inherit]">
        <div className="content-stretch flex gap-[6px] items-center min-w-0">
          <div className="rounded-[9999px] shrink-0 size-[6px]" style={{ backgroundColor: c.dot }} />
          <p className="flex-1 font-['Helvetica_Neue:Medium',sans-serif] leading-[normal] min-w-0 not-italic overflow-hidden text-[13px] text-ellipsis whitespace-nowrap" style={{ color: c.txt }}>
            {a.name}
          </p>
        </div>
        <div className="content-stretch flex items-center justify-between gap-[8px] min-w-0">
          <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] min-w-0 not-italic overflow-hidden text-[11px] text-ellipsis whitespace-nowrap" style={{ color: c.txt }}>
            {a.startTime} - {a.endTime}
          </p>
          <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic shrink-0 text-[11px] whitespace-nowrap" style={{ color: c.txt }}>
            {label}
          </p>
        </div>
      </div>
    </button>
  );
}

function WeekContent({ weekStart, onDayClick, onViewDetails }: { weekStart: Date; onDayClick?: (day: number) => void; onViewDetails?: (activityId?: string) => void }) {
  const days = eachDayOfInterval({ start: weekStart, end: addDays(weekStart, 6) });
  const hours = [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18] as const;

  return (
    <div className="bg-white relative rounded-[16px] w-full" data-name="WeekContent">
      <div className="content-stretch flex flex-col items-start overflow-clip relative rounded-[inherit] w-full">
        <div className="content-stretch flex items-stretch relative w-full">
          <div className="bg-[#f8fafc] shrink-0 w-[64px]">
            <div aria-hidden="true" className="absolute border-[#e9eaeb] border-b border-r border-solid inset-0 pointer-events-none" />
          </div>
          {days.map((day) => {
            const isToday = isSameDay(day, CAL_TODAY);
            const dayNum = day.getDate();
            return (
              <button
                key={format(day, "yyyy-MM-dd")}
                onClick={() => onDayClick?.(dayNum)}
                className="bg-[#f8fafc] content-stretch flex flex-[1_0_0] flex-col gap-[2px] items-center justify-center min-w-px px-[8px] py-[14px] relative cursor-pointer"
              >
                <div aria-hidden="true" className="absolute border-[#e9eaeb] border-b border-r border-solid inset-0 pointer-events-none" />
                <p className={`font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic text-[12px] whitespace-nowrap ${isToday ? "text-[#155dfc]" : "text-[#90a1b9]"}`}>
                  {WEEK_DAY_NAMES[day.getDay()].slice(0, 3)}
                </p>
                {isToday ? (
                  <div className="bg-[#155dfc] flex items-center justify-center rounded-[9999px] size-[28px]">
                    <p className="font-['Helvetica_Neue:Medium',sans-serif] leading-[normal] not-italic text-[13px] text-white">{dayNum}</p>
                  </div>
                ) : (
                  <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic text-[13px] text-[#414651]">{dayNum}</p>
                )}
              </button>
            );
          })}
        </div>
        <div className="content-stretch flex items-stretch relative w-full">
          <div className="content-stretch flex shrink-0 w-[64px] flex-col items-start">
            {hours.map((hour) => (
              <div key={hour} className="bg-white h-[82px] relative shrink-0 w-full">
                <div aria-hidden="true" className="absolute border-[#e9eaeb] border-b border-r border-solid inset-0 pointer-events-none" />
                <p className="absolute font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] left-[16px] not-italic text-[#717680] text-[12px] top-[10px] whitespace-nowrap">
                  {String(hour).padStart(2, "0")}:00
                </p>
              </div>
            ))}
          </div>
          {days.map((day) => {
            const iso = format(day, "yyyy-MM-dd");
            const dayActs = mockActivities.filter((a) => a.date === iso);
            return (
              <div key={iso} className="content-stretch flex flex-[1_0_0] flex-col items-start min-w-px relative">
                {hours.map((hour) => {
                  const hourActs = dayActs.filter((a) => Number(a.startTime.slice(0, 2)) === hour);
                  return (
                    <div key={`${iso}-${hour}`} className="bg-white h-[82px] overflow-hidden relative shrink-0 w-full">
                      <div aria-hidden="true" className="absolute border-[#e9eaeb] border-b border-r border-solid inset-0 pointer-events-none" />
                      <div className="content-stretch flex flex-col gap-[6px] items-start p-[6px] relative size-full">
                        {hourActs.slice(0, 1).map((a) => (
                          <WeekTimeEvent key={a.id} a={a} onClick={() => onViewDetails?.(a.id)} />
                        ))}
                        {hourActs.length > 1 && (
                          <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic px-[6px] text-[#717680] text-[11px] whitespace-nowrap">
                            Mais {hourActs.length - 1}...
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[#e2e8f0] border-solid inset-0 pointer-events-none rounded-[16px]" />
    </div>
  );
}

// ─── Day View ───────────────────────────────────────────────────────────────

function DayIcon({ type, className = "text-[#717680]" }: { type: "clock" | "calendar" | "users" | "team" | "alert" | "shield" | "close" | "check" | "progress"; className?: string }) {
  if (type === "clock") {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" className={className}>
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
        <path d="M12 8V12L14 14" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
      </svg>
    );
  }
  if (type === "calendar") {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" className={className}>
        <path d="M16 2V6M8 2V6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        <path d="M13 4H11C7.23 4 5.34 4 4.17 5.17C3 6.34 3 8.23 3 12V14C3 17.77 3 19.66 4.17 20.83C5.34 22 7.23 22 11 22H13C16.77 22 18.66 22 19.83 20.83C21 19.66 21 17.77 21 14V12C21 8.23 21 6.34 19.83 5.17C18.66 4 16.77 4 13 4Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        <path d="M3 10H21" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
      </svg>
    );
  }
  if (type === "users" || type === "team") {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" className={className}>
        <path d="M13 7C13 9.21 11.21 11 9 11C6.79 11 5 9.21 5 7C5 4.79 6.79 3 9 3C11.21 3 13 4.79 13 7Z" stroke="currentColor" strokeWidth="1.5" />
        <path d="M15 11C17.21 11 19 9.21 19 7C19 4.79 17.21 3 15 3" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        <path d="M11 14H7C4.24 14 2 16.24 2 19C2 20.1 2.9 21 4 21H14C15.1 21 16 20.1 16 19C16 16.24 13.76 14 11 14Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.5" />
        <path d="M17 14C19.76 14 22 16.24 22 19C22 20.1 21.1 21 20 21H18.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
      </svg>
    );
  }
  if (type === "shield") {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" className={className}>
        <path d="M18.7 3.5C16.82 2.55 14.5 2 12 2C9.5 2 7.18 2.55 5.3 3.5C4.36 3.96 3.9 4.19 3.45 4.91C3 5.64 3 6.34 3 7.75V11.24C3 16.92 7.54 20.08 10.17 21.43C10.91 21.81 11.27 22 12 22C12.73 22 13.09 21.81 13.83 21.43C16.46 20.08 21 16.92 21 11.24V7.75C21 6.34 21 5.64 20.55 4.91C20.1 4.19 19.64 3.96 18.7 3.5Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        <path d="M9 11.5C9 11.5 10.4 11.75 11 13.5C11 13.5 12.5 10.5 15 9.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
      </svg>
    );
  }
  if (type === "close") {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" className={className}>
        <path d="M18 6L6 18M18 18L6 6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
      </svg>
    );
  }
  if (type === "check") {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" className={className}>
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
        <path d="M8 12.75C8 12.75 9.6 13.66 10.4 15C10.4 15 12.8 9.75 16 8" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
      </svg>
    );
  }
  if (type === "progress") {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" className={className}>
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        <path d="M12 6C13.05 6 14.09 6.28 15 6.8C15.91 7.33 16.67 8.09 17.2 9C17.72 9.91 18 10.95 18 12C18 13.05 17.72 14.09 17.2 15C16.67 15.91 15.91 16.67 15 17.2C14.09 17.72 13.05 18 12 18C10.95 18 9.91 17.72 9 17.2C8.09 16.67 7.33 15.91 6.8 15L12 12V6Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
      </svg>
    );
  }
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M12 9V13" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
      <path d="M12 17H12.01" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
      <path d="M13.92 21H10.08C5.44 21 3.13 21 2.28 19.49C1.42 17.99 2.61 15.99 4.98 12L6.9 8.75C9.18 4.92 10.31 3 12 3C13.69 3 14.82 4.92 17.1 8.75L19.02 12C21.39 15.99 22.58 17.99 21.72 19.49C20.87 21 18.56 21 13.92 21Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
    </svg>
  );
}

function dayLifecycleMeta(a: Activity) {
  if (a.lifecycleStatus === "EmAndamento") return { label: "Em Andamento", icon: "progress" as const, card: "border-blue-300/60 border-l-blue-500 bg-blue-50/20", badge: "bg-blue-50 text-blue-600 border-blue-200" };
  if (a.lifecycleStatus === "Realizada") return { label: "Concluída", icon: "check" as const, card: "border-emerald-300/60 border-l-emerald-500 bg-emerald-50/20", badge: "bg-emerald-50 text-emerald-600 border-emerald-200" };
  if (a.lifecycleStatus === "Cancelada") return { label: "Cancelada", icon: "close" as const, card: "border-red-300/60 border-l-red-500 bg-red-50/20", badge: "bg-red-50 text-red-600 border-red-200" };
  return { label: "Não Iniciada", icon: "progress" as const, card: "border-gray-300/60 border-l-gray-400 bg-white", badge: "bg-gray-50 text-gray-500 border-gray-200" };
}

function dayDateLabel(date: string) {
  return format(new Date(`${date}T12:00:00`), "dd/MM/yyyy");
}

function dayLongDateLabel(date: string) {
  return format(new Date(`${date}T12:00:00`), "d 'de' MMMM", { locale: ptBR });
}

function DayMetric({ icon, label, value, danger = false }: { icon: "clock" | "calendar" | "users" | "team"; label: string; value: string; danger?: boolean }) {
  return (
    <div className="flex items-start gap-[8px] min-w-[128px]">
      <div className={`${danger ? "bg-red-100" : "bg-[#f8fafc]"} rounded-[6px] p-[4px] shrink-0 border border-[#e9eaeb]`}>
        <DayIcon type={icon} className={danger ? "text-[#c10007]" : "text-[#717680]"} />
      </div>
      <div className="flex flex-col min-w-0">
        <span className={`font-['Helvetica_Neue:Regular',sans-serif] text-[10.5px] leading-[normal] ${danger ? "text-[#c10007]" : "text-[#717680]"}`}>{label}</span>
        <span className={`font-['Helvetica_Neue:Regular',sans-serif] text-[13px] leading-[normal] truncate ${danger ? "text-[#c10007]" : "text-[#414651]"}`}>{value}</span>
      </div>
    </div>
  );
}

function DaySeparator() {
  return <div className="hidden md:block shrink-0 bg-[#e9eaeb] h-[40px] w-px self-center" />;
}

function DayBadge({ icon, label, tone }: { icon: "alert" | "shield"; label: string; tone: "red" | "amber" | "emerald" | "gray" }) {
  const classes = {
    red: "bg-red-100 text-red-800",
    amber: "bg-amber-100 text-amber-800",
    emerald: "bg-emerald-100 text-emerald-800",
    gray: "bg-gray-200 text-gray-600",
  }[tone];
  return (
    <span className={`inline-flex h-[22px] w-fit shrink-0 items-center justify-center gap-[4px] rounded-[9999px] px-[8px] py-[2px] font-['Helvetica_Neue:Regular',sans-serif] text-[12px] leading-[normal] whitespace-nowrap ${classes}`}>
      <DayIcon type={icon} className="shrink-0" />
      {label}
    </span>
  );
}

function DayActivityCard({ a, onClick }: { a: Activity; onClick?: () => void }) {
  const meta = dayLifecycleMeta(a);
  const isMultiDay = a.activityType === "multi-dias" && a.startDate && a.endDate;
  const filledDanger = a.occupancy > a.capacity;
  const remaining = Math.max(a.capacity - a.occupancy, 0);
  const teamLabel = a.assignedGuides.length > 0 ? `${a.assignedGuides.length} guia(s)` : "Sem equipe";
  const detailMetrics = isMultiDay
    ? [
        { icon: "calendar" as const, label: "Início", value: `${dayLongDateLabel(a.startDate!)} às ${a.startTime}` },
        { icon: "calendar" as const, label: "Fim", value: `${dayLongDateLabel(a.endDate!)} às ${a.endTime}` },
        { icon: "clock" as const, label: "Duração", value: `${a.totalDays ?? 1} dias` },
      ]
    : [
        { icon: "clock" as const, label: "Horário", value: `${a.startTime} às ${a.endTime}` },
        { icon: "calendar" as const, label: "Data", value: dayDateLabel(a.date) },
      ];

  const badges: Array<{ icon: "alert" | "shield"; label: string; tone: "red" | "amber" | "emerald" | "gray" }> = [];
  if (filledDanger) badges.push({ icon: "alert", label: "Vagas excedidas", tone: "red" });
  if (a.allParticipantsInsured) badges.push({ icon: "shield", label: "Todos segurados", tone: "emerald" });
  else badges.push({ icon: "shield", label: a.requiresInsurance ? "Seguro pendente" : "Seguro opcional", tone: a.requiresInsurance ? "amber" : "gray" });
  if (a.participantsNeedingMedicalAttention > 0) badges.push({ icon: "alert", label: `Atenção médica (${a.participantsNeedingMedicalAttention})`, tone: "amber" });
  if (!a.assignedGuides.length && a.teamAssignmentDeadline) badges.push({ icon: "alert", label: "Equipe pendente", tone: "amber" });

  return (
    <button
      type="button"
      onClick={onClick}
      className={`block text-left group/card flex flex-col text-sm text-[#414651] gap-0 py-0 mt-[8px] shadow-none rounded-[12px] transition-shadow hover:shadow-sm ring-0 border-[1.5px] border-l-[4px] relative overflow-visible w-full ${meta.card}`}
    >
      <div className="px-[20px] pt-[20px] pb-[20px]">
        <div className="flex flex-col gap-[16px]">
          <div className="flex items-center gap-[8px] flex-wrap">
            <h3 className="font-['Helvetica_Neue:Regular',sans-serif] text-[16px] leading-[normal] text-[#181d27]">{a.name}</h3>
            {isMultiDay && (
              <span className="inline-flex h-[22px] items-center gap-[4px] rounded-[6px] bg-purple-100 px-[8px] py-[2px] font-['Helvetica_Neue:Regular',sans-serif] text-[12px] text-purple-800">
                <DayIcon type="clock" className="shrink-0" />
                Atividade estendida
              </span>
            )}
          </div>
          <div className="grid grid-cols-2 gap-[12px] md:flex md:items-start md:gap-[16px]">
            {detailMetrics.map((metric, index) => (
              <div key={`${metric.label}-${metric.value}`} className="contents">
                {index > 0 && <DaySeparator />}
                <DayMetric icon={metric.icon} label={metric.label} value={metric.value} />
              </div>
            ))}
            <DaySeparator />
            <DayMetric icon="users" label="Vagas preenchidas" value={`${a.occupancy}/${a.capacity}`} danger={filledDanger} />
            <DaySeparator />
            <DayMetric icon="users" label="Vagas restantes" value={String(remaining)} />
            <DaySeparator />
            <DayMetric icon="team" label="Equipe responsável" value={teamLabel} />
          </div>
        </div>
      </div>
      {badges.length > 0 && (
        <div className="bg-[#f8fafc] px-[20px] py-[12px] border-t border-[#e9eaeb] rounded-b-[12px]">
          <div className="flex flex-wrap gap-[8px]">
            {badges.map((badge) => (
              <DayBadge key={`${badge.label}-${badge.tone}`} {...badge} />
            ))}
          </div>
        </div>
      )}
      <span className={`absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-[4px] text-[12px] px-[8px] py-[2px] rounded-[4px] border whitespace-nowrap ${meta.badge}`}>
        {meta.label}
        <DayIcon type={meta.icon} className="shrink-0" />
      </span>
    </button>
  );
}

function DayContent({ dayDate, onDayClick, onViewDetails }: { dayDate: Date; onDayClick?: (day: number) => void; onViewDetails?: (activityId?: string) => void }) {
  const iso = format(dayDate, "yyyy-MM-dd");
  const acts = mockActivities
    .filter((a) => a.date === iso)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));
  const holiday = CAL_HOLIDAYS[iso];

  const actsByTime: Record<string, Activity[]> = {};
  for (const a of acts) {
    if (!actsByTime[a.startTime]) actsByTime[a.startTime] = [];
    actsByTime[a.startTime].push(a);
  }
  const timeGroups = Object.entries(actsByTime).sort(([a], [b]) => a.localeCompare(b));

  return (
    <div className="content-stretch flex flex-col gap-[20px] px-[24px] py-[20px] relative w-full" data-name="DayContent">
      {holiday && (
        <div className="bg-[#f3e8ff] border border-[#dab2ff] border-solid content-stretch flex items-center justify-center px-[16px] py-[8px] relative rounded-[12px] shrink-0 w-full">
          <div className="flex items-center gap-[6px]">
            <div className="relative shrink-0 size-[14px]">
              <svg className="block size-full" fill="none" viewBox="0 0 14 14">
                <circle cx="7" cy="7" r="6" stroke="#8200DB" strokeWidth="1.2" />
                <path d="M7 4v3l2 1" stroke="#8200DB" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
            </div>
            <p className="font-['Helvetica_Neue:Medium',sans-serif] leading-[normal] not-italic text-[13px] text-[#8200db]">{holiday} (Feriado)</p>
          </div>
        </div>
      )}
      <div className="flex flex-col gap-[20px] relative w-full">
        {timeGroups.map(([time, timeActs]) => {
          return (
            <div key={time} className="flex flex-col gap-[12px] relative w-full">
              <div className="flex items-center gap-[8px]">
                <div className="flex items-center gap-[6px] rounded-[8px] px-[10px] py-[4px] shrink-0 border border-[#e9eaeb] bg-white">
                  <DayIcon type="clock" className="text-[#a4a7ae]" />
                  <span className="font-['Helvetica_Neue:Regular',sans-serif] text-[14px] text-[#535862] leading-[normal]">{time}</span>
                  {timeActs.length > 1 && (
                    <span className="font-['Helvetica_Neue:Regular',sans-serif] text-[12px] text-[#717680] leading-[normal]">· {timeActs.length} atividades</span>
                  )}
                </div>
                <div className="flex-1 border-t border-dashed border-[#e9eaeb]" />
              </div>
              <div className="flex flex-col gap-[12px]">
                {timeActs.map((a) => (
                  <DayActivityCard key={a.id} a={a} onClick={() => onViewDetails?.(a.id)} />
                ))}
              </div>
            </div>
          );
        })}
        {timeGroups.length === 0 && (
          <div className="border border-dashed border-[#e9eaeb] rounded-[12px] px-[16px] py-[28px] text-center">
            <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic text-[13px] text-[#717680]">Nenhuma atividade para este dia.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function MiniMonthCalendar({
  refDate,
  onDateSelect,
  onMonthChange,
}: {
  refDate: Date;
  onDateSelect: (date: Date) => void;
  onMonthChange: (date: Date) => void;
}) {
  return (
    <div className="relative w-full" data-name="MiniCalendar">
      <Calendar
        mode="single"
        month={refDate}
        selected={refDate}
        onMonthChange={onMonthChange}
        onSelect={(date) => date && onDateSelect(date)}
        locale={ptBR}
        formatters={{
          formatWeekdayName: (weekday) => ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"][weekday.getDay()],
        }}
        buttonVariant="ghost"
        className="w-full p-0 [--cell-radius:8px] [--cell-size:36px]"
        classNames={{
          root: "w-full",
          months: "w-full",
          month: "flex w-full flex-col gap-[18px]",
          month_caption: "flex h-[36px] w-full items-center justify-start pl-[8px] pr-[76px]",
          caption_label: "font-['Helvetica_Neue:Medium',sans-serif] leading-[normal] not-italic text-[#181d27] text-[14px] capitalize",
          nav: "absolute right-0 top-0 flex items-center justify-end gap-[4px]",
          button_previous: "flex items-center justify-center size-[32px] rounded-[6px] transition-colors cursor-pointer hover:bg-[#f5f5f5] [&>svg]:size-[16px] [&>svg]:text-[#535862]",
          button_next: "flex items-center justify-center size-[32px] rounded-[6px] transition-colors cursor-pointer hover:bg-[#f5f5f5] [&>svg]:size-[16px] [&>svg]:text-[#535862]",
          weekdays: "grid grid-cols-7 w-full",
          weekday: "font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic text-[#90a1b9] text-[12px] text-center",
          week: "grid grid-cols-7 mt-[8px] w-full",
          day: "relative aspect-square h-[38px] w-full rounded-[8px] p-0 text-center select-none",
          today: "bg-transparent text-inherit",
        }}
        components={{
          DayButton: ({ day, modifiers, ...props }) => {
            const iso = format(day.date, "yyyy-MM-dd");
            const acts = calGetActs(iso);
            return (
              <button
                {...props}
                className={`content-stretch flex flex-col gap-[2px] items-center justify-center size-full ${
                  modifiers.selected
                    ? "rounded-full bg-[#dbeafe] text-[#1447e6]"
                    : modifiers.outside
                      ? "rounded-[8px] text-[#c7c7c7] hover:bg-[#eef2f7]"
                      : "rounded-[8px] text-[#414651] hover:bg-[#eef2f7]"
                }`}
              >
                <span className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic text-[13px]">{day.date.getDate()}</span>
                {acts.length > 0 && (
                  <span className="content-stretch flex gap-[2px] items-center justify-center h-[4px] max-w-full overflow-hidden">
                    {acts.slice(0, 3).map((activity) => (
                      <span
                        key={activity.id}
                        className="rounded-[9999px] shrink-0 size-[4px]"
                        style={{ backgroundColor: CAL_COLORS[activity.status].dot }}
                      />
                    ))}
                  </span>
                )}
              </button>
            );
          },
        }}
      />
    </div>
  );
}

function CalendarCategories({ refDate }: { refDate: Date }) {
  const monthActivities = mockActivities.filter((activity) => isSameMonth(new Date(`${activity.date}T12:00:00`), refDate));
  const categories: { key: ActivityStatus; label: string }[] = [
    { key: "confirmed", label: "Confirmadas" },
    { key: "pending", label: "Pendentes" },
    { key: "full", label: "Lotadas" },
    { key: "blocked", label: "Bloqueadas" },
  ];
  const maxCount = Math.max(1, ...categories.map(({ key }) => monthActivities.filter((activity) => activity.status === key).length));

  return (
    <div className="content-stretch flex flex-col gap-[18px] items-start relative w-full" data-name="Categories">
      <div className="content-stretch flex items-center justify-between relative w-full">
        <p className="font-['Helvetica_Neue:Medium',sans-serif] leading-[normal] not-italic text-[#0f172b] text-[14px] whitespace-nowrap">Categorias</p>
      </div>
      <div className="content-stretch flex flex-col gap-[14px] items-start relative w-full">
        {categories.map(({ key, label }) => {
          const count = monthActivities.filter((activity) => activity.status === key).length;
          const color = CAL_COLORS[key];
          return (
            <div key={key} className="content-stretch flex gap-[12px] items-center relative w-full">
              <div className="rounded-full shrink-0 size-[8px]" style={{ backgroundColor: color.dot }} />
              <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic text-[#314158] text-[14px] w-[92px] whitespace-nowrap">
                {label}
              </p>
              <div className="bg-[#e2e8f0] h-[3px] min-w-0 relative rounded-[9999px] flex-1">
                <div className="absolute h-full left-0 rounded-[9999px] top-0" style={{ width: `${Math.max(12, (count / maxCount) * 100)}%`, backgroundColor: color.dot }} />
              </div>
              <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic text-[#62748e] text-[12px] text-right w-[18px]">{count}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function CalendarSidePanel({
  refDate,
  onDateSelect,
  onMonthChange,
}: {
  refDate: Date;
  onDateSelect: (date: Date) => void;
  onMonthChange: (date: Date) => void;
}) {
  return (
    <aside className="content-stretch flex flex-col gap-[36px] items-start relative shrink-0 w-[340px] mr-[16px] pt-[24px] pl-[16px]" data-name="CalendarSidePanel">
      <MiniMonthCalendar refDate={refDate} onDateSelect={onDateSelect} onMonthChange={onMonthChange} />
      <CalendarCategories refDate={refDate} />
    </aside>
  );
}

// ─── Calendar Wrapper (switches between Month/Week/Day) ─────────────────────

function CalendarCard({
  view, onViewChange, onDayClick, onViewDetails,
  refDate, onPrev, onNext, onToday, onDateSelect, onMonthChange,
}: {
  view: ViewMode; onViewChange: (v: ViewMode) => void;
  onDayClick?: (day: number) => void;
  onViewDetails?: (activityId?: string) => void;
  refDate: Date; onPrev: () => void; onNext: () => void; onToday: () => void;
  onDateSelect: (date: Date) => void; onMonthChange: (date: Date) => void;
}) {
  // Build nav label based on view
  let navLabel: string;
  if (view === "mes") {
    navLabel = format(refDate, "MMMM 'de' yyyy", { locale: ptBR });
    navLabel = navLabel.charAt(0).toUpperCase() + navLabel.slice(1);
  } else if (view === "semana") {
    const wStart = startOfWeek(refDate, { weekStartsOn: 0 });
    const wEnd = addDays(wStart, 6);
    const dStart = wStart.getDate();
    const dEnd = wEnd.getDate();
    const monthName = format(wStart, "MMMM", { locale: ptBR });
    navLabel = `${dStart} - ${dEnd} de ${monthName.charAt(0).toUpperCase() + monthName.slice(1)}`;
  } else {
    const dayName = format(refDate, "EEEE", { locale: ptBR });
    const capDay = dayName.charAt(0).toUpperCase() + dayName.slice(1);
    navLabel = `${refDate.getDate()} de ${format(refDate, "MMMM", { locale: ptBR })} (${capDay})`;
  }

  return (
    <div className="absolute bg-white left-[var(--shell-offset,248px)] right-[24px] rounded-[24px] top-[363px]" data-name="Container">
      <div className="content-stretch flex flex-col items-start overflow-clip py-px relative rounded-[inherit] size-full">
        <CalendarHeader navLabel={navLabel} onPrev={onPrev} onNext={onNext} onToday={onToday} view={view} onViewChange={onViewChange} />
        <div className="bg-white relative shrink-0 w-full" data-name="CalendarBody" style={{ minHeight: view === "dia" ? "520px" : undefined }}>
          <div className="flex flex-row rounded-[inherit] w-full">
            <div className="min-w-0 flex-1">
              {view === "mes" && (
                <div className="content-stretch flex flex-col items-start pb-[18px] pt-[24px] px-[20px] relative w-full">
                  <Main onDayClick={onDayClick} refDate={refDate} />
                </div>
              )}
              {view === "semana" && (
                <div className="content-stretch flex flex-col items-start pb-[24px] pt-[4px] px-[24px] relative w-full">
                  <WeekContent weekStart={startOfWeek(refDate, { weekStartsOn: 0 })} onDayClick={onDayClick} onViewDetails={onViewDetails} />
                </div>
              )}
              {view === "dia" && (
                <DayContent dayDate={refDate} onDayClick={onDayClick} onViewDetails={onViewDetails} />
              )}
            </div>
            <div className="w-px bg-[#e9eaeb] shrink-0 self-stretch" />
            <CalendarSidePanel refDate={refDate} onDateSelect={onDateSelect} onMonthChange={onMonthChange} />
          </div>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border-[#e2e8f0] border-[0.556px] border-solid inset-0 pointer-events-none rounded-[24px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]" />
    </div>
  );
}

function Elements14() {
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
    <div className="bg-white content-stretch drop-shadow-[0px_1px_1px_rgba(10,13,18,0.05)] flex flex-1 gap-[8px] items-center px-[17px] py-[18px] relative rounded-[16px]" data-name="Search bar">
      <div aria-hidden="true" className="absolute border border-[#f5f5f5] border-solid inset-0 pointer-events-none rounded-[16px]" />
      <p className="flex-[1_0_0] font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] min-w-px not-italic relative text-[#a4a7ae] text-[14px]">Buscar...</p>
      <div className="relative shrink-0 size-[20px]" data-name="search-01">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
          <div className="absolute flex inset-[12.5%] items-center justify-center" style={{ containerType: "size" }}>
            <div className="-rotate-180 -scale-x-100 flex-none h-[100cqh] w-[100cqw]">
              <Elements14 />
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

function Elements15() {
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

function Container72() {
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
            <Elements15 />
          </div>
          <App />
        </div>
      </button>
      <Container72 />
    </div>
  );
}

function Container73() {
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

function Elements16() {
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

function Frame7() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[2px] items-start justify-center min-w-px relative">
      <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#414651] text-[14px] whitespace-nowrap">Início</p>
    </div>
  );
}

function Elements17() {
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

function Frame6() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[2px] items-start justify-center min-w-px relative">
      <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#0b5ed7] text-[14px] w-full">Agenda</p>
    </div>
  );
}

function Container74() {
  return <div className="absolute bg-[#1b71fd] h-[24px] left-0 rounded-br-[9999px] rounded-tr-[9999px] top-[12px] w-[4px]" data-name="Container" />;
}

function Elements18() {
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

function Frame8() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[2px] items-start justify-center min-w-px relative">
      <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#414651] text-[14px] whitespace-nowrap">Vendas</p>
    </div>
  );
}

function Elements19() {
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

function Elements20() {
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

function Frame9() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[2px] items-start justify-center min-w-px relative">
      <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#414651] text-[14px] whitespace-nowrap">Clientes</p>
    </div>
  );
}

function Elements21() {
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

function Frame10() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[2px] items-start justify-center min-w-px relative">
      <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#414651] text-[14px] whitespace-nowrap">Produtos</p>
    </div>
  );
}

function Elements22() {
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

function Frame11() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[2px] items-start justify-center min-w-px relative">
      <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#414651] text-[14px] whitespace-nowrap">Vendedores</p>
    </div>
  );
}

function Elements23() {
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

function Frame12() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[2px] items-start justify-center min-w-px relative">
      <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#414651] text-[14px] whitespace-nowrap">Afiliados</p>
    </div>
  );
}

function Elements24() {
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

function Frame13() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[2px] items-start justify-center min-w-px relative">
      <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#414651] text-[14px] whitespace-nowrap">Indicadores</p>
    </div>
  );
}

function Frame23() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full">
      <div className="bg-white h-[48px] relative rounded-[14px] shrink-0 w-full" data-name="Menu action component">
        <div className="flex flex-row items-center size-full">
          <div className="content-stretch flex gap-[12px] items-center pl-[16px] pr-[12px] py-[14px] relative size-full">
            <div className="relative shrink-0 size-[20px]" data-name="home-01">
              <Elements16 />
            </div>
            <Frame7 />
          </div>
        </div>
      </div>
      <div className="bg-[#edf0ff] h-[48px] relative rounded-[14px] shrink-0 w-full" data-name="Component 2">
        <div className="flex flex-row items-center size-full">
          <div className="content-stretch flex gap-[12px] items-center pl-[16px] pr-[12px] py-[14px] relative size-full">
            <div className="relative shrink-0 size-[20px]" data-name="calendar-04">
              <Elements17 />
            </div>
            <Frame6 />
            <Container74 />
          </div>
        </div>
      </div>
      <div className="content-stretch flex h-[48px] items-start relative shrink-0" data-name="Vendas dropdown">
        <div className="bg-white relative rounded-[14px] self-stretch shrink-0 w-[168.003px]" data-name="Component 2">
          <div className="flex flex-row items-center size-full">
            <div className="content-stretch flex gap-[12px] items-center pl-[16px] pr-[12px] py-[14px] relative size-full">
              <div className="overflow-clip relative shrink-0 size-[20px]" data-name="shopping-bag-01">
                <Elements18 />
              </div>
              <Frame8 />
              <div className="overflow-clip relative shrink-0 size-[16px]" data-name="arrow-down-01-round">
                <Elements19 />
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
                  <Elements20 />
                </div>
              </div>
            </div>
            <Frame9 />
          </div>
        </div>
      </div>
      <div className="bg-white h-[48px] relative rounded-[14px] shrink-0 w-full" data-name="Component 5">
        <div className="flex flex-row items-center size-full">
          <div className="content-stretch flex gap-[12px] items-center pl-[16px] pr-[12px] py-[14px] relative size-full">
            <div className="overflow-clip relative shrink-0 size-[20px]" data-name="package">
              <div className="absolute flex inset-[8.33%_12.5%] items-center justify-center" style={{ containerType: "size" }}>
                <div className="-rotate-180 -scale-x-100 flex-none h-[100cqh] w-[100cqw]">
                  <Elements21 />
                </div>
              </div>
            </div>
            <Frame10 />
          </div>
        </div>
      </div>
      <div className="bg-white h-[48px] relative rounded-[14px] shrink-0 w-full" data-name="Component 4">
        <div className="flex flex-row items-center size-full">
          <div className="content-stretch flex gap-[12px] items-center pl-[16px] pr-[12px] py-[14px] relative size-full">
            <div className="relative shrink-0 size-[20px]" data-name="user-id-verification">
              <div className="absolute flex inset-[10.42%] items-center justify-center" style={{ containerType: "size" }}>
                <div className="-rotate-180 -scale-x-100 flex-none h-[100cqh] w-[100cqw]">
                  <Elements22 />
                </div>
              </div>
            </div>
            <Frame11 />
          </div>
        </div>
      </div>
      <div className="bg-white h-[48px] relative rounded-[14px] shrink-0 w-full" data-name="Component 7">
        <div className="flex flex-row items-center size-full">
          <div className="content-stretch flex gap-[12px] items-center pl-[16px] pr-[12px] py-[14px] relative size-full">
            <div className="relative shrink-0 size-[20px]" data-name="user-star-01">
              <div className="absolute flex inset-[12.5%] items-center justify-center" style={{ containerType: "size" }}>
                <div className="-rotate-180 -scale-x-100 flex-none h-[100cqh] w-[100cqw]">
                  <Elements23 />
                </div>
              </div>
            </div>
            <Frame12 />
          </div>
        </div>
      </div>
      <div className="bg-white h-[48px] relative rounded-[14px] shrink-0 w-full" data-name="Component 6">
        <div className="flex flex-row items-center size-full">
          <div className="content-stretch flex gap-[12px] items-center pl-[16px] pr-[12px] py-[14px] relative size-full">
            <div className="relative shrink-0 size-[20px]" data-name="chart-02">
              <Elements24 />
            </div>
            <Frame13 />
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
          <Frame23 />
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

function Frame22() {
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

function Container75() {
  return (
    <div className="flex-[1_0_0] min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col font-['Helvetica_Neue:Regular',sans-serif] gap-[4px] items-start leading-[normal] not-italic relative size-full whitespace-nowrap">
        <p className="relative shrink-0 text-[#0f172b] text-[24px]">Agenda</p>
        <p className="relative shrink-0 text-[#62748e] text-[14px]">Visualize e gerencie suas atividades agendadas.</p>
      </div>
    </div>
  );
}

function DashboardContent() {
  return (
    <div className="flex-[1_0_0] min-w-px relative" data-name="DashboardContent">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between relative size-full">
          <Container75 />
        </div>
      </div>
    </div>
  );
}

function Elements25() {
  return (
    <div className="absolute inset-[8.33%]" data-name="elements">
      <div className="absolute inset-[-4.5%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18.1667 18.1667">
          <g id="elements">
            <path d={svgPaths.p38c0e600} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            <circle cx="9.08333" cy="9.08333" id="Vector_2" r="8.33333" stroke="var(--stroke-0, white)" strokeWidth="1.5" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Frame24({ onNewActivity }: { onNewActivity?: () => void }) {
  return (
    <div className="content-stretch flex gap-[16px] items-center relative shrink-0">
      <div className="bg-white content-stretch flex gap-[8px] items-center justify-center px-[16px] py-[10px] relative rounded-[6px] shrink-0" data-name="button">
        <div aria-hidden="true" className="absolute border border-[#e2e8f0] border-solid inset-0 pointer-events-none rounded-[6px]" />
        <div className="relative shrink-0 size-[20px]" data-name="file-star">
          <div className="absolute inset-[8.33%_16.67%]" data-name="Vector">
            <div className="absolute inset-[-4.5%_-5.63%]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14.8335 18.1668">
                <path d={svgPaths.p1c347e00} id="Vector" stroke="var(--stroke-0, #414651)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
              </svg>
            </div>
          </div>
          <div className="absolute bottom-[8.33%] left-1/2 right-[16.67%] top-[60.42%]">
            <div className="absolute inset-[-12%_-11.3%_-11.98%_-11.3%]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8.17278 7.74903">
                <path d={svgPaths.p4361380} id="Star 29" stroke="var(--stroke-0, #414651)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
              </svg>
            </div>
          </div>
        </div>
        <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#414651] text-[16px] whitespace-nowrap">Mapa de Vagas</p>
      </div>
      <div onClick={onNewActivity} className="content-stretch flex gap-[8px] items-center justify-center px-[16px] py-[10px] relative rounded-[8px] shrink-0 cursor-pointer" style={{ backgroundImage: "linear-gradient(rgb(11, 94, 215) 0%, rgb(8, 79, 183) 100%), linear-gradient(90deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0) 100%)" }} data-name="button">
        <div className="overflow-clip relative shrink-0 size-[20px]" data-name="plus-sign-circle">
          <Elements25 />
        </div>
        <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[16px] text-white whitespace-nowrap">Nova Atividade</p>
      </div>
    </div>
  );
}

function Frame25({ onDayClick, onNewActivity }: { onDayClick?: (day: number) => void; onNewActivity?: () => void }) {
  return (
    <div className="absolute content-stretch flex gap-[24px] items-end left-[var(--shell-offset,248px)] right-[24px] top-[112px]">
      <DashboardContent />
      <Frame24 onNewActivity={onNewActivity} />
    </div>
  );
}

export default function AgendaMes({ onDayClick, onViewDetails, initialView = "mes", onViewModeChange, onNewActivity }: { onDayClick?: (day: number) => void; onViewDetails?: (activityId?: string) => void; initialView?: ViewMode; onViewModeChange?: (v: ViewMode) => void; onNewActivity?: () => void }) {
  const [view, setView] = useState<ViewMode>(initialView);
  const [refDate, setRefDate] = useState<Date>(CAL_TODAY);

  const handleViewChange = (v: ViewMode) => {
    setView(v);
    onViewModeChange?.(v);
  };

  const handlePrev = () => {
    if (view === "mes") setRefDate((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1));
    else if (view === "semana") setRefDate((d) => subWeeks(d, 1));
    else setRefDate((d) => subDays(d, 1));
  };

  const handleNext = () => {
    if (view === "mes") setRefDate((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1));
    else if (view === "semana") setRefDate((d) => addWeeks(d, 1));
    else setRefDate((d) => addDays(d, 1));
  };

  const handleToday = () => {
    setRefDate(CAL_TODAY);
  };

  const handleDateSelect = (date: Date) => {
    setRefDate(date);
  };

  const handleMonthChange = (date: Date) => {
    setRefDate((current) => new Date(date.getFullYear(), date.getMonth(), Math.min(current.getDate(), 28)));
  };

  return (
    <div className="bg-[#f8fafc] relative w-full min-h-[calc(100vh+24px)]" data-name="AGENDA - MÊS">
      <Container />
      <CalendarCard
        view={view}
        onViewChange={handleViewChange}
        onDayClick={onDayClick}
        onViewDetails={onViewDetails}
        refDate={refDate}
        onPrev={handlePrev}
        onNext={handleNext}
        onToday={handleToday}
        onDateSelect={handleDateSelect}
        onMonthChange={handleMonthChange}
      />
      <TopBar />
      <div className="fixed bg-white content-stretch flex flex-col h-[745px] items-start left-[24px] rounded-[16px] top-[24px] w-[200px] z-20" data-name="Sidebar - Admin">
        <div aria-hidden="true" className="absolute border border-[#fafafa] border-solid inset-0 pointer-events-none rounded-[16px] shadow-[0px_1px_3px_0px_rgba(10,13,18,0.1),0px_1px_2px_0px_rgba(10,13,18,0.1)]" />
        <Container73 />
        <PrimitiveDiv />
        <div className="content-stretch flex h-[85px] items-center justify-center pb-[24px] pt-[21px] px-[20px] relative rounded-bl-[16px] rounded-br-[16px] shrink-0 w-[200px]" data-name="User component">
          <div aria-hidden="true" className="absolute border-[#f5f5f5] border-solid border-t inset-0 pointer-events-none rounded-bl-[16px] rounded-br-[16px]" />
          <Frame22 />
        </div>
      </div>
      <Frame25 onDayClick={onDayClick} onNewActivity={onNewActivity} />
    </div>
  );
}
