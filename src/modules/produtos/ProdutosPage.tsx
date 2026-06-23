import { FormEvent, useMemo, useState } from "react";

interface Produto {
  id: string;
  nome: string;
  categoria: string;
  tipo: string;
  preco: number;
  duracao: string;
  capacidade: number | null;
  status: "Ativo" | "Inativo" | "Rascunho" | "Arquivado";
  ultimaVenda: string;
  totalVendas: number;
  descricao: string;
  pontoEncontro: string;
  destaque: boolean;
}

interface ProdutoFormState {
  nome: string;
  categoria: string;
  tipo: string;
  preco: string;
  duracao: string;
  capacidade: string;
  status: Produto["status"];
  descricao: string;
  pontoEncontro: string;
  destaque: boolean;
}

type ProdutoMode = "list" | "new" | "edit";

const mockProdutos: Produto[] = [
  {
    id: "prod-001",
    nome: "Trilha Pico do Itacolomi",
    categoria: "Trilha",
    tipo: "Atividade",
    preco: 150,
    duracao: "3h",
    capacidade: 30,
    status: "Ativo",
    ultimaVenda: "Há 2 dias",
    totalVendas: 342,
    descricao: "Caminhada guiada com vista panorâmica e apoio operacional.",
    pontoEncontro: "Portaria principal do parque",
    destaque: true,
  },
  {
    id: "prod-002",
    nome: "Rapel Cachoeira Alta",
    categoria: "Aventura",
    tipo: "Atividade",
    preco: 220,
    duracao: "2h",
    capacidade: 15,
    status: "Ativo",
    ultimaVenda: "Há 1 dia",
    totalVendas: 187,
    descricao: "Experiência de rapel com equipamentos inclusos.",
    pontoEncontro: "Base operacional da cachoeira",
    destaque: true,
  },
  {
    id: "prod-003",
    nome: "Canoagem Rio das Velhas",
    categoria: "Aquático",
    tipo: "Atividade",
    preco: 180,
    duracao: "4h",
    capacidade: 20,
    status: "Ativo",
    ultimaVenda: "Há 3 dias",
    totalVendas: 256,
    descricao: "Canoagem monitorada em trecho de baixa dificuldade.",
    pontoEncontro: "Deck do Rio das Velhas",
    destaque: false,
  },
  {
    id: "prod-004",
    nome: "Trilha Cachoeira do Meio",
    categoria: "Trilha",
    tipo: "Atividade",
    preco: 90,
    duracao: "2h30",
    capacidade: 40,
    status: "Ativo",
    ultimaVenda: "Há 5 dias",
    totalVendas: 489,
    descricao: "Trilha curta com banho de cachoeira.",
    pontoEncontro: "Centro de visitantes",
    destaque: false,
  },
  {
    id: "prod-005",
    nome: "Escalada Pedra Grande",
    categoria: "Aventura",
    tipo: "Atividade",
    preco: 280,
    duracao: "5h",
    capacidade: 10,
    status: "Inativo",
    ultimaVenda: "Há 30 dias",
    totalVendas: 78,
    descricao: "Escalada assistida para grupos pequenos.",
    pontoEncontro: "Estacionamento Pedra Grande",
    destaque: false,
  },
  {
    id: "prod-006",
    nome: "Passeio de Bike Serra do Curral",
    categoria: "Ciclismo",
    tipo: "Aluguel",
    preco: 120,
    duracao: "3h",
    capacidade: 25,
    status: "Ativo",
    ultimaVenda: "Há 1 dia",
    totalVendas: 312,
    descricao: "Rota guiada com bicicleta e capacete inclusos.",
    pontoEncontro: "Loja parceira Serra do Curral",
    destaque: false,
  },
  {
    id: "prod-007",
    nome: "Observação de Aves - Parque Estadual",
    categoria: "Contemplação",
    tipo: "Atividade",
    preco: 75,
    duracao: "3h",
    capacidade: 15,
    status: "Ativo",
    ultimaVenda: "Há 7 dias",
    totalVendas: 134,
    descricao: "Saída de observação com guia especialista.",
    pontoEncontro: "Recepção do parque",
    destaque: false,
  },
  {
    id: "prod-008",
    nome: "Tirolesa Vale do Ouro",
    categoria: "Aventura",
    tipo: "Evento",
    preco: 95,
    duracao: "1h",
    capacidade: 50,
    status: "Rascunho",
    ultimaVenda: "-",
    totalVendas: 0,
    descricao: "Produto em estruturação para publicação.",
    pontoEncontro: "A definir",
    destaque: false,
  },
  {
    id: "prod-009",
    nome: "Trekking Noturno Serra da Piedade",
    categoria: "Trilha",
    tipo: "Atividade",
    preco: 160,
    duracao: "4h",
    capacidade: 20,
    status: "Ativo",
    ultimaVenda: "Há 4 dias",
    totalVendas: 201,
    descricao: "Trekking noturno com lanterna e condutor local.",
    pontoEncontro: "Praça da Serra da Piedade",
    destaque: true,
  },
  {
    id: "prod-010",
    nome: "Stand Up Paddle Lagoa Santa",
    categoria: "Aquático",
    tipo: "Atividade",
    preco: 110,
    duracao: "2h",
    capacidade: 12,
    status: "Inativo",
    ultimaVenda: "Há 45 dias",
    totalVendas: 56,
    descricao: "Aula introdutória e passeio assistido.",
    pontoEncontro: "Pier principal da lagoa",
    destaque: false,
  },
];


const categorias = ["Aventura", "Aquático", "Ciclismo", "Contemplação", "Hospedagem", "Trilha"];

const statusColors: Record<Produto["status"], { text: string; bg: string; border: string }> = {
  Ativo: { text: "#079455", bg: "#ecfdf3", border: "#abefc6" },
  Inativo: { text: "#535862", bg: "#f5f5f5", border: "#e9eaeb" },
  Rascunho: { text: "#dc6803", bg: "#fffaeb", border: "#fedf89" },
  Arquivado: { text: "#414651", bg: "#f0f1f3", border: "#d5d7da" },
};

const emptyForm: ProdutoFormState = {
  nome: "",
  categoria: "Trilha",
  tipo: "Atividade",
  preco: "",
  duracao: "",
  capacidade: "",
  status: "Rascunho",
  descricao: "",
  pontoEncontro: "",
  destaque: false,
};

const fieldClass =
  "h-[40px] w-full rounded-[8px] border border-[#e9eaeb] bg-[#fbfcfd] px-[12px] font-['Helvetica_Neue:Regular',sans-serif] text-[14px] text-[#252b37] outline-none transition-colors placeholder:text-[#a4a7ae] focus:border-[#0b5ed7] focus:bg-white";

const textAreaClass =
  "min-h-[92px] w-full resize-none rounded-[8px] border border-[#e9eaeb] bg-[#fbfcfd] px-[12px] py-[10px] font-['Helvetica_Neue:Regular',sans-serif] text-[14px] text-[#252b37] outline-none transition-colors placeholder:text-[#a4a7ae] focus:border-[#0b5ed7] focus:bg-white";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(value);
}

function formFromProduto(produto: Produto): ProdutoFormState {
  return {
    nome: produto.nome,
    categoria: produto.categoria,
    tipo: produto.tipo,
    preco: String(produto.preco),
    duracao: produto.duracao,
    capacidade: produto.capacidade === null ? "" : String(produto.capacidade),
    status: produto.status,
    descricao: produto.descricao,
    pontoEncontro: produto.pontoEncontro,
    destaque: produto.destaque,
  };
}

function buildProdutoFromForm(form: ProdutoFormState, current?: Produto): Produto {
  return {
    id: current?.id ?? `prod-${Date.now()}`,
    nome: form.nome.trim(),
    categoria: form.categoria,
    tipo: form.tipo,
    preco: Number(form.preco) || 0,
    duracao: form.duracao.trim() || "-",
    capacidade: form.capacidade.trim() ? Number(form.capacidade) || 0 : null,
    status: form.status,
    ultimaVenda: current?.ultimaVenda ?? "-",
    totalVendas: current?.totalVendas ?? 0,
    descricao: form.descricao.trim(),
    pontoEncontro: form.pontoEncontro.trim(),
    destaque: form.destaque,
  };
}

