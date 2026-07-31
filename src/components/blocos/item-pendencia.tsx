import { ArrowRight01Icon, PackageIcon, UserAdd01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";

import { formatarTempoRelativo } from "@/lib/formatadores";
import type { PendenciaAfiliacao } from "@/types/api/afiliados";

interface ItemPendenciaProps {
  readonly pendencia: PendenciaAfiliacao;
  readonly onAbrir?: (id: string) => void;
}

// [PENDENTE HP16] Ainda não está decidido se a candidatura é por produto ou
// por organização. Um branch por tipo: quando a HP16 fechar, o branch morto
// é DELETADO, não reescrito. Aqui só há renderização, nenhuma regra.
export function ItemPendencia({ pendencia, onAbrir }: ItemPendenciaProps) {
  return (
    <>
      {pendencia.tipo === "organizacao" && (
        <PendenciaOrganizacao pendencia={pendencia} onAbrir={onAbrir} />
      )}
      {pendencia.tipo === "produto" && <PendenciaProduto pendencia={pendencia} onAbrir={onAbrir} />}
    </>
  );
}

function PendenciaOrganizacao({ pendencia, onAbrir }: ItemPendenciaProps) {
  return (
    <CascaPendencia
      icone={UserAdd01Icon}
      tom="organizacao"
      overline="Afiliação à organização"
      titulo={<span>Solicitação de afiliação à sua organização</span>}
      pendencia={pendencia}
      onAbrir={onAbrir}
    />
  );
}

function PendenciaProduto({ pendencia, onAbrir }: ItemPendenciaProps) {
  return (
    <CascaPendencia
      icone={PackageIcon}
      tom="produto"
      overline="Afiliação ao produto"
      titulo={
        <span>
          Solicitação de afiliação em{" "}
          <span className="text-primary font-medium">{pendencia.produto?.nome}</span>
        </span>
      }
      pendencia={pendencia}
      onAbrir={onAbrir}
    />
  );
}

// Tons por tipo de pendência, conforme o Figma: azul Brand/600 para
// organização e Utility/Purple (50/600) para produto.
const tonsPendencia = {
  organizacao: {
    chip: "bg-primary/10 text-primary",
    overline: "text-primary",
  },
  produto: {
    chip: "bg-violet-50 text-violet-600",
    overline: "text-violet-600",
  },
} as const;

function CascaPendencia({
  icone,
  tom,
  overline,
  titulo,
  pendencia,
  onAbrir,
}: {
  readonly icone: IconSvgElement;
  readonly tom: keyof typeof tonsPendencia;
  readonly overline: string;
  readonly titulo: React.ReactNode;
  readonly pendencia: PendenciaAfiliacao;
  readonly onAbrir?: (id: string) => void;
}) {
  const comissao =
    pendencia.comissaoSolicitada > 0
      ? `propôs ${String(pendencia.comissaoSolicitada).padStart(2, "0")}% de comissão`
      : "comissão padrão do termo";

  return (
    <div className="flex items-center gap-3 py-3">
      <span
        className={`${tonsPendencia[tom].chip} grid size-10 shrink-0 place-items-center rounded-lg`}
      >
        <HugeiconsIcon icon={icone} size={18} aria-hidden="true" />
      </span>
      <div className="min-w-0 flex-1">
        <p
          className={`${tonsPendencia[tom].overline} text-[11px] font-medium tracking-wider uppercase`}
        >
          {overline}
        </p>
        <p className="truncate text-sm font-medium">{titulo}</p>
        <p className="text-muted-foreground truncate text-xs">
          {pendencia.afiliado.nome} · {comissao} · {formatarTempoRelativo(pendencia.criadaEm)}
        </p>
      </div>
      {onAbrir ? (
        <button
          type="button"
          className="border-border text-muted-foreground hover:text-foreground grid size-8 shrink-0 place-items-center rounded-lg border transition-colors"
          aria-label={`Abrir pendência de ${pendencia.afiliado.nome}`}
          onClick={() => onAbrir(pendencia.id)}
        >
          <HugeiconsIcon icon={ArrowRight01Icon} size={16} aria-hidden="true" />
        </button>
      ) : null}
    </div>
  );
}
