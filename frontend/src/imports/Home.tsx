import svgPaths from "./svg-7ep8avdngl";

function Paragraph() {
  return (
    <div className="h-[24px] opacity-90 relative shrink-0 w-[304px]" data-name="Paragraph">
      <p className="absolute font-['Source_Serif_Pro:SemiBold',sans-serif] leading-[24px] left-0 not-italic text-[#fbfbfb] text-[20px] text-nowrap top-[-1.77px] whitespace-pre">Olá,</p>
    </div>
  );
}

function Heading1() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="Heading 1">
      <p className="absolute font-['Source_Serif_Pro:Bold',sans-serif] leading-[24px] left-0 not-italic text-[#fbfbfb] text-[20px] top-[-2px] w-[188px]">Maria Silva!</p>
    </div>
  );
}

function Paragraph1() {
  return (
    <div className="h-[48px] opacity-90 relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Source_Serif_Pro:SemiBold',sans-serif] leading-[24px] left-0 not-italic text-[#fbfbfb] text-[20px] top-0 w-[232px]">Continue cultivando sua comunidade</p>
    </div>
  );
}

function Container() {
  return (
    <div className="h-[110px] relative shrink-0 w-[224px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col gap-[4px] h-[110px] items-start justify-end relative w-[224px]">
        <Paragraph />
        <Heading1 />
        <Paragraph1 />
      </div>
    </div>
  );
}

function Icon() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.p1e9e2f00} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p19e0f880} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M4.16667 17.5H15.8333" id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Text() {
  return (
    <div className="h-[24px] relative shrink-0 w-[28px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[24px] relative w-[28px]">
        <p className="absolute font-['Source_Sans_Pro:Bold',sans-serif] leading-[24px] left-[1.6px] not-italic text-[#fbfbfb] text-[16px] text-nowrap top-0 whitespace-pre">450</p>
      </div>
    </div>
  );
}

function Container1() {
  return (
    <div className="h-[27px] relative rounded-[3.40282e+38px] shrink-0 w-[56px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[2px] h-[27px] items-center pl-[2px] pr-[15px] py-0 relative w-[56px]">
        <Icon />
        <Text />
      </div>
    </div>
  );
}

function Container2() {
  return (
    <div className="content-stretch flex h-[110px] items-start justify-between relative shrink-0 w-full" data-name="Container">
      <Container />
      <Container1 />
    </div>
  );
}

function Container3() {
  return (
    <div className="h-[145px] relative rounded-[10px] shrink-0 w-full" data-name="Container">
      <div className="size-full">
        <div className="box-border content-stretch flex flex-col h-[145px] items-start pb-0 pt-[16px] px-[24px] relative w-full">
          <Container2 />
        </div>
      </div>
    </div>
  );
}

function Icon1() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Icon">
          <path d={svgPaths.p3eeeaa80} id="Vector" stroke="var(--stroke-0, #9810FA)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <path d={svgPaths.p2f14bd80} id="Vector_2" stroke="var(--stroke-0, #9810FA)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function HomePage() {
  return (
    <div className="h-[16px] relative shrink-0 w-[93.267px]" data-name="HomePage">
      <p className="absolute font-['Source_Sans_Pro:SemiBold',sans-serif] leading-[18px] left-[47.28px] not-italic text-[#4a5565] text-[11px] text-center text-nowrap top-[-0.6px] translate-x-[-50%] whitespace-pre">Nível Atual</p>
    </div>
  );
}

function HomePage1() {
  return (
    <div className="h-[24px] relative shrink-0 w-[94px]" data-name="HomePage">
      <div className="absolute flex flex-col font-['Source_Sans_3:SemiBold',sans-serif] font-semibold h-[24px] justify-center leading-[0] left-[46.73px] text-[18px] text-center text-neutral-950 top-[11.73px] translate-x-[-50%] translate-y-[-50%] w-[10px]">
        <p className="leading-[28px]">7</p>
      </div>
    </div>
  );
}

function Frame3() {
  return (
    <div className="content-stretch flex flex-col gap-[7px] items-center relative shrink-0">
      <Icon1 />
      <HomePage />
      <HomePage1 />
    </div>
  );
}

function CardContent() {
  return (
    <div className="relative shrink-0" data-name="CardContent">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col gap-[6px] items-center pb-[16px] pt-[12px] px-[8px] relative">
        <Frame3 />
      </div>
    </div>
  );
}

function Card() {
  return (
    <div className="absolute bg-[#fbfbfb] box-border content-stretch flex flex-col h-[102px] items-start left-[248px] p-[1.267px] rounded-[14px] top-0 w-[111px]" data-name="Card">
      <div aria-hidden="true" className="absolute border-[1.267px] border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[14px]" />
      <CardContent />
    </div>
  );
}

function Icon2() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Icon">
          <path d={svgPaths.p1d820380} id="Vector" stroke="var(--stroke-0, #155DFC)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <path d={svgPaths.p27451300} id="Vector_2" stroke="var(--stroke-0, #155DFC)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <path d={svgPaths.p2981fe00} id="Vector_3" stroke="var(--stroke-0, #155DFC)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <path d={svgPaths.p161d4800} id="Vector_4" stroke="var(--stroke-0, #155DFC)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function HomePage2() {
  return (
    <div className="h-[16px] relative shrink-0 w-full" data-name="HomePage">
      <p className="absolute font-['Source_Sans_Pro:SemiBold',sans-serif] leading-[18px] left-[47.17px] not-italic text-[#4a5565] text-[11px] text-center text-nowrap top-[-0.6px] translate-x-[-50%] whitespace-pre">Dias Trabalhados</p>
    </div>
  );
}

