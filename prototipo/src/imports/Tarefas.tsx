import svgPaths from "./svg-h9zkfnkbos";

function Heading1() {
  return (
    <div className="h-[24px] relative shrink-0 w-[133.183px]" data-name="Heading 1">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[24px] relative w-[133.183px]">
        <p className="absolute font-['Source_Serif_Pro:SemiBold',sans-serif] leading-[24px] left-[8px] not-italic text-[16px] text-neutral-950 text-nowrap top-0 whitespace-pre">Tarefas Disponíveis</p>
      </div>
    </div>
  );
}

function Badge() {
  return (
    <div className="h-[22px] relative rounded-[8px] shrink-0 w-[71px]" data-name="Badge">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[22px] overflow-clip relative rounded-[inherit] w-[71px]">
        <p className="absolute font-['Source_Sans_Pro:Regular',sans-serif] h-[15px] leading-[16px] left-[35.6px] not-italic text-[12px] text-center text-neutral-950 top-[3px] translate-x-[-50%] w-[62px]">5 tarefas</p>
      </div>
      <div aria-hidden="true" className="absolute border-[1.267px] border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Container() {
  return (
    <div className="h-[32px] relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex h-[32px] items-center justify-between relative w-full">
          <Heading1 />
          <Badge />
        </div>
      </div>
    </div>
  );
}

function CardTitle() {
  return (
    <div className="h-[30px] relative shrink-0 w-[202px]" data-name="CardTitle">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[30px] relative w-[202px]">
        <p className="absolute font-['Source_Sans_Pro:Regular',sans-serif] h-[26px] leading-[24px] left-0 not-italic text-[16px] text-neutral-950 top-[2px] w-[190px]">Preparar composto orgânico</p>
      </div>
    </div>
  );
}

function Icon() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p36b1d900} id="Vector" stroke="var(--stroke-0, #00A63E)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p1a051232} id="Vector_2" stroke="var(--stroke-0, #00A63E)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M3.33333 14H12.6667" id="Vector_3" stroke="var(--stroke-0, #00A63E)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Text() {
  return (
    <div className="basis-0 grow h-[24px] min-h-px min-w-px relative shrink-0" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[24px] relative w-full">
        <p className="absolute font-['Source_Sans_Pro:SemiBold',sans-serif] leading-[24px] left-0 not-italic text-[#00a63e] text-[16px] text-nowrap top-0 whitespace-pre">150</p>
      </div>
    </div>
  );
}

function Container1() {
  return (
    <div className="bg-green-50 h-[28px] relative rounded-[10px] shrink-0 w-[70px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[4px] h-[28px] items-center px-[12px] py-0 relative w-[70px]">
        <Icon />
        <Text />
      </div>
    </div>
  );
}

function TasksPage() {
  return (
    <div className="absolute content-stretch flex h-[30px] items-start justify-between left-[23.73px] top-[15.73px] w-[309px]" data-name="TasksPage">
      <CardTitle />
      <Container1 />
    </div>
  );
}

function CardDescription() {
  return (
    <div className="absolute h-[40px] left-[24px] top-[59.73px] w-[308.867px]" data-name="CardDescription">
      <p className="absolute font-['Source_Sans_Pro:Regular',sans-serif] leading-[20px] left-0 not-italic text-[#717182] text-[14px] top-[-1.5px] w-[286px]">Preparar nova leva de composto com resíduos orgânicos</p>
    </div>
  );
}

function CardHeader() {
  return (
    <div className="h-[110px] relative shrink-0 w-full" data-name="CardHeader">
      <TasksPage />
      <CardDescription />
    </div>
  );
}

function Icon1() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p14548f00} id="Vector" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p17781bc0} id="Vector_2" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Text1() {
  return (
    <div className="h-[20px] relative shrink-0 w-[136.5px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[20px] relative w-[136.5px]">
        <p className="absolute font-['Source_Sans_Pro:Regular',sans-serif] leading-[20px] left-0 not-italic text-[#4a5565] text-[14px] text-nowrap top-[-1.5px] whitespace-pre">Jardim da Praça Verde</p>
      </div>
    </div>
  );
}

function TasksPage1() {
  return (
    <div className="content-stretch flex gap-[8px] h-[20px] items-center relative shrink-0 w-full" data-name="TasksPage">
      <Icon1 />
      <Text1 />
    </div>
  );
}

function Icon2() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_1_2298)" id="Icon">
          <path d="M8 4V8L10.6667 9.33333" id="Vector" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p39ee6532} id="Vector_2" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
        <defs>
          <clipPath id="clip0_1_2298">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Text2() {
  return (
    <div className="h-[20px] relative shrink-0 w-[15.467px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[20px] relative w-[15.467px]">
        <p className="absolute font-['Source_Sans_Pro:Regular',sans-serif] leading-[20px] left-0 not-italic text-[#4a5565] text-[14px] text-nowrap top-[-1.5px] whitespace-pre">2h</p>
      </div>
    </div>
  );
}

function TasksPage2() {
  return (
    <div className="content-stretch flex gap-[8px] h-[20px] items-center relative shrink-0 w-full" data-name="TasksPage">
      <Icon2 />
      <Text2 />
    </div>
  );
}

