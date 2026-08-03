import { FilterHorizontalIcon, Search01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

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
}

// Barra da AFI-02 (§1.2): busca crescendo, botão de filtros e select de
// status. [FATO] O select filtra pelo enum derivado, com os mesmos cinco
// rótulos do BadgeFiliacao.
export function BarraFiltros({
  busca,
  aoMudarBusca,
  estado,
  aoMudarEstado,
  placeholderBusca = "Pesquisar...",
}: BarraFiltrosProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="relative min-w-56 flex-1">
        <HugeiconsIcon
          icon={Search01Icon}
          size={18}
          className="text-muted-foreground absolute top-1/2 left-3.5 -translate-y-1/2"
          aria-hidden="true"
        />
        <Input
          value={busca}
          placeholder={placeholderBusca}
          aria-label={placeholderBusca}
          className="h-10 rounded-xl pl-10"
          onChange={(event) => aoMudarBusca(event.target.value)}
        />
      </div>
      <Button type="button" variant="outline" className="h-10 gap-2 rounded-xl">
        <HugeiconsIcon icon={FilterHorizontalIcon} size={16} aria-hidden="true" />
        Filtros
      </Button>
      <Select
        value={estado}
        onValueChange={(valor) => aoMudarEstado(valor as FiltroEstadoFiliacao)}
      >
        <SelectTrigger className="h-10 w-48 rounded-xl" aria-label="Filtrar por status">
          <SelectValue placeholder="Todos os status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="todos">Todos os status</SelectItem>
          {estadosDoFiltro.map((item) => (
            <SelectItem key={item} value={item}>
              {rotuloDaFiliacao(item)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
