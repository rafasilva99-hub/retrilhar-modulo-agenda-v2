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
  // ReactNode para permitir controles no cabeçalho (ex.: selecionar todos).
  readonly titulo: ReactNode;
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
  // Moldura do frame AFI-02 (15998:132641): cartão arredondado com faixa de
  // cabeçalho e rodapé interno. Opcional para preservar os usos existentes.
  readonly emCartao?: boolean;
}

export function TabelaBase({
  colunas,
  children,
  estaVazia,
  vazio,
  carregando,
  linhasEsqueleto = 5,
  rodape,
  emCartao,
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

  const rodapeConteudo = rodape ? (
    <div
      className={cn(
        "text-muted-foreground flex items-center justify-between text-sm",
        emCartao && "border-border border-t px-4 py-3"
      )}
    >
      {rodape}
    </div>
  ) : null;

  return (
    <div className={cn(emCartao ? "border-border bg-card rounded-2xl border" : "space-y-3")}>
      <div className={cn("overflow-x-auto", emCartao && "rounded-t-2xl")}>
        <Table
          className={cn(
            emCartao &&
              "[&_td:first-child]:pl-4 [&_td:last-child]:pr-4 [&_th]:h-11 [&_th:first-child]:pl-4 [&_th:last-child]:pr-4"
          )}
        >
          <TableHeader>
            <TableRow className={cn("hover:bg-transparent", emCartao && "bg-muted/40")}>
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
      {rodapeConteudo}
    </div>
  );
}
