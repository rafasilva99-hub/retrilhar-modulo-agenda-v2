import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type {
  GestorAffiliateSection,
  GestorAffiliateStatus,
  GestorPaymentStatus,
  GestorProposalStatus,
} from "@/mocks/gestor-afiliados";
import { gestorAffiliateSubnav } from "@/mocks/gestor-afiliados";

export function GestorSubnav({ active }: { readonly active: GestorAffiliateSection }) {
  return (
    <div className="border-border bg-card flex gap-1 overflow-x-auto rounded-2xl border p-1">
      {gestorAffiliateSubnav.map((item) => (
        <Button
          key={item.section}
          type="button"
          variant={item.section === active ? "default" : "ghost"}
          size="sm"
          className="h-9 shrink-0 gap-2 rounded-xl"
          onClick={() => {
            window.location.hash = `#${item.page}`;
          }}
        >
          {item.label}
          {item.badge ? (
            <span
              className={cn(
                "grid min-w-5 place-items-center rounded-full px-1.5 text-[11px]",
                item.section === active
                  ? "bg-primary-foreground/20 text-primary-foreground"
                  : "bg-primary/10 text-primary"
              )}
            >
              {item.badge}
            </span>
          ) : null}
        </Button>
      ))}
    </div>
  );
}

export function GestorStatCard({
  icon,
  label,
  value,
  helper,
}: {
  readonly icon: IconSvgElement;
  readonly label: string;
  readonly value: string;
  readonly helper: string;
}) {
  return (
    <Card className="rounded-2xl p-5 shadow-none">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-muted-foreground text-sm">{label}</p>
          <p className="mt-2 text-2xl font-semibold tracking-tight">{value}</p>
          <p className="text-muted-foreground mt-1 text-xs">{helper}</p>
        </div>
        <span className="bg-primary/10 text-primary grid size-10 shrink-0 place-items-center rounded-xl">
          <HugeiconsIcon icon={icon} size={18} aria-hidden="true" />
        </span>
      </div>
    </Card>
  );
}

export function StatusBadge({
  status,
}: {
  readonly status: GestorAffiliateStatus | GestorProposalStatus | GestorPaymentStatus;
}) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "w-fit",
        (status === "Ativo" || status === "Aceita" || status === "pago") &&
          "border-emerald-200 bg-emerald-50 text-emerald-700",
        (status === "Pendente" || status === "Contraproposta" || status === "a-pagar") &&
          "border-amber-200 bg-amber-50 text-amber-700",
        (status === "Inativo" || status === "auto") && "border-blue-200 bg-blue-50 text-blue-700",
        (status === "Desativado" || status === "Rejeitada") &&
          "border-red-200 bg-red-50 text-red-700"
      )}
    >
      {status === "a-pagar" ? "A pagar" : status === "auto" ? "Split automático" : status}
    </Badge>
  );
}

export function FieldLine({ label, value }: { readonly label: string; readonly value: string }) {
  return (
    <div className="space-y-1">
      <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">{label}</p>
      <p className="text-sm">{value}</p>
    </div>
  );
}