function Badge1() {
  return (
    <div className="bg-[#424141] h-[22.533px] relative rounded-[8px] shrink-0 w-[96.367px]" data-name="Badge">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[4px] h-[22.533px] items-center justify-center overflow-clip px-[9.267px] py-[3.267px] relative rounded-[inherit] w-[96.367px]">
        <p className="font-['Source_Sans_Pro:SemiBold',sans-serif] leading-[16px] not-italic relative shrink-0 text-[#fbfbfb] text-[11px] text-nowrap whitespace-pre">Compostagem</p>
      </div>
      <div aria-hidden="true" className="absolute border-[1.267px] border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Badge2() {
  return (
    <div className="bg-[#fb2c36] h-[22.533px] relative rounded-[8px] shrink-0 w-[47.85px]" data-name="Badge">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[4px] h-[22.533px] items-center justify-center overflow-clip px-[9.267px] py-[3.267px] relative rounded-[inherit] w-[47.85px]">
        <p className="font-['Source_Sans_Pro:SemiBold',sans-serif] leading-[16px] not-italic relative shrink-0 text-[#fbfbfb] text-[11px] text-nowrap whitespace-pre">Difícil</p>
      </div>
      <div aria-hidden="true" className="absolute border-[1.267px] border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function TasksPage3() {
  return (
    <div className="content-stretch flex gap-[8px] h-[22.533px] items-center relative shrink-0 w-full" data-name="TasksPage">
      <Badge1 />
      <Badge2 />
    </div>
  );
}

function Text3() {
  return (
    <div className="h-[16px] relative shrink-0 w-[52.667px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[16px] relative w-[52.667px]">
        <p className="absolute font-['Source_Sans_Pro:Regular',sans-serif] leading-[16px] left-0 not-italic text-[#4a5565] text-[12px] text-nowrap top-[-0.6px] whitespace-pre">Progresso</p>
      </div>
    </div>
  );
}

function Text4() {
  return (
    <div className="h-[16px] relative shrink-0 w-[22.75px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[16px] relative w-[22.75px]">
        <p className="absolute font-['Source_Sans_Pro:Regular',sans-serif] leading-[16px] left-0 not-italic text-[#4a5565] text-[12px] top-[-0.6px] w-[23px]">60%</p>
      </div>
    </div>
  );
}

function Container2() {
  return (
    <div className="content-stretch flex h-[16px] items-center justify-between relative shrink-0 w-full" data-name="Container">
      <Text3 />
      <Text4 />
    </div>
  );
}

function Container3() {
  return <div className="bg-[#030213] h-[8px] shrink-0 w-full" data-name="Container" />;
}

function PrimitiveDiv() {
  return (
    <div className="bg-[rgba(3,2,19,0.2)] box-border content-stretch flex flex-col h-[8px] items-start overflow-clip pr-[123.55px] py-0 relative rounded-[3.40282e+38px] shrink-0 w-full" data-name="Primitive.div">
      <Container3 />
    </div>
  );
}

function TasksPage4() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] h-[28px] items-start relative shrink-0 w-full" data-name="TasksPage">
      <Container2 />
      <PrimitiveDiv />
    </div>
  );
}

function CardContent() {
  return (
    <div className="h-[137px] relative shrink-0 w-full" data-name="CardContent">
      <div className="size-full">
        <div className="box-border content-stretch flex flex-col gap-[12px] h-[137px] items-start px-[24px] py-0 relative w-full">
          <TasksPage1 />
          <TasksPage2 />
          <TasksPage3 />
          <TasksPage4 />
        </div>
      </div>
    </div>
  );
}

function Button() {
  return (
    <div className="bg-[#00a63e] box-border content-stretch flex gap-[8px] h-[36px] items-center justify-center px-[16px] py-[8px] relative rounded-[8px] shrink-0 w-[308.867px]" data-name="Button">
      <p className="font-['Source_Sans_Pro:SemiBold',sans-serif] leading-[20px] not-italic relative shrink-0 text-[#fbfbfb] text-[14px] text-nowrap whitespace-pre">Continuar Tarefa</p>
    </div>
  );
}

function Frame5() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[12px] items-center left-[1.27px] top-[1.27px] w-[356.867px]">
      <CardHeader />
      <CardContent />
      <Button />
    </div>
  );
}

function Card() {
  return (
    <div className="bg-[#fbfbfb] h-[328px] relative rounded-[14px] shrink-0 w-[359px]" data-name="Card">
      <div aria-hidden="true" className="absolute border-[1.267px] border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[14px]" />
      <Frame5 />
    </div>
  );
}

function CardTitle1() {
  return (
    <div className="h-[30px] relative shrink-0 w-[177px]" data-name="CardTitle">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[30px] relative w-[177px]">
        <p className="absolute font-['Source_Sans_Pro:Regular',sans-serif] h-[24px] leading-[24px] left-[-0.27px] not-italic text-[16px] text-neutral-950 top-[1.73px] w-[177px]">Regar plantas da seção A</p>
      </div>
    </div>
  );
}

function Icon3() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p36b1d900} id="Vector" stroke="var(--stroke-0, #00A63E)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p1a051232} id="Vector_2" stroke="var(--stroke-0, #00A63E)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M3.33333 14H12.6667" id="Vector_3" stroke="var(--stroke-0, #00A63E)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Text5() {
  return (
    <div className="basis-0 grow h-[26px] min-h-px min-w-px relative shrink-0" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[26px] relative w-full">
        <p className="absolute font-['Source_Sans_Pro:SemiBold',sans-serif] h-[24px] leading-[24px] left-0 not-italic text-[#00a63e] text-[16px] top-px w-[17px]">50</p>
      </div>
    </div>
  );
}

