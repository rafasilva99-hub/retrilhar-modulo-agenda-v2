import imgIntroducaoAoTeste from "figma:asset/bf3f56458c51cdd59b7949f2a771c8cc1623145c.png";

import { AppShell } from "../components/layout/app-shell";
import svgPaths from "../imports/svg-q5jqh9fwaq";
import { shellNavItems, shellOrganization, shellProfile } from "../mocks/shell";
import {
  AgendaDayPage,
  AgendaMonthPage,
  AgendaUpdatesPage,
  useAgendaPrototypeNavigation,
} from "../modules/agenda";

import ContextoMissao from "./components/ContextoMissao";

function ContentText() {
  return (
    <div className="flex w-full flex-col items-start gap-4">
      <div className="w-full leading-[0]">
        <p className="mb-0 leading-[1.5] text-white">
          Agradecemos sua participação. Hoje iremos avaliar sua experiência de uso no módulo de
          agendas da Retrilhar, uma plataforma de gestão para turismo de experiências.
        </p>
        <p className="leading-[1.5] text-white">
          O seu papel durante o teste será navegar pelo módulo de agendas do protótipo como se
          estivesse no seu dia a dia de trabalho. Antes de começar, alguns pontos importantes:
        </p>
      </div>
      <p className="w-full leading-[1.5] text-white">
        Nesse momento, iremos avaliar sua experiência em um cenário onde você já possui acesso ao
        sistema como gestor. Lembre-se:
      </p>
    </div>
  );
}

function InfoCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="relative w-full rounded-2xl">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-2xl border border-solid border-[rgba(255,255,255,0.12)]"
      />
      <div className="relative flex size-full items-start gap-3 p-6">
        <div className="relative size-6 shrink-0 overflow-clip">
          <div className="absolute inset-[14.3%_11.33%_14.3%_9.78%]">
            <div className="absolute inset-[-5.83%_-5.28%]">
              <svg
                className="block size-full"
                fill="none"
                preserveAspectRatio="none"
                viewBox="0 0 20.9352 19.1362"
              >
                <path
                  d={svgPaths.p3209bb40}
                  stroke="white"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                />
              </svg>
            </div>
          </div>
        </div>
        <div className="flex flex-1 flex-col items-start justify-center gap-1.5 leading-[1.5]">
          <p className="w-full text-white">{title}</p>
          <p className="w-full text-sm text-[#fafafa]">{description}</p>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const agenda = useAgendaPrototypeNavigation();

  if (agenda.currentPage === "atualizacoes") {
    return (
      <AgendaUpdatesPage
        initialTab={agenda.atualizacoesInitialTab}
        onBackToActivities={agenda.handleBackToActivities}
        activityId={agenda.selectedActivityId}
      />
    );
  }

  if (agenda.currentPage === "agendaDia") {
    return (
      <AppShell
        activePage={agenda.currentPage}
        navItems={shellNavItems}
        organization={shellOrganization}
        profile={shellProfile}
        onNavigate={agenda.navigateTo}
      >
        <AgendaDayPage
          day={agenda.selectedDay}
          onBackToAgenda={agenda.handleBackToAgenda}
          onViewDetails={agenda.handleViewDetails}
          onGoToCheckIn={agenda.handleGoToCheckIn}
        />
      </AppShell>
    );
  }

  if (agenda.currentPage === "agenda") {
    return (
      <AppShell
        activePage={agenda.currentPage}
        navItems={shellNavItems}
        organization={shellOrganization}
        profile={shellProfile}
        onNavigate={agenda.navigateTo}
      >
        <AgendaMonthPage
          onDayClick={agenda.handleDayClick}
          onViewDetails={agenda.handleViewDetails}
          initialView={agenda.calendarView}
          onViewModeChange={agenda.setCalendarView}
        />
      </AppShell>
    );
  }

  if (agenda.currentPage === "contexto") {
    return <ContextoMissao onStart={() => agenda.navigateTo("agenda")} />;
  }

  return (
    <div className="relative size-full overflow-hidden">
      {/* Background com gradientes e imagem */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(122.278deg, rgb(0, 0, 0) 8.6144%, rgb(23, 23, 23) 55.137%, rgb(0, 0, 0) 101.84%), linear-gradient(90deg, rgb(0, 0, 0) 0%, rgb(0, 0, 0) 100%), linear-gradient(90deg, rgb(255, 255, 255) 0%, rgb(255, 255, 255) 100%)",
          }}
        />
        <div className="absolute inset-0 overflow-hidden">
          <img
            alt=""
            className="absolute top-[5%] right-0 h-[90%] w-3/5 max-w-none object-cover object-left"
            src={imgIntroducaoAoTeste}
          />
        </div>
      </div>

      {/* Container de conteúdo com scroll */}
      <div className="relative flex h-full items-center">
        <div className="h-full w-full max-w-[634px] overflow-y-auto md:h-auto md:max-h-full">
          <div className="flex min-h-full flex-col gap-5 border-solid border-[rgba(255,255,255,0.12)] bg-[#0c0b0b] px-6 py-12 shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)] md:min-h-0 md:rounded-tr-[32px] md:rounded-br-[32px] md:border-t md:border-r md:border-b md:px-10 md:py-16">
            {/* Conteúdo principal */}
            <div className="flex w-full flex-col gap-8">
              {/* Título e texto introdutório */}
              <div className="flex w-full flex-col items-start gap-4 text-white">
                <h1 className="w-full font-['Sora:SemiBold',sans-serif] text-4xl leading-[1.4] md:text-[36px]">
                  Olá, boas vindas ao teste de usabilidade!
                </h1>
                <ContentText />
              </div>

              {/* Cards informativos */}
              <div className="flex w-full flex-col items-center justify-center gap-4">
                <div className="flex w-full flex-col items-start gap-6">
                  <InfoCard
                    title="Durante o teste não estamos avaliando você, e sim o produto."
                    description="Portanto, não existe certo ou errado: tudo o que você fizer, comentar ou questionar é extremamente valioso para que possamos evoluir a experiência de uso."
                  />
                  <InfoCard
                    title="O teste é composto por algumas tarefas práticas que simulam situações reais dentro da plataforma."
                    description="Enquanto realiza o teste você pode pensar em voz alta, compartilhar suas impressões, dúvidas e expectativas. Isso nos ajuda a entender seu raciocínio e como o produto apoia (ou não) suas decisões."
                  />
                </div>
                <p className="text-center font-['Sora:Regular',sans-serif] text-sm leading-[1.5] text-[#fafafa]">
                  Não há pressa. Leve o tempo que precisar em cada tarefa.
                </p>
              </div>
            </div>

            {/* Botão */}
            <button
              onClick={() => agenda.navigateTo("contexto")}
              className="relative w-full rounded-[10px] border-2 border-solid border-[rgba(255,255,255,0.12)] bg-[#175cd3] shadow-[inset_0px_0px_0px_1px_rgba(10,13,18,0.18),inset_0px_-2px_0px_0px_rgba(10,13,18,0.05)] transition-all duration-200 hover:scale-[1.02] hover:bg-[#1a66e8] hover:shadow-[inset_0px_0px_0px_1px_rgba(10,13,18,0.18),inset_0px_-2px_0px_0px_rgba(10,13,18,0.05),0px_4px_12px_0px_rgba(23,92,211,0.4)] active:scale-[0.98]"
            >
              <div className="flex items-center justify-center gap-2 px-6 py-4">
                <p className="font-['Sora:SemiBold',sans-serif] text-lg leading-7 text-white">
                  Prosseguir para Introdução ao Teste
                </p>
                <div className="relative size-6 shrink-0 overflow-clip">
                  <div className="absolute inset-[29.17%]">
                    <div className="absolute inset-[-10%]">
                      <svg
                        className="block size-full"
                        fill="none"
                        preserveAspectRatio="none"
                        viewBox="0 0 12 12"
                      >
                        <path
                          d="M1 11L11 1M11 1H1M11 1V11"
                          stroke="white"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                        />
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
