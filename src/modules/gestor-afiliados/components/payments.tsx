import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { GestorPayment } from "@/mocks/gestor-afiliados";
import { gestorPayments } from "@/mocks/gestor-afiliados";

import { StatusBadge } from "./shared";

type PaymentTab = "a-pagar" | "historico";

export function GestorPaymentsPage() {
  const [tab, setTab] = useState<PaymentTab>("a-pagar");
  const [payment, setPayment] = useState<GestorPayment | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const payments = useMemo(
    () =>
      gestorPayments.filter((item) =>
        tab === "a-pagar"
          ? item.status === "a-pagar" || item.status === "auto"
          : item.status === "pago"
      ),
    [tab]
  );

  return (
    <div className="space-y-5">
      {message ? (
        <p role="status" className="rounded-xl bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
          {message}
        </p>
      ) : null}
      <div className="border-border bg-card flex w-fit gap-1 rounded-2xl border p-1">
        <Button
          variant={tab === "a-pagar" ? "default" : "ghost"}
          size="sm"
          onClick={() => setTab("a-pagar")}
        >
          A pagar
        </Button>
        <Button
          variant={tab === "historico" ? "default" : "ghost"}
          size="sm"
          onClick={() => setTab("historico")}
        >
          Histórico
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        {payments.map((item) => (
          <Card key={item.id} className="rounded-2xl p-5 shadow-none">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-semibold">{item.affiliate}</p>
                <p className="text-muted-foreground text-sm">
                  {item.code} · {item.reference}
                </p>
              </div>
              <StatusBadge status={item.status} />
            </div>
            <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-muted-foreground text-xs">Valor</p>
                <p className="font-medium">{item.value}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs">Forma</p>
                <p className="font-medium">{item.method}</p>
              </div>
            </div>
            {item.status === "a-pagar" ? (
              <Button className="mt-5" size="sm" onClick={() => setPayment(item)}>
                Registrar pagamento
              </Button>
            ) : null}
          </Card>
        ))}
      </div>

      <PaymentDialog
        payment={payment}
        onOpenChange={(open) => !open && setPayment(null)}
        onConfirm={(confirmedPayment) => {
          setMessage(
            `Pagamento de ${confirmedPayment.value} registrado para ${confirmedPayment.affiliate}.`
          );
          setPayment(null);
        }}
      />
    </div>
  );
}

function PaymentDialog({
  payment,
  onOpenChange,
  onConfirm,
}: {
  readonly payment: GestorPayment | null;
  readonly onOpenChange: (open: boolean) => void;
  readonly onConfirm: (payment: GestorPayment) => void;
}) {
  return (
    <Dialog open={payment !== null} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-2xl">
        <DialogHeader>
          <DialogTitle>Registrar pagamento</DialogTitle>
          <DialogDescription>
            {payment
              ? `Confirme o repasse manual de ${payment.value} para ${payment.affiliate}.`
              : "Confirme o repasse manual."}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-2">
          <div className="space-y-2">
            <Label>Data</Label>
            <Input defaultValue="21/07/2026" />
          </div>
          <div className="space-y-2">
            <Label>Observação</Label>
            <Input placeholder="Comprovante ou referência interna" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={() => payment && onConfirm(payment)}>Confirmar pagamento</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