function Container4() {
  return (
    <div className="bg-green-50 h-[28px] relative rounded-[10px] shrink-0 w-[59px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[2px] h-[28px] items-center px-[12px] py-0 relative w-[59px]">
        <Icon3 />
        <Text5 />
      </div>
    </div>
  );
}

function TasksPage5() {
  return (
    <div className="absolute content-stretch flex h-[30px] items-start justify-between left-[23.73px] top-[17.73px] w-[309px]" data-name="TasksPage">
      <CardTitle1 />
      <Container4 />
    </div>
  );
}

function CardDescription1() {
  return (
    <div className="absolute h-[40px] left-[24px] top-[62px] w-[308.867px]" data-name="CardDescription">
      <p className="absolute font-['Source_Sans_Pro:Regular',sans-serif] leading-[20px] left-0 not-italic text-[#717182] text-[14px] top-[-1.5px] w-[298px]">Realizar a rega das plantas na seção A do jardim durante a manhã</p>
    </div>
  );
}

function CardHeader1() {
  return (
    <div className="h-[110px] relative shrink-0 w-full" data-name="CardHeader">
      <TasksPage5 />
      <CardDescription1 />
    </div>
  );
}

function Icon4() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p14548f00} id="Vector" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p17781bc0} id="Vector_2" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Text6() {
  return (
    <div className="h-[20px] relative shrink-0 w-[159.633px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[20px] relative w-[159.633px]">
        <p className="absolute font-['Source_Sans_Pro:Regular',sans-serif] leading-[20px] left-0 not-italic text-[#4a5565] text-[14px] text-nowrap top-[-1.5px] whitespace-pre">Horta Comunitária Centro</p>
      </div>
    </div>
  );
}

function TasksPage6() {
  return (
    <div className="content-stretch flex gap-[8px] h-[20px] items-center relative shrink-0 w-full" data-name="TasksPage">
      <Icon4 />
      <Text6 />
    </div>
  );
}

function Icon5() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_1_2298)" id="Icon">
          <path d="M8 4V8L10.6667 9.33333" id="Vector" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p39ee6532} id="Vector_2" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
        <defs>
          <clipPath id="clip0_1_2298">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Text7() {
  return (
    <div className="h-[20px] relative shrink-0 w-[42.3px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[20px] relative w-[42.3px]">
        <p className="absolute font-['Source_Sans_Pro:Regular',sans-serif] leading-[20px] left-0 not-italic text-[#4a5565] text-[14px] text-nowrap top-[-1.5px] whitespace-pre">30 min</p>
      </div>
    </div>
  );
}

function TasksPage7() {
  return (
    <div className="content-stretch flex gap-[8px] h-[20px] items-center relative shrink-0 w-full" data-name="TasksPage">
      <Icon5 />
      <Text7 />
    </div>
  );
}

function Badge3() {
  return (
    <div className="bg-[#eceef2] h-[22.533px] relative rounded-[8px] shrink-0 w-[84.8px]" data-name="Badge">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[4px] h-[22.533px] items-center justify-center overflow-clip px-[9.267px] py-[3.267px] relative rounded-[inherit] w-[84.8px]">
        <p className="font-['Source_Sans_Pro:Regular',sans-serif] leading-[16px] not-italic relative shrink-0 text-[#030213] text-[12px] text-nowrap whitespace-pre">Manutenção</p>
      </div>
      <div aria-hidden="true" className="absolute border-[1.267px] border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Badge4() {
  return (
    <div className="bg-[#00c950] h-[22.533px] relative rounded-[8px] shrink-0 w-[41.433px]" data-name="Badge">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[4px] h-[22.533px] items-center justify-center overflow-clip px-[9.267px] py-[3.267px] relative rounded-[inherit] w-[41.433px]">
        <p className="font-['Source_Sans_Pro:SemiBold',sans-serif] leading-[16px] not-italic relative shrink-0 text-[11px] text-nowrap text-white whitespace-pre">Fácil</p>
      </div>
      <div aria-hidden="true" className="absolute border-[1.267px] border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function TasksPage8() {
  return (
    <div className="content-stretch flex gap-[8px] h-[22.533px] items-center relative shrink-0 w-full" data-name="TasksPage">
      <Badge3 />
      <Badge4 />
    </div>
  );
}

function CardContent1() {
  return (
    <div className="h-[95px] relative shrink-0 w-full" data-name="CardContent">
      <div className="size-full">
        <div className="box-border content-stretch flex flex-col gap-[12px] h-[95px] items-start px-[24px] py-0 relative w-full">
          <TasksPage6 />
          <TasksPage7 />
          <TasksPage8 />
        </div>
      </div>
    </div>
  );
}

function Button1() {
  return (
    <div className="bg-[#00a63e] box-border content-stretch flex gap-[8px] h-[36px] items-center justify-center px-[16px] py-[8px] relative rounded-[8px] shrink-0 w-[308.867px]" data-name="Button">
      <p className="font-['Source_Sans_Pro:SemiBold',sans-serif] leading-[20px] not-italic relative shrink-0 text-[14px] text-nowrap text-white whitespace-pre">Aceitar Tarefa</p>
    </div>
  );
}

function Frame6() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[12px] items-center left-px top-px w-[357.133px]">
      <CardHeader1 />
      <CardContent1 />
      <Button1 />
    </div>
  );
}

