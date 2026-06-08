import { useState } from "react";
import { ArrowLeft02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import {
  NewActivityCapacitySection,
  NewActivityFormActions,
  NewActivityIdentificationSection,
  NewActivityScheduleSection,
  NewActivityVisibilitySection,
} from "./new-activity/new-activity-sections";

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
}

const STEPS = [
  {
    number: 1,
    title: "Dados da atividade e visibilidade",
    description:
      "Informe o título, local, produto vinculado, capacidade e quem pode visualizar a atividade.",
  },
  {
    number: 2,
    title: "Datas e horários da atividade",
    description: "Defina quando a atividade acontece e se ela se repete em outros dias.",
  },
  {
    number: 3,
    title: "Atribuição dos guias para a atividade",
    description: "Escale os colaboradores responsáveis por conduzir a atividade.",
  },
];

function StepIndicator({
  step,
  isActive,
  isCompleted,
}: {
  step: (typeof STEPS)[number];
  isActive: boolean;
  isCompleted: boolean;
}) {
  return (
    <div className="flex flex-col gap-[4px]">
      <div className="flex items-center gap-[12px]">
        {isCompleted ? (
          <div className="flex size-[24px] shrink-0 items-center justify-center rounded-full bg-[#079455]">
            <svg
              className="size-[14px] text-white"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2.5"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </div>
        ) : (
          <div className="size-[24px] shrink-0 rounded-full border border-[#E9EAEB] bg-[#FAFAFA]" />
        )}
        <p
          className={`font-['Helvetica_Neue:Medium',sans-serif] text-[16px] leading-[20px] ${
            isActive ? "text-[#0b5ed7]" : "text-[#181d27]"
          }`}
        >
          {step.title}
        </p>
      </div>
      <p className="ml-[36px] font-['Helvetica_Neue:Regular',sans-serif] text-[14px] leading-[17px] text-[#414651]">
        {step.description}
      </p>
    </div>
  );
}

function StepperSidebar({ currentStep }: { currentStep: number }) {
  return (
    <div className="hidden w-[460px] shrink-0 flex-col gap-[32px] border-r border-[#f5f5f5] bg-white px-[32px] py-[48px] lg:flex">
      {STEPS.map((step) => (
        <StepIndicator
          key={step.number}
          step={step}
          isActive={currentStep === step.number}
          isCompleted={currentStep > step.number}
        />
      ))}
    </div>
  );
}

