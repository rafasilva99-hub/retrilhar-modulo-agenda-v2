import { useState } from "react";
import { PencilEdit02Icon, Search01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { AppPage } from "@/components/layout/app-page";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

/* ------------------------------------------------------------------ */
/*  Capacity slider (dual-thumb range)                                 */
/* ------------------------------------------------------------------ */

function CapacitySlider({
  min,
  max,
  onMinChange,
  onMaxChange,
}: {
  min: number;
  max: number;
  onMinChange: (v: number) => void;
  onMaxChange: (v: number) => void;
}) {
  const minPercent = (min / 200) * 100;
  const maxPercent = (max / 200) * 100;

  return (
    <div className="flex flex-col gap-2">
      <div className="relative h-2 w-full">
        <div className="bg-input absolute inset-0 rounded-full" />
        <div
          className="bg-primary absolute top-0 bottom-0 rounded-full"
          style={{ left: `${minPercent}%`, right: `${100 - maxPercent}%` }}
        />
        <input
          type="range"
          min={0}
          max={200}
          value={min}
          onChange={(e) => {
            const val = parseInt(e.target.value, 10);
            if (val <= max) onMinChange(val);
          }}
          className="[&::-webkit-slider-thumb]:border-primary pointer-events-none absolute inset-0 w-full appearance-none bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-sm"
        />
        <input
          type="range"
          min={0}
          max={200}
          value={max}
          onChange={(e) => {
            const val = parseInt(e.target.value, 10);
            if (val >= min) onMaxChange(val);
          }}
          className="[&::-webkit-slider-thumb]:border-primary pointer-events-none absolute inset-0 w-full appearance-none bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-sm"
        />
      </div>
      <div className="text-muted-foreground flex justify-between text-xs">
        <span>0</span>
        <span>200</span>
      </div>
    </div>
  );
}

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
  });

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  return (
    <AppPage
      title="Nova Atividade"
      onBack={onBack}
      actions={
        <>
          <Button variant="outline" onClick={onBack}>
            Descartar
          </Button>
          <Button>Salvar</Button>
        </>
      }
    >
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_340px]">
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
                  placeholder="Insira o título do evento"
                  value={form.titulo}
                  onChange={(e) => update("titulo", e.target.value)}
                />
              </FieldRow>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FieldRow label="Local da atividade">
                  <Select value={form.local} onValueChange={(v) => update("local", v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o local" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sede">Sede principal</SelectItem>
                      <SelectItem value="campo">Campo</SelectItem>
                      <SelectItem value="online">Online</SelectItem>
                    </SelectContent>
                  </Select>
                </FieldRow>
                <FieldRow
                  label="Produto vinculado (opcional)"
                  hint="Ao selecionar um item, sua capacidade (mín. / máx.) é atribuída na atividade."
                >
                  <Select value={form.produto} onValueChange={(v) => update("produto", v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um produto" />
                    </SelectTrigger>
                    <SelectContent>
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
                    placeholder="dd/mm/aaaa"
                    value={form.dataInicio}
                    onChange={(e) => update("dataInicio", e.target.value)}
                  />
                </FieldRow>
                <FieldRow label="Horário de início">
                  <Input
                    placeholder="00:00"
                    value={form.horarioInicio}
                    onChange={(e) => update("horarioInicio", e.target.value)}
                  />
                </FieldRow>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FieldRow label="Data de término">
                  <Input
                    placeholder="dd/mm/aaaa"
                    value={form.dataTermino}
                    onChange={(e) => update("dataTermino", e.target.value)}
                  />
                </FieldRow>
                <FieldRow label="Horário de término">
                  <Input
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
              <CapacitySlider
                min={form.capacidadeMin}
                max={form.capacidadeMax}
                onMinChange={(v) => update("capacidadeMin", v)}
                onMaxChange={(v) => update("capacidadeMax", v)}
              />
              <div className="grid grid-cols-2 gap-4">
                <FieldRow label="Capacidade mínima">
                  <Input
                    type="number"
                    value={form.capacidadeMin}
                    onChange={(e) => {
                      const val = parseInt(e.target.value, 10);
                      if (!isNaN(val) && val >= 0 && val <= 200) update("capacidadeMin", val);
                    }}
                    min={0}
                    max={200}
                  />
                </FieldRow>
                <FieldRow label="Capacidade máxima">
                  <Input
                    type="number"
                    value={form.capacidadeMax}
                    onChange={(e) => {
                      const val = parseInt(e.target.value, 10);
                      if (!isNaN(val) && val >= 0 && val <= 200) update("capacidadeMax", val);
                    }}
                    min={0}
                    max={200}
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
              <CardAction>
                <Button variant="ghost" size="icon-xs">
                  <HugeiconsIcon icon={PencilEdit02Icon} size={14} />
                </Button>
              </CardAction>
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
              <CardAction>
                <Button variant="ghost" size="icon-xs">
                  <HugeiconsIcon icon={PencilEdit02Icon} size={14} />
                </Button>
              </CardAction>
            </CardHeader>
            <CardContent>
              <Input
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
              <CardAction>
                <Button variant="ghost" size="icon-xs">
                  <HugeiconsIcon icon={PencilEdit02Icon} size={14} />
                </Button>
              </CardAction>
            </CardHeader>
            <CardContent>
              <Select value={form.grupoClientes} onValueChange={(v) => update("grupoClientes", v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um ou mais grupos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="regular">Clientes Regulares</SelectItem>
                  <SelectItem value="vip">VIP</SelectItem>
                  <SelectItem value="escolas">Escolas</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Equipe */}
          <Card size="sm" className={cardOverride}>
            <CardHeader>
              <CardTitle>Equipe</CardTitle>
              <CardAction>
                <Button variant="ghost" size="icon-xs">
                  <HugeiconsIcon icon={PencilEdit02Icon} size={14} />
                </Button>
              </CardAction>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <div className="relative">
                <HugeiconsIcon
                  icon={Search01Icon}
                  size={16}
                  className="text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2"
                />
                <Input className="pl-9" placeholder="Buscar colaboradores" />
              </div>
              <p className="text-muted-foreground text-xs">
                Escale os colaboradores responsáveis por conduzir a atividade.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppPage>
  );
}
