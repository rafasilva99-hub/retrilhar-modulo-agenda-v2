// Serviço mockado da visão geral de afiliados. Simula os endpoints do
// contrato (§6 da Etapa 01) de forma síncrona e local. [PROPOSTA] Os
// endpoints ainda não foram confirmados; a assinatura das funções segue
// o formato esperado para facilitar a troca pela API real.

import {
  afiliadosListaCheia,
  afiliadosListaVazia,
  detalhesVenda,
  fichaAtiva,
  fichaDesativada,
  fichaSemHistorico,
  fichaSemProdutos,
  fichasPorAfiliado,
  motivosRecusa,
  pendenciasCheio,
  pendenciasVazio,
  produtosDivulgaveis,
  protocoloNovaSolicitacao,
  resumoAfiliadosCheio,
  resumoListaAfiliados,
  solicitacoesAutorizacao,
  solicitacoesCheio,
  solicitacoesVazio,
  sugestaoConvite,
  topAfiliadosCheio,
  vendasCheio,
  vendasVazio,
} from "@/mocks/gestor-afiliados";
import type {
  AfiliadoFicha,
  AfiliadoListaItem,
  AfiliadoResumido,
  DetalheVenda,
  EscopoMotivo,
  EstadoFiliacao,
  MotivoRecusa,
  PendenciaAfiliacao,
  ProdutoDivulgavel,
  ResumoAfiliados,
  ResumoLista,
  Solicitacao,
  SolicitacaoAutorizacao,
  SugestaoConvite,
  VendaAfiliado,
} from "@/types/api/afiliados";

// Estados de sistema da rota AFI-01 (z1 sem pendências, z2 sem vendas,
// z3 carregando), alternáveis pela barra de cenários da tela.
export type CenarioVisaoGeral = "padrao" | "sem-pendencias" | "sem-vendas" | "carregando";

// [A VALIDAR] Mapeamento das abas do filtro para o tipo da pendência:
// Solicitações referem-se à afiliação ao produto e Propostas à afiliação
// à organização, seguindo os fluxos já existentes do módulo.
export type FiltroPendencias = "todas" | "solicitacoes" | "propostas";

// GET /afiliados/resumo
export function obterResumoAfiliados(): ResumoAfiliados {
  return resumoAfiliadosCheio;
}

// GET /afiliados/pendencias?tipo=&limit=
export function listarPendencias(
  cenario: CenarioVisaoGeral = "padrao",
  filtro: FiltroPendencias = "todas",
  limite?: number
): PendenciaAfiliacao[] {
  const base = cenario === "sem-pendencias" ? pendenciasVazio : pendenciasCheio;
  const filtradas = base.filter((pendencia) => {
    if (filtro === "solicitacoes") return pendencia.tipo === "produto";
    if (filtro === "propostas") return pendencia.tipo === "organizacao";
    return true;
  });
  return limite ? filtradas.slice(0, limite) : [...filtradas];
}

export function contarPendencias(
  cenario: CenarioVisaoGeral = "padrao"
): Record<FiltroPendencias, number> {
  const base = cenario === "sem-pendencias" ? pendenciasVazio : pendenciasCheio;
  return {
    todas: base.length,
    solicitacoes: base.filter((pendencia) => pendencia.tipo === "produto").length,
    propostas: base.filter((pendencia) => pendencia.tipo === "organizacao").length,
  };
}

// GET /afiliados/top?limit=
export function listarTopAfiliados(limite = 5): AfiliadoResumido[] {
  return topAfiliadosCheio.slice(0, limite);
}

// GET /afiliados/vendas?limit=
export function listarVendas(cenario: CenarioVisaoGeral = "padrao", limite = 8): VendaAfiliado[] {
  const base = cenario === "sem-vendas" ? vendasVazio : vendasCheio;
  return base.slice(0, limite);
}

// GET /vendas/:id
export function obterDetalheVenda(id: string): DetalheVenda | null {
  return detalhesVenda.get(id) ?? null;
}

// GET /organizacao/produtos?divulgaveis=true&busca=&categoria=
export function listarProdutosDivulgaveis(busca = "", categoria = ""): ProdutoDivulgavel[] {
  const termo = busca.trim().toLocaleLowerCase("pt-BR");
  return produtosDivulgaveis.filter((produto) => {
    const bateBusca = !termo || produto.nome.toLocaleLowerCase("pt-BR").includes(termo);
    const bateCategoria = !categoria || produto.categoria === categoria;
    return bateBusca && bateCategoria;
  });
}

