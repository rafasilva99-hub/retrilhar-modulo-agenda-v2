import svgPaths from "./svg-q5jqh9fwaq";
import imgIntroducaoAoTeste from "figma:asset/bf3f56458c51cdd59b7949f2a771c8cc1623145c.png";

function Frame() {
  return (
    <div className="content-stretch flex flex-col font-['Sora:Regular',sans-serif] font-normal gap-[16px] items-start relative shrink-0 text-[16px] tracking-[-0.32px] w-full">
      <div className="leading-[0] relative shrink-0 w-full">
        <p className="leading-[1.5] mb-0">Agradecemos sua participação. Hoje iremos avaliar sua experiência de uso no módulo de agendas da Retrilhar, uma plataforma de gestão para turismo de experiências.</p>
        <p className="leading-[1.5]">O seu papel durante o teste será navegar pelo módulo de agendas do protótipo como se estivesse no seu dia a dia de trabalho. Antes de começar, alguns pontos importantes:</p>
      </div>
      <p className="leading-[1.5] relative shrink-0 w-full">Nesse momento, iremos avaliar sua experiência em um cenário onde você já possui acesso ao sistema como gestor. Lembre-se:</p>
    </div>
  );
}

function Frame1() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 text-white w-[490px]">
      <p className="font-['Sora:SemiBold',sans-serif] font-semibold leading-[1.4] relative shrink-0 text-[36px] tracking-[-0.72px] w-full">Olá, boas vindas ao teste de usabilidade!</p>
      <Frame />
    </div>
  );
}

function Frame2() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col font-['Sora:Regular',sans-serif] font-normal gap-[6px] items-start justify-center leading-[1.5] min-w-px relative">
      <p className="relative shrink-0 text-[16px] text-white tracking-[-0.32px] w-full">Durante o teste não estamos avaliando você, e sim o produto.</p>
      <p className="relative shrink-0 text-[#fafafa] text-[14px] tracking-[-0.28px] w-full">Portanto, não existe certo ou errado: tudo o que você fizer, comentar ou questionar é extremamente valioso para que possamos evoluir a experiência de uso.</p>
    </div>
  );
}

function Frame4() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col font-['Sora:Regular',sans-serif] font-normal gap-[6px] items-start justify-center leading-[1.5] min-w-px relative">
      <p className="relative shrink-0 text-[16px] text-white tracking-[-0.32px] w-full">O teste é composto por algumas tarefas práticas que simulam situações reais dentro da plataforma.</p>
      <p className="relative shrink-0 text-[#fafafa] text-[14px] tracking-[-0.28px] w-full">Enquanto realiza o teste você pode pensar em voz alta, compartilhar suas impressões, dúvidas e expectativas. Isso nos ajuda a entender seu raciocínio e como o produto apoia (ou não) suas decisões.</p>
    </div>
  );
}

function Frame7() {
  return (
    <div className="content-stretch flex flex-col gap-[24px] items-start relative shrink-0 w-full">
      <div className="relative rounded-[16px] shrink-0 w-full" data-name="Mouseover test component">
        <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.12)] border-solid inset-0 pointer-events-none rounded-[16px]" />
        <div className="content-stretch flex gap-[12px] items-start p-[24px] relative size-full">
          <div className="overflow-clip relative shrink-0 size-[24px]" data-name="send-03">
            <div className="absolute inset-[14.3%_11.33%_14.3%_9.78%]" data-name="Icon">
              <div className="absolute inset-[-5.83%_-5.28%]">
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20.9352 19.1362">
                  <path d={svgPaths.p3209bb40} id="Icon" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                </svg>
              </div>
            </div>
          </div>
          <Frame2 />
        </div>
      </div>
      <div className="relative rounded-[16px] shrink-0 w-full" data-name="Mouseover test component">
        <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.12)] border-solid inset-0 pointer-events-none rounded-[16px]" />
        <div className="content-stretch flex gap-[12px] items-start p-[24px] relative size-full">
          <div className="overflow-clip relative shrink-0 size-[24px]" data-name="send-03">
            <div className="absolute inset-[14.3%_11.33%_14.3%_9.78%]" data-name="Icon">
              <div className="absolute inset-[-5.83%_-5.28%]">
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20.9352 19.1362">
                  <path d={svgPaths.p3209bb40} id="Icon" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                </svg>
              </div>
            </div>
          </div>
          <Frame4 />
        </div>
      </div>
    </div>
  );
}