function Card1() {
  return (
    <div className="bg-[#fbfbfb] h-[287px] relative rounded-[14px] shrink-0 w-[359px]" data-name="Card">
      <div aria-hidden="true" className="absolute border-[1.267px] border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[14px]" />
      <Frame6 />
    </div>
  );
}

function CardTitle2() {
  return (
    <div className="h-[30px] relative shrink-0 w-[200px]" data-name="CardTitle">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[30px] relative w-[200px]">
        <p className="absolute font-['Source_Sans_Pro:Regular',sans-serif] leading-[24px] left-[2px] not-italic text-[16px] text-neutral-950 text-nowrap top-[2px] whitespace-pre">Capinar canteiro de tomates</p>
      </div>
    </div>
  );
}

function Icon6() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p36b1d900} id="Vector" stroke="var(--stroke-0, #00A63E)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p1a051232} id="Vector_2" stroke="var(--stroke-0, #00A63E)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M3.33333 14H12.6667" id="Vector_3" stroke="var(--stroke-0, #00A63E)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Text8() {
  return (
    <div className="basis-0 grow h-[30px] min-h-px min-w-px relative shrink-0" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[30px] relative w-full">
        <p className="absolute font-['Source_Sans_Pro:SemiBold',sans-serif] h-[24px] leading-[24px] left-0 not-italic text-[#00a63e] text-[16px] top-[3px] w-[17px]">80</p>
      </div>
    </div>
  );
}

function Container5() {
  return (
    <div className="bg-green-50 h-[30px] relative rounded-[10px] shrink-0 w-[61px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[2px] h-[30px] items-center px-[12px] py-0 relative w-[61px]">
        <Icon6 />
        <Text8 />
      </div>
    </div>
  );
}

function TasksPage9() {
  return (
    <div className="absolute content-stretch flex h-[30px] items-start justify-between left-[23.73px] top-[16.73px] w-[309px]" data-name="TasksPage">
      <CardTitle2 />
      <Container5 />
    </div>
  );
}

function CardDescription2() {
  return (
    <div className="absolute h-[20px] left-[24px] top-[60.73px] w-[308.867px]" data-name="CardDescription">
      <p className="absolute font-['Source_Sans_Pro:Regular',sans-serif] leading-[20px] left-0 not-italic text-[#717182] text-[14px] text-nowrap top-[-1.5px] whitespace-pre">Remover ervas daninhas do canteiro de tomates</p>
    </div>
  );
}

function CardHeader2() {
  return (
    <div className="h-[88px] relative shrink-0 w-full" data-name="CardHeader">
      <TasksPage9 />
      <CardDescription2 />
    </div>
  );
}

function Icon7() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p14548f00} id="Vector" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p17781bc0} id="Vector_2" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Text9() {
  return (
    <div className="h-[20px] relative shrink-0 w-[136.5px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[20px] relative w-[136.5px]">
        <p className="absolute font-['Source_Sans_Pro:Regular',sans-serif] leading-[20px] left-0 not-italic text-[#4a5565] text-[14px] text-nowrap top-[-1.5px] whitespace-pre">Jardim da Praça Verde</p>
      </div>
    </div>
  );
}

function TasksPage10() {
  return (
    <div className="content-stretch flex gap-[8px] h-[20px] items-center relative shrink-0 w-full" data-name="TasksPage">
      <Icon7 />
      <Text9 />
    </div>
  );
}

function Icon8() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_1_2298)" id="Icon">
          <path d="M8 4V8L10.6667 9.33333" id="Vector" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p39ee6532} id="Vector_2" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
        <defs>
          <clipPath id="clip0_1_2298">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Text10() {
  return (
    <div className="h-[20px] relative shrink-0 w-[15.467px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[20px] relative w-[15.467px]">
        <p className="absolute font-['Source_Sans_Pro:Regular',sans-serif] leading-[20px] left-0 not-italic text-[#4a5565] text-[14px] text-nowrap top-[-1.5px] whitespace-pre">1h</p>
      </div>
    </div>
  );
}

function TasksPage11() {
  return (
    <div className="content-stretch flex gap-[8px] h-[20px] items-center relative shrink-0 w-full" data-name="TasksPage">
      <Icon8 />
      <Text10 />
    </div>
  );
}

