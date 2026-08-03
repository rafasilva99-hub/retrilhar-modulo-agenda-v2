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

// Identificação e tempo de filiação na plataforma exibidos no cabeçalho do
// drawer AFI-04.a; placeholders de design no mesmo padrão do frame.
interface PerfilAfiliado {
  readonly descricao: string;
  readonly handle: string;
  readonly afiliadoDesde: string;
}

const perfis: Record<string, PerfilAfiliado> = {
  "Ana Beatriz Campos": {
    descricao: "Guia de turismo",
    handle: "@anabeatriz.trilhas",
    afiliadoDesde: "2026-01-12T09:00:00-03:00",
  },
  "Juliana Marques": {
    descricao: "Influenciadora de viagens",
    handle: "@julianamarques.viagens",
    afiliadoDesde: "2025-11-05T09:00:00-03:00",
  },
  "Marcos Vieira": {
    descricao: "Agente de viagens",
    handle: "@marcosvieira.tur",
    afiliadoDesde: "2025-08-20T09:00:00-03:00",
  },
  "Pedro Henrique Sales": {
    descricao: "Criador de conteúdo",
    handle: "@pedrosales.aventura",
    afiliadoDesde: "2026-02-03T09:00:00-03:00",
  },
  "Camila Duarte": {
    descricao: "Fotógrafa de aventura",
    handle: "@camiladuarte.foto",
    afiliadoDesde: "2025-06-14T09:00:00-03:00",
  },
  "Maria Auxiliadora dos Santos Albuquerque de Oliveira Cavalcanti": {
    descricao: "Agência de ecoturismo",
    handle: "@mariauxiliadora.eco",
    afiliadoDesde: "2025-05-02T09:00:00-03:00",
  },
};

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
  | "visualizadaEm"
  | "criadaEm"
  | "atualizadaEm"
> & { afiliado: Solicitacao["afiliado"] } {
  const perfil = perfis[nome];
  return {
    id,
    estado: "aguardando_organizacao",
    rodada: 1,
    afiliado: {
      id: `af-${id}`,
      nome,
      descricao: perfil?.descricao ?? null,
      handle: perfil?.handle ?? null,
      termosAceitosEm: criadaEm,
      afiliadoDesde: perfil?.afiliadoDesde ?? null,
    },
    comissaoSolicitadaPercentual: comissao,
    metodoRecebimento: "split",
    historico: [],
    visualizadaEm: null,
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
  // Hoje: contraproposta recusada pelo gestor em rodada 3 (selo vermelho).
  {
    ...solicitacaoBase("sol-prod-1", "Pedro Henrique Sales", minutosAtras(3 * 60), 12),
    tipo: "produto",
    estado: "recusada",
    rodada: 3,
    comissaoContrapropostaPercentual: 12,
    visualizadaEm: minutosAtras(60),
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
    anexosQtde: 4,
    visualizadaEm: null,
    criadaEm: minutosAtras(4 * 60),
    atualizadaEm: minutosAtras(30),
  },
  // Ontem: negociações já resolvidas (aceitas e recusada), todas visualizadas.
  {
    ...solicitacaoBase("sol-prod-2", "Marcos Vieira", diasAtras(1, 11), 0),
    tipo: "produto",
    estado: "aprovada",
    visualizadaEm: diasAtras(1, 12),
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
    estado: "aprovada",
    visualizadaEm: diasAtras(1, 16),
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
    estado: "recusada",
    visualizadaEm: diasAtras(1, 18),
    produto: {
      id: "prod-parapente",
      nome: "Voo Duplo de Parapente",
      precoPorPessoa: 620,
      comissaoMediaPercentual: 12,
    },
  },
  // Dois dias atrás: nomes longos para o cenário de estresse visual;
  // visualizada porém pendente, para exercitar o selo "Aguardando análise".
  {
    ...solicitacaoBase(
      "sol-prod-extremo",
      "Maria Auxiliadora dos Santos Albuquerque de Oliveira Cavalcanti",
      diasAtras(2, 9),
      18
    ),
    tipo: "produto",
    visualizadaEm: diasAtras(2, 11),
    produto: {
      id: "prod-expedicao",
      nome: "Expedição Completa Travessia da Serra do Espinhaço com Pernoite",
      precoPorPessoa: 2450,
      comissaoMediaPercentual: 11,
    },
  },
];

export const solicitacoesVazio: readonly Solicitacao[] = [];
