// [EM HOLD P7] Matriz provisória de permissões. Aguarda definição do
// Cristiano. Quando a resposta vier, muda só este arquivo.
// Nenhuma condicional de permissão vive em JSX: toda ação de linha ou de
// ficha consulta o guarda PODE.

import type { EstadoFiliacao } from "@/types/api/afiliados";

export interface Usuario {
  readonly perfil: "administrador" | "gestor_afiliados";
}

export interface Filiacao {
  readonly estado: EstadoFiliacao;
  readonly temSolicitacaoPendente: boolean;
}

const vinculada = (f: Filiacao) => f.estado === "ativa" || f.estado === "inativa";

const convite = (f: Filiacao) => f.estado === "convidada" || f.estado === "expirada";

// [EM HOLD P7] Regra provisória: só administrador desativa direto.
const podeDesativarDireto = (u: Usuario) => u.perfil === "administrador";

export const PODE = {
  verDetalhes: () => true,
  alternarPausa: (f: Filiacao) => vinculada(f),
  editarFiliacoes: (f: Filiacao) => vinculada(f),
  vincularProduto: (f: Filiacao) => vinculada(f),
  desativarFiliacao: (f: Filiacao, u: Usuario) =>
    vinculada(f) && podeDesativarDireto(u) && !f.temSolicitacaoPendente,
  solicitarDesativacao: (f: Filiacao, u: Usuario) =>
    vinculada(f) && !podeDesativarDireto(u) && !f.temSolicitacaoPendente,
  reativarFiliacao: (f: Filiacao) => f.estado === "desativada",
  reenviarConvite: (f: Filiacao) => convite(f),
} as const;
