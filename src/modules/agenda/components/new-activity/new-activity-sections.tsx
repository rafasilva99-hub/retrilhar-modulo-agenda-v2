import type { ReactNode } from "react";

function SectionCard({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-w-0 flex-col gap-[20px] rounded-[12px] bg-white p-[16px] sm:p-[24px]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[12px] border border-solid border-[#f5f5f5]"
      />
      {children}
    </div>
  );
}

function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <p className="font-['Helvetica_Neue:Medium',sans-serif] text-[12px] leading-[normal] tracking-[0.5px] text-[#414651] uppercase">
      {children}
    </p>
  );
}

function FieldGroup({ children, label }: { children: ReactNode; label: string }) {
  return (
    <div className="flex min-w-0 flex-1 flex-col gap-[6px]">
      <label className="font-['Helvetica_Neue:Regular',sans-serif] text-[14px] leading-[20px] text-[#414651]">
        {label}
      </label>
      {children}
    </div>
  );
}

function NewActivityIdentificationSection({
  localField,
  productField,
  titleField,
}: {
  localField: ReactNode;
  productField: ReactNode;
  titleField: ReactNode;
}) {
  return (
    <SectionCard>
      <SectionTitle>Insira as informações de identificação da atividade</SectionTitle>
      <FieldGroup label="Título da atividade">{titleField}</FieldGroup>
      <div className="flex flex-col gap-[16px] sm:flex-row">
        <FieldGroup label="Local da atividade">{localField}</FieldGroup>
        <FieldGroup label="Produto / Atividade a ser vinculada (opcional)">
          {productField}
          <p className="font-['Helvetica_Neue:Regular',sans-serif] text-[12px] leading-[16px] text-[#9ca3af]">
            Ao selecionar um item, sua capacidade (mín. / máx.) é atribuída na atividade.
          </p>
        </FieldGroup>
      </div>
    </SectionCard>
  );
}

function NewActivityCapacitySection({
  maxField,
  minField,
  slider,
}: {
  maxField: ReactNode;
  minField: ReactNode;
  slider: ReactNode;
}) {
  return (
    <SectionCard>
      <SectionTitle>Capacidade da atividade</SectionTitle>
      {slider}
      <div className="flex flex-col gap-[16px] sm:flex-row">
        <FieldGroup label="Capacidade mínima">{minField}</FieldGroup>
        <FieldGroup label="Capacidade máxima">{maxField}</FieldGroup>
      </div>
    </SectionCard>
  );
}

function NewActivityVisibilitySection({
  clientGroupField,
  groupLinkField,
  visibilityField,
}: {
  clientGroupField: ReactNode;
  groupLinkField: ReactNode;
  visibilityField: ReactNode;
}) {
  return (
    <SectionCard>
      <SectionTitle>Insira as informações de visibilidade da atividade</SectionTitle>
      <FieldGroup label="Visibilidade da atividade">{visibilityField}</FieldGroup>
      <FieldGroup label="Link de Grupo">{groupLinkField}</FieldGroup>
      <FieldGroup label="Grupo de clientes (opcional)">{clientGroupField}</FieldGroup>
    </SectionCard>
  );
}

function NewActivityToggleCard({
  description,
  title,
  toggle,
}: {
  description: string;
  title: string;
  toggle: ReactNode;
}) {
  return (
    <div className="relative flex min-w-0 items-center justify-between gap-[16px] rounded-[12px] bg-white p-[16px] sm:p-[24px]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[12px] border border-solid border-[#f5f5f5]"
      />
      <div className="flex min-w-0 flex-col gap-[4px]">
        <SectionTitle>{title}</SectionTitle>
        <p className="font-['Helvetica_Neue:Regular',sans-serif] text-[13px] leading-[18px] text-[#717680]">
          {description}
        </p>
      </div>
      {toggle}
    </div>
  );
}

function NewActivityScheduleSection({
  endDateField,
  endTimeField,
  multipleTimesToggle,
  repeatToggle,
  startDateField,
  startTimeField,
}: {
  endDateField: ReactNode;
  endTimeField: ReactNode;
  multipleTimesToggle: ReactNode;
  repeatToggle: ReactNode;
  startDateField: ReactNode;
  startTimeField: ReactNode;
}) {
  return (
    <>
      <SectionCard>
        <SectionTitle>Insira as informações de data e hora da atividade</SectionTitle>
        <div className="flex flex-col gap-[16px] sm:flex-row">
          <FieldGroup label="Data de início">{startDateField}</FieldGroup>
          <FieldGroup label="Horário de início">{startTimeField}</FieldGroup>
        </div>
        <div className="flex flex-col gap-[16px] sm:flex-row">
          <FieldGroup label="Data de término">{endDateField}</FieldGroup>
          <FieldGroup label="Horário de término">{endTimeField}</FieldGroup>
        </div>
      </SectionCard>
      <NewActivityToggleCard
        title="Múltiplos horários no mesmo dia"
        description="Crie várias saídas do mesmo evento no dia sem precisar duplicar a atividade."
        toggle={multipleTimesToggle}
      />
      <NewActivityToggleCard
        title="Essa atividade se repete?"
        description="Configure uma programação recorrente para não precisar recriar a atividade toda vez."
        toggle={repeatToggle}
      />
    </>
  );
}

function NewActivityFormActions({
  currentStep,
  onBack,
  onCancel,
  onNext,
}: {
  currentStep: number;
  onBack: () => void;
  onCancel: () => void;
  onNext: () => void;
}) {
  return (
    <div className="flex flex-wrap items-center justify-end gap-[12px] border-t border-[#e5e7eb] bg-white px-[16px] py-[16px] sm:gap-[16px] sm:px-[24px]">
      {currentStep === 1 ? (
        <button
          type="button"
          onClick={onCancel}
          className="flex min-w-0 items-center justify-center rounded-[8px] border border-[#FEE4E2] bg-white px-[16px] py-[10px] font-['Helvetica_Neue:Medium',sans-serif] text-[14px] leading-[20px] text-[#F04438] transition-colors hover:bg-[#FEF3F2] sm:px-[20px] sm:text-[16px]"
        >
          Cancelar
        </button>
      ) : (
        <button
          type="button"
          onClick={onBack}
          className="px-[16px] py-[10px] font-['Helvetica_Neue:Medium',sans-serif] text-[14px] leading-[20px] text-[#0b5ed7] transition-colors hover:text-[#0a4fb8] sm:px-[20px] sm:text-[16px]"
        >
          Voltar ao passo anterior
        </button>
      )}
      <button
        type="button"
        onClick={onNext}
        className="flex min-w-0 items-center justify-center rounded-[8px] bg-[#0b5ed7] px-[16px] py-[10px] font-['Helvetica_Neue:Medium',sans-serif] text-[14px] leading-[20px] text-white transition-colors hover:bg-[#0a4fb8] sm:px-[20px] sm:text-[16px]"
      >
        Ir para o próximo passo
      </button>
    </div>
  );
}

export {
  FieldGroup,
  NewActivityCapacitySection,
  NewActivityFormActions,
  NewActivityIdentificationSection,
  NewActivityScheduleSection,
  NewActivityVisibilitySection,
  SectionTitle,
};
