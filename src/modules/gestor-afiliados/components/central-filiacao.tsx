import { useState } from "react";
import { Calendar03Icon, CheckmarkCircle01Icon, Search01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { FiltroSegmentado, ItemPendencia } from "@/components/blocos";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { rotuloDoDia } from "@/lib/formatadores";
import { cn } from "@/lib/utils";
import type { Solicitacao } from "@/types/api/afiliados";

import {
  type CenarioCentral,
  contarSolicitacoes,
  type FiltroCentral,
  listarSolicitacoes,
  pendenciaDaSolicitacao,
} from "../services/afiliados-service";

import { AvaliarPropostaDrawer } from "./avaliar-proposta-drawer";

const cenarios: readonly { id: CenarioCentral; rotulo: string }[] = [
  { id: "padrao", rotulo: "Padrão" },
  { id: "sem-pendencias", rotulo: "Sem pendências" },
  { id: "carregando", rotulo: "Carregando" },
];

interface GrupoDoDia {
  readonly chave: string;
  readonly rotulo: string;
  readonly itens: Solicitacao[];
}

// O agrupamento por dia é responsabilidade da rota; o ItemPendencia é o
// mesmo bloco da AFI-01.
function agruparPorDia(solicitacoes: readonly Solicitacao[]): GrupoDoDia[] {
  const ordenadas = [...solicitacoes].sort((a, b) => b.criadaEm.localeCompare(a.criadaEm));
  const grupos = new Map<string, GrupoDoDia>();
  for (const solicitacao of ordenadas) {
    const chave = solicitacao.criadaEm.slice(0, 10);
    const grupo = grupos.get(chave) ?? {
      chave,
      rotulo: rotuloDoDia(solicitacao.criadaEm),
      itens: [],
    };
    grupo.itens.push(solicitacao);
    grupos.set(chave, grupo);
  }
  return [...grupos.values()];
}

export function GestorCentralFiliacao() {
  // Estados de sistema z1 (sem pendências) e z3 (carregando); o z2 (busca
  // sem resultado) emerge do próprio campo de busca.
  const [cenario, setCenario] = useState<CenarioCentral>("padrao");
  const [filtro, setFiltro] = useState<FiltroCentral>("todas");
  const [busca, setBusca] = useState("");
  // Solicitação aberta no drawer de avaliação (AFI-04.a/.b).
  const [solicitacaoAberta, setSolicitacaoAberta] = useState<Solicitacao | null>(null);

  const carregando = cenario === "carregando";
  const solicitacoes = listarSolicitacoes(cenario, filtro, busca);
  const contagens = contarSolicitacoes(cenario);
  const grupos = agruparPorDia(solicitacoes);

  const centralVazia = !carregando && contagens.todas === 0;
  const buscaSemResultado = !carregando && !centralVazia && solicitacoes.length === 0;

  return (
    <div className="mx-auto w-full max-w-4xl space-y-5">
      <div className="relative">
        <HugeiconsIcon
          icon={Search01Icon}
          size={18}
          className="text-muted-foreground absolute top-1/2 left-3.5 -translate-y-1/2"
          aria-hidden="true"
        />
        <Input
          value={busca}
          placeholder="Pesquisar..."
          aria-label="Pesquisar pendências"
          className="h-10 rounded-lg pl-10"
          onChange={(event) => setBusca(event.target.value)}
        />
      </div>

      <FiltroSegmentado
        opcoes={[
          { id: "todas", rotulo: "Todas" },
          {
            id: "nao-visualizadas",
            rotulo: "Não visualizadas",
            contador: contagens["nao-visualizadas"],
          },
          { id: "aguardando", rotulo: "Aguardando análise" },
          { id: "aceitas", rotulo: "Propostas aceitas" },
          { id: "recusadas", rotulo: "Propostas recusadas" },
        ]}
        valor={filtro}
        aoMudar={(id) => setFiltro(id as FiltroCentral)}
      />

      {carregando ? (
        <div className="space-y-3">
          <Skeleton className="h-5 w-24 rounded-md" />
          <Skeleton className="h-56 w-full rounded-2xl" />
          <Skeleton className="h-5 w-40 rounded-md" />
          <Skeleton className="h-40 w-full rounded-2xl" />
        </div>
      ) : centralVazia ? (
        <Empty className="border-border bg-card rounded-xl border border-solid">
          <EmptyHeader className="py-8">
            <EmptyMedia variant="icon">
              <HugeiconsIcon icon={CheckmarkCircle01Icon} size={20} aria-hidden="true" />
            </EmptyMedia>
            <EmptyTitle>Nenhuma pendência no momento</EmptyTitle>
            <EmptyDescription>
              Novas solicitações e propostas de afiliação aparecem aqui.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : buscaSemResultado ? (
        <Empty className="border-border bg-card rounded-xl border border-solid">
          <EmptyHeader className="py-8">
            <EmptyMedia variant="icon">
              <HugeiconsIcon icon={Search01Icon} size={20} aria-hidden="true" />
            </EmptyMedia>
            <EmptyTitle>Nenhum resultado para a busca</EmptyTitle>
            <EmptyDescription>
              Revise o termo pesquisado ou limpe o filtro para ver todas as pendências.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <div className="space-y-5">
          {grupos.map((grupo) => (
            <section key={grupo.chave} className="space-y-3">
              <div className="text-muted-foreground flex items-center justify-between gap-3 px-2.5 text-xs">
                <h2 className="flex items-center gap-2">
                  <HugeiconsIcon icon={Calendar03Icon} size={16} aria-hidden="true" />
                  {grupo.rotulo}
                </h2>
                <span aria-label={`${grupo.itens.length} pendências no dia`}>
                  ({String(grupo.itens.length).padStart(2, "0")})
                </span>
              </div>
              <div className="border-border bg-card divide-border/60 divide-y overflow-hidden rounded-xl border">
                {grupo.itens.map((solicitacao) => (
                  <ItemPendencia
                    key={solicitacao.id}
                    pendencia={pendenciaDaSolicitacao(solicitacao)}
                    onAbrir={() => setSolicitacaoAberta(solicitacao)}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}

      <div className="border-border text-muted-foreground flex flex-wrap items-center gap-2 rounded-xl border border-dashed px-4 py-3 text-xs">
        <span className="font-medium">Cenários de demonstração:</span>
        {cenarios.map((opcao) => (
          <Button
            key={opcao.id}
            type="button"
            variant={opcao.id === cenario ? "secondary" : "ghost"}
            size="sm"
            className={cn("h-7 rounded-lg px-2.5 text-xs", opcao.id === cenario && "font-medium")}
            aria-pressed={opcao.id === cenario}
            onClick={() => setCenario(opcao.id)}
          >
            {opcao.rotulo}
          </Button>
        ))}
      </div>

      <AvaliarPropostaDrawer
        solicitacao={solicitacaoAberta}
        aberto={solicitacaoAberta !== null}
        aoFechar={() => setSolicitacaoAberta(null)}
      />
    </div>
  );
}
