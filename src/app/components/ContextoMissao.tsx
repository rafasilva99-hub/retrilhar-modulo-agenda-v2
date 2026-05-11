import svgPaths from "../../imports/svg-o3cnx04bbw";
import imgContextoMissao1 from "figma:asset/bf3f56458c51cdd59b7949f2a771c8cc1623145c.png";

function InfoCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="relative rounded-2xl w-full">
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.12)] border-solid inset-0 pointer-events-none rounded-2xl" />
      <div className="flex gap-3 items-start p-6 relative size-full">
        <div className="overflow-clip relative shrink-0 size-6">
          <div className="absolute inset-[14.3%_11.33%_14.3%_9.78%]">
            <div className="absolute inset-[-5.83%_-5.28%]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20.9352 19.1362">
                <path d={svgPaths.p3209bb40} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
              </svg>
            </div>
          </div>
        </div>
        <div className="flex flex-1 flex-col gap-1.5 items-start justify-center leading-[1.5]">
          <p className="w-full text-white">{title}</p>
          <p className="w-full text-[#fafafa] text-sm">{description}</p>
        </div>
      </div>
    </div>
  );
}

export default function ContextoMissao({ onStart }: { onStart?: () => void } = {}) {
  return (
    <div className="relative size-full overflow-hidden">
      {/* Background com gradientes e imagem */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0" style={{ backgroundImage: "linear-gradient(122.278deg, rgb(0, 0, 0) 8.6144%, rgb(23, 23, 23) 55.137%, rgb(0, 0, 0) 101.84%), linear-gradient(90deg, rgb(0, 0, 0) 0%, rgb(0, 0, 0) 100%), linear-gradient(90deg, rgb(255, 255, 255) 0%, rgb(255, 255, 255) 100%)" }} />
        <div className="absolute inset-0 overflow-hidden">
          <img alt="" className="absolute h-[90%] right-0 top-[5%] w-3/5 object-cover object-left max-w-none" src={imgContextoMissao1} />
        </div>
      </div>

      {/* Container de conteúdo com scroll */}
      <div className="relative h-full flex items-center">
        <div className="w-full max-w-[634px] h-full md:h-auto md:max-h-full overflow-y-auto">
          <div className="flex flex-col gap-5 px-6 md:px-10 py-12 md:py-16 bg-[#0c0b0b] md:rounded-br-[32px] md:rounded-tr-[32px] border-[rgba(255,255,255,0.12)] md:border-b md:border-r md:border-t border-solid shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)] min-h-full md:min-h-0">
            {/* Conteúdo principal */}
            <div className="flex flex-col gap-8 w-full">
              {/* Título e texto introdutório */}
              <div className="flex flex-col gap-4 items-start text-white w-full">
                <h1 className="font-['Sora:SemiBold',sans-serif] leading-[1.4] text-4xl md:text-[36px] w-full">Contextualizando - Missão Nº 1</h1>
                <div className="flex flex-col gap-4 items-start w-full">
                  <p className="leading-[1.5] w-full">Imagine que você está iniciando o seu dia de trabalho na Retrilhar. Como gestor da operação, precisa se organizar para saber o que vai acontecer hoje. Quais saídas estão programadas, quais equipes estão escaladas e o que pode exigir atenção antes do início das atividades.</p>
                  <p className="leading-[1.5] w-full">Seus principal objetivo é:</p>
                </div>
              </div>

              {/* Cards informativos */}
              <InfoCard
                title="Entender o que está programado para hoje."
                description="Veja quais saídas acontecem, em que horários e com quais equipes."
              />

              <InfoCard
                title="Se aprofunde em uma das atividades que chamar sua atenção."
                description="Escolha uma das saídas de hoje e explore mais detalhes sobre ela."
              />
            </div>

            {/* Seção do botão */}
            <div className="flex flex-col gap-5 items-center w-full">
              <p className="font-['Sora:Regular',sans-serif] leading-[1.5] text-[#fafafa] text-sm text-center w-full">Quando estiver pronto(a), podemos começar.</p>

              <button onClick={onStart} className="relative rounded-[10px] w-full bg-[#175cd3] shadow-[inset_0px_0px_0px_1px_rgba(10,13,18,0.18),inset_0px_-2px_0px_0px_rgba(10,13,18,0.05)] border-2 border-[rgba(255,255,255,0.12)] border-solid transition-all duration-200 hover:bg-[#1a66e8] hover:shadow-[inset_0px_0px_0px_1px_rgba(10,13,18,0.18),inset_0px_-2px_0px_0px_rgba(10,13,18,0.05),0px_4px_12px_0px_rgba(23,92,211,0.4)] hover:scale-[1.02] active:scale-[0.98]">
                <div className="flex items-center justify-center gap-2 px-6 py-4">
                  <p className="font-['Sora:SemiBold',sans-serif] leading-7 text-lg text-white">Iniciar Teste</p>
                  <div className="overflow-clip relative shrink-0 size-6">
                    <div className="absolute inset-[29.17%]">
                      <div className="absolute inset-[-10%]">
                        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
                          <path d="M1 11L11 1M11 1H1M11 1V11" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
