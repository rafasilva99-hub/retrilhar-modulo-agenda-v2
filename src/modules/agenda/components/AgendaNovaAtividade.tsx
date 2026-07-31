import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { PencilEdit02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { TimeInput } from "@/components/custom/time-input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
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
  grupoClientes: string[];
  dataInicio: string;
  horarioInicio: string;
  dataTermino: string;
  horarioTermino: string;
  overbooking: boolean;
  multiplosHorarios: boolean;
  atividadeRepete: boolean;
  recorrenciaTipo: "diario" | "semanal" | "mensal" | "personalizado";
  recorrenciaIntervalo: number;
  recorrenciaDiasSemana: number[];
  recorrenciaMensalModo: "dia" | "semana";
  recorrenciaMensalDia: number;
  recorrenciaMensalOrdem: string;
  recorrenciaMensalDiaSemana: string;
  recorrenciaDatasPersonalizadas: string[];
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

/** Mask date input: dd/mm/aaaa — max 8 digits, auto-insert `/`, validate day/month ranges */
function maskDate(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  let valid = "";
  for (let i = 0; i < digits.length && valid.length < 8; i++) {
    const d = parseInt(digits[i]!, 10);
    const pos = valid.length;
    if (pos === 0) {
      if (d > 3) continue;
    } else if (pos === 1) {
      const f = parseInt(valid[0]!, 10);
      if (f === 3 && d > 1) continue;
      if (f === 0 && d === 0) continue;
    } else if (pos === 2) {
      if (d > 1) continue;
    } else if (pos === 3) {
      const f = parseInt(valid[2]!, 10);
      if (f === 1 && d > 2) continue;
      if (f === 0 && d === 0) continue;
    }
    valid += digits[i];
  }
  if (valid.length <= 2) return valid;
  if (valid.length <= 4) return valid.slice(0, 2) + "/" + valid.slice(2);
  return valid.slice(0, 2) + "/" + valid.slice(2, 4) + "/" + valid.slice(4);
}

const cardOverride = "gap-3 rounded-xl shadow-sm data-[size=sm]:gap-3";
const fieldSurfaceClass = "bg-[#fbfcfd]";

/** Imperatively mount a success toast in the DOM — survives component unmount */
function showStandaloneToast(message: string) {
  const container = document.createElement("div");
  document.body.appendChild(container);
  container.innerHTML = `
    <div style="position:fixed;top:24px;right:24px;z-index:200;width:384px;display:flex;overflow:clip;border-radius:8px;border:1px solid #e4e4e7;background:#fff;box-shadow:0 4px 6px -4px rgba(0,0,0,.1),0 10px 15px -3px rgba(0,0,0,.1);transition:all .2s;opacity:0;transform:translateY(-8px)">
      <div style="display:flex;align-items:center;justify-content:center;flex-shrink:0;width:60px;background:#ecfdf3">
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none"><path d="M23.8004 11.3614C25.0444 12.6053 25.6663 13.2273 25.6663 14.0001C25.6663 14.773 25.0443 15.395 23.8004 16.639C22.9641 17.4752 22.7073 18.0152 22.7073 19.1894C22.7073 20.1186 22.8876 21.4407 22.1553 22.1668C21.4288 22.8872 20.1122 22.7078 19.1889 22.7078C18.0556 22.7078 17.5098 22.9295 16.701 23.7384C16.0123 24.4271 15.089 25.6668 13.9997 25.6668C12.9104 25.6668 11.9871 24.4271 11.2983 23.7384C10.4895 22.9295 9.94375 22.7078 8.81042 22.7078C7.88713 22.7078 6.57056 22.8872 5.84408 22.1668C5.11178 21.4407 5.292 20.1186 5.292 19.1894C5.292 18.0152 5.03519 17.4752 4.19895 16.639C2.955 15.395 2.33303 14.773 2.33301 14.0001C2.33302 13.2273 2.95499 12.6053 4.19892 11.3614C4.94541 10.6149 5.292 9.87515 5.292 8.8109C5.292 7.88759 5.11258 6.571 5.83301 5.84452C6.55917 5.11224 7.88121 5.29246 8.81043 5.29246C9.87466 5.29246 10.6144 4.9459 11.3609 4.19943C12.6048 2.95547 13.2268 2.3335 13.9997 2.3335C14.7726 2.3335 15.3945 2.95547 16.6385 4.19943M22.1553 22.1668H22.1663" stroke="#079455" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M9.91699 11.0833L14.0003 15.1667L24.5006 3.5" stroke="#079455" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </div>
      <div style="display:flex;align-items:center;flex:1;padding:16px">
        <p style="font-family:'Helvetica Neue',sans-serif;font-weight:500;font-size:14px;color:#252b37">${message}</p>
      </div>
    </div>`;
  requestAnimationFrame(() => {
    const el = container.firstElementChild as HTMLElement;
    if (el) {
      el.style.opacity = "1";
      el.style.transform = "translateY(0)";
    }
  });
  setTimeout(() => {
    const el = container.firstElementChild as HTMLElement;
    if (el) {
      el.style.opacity = "0";
      el.style.transform = "translateY(-8px)";
    }
    setTimeout(() => container.remove(), 200);
  }, 5000);
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function GuideConflictConfirmModal({
  guide,
  onCancel,
  onConfirm,
}: {
  guide: string;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  const conflictActivity = "Trilha interpretativa na Serra do Curral";

  return createPortal(
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onCancel} />
      <div className="relative z-10 w-full max-w-[520px] rounded-[16px] bg-white shadow-[0px_8px_24px_0px_rgba(0,0,0,0.15)]">
        <div className="shrink-0">
          <div className="flex items-start justify-between px-[24px] pt-[20px] pb-[16px]">
            <div className="flex flex-col gap-[4px]">
              <p className="font-['Helvetica_Neue:Medium',sans-serif] text-[16px] leading-[normal] text-[#181d27]">
                Enviar solicitação de atribuição
              </p>
              <p className="font-['Helvetica_Neue:Regular',sans-serif] text-[14px] leading-[20px] text-[#535862]">
                <span className="font-['Helvetica_Neue:Medium',sans-serif] text-[#252b37]">
                  {guide}
                </span>{" "}
                já está alocado em outra atividade no mesmo horário.
              </p>
            </div>
            <button
              onClick={onCancel}
              className="flex size-[32px] shrink-0 cursor-pointer items-center justify-center rounded-[6px] transition-colors hover:bg-[#f5f5f5]"
            >
              <svg className="size-[16px]" fill="none" viewBox="0 0 16 16">
                <path
                  d="M4 4l8 8M12 4l-8 8"
                  stroke="#717680"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>
          <div className="mr-[40px] ml-[24px] h-px bg-[#e9eaeb]" />
        </div>
        <div className="flex flex-col gap-[12px] px-[24px] py-[20px]">
          <div className="flex items-center gap-[12px] rounded-[10px] border border-[#f5f5f5] bg-[#fafafa] px-[12px] py-[10px]">
            <div className="flex size-[32px] shrink-0 items-center justify-center rounded-full border border-[#bfdbfe] bg-[#eff6ff]">
              <p className="font-['Helvetica_Neue:Medium',sans-serif] text-[11px] text-[#0b5ed7]">
                {getInitials(guide)}
              </p>
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-['Helvetica_Neue:Regular',sans-serif] text-[13px] text-[#252b37]">
                {guide}
              </p>
              <p className="truncate font-['Helvetica_Neue:Regular',sans-serif] text-[11px] text-[#e17c00]">
                Alocado em: {conflictActivity}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-[10px] rounded-[10px] border border-[#f5f5f5] bg-[#f8f9fc] px-[12px] py-[8px]">
            <svg className="size-[24px] shrink-0" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="11" fill="#4A7BF7" opacity="0.15" />
              <circle cx="12" cy="12" r="8" fill="#4A7BF7" />
              <path d="M12 8v5M12 15h.01" stroke="white" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <p className="font-['Helvetica_Neue:Regular',sans-serif] text-[12px] leading-[16px] text-[#414651]">
              Caso prossiga, a notificação chegará para esse membro como convite. Ele poderá aceitar
              ou recusar a atribuição dessa atividade.
            </p>
          </div>
        </div>
        <div className="flex gap-[12px] px-[24px] pt-[4px] pb-[24px]">
          <button
            onClick={onCancel}
            className="h-[40px] flex-1 cursor-pointer rounded-[8px] border border-[#e9eaeb] bg-white font-['Helvetica_Neue:Regular',sans-serif] text-[14px] text-[#414651] transition-colors hover:bg-[#f8fafc]"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="h-[40px] flex-1 cursor-pointer rounded-[8px] bg-[#0b5ed7] font-['Helvetica_Neue:Medium',sans-serif] text-[14px] text-white transition-colors hover:bg-[#084fb7]"
          >
            Enviar solicitação
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

function GuideRemoveConfirmModal({
  guide,
  all,
  onCancel,
  onConfirm,
}: {
  guide?: string;
  all?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  const title = all ? "Remover equipe" : "Remover membro da equipe";
  const description = all ? (
    "Tem certeza que deseja remover todos os membros atribuídos?"
  ) : (
    <>
      Tem certeza que deseja remover{" "}
      <span className="font-['Helvetica_Neue:Medium',sans-serif] text-[#252b37]">{guide}</span> da
      equipe responsável por esta atividade?
    </>
  );

  return createPortal(
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onCancel} />
      <div className="relative z-10 w-full max-w-[520px] rounded-[16px] bg-white shadow-[0px_8px_24px_0px_rgba(0,0,0,0.15)]">
        <div className="shrink-0">
          <div className="flex items-start justify-between px-[24px] pt-[20px] pb-[16px]">
            <div className="flex flex-col gap-[4px]">
              <p className="font-['Helvetica_Neue:Medium',sans-serif] text-[16px] leading-[normal] text-[#181d27]">
                {title}
              </p>
              <p className="font-['Helvetica_Neue:Regular',sans-serif] text-[14px] leading-[normal] text-[#535862]">
                {description}
              </p>
            </div>
            <button
              onClick={onCancel}
              className="flex size-[32px] shrink-0 cursor-pointer items-center justify-center rounded-[6px] transition-colors hover:bg-[#f5f5f5]"
            >
              <svg className="size-[16px]" fill="none" viewBox="0 0 16 16">
                <path
                  d="M4 4l8 8M12 4l-8 8"
                  stroke="#717680"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>
          <div className="mr-[40px] ml-[24px] h-px bg-[#e9eaeb]" />
        </div>
        <div className="flex flex-col gap-[12px] px-[24px] py-[20px]">
          {!all && guide && (
            <div className="flex items-center gap-[12px] rounded-[10px] border border-[#f5f5f5] bg-[#fafafa] px-[12px] py-[10px]">
              <div className="flex size-[32px] shrink-0 items-center justify-center rounded-full border border-[#bfdbfe] bg-[#eff6ff]">
                <p className="font-['Helvetica_Neue:Medium',sans-serif] text-[11px] text-[#0b5ed7]">
                  {getInitials(guide)}
                </p>
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-['Helvetica_Neue:Regular',sans-serif] text-[13px] text-[#252b37]">
                  {guide}
                </p>
                <p className="font-['Helvetica_Neue:Regular',sans-serif] text-[11px] text-[#dc6803]">
                  Sem seguro
                </p>
              </div>
            </div>
          )}
          <div className="flex items-center gap-[10px] rounded-[10px] border border-[#f5f5f5] bg-[#f8f9fc] px-[12px] py-[8px]">
            <svg className="size-[24px] shrink-0" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="11" fill="#4A7BF7" opacity="0.15" />
              <circle cx="12" cy="12" r="8" fill="#4A7BF7" />
              <path d="M12 16v-4M12 8h.01" stroke="white" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <p className="font-['Helvetica_Neue:Regular',sans-serif] text-[12px] leading-[14px] text-[#414651]">
              {all
                ? "A remoção da equipe será efetivada imediatamente. Caso necessário, você poderá reatribuir os membros posteriormente."
                : "A remoção desse membro será efetivada imediatamente. Caso necessário, você poderá reatribuir a atividade posteriormente."}
            </p>
          </div>
        </div>
        <div className="flex gap-[12px] px-[24px] pt-[4px] pb-[24px]">
          <button
            onClick={onCancel}
            className="h-[40px] flex-1 cursor-pointer rounded-[8px] border border-[#e9eaeb] bg-white font-['Helvetica_Neue:Regular',sans-serif] text-[14px] text-[#414651] transition-colors hover:bg-[#f8fafc]"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="h-[40px] flex-1 cursor-pointer rounded-[8px] bg-[#d92d20] font-['Helvetica_Neue:Medium',sans-serif] text-[14px] text-white transition-colors hover:bg-[#b42318]"
          >
            {all ? "Remover equipe" : "Remover membro"}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

/* ------------------------------------------------------------------ */
/*  Mock product data — inherited defaults for schedule & capacity     */
/* ------------------------------------------------------------------ */

const mockProdutos: Record<
  string,
  { horarioInicio: string; horarioTermino: string; capacidadeMin: number; capacidadeMax: number }
> = {
  "trilha-ecologica": {
    horarioInicio: "08:00",
    horarioTermino: "11:00",
    capacidadeMin: 5,
    capacidadeMax: 30,
  },
  "observacao-fauna": {
    horarioInicio: "06:00",
    horarioTermino: "09:30",
    capacidadeMin: 3,
    capacidadeMax: 15,
  },
};

const localOptions = [
  { value: "sede", label: "Sede principal" },
  { value: "campo", label: "Campo" },
  { value: "online", label: "Online" },
];

const produtoOptions = [
  { value: "trilha-ecologica", label: "Trilha Ecológica" },
  { value: "observacao-fauna", label: "Observação de Fauna" },
];

const grupoOptions = [
  { value: "regular", label: "Clientes Regulares" },
  { value: "vip", label: "VIP" },
  { value: "escolas", label: "Escolas" },
];

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
    grupoClientes: [],
    dataInicio: "",
    horarioInicio: "",
    dataTermino: "",
    horarioTermino: "",
    overbooking: false,
    multiplosHorarios: false,
    atividadeRepete: false,
    recorrenciaTipo: "diario",
    recorrenciaIntervalo: 1,
    recorrenciaDiasSemana: [],
    recorrenciaMensalModo: "dia",
    recorrenciaMensalDia: 1,
    recorrenciaMensalOrdem: "última",
    recorrenciaMensalDiaSemana: "domingo",
    recorrenciaDatasPersonalizadas: [],
    equipe: [],
  });

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const [localOpen, setLocalOpen] = useState(false);
  const [localSearch, setLocalSearch] = useState("");
  const localRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!localOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (localRef.current && !localRef.current.contains(e.target as Node)) setLocalOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [localOpen]);

  const [produtoOpen, setProdutoOpen] = useState(false);
  const [produtoSearch, setProdutoSearch] = useState("");
  const produtoRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!produtoOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (produtoRef.current && !produtoRef.current.contains(e.target as Node))
        setProdutoOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [produtoOpen]);

  const [grupoOpen, setGrupoOpen] = useState(false);
  const [grupoSearch, setGrupoSearch] = useState("");
  const [customGrupoOptions, setCustomGrupoOptions] = useState<typeof grupoOptions>([]);
  const grupoRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!grupoOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (grupoRef.current && !grupoRef.current.contains(e.target as Node)) setGrupoOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [grupoOpen]);
  const availableGrupoOptions = [...grupoOptions, ...customGrupoOptions];

  const [toast, setToast] = useState<string | null>(null);

  const [saidas, setSaidas] = useState([
    {
      id: 1,
      horarioInicio: "",
      horarioTermino: "",
      capacidadeMin: 0,
      capacidadeMax: 0,
      equipe: [] as string[],
    },
  ]);
  const [draggedSaidaId, setDraggedSaidaId] = useState<number | null>(null);
  const draggedSaidaIdRef = useRef<number | null>(null);
  const addSaida = () =>
    setSaidas((prev) => [
      ...prev,
      {
        id: (prev[prev.length - 1]?.id ?? 0) + 1,
        horarioInicio: "",
        horarioTermino: "",
        capacidadeMin: 0,
        capacidadeMax: 0,
        equipe: [],
      },
    ]);
  const [editingSaidaId, setEditingSaidaId] = useState<number | null>(null);
  const editingSaida = saidas.find((s) => s.id === editingSaidaId) ?? null;
  const updateSaida = (id: number, patch: Partial<(typeof saidas)[0]>) =>
    setSaidas((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  const removeSaida = (id: number) =>
    setSaidas((prev) => (prev.length > 1 ? prev.filter((s) => s.id !== id) : prev));
  const moveSaida = (draggedId: number, targetId: number) => {
    if (draggedId === targetId) return;
    setSaidas((prev) => {
      const fromIndex = prev.findIndex((saida) => saida.id === draggedId);
      const toIndex = prev.findIndex((saida) => saida.id === targetId);
      if (fromIndex < 0 || toIndex < 0) return prev;
      const next = [...prev];
      const [moved] = next.splice(fromIndex, 1);
      if (!moved) return prev;
      next.splice(toIndex, 0, moved);
      return next;
    });
  };

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
  const filteredGuides = availableGuides.filter((g) =>
    g.name.toLowerCase().includes(teamSearch.toLowerCase())
  );
  const [memberMenu, setMemberMenu] = useState<number | null>(null);
  const [guideInsurance, setGuideInsurance] = useState<Record<string, boolean>>({});
  const [teamConflictConfirm, setTeamConflictConfirm] = useState<string | null>(null);
  const [removeGuideConfirm, setRemoveGuideConfirm] = useState<{
    guide?: string;
    all?: boolean;
  } | null>(null);
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

  const addTeamGuide = (guide: string) => {
    setForm((prev) =>
      prev.equipe.includes(guide) ? prev : { ...prev, equipe: [...prev.equipe, guide] }
    );
    setTeamDropdownOpen(false);
    setTeamSearch("");
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#f8fafc]">
      {/* ── Header — Logo + title + close ── */}
      <div className="flex h-[56px] shrink-0 items-center border-b border-[#e9eaeb] bg-white px-[20px]">
        <div className="flex items-center gap-[16px]">
          <img src="/src/assets/retrilhar-logo.png" alt="Retrilhar" className="h-[24px]" />
          <div className="h-[20px] w-px bg-[#e9eaeb]" />
          <p className="font-['Helvetica_Neue:Regular',sans-serif] text-[14px] text-[#252b37]">
            Nova atividade
          </p>
        </div>
        <button
          onClick={onBack}
          className="ml-auto flex cursor-pointer items-center gap-[6px] rounded-[8px] border border-[#e9eaeb] bg-white px-[14px] py-[8px] transition-colors hover:bg-[#f8fafc]"
        >
          <svg className="size-[14px]" fill="none" viewBox="0 0 18 18">
            <path
              d="M4 4l10 10M14 4L4 14"
              stroke="#717680"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
          <p className="font-['Helvetica_Neue:Regular',sans-serif] text-[13px] text-[#535862]">
            Fechar
          </p>
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
                <div className="grid grid-cols-1 gap-4 pt-2 sm:grid-cols-2">
                  <FieldRow label="Local da atividade">
                    <div className="relative" ref={localRef}>
                      <div
                        className={cn(
                          "border-border flex h-9 w-full items-center gap-[8px] rounded-md border px-3 transition-colors hover:border-[#d0d5dd]",
                          fieldSurfaceClass
                        )}
                      >
                        <svg
                          className="size-[16px] shrink-0 text-[#a4a7ae]"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.5" />
                          <path
                            d="M16 16l4 4"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                          />
                        </svg>
                        <input
                          type="text"
                          className="placeholder:text-muted-foreground min-w-0 flex-1 bg-transparent font-['Helvetica_Neue:Regular',sans-serif] text-[13px] text-[#252b37] outline-none"
                          placeholder={
                            form.local
                              ? localOptions.find((o) => o.value === form.local)?.label
                              : "Selecione o local"
                          }
                          value={localSearch}
                          onChange={(e) => {
                            setLocalSearch(e.target.value);
                            if (!localOpen) setLocalOpen(true);
                          }}
                          onFocus={() => setLocalOpen(true)}
                        />
                        <button
                          type="button"
                          onClick={() => setLocalOpen(!localOpen)}
                          className="shrink-0 cursor-pointer"
                        >
                          <svg
                            className={`size-[14px] text-[#a4a7ae] transition-transform ${localOpen ? "rotate-180" : ""}`}
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <path
                              d="M6 9l6 6 6-6"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </button>
                      </div>
                      {localOpen &&
                        (() => {
                          const filtered = localOptions.filter((o) =>
                            o.label.toLowerCase().includes(localSearch.toLowerCase())
                          );
                          return (
                            <div className="absolute top-full right-0 left-0 z-50 mt-[4px] overflow-hidden rounded-[8px] border border-[#e9eaeb] bg-white shadow-[0px_4px_16px_0px_rgba(0,0,0,0.12)]">
                              <div className="max-h-[200px] overflow-y-auto py-[4px]">
                                {filtered.length > 0 ? (
                                  filtered.map((opt) => (
                                    <button
                                      key={opt.value}
                                      type="button"
                                      onClick={() => {
                                        update("local", form.local === opt.value ? "" : opt.value);
                                        setLocalOpen(false);
                                        setLocalSearch("");
                                      }}
                                      className={cn(
                                        "flex w-full cursor-pointer items-center px-[12px] py-[8px] text-left font-['Helvetica_Neue:Regular',sans-serif] text-[13px] transition-colors hover:bg-[#f8fafc]",
                                        form.local === opt.value
                                          ? "bg-[#f0f5ff] text-[#0b5ed7]"
                                          : "text-[#252b37]"
                                      )}
                                    >
                                      {opt.label}
                                    </button>
                                  ))
                                ) : (
                                  <p className="px-[12px] py-[8px] font-['Helvetica_Neue:Regular',sans-serif] text-[13px] text-[#717680]">
                                    Nenhum local encontrado.
                                  </p>
                                )}
                              </div>
                            </div>
                          );
                        })()}
                    </div>
                  </FieldRow>
                  <FieldRow
                    label="Produto vinculado"
                    hint="Ao selecionar um produto, os horários e a capacidade serão herdados, mas podem ser editados."
                  >
                    <div className="relative" ref={produtoRef}>
                      <div
                        className={cn(
                          "border-border flex h-9 w-full items-center gap-[8px] rounded-md border px-3 transition-colors hover:border-[#d0d5dd]",
                          fieldSurfaceClass
                        )}
                      >
                        <svg
                          className="size-[16px] shrink-0 text-[#a4a7ae]"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.5" />
                          <path
                            d="M16 16l4 4"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                          />
                        </svg>
                        <input
                          type="text"
                          className={cn(
                            "placeholder:text-muted-foreground min-w-0 flex-1 bg-transparent font-['Helvetica_Neue:Regular',sans-serif] text-[13px] text-[#252b37] outline-none",
                            fieldSurfaceClass
                          )}
                          placeholder={
                            form.produto
                              ? produtoOptions.find((o) => o.value === form.produto)?.label
                              : "Selecione um produto"
                          }
                          value={produtoSearch}
                          onChange={(e) => {
                            setProdutoSearch(e.target.value);
                            if (!produtoOpen) setProdutoOpen(true);
                          }}
                          onFocus={() => setProdutoOpen(true)}
                        />
                        <button
                          type="button"
                          onClick={() => setProdutoOpen(!produtoOpen)}
                          className="shrink-0 cursor-pointer"
                        >
                          <svg
                            className={`size-[14px] text-[#a4a7ae] transition-transform ${produtoOpen ? "rotate-180" : ""}`}
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <path
                              d="M6 9l6 6 6-6"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </button>
                      </div>
                      {produtoOpen &&
                        (() => {
                          const filtered = produtoOptions.filter((o) =>
                            o.label.toLowerCase().includes(produtoSearch.toLowerCase())
                          );
                          return (
                            <div className="absolute top-full right-0 left-0 z-50 mt-[4px] overflow-hidden rounded-[8px] border border-[#e9eaeb] bg-white shadow-[0px_4px_16px_0px_rgba(0,0,0,0.12)]">
                              <div className="max-h-[200px] overflow-y-auto py-[4px]">
                                {filtered.length > 0 ? (
                                  filtered.map((opt) => (
                                    <button
                                      key={opt.value}
                                      type="button"
                                      onClick={() => {
                                        if (form.produto === opt.value) {
                                          update("produto", "");
                                        } else {
                                          const defaults = mockProdutos[opt.value];
                                          if (defaults) {
                                            setForm((prev) => ({
                                              ...prev,
                                              produto: opt.value,
                                              horarioInicio: defaults.horarioInicio,
                                              horarioTermino: defaults.horarioTermino,
                                              capacidadeMin: defaults.capacidadeMin,
                                              capacidadeMax: defaults.capacidadeMax,
                                            }));
                                          } else {
                                            update("produto", opt.value);
                                          }
                                        }
                                        setProdutoOpen(false);
                                        setProdutoSearch("");
                                      }}
                                      className={cn(
                                        "flex w-full cursor-pointer items-center gap-[10px] px-[12px] py-[8px] text-left font-['Helvetica_Neue:Regular',sans-serif] text-[13px] transition-colors hover:bg-[#f8fafc]",
                                        form.produto === opt.value
                                          ? "bg-[#f0f5ff] text-[#0b5ed7]"
                                          : "text-[#252b37]"
                                      )}
                                    >
                                      {opt.label}
                                    </button>
                                  ))
                                ) : (
                                  <p className="px-[12px] py-[8px] font-['Helvetica_Neue:Regular',sans-serif] text-[13px] text-[#717680]">
                                    Nenhum produto encontrado.
                                  </p>
                                )}
                              </div>
                            </div>
                          );
                        })()}
                    </div>
                  </FieldRow>
                </div>
                <div className="-mt-4">
                  <FieldRow label="Descrição / Observações">
                    <textarea
                      className={cn(
                        "border-border placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/30 w-full min-w-0 resize-none rounded-md border px-3 py-2 text-sm transition-[color,box-shadow,background-color] outline-none focus-visible:ring-3",
                        fieldSurfaceClass
                      )}
                      placeholder="Adicione uma descrição ou observações sobre a atividade"
                      rows={3}
                      value={form.descricao}
                      onChange={(e) => update("descricao", e.target.value)}
                    />
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
                {form.multiplosHorarios ? (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <FieldRow label="Data de início">
                      <Input
                        className={fieldSurfaceClass}
                        placeholder="dd/mm/aaaa"
                        maxLength={10}
                        inputMode="numeric"
                        value={form.dataInicio}
                        onChange={(e) => update("dataInicio", maskDate(e.target.value))}
                      />
                    </FieldRow>
                    <FieldRow label="Data de término">
                      <Input
                        className={fieldSurfaceClass}
                        placeholder="dd/mm/aaaa"
                        maxLength={10}
                        inputMode="numeric"
                        value={form.dataTermino}
                        onChange={(e) => update("dataTermino", maskDate(e.target.value))}
                      />
                    </FieldRow>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <FieldRow label="Data de início">
                        <Input
                          className={fieldSurfaceClass}
                          placeholder="dd/mm/aaaa"
                          maxLength={10}
                          inputMode="numeric"
                          value={form.dataInicio}
                          onChange={(e) => update("dataInicio", maskDate(e.target.value))}
                        />
                      </FieldRow>
                      <FieldRow label="Horário de início">
                        <TimeInput
                          className={fieldSurfaceClass}
                          placeholder="hh:mm"
                          value={form.horarioInicio || null}
                          onChange={(v) => update("horarioInicio", v ?? "")}
                          aria-label="Horário de início"
                        />
                      </FieldRow>
                    </div>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <FieldRow label="Data de término">
                        <Input
                          className={fieldSurfaceClass}
                          placeholder="dd/mm/aaaa"
                          maxLength={10}
                          inputMode="numeric"
                          value={form.dataTermino}
                          onChange={(e) => update("dataTermino", maskDate(e.target.value))}
                        />
                      </FieldRow>
                      <FieldRow label="Horário de término">
                        <TimeInput
                          className={fieldSurfaceClass}
                          placeholder="hh:mm"
                          value={form.horarioTermino || null}
                          onChange={(v) => update("horarioTermino", v ?? "")}
                          aria-label="Horário de término"
                        />
                      </FieldRow>
                    </div>
                  </>
                )}

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

                  {/* Saídas do dia */}
                  {form.multiplosHorarios && (
                    <div className="flex flex-col gap-3">
                      {saidas.map((saida, idx) => (
                        <div
                          key={saida.id}
                          onDragEnter={(e) => {
                            e.preventDefault();
                            const draggedId = draggedSaidaIdRef.current;
                            if (draggedId !== null && draggedId !== saida.id) {
                              moveSaida(draggedId, saida.id);
                            }
                          }}
                          onDragOver={(e) => {
                            if (draggedSaidaIdRef.current === null) return;
                            e.preventDefault();
                            e.dataTransfer.dropEffect = "move";
                          }}
                          onDrop={(e) => {
                            e.preventDefault();
                            const draggedId =
                              Number(e.dataTransfer.getData("text/plain")) ||
                              draggedSaidaIdRef.current;
                            if (draggedId !== null) moveSaida(draggedId, saida.id);
                            draggedSaidaIdRef.current = null;
                            setDraggedSaidaId(null);
                          }}
                          className={cn(
                            "border-border bg-muted/40 flex items-center gap-3 rounded-lg border p-3 transition-[opacity,background-color,border-color]",
                            draggedSaidaId === saida.id &&
                              "border-primary/40 bg-primary/5 opacity-60"
                          )}
                        >
                          <button
                            type="button"
                            draggable={saidas.length > 1}
                            onDragStart={(e) => {
                              if (saidas.length <= 1) {
                                e.preventDefault();
                                return;
                              }
                              draggedSaidaIdRef.current = saida.id;
                              setDraggedSaidaId(saida.id);
                              e.dataTransfer.effectAllowed = "move";
                              e.dataTransfer.setData("text/plain", String(saida.id));
                            }}
                            onDragEnd={() => {
                              draggedSaidaIdRef.current = null;
                              setDraggedSaidaId(null);
                            }}
                            className={cn(
                              "flex size-[20px] shrink-0 items-center justify-center transition-colors",
                              saidas.length > 1
                                ? "text-muted-foreground cursor-grab active:cursor-grabbing"
                                : "text-muted-foreground/30"
                            )}
                            aria-label={`Reordenar saída ${idx + 1}`}
                          >
                            <svg
                              className="size-[20px]"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M11.9959 18H12.0049" />
                              <path d="M17.9998 18H18.0088" />
                              <path d="M5.99981 18H6.00879" />
                              <path d="M11.9959 12H12.0049" />
                              <path d="M11.9998 6H12.0088" />
                              <path d="M17.9998 12H18.0088" />
                              <path d="M17.9998 6H18.0088" />
                              <path d="M5.99981 12H6.00879" />
                              <path d="M5.99981 6H6.00879" />
                            </svg>
                          </button>
                          <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                            <span className="text-sm font-medium">Saída {idx + 1}</span>
                            <span className="text-muted-foreground text-xs">
                              {[
                                saida.horarioInicio && saida.horarioTermino
                                  ? `${saida.horarioInicio} – ${saida.horarioTermino}`
                                  : "Sem horários definidos",
                                saida.equipe.length > 0
                                  ? `${saida.equipe.length} membro(s)`
                                  : "sem equipe atribuída",
                                saida.capacidadeMax > 0
                                  ? `${saida.capacidadeMin}–${saida.capacidadeMax} vagas`
                                  : "sem capacidade atribuída",
                              ].join(", ")}
                            </span>
                          </div>
                          <div className="flex shrink-0 items-center gap-2.5">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <button
                                    type="button"
                                    onClick={() => setEditingSaidaId(saida.id)}
                                    className="border-border text-primary hover:bg-primary/10 flex size-8 items-center justify-center rounded-md border transition-colors"
                                  >
                                    <HugeiconsIcon icon={PencilEdit02Icon} size={18} />
                                  </button>
                                </TooltipTrigger>
                                <TooltipContent>Configurar saída</TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            {saidas.length > 1 && (
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <button
                                      type="button"
                                      onClick={() => removeSaida(saida.id)}
                                      className="border-border text-destructive hover:bg-destructive/10 flex size-8 items-center justify-center rounded-md border transition-colors"
                                    >
                                      <svg
                                        className="size-[18px]"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      >
                                        <path d="M19.5 5.5L18.613 15.413C18.377 17.989 18.259 19.277 17.55 20.138C17.1 20.694 16.518 21.124 15.86 21.39C14.882 21.777 13.592 21.777 11.012 21.777C8.428 21.777 7.136 21.777 6.157 21.388C5.499 21.121 4.918 20.69 4.468 20.132C3.761 19.268 3.646 17.976 3.416 15.391L2.5 5.5" />
                                        <path d="M21 5.5H3" />
                                        <path d="M16.056 5.5L15.373 4.098C14.921 3.166 14.695 2.7 14.327 2.39C14.2 2.283 14.063 2.189 13.917 2.11C13.51 1.9 13.04 1.9 12.101 1.9C11.139 1.9 10.658 1.9 10.243 2.118C10.094 2.2 9.956 2.297 9.828 2.408C9.456 2.727 9.234 3.207 8.79 4.166L8.174 5.5" />
                                      </svg>
                                    </button>
                                  </TooltipTrigger>
                                  <TooltipContent>Remover saída</TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            )}
                          </div>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={addSaida}
                        className="border-border text-primary hover:bg-muted/50 flex w-full items-center justify-center gap-2 rounded-lg border border-dashed py-2.5 text-sm font-medium transition-colors"
                      >
                        <svg
                          className="size-[16px]"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                        >
                          <path d="M12 5v14M5 12h14" />
                        </svg>
                        Adicionar saída
                      </button>
                    </div>
                  )}

                  <div className="space-y-[16px]">
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

                    {/* Recorrência */}
                    {form.atividadeRepete && <RecurrencePanel form={form} update={update} />}
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
                {form.multiplosHorarios ? (
                  <div className="flex items-center gap-[10px] rounded-[10px] border border-[#f5f5f5] bg-[#f8f9fc] px-[12px] py-[8px]">
                    <svg className="size-[24px] shrink-0" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="11" fill="#4A7BF7" opacity="0.15" />
                      <circle cx="12" cy="12" r="8" fill="#4A7BF7" />
                      <path
                        d="M12 16v-4M12 8h.01"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                    <p className="font-['Helvetica_Neue:Regular',sans-serif] text-[12px] leading-[14px] text-[#414651]">
                      Cada horário tem suas próprias vagas. Defina a capacidade em cada saída.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    <FieldRow label="Capacidade mínima">
                      <Input
                        className={fieldSurfaceClass}
                        inputMode="numeric"
                        value={form.capacidadeMin ? form.capacidadeMin.toLocaleString("pt-BR") : ""}
                        placeholder="0"
                        onChange={(e) => {
                          const raw = e.target.value.replace(/\D/g, "");
                          update("capacidadeMin", raw ? parseInt(raw, 10) : 0);
                        }}
                        onFocus={(e) => {
                          if (form.capacidadeMin === 0) e.target.select();
                        }}
                      />
                    </FieldRow>
                    <FieldRow label="Capacidade máxima">
                      <Input
                        className={cn(
                          fieldSurfaceClass,
                          form.capacidadeMax > 0 &&
                            form.capacidadeMin > 0 &&
                            form.capacidadeMax < form.capacidadeMin &&
                            "border-[#d92d20] focus-visible:border-[#d92d20] focus-visible:ring-[#d92d20]/20"
                        )}
                        inputMode="numeric"
                        value={form.capacidadeMax ? form.capacidadeMax.toLocaleString("pt-BR") : ""}
                        placeholder="0"
                        onChange={(e) => {
                          const raw = e.target.value.replace(/\D/g, "");
                          update("capacidadeMax", raw ? parseInt(raw, 10) : 0);
                        }}
                        onFocus={(e) => {
                          if (form.capacidadeMax === 0) e.target.select();
                        }}
                      />
                      {form.capacidadeMax > 0 &&
                        form.capacidadeMin > 0 &&
                        form.capacidadeMax < form.capacidadeMin && (
                          <p className="font-['Helvetica_Neue:Regular',sans-serif] text-[11px] leading-[14px] text-[#d92d20]">
                            A capacidade máxima deve ser maior ou igual à mínima.
                          </p>
                        )}
                    </FieldRow>
                  </div>
                )}
                <div className="flex items-center justify-between gap-4">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-sm font-medium">Permitir capacidade extra</span>
                    <span className="text-muted-foreground text-xs">
                      Aceite reservas além da capacidade máxima para cobrir desistências de última
                      hora.
                    </span>
                  </div>
                  <Switch
                    checked={form.overbooking}
                    onCheckedChange={(v) => update("overbooking", v)}
                  />
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
                {form.visibilidade === "interna" && (
                  <p className="text-muted-foreground mt-2 text-xs">
                    Atividades internas não aparecem na loja, sendo acessíveis somente por link
                    direto.
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Grupo de Clientes */}
            <Card size="sm" className={cn(cardOverride, "!overflow-visible")}>
              <CardHeader>
                <CardTitle>Grupo de Clientes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-[12px]">
                  <div className="relative" ref={grupoRef}>
                    <div
                      className={cn(
                        "border-border flex h-9 w-full items-center gap-[8px] rounded-md border px-3 transition-colors hover:border-[#d0d5dd]",
                        fieldSurfaceClass
                      )}
                    >
                      <svg
                        className="size-[16px] shrink-0 text-[#a4a7ae]"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.5" />
                        <path
                          d="M16 16l4 4"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                      </svg>
                      <input
                        type="text"
                        className="placeholder:text-muted-foreground min-w-0 flex-1 bg-transparent font-['Helvetica_Neue:Regular',sans-serif] text-[13px] text-[#252b37] outline-none"
                        placeholder={
                          form.grupoClientes.length > 0
                            ? "Buscar ou adicionar grupos"
                            : "Selecione um ou mais grupos"
                        }
                        value={grupoSearch}
                        onChange={(e) => {
                          setGrupoSearch(e.target.value);
                          if (!grupoOpen) setGrupoOpen(true);
                        }}
                        onFocus={() => setGrupoOpen(true)}
                      />
                      <button
                        type="button"
                        onClick={() => setGrupoOpen(!grupoOpen)}
                        className="shrink-0 cursor-pointer"
                      >
                        <svg
                          className={`size-[14px] text-[#a4a7ae] transition-transform ${grupoOpen ? "rotate-180" : ""}`}
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <path
                            d="M6 9l6 6 6-6"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                    </div>
                    {grupoOpen &&
                      (() => {
                        const trimmedSearch = grupoSearch.trim();
                        const filtered = availableGrupoOptions.filter((o) =>
                          o.label.toLowerCase().includes(trimmedSearch.toLowerCase())
                        );
                        return (
                          <div className="absolute top-full right-0 left-0 z-50 mt-[4px] overflow-hidden rounded-[8px] border border-[#e9eaeb] bg-white shadow-[0px_4px_16px_0px_rgba(0,0,0,0.12)]">
                            <div className="max-h-[200px] overflow-y-auto py-[4px]">
                              {filtered.length > 0 ? (
                                filtered.map((opt) => (
                                  <button
                                    key={opt.value}
                                    type="button"
                                    onClick={() => {
                                      update(
                                        "grupoClientes",
                                        form.grupoClientes.includes(opt.value)
                                          ? form.grupoClientes.filter(
                                              (value) => value !== opt.value
                                            )
                                          : [...form.grupoClientes, opt.value]
                                      );
                                      setGrupoSearch("");
                                    }}
                                    className={cn(
                                      "flex w-full cursor-pointer items-center justify-between px-[12px] py-[8px] text-left font-['Helvetica_Neue:Regular',sans-serif] text-[13px] transition-colors hover:bg-[#f8fafc]",
                                      form.grupoClientes.includes(opt.value)
                                        ? "bg-[#f0f5ff] text-[#0b5ed7]"
                                        : "text-[#252b37]"
                                    )}
                                  >
                                    <span>{opt.label}</span>
                                    {form.grupoClientes.includes(opt.value) && (
                                      <svg
                                        className="size-[14px] shrink-0"
                                        viewBox="0 0 14 14"
                                        fill="none"
                                      >
                                        <path
                                          d="M3 7l2.5 2.5L11 4"
                                          stroke="currentColor"
                                          strokeWidth="1.5"
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                        />
                                      </svg>
                                    )}
                                  </button>
                                ))
                              ) : (
                                <div className="py-[4px]">
                                  <p className="px-[12px] py-[8px] font-['Helvetica_Neue:Regular',sans-serif] text-[13px] text-[#717680]">
                                    Nenhum grupo encontrado
                                  </p>
                                  {trimmedSearch && (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const value = `custom-${trimmedSearch
                                          .toLowerCase()
                                          .normalize("NFD")
                                          .replace(/[\u0300-\u036f]/g, "")
                                          .replace(/[^a-z0-9]+/g, "-")
                                          .replace(/^-|-$/g, "")}`;
                                        const option = { value, label: trimmedSearch };
                                        setCustomGrupoOptions((prev) =>
                                          prev.some((item) => item.value === value)
                                            ? prev
                                            : [...prev, option]
                                        );
                                        update(
                                          "grupoClientes",
                                          form.grupoClientes.includes(value)
                                            ? form.grupoClientes
                                            : [...form.grupoClientes, value]
                                        );
                                        setGrupoSearch("");
                                        setGrupoOpen(false);
                                      }}
                                      className="flex w-full items-center gap-[8px] px-[12px] py-[8px] font-['Helvetica_Neue:Regular',sans-serif] text-[13px] text-[#0b5ed7] transition-colors hover:bg-[#f8fafc]"
                                    >
                                      <svg
                                        className="size-[14px] shrink-0"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                      >
                                        <path d="M12 5v14M5 12h14" />
                                      </svg>
                                      <span className="truncate">Adicionar "{trimmedSearch}"</span>
                                    </button>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })()}
                  </div>
                  {form.grupoClientes.length > 0 &&
                    (() => {
                      const selectedGroups = availableGrupoOptions.filter((option) =>
                        form.grupoClientes.includes(option.value)
                      );
                      return (
                        <div className="flex flex-wrap gap-[6px]">
                          {selectedGroups.map((selected) => (
                            <span
                              key={selected.value}
                              className="inline-flex items-center gap-[6px] rounded-full border border-[#dbeafe] bg-[#e8f0fe] px-[10px] py-[4px] font-['Helvetica_Neue:Regular',sans-serif] text-[12px] text-[#0b5ed7]"
                            >
                              {selected.label}
                              <button
                                type="button"
                                onClick={() =>
                                  update(
                                    "grupoClientes",
                                    form.grupoClientes.filter((value) => value !== selected.value)
                                  )
                                }
                                className="cursor-pointer transition-colors hover:text-[#084fb7]"
                                aria-label={`Remover ${selected.label}`}
                              >
                                <svg
                                  className="size-[12px]"
                                  viewBox="0 0 12 12"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                >
                                  <path d="M3 3l6 6M9 3l-6 6" />
                                </svg>
                              </button>
                            </span>
                          ))}
                        </div>
                      );
                    })()}
                </div>
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

            {/* Equipe */}
            <Card
              size="sm"
              className={cn(
                cardOverride,
                "!overflow-visible",
                form.multiplosHorarios && "gap-4 data-[size=sm]:gap-4",
                !form.multiplosHorarios && "flex-1",
                form.equipe.length > 0 && !form.multiplosHorarios && "!pb-0"
              )}
            >
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Equipe responsável</CardTitle>
                {!form.multiplosHorarios && form.equipe.length > 1 && (
                  <button
                    type="button"
                    className="cursor-pointer text-[12px] font-medium text-[#0b5ed7] hover:underline"
                    onClick={() => {
                      const updated: Record<string, boolean> = {};
                      form.equipe.forEach((g) => {
                        updated[g] = true;
                      });
                      setGuideInsurance((prev) => ({ ...prev, ...updated }));
                    }}
                  >
                    Contratar seguro a todos
                  </button>
                )}
              </CardHeader>
              {form.multiplosHorarios && (
                <div className="mx-4 -mt-2 mb-1 flex items-center gap-[10px] rounded-[10px] border border-[#f5f5f5] bg-[#f8f9fc] px-[12px] py-[8px]">
                  <svg className="size-[24px] shrink-0" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="11" fill="#4A7BF7" opacity="0.15" />
                    <circle cx="12" cy="12" r="8" fill="#4A7BF7" />
                    <path
                      d="M12 16v-4M12 8h.01"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                  <p className="font-['Helvetica_Neue:Regular',sans-serif] text-[12px] leading-[14px] text-[#414651]">
                    Com múltiplos horários habilitados, a equipe escalada é definida em cada saída.
                  </p>
                </div>
              )}
              {!form.multiplosHorarios && (
                <>
                  <CardContent className="flex flex-1 flex-col gap-[16px]">
                    {/* Search dropdown — same pattern as equipe responsável */}
                    <div className="relative" ref={teamDropdownRef}>
                      <svg
                        className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 z-10 size-[16px] -translate-y-1/2"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.5" />
                        <path
                          d="M16 16l4 4"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                      </svg>
                      <Input
                        className={cn(fieldSurfaceClass, "pr-9 pl-9")}
                        value={teamSearch}
                        onChange={(e) => {
                          setTeamSearch(e.target.value);
                          if (!teamDropdownOpen) setTeamDropdownOpen(true);
                        }}
                        onFocus={() => setTeamDropdownOpen(true)}
                        placeholder="Buscar ou adicionar membro..."
                      />
                      <button
                        onClick={() => setTeamDropdownOpen(!teamDropdownOpen)}
                        className="absolute top-1/2 right-3 shrink-0 -translate-y-1/2 cursor-pointer"
                        type="button"
                      >
                        <svg
                          className={`text-muted-foreground size-[14px] transition-transform ${teamDropdownOpen ? "rotate-180" : ""}`}
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <path
                            d="M6 9l6 6 6-6"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                      {teamDropdownOpen && (
                        <div className="absolute top-full right-0 left-0 z-50 mt-[4px] overflow-hidden rounded-[8px] border border-[#e9eaeb] bg-white shadow-[0px_4px_16px_0px_rgba(0,0,0,0.12)]">
                          <div className="max-h-[200px] overflow-y-auto py-[4px]">
                            {filteredGuides.length > 0 ? (
                              filteredGuides.map((g) => {
                                const gi = g.name
                                  .split(" ")
                                  .map((w: string) => w[0])
                                  .join("")
                                  .slice(0, 2)
                                  .toUpperCase();
                                return (
                                  <button
                                    key={g.name}
                                    type="button"
                                    onClick={() => {
                                      if (!g.available) {
                                        setTeamConflictConfirm(g.name);
                                        setTeamDropdownOpen(false);
                                        return;
                                      }
                                      addTeamGuide(g.name);
                                    }}
                                    className="flex w-full cursor-pointer items-center gap-[10px] px-[12px] py-[8px] transition-colors hover:bg-[#f8fafc]"
                                  >
                                    <div className="flex size-[32px] shrink-0 items-center justify-center rounded-full border border-[#bfdbfe] bg-[#eff6ff]">
                                      <p className="font-['Helvetica_Neue:Medium',sans-serif] text-[11px] text-[#0b5ed7]">
                                        {gi}
                                      </p>
                                    </div>
                                    <div className="min-w-0 flex-1 text-left">
                                      <p className="truncate font-['Helvetica_Neue:Regular',sans-serif] text-[13px] text-[#252b37]">
                                        {g.name}
                                      </p>
                                      <p
                                        className={`truncate font-['Helvetica_Neue:Regular',sans-serif] text-[11px] ${g.available ? "text-[#079455]" : "text-[#e17c00]"}`}
                                      >
                                        {g.available
                                          ? "Disponível para a atividade"
                                          : "Alocado em outra atividade no mesmo horário"}
                                      </p>
                                    </div>
                                    <svg
                                      className="size-[14px] shrink-0 text-[#0b5ed7]"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        d="M12 5v14M5 12h14"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                      />
                                    </svg>
                                  </button>
                                );
                              })
                            ) : (
                              <div className="px-[12px] py-[12px]">
                                <p className="text-center font-['Helvetica_Neue:Regular',sans-serif] text-[13px] text-[#a4a7ae]">
                                  Nenhum membro encontrado
                                </p>
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
                          const initials = g
                            .split(" ")
                            .map((w: string) => w[0])
                            .join("")
                            .slice(0, 2)
                            .toUpperCase();
                          const guide = allGuides.find((gi) => gi.name === g);
                          const hasTimeConflict = guide?.available === false;
                          const hasInsurance = guideInsurance[g] ?? false;
                          return (
                            <div
                              key={g}
                              className="flex items-center gap-[12px] rounded-[10px] border border-[#f5f5f5] bg-[#fafafa] px-[12px] py-[10px] transition-colors hover:bg-[#f0f1f3]"
                            >
                              <div className="flex size-[32px] shrink-0 items-center justify-center rounded-full border border-[#bfdbfe] bg-[#eff6ff]">
                                <p className="font-['Helvetica_Neue:Medium',sans-serif] text-[11px] text-[#0b5ed7]">
                                  {initials}
                                </p>
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="truncate font-['Helvetica_Neue:Regular',sans-serif] text-[13px] text-[#252b37]">
                                  {g}
                                </p>
                                <div className="flex min-w-0 items-center gap-[6px]">
                                  <p
                                    className={`shrink-0 font-['Helvetica_Neue:Regular',sans-serif] text-[11px] ${hasInsurance ? "text-[#0b5ed7]" : "text-[#dc6803]"}`}
                                  >
                                    {hasInsurance ? "Seguro contratado" : "Sem seguro"}
                                  </p>
                                  {hasTimeConflict && (
                                    <>
                                      <div className="h-[10px] w-px shrink-0 bg-[#d5d7da]" />
                                      <p className="truncate font-['Helvetica_Neue:Regular',sans-serif] text-[11px] text-[#dc6803]">
                                        Conflito de horário
                                      </p>
                                    </>
                                  )}
                                </div>
                              </div>
                              <div
                                className="relative shrink-0"
                                ref={memberMenu === i ? memberMenuRef : undefined}
                              >
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setMemberMenu(memberMenu === i ? null : i);
                                  }}
                                  className="flex size-[24px] cursor-pointer items-center justify-center rounded-[6px] border border-[#e9eaeb] bg-white transition-colors hover:bg-[#f8fafc]"
                                >
                                  <svg className="size-[12px]" fill="none" viewBox="0 0 16 16">
                                    <circle cx="8" cy="3.5" r="1.2" fill="#717680" />
                                    <circle cx="8" cy="8" r="1.2" fill="#717680" />
                                    <circle cx="8" cy="12.5" r="1.2" fill="#717680" />
                                  </svg>
                                </button>
                                {memberMenu === i && (
                                  <div className="absolute top-full right-0 z-10 mt-[4px] w-[200px] rounded-[8px] border border-[#f5f5f5] bg-white py-[4px] shadow-[0px_4px_16px_0px_rgba(0,0,0,0.12)]">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setGuideInsurance((prev) => ({ ...prev, [g]: !prev[g] }));
                                        setMemberMenu(null);
                                      }}
                                      className="flex w-full cursor-pointer items-center gap-[8px] px-[12px] py-[8px] transition-colors hover:bg-[#f8fafc]"
                                    >
                                      {hasInsurance ? (
                                        <svg
                                          className="size-[16px] shrink-0 text-[#414651]"
                                          fill="none"
                                          viewBox="0 0 20 20"
                                        >
                                          <path
                                            d="M16.54 10.4165C16.54 10.4165 16.6668 7.86136 16.54 7.55495C16.4131 7.24853 16.1722 7.00756 15.6905 6.52564L11.7434 2.5768C11.3277 2.16088 11.1198 1.95292 10.8623 1.8297C10.8087 1.80407 10.7538 1.78132 10.6978 1.76155C10.4286 1.6665 10.1346 1.6665 9.5467 1.6665C6.84251 1.6665 5.49042 1.6665 4.5746 2.40522C4.38959 2.55446 4.22106 2.72306 4.07189 2.90815C3.3335 3.82436 3.3335 5.17705 3.3335 7.88241V11.6709C3.3335 14.8149 3.3335 16.3869 4.30981 17.3637C5.09571 18.1499 7.48039 17.8866 9.5467 17.9165M10.8335 2.08335V2.5002C10.8335 4.85825 10.8335 6.03727 11.5657 6.76982C12.298 7.50237 13.4765 7.50237 15.8335 7.50237H16.2502"
                                            stroke="currentColor"
                                            strokeWidth="1.5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                          />
                                          <path
                                            d="M17.5 18.3335L12.5 13.3335M17.5 13.3335L12.5 18.3335"
                                            stroke="currentColor"
                                            strokeWidth="1.5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                          />
                                        </svg>
                                      ) : (
                                        <svg
                                          className="size-[16px] shrink-0 text-[#414651]"
                                          fill="none"
                                          viewBox="0 0 20 20"
                                        >
                                          <path
                                            d="M16.6668 9.99984V8.88055C16.6668 8.1993 16.6668 7.85867 16.54 7.55239C16.4131 7.2461 16.1722 7.00524 15.6905 6.52353L11.7434 2.57641C11.3277 2.16067 11.1198 1.9528 10.8623 1.82962C10.8087 1.80401 10.7538 1.78127 10.6978 1.76151C10.4286 1.6665 10.1346 1.6665 9.5467 1.6665C6.84251 1.6665 5.49042 1.6665 4.5746 2.4049C4.38959 2.55407 4.22106 2.7226 4.07189 2.90761C3.3335 3.82343 3.3335 5.17552 3.3335 7.87971V11.6665C3.3335 14.8092 3.3335 16.3805 4.30981 17.3569C5.28612 18.3332 6.85747 18.3332 10.0002 18.3332M10.8335 2.08317V2.49984C10.8335 4.85686 10.8335 6.03537 11.5657 6.7676C12.298 7.49984 13.4765 7.49984 15.8335 7.49984H16.2502"
                                            stroke="currentColor"
                                            strokeWidth="1.5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                          />
                                          <path
                                            d="M16.6668 14.6855V13.0429C16.6668 12.7845 16.4771 12.5701 16.231 12.5261C15.2393 12.3488 14.416 11.9544 14.0144 11.7356C13.8499 11.6461 13.6505 11.6461 13.486 11.7356C13.0843 11.9544 12.2611 12.3488 11.2693 12.5261C11.0232 12.5701 10.8335 12.7845 10.8335 13.0429V14.6855C10.8335 16.8283 12.9522 17.9971 13.5781 18.2956C13.6885 18.3483 13.8118 18.3483 13.9223 18.2956C14.5482 17.9971 16.6668 16.8283 16.6668 14.6855Z"
                                            stroke="currentColor"
                                            strokeWidth="1.5"
                                            strokeLinecap="round"
                                          />
                                        </svg>
                                      )}
                                      <p className="font-['Helvetica_Neue:Regular',sans-serif] text-[13px] text-[#414651]">
                                        {hasInsurance ? "Desfazer seguro" : "Contratar seguro"}
                                      </p>
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => setMemberMenu(null)}
                                      className="flex w-full cursor-pointer items-center gap-[8px] px-[12px] py-[8px] transition-colors hover:bg-[#f8fafc]"
                                    >
                                      <svg
                                        className="size-[16px] shrink-0 text-[#075e54]"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 13.3789 2.27907 14.6926 2.78382 15.8877C3.06278 16.5481 3.20226 16.8784 3.21953 17.128C3.2368 17.3776 3.16334 17.6521 3.01642 18.2012L2 22L5.79877 20.9836C6.34788 20.8367 6.62244 20.7632 6.87202 20.7805C7.12161 20.7977 7.45185 20.9372 8.11235 21.2162C9.30745 21.7209 10.6211 22 12 22Z"
                                          stroke="currentColor"
                                          strokeWidth="1.5"
                                          strokeLinejoin="round"
                                        />
                                        <path
                                          d="M8.58815 12.3773L9.45909 11.2956C9.82616 10.8397 10.2799 10.4153 10.3155 9.80826C10.3244 9.65494 10.2166 8.96657 10.0008 7.58986C9.91601 7.04881 9.41086 7 8.97332 7C8.40314 7 8.11805 7 7.83495 7.12931C7.47714 7.29275 7.10979 7.75231 7.02917 8.13733C6.96539 8.44196 7.01279 8.65187 7.10759 9.07169C7.51023 10.8548 8.45481 12.6158 9.91948 14.0805C11.3842 15.5452 13.1452 16.4898 14.9283 16.8924C15.3481 16.9872 15.558 17.0346 15.8627 16.9708C16.2477 16.8902 16.7072 16.5229 16.8707 16.165C17 15.8819 17 15.5969 17 15.0267C17 14.5891 16.9512 14.084 16.4101 13.9992C15.0334 13.7834 14.3451 13.6756 14.1917 13.6845C13.5847 13.7201 13.1603 14.1738 12.7044 14.5409L11.6227 15.4118"
                                          stroke="currentColor"
                                          strokeWidth="1.5"
                                        />
                                      </svg>
                                      <p className="font-['Helvetica_Neue:Regular',sans-serif] text-[13px] text-[#075e54]">
                                        Ligar via WhatsApp
                                      </p>
                                    </button>
                                    <div className="mx-[8px] my-[4px] h-px bg-[#f5f5f5]" />
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setRemoveGuideConfirm({ guide: g });
                                        setMemberMenu(null);
                                      }}
                                      className="flex w-full cursor-pointer items-center gap-[8px] px-[12px] py-[8px] transition-colors hover:bg-[#fef3f2]"
                                    >
                                      <svg
                                        className="size-[16px] shrink-0 text-[#d92d20]"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"
                                          stroke="currentColor"
                                          strokeWidth="1.5"
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                        />
                                      </svg>
                                      <p className="font-['Helvetica_Neue:Regular',sans-serif] text-[13px] text-[#d92d20]">
                                        Remover da atividade
                                      </p>
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="flex flex-1 flex-col items-center justify-center gap-[8px] py-[24px]">
                        <svg className="size-[32px] text-[#d0d5dd]" fill="none" viewBox="0 0 24 24">
                          <path
                            d="M7.5 19.5C7.5 18.5344 7.82853 17.5576 8.63092 17.0204C9.59321 16.3761 10.7524 16 12 16C13.2476 16 14.4068 16.3761 15.3691 17.0204C16.1715 17.5576 16.5 18.5344 16.5 19.5"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <circle
                            cx="12"
                            cy="11"
                            r="2.5"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M17.5 11C18.6101 11 19.6415 11.3769 20.4974 12.0224C21.2229 12.5696 21.5 13.4951 21.5 14.4038V14.5"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <circle
                            cx="17.5"
                            cy="6.5"
                            r="2"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M6.5 11C5.38987 11 4.35846 11.3769 3.50256 12.0224C2.77706 12.5696 2.5 13.4951 2.5 14.4038V14.5"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <circle
                            cx="6.5"
                            cy="6.5"
                            r="2"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <p className="text-[13px] text-[#717680]">Nenhum colaborador escalado</p>
                        <p className="-mt-[4px] max-w-[200px] text-center text-[11px] text-[#94a3b8]">
                          Busque e adicione os colaboradores responsáveis por conduzir a atividade.
                        </p>
                      </div>
                    )}
                  </CardContent>
                  {form.equipe.length > 0 && (
                    <div className="shrink-0 border-t border-[#f5f5f5] px-[16px] py-[12px]">
                      <div className="flex items-center gap-[6px]">
                        <svg
                          className="size-[14px] text-[#17b26a]"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z M9 12l2 2 4-4" />
                        </svg>
                        <p className="font-['Helvetica_Neue:Regular',sans-serif] text-[12px] text-[#535862]">
                          {form.equipe.length} membro(s) ·{" "}
                          {form.equipe.filter((g) => guideInsurance[g]).length} seguro(s)
                          contratado(s)
                        </p>
                      </div>
                    </div>
                  )}
                </>
              )}
            </Card>
          </div>
        </div>

        {/* Salvar atividade */}
        <div className="flex justify-end pt-[16px] pb-[8px]">
          <button
            disabled={!form.titulo.trim()}
            onClick={() => {
              showStandaloneToast("Atividade criada com sucesso");
              onBack();
            }}
            className={cn(
              "rounded-[8px] px-[16px] py-[8px] font-['Helvetica_Neue:Medium',sans-serif] text-[13px] transition-colors",
              form.titulo.trim()
                ? "cursor-pointer bg-[#0b5ed7] text-white hover:bg-[#084fb7]"
                : "cursor-not-allowed bg-[#e9eaeb] text-[#a4a7ae]"
            )}
          >
            Salvar atividade
          </button>
        </div>
      </div>

      {/* ── Drawer: Configurar saída ── */}
      {editingSaida && (
        <SaidaDrawer
          saida={editingSaida}
          index={saidas.indexOf(editingSaida) + 1}
          allGuides={allGuides}
          onUpdate={(patch) => {
            updateSaida(editingSaida.id, patch);
            setToast(`Saída ${saidas.indexOf(editingSaida) + 1} configurada com sucesso`);
          }}
          onClose={() => setEditingSaidaId(null)}
        />
      )}

      {teamConflictConfirm && (
        <GuideConflictConfirmModal
          guide={teamConflictConfirm}
          onCancel={() => setTeamConflictConfirm(null)}
          onConfirm={() => {
            addTeamGuide(teamConflictConfirm);
            setToast(`Solicitação enviada para ${teamConflictConfirm}`);
            setTeamConflictConfirm(null);
          }}
        />
      )}

      {removeGuideConfirm && (
        <GuideRemoveConfirmModal
          guide={removeGuideConfirm.guide}
          all={removeGuideConfirm.all}
          onCancel={() => setRemoveGuideConfirm(null)}
          onConfirm={() => {
            if (removeGuideConfirm.all) {
              setForm((prev) => ({ ...prev, equipe: [] }));
              setGuideInsurance({});
            } else if (removeGuideConfirm.guide) {
              const guide = removeGuideConfirm.guide;
              setForm((prev) => ({
                ...prev,
                equipe: prev.equipe.filter((item) => item !== guide),
              }));
              setGuideInsurance((prev) => {
                const next = { ...prev };
                delete next[guide];
                return next;
              });
            }
            setRemoveGuideConfirm(null);
          }}
        />
      )}

      {/* ── Toast de sucesso ── */}
      {toast && <SuccessToast message={toast} onClose={() => setToast(null)} />}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Success toast                                                      */
/* ------------------------------------------------------------------ */

/* ------------------------------------------------------------------ */
/*  Recurrence panel                                                   */
/* ------------------------------------------------------------------ */

const WEEKDAYS = ["D", "S", "T", "Q", "Q", "S", "S"] as const;
const WEEKDAY_FULL = ["domingo", "segunda", "terça", "quarta", "quinta", "sexta", "sábado"];
const ORDEM_OPTIONS = ["primeira", "segunda", "terceira", "quarta", "última"];

function RecurrencePanel({
  form,
  update,
}: {
  form: FormState;
  update: <K extends keyof FormState>(key: K, value: FormState[K]) => void;
}) {
  const tipo = form.recorrenciaTipo;
  const [customDateInput, setCustomDateInput] = useState("");

  const addCustomDate = () => {
    const trimmed = customDateInput.trim();
    if (trimmed.length === 10 && !form.recorrenciaDatasPersonalizadas.includes(trimmed)) {
      update("recorrenciaDatasPersonalizadas", [...form.recorrenciaDatasPersonalizadas, trimmed]);
      setCustomDateInput("");
    }
  };

  const removeCustomDate = (date: string) => {
    update(
      "recorrenciaDatasPersonalizadas",
      form.recorrenciaDatasPersonalizadas.filter((d) => d !== date)
    );
  };

  const toggleWeekday = (day: number) => {
    const current = form.recorrenciaDiasSemana;
    update(
      "recorrenciaDiasSemana",
      current.includes(day) ? current.filter((d) => d !== day) : [...current, day].sort()
    );
  };

  // Summary text
  const summary = (() => {
    if (tipo === "diario") {
      return form.recorrenciaIntervalo === 1
        ? "Repete todos os dias"
        : `Repete a cada ${form.recorrenciaIntervalo} dias`;
    }
    if (tipo === "semanal") {
      if (form.recorrenciaDiasSemana.length === 0) return "Selecione os dias da semana";
      const names = form.recorrenciaDiasSemana.map((d) => WEEKDAY_FULL[d]).join(", ");
      return `Repete ${form.recorrenciaDiasSemana[0] === 0 ? "todo" : "toda"} ${names}`;
    }
    if (tipo === "mensal") {
      if (form.recorrenciaMensalModo === "dia")
        return `Repete todo dia ${form.recorrenciaMensalDia} do mês`;
      return `Repete na ${form.recorrenciaMensalOrdem} ${form.recorrenciaMensalDiaSemana} do mês`;
    }
    return `Datas selecionadas: ${form.recorrenciaDatasPersonalizadas.length}`;
  })();

  return (
    <div className="space-y-[16px] rounded-[10px] border border-[#f5f5f5] bg-[#fafafa] p-[16px]">
      {/* Header */}
      <div className="flex items-center gap-[8px]">
        <svg
          className="size-[20px] text-[#414651]"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M16.3884 3L17.3913 3.97574C17.8393 4.41165 18.0633 4.62961 17.9844 4.81481C17.9056 5 17.5888 5 16.9552 5H9.19422C5.22096 5 2 8.13401 2 12C2 13.4872 2.47668 14.8662 3.2895 16" />
          <path d="M7.61156 21L6.60875 20.0243C6.16074 19.5883 5.93673 19.3704 6.01557 19.1852C6.09441 19 6.4112 19 7.04478 19H14.8058C18.779 19 22 15.866 22 12C22 10.5128 21.5233 9.13383 20.7105 8" />
        </svg>
        <p className="font-['Helvetica_Neue:Medium',sans-serif] text-[13px] tracking-[0.5px] text-[#252b37] uppercase">
          Recorrência
        </p>
        <p className="font-['Helvetica_Neue:Regular',sans-serif] text-[13px] text-[#0b5ed7]">
          {summary}
        </p>
      </div>

      {/* Toggle tabs */}
      <div className="flex gap-[4px] rounded-[8px] border border-[#e9eaeb] bg-white p-[4px]">
        {(["diario", "semanal", "mensal", "personalizado"] as const).map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => update("recorrenciaTipo", opt)}
            className={cn(
              "flex-1 cursor-pointer rounded-[6px] px-[12px] py-[6px] text-[13px] transition-all",
              tipo === opt
                ? "bg-[#0b5ed7] font-['Helvetica_Neue:Medium',sans-serif] text-white shadow-sm"
                : "font-['Helvetica_Neue:Regular',sans-serif] text-[#535862] hover:bg-[#f8fafc] hover:text-[#252b37]"
            )}
          >
            {opt === "diario"
              ? "Diário"
              : opt === "semanal"
                ? "Semanal"
                : opt === "mensal"
                  ? "Mensal"
                  : "Personalizado"}
          </button>
        ))}
      </div>

      {/* Content per type */}
      {tipo === "diario" && (
        <div className="flex items-center gap-[8px]">
          <span className="font-['Helvetica_Neue:Regular',sans-serif] text-[13px] text-[#414651]">
            Repetir a cada
          </span>
          <Input
            className="w-[56px] bg-white text-center"
            inputMode="numeric"
            value={form.recorrenciaIntervalo || ""}
            onChange={(e) => {
              const raw = e.target.value.replace(/\D/g, "");
              update("recorrenciaIntervalo", raw ? parseInt(raw, 10) : 0);
            }}
          />
          <span className="font-['Helvetica_Neue:Regular',sans-serif] text-[13px] text-[#414651]">
            dia(s).
          </span>
        </div>
      )}

      {tipo === "semanal" && (
        <div className="flex gap-[6px]">
          {WEEKDAYS.map((label, i) => (
            <button
              key={i}
              type="button"
              onClick={() => toggleWeekday(i)}
              className={cn(
                "flex size-[36px] cursor-pointer items-center justify-center rounded-[8px] border text-[13px] transition-all",
                form.recorrenciaDiasSemana.includes(i)
                  ? "border-[#0b5ed7] bg-[#f0f5ff] font-['Helvetica_Neue:Medium',sans-serif] text-[#0b5ed7]"
                  : "border-[#e9eaeb] bg-white font-['Helvetica_Neue:Regular',sans-serif] text-[#535862] hover:border-[#d0d5dd]"
              )}
            >
              {label}
            </button>
          ))}
        </div>
      )}

      {tipo === "mensal" && (
        <div className="space-y-[12px]">
          {/* Option 1: specific day */}
          <label className="flex cursor-pointer items-center gap-[8px]">
            <input
              type="radio"
              name="mensal-modo"
              checked={form.recorrenciaMensalModo === "dia"}
              onChange={() => update("recorrenciaMensalModo", "dia")}
              className="size-[16px] accent-[#0b5ed7]"
            />
            <span className="font-['Helvetica_Neue:Regular',sans-serif] text-[13px] text-[#414651]">
              No dia
            </span>
            <Input
              className="w-[56px] bg-white text-center"
              inputMode="numeric"
              value={form.recorrenciaMensalDia || ""}
              onChange={(e) => {
                const raw = e.target.value.replace(/\D/g, "");
                const val = raw ? Math.min(parseInt(raw, 10), 31) : 0;
                update("recorrenciaMensalDia", val);
              }}
            />
            <span className="font-['Helvetica_Neue:Regular',sans-serif] text-[13px] text-[#414651]">
              do mês.
            </span>
          </label>

          {/* Option 2: ordinal weekday */}
          <label className="flex cursor-pointer items-center gap-[8px]">
            <input
              type="radio"
              name="mensal-modo"
              checked={form.recorrenciaMensalModo === "semana"}
              onChange={() => update("recorrenciaMensalModo", "semana")}
              className="size-[16px] accent-[#0b5ed7]"
            />
            <span className="font-['Helvetica_Neue:Regular',sans-serif] text-[13px] text-[#414651]">
              Na
            </span>
            <select
              value={form.recorrenciaMensalOrdem}
              onChange={(e) => update("recorrenciaMensalOrdem", e.target.value)}
              className="border-border h-9 cursor-pointer rounded-md border bg-white px-2 font-['Helvetica_Neue:Regular',sans-serif] text-[13px] text-[#414651] outline-none"
            >
              {ORDEM_OPTIONS.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
            <select
              value={form.recorrenciaMensalDiaSemana}
              onChange={(e) => update("recorrenciaMensalDiaSemana", e.target.value)}
              className="border-border h-9 cursor-pointer rounded-md border bg-white px-2 font-['Helvetica_Neue:Regular',sans-serif] text-[13px] text-[#414651] outline-none"
            >
              {WEEKDAY_FULL.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
            <span className="font-['Helvetica_Neue:Regular',sans-serif] text-[13px] text-[#414651]">
              do mês.
            </span>
          </label>
        </div>
      )}

      {tipo === "personalizado" && (
        <div className="space-y-[12px]">
          <div className="flex items-center gap-[8px]">
            <Input
              className="flex-1 bg-white"
              placeholder="dd/mm/aaaa"
              maxLength={10}
              inputMode="numeric"
              value={customDateInput}
              onChange={(e) => setCustomDateInput(maskDate(e.target.value))}
            />
            <button
              type="button"
              onClick={addCustomDate}
              className="flex shrink-0 cursor-pointer items-center gap-[6px] font-['Helvetica_Neue:Medium',sans-serif] text-[13px] text-[#0b5ed7] transition-colors hover:text-[#084fb7]"
            >
              <svg
                className="size-[14px]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <path d="M12 5v14M5 12h14" />
              </svg>
              Adicionar
            </button>
          </div>
          {form.recorrenciaDatasPersonalizadas.length > 0 && (
            <div className="flex flex-wrap gap-[6px]">
              {form.recorrenciaDatasPersonalizadas.map((d) => (
                <span
                  key={d}
                  className="inline-flex items-center gap-[6px] rounded-full bg-[#e8f0fe] px-[10px] py-[4px] font-['Helvetica_Neue:Regular',sans-serif] text-[12px] text-[#0b5ed7]"
                >
                  {d}
                  <button
                    type="button"
                    onClick={() => removeCustomDate(d)}
                    className="cursor-pointer transition-colors hover:text-[#084fb7]"
                  >
                    <svg
                      className="size-[12px]"
                      viewBox="0 0 12 12"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    >
                      <path d="M3 3l6 6M9 3l-6 6" />
                    </svg>
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function SuccessToast({ message, onClose }: { message: string; onClose: () => void }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 200);
    }, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return createPortal(
    <div
      className={`fixed top-[24px] right-[24px] z-[200] flex w-[384px] overflow-clip rounded-[8px] border border-[#e4e4e7] bg-white shadow-[0px_4px_6px_-4px_rgba(0,0,0,0.1),0px_10px_15px_-3px_rgba(0,0,0,0.1)] transition-all duration-200 ${visible ? "translate-y-0 opacity-100" : "-translate-y-[8px] opacity-0"}`}
    >
      <div className="flex w-[60px] shrink-0 items-center justify-center bg-[#ecfdf3]">
        <svg className="size-[28px]" viewBox="0 0 28 28" fill="none">
          <path
            d="M23.8004 11.3614C25.0444 12.6053 25.6663 13.2273 25.6663 14.0001C25.6663 14.773 25.0443 15.395 23.8004 16.639C22.9641 17.4752 22.7073 18.0152 22.7073 19.1894C22.7073 20.1186 22.8876 21.4407 22.1553 22.1668C21.4288 22.8872 20.1122 22.7078 19.1889 22.7078C18.0556 22.7078 17.5098 22.9295 16.701 23.7384C16.0123 24.4271 15.089 25.6668 13.9997 25.6668C12.9104 25.6668 11.9871 24.4271 11.2983 23.7384C10.4895 22.9295 9.94375 22.7078 8.81042 22.7078C7.88713 22.7078 6.57056 22.8872 5.84408 22.1668C5.11178 21.4407 5.292 20.1186 5.292 19.1894C5.292 18.0152 5.03519 17.4752 4.19895 16.639C2.955 15.395 2.33303 14.773 2.33301 14.0001C2.33302 13.2273 2.95499 12.6053 4.19892 11.3614C4.94541 10.6149 5.292 9.87515 5.292 8.8109C5.292 7.88759 5.11258 6.571 5.83301 5.84452C6.55917 5.11224 7.88121 5.29246 8.81043 5.29246C9.87466 5.29246 10.6144 4.9459 11.3609 4.19943C12.6048 2.95547 13.2268 2.3335 13.9997 2.3335C14.7726 2.3335 15.3945 2.95547 16.6385 4.19943M22.1553 22.1668H22.1663"
            stroke="#079455"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M9.91699 11.0833L14.0003 15.1667L24.5006 3.5"
            stroke="#079455"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <div className="flex flex-1 items-center justify-between px-[16px] py-[16px]">
        <p className="font-['Helvetica_Neue:Medium',sans-serif] text-[14px] leading-[normal] text-[#252b37]">
          {message}
        </p>
        <button
          onClick={() => {
            setVisible(false);
            setTimeout(onClose, 200);
          }}
          className="ml-[12px] flex size-[24px] shrink-0 cursor-pointer items-center justify-center rounded-[4px] transition-colors hover:bg-[#f5f5f5]"
        >
          <svg className="size-[14px]" fill="none" viewBox="0 0 14 14">
            <path
              d="M3.5 3.5l7 7M10.5 3.5l-7 7"
              stroke="#717680"
              strokeWidth="1.3"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>
    </div>,
    document.body
  );
}

/* ------------------------------------------------------------------ */
/*  Drawer for configuring a "saída"                                   */
/* ------------------------------------------------------------------ */

interface SaidaData {
  id: number;
  horarioInicio: string;
  horarioTermino: string;
  capacidadeMin: number;
  capacidadeMax: number;
  equipe: string[];
}

function SaidaDrawer({
  saida,
  index,
  allGuides,
  onUpdate,
  onClose,
}: {
  saida: SaidaData;
  index: number;
  allGuides: { name: string; available: boolean }[];
  onUpdate: (patch: Partial<SaidaData>) => void;
  onClose: () => void;
}) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);
  const [isClosing, setIsClosing] = useState(false);
  const handleClose = () => {
    if (isClosing) return;
    setIsClosing(true);
    setTimeout(() => onClose(), 200);
  };

  const [localHorarioInicio, setLocalHorarioInicio] = useState(saida.horarioInicio);
  const [localHorarioTermino, setLocalHorarioTermino] = useState(saida.horarioTermino);
  const [localCapMin, setLocalCapMin] = useState(saida.capacidadeMin);
  const [localCapMax, setLocalCapMax] = useState(saida.capacidadeMax);
  const [localEquipe, setLocalEquipe] = useState<string[]>(saida.equipe);
  const [drawerTeamSearch, setDrawerTeamSearch] = useState("");
  const [drawerTeamOpen, setDrawerTeamOpen] = useState(false);
  const drawerTeamRef = useRef<HTMLDivElement>(null);
  const [drawerMemberMenu, setDrawerMemberMenu] = useState<number | null>(null);
  const [drawerMenuPos, setDrawerMenuPos] = useState<{ top: number; right: number } | null>(null);
  const drawerMemberMenuRef = useRef<HTMLDivElement>(null);
  const [drawerInsurance, setDrawerInsurance] = useState<Record<string, boolean>>({});
  const [drawerConflictConfirm, setDrawerConflictConfirm] = useState<string | null>(null);
  const [drawerRemoveConfirm, setDrawerRemoveConfirm] = useState<{
    guide?: string;
    all?: boolean;
  } | null>(null);
  const [drawerToast, setDrawerToast] = useState<string | null>(null);

  const openDrawerMenu = useCallback(
    (i: number, btnEl: HTMLButtonElement) => {
      if (drawerMemberMenu === i) {
        setDrawerMemberMenu(null);
        setDrawerMenuPos(null);
        return;
      }
      const rect = btnEl.getBoundingClientRect();
      setDrawerMenuPos({ top: rect.bottom + 4, right: window.innerWidth - rect.right });
      setDrawerMemberMenu(i);
    },
    [drawerMemberMenu]
  );

  const availableGuides = allGuides.filter((g) => !localEquipe.includes(g.name));
  const filteredGuides = availableGuides.filter((g) =>
    g.name.toLowerCase().includes(drawerTeamSearch.toLowerCase())
  );

  const addDrawerGuide = (guide: string) => {
    setLocalEquipe((prev) => (prev.includes(guide) ? prev : [...prev, guide]));
    setDrawerTeamOpen(false);
    setDrawerTeamSearch("");
  };

  useEffect(() => {
    if (!drawerTeamOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (drawerTeamRef.current && !drawerTeamRef.current.contains(e.target as Node))
        setDrawerTeamOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [drawerTeamOpen]);

  useEffect(() => {
    if (drawerMemberMenu === null) return;
    const handleClick = (e: MouseEvent) => {
      if (drawerMemberMenuRef.current && !drawerMemberMenuRef.current.contains(e.target as Node)) {
        setDrawerMemberMenu(null);
        setDrawerMenuPos(null);
      }
    };
    const id = requestAnimationFrame(() => document.addEventListener("mousedown", handleClick));
    return () => {
      cancelAnimationFrame(id);
      document.removeEventListener("mousedown", handleClick);
    };
  }, [drawerMemberMenu]);

  const handleSave = () => {
    onUpdate({
      horarioInicio: localHorarioInicio,
      horarioTermino: localHorarioTermino,
      capacidadeMin: localCapMin,
      capacidadeMax: localCapMax,
      equipe: localEquipe,
    });
    handleClose();
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex justify-end"
      onKeyDown={(e) => e.key === "Escape" && handleClose()}
    >
      <div
        className={`absolute inset-0 bg-black/40 transition-opacity duration-200 ${isClosing ? "opacity-0" : "opacity-100"}`}
        onClick={handleClose}
      />
      <div
        className={`relative z-10 flex max-h-full w-[480px] flex-col overflow-hidden rounded-l-[16px] border border-solid border-[#e9eaeb] bg-white shadow-[-8px_0px_24px_0px_rgba(0,0,0,0.1)] ${isClosing ? "animate-out slide-out-to-right fill-mode-forwards duration-200" : "animate-in slide-in-from-right duration-200"}`}
      >
        {/* ── Header ── */}
        <div className="shrink-0">
          <div className="flex items-center justify-between px-6 pt-5 pb-[16px]">
            <p className="font-['Helvetica_Neue:Medium',sans-serif] text-[16px] text-[#181d27]">
              Configurar saída {index}
            </p>
            <button
              onClick={handleClose}
              className="flex size-[32px] shrink-0 cursor-pointer items-center justify-center rounded-[6px] transition-colors hover:bg-[#f5f5f5]"
            >
              <svg className="size-[18px]" fill="none" viewBox="0 0 18 18">
                <path
                  d="M4 4l10 10M14 4L4 14"
                  stroke="#717680"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* ── Content ── */}
        <div className="flex-1 space-y-6 overflow-y-auto px-6 pt-0 pb-5 [&::-webkit-scrollbar]:w-[6px] [&::-webkit-scrollbar-button]:hidden [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-black/[0.08] hover:[&::-webkit-scrollbar-thumb]:bg-black/15 [&::-webkit-scrollbar-track]:bg-transparent">
          {/* Horários */}
          <div>
            <div
              className="-mx-6 flex h-[32px] w-full items-center border-t border-b border-[#f0f1f3] bg-[#f9fafb] px-[24px]"
              style={{ width: "calc(100% + 48px)" }}
            >
              <p className="font-['Helvetica_Neue:Medium',sans-serif] text-[11px] tracking-[0.8px] text-[#a4a7ae] uppercase">
                Horários
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-5">
              <FieldRow label="Início">
                <TimeInput
                  className={fieldSurfaceClass}
                  placeholder="hh:mm"
                  value={localHorarioInicio || null}
                  onChange={(v) => setLocalHorarioInicio(v ?? "")}
                  aria-label="Horário de início"
                />
              </FieldRow>
              <FieldRow label="Término">
                <TimeInput
                  className={fieldSurfaceClass}
                  placeholder="hh:mm"
                  value={localHorarioTermino || null}
                  onChange={(v) => setLocalHorarioTermino(v ?? "")}
                  aria-label="Horário de término"
                />
              </FieldRow>
            </div>
          </div>

          {/* Capacidade */}
          <div>
            <div
              className="-mx-6 flex h-[32px] w-full items-center border-t border-b border-[#f0f1f3] bg-[#f9fafb] px-[24px]"
              style={{ width: "calc(100% + 48px)" }}
            >
              <p className="font-['Helvetica_Neue:Medium',sans-serif] text-[11px] tracking-[0.8px] text-[#a4a7ae] uppercase">
                Capacidade
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-5">
              <FieldRow label="Mínima">
                <Input
                  className={fieldSurfaceClass}
                  inputMode="numeric"
                  value={localCapMin ? localCapMin.toLocaleString("pt-BR") : ""}
                  placeholder="0"
                  onChange={(e) => {
                    const raw = e.target.value.replace(/\D/g, "");
                    setLocalCapMin(raw ? parseInt(raw, 10) : 0);
                  }}
                  onFocus={(e) => {
                    if (localCapMin === 0) e.target.select();
                  }}
                />
              </FieldRow>
              <FieldRow label="Máxima">
                <Input
                  className={cn(
                    fieldSurfaceClass,
                    localCapMax > 0 &&
                      localCapMin > 0 &&
                      localCapMax < localCapMin &&
                      "border-[#d92d20] focus-visible:border-[#d92d20] focus-visible:ring-[#d92d20]/20"
                  )}
                  inputMode="numeric"
                  value={localCapMax ? localCapMax.toLocaleString("pt-BR") : ""}
                  placeholder="0"
                  onChange={(e) => {
                    const raw = e.target.value.replace(/\D/g, "");
                    setLocalCapMax(raw ? parseInt(raw, 10) : 0);
                  }}
                  onFocus={(e) => {
                    if (localCapMax === 0) e.target.select();
                  }}
                />
                {localCapMax > 0 && localCapMin > 0 && localCapMax < localCapMin && (
                  <p className="font-['Helvetica_Neue:Regular',sans-serif] text-[11px] leading-[14px] text-[#d92d20]">
                    A capacidade máxima deve ser maior ou igual à mínima.
                  </p>
                )}
              </FieldRow>
            </div>
          </div>

          {/* Equipe */}
          <div className="space-y-3">
            <div
              className="-mx-6 flex h-[32px] w-full items-center border-t border-b border-[#f0f1f3] bg-[#f9fafb] px-[24px]"
              style={{ width: "calc(100% + 48px)" }}
            >
              <p className="font-['Helvetica_Neue:Medium',sans-serif] text-[11px] tracking-[0.8px] text-[#a4a7ae] uppercase">
                Equipe responsável
              </p>
            </div>
            <div className="flex items-center justify-end">
              {localEquipe.length > 0 && (
                <button
                  type="button"
                  onClick={() => setDrawerRemoveConfirm({ all: true })}
                  className="cursor-pointer font-['Helvetica_Neue:Regular',sans-serif] text-[12px] text-[#d92d20] hover:underline"
                >
                  Remover todos
                </button>
              )}
            </div>

            {/* Search dropdown */}
            <div className="relative" ref={drawerTeamRef}>
              <div className="flex h-[40px] w-full items-center gap-[8px] rounded-[8px] border border-[#e9eaeb] px-[12px] transition-colors hover:border-[#d0d5dd]">
                <svg
                  className="size-[16px] shrink-0 text-[#a4a7ae]"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.5" />
                  <path
                    d="M16 16l4 4"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
                <input
                  type="text"
                  className="placeholder:text-muted-foreground flex-1 bg-transparent font-['Helvetica_Neue:Regular',sans-serif] text-[13px] text-[#252b37] outline-none"
                  value={drawerTeamSearch}
                  onChange={(e) => {
                    setDrawerTeamSearch(e.target.value);
                    if (!drawerTeamOpen) setDrawerTeamOpen(true);
                  }}
                  onFocus={() => setDrawerTeamOpen(true)}
                  placeholder="Buscar ou adicionar membro..."
                />
                <button
                  onClick={() => setDrawerTeamOpen(!drawerTeamOpen)}
                  className="shrink-0 cursor-pointer"
                  type="button"
                >
                  <svg
                    className={`size-[14px] text-[#a4a7ae] transition-transform ${drawerTeamOpen ? "rotate-180" : ""}`}
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M6 9l6 6 6-6"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
              {drawerTeamOpen && (
                <div className="absolute top-full right-0 left-0 z-50 mt-[4px] overflow-hidden rounded-[8px] border border-[#e9eaeb] bg-white shadow-[0px_4px_16px_0px_rgba(0,0,0,0.12)]">
                  <div className="max-h-[200px] overflow-y-auto py-[4px]">
                    {filteredGuides.length > 0 ? (
                      filteredGuides.map((g) => {
                        const gi = g.name
                          .split(" ")
                          .map((w: string) => w[0])
                          .join("")
                          .slice(0, 2)
                          .toUpperCase();
                        return (
                          <button
                            key={g.name}
                            type="button"
                            onClick={() => {
                              if (!g.available) {
                                setDrawerConflictConfirm(g.name);
                                setDrawerTeamOpen(false);
                                return;
                              }
                              addDrawerGuide(g.name);
                            }}
                            className="flex w-full cursor-pointer items-center gap-[10px] px-[12px] py-[8px] transition-colors hover:bg-[#f8fafc]"
                          >
                            <div className="flex size-[28px] shrink-0 items-center justify-center rounded-full bg-[#e8f0fe] text-[11px] font-medium text-[#0b5ed7]">
                              {gi}
                            </div>
                            <div className="flex min-w-0 flex-col items-start">
                              <p className="w-full truncate text-left font-['Helvetica_Neue:Regular',sans-serif] text-[13px] text-[#252b37]">
                                {g.name}
                              </p>
                              <p
                                className={`text-[11px] ${g.available ? "text-[#17b26a]" : "text-[#f79009]"}`}
                              >
                                {g.available ? "Disponível" : "Em atividade"}
                              </p>
                            </div>
                          </button>
                        );
                      })
                    ) : (
                      <p className="px-[12px] py-[8px] font-['Helvetica_Neue:Regular',sans-serif] text-[13px] text-[#717680]">
                        Nenhum resultado encontrado
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Members list or empty */}
            {localEquipe.length > 0 ? (
              <div className="flex flex-col gap-[12px]">
                {localEquipe.map((g, i) => {
                  const initials = g
                    .split(" ")
                    .map((w: string) => w[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase();
                  const guide = allGuides.find((gi) => gi.name === g);
                  const hasTimeConflict = guide?.available === false;
                  const hasInsurance = drawerInsurance[g] ?? false;
                  return (
                    <div
                      key={g}
                      className="flex items-center gap-[12px] rounded-[10px] border border-[#f5f5f5] bg-[#fafafa] px-[12px] py-[10px] transition-colors hover:bg-[#f0f1f3]"
                    >
                      <div className="flex size-[32px] shrink-0 items-center justify-center rounded-full border border-[#bfdbfe] bg-[#eff6ff]">
                        <p className="font-['Helvetica_Neue:Medium',sans-serif] text-[11px] text-[#0b5ed7]">
                          {initials}
                        </p>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-['Helvetica_Neue:Regular',sans-serif] text-[13px] text-[#252b37]">
                          {g}
                        </p>
                        <div className="flex min-w-0 items-center gap-[6px]">
                          <p
                            className={`shrink-0 font-['Helvetica_Neue:Regular',sans-serif] text-[11px] ${hasInsurance ? "text-[#0b5ed7]" : "text-[#dc6803]"}`}
                          >
                            {hasInsurance ? "Seguro contratado" : "Sem seguro"}
                          </p>
                          {hasTimeConflict && (
                            <>
                              <div className="h-[10px] w-px shrink-0 bg-[#d5d7da]" />
                              <p className="truncate font-['Helvetica_Neue:Regular',sans-serif] text-[11px] text-[#dc6803]">
                                Conflito de horário
                              </p>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="shrink-0">
                        <button
                          type="button"
                          onMouseDown={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            openDrawerMenu(i, e.currentTarget as HTMLButtonElement);
                          }}
                          className="flex size-[24px] cursor-pointer items-center justify-center rounded-[6px] border border-[#e9eaeb] bg-white transition-colors hover:bg-[#f8fafc]"
                        >
                          <svg className="size-[12px]" fill="none" viewBox="0 0 16 16">
                            <circle cx="8" cy="3.5" r="1.2" fill="#717680" />
                            <circle cx="8" cy="8" r="1.2" fill="#717680" />
                            <circle cx="8" cy="12.5" r="1.2" fill="#717680" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex min-h-[160px] w-full flex-col items-center justify-center gap-[8px] py-[24px] text-center">
                <svg className="size-[32px] text-[#d0d5dd]" fill="none" viewBox="0 0 24 24">
                  <path
                    d="M7.5 19.5C7.5 18.5344 7.82853 17.5576 8.63092 17.0204C9.59321 16.3761 10.7524 16 12 16C13.2476 16 14.4068 16.3761 15.3691 17.0204C16.1715 17.5576 16.5 18.5344 16.5 19.5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle
                    cx="12"
                    cy="11"
                    r="2.5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M17.5 11C18.6101 11 19.6415 11.3769 20.4974 12.0224C21.2229 12.5696 21.5 13.4951 21.5 14.4038V14.5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle
                    cx="17.5"
                    cy="6.5"
                    r="2"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M6.5 11C5.38987 11 4.35846 11.3769 3.50256 12.0224C2.77706 12.5696 2.5 13.4951 2.5 14.4038V14.5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle
                    cx="6.5"
                    cy="6.5"
                    r="2"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <p className="font-['Helvetica_Neue:Regular',sans-serif] text-[13px] text-[#717680]">
                  Nenhum colaborador escalado
                </p>
                <p className="-mt-[4px] max-w-[200px] text-center font-['Helvetica_Neue:Regular',sans-serif] text-[11px] text-[#94a3b8]">
                  Busque e adicione os colaboradores responsáveis por esta saída.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* ── Footer ── */}
        <div className="flex shrink-0 items-center justify-end gap-[12px] border-t border-[#e9eaeb] px-6 py-4">
          <button
            onClick={handleClose}
            className="cursor-pointer rounded-[8px] border border-[#e9eaeb] bg-white px-[16px] py-[8px] font-['Helvetica_Neue:Medium',sans-serif] text-[13px] text-[#535862] transition-colors hover:bg-[#f8fafc]"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="cursor-pointer rounded-[8px] bg-[#0b5ed7] px-[16px] py-[8px] font-['Helvetica_Neue:Medium',sans-serif] text-[13px] text-white transition-colors hover:bg-[#084fb7]"
          >
            Salvar
          </button>
        </div>
      </div>

      {/* Portal: three-dot menu */}
      {drawerMemberMenu !== null &&
        drawerMenuPos &&
        (() => {
          const g = localEquipe[drawerMemberMenu];
          if (!g) return null;
          const hasIns = drawerInsurance[g] ?? false;
          return createPortal(
            <div
              ref={drawerMemberMenuRef}
              className="fixed z-[70] w-[200px] rounded-[8px] border border-[#f5f5f5] bg-white py-[4px] shadow-[0px_4px_16px_0px_rgba(0,0,0,0.12)]"
              style={{ top: drawerMenuPos.top, right: drawerMenuPos.right }}
            >
              <button
                type="button"
                onClick={() => {
                  setDrawerInsurance((prev) => ({ ...prev, [g]: !prev[g] }));
                  setDrawerMemberMenu(null);
                  setDrawerMenuPos(null);
                }}
                className="flex w-full cursor-pointer items-center gap-[8px] px-[12px] py-[8px] transition-colors hover:bg-[#f8fafc]"
              >
                {hasIns ? (
                  <svg
                    className="size-[16px] shrink-0 text-[#414651]"
                    fill="none"
                    viewBox="0 0 20 20"
                  >
                    <path
                      d="M16.54 10.4165C16.54 10.4165 16.6668 7.86136 16.54 7.55495C16.4131 7.24853 16.1722 7.00756 15.6905 6.52564L11.7434 2.5768C11.3277 2.16088 11.1198 1.95292 10.8623 1.8297C10.8087 1.80407 10.7538 1.78132 10.6978 1.76155C10.4286 1.6665 10.1346 1.6665 9.5467 1.6665C6.84251 1.6665 5.49042 1.6665 4.5746 2.40522C4.38959 2.55446 4.22106 2.72306 4.07189 2.90815C3.3335 3.82436 3.3335 5.17705 3.3335 7.88241V11.6709C3.3335 14.8149 3.3335 16.3869 4.30981 17.3637C5.09571 18.1499 7.48039 17.8866 9.5467 17.9165M10.8335 2.08335V2.5002C10.8335 4.85825 10.8335 6.03727 11.5657 6.76982C12.298 7.50237 13.4765 7.50237 15.8335 7.50237H16.2502"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M17.5 18.3335L12.5 13.3335M17.5 13.3335L12.5 18.3335"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : (
                  <svg
                    className="size-[16px] shrink-0 text-[#414651]"
                    fill="none"
                    viewBox="0 0 20 20"
                  >
                    <path
                      d="M16.6668 9.99984V8.88055C16.6668 8.1993 16.6668 7.85867 16.54 7.55239C16.4131 7.2461 16.1722 7.00524 15.6905 6.52353L11.7434 2.57641C11.3277 2.16067 11.1198 1.9528 10.8623 1.82962C10.8087 1.80401 10.7538 1.78127 10.6978 1.76151C10.4286 1.6665 10.1346 1.6665 9.5467 1.6665C6.84251 1.6665 5.49042 1.6665 4.5746 2.4049C4.38959 2.55407 4.22106 2.7226 4.07189 2.90761C3.3335 3.82343 3.3335 5.17552 3.3335 7.87971V11.6665C3.3335 14.8092 3.3335 16.3805 4.30981 17.3569C5.28612 18.3332 6.85747 18.3332 10.0002 18.3332M10.8335 2.08317V2.49984C10.8335 4.85686 10.8335 6.03537 11.5657 6.7676C12.298 7.49984 13.4765 7.49984 15.8335 7.49984H16.2502"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M16.6668 14.6855V13.0429C16.6668 12.7845 16.4771 12.5701 16.231 12.5261C15.2393 12.3488 14.416 11.9544 14.0144 11.7356C13.8499 11.6461 13.6505 11.6461 13.486 11.7356C13.0843 11.9544 12.2611 12.3488 11.2693 12.5261C11.0232 12.5701 10.8335 12.7845 10.8335 13.0429V14.6855C10.8335 16.8283 12.9522 17.9971 13.5781 18.2956C13.6885 18.3483 13.8118 18.3483 13.9223 18.2956C14.5482 17.9971 16.6668 16.8283 16.6668 14.6855Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                )}
                <p className="font-['Helvetica_Neue:Regular',sans-serif] text-[13px] text-[#414651]">
                  {hasIns ? "Desfazer seguro" : "Contratar seguro"}
                </p>
              </button>
              <button
                type="button"
                onClick={() => {
                  setDrawerMemberMenu(null);
                  setDrawerMenuPos(null);
                }}
                className="flex w-full cursor-pointer items-center gap-[8px] px-[12px] py-[8px] transition-colors hover:bg-[#f8fafc]"
              >
                <svg
                  className="size-[16px] shrink-0 text-[#075e54]"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 13.3789 2.27907 14.6926 2.78382 15.8877C3.06278 16.5481 3.20226 16.8784 3.21953 17.128C3.2368 17.3776 3.16334 17.6521 3.01642 18.2012L2 22L5.79877 20.9836C6.34788 20.8367 6.62244 20.7632 6.87202 20.7805C7.12161 20.7977 7.45185 20.9372 8.11235 21.2162C9.30745 21.7209 10.6211 22 12 22Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M8.58815 12.3773L9.45909 11.2956C9.82616 10.8397 10.2799 10.4153 10.3155 9.80826C10.3244 9.65494 10.2166 8.96657 10.0008 7.58986C9.91601 7.04881 9.41086 7 8.97332 7C8.40314 7 8.11805 7 7.83495 7.12931C7.47714 7.29275 7.10979 7.75231 7.02917 8.13733C6.96539 8.44196 7.01279 8.65187 7.10759 9.07169C7.51023 10.8548 8.45481 12.6158 9.91948 14.0805C11.3842 15.5452 13.1452 16.4898 14.9283 16.8924C15.3481 16.9872 15.558 17.0346 15.8627 16.9708C16.2477 16.8902 16.7072 16.5229 16.8707 16.165C17 15.8819 17 15.5969 17 15.0267C17 14.5891 16.9512 14.084 16.4101 13.9992C15.0334 13.7834 14.3451 13.6756 14.1917 13.6845C13.5847 13.7201 13.1603 14.1738 12.7044 14.5409L11.6227 15.4118"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                </svg>
                <p className="font-['Helvetica_Neue:Regular',sans-serif] text-[13px] text-[#075e54]">
                  Ligar via WhatsApp
                </p>
              </button>
              <div className="mx-[8px] my-[4px] h-px bg-[#f5f5f5]" />
              <button
                type="button"
                onClick={() => {
                  setDrawerRemoveConfirm({ guide: g });
                  setDrawerMemberMenu(null);
                  setDrawerMenuPos(null);
                }}
                className="flex w-full cursor-pointer items-center gap-[8px] px-[12px] py-[8px] transition-colors hover:bg-[#fef3f2]"
              >
                <svg
                  className="size-[16px] shrink-0 text-[#d92d20]"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <p className="font-['Helvetica_Neue:Regular',sans-serif] text-[13px] text-[#d92d20]">
                  Remover da saída
                </p>
              </button>
            </div>,
            document.body
          );
        })()}

      {drawerConflictConfirm && (
        <GuideConflictConfirmModal
          guide={drawerConflictConfirm}
          onCancel={() => setDrawerConflictConfirm(null)}
          onConfirm={() => {
            addDrawerGuide(drawerConflictConfirm);
            setDrawerToast(`Solicitação enviada para ${drawerConflictConfirm}`);
            setDrawerConflictConfirm(null);
          }}
        />
      )}

      {drawerRemoveConfirm && (
        <GuideRemoveConfirmModal
          guide={drawerRemoveConfirm.guide}
          all={drawerRemoveConfirm.all}
          onCancel={() => setDrawerRemoveConfirm(null)}
          onConfirm={() => {
            if (drawerRemoveConfirm.all) {
              setLocalEquipe([]);
              setDrawerInsurance({});
            } else if (drawerRemoveConfirm.guide) {
              const guide = drawerRemoveConfirm.guide;
              setLocalEquipe((prev) => prev.filter((item) => item !== guide));
              setDrawerInsurance((prev) => {
                const next = { ...prev };
                delete next[guide];
                return next;
              });
            }
            setDrawerRemoveConfirm(null);
          }}
        />
      )}
      {drawerToast && <SuccessToast message={drawerToast} onClose={() => setDrawerToast(null)} />}
    </div>
  );
}
