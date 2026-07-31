// Serviço mockado da visão geral de afiliados. Simula os endpoints do
// contrato (§6 da Etapa 01) de forma síncrona e local. [PROPOSTA] Os
// endpoints ainda não foram confirmados; a assinatura das funções segue
// o formato esperado para facilitar a troca pela API real.

import {
  detalhesVenda,
  motivosRecusa,
  pendenciasCheio,
  pendenciasVazio,
  produtosDivulgaveis,
  resumoAfiliadosCheio,
  solicitacoesCheio,
  solicitacoesVazio,
  topAfiliadosCheio,
  vendasCheio,
  vendasVazio,
} from "@/mocks/gestor-afiliados";
import type {
  AfiliadoResumido,
  DetalheVenda,
  EscopoMotivo,
  MotivoRecusa,
  PendenciaAfiliacao,
  ProdutoDivulgavel,
  ResumoAfiliados,
  Solicitacao,
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

// ---------------------------------------------------------------------------
// Central de filiação (Etapa 02, AFI-04)
// ---------------------------------------------------------------------------

// Estados de sistema da rota: z1 sem pendências, z3 carregando. O estado de
// busca sem resultado (z2) emerge da própria busca, não é um cenário à parte.
export type CenarioCentral = "padrao" | "sem-pendencias" | "carregando";

// GET /afiliados/solicitacoes?tipo=&busca=
// [PENDENTE P8] A semântica das abas segue o mapeamento por tipo usado na
// AFI-01 (Solicitações = produto, Propostas = organização) até a decisão.
export function listarSolicitacoes(
  cenario: CenarioCentral = "padrao",
  filtro: FiltroPendencias = "todas",
  busca = ""
): Solicitacao[] {
  const base = cenario === "sem-pendencias" ? solicitacoesVazio : solicitacoesCheio;
  const termo = busca.trim().toLocaleLowerCase("pt-BR");
  return base.filter((solicitacao) => {
    if (filtro === "solicitacoes" && solicitacao.tipo !== "produto") return false;
    if (filtro === "propostas" && solicitacao.tipo !== "organizacao") return false;
    if (!termo) return true;
    const alvo = `${solicitacao.afiliado.nome} ${solicitacao.produto?.nome ?? ""}`;
    return alvo.toLocaleLowerCase("pt-BR").includes(termo);
  });
}

// [PENDENTE P9] O frame mostra "Todas 2" com 7 itens; até a regra fechar,
// o contador reflete o total real de itens de cada aba.
export function contarSolicitacoes(
  cenario: CenarioCentral = "padrao"
): Record<FiltroPendencias, number> {
  const base = cenario === "sem-pendencias" ? solicitacoesVazio : solicitacoesCheio;
  return {
    todas: base.length,
    solicitacoes: base.filter((item) => item.tipo === "produto").length,
    propostas: base.filter((item) => item.tipo === "organizacao").length,
  };
}

// Adapta a Solicitação ao formato do bloco ItemPendencia da Etapa 01,
// que é literalmente o mesmo componente na AFI-01 e na AFI-04.
export function pendenciaDaSolicitacao(solicitacao: Solicitacao): PendenciaAfiliacao {
  return {
    id: solicitacao.id,
    tipo: solicitacao.tipo,
    afiliado: { nome: solicitacao.afiliado.nome, codigo: solicitacao.afiliado.handle },
    produto: solicitacao.produto ? { nome: solicitacao.produto.nome, local: "" } : undefined,
    comissaoSolicitada:
      solicitacao.comissaoContrapropostaPercentual ?? solicitacao.comissaoSolicitadaPercentual,
    criadaEm: solicitacao.criadaEm,
  };
}

// GET /afiliados/motivos?escopo=
export function listarMotivos(escopo: EscopoMotivo): MotivoRecusa[] {
  return motivosRecusa.filter((motivo) => motivo.escopos.includes(escopo));
}
