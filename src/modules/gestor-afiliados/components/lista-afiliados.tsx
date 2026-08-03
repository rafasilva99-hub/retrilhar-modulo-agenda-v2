import { useState } from "react";
import {
  Money01Icon,
  MoneyBag02Icon,
  UserCheck01Icon,
  UserGroupIcon,
} from "@hugeicons/core-free-icons";
import { toast } from "sonner";

import {
  type AcaoAfiliado,
  AfiliadoAcoes,
  BadgeFiliacao,
  BarraFiltros,
  CodigoCopiavel,
  type ColunaTabela,
  type FiltroEstadoFiliacao,
  KpiCard,
  TabelaBase,
} from "@/components/blocos";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { TableCell, TableRow } from "@/components/ui/table";
import { type Usuario } from "@/lib/afiliados/permissoes";
import { estadoAposReativacao } from "@/lib/afiliados/transicoes";
import { formatarMoeda, formatarNumero } from "@/lib/formatadores";
import { cn } from "@/lib/utils";
import type { AfiliadoListaItem, EstadoFiliacao } from "@/types/api/afiliados";

import {
  type CenarioLista,
  criarSolicitacaoAutorizacao,
  listarAfiliados,
  obterResumoLista,
  selecionarAfiliado,
} from "../services/afiliados-service";

import { DesativacaoDialogs } from "./desativacao-dialogs";
import { SolicitacaoEnviadaModal } from "./solicitacao-enviada-modal";

const cenarios: readonly { id: CenarioLista; rotulo: string }[] = [
  { id: "padrao", rotulo: "Padrão" },
  { id: "sem-afiliados", rotulo: "Sem afiliados" },
  { id: "carregando", rotulo: "Carregando" },
];

// [EM HOLD P7] O toggle de perfil exercita os dois caminhos de desativação
// enquanto a matriz definitiva não vem do Cristiano.
const perfis: readonly { id: Usuario["perfil"]; rotulo: string }[] = [
  { id: "administrador", rotulo: "Administrador" },
  { id: "gestor_afiliados", rotulo: "Gestor de afiliados" },
];

const TAMANHO_PAGINA = 5;

function irPara(pagina: string) {
  window.location.hash = `#${pagina}`;
}

interface GestorListaAfiliadosProps {
  // CTA primária da toolbar (padrão da toolbar de Produtos): a página
  // injeta o botão Convidar afiliado, dono do estado do drawer.
  readonly acaoPrincipal?: React.ReactNode;
}

