import { Alert02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ErrorStateProps extends React.HTMLAttributes<HTMLDivElement> {
  error?: Error & { digest?: string };
  reset?: () => void;
  title?: string;
  description?: string;
}

export function ErrorState({
  error,
  reset,
  title = "Algo deu errado",
  description,
  className,
  ...props
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        "animate-in fade-in zoom-in-95 flex h-full w-full flex-col items-center justify-center p-6 text-center duration-300",
        className
      )}
      {...props}
    >
      <div className="bg-destructive/10 text-destructive mb-6 flex h-20 w-20 items-center justify-center rounded-full">
        <HugeiconsIcon icon={Alert02Icon} strokeWidth={1.5} className="h-10 w-10" />
      </div>
      <h2 className="text-foreground mb-2 text-2xl font-bold tracking-tight">{title}</h2>
      <p className="text-muted-foreground mb-8 max-w-[500px]">
        {description ||
          error?.message ||
          "Ocorreu um erro inesperado ao carregar esta parte do sistema. Por favor, tente novamente."}
      </p>

      {/* Exibindo código oculto de digest do Next.js se existir para facilitar suporte sem poluir a UX */}
      {error?.digest && (
        <p className="text-muted-foreground/50 mb-4 text-xs select-all">
          ID de Referência: {error.digest}
        </p>
      )}

      {reset && (
        <div className="flex gap-4">
          <Button variant="default" onClick={() => reset()}>
            Tentar novamente
          </Button>
          <Button variant="outline" onClick={() => (window.location.href = "/")}>
            Voltar ao Início
          </Button>
        </div>
      )}
    </div>
  );
}