function TextInput({
  placeholder,
  value,
  onChange,
  icon,
}: {
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  icon?: React.ReactNode;
}) {
  return (
    <div className="relative">
      {icon && (
        <div className="absolute top-1/2 left-[14px] flex -translate-y-1/2 items-center justify-center text-[#a1a1aa]">
          {icon}
        </div>
      )}
      <input
        type="text"
        className={`w-full rounded-[8px] border border-[#d5d7da] ${icon ? "pr-[14px] pl-[42px]" : "px-[14px]"} py-[10px] font-['Helvetica_Neue:Regular',sans-serif] text-[14px] leading-[20px] text-[#0f172b] transition-colors placeholder:text-[#a1a1aa] focus:border-[#0b5ed7] focus:ring-2 focus:ring-[#0b5ed7]/20 focus:outline-none`}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

function SelectInput({
  placeholder,
  value,
  onChange,
}: {
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="relative">
      <select
        className={`w-full appearance-none rounded-[8px] border border-[#d5d7da] bg-white px-[14px] py-[10px] pr-[40px] font-['Helvetica_Neue:Regular',sans-serif] text-[14px] leading-[20px] transition-colors focus:border-[#0b5ed7] focus:ring-2 focus:ring-[#0b5ed7]/20 focus:outline-none ${value ? "text-[#0f172b]" : "text-[#a1a1aa]"}`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="" disabled>
          {placeholder}
        </option>
      </select>
      <div className="absolute right-[14px] top-1/2 -translate-y-1/2 pointer-events-none">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path d="M18 9C18 9 13.5811 15 12 15C10.4189 15 6 9 6 9" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  );
}

function NumberInput({
  value,
  onChange,
  min = 0,
  max = 200,
}: {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
}) {
  return (
    <input
      type="number"
      className="w-full rounded-[8px] border border-[#d5d7da] px-[14px] py-[10px] font-['Helvetica_Neue:Regular',sans-serif] text-[14px] leading-[20px] text-[#0f172b] transition-colors placeholder:text-[#a1a1aa] focus:border-[#0b5ed7] focus:ring-2 focus:ring-[#0b5ed7]/20 focus:outline-none"
      value={value}
      onChange={(e) => {
        const val = parseInt(e.target.value, 10);
        if (!isNaN(val) && val >= min && val <= max) onChange(val);
      }}
      min={min}
      max={max}
    />
  );
}

function WhatsAppIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path
        d="M15.1875 2.8125C13.5 1.125 11.3438 0.1875 9.0469 0.1875C4.3125 0.1875 0.46875 4.03125 0.46875 8.76562C0.46875 10.2656 0.84375 11.7656 1.59375 13.0781L0.375 17.8125L5.25 16.5938C6.5625 17.2969 7.78125 17.625 9.04688 17.625C13.7812 17.625 17.625 13.7812 17.625 9.04688C17.625 6.75 16.875 4.5 15.1875 2.8125ZM9.04688 16.1719C7.92188 16.1719 6.79688 15.8438 5.8125 15.1875L5.57812 15.0469L2.625 15.8438L3.42188 12.9375L3.23438 12.6562C1.3125 9.51562 2.25 5.4375 5.39062 3.5625C8.53125 1.6875 12.6094 2.625 14.4844 5.76562C16.3594 8.90625 15.375 12.9844 12.2812 14.8594C11.2969 15.6094 10.1719 16.1719 9.04688 16.1719ZM13.2656 10.7344L12.75 10.5C12.75 10.5 12.0469 10.1719 11.625 9.98438C11.5781 9.98438 11.5312 9.9375 11.4844 9.9375C11.3438 9.9375 11.25 9.98438 11.1562 10.0312C11.1562 10.0312 11.1094 10.0781 10.5 10.7812C10.4531 10.875 10.3594 10.9219 10.2656 10.9219H10.2188C10.1719 10.9219 10.0781 10.875 10.0312 10.8281L9.79688 10.7344C9.14062 10.4531 8.57812 10.0781 8.10938 9.5625C7.96875 9.42188 7.78125 9.28125 7.64062 9.09375C7.3125 8.71875 7.03125 8.29688 6.84375 7.82812L6.79688 7.73438C6.75 7.6875 6.75 7.64062 6.70312 7.54688C6.70312 7.45312 6.70312 7.35938 6.75 7.3125C6.75 7.3125 6.9375 7.07812 7.07812 6.9375C7.17188 6.84375 7.21875 6.70312 7.3125 6.60938C7.40625 6.46875 7.40625 6.28125 7.35938 6.14062C7.3125 5.90625 6.70312 4.5 6.5625 4.21875C6.46875 4.07812 6.375 4.03125 6.23438 3.98438C6.1875 3.98438 6.09375 3.9375 6 3.9375C5.90625 3.9375 5.76562 3.9375 5.67188 3.9375C5.57812 3.9375 5.4375 3.98438 5.29688 4.03125C5.20312 4.125 4.6875 4.59375 4.6875 5.67188C4.6875 6.75 5.34375 7.78125 5.4375 7.92188C5.48438 8.01562 6.84375 10.2656 8.90625 11.3438C9.32812 11.5312 9.65625 11.6719 9.98438 11.8125C10.4531 11.9531 10.875 11.9531 11.2031 11.9062C11.5781 11.8125 12.75 11.3906 13.0312 10.9219C13.2656 10.4531 13.2656 10.0781 13.2188 10.0312C13.1719 9.98438 13.0781 9.9375 12.9375 9.84375L13.2656 10.7344Z"
        fill="#a1a1aa"
      />
    </svg>
  );
}

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
    <div className="flex flex-col gap-[16px]">
      <div className="relative h-[8px] w-full">
        <div className="absolute inset-0 rounded-full bg-[#e5e7eb]" />
        <div
          className="absolute top-0 bottom-0 rounded-full bg-[#0b5ed7]"
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
          className="pointer-events-none absolute inset-0 w-full appearance-none bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-[20px] [&::-webkit-slider-thumb]:w-[20px] [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[#0b5ed7] [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-[0_1px_3px_rgba(0,0,0,0.15)]"
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
          className="pointer-events-none absolute inset-0 w-full appearance-none bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-[20px] [&::-webkit-slider-thumb]:w-[20px] [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[#0b5ed7] [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-[0_1px_3px_rgba(0,0,0,0.15)]"
        />
      </div>
      <div className="flex justify-between">
        <span className="font-['Helvetica_Neue:Regular',sans-serif] text-[12px] text-[#9ca3af]">
          0
        </span>
        <span className="font-['Helvetica_Neue:Regular',sans-serif] text-[12px] text-[#9ca3af]">
          200
        </span>
      </div>
    </div>
  );
}