function Badge5() {
  return (
    <div className="bg-[#eceef2] h-[22.533px] relative rounded-[8px] shrink-0 w-[84.8px]" data-name="Badge">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[4px] h-[22.533px] items-center justify-center overflow-clip px-[9.267px] py-[3.267px] relative rounded-[inherit] w-[84.8px]">
        <p className="font-['Source_Sans_Pro:Regular',sans-serif] leading-[16px] not-italic relative shrink-0 text-[#030213] text-[12px] text-nowrap whitespace-pre">Manutenção</p>
      </div>
      <div aria-hidden="true" className="absolute border-[1.267px] border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Badge6() {
  return (
    <div className="bg-[#f0b100] h-[22.533px] relative rounded-[8px] shrink-0 w-[52.6px]" data-name="Badge">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[4px] h-[22.533px] items-center justify-center overflow-clip px-[9.267px] py-[3.267px] relative rounded-[inherit] w-[52.6px]">
        <p className="font-['Source_Sans_Pro:SemiBold',sans-serif] leading-[16px] not-italic relative shrink-0 text-[11px] text-nowrap text-white whitespace-pre">Médio</p>
      </div>
      <div aria-hidden="true" className="absolute border-[1.267px] border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function TasksPage12() {
  return (
    <div className="content-stretch flex gap-[8px] h-[22.533px] items-center relative shrink-0 w-full" data-name="TasksPage">
      <Badge5 />
      <Badge6 />
    </div>
  );
}

function CardContent2() {
  return (
    <div className="h-[92px] relative shrink-0 w-full" data-name="CardContent">
      <div className="size-full">
        <div className="box-border content-stretch flex flex-col gap-[12px] h-[92px] items-start px-[24px] py-0 relative w-full">
          <TasksPage10 />
          <TasksPage11 />
          <TasksPage12 />
        </div>
      </div>
    </div>
  );
}

function Button2() {
  return (
    <div className="bg-[#00a63e] box-border content-stretch flex gap-[8px] h-[36px] items-center justify-center px-[16px] py-[8px] relative rounded-[8px] shrink-0 w-[308.867px]" data-name="Button">
      <p className="font-['Source_Sans_Pro:SemiBold',sans-serif] leading-[20px] not-italic relative shrink-0 text-[14px] text-nowrap text-white whitespace-pre">Aceitar Tarefa</p>
    </div>
  );
}

function Frame7() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[12px] items-center left-px top-px w-[357px]">
      <CardHeader2 />
      <CardContent2 />
      <Button2 />
    </div>
  );
}

function Card2() {
  return (
    <div className="bg-[#fbfbfb] h-[260px] relative rounded-[14px] shrink-0 w-[359px]" data-name="Card">
      <div aria-hidden="true" className="absolute border-[1.267px] border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[14px]" />
      <Frame7 />
    </div>
  );
}

function CardTitle3() {
  return (
    <div className="h-[24px] relative shrink-0 w-[168.117px]" data-name="CardTitle">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[24px] relative w-[168.117px]">
        <p className="absolute font-['Source_Sans_Pro:Regular',sans-serif] leading-[24px] left-0 not-italic text-[16px] text-neutral-950 text-nowrap top-[-1.77px] whitespace-pre">Plantar mudas de alface</p>
      </div>
    </div>
  );
}

function Icon9() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p36b1d900} id="Vector" stroke="var(--stroke-0, #00A63E)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p1a051232} id="Vector_2" stroke="var(--stroke-0, #00A63E)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M3.33333 14H12.6667" id="Vector_3" stroke="var(--stroke-0, #00A63E)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Text11() {
  return (
    <div className="basis-0 grow h-[24px] min-h-px min-w-px relative shrink-0" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[24px] relative w-full">
        <p className="absolute font-['Source_Sans_Pro:SemiBold',sans-serif] leading-[24px] left-0 not-italic text-[#00a63e] text-[16px] text-nowrap top-[-1.77px] whitespace-pre">120</p>
      </div>
    </div>
  );
}

function Container6() {
  return (
    <div className="bg-green-50 h-[32px] relative rounded-[10px] shrink-0 w-[69.85px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[4px] h-[32px] items-center px-[12px] py-0 relative w-[69.85px]">
        <Icon9 />
        <Text11 />
      </div>
    </div>
  );
}

function TasksPage13() {
  return (
    <div className="absolute content-stretch flex h-[32px] items-start justify-between left-[24px] top-[24px] w-[308.867px]" data-name="TasksPage">
      <CardTitle3 />
      <Container6 />
    </div>
  );
}

function CardDescription3() {
  return (
    <div className="absolute h-[20px] left-[24px] top-[62px] w-[308.867px]" data-name="CardDescription">
      <p className="absolute font-['Source_Sans_Pro:Regular',sans-serif] leading-[20px] left-0 not-italic text-[#717182] text-[14px] text-nowrap top-[-1.5px] whitespace-pre">Plantar 20 mudas de alface na área designada</p>
    </div>
  );
}

function CardHeader3() {
  return (
    <div className="absolute h-[94px] left-[1.27px] top-[1.27px] w-[356.867px]" data-name="CardHeader">
      <TasksPage13 />
      <CardDescription3 />
    </div>
  );
}

function Icon10() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p14548f00} id="Vector" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p17781bc0} id="Vector_2" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Text12() {
  return (
    <div className="h-[20px] relative shrink-0 w-[159.633px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[20px] relative w-[159.633px]">
        <p className="absolute font-['Source_Sans_Pro:Regular',sans-serif] leading-[20px] left-0 not-italic text-[#4a5565] text-[14px] text-nowrap top-[-1.5px] whitespace-pre">Horta Comunitária Centro</p>
      </div>
    </div>
  );
}

function TasksPage14() {
  return (
    <div className="content-stretch flex gap-[8px] h-[20px] items-center relative shrink-0 w-full" data-name="TasksPage">
      <Icon10 />
      <Text12 />
    </div>
  );
}

