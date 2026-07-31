import { Calendar03Icon, LicenseIcon, Tick02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatarDataExtensa } from "@/lib/formatadores";

interface HeaderEntidadeProps {
  readonly nome: string;
  readonly descricao?: string | null;
  readonly handle?: string | null;
  readonly termosAceitosEm?: string | null;
  readonly afiliadoDesde?: string | null;
}

// Cabeçalho de entidade dos modais de avaliação (AFI-04.a/.b) e da ficha
// AFI-03. [FATO] Termos aceitos e data de filiação aparecem como dois campos
// no frame, ainda a confirmar se são o mesmo evento.
export function HeaderEntidade({
  nome,
  descricao,
  handle,
  termosAceitosEm,
  afiliadoDesde,
}: HeaderEntidadeProps) {
  const meta = [descricao, handle].filter(Boolean).join(" · ");

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Avatar className="size-12">
          <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
            {iniciais(nome)}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <p className="truncate text-base font-semibold tracking-tight">{nome}</p>
          {meta ? <p className="text-muted-foreground truncate text-sm">{meta}</p> : null}
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="bg-muted/60 text-muted-foreground grid size-10 shrink-0 place-items-center rounded-xl">
            <HugeiconsIcon icon={LicenseIcon} size={20} aria-hidden="true" />
          </span>
          <div className="space-y-0.5">
            <p className="text-muted-foreground text-xs">Termos de uso de afiliado</p>
            {termosAceitosEm ? (
              <p className="flex items-center gap-1 text-sm">
                <HugeiconsIcon
                  icon={Tick02Icon}
                  size={14}
                  className="text-emerald-600"
                  aria-hidden="true"
                />
                Aceito pelo afiliado
              </p>
            ) : (
              <p className="text-muted-foreground text-sm">Aguardando aceite</p>
            )}
          </div>
        </div>
        {afiliadoDesde ? (
          <div className="flex items-center gap-3">
            <div className="space-y-0.5 text-right">
              <p className="text-muted-foreground text-xs">Afiliado(a) ativo(a) desde</p>
              <p className="text-sm font-medium">{formatarDataExtensa(afiliadoDesde)}</p>
            </div>
            <span className="bg-muted/60 text-muted-foreground grid size-10 shrink-0 place-items-center rounded-xl">
              <HugeiconsIcon icon={Calendar03Icon} size={20} aria-hidden="true" />
            </span>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function iniciais(nome: string): string {
  const partes = nome.trim().split(/\s+/);
  const primeira = partes[0]?.charAt(0) ?? "";
  const ultima = partes.length > 1 ? (partes[partes.length - 1]?.charAt(0) ?? "") : "";
  return `${primeira}${ultima}`.toUpperCase();
}