export function listarCategoriasProdutos(): string[] {
  return [...new Set(produtosDivulgaveis.map((produto) => produto.categoria))];
}

// Sugestão de preenchimento do convite (AFI-01.b) para o roteiro do teste.
export function obterSugestaoConvite(): SugestaoConvite {
  return sugestaoConvite;
}

// ---------------------------------------------------------------------------
// Central de filiação (Etapa 02, AFI-04)
// ---------------------------------------------------------------------------

// Estados de sistema da rota: z1 sem pendências, z3 carregando. O estado de
// busca sem resultado (z2) emerge da própria busca, não é um cenário à parte.
export type CenarioCentral = "padrao" | "sem-pendencias" | "carregando";

// Abas da Central refinada (AFI-04): recortes por situação da negociação,
// substituindo o mapeamento provisório por tipo (P8 resolvido no Figma).
export type FiltroCentral = "todas" | "nao-visualizadas" | "aguardando" | "aceitas" | "recusadas";

function estaPendente(solicitacao: Solicitacao): boolean {
  return (
    solicitacao.estado === "aguardando_organizacao" || solicitacao.estado === "aguardando_afiliado"
  );
}

function bateFiltroCentral(solicitacao: Solicitacao, filtro: FiltroCentral): boolean {
  switch (filtro) {
    case "todas":
      return true;
    case "nao-visualizadas":
      return estaPendente(solicitacao) && solicitacao.visualizadaEm === null;
    case "aguardando":
      return estaPendente(solicitacao);
    case "aceitas":
      return solicitacao.estado === "aprovada";
    case "recusadas":
      return solicitacao.estado === "recusada";
  }
}

// GET /afiliados/solicitacoes?situacao=&busca=
export function listarSolicitacoes(
  cenario: CenarioCentral = "padrao",
  filtro: FiltroCentral = "todas",
  busca = ""
): Solicitacao[] {
  const base = cenario === "sem-pendencias" ? solicitacoesVazio : solicitacoesCheio;
  const termo = busca.trim().toLocaleLowerCase("pt-BR");
  return base.filter((solicitacao) => {
    if (!bateFiltroCentral(solicitacao, filtro)) return false;
    if (!termo) return true;
    const alvo = `${solicitacao.afiliado.nome} ${solicitacao.produto?.nome ?? ""}`;
    return alvo.toLocaleLowerCase("pt-BR").includes(termo);
  });
}

// O contador da UI aparece apenas na aba "Não visualizadas" (Figma AFI-04);
// as demais contagens ficam disponíveis para evolução sem novo endpoint.
export function contarSolicitacoes(
  cenario: CenarioCentral = "padrao"
): Record<FiltroCentral, number> {
  const base = cenario === "sem-pendencias" ? solicitacoesVazio : solicitacoesCheio;
  const contar = (filtro: FiltroCentral) =>
    base.filter((item) => bateFiltroCentral(item, filtro)).length;
  return {
    todas: contar("todas"),
    "nao-visualizadas": contar("nao-visualizadas"),
    aguardando: contar("aguardando"),
    aceitas: contar("aceitas"),
    recusadas: contar("recusadas"),
  };
}

// Adapta a Solicitação ao formato do bloco ItemPendencia da Etapa 01,
// que é literalmente o mesmo componente na AFI-01 e na AFI-04.
export function pendenciaDaSolicitacao(solicitacao: Solicitacao): PendenciaAfiliacao {
  const situacao =
    solicitacao.estado === "aprovada"
      ? "aceita"
      : solicitacao.estado === "recusada"
        ? "recusada"
        : solicitacao.visualizadaEm === null
          ? "nova"
          : "aguardando";
  return {
    id: solicitacao.id,
    tipo: solicitacao.tipo,
    afiliado: { nome: solicitacao.afiliado.nome, codigo: solicitacao.afiliado.handle },
    produto: solicitacao.produto ? { nome: solicitacao.produto.nome, local: "" } : undefined,
    comissaoSolicitada:
      solicitacao.comissaoContrapropostaPercentual ?? solicitacao.comissaoSolicitadaPercentual,
    situacao,
    contraproposta: solicitacao.comissaoContrapropostaPercentual !== undefined,
    criadaEm: solicitacao.criadaEm,
  };
}

