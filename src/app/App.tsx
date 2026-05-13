import { useState, useEffect, useCallback } from "react";
import svgPaths from "../imports/svg-q5jqh9fwaq";
import imgIntroducaoAoTeste from "figma:asset/bf3f56458c51cdd59b7949f2a771c8cc1623145c.png";
import ContextoMissao from "./components/ContextoMissao";
import AgendaMes from "../imports/AgendaMes/AgendaMes-13-9535";
import AgendaAtividadesDoDia from "../imports/AgendaAtividadesDoDia/AgendaAtividadesDoDia";
import AgendaAtualizacoes from "../imports/AgendaAtualizacoes/AgendaAtualizacoes";

function ContentText() {
  return (
    <div className="flex flex-col gap-4 items-start w-full">
      <div className="leading-[0] w-full">
        <p className="leading-[1.5] mb-0 text-white">Agradecemos sua participação. Hoje iremos avaliar sua experiência de uso no módulo de agendas da Retrilhar, uma plataforma de gestão para turismo de experiências.</p>
        <p className="leading-[1.5] text-white">O seu papel durante o teste será navegar pelo módulo de agendas do protótipo como se estivesse no seu dia a dia de trabalho. Antes de começar, alguns pontos importantes:</p>
      </div>
      <p className="leading-[1.5] w-full text-white">Nesse momento, iremos avaliar sua experiência em um cenário onde você já possui acesso ao sistema como gestor. Lembre-se:</p>
    </div>
  );
}

function InfoCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="relative rounded-2xl w-full">
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.12)] border-solid inset-0 pointer-events-none rounded-2xl" />
      <div className="flex gap-3 items-start p-6 relative size-full">
        <div className="overflow-clip relative shrink-0 size-6">
          <div className="absolute inset-[14.3%_11.33%_14.3%_9.78%]">
            <div className="absolute inset-[-5.83%_-5.28%]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20.9352 19.1362">
                <path d={svgPaths.p3209bb40} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
              </svg>
            </div>
          </div>
        </div>
        <div className="flex flex-1 flex-col gap-1.5 items-start justify-center leading-[1.5]">
          <p className="w-full text-white">{title}</p>
          <p className="w-full text-[#fafafa] text-sm">{description}</p>
        </div>
      </div>
    </div>
  );
}

type Page = "intro" | "contexto" | "agenda" | "agendaDia" | "atualizacoes";

