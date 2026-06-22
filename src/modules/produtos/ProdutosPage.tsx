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

const produtoTipos = [
  "Atividade",
  "Mercadorias",
  "Treinamento / aulas",
  "Aluguel",
  "Assinatura",
  "Cartão presente",
  "Transporte",
  "Excursão de 1 dia",
  "Ingresso",
  "Excursão",
  "Evento",
  "Meio de hospedagem",
  "Tour privado",
  "Produto personalizado",
  "Comida e Bebida",
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
  };

  const openEditProduct = (produto: Produto) => {
    setMode("edit");
    setEditingId(produto.id);
    setForm(formFromProduto(produto));
    setFormError("");
    setOpenMenuId(null);
  };

  const closeForm = () => {
    setMode("list");
    setEditingId(null);
    setForm(emptyForm);
    setFormError("");
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

  if (mode !== "list") {
    return (
      <>
        <div className="absolute left-[var(--shell-offset,248px)] right-[24px] top-[96px] flex items-start justify-between gap-[24px]">
          <div>
            <button
              type="button"
              onClick={closeForm}
              className="mb-[16px] flex h-[32px] items-center gap-[6px] rounded-[8px] border border-[#e9eaeb] bg-white px-[12px] font-['Helvetica_Neue:Regular',sans-serif] text-[13px] text-[#414651] transition-colors hover:bg-[#f8fafc]"
            >
              <svg className="size-[14px]" fill="none" viewBox="0 0 24 24">
                <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
              </svg>
              Voltar
            </button>
            <h1 className="font-['Helvetica_Neue:Regular',sans-serif] text-[24px] leading-[normal] text-[#0f172b]">
              {mode === "new" ? "Novo produto" : "Editar produto"}
            </h1>
            <p className="mt-[4px] font-['Helvetica_Neue:Regular',sans-serif] text-[14px] text-[#535862]">
              Configure o cadastro base do produto. As seções avançadas ficam preparadas para a evolução do CRUD.
            </p>
          </div>
          <div className="flex items-center gap-[8px] pt-[48px]">
            <button
              type="button"
              onClick={closeForm}
              className="h-[40px] rounded-[8px] border border-[#e9eaeb] bg-white px-[16px] font-['Helvetica_Neue:Regular',sans-serif] text-[14px] text-[#414651] transition-colors hover:bg-[#f8fafc]"
            >
              Cancelar
            </button>
            <button
              type="submit"
              form="produto-form"
              className="h-[40px] rounded-[8px] bg-[#0b5ed7] px-[16px] font-['Helvetica_Neue:Medium',sans-serif] text-[14px] text-white transition-colors hover:bg-[#0a4fb3]"
            >
              Salvar produto
            </button>
          </div>
        </div>

        <form
          id="produto-form"
          onSubmit={saveProduto}
          className="absolute left-[var(--shell-offset,248px)] right-[24px] top-[210px] grid grid-cols-1 gap-[20px] pb-[40px] lg:grid-cols-[1fr_360px]"
        >
          <div className="flex flex-col gap-[20px]">
            <section className="rounded-[12px] border border-[#e9eaeb] bg-white p-[20px]">
              <div className="mb-[18px]">
                <h2 className="font-['Helvetica_Neue:Medium',sans-serif] text-[16px] text-[#181d27]">Identificação</h2>
                <p className="mt-[4px] font-['Helvetica_Neue:Regular',sans-serif] text-[13px] text-[#717680]">
                  Dados básicos usados na listagem e no catálogo.
                </p>
              </div>
              <div className="grid grid-cols-1 gap-[16px] sm:grid-cols-2">
                <div className="flex flex-col gap-[8px] sm:col-span-2">
                  <FieldLabel>Nome do produto</FieldLabel>
                  <input
                    className={fieldClass}
                    value={form.nome}
                    onChange={(event) => updateForm("nome", event.target.value)}
                    placeholder="Ex.: Trilha Pico do Itacolomi"
                  />
                </div>
                <div className="flex flex-col gap-[8px]">
                  <FieldLabel>Tipo de produto</FieldLabel>
                  <select className={fieldClass} value={form.tipo} onChange={(event) => updateForm("tipo", event.target.value)}>
                    {produtoTipos.map((tipo) => (
                      <option key={tipo} value={tipo}>
                        {tipo}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-[8px]">
                  <FieldLabel>Categoria</FieldLabel>
                  <select
                    className={fieldClass}
                    value={form.categoria}
                    onChange={(event) => updateForm("categoria", event.target.value)}
                  >
                    {categorias.map((categoria) => (
                      <option key={categoria} value={categoria}>
                        {categoria}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-[8px] sm:col-span-2">
                  <FieldLabel>Descrição curta</FieldLabel>
                  <textarea
                    className={textAreaClass}
                    value={form.descricao}
                    onChange={(event) => updateForm("descricao", event.target.value)}
                    placeholder="Resumo exibido no cadastro e nos pontos de venda."
                  />
                </div>
              </div>
            </section>

            <section className="rounded-[12px] border border-[#e9eaeb] bg-white p-[20px]">
              <div className="mb-[18px]">
                <h2 className="font-['Helvetica_Neue:Medium',sans-serif] text-[16px] text-[#181d27]">Preço, duração e capacidade</h2>
                <p className="mt-[4px] font-['Helvetica_Neue:Regular',sans-serif] text-[13px] text-[#717680]">
                  Campos mínimos para operar o produto na listagem.
                </p>
              </div>
              <div className="grid grid-cols-1 gap-[16px] sm:grid-cols-3">
                <div className="flex flex-col gap-[8px]">
                  <FieldLabel>Valor de referência</FieldLabel>
                  <input
                    className={fieldClass}
                    inputMode="numeric"
                    value={form.preco}
                    onChange={(event) => updateForm("preco", event.target.value.replace(/\D/g, ""))}
                    placeholder="150"
                  />
                </div>
                <div className="flex flex-col gap-[8px]">
                  <FieldLabel>Duração</FieldLabel>
                  <input
                    className={fieldClass}
                    value={form.duracao}
                    onChange={(event) => updateForm("duracao", event.target.value)}
                    placeholder="3h"
                  />
                </div>
                <div className="flex flex-col gap-[8px]">
                  <FieldLabel>Capacidade</FieldLabel>
                  <input
                    className={fieldClass}
                    inputMode="numeric"
                    value={form.capacidade}
                    onChange={(event) => updateForm("capacidade", event.target.value.replace(/\D/g, ""))}
                    placeholder="30"
                  />
                </div>
              </div>
            </section>

            <section className="rounded-[12px] border border-[#e9eaeb] bg-white p-[20px]">
              <div className="mb-[18px]">
                <h2 className="font-['Helvetica_Neue:Medium',sans-serif] text-[16px] text-[#181d27]">Logística exibida ao cliente</h2>
                <p className="mt-[4px] font-['Helvetica_Neue:Regular',sans-serif] text-[13px] text-[#717680]">
                  Informações iniciais para o cadastro operacional.
                </p>
              </div>
              <div className="flex flex-col gap-[8px]">
                <FieldLabel>Ponto de encontro</FieldLabel>
                <input
                  className={fieldClass}
                  value={form.pontoEncontro}
                  onChange={(event) => updateForm("pontoEncontro", event.target.value)}
                  placeholder="Ex.: Portaria principal do parque"
                />
              </div>
            </section>
          </div>

          <aside className="flex flex-col gap-[20px]">
            <section className="rounded-[12px] border border-[#e9eaeb] bg-white p-[20px]">
              <h2 className="font-['Helvetica_Neue:Medium',sans-serif] text-[16px] text-[#181d27]">Publicação</h2>
              <div className="mt-[18px] flex flex-col gap-[8px]">
                <FieldLabel>Status</FieldLabel>
                <select
                  className={fieldClass}
                  value={form.status}
                  onChange={(event) => updateForm("status", event.target.value as Produto["status"])}
                >
                  <option value="Rascunho">Rascunho</option>
                  <option value="Ativo">Ativo</option>
                  <option value="Inativo">Inativo</option>
                </select>
              </div>
              <label className="mt-[16px] flex cursor-pointer items-center gap-[10px] rounded-[8px] border border-[#e9eaeb] bg-[#fbfcfd] px-[12px] py-[10px]">
                <input
                  type="checkbox"
                  checked={form.destaque}
                  onChange={(event) => updateForm("destaque", event.target.checked)}
                  className="size-[16px] accent-[#0b5ed7]"
                />
                <span className="font-['Helvetica_Neue:Regular',sans-serif] text-[13px] text-[#414651]">
                  Marcar como produto destaque
                </span>
              </label>
            </section>

            <section className="rounded-[12px] border border-[#e9eaeb] bg-white p-[20px]">
              <h2 className="font-['Helvetica_Neue:Medium',sans-serif] text-[16px] text-[#181d27]">Próximas seções</h2>
              <div className="mt-[14px] flex flex-col gap-[8px]">
                {["Estoque", "Tarifário", "Disponibilidade", "Opcionais", "Recursos", "Formulário de participantes"].map((section) => (
                  <div key={section} className="flex items-center justify-between rounded-[8px] bg-[#fafafa] px-[12px] py-[9px]">
                    <span className="font-['Helvetica_Neue:Regular',sans-serif] text-[13px] text-[#414651]">{section}</span>
                    <span className="rounded-full border border-[#fedf89] bg-[#fffaeb] px-[8px] py-[2px] font-['Helvetica_Neue:Regular',sans-serif] text-[11px] text-[#dc6803]">
                      Em breve
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {formError ? (
              <div className="rounded-[10px] border border-[#fecdca] bg-[#fef3f2] px-[14px] py-[12px] font-['Helvetica_Neue:Regular',sans-serif] text-[13px] text-[#b42318]">
                {formError}
              </div>
            ) : null}
          </aside>
        </form>
      </>
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