// Rota AFI-02 (node 16215:98806): KPIs, busca, filtros, tabela com seleção
// e paginação, mais os overlays de desativação (AFI-02.a e AFI-02.b).
// Composta exclusivamente por blocos existentes.
export function GestorListaAfiliados({ acaoPrincipal }: GestorListaAfiliadosProps) {
  const [cenario, setCenario] = useState<CenarioLista>("padrao");
  const [perfil, setPerfil] = useState<Usuario["perfil"]>("administrador");
  const [busca, setBusca] = useState("");
  const [filtroEstado, setFiltroEstado] = useState<FiltroEstadoFiliacao>("todos");
  const [selecionados, setSelecionados] = useState<ReadonlySet<string>>(new Set());
  const [pagina, setPagina] = useState(0);
  // Mutações da sessão sobre o mock: estados e solicitações pendentes.
  const [estadosLocais, setEstadosLocais] = useState<ReadonlyMap<string, EstadoFiliacao>>(
    new Map()
  );
  const [pendentesLocais, setPendentesLocais] = useState<ReadonlySet<string>>(new Set());
  const [desativando, setDesativando] = useState<AfiliadoListaItem | null>(null);
  const [solicitando, setSolicitando] = useState<AfiliadoListaItem | null>(null);
  const [protocoloEnviado, setProtocoloEnviado] = useState<{
    protocolo: string;
    nome: string;
  } | null>(null);

  const usuario: Usuario = { perfil };
  const carregando = cenario === "carregando";
  const resumo = obterResumoLista(cenario);

  // O serviço resolve a busca; o filtro de estado é aplicado depois dos
  // ajustes locais (pausar, retomar, reativar) para o badge e o filtro
  // nunca divergirem na mesma linha.
  const afiliados = listarAfiliados(cenario, busca, "todos").map((afiliado) => ({
    ...afiliado,
    estado: estadosLocais.get(afiliado.id) ?? afiliado.estado,
    temSolicitacaoPendente: afiliado.temSolicitacaoPendente || pendentesLocais.has(afiliado.id),
  }));
  const filtrados =
    filtroEstado === "todos"
      ? afiliados
      : afiliados.filter((afiliado) => afiliado.estado === filtroEstado);

  const totalPaginas = Math.max(1, Math.ceil(filtrados.length / TAMANHO_PAGINA));
  const paginaAtual = Math.min(pagina, totalPaginas - 1);
  const inicio = paginaAtual * TAMANHO_PAGINA;
  const linhas = filtrados.slice(inicio, inicio + TAMANHO_PAGINA);

  const listaVazia = !carregando && cenario === "sem-afiliados";
  const buscaSemResultado = !carregando && !listaVazia && filtrados.length === 0;

  const alternarSelecao = (id: string) => {
    setSelecionados((atual) => {
      const proximo = new Set(atual);
      if (proximo.has(id)) proximo.delete(id);
      else proximo.add(id);
      return proximo;
    });
  };

  const todasDaPaginaSelecionadas =
    linhas.length > 0 && linhas.every((afiliado) => selecionados.has(afiliado.id));

  const alternarSelecaoDaPagina = () => {
    setSelecionados((atual) => {
      const proximo = new Set(atual);
      for (const afiliado of linhas) {
        if (todasDaPaginaSelecionadas) proximo.delete(afiliado.id);
        else proximo.add(afiliado.id);
      }
      return proximo;
    });
  };

  // Estrutura do frame AFI-02 (15998:132641): seleção no cabeçalho, código,
  // afiliado, vendas no mês, status e ações.
  const colunas: readonly ColunaTabela[] = [
    {
      id: "selecao",
      titulo: (
        <Checkbox
          checked={todasDaPaginaSelecionadas}
          aria-label="Selecionar todos da página"
          onCheckedChange={alternarSelecaoDaPagina}
        />
      ),
    },
    { id: "codigo", titulo: "Código do afiliado" },
    { id: "afiliado", titulo: "Afiliado" },
    { id: "vendas", titulo: "Vendas no mês" },
    { id: "status", titulo: "Status" },
    { id: "acoes", titulo: "" },
  ];

  const definirEstadoLocal = (id: string, estado: EstadoFiliacao) => {
    setEstadosLocais((atual) => new Map(atual).set(id, estado));
  };

  const acionar = (afiliado: AfiliadoListaItem, acao: AcaoAfiliado) => {
    switch (acao) {
      case "ver-detalhes":
        selecionarAfiliado(afiliado.id);
        irPara("gestorAfiliadosFicha");
        break;
      case "editar-filiacoes":
        // TODO: [P11] O destino definitivo de "Editar filiações" depende da
        // decisão HP16; a ficha concentra as edições autocontidas até lá.
        selecionarAfiliado(afiliado.id);
        irPara("gestorAfiliadosFicha");
        break;
      case "pausar":
        definirEstadoLocal(afiliado.id, "inativa");
        toast.success("Filiação pausada", {
          description: `${afiliado.nome} não pode gerar novas vendas enquanto estiver pausada e será notificada. Você pode retomar quando quiser.`,
        });
        break;
      case "retomar":
        definirEstadoLocal(afiliado.id, "ativa");
        toast.success("Filiação retomada", {
          description: `${afiliado.nome} voltou para a base ativa e já pode voltar a registrar vendas com o código.`,
        });
        break;
      case "reativar":
        definirEstadoLocal(afiliado.id, estadoAposReativacao());
        toast.success("Filiação reativada", {
          description: `${afiliado.nome} pode voltar a operar como afiliado(a) nesta organização.`,
        });
        break;
      case "reenviar-convite":
        toast.success("Convite reenviado", {
          description: `${afiliado.nome} receberá um novo convite por e-mail.`,
        });
        break;
      case "desativar":
        setDesativando(afiliado);
        break;
      case "solicitar-desativacao":
        setSolicitando(afiliado);
        break;
    }
  };

  const confirmarDesativacao = () => {
    if (!desativando) return;
    definirEstadoLocal(desativando.id, "desativada");
    // Toast AFI-02.a1 (node 16215:100989). [FATO] O frame diz "Afiliação
    // desativada"; padronizado em "Filiação" (§4.4).
    toast.success("Filiação desativada", {
      description: `${desativando.nome} não pode mais gerar novas vendas e os links de divulgação foram desativados. Comissões pendentes seguem devidas.`,
    });
    setDesativando(null);
  };

  const confirmarSolicitacao = () => {
    if (!solicitando) return;
    const protocolo = criarSolicitacaoAutorizacao();
    setPendentesLocais((atual) => new Set(atual).add(solicitando.id));
    setProtocoloEnviado({ protocolo, nome: solicitando.nome });
    setSolicitando(null);
  };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          titulo="Total de afiliados"
          valor={formatarNumero(resumo.totalAfiliados)}
          complemento="Nesta organização"
          icone={UserGroupIcon}
          carregando={carregando}
        />
        <KpiCard
          titulo="Afiliados ativos"
          valor={formatarNumero(resumo.afiliadosAtivos)}
          complemento="Com filiação ativa"
          icone={UserCheck01Icon}
          carregando={carregando}
        />
        <KpiCard
          titulo="Vendas dos afiliados"
          valor={formatarMoeda(resumo.vendasDosAfiliados)}
          complemento="Últimos 30 dias"
          icone={MoneyBag02Icon}
          carregando={carregando}
        />
        <KpiCard
          titulo="Comissões a pagar"
          valor={formatarMoeda(resumo.comissoesAPagar)}
          complemento="Aguardando pagamento"
          icone={Money01Icon}
          carregando={carregando}
        />
      </div>

      <BarraFiltros
        busca={busca}
        aoMudarBusca={(valor) => {
          setBusca(valor);
          setPagina(0);
        }}
        estado={filtroEstado}
        aoMudarEstado={(estado) => {
          setFiltroEstado(estado);
          setPagina(0);
        }}
        acoes={acaoPrincipal}
      />

      <TabelaBase
        colunas={colunas}
        emCartao
        carregando={carregando}
        linhasEsqueleto={5}
        estaVazia={listaVazia || buscaSemResultado}
        vazio={
          <p className="border-border text-muted-foreground rounded-xl border border-dashed px-4 py-10 text-center text-sm">
            {listaVazia
              ? "Nenhum afiliado nesta organização ainda. Convide o primeiro afiliado para começar."
              : "Nenhum afiliado encontrado. Revise a busca ou o filtro de status."}
          </p>
        }
        rodape={
          <>
            <span>
              {selecionados.size > 0
                ? `${selecionados.size} ${selecionados.size === 1 ? "afiliado selecionado" : "afiliados selecionados"}`
                : "Nenhum afiliado selecionado."}
            </span>
            {carregando || filtrados.length === 0 ? null : (
              <span className="flex items-center gap-3">
                <span className="text-foreground">
                  Página {paginaAtual + 1} de {totalPaginas}
                </span>
                <span className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-lg"
                    disabled={paginaAtual === 0}
                    onClick={() => setPagina(paginaAtual - 1)}
                  >
                    Anterior
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-lg"
                    disabled={paginaAtual >= totalPaginas - 1}
                    onClick={() => setPagina(paginaAtual + 1)}
                  >
                    Próxima
                  </Button>
                </span>
              </span>
            )}
          </>
        }
      >
        {linhas.map((afiliado) => (
          <LinhaAfiliado
            key={afiliado.id}
            afiliado={afiliado}
            usuario={usuario}
            selecionado={selecionados.has(afiliado.id)}
            aoAlternarSelecao={() => alternarSelecao(afiliado.id)}
            aoAcionar={(acao) => acionar(afiliado, acao)}
            aoAbrir={() => acionar(afiliado, "ver-detalhes")}
          />
        ))}
      </TabelaBase>

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
        <span className="bg-border mx-1 h-4 w-px" aria-hidden="true" />
        <span className="font-medium">Perfil:</span>
        {perfis.map((opcao) => (
          <Button
            key={opcao.id}
            type="button"
            variant={opcao.id === perfil ? "secondary" : "ghost"}
            size="sm"
            className={cn("h-7 rounded-lg px-2.5 text-xs", opcao.id === perfil && "font-medium")}
            aria-pressed={opcao.id === perfil}
            onClick={() => setPerfil(opcao.id)}
          >
            {opcao.rotulo}
          </Button>
        ))}
      </div>

      <DesativacaoDialogs
        desativando={desativando}
        solicitando={solicitando}
        aoConfirmarDesativacao={confirmarDesativacao}
        aoConfirmarSolicitacao={confirmarSolicitacao}
        aoCancelarDesativacao={() => setDesativando(null)}
        aoCancelarSolicitacao={() => setSolicitando(null)}
      />

      <SolicitacaoEnviadaModal
        protocolo={protocoloEnviado?.protocolo ?? null}
        nomeAfiliado={protocoloEnviado?.nome ?? ""}
        aoFechar={() => setProtocoloEnviado(null)}
      />
    </div>
  );
}

