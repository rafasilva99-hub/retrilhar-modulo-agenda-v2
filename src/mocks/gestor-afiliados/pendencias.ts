import type { PendenciaAfiliacao } from "@/types/api/afiliados";

// Lista espelha o frame AFI-01 do Figma: pendências de organização e de
// produto convivendo. [PENDENTE HP16] Se a candidatura fechar num único
// tipo, basta remover os itens do tipo descartado.

function minutosAtras(minutos: number): string {
  return new Date(Date.now() - minutos * 60_000).toISOString();
}

export const pendenciasCheio: readonly PendenciaAfiliacao[] = [
  {
    id: "pend-org-1",
    tipo: "organizacao",
    afiliado: { nome: "Ana Beatriz Campos", codigo: null },
    comissaoSolicitada: 0,
    criadaEm: minutosAtras(8),
  },
  {
    id: "pend-org-2",
    tipo: "organizacao",
    afiliado: { nome: "Juliana Marques", codigo: null },
    comissaoSolicitada: 8,
    criadaEm: minutosAtras(35),
  },
  {
    id: "pend-org-3",
    tipo: "organizacao",
    afiliado: { nome: "Marcos Vieira", codigo: "MARCOSV26" },
    comissaoSolicitada: 12,
    criadaEm: minutosAtras(2 * 60),
  },
  {
    id: "pend-prod-1",
    tipo: "produto",
    afiliado: { nome: "Pedro Henrique Sales", codigo: "PEDROSALES26" },
    produto: { nome: "Rapel Cachoeira do Tabuleiro", local: "Conceição do Mato Dentro" },
    comissaoSolicitada: 12,
    criadaEm: minutosAtras(3 * 60),
  },
  {
    id: "pend-prod-2",
    tipo: "produto",
    afiliado: { nome: "Marcos Vieira", codigo: "MARCOSV26" },
    produto: { nome: "Trilha Pico do Itambé", local: "Santo Antônio do Itambé" },
    comissaoSolicitada: 0,
    criadaEm: minutosAtras(26 * 60),
  },
  {
    id: "pend-prod-3",
    tipo: "produto",
    afiliado: { nome: "Ana Beatriz Campos", codigo: null },
    produto: { nome: "Trilha Pico do Itambé", local: "Santo Antônio do Itambé" },
    comissaoSolicitada: 15,
    criadaEm: minutosAtras(27 * 60),
  },
  {
    id: "pend-prod-4",
    tipo: "produto",
    afiliado: { nome: "Camila Duarte", codigo: "CAMILAD26" },
    produto: { nome: "Voo Duplo de Parapente", local: "Vale do Paranã" },
    comissaoSolicitada: 10,
    criadaEm: minutosAtras(28 * 60),
  },
];

export const pendenciasVazio: readonly PendenciaAfiliacao[] = [];

export const pendenciasExtremos: readonly PendenciaAfiliacao[] = [
  {
    id: "pend-extremo-1",
    tipo: "produto",
    afiliado: {
      nome: "Maria Auxiliadora dos Santos Albuquerque de Oliveira Cavalcanti",
      codigo: "MARIAAUXILIADORARETRILHAR2026",
    },
    produto: {
      nome: "Expedição Completa Travessia da Serra do Espinhaço com Pernoite",
      local: "Diamantina",
    },
    comissaoSolicitada: 99,
    criadaEm: minutosAtras(90 * 24 * 60),
  },
];