// Localiza a negociação correspondente a uma pendência da home (AFI-01),
// que espelha os mesmos casos da Central; permite abrir o drawer de
// avaliação (AFI-04.a) a partir do painel de pendências.
export function obterSolicitacaoDaPendencia(pendencia: PendenciaAfiliacao): Solicitacao | null {
  return (
    solicitacoesCheio.find(
      (solicitacao) =>
        solicitacao.tipo === pendencia.tipo &&
        solicitacao.afiliado.nome === pendencia.afiliado.nome &&
        (solicitacao.produto?.nome ?? null) === (pendencia.produto?.nome ?? null)
    ) ?? null
  );
}

// GET /afiliados/motivos?escopo=
export function listarMotivos(escopo: EscopoMotivo): MotivoRecusa[] {
  return motivosRecusa.filter((motivo) => motivo.escopos.includes(escopo));
}

// ---------------------------------------------------------------------------
// Lista de afiliados e ficha (Etapa 03, AFI-02 e AFI-03)
// ---------------------------------------------------------------------------

// Estados de sistema da AFI-02: z1 sem afiliados, z3 carregando. O z2
// (busca sem resultado) emerge da própria busca.
export type CenarioLista = "padrao" | "sem-afiliados" | "carregando";

// GET /afiliados/lista/resumo
export function obterResumoLista(cenario: CenarioLista = "padrao"): ResumoLista {
  if (cenario === "sem-afiliados") {
    return { totalAfiliados: 0, afiliadosAtivos: 0, vendasDosAfiliados: 0, comissoesAPagar: 0 };
  }
  return resumoListaAfiliados;
}

// GET /afiliados/lista?busca=&estado=
export function listarAfiliados(
  cenario: CenarioLista = "padrao",
  busca = "",
  estado: EstadoFiliacao | "todos" = "todos"
): AfiliadoListaItem[] {
  const base = cenario === "sem-afiliados" ? afiliadosListaVazia : afiliadosListaCheia;
  const termo = busca.trim().toLocaleLowerCase("pt-BR");
  return base.filter((afiliado) => {
    if (estado !== "todos" && afiliado.estado !== estado) return false;
    if (!termo) return true;
    const alvo = `${afiliado.nome} ${afiliado.email} ${afiliado.codigo ?? ""}`;
    return alvo.toLocaleLowerCase("pt-BR").includes(termo);
  });
}

// Estados de sistema da AFI-03: z1 sem produtos, z2 sem histórico,
// z3 carregando, mais a variante desativada do frame 16215:101965.
export type CenarioFicha = "ativa" | "desativada" | "sem-produtos" | "sem-historico" | "carregando";

const fichaPorCenario: Record<Exclude<CenarioFicha, "carregando">, AfiliadoFicha> = {
  ativa: fichaAtiva,
  desativada: fichaDesativada,
  "sem-produtos": fichaSemProdutos,
  "sem-historico": fichaSemHistorico,
};

// GET /afiliados/:id
export function obterFicha(cenario: CenarioFicha = "ativa"): AfiliadoFicha {
  if (cenario === "carregando") return fichaAtiva;
  return fichaPorCenario[cenario];
}

// Ficha aberta a partir da linha da AFI-02. A navegação por hash não carrega
// parâmetro, então a seleção vive neste módulo, como os demais mocks.
let afiliadoSelecionadoId: string | null = null;

export function selecionarAfiliado(id: string) {
  afiliadoSelecionadoId = id;
}

export function obterFichaSelecionada(): AfiliadoFicha {
  return (afiliadoSelecionadoId && fichasPorAfiliado.get(afiliadoSelecionadoId)) || fichaAtiva;
}

// GET /autorizacoes?afiliado=
export function obterSolicitacaoPendente(afiliadoId: string): SolicitacaoAutorizacao | null {
  return (
    solicitacoesAutorizacao.find(
      (item) => item.afiliadoAfetado.id === afiliadoId && item.estado === "aguardando"
    ) ?? null
  );
}

// POST /autorizacoes — o protocolo viria do backend; aqui é fixo do mock.
export function criarSolicitacaoAutorizacao(): string {
  return protocoloNovaSolicitacao;
}
