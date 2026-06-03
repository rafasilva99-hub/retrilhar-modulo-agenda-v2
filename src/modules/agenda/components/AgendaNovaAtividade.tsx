import { useState } from "react";
import { ArrowLeft02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

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
    description:
      "Defina quando a atividade acontece e se ela se repete em outros dias.",
  },
  {
    number: 3,
    title: "Atribuição dos guias para a atividade",
    description:
      "Escale os colaboradores responsáveis por conduzir a atividade.",
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
    <div className="flex gap-[16px] items-start">
      {/* Step circle */}
      <div className="flex flex-col items-center pt-[2px]">
        <div
          className={`flex items-center justify-center rounded-full size-[32px] shrink-0 ${
            isActive
              ? "bg-[#0b5ed7]"
              : isCompleted
                ? "bg-[#0b5ed7]"
                : "bg-[#e5e7eb]"
          }`}
        >
          <span
            className={`font-['Helvetica_Neue:Medium',sans-serif] text-[14px] leading-[normal] ${
              isActive || isCompleted ? "text-white" : "text-[#9ca3af]"
            }`}
          >
            {step.number}
          </span>
        </div>
      </div>
      {/* Step text */}
      <div className="flex flex-col gap-[4px] flex-1 min-w-0">
        <p
          className={`font-['Helvetica_Neue:Medium',sans-serif] text-[14px] leading-[20px] ${
            isActive ? "text-[#0b5ed7]" : "text-[#9ca3af]"
          }`}
        >
          {step.title}
        </p>
        <p
          className={`font-['Helvetica_Neue:Regular',sans-serif] text-[13px] leading-[18px] ${
            isActive ? "text-[#414651]" : "text-[#9ca3af]"
          }`}
        >
          {step.description}
        </p>
      </div>
    </div>
  );
}

