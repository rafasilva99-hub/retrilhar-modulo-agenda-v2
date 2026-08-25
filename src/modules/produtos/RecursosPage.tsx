import { type FormEvent, useMemo, useState } from "react";
import {
  CancelCircleIcon,
  CheckmarkCircle01Icon,
  Copy01Icon,
  Delete02Icon,
  Edit04Icon,
  FilterHorizontalIcon,
  MoreVerticalIcon,
  PackageIcon,
  PlusSignIcon,
  Search01Icon,
  StatusIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { AppPage } from "@/components/layout/app-page";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";

type RecursoStatus = "Ativo" | "Inativo" | "Rascunho";
type RecursoCobranca = "Por pessoa" | "Por opção" | "Por compra (grupo)";

interface Recurso {
  readonly id: string;
  readonly nome: string;
  readonly cobranca: RecursoCobranca;
  readonly preco: number;
  readonly quantidade: string;
  readonly vinculos: string;
  readonly status: RecursoStatus;
  readonly descricao: string;
}

interface RecursoFormState {
  readonly nome: string;
  readonly cobranca: RecursoCobranca;
  readonly preco: string;
  readonly quantidade: string;
  readonly vinculos: string;
  readonly status: RecursoStatus;
  readonly descricao: string;
}

const RESOURCE_ACTION_ICON_STROKE_WIDTH = 1.5;
const RESOURCE_PAGE_SIZE = 9;

function ResourceItemsIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="text-primary"
      aria-hidden="true"
    >
      <path
        d="M2.5 6C2.5 4.45956 2.5 3.68934 2.84673 3.12353C3.04074 2.80693 3.30693 2.54074 3.62353 2.34673C4.18934 2 4.95956 2 6.5 2C8.04044 2 8.81066 2 9.37647 2.34673C9.69307 2.54074 9.95926 2.80693 10.1533 3.12353C10.5 3.68934 10.5 4.45956 10.5 6C10.5 7.54044 10.5 8.31066 10.1533 8.87647C9.95926 9.19307 9.69307 9.45926 9.37647 9.65327C8.81066 10 8.04044 10 6.5 10C4.95956 10 4.18934 10 3.62353 9.65327C3.30693 9.45926 3.04074 9.19307 2.84673 8.87647C2.5 8.31066 2.5 7.54044 2.5 6Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3.78166 14.7817C4.82852 13.7348 5.35195 13.2114 5.9721 13.0625C6.3191 12.9792 6.6809 12.9792 7.0279 13.0625C7.64805 13.2114 8.17148 13.7348 9.21834 14.7817C10.2652 15.8285 10.7886 16.3519 10.9375 16.9721C11.0208 17.3191 11.0208 17.6809 10.9375 18.0279C10.7886 18.6481 10.2652 19.1715 9.21834 20.2183C8.17148 21.2652 7.64805 21.7886 7.02791 21.9375C6.6809 22.0208 6.3191 22.0208 5.9721 21.9375C5.35195 21.7886 4.82852 21.2652 3.78166 20.2183C2.7348 19.1715 2.21137 18.6481 2.06248 18.0279C1.97917 17.6809 1.97917 17.3191 2.06248 16.9721C2.21137 16.3519 2.7348 15.8285 3.78166 14.7817Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14 18C14 16.4596 14 15.6893 14.3467 15.1235C14.5407 14.8069 14.8069 14.5407 15.1235 14.3467C15.6893 14 16.4596 14 18 14C19.5404 14 20.3107 14 20.8765 14.3467C21.1931 14.5407 21.4593 14.8069 21.6533 15.1235C22 15.6893 22 16.4596 22 18C22 19.5404 22 20.3107 21.6533 20.8765C21.4593 21.1931 21.1931 21.4593 20.8765 21.6533C20.3107 22 19.5404 22 18 22C16.4596 22 15.6893 22 15.1235 21.6533C14.8069 21.4593 14.5407 21.1931 14.3467 20.8765C14 20.3107 14 19.5404 14 18Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18 2V10M22 6L14 6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const initialResources: Recurso[] = [
  {
    id: "rec-001",
    nome: "Almoço na pousada",
    cobranca: "Por pessoa",
    preco: 150,
    quantidade: "10x",
    vinculos: "4 produto(s)",
    status: "Ativo",
    descricao: "Refeição completa servida no encerramento da atividade.",
  },
  {
    id: "rec-002",
    nome: "Alimentação",
    cobranca: "Por pessoa",
    preco: 220,
    quantidade: "Por opção",
    vinculos: "3 produto(s)",
    status: "Ativo",
    descricao: "Pacote de alimentação para roteiros de dia inteiro.",
  },
  {
    id: "rec-003",
    nome: "Transporte",
    cobranca: "Por compra (grupo)",
    preco: 180,
    quantidade: "Por opção",
    vinculos: "2 produto(s)",
    status: "Ativo",
    descricao: "Deslocamento de apoio para grupos fechados.",
  },
  {
    id: "rec-004",
    nome: "Camiseta (Tam. P)",
    cobranca: "Por pessoa",
    preco: 90,
    quantidade: "1x",
    vinculos: "1 produto(s)",
    status: "Ativo",
    descricao: "Item opcional de identificação para participantes.",
  },
  {
    id: "rec-005",
    nome: "Camiseta (Tam. M)",
    cobranca: "Por pessoa",
    preco: 280,
    quantidade: "2x",
    vinculos: "2 produto(s)",
    status: "Ativo",
    descricao: "Item opcional de identificação para participantes.",
  },
  {
    id: "rec-006",
    nome: "Camiseta (Tam. G)",
    cobranca: "Por pessoa",
    preco: 120,
    quantidade: "12x",
    vinculos: "Sem vínculos",
    status: "Rascunho",
    descricao: "Item opcional de identificação para participantes.",
  },
  {
    id: "rec-007",
    nome: "Guia Bilíngue",
    cobranca: "Por compra (grupo)",
    preco: 75,
    quantidade: "16x",
    vinculos: "1 produto(s)",
    status: "Ativo",
    descricao: "Condutor adicional para grupos com idioma estrangeiro.",
  },
  {
    id: "rec-008",
    nome: "Mochila de ataque",
    cobranca: "Por compra (grupo)",
    preco: 95,
    quantidade: "10x",
    vinculos: "Sem vínculos",
    status: "Inativo",
    descricao: "Equipamento de apoio para roteiros longos.",
  },
  {
    id: "rec-009",
    nome: "Combo de alimentação",
    cobranca: "Por pessoa",
    preco: 110,
    quantidade: "20x",
    vinculos: "4 produtos",
    status: "Ativo",
    descricao: "Combinação de lanche, água e fruta para trilhas.",
  },
  {
    id: "rec-010",
    nome: "Kit primeiros socorros",
    cobranca: "Por compra (grupo)",
    preco: 60,
    quantidade: "3x",
    vinculos: "Sem vínculos",
    status: "Inativo",
    descricao: "Kit de segurança reservado para equipes de condução.",
  },
];

