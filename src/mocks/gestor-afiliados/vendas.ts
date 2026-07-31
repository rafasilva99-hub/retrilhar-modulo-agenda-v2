import type { VendaAfiliado } from "@/types/api/afiliados";

// Linhas espelham a tabela "Últimas vendas realizadas" do frame AFI-01.

export const vendasCheio: readonly VendaAfiliado[] = [
  {
    id: "venda-8838",
    nomeAfiliado: "João Pedro da Silva Oliveira",
    numeroPedido: "RE-8838",
    itensQtde: 3,
    valorPedido: 2805.26,
    valorComissao: 280.26,
    dataHora: "2026-07-05T14:32:00-03:00",
  },
  {
    id: "venda-8841",
    nomeAfiliado: "Maria Eduarda Santos Pereira",
    numeroPedido: "RE-8841",
    itensQtde: 3,
    valorPedido: 15_759.99,
    valorComissao: 5679.99,
    dataHora: "2026-07-05T14:32:00-03:00",
  },
  {
    id: "venda-8845",
    nomeAfiliado: "Carlos Ferreira Lima",
    numeroPedido: "RE-8845",
    itensQtde: 3,
    valorPedido: 5947.65,
    valorComissao: 1890,
    dataHora: "2026-07-05T14:32:00-03:00",
  },
  {
    id: "venda-8829",
    nomeAfiliado: "Juliana Lima Costa",
    numeroPedido: "RE-8829",
    itensQtde: 3,
    valorPedido: 6374.08,
    valorComissao: 2340,
    dataHora: "2026-07-05T14:32:00-03:00",
  },
  {
    id: "venda-8850",
    nomeAfiliado: "Amanda Miranda",
    numeroPedido: "RE-8850",
    itensQtde: 3,
    valorPedido: 4758.12,
    valorComissao: 1420,
    dataHora: "2026-07-05T14:32:00-03:00",
  },
  {
    id: "venda-8816",
    nomeAfiliado: "Mario Covas",
    numeroPedido: "RE-8816",
    itensQtde: 3,
    valorPedido: 686.54,
    valorComissao: 280.26,
    dataHora: "2026-07-05T14:32:00-03:00",
  },
  {
    id: "venda-8836",
    nomeAfiliado: "Alberto Fonseca",
    numeroPedido: "RE-8836",
    itensQtde: 3,
    valorPedido: 537.24,
    valorComissao: 234,
    dataHora: "2026-07-05T14:32:00-03:00",
  },
  {
    id: "venda-8840",
    nomeAfiliado: "Ricardo Peixoto",
    numeroPedido: "RE-8840",
    itensQtde: 3,
    valorPedido: 303.89,
    valorComissao: 142,
    dataHora: "2026-07-05T14:32:00-03:00",
  },
];

export const vendasVazio: readonly VendaAfiliado[] = [];

export const vendasExtremos: readonly VendaAfiliado[] = [
  {
    id: "venda-extremo-1",
    nomeAfiliado: "Maria Auxiliadora dos Santos Albuquerque de Oliveira Cavalcanti",
    numeroPedido: "RE-9999999",
    itensQtde: 148,
    valorPedido: 1_987_654.32,
    valorComissao: 456_789.01,
    dataHora: "2026-12-31T23:59:00-03:00",
  },
];