function HomePage3() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="HomePage">
      <div className="absolute flex flex-col font-['Source_Sans_3:SemiBold',sans-serif] font-semibold h-[24px] justify-center leading-[0] left-[46.73px] text-[18px] text-center text-neutral-950 top-[11.73px] translate-x-[-50%] translate-y-[-50%] w-[10px]">
        <p className="leading-[28px]">5</p>
      </div>
    </div>
  );
}

function Frame2() {
  return (
    <div className="content-stretch flex flex-col gap-[7px] h-[78px] items-center relative shrink-0 w-[94px]">
      <Icon2 />
      <HomePage2 />
      <HomePage3 />
    </div>
  );
}

function CardContent1() {
  return (
    <div className="relative shrink-0" data-name="CardContent">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col gap-[10px] items-start pb-[16px] pt-[12px] px-[8px] relative">
        <Frame2 />
      </div>
    </div>
  );
}

function Card1() {
  return (
    <div className="absolute bg-[#fbfbfb] box-border content-stretch flex flex-col h-[102px] items-start left-[124px] p-[1.267px] rounded-[14px] top-0 w-[112px]" data-name="Card">
      <div aria-hidden="true" className="absolute border-[1.267px] border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[14px]" />
      <CardContent1 />
    </div>
  );
}

function Icon3() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Icon">
          <path d="M16 7H22V13" id="Vector" stroke="var(--stroke-0, #00A63E)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <path d={svgPaths.p13253c0} id="Vector_2" stroke="var(--stroke-0, #00A63E)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function HomePage4() {
  return (
    <div className="h-[16px] relative shrink-0 w-full" data-name="HomePage">
      <p className="absolute font-['Source_Sans_Pro:SemiBold',sans-serif] leading-[18px] left-[55px] not-italic text-[#4a5565] text-[11px] text-center top-[-2px] translate-x-[-50%] w-[110px]">Tarefas Completas</p>
    </div>
  );
}

function HomePage5() {
  return (
    <div className="h-[24px] relative shrink-0 w-[93px]" data-name="HomePage">
      <div className="absolute flex flex-col font-['Source_Sans_3:SemiBold',sans-serif] font-semibold h-[24px] justify-center leading-[0] left-[46.73px] text-[18px] text-center text-neutral-950 top-[11.73px] translate-x-[-50%] translate-y-[-50%] w-[19px]">
        <p className="leading-[28px]">24</p>
      </div>
    </div>
  );
}

function Frame1() {
  return (
    <div className="content-stretch flex flex-col gap-[7px] items-center relative shrink-0 w-[110px]">
      <Icon3 />
      <HomePage4 />
      <HomePage5 />
    </div>
  );
}

function CardContent2() {
  return (
    <div className="h-[101px] relative shrink-0" data-name="CardContent">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col gap-[10px] h-[101px] items-start px-0 py-[13px] relative">
        <Frame1 />
      </div>
    </div>
  );
}

function Card2() {
  return (
    <div className="absolute bg-[#fbfbfb] box-border content-stretch flex flex-col h-[102px] items-start left-0 p-[1.267px] rounded-[14px] top-0 w-[112px]" data-name="Card">
      <div aria-hidden="true" className="absolute border-[1.267px] border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[14px]" />
      <CardContent2 />
    </div>
  );
}

function Container4() {
  return (
    <div className="h-[102px] relative shrink-0 w-full" data-name="Container">
      <Card />
      <Card1 />
      <Card2 />
    </div>
  );
}

function HomePage6() {
  return (
    <div className="bg-gray-50 content-stretch flex flex-col gap-[24px] h-[271px] items-start relative shrink-0 w-[359px]" data-name="HomePage">
      <Container3 />
      <Container4 />
    </div>
  );
}

function Heading2() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="Heading 2">
      <p className="absolute font-['Source_Serif_Pro:SemiBold',sans-serif] leading-[24px] left-[10px] not-italic text-[16px] text-neutral-950 top-0 w-[151px]">Tarefas Disponíveis</p>
    </div>
  );
}

function CardTitle() {
  return (
    <div className="absolute h-[24px] left-[16.6px] top-[11.87px] w-[218px]" data-name="CardTitle">
      <p className="absolute font-['Source_Sans_Pro:Regular',sans-serif] leading-[24px] left-0 not-italic text-[16px] text-neutral-950 text-nowrap top-[-1.77px] whitespace-pre">Regar plantas da seção A</p>
    </div>
  );
}

function CardDescription() {
  return <div className="absolute h-[24px] left-[24px] top-[42px] w-[212.867px]" data-name="CardDescription" />;
}

