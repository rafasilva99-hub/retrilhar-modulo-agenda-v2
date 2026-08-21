import { type FormEvent, useMemo, useState } from "react";
import {
  Copy01Icon,
  Delete02Icon,
  Edit04Icon,
  PackageIcon,
  StatusIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { AppPage } from "@/components/layout/app-page";
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
type RecursoCategoria = "Equipamento" | "Alimentação" | "Transporte" | "Operação";

interface Recurso {
  id: string;
  nome: string;
  categoria: RecursoCategoria;
  unidade: string;
  custo: number;
  estoque: number;
  status: RecursoStatus;
  descricao: string;
}

interface RecursoFormState {
  nome: string;
  categoria: RecursoCategoria;
  unidade: string;
  custo: string;
  estoque: string;
  status: RecursoStatus;
  descricao: string;
}

const RESOURCE_ACTION_ICON_STROKE_WIDTH = 1.5;

const initialResources: Recurso[] = [
  {
    id: "rec-001",
    nome: "Capacete de escalada",
    categoria: "Equipamento",
    unidade: "unidade",
    custo: 18,
    estoque: 42,
    status: "Ativo",
    descricao: "Equipamento obrigatório em atividades verticais.",
  },
  {
    id: "rec-002",
    nome: "Kit lanche trilha",
    categoria: "Alimentação",
    unidade: "kit",
    custo: 32,
    estoque: 80,
    status: "Ativo",
    descricao: "Lanche individual para roteiros de meio período.",
  },
  {
    id: "rec-003",
    nome: "Van executiva",
    categoria: "Transporte",
    unidade: "diária",
    custo: 950,
    estoque: 3,
    status: "Ativo",
    descricao: "Recurso de deslocamento para grupos fechados.",
  },
  {
    id: "rec-004",
    nome: "Rádio comunicador",
    categoria: "Operação",
    unidade: "unidade",
    custo: 12,
    estoque: 18,
    status: "Inativo",
    descricao: "Controle de comunicação entre condutores.",
  },
  {
    id: "rec-005",
    nome: "Capa de chuva",
    categoria: "Equipamento",
    unidade: "unidade",
    custo: 9,
    estoque: 120,
    status: "Rascunho",
    descricao: "Item opcional para roteiros em período chuvoso.",
  },
];

const emptyForm: RecursoFormState = {
  nome: "",
  categoria: "Equipamento",
  unidade: "",
  custo: "",
  estoque: "",
  status: "Rascunho",
  descricao: "",
};

const resourceStatusColors: Record<RecursoStatus, { text: string; bg: string; border: string }> = {
  Ativo: { text: "#079455", bg: "#ecfdf3", border: "#abefc6" },
  Inativo: { text: "#535862", bg: "#f5f5f5", border: "#e9eaeb" },
  Rascunho: { text: "#dc6803", bg: "#fffaeb", border: "#fedf89" },
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

function parseStock(value: string) {
  const parsed = Number(value.trim());
  return Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : 0;
}

function formFromResource(resource: Recurso): RecursoFormState {
  return {
    nome: resource.nome,
    categoria: resource.categoria,
    unidade: resource.unidade,
    custo: String(resource.custo).replace(".", ","),
    estoque: resource.estoque.toString(),
    status: resource.status,
    descricao: resource.descricao,
  };
}

function buildResourceFromForm(form: RecursoFormState, current?: Recurso): Recurso {
  return {
    id: current?.id ?? `rec-${Date.now()}`,
    nome: form.nome.trim(),
    categoria: form.categoria,
    unidade: form.unidade.trim(),
    custo: parseCurrency(form.custo),
    estoque: parseStock(form.estoque),
    status: form.status,
    descricao: form.descricao.trim(),
  };
}

export function RecursosPage() {
  const [resources, setResources] = useState<Recurso[]>(initialResources);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<"todos" | RecursoCategoria>("todos");
  const [statusFilter, setStatusFilter] = useState<"todos" | RecursoStatus>("todos");
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
        resource.categoria.toLowerCase().includes(term);
      const matchesCategory = categoryFilter === "todos" || resource.categoria === categoryFilter;
      const matchesStatus = statusFilter === "todos" || resource.status === statusFilter;
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [categoryFilter, resources, search, statusFilter]);

  const totalResources = resources.length;
  const activeResources = resources.filter((resource) => resource.status === "Ativo").length;
  const totalStock = resources.reduce((total, resource) => total + resource.estoque, 0);
  const averageCost =
    resources.length > 0
      ? resources.reduce((total, resource) => total + resource.custo, 0) / resources.length
      : 0;
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
    if (!form.unidade.trim()) {
      setFormError("Informe a unidade de controle.");
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
  };

  return (
    <AppPage
      title="Recursos"
      description="Cadastre os insumos da organização usados na operação e composição dos produtos."
      breadcrumb={[{ title: "Produtos" }]}
      actions={
        <button
          type="button"
          onClick={openNewResource}
          className="group/button bg-primary text-primary-foreground hover:bg-primary/80 inline-flex h-9 shrink-0 items-center justify-center gap-1.5 rounded-lg border border-transparent px-3 font-['Helvetica_Neue:Medium',sans-serif] text-sm transition-all"
        >
          <svg className="size-[16px]" fill="none" viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M12 4V20M20 12H4"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
            />
          </svg>
          Novo recurso
        </button>
      }
    >
      <div className="flex flex-col gap-[24px] pb-[40px]">
        <div className="grid grid-cols-1 gap-[1em] sm:grid-cols-2 md:grid-cols-4">
          {[
            {
              label: "Total de recursos",
              subtitle: "Insumos cadastrados",
              value: totalResources.toString(),
            },
            {
              label: "Ativos",
              subtitle: "Disponíveis para uso",
              value: activeResources.toString(),
            },
            {
              label: "Estoque total",
              subtitle: "Soma dos itens",
              value: totalStock.toString(),
            },
            {
              label: "Custo médio",
              subtitle: "Valor por recurso",
              value: formatCurrency(averageCost),
            },
          ].map((card) => (
            <div
              key={card.label}
              className="bg-card text-card-foreground ring-foreground/5 flex flex-col gap-0 overflow-hidden rounded-4xl py-0 text-sm shadow-none ring-1"
            >
              <div className="h-full p-[1.25em]">
                <div className="flex h-full items-start justify-between gap-[0.75em]">
                  <div className="flex h-full min-w-0 flex-col justify-between">
                    <span className="text-muted-foreground font-['Helvetica_Neue:Medium',sans-serif] text-xs leading-tight">
                      {card.label}
                    </span>
                    <p className="mt-[0.25em] font-['Helvetica_Neue:Regular',sans-serif] text-2xl leading-none tracking-tight text-[#0f172b]">
                      {card.value}
                    </p>
                    <span className="text-muted-foreground mt-[0.25em] block font-['Helvetica_Neue:Regular',sans-serif] text-xs">
                      {card.subtitle}
                    </span>
                  </div>
                  <div className="bg-primary/10 flex size-[2.5em] shrink-0 items-center justify-center rounded-lg">
                    <HugeiconsIcon
                      icon={PackageIcon}
                      size={20}
                      strokeWidth={1.5}
                      className="text-primary"
                      aria-hidden="true"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-[0.75em]">
          <div className="relative flex-1 md:max-w-[20em]">
            <svg
              className="text-muted-foreground absolute top-1/2 left-[0.75em] size-[16px] -translate-y-1/2"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                d="M17 17L21 21"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
              />
              <path
                d="M19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19C15.4183 19 19 15.4183 19 11Z"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
              />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Pesquisar..."
              className="border-border bg-input/50 placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/30 h-9 w-full min-w-0 rounded-md border px-3 py-1 pl-[2.25em] font-['Helvetica_Neue:Regular',sans-serif] text-base text-[#252b37] transition-[color,box-shadow,background-color] outline-none focus-visible:ring-3 md:text-sm"
            />
          </div>
          <div className="ml-auto hidden items-center gap-[0.75em] md:flex">
            <select
              aria-label="Filtrar por categoria"
              value={categoryFilter}
              onChange={(event) =>
                setCategoryFilter(event.target.value as "todos" | RecursoCategoria)
              }
              className="border-border bg-background h-9 w-44 rounded-lg border px-3 font-['Helvetica_Neue:Regular',sans-serif] text-sm text-[#414651] outline-none focus-visible:border-[#0b5ed7] focus-visible:ring-3 focus-visible:ring-[#1570ef]/20"
            >
              <option value="todos">Todas as categorias</option>
              <option value="Equipamento">Equipamento</option>
              <option value="Alimentação">Alimentação</option>
              <option value="Transporte">Transporte</option>
              <option value="Operação">Operação</option>
            </select>
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

        <div className="overflow-hidden rounded-[12px] border border-[#e9eaeb] bg-white">
          <div className="flex h-[44px] items-center border-b border-[#e9eaeb] bg-[#fafafa] px-[16px]">
            <p className="min-w-0 flex-1 font-['Helvetica_Neue:Medium',sans-serif] text-[12px] tracking-[0.5px] text-[#717680] uppercase">
              Recurso
            </p>
            <p className="w-[126px] shrink-0 font-['Helvetica_Neue:Medium',sans-serif] text-[12px] tracking-[0.5px] text-[#717680] uppercase">
              Categoria
            </p>
            <p className="w-[96px] shrink-0 font-['Helvetica_Neue:Medium',sans-serif] text-[12px] tracking-[0.5px] text-[#717680] uppercase">
              Unidade
            </p>
            <p className="w-[100px] shrink-0 text-right font-['Helvetica_Neue:Medium',sans-serif] text-[12px] tracking-[0.5px] text-[#717680] uppercase">
              Custo
            </p>
            <p className="w-[90px] shrink-0 text-center font-['Helvetica_Neue:Medium',sans-serif] text-[12px] tracking-[0.5px] text-[#717680] uppercase">
              Estoque
            </p>
            <p className="w-[84px] shrink-0 text-center font-['Helvetica_Neue:Medium',sans-serif] text-[12px] tracking-[0.5px] text-[#717680] uppercase">
              Status
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
                  setCategoryFilter("todos");
                  setStatusFilter("todos");
                }}
                className="font-['Helvetica_Neue:Medium',sans-serif] text-[13px] text-[#0b5ed7]"
              >
                Limpar filtros
              </button>
            </div>
          ) : (
            filteredResources.map((resource, index) => {
              const statusColors = resourceStatusColors[resource.status];
              return (
                <div
                  key={resource.id}
                  className={`relative flex h-[58px] items-center px-[16px] transition-colors hover:bg-[#f8fafc] ${index > 0 ? "border-t border-[#f5f5f5]" : ""}`}
                >
                  <button
                    type="button"
                    onClick={() => openEditResource(resource)}
                    className="min-w-0 flex-1 text-left"
                  >
                    <p className="truncate font-['Helvetica_Neue:Regular',sans-serif] text-[14px] text-[#181d27]">
                      {resource.nome}
                    </p>
                    <p className="truncate font-['Helvetica_Neue:Regular',sans-serif] text-[11px] text-[#717680]">
                      {resource.descricao || "Sem descrição"}
                    </p>
                  </button>
                  <p className="w-[126px] shrink-0 font-['Helvetica_Neue:Regular',sans-serif] text-[13px] text-[#535862]">
                    {resource.categoria}
                  </p>
                  <p className="w-[96px] shrink-0 font-['Helvetica_Neue:Regular',sans-serif] text-[13px] text-[#535862]">
                    {resource.unidade}
                  </p>
                  <p className="w-[100px] shrink-0 text-right font-['Helvetica_Neue:Regular',sans-serif] text-[13px] text-[#181d27]">
                    {formatCurrency(resource.custo)}
                  </p>
                  <p className="w-[90px] shrink-0 text-center font-['Helvetica_Neue:Regular',sans-serif] text-[13px] text-[#535862]">
                    {resource.estoque}
                  </p>
                  <div className="flex w-[84px] shrink-0 justify-center">
                    <button
                      type="button"
                      onClick={() => toggleResourceActive(resource)}
                      className="rounded-full px-[8px] py-[2px] font-['Helvetica_Neue:Regular',sans-serif] text-[12px]"
                      style={{
                        color: statusColors.text,
                        backgroundColor: statusColors.bg,
                        border: `1px solid ${statusColors.border}`,
                      }}
                    >
                      {resource.status}
                    </button>
                  </div>
                  <div className="flex w-[60px] shrink-0 justify-center">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button
                          type="button"
                          className="flex size-[32px] cursor-pointer items-center justify-center rounded-[8px] border border-[#e9eaeb] bg-white transition-colors hover:bg-[#f8fafc]"
                          aria-label={`Ações de ${resource.nome}`}
                        >
                          <svg
                            className="size-[14px]"
                            fill="none"
                            viewBox="0 0 16 16"
                            aria-hidden="true"
                          >
                            <circle cx="8" cy="3.5" r="1" fill="#717680" />
                            <circle cx="8" cy="8" r="1" fill="#717680" />
                            <circle cx="8" cy="12.5" r="1" fill="#717680" />
                          </svg>
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
                              resource.status === "Ativo" ? "Desativar recurso" : "Ativar recurso"
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

        <div className="flex items-center justify-between px-[4px]">
          <p className="font-['Helvetica_Neue:Regular',sans-serif] text-[13px] text-[#717680]">
            {filteredResources.length} recurso(s) exibido(s)
          </p>
          <p className="font-['Helvetica_Neue:Regular',sans-serif] text-[13px] text-[#414651]">
            Página 1 de 1
          </p>
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
                Defina o insumo, unidade de controle, custo e estoque disponível.
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
                    Categoria
                  </span>
                  <select
                    value={form.categoria}
                    onChange={(event) =>
                      updateForm("categoria", event.target.value as RecursoCategoria)
                    }
                    className="focus:border-primary focus:ring-primary/20 h-10 w-full rounded-[8px] border border-[#cbd5e1] bg-white px-3 font-['Helvetica_Neue:Regular',sans-serif] text-sm text-[#414651] outline-none focus:ring-3"
                  >
                    <option value="Equipamento">Equipamento</option>
                    <option value="Alimentação">Alimentação</option>
                    <option value="Transporte">Transporte</option>
                    <option value="Operação">Operação</option>
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
                    Unidade
                  </span>
                  <input
                    className="focus:border-primary focus:ring-primary/20 h-10 w-full rounded-[8px] border border-[#cbd5e1] bg-white px-3 font-['Helvetica_Neue:Regular',sans-serif] text-sm text-[#414651] transition-colors outline-none placeholder:text-[#94a3b8] focus:ring-3"
                    placeholder="unidade"
                    value={form.unidade}
                    onChange={(event) => updateForm("unidade", event.target.value)}
                  />
                </label>
                <label className="flex flex-col gap-1.5">
                  <span className="font-['Helvetica_Neue:Regular',sans-serif] text-sm text-[#181d27]">
                    Custo (R$)
                  </span>
                  <input
                    inputMode="decimal"
                    className="focus:border-primary focus:ring-primary/20 h-10 w-full rounded-[8px] border border-[#cbd5e1] bg-white px-3 font-['Helvetica_Neue:Regular',sans-serif] text-sm text-[#414651] transition-colors outline-none placeholder:text-[#94a3b8] focus:ring-3"
                    placeholder="0,00"
                    value={form.custo}
                    onChange={(event) => updateForm("custo", event.target.value)}
                  />
                </label>
                <label className="flex flex-col gap-1.5">
                  <span className="font-['Helvetica_Neue:Regular',sans-serif] text-sm text-[#181d27]">
                    Estoque
                  </span>
                  <input
                    inputMode="numeric"
                    pattern="[0-9]*"
                    className="focus:border-primary focus:ring-primary/20 h-10 w-full rounded-[8px] border border-[#cbd5e1] bg-white px-3 font-['Helvetica_Neue:Regular',sans-serif] text-sm text-[#414651] transition-colors outline-none placeholder:text-[#94a3b8] focus:ring-3"
                    placeholder="0"
                    value={form.estoque}
                    onChange={(event) => updateForm("estoque", event.target.value)}
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
