/**
 * Board manifest — declarative map of preview screens shown on the canvas.
 *
 * Each screen.slug maps to a hash route `#preview/{slug}` consumed by
 * AgendaPrototypeApp. Variants use slash-paths (e.g. `agenda/semana`).
 *
 * Editing this list never touches feature code; it's the only contract
 * between the board and the agenda module.
 */

export interface BoardScreen {
  slug: string;
  step?: number;
  title: string;
}

export interface BoardSection {
  title: string;
  x: number;
  y: number;
  screens: BoardScreen[];
}

export interface BoardManifest {
  tile: { width: number; height: number; gap: number };
  sections: BoardSection[];
}

export const boardManifest: BoardManifest = {
  tile: { width: 1280, height: 800, gap: 100 },
  sections: [
    {
      title: "Onboarding",
      x: 0,
      y: 80,
      screens: [
        { slug: "intro", step: 1, title: "Intro do teste" },
        { slug: "contexto", step: 2, title: "Contexto / missão" },
      ],
    },
    {
      title: "Agenda — view modes",
      x: 0,
      y: 1100,
      screens: [
        { slug: "agenda/mes", step: 1, title: "Mês" },
        { slug: "agenda/semana", step: 2, title: "Semana" },
        { slug: "agenda/dia", step: 3, title: "Dia (modo)" },
      ],
    },
    {
      title: "Agenda Dia",
      x: 0,
      y: 2120,
      screens: [
        { slug: "agendaDia", step: 1, title: "Atividades do dia" },
        { slug: "agendaDia/empty", step: 2, title: "Sem atividades (empty)" },
      ],
    },
    {
      title: "Atualizações — abas",
      x: 0,
      y: 3140,
      screens: [
        { slug: "atualizacoes/atualizacoes", step: 1, title: "Atualizações" },
        { slug: "atualizacoes/participantes", step: 2, title: "Participantes" },
        { slug: "atualizacoes/visao-geral", step: 3, title: "Visão geral" },
      ],
    },
    {
      title: "Atualizações — overlays (participantes)",
      x: 0,
      y: 4160,
      screens: [
        { slug: "atualizacoes/participantes/filters", step: 1, title: "Drawer filtros" },
        { slug: "atualizacoes/participantes/sort", step: 2, title: "Dropdown ordenar" },
        { slug: "atualizacoes/participantes/team", step: 3, title: "Modal equipe" },
        { slug: "atualizacoes/participantes/more-actions", step: 4, title: "Menu mais ações" },
        { slug: "atualizacoes/participantes/bulk-tip", step: 5, title: "Bulk check-in tip" },
        { slug: "atualizacoes/participantes/toast-success", step: 6, title: "Toast sucesso" },
        { slug: "atualizacoes/participantes/toast-error", step: 7, title: "Toast erro" },
      ],
    },
    {
      title: "Atualizações — modais reserva/participante",
      x: 0,
      y: 5180,
      screens: [
        { slug: "atualizacoes/participantes/cancel", step: 1, title: "Modal cancelar reserva" },
        { slug: "atualizacoes/participantes/no-show", step: 2, title: "Modal no-show" },
        { slug: "atualizacoes/participantes/checkin-single", step: 3, title: "Modal check-in (1)" },
        { slug: "atualizacoes/participantes/checkin-bulk", step: 4, title: "Modal check-in (bulk)" },
        { slug: "atualizacoes/participantes/payment-drawer", step: 5, title: "Drawer pagamento" },
        { slug: "atualizacoes/participantes/details-drawer", step: 6, title: "Drawer detalhes" },
      ],
    },
    {
      title: "Atualizações — QR scanner",
      x: 0,
      y: 6200,
      screens: [
        { slug: "atualizacoes/participantes/qr-camera-blocked", step: 1, title: "QR · câmera bloqueada" },
        { slug: "atualizacoes/participantes/qr-scanning", step: 2, title: "QR · escaneando" },
        { slug: "atualizacoes/participantes/qr-valid-reservation", step: 3, title: "QR · reserva válida" },
        { slug: "atualizacoes/participantes/qr-checkin-success", step: 4, title: "QR · check-in OK" },
        { slug: "atualizacoes/participantes/qr-reservation-cancelled", step: 5, title: "QR · reserva cancelada" },
        { slug: "atualizacoes/participantes/qr-not-recognized", step: 6, title: "QR · não reconhecido" },
        { slug: "atualizacoes/participantes/qr-wrong-date", step: 7, title: "QR · data errada" },
      ],
    },
    {
      title: "Nova atividade — wizard",
      x: 0,
      y: 7220,
      screens: [
        { slug: "novaAtividade/1", step: 1, title: "Identificação" },
        { slug: "novaAtividade/2", step: 2, title: "Agenda & repetição" },
        { slug: "novaAtividade/2/multi-times", step: 3, title: "Múltiplos horários ON" },
        { slug: "novaAtividade/2/repeat", step: 4, title: "Repetição ON" },
        { slug: "novaAtividade/3", step: 5, title: "Equipe" },
      ],
    },
  ],
};
