import { useMemo, useState } from "react";
import { MoreVerticalCircle01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { GestorAffiliate, GestorAffiliateStatus } from "@/mocks/gestor-afiliados";
import { gestorAffiliates } from "@/mocks/gestor-afiliados";

import { FieldLine, StatusBadge } from "./shared";

const statuses: readonly (GestorAffiliateStatus | "Todos")[] = [
  "Todos",
  "Ativo",
  "Inativo",
  "Desativado",
];

export function GestorAffiliatesList() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<GestorAffiliateStatus | "Todos">("Todos");
  const [selected, setSelected] = useState<GestorAffiliate | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const affiliates = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return gestorAffiliates.filter((affiliate) => {
      const matchesQuery =
        normalized.length === 0 ||
        `${affiliate.name} ${affiliate.code} ${affiliate.origin}`
          .toLowerCase()
          .includes(normalized);
      return matchesQuery && (status === "Todos" || affiliate.status === status);
    });
  }, [query, status]);

  return (
    <div className="space-y-5">
      <Card className="rounded-2xl p-4 shadow-none">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_auto]">
          <Input
            value={query}
            placeholder="Buscar por afiliado, código ou origem"
            onChange={(event) => setQuery(event.target.value)}
          />
          <div className="flex flex-wrap gap-2">
            {statuses.map((item) => (
              <Button
                key={item}
                type="button"
                variant={item === status ? "default" : "outline"}
                size="sm"
                onClick={() => setStatus(item)}
              >
                {item}
              </Button>
            ))}
          </div>
        </div>
      </Card>
      {message ? (
        <p role="status" className="rounded-xl bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
          {message}
        </p>
      ) : null}

      <Card className="overflow-hidden rounded-2xl shadow-none">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Afiliado</TableHead>
              <TableHead>Produtos</TableHead>
              <TableHead>Vendas</TableHead>
              <TableHead>A pagar</TableHead>
              <TableHead>Recebimento</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-12" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {affiliates.map((affiliate) => (
              <TableRow key={affiliate.id}>
                <TableCell>
                  <button
                    type="button"
                    className="text-left"
                    onClick={() => setSelected(affiliate)}
                  >
                    <span className="block font-medium">{affiliate.name}</span>
                    <span className="text-muted-foreground text-xs">
                      {affiliate.code} · {affiliate.origin}
                    </span>
                  </button>
                </TableCell>
                <TableCell>{affiliate.products}</TableCell>
                <TableCell>{affiliate.sales}</TableCell>
                <TableCell>{affiliate.payable}</TableCell>
                <TableCell>{affiliate.receiving}</TableCell>
                <TableCell>
                  <StatusBadge status={affiliate.status} />
                </TableCell>
                <TableCell>
                  <AffiliateMenu
                    affiliate={affiliate}
                    onView={() => setSelected(affiliate)}
                    onAction={(action) => setMessage(`${action} para ${affiliate.name}.`)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <AffiliateSheet affiliate={selected} onOpenChange={(open) => !open && setSelected(null)} />
    </div>
  );
}

function AffiliateMenu({
  affiliate,
  onView,
  onAction,
}: {
  readonly affiliate: GestorAffiliate;
  readonly onView: () => void;
  readonly onAction: (action: string) => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label={`Ações de ${affiliate.name}`}>
          <HugeiconsIcon icon={MoreVerticalCircle01Icon} size={18} aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="rounded-2xl">
        <DropdownMenuItem onClick={onView}>Ver afiliado</DropdownMenuItem>
        <DropdownMenuItem onClick={() => onAction("Edição de afiliação preparada")}>
          Editar afiliação
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onAction("Link geral copiado")}>
          Copiar link geral
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onAction("Pagamento preparado")}>
          Registrar pagamento
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onAction("Desativação nesta organização preparada")}>
          Desativar nesta organização
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function AffiliateSheet({
  affiliate,
  onOpenChange,
}: {
  readonly affiliate: GestorAffiliate | null;
  readonly onOpenChange: (open: boolean) => void;
}) {
  return (
    <Sheet open={affiliate !== null} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-lg">
        {affiliate ? (
          <>
            <SheetHeader>
              <SheetTitle>{affiliate.name}</SheetTitle>
              <SheetDescription>Ficha da afiliação nesta organização</SheetDescription>
            </SheetHeader>
            <div className="grid gap-4 px-6 py-6">
              <StatusBadge status={affiliate.status} />
              <FieldLine label="Código" value={affiliate.code} />
              <FieldLine label="Origem" value={affiliate.origin} />
              <FieldLine label="Escopo de produtos" value={affiliate.products} />
              <FieldLine label="Comissão acumulada" value={affiliate.generated} />
              <FieldLine label="A pagar" value={affiliate.payable} />
              <FieldLine label="Forma de recebimento" value={affiliate.receiving} />
              <FieldLine label="Aceite do termo" value={affiliate.acceptedTerm} />
            </div>
          </>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}