function StepperSidebar({ currentStep }: { currentStep: number }) {
  return (
    <div className="bg-white rounded-[12px] w-[460px] shrink-0 p-[48px_32px] flex flex-col gap-[32px] relative">
      <div
        aria-hidden="true"
        className="absolute border border-[#f5f5f5] border-solid inset-0 pointer-events-none rounded-[12px]"
      />
      {STEPS.map((step, index) => (
        <div key={step.number} className="flex flex-col gap-[32px]">
          <StepIndicator
            step={step}
            isActive={currentStep === step.number}
            isCompleted={currentStep > step.number}
          />
          {index < STEPS.length - 1 && (
            <div className="ml-[15px] w-[2px] h-[24px] bg-[#e5e7eb] rounded-full" />
          )}
        </div>
      ))}
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-['Helvetica_Neue:Medium',sans-serif] text-[12px] leading-[normal] text-[#414651] uppercase tracking-[0.5px]">
      {children}
    </p>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="font-['Helvetica_Neue:Regular',sans-serif] text-[14px] leading-[20px] text-[#414651]">
      {children}
    </label>
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
        <div className="absolute left-[14px] top-1/2 -translate-y-1/2 flex items-center justify-center text-[#a1a1aa]">
          {icon}
        </div>
      )}
      <input
        type="text"
        className={`w-full border border-[#d5d7da] rounded-[8px] ${icon ? "pl-[42px] pr-[14px]" : "px-[14px]"} py-[10px] text-[14px] font-['Helvetica_Neue:Regular',sans-serif] leading-[20px] text-[#0f172b] placeholder:text-[#a1a1aa] focus:outline-none focus:ring-2 focus:ring-[#0b5ed7]/20 focus:border-[#0b5ed7] transition-colors`}
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
        className="w-full appearance-none border border-[#d5d7da] rounded-[8px] px-[14px] py-[10px] text-[14px] font-['Helvetica_Neue:Regular',sans-serif] leading-[20px] text-[#0f172b] focus:outline-none focus:ring-2 focus:ring-[#0b5ed7]/20 focus:border-[#0b5ed7] transition-colors bg-white pr-[40px]"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="" disabled className="text-[#a1a1aa]">
          {placeholder}
        </option>
      </select>
      {/* Chevron */}
      <div className="absolute right-[14px] top-1/2 -translate-y-1/2 pointer-events-none">
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
        >
          <path
            d="M4 6L8 10L12 6"
            stroke="#9ca3af"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      {!value && (
        <div className="absolute left-[14px] top-1/2 -translate-y-1/2 pointer-events-none font-['Helvetica_Neue:Regular',sans-serif] text-[14px] text-[#a1a1aa]">
          {placeholder}
        </div>
      )}
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
      className="w-full border border-[#d5d7da] rounded-[8px] px-[14px] py-[10px] text-[14px] font-['Helvetica_Neue:Regular',sans-serif] leading-[20px] text-[#0f172b] placeholder:text-[#a1a1aa] focus:outline-none focus:ring-2 focus:ring-[#0b5ed7]/20 focus:border-[#0b5ed7] transition-colors"
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
      {/* Slider track */}
      <div className="relative h-[8px] w-full">
        <div className="absolute inset-0 bg-[#e5e7eb] rounded-full" />
        <div
          className="absolute top-0 bottom-0 bg-[#0b5ed7] rounded-full"
          style={{ left: `${minPercent}%`, right: `${100 - maxPercent}%` }}
        />
        {/* Min thumb */}
        <input
          type="range"
          min={0}
          max={200}
          value={min}
          onChange={(e) => {
            const val = parseInt(e.target.value, 10);
            if (val <= max) onMinChange(val);
          }}
          className="absolute inset-0 w-full appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-[20px] [&::-webkit-slider-thumb]:h-[20px] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[#0b5ed7] [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-[0_1px_3px_rgba(0,0,0,0.15)]"
        />
        {/* Max thumb */}
        <input
          type="range"
          min={0}
          max={200}
          value={max}
          onChange={(e) => {
            const val = parseInt(e.target.value, 10);
            if (val >= min) onMaxChange(val);
          }}
          className="absolute inset-0 w-full appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-[20px] [&::-webkit-slider-thumb]:h-[20px] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[#0b5ed7] [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-[0_1px_3px_rgba(0,0,0,0.15)]"
        />
      </div>
      {/* Min / Max labels */}
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
    <div className="flex bg-[#f3f4f6] rounded-[8px] p-[4px] gap-[4px]">
      <button
        type="button"
        className={`flex-1 py-[8px] px-[16px] rounded-[6px] font-['Helvetica_Neue:Medium',sans-serif] text-[14px] leading-[20px] transition-all ${
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
        className={`flex-1 py-[8px] px-[16px] rounded-[6px] font-['Helvetica_Neue:Medium',sans-serif] text-[14px] leading-[20px] transition-all ${
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

export function AgendaNovaAtividade({ onBack }: AgendaNovaAtividadeProps) {
  const [currentStep] = useState(1);
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

  const updateField = <K extends keyof FormState>(
    field: K,
    value: FormState[K]
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="flex flex-col h-screen bg-[#f8fafe]">
      {/* Top header bar */}
      <div className="bg-white border-b border-[#e5e7eb] flex items-center gap-[16px] px-[24px] py-[16px] shrink-0 z-10">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center justify-center size-[36px] rounded-[8px] hover:bg-[#f3f4f6] transition-colors cursor-pointer"
        >
          <HugeiconsIcon icon={ArrowLeft02Icon} size={20} color="#414651" />
        </button>
        <div className="w-[1px] h-[24px] bg-[#e5e7eb]" />
        <div className="flex flex-col gap-[2px]">
          <h1 className="font-['Helvetica_Neue:Medium',sans-serif] text-[20px] leading-[28px] text-[#0f172b]">
            Nova Atividade
          </h1>
          <p className="font-['Helvetica_Neue:Regular',sans-serif] text-[14px] leading-[20px] text-[#414651]">
            Preencha os dados para criar uma nova atividade na sua agenda.
          </p>
        </div>
      </div>

      {/* Body: sidebar + content */}
      <div className="flex flex-1 gap-[24px] p-[24px] overflow-y-auto">
        {/* Left stepper sidebar */}
        <StepperSidebar currentStep={currentStep} />

        {/* Right content area */}
        <div className="flex flex-col gap-[24px] flex-1 min-w-0 max-w-[916px]">
          {/* Card 1: Identificacao */}
          <div className="bg-white rounded-[12px] p-[24px] flex flex-col gap-[20px] relative">
            <div
              aria-hidden="true"
              className="absolute border border-[#f5f5f5] border-solid inset-0 pointer-events-none rounded-[12px]"
            />
            <SectionTitle>
              Insira as informações de identificação da atividade
            </SectionTitle>

            <div className="flex flex-col gap-[6px]">
              <FieldLabel>Título da atividade</FieldLabel>
              <TextInput
                placeholder="Insira o título do evento"
                value={form.titulo}
                onChange={(v) => updateField("titulo", v)}
              />
            </div>

            <div className="flex gap-[16px]">
              <div className="flex flex-col gap-[6px] flex-1">
                <FieldLabel>Local da atividade</FieldLabel>
                <SelectInput
                  placeholder="Selecione o local"
                  value={form.local}
                  onChange={(v) => updateField("local", v)}
                />
              </div>
              <div className="flex flex-col gap-[6px] flex-1">
                <FieldLabel>
                  Produto / Atividade a ser vinculada (opcional)
                </FieldLabel>
                <SelectInput
                  placeholder="Selecione um produto"
                  value={form.produto}
                  onChange={(v) => updateField("produto", v)}
                />
                <p className="font-['Helvetica_Neue:Regular',sans-serif] text-[12px] leading-[16px] text-[#9ca3af]">
                  Ao selecionar um item, sua capacidade (mín. / máx.) é
                  atribuída na atividade.
                </p>
              </div>
            </div>
          </div>

          {/* Card 2: Capacidade */}
          <div className="bg-white rounded-[12px] p-[24px] flex flex-col gap-[20px] relative">
            <div
              aria-hidden="true"
              className="absolute border border-[#f5f5f5] border-solid inset-0 pointer-events-none rounded-[12px]"
            />
            <SectionTitle>Capacidade da atividade</SectionTitle>

            <CapacitySlider
              min={form.capacidadeMin}
              max={form.capacidadeMax}
              onMinChange={(v) => updateField("capacidadeMin", v)}
              onMaxChange={(v) => updateField("capacidadeMax", v)}
            />

            <div className="flex gap-[16px]">
              <div className="flex flex-col gap-[6px] flex-1">
                <FieldLabel>Capacidade mínima</FieldLabel>
                <NumberInput
                  value={form.capacidadeMin}
                  onChange={(v) => updateField("capacidadeMin", v)}
                />
              </div>
              <div className="flex flex-col gap-[6px] flex-1">
                <FieldLabel>Capacidade máxima</FieldLabel>
                <NumberInput
                  value={form.capacidadeMax}
                  onChange={(v) => updateField("capacidadeMax", v)}
                />
              </div>
            </div>
          </div>

          {/* Card 3: Visibilidade */}
          <div className="bg-white rounded-[12px] p-[24px] flex flex-col gap-[20px] relative">
            <div
              aria-hidden="true"
              className="absolute border border-[#f5f5f5] border-solid inset-0 pointer-events-none rounded-[12px]"
            />
            <SectionTitle>
              Insira as informações de visibilidade da atividade
            </SectionTitle>

            <div className="flex flex-col gap-[6px]">
              <FieldLabel>Visibilidade da atividade</FieldLabel>
              <VisibilityToggle
                value={form.visibilidade}
                onChange={(v) => updateField("visibilidade", v)}
              />
            </div>

            <div className="flex flex-col gap-[6px]">
              <FieldLabel>Link de Grupo</FieldLabel>
              <TextInput
                placeholder="Insira o link do WhatsApp"
                value={form.linkGrupo}
                onChange={(v) => updateField("linkGrupo", v)}
                icon={<WhatsAppIcon />}
              />
            </div>

            <div className="flex flex-col gap-[6px]">
              <FieldLabel>Grupo de clientes (opcional)</FieldLabel>
              <SelectInput
                placeholder="Selecione um ou mais grupos"
                value={form.grupoClientes}
                onChange={(v) => updateField("grupoClientes", v)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom footer bar */}
      <div className="bg-white border-t border-[#e5e7eb] flex items-center justify-end gap-[12px] px-[24px] py-[16px] shrink-0">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center justify-center px-[20px] py-[10px] rounded-[8px] border border-[#FEE4E2] font-['Helvetica_Neue:Medium',sans-serif] text-[14px] leading-[20px] text-[#F04438] hover:bg-[#FEF3F2] transition-colors cursor-pointer bg-white"
        >
          Cancelar
        </button>
        <button
          type="button"
          className="flex items-center justify-center px-[20px] py-[10px] rounded-[8px] bg-[#0b5ed7] font-['Helvetica_Neue:Medium',sans-serif] text-[14px] leading-[20px] text-white opacity-60 cursor-not-allowed"
          disabled
        >
          Ir para o próximo passo
        </button>
      </div>
    </div>
  );
}
