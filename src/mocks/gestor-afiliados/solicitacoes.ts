import type { EventoNegociacao, Solicitacao } from "@/types/api/afiliados";

// Solicitações da Central de filiação (AFI-04). Nomes e valores espelham os
// frames do Figma; são placeholders de design, não dado real. As datas são
// relativas para exercitar o agrupamento Hoje / Ontem / dias anteriores.

function minutosAtras(minutos: number): string {
  return new Date(Date.now() - minutos * 60_000).toISOString();
}

function diasAtras(dias: number, horaBase = 10): string {
  const data = new Date(Date.now() - dias * 24 * 60 * 60_000);
  data.setHours(horaBase, 15, 0, 0);
  return data.toISOString();
}

// Histórico da contraproposta em rodada 3 (frame AFI-04.b): 5 eventos, com
// descrição pronta do backend. Não montar essas frases no frontend.
const historicoContraproposta: EventoNegociacao[] = [
  {
    id: "neg-cavalgada-5",
    origem: "sistema",
    autor: null,
    descricao: "Aguardando resolução de proposta pela organização / gestor",
    criadoEm: minutosAtras(30),
  },
  {
    id: "neg-cavalgada-4",
    origem: "afiliado",
    autor: "Maria Eduarda Costa Albuquerque",
    descricao: "Maria propôs 10% em Cavalgada ao pôr do sol",
    valorPercentual: 10,
    criadoEm: diasAtras(1, 14),
  },
  {
    id: "neg-cavalgada-3",
    origem: "organizacao",
    autor: "Gestor",
    descricao: "Organização / gestor ofereceu 8% de comissão",
    valorPercentual: 8,
    criadoEm: diasAtras(2, 16),
  },
  {
    id: "neg-cavalgada-2",
    origem: "afiliado",
    autor: "Maria Eduarda Costa Albuquerque",
    descricao: "Maria solicitou 12% de comissão em Cavalgada ao pôr do sol",
    valorPercentual: 12,
    criadoEm: diasAtras(3, 9),
  },
  {
    id: "neg-cavalgada-1",
    origem: "sistema",
    autor: null,
    descricao: "Solicitação de afiliação ao produto registrada",
    criadoEm: diasAtras(3, 9),
  },
];

function solicitacaoBase(
  id: string,
  nome: string,
  criadaEm: string,
  comissao: number
): Pick<
  Solicitacao,
  | "id"
  | "estado"
  | "rodada"
  | "comissaoSolicitadaPercentual"
  | "metodoRecebimento"
  | "historico"
  | "criadaEm"
  | "atualizadaEm"
> & { afiliado: Solicitacao["afiliado"] } {
  return {
    id,
    estado: "aguardando_organizacao",
    rodada: 1,
    afiliado: {
      id: `af-${id}`,
      nome,
      descricao: null,
      handle: null,
      termosAceitosEm: criadaEm,
      afiliadoDesde: null,
    },
    comissaoSolicitadaPercentual: comissao,
    metodoRecebimento: "split",
    historico: [],
    criadaEm,
    atualizadaEm: criadaEm,
  };
}

export const solicitacoesCheio: readonly Solicitacao[] = [
  // Hoje: candidaturas à organização, rodada 1, sem produto.
  {
    ...solicitacaoBase("sol-org-1", "Ana Beatriz Campos", minutosAtras(8), 0),
    tipo: "organizacao",
  },
  {
    ...solicitacaoBase("sol-org-2", "Juliana Marques", minutosAtras(35), 8),
    tipo: "organizacao",
  },
  {
    ...solicitacaoBase("sol-org-3", "Marcos Vieira", minutosAtras(2 * 60), 12),
    tipo: "organizacao",
  },
  // Hoje: solicitação de produto, rodada 1.
  {
    ...solicitacaoBase("sol-prod-1", "Pedro Henrique Sales", minutosAtras(3 * 60), 12),
    tipo: "produto",
    produto: {
      id: "prod-rapel",
      nome: "Rapel Cachoeira do Tabuleiro",
      precoPorPessoa: 320,
      comissaoMediaPercentual: 10,
    },
  },
  // Hoje: contraproposta em rodada 3, com histórico de 5 eventos (AFI-04.b).
  {
    id: "sol-prod-cavalgada",
    tipo: "produto",
    estado: "aguardando_organizacao",
    rodada: 3,
    afiliado: {
      id: "af-maria",
      nome: "Maria Eduarda Costa Albuquerque",
      descricao: "Criadora de conteúdo",
      handle: "@mariaeduarda.viaja",
      termosAceitosEm: "2026-03-27T09:00:00-03:00",
      afiliadoDesde: "2026-03-27T09:00:00-03:00",
    },
    produto: {
      id: "prod-cavalgada",
      nome: "Cavalgada ao pôr do sol",
      precoPorPessoa: 450,
      comissaoMediaPercentual: 8,
    },
    comissaoSolicitadaPercentual: 12,
    comissaoOfertadaPercentual: 8,
    comissaoContrapropostaPercentual: 10,
    metodoRecebimento: "split",
    historico: historicoContraproposta,
    criadaEm: minutosAtras(4 * 60),
    atualizadaEm: minutosAtras(30),
  },
  // Ontem: solicitações de produto.
  {
    ...solicitacaoBase("sol-prod-2", "Marcos Vieira", diasAtras(1, 11), 0),
    tipo: "produto",
    produto: {
      id: "prod-itambe",
      nome: "Trilha Pico do Itambé",
      precoPorPessoa: 180,
      comissaoMediaPercentual: 9,
    },
  },
  {
    ...solicitacaoBase("sol-prod-3", "Ana Beatriz Campos", diasAtras(1, 15), 15),
    tipo: "produto",
    produto: {
      id: "prod-itambe",
      nome: "Trilha Pico do Itambé",
      precoPorPessoa: 180,
      comissaoMediaPercentual: 9,
    },
  },
  {
    ...solicitacaoBase("sol-prod-4", "Camila Duarte", diasAtras(1, 17), 10),
    tipo: "produto",
    produto: {
      id: "prod-parapente",
      nome: "Voo Duplo de Parapente",
      precoPorPessoa: 620,
      comissaoMediaPercentual: 12,
    },
  },
  // Dois dias atrás: nomes longos para o cenário de estresse visual.
  {
    ...solicitacaoBase(
      "sol-prod-extremo",
      "Maria Auxiliadora dos Santos Albuquerque de Oliveira Cavalcanti",
      diasAtras(2, 9),
      18
    ),
    tipo: "produto",
    produto: {
      id: "prod-expedicao",
      nome: "Expedição Completa Travessia da Serra do Espinhaço com Pernoite",
      precoPorPessoa: 2450,
      comissaoMediaPercentual: 11,
    },
  },
];

export const solicitacoesVazio: readonly Solicitacao[] = [];