function Frame3() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-center justify-center relative shrink-0 w-full">
      <Frame7 />
      <p className="font-['Sora:Regular',sans-serif] font-normal leading-[1.5] relative shrink-0 text-[#fafafa] text-[14px] tracking-[-0.28px] whitespace-nowrap">Não há pressa. Leve o tempo que precisar em cada tarefa.</p>
    </div>
  );
}

function Frame5() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[32px] items-center min-h-px relative w-full">
      <Frame1 />
      <Frame3 />
    </div>
  );
}

function TextPadding() {
  return (
    <div className="content-stretch flex items-center justify-center px-[2px] relative shrink-0" data-name="Text padding">
      <p className="font-['Sora:SemiBold',sans-serif] font-semibold leading-[28px] relative shrink-0 text-[18px] text-white whitespace-nowrap">Prosseguir para Introdução ao Teste</p>
    </div>
  );
}

function Frame6() {
  return (
    <div className="-translate-y-1/2 absolute content-stretch flex flex-col gap-[20px] h-[1026px] items-center left-0 px-[40px] py-[64px] rounded-br-[32px] rounded-tr-[32px] top-1/2 w-[634px]">
      <div aria-hidden="true" className="absolute bg-[#0c0b0b] inset-0 pointer-events-none rounded-br-[32px] rounded-tr-[32px]" />
      <div aria-hidden="true" className="absolute border-[rgba(255,255,255,0.12)] border-b border-r border-solid border-t inset-0 pointer-events-none rounded-br-[32px] rounded-tr-[32px] shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)]" />
      <Frame5 />
      <div className="relative rounded-[10px] shrink-0 w-full" data-name="Buttons/Button">
        <div aria-hidden="true" className="absolute bg-[#175cd3] inset-0 pointer-events-none rounded-[10px]" />
        <div className="flex flex-row items-center justify-center overflow-clip rounded-[inherit] size-full">
          <div className="content-stretch flex gap-[8px] items-center justify-center px-[22px] py-[16px] relative size-full">
            <TextPadding />
            <div className="overflow-clip relative shrink-0 size-[24px]" data-name="arrow-up-right">
              <div className="absolute inset-[29.17%]" data-name="Icon">
                <div className="absolute inset-[-10%]">
                  <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
                    <path d="M1 11L11 1M11 1H1M11 1V11" id="Icon" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_0px_0px_1px_rgba(10,13,18,0.18),inset_0px_-2px_0px_0px_rgba(10,13,18,0.05)]" />
        <div aria-hidden="true" className="absolute border-2 border-[rgba(255,255,255,0.12)] border-solid inset-0 pointer-events-none rounded-[10px] shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)]" />
      </div>
      <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_0px_0px_0px_rgba(10,13,18,0.18),inset_0px_-2px_0px_0px_rgba(10,13,18,0.05)]" />
    </div>
  );
}

export default function IntroducaoAoTeste() {
  return (
    <div className="relative size-full" data-name="Introdução ao Teste">
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0" style={{ backgroundImage: "linear-gradient(122.278deg, rgb(0, 0, 0) 8.6144%, rgb(23, 23, 23) 55.137%, rgb(0, 0, 0) 101.84%), linear-gradient(90deg, rgb(0, 0, 0) 0%, rgb(0, 0, 0) 100%), linear-gradient(90deg, rgb(255, 255, 255) 0%, rgb(255, 255, 255) 100%)" }} />
        <div className="absolute inset-0 overflow-hidden">
          <img alt="" className="absolute h-[90.23%] left-[36.89%] max-w-none top-[9.75%] w-[63.12%]" src={imgIntroducaoAoTeste} />
        </div>
      </div>
      <Frame6 />
    </div>
  );
}