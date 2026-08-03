import { useState } from "react";
import {
  Add01Icon,
  Calendar03Icon,
  CheckmarkCircle01Icon,
  ClipboardIcon,
  Money01Icon,
  MoneyBag02Icon,
  Search01Icon,
  ShoppingBag02Icon,
  UserCheck01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { toast } from "sonner";

import {
  AfiliadoAcoes,
  BadgeFiliacao,
  type ColunaTabela,
  DialogCapturaMotivo,
  HeaderEntidade,
  KpiCard,
  PainelSecao,
  ProdutoVinculadoCard,
  TabelaBase,
  TimelineAtividade,
} from "@/components/blocos";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { TableCell, TableRow } from "@/components/ui/table";
import { type Usuario } from "@/lib/afiliados/permissoes";
import { PODE } from "@/lib/afiliados/permissoes";
import { estadoAposReativacao } from "@/lib/afiliados/transicoes";
import { formatarData, formatarMoeda, formatarNumero, rotuloDoDia } from "@/lib/formatadores";
import { cn } from "@/lib/utils";
import type {
  AfiliadoFicha,
  EstadoFiliacao,
  EventoAtividade,
  KpisFicha,
  ProdutoVinculado,
} from "@/types/api/afiliados";

import {
  type CenarioFicha,
  criarSolicitacaoAutorizacao,
  listarMotivos,
  listarVendas,
  obterFicha,
  obterFichaSelecionada,
} from "../services/afiliados-service";

import { type AlvoDesativacao, DesativacaoDialogs } from "./desativacao-dialogs";
import { EditarProdutoDrawer } from "./editar-produto-drawer";
import { SolicitacaoEnviadaModal } from "./solicitacao-enviada-modal";
import { VincularProdutosModal } from "./vincular-produtos-modal";

type CenarioDemoFicha = "padrao" | Exclude<CenarioFicha, "ativa">;

const cenarios: readonly { id: CenarioDemoFicha; rotulo: string }[] = [
  { id: "padrao", rotulo: "Padrão" },
  { id: "desativada", rotulo: "Desativada" },
  { id: "sem-produtos", rotulo: "Sem produtos" },
  { id: "sem-historico", rotulo: "Sem histórico" },
  { id: "carregando", rotulo: "Carregando" },
];

// Rota AFI-03 (nodes 16215:101334 e 16215:101965). A variante desativada é
// a MESMA rota com somenteLeitura cascateando (§Fase 3), sem arquivo novo.
// [DECISÃO §4] Não existe modo edição: cada overlay é autocontido.
export function GestorFichaAfiliado() {
  const [cenario, setCenario] = useState<CenarioDemoFicha>("padrao");

  const carregando = cenario === "carregando";
  const ficha =
    cenario === "padrao" || cenario === "carregando"
      ? obterFichaSelecionada()
      : obterFicha(cenario);

  return (
    <div className="space-y-5">
      <ConteudoFicha key={`${ficha.id}-${cenario}`} ficha={ficha} carregando={carregando} />

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

function ConteudoFicha({
  ficha,
  carregando,
}: {
  readonly ficha: AfiliadoFicha;
  readonly carregando: boolean;
}) {
  // [EM HOLD P7] Perfil fixo de administrador na ficha; o toggle de perfil
  // vive na lista, onde os dois caminhos de desativação são exercitados.
  const usuario: Usuario = { perfil: "administrador" };

  const [estadoLocal, setEstadoLocal] = useState<EstadoFiliacao | null>(null);
  const [produtos, setProdutos] = useState<readonly ProdutoVinculado[]>(ficha.produtos);
  const [editando, setEditando] = useState<ProdutoVinculado | null>(null);
  const [removendo, setRemovendo] = useState<ProdutoVinculado | null>(null);
  const [vinculando, setVinculando] = useState(false);
  const [desativando, setDesativando] = useState<AlvoDesativacao | null>(null);
  const [solicitando, setSolicitando] = useState<AlvoDesativacao | null>(null);
  const [protocoloEnviado, setProtocoloEnviado] = useState<string | null>(null);
  const [pendenteLocal, setPendenteLocal] = useState(false);

  const estado = estadoLocal ?? ficha.estado;
  // Um booleano cascateando (§Fase 3): header, KPIs, cards e rodapé.
  const somenteLeitura = estado === "desativada";
  const filiacao = { estado, temSolicitacaoPendente: pendenteLocal };

  const reativar = () => {
    setEstadoLocal(estadoAposReativacao());
    toast.success("Filiação reativada", {
      description: `${ficha.nome} pode voltar a operar como afiliado(a) nesta organização.`,
    });
  };

  const acionar = (acao: string) => {
    switch (acao) {
      case "pausar":
        setEstadoLocal("inativa");
        toast.success("Filiação pausada", {
          description: `${ficha.nome} não pode gerar novas vendas enquanto estiver pausada e será notificada. Você pode retomar quando quiser.`,
        });
        break;
      case "retomar":
        setEstadoLocal("ativa");
        toast.success("Filiação retomada", {
          description: `${ficha.nome} voltou para a base ativa e já pode voltar a registrar vendas com o código.`,
        });
        break;
      case "reativar":
        reativar();
        break;
      case "editar-filiacoes":
        // TODO: [P11] Destino definitivo pendente de HP16; na ficha as
        // edições já são autocontidas por overlay.
        toast.info("Edição por ação", {
          description:
            "Nesta ficha cada edição é feita direto na ação: comissão pelo lápis do produto e vínculos pelo Vincular produto.",
        });
        break;
      case "desativar":
        setDesativando({ nome: ficha.nome });
        break;
      case "solicitar-desativacao":
        setSolicitando({ nome: ficha.nome });
        break;
    }
  };

  const confirmarDesativacao = () => {
    setEstadoLocal("desativada");
    toast.success("Filiação desativada", {
      description: `${ficha.nome} não pode mais gerar novas vendas e os links de divulgação foram desativados. Comissões pendentes seguem devidas.`,
    });
    setDesativando(null);
  };

  const confirmarSolicitacao = () => {
    setProtocoloEnviado(criarSolicitacaoAutorizacao());
    setPendenteLocal(true);
    setSolicitando(null);
  };

  const salvarProduto = (produto: ProdutoVinculado) => {
    setProdutos((atual) => atual.map((item) => (item.id === produto.id ? produto : item)));
  };

  const confirmarRemocao = () => {
    if (!removendo) return;
    setProdutos((atual) => atual.filter((item) => item.id !== removendo.id));
    // Toast AFI-03.c1 (node 16215:102945).
    toast.success("Produto removido", {
      description: `${removendo.nome} não está mais entre os produtos vinculados de ${ficha.nome}. Os demais produtos seguem ativos.`,
    });
    setRemovendo(null);
  };

  const vincularProdutos = (novos: ProdutoVinculado[]) => {
    setProdutos((atual) => [...atual, ...novos]);
  };

  if (carregando) {
    return (
      <div className="space-y-5">
        <Skeleton className="h-36 w-full rounded-2xl" />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <KpiCard titulo="" valor="" icone={MoneyBag02Icon} carregando />
          <KpiCard titulo="" valor="" icone={MoneyBag02Icon} carregando />
          <KpiCard titulo="" valor="" icone={MoneyBag02Icon} carregando />
          <KpiCard titulo="" valor="" icone={MoneyBag02Icon} carregando />
        </div>
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
          <Skeleton className="h-72 w-full rounded-2xl" />
          <Skeleton className="h-72 w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <Card className="rounded-2xl p-5 shadow-none">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <HeaderEntidade
              nome={ficha.nome}
              badge={<BadgeFiliacao estado={estado} />}
              codigo={ficha.codigo}
              termosAceitosEm={ficha.afiliadoDesde}
              afiliadoDesde={somenteLeitura ? ficha.desativadaEm : ficha.afiliadoDesde}
              dataRotulo={somenteLeitura ? "Desativada em" : "Afiliado(a) desde"}
            />
          </div>
          <div className="flex shrink-0 items-center gap-2">
            {PODE.reativarFiliacao(filiacao) ? (
              <Button className="gap-2" onClick={reativar}>
                Reativar filiação
              </Button>
            ) : (
              <AfiliadoAcoes
                contexto="ficha"
                filiacao={filiacao}
                usuario={usuario}
                nomeAfiliado={ficha.nome}
                aoAcionar={acionar}
              />
            )}
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          titulo="Vendas realizadas"
          valor={formatarNumero(ficha.kpis.vendasRealizadas)}
          icone={ShoppingBag02Icon}
          {...propsTendencia(ficha.kpis.tendencias.vendas, somenteLeitura)}
        />
        <KpiCard
          titulo="Valor total em vendas"
          valor={formatarMoeda(ficha.kpis.valorTotalVendas)}
          icone={MoneyBag02Icon}
          {...propsTendencia(ficha.kpis.tendencias.valor, somenteLeitura)}
        />
        <KpiCard
          titulo="Comissões recebidas"
          valor={formatarMoeda(ficha.kpis.comissoesRecebidas)}
          icone={UserCheck01Icon}
          {...propsTendencia(ficha.kpis.tendencias.recebidas, somenteLeitura)}
        />
        <KpiCard
          titulo="Comissões a receber"
          valor={formatarMoeda(ficha.kpis.comissoesAReceber)}
          // [FATO §Fase 3] Comissão pendente sobrevive ao encerramento.
          complemento="Pagamento pendente"
          icone={Money01Icon}
        />
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        <ProdutosDoAfiliado
          produtos={produtos}
          somenteLeitura={somenteLeitura}
          aoEditar={setEditando}
          aoRemover={setRemovendo}
          aoVincular={() => setVinculando(true)}
        />
        <HistoricoDoAfiliado historico={ficha.historico} />
      </div>

      <ComissoesDoAfiliado />

      <EditarProdutoDrawer
        produto={editando}
        nomeAfiliado={ficha.nome}
        aoSalvar={salvarProduto}
        aoFechar={() => setEditando(null)}
      />

      {/* AFI-03.c (node 16215:103996): captura o motivo da remoção, com a
          copy corrigida de §5.4. [PENDENTE P2] O destino das comissões
          pendentes do produto removido segue com o Matheus. */}
      <DialogCapturaMotivo
        aberto={removendo !== null}
        titulo="Remover produto"
        entidade={{ titulo: removendo?.nome ?? "", subtitulo: removendo?.local }}
        motivos={listarMotivos("remocao_produto")}
        avisoTexto="A remoção vale apenas para este item. Os demais produtos vinculados seguem ativos e gerando comissão normalmente."
        tomAcao="destrutivo"
        motivoObrigatorio
        rotuloConfirmar="Remover produto"
        rotuloMotivo="Motivo da remoção (visível para o afiliado)"
        rotuloDescricao="Descreva a razão da remoção"
        placeholderDescricao="Ex.: O produto saiu do catálogo e não está mais disponível para divulgação."
        aoConfirmar={confirmarRemocao}
        aoCancelar={() => setRemovendo(null)}
      />

      <VincularProdutosModal
        aberto={vinculando}
        nomeAfiliado={ficha.nome}
        idsJaVinculados={produtos.map((produto) => produto.id)}
        aoVincular={vincularProdutos}
        aoFechar={() => setVinculando(false)}
      />

      <DesativacaoDialogs
        desativando={desativando}
        solicitando={solicitando}
        aoConfirmarDesativacao={confirmarDesativacao}
        aoConfirmarSolicitacao={confirmarSolicitacao}
        aoCancelarDesativacao={() => setDesativando(null)}
        aoCancelarSolicitacao={() => setSolicitando(null)}
      />

      <SolicitacaoEnviadaModal
        protocolo={protocoloEnviado}
        nomeAfiliado={ficha.nome}
        aoFechar={() => setProtocoloEnviado(null)}
      />
    </div>
  );
}

// [FATO §6] Na variante desativada os subtítulos deixam de ser tendência e
// viram contexto; o KpiCard trata trend como opcional.
function propsTendencia(valor: KpisFicha["tendencias"]["vendas"], somenteLeitura: boolean) {
  if (valor === null || somenteLeitura) {
    return { complemento: somenteLeitura ? "No último mês da filiação" : undefined };
  }
  return {
    tendencia: {
      rotulo: `${Math.abs(valor)}% ${valor >= 0 ? "acima" : "abaixo"} do mês anterior`,
      direcao: valor >= 0 ? ("alta" as const) : ("baixa" as const),
    },
  };
}

type FiltroItens = "todos" | "ativos" | "inativos";

function ProdutosDoAfiliado({
  produtos,
  somenteLeitura,
  aoEditar,
  aoRemover,
  aoVincular,
}: {
  readonly produtos: readonly ProdutoVinculado[];
  readonly somenteLeitura: boolean;
  readonly aoEditar: (produto: ProdutoVinculado) => void;
  readonly aoRemover: (produto: ProdutoVinculado) => void;
  readonly aoVincular: () => void;
}) {
  const [busca, setBusca] = useState("");
  const [filtro, setFiltro] = useState<FiltroItens>("todos");

  const termo = busca.trim().toLocaleLowerCase("pt-BR");
  const filtrados = produtos.filter((produto) => {
    if (filtro === "ativos" && !produto.itemAtivo) return false;
    if (filtro === "inativos" && produto.itemAtivo) return false;
    return !termo || produto.nome.toLocaleLowerCase("pt-BR").includes(termo);
  });

  const semProdutos = produtos.length === 0;

  return (
    <PainelSecao
      titulo="Produtos do afiliado"
      descricao="Produtos que este afiliado pode divulgar e as condições de cada um."
    >
      <div className="flex h-full flex-col gap-3">
        {semProdutos ? null : (
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative min-w-40 flex-1">
              <HugeiconsIcon
                icon={Search01Icon}
                size={16}
                className="text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2"
                aria-hidden="true"
              />
              <Input
                value={busca}
                placeholder="Buscar produto"
                aria-label="Buscar produto vinculado"
                className="pl-9"
                onChange={(event) => setBusca(event.target.value)}
              />
            </div>
            <FiltroPorItens filtro={filtro} aoMudar={setFiltro} />
          </div>
        )}

        {semProdutos ? (
          <Empty className="border-border h-full rounded-xl border border-solid py-8">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <HugeiconsIcon icon={ShoppingBag02Icon} size={20} aria-hidden="true" />
              </EmptyMedia>
              <EmptyTitle>Nenhum produto vinculado</EmptyTitle>
              <EmptyDescription>
                Vincule produtos para este afiliado começar a divulgar.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : filtrados.length === 0 ? (
          <p className="border-border text-muted-foreground rounded-xl border border-dashed px-4 py-6 text-center text-sm">
            Nenhum produto encontrado para a busca atual.
          </p>
        ) : (
          <div className="space-y-3">
            {filtrados.map((produto) => (
              <ProdutoVinculadoCard
                key={produto.id}
                produto={produto}
                somenteLeitura={somenteLeitura}
                aoEditar={() => aoEditar(produto)}
                aoRemover={() => aoRemover(produto)}
              />
            ))}
          </div>
        )}

        {somenteLeitura ? null : (
          <Button
            type="button"
            variant="ghost"
            className="text-primary hover:text-primary mt-auto gap-2 self-center"
            onClick={aoVincular}
          >
            <HugeiconsIcon icon={Add01Icon} size={16} aria-hidden="true" />
            Vincular produto
          </Button>
        )}
      </div>
    </PainelSecao>
  );
}

function FiltroPorItens({
  filtro,
  aoMudar,
}: {
  readonly filtro: FiltroItens;
  readonly aoMudar: (filtro: FiltroItens) => void;
}) {
  const opcoes: readonly { id: FiltroItens; rotulo: string }[] = [
    { id: "todos", rotulo: "Todos" },
    { id: "ativos", rotulo: "Ativos" },
    { id: "inativos", rotulo: "Inativos" },
  ];
  return (
    <div className="flex gap-1">
      {opcoes.map((opcao) => (
        <Button
          key={opcao.id}
          type="button"
          variant={opcao.id === filtro ? "secondary" : "ghost"}
          size="sm"
          aria-pressed={opcao.id === filtro}
          onClick={() => aoMudar(opcao.id)}
        >
          {opcao.rotulo}
        </Button>
      ))}
    </div>
  );
}

const origens: Record<EventoAtividade["origem"], string> = {
  sistema: "Sistema",
  painel_afiliado: "Painel do afiliado",
  gestor: "Gestor",
};

function HistoricoDoAfiliado({ historico }: { readonly historico: readonly EventoAtividade[] }) {
  const [busca, setBusca] = useState("");

  const termo = busca.trim().toLocaleLowerCase("pt-BR");
  const filtrados = historico.filter(
    (evento) => !termo || evento.descricao.toLocaleLowerCase("pt-BR").includes(termo)
  );

  const grupos = new Map<string, EventoAtividade[]>();
  for (const evento of filtrados) {
    const chave = evento.criadoEm.slice(0, 10);
    grupos.set(chave, [...(grupos.get(chave) ?? []), evento]);
  }

  return (
    <PainelSecao
      titulo="Histórico de atividade"
      descricao="Tudo o que aconteceu nesta filiação, do aceite ao dia de hoje."
    >
      <div className="flex h-full flex-col gap-3">
        {historico.length === 0 ? (
          <Empty className="border-border h-full rounded-xl border border-solid py-8">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <HugeiconsIcon icon={ClipboardIcon} size={20} aria-hidden="true" />
              </EmptyMedia>
              <EmptyTitle>Nenhuma atividade registrada</EmptyTitle>
              <EmptyDescription>
                As ações desta filiação aparecem aqui conforme acontecem.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <>
            <div className="relative">
              <HugeiconsIcon
                icon={Search01Icon}
                size={16}
                className="text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2"
                aria-hidden="true"
              />
              <Input
                value={busca}
                placeholder="Buscar no histórico"
                aria-label="Buscar no histórico de atividade"
                className="pl-9"
                onChange={(event) => setBusca(event.target.value)}
              />
            </div>
            {filtrados.length === 0 ? (
              <p className="border-border text-muted-foreground rounded-xl border border-dashed px-4 py-6 text-center text-sm">
                Nenhuma atividade encontrada para a busca atual.
              </p>
            ) : (
              <div className="space-y-4">
                {[...grupos.entries()].map(([chave, eventos]) => (
                  <section key={chave} className="space-y-2">
                    <h3 className="text-muted-foreground flex items-center gap-2 text-sm">
                      <HugeiconsIcon icon={Calendar03Icon} size={14} aria-hidden="true" />
                      {rotuloDoDia(eventos[0]!.criadoEm)}
                    </h3>
                    <TimelineAtividade
                      eventos={eventos.map((evento) => ({
                        id: evento.id,
                        titulo: evento.descricao,
                        descricao: evento.ip
                          ? `${origens[evento.origem]} · IP ${evento.ip}`
                          : origens[evento.origem],
                        dataHora: evento.criadoEm,
                      }))}
                    />
                  </section>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </PainelSecao>
  );
}

const colunasComissoes: readonly ColunaTabela[] = [
  { id: "pedido", titulo: "Nº pedido" },
  { id: "itens", titulo: "Itens" },
  { id: "valor", titulo: "Valor do pedido", alinhamento: "direita" },
  { id: "comissao", titulo: "Comissão", alinhamento: "direita" },
  { id: "data", titulo: "Data" },
];

const TAMANHO_PAGINA_COMISSOES = 5;

function ComissoesDoAfiliado() {
  const [pagina, setPagina] = useState(0);
  const vendas = listarVendas();

  const totalPaginas = Math.max(1, Math.ceil(vendas.length / TAMANHO_PAGINA_COMISSOES));
  const paginaAtual = Math.min(pagina, totalPaginas - 1);
  const inicio = paginaAtual * TAMANHO_PAGINA_COMISSOES;
  const linhas = vendas.slice(inicio, inicio + TAMANHO_PAGINA_COMISSOES);

  return (
    <PainelSecao
      titulo="Comissões do afiliado"
      descricao="Vendas com comissão desta filiação, da mais recente para a mais antiga."
    >
      <TabelaBase
        colunas={colunasComissoes}
        estaVazia={vendas.length === 0}
        vazio={
          <Empty className="border-border rounded-xl border border-solid py-8">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <HugeiconsIcon icon={CheckmarkCircle01Icon} size={20} aria-hidden="true" />
              </EmptyMedia>
              <EmptyTitle>Nenhuma comissão registrada</EmptyTitle>
              <EmptyDescription>As vendas com comissão aparecem aqui.</EmptyDescription>
            </EmptyHeader>
          </Empty>
        }
        rodape={
          <>
            <span>
              Mostrando {inicio + 1} a {Math.min(inicio + TAMANHO_PAGINA_COMISSOES, vendas.length)}{" "}
              de {vendas.length}
            </span>
            <span className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                disabled={paginaAtual === 0}
                onClick={() => setPagina(paginaAtual - 1)}
              >
                Anterior
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={paginaAtual >= totalPaginas - 1}
                onClick={() => setPagina(paginaAtual + 1)}
              >
                Próxima
              </Button>
            </span>
          </>
        }
      >
        {linhas.map((venda) => (
          <TableRow key={venda.id}>
            <TableCell className="font-medium">{venda.numeroPedido}</TableCell>
            <TableCell>{venda.itensQtde}</TableCell>
            <TableCell className="text-right">{formatarMoeda(venda.valorPedido)}</TableCell>
            <TableCell className="text-right font-medium">
              {formatarMoeda(venda.valorComissao)}
            </TableCell>
            <TableCell>{formatarData(venda.dataHora)}</TableCell>
          </TableRow>
        ))}
      </TabelaBase>
    </PainelSecao>
  );
}