function Icon11() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_1_2298)" id="Icon">
          <path d="M8 4V8L10.6667 9.33333" id="Vector" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p39ee6532} id="Vector_2" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
        <defs>
          <clipPath id="clip0_1_2298">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Text13() {
  return (
    <div className="h-[20px] relative shrink-0 w-[57.767px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[20px] relative w-[57.767px]">
        <p className="absolute font-['Source_Sans_Pro:Regular',sans-serif] leading-[20px] left-0 not-italic text-[#4a5565] text-[14px] text-nowrap top-[-1.5px] whitespace-pre">1h 30min</p>
      </div>
    </div>
  );
}

function TasksPage15() {
  return (
    <div className="content-stretch flex gap-[8px] h-[20px] items-center relative shrink-0 w-full" data-name="TasksPage">
      <Icon11 />
      <Text13 />
    </div>
  );
}

function Badge7() {
  return (
    <div className="bg-[#030213] h-[22.533px] relative rounded-[8px] shrink-0 w-[55.033px]" data-name="Badge">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[4px] h-[22.533px] items-center justify-center overflow-clip px-[9.267px] py-[3.267px] relative rounded-[inherit] w-[55.033px]">
        <p className="font-['Source_Sans_Pro:SemiBold',sans-serif] leading-[16px] not-italic relative shrink-0 text-[11px] text-nowrap text-white whitespace-pre">Plantio</p>
      </div>
      <div aria-hidden="true" className="absolute border-[1.267px] border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Badge8() {
  return (
    <div className="bg-[#f0b100] h-[22.533px] relative rounded-[8px] shrink-0 w-[52.6px]" data-name="Badge">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[4px] h-[22.533px] items-center justify-center overflow-clip px-[9.267px] py-[3.267px] relative rounded-[inherit] w-[52.6px]">
        <p className="font-['Source_Sans_Pro:SemiBold',sans-serif] leading-[16px] not-italic relative shrink-0 text-[11px] text-nowrap text-white whitespace-pre">Médio</p>
      </div>
      <div aria-hidden="true" className="absolute border-[1.267px] border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function TasksPage16() {
  return (
    <div className="content-stretch flex gap-[8px] h-[22.533px] items-center relative shrink-0 w-full" data-name="TasksPage">
      <Badge7 />
      <Badge8 />
    </div>
  );
}

function CardContent3() {
  return (
    <div className="absolute box-border content-stretch flex flex-col gap-[12px] h-[98.533px] items-start left-[1.27px] px-[24px] py-0 top-[119.27px] w-[356.867px]" data-name="CardContent">
      <TasksPage14 />
      <TasksPage15 />
      <TasksPage16 />
    </div>
  );
}

function Button3() {
  return (
    <div className="absolute bg-[#00a63e] box-border content-stretch flex gap-[8px] h-[36px] items-center justify-center left-[25.27px] px-[16px] py-[8px] rounded-[8px] top-[241.8px] w-[308.867px]" data-name="Button">
      <p className="font-['Source_Sans_Pro:SemiBold',sans-serif] leading-[20px] not-italic relative shrink-0 text-[14px] text-nowrap text-white whitespace-pre">Aceitar Tarefa</p>
    </div>
  );
}

function Card3() {
  return (
    <div className="bg-[#fbfbfb] h-[303.067px] relative rounded-[14px] shrink-0 w-[359.4px]" data-name="Card">
      <div aria-hidden="true" className="absolute border-[1.267px] border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[14px]" />
      <CardHeader3 />
      <CardContent3 />
      <Button3 />
    </div>
  );
}

function CardTitle4() {
  return (
    <div className="h-[24px] relative shrink-0 w-[175px]" data-name="CardTitle">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[24px] relative w-[175px]">
        <p className="absolute font-['Source_Sans_Pro:Regular',sans-serif] leading-[24px] left-0 not-italic text-[16px] text-neutral-950 text-nowrap top-[-1.77px] whitespace-pre">Colher vegetais maduros</p>
      </div>
    </div>
  );
}

function Icon12() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p36b1d900} id="Vector" stroke="var(--stroke-0, #00A63E)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p1a051232} id="Vector_2" stroke="var(--stroke-0, #00A63E)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M3.33333 14H12.6667" id="Vector_3" stroke="var(--stroke-0, #00A63E)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Text14() {
  return (
    <div className="basis-0 grow h-[24px] min-h-px min-w-px relative shrink-0" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[24px] relative w-full">
        <p className="absolute font-['Source_Sans_Pro:SemiBold',sans-serif] leading-[24px] left-0 not-italic text-[#00a63e] text-[16px] text-nowrap top-[-1.77px] whitespace-pre">100</p>
      </div>
    </div>
  );
}

function Container7() {
  return (
    <div className="bg-green-50 h-[32px] relative rounded-[3.40282e+38px] shrink-0 w-[69.85px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[4px] h-[32px] items-center px-[12px] py-0 relative w-[69.85px]">
        <Icon12 />
        <Text14 />
      </div>
    </div>
  );
}

function TasksPage17() {
  return (
    <div className="absolute content-stretch flex h-[32px] items-start justify-between left-[24px] top-[24px] w-[308.867px]" data-name="TasksPage">
      <CardTitle4 />
      <Container7 />
    </div>
  );
}

function CardDescription4() {
  return (
    <div className="absolute h-[20px] left-[24px] top-[62px] w-[308.867px]" data-name="CardDescription">
      <p className="absolute font-['Source_Sans_Pro:Regular',sans-serif] leading-[20px] left-0 not-italic text-[#717182] text-[14px] text-nowrap top-[-1.5px] whitespace-pre">Fazer a colheita dos vegetais que estão prontos</p>
    </div>
  );
}

function CardHeader4() {
  return (
    <div className="absolute h-[94px] left-[1.27px] top-[1.27px] w-[356.867px]" data-name="CardHeader">
      <TasksPage17 />
      <CardDescription4 />
    </div>
  );
}

function Icon13() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p14548f00} id="Vector" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p17781bc0} id="Vector_2" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Text15() {
  return (
    <div className="h-[20px] relative shrink-0 w-[157.1px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[20px] relative w-[157.1px]">
        <p className="absolute font-['Source_Sans_Pro:Regular',sans-serif] leading-[20px] left-0 not-italic text-[#4a5565] text-[14px] text-nowrap top-[-1.5px] whitespace-pre">Horta Orgânica Vila Nova</p>
      </div>
    </div>
  );
}

