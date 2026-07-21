import {
  Alert02Icon,
  Cancel01Icon,
  CheckmarkCircle01Icon,
  InformationCircleIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import type { ComponentProps } from "react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { CommissionStatus, OrderStatus } from "@/mocks/afiliados";

type AffiliateStatus = "Ativo" | "Inativo" | "Desativado";

type StatusConfig = {
  readonly label: string;
  readonly className: string;
  readonly icon: IconSvgElement;
};

const affiliateStatusConfig: Record<AffiliateStatus, StatusConfig> = {
  Ativo: {
    label: "Ativo",
    className: "border-emerald-200 bg-emerald-50 text-emerald-700",
    icon: CheckmarkCircle01Icon,
  },
  Inativo: {
    label: "Inativo",
    className: "border-border bg-muted text-muted-foreground",
    icon: InformationCircleIcon,
  },
  Desativado: {
    label: "Desativado",
    className: "border-red-200 bg-red-50 text-red-700",
    icon: Cancel01Icon,
  },
};

const commissionStatusConfig: Record<CommissionStatus, StatusConfig> = {
  quitada: {
    label: "Quitada",
    className: "border-emerald-200 bg-emerald-50 text-emerald-700",
    icon: CheckmarkCircle01Icon,
  },
  "a-receber": {
    label: "A receber",
    className: "border-amber-200 bg-amber-50 text-amber-700",
    icon: Alert02Icon,
  },
  "nao-gerada": {
    label: "Não gerada",
    className: "border-border bg-muted text-muted-foreground",
    icon: InformationCircleIcon,
  },
};

const orderStatusConfig: Record<OrderStatus, StatusConfig> = {
  Pago: {
    label: "Pago",
    className: "border-emerald-200 bg-emerald-50 text-emerald-700",
    icon: CheckmarkCircle01Icon,
  },
  "Aguardando pagamento": {
    label: "Aguardando pagamento",
    className: "border-amber-200 bg-amber-50 text-amber-700",
    icon: Alert02Icon,
  },
  Cancelado: {
    label: "Cancelado",
    className: "border-red-200 bg-red-50 text-red-700",
    icon: Cancel01Icon,
  },
  Abandonado: {
    label: "Abandonado",
    className: "border-orange-200 bg-orange-50 text-orange-700",
    icon: Alert02Icon,
  },
};

type StatusBadgeProps = Omit<ComponentProps<typeof Badge>, "children" | "variant">;

function StatusBadge({
  config,
  className,
  ...props
}: StatusBadgeProps & { readonly config: StatusConfig }) {
  return (
    <Badge {...props} variant="outline" className={cn(config.className, className)}>
      <HugeiconsIcon icon={config.icon} size={12} aria-hidden="true" />
      {config.label}
    </Badge>
  );
}

type AffiliateStatusBadgeProps = StatusBadgeProps & {
  readonly status: AffiliateStatus;
};

function AffiliateStatusBadge({ status, ...props }: AffiliateStatusBadgeProps) {
  return <StatusBadge config={affiliateStatusConfig[status]} {...props} />;
}

type CommissionStatusBadgeProps = StatusBadgeProps & {
  readonly status: CommissionStatus;
};

function CommissionStatusBadge({ status, ...props }: CommissionStatusBadgeProps) {
  return <StatusBadge config={commissionStatusConfig[status]} {...props} />;
}

type OrderStatusBadgeProps = StatusBadgeProps & {
  readonly status: OrderStatus;
};

function OrderStatusBadge({ status, ...props }: OrderStatusBadgeProps) {
  return <StatusBadge config={orderStatusConfig[status]} {...props} />;
}

export { AffiliateStatusBadge, CommissionStatusBadge, OrderStatusBadge };
export type {
  AffiliateStatus,
  AffiliateStatusBadgeProps,
  CommissionStatusBadgeProps,
  OrderStatusBadgeProps,
};
