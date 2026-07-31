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
  type FiltroPendencias,
  listarSolicitacoes,
  pendenciaDaSolicitacao,
} from "../services/afiliados-service";

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

// Fora do componente: mutação de global não pertence ao escopo de render
// analisado pelo React Compiler (react-hooks/immutability).
function navegarParaFila(tipo: Solicitacao["tipo"]) {
  window.location.hash =
    tipo === "organizacao" ? "#gestorAfiliadosPropostas" : "#gestorAfiliadosSolicitacoes";
}

export function GestorCentralFiliacao() {
  // Estados de sistema z1 (sem pendências) e z3 (carregando); o z2 (busca
  // sem resultado) emerge do próprio campo de busca.
  const [cenario, setCenario] = useState<CenarioCentral>("padrao");
  const [filtro, setFiltro] = useState<FiltroPendencias>("todas");
  const [busca, setBusca] = useState("");

  const carregando = cenario === "carregando";
  const solicitacoes = listarSolicitacoes(cenario, filtro, busca);
  const contagens = contarSolicitacoes(cenario);
  const grupos = agruparPorDia(solicitacoes);

  const centralVazia = !carregando && contagens.todas === 0;
  const buscaSemResultado = !carregando && !centralVazia && solicitacoes.length === 0;

  const abrirSolicitacao = (solicitacao: Solicitacao) => {
    // TODO: [P1][P2] O ModalAvaliacaoProposta (AFI-04.a/.b) está bloqueado
    // pelas regras de comissão e do botão primário. Até lá, o item leva às
    // filas operacionais existentes do módulo.
    navegarParaFila(solicitacao.tipo);
  };

  return (
    <div className="mx-auto w-full max-w-3xl space-y-5">
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
          className="h-11 rounded-xl pl-10"
          onChange={(event) => setBusca(event.target.value)}
        />
      </div>

      <FiltroSegmentado
        opcoes={[
          { id: "todas", rotulo: "Todas", contador: contagens.todas },
          { id: "solicitacoes", rotulo: "Solicitações", contador: contagens.solicitacoes },
          { id: "propostas", rotulo: "Propostas", contador: contagens.propostas },
        ]}
        valor={filtro}
        aoMudar={(id) => setFiltro(id as FiltroPendencias)}
      />

      {carregando ? (
        <div className="space-y-3">
          <Skeleton className="h-5 w-24 rounded-md" />
          <Skeleton className="h-56 w-full rounded-2xl" />
          <Skeleton className="h-5 w-40 rounded-md" />
          <Skeleton className="h-40 w-full rounded-2xl" />
        </div>
      ) : centralVazia ? (
        <Empty className="border-border rounded-xl border border-solid">
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
        <Empty className="border-border rounded-xl border border-solid">
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
            <section key={grupo.chave} className="space-y-2">
              <h2 className="text-muted-foreground flex items-center gap-2 text-sm">
                <HugeiconsIcon icon={Calendar03Icon} size={16} aria-hidden="true" />
                {grupo.rotulo}
              </h2>
              <div className="border-border bg-card divide-border divide-y rounded-2xl border px-4">
                {grupo.itens.map((solicitacao) => (
                  <ItemPendencia
                    key={solicitacao.id}
                    pendencia={pendenciaDaSolicitacao(solicitacao)}
                    onAbrir={() => abrirSolicitacao(solicitacao)}
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
    </div>
  );
}