function VisibilityToggle({
  value,
  onChange,
}: {
  value: "publica" | "interna";
  onChange: (v: "publica" | "interna") => void;
}) {
  return (
    <div className="flex gap-[4px] rounded-[8px] bg-[#f3f4f6] p-[4px]">
      <button
        type="button"
        className={`flex-1 rounded-[6px] px-[16px] py-[8px] font-['Helvetica_Neue:Medium',sans-serif] text-[14px] leading-[20px] transition-all ${
          value === "publica"
            ? "bg-[#0b5ed7] text-white shadow-sm"
            : "text-[#6b7280] hover:text-[#414651]"
        }`}
        onClick={() => onChange("publica")}
      >
        Pública
      </button>
      <button
        type="button"
        className={`flex-1 rounded-[6px] px-[16px] py-[8px] font-['Helvetica_Neue:Medium',sans-serif] text-[14px] leading-[20px] transition-all ${
          value === "interna"
            ? "bg-[#0b5ed7] text-white shadow-sm"
            : "text-[#6b7280] hover:text-[#414651]"
        }`}
        onClick={() => onChange("interna")}
      >
        Interna
      </button>
    </div>
  );
}

function ToggleSwitch({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-[24px] w-[44px] shrink-0 cursor-pointer rounded-full transition-colors duration-200 ${checked ? "bg-[#0b5ed7]" : "bg-[#e5e7eb]"}`}
    >
      <span
        className={`pointer-events-none mt-[2px] inline-block size-[20px] transform rounded-full bg-white shadow-sm transition-transform duration-200 ${checked ? "ml-[2px] translate-x-[22px]" : "translate-x-[2px]"}`}
      />
    </button>
  );
}

function DateInput({
  placeholder,
  value,
  onChange,
}: {
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="relative">
      <input
        type="text"
        className="w-full rounded-[8px] border border-[#d5d7da] px-[14px] py-[10px] pr-[40px] font-['Helvetica_Neue:Regular',sans-serif] text-[14px] leading-[20px] text-[#0f172b] transition-colors placeholder:text-[#a1a1aa] focus:border-[#0b5ed7] focus:ring-2 focus:ring-[#0b5ed7]/20 focus:outline-none"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <div className="pointer-events-none absolute top-1/2 right-[14px] -translate-y-1/2">
        <svg
          className="size-[16px] text-[#9ca3af]"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <path d="M16 2v4M8 2v4M3 10h18" />
        </svg>
      </div>
    </div>
  );
}

function TimeInput({
  placeholder,
  value,
  onChange,
}: {
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="relative">
      <input
        type="text"
        className="w-full rounded-[8px] border border-[#d5d7da] px-[14px] py-[10px] pr-[40px] font-['Helvetica_Neue:Regular',sans-serif] text-[14px] leading-[20px] text-[#0f172b] transition-colors placeholder:text-[#a1a1aa] focus:border-[#0b5ed7] focus:ring-2 focus:ring-[#0b5ed7]/20 focus:outline-none"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <div className="pointer-events-none absolute top-1/2 right-[14px] -translate-y-1/2">
        <svg
          className="size-[16px] text-[#9ca3af]"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M12 6v6l4 2" />
        </svg>
      </div>
    </div>
  );
}

export function AgendaNovaAtividade({ onBack }: AgendaNovaAtividadeProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [multiplosHorarios, setMultiplosHorarios] = useState(false);
  const [atividadeRepete, setAtividadeRepete] = useState(false);
  const [dataInicio, setDataInicio] = useState("");
  const [horarioInicio, setHorarioInicio] = useState("");
  const [dataTermino, setDataTermino] = useState("");
  const [horarioTermino, setHorarioTermino] = useState("");
  const [form, setForm] = useState<FormState>({
    titulo: "",
    local: "",
    produto: "",
    capacidadeMin: 0,
    capacidadeMax: 200,
    visibilidade: "publica",
    linkGrupo: "",
    grupoClientes: "",
  });

  const updateField = <K extends keyof FormState>(field: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="flex h-screen min-w-0 flex-col overflow-x-hidden bg-[#f8fafe]">
      <div className="z-10 flex min-w-0 shrink-0 items-center gap-[16px] border-b border-[#e5e7eb] bg-white px-[16px] py-[16px] sm:px-[24px]">
        <button
          type="button"
          onClick={onBack}
          className="flex size-[36px] cursor-pointer items-center justify-center rounded-[8px] transition-colors hover:bg-[#f3f4f6]"
        >
          <HugeiconsIcon icon={ArrowLeft02Icon} size={20} color="#414651" />
        </button>
        <div className="h-[24px] w-[1px] bg-[#e5e7eb]" />
        <div className="flex min-w-0 flex-col gap-[2px]">
          <h1 className="font-['Helvetica_Neue:Medium',sans-serif] text-[20px] leading-[28px] text-[#0f172b]">
            Nova Atividade
          </h1>
          <p className="font-['Helvetica_Neue:Regular',sans-serif] text-[14px] leading-[20px] text-[#414651]">
            Preencha os dados para criar uma nova atividade na sua agenda.
          </p>
        </div>
      </div>

      <div className="flex min-h-0 min-w-0 flex-1">
        <StepperSidebar currentStep={currentStep} />

        <div className="min-w-0 flex-1 overflow-y-auto px-[16px] py-[24px] sm:px-[24px] lg:px-[32px]">
          <div className="flex max-w-[916px] min-w-0 flex-col gap-[24px]">
            {currentStep === 1 && (
              <>
                <NewActivityIdentificationSection
                  titleField={
                    <TextInput
                      placeholder="Insira o título do evento"
                      value={form.titulo}
                      onChange={(v) => updateField("titulo", v)}
                    />
                  }
                  localField={
                    <SelectInput
                      placeholder="Selecione o local"
                      value={form.local}
                      onChange={(v) => updateField("local", v)}
                    />
                  }
                  productField={
                    <SelectInput
                      placeholder="Selecione um produto"
                      value={form.produto}
                      onChange={(v) => updateField("produto", v)}
                    />
                  }
                />
                <NewActivityCapacitySection
                  slider={
                    <CapacitySlider
                      min={form.capacidadeMin}
                      max={form.capacidadeMax}
                      onMinChange={(v) => updateField("capacidadeMin", v)}
                      onMaxChange={(v) => updateField("capacidadeMax", v)}
                    />
                  }
                  minField={
                    <NumberInput
                      value={form.capacidadeMin}
                      onChange={(v) => updateField("capacidadeMin", v)}
                    />
                  }
                  maxField={
                    <NumberInput
                      value={form.capacidadeMax}
                      onChange={(v) => updateField("capacidadeMax", v)}
                    />
                  }
                />
                <NewActivityVisibilitySection
                  visibilityField={
                    <VisibilityToggle
                      value={form.visibilidade}
                      onChange={(v) => updateField("visibilidade", v)}
                    />
                  }
                  groupLinkField={
                    <TextInput
                      placeholder="Insira o link do WhatsApp"
                      value={form.linkGrupo}
                      onChange={(v) => updateField("linkGrupo", v)}
                      icon={<WhatsAppIcon />}
                    />
                  }
                  clientGroupField={
                    <SelectInput
                      placeholder="Selecione um ou mais grupos"
                      value={form.grupoClientes}
                      onChange={(v) => updateField("grupoClientes", v)}
                    />
                  }
                />
              </>
            )}

            {currentStep === 2 && (
              <NewActivityScheduleSection
                startDateField={
                  <DateInput placeholder="dd/mm/aaaa" value={dataInicio} onChange={setDataInicio} />
                }
                startTimeField={
                  <TimeInput
                    placeholder="00:00"
                    value={horarioInicio}
                    onChange={setHorarioInicio}
                  />
                }
                endDateField={
                  <DateInput
                    placeholder="dd/mm/aaaa"
                    value={dataTermino}
                    onChange={setDataTermino}
                  />
                }
                endTimeField={
                  <TimeInput
                    placeholder="00:00"
                    value={horarioTermino}
                    onChange={setHorarioTermino}
                  />
                }
                multipleTimesToggle={
                  <ToggleSwitch checked={multiplosHorarios} onChange={setMultiplosHorarios} />
                }
                repeatToggle={
                  <ToggleSwitch checked={atividadeRepete} onChange={setAtividadeRepete} />
                }
              />
            )}
          </div>
        </div>
      </div>

      <NewActivityFormActions
        currentStep={currentStep}
        onCancel={onBack}
        onBack={() => setCurrentStep((s) => Math.max(1, s - 1))}
        onNext={() => setCurrentStep((s) => Math.min(3, s + 1))}
      />
    </div>
  );
}