const emptyForm: RecursoFormState = {
  nome: "",
  cobranca: "Por pessoa",
  preco: "",
  quantidade: "",
  vinculos: "",
  status: "Rascunho",
  descricao: "",
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 2,
  }).format(value);
}

function parseCurrency(value: string) {
  const normalized = value.trim().replace(/\./g, "").replace(",", ".");
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
}

function formFromResource(resource: Recurso): RecursoFormState {
  return {
    nome: resource.nome,
    cobranca: resource.cobranca,
    preco: String(resource.preco).replace(".", ","),
    quantidade: resource.quantidade,
    vinculos: resource.vinculos,
    status: resource.status,
    descricao: resource.descricao,
  };
}

function buildResourceFromForm(form: RecursoFormState, current?: Recurso): Recurso {
  return {
    id: current?.id ?? `rec-${Date.now()}`,
    nome: form.nome.trim(),
    cobranca: form.cobranca,
    preco: parseCurrency(form.preco),
    quantidade: form.quantidade.trim(),
    vinculos: form.vinculos.trim() || "Sem vínculos",
    status: form.status,
    descricao: form.descricao.trim(),
  };
}

export function RecursosPage() {
  const [resources, setResources] = useState<Recurso[]>(initialResources);
  const [search, setSearch] = useState("");
  const [billingFilter, setBillingFilter] = useState<"todos" | RecursoCobranca>("todos");
  const [statusFilter, setStatusFilter] = useState<"todos" | RecursoStatus>("todos");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<RecursoFormState>(emptyForm);
  const [formError, setFormError] = useState("");

  const filteredResources = useMemo(() => {
    const term = search.trim().toLowerCase();
    return resources.filter((resource) => {
      const matchesSearch =
        term.length === 0 ||
        resource.nome.toLowerCase().includes(term) ||
        resource.descricao.toLowerCase().includes(term) ||
        resource.cobranca.toLowerCase().includes(term) ||
        resource.vinculos.toLowerCase().includes(term);
      const matchesBilling = billingFilter === "todos" || resource.cobranca === billingFilter;
      const matchesStatus = statusFilter === "todos" || resource.status === statusFilter;
      return matchesSearch && matchesBilling && matchesStatus;
    });
  }, [billingFilter, resources, search, statusFilter]);

  const totalResources = resources.length;
  const activeResources = resources.filter((resource) => resource.status === "Ativo").length;
  const inactiveResources = resources.filter((resource) => resource.status === "Inativo").length;
  const visibleResources = filteredResources.slice(0, RESOURCE_PAGE_SIZE);
  const totalPages = Math.max(1, Math.ceil(filteredResources.length / RESOURCE_PAGE_SIZE));
  const allVisibleSelected =
    visibleResources.length > 0 &&
    visibleResources.every((resource) => selectedIds.includes(resource.id));
  const editingResource = editingId
    ? resources.find((resource) => resource.id === editingId)
    : undefined;

  const updateForm = <K extends keyof RecursoFormState>(key: K, value: RecursoFormState[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
    setFormError("");
  };

  const openNewResource = () => {
    setEditingId(null);
    setForm(emptyForm);
    setFormError("");
    setDialogOpen(true);
  };

  const openEditResource = (resource: Recurso) => {
    setEditingId(resource.id);
    setForm(formFromResource(resource));
    setFormError("");
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setEditingId(null);
    setForm(emptyForm);
    setFormError("");
  };

  const saveResource = (event: FormEvent) => {
    event.preventDefault();
    if (!form.nome.trim()) {
      setFormError("Informe o nome do recurso.");
      return;
    }
    if (!form.quantidade.trim()) {
      setFormError("Informe a quantidade.");
      return;
    }

    const nextResource = buildResourceFromForm(form, editingResource);
    setResources((current) => {
      if (editingResource) {
        return current.map((resource) =>
          resource.id === editingResource.id ? nextResource : resource
        );
      }
      return [nextResource, ...current];
    });
    closeDialog();
  };

  const duplicateResource = (resource: Recurso) => {
    setResources((current) => [
      {
        ...resource,
        id: `rec-${Date.now()}`,
        nome: `${resource.nome} (cópia)`,
        status: "Rascunho",
      },
      ...current,
    ]);
  };

  const toggleResourceActive = (resource: Recurso) => {
    setResources((current) =>
      current.map((item) =>
        item.id === resource.id
          ? { ...item, status: item.status === "Ativo" ? "Inativo" : "Ativo" }
          : item
      )
    );
  };

  const deleteResource = (resource: Recurso) => {
    setResources((current) => current.filter((item) => item.id !== resource.id));
    setSelectedIds((current) => current.filter((id) => id !== resource.id));
  };

  const toggleSelected = (resourceId: string) => {
    setSelectedIds((current) =>
      current.includes(resourceId)
        ? current.filter((id) => id !== resourceId)
        : [...current, resourceId]
    );
  };

  const toggleAllVisible = () => {
    if (allVisibleSelected) {
      setSelectedIds((current) =>
        current.filter((id) => !visibleResources.some((resource) => resource.id === id))
      );
      return;
    }

    setSelectedIds((current) => [
      ...current,
      ...visibleResources
        .filter((resource) => !current.includes(resource.id))
        .map((resource) => resource.id),
    ]);
  };

  return (
    <AppPage
      title="Recursos"
      description="Gerencie seu catálogo de atividades, experiências e pacotes."
      breadcrumb={[{ title: "Produtos" }]}
      actions={
        <Button
          type="button"
          onClick={openNewResource}
          className="h-9 rounded-[10px] px-4 font-['Helvetica_Neue:Medium',sans-serif]"
        >
          <HugeiconsIcon icon={PlusSignIcon} size={16} strokeWidth={1.5} aria-hidden="true" />
          Novo recurso
        </Button>
      }
    >
      <div className="flex flex-col gap-[24px] pb-[40px]">
        <div className="grid grid-cols-1 gap-[24px] md:grid-cols-3">
          {[
            {
              label: "Total de itens",
              subtitle: "Catálogo completo",
              value: totalResources.toString(),
              icon: <ResourceItemsIcon />,
            },
            {
              label: "Ativos",
              subtitle: "Recursos disponíveis",
              value: activeResources.toString(),
              icon: (
                <HugeiconsIcon
                  icon={CheckmarkCircle01Icon}
                  size={20}
                  strokeWidth={1.5}
                  className="text-primary"
                  aria-hidden="true"
                />
              ),
            },
            {
              label: "Inativos",
              subtitle: "Recursos desativados",
              value: inactiveResources.toString(),
              icon: (
                <HugeiconsIcon
                  icon={CancelCircleIcon}
                  size={20}
                  strokeWidth={1.5}
                  className="text-primary"
                  aria-hidden="true"
                />
              ),
            },
          ].map((card) => (
            <div
              key={card.label}
              className="bg-card text-card-foreground ring-foreground/5 flex min-h-[92px] flex-col gap-0 overflow-hidden rounded-[30px] py-0 text-sm shadow-none ring-1"
            >
              <div className="h-full p-[17.5px]">
                <div className="flex h-full items-start justify-between gap-3">
                  <div className="flex h-full min-w-0 flex-col justify-between">
                    <span className="text-muted-foreground font-['Helvetica_Neue:Medium',sans-serif] text-xs leading-tight">
                      {card.label}
                    </span>
                    <p className="mt-1.5 font-['Helvetica_Neue:Regular',sans-serif] text-2xl leading-6 tracking-tight text-[#0f172b]">
                      {card.value}
                    </p>
                    <span className="text-muted-foreground mt-[3px] block font-['Helvetica_Neue:Regular',sans-serif] text-xs leading-4">
                      {card.subtitle}
                    </span>
                  </div>
                  <div className="bg-primary/10 flex size-[35px] shrink-0 items-center justify-center rounded-[10px]">
                    {card.icon}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <div className="relative flex-1 md:max-w-[20em]">
              <HugeiconsIcon
                icon={Search01Icon}
                size={16}
                strokeWidth={1.5}
                className="text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2"
                aria-hidden="true"
              />
              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Pesquisar..."
                className="border-border bg-input/50 placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/30 h-9 w-full min-w-0 rounded-md border px-3 py-1 pl-[2.25em] font-['Helvetica_Neue:Regular',sans-serif] text-base text-[#252b37] transition-[color,box-shadow,background-color] outline-none focus-visible:ring-3 md:text-sm"
              />
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={() => setFiltersOpen((open) => !open)}
              aria-expanded={filtersOpen}
              className="h-9 rounded-lg px-3 font-['Helvetica_Neue:Regular',sans-serif] text-[#414651]"
            >
              <HugeiconsIcon
                icon={FilterHorizontalIcon}
                size={16}
                strokeWidth={1.5}
                aria-hidden="true"
              />
              Filtros
            </Button>
            <div className="md:ml-auto">
              <select
                aria-label="Filtrar recursos por status"
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value as "todos" | RecursoStatus)}
                className="border-border bg-background h-9 w-44 rounded-lg border px-3 font-['Helvetica_Neue:Regular',sans-serif] text-sm text-[#414651] outline-none focus-visible:border-[#0b5ed7] focus-visible:ring-3 focus-visible:ring-[#1570ef]/20"
              >
                <option value="todos">Todos os status</option>
                <option value="Ativo">Ativos</option>
                <option value="Inativo">Inativos</option>
                <option value="Rascunho">Rascunhos</option>
              </select>
            </div>
          </div>

          {filtersOpen ? (
            <div className="flex flex-wrap items-center gap-2 rounded-[12px] border border-[#e9eaeb] bg-white p-3">
              {[
                { label: "Todas as cobranças", value: "todos" },
                { label: "Por pessoa", value: "Por pessoa" },
                { label: "Por opção", value: "Por opção" },
                { label: "Por compra", value: "Por compra (grupo)" },
              ].map((filter) => {
                const selected = billingFilter === filter.value;
                return (
                  <button
                    key={filter.value}
                    type="button"
                    onClick={() => setBillingFilter(filter.value as "todos" | RecursoCobranca)}
                    className={`h-8 rounded-full border px-3 font-['Helvetica_Neue:Regular',sans-serif] text-xs transition-colors ${
                      selected
                        ? "border-primary bg-primary/10 text-primary"
                        : "hover:border-primary/40 hover:bg-primary/5 hover:text-primary border-[#e9eaeb] bg-white text-[#535862]"
                    }`}
                  >
                    {filter.label}
                  </button>
                );
              })}
            </div>
          ) : null}
        </div>

        <div className="overflow-hidden rounded-[12px] border border-[#e9eaeb] bg-white">
          <div className="overflow-x-auto">
            <div className="min-w-[830px]">
              <div className="flex h-[44px] items-center border-b border-[#e9eaeb] bg-[#fafafa] px-[16px]">
                <div className="w-[40px] shrink-0">
                  <button
                    type="button"
                    onClick={toggleAllVisible}
                    className={`flex size-5 items-center justify-center rounded-[6px] border transition-colors ${
                      allVisibleSelected ? "border-primary bg-primary" : "border-[#d5d7da] bg-white"
                    }`}
                    aria-label="Selecionar recursos visíveis"
                  >
                    {allVisibleSelected ? (
                      <HugeiconsIcon
                        icon={CheckmarkCircle01Icon}
                        size={14}
                        strokeWidth={2}
                        className="text-white"
                        aria-hidden="true"
                      />
                    ) : null}
                  </button>
                </div>
                <p className="min-w-0 flex-1 font-['Helvetica_Neue:Medium',sans-serif] text-[12px] tracking-[0.5px] text-[#717680] uppercase">
                  Nome
                </p>
                <p className="w-[115px] shrink-0 text-right font-['Helvetica_Neue:Medium',sans-serif] text-[12px] tracking-[0.5px] text-[#717680] uppercase">
                  Cobrança
                </p>
                <p className="w-[100px] shrink-0 text-right font-['Helvetica_Neue:Medium',sans-serif] text-[12px] tracking-[0.5px] text-[#717680] uppercase">
                  Preço
                </p>
                <p className="w-[140px] shrink-0 text-center font-['Helvetica_Neue:Medium',sans-serif] text-[12px] tracking-[0.5px] text-[#717680] uppercase">
                  Quantidade
                </p>
                <p className="w-[100px] shrink-0 font-['Helvetica_Neue:Medium',sans-serif] text-[12px] tracking-[0.5px] text-[#717680] uppercase">
                  Vínculos
                </p>
                <p className="w-[60px] shrink-0 text-center font-['Helvetica_Neue:Medium',sans-serif] text-[12px] tracking-[0.5px] text-[#717680] uppercase">
                  Ações
                </p>
              </div>

              {filteredResources.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-[8px] py-[48px]">
                  <HugeiconsIcon
                    icon={PackageIcon}
                    size={32}
                    strokeWidth={1.5}
                    className="text-[#a4a7ae]"
                    aria-hidden="true"
                  />
                  <p className="font-['Helvetica_Neue:Regular',sans-serif] text-[14px] text-[#717680]">
                    Nenhum recurso encontrado
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSearch("");
                      setBillingFilter("todos");
                      setStatusFilter("todos");
                    }}
                    className="font-['Helvetica_Neue:Medium',sans-serif] text-[13px] text-[#0b5ed7]"
                  >
                    Limpar filtros
                  </button>
                </div>
              ) : (
                visibleResources.map((resource, index) => {
                  const selected = selectedIds.includes(resource.id);
                  return (
                    <div
                      key={resource.id}
                      className={`relative flex h-[61px] items-center px-[16px] transition-colors hover:bg-[#f8fafc] ${index > 0 ? "border-t border-[#f5f5f5]" : ""}`}
                    >
                      <div className="w-[40px] shrink-0">
                        <button
                          type="button"
                          onClick={() => toggleSelected(resource.id)}
                          className={`flex size-5 items-center justify-center rounded-[6px] border transition-colors ${
                            selected ? "border-primary bg-primary" : "border-[#d5d7da] bg-white"
                          }`}
                          aria-label={`Selecionar ${resource.nome}`}
                        >
                          {selected ? (
                            <HugeiconsIcon
                              icon={CheckmarkCircle01Icon}
                              size={14}
                              strokeWidth={2}
                              className="text-white"
                              aria-hidden="true"
                            />
                          ) : null}
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => openEditResource(resource)}
                        className="flex min-w-0 flex-1 items-center text-left"
                      >
                        <p className="truncate font-['Helvetica_Neue:Regular',sans-serif] text-[14px] text-[#181d27]">
                          {resource.nome}
                        </p>
                      </button>
                      <p className="w-[115px] shrink-0 text-right font-['Helvetica_Neue:Regular',sans-serif] text-[13px] text-[#535862]">
                        {resource.cobranca}
                      </p>
                      <p className="w-[100px] shrink-0 text-right font-['Helvetica_Neue:Regular',sans-serif] text-[13px] text-[#181d27]">
                        {formatCurrency(resource.preco)}
                      </p>
                      <p className="w-[140px] shrink-0 text-center font-['Helvetica_Neue:Regular',sans-serif] text-[13px] text-[#535862]">
                        {resource.quantidade}
                      </p>
                      <p className="w-[100px] shrink-0 font-['Helvetica_Neue:Regular',sans-serif] text-[13px] text-[#535862]">
                        {resource.vinculos}
                      </p>
                      <div className="flex w-[60px] shrink-0 justify-center">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button
                              type="button"
                              className="hover:bg-muted/70 focus-visible:ring-primary/20 flex size-[32px] cursor-pointer items-center justify-center rounded-[10px] transition-colors outline-none focus-visible:ring-3"
                              aria-label={`Ações de ${resource.nome}`}
                            >
                              <HugeiconsIcon
                                icon={MoreVerticalIcon}
                                size={16}
                                strokeWidth={1.5}
                                className="text-[#535862]"
                                aria-hidden="true"
                              />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            sideOffset={4}
                            className="w-[220px] rounded-[8px] border border-[#f5f5f5] bg-white p-[6px] text-[#0f172a] shadow-[0_8px_24px_rgba(15,23,42,0.12)] ring-0 before:hidden"
                          >
                            <DropdownMenuItem
                              onClick={() => openEditResource(resource)}
                              className="h-[37px] cursor-pointer gap-[8px] rounded-[6px] px-[12px] py-[10px] font-['Helvetica_Neue:Regular',sans-serif] text-[14px] text-[#0f172a] focus:bg-[#f8fafc] focus:text-[#0f172a]"
                            >
                              <HugeiconsIcon
                                icon={Edit04Icon}
                                size={16}
                                strokeWidth={RESOURCE_ACTION_ICON_STROKE_WIDTH}
                                aria-hidden="true"
                              />
                              Editar recurso
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => toggleResourceActive(resource)}
                              className="h-[37px] cursor-pointer gap-[8px] rounded-[6px] px-[12px] py-[10px] font-['Helvetica_Neue:Regular',sans-serif] text-[14px] text-[#0f172a] focus:bg-[#f8fafc] focus:text-[#0f172a]"
                            >
                              <HugeiconsIcon
                                icon={StatusIcon}
                                size={16}
                                strokeWidth={RESOURCE_ACTION_ICON_STROKE_WIDTH}
                                aria-hidden="true"
                              />
                              <span className="min-w-0 flex-1">Recurso ativo</span>
                              <Switch
                                checked={resource.status === "Ativo"}
                                aria-label={
                                  resource.status === "Ativo"
                                    ? "Desativar recurso"
                                    : "Ativar recurso"
                                }
                                tabIndex={-1}
                              />
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => duplicateResource(resource)}
                              className="h-[37px] cursor-pointer gap-[8px] rounded-[6px] px-[12px] py-[10px] font-['Helvetica_Neue:Regular',sans-serif] text-[14px] text-[#0f172a] focus:bg-[#f8fafc] focus:text-[#0f172a]"
                            >
                              <HugeiconsIcon
                                icon={Copy01Icon}
                                size={16}
                                strokeWidth={RESOURCE_ACTION_ICON_STROKE_WIDTH}
                                aria-hidden="true"
                              />
                              Clonar recurso
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="my-[4px] bg-[#f5f5f5]" />
                            <DropdownMenuItem
                              onClick={() => deleteResource(resource)}
                              className="h-[37px] cursor-pointer gap-[8px] rounded-[6px] px-[12px] py-[10px] font-['Helvetica_Neue:Regular',sans-serif] text-[14px] text-[#F04438] focus:bg-[#fef3f2] focus:text-[#F04438] [&_svg]:text-[#F04438]"
                              style={{ color: "#F04438" }}
                            >
                              <HugeiconsIcon
                                icon={Delete02Icon}
                                size={16}
                                strokeWidth={RESOURCE_ACTION_ICON_STROKE_WIDTH}
                                aria-hidden="true"
                              />
                              Excluir recurso
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
          <div className="flex min-h-[64px] flex-col gap-3 border-t border-[#f5f5f5] p-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="font-['Helvetica_Neue:Regular',sans-serif] text-sm text-[#71717a]">
              {selectedIds.length === 0
                ? "Nenhum recurso selecionado."
                : selectedIds.length === 1
                  ? "1 recurso selecionado"
                  : `${selectedIds.length} recursos selecionados`}
            </p>
            <div className="flex flex-wrap items-center gap-3 sm:justify-end">
              <p className="font-['Helvetica_Neue:Regular',sans-serif] text-sm text-[#09090b]">
                Página 1 de {totalPages}
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled
                  className="h-8 w-[90px] cursor-not-allowed rounded-[8px] border border-[#e2e8f0] bg-white px-4 font-['Helvetica_Neue:Regular',sans-serif] text-sm text-[#717680] opacity-75"
                >
                  Anterior
                </button>
                <button
                  type="button"
                  disabled={totalPages === 1}
                  className="h-8 w-[90px] rounded-[8px] border border-[#e2e8f0] bg-white px-4 font-['Helvetica_Neue:Regular',sans-serif] text-sm text-[#252b37] transition-colors hover:bg-[#f8fafc] disabled:cursor-not-allowed disabled:text-[#717680] disabled:opacity-75"
                >
                  Próxima
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Dialog
        open={dialogOpen}
        onOpenChange={(open) => (open ? setDialogOpen(true) : closeDialog())}
      >
        <DialogContent className="rounded-2xl sm:max-w-[560px]">
          <form onSubmit={saveResource}>
            <DialogHeader>
              <DialogTitle className="font-['Helvetica_Neue:Medium',sans-serif] text-base text-[#181d27]">
                {editingResource ? "Editar recurso" : "Novo recurso"}
              </DialogTitle>
              <DialogDescription className="font-['Helvetica_Neue:Regular',sans-serif] text-sm text-[#535862]">
                Defina o item, cobrança, preço e vínculos com produtos.
              </DialogDescription>
            </DialogHeader>

            <div className="mt-5 flex flex-col gap-4">
              <label className="flex flex-col gap-1.5">
                <span className="font-['Helvetica_Neue:Regular',sans-serif] text-sm text-[#181d27]">
                  Nome do recurso
                </span>
                <input
                  className="focus:border-primary focus:ring-primary/20 h-10 w-full rounded-[8px] border border-[#cbd5e1] bg-white px-3 font-['Helvetica_Neue:Regular',sans-serif] text-sm text-[#414651] transition-colors outline-none placeholder:text-[#94a3b8] focus:ring-3"
                  placeholder="Ex.: Capacete de escalada"
                  value={form.nome}
                  onChange={(event) => updateForm("nome", event.target.value)}
                />
              </label>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <label className="flex flex-col gap-1.5">
                  <span className="font-['Helvetica_Neue:Regular',sans-serif] text-sm text-[#181d27]">
                    Cobrança
                  </span>
                  <select
                    value={form.cobranca}
                    onChange={(event) =>
                      updateForm("cobranca", event.target.value as RecursoCobranca)
                    }
                    className="focus:border-primary focus:ring-primary/20 h-10 w-full rounded-[8px] border border-[#cbd5e1] bg-white px-3 font-['Helvetica_Neue:Regular',sans-serif] text-sm text-[#414651] outline-none focus:ring-3"
                  >
                    <option value="Por pessoa">Por pessoa</option>
                    <option value="Por opção">Por opção</option>
                    <option value="Por compra (grupo)">Por compra (grupo)</option>
                  </select>
                </label>
                <label className="flex flex-col gap-1.5">
                  <span className="font-['Helvetica_Neue:Regular',sans-serif] text-sm text-[#181d27]">
                    Status
                  </span>
                  <select
                    value={form.status}
                    onChange={(event) => updateForm("status", event.target.value as RecursoStatus)}
                    className="focus:border-primary focus:ring-primary/20 h-10 w-full rounded-[8px] border border-[#cbd5e1] bg-white px-3 font-['Helvetica_Neue:Regular',sans-serif] text-sm text-[#414651] outline-none focus:ring-3"
                  >
                    <option value="Ativo">Ativo</option>
                    <option value="Inativo">Inativo</option>
                    <option value="Rascunho">Rascunho</option>
                  </select>
                </label>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <label className="flex flex-col gap-1.5">
                  <span className="font-['Helvetica_Neue:Regular',sans-serif] text-sm text-[#181d27]">
                    Preço (R$)
                  </span>
                  <input
                    inputMode="decimal"
                    className="focus:border-primary focus:ring-primary/20 h-10 w-full rounded-[8px] border border-[#cbd5e1] bg-white px-3 font-['Helvetica_Neue:Regular',sans-serif] text-sm text-[#414651] transition-colors outline-none placeholder:text-[#94a3b8] focus:ring-3"
                    placeholder="0,00"
                    value={form.preco}
                    onChange={(event) => updateForm("preco", event.target.value)}
                  />
                </label>
                <label className="flex flex-col gap-1.5">
                  <span className="font-['Helvetica_Neue:Regular',sans-serif] text-sm text-[#181d27]">
                    Quantidade
                  </span>
                  <input
                    className="focus:border-primary focus:ring-primary/20 h-10 w-full rounded-[8px] border border-[#cbd5e1] bg-white px-3 font-['Helvetica_Neue:Regular',sans-serif] text-sm text-[#414651] transition-colors outline-none placeholder:text-[#94a3b8] focus:ring-3"
                    placeholder="10x"
                    value={form.quantidade}
                    onChange={(event) => updateForm("quantidade", event.target.value)}
                  />
                </label>
                <label className="flex flex-col gap-1.5">
                  <span className="font-['Helvetica_Neue:Regular',sans-serif] text-sm text-[#181d27]">
                    Vínculos
                  </span>
                  <input
                    className="focus:border-primary focus:ring-primary/20 h-10 w-full rounded-[8px] border border-[#cbd5e1] bg-white px-3 font-['Helvetica_Neue:Regular',sans-serif] text-sm text-[#414651] transition-colors outline-none placeholder:text-[#94a3b8] focus:ring-3"
                    placeholder="Sem vínculos"
                    value={form.vinculos}
                    onChange={(event) => updateForm("vinculos", event.target.value)}
                  />
                </label>
              </div>

              <label className="flex flex-col gap-1.5">
                <span className="font-['Helvetica_Neue:Regular',sans-serif] text-sm text-[#181d27]">
                  Descrição
                </span>
                <textarea
                  className="focus:border-primary focus:ring-primary/20 min-h-[88px] w-full resize-y rounded-[8px] border border-[#cbd5e1] bg-white px-3 py-2 font-['Helvetica_Neue:Regular',sans-serif] text-sm text-[#414651] transition-colors outline-none placeholder:text-[#94a3b8] focus:ring-3"
                  placeholder="Detalhe quando este recurso deve ser usado."
                  value={form.descricao}
                  onChange={(event) => updateForm("descricao", event.target.value)}
                />
              </label>

              {formError ? (
                <p className="font-['Helvetica_Neue:Regular',sans-serif] text-sm text-[#d92d20]">
                  {formError}
                </p>
              ) : null}
            </div>

            <DialogFooter className="mt-6">
              <button
                type="button"
                onClick={closeDialog}
                className="h-10 rounded-[10px] border border-[#e2e8f0] bg-white px-4 font-['Helvetica_Neue:Regular',sans-serif] text-sm text-[#252b37] transition-colors hover:bg-[#f8fafc]"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="bg-primary text-primary-foreground hover:bg-primary/90 h-10 rounded-[10px] px-6 font-['Helvetica_Neue:Medium',sans-serif] text-sm transition-colors"
              >
                Salvar
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AppPage>
  );
}
