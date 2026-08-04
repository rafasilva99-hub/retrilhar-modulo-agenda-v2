import { FilterHorizontalIcon, Search01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { rotuloDaFiliacao } from "@/lib/afiliados/rotulos";
import type { EstadoFiliacao } from "@/types/api/afiliados";

export type FiltroEstadoFiliacao = EstadoFiliacao | "todos";

const estadosDoFiltro: readonly EstadoFiliacao[] = [
  "ativa",
  "inativa",
  "desativada",
  "convidada",
  "expirada",
];

interface BarraFiltrosProps {
  readonly busca: string;
  readonly aoMudarBusca: (valor: string) => void;
  readonly estado: FiltroEstadoFiliacao;
  readonly aoMudarEstado: (estado: FiltroEstadoFiliacao) => void;
  readonly placeholderBusca?: string;
  // Ações alinhadas à direita, após o select de status.
  readonly acoes?: ReactNode;
}

// Barra da AFI-02 (§1.2), na estrutura da toolbar padrão do Admin: busca
// compacta à esquerda, botão de filtros e, à direita, o select de status
// (a CTA primária da tela vive no cabeçalho da página).
// [FATO] O select filtra pelo enum derivado, com os mesmos cinco rótulos do
// BadgeFiliacao.
export function BarraFiltros({
  busca,
  aoMudarBusca,
  estado,
  aoMudarEstado,
  placeholderBusca = "Pesquisar...",
  acoes,
}: BarraFiltrosProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="relative flex-1 md:max-w-80">
        <HugeiconsIcon
          icon={Search01Icon}
          size={16}
          className="text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2"
          aria-hidden="true"
        />
        <Input
          value={busca}
          placeholder={placeholderBusca}
          aria-label={placeholderBusca}
          className="h-9 rounded-md pl-9"
          onChange={(event) => aoMudarBusca(event.target.value)}
        />
      </div>
      <Button
        type="button"
        variant="outline"
        className="hidden h-9 gap-1.5 rounded-lg md:inline-flex"
      >
        <HugeiconsIcon icon={FilterHorizontalIcon} size={16} aria-hidden="true" />
        Filtros
      </Button>
      <div className="ml-auto flex items-center gap-3">
        <Select
          value={estado}
          onValueChange={(valor) => aoMudarEstado(valor as FiltroEstadoFiliacao)}
        >
          <SelectTrigger className="h-9 w-44 rounded-lg" aria-label="Filtrar por status">
            <SelectValue placeholder="Todos os status" />
          </SelectTrigger>
          <SelectContent position="popper" side="bottom">
            <SelectItem value="todos">Todos os status</SelectItem>
            {estadosDoFiltro.map((item) => (
              <SelectItem key={item} value={item}>
                {rotuloDaFiliacao(item)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {acoes ? <div className="hidden items-center gap-3 md:flex">{acoes}</div> : null}
      </div>
    </div>
  );
}
