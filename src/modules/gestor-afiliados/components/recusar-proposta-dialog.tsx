import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import { listarMotivos } from "../services/afiliados-service";

interface RecusarPropostaDialogProps {
  readonly aberto: boolean;
  readonly ehContraproposta: boolean;
  readonly aoFechar: () => void;
  readonly aoConfirmar: (motivoCodigo: string, descricao: string) => void;
}

// Modal AFI-04.c do Figma: justificativa da recusa da proposta. O motivo é
// obrigatório e visível para o afiliado (decisão registrada no contrato).
export function RecusarPropostaDialog({
  aberto,
  ehContraproposta,
  aoFechar,
  aoConfirmar,
}: RecusarPropostaDialogProps) {
  const motivos = listarMotivos("recusa_candidatura");
  const [motivo, setMotivo] = useState("outros");
  const [descricao, setDescricao] = useState("");

  // Reinicia a justificativa a cada abertura do modal.
  useEffect(() => {
    if (!aberto) return;
    setMotivo("outros");
    setDescricao("");
  }, [aberto]);

  return (
    <Dialog open={aberto} onOpenChange={(abrir) => (abrir ? undefined : aoFechar())}>
      <DialogContent showCloseButton={false} className="gap-4 rounded-2xl sm:max-w-lg">
        {/* Botão de fechar no padrão dos modais da agenda: 32px, raio 6px,
            hover neutro e X fino de 16px. */}
        <DialogClose className="absolute top-4 right-4 flex size-[32px] shrink-0 cursor-pointer items-center justify-center rounded-[6px] transition-colors hover:bg-[#f5f5f5]">
          <svg className="size-[16px]" fill="none" viewBox="0 0 16 16" aria-hidden="true">
            <path d="M4 4l8 8M12 4l-8 8" stroke="#717680" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <span className="sr-only">Fechar</span>
        </DialogClose>
        <DialogHeader>
          <DialogTitle>
            {ehContraproposta ? "Recusar contraproposta" : "Recusar proposta"}
          </DialogTitle>
          <DialogDescription>
            Insira abaixo a razão da solicitação estar sendo recusada
          </DialogDescription>
        </DialogHeader>

        {/* Divisória do cabeçalho: 24px da borda esquerda e 40px da direita
            do modal; como o DialogContent tem p-6, sobra só o mr de 16px.
            O gap-4 do dialog garante 16px de respiro de cada lado da linha. */}
        <div aria-hidden="true" className="mr-[16px] h-px bg-[#e9eaeb]" />

        <div className="grid gap-4 pb-2">
          <div className="space-y-2">
            <Label htmlFor="recusa-motivo">Motivo da recusa (visível para o afiliado)</Label>
            <Select value={motivo} onValueChange={setMotivo}>
              <SelectTrigger id="recusa-motivo" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {motivos.map((opcao) => (
                  <SelectItem key={opcao.codigo} value={opcao.codigo}>
                    {opcao.rotulo}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="recusa-descricao">Descreva a razão da recusa</Label>
            <Textarea
              id="recusa-descricao"
              value={descricao}
              placeholder="Ex.: A comissão solicitada consome quase toda a margem deste produto. Conseguimos aprovar com um percentual menor."
              className="min-h-24"
              onChange={(event) => setDescricao(event.target.value)}
            />
          </div>

          {/* Nota informativa no padrão dos formulários da agenda
              (AgendaNovaAtividade), com o mesmo selo de "i" preenchido. */}
          <div className="flex items-center gap-[10px] rounded-[10px] border border-[#f5f5f5] bg-[#f8f9fc] px-[12px] py-[8px]">
            <svg
              className="size-[24px] shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="11" fill="#4A7BF7" opacity="0.15" />
              <circle cx="12" cy="12" r="8" fill="#4A7BF7" />
              <path d="M12 16v-4M12 8h.01" stroke="white" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <p className="font-['Helvetica_Neue:Regular',sans-serif] text-[12px] leading-[14px] text-[#414651]">
              A recusa afeta apenas essa solicitação. Caso o usuário possua outros produtos
              aprovados, ele continuará divulgando normalmente.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" className="h-10 flex-1" onClick={aoFechar}>
            Cancelar
          </Button>
          <Button
            className="bg-destructive hover:bg-destructive/90 h-10 flex-1 text-white"
            onClick={() => aoConfirmar(motivo, descricao.trim())}
          >
            Confirmar recusa
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
