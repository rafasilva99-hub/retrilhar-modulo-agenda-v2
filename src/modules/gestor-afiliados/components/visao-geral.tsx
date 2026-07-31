import { useState } from "react";
import {
  CheckmarkCircle01Icon,
  CoinsDollarIcon,
  Invoice01Icon,
  MoneyBag02Icon,
  UserCheck01Icon,
  ViewIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import {
  type ColunaTabela,
  FiltroSegmentado,
  ItemAfiliado,
  ItemPendencia,
  KpiCard,
  PainelSecao,
  TabelaBase,
} from "@/components/blocos";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Skeleton } from "@/components/ui/skeleton";
import { TableCell, TableRow } from "@/components/ui/table";
import {
  formatarData,
  formatarHora,
  formatarMoeda,
  formatarNumero,
  formatarTempoRelativo,
} from "@/lib/formatadores";
import { cn } from "@/lib/utils";

import {
  type CenarioVisaoGeral,
  contarPendencias,
  type FiltroPendencias,
  listarPendencias,
  listarTopAfiliados,
  listarVendas,
  obterDetalheVenda,
  obterResumoAfiliados,
} from "../services/afiliados-service";

import { DetalheVendaDrawer } from "./detalhe-venda-drawer";

const colunasVendas: readonly ColunaTabela[] = [
  { id: "afiliado", titulo: "Nome afiliado" },
  { id: "pedido", titulo: "Nº pedido" },
  { id: "itens", titulo: "Itens (Qtde.)" },
  { id: "valor", titulo: "Valor pedido" },
  { id: "comissao", titulo: "Valor comissão" },
  { id: "data", titulo: "Data / hora" },
  { id: "acoes", titulo: "" },
];

const cenarios: readonly { id: CenarioVisaoGeral; rotulo: string }[] = [
  { id: "padrao", rotulo: "Padrão" },
  { id: "sem-pendencias", rotulo: "Sem pendências" },
  { id: "sem-vendas", rotulo: "Sem vendas" },
  { id: "carregando", rotulo: "Carregando" },
];

