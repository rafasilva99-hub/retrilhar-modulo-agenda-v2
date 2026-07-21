import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
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
import type { GestorProductRequest } from "@/mocks/gestor-afiliados";
import { gestorProductRequests } from "@/mocks/gestor-afiliados";

export function GestorRequestsPage() {
  const [selected, setSelected] = useState<GestorProductRequest | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      {message ? (
        <p role="status" className="rounded-xl bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
          {message}
        </p>
      ) : null}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        {gestorProductRequests.map((request) => (
          <Card key={request.id} className="rounded-2xl p-5 shadow-none">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-semibold">{request.product}</p>
                <p className="text-muted-foreground text-sm">
                  {request.affiliate} · {request.code}
                </p>
              </div>
              <span className="rounded-full border border-amber-200 bg-amber-50 px-2 py-1 text-xs text-amber-700">
                {request.status}
              </span>
            </div>
            <p className="text-muted-foreground mt-4 text-sm">
              Pedido enviado {request.requestedAt.toLowerCase()} para ampliar o escopo da afiliação.
            </p>
            <div className="mt-5 flex gap-2">
              <Button size="sm" onClick={() => setSelected(request)}>
                Aprovar
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setMessage(
                    `Solicitação de ${request.product} recusada para ${request.affiliate}.`
                  )
                }
              >
                Recusar
              </Button>
            </div>
          </Card>
        ))}
      </div>
      <ApproveRequestDialog
        request={selected}
        onOpenChange={(open) => !open && setSelected(null)}
        onApprove={(request) => {
          setMessage(`Solicitação de ${request.product} aprovada para ${request.affiliate}.`);
          setSelected(null);
        }}
      />
    </div>
  );
}

function ApproveRequestDialog({
  request,
  onOpenChange,
  onApprove,
}: {
  readonly request: GestorProductRequest | null;
  readonly onOpenChange: (open: boolean) => void;
  readonly onApprove: (request: GestorProductRequest) => void;
}) {
  return (
    <Dialog open={request !== null} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-2xl">
        <DialogHeader>
          <DialogTitle>Aprovar solicitação</DialogTitle>
          <DialogDescription>
            {request
              ? `Defina a comissão de ${request.product} para ${request.affiliate}.`
              : "Defina a comissão do produto solicitado."}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-2">
          <div className="space-y-2">
            <Label>Tipo de comissão</Label>
            <Input value="Percentual sobre venda" readOnly />
          </div>
          <div className="space-y-2">
            <Label>Valor</Label>
            <Input defaultValue="10%" />
          </div>
          <div className="flex items-center gap-2">
            <Checkbox id="keep-rules" defaultChecked />
            <Label htmlFor="keep-rules" className="text-sm font-normal">
              Não sobrescrever valores já definidos
            </Label>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={() => request && onApprove(request)}>Aprovar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
