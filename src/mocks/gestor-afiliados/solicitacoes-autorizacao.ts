// Solicitações de autorização da AFI-02.b (Etapa 03). [DECISÃO] Entidade
// separada da filiação: a filiação segue ativa enquanto aguarda.

import type { SolicitacaoAutorizacao } from "@/types/api/afiliados";

export const solicitacoesAutorizacao: readonly SolicitacaoAutorizacao[] = [
  {
    protocolo: "#AUT-2026-0417",
    acaoRequisitada: "desativar_filiacao",
    afiliadoAfetado: { id: "carlos", nome: "Carlos Henrique de Albuquerque Vasconcelos e Sá" },
    motivo: "termo",
    descricao: "O afiliado divulgou condições comerciais fora do combinado com a organização.",
    solicitadoEm: "2026-07-30T15:48:00-03:00",
    estado: "aguardando",
  },
];

// Protocolo exibido no desfecho do fluxo de solicitação desta sessão.
export const protocoloNovaSolicitacao = "#AUT-2026-0431";
