// Produtos vinculados da ficha AFI-03 (Etapa 03). Cobre comissão percentual
// e em valor fixo, os três métodos de recebimento e item inativo.

import trilhaItacolomi from "@/assets/4a664b1820bfb04f20dc4f636db105ede4311f14.png";
import rapelTombo from "@/assets/87b552f8867f96fa4d2ca833ef943c5aa1ab172b.png";
import trilhaItambe from "@/assets/bf3f56458c51cdd59b7949f2a771c8cc1623145c.png";
import type { ProdutoVinculado } from "@/types/api/afiliados";

export const produtosVinculadosCheio: readonly ProdutoVinculado[] = [
  {
    id: "vinc-01",
    nome: "Trilha Pico do Itacolomi",
    local: "Ouro Preto, MG",
    thumbnailUrl: trilhaItacolomi,
    itemAtivo: true,
    comissao: { formato: "percentual", valor: 50 },
    metodoRecebimento: "split",
  },
  {
    id: "vinc-02",
    nome: "Rapel Cachoeira do Tombo",
    local: "Serra do Cipó, MG",
    thumbnailUrl: rapelTombo,
    itemAtivo: true,
    comissao: { formato: "valor", valor: 45 },
    metodoRecebimento: "pix",
  },
  {
    id: "vinc-03",
    nome: "Trilha Pico do Itambé",
    local: "Santo Antônio do Itambé, MG",
    thumbnailUrl: trilhaItambe,
    itemAtivo: false,
    comissao: { formato: "percentual", valor: 10 },
    metodoRecebimento: "conta_bancaria",
  },
];

// Produtos do catálogo elegíveis para vinculação no modal AFI-03.m.
// [PENDENTE P1] A comissão inicial segue o padrão do termo até a regra
// percentual vs valor fixo fechar com o Matheus.
export const produtosVinculaveis: readonly ProdutoVinculado[] = [
  {
    id: "vinc-04",
    nome: "Expedição Vale do Pati",
    local: "Chapada Diamantina, BA",
    thumbnailUrl: trilhaItacolomi,
    itemAtivo: true,
    comissao: { formato: "percentual", valor: 10 },
    metodoRecebimento: "split",
  },
  {
    id: "vinc-05",
    nome: "Trilha Cachoeira Grande",
    local: "Serra do Cipó, MG",
    thumbnailUrl: rapelTombo,
    itemAtivo: true,
    comissao: { formato: "percentual", valor: 10 },
    metodoRecebimento: "split",
  },
  {
    id: "vinc-06",
    nome: "Canionismo Serra Geral",
    local: "Praia Grande, SC",
    thumbnailUrl: trilhaItambe,
    itemAtivo: true,
    comissao: { formato: "percentual", valor: 10 },
    metodoRecebimento: "split",
  },
];
