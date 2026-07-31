import type { AfiliadoResumido } from "@/types/api/afiliados";

// Nomes e valores espelham o frame AFI-01 do Figma (placeholders de design),
// inclusive a repetição de nome com códigos distintos.

export const topAfiliadosCheio: readonly AfiliadoResumido[] = [
  {
    id: "top-1",
    nome: "Edson Emanuel da Conceição",
    codigo: "EDRETRILHAR26",
    vendasQtde: 4,
    maiorVenda: 1234,
    valorComissao: 234,
  },
  {
    id: "top-2",
    nome: "Edson Emanuel da Conceição",
    codigo: "EDMANUELRETRILHAR",
    vendasQtde: 4,
    maiorVenda: 1234,
    valorComissao: 234,
  },
  {
    id: "top-3",
    nome: "Bianca Fabiana Marcela Moura",
    codigo: "BIANA26",
    vendasQtde: 4,
    maiorVenda: 1234,
    valorComissao: 234,
  },
  {
    id: "top-4",
    nome: "Sophie Isabela Lima",
    codigo: "SOPHIEPROMO26",
    vendasQtde: 4,
    maiorVenda: 1234,
    valorComissao: 234,
  },
  {
    id: "top-5",
    nome: "Isabelly Beatriz Lopes",
    codigo: "ISA2026",
    vendasQtde: 4,
    maiorVenda: 1234,
    valorComissao: 234,
  },
];

export const topAfiliadosVazio: readonly AfiliadoResumido[] = [];

export const topAfiliadosExtremos: readonly AfiliadoResumido[] = [
  {
    id: "top-extremo-1",
    nome: "Maria Auxiliadora dos Santos Albuquerque de Oliveira Cavalcanti",
    codigo: "MARIAAUXILIADORARETRILHAR2026",
    vendasQtde: 12_480,
    maiorVenda: 1_987_654.32,
    valorComissao: 456_789.01,
  },
];
