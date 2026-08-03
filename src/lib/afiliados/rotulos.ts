// Fonte única de rótulos do domínio de filiação (Etapa 03).
// [DECISÃO] Concordância no feminino: o sujeito é a filiação, não o afiliado.
// Tabela, header, select de status e toggle falam sempre o mesmo termo.

import { formatarMoeda } from "@/lib/formatadores";
import type { EstadoFiliacao, MetodoRecebimento, ProdutoVinculado } from "@/types/api/afiliados";

export const rotulosFiliacao: Record<EstadoFiliacao, string> = {
  ativa: "Filiação ativa",
  inativa: "Filiação pausada",
  desativada: "Filiação desativada",
  convidada: "Convite enviado",
  expirada: "Convite expirado",
};

export function rotuloDaFiliacao(estado: EstadoFiliacao): string {
  return rotulosFiliacao[estado];
}

// [PENDENTE P6] "Conta bancária" vs "Transferência bancária" aguarda a
// Luana; o rótulo fica centralizado aqui para a troca ser um ponto só.
export const rotulosMetodo: Record<MetodoRecebimento, string> = {
  split: "Split de pagamento",
  pix: "Via PIX",
  conta_bancaria: "Conta bancária",
};

export function rotuloDoMetodo(metodo: MetodoRecebimento): string {
  return rotulosMetodo[metodo];
}

export function rotuloDaComissao(comissao: ProdutoVinculado["comissao"]): string {
  return comissao.formato === "percentual"
    ? `${comissao.valor}%`
    : `${formatarMoeda(comissao.valor)}/item`;
}
