// Contrato de dados do módulo Gestão de Afiliados (Admin).
// Fonte única de tipos compartilhada com o backend. Nenhum componente
// das telas AFI declara interface própria de dado: tudo importa daqui.
// Referência: Etapa 01 · Fundação + Home de Afiliados, §0.2.

// Enum único. NÃO criar campo booleano "ativo" paralelo.
// [DECISÃO] Estado da filiação governa tudo. Ativo/inativo só existe
// dentro de uma filiação vinculada.
export type EstadoFiliacao =
  | "convidada" // convite enviado, ainda não aceito
  | "expirada" // convite venceu
  | "ativa" // vinculada e operando
  | "inativa" // vinculada, pausada pelo gestor
  | "desativada"; // encerrada pelo gestor

// [PENDENTE HP16] Blindagem: union discriminada.
// Quando a HP16 fechar, um dos branches é DELETADO, não reescrito.
export type TipoPendencia = "organizacao" | "produto";

// Situação exibida no selo do item de pendência (refinamento AFI-04):
// "nova" é pendente ainda não visualizada pelo gestor.
export type SituacaoPendencia = "nova" | "aguardando" | "aceita" | "recusada";

export interface PendenciaAfiliacao {
  id: string;
  tipo: TipoPendencia;
  afiliado: { nome: string; codigo: string | null };
  produto?: { nome: string; local: string }; // só quando tipo === 'produto'
  // Percentual solicitado; 0 significa comissão padrão do termo.
  comissaoSolicitada: number;
  // Ausente nos contextos que ainda não expõem negociação (home AFI-01).
  situacao?: SituacaoPendencia;
  // true quando o percentual exibido veio de contraproposta (rodada 3+).
  contraproposta?: boolean;
  criadaEm: string; // ISO 8601
}

// Produto elegível para divulgação por afiliados (drawer AFI-01.b,
// escopo "produtos selecionados" e comissão individual por produto).
export interface ProdutoDivulgavel {
  id: string;
  nome: string;
  categoria: string; // ex.: "Trilha guiada", "Aventura", "Expedição"
  modalidade: string; // ex.: "Atividade comum", "Meio período", "Atividade multi-dias"
}

// Sugestão de preenchimento do convite (drawer AFI-01.b): valores aplicados
// ao focar os campos vazios durante o teste de usabilidade.
export interface SugestaoConvite {
  nome: string;
  email: string;
  valorComissao: string; // ex.: "12%"
}

export interface ResumoAfiliados {
  totalVendas: number;
  valorComissoes: number;
  afiliadosAtivos: number;
  atualizadoEm: string;
}

export interface AfiliadoResumido {
  id: string;
  nome: string;
  codigo: string;
  vendasQtde: number;
  maiorVenda: number;
  valorComissao: number;
}

export interface VendaAfiliado {
  id: string;
  nomeAfiliado: string;
  numeroPedido: string;
  itensQtde: number;
  valorPedido: number;
  valorComissao: number;
  dataHora: string; // ISO 8601
}

// ---------------------------------------------------------------------------
// Detalhe da venda (drawer AFI-01.a). Renderização pura: a tela exibe o que
// vier daqui, na ordem que vier. Zero derivação de estado no frontend.
// ---------------------------------------------------------------------------

export interface TarifaItemPedido {
  id: string;
  nome: string;
  unidades: number;
  valorUnitario: number;
  valorTotal: number;
  valorComissao: number;
}

export interface ItemPedidoVenda {
  id: string;
  nome: string;
  // Rótulo pronto porque o item pode ser ingresso ou produto físico
  // (ex.: "4 ingressos", "2 itens"); a distinção é do backend.
  quantidadeRotulo: string;
  tarifas: TarifaItemPedido[];
  valorItem: number;
  comissaoValor: number;
  // [PENDENTE P4] Regra percentual vs valor fixo é do Matheus; o rótulo
  // chega pronto do backend até a regra fechar (ex.: "10%", "R$ 45/item").
  comissaoRotulo: string;
}

export interface EventoHistoricoVenda {
  id: string;
  titulo: string;
  descricao: string;
  dataHora: string; // ISO 8601
  // [PENDENTE P5] Os quatro parâmetros de liberação de comissão não estão
  // documentados; a ênfase visual do ponto chega pronta do backend.
  tom: "neutro" | "alerta" | "info";
}

export interface DetalheVenda {
  id: string;
  afiliado: { nome: string; codigo: string };
  pedido: {
    numero: string;
    comprador: string;
    organizacao: string;
    metodoPagamento: string;
    dataHora: string; // ISO 8601
    origemIndicacao: string;
    status: string[]; // badges exibidos como vierem
  };
  itens: ItemPedidoVenda[];
  totalComissao: number;
  totalPedido: number;
  historico: EventoHistoricoVenda[]; // ordem definida pelo backend
}

// ---------------------------------------------------------------------------
// Central de filiação (Etapa 02, AFI-04)
// ---------------------------------------------------------------------------

// [PROPOSTA] Estado da negociação é independente do estado da filiação.
// A filiação só é criada quando a negociação termina em aprovada.
export type EstadoNegociacao =
  | "aguardando_organizacao" // bola com o gestor, item acionável
  | "aguardando_afiliado" // bola com o afiliado, item somente leitura
  | "aprovada" // terminal, gera filiação
  | "recusada" // terminal reversível, ver P4
  | "expirada"; // [PENDENTE P7] prazo não definido

