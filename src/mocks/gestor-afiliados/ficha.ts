// Fichas da AFI-03 (Etapa 03). Cobrem filiação ativa com produtos e
// histórico cheios, filiação desativada com KPIs sem tendência, ficha sem
// produtos e ficha sem histórico. [FATO] Dados dos frames são placeholder.

import type { AfiliadoFicha, EventoAtividade } from "@/types/api/afiliados";

import { produtosVinculadosCheio } from "./produtos-vinculados";

export const historicoAtividadeCheio: readonly EventoAtividade[] = [
  {
    id: "evt-01",
    descricao: "Comissão de Trilha Pico do Itacolomi alterada de 50% para 12% pelo gestor",
    origem: "gestor",
    ip: "187.44.102.9",
    criadoEm: "2026-08-03T10:42:00-03:00",
  },
  {
    id: "evt-02",
    descricao: "Venda RE-8838 registrada com o código ANA-2201",
    origem: "sistema",
    ip: null,
    criadoEm: "2026-08-03T09:15:00-03:00",
  },
  {
    id: "evt-03",
    descricao: "Link de divulgação do produto Rapel Cachoeira do Tombo copiado",
    origem: "painel_afiliado",
    ip: "201.17.88.203",
    criadoEm: "2026-08-02T18:27:00-03:00",
  },
  {
    id: "evt-04",
    descricao: "Destino de repasse via PIX atualizado pelo afiliado",
    origem: "painel_afiliado",
    ip: "201.17.88.203",
    criadoEm: "2026-08-02T11:03:00-03:00",
  },
  {
    id: "evt-05",
    descricao: "Comissão da venda RE-8714 liberada para saque",
    origem: "sistema",
    ip: null,
    criadoEm: "2026-07-29T08:00:00-03:00",
  },
  {
    id: "evt-06",
    descricao: "Produto Trilha Pico do Itambé pausado pelo gestor",
    origem: "gestor",
    ip: "187.44.102.9",
    criadoEm: "2026-07-21T16:40:00-03:00",
  },
  {
    id: "evt-07",
    descricao: "Termos de uso de afiliado aceitos",
    origem: "painel_afiliado",
    ip: "201.17.88.203",
    criadoEm: "2026-01-06T14:12:00-03:00",
  },
];

const kpisAtiva = {
  vendasRealizadas: 128,
  valorTotalVendas: 96410.35,
  comissoesRecebidas: 11238.9,
  comissoesAReceber: 2874.6,
  tendencias: { vendas: 12, valor: 8, recebidas: 5 },
};

// [FATO] Na variante desativada os subtítulos viram contexto, sem tendência.
const kpisDesativada = {
  vendasRealizadas: 74,
  valorTotalVendas: 51230.8,
  comissoesRecebidas: 6120.45,
  comissoesAReceber: 918.2,
  tendencias: { vendas: null, valor: null, recebidas: null },
};

export const fichaAtiva: AfiliadoFicha = {
  id: "ana-paula",
  nome: "Ana Paula Silva",
  codigo: "ANA-2201",
  estado: "ativa",
  afiliadoDesde: "2026-01-06T00:00:00-03:00",
  desativadaEm: null,
  kpis: kpisAtiva,
  produtos: [...produtosVinculadosCheio],
  historico: [...historicoAtividadeCheio],
};

export const fichaDesativada: AfiliadoFicha = {
  id: "juliana",
  nome: "Juliana Prates",
  codigo: "JUL-0308",
  estado: "desativada",
  afiliadoDesde: "2026-01-06T00:00:00-03:00",
  desativadaEm: "2026-07-07T00:00:00-03:00",
  kpis: kpisDesativada,
  produtos: produtosVinculadosCheio.map((produto) => ({ ...produto })),
  historico: [
    {
      id: "evt-des-01",
      descricao: "Filiação desativada pelo gestor. Motivo: descumprimento do termo de afiliação",
      origem: "gestor",
      ip: "187.44.102.9",
      criadoEm: "2026-07-07T10:20:00-03:00",
    },
    ...historicoAtividadeCheio.slice(4),
  ],
};

export const fichaSemProdutos: AfiliadoFicha = {
  id: "rafael",
  nome: "Rafael Duarte",
  codigo: "RAF-0455",
  estado: "ativa",
  afiliadoDesde: "2026-03-14T00:00:00-03:00",
  desativadaEm: null,
  kpis: kpisAtiva,
  produtos: [],
  historico: [...historicoAtividadeCheio],
};

export const fichaSemHistorico: AfiliadoFicha = {
  id: "isabelly",
  nome: "Isabelly Beatriz Lopes",
  codigo: "ISA-0932",
  estado: "ativa",
  afiliadoDesde: "2026-05-02T00:00:00-03:00",
  desativadaEm: null,
  kpis: kpisAtiva,
  produtos: [...produtosVinculadosCheio],
  historico: [],
};

export const fichasPorAfiliado: ReadonlyMap<string, AfiliadoFicha> = new Map([
  [fichaAtiva.id, fichaAtiva],
  [fichaDesativada.id, fichaDesativada],
  [fichaSemProdutos.id, fichaSemProdutos],
  [fichaSemHistorico.id, fichaSemHistorico],
]);
