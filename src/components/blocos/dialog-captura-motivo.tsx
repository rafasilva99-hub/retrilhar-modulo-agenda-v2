import { useState } from "react";
import { Alert02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
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
import { cn } from "@/lib/utils";
import type { MotivoRecusa } from "@/types/api/afiliados";

interface EntidadeDialogMotivo {
  readonly titulo: string;
  readonly subtitulo?: string;
  // [PROPOSTA §4.1] Informação de consequência financeira com destaque no
  // card da entidade (variante entidade-com-alerta).
  readonly alerta?: string;
}

interface DialogCapturaMotivoProps {
  readonly aberto: boolean;
  readonly titulo: string;
  readonly entidade: EntidadeDialogMotivo;
  // Motivos já filtrados pelo escopo via serviço; o bloco não importa dado.
  readonly motivos: readonly MotivoRecusa[];
  readonly avisoTexto: string;
  readonly tomAcao: "destrutivo" | "neutro";
  readonly motivoObrigatorio: boolean;
  readonly rotuloConfirmar: string;
  // Copy por escopo (§4.1 e §5.4); os padrões preservam o uso da Etapa 02.
  readonly rotuloMotivo?: string;
  readonly rotuloDescricao?: string;
  readonly placeholderDescricao?: string;
  readonly aoConfirmar: (motivoCodigo: string, descricao: string) => void;
  readonly aoCancelar: () => void;
}

// [DECISÃO] O modal não confirma a ação, ele coleta o motivo para manter o
// afiliado ciente. Vale para os três escopos (recusa de candidatura, remoção
// de produto e desativação de filiação), sem fork.
export function DialogCapturaMotivo({
  aberto,
  titulo,
  entidade,
  motivos,
  avisoTexto,
  tomAcao,
  motivoObrigatorio,
  rotuloConfirmar,
  rotuloMotivo = "Motivo",
  rotuloDescricao = "Descreva a razão da recusa",
  placeholderDescricao = "A comissão pedida consome quase toda a margem deste produto. Podemos retomar com um percentual menor.",
  aoConfirmar,
  aoCancelar,
}: DialogCapturaMotivoProps) {
  // [PROPOSTA] O select nasce vazio, sem "Outros" pré-selecionado: se a
  // função é informar o afiliado, "Outros" sem descrição não informa nada.
  const [motivo, setMotivo] = useState("");
  const [descricao, setDescricao] = useState("");

  const podeConfirmar = !motivoObrigatorio || motivo.length > 0;

  const confirmar = () => {
    aoConfirmar(motivo, descricao.trim());
    setMotivo("");
    setDescricao("");
  };

  return (
    <Dialog open={aberto} onOpenChange={(abrir) => (abrir ? undefined : aoCancelar())}>
      <DialogContent className="rounded-2xl sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{titulo}</DialogTitle>
          <DialogDescription className="sr-only">{avisoTexto}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="border-border flex items-center gap-3 rounded-xl border p-3">
            <Avatar className="size-10">
              <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">
                {iniciais(entidade.titulo)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{entidade.titulo}</p>
              {entidade.subtitulo ? (
                <p className="text-muted-foreground truncate text-xs">{entidade.subtitulo}</p>
              ) : null}
              {entidade.alerta ? (
                <p className="flex items-center gap-1 text-xs font-medium text-amber-700">
                  <HugeiconsIcon icon={Alert02Icon} size={12} aria-hidden="true" />
                  {entidade.alerta}
                </p>
              ) : null}
            </div>
          </div>

          <div
            className={cn(
              "flex items-start gap-2 rounded-xl px-3 py-2.5 text-sm",
              tomAcao === "destrutivo" ? "bg-red-50 text-red-700" : "bg-muted text-foreground"
            )}
          >
            <HugeiconsIcon
              icon={Alert02Icon}
              size={16}
              className="mt-0.5 shrink-0"
              aria-hidden="true"
            />
            {avisoTexto}
          </div>

          <div className="space-y-2">
            <Label htmlFor="captura-motivo">{rotuloMotivo}</Label>
            <Select value={motivo} onValueChange={setMotivo}>
              <SelectTrigger id="captura-motivo" className="w-full">
                <SelectValue placeholder="Selecione um motivo" />
              </SelectTrigger>
              <SelectContent>
                {motivos.map((item) => (
                  <SelectItem key={item.codigo} value={item.codigo}>
                    {item.rotulo}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="captura-descricao">{rotuloDescricao}</Label>
            <Textarea
              id="captura-descricao"
              value={descricao}
              rows={3}
              placeholder={placeholderDescricao}
              onChange={(event) => setDescricao(event.target.value)}
            />
            <p className="text-muted-foreground text-xs">
              O motivo selecionado e a descrição ficam visíveis para o afiliado.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={aoCancelar}>
            Cancelar
          </Button>
          <Button
            type="button"
            variant={tomAcao === "destrutivo" ? "destructive" : "default"}
            disabled={!podeConfirmar}
            onClick={confirmar}
          >
            {rotuloConfirmar}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function iniciais(nome: string): string {
  const partes = nome.trim().split(/\s+/);
  const primeira = partes[0]?.charAt(0) ?? "";
  const ultima = partes.length > 1 ? (partes[partes.length - 1]?.charAt(0) ?? "") : "";
  return `${primeira}${ultima}`.toUpperCase();
}
