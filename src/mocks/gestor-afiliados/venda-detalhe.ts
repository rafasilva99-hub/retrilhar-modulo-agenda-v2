import type { DetalheVenda, TarifaItemPedido, VendaAfiliado } from "@/types/api/afiliados";

import { vendasCheio, vendasExtremos } from "./vendas";

// Conteúdo espelha o overlay AFI-01.a do Figma. A lista de status é
// renderização pura: a ordem e a ênfase de cada evento vêm daqui.
// [PENDENTE P5] Sem lógica de transição no frontend.

const codigosAfiliados: Record<string, string> = {
  "João Pedro da Silva Oliveira": "JPRETRILHAR2026",
  "Maria Eduarda Santos Pereira": "MARIAEDUARDA26",
  "Carlos Ferreira Lima": "CARLOSFL26",
  "Juliana Lima Costa": "JULIANALC26",
  "Amanda Miranda": "AMANDAM26",
  "Mario Covas": "MARIOC26",
  "Alberto Fonseca": "ALBERTOF26",
  "Ricardo Peixoto": "RICARDOP26",
};

function centavos(valor: number): number {
  return Math.round(valor * 100) / 100;
}

// Divide o valor e a comissão de um item nas tarifas indicadas, mantendo a
// soma consistente com o total do item (a última tarifa absorve o resto).
function tarifasDoItem(
  idItem: string,
  nomes: readonly { nome: string; unidades: number }[],
  proporcoes: readonly number[],
  valorItem: number,
  comissaoItem: number
): TarifaItemPedido[] {
  let valorRestante = valorItem;
  let comissaoRestante = comissaoItem;
  return nomes.map((tarifa, indice) => {
    const ultima = indice === nomes.length - 1;
    const valorTotal = ultima ? centavos(valorRestante) : centavos(valorItem * proporcoes[indice]!);
    const valorComissao = ultima
      ? centavos(comissaoRestante)
      : centavos(comissaoItem * proporcoes[indice]!);
    valorRestante -= valorTotal;
    comissaoRestante -= valorComissao;
    return {
      id: `${idItem}-tarifa-${indice + 1}`,
      nome: tarifa.nome,
      unidades: tarifa.unidades,
      valorUnitario: centavos(valorTotal / tarifa.unidades),
      valorTotal,
      valorComissao,
    };
  });
}

function detalheDaVenda(venda: VendaAfiliado): DetalheVenda {
  const valorPrimeiroItem = Math.round(venda.valorPedido * 0.55 * 100) / 100;
  const valorSegundoItem = Math.round((venda.valorPedido - valorPrimeiroItem) * 100) / 100;
  const comissaoPrimeiroItem = Math.round(venda.valorComissao * 0.6 * 100) / 100;
  const comissaoSegundoItem = Math.round((venda.valorComissao - comissaoPrimeiroItem) * 100) / 100;

  return {
    id: venda.id,
    afiliado: {
      nome: venda.nomeAfiliado,
      codigo: codigosAfiliados[venda.nomeAfiliado] ?? "RETRILHAR2026",
    },
    pedido: {
      numero: venda.numeroPedido,
      comprador: "Alberto Fonseca",
      organizacao: "Trilheiras de Brasília",
      metodoPagamento: "Cartão de crédito · 3x s/ juros",
      dataHora: venda.dataHora,
      origemIndicacao: "Link de divulgação",
      status: ["Venda confirmada", "Comissão paga"],
    },
    itens: [
      {
        id: `${venda.id}-item-1`,
        nome: "Chapada das Mesas",
        quantidadeRotulo: "4 ingressos",
        tarifas: tarifasDoItem(
          `${venda.id}-item-1`,
          [
            { nome: "Adulto Meia-Entrada Estudante com Transporte", unidades: 2 },
            { nome: "Adulto Inteira com Transporte e Seguro Incluso", unidades: 1 },
            { nome: "Meia-Entrada Estudante", unidades: 1 },
          ],
          [0.55, 0.3],
          valorPrimeiroItem,
          comissaoPrimeiroItem
        ),
        valorItem: valorPrimeiroItem,
        comissaoValor: comissaoPrimeiroItem,
        comissaoRotulo: "10%",
      },
      {
        id: `${venda.id}-item-2`,
        nome: 'Camiseta "Eu fui" Pico da Bandeira',
        quantidadeRotulo: "2 itens",
        tarifas: tarifasDoItem(
          `${venda.id}-item-2`,
          [
            { nome: "Camiseta Tamanho P", unidades: 1 },
            { nome: "Camiseta Tamanho M", unidades: 1 },
            { nome: "Camiseta Tamanho G", unidades: 1 },
          ],
          [0.4, 0.3],
          valorSegundoItem,
          comissaoSegundoItem
        ),
        valorItem: valorSegundoItem,
        comissaoValor: comissaoSegundoItem,
        comissaoRotulo: "R$ 45/item",
      },
    ],
    totalComissao: venda.valorComissao,
    totalPedido: venda.valorPedido,
    historico: [
      {
        id: `${venda.id}-hist-1`,
        titulo: "Comissão disponível para saque",
        descricao: "Após a liberação da comissão",
        dataHora: "2026-05-10T09:30:00-03:00",
        tom: "neutro",
      },
      {
        id: `${venda.id}-hist-2`,
        titulo: "Comissão liberada",
        descricao: "Aguardando condições de liberação",
        dataHora: "2026-04-20T14:10:00-03:00",
        tom: "alerta",
      },
      {
        id: `${venda.id}-hist-3`,
        titulo: "Pagamento confirmado",
        descricao: "Via PIX",
        dataHora: "2026-04-15T10:47:00-03:00",
        tom: "info",
      },
      {
        id: `${venda.id}-hist-4`,
        titulo: "Venda realizada",
        descricao: "Pelo seu link de divulgação",
        dataHora: "2026-04-15T10:46:00-03:00",
        tom: "info",
      },
    ],
  };
}

export const detalhesVenda: ReadonlyMap<string, DetalheVenda> = new Map(
  [...vendasCheio, ...vendasExtremos].map((venda) => [venda.id, detalheDaVenda(venda)])
);
