// [EM HOLD P8] Estado de retorno da reativação, aguardando o Cristiano.
// [PROPOSTA] Sempre "ativa": o toggle não aparece na variante desativada,
// então a UI não guarda pista do valor anterior. Restaurar "inativa" seria
// surpresa sem explicação. Quando a decisão vier, muda só este arquivo.

import type { EstadoFiliacao } from "@/types/api/afiliados";

export function estadoAposReativacao(): EstadoFiliacao {
  return "ativa";
}