function LinhaAfiliado({
  afiliado,
  usuario,
  selecionado,
  aoAlternarSelecao,
  aoAcionar,
  aoAbrir,
}: {
  readonly afiliado: AfiliadoListaItem;
  readonly usuario: Usuario;
  readonly selecionado: boolean;
  readonly aoAlternarSelecao: () => void;
  readonly aoAcionar: (acao: AcaoAfiliado) => void;
  readonly aoAbrir: () => void;
}) {
  return (
    <TableRow>
      <TableCell className="w-10 py-3">
        <Checkbox
          checked={selecionado}
          aria-label={`Selecionar ${afiliado.nome}`}
          onCheckedChange={aoAlternarSelecao}
        />
      </TableCell>
      <TableCell className="py-3">
        <CodigoDaLinha afiliado={afiliado} />
      </TableCell>
      <TableCell className="py-3">
        <button type="button" className="text-left" onClick={aoAbrir}>
          <span className="block max-w-64 truncate font-medium">{afiliado.nome}</span>
          <span className="text-muted-foreground block max-w-64 truncate text-xs">
            {afiliado.email}
          </span>
        </button>
      </TableCell>
      <TableCell className="py-3">
        <span className="block font-medium">{formatarMoeda(afiliado.vendasNoMes)}</span>
        <span className="text-muted-foreground block text-xs">
          {afiliado.vendasQtde} {afiliado.vendasQtde === 1 ? "venda" : "vendas"}
        </span>
      </TableCell>
      <TableCell className="py-3">
        <BadgeFiliacao estado={afiliado.estado} />
      </TableCell>
      <TableCell className="w-12 py-3 text-right">
        <AfiliadoAcoes
          contexto="linha"
          filiacao={{
            estado: afiliado.estado,
            temSolicitacaoPendente: afiliado.temSolicitacaoPendente,
          }}
          usuario={usuario}
          nomeAfiliado={afiliado.nome}
          aoAcionar={aoAcionar}
        />
      </TableCell>
    </TableRow>
  );
}

// Célula de código do frame 15998:132641: chip copiável só na filiação
// ativa; pausada e desativada exibem o chip neutro sem ação de cópia
// (links de divulgação suspensos); código nulo usa hífen simples, não
// travessão, conforme a regra de copy.
function CodigoDaLinha({ afiliado }: { readonly afiliado: AfiliadoListaItem }) {
  if (!afiliado.codigo) {
    return (
      <span className="text-muted-foreground" aria-label="Sem código">
        -
      </span>
    );
  }
  if (afiliado.estado === "ativa") {
    return <CodigoCopiavel codigo={afiliado.codigo} />;
  }
  return (
    <span className="border-border bg-muted/40 text-muted-foreground inline-flex items-center rounded-md border px-2 py-0.5 font-mono text-xs font-medium">
      {afiliado.codigo}
    </span>
  );
}
