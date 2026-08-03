// Lista de afiliados da AFI-02 (Etapa 03). Cobre os cinco estados do enum,
// afiliado com solicitação de autorização pendente, código nulo (convidada)
// e nome e e-mail longos. [FATO] Dados dos frames são placeholder.

import type { AfiliadoListaItem, ResumoLista } from "@/types/api/afiliados";

export const resumoListaAfiliados: ResumoLista = {
  totalAfiliados: 32,
  afiliadosAtivos: 24,
  vendasDosAfiliados: 675274.67,
  comissoesAPagar: 48730.5,
};

export const afiliadosListaCheia: readonly AfiliadoListaItem[] = [
  {
    id: "ana-paula",
    codigo: "ANA-2201",
    nome: "Ana Paula Silva",
    email: "ana.paula@trilheiras.com.br",
    vendasNoMes: 45230,
    vendasQtde: 18,
    estado: "ativa",
    temSolicitacaoPendente: false,
  },
  {
    id: "isabelly",
    codigo: "ISA-0932",
    nome: "Isabelly Beatriz Lopes",
    email: "isabelly.lopes@gmail.com",
    vendasNoMes: 32180.4,
    vendasQtde: 12,
    estado: "ativa",
    temSolicitacaoPendente: false,
  },
  {
    id: "carlos",
    codigo: "CAR-1187",
    nome: "Carlos Henrique de Albuquerque Vasconcelos e Sá",
    email: "carlos.henrique.albuquerque.vasconcelos@expedicoesdocerrado.com.br",
    vendasNoMes: 28914.75,
    vendasQtde: 9,
    estado: "ativa",
    temSolicitacaoPendente: true,
  },
  {
    id: "rafael",
    codigo: "RAF-0455",
    nome: "Rafael Duarte",
    email: "rafael.duarte@gmail.com",
    vendasNoMes: 11640,
    vendasQtde: 5,
    estado: "inativa",
    temSolicitacaoPendente: false,
  },
  {
    id: "juliana",
    codigo: "JUL-0308",
    nome: "Juliana Prates",
    email: "juliana.prates@gmail.com",
    vendasNoMes: 0,
    vendasQtde: 0,
    estado: "desativada",
    temSolicitacaoPendente: false,
  },
  {
    id: "maria-eduarda",
    codigo: null,
    nome: "Maria Eduarda Costa",
    email: "mariaeduarda.viaja@gmail.com",
    vendasNoMes: 0,
    vendasQtde: 0,
    estado: "convidada",
    temSolicitacaoPendente: false,
  },
  {
    id: "pedro",
    codigo: null,
    nome: "Pedro Lacerda",
    email: "pedro.lacerda@gmail.com",
    vendasNoMes: 0,
    vendasQtde: 0,
    estado: "expirada",
    temSolicitacaoPendente: false,
  },
];

export const afiliadosListaVazia: readonly AfiliadoListaItem[] = [];
