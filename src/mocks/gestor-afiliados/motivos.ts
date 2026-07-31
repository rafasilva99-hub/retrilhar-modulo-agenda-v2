import type { MotivoRecusa } from "@/types/api/afiliados";

// [DECISÃO] Recusa exige motivo e ele é visível para o afiliado.
// Taxonomia placeholder até a consolidação definitiva dos motivos.

export const motivosRecusa: readonly MotivoRecusa[] = [
  {
    codigo: "margem",
    rotulo: "A comissão pedida compromete a margem do produto",
    escopos: ["recusa_candidatura"],
  },
  {
    codigo: "perfil",
    rotulo: "Perfil de divulgação fora do público do produto",
    escopos: ["recusa_candidatura", "remocao_produto"],
  },
  {
    codigo: "temporada",
    rotulo: "Produto fora de temporada ou com agenda cheia",
    escopos: ["remocao_produto"],
  },
  {
    codigo: "termo",
    rotulo: "Descumprimento do termo de afiliação",
    escopos: ["remocao_produto", "desativacao_filiacao"],
  },
  {
    codigo: "encerramento",
    rotulo: "Encerramento do programa para este perfil",
    escopos: ["desativacao_filiacao", "recusa_candidatura"],
  },
  {
    codigo: "outros",
    rotulo: "Outros",
    escopos: ["recusa_candidatura", "remocao_produto", "desativacao_filiacao"],
  },
];