function Badge() {
  return (
    <div className="bg-[#eceef2] h-[22.533px] relative rounded-[8px] shrink-0 w-[84.8px]" data-name="Badge">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[4px] h-[22.533px] items-center justify-center overflow-clip px-[9.267px] py-[3.267px] relative rounded-[inherit] w-[84.8px]">
        <p className="font-['Source_Sans_Pro:Regular',sans-serif] leading-[16px] not-italic relative shrink-0 text-[#030213] text-[12px] text-center w-[71px]">Manutenção</p>
      </div>
      <div aria-hidden="true" className="absolute border-[1.267px] border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Badge1() {
  return (
    <div className="bg-[#00c950] h-[22.533px] relative rounded-[8px] shrink-0 w-[41.433px]" data-name="Badge">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[4px] h-[22.533px] items-center justify-center overflow-clip px-[9.267px] py-[3.267px] relative rounded-[inherit] w-[41.433px]">
        <p className="font-['Source_Sans_Pro:SemiBold',sans-serif] leading-[16px] not-italic relative shrink-0 text-[11px] text-nowrap text-white whitespace-pre">Fácil</p>
      </div>
      <div aria-hidden="true" className="absolute border-[1.267px] border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function TasksPage() {
  return (
    <div className="absolute content-stretch flex gap-[8px] h-[23px] items-center left-[16.6px] top-[42.87px] w-[316px]" data-name="TasksPage">
      <Badge />
      <Badge1 />
    </div>
  );
}

function Icon4() {
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

function Text1() {
  return (
    <div className="basis-0 grow h-[22px] min-h-px min-w-px relative shrink-0" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[22px] relative w-full">
        <p className="absolute font-['Source_Sans_Pro:SemiBold',sans-serif] leading-[24px] left-0 not-italic text-[#00a63e] text-[16px] text-nowrap top-[-1.77px] whitespace-pre">50</p>
      </div>
    </div>
  );
}

function Container5() {
  return (
    <div className="absolute bg-green-50 box-border content-stretch flex gap-[4px] h-[32px] items-center left-[277.73px] px-[12px] py-0 rounded-[10px] top-[10.2px] w-[61.233px]" data-name="Container">
      <Icon4 />
      <Text1 />
    </div>
  );
}

function CardHeader() {
  return (
    <div className="basis-0 grow h-[82px] min-h-px min-w-px relative shrink-0" data-name="CardHeader">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[82px] relative w-full">
        <CardTitle />
        <CardDescription />
        <TasksPage />
        <Container5 />
      </div>
    </div>
  );
}

function HomePage7() {
  return (
    <div className="h-[88px] relative shrink-0 w-[357px]" data-name="HomePage">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex h-[88px] items-start relative w-[357px]">
        <CardHeader />
      </div>
    </div>
  );
}

function Card3() {
  return (
    <div className="bg-[#fbfbfb] h-[84px] relative rounded-[14px] shrink-0 w-full" data-name="Card">
      <div className="box-border content-stretch flex flex-col h-[84px] items-start overflow-clip p-[1.267px] relative rounded-[inherit] w-full">
        <HomePage7 />
      </div>
      <div aria-hidden="true" className="absolute border-[1.267px] border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[14px]" />
    </div>
  );
}

function CardTitle1() {
  return (
    <div className="absolute h-[24px] left-[16.6px] top-[11.87px] w-[218px]" data-name="CardTitle">
      <p className="absolute font-['Source_Sans_Pro:Regular',sans-serif] leading-[24px] left-0 not-italic text-[16px] text-neutral-950 text-nowrap top-[-1.77px] whitespace-pre">Capinar canteiro de tomates</p>
    </div>
  );
}

function CardDescription1() {
  return <div className="absolute h-[24px] left-[24px] top-[42px] w-[212.867px]" data-name="CardDescription" />;
}

function Badge2() {
  return (
    <div className="bg-[#eceef2] h-[22.533px] relative rounded-[8px] shrink-0 w-[84.8px]" data-name="Badge">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[4px] h-[22.533px] items-center justify-center overflow-clip px-[9.267px] py-[3.267px] relative rounded-[inherit] w-[84.8px]">
        <p className="font-['Source_Sans_Pro:Regular',sans-serif] leading-[16px] not-italic relative shrink-0 text-[#030213] text-[12px] text-center w-[71px]">Manutenção</p>
      </div>
      <div aria-hidden="true" className="absolute border-[1.267px] border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Badge3() {
  return (
    <div className="bg-[#f0b100] h-[22.533px] relative rounded-[8px] shrink-0 w-[52.6px]" data-name="Badge">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[4px] h-[22.533px] items-center justify-center overflow-clip px-[9.267px] py-[3.267px] relative rounded-[inherit] w-[52.6px]">
        <p className="font-['Source_Sans_Pro:SemiBold',sans-serif] leading-[16px] not-italic relative shrink-0 text-[11px] text-nowrap text-white whitespace-pre">Médio</p>
      </div>
      <div aria-hidden="true" className="absolute border-[1.267px] border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function TasksPage1() {
  return (
    <div className="absolute content-stretch flex gap-[8px] h-[23px] items-center left-[16.6px] top-[42.87px] w-[316px]" data-name="TasksPage">
      <Badge2 />
      <Badge3 />
    </div>
  );
}

function Icon5() {
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

function Text2() {
  return (
    <div className="basis-0 grow h-[22px] min-h-px min-w-px relative shrink-0" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[22px] relative w-full">
        <p className="absolute font-['Source_Sans_Pro:SemiBold',sans-serif] leading-[24px] left-0 not-italic text-[#00a63e] text-[16px] text-nowrap top-[-1.77px] whitespace-pre">80</p>
      </div>
    </div>
  );
}

function Container6() {
  return (
    <div className="absolute bg-green-50 box-border content-stretch flex gap-[4px] h-[32px] items-center left-[277.73px] px-[12px] py-0 rounded-[10px] top-[10.2px] w-[61.233px]" data-name="Container">
      <Icon5 />
      <Text2 />
    </div>
  );
}

function CardHeader1() {
  return (
    <div className="basis-0 grow h-[88px] min-h-px min-w-px relative shrink-0" data-name="CardHeader">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[88px] relative w-full">
        <CardTitle1 />
        <CardDescription1 />
        <TasksPage1 />
        <Container6 />
      </div>
    </div>
  );
}

function HomePage8() {
  return (
    <div className="h-[88px] relative shrink-0 w-[357px]" data-name="HomePage">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex h-[88px] items-start relative w-[357px]">
        <CardHeader1 />
      </div>
    </div>
  );
}

function Card4() {
  return (
    <div className="bg-[#fbfbfb] h-[84px] relative rounded-[14px] shrink-0 w-full" data-name="Card">
      <div className="box-border content-stretch flex flex-col h-[84px] items-start overflow-clip p-[1.267px] relative rounded-[inherit] w-full">
        <HomePage8 />
      </div>
      <div aria-hidden="true" className="absolute border-[1.267px] border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[14px]" />
    </div>
  );
}

function CardTitle2() {
  return (
    <div className="absolute h-[24px] left-[16.6px] top-[11.87px] w-[218px]" data-name="CardTitle">
      <p className="absolute font-['Source_Sans_Pro:Regular',sans-serif] leading-[24px] left-0 not-italic text-[16px] text-neutral-950 text-nowrap top-[-1.77px] whitespace-pre">Regar plantas da seção A</p>
    </div>
  );
}

function CardDescription2() {
  return <div className="absolute h-[24px] left-[24px] top-[42px] w-[212.867px]" data-name="CardDescription" />;
}

function Badge4() {
  return (
    <div className="bg-[#eceef2] h-[22.533px] relative rounded-[8px] shrink-0 w-[84.8px]" data-name="Badge">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[4px] h-[22.533px] items-center justify-center overflow-clip px-[9.267px] py-[3.267px] relative rounded-[inherit] w-[84.8px]">
        <p className="font-['Source_Sans_Pro:Regular',sans-serif] leading-[16px] not-italic relative shrink-0 text-[#030213] text-[12px] text-center w-[71px]">Manutenção</p>
      </div>
      <div aria-hidden="true" className="absolute border-[1.267px] border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Badge5() {
  return (
    <div className="bg-[#00c950] h-[22.533px] relative rounded-[8px] shrink-0 w-[41.433px]" data-name="Badge">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[4px] h-[22.533px] items-center justify-center overflow-clip px-[9.267px] py-[3.267px] relative rounded-[inherit] w-[41.433px]">
        <p className="font-['Source_Sans_Pro:SemiBold',sans-serif] leading-[16px] not-italic relative shrink-0 text-[11px] text-nowrap text-white whitespace-pre">Fácil</p>
      </div>
      <div aria-hidden="true" className="absolute border-[1.267px] border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function TasksPage2() {
  return (
    <div className="absolute content-stretch flex gap-[8px] h-[23px] items-center left-[16.6px] top-[42.87px] w-[316px]" data-name="TasksPage">
      <Badge4 />
      <Badge5 />
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

function Text3() {
  return (
    <div className="basis-0 grow h-[22px] min-h-px min-w-px relative shrink-0" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[22px] relative w-full">
        <p className="absolute font-['Source_Sans_Pro:SemiBold',sans-serif] leading-[24px] left-0 not-italic text-[#00a63e] text-[16px] text-nowrap top-[-1.77px] whitespace-pre">50</p>
      </div>
    </div>
  );
}

function Container7() {
  return (
    <div className="absolute bg-green-50 box-border content-stretch flex gap-[4px] h-[32px] items-center left-[277.73px] px-[12px] py-0 rounded-[10px] top-[10.2px] w-[61.233px]" data-name="Container">
      <Icon6 />
      <Text3 />
    </div>
  );
}

function CardHeader2() {
  return (
    <div className="basis-0 grow h-[88px] min-h-px min-w-px relative shrink-0" data-name="CardHeader">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[88px] relative w-full">
        <CardTitle2 />
        <CardDescription2 />
        <TasksPage2 />
        <Container7 />
      </div>
    </div>
  );
}

function HomePage9() {
  return (
    <div className="h-[88px] relative shrink-0 w-[357px]" data-name="HomePage">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex h-[88px] items-start relative w-[357px]">
        <CardHeader2 />
      </div>
    </div>
  );
}

function Card5() {
  return (
    <div className="bg-[#fbfbfb] h-[84px] relative rounded-[14px] shrink-0 w-full" data-name="Card">
      <div className="box-border content-stretch flex flex-col h-[84px] items-start overflow-clip p-[1.267px] relative rounded-[inherit] w-full">
        <HomePage9 />
      </div>
      <div aria-hidden="true" className="absolute border-[1.267px] border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[14px]" />
    </div>
  );
}

function CardTitle3() {
  return (
    <div className="absolute h-[24px] left-[16.6px] top-[11.87px] w-[218px]" data-name="CardTitle">
      <p className="absolute font-['Source_Sans_Pro:Regular',sans-serif] leading-[24px] left-0 not-italic text-[16px] text-neutral-950 text-nowrap top-[-1.77px] whitespace-pre">Regar plantas da seção A</p>
    </div>
  );
}

function CardDescription3() {
  return <div className="absolute h-[24px] left-[24px] top-[42px] w-[212.867px]" data-name="CardDescription" />;
}

function Badge6() {
  return (
    <div className="bg-[#eceef2] h-[22.533px] relative rounded-[8px] shrink-0 w-[84.8px]" data-name="Badge">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[4px] h-[22.533px] items-center justify-center overflow-clip px-[9.267px] py-[3.267px] relative rounded-[inherit] w-[84.8px]">
        <p className="font-['Source_Sans_Pro:Regular',sans-serif] leading-[16px] not-italic relative shrink-0 text-[#030213] text-[12px] text-center w-[71px]">Manutenção</p>
      </div>
      <div aria-hidden="true" className="absolute border-[1.267px] border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Badge7() {
  return (
    <div className="bg-[#00c950] h-[22.533px] relative rounded-[8px] shrink-0 w-[41.433px]" data-name="Badge">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[4px] h-[22.533px] items-center justify-center overflow-clip px-[9.267px] py-[3.267px] relative rounded-[inherit] w-[41.433px]">
        <p className="font-['Source_Sans_Pro:SemiBold',sans-serif] leading-[16px] not-italic relative shrink-0 text-[11px] text-nowrap text-white whitespace-pre">Fácil</p>
      </div>
      <div aria-hidden="true" className="absolute border-[1.267px] border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function TasksPage3() {
  return (
    <div className="absolute content-stretch flex gap-[8px] h-[23px] items-center left-[16.6px] top-[42.87px] w-[316px]" data-name="TasksPage">
      <Badge6 />
      <Badge7 />
    </div>
  );
}

function Icon7() {
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

function Text4() {
  return (
    <div className="basis-0 grow h-[22px] min-h-px min-w-px relative shrink-0" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[22px] relative w-full">
        <p className="absolute font-['Source_Sans_Pro:SemiBold',sans-serif] leading-[24px] left-0 not-italic text-[#00a63e] text-[16px] text-nowrap top-[-1.77px] whitespace-pre">50</p>
      </div>
    </div>
  );
}

function Container8() {
  return (
    <div className="absolute bg-green-50 box-border content-stretch flex gap-[4px] h-[32px] items-center left-[277.73px] px-[12px] py-0 rounded-[10px] top-[10.2px] w-[61.233px]" data-name="Container">
      <Icon7 />
      <Text4 />
    </div>
  );
}

function CardHeader3() {
  return (
    <div className="basis-0 grow h-[77px] min-h-px min-w-px relative shrink-0" data-name="CardHeader">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[77px] relative w-full">
        <CardTitle3 />
        <CardDescription3 />
        <TasksPage3 />
        <Container8 />
      </div>
    </div>
  );
}

function HomePage10() {
  return (
    <div className="h-[77px] relative shrink-0 w-[357px]" data-name="HomePage">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex h-[77px] items-start relative w-[357px]">
        <CardHeader3 />
      </div>
    </div>
  );
}

function Card6() {
  return (
    <div className="bg-[#fbfbfb] h-[78px] relative rounded-[14px] shrink-0 w-full" data-name="Card">
      <div className="box-border content-stretch flex flex-col h-[78px] items-start overflow-clip p-[1.267px] relative rounded-[inherit] w-full">
        <HomePage10 />
      </div>
      <div aria-hidden="true" className="absolute border-[1.267px] border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[14px]" />
    </div>
  );
}

function CardTitle4() {
  return (
    <div className="absolute h-[24px] left-[16.6px] top-[11.87px] w-[218px]" data-name="CardTitle">
      <p className="absolute font-['Source_Sans_Pro:Regular',sans-serif] leading-[24px] left-0 not-italic text-[16px] text-neutral-950 text-nowrap top-[-1.77px] whitespace-pre">Capinar canteiro de tomates</p>
    </div>
  );
}

function CardDescription4() {
  return <div className="absolute h-[24px] left-[24px] top-[42px] w-[212.867px]" data-name="CardDescription" />;
}

function Badge8() {
  return (
    <div className="bg-[#eceef2] h-[22.533px] relative rounded-[8px] shrink-0 w-[84.8px]" data-name="Badge">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[4px] h-[22.533px] items-center justify-center overflow-clip px-[9.267px] py-[3.267px] relative rounded-[inherit] w-[84.8px]">
        <p className="font-['Source_Sans_Pro:Regular',sans-serif] leading-[16px] not-italic relative shrink-0 text-[#030213] text-[12px] text-center w-[71px]">Manutenção</p>
      </div>
      <div aria-hidden="true" className="absolute border-[1.267px] border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Badge9() {
  return (
    <div className="bg-[#f0b100] h-[22.533px] relative rounded-[8px] shrink-0 w-[52.6px]" data-name="Badge">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[4px] h-[22.533px] items-center justify-center overflow-clip px-[9.267px] py-[3.267px] relative rounded-[inherit] w-[52.6px]">
        <p className="font-['Source_Sans_Pro:SemiBold',sans-serif] leading-[16px] not-italic relative shrink-0 text-[11px] text-nowrap text-white whitespace-pre">Médio</p>
      </div>
      <div aria-hidden="true" className="absolute border-[1.267px] border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function TasksPage4() {
  return (
    <div className="absolute content-stretch flex gap-[8px] h-[23px] items-center left-[16.6px] top-[42.87px] w-[316px]" data-name="TasksPage">
      <Badge8 />
      <Badge9 />
    </div>
  );
}

function Icon8() {
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
    <div className="basis-0 grow h-[22px] min-h-px min-w-px relative shrink-0" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[22px] relative w-full">
        <p className="absolute font-['Source_Sans_Pro:SemiBold',sans-serif] leading-[24px] left-0 not-italic text-[#00a63e] text-[16px] text-nowrap top-[-1.77px] whitespace-pre">80</p>
      </div>
    </div>
  );
}

function Container9() {
  return (
    <div className="absolute bg-green-50 box-border content-stretch flex gap-[4px] h-[32px] items-center left-[277.73px] px-[12px] py-0 rounded-[10px] top-[10.2px] w-[61.233px]" data-name="Container">
      <Icon8 />
      <Text5 />
    </div>
  );
}

function CardHeader4() {
  return (
    <div className="basis-0 grow h-[83px] min-h-px min-w-px relative shrink-0" data-name="CardHeader">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[83px] relative w-full">
        <CardTitle4 />
        <CardDescription4 />
        <TasksPage4 />
        <Container9 />
      </div>
    </div>
  );
}

function HomePage11() {
  return (
    <div className="h-[83px] relative shrink-0 w-[357px]" data-name="HomePage">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex h-[83px] items-start relative w-[357px]">
        <CardHeader4 />
      </div>
    </div>
  );
}

function Card7() {
  return (
    <div className="bg-[#fbfbfb] h-[84px] relative rounded-[14px] shrink-0 w-full" data-name="Card">
      <div className="box-border content-stretch flex flex-col h-[84px] items-start overflow-clip p-[1.267px] relative rounded-[inherit] w-full">
        <HomePage11 />
      </div>
      <div aria-hidden="true" className="absolute border-[1.267px] border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[14px]" />
    </div>
  );
}

function Frame4() {
  return (
    <div className="content-stretch flex flex-col gap-[15px] h-[513px] items-start relative shrink-0 w-full">
      <Heading2 />
      <Card3 />
      <Card4 />
      <Card5 />
      <Card6 />
      <Card7 />
    </div>
  );
}

function Heading3() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="Heading 2">
      <p className="absolute font-['Source_Serif_Pro:SemiBold',sans-serif] leading-[24px] left-[12px] not-italic text-[16px] text-neutral-950 text-nowrap top-0 whitespace-pre">Recompensas</p>
    </div>
  );
}

function CardTitle5() {
  return (
    <div className="absolute h-[24px] left-[16.6px] top-[11.87px] w-[218px]" data-name="CardTitle">
      <p className="absolute font-['Source_Sans_Pro:Regular',sans-serif] leading-[24px] left-0 not-italic text-[16px] text-neutral-950 text-nowrap top-[-1.77px] whitespace-pre">Regar plantas da seção A</p>
    </div>
  );
}

function CardDescription5() {
  return <div className="absolute h-[24px] left-[24px] top-[42px] w-[212.867px]" data-name="CardDescription" />;
}

function Badge10() {
  return (
    <div className="bg-[#eceef2] h-[22.533px] relative rounded-[8px] shrink-0 w-[84.8px]" data-name="Badge">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[4px] h-[22.533px] items-center justify-center overflow-clip px-[9.267px] py-[3.267px] relative rounded-[inherit] w-[84.8px]">
        <p className="font-['Source_Sans_Pro:Regular',sans-serif] leading-[16px] not-italic relative shrink-0 text-[#030213] text-[12px] text-center w-[71px]">Manutenção</p>
      </div>
      <div aria-hidden="true" className="absolute border-[1.267px] border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Badge11() {
  return (
    <div className="bg-[#00c950] h-[22.533px] relative rounded-[8px] shrink-0 w-[41.433px]" data-name="Badge">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[4px] h-[22.533px] items-center justify-center overflow-clip px-[9.267px] py-[3.267px] relative rounded-[inherit] w-[41.433px]">
        <p className="font-['Source_Sans_Pro:SemiBold',sans-serif] leading-[16px] not-italic relative shrink-0 text-[11px] text-nowrap text-white whitespace-pre">Fácil</p>
      </div>
      <div aria-hidden="true" className="absolute border-[1.267px] border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function TasksPage5() {
  return (
    <div className="absolute content-stretch flex gap-[8px] h-[23px] items-center left-[16.6px] top-[42.87px] w-[316px]" data-name="TasksPage">
      <Badge10 />
      <Badge11 />
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

function Text6() {
  return (
    <div className="h-[22px] relative shrink-0 w-[17.233px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[22px] relative w-[17.233px]">
        <p className="absolute font-['Source_Sans_Pro:SemiBold',sans-serif] leading-[24px] left-0 not-italic text-[#00a63e] text-[16px] text-nowrap top-[-1.77px] whitespace-pre">50</p>
      </div>
    </div>
  );
}

function Container10() {
  return (
    <div className="absolute bg-green-50 box-border content-stretch flex gap-[4px] h-[32px] items-center left-[277.73px] px-[12px] py-0 rounded-[10px] top-[10.2px]" data-name="Container">
      <Icon9 />
      <Text6 />
    </div>
  );
}

function CardHeader5() {
  return (
    <div className="basis-0 grow h-[82px] min-h-px min-w-px relative shrink-0" data-name="CardHeader">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[82px] relative w-full">
        <CardTitle5 />
        <CardDescription5 />
        <TasksPage5 />
        <Container10 />
      </div>
    </div>
  );
}

function HomePage12() {
  return (
    <div className="h-[82px] relative shrink-0 w-[357px]" data-name="HomePage">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex h-[82px] items-start relative w-[357px]">
        <CardHeader5 />
      </div>
    </div>
  );
}

function Card8() {
  return (
    <div className="bg-[#fbfbfb] h-[84px] relative rounded-[14px] shrink-0 w-full" data-name="Card">
      <div className="box-border content-stretch flex flex-col h-[84px] items-start overflow-clip p-[1.267px] relative rounded-[inherit] w-full">
        <HomePage12 />
      </div>
      <div aria-hidden="true" className="absolute border-[1.267px] border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[14px]" />
    </div>
  );
}

function CardTitle6() {
  return (
    <div className="absolute h-[24px] left-[16.6px] top-[11.87px] w-[218px]" data-name="CardTitle">
      <p className="absolute font-['Source_Sans_Pro:Regular',sans-serif] leading-[24px] left-0 not-italic text-[16px] text-neutral-950 text-nowrap top-[-1.77px] whitespace-pre">Capinar canteiro de tomates</p>
    </div>
  );
}

function CardDescription6() {
  return <div className="absolute h-[24px] left-[24px] top-[42px] w-[212.867px]" data-name="CardDescription" />;
}

function Badge12() {
  return (
    <div className="bg-[#eceef2] h-[22.533px] relative rounded-[8px] shrink-0 w-[84.8px]" data-name="Badge">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[4px] h-[22.533px] items-center justify-center overflow-clip px-[9.267px] py-[3.267px] relative rounded-[inherit] w-[84.8px]">
        <p className="font-['Source_Sans_Pro:Regular',sans-serif] leading-[16px] not-italic relative shrink-0 text-[#030213] text-[12px] text-center w-[71px]">Manutenção</p>
      </div>
      <div aria-hidden="true" className="absolute border-[1.267px] border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Badge13() {
  return (
    <div className="bg-[#f0b100] h-[22.533px] relative rounded-[8px] shrink-0 w-[52.6px]" data-name="Badge">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[4px] h-[22.533px] items-center justify-center overflow-clip px-[9.267px] py-[3.267px] relative rounded-[inherit] w-[52.6px]">
        <p className="font-['Source_Sans_Pro:SemiBold',sans-serif] leading-[16px] not-italic relative shrink-0 text-[11px] text-nowrap text-white whitespace-pre">Médio</p>
      </div>
      <div aria-hidden="true" className="absolute border-[1.267px] border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function TasksPage6() {
  return (
    <div className="absolute content-stretch flex gap-[8px] h-[23px] items-center left-[16.6px] top-[42.87px] w-[316px]" data-name="TasksPage">
      <Badge12 />
      <Badge13 />
    </div>
  );
}

function Icon10() {
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

function Text7() {
  return (
    <div className="basis-0 grow h-[22px] min-h-px min-w-px relative shrink-0" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[22px] relative w-full">
        <p className="absolute font-['Source_Sans_Pro:SemiBold',sans-serif] leading-[24px] left-0 not-italic text-[#00a63e] text-[16px] text-nowrap top-[-1.77px] whitespace-pre">80</p>
      </div>
    </div>
  );
}

function Container11() {
  return (
    <div className="absolute bg-green-50 box-border content-stretch flex gap-[4px] h-[32px] items-center left-[277.73px] px-[12px] py-0 rounded-[10px] top-[10.2px] w-[61.233px]" data-name="Container">
      <Icon10 />
      <Text7 />
    </div>
  );
}

function CardHeader6() {
  return (
    <div className="basis-0 grow h-[83px] min-h-px min-w-px relative shrink-0" data-name="CardHeader">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[83px] relative w-full">
        <CardTitle6 />
        <CardDescription6 />
        <TasksPage6 />
        <Container11 />
      </div>
    </div>
  );
}

function HomePage13() {
  return (
    <div className="h-[83px] relative shrink-0 w-[357px]" data-name="HomePage">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex h-[83px] items-start relative w-[357px]">
        <CardHeader6 />
      </div>
    </div>
  );
}

function Card9() {
  return (
    <div className="bg-[#fbfbfb] h-[84px] relative rounded-[14px] shrink-0 w-full" data-name="Card">
      <div className="box-border content-stretch flex flex-col h-[84px] items-start overflow-clip p-[1.267px] relative rounded-[inherit] w-full">
        <HomePage13 />
      </div>
      <div aria-hidden="true" className="absolute border-[1.267px] border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[14px]" />
    </div>
  );
}

function CardTitle7() {
  return (
    <div className="absolute h-[24px] left-[16.6px] top-[11.87px] w-[218px]" data-name="CardTitle">
      <p className="absolute font-['Source_Sans_Pro:Regular',sans-serif] leading-[24px] left-0 not-italic text-[16px] text-neutral-950 text-nowrap top-[-1.77px] whitespace-pre">Regar plantas da seção A</p>
    </div>
  );
}

function CardDescription7() {
  return <div className="absolute h-[24px] left-[24px] top-[42px] w-[212.867px]" data-name="CardDescription" />;
}

function Badge14() {
  return (
    <div className="bg-[#eceef2] h-[22.533px] relative rounded-[8px] shrink-0 w-[84.8px]" data-name="Badge">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[4px] h-[22.533px] items-center justify-center overflow-clip px-[9.267px] py-[3.267px] relative rounded-[inherit] w-[84.8px]">
        <p className="font-['Source_Sans_Pro:Regular',sans-serif] leading-[16px] not-italic relative shrink-0 text-[#030213] text-[12px] text-center w-[71px]">Manutenção</p>
      </div>
      <div aria-hidden="true" className="absolute border-[1.267px] border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Badge15() {
  return (
    <div className="bg-[#00c950] h-[22.533px] relative rounded-[8px] shrink-0 w-[41.433px]" data-name="Badge">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[4px] h-[22.533px] items-center justify-center overflow-clip px-[9.267px] py-[3.267px] relative rounded-[inherit] w-[41.433px]">
        <p className="font-['Source_Sans_Pro:SemiBold',sans-serif] leading-[16px] not-italic relative shrink-0 text-[11px] text-nowrap text-white whitespace-pre">Fácil</p>
      </div>
      <div aria-hidden="true" className="absolute border-[1.267px] border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function TasksPage7() {
  return (
    <div className="absolute content-stretch flex gap-[8px] h-[23px] items-center left-[16.6px] top-[42.87px] w-[316px]" data-name="TasksPage">
      <Badge14 />
      <Badge15 />
    </div>
  );
}

function Icon11() {
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
    <div className="basis-0 grow h-[22px] min-h-px min-w-px relative shrink-0" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[22px] relative w-full">
        <p className="absolute font-['Source_Sans_Pro:SemiBold',sans-serif] leading-[24px] left-0 not-italic text-[#00a63e] text-[16px] text-nowrap top-[-1.77px] whitespace-pre">50</p>
      </div>
    </div>
  );
}

function Container12() {
  return (
    <div className="absolute bg-green-50 box-border content-stretch flex gap-[4px] h-[32px] items-center left-[277.73px] px-[12px] py-0 rounded-[10px] top-[10.2px] w-[61.233px]" data-name="Container">
      <Icon11 />
      <Text8 />
    </div>
  );
}

function CardHeader7() {
  return (
    <div className="basis-0 grow h-[88px] min-h-px min-w-px relative shrink-0" data-name="CardHeader">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[88px] relative w-full">
        <CardTitle7 />
        <CardDescription7 />
        <TasksPage7 />
        <Container12 />
      </div>
    </div>
  );
}

function HomePage14() {
  return (
    <div className="h-[83px] relative shrink-0 w-[357px]" data-name="HomePage">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex h-[83px] items-start relative w-[357px]">
        <CardHeader7 />
      </div>
    </div>
  );
}

function Card10() {
  return (
    <div className="bg-[#fbfbfb] h-[84px] relative rounded-[14px] shrink-0 w-full" data-name="Card">
      <div className="box-border content-stretch flex flex-col h-[84px] items-start overflow-clip p-[1.267px] relative rounded-[inherit] w-full">
        <HomePage14 />
      </div>
      <div aria-hidden="true" className="absolute border-[1.267px] border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[14px]" />
    </div>
  );
}

function Container13() {
  return (
    <div className="content-stretch flex flex-col gap-[12px] h-[312px] items-start relative shrink-0 w-full" data-name="Container">
      <Heading3 />
      <Card8 />
      <Card9 />
      <Card10 />
    </div>
  );
}

function Frame8() {
  return <div className="absolute h-[513px] left-[16px] top-[295px] w-[359px]" />;
}

function Icon12() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Icon">
          <g id="Vector">
            <path d={svgPaths.p2bbf6680} fill="var(--fill-0, #00A63E)" />
            <path d={svgPaths.p2bbf6680} stroke="var(--stroke-0, #00A63E)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </g>
          <path d={svgPaths.p28601a80} fill="var(--fill-0, #00A63E)" id="Vector_2" stroke="var(--stroke-0, #00A63E)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function Text9() {
  return (
    <div className="h-[16px] relative shrink-0 w-[28.367px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[16px] relative w-[28.367px]">
        <p className="absolute font-['Source_Sans_Pro:Regular',sans-serif] leading-[16px] left-0 not-italic text-[#00a63e] text-[12px] text-nowrap top-[-0.6px] whitespace-pre">Início</p>
      </div>
    </div>
  );
}

function Button() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[4px] h-[68px] items-center justify-center left-0 top-0 w-[97.85px]" data-name="Button">
      <Icon12 />
      <Text9 />
    </div>
  );
}

function Icon13() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Icon">
          <path d="M13 5H21" id="Vector" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <path d="M13 12H21" id="Vector_2" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <path d="M13 19H21" id="Vector_3" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <path d="M3 17L5 19L9 15" id="Vector_4" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <path d={svgPaths.p1928c680} id="Vector_5" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function Text10() {
  return (
    <div className="h-[16px] relative shrink-0 w-[36.433px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[16px] relative w-[36.433px]">
        <p className="absolute font-['Source_Sans_Pro:Regular',sans-serif] leading-[16px] left-0 not-italic text-[#4a5565] text-[12px] text-nowrap top-[-0.6px] whitespace-pre">Tarefas</p>
      </div>
    </div>
  );
}

function Button1() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[4px] h-[68px] items-center justify-center left-[97.85px] top-0 w-[97.85px]" data-name="Button">
      <Icon13 />
      <Text10 />
    </div>
  );
}

function Icon14() {
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

function Text11() {
  return (
    <div className="h-[16px] relative shrink-0 w-[72.45px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[16px] relative w-[72.45px]">
        <p className="absolute font-['Source_Sans_Pro:Regular',sans-serif] leading-[16px] left-0 not-italic text-[#4a5565] text-[12px] text-nowrap top-[-0.6px] whitespace-pre">Recompensas</p>
      </div>
    </div>
  );
}

function Button2() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[4px] h-[68px] items-center justify-center left-[195.7px] top-0 w-[97.85px]" data-name="Button">
      <Icon14 />
      <Text11 />
    </div>
  );
}

function Icon15() {
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

function Text12() {
  return (
    <div className="h-[16px] relative shrink-0 w-[26.283px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[16px] relative w-[26.283px]">
        <p className="absolute font-['Source_Sans_Pro:Regular',sans-serif] leading-[16px] left-0 not-italic text-[#4a5565] text-[12px] text-nowrap top-[-0.6px] whitespace-pre">Perfil</p>
      </div>
    </div>
  );
}

function Button3() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[4px] h-[68px] items-center justify-center left-[293.55px] top-0 w-[97.85px]" data-name="Button">
      <Icon15 />
      <Text12 />
    </div>
  );
}

function Container14() {
  return (
    <div className="absolute h-[68px] left-0 top-[1.27px] w-[391.4px]" data-name="Container">
      <Button />
      <Button1 />
      <Button2 />
      <Button3 />
    </div>
  );
}

function Container15() {
  return <div className="absolute bg-[#00a63e] h-[4px] left-0 top-[65.27px] w-[391.4px]" data-name="Container" />;
}

function App() {
  return (
    <div className="absolute bg-[#fbfbfb] bottom-[-230.27px] h-[69.267px] left-0 w-[391.4px]" data-name="App">
      <div aria-hidden="true" className="absolute border-[1.267px_0px_0px] border-gray-200 border-solid inset-0 pointer-events-none shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)]" />
      <Container14 />
      <Container15 />
    </div>
  );
}

function Frame9() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[17px] items-center left-0 top-[61px] w-[391.4px]">
      <HomePage6 />
      <Frame4 />
      <Container13 />
      <Frame8 />
      <App />
    </div>
  );
}

export default function Home() {
  return (
    <div className="bg-gray-50 relative size-full" data-name="Home">
      <Frame9 />
    </div>
  );
}