export function GestorVisaoGeral() {
  // Estados de sistema z1 (sem pendências), z2 (sem vendas) e z3 (carregando).
  const [cenario, setCenario] = useState<CenarioVisaoGeral>("padrao");
  const [filtroPendencias, setFiltroPendencias] = useState<FiltroPendencias>("todas");
  const [vendaAbertaId, setVendaAbertaId] = useState<string | null>(null);

  const carregando = cenario === "carregando";
  const resumo = obterResumoAfiliados();
  const pendencias = listarPendencias(cenario, filtroPendencias, 7);
  const contagens = contarPendencias(cenario);
  const topAfiliados = listarTopAfiliados(5);
  const vendas = listarVendas(cenario, 8);
  const detalheVenda = vendaAbertaId ? obterDetalheVenda(vendaAbertaId) : null;
  // Sem nenhuma pendência na origem (não apenas no filtro atual): estado z1.
  const pendenciasVazias = !carregando && contagens.todas === 0;

  const irPara = (pagina: string) => {
    window.location.hash = `#${pagina}`;
  };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <KpiCard
          titulo="Total de vendas dos afiliados"
          valor={formatarMoeda(resumo.totalVendas)}
          complemento="Últimos 30 dias"
          icone={MoneyBag02Icon}
          carregando={carregando}
        />
        <KpiCard
          titulo="Valor das comissões"
          valor={formatarMoeda(resumo.valorComissoes)}
          complemento="Total a pagar"
          icone={CoinsDollarIcon}
          carregando={carregando}
        />
        <KpiCard
          titulo="Afiliados ativos na plataforma"
          valor={formatarNumero(resumo.afiliadosAtivos)}
          complemento={`Atualizado ${formatarTempoRelativo(resumo.atualizadoEm)}`}
          icone={UserCheck01Icon}
          carregando={carregando}
        />
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        <PainelSecao
          titulo="Pendências"
          descricao="Solicitações e propostas aguardando a sua ação."
          rodape={
            // Estado vazio (z1): sem filtro nem rodapé, só o aviso centralizado.
            pendenciasVazias
              ? undefined
              : {
                  // [FATO] A Central de filiação (AFI-04) é o destino deste link.
                  rotulo: "Ver todas as pendências",
                  onClick: () => irPara("gestorAfiliadosCentral"),
                }
          }
        >
          {pendenciasVazias ? (
            <Empty className="border-border h-full rounded-xl border border-solid py-8">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <HugeiconsIcon icon={CheckmarkCircle01Icon} size={20} aria-hidden="true" />
                </EmptyMedia>
                <EmptyTitle>Nenhuma pendência no momento</EmptyTitle>
                <EmptyDescription>
                  Novas solicitações e propostas de afiliação aparecem aqui.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : (
            <div className="space-y-4">
              <FiltroSegmentado
                opcoes={[
                  { id: "todas", rotulo: "Todas", contador: contagens.todas },
                  { id: "solicitacoes", rotulo: "Solicitações" },
                  { id: "propostas", rotulo: "Propostas" },
                ]}
                valor={filtroPendencias}
                aoMudar={(id) => setFiltroPendencias(id as FiltroPendencias)}
              />
              {carregando ? (
                <ListaEsqueleto quantidade={4} />
              ) : (
                <div className="divide-border divide-y">
                  {pendencias.map((pendencia) => (
                    <ItemPendencia
                      key={pendencia.id}
                      pendencia={pendencia}
                      onAbrir={() => irPara("gestorAfiliadosCentral")}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </PainelSecao>

        <PainelSecao
          titulo="Top afiliados"
          descricao="Afiliados com maior desempenho no período."
          rodape={{
            rotulo: "Ver todos os afiliados",
            onClick: () => irPara("gestorAfiliadosLista"),
          }}
        >
          {carregando ? (
            <ListaEsqueleto quantidade={4} altura="h-20" />
          ) : (
            <div className="space-y-3">
              {topAfiliados.map((afiliado, indice) => (
                <ItemAfiliado
                  key={afiliado.id}
                  afiliado={afiliado}
                  posicao={indice + 1}
                  onAbrir={() => irPara("gestorAfiliadosLista")}
                />
              ))}
            </div>
          )}
        </PainelSecao>
      </div>

      <PainelSecao
        titulo="Últimas vendas realizadas"
        descricao="Vendas mais recentes geradas pelos afiliados da organização."
      >
        <TabelaBase
          colunas={colunasVendas}
          carregando={carregando}
          linhasEsqueleto={5}
          estaVazia={vendas.length === 0}
          vazio={
            <Empty className="border-border rounded-xl border border-solid p-0">
              <EmptyHeader className="py-8">
                <EmptyMedia variant="icon">
                  <HugeiconsIcon icon={Invoice01Icon} size={20} aria-hidden="true" />
                </EmptyMedia>
                <EmptyTitle>Nenhuma venda registrada</EmptyTitle>
                <EmptyDescription>
                  As vendas indicadas pelos afiliados aparecem aqui assim que acontecem.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          }
        >
          {vendas.map((venda) => (
            <TableRow
              key={venda.id}
              className="cursor-pointer"
              onClick={() => setVendaAbertaId(venda.id)}
            >
              <TableCell className="font-medium">{venda.nomeAfiliado}</TableCell>
              <TableCell>{venda.numeroPedido}</TableCell>
              <TableCell>{venda.itensQtde} itens</TableCell>
              <TableCell>{formatarMoeda(venda.valorPedido)}</TableCell>
              <TableCell className="font-medium text-emerald-600">
                {formatarMoeda(venda.valorComissao)}
              </TableCell>
              <TableCell>
                <span className="block text-sm">{formatarData(venda.dataHora)}</span>
                <span className="text-muted-foreground block text-xs">
                  às {formatarHora(venda.dataHora)}
                </span>
              </TableCell>
              <TableCell className="text-right">
                <button
                  type="button"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={`Ver detalhes da venda ${venda.numeroPedido}`}
                  onClick={(evento) => {
                    evento.stopPropagation();
                    setVendaAbertaId(venda.id);
                  }}
                >
                  <HugeiconsIcon icon={ViewIcon} size={18} aria-hidden="true" />
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TabelaBase>
      </PainelSecao>

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

      <DetalheVendaDrawer
        detalhe={detalheVenda}
        aberto={detalheVenda !== null}
        aoFechar={() => setVendaAbertaId(null)}
        aoVerAfiliado={() => {
          setVendaAbertaId(null);
          irPara("gestorAfiliadosLista");
        }}
      />
    </div>
  );
}

function ListaEsqueleto({
  quantidade,
  altura = "h-14",
}: {
  readonly quantidade: number;
  readonly altura?: string;
}) {
  return (
    <div className="space-y-3">
      {Array.from({ length: quantidade }, (_, indice) => (
        <Skeleton key={indice} className={cn("w-full rounded-xl", altura)} />
      ))}
    </div>
  );
}
