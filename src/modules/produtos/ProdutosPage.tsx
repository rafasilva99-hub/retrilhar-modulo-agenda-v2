import { FormEvent, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { ArrowDown01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Switch } from "@/components/ui/switch";

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

export function ProdutosPage() {
  const [produtos, setProdutos] = useState<Produto[]>(mockProdutos);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"todos" | Produto["status"]>("todos");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [filtersDrawerOpen, setFiltersDrawerOpen] = useState(false);
  const [mode, setMode] = useState<ProdutoMode>("list");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ProdutoFormState>(emptyForm);
  const [formError, setFormError] = useState("");
  const [tipoDropdownOpen, setTipoDropdownOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("info-basicas");
  const [tipoCobranca, setTipoCobranca] = useState<"variavel" | "fixo" | "exclusivo_item" | "exclusivo_carrinho">("variavel");
  const [valorUnicoProduto, setValorUnicoProduto] = useState("");
  const [proxyPagamento, setProxyPagamento] = useState("");
  const [proxyDropdownOpen, setProxyDropdownOpen] = useState(false);
  const [parcelasCartao, setParcelasCartao] = useState("");
  const [pagProxyPagamento, setPagProxyPagamento] = useState("");
  const [pagProxyDropdownOpen, setPagProxyDropdownOpen] = useState(false);
  const [pagFormasAceitas, setPagFormasAceitas] = useState<Set<string>>(new Set());
  const [pagParcelas, setPagParcelas] = useState("");
  const [modeloTarifario, setModeloTarifario] = useState<"tipo" | "lote" | "dia">("tipo");
  const [diaRegras, setDiaRegras] = useState<{ tipo: string; preco: string }[]>([]);
  const [diaTipoSelecionado, setDiaTipoSelecionado] = useState("");
  const [diaPrecoInput, setDiaPrecoInput] = useState("");
  const [diaTipoDropdownOpen, setDiaTipoDropdownOpen] = useState(false);
  const [diaPersonalizadoDias, setDiaPersonalizadoDias] = useState<boolean[]>([false, false, false, false, false, false, false]);
  const [possuiEntrada, setPossuiEntrada] = useState(false);
  const [entradaTipo, setEntradaTipo] = useState<"porcentagem" | "valor_fixo">("porcentagem");
  const [permitirOverbooking, setPermitirOverbooking] = useState(false);
  const [entradaValor, setEntradaValor] = useState("");
  const [entradaDataLimite, setEntradaDataLimite] = useState("");
  const [tarifas, setTarifas] = useState<{ label: string; preco: string; idadeIni: string; idadeFim: string; minQty: string; maxQty: string }[]>([
    { label: "", preco: "", idadeIni: "", idadeFim: "", minQty: "", maxQty: "" },
  ]);
  const [lotes, setLotes] = useState<{ label: string; de: string; ate: string; preco: string }[]>([
    { label: "", de: "", ate: "", preco: "" },
  ]);
  const [niveisEstoque, setNiveisEstoque] = useState<Set<string>>(new Set(["produto"]));
  const [estoqueQtd, setEstoqueQtd] = useState<Record<string, string>>({ produto: "40", horario: "20", evento: "0", tarifario: "0", item: "0" });
  const [diasSemana, setDiasSemana] = useState<boolean[]>([false, false, false, false, false, false, false]);
  const [opcionais, setOpcionais] = useState<{ nome: string; preco: string }[]>([]);
  const [textoCurto, setTextoCurto] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [tagSearch, setTagSearch] = useState("");
  const [tagDropdownOpen, setTagDropdownOpen] = useState(false);
  const [customTags, setCustomTags] = useState<string[]>([]);
  const [linkMapa, setLinkMapa] = useState("");
  const [locaisAtivos, setLocaisAtivos] = useState<Set<string>>(new Set(["Loja online"]));
  const [locaisDropdownOpen, setLocaisDropdownOpen] = useState(false);
  const [duracaoValor, setDuracaoValor] = useState("");
  const [duracaoUnidade, setDuracaoUnidade] = useState("horas");
  const [antecedenciaVenda, setAntecedenciaVenda] = useState("");
  const [recorrenciaAtiva, setRecorrenciaAtiva] = useState(true);
  const [recorrenciaTipo, setRecorrenciaTipo] = useState<"diario" | "semanal" | "mensal" | "personalizado">("diario");
  const [recorrenciaIntervalo, setRecorrenciaIntervalo] = useState("1");
  const [multiplosHorarios] = useState(true);
  const [saidas, setSaidas] = useState<{ horario: string; vagas: string; qtdMinima: string; equipe: string }[]>([{ horario: "", vagas: "", qtdMinima: "", equipe: "" }]);
  const [saidaDrawerIdx, setSaidaDrawerIdx] = useState<number | null>(null);
  const [tarifaDrawerIdx, setTarifaDrawerIdx] = useState<number | null>(null);
  const [tarifaDraft, setTarifaDraft] = useState<{ label: string; preco: string; idadeIni: string; idadeFim: string; minQty: string; maxQty: string } | null>(null);
  const [loteDrawerIdx, setLoteDrawerIdx] = useState<number | null>(null);
  const [loteDraft, setLoteDraft] = useState<{ label: string; de: string; ate: string; preco: string } | null>(null);
  const [seoTitulo, setSeoTitulo] = useState("");
  const [seoDescricao, setSeoDescricao] = useState("");

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
    setTipoDropdownOpen(false);
    setActiveSection("info-basicas");
    setTipoCobranca("fixo");
    setTarifas([{ label: "", preco: "", idadeIni: "", idadeFim: "", minQty: "", maxQty: "" }]);
    setNiveisEstoque(new Set(["produto"]));
    setEstoqueQtd({ produto: "", horario: "", evento: "", tarifario: "", item: "" });
    setRecorrenciaAtiva(true);
    setRecorrenciaTipo("diario");
    setRecorrenciaIntervalo("1");
    setDiasSemana([false, false, false, false, false, false, false]);
    setOpcionais([]);
    setTextoCurto("");
  };

  const openEditProduct = (produto: Produto) => {
    setMode("edit");
    setEditingId(produto.id);
    setForm(formFromProduto(produto));
    setFormError("");
    setOpenMenuId(null);
    setTipoDropdownOpen(false);
    setActiveSection("info-basicas");
    setTextoCurto(produto.descricao);
  };

  const closeForm = () => {
    setMode("list");
    setEditingId(null);
    setForm(emptyForm);
    setFormError("");
    setTipoDropdownOpen(false);
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
  const tipoLabels: Record<string, string> = {
    "Atividade": "Atividade",
    "Treinamento / aulas": "Treinamento / aulas",
    "Excursao de 1 dia": "Excursão de 1 dia",
    "Excursao": "Excursão",
    "Tour privado": "Tour privado",
    "Evento": "Evento",
    "Ingresso": "Ingresso",
    "Transporte": "Transporte",
    "Meio de hospedagem": "Meio de hospedagem",
    "Mercadorias": "Mercadorias",
    "Aluguel": "Aluguel",
    "Comida e Bebida": "Comida e Bebida",
    "Assinatura": "Assinatura",
    "Cartao presente": "Cartão presente",
    "Produto personalizado": "Produto personalizado",
  };

  const tipoDescriptions: Record<string, string> = {
    "Atividade": "Experiências com horário, data e vagas",
    "Treinamento / aulas": "Cursos, workshops e capacitações",
    "Excursao de 1 dia": "Passeios de ida e volta no mesmo dia",
    "Excursao": "Viagens com pernoite e roteiro completo",
    "Tour privado": "Experiências exclusivas sob demanda",
    "Evento": "Encontros, festivais e acontecimentos",
    "Ingresso": "Acesso avulso a atrações e espaços",
    "Transporte": "Deslocamento terrestre, aéreo ou aquático",
    "Meio de hospedagem": "Hotéis, pousadas, campings e chalés",
    "Mercadorias": "Produtos físicos para venda direta",
    "Aluguel": "Equipamentos e itens por tempo determinado",
    "Comida e Bebida": "Refeições, lanches e bebidas avulsas",
    "Assinatura": "Planos recorrentes e mensalidades",
    "Cartao presente": "Créditos e vouchers para presente",
    "Produto personalizado": "Tipo livre com todas as seções disponíveis",
  };

  const tipoGroups: { title: string; tipos: string[] }[] = [
    { title: "Experiências com tempo/vaga", tipos: ["Atividade", "Treinamento / aulas", "Excursao de 1 dia", "Excursao", "Tour privado", "Evento"] },
    { title: "Acesso e transporte", tipos: ["Ingresso", "Transporte"] },
    { title: "Hospedagem", tipos: ["Meio de hospedagem"] },
    { title: "Produtos e recorrência", tipos: ["Mercadorias", "Aluguel", "Comida e Bebida", "Assinatura", "Cartao presente"] },
    { title: "Livre", tipos: ["Produto personalizado"] },
  ];

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

  /* ── Sidebar nav items ── */
  const sidebarGroups = [
    {
      title: "Operação",
      items: [
        { id: "info-basicas", label: "Informações básicas", icon: ["M14.5 17.5V7.5H7.50004C5.14304 7.5 3.96454 7.5 3.23231 8.23222C2.50007 8.96445 2.50006 10.1429 2.50004 12.5L2.5 16.5C2.49998 18.857 2.49997 20.0355 3.2322 20.7678C3.96443 21.5 5.14296 21.5 7.5 21.5H10.5C12.3856 21.5 13.3284 21.5 13.9142 20.9142C14.5 20.3284 14.5 19.3856 14.5 17.5Z", "M14.4999 16.5H16.4999C18.8569 16.5 20.0354 16.5 20.7676 15.7678C21.4999 15.0355 21.4999 13.857 21.4999 11.5V7.5C21.4999 5.14298 21.4999 3.96447 20.7676 3.23223C20.0354 2.5 18.8569 2.5 16.4999 2.5H9.5L9.50014 7.5", "M5.5 12.5H9M5.5 16.5H11.5", "M9.5 2.5L14.5 7.5"] },
        { id: "recorrencia", label: "Recorrência e horários", icon: ["M8.37574 3C8.16183 3.07993 7.95146 3.16712 7.74492 3.26126M20.7177 16.3011C20.8199 16.0799 20.9141 15.8542 21 15.6245M18.4988 19.3647C18.6705 19.2044 18.8365 19.0381 18.9963 18.866M15.2689 21.3723C15.463 21.2991 15.6541 21.22 15.8421 21.1351M12.156 21.9939C11.9251 22.0019 11.6926 22.0019 11.4616 21.9939M7.78731 21.1404C7.96811 21.2217 8.15183 21.2978 8.33825 21.3683M4.67255 18.9208C4.80924 19.0657 4.95029 19.2064 5.0955 19.3428M2.6327 15.6645C2.70758 15.8622 2.78867 16.0569 2.87572 16.2483M2.00497 12.5053C1.99848 12.2972 1.9985 12.0878 2.00497 11.8794M2.62545 8.73714C2.69901 8.54165 2.77864 8.34913 2.8641 8.1598M4.65602 5.47923C4.80068 5.32514 4.95025 5.17573 5.1045 5.03124", "M13.5 12C13.5 12.8284 12.8284 13.5 12 13.5C11.1716 13.5 10.5 12.8284 10.5 12C10.5 11.1716 11.1716 10.5 12 10.5M13.5 12C13.5 11.1716 12.8284 10.5 12 10.5M13.5 12H16M12 10.5V6", "M22 12C22 6.47715 17.5228 2 12 2"] },
        { id: "estoque", label: "Estoque e vagas", icon: ["M17.8043 4.06866L13.6094 2.45779C12.8147 2.1526 12.4173 2 12 2C11.5827 2 11.1853 2.1526 10.3906 2.45779L6.19572 4.06866C4.06524 4.88678 3 5.29585 3 6C3 6.70415 4.06524 7.11322 6.19573 7.93134L10.3906 9.54221C11.1853 9.8474 11.5827 10 12 10C12.4173 10 12.8147 9.8474 13.6094 9.54221L17.8043 7.93134C19.9348 7.11322 21 6.70415 21 6C21 5.29585 19.9348 4.88678 17.8043 4.06866Z", "M21 6V18C21 18.7042 19.9348 19.1132 17.8043 19.9313L13.6094 21.5422C12.8147 21.8474 12.4173 22 12 22C11.5827 22 11.1853 21.8474 10.3906 21.5422L6.19573 19.9313C4.06524 19.1132 3 18.7042 3 18V6", "M12 10V22", "M16.5 4L7 8V10.5", "M5.5 16.092V15.2555C5.5 14.5602 5.5 14.2125 5.72475 14.0621C5.94951 13.9116 6.26431 14.0486 6.89392 14.3225L8.39392 14.975C8.68787 15.1029 8.83484 15.1668 8.91742 15.294C9 15.4211 9 15.5834 9 15.908V16.7445C9 17.4398 9 17.7875 8.77525 17.9379C8.55049 18.0884 8.23568 17.9514 7.60608 17.6775L6.10608 17.025C5.81213 16.8971 5.66516 16.8332 5.58258 16.706C5.5 16.5789 5.5 16.4166 5.5 16.092Z"] },
      ],
    },
    {
      title: "Comercial",
      items: [
        { id: "preco-tarifa", label: "Preços e tarifas", icon: ["M2.01758 7.00221C4.21715 7.00221 6.00025 5.2191 6.00025 3.01953", "M18 3.01953V3.11144C18 5.26025 19.742 7.00221 21.8908 7.00221", "M2.01738 13.019C4.21681 13.0192 6 14.8005 6 17C4.44655 16.9532 3.51998 16.7799 2.87868 16.1386C2.23761 15.4976 2.06425 14.5714 2.01738 13.019ZM2.01738 13.019C2.01728 13.019 2.01747 13.019 2.01738 13.019ZM2.01738 13.019C2 12.4436 2 11.7822 2 11.0173V9C2 6.17157 2 4.75736 2.87868 3.87868C3.75736 3 5.17157 3 8 3H16C18.8284 3 20.2426 3 21.1213 3.87868C22 4.75736 22 6.17157 22 9V11.0173C22 13.8458 22 15.26 21.1213 16.1386C20.48 16.7799 19.5534 16.9549 18 17.0017C18 14.8214 19.769 13.0503 21.9423 13.0194", "M12 17V21", "M15 17V19", "M9 17V19", "M15 10.0039C15 8.34705 13.6569 7.00391 12 7.00391C10.3431 7.00391 9 8.34705 9 10.0039C9 11.6608 10.3431 13.0039 12 13.0039C13.6569 13.0039 15 11.6608 15 10.0039Z"] },
        { id: "opcionais", label: "Opcionais", icon: "M12 4V20M20 12H4" },
        { id: "pagamento", label: "Formas de pagamento", icon: ["M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z", "M14.7102 10.0611C14.6111 9.29844 13.7354 8.06622 12.1608 8.06619C10.3312 8.06616 9.56136 9.07946 9.40515 9.58611C9.16145 10.2638 9.21019 11.6571 11.3547 11.809C14.0354 11.999 15.1093 12.3154 14.9727 13.956C14.836 15.5965 13.3417 15.951 12.1608 15.9129C10.9798 15.875 9.04764 15.3325 8.97266 13.8733M11.9734 6.99805V8.06982M11.9734 15.9031V16.998"] },
        { id: "canais", label: "Canais e visibilidade", icon: ["M2 8C2 8 6.47715 3 12 3C17.5228 3 22 8 22 8", "M21.544 13.045C21.848 13.4713 22 13.6845 22 14C22 14.3155 21.848 14.5287 21.544 14.955C20.1779 16.8706 16.6892 21 12 21C7.31078 21 3.8221 16.8706 2.45604 14.955C2.15201 14.5287 2 14.3155 2 14C2 13.6845 2.15201 13.4713 2.45604 13.045C3.8221 11.1294 7.31078 7 12 7C16.6892 7 20.1779 11.1294 21.544 13.045Z", "M15 14C15 12.3431 13.6569 11 12 11C10.3431 11 9 12.3431 9 14C9 15.6569 10.3431 17 12 17C13.6569 17 15 15.6569 15 14Z"] },
      ],
    },
    {
      title: "Participantes",
      items: [
        { id: "exigencias", label: "Exigências de participação", icon: ["M7 7H15M7 12H12.5M7 17L11 17", "M19.5 11V10C19.5 6.22876 19.5 4.34315 18.3284 3.17157C17.1569 2 15.2712 2 11.5 2H10.5001C6.7289 2 4.84329 2 3.67172 3.17156C2.50015 4.34312 2.50014 6.22872 2.5001 9.99993L2.50007 13.9999C2.50004 17.7712 2.50002 19.6568 3.67159 20.8284C4.84317 22 6.7288 22 10.5001 22H14", "M18.5 19H17.0754C16.1713 19 15.7192 19 15.5534 18.7463C15.3875 18.4927 15.6201 18.157 16.0853 17.4855L16.5384 16.8315C16.6519 16.6677 16.7086 16.5858 16.727 16.4938C16.7454 16.4019 16.7238 16.3083 16.6805 16.1209L16.4669 15.1961C16.3391 14.6427 16.2753 14.366 16.4485 14.183C16.6217 14 16.9475 14 17.5992 14H19.4008C20.0525 14 20.3783 14 20.5515 14.183C20.7248 14.366 20.6609 14.6427 20.5331 15.1961L20.3195 16.1209C20.2762 16.3083 20.2546 16.4019 20.273 16.4938C20.2914 16.5858 20.3481 16.6677 20.4616 16.8315L20.9147 17.4855C21.3799 18.157 21.6125 18.4927 21.4466 18.7463C21.2808 19 20.8287 19 19.9246 19H18.5ZM18.5 19V22"] },
        { id: "termos", label: "Termos e contratos", icon: ["M11 6.00781H17", "M11 10H17", "M11 14H14", "M19 22C20.1046 22 21 21.1046 21 20V8C21 5.17157 21 3.75736 20.1213 2.87868C19.2426 2 17.8284 2 15 2H13C10.1716 2 8.75736 2 7.87868 2.87868C7 3.75736 7 5.17157 7 8V18M19 22C17.8954 22 17 21.1046 17 20C17 19.0572 17 18.5858 16.7071 18.2929C16.4142 18 15.9428 18 15 18H7M19 22H5C3.89543 22 3 21.1046 3 20C3 19.0572 3 18.5858 3.29289 18.2929C3.58579 18 4.05719 18 5 18H7"] },
        { id: "comunicacao", label: "Comunicação", icon: ["M7.5 12H13.5M7.5 8H10.5", "M8.5 20C9.55038 20.8697 10.8145 21.4238 12.2635 21.5188C13.4052 21.5937 14.5971 21.5936 15.7365 21.5188C16.1288 21.4931 16.5565 21.4007 16.9248 21.251C17.3345 21.0845 17.5395 21.0012 17.6437 21.0138C17.7478 21.0264 17.8989 21.1364 18.2011 21.3563C18.7339 21.744 19.4051 22.0225 20.4005 21.9986C20.9038 21.9865 21.1555 21.9804 21.2681 21.7909C21.3808 21.6013 21.2405 21.3389 20.9598 20.8141C20.5706 20.0862 20.324 19.2529 20.6977 18.5852C21.3413 17.6315 21.8879 16.5021 21.9678 15.2823C22.0107 14.6269 22.0107 13.9481 21.9678 13.2927C21.9146 12.4799 21.7173 11.7073 21.4012 11", "M12.345 17.4868C15.9006 17.2526 18.7328 14.4069 18.9658 10.8344C19.0114 10.1353 19.0114 9.41131 18.9658 8.71219C18.7328 5.13968 15.9006 2.29401 12.345 2.05985C11.132 1.97997 9.86553 1.98013 8.65499 2.05985C5.09943 2.29401 2.26725 5.13968 2.0342 8.71219C1.9886 9.41131 1.9886 10.1353 2.0342 10.8344C2.11908 12.1356 2.69992 13.3403 3.38372 14.3576C3.78076 15.0697 3.51873 15.9586 3.10518 16.735C2.807 17.2948 2.65791 17.5747 2.77762 17.7769C2.89732 17.9791 3.16472 17.9856 3.69951 17.9985C4.75712 18.024 5.47028 17.7269 6.03638 17.3134C6.35744 17.0788 6.51798 16.9615 6.62862 16.9481C6.73926 16.9346 6.957 17.0234 7.39241 17.2011C7.78374 17.3608 8.23812 17.4593 8.65499 17.4868C9.86553 17.5665 11.132 17.5666 12.345 17.4868Z"] },
      ],
    },
  ];

  /* ── Editor — sidebar nav + content area ── */
  if (mode !== "list") {
    const tabs = getTabsForType(form.tipo);
    const showEstoque = tabs.some((t) => t.id === "estoque");
    const showDisponibilidade = tabs.some((t) => t.id === "disponibilidade");
    const showOpcionais = tabs.some((t) => t.id === "opcionais");

    const renderPlaceholderSection = (title: string, subtitle: string) => (
      <div>
        <h2 className="font-['Helvetica_Neue:Medium',sans-serif] text-[18px] text-[#181d27]">{title}</h2>
        <p className="mt-[4px] font-['Helvetica_Neue:Regular',sans-serif] text-[14px] text-[#717680]">{subtitle}</p>
        <div className="mt-[16px] rounded-xl border border-[#e9eaeb] bg-white p-[24px] shadow-sm">
          <div className="flex flex-col items-center justify-center gap-[8px] py-[24px]">
            <svg className="size-[32px] text-[#a4a7ae]" fill="none" viewBox="0 0 24 24"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
            <p className="font-['Helvetica_Neue:Medium',sans-serif] text-[14px] text-[#535862]">Em desenvolvimento</p>
            <p className="font-['Helvetica_Neue:Regular',sans-serif] text-[13px] text-[#a4a7ae]">Esta seção estará disponível em breve.</p>
          </div>
        </div>
      </div>
    );

    const renderActiveSection = () => {
      switch (activeSection) {
        case "info-basicas":
          return (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_380px]">
              {/* Left column — main fields */}
              <div className="flex flex-col gap-6">
                {/* Identificação */}
                <section className="rounded-xl border border-[#e9eaeb] bg-white shadow-sm">
                  <div className="px-4 pt-4 pb-0">
                    <h2 className="font-['Helvetica_Neue:Regular',sans-serif] text-base text-[#181d27]">Informações básicas</h2>
                  </div>
                  <div className="flex flex-col gap-4 px-4 pb-4 pt-3">
                    <div className="flex flex-col gap-[6px]">
                      <p className="font-['Helvetica_Neue:Regular',sans-serif] text-[14px] text-[#181d27]">Nome do produto<span className="text-[#d92d20]"> *</span></p>
                      <input className={fieldClass} value={form.nome} onChange={(e) => updateForm("nome", e.target.value)} placeholder="Ex: Terra Ronca 1 + Cachoeira da Palmeira" />
                    </div>
                    <div className="flex flex-col gap-[6px]">
                      <p className="font-['Helvetica_Neue:Regular',sans-serif] text-[14px] text-[#181d27]">Descrição curta</p>
                      <input className={fieldClass} value={textoCurto} onChange={(e) => setTextoCurto(e.target.value)} placeholder="Resumo da experiência" />
                      <p className="font-['Helvetica_Neue:Regular',sans-serif] text-[12px] text-[#717680]">Aparece nos cards e materiais de chamada.</p>
                    </div>
                    <div className="flex flex-col gap-[6px]">
                      <p className="font-['Helvetica_Neue:Regular',sans-serif] text-[14px] text-[#181d27]">Descrição completa</p>
                      <textarea className={textAreaClass} value={form.descricao} onChange={(e) => updateForm("descricao", e.target.value)} placeholder="Descritivo e roteiro do passeio" />
                    </div>
                    <div className="flex flex-col gap-[6px]">
                      <p className="font-['Helvetica_Neue:Regular',sans-serif] text-[14px] text-[#181d27]">Imagens</p>
                      <div className="flex flex-col items-center justify-center gap-[8px] rounded-[8px] border-2 border-dashed border-[#d5d7da] bg-[#fbfcfd] px-[24px] py-[32px] transition-colors hover:border-[#0b5ed7]/40 hover:bg-[#f0f5ff]/30 cursor-pointer">
                        <svg className="size-[28px] text-[#a4a7ae]" fill="none" viewBox="0 0 24 24">
                          <path d="M12 16V2m0 0l4 4m-4-4L8 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M2 17l.621 2.485A2 2 0 004.561 21h14.878a2 2 0 001.94-1.515L22 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <p className="font-['Helvetica_Neue:Regular',sans-serif] text-[13px] text-[#717680]">Arraste imagens ou clique para enviar</p>
                      </div>
                    </div>
                    <div className="flex flex-col gap-[6px]">
                      <p className="font-['Helvetica_Neue:Regular',sans-serif] text-[14px] text-[#181d27]">Link do mapa (Google Maps)</p>
                      <div className="relative">
                        <input className={`${fieldClass} pr-[150px]`} value={linkMapa} onChange={(e) => setLinkMapa(e.target.value)} placeholder="https://maps.google.com/..." />
                        <button type="button" onClick={() => window.open(linkMapa.trim() || "https://maps.google.com", "_blank")} className="absolute right-[10px] top-1/2 -translate-y-1/2 flex items-center gap-[4px] font-['Helvetica_Neue:Regular',sans-serif] text-[12px] text-[#0b5ed7] cursor-pointer hover:text-[#084fb7] transition-colors">
                          Ver no Google Maps
                          <svg className="size-[14px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 3H7C4.79086 3 3 4.79086 3 7V17C3 19.2091 4.79086 21 7 21H17C19.2091 21 21 19.2091 21 17V13" /><path d="M14 3H21V10" /><path d="M21 3L12 12" /></svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </section>

                {/* SEO */}
                <section className="rounded-xl border border-[#e9eaeb] bg-white shadow-sm">
                  <div className="px-4 pt-4 pb-0">
                    <h2 className="font-['Helvetica_Neue:Regular',sans-serif] text-base text-[#181d27]">SEO</h2>
                  </div>
                  <div className="flex flex-col gap-4 px-4 pb-4 pt-3">
                    <div className="flex flex-col gap-[6px]">
                      <p className="font-['Helvetica_Neue:Regular',sans-serif] text-[14px] text-[#181d27]">Título da página</p>
                      <input className={fieldClass} value={seoTitulo} onChange={(e) => setSeoTitulo(e.target.value)} placeholder="Título para mecanismos de busca" />
                    </div>
                    <div className="flex flex-col gap-[6px]">
                      <p className="font-['Helvetica_Neue:Regular',sans-serif] text-[14px] text-[#181d27]">Meta description</p>
                      <textarea className={textAreaClass} value={seoDescricao} onChange={(e) => setSeoDescricao(e.target.value)} placeholder="Descrição para resultados de busca" />
                    </div>
                  </div>
                </section>

                {formError && (
                  <div className="rounded-[10px] border border-[#fecdca] bg-[#fef3f2] px-[14px] py-[12px] font-['Helvetica_Neue:Regular',sans-serif] text-[13px] text-[#b42318]">{formError}</div>
                )}
              </div>

              {/* Right column — sidebar cards */}
              <div className="flex flex-col gap-[16px]">
                {/* Tipo de produto card */}
                <div className="rounded-xl border border-[#e9eaeb] bg-white shadow-sm px-4 pt-4 pb-4">
                  <p className="font-['Helvetica_Neue:Regular',sans-serif] text-[16px] text-[#181d27] mb-[10px]">Tipo de produto</p>
                  <div className="relative flex flex-col gap-[6px]">
                    <button
                      type="button"
                      onClick={() => setTipoDropdownOpen(!tipoDropdownOpen)}
                      className={`${fieldClass} flex cursor-pointer items-center justify-between text-left`}
                    >
                      <span className={form.tipo ? "text-[#252b37]" : "text-[#a4a7ae]"}>{form.tipo ? (tipoLabels[form.tipo] ?? form.tipo) : "Selecione..."}</span>
                      <svg className={`size-[14px] text-[#717680] transition-transform ${tipoDropdownOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24">
                        <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                    {form.tipo && tipoDescriptions[form.tipo] && (
                      <p className="font-['Helvetica_Neue:Regular',sans-serif] text-[12px] text-[#717680] mt-[4px]">{tipoDescriptions[form.tipo]}</p>
                    )}
                    {tipoDropdownOpen && (
                      <>
                        <div className="fixed inset-0 z-[60]" onClick={() => setTipoDropdownOpen(false)} />
                        <div className="absolute left-0 right-0 top-[44px] z-[61] max-h-[360px] overflow-y-auto rounded-[10px] border border-[#e9eaeb] bg-white shadow-[0_8px_24px_rgba(15,23,43,0.12)]">
                          {tipoGroups.map((group) => (
                            <div key={group.title}>
                              <p className="sticky top-0 bg-[#fafafa] px-[12px] py-[8px] font-['Helvetica_Neue:Medium',sans-serif] text-[11px] uppercase tracking-[0.5px] text-[#717680]">{group.title}</p>
                              {group.tipos.map((tipo) => (
                                <button
                                  key={tipo}
                                  type="button"
                                  onClick={() => { updateForm("tipo", tipo); setTipoDropdownOpen(false); }}
                                  className={`flex w-full cursor-pointer flex-col px-[12px] py-[10px] text-left transition-colors ${form.tipo === tipo ? "bg-[#eff6ff]" : "hover:bg-[#f8fafc]"}`}
                                >
                                  <span className={`font-['Helvetica_Neue:Regular',sans-serif] text-[13px] ${form.tipo === tipo ? "text-[#0b5ed7]" : "text-[#252b37]"}`}>{tipoLabels[tipo] ?? tipo}</span>
                                  <span className="font-['Helvetica_Neue:Regular',sans-serif] text-[11px] text-[#a4a7ae]">{tipoDescriptions[tipo] ?? ""}</span>
                                </button>
                              ))}
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Tags / categorias card */}
                <div className="rounded-xl border border-[#e9eaeb] bg-white shadow-sm px-4 pt-4 pb-4 overflow-visible">
                  <p className="font-['Helvetica_Neue:Regular',sans-serif] text-[16px] text-[#181d27] mb-[10px]">Tags / categorias</p>
                  <div className="flex flex-col gap-[12px]">
                    <div className="relative">
                      <div className={`flex items-center h-[40px] w-full rounded-[8px] border bg-[#fbfcfd] px-[12px] transition-colors ${tagDropdownOpen ? "border-[#0b5ed7] bg-white" : "border-[#e9eaeb]"}`}>
                        <input
                          type="text"
                          className="flex-1 min-w-0 font-['Helvetica_Neue:Regular',sans-serif] text-[14px] text-[#252b37] bg-transparent outline-none placeholder:text-[#a4a7ae]"
                          placeholder={selectedTags.length > 0 ? "Buscar ou adicionar tags" : "Selecione uma ou mais tags"}
                          value={tagSearch}
                          onChange={(e) => { setTagSearch(e.target.value); if (!tagDropdownOpen) setTagDropdownOpen(true); }}
                          onFocus={() => setTagDropdownOpen(true)}
                        />
                        <button type="button" onClick={() => setTagDropdownOpen(!tagDropdownOpen)} className="cursor-pointer shrink-0">
                          <HugeiconsIcon icon={ArrowDown01Icon} size={16} className={`text-[#a4a7ae] transition-transform ${tagDropdownOpen ? "rotate-180" : ""}`} />
                        </button>
                      </div>
                      {tagDropdownOpen && (() => {
                        const predefinedTags = ["Aventura", "Ecoturismo", "Trilha", "Cachoeira", "Caverna", "Rapel", "Tirolesa", "Observação de aves", "Cultural", "Gastronomia", "Família", "Radical"];
                        const allTags = [...predefinedTags, ...customTags.filter((t) => !predefinedTags.includes(t))];
                        const trimmed = tagSearch.trim();
                        const filtered = allTags.filter((t) => t.toLowerCase().includes(trimmed.toLowerCase()));
                        return (
                          <div className="absolute top-full left-0 right-0 mt-[4px] bg-white border border-[#e9eaeb] rounded-[8px] shadow-[0px_4px_16px_0px_rgba(0,0,0,0.12)] z-50 overflow-hidden">
                            <div className="max-h-[200px] overflow-y-auto py-[4px]">
                              {filtered.length > 0 ? filtered.map((tag) => (
                                <button
                                  key={tag}
                                  type="button"
                                  onClick={() => {
                                    setSelectedTags((prev) => prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]);
                                    setTagSearch("");
                                  }}
                                  className={`flex w-full items-center justify-between px-[12px] py-[8px] hover:bg-[#f8fafc] transition-colors cursor-pointer font-['Helvetica_Neue:Regular',sans-serif] text-[13px] text-left ${selectedTags.includes(tag) ? "text-[#0b5ed7] bg-[#f0f5ff]" : "text-[#252b37]"}`}
                                >
                                  <span>{tag}</span>
                                  {selectedTags.includes(tag) && (
                                    <svg className="size-[14px] shrink-0" viewBox="0 0 14 14" fill="none"><path d="M3 7l2.5 2.5L11 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                  )}
                                </button>
                              )) : (
                                <div className="py-[4px]">
                                  <p className="px-[12px] py-[8px] font-['Helvetica_Neue:Regular',sans-serif] text-[13px] text-[#717680]">Nenhuma tag encontrada</p>
                                  {trimmed && (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setCustomTags((prev) => prev.includes(trimmed) ? prev : [...prev, trimmed]);
                                        setSelectedTags((prev) => prev.includes(trimmed) ? prev : [...prev, trimmed]);
                                        setTagSearch("");
                                        setTagDropdownOpen(false);
                                      }}
                                      className="flex w-full items-center gap-[8px] px-[12px] py-[8px] font-['Helvetica_Neue:Regular',sans-serif] text-[13px] text-[#0b5ed7] transition-colors hover:bg-[#f8fafc] cursor-pointer"
                                    >
                                      <svg className="size-[14px] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
                                      <span className="truncate">Adicionar &ldquo;{trimmed}&rdquo;</span>
                                    </button>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                    {selectedTags.length > 0 && (
                      <div className="flex flex-wrap gap-[6px]">
                        {selectedTags.map((tag) => (
                          <span key={tag} className="inline-flex items-center gap-[6px] rounded-full border border-[#dbeafe] bg-[#e8f0fe] px-[10px] py-[4px] font-['Helvetica_Neue:Regular',sans-serif] text-[12px] text-[#0b5ed7]">
                            {tag}
                            <button type="button" onClick={() => setSelectedTags((prev) => prev.filter((t) => t !== tag))} className="cursor-pointer transition-colors hover:text-[#084fb7]">
                              <svg className="size-[12px]" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M3 3l6 6M9 3l-6 6"/></svg>
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Exibição e destaque card */}
                <div className="rounded-xl border border-[#e9eaeb] bg-white shadow-sm px-4 pt-4 pb-4 overflow-visible">
                  <p className="font-['Helvetica_Neue:Regular',sans-serif] text-[16px] text-[#181d27] mb-[10px]">Exibição</p>
                  <div className="flex flex-col gap-[12px]">
                    {/* Locais dropdown */}
                    <div className="relative">
                      <div className={`flex items-center gap-[8px] w-full h-[40px] rounded-[8px] px-[12px] transition-colors border ${locaisDropdownOpen ? "border-[#0b5ed7] shadow-[0_0_0_1px_#0b5ed7]" : "border-[#e9eaeb] hover:border-[#d0d5dd]"} bg-white`}>
                        <svg className="size-[16px] text-[#a4a7ae] shrink-0" fill="none" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.5" /><path d="M16 16l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
                        <span className="flex-1 font-['Helvetica_Neue:Regular',sans-serif] text-[13px] text-[#a4a7ae] cursor-pointer" onClick={() => setLocaisDropdownOpen(!locaisDropdownOpen)}>
                          {locaisAtivos.size > 0 ? `${locaisAtivos.size} canal(is) selecionado(s)` : "Selecione um ou mais canais"}
                        </span>
                        <button type="button" onClick={() => setLocaisDropdownOpen(!locaisDropdownOpen)} className="cursor-pointer shrink-0">
                          <svg className={`size-[14px] text-[#a4a7ae] transition-transform ${locaisDropdownOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        </button>
                      </div>
                      {locaisDropdownOpen && (
                        <>
                          <div className="fixed inset-0 z-[5]" onClick={() => setLocaisDropdownOpen(false)} />
                          <div className="absolute top-full left-0 right-0 mt-[4px] bg-white border border-[#e9eaeb] rounded-[8px] shadow-[0px_4px_16px_0px_rgba(0,0,0,0.12)] z-50 py-[4px]">
                            {["Loja online", "Marketplace", "Balcão", "App mobile", "WhatsApp"].map((local) => {
                              const isSelected = locaisAtivos.has(local);
                              return (
                                <button key={local} type="button" onClick={() => setLocaisAtivos((prev) => { const next = new Set(prev); if (next.has(local)) next.delete(local); else next.add(local); return next; })} className={`flex w-full items-center justify-between px-[12px] py-[8px] hover:bg-[#f8fafc] transition-colors cursor-pointer font-['Helvetica_Neue:Regular',sans-serif] text-[13px] text-left ${isSelected ? "text-[#0b5ed7] bg-[#f0f5ff]" : "text-[#252b37]"}`}>
                                  <span>{local}</span>
                                  {isSelected && <svg className="size-[14px] shrink-0" viewBox="0 0 14 14" fill="none"><path d="M3 7l2.5 2.5L11 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                                </button>
                              );
                            })}
                          </div>
                        </>
                      )}
                    </div>
                    {/* Chips */}
                    {locaisAtivos.size > 0 && (
                      <div className="flex flex-wrap gap-[6px]">
                        {Array.from(locaisAtivos).map((local) => (
                          <span key={local} className="inline-flex items-center gap-[6px] rounded-full border border-[#dbeafe] bg-[#e8f0fe] px-[10px] py-[4px] font-['Helvetica_Neue:Regular',sans-serif] text-[12px] text-[#0b5ed7]">
                            {local}
                            <button type="button" onClick={() => setLocaisAtivos((prev) => { const next = new Set(prev); next.delete(local); return next; })} className="cursor-pointer transition-colors hover:text-[#084fb7]">
                              <svg className="size-[12px]" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M3 3l6 6M9 3l-6 6"/></svg>
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                    {/* Destaque toggle */}
                    <div className="flex items-center justify-between border-t border-[#f5f5f5] pt-[12px]">
                      <span className="font-['Helvetica_Neue:Regular',sans-serif] text-[13px] text-[#535862]">Destacar produto na loja</span>
                      <Switch checked={form.destaque} onCheckedChange={(v) => updateForm("destaque", v)} />
                    </div>
                  </div>
                </div>

              </div>
            </div>
          );

        case "recorrencia":
          if (!showDisponibilidade) {
            return (
              <div>
                <h2 className="font-['Helvetica_Neue:Medium',sans-serif] text-[18px] text-[#181d27]">Recorrência e horários</h2>
                <p className="mt-[4px] font-['Helvetica_Neue:Regular',sans-serif] text-[14px] text-[#717680]">Configure quando o produto estará disponível.</p>
                <div className="mt-[16px] rounded-xl border border-[#e9eaeb] bg-white p-[24px] shadow-sm">
                  <p className="font-['Helvetica_Neue:Regular',sans-serif] text-[13px] text-[#717680]">Não se aplica para o tipo "{form.tipo}".</p>
                </div>
              </div>
            );
          }
          return (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_380px]">
              {/* Left column */}
              <div className="flex flex-col gap-6">
                {/* Recorrência card */}
                <section className="rounded-xl border border-[#e9eaeb] bg-white shadow-sm">
                  <div className="px-4 pt-4 pb-0">
                    <h2 className="font-['Helvetica_Neue:Regular',sans-serif] text-[16px] text-[#181d27]">Recorrência</h2>
                  </div>
                  <div className="flex flex-col gap-4 px-4 pb-4 pt-3">
                    <div className="space-y-[16px]">
                      {/* Toggle */}
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-sm font-medium">Essa atividade se repete?</span>
                          <span className="text-muted-foreground text-xs">Configure uma programação recorrente para não precisar recriar a atividade toda vez.</span>
                        </div>
                        <Switch checked={recorrenciaAtiva} onCheckedChange={setRecorrenciaAtiva} />
                      </div>

                      {/* Recurrence config */}
                      {recorrenciaAtiva && (
                        <div className="rounded-[10px] border border-[#f5f5f5] bg-[#fafafa] p-[16px] space-y-[16px]">
                          {/* Summary */}
                          <div className="flex items-center gap-[8px]">
                            <svg className="size-[20px] text-[#414651]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M16.3884 3L17.3913 3.97574C17.8393 4.41165 18.0633 4.62961 17.9844 4.81481C17.9056 5 17.5888 5 16.9552 5H9.19422C5.22096 5 2 8.13401 2 12C2 13.4872 2.47668 14.8662 3.2895 16" />
                              <path d="M7.61156 21L6.60875 20.0243C6.16074 19.5883 5.93673 19.3704 6.01557 19.1852C6.09441 19 6.4112 19 7.04478 19H14.8058C18.779 19 22 15.866 22 12C22 10.5128 21.5233 9.13383 20.7105 8" />
                            </svg>
                            <p className="font-['Helvetica_Neue:Medium',sans-serif] text-[13px] text-[#252b37] uppercase tracking-[0.5px]">Recorrência</p>
                            <p className="font-['Helvetica_Neue:Regular',sans-serif] text-[13px] text-[#0b5ed7]">
                              {recorrenciaTipo === "diario" ? `Repete todos os dias` : recorrenciaTipo === "semanal" ? "Repete toda semana" : recorrenciaTipo === "mensal" ? "Repete todo mês" : "Personalizado"}
                            </p>
                          </div>

                          {/* Type selector */}
                          <div className="flex gap-[4px] bg-white rounded-[8px] border border-[#e9eaeb] p-[4px]">
                            {(["diario", "semanal", "mensal", "personalizado"] as const).map((tipo) => (
                              <button key={tipo} type="button" onClick={() => setRecorrenciaTipo(tipo)} className={`flex-1 rounded-[6px] px-[12px] py-[6px] text-[13px] transition-all cursor-pointer ${recorrenciaTipo === tipo ? "font-['Helvetica_Neue:Medium',sans-serif] bg-[#0b5ed7] text-white shadow-sm" : "font-['Helvetica_Neue:Regular',sans-serif] text-[#535862] hover:text-[#252b37] hover:bg-[#f8fafc]"}`}>
                                {tipo === "diario" ? "Diário" : tipo === "semanal" ? "Semanal" : tipo === "mensal" ? "Mensal" : "Personalizado"}
                              </button>
                            ))}
                          </div>

                          {/* Interval */}
                          <div className="flex items-center gap-[8px]">
                            <span className="font-['Helvetica_Neue:Regular',sans-serif] text-[13px] text-[#414651]">Repetir a cada</span>
                            <input className="h-9 w-[56px] text-center rounded-md border border-border px-3 py-1 text-sm bg-white outline-none transition-colors focus:border-[#0b5ed7] focus:ring-[#0b5ed7]/30 focus:ring-3" inputMode="numeric" value={recorrenciaIntervalo} onChange={(e) => setRecorrenciaIntervalo(e.target.value.replace(/\D/g, ""))} />
                            <span className="font-['Helvetica_Neue:Regular',sans-serif] text-[13px] text-[#414651]">
                              {recorrenciaTipo === "diario" ? "dia(s)." : recorrenciaTipo === "semanal" ? "semana(s)." : recorrenciaTipo === "mensal" ? "mês(es)." : "dia(s)."}
                            </span>
                          </div>

                          {/* Weekly day selector */}
                          {recorrenciaTipo === "semanal" && (
                            <div className="flex flex-col gap-[8px]">
                              <div className="flex gap-[6px]">
                                {["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"].map((dia, idx) => {
                                  const realIdx = idx === 6 ? 0 : idx + 1;
                                  return (
                                    <button key={dia} type="button" onClick={() => { const next = [...diasSemana]; next[realIdx] = !next[realIdx]; setDiasSemana(next); }} className={`flex h-[36px] min-w-[44px] cursor-pointer items-center justify-center rounded-[8px] border px-[10px] font-['Helvetica_Neue:Regular',sans-serif] text-[13px] transition-all ${diasSemana[realIdx] ? "border-[#0b5ed7] bg-[#0b5ed7] text-white" : "border-[#e9eaeb] bg-white text-[#535862] hover:bg-[#f8fafc]"}`}>
                                      {dia}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </section>

                {/* Horários e saídas card */}
                <section className="rounded-xl border border-[#e9eaeb] bg-white shadow-sm">
                  <div className="px-4 pt-4 pb-0">
                    <h2 className="font-['Helvetica_Neue:Regular',sans-serif] text-[16px] text-[#181d27]">Horários e saídas</h2>
                  </div>
                  <div className="flex flex-col gap-4 px-4 pb-4 pt-3">
                    <div className="space-y-4">
                      {/* Saídas list */}
                      {multiplosHorarios && (
                        <div className="flex flex-col gap-[10px]">
                          {saidas.map((saida, idx) => {
                            const subtitle = [
                              saida.horario ? saida.horario : "Sem horários definidos",
                              saida.equipe || "sem equipe atribuída",
                              saida.vagas ? `${saida.vagas} vagas` : "sem capacidade atribuída",
                            ].join(", ");
                            return (
                              <div key={idx} className="flex items-center gap-3 rounded-lg border border-border bg-muted/40 p-3 transition-[opacity,background-color,border-color]">
                                <button type="button" className={`flex size-[20px] shrink-0 items-center justify-center transition-colors ${saidas.length > 1 ? "text-muted-foreground cursor-grab active:cursor-grabbing" : "text-muted-foreground/30"}`} aria-label={`Reordenar saída ${idx + 1}`}>
                                <svg className="size-[20px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M11.9959 18H12.0049"/><path d="M17.9998 18H18.0088"/><path d="M5.99981 18H6.00879"/>
                                  <path d="M11.9959 12H12.0049"/><path d="M11.9998 6H12.0088"/><path d="M17.9998 12H18.0088"/>
                                  <path d="M17.9998 6H18.0088"/><path d="M5.99981 12H6.00879"/><path d="M5.99981 6H6.00879"/>
                                </svg>
                                </button>
                                <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                                  <span className="text-sm font-medium">Saída {idx + 1}</span>
                                  <span className="text-muted-foreground text-xs truncate">{subtitle}</span>
                                </div>
                                <div className="flex shrink-0 items-center gap-2.5">
                                  <button type="button" onClick={() => setSaidaDrawerIdx(idx)} className="flex size-8 cursor-pointer items-center justify-center rounded-md border border-border text-primary transition-colors hover:bg-primary/10">
                                    <svg className="size-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"><path d="M16.4249 4.60509L17.4149 3.6151C18.2351 2.79497 19.5648 2.79497 20.3849 3.6151C21.205 4.43524 21.205 5.76493 20.3849 6.58507L19.3949 7.57506M16.4249 4.60509L9.76558 11.2644C9.25807 11.772 8.89804 12.4078 8.72397 13.1041L8 16L10.8959 15.276C11.5922 15.102 12.228 14.7419 12.7356 14.2344L19.3949 7.57506M16.4249 4.60509L19.3949 7.57506" /><path d="M18.9999 13.5C18.9999 16.7875 18.9999 18.4312 18.092 19.5376C17.9258 19.7401 17.7401 19.9258 17.5375 20.092C16.4312 21 14.7874 21 11.4999 21H11C7.22876 21 5.34316 21 4.17159 19.8284C3.00003 18.6569 3 16.7712 3 13V12.5C3 9.21252 3 7.56879 3.90794 6.46244C4.07417 6.2599 4.2599 6.07417 4.46244 5.90794C5.56879 5 7.21252 5 10.5 5" strokeLinecap="round" /></svg>
                                  </button>
                                  {saidas.length > 1 && (
                                    <button type="button" onClick={() => setSaidas((prev) => prev.filter((_, i) => i !== idx))} className="flex size-8 cursor-pointer items-center justify-center rounded-md border border-border text-destructive transition-colors hover:bg-destructive/10">
                                      <svg className="size-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19.5 5.5L18.613 15.413C18.377 17.989 18.259 19.277 17.55 20.138C17.1 20.694 16.518 21.124 15.86 21.39C14.882 21.777 13.592 21.777 11.012 21.777C8.428 21.777 7.136 21.777 6.157 21.388C5.499 21.121 4.918 20.69 4.468 20.132C3.761 19.268 3.646 17.976 3.416 15.391L2.5 5.5"/><path d="M21 5.5H3"/><path d="M16.056 5.5L15.373 4.098C14.921 3.166 14.695 2.7 14.327 2.39C14.2 2.283 14.063 2.189 13.917 2.11C13.51 1.9 13.04 1.9 12.101 1.9C11.139 1.9 10.658 1.9 10.243 2.118C10.094 2.2 9.956 2.297 9.828 2.408C9.456 2.727 9.234 3.207 8.79 4.166L8.174 5.5"/></svg>
                                    </button>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                          <button type="button" onClick={() => { setSaidas((prev) => [...prev, { horario: "", vagas: "", qtdMinima: "", equipe: "" }]); setSaidaDrawerIdx(saidas.length); }} className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-border py-2.5 text-sm font-medium text-primary transition-colors hover:bg-muted/50 cursor-pointer">
                            <svg className="size-[16px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>
                            Adicionar saída
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </section>
              </div>

              {/* Right column — sidebar */}
              <div className="flex flex-col gap-[16px]">
                {/* Horários e duração card */}
                <div className="rounded-xl border border-[#e9eaeb] bg-white shadow-sm px-4 pt-4 pb-4">
                  <p className="font-['Helvetica_Neue:Regular',sans-serif] text-[16px] text-[#181d27] mb-[10px]">Duração e antecedência</p>
                  <div className="flex flex-col gap-[12px]">
                    <div className="flex flex-col gap-[6px]">
                      <p className="font-['Helvetica_Neue:Regular',sans-serif] text-[13px] text-[#535862]">Duração total da atividade</p>
                      <div className="flex gap-[8px]">
                        <input className="h-[40px] flex-1 min-w-0 rounded-[8px] border border-[#e9eaeb] bg-[#fbfcfd] px-[12px] font-['Helvetica_Neue:Regular',sans-serif] text-[14px] text-[#252b37] outline-none transition-colors placeholder:text-[#a4a7ae] focus:border-[#0b5ed7] focus:bg-white" inputMode="numeric" value={duracaoValor} onChange={(e) => setDuracaoValor(e.target.value.replace(/\D/g, ""))} placeholder="4" />
                        <select className="h-[40px] flex-1 min-w-0 rounded-[8px] border border-[#e9eaeb] bg-[#fbfcfd] px-[12px] font-['Helvetica_Neue:Regular',sans-serif] text-[14px] text-[#252b37] outline-none transition-colors focus:border-[#0b5ed7] focus:bg-white" value={duracaoUnidade} onChange={(e) => setDuracaoUnidade(e.target.value)}>
                          <option value="horas">horas</option>
                          <option value="minutos">minutos</option>
                          <option value="dias">dias</option>
                        </select>
                      </div>
                    </div>
                    <div className="flex flex-col gap-[6px]">
                      <p className="font-['Helvetica_Neue:Regular',sans-serif] text-[13px] text-[#535862]">Antecedência mín. de venda</p>
                      <input className={fieldClass} inputMode="numeric" value={antecedenciaVenda} onChange={(e) => setAntecedenciaVenda(e.target.value.replace(/\D/g, ""))} placeholder="24" />
                      <p className="font-['Helvetica_Neue:Regular',sans-serif] text-[11px] text-[#717680]">Até quantas horas antes da saída o produto pode ser vendido.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );

        case "estoque":
          if (!showEstoque) {
            return (
              <div>
                <div className="rounded-xl border border-[#e9eaeb] bg-white p-[24px] shadow-sm">
                  <p className="font-['Helvetica_Neue:Regular',sans-serif] text-[13px] text-[#717680]">Não se aplica para o tipo "{form.tipo}".</p>
                </div>
              </div>
            );
          }
          return (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_380px]">
              {/* Left column */}
              <div className="flex flex-col gap-6">
                <section className="rounded-xl border border-[#e9eaeb] bg-white shadow-sm">
                  <div className="px-4 pt-4 pb-0">
                    <h2 className="font-['Helvetica_Neue:Regular',sans-serif] text-[16px] text-[#181d27]">Estoque e vagas</h2>
                  </div>
                  <div className="flex flex-col gap-4 px-4 pb-4 pt-3">
                    {/* Onde o estoque é controlado */}
                    <div className="flex flex-col gap-[6px]">
                      <p className="font-['Helvetica_Neue:Medium',sans-serif] text-[14px] text-[#181d27]">Onde o estoque é controlado</p>
                      <p className="font-['Helvetica_Neue:Regular',sans-serif] text-[12px] text-[#717680]">Selecione em quais níveis a quantidade é limitada. Os campos de quantidade abaixo acompanham a seleção.</p>
                    </div>
                    <div className="flex gap-[4px] bg-white rounded-[8px] border border-[#e9eaeb] p-[4px]">
                      {([
                        { value: "produto", label: "No produto" },
                        { value: "horario", label: "No horário" },
                        { value: "evento", label: "No evento" },
                        { value: "tarifario", label: "No tarifário" },
                        { value: "item", label: "Nos itens" },
                      ] as const).map((opt) => {
                        const isActive = niveisEstoque.has(opt.value);
                        return (
                          <button key={opt.value} type="button" onClick={() => setNiveisEstoque((prev) => { const next = new Set(prev); if (next.has(opt.value)) next.delete(opt.value); else next.add(opt.value); return next; })} className={`flex-1 rounded-[6px] px-[12px] py-[6px] text-[13px] transition-all cursor-pointer ${isActive ? "font-['Helvetica_Neue:Medium',sans-serif] bg-[#0b5ed7] text-white shadow-sm" : "font-['Helvetica_Neue:Regular',sans-serif] text-[#535862] hover:text-[#252b37] hover:bg-[#f8fafc]"}`}>
                            {opt.label}
                          </button>
                        );
                      })}
                    </div>

                    {/* Quantidades */}
                    {niveisEstoque.size > 0 && (
                      <div className="flex flex-col gap-[12px] border-t border-[#f0f1f3] pt-[16px]">
                        <p className="font-['Helvetica_Neue:Medium',sans-serif] text-[14px] text-[#181d27]">Quantidades</p>
                        {niveisEstoque.has("produto") && (
                          <div className="flex flex-col gap-[6px]">
                            <p className="font-['Helvetica_Neue:Regular',sans-serif] text-[14px] text-[#181d27]">Estoque total do produto</p>
                            <input className={fieldClass} inputMode="numeric" value={estoqueQtd.produto} onChange={(e) => setEstoqueQtd((prev) => ({ ...prev, produto: e.target.value.replace(/\D/g, "") }))} placeholder="0" />
                          </div>
                        )}
                        {niveisEstoque.has("horario") && (
                          <div className="flex flex-col gap-[6px]">
                            <p className="font-['Helvetica_Neue:Regular',sans-serif] text-[14px] text-[#181d27]">Vagas por horário</p>
                            <input className={fieldClass} inputMode="numeric" value={estoqueQtd.horario} onChange={(e) => setEstoqueQtd((prev) => ({ ...prev, horario: e.target.value.replace(/\D/g, "") }))} placeholder="0" />
                          </div>
                        )}
                        {niveisEstoque.has("evento") && (
                          <div className="flex flex-col gap-[6px]">
                            <p className="font-['Helvetica_Neue:Regular',sans-serif] text-[14px] text-[#181d27]">Vagas por evento</p>
                            <input className={fieldClass} inputMode="numeric" value={estoqueQtd.evento} onChange={(e) => setEstoqueQtd((prev) => ({ ...prev, evento: e.target.value.replace(/\D/g, "") }))} placeholder="0" />
                          </div>
                        )}
                        {niveisEstoque.has("tarifario") && (
                          <div className="flex flex-col gap-[6px]">
                            <p className="font-['Helvetica_Neue:Regular',sans-serif] text-[14px] text-[#181d27]">Limite por tarifa</p>
                            <input className={fieldClass} inputMode="numeric" value={estoqueQtd.tarifario} onChange={(e) => setEstoqueQtd((prev) => ({ ...prev, tarifario: e.target.value.replace(/\D/g, "") }))} placeholder="0" />
                          </div>
                        )}
                        {niveisEstoque.has("item") && (
                          <div className="flex flex-col gap-[6px]">
                            <p className="font-['Helvetica_Neue:Regular',sans-serif] text-[14px] text-[#181d27]">Limite por item</p>
                            <input className={fieldClass} inputMode="numeric" value={estoqueQtd.item} onChange={(e) => setEstoqueQtd((prev) => ({ ...prev, item: e.target.value.replace(/\D/g, "") }))} placeholder="0" />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </section>

                {/* Identificação de estoque */}
                <section className="rounded-xl border border-[#e9eaeb] bg-white shadow-sm">
                  <div className="px-4 pt-4 pb-0">
                    <h2 className="font-['Helvetica_Neue:Regular',sans-serif] text-[16px] text-[#181d27]">Identificação de estoque</h2>
                  </div>
                  <div className="grid grid-cols-2 gap-4 px-4 pb-4 pt-3">
                    <div className="flex flex-col gap-[6px]">
                      <p className="font-['Helvetica_Neue:Regular',sans-serif] text-[14px] text-[#181d27]">SKU (Unidade de manutenção de estoque)</p>
                      <input className={fieldClass} placeholder="" />
                    </div>
                    <div className="flex flex-col gap-[6px]">
                      <p className="font-['Helvetica_Neue:Regular',sans-serif] text-[14px] text-[#181d27]">Código de barras (ISBN, UPC, GTIN etc.)</p>
                      <input className={fieldClass} placeholder="" />
                    </div>
                  </div>
                </section>
              </div>

              {/* Right column */}
              <div className="flex flex-col gap-[16px]">
                <div className="rounded-xl border border-[#e9eaeb] bg-white shadow-sm px-4 pt-4 pb-4">
                  <p className="font-['Helvetica_Neue:Regular',sans-serif] text-[16px] text-[#181d27] mb-[12px]">Controle de estoque e capacidade</p>
                  <div className="flex flex-col divide-y divide-[#f0f1f3]">
                    <div className="flex items-center justify-between gap-[12px] py-[12px] first:pt-0">
                      <div className="flex flex-col gap-[2px]">
                        <span className="font-['Helvetica_Neue:Regular',sans-serif] text-[14px] text-[#181d27]">Integração entre empresas</span>
                        <span className="font-['Helvetica_Neue:Regular',sans-serif] text-[12px] text-[#717680]">Compartilha o mesmo estoque com empresas parceiras</span>
                      </div>
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between gap-[12px] py-[12px]">
                      <div className="flex flex-col gap-[2px]">
                        <span className="font-['Helvetica_Neue:Regular',sans-serif] text-[14px] text-[#181d27]">Afiliados</span>
                        <span className="font-['Helvetica_Neue:Regular',sans-serif] text-[12px] text-[#717680]">Reservam vagas do estoque</span>
                      </div>
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between gap-[12px] py-[12px]">
                      <div className="flex flex-col gap-[2px]">
                        <span className="font-['Helvetica_Neue:Regular',sans-serif] text-[14px] text-[#181d27]">Cupom de desconto</span>
                        <span className="font-['Helvetica_Neue:Regular',sans-serif] text-[12px] text-[#717680]">Pode limitar a quantidade disponível por cupom</span>
                      </div>
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between gap-[12px] py-[12px] last:pb-0">
                      <div className="flex flex-col gap-[2px]">
                        <span className="font-['Helvetica_Neue:Regular',sans-serif] text-[14px] text-[#181d27]">Permitir overbooking</span>
                        <span className="font-['Helvetica_Neue:Regular',sans-serif] text-[12px] text-[#717680]">Aceitar reservas além da capacidade máxima</span>
                      </div>
                      <Switch checked={permitirOverbooking} onCheckedChange={setPermitirOverbooking} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );

        case "preco-tarifa":
          return (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_380px]">
              {/* Left column */}
              <div className="flex flex-col gap-6">
                <section className="rounded-xl border border-[#e9eaeb] bg-white shadow-sm">
                  <div className="px-4 pt-4 pb-0">
                    <h2 className="font-['Helvetica_Neue:Regular',sans-serif] text-base text-[#181d27]">Preço e tarifário</h2>
                  </div>
                  <div className="flex flex-col gap-4 px-4 pb-4 pt-3">
                    {/* Valor do anúncio */}
                    <div className="flex flex-col gap-[6px]">
                      <p className="font-['Helvetica_Neue:Regular',sans-serif] text-[14px] text-[#181d27]">Valor do anúncio</p>
                      <div className="relative">
                        <span className="absolute left-[12px] top-1/2 -translate-y-1/2 font-['Helvetica_Neue:Regular',sans-serif] text-[14px] text-[#717680]">R$</span>
                        <input className={`${fieldClass} pl-[36px]`} inputMode="numeric" value={form.preco} onChange={(e) => {
                          const raw = e.target.value.replace(/\D/g, "");
                          const cents = parseInt(raw || "0", 10);
                          const formatted = new Intl.NumberFormat("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(cents / 100);
                          updateForm("preco", formatted);
                        }} placeholder="0,00" />
                      </div>
                      <div className="flex items-center gap-[10px] bg-[#f8f9fc] border border-[#f5f5f5] rounded-[10px] px-[12px] py-[8px] mt-[4px]">
                        <svg className="size-[24px] shrink-0" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="11" fill="#4A7BF7" opacity="0.15" /><circle cx="12" cy="12" r="8" fill="#4A7BF7" /><path d="M12 16v-4M12 8h.01" stroke="white" strokeWidth="2" strokeLinecap="round" /></svg>
                        <p className="font-['Helvetica_Neue:Regular',sans-serif] text-[12px] text-[#414651] leading-[14px]">Com vários eventos de valores diferentes, o "a partir de" usa sempre o <strong className="font-['Helvetica_Neue:Medium',sans-serif]">menor</strong> valor.</p>
                      </div>
                    </div>

                    {/* Tipo de cobrança */}
                    <div className="flex flex-col gap-[8px]">
                      <p className="font-['Helvetica_Neue:Regular',sans-serif] text-[14px] text-[#181d27]">Tipo de cobrança</p>
                      <div className="flex gap-[4px] bg-white rounded-[8px] border border-[#e9eaeb] p-[4px]">
                        {([
                          { value: "variavel", label: "Variável (tarifário)" },
                          { value: "fixo", label: "Fixo" },
                          { value: "exclusivo_item", label: "Exclusivo por item" },
                          { value: "exclusivo_carrinho", label: "Exclusivo por carrinho" },
                        ] as const).map((opt) => (
                          <button key={opt.value} type="button" onClick={() => setTipoCobranca(opt.value)} className={`flex-1 rounded-[6px] px-[12px] py-[6px] text-[13px] transition-all cursor-pointer ${tipoCobranca === opt.value ? "font-['Helvetica_Neue:Medium',sans-serif] bg-[#0b5ed7] text-white shadow-sm" : "font-['Helvetica_Neue:Regular',sans-serif] text-[#535862] hover:text-[#252b37] hover:bg-[#f8fafc]"}`}>
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Modelo do tarifário — only when variavel */}
                    {tipoCobranca === "variavel" && (
                      <>
                        <div className="flex flex-col gap-[8px]">
                          <p className="font-['Helvetica_Neue:Regular',sans-serif] text-[14px] text-[#181d27]">Modelo do tarifário</p>
                          <div className="flex gap-[4px] bg-white rounded-[8px] border border-[#e9eaeb] p-[4px]">
                            {([
                              { value: "tipo", label: "Por tipo (faixa etária)" },
                              { value: "lote", label: "Por lote / grupo" },
                              { value: "dia", label: "Por tipo de dia" },
                            ] as const).map((opt) => (
                              <button key={opt.value} type="button" onClick={() => setModeloTarifario(opt.value)} className={`flex-1 rounded-[6px] px-[12px] py-[6px] text-[13px] transition-all cursor-pointer ${modeloTarifario === opt.value ? "font-['Helvetica_Neue:Medium',sans-serif] bg-[#0b5ed7] text-white shadow-sm" : "font-['Helvetica_Neue:Regular',sans-serif] text-[#535862] hover:text-[#252b37] hover:bg-[#f8fafc]"}`}>
                                {opt.label}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Tarifas cards — por tipo (faixa etária) */}
                        {modeloTarifario === "tipo" && (
                        <div className="flex flex-col gap-[8px]">
                          <p className="font-['Helvetica_Neue:Regular',sans-serif] text-[14px] text-[#181d27]">Tarifas</p>
                          <div className="flex flex-col gap-[10px]">
                            {tarifas.map((tarifa, idx) => {
                              const subtitle = [
                                tarifa.preco ? `R$ ${tarifa.preco}` : "Sem preço",
                                tarifa.idadeIni || tarifa.idadeFim ? `${tarifa.idadeIni || "0"}–${tarifa.idadeFim || "99"} anos` : "sem faixa etária",
                                `${tarifa.minQty || "0"}–${tarifa.maxQty || "0"} por reserva`,
                              ].join(", ");
                              return (
                                <div key={idx} className="flex items-center gap-3 rounded-lg border border-border bg-muted/40 p-3 transition-[opacity,background-color,border-color]">
                                  <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                                    <span className="text-sm font-medium">{tarifa.label || "Tarifa sem rótulo"}</span>
                                    <span className="text-muted-foreground text-xs truncate">{subtitle}</span>
                                  </div>
                                  <div className="flex shrink-0 items-center gap-2.5">
                                    <button type="button" onClick={() => { const tarifa = tarifas[idx] ?? { label: "", preco: "", idadeIni: "", idadeFim: "", minQty: "", maxQty: "" }; setTarifaDraft({ label: tarifa.label, preco: tarifa.preco, idadeIni: tarifa.idadeIni, idadeFim: tarifa.idadeFim, minQty: tarifa.minQty, maxQty: tarifa.maxQty }); setTarifaDrawerIdx(idx); }} className="flex size-8 cursor-pointer items-center justify-center rounded-md border border-border text-primary transition-colors hover:bg-primary/10">
                                      <svg className="size-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"><path d="M16.4249 4.60509L17.4149 3.6151C18.2351 2.79497 19.5648 2.79497 20.3849 3.6151C21.205 4.43524 21.205 5.76493 20.3849 6.58507L19.3949 7.57506M16.4249 4.60509L9.76558 11.2644C9.25807 11.772 8.89804 12.4078 8.72397 13.1041L8 16L10.8959 15.276C11.5922 15.102 12.228 14.7419 12.7356 14.2344L19.3949 7.57506M16.4249 4.60509L19.3949 7.57506" /><path d="M18.9999 13.5C18.9999 16.7875 18.9999 18.4312 18.092 19.5376C17.9258 19.7401 17.7401 19.9258 17.5375 20.092C16.4312 21 14.7874 21 11.4999 21H11C7.22876 21 5.34316 21 4.17159 19.8284C3.00003 18.6569 3 16.7712 3 13V12.5C3 9.21252 3 7.56879 3.90794 6.46244C4.07417 6.2599 4.2599 6.07417 4.46244 5.90794C5.56879 5 7.21252 5 10.5 5" strokeLinecap="round" /></svg>
                                    </button>
                                    {tarifas.length > 1 && (
                                      <button type="button" onClick={() => setTarifas((prev) => prev.filter((_, i) => i !== idx))} className="flex size-8 cursor-pointer items-center justify-center rounded-md border border-border text-destructive transition-colors hover:bg-destructive/10">
                                        <svg className="size-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19.5 5.5L18.613 15.413C18.377 17.989 18.259 19.277 17.55 20.138C17.1 20.694 16.518 21.124 15.86 21.39C14.882 21.777 13.592 21.777 11.012 21.777C8.428 21.777 7.136 21.777 6.157 21.388C5.499 21.121 4.918 20.69 4.468 20.132C3.761 19.268 3.646 17.976 3.416 15.391L2.5 5.5"/><path d="M21 5.5H3"/><path d="M16.056 5.5L15.373 4.098C14.921 3.166 14.695 2.7 14.327 2.39C14.2 2.283 14.063 2.189 13.917 2.11C13.51 1.9 13.04 1.9 12.101 1.9C11.139 1.9 10.658 1.9 10.243 2.118C10.094 2.2 9.956 2.297 9.828 2.408C9.456 2.727 9.234 3.207 8.79 4.166L8.174 5.5"/></svg>
                                      </button>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                            <button type="button" onClick={() => setTarifas((prev) => [...prev, { label: "", preco: "", idadeIni: "", idadeFim: "", minQty: "1", maxQty: "10" }])} className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-border py-2.5 text-sm font-medium text-primary transition-colors hover:bg-muted/50 cursor-pointer">
                              <svg className="size-[16px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>
                              Adicionar tarifa
                            </button>
                          </div>
                        </div>
                        )}

                        {/* Lotes cards — por lote / grupo */}
                        {modeloTarifario === "lote" && (
                          <div className="flex flex-col gap-[8px]">
                            <p className="font-['Helvetica_Neue:Regular',sans-serif] text-[14px] text-[#181d27]">Faixas de lote</p>
                            <div className="flex flex-col gap-[10px]">
                              {lotes.map((lote, idx) => {
                                const subtitle = [
                                  lote.preco ? `R$ ${lote.preco}` : "Sem preço",
                                  `${lote.de || "0"}–${lote.ate || "0"} participantes`,
                                ].join(", ");
                                return (
                                  <div key={idx} className="flex items-center gap-3 rounded-lg border border-border bg-muted/40 p-3 transition-[opacity,background-color,border-color]">
                                    <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                                      <span className="text-sm font-medium">{lote.label || "Lote sem rótulo"}</span>
                                      <span className="text-muted-foreground text-xs truncate">{subtitle}</span>
                                    </div>
                                    <div className="flex shrink-0 items-center gap-2.5">
                                      <button type="button" onClick={() => { const lote = lotes[idx] ?? { label: "", de: "", ate: "", preco: "" }; setLoteDraft({ label: lote.label, de: lote.de, ate: lote.ate, preco: lote.preco }); setLoteDrawerIdx(idx); }} className="flex size-8 cursor-pointer items-center justify-center rounded-md border border-border text-primary transition-colors hover:bg-primary/10">
                                        <svg className="size-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"><path d="M16.4249 4.60509L17.4149 3.6151C18.2351 2.79497 19.5648 2.79497 20.3849 3.6151C21.205 4.43524 21.205 5.76493 20.3849 6.58507L19.3949 7.57506M16.4249 4.60509L9.76558 11.2644C9.25807 11.772 8.89804 12.4078 8.72397 13.1041L8 16L10.8959 15.276C11.5922 15.102 12.228 14.7419 12.7356 14.2344L19.3949 7.57506M16.4249 4.60509L19.3949 7.57506" /><path d="M18.9999 13.5C18.9999 16.7875 18.9999 18.4312 18.092 19.5376C17.9258 19.7401 17.7401 19.9258 17.5375 20.092C16.4312 21 14.7874 21 11.4999 21H11C7.22876 21 5.34316 21 4.17159 19.8284C3.00003 18.6569 3 16.7712 3 13V12.5C3 9.21252 3 7.56879 3.90794 6.46244C4.07417 6.2599 4.2599 6.07417 4.46244 5.90794C5.56879 5 7.21252 5 10.5 5" strokeLinecap="round" /></svg>
                                      </button>
                                      {lotes.length > 1 && (
                                        <button type="button" onClick={() => setLotes((prev) => prev.filter((_, i) => i !== idx))} className="flex size-8 cursor-pointer items-center justify-center rounded-md border border-border text-destructive transition-colors hover:bg-destructive/10">
                                          <svg className="size-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19.5 5.5L18.613 15.413C18.377 17.989 18.259 19.277 17.55 20.138C17.1 20.694 16.518 21.124 15.86 21.39C14.882 21.777 13.592 21.777 11.012 21.777C8.428 21.777 7.136 21.777 6.157 21.388C5.499 21.121 4.918 20.69 4.468 20.132C3.761 19.268 3.646 17.976 3.416 15.391L2.5 5.5"/><path d="M21 5.5H3"/><path d="M16.056 5.5L15.373 4.098C14.921 3.166 14.695 2.7 14.327 2.39C14.2 2.283 14.063 2.189 13.917 2.11C13.51 1.9 13.04 1.9 12.101 1.9C11.139 1.9 10.658 1.9 10.243 2.118C10.094 2.2 9.956 2.297 9.828 2.408C9.456 2.727 9.234 3.207 8.79 4.166L8.174 5.5"/></svg>
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                );
                              })}
                              <button type="button" onClick={() => setLotes((prev) => [...prev, { label: "", de: "", ate: "", preco: "" }])} className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-border py-2.5 text-sm font-medium text-primary transition-colors hover:bg-muted/50 cursor-pointer">
                                <svg className="size-[16px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>
                                Adicionar faixa
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Regras por tipo de dia */}
                        {modeloTarifario === "dia" && (
                          <div className="flex flex-col gap-[8px]">
                            <p className="font-['Helvetica_Neue:Regular',sans-serif] text-[14px] text-[#181d27]">Regras por tipo de dia</p>
                            <div className="flex items-center gap-[8px]">
                              <div className="relative flex-1 min-w-0">
                                <button
                                  type="button"
                                  onClick={() => setDiaTipoDropdownOpen(!diaTipoDropdownOpen)}
                                  className={`flex items-center justify-between h-[40px] w-full rounded-[8px] border bg-[#fbfcfd] px-[12px] transition-colors cursor-pointer ${diaTipoDropdownOpen ? "border-[#0b5ed7] bg-white" : "border-[#e9eaeb]"}`}
                                >
                                  <span className={`font-['Helvetica_Neue:Regular',sans-serif] text-[14px] ${diaTipoSelecionado ? "text-[#252b37]" : "text-[#a4a7ae]"}`}>
                                    {diaTipoSelecionado ? ({ "seg-sex": "Seg. a Sex.", "sab-dom": "Sáb. e Dom.", feriados: "Feriados", personalizado: "Personalizado" } as Record<string, string>)[diaTipoSelecionado] : "Selecione o tipo de dia"}
                                  </span>
                                  <HugeiconsIcon icon={ArrowDown01Icon} size={16} className={`text-[#a4a7ae] transition-transform ${diaTipoDropdownOpen ? "rotate-180" : ""}`} />
                                </button>
                                {diaTipoDropdownOpen && (
                                  <>
                                    <div className="fixed inset-0 z-[60]" onClick={() => setDiaTipoDropdownOpen(false)} />
                                    <div className="absolute left-0 right-0 top-[44px] z-[61] rounded-[8px] border border-[#e9eaeb] bg-white shadow-[0px_4px_16px_0px_rgba(0,0,0,0.12)] py-[4px]">
                                      {[
                                        { value: "seg-sex", label: "Seg. a Sex." },
                                        { value: "sab-dom", label: "Sáb. e Dom." },
                                        { value: "feriados", label: "Feriados" },
                                        { value: "personalizado", label: "Personalizado" },
                                      ].map((opt) => {
                                        const isDisabled = ["seg-sex", "sab-dom"].includes(opt.value) && diaRegras.some((r) => r.tipo === opt.value);
                                        return (
                                          <button
                                            key={opt.value}
                                            type="button"
                                            disabled={isDisabled}
                                            onClick={() => { setDiaTipoSelecionado(opt.value); setDiaTipoDropdownOpen(false); }}
                                            className={`flex w-full px-[12px] py-[8px] text-left font-['Helvetica_Neue:Regular',sans-serif] text-[13px] transition-colors ${isDisabled ? "text-[#d0d5dd] cursor-not-allowed" : diaTipoSelecionado === opt.value ? "text-[#0b5ed7] bg-[#f0f5ff] cursor-pointer" : "text-[#252b37] hover:bg-[#f8fafc] cursor-pointer"}`}
                                          >
                                            {opt.label}
                                          </button>
                                        );
                                      })}
                                    </div>
                                  </>
                                )}
                              </div>
                              <div className="relative shrink-0 w-[160px]">
                                <span className="absolute left-[12px] top-1/2 -translate-y-1/2 font-['Helvetica_Neue:Regular',sans-serif] text-[14px] text-[#717680]">R$</span>
                                <input className={`${fieldClass} pl-[36px]`} inputMode="numeric" value={diaPrecoInput} onChange={(e) => {
                                  const raw = e.target.value.replace(/\D/g, "");
                                  const cents = parseInt(raw || "0", 10);
                                  setDiaPrecoInput(new Intl.NumberFormat("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(cents / 100));
                                }} placeholder="0,00" />
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  if (!diaTipoSelecionado || !diaPrecoInput.trim()) return;
                                  if (diaTipoSelecionado === "personalizado" && !diaPersonalizadoDias.some(Boolean)) return;
                                  const dias = ["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SÁB"];
                                  const tipoKey = diaTipoSelecionado === "personalizado"
                                    ? `custom-${diaPersonalizadoDias.map((v, i) => v ? dias[i] : "").filter(Boolean).join(", ")}`
                                    : diaTipoSelecionado;
                                  setDiaRegras((prev) => [...prev, { tipo: tipoKey, preco: diaPrecoInput }]);
                                  setDiaTipoSelecionado("");
                                  setDiaPrecoInput("");
                                  setDiaPersonalizadoDias([false, false, false, false, false, false, false]);
                                }}
                                className="flex items-center gap-[6px] shrink-0 font-['Helvetica_Neue:Medium',sans-serif] text-[13px] text-[#0b5ed7] hover:text-[#084fb7] cursor-pointer transition-colors"
                              >
                                <svg className="size-[14px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
                                Adicionar
                              </button>
                            </div>
                            {diaTipoSelecionado === "personalizado" && (
                              <div className="flex gap-[6px]">
                                {["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SÁB"].map((dia, idx) => (
                                  <button
                                    key={idx}
                                    type="button"
                                    onClick={() => setDiaPersonalizadoDias((prev) => prev.map((v, i) => i === idx ? !v : v))}
                                    className={`flex h-[36px] items-center justify-center rounded-[8px] border px-[10px] text-[13px] transition-all cursor-pointer ${diaPersonalizadoDias[idx] ? "font-['Helvetica_Neue:Medium',sans-serif] border-[#0b5ed7] bg-[#f0f5ff] text-[#0b5ed7]" : "font-['Helvetica_Neue:Regular',sans-serif] border-[#e9eaeb] bg-white text-[#535862] hover:border-[#d0d5dd]"}`}
                                  >
                                    {dia}
                                  </button>
                                ))}
                              </div>
                            )}
                            {diaRegras.length > 0 && (
                              <div className="flex flex-wrap gap-[6px]">
                                {diaRegras.map((regra, idx) => {
                                  const labelMap: Record<string, string> = { "seg-sex": "Seg. a Sex.", "sab-dom": "Sáb. e Dom.", feriados: "Feriados" };
                                  const chipLabel = regra.tipo.startsWith("custom-") ? regra.tipo.replace("custom-", "") : (labelMap[regra.tipo] || regra.tipo);
                                  return (
                                    <span key={idx} className="inline-flex items-center gap-[6px] rounded-full bg-[#e8f0fe] px-[10px] py-[4px] font-['Helvetica_Neue:Regular',sans-serif] text-[12px] text-[#0b5ed7]">
                                      {chipLabel}: R$ {regra.preco}
                                      <button type="button" onClick={() => setDiaRegras((prev) => prev.filter((_, i) => i !== idx))} className="cursor-pointer hover:text-[#084fb7] transition-colors">
                                        <svg className="size-[12px]" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M3 3l6 6M9 3l-6 6" /></svg>
                                      </button>
                                    </span>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        )}
                      </>
                    )}

                    {tipoCobranca === "fixo" && (
                      <div className="flex flex-col gap-[6px]">
                        <p className="font-['Helvetica_Neue:Regular',sans-serif] text-[14px] text-[#181d27]">Valor único do produto</p>
                        <div className="relative">
                          <span className="absolute left-[12px] top-1/2 -translate-y-1/2 font-['Helvetica_Neue:Regular',sans-serif] text-[14px] text-[#717680]">R$</span>
                          <input className={`${fieldClass} pl-[36px]`} inputMode="numeric" value={valorUnicoProduto} onChange={(e) => setValorUnicoProduto(e.target.value)} placeholder="0,00" />
                        </div>
                        <p className="font-['Helvetica_Neue:Regular',sans-serif] text-[12px] text-[#717680]">Valor fixo, sem variação por configuração.</p>
                      </div>
                    )}
                    {tipoCobranca === "exclusivo_item" && (
                      <div className="grid grid-cols-2 gap-[12px]">
                        <div className="flex flex-col gap-[6px]">
                          <p className="font-['Helvetica_Neue:Regular',sans-serif] text-[14px] text-[#181d27]">Proxy de pagamento</p>
                          <div className="relative">
                            <button
                              type="button"
                              onClick={() => setProxyDropdownOpen(!proxyDropdownOpen)}
                              className={`flex items-center justify-between h-[40px] w-full rounded-[8px] border bg-[#fbfcfd] px-[12px] transition-colors cursor-pointer ${proxyDropdownOpen ? "border-[#0b5ed7] bg-white" : "border-[#e9eaeb]"}`}
                            >
                              <span className={`font-['Helvetica_Neue:Regular',sans-serif] text-[14px] ${proxyPagamento ? "text-[#252b37]" : "text-[#a4a7ae]"}`}>
                                {proxyPagamento || "Selecione"}
                              </span>
                              <HugeiconsIcon icon={ArrowDown01Icon} size={16} className={`text-[#a4a7ae] transition-transform ${proxyDropdownOpen ? "rotate-180" : ""}`} />
                            </button>
                            {proxyDropdownOpen && (
                              <>
                                <div className="fixed inset-0 z-[60]" onClick={() => setProxyDropdownOpen(false)} />
                                <div className="absolute left-0 right-0 top-[44px] z-[61] rounded-[8px] border border-[#e9eaeb] bg-white shadow-[0px_4px_16px_0px_rgba(0,0,0,0.12)] py-[4px]">
                                  {["Stripe", "PagSeguro", "Mercado Pago", "PayPal", "Pix direto", "Boleto bancário"].map((opt) => (
                                    <button
                                      key={opt}
                                      type="button"
                                      onClick={() => { setProxyPagamento(opt); setProxyDropdownOpen(false); }}
                                      className={`flex w-full px-[12px] py-[8px] text-left font-['Helvetica_Neue:Regular',sans-serif] text-[13px] transition-colors cursor-pointer ${proxyPagamento === opt ? "text-[#0b5ed7] bg-[#f0f5ff]" : "text-[#252b37] hover:bg-[#f8fafc]"}`}
                                    >
                                      {opt}
                                    </button>
                                  ))}
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-col gap-[6px]">
                          <p className="font-['Helvetica_Neue:Regular',sans-serif] text-[14px] text-[#181d27]">Parcelas no cartão</p>
                          <input className={fieldClass} inputMode="numeric" value={parcelasCartao} onChange={(e) => setParcelasCartao(e.target.value.replace(/\D/g, ""))} placeholder="Ex: 12" />
                        </div>
                      </div>
                    )}
                    {tipoCobranca === "exclusivo_carrinho" && (
                      <div className="flex items-center gap-[10px] bg-[#f8f9fc] border border-[#f5f5f5] rounded-[10px] px-[12px] py-[8px]">
                        <svg className="size-[24px] shrink-0" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="11" fill="#4A7BF7" opacity="0.15" /><circle cx="12" cy="12" r="8" fill="#4A7BF7" /><path d="M12 16v-4M12 8h.01" stroke="white" strokeWidth="2" strokeLinecap="round" /></svg>
                        <p className="font-['Helvetica_Neue:Regular',sans-serif] text-[12px] text-[#414651] leading-[14px]">Cobrança por carrinho: valor fechado para o grupo, definido na aba Financeiro. O tarifário não se aplica. Para cobrar por participante, use Variável (tarifário).</p>
                      </div>
                    )}

                  </div>
                </section>
              </div>

              {/* Right column */}
              <div className="flex flex-col gap-[16px]">
                <div className="rounded-xl border border-[#e9eaeb] bg-white shadow-sm px-4 pt-4 pb-4">
                  <p className="font-['Helvetica_Neue:Regular',sans-serif] text-[16px] text-[#181d27] mb-[12px]">Configurações de pagamento</p>
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex flex-col gap-[2px]">
                      <span className="font-['Helvetica_Neue:Regular',sans-serif] text-[14px] text-[#181d27]">Possui entrada?</span>
                      <span className="font-['Helvetica_Neue:Regular',sans-serif] text-[12px] text-[#717680]">Cobrar um valor de entrada no momento da reserva</span>
                    </div>
                    <Switch checked={possuiEntrada} onCheckedChange={setPossuiEntrada} />
                  </div>
                  {possuiEntrada && (
                    <div className="flex flex-col gap-[12px] mt-[12px]">
                      {/* Tipo */}
                      <div className="flex flex-col gap-[6px]">
                        <p className="font-['Helvetica_Neue:Regular',sans-serif] text-[14px] text-[#181d27]">Tipo</p>
                        <div className="flex gap-[4px] rounded-[8px] border border-[#e9eaeb] bg-white p-[4px]">
                          {([
                            { value: "porcentagem", label: "Porcentagem" },
                            { value: "valor_fixo", label: "Valor fixo" },
                          ] as const).map((opt) => (
                            <button
                              key={opt.value}
                              type="button"
                              onClick={() => setEntradaTipo(opt.value)}
                              className={`flex-1 rounded-[6px] px-[12px] py-[6px] text-[13px] transition-all cursor-pointer ${entradaTipo === opt.value ? "font-['Helvetica_Neue:Medium',sans-serif] bg-[#0b5ed7] text-white shadow-sm" : "font-['Helvetica_Neue:Regular',sans-serif] text-[#535862] hover:text-[#252b37] hover:bg-[#f8fafc]"}`}
                            >
                              {opt.label}
                            </button>
                          ))}
                        </div>
                      </div>
                      {/* Valor */}
                      <div className="flex flex-col gap-[6px]">
                        <p className="font-['Helvetica_Neue:Regular',sans-serif] text-[14px] text-[#181d27]">Valor</p>
                        <input className={fieldClass} value={entradaValor} onChange={(e) => setEntradaValor(e.target.value)} placeholder={entradaTipo === "porcentagem" ? "Ex: 30%" : "Ex: 50,00"} />
                      </div>
                      {/* Data limite */}
                      <div className="flex flex-col gap-[6px]">
                        <p className="font-['Helvetica_Neue:Regular',sans-serif] text-[14px] text-[#181d27]">Data limite</p>
                        <input className={fieldClass} value={entradaDataLimite} onChange={(e) => setEntradaDataLimite(e.target.value)} placeholder="dd/mm/aaaa" />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );

        case "opcionais":
          if (!showOpcionais) {
            return (
              <div>
                <h2 className="font-['Helvetica_Neue:Medium',sans-serif] text-[18px] text-[#181d27]">Opcionais</h2>
                <p className="mt-[4px] font-['Helvetica_Neue:Regular',sans-serif] text-[14px] text-[#717680]">Itens adicionais que o cliente pode incluir na compra.</p>
                <div className="mt-[16px] rounded-xl border border-[#e9eaeb] bg-white p-[24px] shadow-sm">
                  <p className="font-['Helvetica_Neue:Regular',sans-serif] text-[13px] text-[#717680]">Não se aplica para o tipo "{form.tipo}".</p>
                </div>
              </div>
            );
          }
          return (
            <div>
              <h2 className="font-['Helvetica_Neue:Medium',sans-serif] text-[18px] text-[#181d27]">Opcionais</h2>
              <p className="mt-[4px] font-['Helvetica_Neue:Regular',sans-serif] text-[14px] text-[#717680]">Itens adicionais que o cliente pode incluir na compra.</p>
              <div className="mt-[16px] rounded-xl border border-[#e9eaeb] bg-white shadow-sm">
                <div className="flex flex-col gap-[10px] p-[20px]">
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
              </div>
            </div>
          );

        case "pagamento":
          return (
            <div>
              <div className="rounded-xl border border-[#e9eaeb] bg-white shadow-sm">
                <div className="px-4 pt-4 pb-0">
                  <h2 className="font-['Helvetica_Neue:Regular',sans-serif] text-[16px] text-[#181d27]">Formas de pagamento</h2>
                </div>
                <div className="flex flex-col gap-[20px] px-4 pb-4 pt-3">
                  {/* Proxy de pagamento */}
                  <div className="flex flex-col gap-[6px]">
                    <p className="font-['Helvetica_Neue:Regular',sans-serif] text-[14px] text-[#181d27]">Proxy de pagamento</p>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setPagProxyDropdownOpen(!pagProxyDropdownOpen)}
                        className={`flex items-center justify-between h-[40px] w-full rounded-[8px] border bg-[#fbfcfd] px-[12px] transition-colors cursor-pointer ${pagProxyDropdownOpen ? "border-[#0b5ed7] bg-white" : "border-[#e9eaeb]"}`}
                      >
                        <span className={`font-['Helvetica_Neue:Regular',sans-serif] text-[14px] ${pagProxyPagamento ? "text-[#252b37]" : "text-[#a4a7ae]"}`}>
                          {pagProxyPagamento || "Selecione (cadastrado em Integrações)"}
                        </span>
                        <HugeiconsIcon icon={ArrowDown01Icon} size={16} className={`text-[#a4a7ae] transition-transform ${pagProxyDropdownOpen ? "rotate-180" : ""}`} />
                      </button>
                      {pagProxyDropdownOpen && (
                        <>
                          <div className="fixed inset-0 z-[60]" onClick={() => setPagProxyDropdownOpen(false)} />
                          <div className="absolute left-0 right-0 top-[44px] z-[61] rounded-[8px] border border-[#e9eaeb] bg-white shadow-[0px_4px_16px_0px_rgba(0,0,0,0.12)] py-[4px]">
                            {["Stripe", "PagSeguro", "Mercado Pago", "PayPal", "Pix direto", "Boleto bancário"].map((opt) => (
                              <button
                                key={opt}
                                type="button"
                                onClick={() => { setPagProxyPagamento(opt); setPagProxyDropdownOpen(false); }}
                                className={`flex w-full px-[12px] py-[8px] text-left font-['Helvetica_Neue:Regular',sans-serif] text-[13px] transition-colors cursor-pointer ${pagProxyPagamento === opt ? "text-[#0b5ed7] bg-[#f0f5ff]" : "text-[#252b37] hover:bg-[#f8fafc]"}`}
                              >
                                {opt}
                              </button>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                  {/* Formas aceitas */}
                  <div className="flex flex-col gap-[6px]">
                    <p className="font-['Helvetica_Neue:Regular',sans-serif] text-[14px] text-[#181d27]">Formas aceitas</p>
                    <div className="grid grid-cols-2 gap-[8px]">
                      {([
                        { id: "Cartão de crédito", icon: <svg className="size-[20px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10H2M14.5 14.5H17.5" /><path d="M5.75 5H18.25C20.3211 5 22 6.67893 22 8.75V16.25C22 18.3211 20.3211 20 18.25 20H5.75C3.67893 20 2 18.3211 2 16.25V8.75C2 6.67893 3.67893 5 5.75 5Z" /></svg>, subtitle: "Débito e crédito via gateway" },
                        { id: "Pix", icon: <svg className="size-[20px]" viewBox="0 0 24 24"><path fillRule="evenodd" clipRule="evenodd" d="M20.1008 8.60234C20.4769 8.97838 20.8227 9.32422 21.0883 9.63776C21.3748 9.97422 21.6571 10.3732 21.8227 10.8815C22.0591 11.6083 22.0591 12.3912 21.8227 13.118C21.6571 13.6274 21.3748 14.0263 21.0883 14.3628C20.8227 14.6753 20.4769 15.0222 20.1008 15.3982L15.3978 20.1013C15.0654 20.4436 14.72 20.773 14.3624 21.0888C14.026 21.3753 13.626 21.6576 13.1177 21.8232C12.3908 22.0589 11.6081 22.0589 10.8813 21.8232C10.373 21.6576 9.97505 21.3753 9.63651 21.0888C9.32402 20.8232 8.9782 20.4774 8.60216 20.1013L3.89915 15.3982C3.55694 15.0657 3.22754 14.7204 2.91167 14.3628C2.62522 14.0263 2.34294 13.6274 2.17732 13.118C1.94089 12.3912 1.94089 11.6083 2.17732 10.8815C2.34294 10.3732 2.62522 9.97526 2.91167 9.63776C3.17625 9.32526 3.52208 8.97838 3.89915 8.60234L8.60216 3.8992C8.9782 3.52316 9.32402 3.17732 9.63651 2.9117C9.97401 2.62524 10.373 2.34295 10.8813 2.17732C11.608 1.94089 12.391 1.94089 13.1177 2.17732C13.627 2.34295 14.026 2.62524 14.3624 2.9117C14.6749 3.17732 15.0208 3.52212 15.3978 3.8992L20.1008 8.60234ZM17.6603 8.35547H16.0843C15.9657 8.35547 15.8488 8.35695 15.7413 8.43403C15.6339 8.51611 15.5385 8.55698 15.4614 8.64713L13.4343 10.8763C13.2527 11.0763 13.0313 11.2361 12.7843 11.3455C12.5373 11.4548 12.2701 11.5113 12 11.5113C11.7299 11.5113 11.4627 11.4548 11.2157 11.3455C10.9687 11.2361 10.7473 11.0763 10.5657 10.8763L8.53758 8.64713C8.46061 8.55698 8.36533 8.48433 8.2581 8.43403C8.15087 8.38373 8.03415 8.35695 7.91572 8.35547H6.33868L5.0335 9.66068C4.21477 10.4794 3.8054 10.8888 3.65228 11.3617C3.51859 11.7769 3.51859 12.2236 3.65228 12.6388C3.8054 13.1107 4.21477 13.5211 5.0335 14.3399L6.33868 15.6451H7.91572C8.03415 15.6434 8.15087 15.6166 8.2581 15.5663C8.36533 15.516 8.46061 15.4434 8.53758 15.3534L10.5657 13.1242C10.7473 12.9242 10.9687 12.7644 11.2157 12.6551C11.4627 12.5457 11.7299 12.4892 12 12.4892C12.2701 12.4892 12.5373 12.5457 12.7843 12.6551C13.0313 12.7644 13.2527 12.9242 13.4343 13.1242L15.4614 15.3534C15.5385 15.4434 15.635 15.516 15.7424 15.5663C15.8498 15.6166 15.9657 15.6434 16.0843 15.6451H17.6603L18.9655 14.3399C19.7852 13.5211 20.1946 13.1117 20.3477 12.6388C20.4831 12.2242 20.4831 11.7763 20.3477 11.3617C20.1946 10.8898 19.7852 10.4794 18.9655 9.66068L17.6603 8.35547ZM16.1093 6.80442H16.0843C15.4051 6.80442 14.7697 7.10234 14.3135 7.60338L12.2875 9.83359C12.2514 9.87375 12.2072 9.90585 12.1578 9.92783C12.1085 9.9498 12.0551 9.96116 12.001 9.96116C11.947 9.96116 11.8936 9.9498 11.8443 9.92783C11.7949 9.90585 11.7507 9.87375 11.7146 9.83359L9.68547 7.60442C9.46256 7.35478 9.18981 7.15462 8.88482 7.01683C8.57983 6.87904 8.24935 6.80668 7.91468 6.80442H7.88968L9.66047 5.03358C10.4792 4.21483 10.8896 3.80545 11.3604 3.65233C11.7771 3.51691 12.224 3.51691 12.6385 3.65233C13.1114 3.80545 13.5208 4.21483 14.3395 5.03462L16.1093 6.80442ZM16.0843 17.1961H16.1093L14.3385 18.967C13.5208 19.7857 13.1114 20.1951 12.6385 20.3482C12.224 20.4836 11.776 20.4836 11.3604 20.3482C10.8886 20.1951 10.4792 19.7857 9.66047 18.9659L7.88968 17.1951H7.91572C8.59487 17.1951 9.22923 16.8982 9.68547 16.3972L11.7135 14.1669C11.7497 14.1268 11.7939 14.0947 11.8432 14.0727C11.8926 14.0507 11.946 14.0394 12 14.0394C12.054 14.0394 12.1074 14.0507 12.1568 14.0727C12.2061 14.0947 12.2503 14.1268 12.2865 14.1669L14.3145 16.3961C14.5374 16.6458 14.8102 16.8459 15.1152 16.9837C15.4202 17.1215 15.7507 17.1939 16.0853 17.1961" fill="currentColor" /></svg>, subtitle: "Pagamento instantâneo" },
                        { id: "Boleto", icon: <svg className="size-[20px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 4V20" /><path d="M5 4V20" /><path d="M15 4V20" /><path d="M8 18V6C8 5.05719 8 4.58579 8.29289 4.29289C8.58579 4 9.05719 4 10 4C10.9428 4 11.4142 4 11.7071 4.29289C12 4.58579 12 5.05719 12 6V18C12 18.9428 12 19.4142 11.7071 19.7071C11.4142 20 10.9428 20 10 20C9.05719 20 8.58579 20 8.29289 19.7071C8 19.4142 8 18.9428 8 18Z" /><path d="M18 18V6C18 5.05719 18 4.58579 18.2929 4.29289C18.5858 4 19.0572 4 20 4C20.9428 4 21.4142 4 21.7071 4.29289C22 4.58579 22 5.05719 22 6V18C22 18.9428 22 19.4142 21.7071 19.7071C21.4142 20 20.9428 20 20 20C19.0572 20 18.5858 20 18.2929 19.7071C18 19.4142 18 18.9428 18 18Z" /></svg>, subtitle: "Compensação em até 3 dias" },
                        { id: "Dinheiro", icon: <svg className="size-[20px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2.01758 15C4.21715 15 6.00025 16.7831 6.00025 18.9827" /><path d="M18 18.9827V18.8908C18 16.742 19.742 15 21.8908 15" /><path d="M6.00025 5.01562C6.00025 7.2152 4.21715 8.9983 2.01758 8.9983" /><path d="M18 5.01562C18 7.19594 19.769 8.96705 21.9423 8.99789" /><path d="M16 5H8C5.17157 5 3.75736 5 2.87868 5.87868C2 6.75736 2 8.17157 2 11V13C2 15.8284 2 17.2426 2.87868 18.1213C3.75736 19 5.17157 19 8 19H16C18.8284 19 20.2426 19 21.1213 18.1213C22 17.2426 22 15.8284 22 13V11C22 8.17157 22 6.75736 21.1213 5.87868C20.2426 5 18.8284 5 16 5Z" /><path d="M15 12C15 13.6569 13.6569 15 12 15C10.3431 15 9 13.6569 9 12C9 10.3431 10.3431 9 12 9C13.6569 9 15 10.3431 15 12Z" /></svg>, subtitle: "Pagamento presencial" },
                      ] as const).map((forma) => {
                        const isActive = pagFormasAceitas.has(forma.id);
                        return (
                          <button
                            key={forma.id}
                            type="button"
                            onClick={() => setPagFormasAceitas((prev) => { const next = new Set(prev); if (next.has(forma.id)) next.delete(forma.id); else next.add(forma.id); return next; })}
                            className={`cursor-pointer flex items-start gap-[10px] rounded-[10px] border px-[14px] py-[12px] transition-all text-left ${isActive ? "border-[#0b5ed7] bg-[#f0f5ff]" : "border-[#e9eaeb] bg-white hover:bg-[#f8fafc]"}`}
                          >
                            <div className={`shrink-0 mt-[1px] ${isActive ? "text-[#0b5ed7]" : "text-[#717680]"}`}>{forma.icon}</div>
                            <div className="flex flex-col gap-[2px] min-w-0">
                              <span className={`font-['Helvetica_Neue:Medium',sans-serif] text-[13px] ${isActive ? "text-[#0b5ed7]" : "text-[#252b37]"}`}>{forma.id}</span>
                              <span className={`font-['Helvetica_Neue:Regular',sans-serif] text-[11px] ${isActive ? "text-[#0b5ed7]/70" : "text-[#717680]"}`}>{forma.subtitle}</span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  {/* Parcelas no cartão */}
                  {pagFormasAceitas.has("Cartão de crédito") && (
                    <div className="flex flex-col gap-[6px]">
                      <p className="font-['Helvetica_Neue:Regular',sans-serif] text-[14px] text-[#181d27]">Parcelas no cartão</p>
                      <input className={`${fieldClass} w-[120px]`} inputMode="numeric" value={pagParcelas} onChange={(e) => setPagParcelas(e.target.value.replace(/\D/g, ""))} placeholder="12" />
                      <p className="font-['Helvetica_Neue:Regular',sans-serif] text-[12px] text-[#717680]">Quantidade máxima de parcelas.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        case "canais":
          return renderPlaceholderSection("Canais e visibilidade", "Defina onde o produto será exibido e vendido.");
        case "exigencias":
          return renderPlaceholderSection("Exigências de participação", "Requisitos que os participantes devem atender.");
        case "termos":
          return renderPlaceholderSection("Termos e contratos", "Documentos e termos associados ao produto.");
        case "comunicacao":
          return renderPlaceholderSection("Comunicação", "Mensagens automáticas e notificações.");
        default:
          return null;
      }
    };

    return (
      <div className="fixed inset-0 z-50 flex flex-col bg-[#f8fafc]">
        {/* Header — logo + title + save + close */}
        <div className="flex h-[56px] shrink-0 items-center border-b border-[#e9eaeb] bg-white px-[20px]">
          <div className="flex items-center gap-[16px]">
            <img src="/src/assets/retrilhar-logo.png" alt="Retrilhar" className="h-[24px]" />
            <div className="h-[20px] w-px bg-[#e9eaeb]" />
            <p className="font-['Helvetica_Neue:Regular',sans-serif] text-[14px] text-[#252b37]">
              {form.nome.trim() || (mode === "new" ? "Novo produto" : "Editar produto")}
            </p>
          </div>
          <div className="ml-auto flex items-center gap-[10px]">
            <button
              type="button"
              onClick={(e) => saveProduto(e as unknown as FormEvent)}
              className="flex cursor-pointer items-center gap-[6px] rounded-[8px] bg-[#0b5ed7] px-[14px] py-[8px] font-['Helvetica_Neue:Medium',sans-serif] text-[13px] text-white transition-colors hover:bg-[#084fb7]"
            >
              {form.status === "Ativo" ? "Publicar produto" : "Salvar"}
            </button>
            <button
              type="button"
              onClick={closeForm}
              className="flex cursor-pointer items-center gap-[6px] rounded-[8px] border border-[#e9eaeb] bg-white px-[14px] py-[8px] transition-colors hover:bg-[#f8fafc]"
            >
              <svg className="size-[14px]" fill="none" viewBox="0 0 18 18">
                <path d="M4 4l10 10M14 4L4 14" stroke="#717680" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <p className="font-['Helvetica_Neue:Regular',sans-serif] text-[13px] text-[#535862]">Fechar</p>
            </button>
          </div>
        </div>

        {/* Body — sidebar nav + content area */}
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar nav */}
          <nav className="flex w-[250px] shrink-0 flex-col overflow-y-auto border-r border-[#e9eaeb] bg-white py-[20px] px-[12px] gap-[20px]">
            {sidebarGroups.map((group) => (
              <div key={group.title} className="space-y-[4px]">
                <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest px-[0.75em] pb-[0.25em]">{group.title}</p>
                {group.items.map((item) => {
                  const isActive = activeSection === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setActiveSection(item.id)}
                      className={`flex w-full cursor-pointer items-center gap-[8px] rounded-[8px] px-[12px] py-[8px] text-left text-[14px] whitespace-nowrap transition-colors ${isActive ? "bg-[#eff6ff] text-[#0b5ed7] font-['Helvetica_Neue:Regular',sans-serif]" : "text-[#535862] font-['Helvetica_Neue:Regular',sans-serif] hover:text-[#252b37] hover:bg-[#f5f5f5]/50"}`}
                    >
                      <svg className="size-[16px] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        {Array.isArray(item.icon) ? item.icon.map((d, i) => <path key={i} d={d} />) : <path d={item.icon} />}
                      </svg>
                      {item.label}
                    </button>
                  );
                })}
              </div>
            ))}
          </nav>

          {/* Content area */}
          <div className="flex-1 overflow-y-auto px-[32px] py-[24px]">
            <div>
              {renderActiveSection()}
            </div>
          </div>
        </div>
        {/* Saída drawer */}
        {saidaDrawerIdx !== null && (() => {
          const saida = saidas[saidaDrawerIdx];
          if (!saida) { setSaidaDrawerIdx(null); return null; }
          const updateSaida = (key: string, value: string) => setSaidas((prev) => prev.map((s, i) => i === saidaDrawerIdx ? { ...s, [key]: value } : s));
          return createPortal(
            <div className="fixed inset-0 z-[60] flex justify-end">
              <div className="absolute inset-0 bg-black/40" onClick={() => setSaidaDrawerIdx(null)} />
              <div className="bg-white border border-[#e9eaeb] flex flex-col max-h-full relative rounded-l-[16px] shadow-[-8px_0px_24px_0px_rgba(0,0,0,0.1)] w-[480px] z-10 overflow-hidden animate-in slide-in-from-right duration-200">
                {/* Header */}
                <div className="shrink-0">
                  <div className="flex items-center justify-between px-6 pt-5 pb-[16px]">
                    <p className="font-['Helvetica_Neue:Medium',sans-serif] text-[16px] text-[#181d27]">Configurar saída {saidaDrawerIdx + 1}</p>
                    <button type="button" onClick={() => setSaidaDrawerIdx(null)} className="cursor-pointer flex items-center justify-center rounded-[6px] size-[32px] hover:bg-[#f5f5f5] transition-colors shrink-0">
                      <svg className="size-[18px]" fill="none" viewBox="0 0 18 18"><path d="M4 4l10 10M14 4L4 14" stroke="#717680" strokeWidth="1.5" strokeLinecap="round" /></svg>
                    </button>
                  </div>
                </div>
                {/* Content */}
                <div className="flex-1 overflow-y-auto px-6 pb-5 pt-0 space-y-6">
                  {/* Horários */}
                  <div>
                    <div className="w-full flex items-center bg-[#f9fafb] border-t border-b border-[#f0f1f3] px-[24px] h-[32px] -mx-6" style={{ width: "calc(100% + 48px)" }}>
                      <p className="font-['Helvetica_Neue:Medium',sans-serif] text-[11px] text-[#a4a7ae] uppercase tracking-[0.8px]">Horários</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 pt-5">
                      <div className="flex flex-col gap-1.5">
                        <label className="flex items-center gap-2 text-sm leading-none font-normal">Início</label>
                        <input type="text" inputMode="numeric" className={fieldClass} placeholder="hh:mm" value={saida.horario} onChange={(e) => updateSaida("horario", e.target.value)} />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="flex items-center gap-2 text-sm leading-none font-normal">Término</label>
                        <input type="text" inputMode="numeric" className={fieldClass} placeholder="hh:mm" value={saida.equipe ? "" : ""} readOnly />
                      </div>
                    </div>
                  </div>
                  {/* Capacidade */}
                  <div>
                    <div className="w-full flex items-center bg-[#f9fafb] border-t border-b border-[#f0f1f3] px-[24px] h-[32px] -mx-6" style={{ width: "calc(100% + 48px)" }}>
                      <p className="font-['Helvetica_Neue:Medium',sans-serif] text-[11px] text-[#a4a7ae] uppercase tracking-[0.8px]">Capacidade</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 pt-5">
                      <div className="flex flex-col gap-1.5">
                        <label className="flex items-center gap-2 text-sm leading-none font-normal">Mínima</label>
                        <input className={fieldClass} inputMode="numeric" placeholder="0" value={saida.qtdMinima} onChange={(e) => updateSaida("qtdMinima", e.target.value.replace(/\D/g, ""))} />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="flex items-center gap-2 text-sm leading-none font-normal">Máxima</label>
                        <input className={fieldClass} inputMode="numeric" placeholder="0" value={saida.vagas} onChange={(e) => updateSaida("vagas", e.target.value.replace(/\D/g, ""))} />
                      </div>
                    </div>
                  </div>
                  {/* Equipe responsável */}
                  <div className="space-y-3">
                    <div className="w-full flex items-center bg-[#f9fafb] border-t border-b border-[#f0f1f3] px-[24px] h-[32px] -mx-6" style={{ width: "calc(100% + 48px)" }}>
                      <p className="font-['Helvetica_Neue:Medium',sans-serif] text-[11px] text-[#a4a7ae] uppercase tracking-[0.8px]">Equipe responsável</p>
                    </div>
                    <div className="relative">
                      <div className="flex items-center gap-[8px] w-full h-[40px] rounded-[8px] px-[12px] transition-colors border border-[#e9eaeb] hover:border-[#d0d5dd]">
                        <svg className="size-[16px] text-[#a4a7ae] shrink-0" fill="none" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.5" /><path d="M16 16l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
                        <input type="text" className="flex-1 font-['Helvetica_Neue:Regular',sans-serif] text-[13px] text-[#252b37] bg-transparent outline-none placeholder:text-[#a4a7ae]" placeholder="Buscar ou adicionar membro..." />
                        <button type="button" className="cursor-pointer shrink-0">
                          <svg className="size-[14px] text-[#a4a7ae]" fill="none" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        </button>
                      </div>
                    </div>
                    <div className="flex min-h-[160px] w-full flex-col items-center justify-center gap-[8px] py-[24px] text-center">
                      <svg className="size-[32px] text-[#d0d5dd]" fill="none" viewBox="0 0 24 24"><path d="M7.5 19.5C7.5 18.5344 7.82853 17.5576 8.63092 17.0204C9.59321 16.3761 10.7524 16 12 16C13.2476 16 14.4068 16.3761 15.3691 17.0204C16.1715 17.5576 16.5 18.5344 16.5 19.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /><circle cx="12" cy="11" r="2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /><path d="M17.5 11C18.6101 11 19.6415 11.3769 20.4974 12.0224C21.2229 12.5696 21.5 13.4951 21.5 14.4038V14.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /><circle cx="17.5" cy="6.5" r="2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /><path d="M6.5 11C5.38987 11 4.35846 11.3769 3.50256 12.0224C2.77706 12.5696 2.5 13.4951 2.5 14.4038V14.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /><circle cx="6.5" cy="6.5" r="2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      <p className="font-['Helvetica_Neue:Regular',sans-serif] text-[13px] text-[#717680]">Nenhum colaborador escalado</p>
                      <p className="font-['Helvetica_Neue:Regular',sans-serif] text-[11px] text-[#94a3b8] text-center max-w-[200px] -mt-[4px]">Busque e adicione os colaboradores responsáveis por esta saída.</p>
                    </div>
                  </div>
                </div>
                {/* Footer */}
                <div className="shrink-0 border-t border-[#e9eaeb] px-6 py-4 flex items-center justify-end gap-[12px]">
                  <button type="button" onClick={() => setSaidaDrawerIdx(null)} className="cursor-pointer font-['Helvetica_Neue:Medium',sans-serif] text-[13px] text-[#535862] px-[16px] py-[8px] rounded-[8px] border border-[#e9eaeb] bg-white hover:bg-[#f8fafc] transition-colors">
                    Cancelar
                  </button>
                  <button type="button" onClick={() => setSaidaDrawerIdx(null)} className="cursor-pointer font-['Helvetica_Neue:Medium',sans-serif] text-[13px] text-white px-[16px] py-[8px] rounded-[8px] bg-[#0b5ed7] hover:bg-[#084fb7] transition-colors">
                    Salvar
                  </button>
                </div>
              </div>
            </div>,
            document.body
          );
        })()}
        {/* Tarifa drawer */}
        {tarifaDrawerIdx !== null && tarifaDraft !== null && (() => {
          const tarifa = tarifaDraft;
          const updateTarifa = (key: string, value: string) => setTarifaDraft((prev) => prev ? { ...prev, [key]: value } : prev);
          return createPortal(
            <div className="fixed inset-0 z-[60] flex justify-end">
              <div className="absolute inset-0 bg-black/40" onClick={() => { setTarifaDraft(null); setTarifaDrawerIdx(null); }} />
              <div className="bg-white border border-[#e9eaeb] flex flex-col max-h-full relative rounded-l-[16px] shadow-[-8px_0px_24px_0px_rgba(0,0,0,0.1)] w-[480px] z-10 overflow-hidden animate-in slide-in-from-right duration-200">
                <div className="shrink-0">
                  <div className="flex items-center justify-between px-6 pt-5 pb-[16px]">
                    <p className="font-['Helvetica_Neue:Medium',sans-serif] text-[16px] text-[#181d27]">Configurar tarifa</p>
                    <button type="button" onClick={() => { setTarifaDraft(null); setTarifaDrawerIdx(null); }} className="cursor-pointer flex items-center justify-center rounded-[6px] size-[32px] hover:bg-[#f5f5f5] transition-colors shrink-0">
                      <svg className="size-[18px]" fill="none" viewBox="0 0 18 18"><path d="M4 4l10 10M14 4L4 14" stroke="#717680" strokeWidth="1.5" strokeLinecap="round" /></svg>
                    </button>
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto px-6 pb-5 pt-0 space-y-6">
                  {/* Detalhes */}
                  <div>
                    <div className="w-full flex items-center bg-[#f9fafb] border-t border-b border-[#f0f1f3] px-[24px] h-[32px] -mx-6" style={{ width: "calc(100% + 48px)" }}>
                      <p className="font-['Helvetica_Neue:Medium',sans-serif] text-[11px] text-[#a4a7ae] uppercase tracking-[0.8px]">Detalhes da tarifa</p>
                    </div>
                    <div className="flex flex-col gap-4 pt-5">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-sm leading-none font-normal">Título da tarifa</label>
                        <input className={fieldClass} value={tarifa.label} onChange={(e) => updateTarifa("label", e.target.value)} placeholder="Ex.: Adulto" />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-sm leading-none font-normal">Preço</label>
                        <div className="relative">
                          <span className="absolute left-[12px] top-1/2 -translate-y-1/2 font-['Helvetica_Neue:Regular',sans-serif] text-[14px] text-[#717680]">R$</span>
                          <input className={`${fieldClass} pl-[36px]`} inputMode="numeric" value={tarifa.preco} onChange={(e) => {
                            const raw = e.target.value.replace(/\D/g, "");
                            const cents = parseInt(raw || "0", 10);
                            const formatted = new Intl.NumberFormat("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(cents / 100);
                            updateTarifa("preco", formatted);
                          }} placeholder="0,00" />
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Faixa etária */}
                  <div>
                    <div className="w-full flex items-center bg-[#f9fafb] border-t border-b border-[#f0f1f3] px-[24px] h-[32px] -mx-6" style={{ width: "calc(100% + 48px)" }}>
                      <p className="font-['Helvetica_Neue:Medium',sans-serif] text-[11px] text-[#a4a7ae] uppercase tracking-[0.8px]">Faixa etária</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 pt-5">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-sm leading-none font-normal">Idade inicial</label>
                        <input className={fieldClass} inputMode="numeric" value={tarifa.idadeIni} onChange={(e) => updateTarifa("idadeIni", e.target.value.replace(/\D/g, ""))} placeholder="0" />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-sm leading-none font-normal">Idade final</label>
                        <input className={fieldClass} inputMode="numeric" value={tarifa.idadeFim} onChange={(e) => updateTarifa("idadeFim", e.target.value.replace(/\D/g, ""))} placeholder="99" />
                      </div>
                    </div>
                  </div>
                  {/* Quantidade por reserva */}
                  <div>
                    <div className="w-full flex items-center bg-[#f9fafb] border-t border-b border-[#f0f1f3] px-[24px] h-[32px] -mx-6" style={{ width: "calc(100% + 48px)" }}>
                      <p className="font-['Helvetica_Neue:Medium',sans-serif] text-[11px] text-[#a4a7ae] uppercase tracking-[0.8px]">Quantidade por reserva</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 pt-5">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-sm leading-none font-normal">Mínima</label>
                        <input className={fieldClass} inputMode="numeric" value={tarifa.minQty} onChange={(e) => updateTarifa("minQty", e.target.value.replace(/\D/g, ""))} placeholder="1" />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-sm leading-none font-normal">Máxima</label>
                        <input className={fieldClass} inputMode="numeric" value={tarifa.maxQty} onChange={(e) => updateTarifa("maxQty", e.target.value.replace(/\D/g, ""))} placeholder="10" />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="shrink-0 border-t border-[#e9eaeb] px-6 py-4 flex items-center justify-end gap-[12px]">
                  <button type="button" onClick={() => { setTarifaDraft(null); setTarifaDrawerIdx(null); }} className="cursor-pointer font-['Helvetica_Neue:Medium',sans-serif] text-[13px] text-[#535862] px-[16px] py-[8px] rounded-[8px] border border-[#e9eaeb] bg-white hover:bg-[#f8fafc] transition-colors">
                    Cancelar
                  </button>
                  <button type="button" onClick={() => { if (tarifaDraft && tarifaDrawerIdx !== null) { setTarifas((prev) => prev.map((t, i) => i === tarifaDrawerIdx ? tarifaDraft : t)); } setTarifaDraft(null); setTarifaDrawerIdx(null); }} className="cursor-pointer font-['Helvetica_Neue:Medium',sans-serif] text-[13px] text-white px-[16px] py-[8px] rounded-[8px] bg-[#0b5ed7] hover:bg-[#084fb7] transition-colors">
                    Salvar
                  </button>
                </div>
              </div>
            </div>,
            document.body
          );
        })()}

        {/* Lote drawer */}
        {loteDrawerIdx !== null && loteDraft !== null && (() => {
          const lote = loteDraft;
          const updateLote = (key: string, value: string) => setLoteDraft((prev) => prev ? { ...prev, [key]: value } : prev);
          return createPortal(
            <div className="fixed inset-0 z-[60] flex justify-end">
              <div className="absolute inset-0 bg-black/40" onClick={() => { setLoteDraft(null); setLoteDrawerIdx(null); }} />
              <div className="bg-white border border-[#e9eaeb] flex flex-col max-h-full relative rounded-l-[16px] shadow-[-8px_0px_24px_0px_rgba(0,0,0,0.1)] w-[480px] z-10 overflow-hidden animate-in slide-in-from-right duration-200">
                <div className="shrink-0">
                  <div className="flex items-center justify-between px-6 pt-5 pb-[16px]">
                    <p className="font-['Helvetica_Neue:Medium',sans-serif] text-[16px] text-[#181d27]">Configurar faixa de lote</p>
                    <button type="button" onClick={() => { setLoteDraft(null); setLoteDrawerIdx(null); }} className="cursor-pointer flex items-center justify-center rounded-[6px] size-[32px] hover:bg-[#f5f5f5] transition-colors shrink-0">
                      <svg className="size-[18px]" fill="none" viewBox="0 0 18 18"><path d="M4 4l10 10M14 4L4 14" stroke="#717680" strokeWidth="1.5" strokeLinecap="round" /></svg>
                    </button>
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto px-6 pb-5 pt-0 space-y-6">
                  <div>
                    <div className="w-full flex items-center bg-[#f9fafb] border-t border-b border-[#f0f1f3] px-[24px] h-[32px] -mx-6" style={{ width: "calc(100% + 48px)" }}>
                      <p className="font-['Helvetica_Neue:Medium',sans-serif] text-[11px] text-[#a4a7ae] uppercase tracking-[0.8px]">Detalhes da faixa</p>
                    </div>
                    <div className="flex flex-col gap-4 pt-5">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-sm leading-none font-normal">Rótulo</label>
                        <input className={fieldClass} value={lote.label} onChange={(e) => updateLote("label", e.target.value)} placeholder="Ex.: Grupo pequeno" />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-sm leading-none font-normal">Preço</label>
                        <div className="relative">
                          <span className="absolute left-[12px] top-1/2 -translate-y-1/2 font-['Helvetica_Neue:Regular',sans-serif] text-[14px] text-[#717680]">R$</span>
                          <input className={`${fieldClass} pl-[36px]`} inputMode="numeric" value={lote.preco} onChange={(e) => {
                            const raw = e.target.value.replace(/\D/g, "");
                            const cents = parseInt(raw || "0", 10);
                            const formatted = new Intl.NumberFormat("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(cents / 100);
                            updateLote("preco", formatted);
                          }} placeholder="0,00" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="w-full flex items-center bg-[#f9fafb] border-t border-b border-[#f0f1f3] px-[24px] h-[32px] -mx-6" style={{ width: "calc(100% + 48px)" }}>
                      <p className="font-['Helvetica_Neue:Medium',sans-serif] text-[11px] text-[#a4a7ae] uppercase tracking-[0.8px]">Faixa de participantes</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 pt-5">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-sm leading-none font-normal">De</label>
                        <input className={fieldClass} inputMode="numeric" value={lote.de} onChange={(e) => updateLote("de", e.target.value.replace(/\D/g, ""))} placeholder="1" />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-sm leading-none font-normal">Até</label>
                        <input className={fieldClass} inputMode="numeric" value={lote.ate} onChange={(e) => updateLote("ate", e.target.value.replace(/\D/g, ""))} placeholder="10" />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="shrink-0 border-t border-[#e9eaeb] px-6 py-4 flex items-center justify-end gap-[12px]">
                  <button type="button" onClick={() => { setLoteDraft(null); setLoteDrawerIdx(null); }} className="cursor-pointer font-['Helvetica_Neue:Medium',sans-serif] text-[13px] text-[#535862] px-[16px] py-[8px] rounded-[8px] border border-[#e9eaeb] bg-white hover:bg-[#f8fafc] transition-colors">
                    Cancelar
                  </button>
                  <button type="button" onClick={() => { if (loteDraft && loteDrawerIdx !== null) { setLotes((prev) => prev.map((l, i) => i === loteDrawerIdx ? loteDraft : l)); } setLoteDraft(null); setLoteDrawerIdx(null); }} className="cursor-pointer font-['Helvetica_Neue:Medium',sans-serif] text-[13px] text-white px-[16px] py-[8px] rounded-[8px] bg-[#0b5ed7] hover:bg-[#084fb7] transition-colors">
                    Salvar
                  </button>
                </div>
              </div>
            </div>,
            document.body
          );
        })()}
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
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-[1em]">
        {[
          { label: "Total de produtos", subtitle: "Catálogo completo", value: totalProdutos.toString(), icon: <svg className="block size-full" fill="none" viewBox="0 0 16 16"><path d="M11.333 0.667V2.667M4.667 0.667V2.667" stroke="#0B5ED7" strokeLinecap="round" strokeLinejoin="round"/><path d="M8 12.667H7.333C5.152 12.667 4.062 12.667 3.448 12.052C2.833 11.438 2.833 10.348 2.833 8.167V7.167C2.833 4.986 2.833 3.895 3.448 3.281C4.062 2.667 5.152 2.667 7.333 2.667H8.667C10.848 2.667 11.938 2.667 12.552 3.281C13.167 3.895 13.167 4.986 13.167 7.167V7.833" stroke="#0B5ED7" strokeLinecap="round" strokeLinejoin="round"/><path d="M2.833 5.333H13.167" stroke="#0B5ED7" strokeLinecap="round" strokeLinejoin="round"/><path d="M10.333 12.667C10.333 12.667 12.333 11.681 12.333 10.083C12.333 9.455 11.886 8.947 11.273 8.947C10.77 8.947 10.435 9.166 10.211 9.603C9.988 9.166 9.653 8.947 9.15 8.947C8.537 8.947 8.09 9.455 8.09 10.083C8.09 11.681 10.333 12.667 10.333 12.667Z" stroke="#0B5ED7" strokeLinecap="round" strokeLinejoin="round"/></svg> },
          { label: "Ativos", subtitle: "Produtos disponíveis", value: ativos.toString(), icon: <svg className="block size-full" fill="none" viewBox="0 0 16 16"><path d="M4 8l3 3 5-5" stroke="#0B5ED7" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/><circle cx="8" cy="8" r="6.5" stroke="#0B5ED7" strokeWidth="1.2"/></svg> },
          { label: "Inativos", subtitle: "Produtos desativados", value: inativos.toString(), icon: <svg className="block size-full" fill="none" viewBox="0 0 16 16"><path d="M4 4l8 8M12 4l-8 8" stroke="#0B5ED7" strokeWidth="1.2" strokeLinecap="round"/><circle cx="8" cy="8" r="6.5" stroke="#0B5ED7" strokeWidth="1.2"/></svg> },
          { label: "Ticket médio", subtitle: "Valor médio por produto", value: formatCurrency(ticketMedio), icon: <svg className="block size-full" fill="none" viewBox="0 0 16 16"><path d="M2.333 10.264V5.358C2.333 3.842 2.333 3.084 2.8 2.612C3.267 2.14 4.017 2.14 5.517 2.14H7.633C9.133 2.14 9.883 2.14 10.35 2.612C10.817 3.084 10.817 3.842 10.817 5.358V10.264C10.817 11.068 10.817 11.47 10.572 11.628C10.172 11.886 9.553 11.345 9.241 11.148C8.984 10.986 8.855 10.905 8.712 10.9C8.558 10.895 8.427 10.974 8.149 11.148L7.136 11.789C6.863 11.962 6.726 12.048 6.574 12.048C6.422 12.048 6.285 11.962 6.012 11.789L4.999 11.148C4.742 10.986 4.613 10.905 4.47 10.9C4.316 10.895 4.185 10.974 3.907 11.148C3.596 11.345 2.976 11.886 2.576 11.628C2.333 11.47 2.333 11.068 2.333 10.264Z" stroke="#0B5ED7" strokeLinecap="round" strokeLinejoin="round"/><path d="M8.683 4.333H5.183" stroke="#0B5ED7" strokeLinecap="round" strokeLinejoin="round"/><path d="M5.85 6.333H5.183" stroke="#0B5ED7" strokeLinecap="round" strokeLinejoin="round"/></svg> },
        ].map((card) => (
          <div key={card.label} data-slot="card" data-size="default" className="group/card flex flex-col overflow-hidden rounded-4xl bg-card text-sm text-card-foreground ring-1 ring-foreground/5 shadow-none py-0 gap-0">
            <div data-slot="card-content" className="p-[1.25em] h-full">
              <div className="flex items-start justify-between gap-[0.75em] h-full">
                <div className="flex flex-col justify-between h-full min-w-0">
                  <span className="font-['Helvetica_Neue:Medium',sans-serif] text-xs text-muted-foreground leading-tight">{card.label}</span>
                  <p className="font-['Helvetica_Neue:Regular',sans-serif] text-2xl tracking-tight leading-none mt-[0.25em] text-[#0f172b]">{card.value}</p>
                  <span className="block font-['Helvetica_Neue:Regular',sans-serif] text-xs text-muted-foreground mt-[0.25em]">{card.subtitle}</span>
                </div>
                <div className="size-[2.5em] rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <div className="size-[20px] text-primary">{card.icon}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-[0.75em]">
        <div className="relative flex-1 md:max-w-[20em]">
          <svg className="absolute left-[0.75em] top-1/2 size-[16px] -translate-y-1/2 text-muted-foreground" fill="none" viewBox="0 0 24 24">
            <path d="M17 17L21 21" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            <path d="M19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19C15.4183 19 19 15.4183 19 11Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Pesquisar..."
            className="h-9 w-full min-w-0 rounded-md border border-border bg-input/50 px-3 py-1 pl-[2.25em] font-['Helvetica_Neue:Regular',sans-serif] text-base text-[#252b37] outline-none transition-[color,box-shadow,background-color] placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 md:text-sm"
          />
        </div>
        <div className="relative hidden md:block">
          <button
            type="button"
            onClick={() => setFiltersDrawerOpen(true)}
            className="group/button inline-flex h-9 shrink-0 items-center justify-center gap-1.5 rounded-lg border border-border bg-background px-3 font-['Helvetica_Neue:Regular',sans-serif] text-sm text-[#414651] transition-all hover:bg-muted hover:text-foreground"
          >
            <svg className="size-[16px]" fill="none" viewBox="0 0 24 24">
              <path d="M3 7H6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
              <path d="M3 17H9" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
              <path d="M18 17L21 17" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
              <path d="M15 7L21 7" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
              <path d="M6 7C6 6.06812 6 5.60218 6.15224 5.23463C6.35523 4.74458 6.74458 4.35523 7.23463 4.15224C7.60218 4 8.06812 4 9 4C9.93188 4 10.3978 4 10.7654 4.15224C11.2554 4.35523 11.6448 4.74458 11.8478 5.23463C12 5.60218 12 6.06812 12 7C12 7.93188 12 8.39782 11.8478 8.76537C11.6448 9.25542 11.2554 9.64477 10.7654 9.84776C10.3978 10 9.93188 10 9 10C8.06812 10 7.60218 10 7.23463 9.84776C6.74458 9.64477 6.35523 9.25542 6.15224 8.76537C6 8.39782 6 7.93188 6 7Z" stroke="currentColor" strokeWidth="1.5" />
              <path d="M12 17C12 16.0681 12 15.6022 12.1522 15.2346C12.3552 14.7446 12.7446 14.3552 13.2346 14.1522C13.6022 14 14.0681 14 15 14C15.9319 14 16.3978 14 16.7654 14.1522C17.2554 14.3552 17.6448 14.7446 17.8478 15.2346C18 15.6022 18 16.0681 18 17C18 17.9319 18 18.3978 17.8478 18.7654C17.6448 19.2554 17.2554 19.6448 16.7654 19.8478C16.3978 20 15.9319 20 15 20C14.0681 20 13.6022 20 13.2346 19.8478C12.7446 19.6448 12.3552 19.2554 12.1522 18.7654C12 18.3978 12 17.9319 12 17Z" stroke="currentColor" strokeWidth="1.5" />
            </svg>
            Filtros
          </button>
        </div>
        <div className="ml-auto hidden items-center gap-[0.75em] md:flex">
        <div className="relative">
          <button
            type="button"
            disabled={selectedIds.length === 0}
            onClick={() => setOpenMenuId(openMenuId === "bulk" ? null : "bulk")}
            className="group/button inline-flex h-9 shrink-0 items-center justify-center gap-1.5 rounded-lg border border-border bg-background px-3 font-['Helvetica_Neue:Regular',sans-serif] text-sm text-[#414651] transition-all hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-50"
          >
            Ações em lote
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
          className="group/button inline-flex h-9 shrink-0 items-center justify-center gap-1.5 rounded-lg border border-transparent bg-primary px-3 font-['Helvetica_Neue:Medium',sans-serif] text-sm text-primary-foreground transition-all hover:bg-primary/80"
        >
          <svg className="size-[16px]" fill="none" viewBox="0 0 24 24">
            <path d="M12 4V20M20 12H4" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          </svg>
          Novo produto
        </button>
        </div>
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
      {filtersDrawerOpen ? (
        <div className="fixed inset-0 z-[60] flex justify-end">
          <div className="absolute inset-0 bg-black/40" onClick={() => setFiltersDrawerOpen(false)} />
          <div className="relative z-10 flex h-full w-[360px] max-w-[calc(100vw-24px)] flex-col overflow-hidden rounded-l-[16px] border border-[#e9eaeb] bg-white shadow-[-8px_0px_24px_0px_rgba(0,0,0,0.1)]">
            <div className="shrink-0">
              <div className="flex items-center justify-between px-6 pb-[16px] pt-5">
                <p className="font-['Helvetica_Neue:Medium',sans-serif] text-[16px] text-[#181d27]">Filtros</p>
                <button type="button" onClick={() => setFiltersDrawerOpen(false)} className="flex size-[32px] shrink-0 cursor-pointer items-center justify-center rounded-[6px] transition-colors hover:bg-[#f5f5f5]">
                  <svg className="size-[18px]" fill="none" viewBox="0 0 18 18"><path d="M4 4l10 10M14 4L4 14" stroke="#717680" strokeWidth="1.5" strokeLinecap="round" /></svg>
                </button>
              </div>
              <div className="mx-6 h-px bg-[#f0f1f3]" />
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-5">
              <div className="flex flex-col gap-[10px]">
                <p className="font-['Helvetica_Neue:Medium',sans-serif] text-[13px] text-[#252b37]">Status</p>
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
                    className={`flex h-[40px] w-full items-center justify-between rounded-[8px] border px-[12px] font-['Helvetica_Neue:Regular',sans-serif] text-[13px] transition-colors ${
                      statusFilter === filter.value
                        ? "border-[#0b5ed7] bg-[#f0f5ff] text-[#0b5ed7]"
                        : "border-[#e9eaeb] bg-white text-[#414651] hover:bg-[#f8fafc]"
                    }`}
                  >
                    <span>{filter.label}</span>
                    {statusFilter === filter.value ? (
                      <svg className="size-[14px] shrink-0" viewBox="0 0 14 14" fill="none">
                        <path d="M3 7l2.5 2.5L11 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    ) : null}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex shrink-0 gap-[12px] border-t border-[#e9eaeb] px-6 py-4">
              <button type="button" onClick={() => setStatusFilter("todos")} className="h-[40px] flex-1 cursor-pointer rounded-[8px] border border-[#e9eaeb] bg-white font-['Helvetica_Neue:Regular',sans-serif] text-[14px] text-[#414651] transition-colors hover:bg-[#f8fafc]">Limpar</button>
              <button type="button" onClick={() => setFiltersDrawerOpen(false)} className="h-[40px] flex-1 cursor-pointer rounded-[8px] bg-[#0b5ed7] font-['Helvetica_Neue:Medium',sans-serif] text-[14px] text-white transition-colors hover:bg-[#084fb7]">Aplicar filtros</button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