export default function App() {
  const [currentPage, setCurrentPageRaw] = useState<Page>("intro");
  const [selectedDay, setSelectedDay] = useState<number>(new Date().getDate());
  const [atualizacoesInitialTab, setAtualizacoesInitialTab] = useState<string>("atualizacoes");
  const [returnTo, setReturnTo] = useState<Page>("agendaDia");
  const [calendarView, setCalendarView] = useState<"mes" | "semana" | "dia">("mes");

  // Navigate with browser history
  const navigateTo = useCallback((page: Page, replace = false) => {
    setCurrentPageRaw(page);
    if (replace) {
      window.history.replaceState({ page }, "", `#${page}`);
    } else {
      window.history.pushState({ page }, "", `#${page}`);
    }
  }, []);

  // Listen for browser back/forward
  useEffect(() => {
    const onPopState = (e: PopStateEvent) => {
      if (e.state?.page) setCurrentPageRaw(e.state.page);
      else setCurrentPageRaw("intro");
    };
    window.addEventListener("popstate", onPopState);
    // Set initial state
    window.history.replaceState({ page: "intro" }, "", "#intro");
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const handleDayClick = (day: number) => {
    setSelectedDay(day);
    navigateTo("agendaDia");
  };

  const handleViewDetails = () => {
    setReturnTo(currentPage === "agenda" ? "agenda" : "agendaDia");
    setAtualizacoesInitialTab("visao-geral");
    navigateTo("atualizacoes");
  };

  const handleGoToCheckIn = () => {
    setReturnTo(currentPage === "agenda" ? "agenda" : "agendaDia");
    setAtualizacoesInitialTab("participantes");
    navigateTo("atualizacoes");
  };

  const handleAtualizacoesClick = () => {
    setAtualizacoesInitialTab("atualizacoes");
    navigateTo("atualizacoes");
  };

  const handleBackToActivities = () => {
    navigateTo(returnTo);
  };

  if (currentPage === "atualizacoes") {
    return <AgendaAtualizacoes initialTab={atualizacoesInitialTab} onBackToActivities={handleBackToActivities} />;
  }

  if (currentPage === "agendaDia") {
    return <AgendaAtividadesDoDia day={selectedDay} onBackToAgenda={() => navigateTo("agenda")} onViewDetails={handleViewDetails} onGoToCheckIn={handleGoToCheckIn} />;
  }

  if (currentPage === "agenda") {
    return <AgendaMes onDayClick={handleDayClick} onViewDetails={handleViewDetails} initialView={calendarView} onViewModeChange={setCalendarView} />;
  }

  if (currentPage === "contexto") {
    return <ContextoMissao onStart={() => navigateTo("agenda")} />;
  }

  return (
    <div className="relative size-full overflow-hidden">
      {/* Background com gradientes e imagem */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0" style={{ backgroundImage: "linear-gradient(122.278deg, rgb(0, 0, 0) 8.6144%, rgb(23, 23, 23) 55.137%, rgb(0, 0, 0) 101.84%), linear-gradient(90deg, rgb(0, 0, 0) 0%, rgb(0, 0, 0) 100%), linear-gradient(90deg, rgb(255, 255, 255) 0%, rgb(255, 255, 255) 100%)" }} />
        <div className="absolute inset-0 overflow-hidden">
          <img alt="" className="absolute h-[90%] right-0 top-[5%] w-3/5 object-cover object-left max-w-none" src={imgIntroducaoAoTeste} />
        </div>
      </div>

      {/* Container de conteúdo com scroll */}
      <div className="relative h-full flex items-center">
        <div className="w-full max-w-[634px] h-full md:h-auto md:max-h-full overflow-y-auto">
          <div className="flex flex-col gap-5 px-6 md:px-10 py-12 md:py-16 bg-[#0c0b0b] md:rounded-br-[32px] md:rounded-tr-[32px] border-[rgba(255,255,255,0.12)] md:border-b md:border-r md:border-t border-solid shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)] min-h-full md:min-h-0">
            {/* Conteúdo principal */}
            <div className="flex flex-col gap-8 w-full">
              {/* Título e texto introdutório */}
              <div className="flex flex-col gap-4 items-start text-white w-full">
                <h1 className="font-['Sora:SemiBold',sans-serif] leading-[1.4] text-4xl md:text-[36px] w-full">Olá, boas vindas ao teste de usabilidade!</h1>
                <ContentText />
              </div>

              {/* Cards informativos */}
              <div className="flex flex-col gap-4 items-center justify-center w-full">
                <div className="flex flex-col gap-6 items-start w-full">
                  <InfoCard
                    title="Durante o teste não estamos avaliando você, e sim o produto."
                    description="Portanto, não existe certo ou errado: tudo o que você fizer, comentar ou questionar é extremamente valioso para que possamos evoluir a experiência de uso."
                  />
                  <InfoCard
                    title="O teste é composto por algumas tarefas práticas que simulam situações reais dentro da plataforma."
                    description="Enquanto realiza o teste você pode pensar em voz alta, compartilhar suas impressões, dúvidas e expectativas. Isso nos ajuda a entender seu raciocínio e como o produto apoia (ou não) suas decisões."
                  />
                </div>
                <p className="font-['Sora:Regular',sans-serif] leading-[1.5] text-[#fafafa] text-sm text-center">Não há pressa. Leve o tempo que precisar em cada tarefa.</p>
              </div>
            </div>

            {/* Botão */}
            <button
              onClick={() => navigateTo("contexto")}
              className="relative rounded-[10px] w-full bg-[#175cd3] shadow-[inset_0px_0px_0px_1px_rgba(10,13,18,0.18),inset_0px_-2px_0px_0px_rgba(10,13,18,0.05)] border-2 border-[rgba(255,255,255,0.12)] border-solid transition-all duration-200 hover:bg-[#1a66e8] hover:shadow-[inset_0px_0px_0px_1px_rgba(10,13,18,0.18),inset_0px_-2px_0px_0px_rgba(10,13,18,0.05),0px_4px_12px_0px_rgba(23,92,211,0.4)] hover:scale-[1.02] active:scale-[0.98]"
            >
              <div className="flex items-center justify-center gap-2 px-6 py-4">
                <p className="font-['Sora:SemiBold',sans-serif] leading-7 text-lg text-white">Prosseguir para Introdução ao Teste</p>
                <div className="overflow-clip relative shrink-0 size-6">
                  <div className="absolute inset-[29.17%]">
                    <div className="absolute inset-[-10%]">
                      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
                        <path d="M1 11L11 1M11 1H1M11 1V11" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}