function TasksPage18() {
  return (
    <div className="content-stretch flex gap-[8px] h-[20px] items-center relative shrink-0 w-full" data-name="TasksPage">
      <Icon13 />
      <Text15 />
    </div>
  );
}

function Icon14() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_1_2298)" id="Icon">
          <path d="M8 4V8L10.6667 9.33333" id="Vector" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p39ee6532} id="Vector_2" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
        <defs>
          <clipPath id="clip0_1_2298">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Text16() {
  return (
    <div className="h-[20px] relative shrink-0 w-[42.3px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[20px] relative w-[42.3px]">
        <p className="absolute font-['Source_Sans_Pro:Regular',sans-serif] leading-[20px] left-0 not-italic text-[#4a5565] text-[14px] text-nowrap top-[-1.5px] whitespace-pre">45 min</p>
      </div>
    </div>
  );
}

function TasksPage19() {
  return (
    <div className="content-stretch flex gap-[8px] h-[20px] items-center relative shrink-0 w-full" data-name="TasksPage">
      <Icon14 />
      <Text16 />
    </div>
  );
}

function Badge9() {
  return (
    <div className="bg-[#eceef2] h-[22.533px] relative rounded-[8px] shrink-0 w-[62.033px]" data-name="Badge">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[4px] h-[22.533px] items-center justify-center overflow-clip px-[9.267px] py-[3.267px] relative rounded-[inherit] w-[62.033px]">
        <p className="font-['Source_Sans_Pro:Regular',sans-serif] leading-[16px] not-italic relative shrink-0 text-[#030213] text-[12px] text-nowrap whitespace-pre">Colheita</p>
      </div>
      <div aria-hidden="true" className="absolute border-[1.267px] border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Badge10() {
  return (
    <div className="bg-[#00c950] h-[22.533px] relative rounded-[8px] shrink-0 w-[41.433px]" data-name="Badge">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[4px] h-[22.533px] items-center justify-center overflow-clip px-[9.267px] py-[3.267px] relative rounded-[inherit] w-[41.433px]">
        <p className="font-['Source_Sans_Pro:SemiBold',sans-serif] leading-[16px] not-italic relative shrink-0 text-[11px] text-nowrap text-white whitespace-pre">Fácil</p>
      </div>
      <div aria-hidden="true" className="absolute border-[1.267px] border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function TasksPage20() {
  return (
    <div className="content-stretch flex gap-[8px] h-[22.533px] items-center relative shrink-0 w-full" data-name="TasksPage">
      <Badge9 />
      <Badge10 />
    </div>
  );
}

function CardContent4() {
  return (
    <div className="absolute box-border content-stretch flex flex-col gap-[12px] h-[98.533px] items-start left-[1.27px] px-[24px] py-0 top-[119.27px] w-[356.867px]" data-name="CardContent">
      <TasksPage18 />
      <TasksPage19 />
      <TasksPage20 />
    </div>
  );
}

function Button4() {
  return (
    <div className="absolute bg-[#00a63e] box-border content-stretch flex gap-[8px] h-[36px] items-center justify-center left-[25.27px] px-[16px] py-[8px] rounded-[8px] top-[241.8px] w-[308.867px]" data-name="Button">
      <p className="font-['Source_Sans_Pro:SemiBold',sans-serif] leading-[20px] not-italic relative shrink-0 text-[14px] text-nowrap text-white whitespace-pre">Aceitar Tarefa</p>
    </div>
  );
}

function Card4() {
  return (
    <div className="bg-[#fbfbfb] h-[303.067px] relative rounded-[14px] shrink-0 w-[359.4px]" data-name="Card">
      <div aria-hidden="true" className="absolute border-[1.267px] border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[14px]" />
      <CardHeader4 />
      <CardContent4 />
      <Button4 />
    </div>
  );
}

function Container8() {
  return (
    <div className="content-stretch flex flex-col gap-[19px] items-start relative shrink-0 w-full" data-name="Container">
      <Card />
      <Card1 />
      <Card2 />
      <Card3 />
      <Card4 />
    </div>
  );
}

function TasksPage21() {
  return (
    <div className="absolute bg-gray-50 content-stretch flex flex-col gap-[16px] items-start left-[16px] top-[62px]" data-name="TasksPage">
      <Container />
      <Container8 />
    </div>
  );
}

function Icon15() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Icon">
          <path d={svgPaths.p2bbf6680} id="Vector" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <path d={svgPaths.p28601a80} id="Vector_2" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function Text17() {
  return (
    <div className="h-[16px] relative shrink-0 w-[28.367px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[16px] relative w-[28.367px]">
        <p className="absolute font-['Source_Sans_Pro:Regular',sans-serif] leading-[16px] left-0 not-italic text-[#4a5565] text-[12px] text-nowrap top-[-0.6px] whitespace-pre">Início</p>
      </div>
    </div>
  );
}

function Button5() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[4px] h-[68px] items-center justify-center left-0 top-0 w-[97.85px]" data-name="Button">
      <Icon15 />
      <Text17 />
    </div>
  );
}

