import type { ReactNode } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

export interface ColunaTabela {
  readonly id: string;
  readonly titulo: string;
  readonly alinhamento?: "esquerda" | "direita";
}

interface TabelaBaseProps {
  readonly colunas: readonly ColunaTabela[];
  // Linhas prontas (TableRow); a casca não conhece o formato do dado.
  readonly children?: ReactNode;
  readonly estaVazia?: boolean;
  readonly vazio?: ReactNode;
  readonly carregando?: boolean;
  readonly linhasEsqueleto?: number;
  // Slot para paginação ou contador de seleção.
  readonly rodape?: ReactNode;
}

export function TabelaBase({
  colunas,
  children,
  estaVazia,
  vazio,
  carregando,
  linhasEsqueleto = 5,
  rodape,
}: TabelaBaseProps) {
  // Estado vazio: sem cabeçalho de tabela, só o aviso.
  if (!carregando && estaVazia) {
    return (
      <div className="space-y-3">
        {vazio}
        {rodape ? (
          <div className="text-muted-foreground flex items-center justify-between text-sm">
            {rodape}
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              {colunas.map((coluna) => (
                <TableHead
                  key={coluna.id}
                  className={cn(
                    "text-muted-foreground",
                    coluna.alinhamento === "direita" && "text-right"
                  )}
                >
                  {coluna.titulo}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {carregando
              ? Array.from({ length: linhasEsqueleto }, (_, indice) => (
                  <TableRow key={indice} className="hover:bg-transparent">
                    {colunas.map((coluna) => (
                      <TableCell key={coluna.id}>
                        <Skeleton className="h-4 w-full max-w-32" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              : children}
          </TableBody>
        </Table>
      </div>
      {rodape ? (
        <div className="text-muted-foreground flex items-center justify-between text-sm">
          {rodape}
        </div>
      ) : null}
    </div>
  );
}