function FieldLabel({ children }: { children: string }) {
  return (
    <label className="font-['Helvetica_Neue:Regular',sans-serif] text-[13px] text-[#414651]">
      {children}
    </label>
  );
}

export function ProdutosPage() {
  const [produtos, setProdutos] = useState<Produto[]>(mockProdutos);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"todos" | Produto["status"]>("todos");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [mode, setMode] = useState<ProdutoMode>("list");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ProdutoFormState>(emptyForm);
  const [formError, setFormError] = useState("");
  const [step, setStep] = useState<0 | 1>(0);
  // tabs removed — layout now uses 2-column grid like AgendaNovaAtividade
  const [tipoCobranca, setTipoCobranca] = useState<"fixo" | "variavel" | "exclusivo">("fixo");
  const [tarifas, setTarifas] = useState<{ label: string; preco: string; minQty: string; maxQty: string }[]>([
    { label: "Adulto", preco: "", minQty: "1", maxQty: "10" },
  ]);
  const [nivelEstoque, setNivelEstoque] = useState<"produto" | "horario" | "evento" | "tarifario" | "item">("produto");
  const [qtdVagas, setQtdVagas] = useState("");
  const [recorrencia, setRecorrencia] = useState<"dias_semana" | "periodo_mes" | "datas_sazonais" | "funcionamento_continuo" | "datas_especificas">("dias_semana");
  const [diasSemana, setDiasSemana] = useState<boolean[]>([false, false, false, false, false, false, false]);
  const [opcionais, setOpcionais] = useState<{ nome: string; preco: string }[]>([]);
  const [recursos, setRecursos] = useState<{ recurso: string; quantidade: string }[]>([]);
  const [textoCurto, setTextoCurto] = useState("");
  const [tagCategoria, setTagCategoria] = useState("");

  const visibleProdutos = produtos.filter((produto) => produto.status !== "Arquivado");

  const filtered = useMemo(() => {
    let result = visibleProdutos;
    if (statusFilter !== "todos") result = result.filter((produto) => produto.status === statusFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (produto) =>
          produto.nome.toLowerCase().includes(q) ||
          produto.categoria.toLowerCase().includes(q) ||
          produto.tipo.toLowerCase().includes(q),
      );
    }
    return result;
  }, [search, statusFilter, visibleProdutos]);

  const totalProdutos = visibleProdutos.length;
  const ativos = visibleProdutos.filter((produto) => produto.status === "Ativo").length;
  const inativos = visibleProdutos.filter((produto) => produto.status === "Inativo").length;
  const rascunhos = visibleProdutos.filter((produto) => produto.status === "Rascunho").length;
  const activeProducts = visibleProdutos.filter((produto) => produto.status === "Ativo");
  const ticketMedio = activeProducts.length
    ? Math.round(activeProducts.reduce((total, produto) => total + produto.preco, 0) / activeProducts.length)
    : 0;

  const editingProduto = editingId ? produtos.find((produto) => produto.id === editingId) : undefined;
  const allFilteredSelected = filtered.length > 0 && filtered.every((produto) => selectedIds.includes(produto.id));

  const updateForm = <K extends keyof ProdutoFormState>(key: K, value: ProdutoFormState[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
    setFormError("");
  };

  const openNewProduct = () => {
    setMode("new");
    setEditingId(null);
    setForm(emptyForm);
    setFormError("");
    setOpenMenuId(null);
    setStep(0);
    // tab reset removed
    setTipoCobranca("fixo");
    setTarifas([{ label: "Adulto", preco: "", minQty: "1", maxQty: "10" }]);
    setNivelEstoque("produto");
    setQtdVagas("");
    setRecorrencia("dias_semana");
    setDiasSemana([false, false, false, false, false, false, false]);
    setOpcionais([]);
    setRecursos([]);
    setTextoCurto("");
    setTagCategoria("");
  };

  const openEditProduct = (produto: Produto) => {
    setMode("edit");
    setEditingId(produto.id);
    setForm(formFromProduto(produto));
    setFormError("");
    setOpenMenuId(null);
    setStep(1);
    // tab reset removed
    setTextoCurto(produto.descricao);
    setTagCategoria(produto.categoria);
  };

  const closeForm = () => {
    setMode("list");
    setEditingId(null);
    setForm(emptyForm);
    setFormError("");
    setStep(0);
    // tab reset removed
  };

  const saveProduto = (event: FormEvent) => {
    event.preventDefault();
    if (!form.nome.trim()) {
      setFormError("Informe o nome do produto.");
      return;
    }
    if (!form.preco.trim()) {
      setFormError("Informe o valor de referência.");
      return;
    }

    const nextProduto = buildProdutoFromForm(form, editingProduto);
    setProdutos((current) => {
      if (mode === "edit" && editingProduto) {
        return current.map((produto) => (produto.id === editingProduto.id ? nextProduto : produto));
      }
      return [nextProduto, ...current];
    });
    setSelectedIds([]);
    closeForm();
  };

  const duplicateProduto = (produto: Produto) => {
    const copy: Produto = {
      ...produto,
      id: `prod-${Date.now()}`,
      nome: `${produto.nome} (cópia)`,
      status: "Rascunho",
      ultimaVenda: "-",
      totalVendas: 0,
    };
    setProdutos((current) => [copy, ...current]);
    setOpenMenuId(null);
  };

  const archiveProduto = (produto: Produto) => {
    setProdutos((current) => {
      if (produto.status === "Rascunho" && produto.totalVendas === 0) {
        return current.filter((item) => item.id !== produto.id);
      }
      return current.map((item) => (item.id === produto.id ? { ...item, status: "Arquivado" } : item));
    });
    setSelectedIds((current) => current.filter((id) => id !== produto.id));
    setOpenMenuId(null);
  };

  const toggleSelected = (id: string) => {
    setSelectedIds((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
  };

  const toggleAllFiltered = () => {
    if (allFilteredSelected) {
      setSelectedIds((current) => current.filter((id) => !filtered.some((produto) => produto.id === id)));
      return;
    }
    setSelectedIds((current) => Array.from(new Set([...current, ...filtered.map((produto) => produto.id)])));
  };

  const applyBulkStatus = (status: Produto["status"]) => {
    setProdutos((current) =>
      current.map((produto) => (selectedIds.includes(produto.id) ? { ...produto, status } : produto)),
    );
    setSelectedIds([]);
  };

  /* ── Tipo configuration ── */
  const tipoDescriptions: Record<string, string> = {
    "Atividade": "Experiencias com horario, data e vagas",
    "Treinamento / aulas": "Cursos, workshops e capacitacoes",
    "Excursao de 1 dia": "Passeios de ida e volta no mesmo dia",
    "Excursao": "Viagens com pernoite e roteiro completo",
    "Tour privado": "Experiencias exclusivas sob demanda",
    "Evento": "Encontros, festivais e acontecimentos",
    "Ingresso": "Acesso avulso a atracoes e espacos",
    "Transporte": "Deslocamento terrestre, aereo ou aquatico",
    "Meio de hospedagem": "Hoteis, pousadas, campings e chalés",
    "Mercadorias": "Produtos fisicos para venda direta",
    "Aluguel": "Equipamentos e itens por tempo determinado",
    "Comida e Bebida": "Refeicoes, lanches e bebidas avulsas",
    "Assinatura": "Planos recorrentes e mensalidades",
    "Cartao presente": "Creditos e vouchers para presente",
    "Produto personalizado": "Tipo livre com todas as secoes disponiveis",
  };

  const tipoGroups: { title: string; tipos: string[] }[] = [
    { title: "Experiencias com tempo/vaga", tipos: ["Atividade", "Treinamento / aulas", "Excursao de 1 dia", "Excursao", "Tour privado", "Evento"] },
    { title: "Acesso e transporte", tipos: ["Ingresso", "Transporte"] },
    { title: "Hospedagem", tipos: ["Meio de hospedagem"] },
    { title: "Produtos e recorrencia", tipos: ["Mercadorias", "Aluguel", "Comida e Bebida", "Assinatura", "Cartao presente"] },
    { title: "Livre", tipos: ["Produto personalizado"] },
  ];

  const presentialTypes = ["Atividade", "Treinamento / aulas", "Excursao de 1 dia", "Excursao", "Tour privado", "Evento", "Meio de hospedagem"];
  const timedTypes = ["Atividade", "Treinamento / aulas", "Excursao de 1 dia", "Excursao", "Tour privado", "Evento", "Aluguel"];

  const getTabsForType = (tipo: string): { id: string; label: string }[] => {
    if (tipo === "Produto personalizado") {
      return [
        { id: "conteudo", label: "Conteudo" },
        { id: "estoque", label: "Estoque" },
        { id: "preco", label: "Preco" },
        { id: "disponibilidade", label: "Disponibilidade" },
        { id: "opcionais", label: "Opcionais" },
        { id: "recursos", label: "Recursos" },
        { id: "publicacao", label: "Publicacao" },
      ];
    }
    if (tipo === "Cartao presente") {
      return [
        { id: "conteudo", label: "Conteudo" },
        { id: "preco", label: "Preco" },
        { id: "publicacao", label: "Publicacao" },
      ];
    }
    if (tipo === "Mercadorias" || tipo === "Comida e Bebida") {
      return [
        { id: "conteudo", label: "Conteudo" },
        { id: "estoque", label: "Estoque" },
        { id: "preco", label: "Preco" },
        { id: "opcionais", label: "Opcionais" },
        { id: "publicacao", label: "Publicacao" },
      ];
    }
    // Experiential types and most others
    return [
      { id: "conteudo", label: "Conteudo" },
      { id: "estoque", label: "Estoque" },
      { id: "preco", label: "Preco" },
      { id: "disponibilidade", label: "Disponibilidade" },
      { id: "opcionais", label: "Opcionais" },
      { id: "recursos", label: "Recursos" },
      { id: "publicacao", label: "Publicacao" },
    ];
  };

  const getCompletenessIndicator = () => {
    const missing: string[] = [];
    if (!form.nome.trim()) missing.push("Nome do produto");
    if (!form.preco.trim()) missing.push("Valor do anuncio");
    if (!form.descricao.trim() && !textoCurto.trim()) missing.push("Descricao");
    return missing;
  };

  /* ── Screen 1: Passo 0 — tipo selection ── */
  if (mode === "new" && step === 0) {
    const canCreate = form.nome.trim().length > 0 && form.tipo.trim().length > 0;

    return (
      <div className="fixed inset-0 z-50 flex flex-col bg-[#f8fafc]">
        {/* Header */}
        <div className="flex h-[56px] shrink-0 items-center border-b border-[#e9eaeb] bg-white px-[20px]">
          <div className="flex items-center gap-[16px]">
            <img src="/src/assets/retrilhar-logo.png" alt="Retrilhar" className="h-[24px]" />
            <div className="h-[20px] w-px bg-[#e9eaeb]" />
            <p className="font-['Helvetica_Neue:Regular',sans-serif] text-[14px] text-[#252b37]">Novo produto</p>
          </div>
          <button
            type="button"
            onClick={closeForm}
            className="ml-auto flex cursor-pointer items-center gap-[6px] rounded-[8px] border border-[#e9eaeb] bg-white px-[14px] py-[8px] transition-colors hover:bg-[#f8fafc]"
          >
            <svg className="size-[14px]" fill="none" viewBox="0 0 18 18">
              <path d="M4 4l10 10M14 4L4 14" stroke="#717680" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <p className="font-['Helvetica_Neue:Regular',sans-serif] text-[13px] text-[#535862]">Fechar</p>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-[32px] py-[32px]">
          <div className="mx-auto max-w-[820px]">
            <h1 className="font-['Helvetica_Neue:Medium',sans-serif] text-[22px] text-[#181d27]">
              Que tipo de produto voce quer criar?
            </h1>
            <p className="mt-[6px] font-['Helvetica_Neue:Regular',sans-serif] text-[14px] text-[#717680]">
              O tipo define quais secoes de configuracao aparecerao.
            </p>

            <div className="mt-[28px] flex flex-col gap-[28px]">
              {tipoGroups.map((group) => (
                <div key={group.title}>
                  <p className="mb-[10px] font-['Helvetica_Neue:Medium',sans-serif] text-[13px] uppercase tracking-[0.5px] text-[#717680]">
                    {group.title}
                  </p>
                  <div className="grid grid-cols-2 gap-[10px] sm:grid-cols-3 lg:grid-cols-4">
                    {group.tipos.map((tipo) => {
                      const selected = form.tipo === tipo;
                      return (
                        <button
                          key={tipo}
                          type="button"
                          onClick={() => updateForm("tipo", tipo)}
                          className={`cursor-pointer rounded-[12px] border p-[16px] text-left transition-all ${
                            selected
                              ? "border-[#0b5ed7] bg-[#eff6ff] ring-1 ring-[#0b5ed7]"
                              : "border-[#e9eaeb] bg-white hover:border-[#0b5ed7] hover:bg-[#f8fbff]"
                          }`}
                        >
                          <p className="font-['Helvetica_Neue:Medium',sans-serif] text-[14px] text-[#252b37]">{tipo}</p>
                          <p className="mt-[4px] font-['Helvetica_Neue:Regular',sans-serif] text-[12px] leading-[1.4] text-[#717680]">
                            {tipoDescriptions[tipo] ?? ""}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Nome input */}
            <div className="mt-[32px] flex flex-col gap-[8px]">
              <FieldLabel>Nome do produto</FieldLabel>
              <input
                className={fieldClass}
                value={form.nome}
                onChange={(event) => updateForm("nome", event.target.value)}
                placeholder="Ex.: Trilha Pico do Itacolomi"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex shrink-0 items-center justify-end gap-[10px] border-t border-[#e9eaeb] bg-white px-[32px] py-[14px]">
          <button
            type="button"
            onClick={closeForm}
            className="h-[40px] rounded-[8px] border border-[#e9eaeb] bg-white px-[16px] font-['Helvetica_Neue:Regular',sans-serif] text-[14px] text-[#414651] transition-colors hover:bg-[#f8fafc]"
          >
            Cancelar
          </button>
          <button
            type="button"
            disabled={!canCreate}
            onClick={() => {
              updateForm("status", "Rascunho");
              setStep(1);
              // tab reset removed
            }}
            className="h-[40px] rounded-[8px] bg-[#0b5ed7] px-[16px] font-['Helvetica_Neue:Medium',sans-serif] text-[14px] text-white transition-colors hover:bg-[#0a4fb3] disabled:cursor-not-allowed disabled:opacity-40"
          >
            Criar rascunho
          </button>
        </div>
      </div>
    );
  }

  /* ── Screen 2: Editor — layout 2 colunas (igual AgendaNovaAtividade) ── */
  if (mode !== "list") {
    const showPontoEncontro = presentialTypes.includes(form.tipo);
    const showDuracao = timedTypes.includes(form.tipo);
    const tabs = getTabsForType(form.tipo);
    const showEstoque = tabs.some((t) => t.id === "estoque");
    const showDisponibilidade = tabs.some((t) => t.id === "disponibilidade");
    const showOpcionais = tabs.some((t) => t.id === "opcionais");
    const showRecursos = tabs.some((t) => t.id === "recursos");
    const missingFields = getCompletenessIndicator();

    return (
      <div className="fixed inset-0 z-50 flex flex-col bg-[#f8fafc]">
        {/* Header — logo + title + close */}
        <div className="flex h-[56px] shrink-0 items-center border-b border-[#e9eaeb] bg-white px-[20px]">
          <div className="flex items-center gap-[16px]">
            <img src="/src/assets/retrilhar-logo.png" alt="Retrilhar" className="h-[24px]" />
            <div className="h-[20px] w-px bg-[#e9eaeb]" />
            <p className="font-['Helvetica_Neue:Regular',sans-serif] text-[14px] text-[#252b37]">
              {form.nome.trim() || (mode === "new" ? "Novo produto" : "Editar produto")}
            </p>
          </div>
          <button
            type="button"
            onClick={closeForm}
            className="ml-auto flex cursor-pointer items-center gap-[6px] rounded-[8px] border border-[#e9eaeb] bg-white px-[14px] py-[8px] transition-colors hover:bg-[#f8fafc]"
          >
            <svg className="size-[14px]" fill="none" viewBox="0 0 18 18">
              <path d="M4 4l10 10M14 4L4 14" stroke="#717680" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <p className="font-['Helvetica_Neue:Regular',sans-serif] text-[13px] text-[#535862]">Fechar</p>
          </button>
        </div>

        {/* Content — 2-column grid */}
        <div className="flex-1 overflow-y-auto px-[32px] py-[24px]">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_400px]">
            {/* ── Main column ── */}
            <div className="flex flex-col gap-6">
              {/* Conteúdo */}
              <section className="rounded-xl border border-[#e9eaeb] bg-white shadow-sm">
                <div className="px-4 pt-4 pb-0">
                  <h2 className="font-['Helvetica_Neue:Medium',sans-serif] text-base text-[#181d27]">Conteúdo do produto</h2>
                </div>
                <div className="flex flex-col gap-4 px-4 pb-4 pt-3">
                  <div className="flex flex-col gap-[8px]">
                    <FieldLabel>Nome</FieldLabel>
                    <input className={fieldClass} value={form.nome} onChange={(e) => updateForm("nome", e.target.value)} placeholder="Ex.: Trilha Pico do Itacolomi" />
                  </div>
                  <div className="flex flex-col gap-[8px]">
                    <FieldLabel>Texto curto</FieldLabel>
                    <textarea className={textAreaClass} value={textoCurto} onChange={(e) => setTextoCurto(e.target.value)} placeholder="Resumo breve exibido na listagem de produtos." />
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="flex flex-col gap-[8px]">
                      <FieldLabel>Categoria</FieldLabel>
                      <select className={fieldClass} value={tagCategoria || form.categoria} onChange={(e) => { setTagCategoria(e.target.value); updateForm("categoria", e.target.value); }}>
                        <option value="">Selecione...</option>
                        {categorias.map((cat) => (<option key={cat} value={cat}>{cat}</option>))}
                      </select>
                    </div>
                    <div className="flex flex-col gap-[8px]">
                      <FieldLabel>Tipo de produto</FieldLabel>
                      <input value={form.tipo} readOnly disabled className={`${fieldClass} opacity-60 cursor-not-allowed`} />
                    </div>
                  </div>
                  <div className="flex flex-col gap-[8px]">
                    <FieldLabel>Descrição</FieldLabel>
                    <textarea className={textAreaClass} value={form.descricao} onChange={(e) => updateForm("descricao", e.target.value)} placeholder="Descrição completa do produto para o catálogo." />
                  </div>
                  {showPontoEncontro && (
                    <div className="flex flex-col gap-[8px]">
                      <FieldLabel>Ponto de encontro</FieldLabel>
                      <input className={fieldClass} value={form.pontoEncontro} onChange={(e) => updateForm("pontoEncontro", e.target.value)} placeholder="Ex.: Portaria principal do parque" />
                    </div>
                  )}
                </div>
              </section>

              {/* Preço e tarifário */}
              <section className="rounded-xl border border-[#e9eaeb] bg-white shadow-sm">
                <div className="px-4 pt-4 pb-0">
                  <h2 className="font-['Helvetica_Neue:Medium',sans-serif] text-base text-[#181d27]">Preço e tarifário</h2>
                </div>
                <div className="flex flex-col gap-4 px-4 pb-4 pt-3">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="flex flex-col gap-[8px]">
                      <FieldLabel>Valor do anúncio</FieldLabel>
                      <div className="relative">
                        <span className="absolute left-[12px] top-1/2 -translate-y-1/2 font-['Helvetica_Neue:Regular',sans-serif] text-[14px] text-[#717680]">R$</span>
                        <input className={`${fieldClass} pl-[36px]`} inputMode="numeric" value={form.preco} onChange={(e) => updateForm("preco", e.target.value.replace(/\D/g, ""))} placeholder="0" />
                      </div>
                    </div>
                    {showDuracao && (
                      <div className="flex flex-col gap-[8px]">
                        <FieldLabel>Duração</FieldLabel>
                        <input className={fieldClass} value={form.duracao} onChange={(e) => updateForm("duracao", e.target.value)} placeholder="Ex.: 3h" />
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col gap-[8px]">
                    <FieldLabel>Tipo de cobrança</FieldLabel>
                    <div className="flex gap-[8px]">
                      {(["fixo", "variavel", "exclusivo"] as const).map((opt) => (
                        <button key={opt} type="button" onClick={() => setTipoCobranca(opt)} className={`flex-1 cursor-pointer rounded-[8px] border px-[12px] py-[10px] text-center font-['Helvetica_Neue:Regular',sans-serif] text-[13px] transition-all ${tipoCobranca === opt ? "border-[#0b5ed7] bg-[#eff6ff] text-[#0b5ed7]" : "border-[#e9eaeb] bg-white text-[#414651] hover:bg-[#f8fafc]"}`}>
                          {opt === "fixo" ? "Fixo" : opt === "variavel" ? "Variável" : "Exclusivo"}
                        </button>
                      ))}
                    </div>
                  </div>
                  {tipoCobranca === "variavel" && (
                    <div className="flex flex-col gap-[12px]">
                      <p className="font-['Helvetica_Neue:Regular',sans-serif] text-[13px] text-[#717680]">Defina as faixas de tarifa para este produto.</p>
                      <div className="overflow-hidden rounded-[8px] border border-[#e9eaeb]">
                        <div className="flex h-[36px] items-center border-b border-[#e9eaeb] bg-[#fafafa] px-[12px]">
                          <p className="w-[160px] font-['Helvetica_Neue:Medium',sans-serif] text-[11px] uppercase tracking-[0.5px] text-[#717680]">Faixa</p>
                          <p className="w-[100px] font-['Helvetica_Neue:Medium',sans-serif] text-[11px] uppercase tracking-[0.5px] text-[#717680]">Preço</p>
                          <p className="w-[80px] font-['Helvetica_Neue:Medium',sans-serif] text-[11px] uppercase tracking-[0.5px] text-[#717680]">Min</p>
                          <p className="w-[80px] font-['Helvetica_Neue:Medium',sans-serif] text-[11px] uppercase tracking-[0.5px] text-[#717680]">Max</p>
                          <p className="w-[40px]" />
                        </div>
                        {tarifas.map((tarifa, idx) => (
                          <div key={idx} className="flex items-center border-b border-[#f5f5f5] px-[12px] py-[8px] last:border-b-0">
                            <div className="w-[160px] pr-[8px]"><input className={`${fieldClass} h-[32px] text-[13px]`} value={tarifa.label} onChange={(e) => setTarifas((prev) => prev.map((t, i) => i === idx ? { ...t, label: e.target.value } : t))} placeholder="Ex.: Adulto" /></div>
                            <div className="w-[100px] pr-[8px]"><input className={`${fieldClass} h-[32px] text-[13px]`} inputMode="numeric" value={tarifa.preco} onChange={(e) => setTarifas((prev) => prev.map((t, i) => i === idx ? { ...t, preco: e.target.value.replace(/\D/g, "") } : t))} placeholder="0" /></div>
                            <div className="w-[80px] pr-[8px]"><input className={`${fieldClass} h-[32px] text-[13px]`} inputMode="numeric" value={tarifa.minQty} onChange={(e) => setTarifas((prev) => prev.map((t, i) => i === idx ? { ...t, minQty: e.target.value.replace(/\D/g, "") } : t))} placeholder="1" /></div>
                            <div className="w-[80px] pr-[8px]"><input className={`${fieldClass} h-[32px] text-[13px]`} inputMode="numeric" value={tarifa.maxQty} onChange={(e) => setTarifas((prev) => prev.map((t, i) => i === idx ? { ...t, maxQty: e.target.value.replace(/\D/g, "") } : t))} placeholder="10" /></div>
                            <div className="flex w-[40px] justify-center"><button type="button" onClick={() => setTarifas((prev) => prev.filter((_, i) => i !== idx))} className="flex size-[24px] cursor-pointer items-center justify-center rounded-[6px] text-[#b42318] transition-colors hover:bg-[#fef3f2]"><svg className="size-[14px]" fill="none" viewBox="0 0 18 18"><path d="M4 4l10 10M14 4L4 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg></button></div>
                          </div>
                        ))}
                      </div>
                      <button type="button" onClick={() => setTarifas((prev) => [...prev, { label: "", preco: "", minQty: "1", maxQty: "10" }])} className="flex h-[36px] cursor-pointer items-center gap-[6px] self-start rounded-[8px] border border-dashed border-[#d5d7da] px-[14px] font-['Helvetica_Neue:Regular',sans-serif] text-[13px] text-[#535862] transition-colors hover:bg-[#f8fafc]">
                        <svg className="size-[14px]" fill="none" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" /></svg>
                        Adicionar faixa
                      </button>
                    </div>
                  )}
                  {tipoCobranca === "exclusivo" && (
                    <div className="rounded-[8px] border border-[#e9eaeb] bg-[#fbfcfd] px-[14px] py-[12px]">
                      <p className="font-['Helvetica_Neue:Regular',sans-serif] text-[13px] text-[#717680]">O preço será definido por item individual. Não há tabela de tarifas.</p>
                    </div>
                  )}
                </div>
              </section>

              {/* Estoque */}
              {showEstoque && (
                <section className="rounded-xl border border-[#e9eaeb] bg-white shadow-sm">
                  <div className="px-4 pt-4 pb-0">
                    <h2 className="font-['Helvetica_Neue:Medium',sans-serif] text-base text-[#181d27]">Controle de estoque</h2>
                  </div>
                  <div className="flex flex-col gap-4 px-4 pb-4 pt-3">
                    <div className="flex flex-col gap-[6px]">
                      {([
                        { value: "produto", label: "Por produto", desc: "Uma única quantidade para todo o produto" },
                        { value: "horario", label: "Por horário", desc: "Vagas controladas por cada horário agendado" },
                        { value: "evento", label: "Por evento", desc: "Vagas controladas por cada evento criado" },
                        { value: "tarifario", label: "Por tarifário", desc: "Quantidade controlada por faixa de tarifa" },
                        { value: "item", label: "Por item", desc: "Controle individual por unidade" },
                      ] as const).map((opt) => (
                        <label key={opt.value} className={`flex cursor-pointer items-start gap-[10px] rounded-[8px] border px-[14px] py-[12px] transition-all ${nivelEstoque === opt.value ? "border-[#0b5ed7] bg-[#eff6ff]" : "border-[#e9eaeb] bg-white hover:bg-[#f8fafc]"}`}>
                          <input type="radio" name="nivelEstoque" checked={nivelEstoque === opt.value} onChange={() => setNivelEstoque(opt.value)} className="mt-[2px] size-[16px] accent-[#0b5ed7]" />
                          <div>
                            <p className="font-['Helvetica_Neue:Medium',sans-serif] text-[13px] text-[#252b37]">{opt.label}</p>
                            <p className="font-['Helvetica_Neue:Regular',sans-serif] text-[12px] text-[#717680]">{opt.desc}</p>
                          </div>
                        </label>
                      ))}
                    </div>
                    {nivelEstoque === "produto" && (
                      <div className="flex flex-col gap-[8px]">
                        <FieldLabel>Quantidade de vagas</FieldLabel>
                        <input className={fieldClass} inputMode="numeric" value={qtdVagas || form.capacidade} onChange={(e) => { const v = e.target.value.replace(/\D/g, ""); setQtdVagas(v); updateForm("capacidade", v); }} placeholder="Ex.: 30" />
                      </div>
                    )}
                  </div>
                </section>
              )}

              {/* Disponibilidade */}
              {showDisponibilidade && (
                <section className="rounded-xl border border-[#e9eaeb] bg-white shadow-sm">
                  <div className="px-4 pt-4 pb-0">
                    <h2 className="font-['Helvetica_Neue:Medium',sans-serif] text-base text-[#181d27]">Disponibilidade</h2>
                  </div>
                  <div className="flex flex-col gap-4 px-4 pb-4 pt-3">
                    <div className="flex flex-col gap-[8px]">
                      <FieldLabel>Padrão de recorrência</FieldLabel>
                      <select className={fieldClass} value={recorrencia} onChange={(e) => setRecorrencia(e.target.value as typeof recorrencia)}>
                        <option value="dias_semana">Dias da semana</option>
                        <option value="periodo_mes">Período do mês</option>
                        <option value="datas_sazonais">Datas sazonais</option>
                        <option value="funcionamento_continuo">Funcionamento contínuo</option>
                        <option value="datas_especificas">Datas específicas</option>
                      </select>
                    </div>
                    {recorrencia === "dias_semana" && (
                      <div className="flex flex-col gap-[8px]">
                        <FieldLabel>Dias ativos</FieldLabel>
                        <div className="flex gap-[6px]">
                          {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((dia, idx) => (
                            <button key={dia} type="button" onClick={() => { const next = [...diasSemana]; next[idx] = !next[idx]; setDiasSemana(next); }} className={`flex h-[40px] w-[48px] cursor-pointer items-center justify-center rounded-[8px] border font-['Helvetica_Neue:Regular',sans-serif] text-[13px] transition-all ${diasSemana[idx] ? "border-[#0b5ed7] bg-[#0b5ed7] text-white" : "border-[#e9eaeb] bg-white text-[#535862] hover:bg-[#f8fafc]"}`}>
                              {dia}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                    {recorrencia === "funcionamento_continuo" && (
                      <div className="rounded-[8px] border border-[#e9eaeb] bg-[#fbfcfd] px-[14px] py-[12px]">
                        <p className="font-['Helvetica_Neue:Regular',sans-serif] text-[13px] text-[#717680]">O produto estará disponível todos os dias sem restrição.</p>
                      </div>
                    )}
                    {(recorrencia === "periodo_mes" || recorrencia === "datas_sazonais" || recorrencia === "datas_especificas") && (
                      <div className="rounded-[8px] border border-[#e9eaeb] bg-[#fbfcfd] px-[14px] py-[12px]">
                        <p className="font-['Helvetica_Neue:Regular',sans-serif] text-[13px] text-[#717680]">
                          Configuração de {recorrencia === "periodo_mes" ? "períodos mensais" : recorrencia === "datas_sazonais" ? "datas sazonais" : "datas específicas"} será detalhada na próxima iteração.
                        </p>
                      </div>
                    )}
                  </div>
                </section>
              )}

              {/* Opcionais */}
              {showOpcionais && (
                <section className="rounded-xl border border-[#e9eaeb] bg-white shadow-sm">
                  <div className="px-4 pt-4 pb-0">
                    <h2 className="font-['Helvetica_Neue:Medium',sans-serif] text-base text-[#181d27]">Opcionais</h2>
                    <p className="mt-[4px] font-['Helvetica_Neue:Regular',sans-serif] text-[13px] text-[#717680]">Itens adicionais que o cliente pode incluir na compra.</p>
                  </div>
                  <div className="flex flex-col gap-[10px] px-4 pb-4 pt-3">
                    {opcionais.map((opt, idx) => (
                      <div key={idx} className="flex items-center gap-[10px]">
                        <input className={`${fieldClass} flex-1`} value={opt.nome} onChange={(e) => setOpcionais((prev) => prev.map((o, i) => i === idx ? { nome: e.target.value, preco: o.preco } : o))} placeholder="Nome do opcional" />
                        <div className="relative w-[120px]">
                          <span className="absolute left-[12px] top-1/2 -translate-y-1/2 font-['Helvetica_Neue:Regular',sans-serif] text-[14px] text-[#717680]">R$</span>
                          <input className={`${fieldClass} pl-[36px]`} inputMode="numeric" value={opt.preco} onChange={(e) => setOpcionais((prev) => prev.map((o, i) => i === idx ? { nome: o.nome, preco: e.target.value.replace(/\D/g, "") } : o))} placeholder="0" />
                        </div>
                        <button type="button" onClick={() => setOpcionais((prev) => prev.filter((_, i) => i !== idx))} className="flex size-[32px] cursor-pointer items-center justify-center rounded-[6px] text-[#b42318] transition-colors hover:bg-[#fef3f2]"><svg className="size-[14px]" fill="none" viewBox="0 0 18 18"><path d="M4 4l10 10M14 4L4 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg></button>
                      </div>
                    ))}
                    <button type="button" onClick={() => setOpcionais((prev) => [...prev, { nome: "", preco: "" }])} className="flex h-[36px] cursor-pointer items-center gap-[6px] self-start rounded-[8px] border border-dashed border-[#d5d7da] px-[14px] font-['Helvetica_Neue:Regular',sans-serif] text-[13px] text-[#535862] transition-colors hover:bg-[#f8fafc]">
                      <svg className="size-[14px]" fill="none" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" /></svg>
                      Adicionar opcional
                    </button>
                  </div>
                </section>
              )}

              {/* Recursos */}
              {showRecursos && (
                <section className="rounded-xl border border-[#e9eaeb] bg-white shadow-sm">
                  <div className="px-4 pt-4 pb-0">
                    <h2 className="font-['Helvetica_Neue:Medium',sans-serif] text-base text-[#181d27]">Recursos</h2>
                    <p className="mt-[4px] font-['Helvetica_Neue:Regular',sans-serif] text-[13px] text-[#717680]">Equipamentos e materiais necessários para operar o produto.</p>
                  </div>
                  <div className="flex flex-col gap-[10px] px-4 pb-4 pt-3">
                    {recursos.map((rec, idx) => (
                      <div key={idx} className="flex items-center gap-[10px]">
                        <input className={`${fieldClass} flex-1`} value={rec.recurso} onChange={(e) => setRecursos((prev) => prev.map((r, i) => i === idx ? { recurso: e.target.value, quantidade: r.quantidade } : r))} placeholder="Ex.: Capacete, colete, bote" />
                        <div className="w-[100px]"><input className={fieldClass} inputMode="numeric" value={rec.quantidade} onChange={(e) => setRecursos((prev) => prev.map((r, i) => i === idx ? { recurso: r.recurso, quantidade: e.target.value.replace(/\D/g, "") } : r))} placeholder="Qtd" /></div>
                        <button type="button" onClick={() => setRecursos((prev) => prev.filter((_, i) => i !== idx))} className="flex size-[32px] cursor-pointer items-center justify-center rounded-[6px] text-[#b42318] transition-colors hover:bg-[#fef3f2]"><svg className="size-[14px]" fill="none" viewBox="0 0 18 18"><path d="M4 4l10 10M14 4L4 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg></button>
                      </div>
                    ))}
                    <button type="button" onClick={() => setRecursos((prev) => [...prev, { recurso: "", quantidade: "" }])} className="flex h-[36px] cursor-pointer items-center gap-[6px] self-start rounded-[8px] border border-dashed border-[#d5d7da] px-[14px] font-['Helvetica_Neue:Regular',sans-serif] text-[13px] text-[#535862] transition-colors hover:bg-[#f8fafc]">
                      <svg className="size-[14px]" fill="none" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" /></svg>
                      Adicionar recurso
                    </button>
                  </div>
                </section>
              )}
            </div>

            {/* ── Sidebar column ── */}
            <div className="flex flex-col gap-6">
              {/* Publicação */}
              <section className="rounded-xl border border-[#e9eaeb] bg-white shadow-sm">
                <div className="px-4 pt-4 pb-0">
                  <h2 className="font-['Helvetica_Neue:Medium',sans-serif] text-base text-[#181d27]">Publicação</h2>
                </div>
                <div className="flex flex-col gap-4 px-4 pb-4 pt-3">
                  <div className="flex flex-col gap-[8px]">
                    <FieldLabel>Status</FieldLabel>
                    <div className="flex gap-[8px]">
                      {(["Rascunho", "Ativo", "Inativo"] as Produto["status"][]).map((s) => {
                        const sc = statusColors[s];
                        return (
                          <button key={s} type="button" onClick={() => updateForm("status", s)} className={`flex-1 cursor-pointer rounded-[8px] border px-[12px] py-[10px] text-center font-['Helvetica_Neue:Regular',sans-serif] text-[13px] transition-all ${form.status === s ? "border-2" : "border-[#e9eaeb] hover:bg-[#f8fafc]"}`} style={form.status === s ? { backgroundColor: sc.bg, borderColor: sc.border, color: sc.text } : { color: "#414651" }}>
                            {s}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  <label className="flex cursor-pointer items-center gap-[10px] rounded-[8px] border border-[#e9eaeb] bg-[#fbfcfd] px-[12px] py-[10px]">
                    <input type="checkbox" checked={form.destaque} onChange={(e) => updateForm("destaque", e.target.checked)} className="size-[16px] accent-[#0b5ed7]" />
                    <span className="font-['Helvetica_Neue:Regular',sans-serif] text-[13px] text-[#414651]">Produto destaque</span>
                  </label>
                </div>
              </section>

              {/* Completude */}
              {missingFields.length > 0 && (
                <div className="rounded-[8px] border border-[#fedf89] bg-[#fffaeb] px-[14px] py-[12px]">
                  <p className="mb-[6px] font-['Helvetica_Neue:Medium',sans-serif] text-[13px] text-[#dc6803]">Campos obrigatórios pendentes</p>
                  <ul className="flex flex-col gap-[2px]">
                    {missingFields.map((field) => (<li key={field} className="font-['Helvetica_Neue:Regular',sans-serif] text-[12px] text-[#dc6803]">&bull; {field}</li>))}
                  </ul>
                </div>
              )}

              {formError && (
                <div className="rounded-[10px] border border-[#fecdca] bg-[#fef3f2] px-[14px] py-[12px] font-['Helvetica_Neue:Regular',sans-serif] text-[13px] text-[#b42318]">{formError}</div>
              )}

              {/* Próximas seções */}
              <section className="rounded-xl border border-[#e9eaeb] bg-white shadow-sm">
                <div className="px-4 pt-4 pb-0">
                  <h2 className="font-['Helvetica_Neue:Medium',sans-serif] text-base text-[#181d27]">Próximas seções</h2>
                </div>
                <div className="flex flex-col gap-[8px] px-4 pb-4 pt-3">
                  {["Políticas e termos", "Formas de pagamento", "Comunicação", "Canais de venda", "Fluxo de reserva", "Formulário de participantes"].map((section) => (
                    <div key={section} className="flex items-center justify-between rounded-[8px] bg-[#fafafa] px-[12px] py-[9px]">
                      <span className="font-['Helvetica_Neue:Regular',sans-serif] text-[13px] text-[#414651]">{section}</span>
                      <span className="rounded-full border border-[#fedf89] bg-[#fffaeb] px-[8px] py-[2px] font-['Helvetica_Neue:Regular',sans-serif] text-[11px] text-[#dc6803]">Em breve</span>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>

          {/* Salvar — bottom of scroll */}
          <div className="flex justify-end pt-[16px] pb-[8px]">
            <button type="button" onClick={(e) => saveProduto(e as unknown as FormEvent)} className="bg-[#0b5ed7] hover:bg-[#084fb7] text-white text-[13px] font-medium rounded-[8px] px-[16px] py-[8px] transition-colors cursor-pointer">
              {form.status === "Ativo" ? "Publicar produto" : "Salvar"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="absolute left-[var(--shell-offset,248px)] right-[24px] top-[112px]">
        <h1 className="font-['Helvetica_Neue:Regular',sans-serif] text-[24px] leading-[normal] text-[#0f172b]">Produtos</h1>
        <p className="mt-[4px] font-['Helvetica_Neue:Regular',sans-serif] text-[14px] text-[#535862]">
          Gerencie seu catálogo de atividades, experiências e pacotes.
        </p>
      </div>

      <div className="absolute left-[var(--shell-offset,248px)] right-[24px] top-[178px] flex flex-col gap-[24px] pb-[40px]">
      <div className="flex gap-[16px] items-start">
        {[
          { label: "Total de produtos", subtitle: "Catálogo completo", value: totalProdutos.toString(), icon: <svg className="block size-full" fill="none" viewBox="0 0 16 16"><path d="M11.333 0.667V2.667M4.667 0.667V2.667" stroke="#0B5ED7" strokeLinecap="round" strokeLinejoin="round"/><path d="M8 12.667H7.333C5.152 12.667 4.062 12.667 3.448 12.052C2.833 11.438 2.833 10.348 2.833 8.167V7.167C2.833 4.986 2.833 3.895 3.448 3.281C4.062 2.667 5.152 2.667 7.333 2.667H8.667C10.848 2.667 11.938 2.667 12.552 3.281C13.167 3.895 13.167 4.986 13.167 7.167V7.833" stroke="#0B5ED7" strokeLinecap="round" strokeLinejoin="round"/><path d="M2.833 5.333H13.167" stroke="#0B5ED7" strokeLinecap="round" strokeLinejoin="round"/><path d="M10.333 12.667C10.333 12.667 12.333 11.681 12.333 10.083C12.333 9.455 11.886 8.947 11.273 8.947C10.77 8.947 10.435 9.166 10.211 9.603C9.988 9.166 9.653 8.947 9.15 8.947C8.537 8.947 8.09 9.455 8.09 10.083C8.09 11.681 10.333 12.667 10.333 12.667Z" stroke="#0B5ED7" strokeLinecap="round" strokeLinejoin="round"/></svg> },
          { label: "Ativos", subtitle: "Produtos disponíveis", value: ativos.toString(), icon: <svg className="block size-full" fill="none" viewBox="0 0 16 16"><path d="M4 8l3 3 5-5" stroke="#0B5ED7" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/><circle cx="8" cy="8" r="6.5" stroke="#0B5ED7" strokeWidth="1.2"/></svg> },
          { label: "Inativos", subtitle: "Produtos desativados", value: inativos.toString(), icon: <svg className="block size-full" fill="none" viewBox="0 0 16 16"><path d="M4 4l8 8M12 4l-8 8" stroke="#0B5ED7" strokeWidth="1.2" strokeLinecap="round"/><circle cx="8" cy="8" r="6.5" stroke="#0B5ED7" strokeWidth="1.2"/></svg> },
          { label: "Ticket médio", subtitle: "Valor médio por produto", value: formatCurrency(ticketMedio), icon: <svg className="block size-full" fill="none" viewBox="0 0 16 16"><path d="M2.333 10.264V5.358C2.333 3.842 2.333 3.084 2.8 2.612C3.267 2.14 4.017 2.14 5.517 2.14H7.633C9.133 2.14 9.883 2.14 10.35 2.612C10.817 3.084 10.817 3.842 10.817 5.358V10.264C10.817 11.068 10.817 11.47 10.572 11.628C10.172 11.886 9.553 11.345 9.241 11.148C8.984 10.986 8.855 10.905 8.712 10.9C8.558 10.895 8.427 10.974 8.149 11.148L7.136 11.789C6.863 11.962 6.726 12.048 6.574 12.048C6.422 12.048 6.285 11.962 6.012 11.789L4.999 11.148C4.742 10.986 4.613 10.905 4.47 10.9C4.316 10.895 4.185 10.974 3.907 11.148C3.596 11.345 2.976 11.886 2.576 11.628C2.333 11.47 2.333 11.068 2.333 10.264Z" stroke="#0B5ED7" strokeLinecap="round" strokeLinejoin="round"/><path d="M8.683 4.333H5.183" stroke="#0B5ED7" strokeLinecap="round" strokeLinejoin="round"/><path d="M5.85 6.333H5.183" stroke="#0B5ED7" strokeLinecap="round" strokeLinejoin="round"/></svg> },
        ].map((card) => (
          <div key={card.label} className="bg-white drop-shadow-[0px_1px_1.5px_rgba(10,13,18,0.08),0px_1px_1px_rgba(10,13,18,0.06)] flex-[1_0_0] min-w-px relative rounded-[24px]">
            <div aria-hidden="true" className="absolute border border-[#e2e8f0] border-solid inset-0 pointer-events-none rounded-[24px]" />
            <div className="flex flex-col gap-[10px] items-start pb-[20px] pt-[20px] px-[20px] size-full">
              <div className="flex flex-1 gap-[10px] items-center w-full">
                <div className="bg-[rgba(239,246,255,0.4)] relative rounded-[10px] shrink-0 size-[32px]">
                  <div aria-hidden="true" className="absolute border border-[rgba(190,219,255,0.5)] border-solid inset-0 pointer-events-none rounded-[10px]" />
                  <div className="flex items-center justify-center size-full">
                    <div className="size-[16px]">{card.icon}</div>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-['Helvetica_Neue:Regular',sans-serif] text-[14px] text-[#314158] whitespace-nowrap">{card.label}</p>
                  <p className="font-['Helvetica_Neue:Regular',sans-serif] text-[12px] text-[#62748e]">{card.subtitle}</p>
                </div>
              </div>
              <div className="flex flex-col gap-[8px] w-full">
                <p className="font-['Helvetica_Neue:Regular',sans-serif] text-[24px] leading-[1] text-[#0f172b]">{card.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-[12px]">
        <div className="min-w-0 flex-1">
          <div className="flex h-[40px] items-center gap-[10px] rounded-[8px] border border-[#e9eaeb] bg-white px-[14px]">
            <svg className="size-[16px] shrink-0 text-[#a4a7ae]" fill="none" viewBox="0 0 20 20">
              <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.5" />
              <path d="M13.5 13.5l3.5 3.5" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Pesquisar"
              className="flex-1 bg-transparent font-['Helvetica_Neue:Regular',sans-serif] text-[14px] text-[#252b37] outline-none placeholder:text-[#a4a7ae]"
            />
          </div>
        </div>
        <div className="flex h-[40px] items-center rounded-[8px] border border-[#e9eaeb] bg-white p-[3px]">
          {[
            { label: "Todos", value: "todos" },
            { label: "Ativos", value: "Ativo" },
            { label: "Inativos", value: "Inativo" },
            { label: `Rascunhos (${rascunhos})`, value: "Rascunho" },
          ].map((filter) => (
            <button
              key={filter.value}
              type="button"
              onClick={() => setStatusFilter(filter.value as "todos" | Produto["status"])}
              className={`h-[32px] rounded-[6px] px-[12px] font-['Helvetica_Neue:Regular',sans-serif] text-[13px] transition-colors ${
                statusFilter === filter.value ? "bg-[#eff6ff] text-[#0b5ed7]" : "text-[#535862] hover:bg-[#f8fafc]"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
        <div className="relative">
          <button
            type="button"
            disabled={selectedIds.length === 0}
            onClick={() => setOpenMenuId(openMenuId === "bulk" ? null : "bulk")}
            className="flex h-[40px] cursor-pointer items-center gap-[6px] rounded-[8px] border border-[#e9eaeb] bg-white px-[16px] transition-colors hover:bg-[#f8fafc] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <svg className="size-[16px] text-[#414651]" fill="none" viewBox="0 0 24 24">
              <circle cx="5" cy="12" r="1.5" fill="currentColor" />
              <circle cx="12" cy="12" r="1.5" fill="currentColor" />
              <circle cx="19" cy="12" r="1.5" fill="currentColor" />
            </svg>
            <span className="font-['Helvetica_Neue:Regular',sans-serif] text-[14px] text-[#414651]">Ações em lote</span>
          </button>
          {openMenuId === "bulk" ? (
            <div className="absolute right-0 top-[44px] z-20 w-[180px] overflow-hidden rounded-[8px] border border-[#e9eaeb] bg-white shadow-[0_8px_24px_rgba(15,23,43,0.12)]">
              {[
                { label: "Ativar selecionados", status: "Ativo" },
                { label: "Inativar selecionados", status: "Inativo" },
                { label: "Arquivar selecionados", status: "Arquivado" },
              ].map((action) => (
                <button
                  key={action.label}
                  type="button"
                  onClick={() => applyBulkStatus(action.status as Produto["status"])}
                  className="block w-full px-[12px] py-[9px] text-left font-['Helvetica_Neue:Regular',sans-serif] text-[13px] text-[#414651] hover:bg-[#f8fafc]"
                >
                  {action.label}
                </button>
              ))}
            </div>
          ) : null}
        </div>
        <button
          type="button"
          onClick={openNewProduct}
          className="flex h-[40px] cursor-pointer items-center gap-[6px] rounded-[8px] bg-[#0b5ed7] px-[16px] transition-colors hover:bg-[#0a4fb3]"
        >
          <svg className="size-[16px] text-white" fill="none" viewBox="0 0 24 24">
            <path d="M12 5v14M5 12h14" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
          </svg>
          <span className="font-['Helvetica_Neue:Medium',sans-serif] text-[14px] text-white">Novo produto</span>
        </button>
      </div>

      <div>
        <div className="overflow-hidden rounded-[12px] border border-[#e9eaeb] bg-white">
          <div className="flex h-[44px] items-center border-b border-[#e9eaeb] bg-[#fafafa] px-[16px]">
            <div className="w-[40px] shrink-0">
              <button
                type="button"
                onClick={toggleAllFiltered}
                className={`size-[20px] rounded-[6px] border ${allFilteredSelected ? "border-[#0b5ed7] bg-[#0b5ed7]" : "border-[#d5d7da] bg-white"}`}
                aria-label="Selecionar produtos filtrados"
              >
                {allFilteredSelected ? (
                  <svg className="size-[18px] text-white" fill="none" viewBox="0 0 20 20">
                    <path d="M5 10.5l3 3 7-7" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                  </svg>
                ) : null}
              </button>
            </div>
            <p className="min-w-0 flex-1 font-['Helvetica_Neue:Medium',sans-serif] text-[12px] uppercase tracking-[0.5px] text-[#717680]">Produto</p>
            <p className="w-[100px] shrink-0 font-['Helvetica_Neue:Medium',sans-serif] text-[12px] uppercase tracking-[0.5px] text-[#717680]">Categoria</p>
            <p className="w-[100px] shrink-0 text-right font-['Helvetica_Neue:Medium',sans-serif] text-[12px] uppercase tracking-[0.5px] text-[#717680]">Preço</p>
            <p className="w-[80px] shrink-0 text-center font-['Helvetica_Neue:Medium',sans-serif] text-[12px] uppercase tracking-[0.5px] text-[#717680]">Duração</p>
            <p className="w-[100px] shrink-0 text-center font-['Helvetica_Neue:Medium',sans-serif] text-[12px] uppercase tracking-[0.5px] text-[#717680]">Capacidade</p>
            <p className="w-[100px] shrink-0 font-['Helvetica_Neue:Medium',sans-serif] text-[12px] uppercase tracking-[0.5px] text-[#717680]">Última venda</p>
            <p className="w-[84px] shrink-0 text-center font-['Helvetica_Neue:Medium',sans-serif] text-[12px] uppercase tracking-[0.5px] text-[#717680]">Status</p>
            <p className="w-[60px] shrink-0 text-center font-['Helvetica_Neue:Medium',sans-serif] text-[12px] uppercase tracking-[0.5px] text-[#717680]">Ações</p>
          </div>

          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-[8px] py-[48px]">
              <svg className="size-[32px] text-[#a4a7ae]" fill="none" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.5" />
                <path d="M16 16l4 4" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" />
              </svg>
              <p className="font-['Helvetica_Neue:Regular',sans-serif] text-[14px] text-[#717680]">Nenhum produto encontrado</p>
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setStatusFilter("todos");
                }}
                className="font-['Helvetica_Neue:Medium',sans-serif] text-[13px] text-[#0b5ed7]"
              >
                Limpar filtros
              </button>
            </div>
          ) : (
            filtered.map((produto, idx) => {
              const sc = statusColors[produto.status];
              const selected = selectedIds.includes(produto.id);
              return (
                <div
                  key={produto.id}
                  className={`relative flex h-[58px] items-center px-[16px] transition-colors hover:bg-[#f8fafc] ${idx > 0 ? "border-t border-[#f5f5f5]" : ""}`}
                >
                  <div className="w-[40px] shrink-0">
                    <button
                      type="button"
                      onClick={() => toggleSelected(produto.id)}
                      className={`flex size-[20px] items-center justify-center rounded-[6px] border ${selected ? "border-[#0b5ed7] bg-[#0b5ed7]" : "border-[#d5d7da] bg-white"}`}
                      aria-label={`Selecionar ${produto.nome}`}
                    >
                      {selected ? (
                        <svg className="size-[18px] text-white" fill="none" viewBox="0 0 20 20">
                          <path d="M5 10.5l3 3 7-7" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                        </svg>
                      ) : null}
                    </button>
                  </div>
                  <button type="button" onClick={() => openEditProduct(produto)} className="min-w-0 flex-1 text-left">
                    <p className="truncate font-['Helvetica_Neue:Regular',sans-serif] text-[14px] text-[#181d27]">{produto.nome}</p>
                    <p className="truncate font-['Helvetica_Neue:Regular',sans-serif] text-[11px] text-[#717680]">{produto.tipo}</p>
                  </button>
                  <p className="w-[100px] shrink-0 font-['Helvetica_Neue:Regular',sans-serif] text-[13px] text-[#535862]">{produto.categoria}</p>
                  <p className="w-[100px] shrink-0 text-right font-['Helvetica_Neue:Regular',sans-serif] text-[13px] text-[#181d27]">{formatCurrency(produto.preco)}</p>
                  <p className="w-[80px] shrink-0 text-center font-['Helvetica_Neue:Regular',sans-serif] text-[13px] text-[#535862]">{produto.duracao}</p>
                  <p className="w-[100px] shrink-0 text-center font-['Helvetica_Neue:Regular',sans-serif] text-[13px] text-[#535862]">{produto.capacidade === null ? "-" : `${produto.capacidade} pax`}</p>
                  <p className="w-[100px] shrink-0 font-['Helvetica_Neue:Regular',sans-serif] text-[13px] text-[#535862]">{produto.ultimaVenda}</p>
                  <div className="flex w-[84px] shrink-0 justify-center">
                    <button
                      type="button"
                      onClick={() => {
                        const nextStatus = produto.status === "Ativo" ? "Inativo" : "Ativo";
                        setProdutos((current) => current.map((item) => (item.id === produto.id ? { ...item, status: nextStatus } : item)));
                      }}
                      className="rounded-full px-[8px] py-[2px] font-['Helvetica_Neue:Regular',sans-serif] text-[12px]"
                      style={{ color: sc.text, backgroundColor: sc.bg, border: `1px solid ${sc.border}` }}
                    >
                      {produto.status}
                    </button>
                  </div>
                  <div className="flex w-[60px] shrink-0 justify-center">
                    <button
                      type="button"
                      onClick={() => setOpenMenuId(openMenuId === produto.id ? null : produto.id)}
                      className="flex size-[32px] cursor-pointer items-center justify-center rounded-[8px] border border-[#e9eaeb] bg-white transition-colors hover:bg-[#f8fafc]"
                      aria-label={`Ações de ${produto.nome}`}
                    >
                      <svg className="size-[14px]" fill="none" viewBox="0 0 16 16">
                        <circle cx="8" cy="3.5" r="1" fill="#717680" />
                        <circle cx="8" cy="8" r="1" fill="#717680" />
                        <circle cx="8" cy="12.5" r="1" fill="#717680" />
                      </svg>
                    </button>
                    {openMenuId === produto.id ? (
                      <div className="absolute right-[12px] top-[46px] z-20 w-[166px] overflow-hidden rounded-[8px] border border-[#e9eaeb] bg-white shadow-[0_8px_24px_rgba(15,23,43,0.12)]">
                        <button
                          type="button"
                          onClick={() => openEditProduct(produto)}
                          className="block w-full px-[12px] py-[9px] text-left font-['Helvetica_Neue:Regular',sans-serif] text-[13px] text-[#414651] hover:bg-[#f8fafc]"
                        >
                          Editar
                        </button>
                        <button
                          type="button"
                          onClick={() => duplicateProduto(produto)}
                          className="block w-full px-[12px] py-[9px] text-left font-['Helvetica_Neue:Regular',sans-serif] text-[13px] text-[#414651] hover:bg-[#f8fafc]"
                        >
                          Duplicar
                        </button>
                        <button
                          type="button"
                          onClick={() => archiveProduto(produto)}
                          className="block w-full px-[12px] py-[9px] text-left font-['Helvetica_Neue:Regular',sans-serif] text-[13px] text-[#b42318] hover:bg-[#fef3f2]"
                        >
                          {produto.status === "Rascunho" && produto.totalVendas === 0 ? "Excluir rascunho" : "Arquivar"}
                        </button>
                      </div>
                    ) : null}
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="mt-[16px] flex items-center justify-between px-[4px]">
          <p className="font-['Helvetica_Neue:Regular',sans-serif] text-[13px] text-[#717680]">
            {selectedIds.length === 0 ? "Nenhum produto selecionado" : `${selectedIds.length} produto(s) selecionado(s)`}
          </p>
          <div className="flex items-center gap-[8px]">
            <p className="font-['Helvetica_Neue:Regular',sans-serif] text-[13px] text-[#414651]">Página 1 de 1</p>
            <div className="flex items-center gap-[4px]">
              {["«", "‹", "›", "»"].map((arrow, i) => (
                <button
                  key={arrow}
                  type="button"
                  className={`flex size-[32px] items-center justify-center rounded-[6px] border transition-colors ${i < 2 ? "cursor-not-allowed border-[#e9eaeb] bg-white text-[#d0d5dd]" : "cursor-pointer border-[#e9eaeb] bg-white text-[#414651] hover:bg-[#f8fafc]"}`}
                >
                  <span className="font-['Helvetica_Neue:Regular',sans-serif] text-[14px]">{arrow}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      </div>
    </>
  );
}
