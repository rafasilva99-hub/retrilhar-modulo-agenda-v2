import { Copy01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";

interface CodigoCopiavelProps {
  readonly codigo: string;
  readonly className?: string;
}

export function CodigoCopiavel({ codigo, className }: CodigoCopiavelProps) {
  const copiar = (event: React.MouseEvent<HTMLButtonElement>) => {
    // O chip aparece dentro de cartões clicáveis; a cópia não deve navegar.
    event.stopPropagation();
    void navigator.clipboard?.writeText(codigo).catch(() => undefined);
    toast.success("Código copiado", { description: codigo });
  };

  return (
    <button
      type="button"
      className={cn(
        "border-border bg-muted/60 text-foreground/80 hover:bg-muted inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 font-mono text-xs font-medium transition-colors",
        className
      )}
      aria-label={`Copiar código ${codigo}`}
      onClick={copiar}
    >
      {codigo}
      <HugeiconsIcon icon={Copy01Icon} size={13} aria-hidden="true" />
    </button>
  );
}
