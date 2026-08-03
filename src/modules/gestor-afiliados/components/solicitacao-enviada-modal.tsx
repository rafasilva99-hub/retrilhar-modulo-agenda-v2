import { CheckmarkCircle01Icon, InformationCircleIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { CodigoCopiavel } from "@/components/blocos";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface SolicitacaoEnviadaModalProps {
  readonly protocolo: string | null;
  readonly nomeAfiliado: string;
  readonly aoFechar: () => void;
}

// AFI-02.b1 (node 16215:99900). [FATO] Desfecho em modal, não em toast: o
// protocolo é dado persistente que o gestor pode querer guardar.
// [PROPOSTA §4.3] Regra registrada: desfecho com dado persistente usa modal,
// desfecho sem dado usa toast.
export function SolicitacaoEnviadaModal({
  protocolo,
  nomeAfiliado,
  aoFechar,
}: SolicitacaoEnviadaModalProps) {
  return (
    <Dialog open={protocolo !== null} onOpenChange={(abrir) => (abrir ? undefined : aoFechar())}>
      <DialogContent className="rounded-2xl sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <HugeiconsIcon
              icon={CheckmarkCircle01Icon}
              size={20}
              className="text-emerald-600"
              aria-hidden="true"
            />
            <DialogTitle>Solicitação enviada</DialogTitle>
          </div>
          <DialogDescription>
            A solicitação de desativação da filiação de {nomeAfiliado} foi enviada para aprovação de
            um administrador.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="border-border flex items-center justify-between gap-3 rounded-xl border p-3">
            <span className="text-muted-foreground text-sm">Protocolo da solicitação</span>
            {/* [PROPOSTA §4.3] Se é para ser guardado, precisa ser copiável. */}
            {protocolo ? <CodigoCopiavel codigo={protocolo} /> : null}
          </div>
          <div className="bg-primary/5 text-primary flex items-start gap-2 rounded-xl px-3 py-2.5 text-sm">
            <HugeiconsIcon
              icon={InformationCircleIcon}
              size={16}
              className="mt-0.5 shrink-0"
              aria-hidden="true"
            />
            A filiação segue ativa enquanto a autorização estiver em análise. Você será
            notificado(a) quando ela for aprovada ou negada.
          </div>
        </div>

        <DialogFooter>
          {/* TODO: [P3] Destino do "Ver no histórico" não definido pelo
              Cristiano; renderizado desabilitado até a decisão. */}
          <Button type="button" variant="outline" disabled>
            Ver no histórico
          </Button>
          <Button type="button" onClick={aoFechar}>
            Entendi
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