function Icon16() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Icon">
          <g id="Vector">
            <path d="M13 5H21Z" fill="var(--fill-0, #00A63E)" />
            <path d="M13 5H21" stroke="var(--stroke-0, #00A63E)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </g>
          <g id="Vector_2">
            <path d="M13 12H21Z" fill="var(--fill-0, #00A63E)" />
            <path d="M13 12H21" stroke="var(--stroke-0, #00A63E)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </g>
          <g id="Vector_3">
            <path d="M13 19H21Z" fill="var(--fill-0, #00A63E)" />
            <path d="M13 19H21" stroke="var(--stroke-0, #00A63E)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </g>
          <g id="Vector_4">
            <path d="M3 17L5 19L9 15" fill="var(--fill-0, #00A63E)" />
            <path d="M3 17L5 19L9 15" stroke="var(--stroke-0, #00A63E)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </g>
          <path d={svgPaths.p1928c680} fill="var(--fill-0, #00A63E)" id="Vector_5" stroke="var(--stroke-0, #00A63E)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function Text18() {
  return (
    <div className="h-[16px] relative shrink-0 w-[36.433px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[16px] relative w-[36.433px]">
        <p className="absolute font-['Source_Sans_Pro:Regular',sans-serif] leading-[16px] left-0 not-italic text-[#00a63e] text-[12px] text-nowrap top-[-0.6px] whitespace-pre">Tarefas</p>
      </div>
    </div>
  );
}

function Button6() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[4px] h-[68px] items-center justify-center left-[97.85px] top-0 w-[97.85px]" data-name="Button">
      <Icon16 />
      <Text18 />
    </div>
  );
}

function Icon17() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Icon">
          <path d={svgPaths.p15a56410} id="Vector" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <path d="M12 8V21" id="Vector_2" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <path d={svgPaths.pb845c00} id="Vector_3" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <path d={svgPaths.p31fb2b00} id="Vector_4" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function Text19() {
  return (
    <div className="h-[16px] relative shrink-0 w-[72.45px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[16px] relative w-[72.45px]">
        <p className="absolute font-['Source_Sans_Pro:Regular',sans-serif] leading-[16px] left-0 not-italic text-[#4a5565] text-[12px] text-nowrap top-[-0.6px] whitespace-pre">Recompensas</p>
      </div>
    </div>
  );
}

function Button7() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[4px] h-[68px] items-center justify-center left-[195.7px] top-0 w-[97.85px]" data-name="Button">
      <Icon17 />
      <Text19 />
    </div>
  );
}

function Icon18() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Icon">
          <path d={svgPaths.p67f12c8} id="Vector" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <path d={svgPaths.p2c19cb00} id="Vector_2" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function Text20() {
  return (
    <div className="h-[16px] relative shrink-0 w-[26.283px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[16px] relative w-[26.283px]">
        <p className="absolute font-['Source_Sans_Pro:Regular',sans-serif] leading-[16px] left-0 not-italic text-[#4a5565] text-[12px] text-nowrap top-[-0.6px] whitespace-pre">Perfil</p>
      </div>
    </div>
  );
}

function Button8() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[4px] h-[68px] items-center justify-center left-[293.55px] top-0 w-[97.85px]" data-name="Button">
      <Icon18 />
      <Text20 />
    </div>
  );
}

function Container9() {
  return (
    <div className="h-[68px] pointer-events-auto sticky top-0 w-[391.4px]" data-name="Container">
      <Button5 />
      <Button6 />
      <Button7 />
      <Button8 />
    </div>
  );
}

function Container10() {
  return <div className="absolute bg-[#00a63e] h-[4px] left-0 top-[65.27px] w-[391.4px]" data-name="Container" />;
}

function App() {
  return (
    <div className="absolute bg-[#fbfbfb] h-[69.267px] left-0 top-[1742px] w-[391.4px]" data-name="App">
      <div aria-hidden="true" className="absolute border-[1.267px_0px_0px] border-gray-200 border-solid inset-0 pointer-events-none shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)]" />
      <div className="absolute bottom-0 h-[calc(100%-1.267px)] left-0 pointer-events-none top-[1.27px]">
        <Container9 />
      </div>
      <Container10 />
    </div>
  );
}

export default function Tarefas() {
  return (
    <div className="bg-gray-50 relative size-full" data-name="Tarefas">
      <App />
      <TasksPage21 />
    </div>
  );
}