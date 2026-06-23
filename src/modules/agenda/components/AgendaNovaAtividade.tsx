import { useEffect, useRef, useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface AgendaNovaAtividadeProps {
  onBack: () => void;
}

interface FormState {
  titulo: string;
  descricao: string;
  local: string;
  produto: string;
  capacidadeMin: number;
  capacidadeMax: number;
  visibilidade: "publica" | "interna";
  linkGrupo: string;
  grupoClientes: string;
  dataInicio: string;
  horarioInicio: string;
  dataTermino: string;
  horarioTermino: string;
  multiplosHorarios: boolean;
  atividadeRepete: boolean;
  equipe: string[];
}

/* ------------------------------------------------------------------ */
/*  Shared field helper                                                */
/* ------------------------------------------------------------------ */

function FieldRow({
  label,
  children,
  hint,
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label>{label}</Label>
      {children}
      {hint && <p className="text-muted-foreground text-xs">{hint}</p>}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Card wrapper – Shopify-style flat card using shadcn Card           */
/* ------------------------------------------------------------------ */

const cardOverride = "rounded-xl shadow-sm";
const fieldSurfaceClass = "bg-[#fbfcfd]";

/* ------------------------------------------------------------------ */
/*  Mock product data — inherited defaults for schedule & capacity     */
/* ------------------------------------------------------------------ */

const mockProdutos: Record<string, { horarioInicio: string; horarioTermino: string; capacidadeMin: number; capacidadeMax: number }> = {
  "trilha-ecologica": { horarioInicio: "08:00", horarioTermino: "11:00", capacidadeMin: 5, capacidadeMax: 30 },
  "observacao-fauna": { horarioInicio: "06:00", horarioTermino: "09:30", capacidadeMin: 3, capacidadeMax: 15 },
};

/* ------------------------------------------------------------------ */
/*  Visibility toggle                                                  */
/* ------------------------------------------------------------------ */

function VisibilityToggle({
  value,
  onChange,
}: {
  value: "publica" | "interna";
  onChange: (v: "publica" | "interna") => void;
}) {
  return (
    <div className="bg-muted flex gap-1 rounded-lg p-1">
      {(["publica", "interna"] as const).map((opt) => (
        <button
          key={opt}
          type="button"
          className={cn(
            "flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-all",
            value === opt
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
          onClick={() => onChange(opt)}
        >
          {opt === "publica" ? "Pública" : "Interna"}
        </button>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */

export function AgendaNovaAtividade({ onBack }: AgendaNovaAtividadeProps) {
  const [form, setForm] = useState<FormState>({
    titulo: "",
    descricao: "",
    local: "",
    produto: "",
    capacidadeMin: 0,
    capacidadeMax: 200,
    visibilidade: "publica",
    linkGrupo: "",
    grupoClientes: "",
    dataInicio: "",
    horarioInicio: "",
    dataTermino: "",
    horarioTermino: "",
    multiplosHorarios: false,
    atividadeRepete: false,
    equipe: [],
  });

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const [teamSearch, setTeamSearch] = useState("");
  const [teamDropdownOpen, setTeamDropdownOpen] = useState(false);
  const teamDropdownRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!teamDropdownOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (teamDropdownRef.current && !teamDropdownRef.current.contains(e.target as Node)) {
        setTeamDropdownOpen(false);
        setTeamSearch("");
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [teamDropdownOpen]);
  const allGuides: { name: string; available: boolean }[] = [
    { name: "João Victor Silva de Albuquerque", available: true },
    { name: "Maria Eduarda Costa Albuquerque", available: true },
    { name: "Carlos Henrique Mendes de Carvalho", available: false },
    { name: "Ana Carolina Oliveira Vasconcelos", available: true },
    { name: "Pedro Santos", available: true },
    { name: "Fernanda Lima", available: false },
    { name: "Lucas Almeida", available: true },
    { name: "Beatriz Rocha", available: true },
  ];
  const availableGuides = allGuides.filter((g) => !form.equipe.includes(g.name));
  const filteredGuides = availableGuides.filter((g) => g.name.toLowerCase().includes(teamSearch.toLowerCase()));
  const [memberMenu, setMemberMenu] = useState<number | null>(null);
  const [guideInsurance, setGuideInsurance] = useState<Record<string, boolean>>({});
  const memberMenuRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (memberMenu === null) return;
    const handleClick = (e: MouseEvent) => {
      if (memberMenuRef.current && memberMenuRef.current.contains(e.target as Node)) return;
      setMemberMenu(null);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [memberMenu]);

  return (
    <div className="fixed inset-0 z-50 bg-[#f8fafc] flex flex-col">
      {/* ── Header — Logo + title + close ── */}
      <div className="flex h-[56px] items-center px-[20px] bg-white border-b border-[#e9eaeb] shrink-0">
        <div className="flex items-center gap-[16px]">
          <img src="/src/assets/retrilhar-logo.png" alt="Retrilhar" className="h-[24px]" />
          <div className="w-px h-[20px] bg-[#e9eaeb]" />
          <p className="font-['Helvetica_Neue:Regular',sans-serif] text-[14px] text-[#252b37]">Nova atividade</p>
        </div>
        <button onClick={onBack} className="ml-auto flex gap-[6px] items-center px-[14px] py-[8px] rounded-[8px] border border-[#e9eaeb] bg-white cursor-pointer hover:bg-[#f8fafc] transition-colors">
          <svg className="size-[14px]" fill="none" viewBox="0 0 18 18"><path d="M4 4l10 10M14 4L4 14" stroke="#717680" strokeWidth="1.5" strokeLinecap="round"/></svg>
          <p className="font-['Helvetica_Neue:Regular',sans-serif] text-[13px] text-[#535862]">Fechar</p>
        </button>
      </div>

      {/* ── Content ── */}
      <div className="flex-1 overflow-y-auto px-[16px] py-[24px] md:px-[32px]">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_400px]">
        {/* ---- Main column ---- */}
        <div className="flex flex-col gap-6">
          {/* Identificação */}
          <Card size="sm" className={cardOverride}>
            <CardHeader>
              <CardTitle>Identificação</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <FieldRow label="Título da atividade">
                <Input
                  className={fieldSurfaceClass}
                  placeholder="Insira o título do evento"
                  value={form.titulo}
                  onChange={(e) => update("titulo", e.target.value)}
                />
              </FieldRow>
              <FieldRow label="Descrição / Observações">
                <textarea
                  className={cn(
                    "border-border placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/30 w-full min-w-0 rounded-md border px-3 py-2 text-sm transition-[color,box-shadow,background-color] outline-none focus-visible:ring-3 resize-none",
                    fieldSurfaceClass
                  )}
                  placeholder="Adicione uma descrição ou observações sobre a atividade"
                  rows={3}
                  value={form.descricao}
                  onChange={(e) => update("descricao", e.target.value)}
                />
              </FieldRow>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FieldRow label="Local da atividade">
                  <Select value={form.local} onValueChange={(v) => update("local", v === "__none__" ? "" : v)}>
                    <SelectTrigger className={fieldSurfaceClass}>
                      <SelectValue placeholder="Selecione o local" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__none__" className="text-muted-foreground">Nenhum</SelectItem>
                      <SelectItem value="sede">Sede principal</SelectItem>
                      <SelectItem value="campo">Campo</SelectItem>
                      <SelectItem value="online">Online</SelectItem>
                    </SelectContent>
                  </Select>
                </FieldRow>
                <FieldRow
                  label="Produto vinculado (opcional)"
                  hint="Ao selecionar um produto, os horários e a capacidade serão herdados, mas podem ser editados."
                >
                  <Select value={form.produto} onValueChange={(v) => {
                    if (v === "__none__") { update("produto", ""); return; }
                    const defaults = mockProdutos[v];
                    if (defaults) {
                      setForm((prev) => ({
                        ...prev,
                        produto: v,
                        horarioInicio: defaults.horarioInicio,
                        horarioTermino: defaults.horarioTermino,
                        capacidadeMin: defaults.capacidadeMin,
                        capacidadeMax: defaults.capacidadeMax,
                      }));
                    } else {
                      update("produto", v);
                    }
                  }}>
                    <SelectTrigger className={fieldSurfaceClass}>
                      <SelectValue placeholder="Selecione um produto" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__none__" className="text-muted-foreground">Nenhum</SelectItem>
                      <SelectItem value="trilha-ecologica">Trilha Ecológica</SelectItem>
                      <SelectItem value="observacao-fauna">Observação de Fauna</SelectItem>
                    </SelectContent>
                  </Select>
                </FieldRow>
              </div>
            </CardContent>
          </Card>

          {/* Agenda */}
          <Card size="sm" className={cardOverride}>
            <CardHeader>
              <CardTitle>Agenda</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FieldRow label="Data de início">
                  <Input
                    className={fieldSurfaceClass}
                    placeholder="dd/mm/aaaa"
                    value={form.dataInicio}
                    onChange={(e) => update("dataInicio", e.target.value)}
                  />
                </FieldRow>
                <FieldRow label="Horário de início">
                  <Input
                    className={fieldSurfaceClass}
                    placeholder="00:00"
                    value={form.horarioInicio}
                    onChange={(e) => update("horarioInicio", e.target.value)}
                  />
                </FieldRow>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FieldRow label="Data de término">
                  <Input
                    className={fieldSurfaceClass}
                    placeholder="dd/mm/aaaa"
                    value={form.dataTermino}
                    onChange={(e) => update("dataTermino", e.target.value)}
                  />
                </FieldRow>
                <FieldRow label="Horário de término">
                  <Input
                    className={fieldSurfaceClass}
                    placeholder="00:00"
                    value={form.horarioTermino}
                    onChange={(e) => update("horarioTermino", e.target.value)}
                  />
                </FieldRow>
              </div>

              {/* Toggle options */}
              <div className="border-border space-y-4 border-t pt-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-sm font-medium">Múltiplos horários no mesmo dia</span>
                    <span className="text-muted-foreground text-xs">
                      Crie várias saídas do mesmo evento no dia sem precisar duplicar a atividade.
                    </span>
                  </div>
                  <Switch
                    checked={form.multiplosHorarios}
                    onCheckedChange={(v) => update("multiplosHorarios", v)}
                  />
                </div>
                <div className="flex items-center justify-between gap-4">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-sm font-medium">Essa atividade se repete?</span>
                    <span className="text-muted-foreground text-xs">
                      Configure uma programação recorrente para não precisar recriar a atividade
                      toda vez.
                    </span>
                  </div>
                  <Switch
                    checked={form.atividadeRepete}
                    onCheckedChange={(v) => update("atividadeRepete", v)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Capacidade */}
          <Card size="sm" className={cardOverride}>
            <CardHeader>
              <CardTitle>Capacidade</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <FieldRow label="Capacidade mínima">
                  <Input
                    className={fieldSurfaceClass}
                    type="number"
                    value={form.capacidadeMin}
                    onChange={(e) => {
                      const val = parseInt(e.target.value, 10);
                      if (!isNaN(val) && val >= 0) update("capacidadeMin", val);
                    }}
                    min={0}
                  />
                </FieldRow>
                <FieldRow label="Capacidade máxima">
                  <Input
                    className={fieldSurfaceClass}
                    type="number"
                    value={form.capacidadeMax}
                    onChange={(e) => {
                      const val = parseInt(e.target.value, 10);
                      if (!isNaN(val) && val >= 0) update("capacidadeMax", val);
                    }}
                    min={0}
                  />
                </FieldRow>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ---- Sidebar column ---- */}
        <div className="flex flex-col gap-6">
          {/* Visibilidade */}
          <Card size="sm" className={cardOverride}>
            <CardHeader>
              <CardTitle>Visibilidade</CardTitle>
            </CardHeader>
            <CardContent>
              <VisibilityToggle
                value={form.visibilidade}
                onChange={(v) => update("visibilidade", v)}
              />
            </CardContent>
          </Card>

          {/* Link de Grupo */}
          <Card size="sm" className={cardOverride}>
            <CardHeader>
              <CardTitle>Link de Grupo</CardTitle>
            </CardHeader>
            <CardContent>
              <Input
                className={fieldSurfaceClass}
                placeholder="Insira o link do WhatsApp"
                value={form.linkGrupo}
                onChange={(e) => update("linkGrupo", e.target.value)}
              />
            </CardContent>
          </Card>

          {/* Grupo de Clientes */}
          <Card size="sm" className={cardOverride}>
            <CardHeader>
              <CardTitle>Grupo de Clientes</CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={form.grupoClientes} onValueChange={(v) => update("grupoClientes", v === "__none__" ? "" : v)}>
                <SelectTrigger className={fieldSurfaceClass}>
                  <SelectValue placeholder="Selecione um ou mais grupos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__none__" className="text-muted-foreground">Nenhum</SelectItem>
                  <SelectItem value="regular">Clientes Regulares</SelectItem>
                  <SelectItem value="vip">VIP</SelectItem>
                  <SelectItem value="escolas">Escolas</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Equipe */}
          <Card size="sm" className={cn(cardOverride, "flex-1 !overflow-visible", form.equipe.length > 0 && "!pb-0")}>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Equipe responsável</CardTitle>
              {form.equipe.length > 0 && (
                <button
                  type="button"
                  className="text-[#0b5ed7] text-[12px] font-medium hover:underline cursor-pointer"
                  onClick={() => { const updated: Record<string, boolean> = {}; form.equipe.forEach((g) => { updated[g] = true; }); setGuideInsurance((prev) => ({ ...prev, ...updated })); }}
                >
                  Contratar seguro a todos
                </button>
              )}
            </CardHeader>
            <CardContent className="flex flex-col gap-[16px] flex-1">
              {/* Search dropdown — same pattern as equipe responsável */}
              <div className="relative" ref={teamDropdownRef}>
                <svg className="size-[16px] text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2 z-10 pointer-events-none" fill="none" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.5" /><path d="M16 16l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
                <Input
                  className={cn(fieldSurfaceClass, "pl-9 pr-9")}
                  value={teamSearch}
                  onChange={(e) => { setTeamSearch(e.target.value); if (!teamDropdownOpen) setTeamDropdownOpen(true); }}
                  onFocus={() => setTeamDropdownOpen(true)}
                  placeholder="Buscar ou adicionar membro..."
                />
                <button onClick={() => setTeamDropdownOpen(!teamDropdownOpen)} className="cursor-pointer shrink-0 absolute top-1/2 right-3 -translate-y-1/2" type="button">
                  <svg className={`size-[14px] text-muted-foreground transition-transform ${teamDropdownOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </button>
                {teamDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-[4px] bg-white border border-[#e9eaeb] rounded-[8px] shadow-[0px_4px_16px_0px_rgba(0,0,0,0.12)] z-50 overflow-hidden">
                    <div className="max-h-[200px] overflow-y-auto py-[4px]">
                      {filteredGuides.length > 0 ? filteredGuides.map((g) => {
                        const gi = g.name.split(" ").map((w: string) => w[0]).join("").slice(0, 2).toUpperCase();
                        return (
                          <button
                            key={g.name}
                            type="button"
                            onClick={() => {
                              setForm((prev) => ({ ...prev, equipe: [...prev.equipe, g.name] }));
                              setTeamDropdownOpen(false);
                              setTeamSearch("");
                            }}
                            className="flex items-center gap-[10px] w-full px-[12px] py-[8px] hover:bg-[#f8fafc] transition-colors cursor-pointer"
                          >
                            <div className="flex items-center justify-center rounded-full size-[32px] shrink-0 border border-[#bfdbfe] bg-[#eff6ff]">
                              <p className="font-['Helvetica_Neue:Medium',sans-serif] text-[11px] text-[#0b5ed7]">{gi}</p>
                            </div>
                            <div className="flex-1 min-w-0 text-left">
                              <p className="font-['Helvetica_Neue:Regular',sans-serif] text-[13px] text-[#252b37] truncate">{g.name}</p>
                              <p className={`font-['Helvetica_Neue:Regular',sans-serif] text-[11px] truncate ${g.available ? "text-[#079455]" : "text-[#e17c00]"}`}>{g.available ? "Disponível para a atividade" : "Alocado em outra atividade no mesmo horário"}</p>
                            </div>
                            <svg className="size-[14px] text-[#0b5ed7] shrink-0" fill="none" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
                          </button>
                        );
                      }) : (
                        <div className="px-[12px] py-[12px]">
                          <p className="font-['Helvetica_Neue:Regular',sans-serif] text-[13px] text-[#a4a7ae] text-center">Nenhum membro encontrado</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Assigned members */}
              {form.equipe.length > 0 ? (
                <div className="flex flex-col gap-[12px]">
                  {form.equipe.map((g, i) => {
                    const initials = g.split(" ").map((w: string) => w[0]).join("").slice(0, 2).toUpperCase();
                    const guide = allGuides.find((gi) => gi.name === g);
                    const hasTimeConflict = guide?.available === false;
                    const hasInsurance = guideInsurance[g] ?? false;
                    return (
                      <div key={g} className="flex items-center gap-[12px] px-[12px] py-[10px] rounded-[10px] border border-[#f5f5f5] bg-[#fafafa] hover:bg-[#f0f1f3] transition-colors">
                        <div className="flex items-center justify-center rounded-full size-[32px] shrink-0 border border-[#bfdbfe] bg-[#eff6ff]">
                          <p className="font-['Helvetica_Neue:Medium',sans-serif] text-[11px] text-[#0b5ed7]">{initials}</p>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-['Helvetica_Neue:Regular',sans-serif] text-[13px] text-[#252b37] truncate">{g}</p>
                          <div className="flex items-center gap-[6px] min-w-0">
                            <p className={`font-['Helvetica_Neue:Regular',sans-serif] text-[11px] shrink-0 ${hasInsurance ? "text-[#0b5ed7]" : "text-[#dc6803]"}`}>{hasInsurance ? "Seguro contratado" : "Sem seguro"}</p>
                            {hasTimeConflict && (
                              <>
                                <div className="h-[10px] w-px bg-[#d5d7da] shrink-0" />
                                <p className="font-['Helvetica_Neue:Regular',sans-serif] text-[11px] text-[#dc6803] truncate">Conflito de horário</p>
                              </>
                            )}
                          </div>
                        </div>
                        <div className="relative shrink-0" ref={memberMenu === i ? memberMenuRef : undefined}>
                          <button type="button" onClick={(e) => { e.stopPropagation(); setMemberMenu(memberMenu === i ? null : i); }} className="cursor-pointer flex items-center justify-center size-[24px] rounded-[6px] border border-[#e9eaeb] bg-white hover:bg-[#f8fafc] transition-colors">
                            <svg className="size-[12px]" fill="none" viewBox="0 0 16 16"><circle cx="8" cy="3.5" r="1.2" fill="#717680"/><circle cx="8" cy="8" r="1.2" fill="#717680"/><circle cx="8" cy="12.5" r="1.2" fill="#717680"/></svg>
                          </button>
                          {memberMenu === i && (
                            <div className="absolute right-0 top-full mt-[4px] bg-white border border-[#f5f5f5] rounded-[8px] shadow-[0px_4px_16px_0px_rgba(0,0,0,0.12)] w-[200px] z-10 py-[4px]">
                              <button type="button" onClick={() => { setGuideInsurance((prev) => ({ ...prev, [g]: !prev[g] })); setMemberMenu(null); }} className="cursor-pointer flex items-center gap-[8px] w-full px-[12px] py-[8px] hover:bg-[#f8fafc] transition-colors">
                                {hasInsurance ? (
                                  <svg className="shrink-0 size-[16px] text-[#414651]" fill="none" viewBox="0 0 20 20"><path d="M16.54 10.4165C16.54 10.4165 16.6668 7.86136 16.54 7.55495C16.4131 7.24853 16.1722 7.00756 15.6905 6.52564L11.7434 2.5768C11.3277 2.16088 11.1198 1.95292 10.8623 1.8297C10.8087 1.80407 10.7538 1.78132 10.6978 1.76155C10.4286 1.6665 10.1346 1.6665 9.5467 1.6665C6.84251 1.6665 5.49042 1.6665 4.5746 2.40522C4.38959 2.55446 4.22106 2.72306 4.07189 2.90815C3.3335 3.82436 3.3335 5.17705 3.3335 7.88241V11.6709C3.3335 14.8149 3.3335 16.3869 4.30981 17.3637C5.09571 18.1499 7.48039 17.8866 9.5467 17.9165M10.8335 2.08335V2.5002C10.8335 4.85825 10.8335 6.03727 11.5657 6.76982C12.298 7.50237 13.4765 7.50237 15.8335 7.50237H16.2502" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /><path d="M17.5 18.3335L12.5 13.3335M17.5 13.3335L12.5 18.3335" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                ) : (
                                  <svg className="shrink-0 size-[16px] text-[#414651]" fill="none" viewBox="0 0 20 20"><path d="M16.6668 9.99984V8.88055C16.6668 8.1993 16.6668 7.85867 16.54 7.55239C16.4131 7.2461 16.1722 7.00524 15.6905 6.52353L11.7434 2.57641C11.3277 2.16067 11.1198 1.9528 10.8623 1.82962C10.8087 1.80401 10.7538 1.78127 10.6978 1.76151C10.4286 1.6665 10.1346 1.6665 9.5467 1.6665C6.84251 1.6665 5.49042 1.6665 4.5746 2.4049C4.38959 2.55407 4.22106 2.7226 4.07189 2.90761C3.3335 3.82343 3.3335 5.17552 3.3335 7.87971V11.6665C3.3335 14.8092 3.3335 16.3805 4.30981 17.3569C5.28612 18.3332 6.85747 18.3332 10.0002 18.3332M10.8335 2.08317V2.49984C10.8335 4.85686 10.8335 6.03537 11.5657 6.7676C12.298 7.49984 13.4765 7.49984 15.8335 7.49984H16.2502" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /><path d="M16.6668 14.6855V13.0429C16.6668 12.7845 16.4771 12.5701 16.231 12.5261C15.2393 12.3488 14.416 11.9544 14.0144 11.7356C13.8499 11.6461 13.6505 11.6461 13.486 11.7356C13.0843 11.9544 12.2611 12.3488 11.2693 12.5261C11.0232 12.5701 10.8335 12.7845 10.8335 13.0429V14.6855C10.8335 16.8283 12.9522 17.9971 13.5781 18.2956C13.6885 18.3483 13.8118 18.3483 13.9223 18.2956C14.5482 17.9971 16.6668 16.8283 16.6668 14.6855Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
                                )}
                                <p className="font-['Helvetica_Neue:Regular',sans-serif] text-[13px] text-[#414651]">{hasInsurance ? "Desfazer seguro" : "Contratar seguro"}</p>
                              </button>
                              <button type="button" onClick={() => setMemberMenu(null)} className="cursor-pointer flex items-center gap-[8px] w-full px-[12px] py-[8px] hover:bg-[#f8fafc] transition-colors">
                                <svg className="shrink-0 size-[16px] text-[#075e54]" fill="none" viewBox="0 0 24 24"><path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 13.3789 2.27907 14.6926 2.78382 15.8877C3.06278 16.5481 3.20226 16.8784 3.21953 17.128C3.2368 17.3776 3.16334 17.6521 3.01642 18.2012L2 22L5.79877 20.9836C6.34788 20.8367 6.62244 20.7632 6.87202 20.7805C7.12161 20.7977 7.45185 20.9372 8.11235 21.2162C9.30745 21.7209 10.6211 22 12 22Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" /><path d="M8.58815 12.3773L9.45909 11.2956C9.82616 10.8397 10.2799 10.4153 10.3155 9.80826C10.3244 9.65494 10.2166 8.96657 10.0008 7.58986C9.91601 7.04881 9.41086 7 8.97332 7C8.40314 7 8.11805 7 7.83495 7.12931C7.47714 7.29275 7.10979 7.75231 7.02917 8.13733C6.96539 8.44196 7.01279 8.65187 7.10759 9.07169C7.51023 10.8548 8.45481 12.6158 9.91948 14.0805C11.3842 15.5452 13.1452 16.4898 14.9283 16.8924C15.3481 16.9872 15.558 17.0346 15.8627 16.9708C16.2477 16.8902 16.7072 16.5229 16.8707 16.165C17 15.8819 17 15.5969 17 15.0267C17 14.5891 16.9512 14.084 16.4101 13.9992C15.0334 13.7834 14.3451 13.6756 14.1917 13.6845C13.5847 13.7201 13.1603 14.1738 12.7044 14.5409L11.6227 15.4118" stroke="currentColor" strokeWidth="1.5" /></svg>
                                <p className="font-['Helvetica_Neue:Regular',sans-serif] text-[13px] text-[#075e54]">Ligar via WhatsApp</p>
                              </button>
                              <div className="bg-[#f5f5f5] h-px mx-[8px] my-[4px]" />
                              <button type="button" onClick={() => { setForm((prev) => ({ ...prev, equipe: prev.equipe.filter((x) => x !== g) })); setMemberMenu(null); }} className="cursor-pointer flex items-center gap-[8px] w-full px-[12px] py-[8px] hover:bg-[#fef3f2] transition-colors">
                                <svg className="shrink-0 size-[16px] text-[#d92d20]" fill="none" viewBox="0 0 24 24"><path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                                <p className="font-['Helvetica_Neue:Regular',sans-serif] text-[13px] text-[#d92d20]">Remover da atividade</p>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center flex-1 py-[24px] gap-[8px]">
                  <svg className="size-[32px] text-[#d0d5dd]" fill="none" viewBox="0 0 24 24"><path d="M7.5 19.5C7.5 18.5344 7.82853 17.5576 8.63092 17.0204C9.59321 16.3761 10.7524 16 12 16C13.2476 16 14.4068 16.3761 15.3691 17.0204C16.1715 17.5576 16.5 18.5344 16.5 19.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><circle cx="12" cy="11" r="2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M17.5 11C18.6101 11 19.6415 11.3769 20.4974 12.0224C21.2229 12.5696 21.5 13.4951 21.5 14.4038V14.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><circle cx="17.5" cy="6.5" r="2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M6.5 11C5.38987 11 4.35846 11.3769 3.50256 12.0224C2.77706 12.5696 2.5 13.4951 2.5 14.4038V14.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><circle cx="6.5" cy="6.5" r="2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  <p className="text-[13px] text-[#717680]">Nenhum colaborador escalado</p>
                  <p className="text-[11px] text-[#94a3b8] text-center max-w-[200px] -mt-[4px]">Busque e adicione os colaboradores responsáveis por conduzir a atividade.</p>
                </div>
              )}
            </CardContent>
            {form.equipe.length > 0 && (
              <div className="border-t border-[#f5f5f5] px-[16px] py-[12px] shrink-0">
                <div className="flex items-center gap-[6px]">
                  <svg className="size-[14px] text-[#17b26a]" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z M9 12l2 2 4-4"/></svg>
                  <p className="font-['Helvetica_Neue:Regular',sans-serif] text-[12px] text-[#535862]">{form.equipe.length} membro(s) · {form.equipe.filter((g) => guideInsurance[g]).length} seguro(s) contratado(s)</p>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Salvar atividade */}
      <div className="flex justify-end pt-[16px] pb-[8px]">
        <button className="bg-[#0b5ed7] hover:bg-[#084fb7] text-white text-[13px] font-medium rounded-[8px] px-[16px] py-[8px] transition-colors cursor-pointer">
          Salvar
        </button>
      </div>
      </div>
    </div>
  );
}
