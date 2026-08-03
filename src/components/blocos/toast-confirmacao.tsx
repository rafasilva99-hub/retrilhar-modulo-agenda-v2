import { toast } from "sonner";

interface ToastConfirmacaoOpcoes {
  readonly titulo: string;
  readonly descricao: string;
}

// Toast de ação concluída do Figma (AFI-04.a1/.c1), no mesmo padrão visual do
// Toast da agenda: cartão branco com faixa lateral verde, selo de verificação
// e ação "Entendido". Renderizado pelo Toaster global via sonner.
export function mostrarToastConfirmacao({ titulo, descricao }: ToastConfirmacaoOpcoes) {
  // O sonner limita o item à largura padrão de 356px; o cartão do Figma tem 408px.
  toast.custom(
    (id) => (
      <div className="flex w-[408px] overflow-clip rounded-[8px] border border-[#e4e4e7] bg-white shadow-[0px_4px_6px_-4px_rgba(0,0,0,0.1),0px_10px_15px_-3px_rgba(0,0,0,0.1)]">
        <div className="flex w-[60px] shrink-0 items-center justify-center bg-[#ecfdf3]">
          <svg className="size-[28px]" viewBox="0 0 28 28" fill="none" aria-hidden="true">
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
        <div className="flex flex-1 flex-col gap-[12px] py-[16px] pr-[20px] pl-[16px]">
          <div className="flex flex-col gap-[4px]">
            <p className="font-['Helvetica_Neue:Medium',sans-serif] text-[14px] leading-[normal] text-[#252b37]">
              {titulo}
            </p>
            <p className="font-['Helvetica_Neue:Regular',sans-serif] text-[14px] leading-[normal] text-[#535862]">
              {descricao}
            </p>
          </div>
          <button
            type="button"
            className="w-fit cursor-pointer rounded-[6px] border border-[#e4e4e7] bg-white px-[12px] py-[8px] font-['Helvetica_Neue:Medium',sans-serif] text-[14px] leading-none text-[#09090b] transition-colors hover:bg-[#f8fafc]"
            onClick={() => toast.dismiss(id)}
          >
            Entendido
          </button>
        </div>
      </div>
    ),
    { style: { width: "408px" } }
  );
}