export type OrigemEvento = "afiliado" | "organizacao" | "sistema";

export interface EventoNegociacao {
  id: string;
  origem: OrigemEvento;
  autor: string | null; // null quando origem === 'sistema'
  descricao: string; // texto pronto vindo do backend, não montar no front
  valorPercentual?: number;
  criadoEm: string; // ISO 8601
}

// [PENDENTE P3] Este enum pode não pertencer à Solicitação.
export type MetodoRecebimento = "split" | "pix" | "conta_bancaria";

export interface Solicitacao {
  id: string;
  tipo: TipoPendencia; // 'organizacao' | 'produto', da Etapa 01
  estado: EstadoNegociacao;
  rodada: number; // 1 = pedido inicial

  afiliado: {
    id: string;
    nome: string;
    descricao: string | null; // "Criadora de conteúdo"
    handle: string | null; // "@mariaeduarda.viaja"
    termosAceitosEm: string | null;
    afiliadoDesde: string | null; // null quando ainda não é afiliado
  };

  // presente apenas quando tipo === 'produto'
  produto?: {
    id: string;
    nome: string;
    precoPorPessoa: number;
    comissaoMediaPercentual: number;
  };

  comissaoSolicitadaPercentual: number;
  // presente a partir da rodada 2
  comissaoOfertadaPercentual?: number;
  // presente a partir da rodada 3
  comissaoContrapropostaPercentual?: number;

  metodoRecebimento: MetodoRecebimento; // [PENDENTE P3] escopo
  historico: EventoNegociacao[];
  // Quantidade de anexos da negociação (faixa "Anexos (N)" do AFI-04.a);
  // ausente quando a solicitação não tem anexos.
  anexosQtde?: number;
  // null enquanto o gestor não abriu a pendência; alimenta a aba
  // "Não visualizadas" e o selo "Nova (aguardando análise)".
  visualizadaEm: string | null;
  criadaEm: string;
  atualizadaEm: string;
}

// ---------------------------------------------------------------------------
// Lista de afiliados (Etapa 03, AFI-02)
// ---------------------------------------------------------------------------

export interface AfiliadoListaItem {
  id: string;
  codigo: string | null; // null quando estado === 'convidada'
  nome: string;
  email: string;
  vendasNoMes: number; // valor monetário
  vendasQtde: number;
  estado: EstadoFiliacao;
  temSolicitacaoPendente: boolean;
}

export interface ResumoLista {
  totalAfiliados: number;
  afiliadosAtivos: number;
  vendasDosAfiliados: number; // últimos 30 dias
  comissoesAPagar: number;
}

// ---------------------------------------------------------------------------
// Ficha do afiliado (Etapa 03, AFI-03)
// ---------------------------------------------------------------------------

export interface AfiliadoFicha {
  id: string;
  nome: string;
  codigo: string;
  estado: EstadoFiliacao;
  afiliadoDesde: string;
  desativadaEm: string | null;
  kpis: KpisFicha;
  produtos: ProdutoVinculado[];
  historico: EventoAtividade[];
}

export interface KpisFicha {
  vendasRealizadas: number;
  valorTotalVendas: number;
  comissoesRecebidas: number;
  comissoesAReceber: number;
  // [FATO] Na variante desativada os subtítulos deixam de ser tendência
  // e viram contexto. O KpiCard trata trend como opcional.
  tendencias: { vendas: number | null; valor: number | null; recebidas: number | null };
}

export interface ProdutoVinculado {
  id: string;
  nome: string;
  local: string;
  thumbnailUrl: string;
  itemAtivo: boolean;
  comissao: { formato: "percentual" | "valor"; valor: number };
  // [PENDENTE P6] Rótulo divergente entre telas: "Transferência bancária"
  // na AFI-03.n, "Conta bancária" na AFI-03.m. O enum reusa o valor da
  // Etapa 02; só o rótulo aguarda a Luana.
  metodoRecebimento: MetodoRecebimento;
}

export interface EventoAtividade {
  id: string;
  descricao: string; // texto pronto do backend, não montar no front
  origem: "sistema" | "painel_afiliado" | "gestor";
  ip: string | null;
  criadoEm: string;
}

// ---------------------------------------------------------------------------
// Autorização (Etapa 03, AFI-02.b)
// ---------------------------------------------------------------------------

// [DECISÃO] Solicitação de autorização é entidade separada, não estado da
// filiação: a filiação segue ativa enquanto aguarda (aviso do AFI-02.b1).
export interface SolicitacaoAutorizacao {
  protocolo: string; // "#AUT-2026-0417"
  acaoRequisitada: "desativar_filiacao";
  afiliadoAfetado: { id: string; nome: string };
  motivo: string;
  descricao: string | null;
  solicitadoEm: string;
  estado: "aguardando" | "aprovada" | "negada" | "expirada";
}

// [DECISÃO] Recusa exige motivo e ele é visível para o afiliado.
// Três evidências convergentes: AFI-02.a, AFI-03.c e AFI-04.c.
export type EscopoMotivo = "recusa_candidatura" | "remocao_produto" | "desativacao_filiacao";

export interface MotivoRecusa {
  codigo: string;
  rotulo: string;
  escopos: EscopoMotivo[];
}
