import {
  ArrowRight01Icon,
  CancelCircleIcon,
  CheckmarkCircle02Icon,
  DeliveryBox01Icon,
  Timer02Icon,
  UserAdd02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";

import { formatarTempoRelativo } from "@/lib/formatadores";
import { cn } from "@/lib/utils";
import type { PendenciaAfiliacao, SituacaoPendencia } from "@/types/api/afiliados";

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
      icone={UserAdd02Icon}
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
      icone={DeliveryBox01Icon}
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

// Selo de situação da negociação, conforme o Figma AFI-04: azul enquanto
// aguarda análise, verde para aceita e vermelho para recusada.
const selosSituacao: Record<
  SituacaoPendencia,
  { rotulo: (contraproposta: boolean) => string; cor: string; icone: IconSvgElement }
> = {
  nova: {
    rotulo: () => "Nova (aguardando análise)",
    cor: "text-blue-600",
    icone: Timer02Icon,
  },
  aguardando: {
    rotulo: () => "Aguardando análise",
    cor: "text-blue-600",
    icone: Timer02Icon,
  },
  aceita: {
    rotulo: () => "Você aceitou a proposta",
    cor: "text-emerald-600",
    icone: CheckmarkCircle02Icon,
  },
  recusada: {
    rotulo: (contraproposta) =>
      contraproposta ? "Você recusou a contraproposta" : "Você recusou a proposta",
    cor: "text-destructive",
    icone: CancelCircleIcon,
  },
};

function CascaPendencia({
  icone,
  overline,
  titulo,
  pendencia,
  onAbrir,
}: {
  readonly icone: IconSvgElement;
  readonly overline: string;
  readonly titulo: React.ReactNode;
  readonly pendencia: PendenciaAfiliacao;
  readonly onAbrir?: (id: string) => void;
}) {
  const contraproposta = pendencia.contraproposta === true;
  const verbo = contraproposta ? "contrapropôs" : "propôs";
  const padrao =
    pendencia.tipo === "produto" ? "comissão padrão do produto" : "comissão padrão do termo";
  const comissao =
    pendencia.comissaoSolicitada > 0
      ? `${verbo} ${String(pendencia.comissaoSolicitada).padStart(2, "0")}% de comissão`
      : padrao;

  const selo = pendencia.situacao ? selosSituacao[pendencia.situacao] : null;
  // Itens não visualizados destacam o chip em azul; os demais ficam neutros
  // e a linha resolvida/visualizada recebe fundo rebaixado.
  const naoVisualizada = !pendencia.situacao || pendencia.situacao === "nova";

  return (
    // Linha inteira acionável (AFI-04): o clique em qualquer área abre a
    // pendência; o botão de seta permanece como o acionador de teclado.
    <div
      className={cn(
        "flex items-center gap-4 px-5 py-4",
        !naoVisualizada && "bg-muted/40",
        onAbrir && "hover:bg-muted/60 cursor-pointer transition-colors"
      )}
      onClick={onAbrir ? () => onAbrir(pendencia.id) : undefined}
    >
      <span
        className={cn(
          "grid size-9 shrink-0 place-items-center rounded-lg border",
          naoVisualizada
            ? "text-primary border-sky-100 bg-sky-50"
            : "border-border/60 bg-card text-muted-foreground"
        )}
      >
        <HugeiconsIcon icon={icone} size={16} aria-hidden="true" />
      </span>
      <div className="min-w-0 flex-1 space-y-1">
        <p className="flex items-center gap-1.5 text-[11px] leading-none font-medium tracking-wider uppercase">
          <span className="text-foreground/80 truncate">{overline}</span>
          {selo ? (
            <>
              <span className="text-muted-foreground shrink-0" aria-hidden="true">
                ·
              </span>
              <span className={cn("shrink-0", selo.cor)}>{selo.rotulo(contraproposta)}</span>
              <HugeiconsIcon
                icon={selo.icone}
                size={12}
                strokeWidth={2}
                className={cn("shrink-0", selo.cor)}
                aria-hidden="true"
              />
            </>
          ) : null}
        </p>
        <p className="truncate text-sm font-medium">{titulo}</p>
        <p className="text-muted-foreground truncate text-xs">
          {pendencia.afiliado.nome} · {comissao} · {formatarTempoRelativo(pendencia.criadaEm)}
        </p>
      </div>
      {onAbrir ? (
        <button
          type="button"
          className="border-border text-muted-foreground hover:text-foreground grid size-7 shrink-0 place-items-center rounded-md border transition-colors"
          aria-label={`Abrir pendência de ${pendencia.afiliado.nome}`}
          onClick={(event) => {
            event.stopPropagation();
            onAbrir(pendencia.id);
          }}
        >
          <HugeiconsIcon icon={ArrowRight01Icon} size={16} aria-hidden="true" />
        </button>
      ) : null}
    </div>
  );
}
