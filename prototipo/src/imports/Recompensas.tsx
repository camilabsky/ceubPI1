import svgPaths from "./svg-sabvwxxvv8";
import imgImageWithFallback from "figma:asset/fbdf7e4fceb8d114be2c90b3ef7fa0883b9906cc.png";
import imgImageWithFallback1 from "figma:asset/c3731677e7ef71b41cd62350a95da93b972c913b.png";

function Heading1() {
  return (
    <div className="h-[24px] relative shrink-0 w-[96.517px]" data-name="Heading 1">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[24px] relative w-[96.517px]">
        <p className="absolute font-['Source_Serif_Pro:SemiBold',sans-serif] leading-[24px] left-[8px] not-italic text-[16px] text-neutral-950 text-nowrap top-0 whitespace-pre">Recompensas</p>
      </div>
    </div>
  );
}

function Icon() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.p30c75d80} id="Vector" stroke="var(--stroke-0, #00A63E)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p138d3ef2} id="Vector_2" stroke="var(--stroke-0, #00A63E)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M4.16667 17.5H15.8333" id="Vector_3" stroke="var(--stroke-0, #00A63E)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Text() {
  return (
    <div className="h-[20px] relative shrink-0 w-[27px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[20px] relative w-[27px]">
        <p className="absolute font-['Source_Sans_Pro:SemiBold',sans-serif] leading-[24px] left-[-0.4px] not-italic text-[#00a63e] text-[16px] top-[-2px] w-[37px]">{`450 `}</p>
      </div>
    </div>
  );
}

function Container() {
  return (
    <div className="bg-green-50 h-[36px] relative rounded-[10px] shrink-0 w-[92px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[8px] h-[36px] items-center pl-[16px] pr-0 py-0 relative w-[92px]">
        <Icon />
        <Text />
      </div>
    </div>
  );
}

function Container1() {
  return (
    <div className="content-stretch flex h-[32px] items-center justify-between relative shrink-0 w-full" data-name="Container">
      <Heading1 />
      <Container />
    </div>
  );
}

function CardTitle() {
  return (
    <div className="absolute h-[28px] left-[24px] top-[20px] w-[309px]" data-name="CardTitle">
      <p className="absolute font-['Source_Sans_Pro:Regular',sans-serif] h-[23px] leading-[24px] left-0 not-italic text-[17px] text-neutral-950 top-[-1px] w-[221px]">Cesta de Vegetais Orgânicos</p>
    </div>
  );
}

function CardDescription() {
  return (
    <div className="absolute h-[24px] left-[24px] top-[50px] w-[308.867px]" data-name="CardDescription">
      <p className="absolute font-['Source_Sans_Pro:Regular',sans-serif] leading-[24px] left-0 not-italic text-[#717182] text-[14px] text-nowrap top-[-1.77px] whitespace-pre">Cesta com vegetais frescos da horta</p>
    </div>
  );
}

function CardHeader() {
  return (
    <div className="absolute h-[88px] left-px top-[180px] w-[357px]" data-name="CardHeader">
      <CardTitle />
      <CardDescription />
    </div>
  );
}

function Badge() {
  return (
    <div className="bg-green-100 h-[22.533px] relative rounded-[8px] shrink-0 w-[66.5px]" data-name="Badge">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[4px] h-[22.533px] items-center justify-center overflow-clip px-[9.267px] py-[3.267px] relative rounded-[inherit] w-[66.5px]">
        <p className="font-['Source_Sans_Pro:Regular',sans-serif] leading-[16px] not-italic relative shrink-0 text-[#008236] text-[12px] text-nowrap whitespace-pre">Produtos</p>
      </div>
      <div aria-hidden="true" className="absolute border-[1.267px] border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Text1() {
  return (
    <div className="h-[23px] relative shrink-0 w-[80px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[23px] relative w-[80px]">
        <div className="absolute flex flex-col font-['Source_Sans_Pro:Regular',sans-serif] h-[25px] justify-center leading-[0] left-[40.5px] not-italic text-[#4a5565] text-[14px] text-center top-[10.73px] translate-x-[-50%] translate-y-[-50%] w-[81px]">
          <p className="leading-[20px]">5 disponíveis</p>
        </div>
      </div>
    </div>
  );
}

function RewardsPage() {
  return (
    <div className="content-stretch flex h-[22.533px] items-center justify-between relative shrink-0 w-full" data-name="RewardsPage">
      <Badge />
      <Text1 />
    </div>
  );
}

function CardContent() {
  return (
    <div className="absolute box-border content-stretch flex flex-col gap-[8px] h-[23px] items-start left-px px-[24px] py-0 top-[277px] w-[357px]" data-name="CardContent">
      <RewardsPage />
    </div>
  );
}

function Icon1() {
  return (
    <div className="absolute left-[115.77px] size-[16px] top-[10px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p223a4880} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M8 5.33333V14" id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p1beeb960} id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p3bc9c900} id="Vector_4" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button() {
  return (
    <div className="absolute bg-[#00a63e] h-[36px] left-[25.27px] rounded-[8px] top-[324px] w-[308.867px]" data-name="Button">
      <Icon1 />
      <p className="absolute font-['Source_Sans_Pro:Regular',sans-serif] leading-[20px] left-[139.77px] not-italic text-[14px] text-nowrap text-white top-[6.5px] whitespace-pre">Resgatar</p>
    </div>
  );
}

function ImageWithFallback() {
  return (
    <div className="absolute h-[180px] left-[-1px] rounded-tl-[14px] rounded-tr-[14px] top-[-1px] w-[359px]" data-name="ImageWithFallback">
      <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none rounded-tl-[14px] rounded-tr-[14px] size-full" src={imgImageWithFallback} />
    </div>
  );
}

function ImageWithFallback1() {
  return (
    <div className="absolute h-[180px] left-0 rounded-tl-[10px] rounded-tr-[10px] top-0 w-[358px]" data-name="ImageWithFallback">
      <ImageWithFallback />
    </div>
  );
}

function Icon2() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p36b1d900} id="Vector" stroke="var(--stroke-0, #3D6D4F)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p1a051232} id="Vector_2" stroke="var(--stroke-0, #3D6D4F)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M3.33333 14H12.6667" id="Vector_3" stroke="var(--stroke-0, #3D6D4F)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Text2() {
  return (
    <div className="basis-0 grow h-[24px] min-h-px min-w-px relative shrink-0" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[24px] relative w-full">
        <div className="absolute flex flex-col font-['Source_Sans_Pro:SemiBold',sans-serif] h-[30px] justify-center leading-[0] left-[12.48px] not-italic text-[#3d6d4f] text-[16px] text-center top-[12px] translate-x-[-50%] translate-y-[-50%] w-[25px]">
          <p className="leading-[24px]">200</p>
        </div>
      </div>
    </div>
  );
}

function Container2() {
  return (
    <div className="absolute bg-white box-border content-stretch flex gap-[4px] h-[32px] items-center justify-center left-[279.02px] px-[12px] py-0 rounded-[10px] top-[8px] w-[69.85px]" data-name="Container">
      <Icon2 />
      <Text2 />
    </div>
  );
}

function RewardsPage1() {
  return (
    <div className="absolute h-[177px] left-px top-px w-[357px]" data-name="RewardsPage">
      <ImageWithFallback1 />
      <Container2 />
    </div>
  );
}

function Card() {
  return (
    <div className="bg-[#fbfbfb] h-[380px] relative rounded-[14px] shrink-0 w-[359px]" data-name="Card">
      <div aria-hidden="true" className="absolute border-[1.267px] border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[14px]" />
      <CardHeader />
      <CardContent />
      <Button />
      <RewardsPage1 />
    </div>
  );
}

function CardTitle1() {
  return (
    <div className="absolute h-[24px] left-[24px] top-[24px] w-[308.867px]" data-name="CardTitle">
      <p className="absolute font-['Source_Sans_Pro:Regular',sans-serif] leading-[24px] left-0 not-italic text-[16px] text-neutral-950 text-nowrap top-[-1.77px] whitespace-pre">Kit de Ferramentas de Jardim</p>
    </div>
  );
}

function CardDescription1() {
  return (
    <div className="absolute h-[24px] left-[24px] top-[50px] w-[308.867px]" data-name="CardDescription">
      <p className="absolute font-['Source_Sans_Pro:Regular',sans-serif] leading-[24px] left-0 not-italic text-[#717182] text-[14px] text-nowrap top-[-1.77px] whitespace-pre">Kit básico com pá, rastelo e luvas</p>
    </div>
  );
}

function CardHeader1() {
  return (
    <div className="absolute h-[90px] left-px top-[180px] w-[356.867px]" data-name="CardHeader">
      <CardTitle1 />
      <CardDescription1 />
    </div>
  );
}

function Badge1() {
  return (
    <div className="bg-blue-100 h-[22.533px] relative rounded-[8px] shrink-0 w-[83.783px]" data-name="Badge">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[4px] h-[22.533px] items-center justify-center overflow-clip px-[9.267px] py-[3.267px] relative rounded-[inherit] w-[83.783px]">
        <p className="font-['Source_Sans_Pro:Regular',sans-serif] leading-[16px] not-italic relative shrink-0 text-[#1447e6] text-[12px] text-nowrap whitespace-pre">Ferramentas</p>
      </div>
      <div aria-hidden="true" className="absolute border-[1.267px] border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Text3() {
  return (
    <div className="h-[23px] relative shrink-0 w-[80px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[23px] relative w-[80px]">
        <div className="absolute flex flex-col font-['Source_Sans_Pro:Regular',sans-serif] h-[23px] justify-center leading-[0] left-[40.5px] not-italic text-[#4a5565] text-[14px] text-center top-[11.73px] translate-x-[-50%] translate-y-[-50%] w-[81px]">
          <p className="leading-[20px]">2 disponíveis</p>
        </div>
      </div>
    </div>
  );
}

function RewardsPage2() {
  return (
    <div className="content-stretch flex h-[22.533px] items-center justify-between relative shrink-0 w-full" data-name="RewardsPage">
      <Badge1 />
      <Text3 />
    </div>
  );
}

function CardContent1() {
  return (
    <div className="absolute box-border content-stretch flex flex-col gap-[8px] h-[23px] items-start left-px px-[24px] py-0 top-[269px] w-[357px]" data-name="CardContent">
      <RewardsPage2 />
    </div>
  );
}

function Icon3() {
  return (
    <div className="absolute left-[77.82px] size-[16px] top-[10px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p18f7f580} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p4317f80} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button1() {
  return (
    <div className="absolute bg-[#030213] h-[36px] left-[25.27px] opacity-50 rounded-[8px] top-[316px] w-[308.867px]" data-name="Button">
      <Icon3 />
      <p className="absolute font-['Source_Sans_Pro:Regular',sans-serif] leading-[20px] left-[101.82px] not-italic text-[14px] text-nowrap text-white top-[6.5px] whitespace-pre">Moedas insuficientes</p>
    </div>
  );
}

function ImageWithFallback2() {
  return (
    <div className="absolute h-[181px] left-[-1px] rounded-tl-[14px] rounded-tr-[14px] top-[-1px] w-[359px]" data-name="ImageWithFallback">
      <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none rounded-tl-[14px] rounded-tr-[14px] size-full" src={imgImageWithFallback1} />
    </div>
  );
}

function RewardsPage3() {
  return (
    <div className="absolute h-[180px] left-px top-px w-[358px]" data-name="RewardsPage">
      <ImageWithFallback2 />
    </div>
  );
}

function ImageWithFallback3() {
  return <div className="absolute h-[180px] left-0 rounded-tl-[10px] rounded-tr-[10px] top-[0.07px] w-[357px]" data-name="ImageWithFallback" />;
}

function Icon4() {
  return (
    <div className="relative shrink-0 size-[32px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
        <g id="Icon">
          <path d={svgPaths.p1c36ff40} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.66667" />
          <path d={svgPaths.p2aeaac0} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.66667" />
        </g>
      </svg>
    </div>
  );
}

function Container3() {
  return (
    <div className="absolute bg-[rgba(0,0,0,0.4)] content-stretch flex h-[180px] items-center justify-center left-[-1px] rounded-tl-[14px] rounded-tr-[14px] top-0 w-[359px]" data-name="Container">
      <Icon4 />
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

function Text4() {
  return (
    <div className="basis-0 grow h-[24px] min-h-px min-w-px relative shrink-0" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[24px] relative w-full">
        <p className="absolute font-['Source_Sans_Pro:SemiBold',sans-serif] leading-[24px] left-[-0.02px] not-italic text-[#00a63e] text-[16px] text-nowrap top-0 whitespace-pre">500</p>
      </div>
    </div>
  );
}

function Container4() {
  return (
    <div className="absolute bg-white box-border content-stretch flex gap-[4px] h-[33px] items-center left-[279px] px-[12px] py-0 rounded-[10px] top-[8.07px] w-[70px]" data-name="Container">
      <Icon5 />
      <Text4 />
    </div>
  );
}

function RewardsPage4() {
  return (
    <div className="absolute h-[180px] left-px top-[-0.07px] w-[358px]" data-name="RewardsPage">
      <ImageWithFallback3 />
      <Container3 />
      <Container4 />
    </div>
  );
}

function Card1() {
  return (
    <div className="bg-[#fbfbfb] h-[370px] opacity-60 relative rounded-[14px] shrink-0 w-[359px]" data-name="Card">
      <div aria-hidden="true" className="absolute border-[1.267px] border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[14px]" />
      <CardHeader1 />
      <CardContent1 />
      <Button1 />
      <RewardsPage3 />
      <RewardsPage4 />
    </div>
  );
}

function CardTitle2() {
  return (
    <div className="absolute h-[22px] left-[24px] top-[24px] w-[309px]" data-name="CardTitle">
      <p className="absolute font-['Source_Sans_Pro:Regular',sans-serif] leading-[24px] left-0 not-italic text-[16px] text-neutral-950 text-nowrap top-[-1.77px] whitespace-pre">Mudas de Ervas Aromáticas</p>
    </div>
  );
}

function CardDescription2() {
  return (
    <div className="absolute h-[24px] left-[24px] top-[52px] w-[309px]" data-name="CardDescription">
      <p className="absolute font-['Source_Sans_Pro:Regular',sans-serif] leading-[24px] left-0 not-italic text-[#717182] text-[16px] text-nowrap top-[-1.77px] whitespace-pre">5 mudas de manjericão, tomilho e alecrim</p>
    </div>
  );
}

function CardHeader2() {
  return (
    <div className="absolute h-[92px] left-px top-[177px] w-[357px]" data-name="CardHeader">
      <CardTitle2 />
      <CardDescription2 />
    </div>
  );
}

function Badge2() {
  return (
    <div className="bg-purple-100 h-[22.533px] relative rounded-[8px] shrink-0 w-[56.3px]" data-name="Badge">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[4px] h-[22.533px] items-center justify-center overflow-clip px-[9.267px] py-[3.267px] relative rounded-[inherit] w-[56.3px]">
        <p className="font-['Source_Sans_Pro:Regular',sans-serif] leading-[16px] not-italic relative shrink-0 text-[#8200db] text-[12px] text-nowrap whitespace-pre">Plantas</p>
      </div>
      <div aria-hidden="true" className="absolute border-[1.267px] border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Text5() {
  return (
    <div className="h-[20px] relative shrink-0 w-[80.017px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[20px] relative w-[80.017px]">
        <p className="absolute font-['Source_Sans_Pro:Regular',sans-serif] leading-[20px] left-0 not-italic text-[#4a5565] text-[14px] top-[-1.5px] w-[81px]">8 disponíveis</p>
      </div>
    </div>
  );
}

function RewardsPage5() {
  return (
    <div className="content-stretch flex h-[22.533px] items-center justify-between relative shrink-0 w-full" data-name="RewardsPage">
      <Badge2 />
      <Text5 />
    </div>
  );
}

function CardContent2() {
  return (
    <div className="absolute box-border content-stretch flex flex-col gap-[8px] h-[23px] items-start left-0 px-[24px] py-0 top-[274px] w-[357px]" data-name="CardContent">
      <RewardsPage5 />
    </div>
  );
}

function Icon6() {
  return (
    <div className="absolute left-[115.77px] size-[16px] top-[10px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p223a4880} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M8 5.33333V14" id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p1beeb960} id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p17fa7280} id="Vector_4" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button2() {
  return (
    <div className="absolute bg-[#00a63e] h-[36px] left-[25px] rounded-[8px] top-[322px] w-[308.867px]" data-name="Button">
      <Icon6 />
      <p className="absolute font-['Source_Sans_Pro:Regular',sans-serif] leading-[20px] left-[139.77px] not-italic text-[14px] text-nowrap text-white top-[6.5px] whitespace-pre">Resgatar</p>
    </div>
  );
}

function ImageWithFallback4() {
  return (
    <div className="absolute h-[180px] left-0 rounded-tl-[10px] rounded-tr-[10px] top-0 w-[357px]" data-name="ImageWithFallback">
      <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none rounded-tl-[10px] rounded-tr-[10px] size-full" src={imgImageWithFallback} />
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

function Text6() {
  return (
    <div className="basis-0 grow h-[24px] min-h-px min-w-px relative shrink-0" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[24px] relative w-full">
        <p className="absolute font-['Source_Sans_Pro:SemiBold',sans-serif] leading-[24px] left-0 not-italic text-[#00a63e] text-[16px] text-nowrap top-[-1.77px] whitespace-pre">150</p>
      </div>
    </div>
  );
}

function Container5() {
  return (
    <div className="absolute bg-white box-border content-stretch flex gap-[4px] h-[32px] items-center left-[279.02px] px-[12px] py-0 rounded-[10px] top-[8px] w-[69.85px]" data-name="Container">
      <Icon7 />
      <Text6 />
    </div>
  );
}

function RewardsPage6() {
  return (
    <div className="absolute h-[178px] left-px top-px w-[357px]" data-name="RewardsPage">
      <ImageWithFallback4 />
      <Container5 />
    </div>
  );
}

function Card2() {
  return (
    <div className="bg-[#fbfbfb] h-[380px] relative rounded-[14px] shrink-0 w-[359px]" data-name="Card">
      <div aria-hidden="true" className="absolute border-[1.267px] border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[14px]" />
      <CardHeader2 />
      <CardContent2 />
      <Button2 />
      <RewardsPage6 />
    </div>
  );
}

function CardTitle3() {
  return (
    <div className="absolute h-[24px] left-[24px] top-[24px] w-[308.867px]" data-name="CardTitle">
      <p className="absolute font-['Source_Sans_Pro:Regular',sans-serif] leading-[24px] left-0 not-italic text-[16px] text-neutral-950 text-nowrap top-[-1.77px] whitespace-pre">Workshop de Compostagem</p>
    </div>
  );
}

function CardDescription3() {
  return (
    <div className="absolute h-[48px] left-[24px] top-[54px] w-[308.867px]" data-name="CardDescription">
      <p className="absolute font-['Source_Sans_Pro:Regular',sans-serif] leading-[24px] left-0 not-italic text-[#717182] text-[16px] top-[-1.77px] w-[294px]">Acesso ao workshop sobre compostagem doméstica</p>
    </div>
  );
}

function CardHeader3() {
  return (
    <div className="absolute h-[114px] left-[1.27px] top-[185.27px] w-[356.867px]" data-name="CardHeader">
      <CardTitle3 />
      <CardDescription3 />
    </div>
  );
}

function Badge3() {
  return (
    <div className="bg-[#ffedd4] h-[22.533px] relative rounded-[8px] shrink-0 w-[68.783px]" data-name="Badge">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[4px] h-[22.533px] items-center justify-center overflow-clip px-[9.267px] py-[3.267px] relative rounded-[inherit] w-[68.783px]">
        <p className="font-['Source_Sans_Pro:Regular',sans-serif] leading-[16px] not-italic relative shrink-0 text-[#ca3500] text-[12px] text-nowrap whitespace-pre">Educação</p>
      </div>
      <div aria-hidden="true" className="absolute border-[1.267px] border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Text7() {
  return (
    <div className="h-[20px] relative shrink-0 w-[87.567px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[20px] relative w-[87.567px]">
        <p className="absolute font-['Source_Sans_Pro:Regular',sans-serif] leading-[20px] left-0 not-italic text-[#4a5565] text-[14px] top-[-1.5px] w-[88px]">10 disponíveis</p>
      </div>
    </div>
  );
}

function RewardsPage7() {
  return (
    <div className="h-[22.533px] relative shrink-0 w-full" data-name="RewardsPage">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex h-[22.533px] items-center justify-between relative w-full">
          <Badge3 />
          <Text7 />
        </div>
      </div>
    </div>
  );
}

function RewardsPage8() {
  return (
    <div className="h-[16px] relative shrink-0 w-full" data-name="RewardsPage">
      <p className="absolute font-['Source_Sans_Pro:Regular',sans-serif] leading-[16px] left-0 not-italic text-[#6a7282] text-[12px] text-nowrap top-[-0.6px] whitespace-pre">Jardim da Praça Verde</p>
    </div>
  );
}

function CardContent3() {
  return (
    <div className="absolute box-border content-stretch flex flex-col gap-[8px] h-[58.533px] items-start left-[1.27px] px-[24px] py-0 top-[323.27px] w-[356.867px]" data-name="CardContent">
      <RewardsPage7 />
      <RewardsPage8 />
    </div>
  );
}

function Icon8() {
  return (
    <div className="absolute left-[115.77px] size-[16px] top-[10px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p223a4880} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M8 5.33333V14" id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p1beeb960} id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p17fa7280} id="Vector_4" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button3() {
  return (
    <div className="absolute bg-[#00a63e] h-[36px] left-[25.27px] rounded-[8px] top-[405.8px] w-[308.867px]" data-name="Button">
      <Icon8 />
      <p className="absolute font-['Source_Sans_Pro:Regular',sans-serif] leading-[20px] left-[139.77px] not-italic text-[14px] text-nowrap text-white top-[6.5px] whitespace-pre">Resgatar</p>
    </div>
  );
}

function ImageWithFallback5() {
  return (
    <div className="absolute h-[160px] left-0 rounded-tl-[10px] rounded-tr-[10px] top-0 w-[356.867px]" data-name="ImageWithFallback">
      <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none rounded-tl-[10px] rounded-tr-[10px] size-full" src={imgImageWithFallback1} />
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

function Text8() {
  return (
    <div className="basis-0 grow h-[24px] min-h-px min-w-px relative shrink-0" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[24px] relative w-full">
        <p className="absolute font-['Source_Sans_Pro:SemiBold',sans-serif] leading-[24px] left-0 not-italic text-[#00a63e] text-[16px] text-nowrap top-[-1.77px] whitespace-pre">300</p>
      </div>
    </div>
  );
}

function Container6() {
  return (
    <div className="absolute bg-white box-border content-stretch flex gap-[4px] h-[32px] items-center left-[279.02px] px-[12px] py-0 rounded-[3.40282e+38px] top-[8px] w-[69.85px]" data-name="Container">
      <Icon9 />
      <Text8 />
    </div>
  );
}

function RewardsPage9() {
  return (
    <div className="absolute h-[160px] left-[1.27px] top-[1.27px] w-[356.867px]" data-name="RewardsPage">
      <ImageWithFallback5 />
      <Container6 />
    </div>
  );
}

function Card3() {
  return (
    <div className="bg-[#fbfbfb] h-[467.067px] relative rounded-[14px] shrink-0 w-[359.4px]" data-name="Card">
      <div aria-hidden="true" className="absolute border-[1.267px] border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[14px]" />
      <CardHeader3 />
      <CardContent3 />
      <Button3 />
      <RewardsPage9 />
    </div>
  );
}

function CardTitle4() {
  return (
    <div className="absolute h-[24px] left-[24px] top-[24px] w-[308.867px]" data-name="CardTitle">
      <p className="absolute font-['Source_Sans_Pro:Regular',sans-serif] leading-[24px] left-0 not-italic text-[16px] text-neutral-950 text-nowrap top-[-1.77px] whitespace-pre">Sacola Ecológica Personalizada</p>
    </div>
  );
}

function CardDescription4() {
  return (
    <div className="absolute h-[24px] left-[24px] top-[54px] w-[308.867px]" data-name="CardDescription">
      <p className="absolute font-['Source_Sans_Pro:Regular',sans-serif] leading-[24px] left-0 not-italic text-[#717182] text-[16px] text-nowrap top-[-1.77px] whitespace-pre">Sacola reutilizável com logo da horta</p>
    </div>
  );
}

function CardHeader4() {
  return (
    <div className="absolute h-[90px] left-[1.27px] top-[185.27px] w-[356.867px]" data-name="CardHeader">
      <CardTitle4 />
      <CardDescription4 />
    </div>
  );
}

function Badge4() {
  return (
    <div className="bg-pink-100 h-[22.533px] relative rounded-[8px] shrink-0 w-[74.533px]" data-name="Badge">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[4px] h-[22.533px] items-center justify-center overflow-clip px-[9.267px] py-[3.267px] relative rounded-[inherit] w-[74.533px]">
        <p className="font-['Source_Sans_Pro:Regular',sans-serif] leading-[16px] not-italic relative shrink-0 text-[#c6005c] text-[12px] text-nowrap whitespace-pre">Acessórios</p>
      </div>
      <div aria-hidden="true" className="absolute border-[1.267px] border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Text9() {
  return (
    <div className="h-[20px] relative shrink-0 w-[87.567px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[20px] relative w-[87.567px]">
        <p className="absolute font-['Source_Sans_Pro:Regular',sans-serif] leading-[20px] left-0 not-italic text-[#4a5565] text-[14px] top-[-1.5px] w-[88px]">15 disponíveis</p>
      </div>
    </div>
  );
}

function RewardsPage10() {
  return (
    <div className="h-[22.533px] relative shrink-0 w-full" data-name="RewardsPage">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex h-[22.533px] items-center justify-between relative w-full">
          <Badge4 />
          <Text9 />
        </div>
      </div>
    </div>
  );
}

function RewardsPage11() {
  return (
    <div className="h-[16px] relative shrink-0 w-full" data-name="RewardsPage">
      <p className="absolute font-['Source_Sans_Pro:Regular',sans-serif] leading-[16px] left-0 not-italic text-[#6a7282] text-[12px] text-nowrap top-[-0.6px] whitespace-pre">Horta Orgânica Vila Nova</p>
    </div>
  );
}

function CardContent4() {
  return (
    <div className="absolute box-border content-stretch flex flex-col gap-[8px] h-[58.533px] items-start left-[1.27px] px-[24px] py-0 top-[299.27px] w-[356.867px]" data-name="CardContent">
      <RewardsPage10 />
      <RewardsPage11 />
    </div>
  );
}

function Icon10() {
  return (
    <div className="absolute left-[115.77px] size-[16px] top-[10px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p223a4880} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M8 5.33333V14" id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p1beeb960} id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p17fa7280} id="Vector_4" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button4() {
  return (
    <div className="absolute bg-[#00a63e] h-[36px] left-[25.27px] rounded-[8px] top-[381.8px] w-[308.867px]" data-name="Button">
      <Icon10 />
      <p className="absolute font-['Source_Sans_Pro:Regular',sans-serif] leading-[20px] left-[139.77px] not-italic text-[14px] text-nowrap text-white top-[6.5px] whitespace-pre">Resgatar</p>
    </div>
  );
}

function ImageWithFallback6() {
  return (
    <div className="absolute h-[160px] left-0 rounded-tl-[10px] rounded-tr-[10px] top-0 w-[356.867px]" data-name="ImageWithFallback">
      <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none rounded-tl-[10px] rounded-tr-[10px] size-full" src={imgImageWithFallback1} />
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

function Text10() {
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
    <div className="absolute bg-white box-border content-stretch flex gap-[4px] h-[32px] items-center left-[279.02px] px-[12px] py-0 rounded-[3.40282e+38px] top-[8px] w-[69.85px]" data-name="Container">
      <Icon11 />
      <Text10 />
    </div>
  );
}

function RewardsPage12() {
  return (
    <div className="absolute h-[160px] left-[1.27px] top-[1.27px] w-[356.867px]" data-name="RewardsPage">
      <ImageWithFallback6 />
      <Container7 />
    </div>
  );
}

function Card4() {
  return (
    <div className="bg-[#fbfbfb] h-[443.067px] relative rounded-[14px] shrink-0 w-[359.4px]" data-name="Card">
      <div aria-hidden="true" className="absolute border-[1.267px] border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[14px]" />
      <CardHeader4 />
      <CardContent4 />
      <Button4 />
      <RewardsPage12 />
    </div>
  );
}

function CardTitle5() {
  return (
    <div className="absolute h-[24px] left-[24px] top-[24px] w-[308.867px]" data-name="CardTitle">
      <p className="absolute font-['Source_Sans_Pro:Regular',sans-serif] leading-[24px] left-0 not-italic text-[16px] text-neutral-950 text-nowrap top-[-1.77px] whitespace-pre">Cesta Premium de Vegetais</p>
    </div>
  );
}

function CardDescription5() {
  return (
    <div className="absolute h-[24px] left-[24px] top-[54px] w-[308.867px]" data-name="CardDescription">
      <p className="absolute font-['Source_Sans_Pro:Regular',sans-serif] leading-[24px] left-0 not-italic text-[#717182] text-[16px] text-nowrap top-[-1.77px] whitespace-pre">Cesta especial com vegetais selecionados</p>
    </div>
  );
}

function CardHeader5() {
  return (
    <div className="absolute h-[90px] left-[1.27px] top-[185.27px] w-[356.867px]" data-name="CardHeader">
      <CardTitle5 />
      <CardDescription5 />
    </div>
  );
}

function Badge5() {
  return (
    <div className="bg-green-100 h-[22.533px] relative rounded-[8px] shrink-0 w-[66.5px]" data-name="Badge">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[4px] h-[22.533px] items-center justify-center overflow-clip px-[9.267px] py-[3.267px] relative rounded-[inherit] w-[66.5px]">
        <p className="font-['Source_Sans_Pro:Regular',sans-serif] leading-[16px] not-italic relative shrink-0 text-[#008236] text-[12px] text-nowrap whitespace-pre">Produtos</p>
      </div>
      <div aria-hidden="true" className="absolute border-[1.267px] border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Text11() {
  return (
    <div className="h-[20px] relative shrink-0 w-[80.017px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[20px] relative w-[80.017px]">
        <p className="absolute font-['Source_Sans_Pro:Regular',sans-serif] leading-[20px] left-0 not-italic text-[#4a5565] text-[14px] top-[-1.5px] w-[81px]">3 disponíveis</p>
      </div>
    </div>
  );
}

function RewardsPage13() {
  return (
    <div className="content-stretch flex h-[22.533px] items-center justify-between relative shrink-0 w-full" data-name="RewardsPage">
      <Badge5 />
      <Text11 />
    </div>
  );
}

function RewardsPage14() {
  return (
    <div className="h-[16px] relative shrink-0 w-full" data-name="RewardsPage">
      <p className="absolute font-['Source_Sans_Pro:Regular',sans-serif] leading-[16px] left-0 not-italic text-[#6a7282] text-[12px] text-nowrap top-[-0.6px] whitespace-pre">Horta Comunitária Centro</p>
    </div>
  );
}

function CardContent5() {
  return (
    <div className="absolute box-border content-stretch flex flex-col gap-[8px] h-[58.533px] items-start left-[1.27px] px-[24px] py-0 top-[299.27px] w-[356.867px]" data-name="CardContent">
      <RewardsPage13 />
      <RewardsPage14 />
    </div>
  );
}

function Icon12() {
  return (
    <div className="absolute left-[77.82px] size-[16px] top-[10px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p18f7f580} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p4317f80} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button5() {
  return (
    <div className="absolute bg-[#030213] h-[36px] left-[25.27px] opacity-50 rounded-[8px] top-[381.8px] w-[308.867px]" data-name="Button">
      <Icon12 />
      <p className="absolute font-['Source_Sans_Pro:Regular',sans-serif] leading-[20px] left-[101.82px] not-italic text-[14px] text-nowrap text-white top-[6.5px] whitespace-pre">Moedas insuficientes</p>
    </div>
  );
}

function ImageWithFallback7() {
  return <div className="absolute h-[160px] left-0 rounded-tl-[10px] rounded-tr-[10px] top-0 w-[356.867px]" data-name="ImageWithFallback" />;
}

function Icon13() {
  return (
    <div className="relative shrink-0 size-[32px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
        <g id="Icon">
          <path d={svgPaths.p1c36ff40} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.66667" />
          <path d={svgPaths.p2aeaac0} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.66667" />
        </g>
      </svg>
    </div>
  );
}

function Container8() {
  return (
    <div className="absolute bg-[rgba(0,0,0,0.4)] content-stretch flex h-[160px] items-center justify-center left-0 rounded-tl-[10px] rounded-tr-[10px] top-0 w-[356.867px]" data-name="Container">
      <Icon13 />
    </div>
  );
}

function Icon14() {
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

function Text12() {
  return (
    <div className="basis-0 grow h-[24px] min-h-px min-w-px relative shrink-0" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[24px] relative w-full">
        <p className="absolute font-['Source_Sans_Pro:SemiBold',sans-serif] leading-[24px] left-0 not-italic text-[#00a63e] text-[16px] text-nowrap top-[-1.77px] whitespace-pre">800</p>
      </div>
    </div>
  );
}

function Container9() {
  return (
    <div className="absolute bg-white box-border content-stretch flex gap-[4px] h-[32px] items-center left-[279.02px] px-[12px] py-0 rounded-[3.40282e+38px] top-[8px] w-[69.85px]" data-name="Container">
      <Icon14 />
      <Text12 />
    </div>
  );
}

function RewardsPage15() {
  return (
    <div className="absolute h-[160px] left-[1.27px] top-[1.27px] w-[356.867px]" data-name="RewardsPage">
      <ImageWithFallback7 />
      <Container8 />
      <Container9 />
    </div>
  );
}

function Card5() {
  return (
    <div className="bg-[#fbfbfb] h-[443.067px] opacity-60 relative rounded-[14px] shrink-0 w-[359.4px]" data-name="Card">
      <div aria-hidden="true" className="absolute border-[1.267px] border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[14px]" />
      <CardHeader5 />
      <CardContent5 />
      <Button5 />
      <RewardsPage15 />
    </div>
  );
}

function Container10() {
  return (
    <div className="content-stretch flex flex-col gap-[29px] items-start relative shrink-0 w-full" data-name="Container">
      <Card />
      <Card1 />
      <Card2 />
      <Card3 />
      <Card4 />
      <Card5 />
    </div>
  );
}

function RewardsPage16() {
  return (
    <div className="absolute bg-gray-50 content-stretch flex flex-col gap-[16px] h-[2842.4px] items-start left-[16px] top-[60px] w-[359.4px]" data-name="RewardsPage">
      <Container1 />
      <Container10 />
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

function Text13() {
  return (
    <div className="h-[16px] relative shrink-0 w-[28.367px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[16px] relative w-[28.367px]">
        <p className="absolute font-['Source_Sans_Pro:Regular',sans-serif] leading-[16px] left-0 not-italic text-[#4a5565] text-[12px] text-nowrap top-[-0.6px] whitespace-pre">Início</p>
      </div>
    </div>
  );
}

function Button6() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[4px] h-[68px] items-center justify-center left-0 top-0 w-[97.85px]" data-name="Button">
      <Icon15 />
      <Text13 />
    </div>
  );
}

function Icon16() {
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

function Text14() {
  return (
    <div className="h-[16px] relative shrink-0 w-[36.433px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[16px] relative w-[36.433px]">
        <p className="absolute font-['Source_Sans_Pro:Regular',sans-serif] leading-[16px] left-0 not-italic text-[#4a5565] text-[12px] text-nowrap top-[-0.6px] whitespace-pre">Tarefas</p>
      </div>
    </div>
  );
}

function Button7() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[4px] h-[68px] items-center justify-center left-[97.85px] top-0 w-[97.85px]" data-name="Button">
      <Icon16 />
      <Text14 />
    </div>
  );
}

function Icon17() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Icon">
          <path d={svgPaths.p15a56410} fill="var(--fill-0, #00A63E)" id="Vector" stroke="var(--stroke-0, #00A63E)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <g id="Vector_2">
            <path d="M12 8V21Z" fill="var(--fill-0, #00A63E)" />
            <path d="M12 8V21" stroke="var(--stroke-0, #00A63E)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </g>
          <g id="Vector_3">
            <path d={svgPaths.pb845c00} fill="var(--fill-0, #00A63E)" />
            <path d={svgPaths.pb845c00} stroke="var(--stroke-0, #00A63E)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </g>
          <g id="Vector_4">
            <path d={svgPaths.p31fb2b00} fill="var(--fill-0, #00A63E)" />
            <path d={svgPaths.p31fb2b00} stroke="var(--stroke-0, #00A63E)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </g>
        </g>
      </svg>
    </div>
  );
}

function Text15() {
  return (
    <div className="h-[16px] relative shrink-0 w-[72.45px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[16px] relative w-[72.45px]">
        <p className="absolute font-['Source_Sans_Pro:Regular',sans-serif] leading-[16px] left-0 not-italic text-[#00a63e] text-[12px] text-nowrap top-[-0.6px] whitespace-pre">Recompensas</p>
      </div>
    </div>
  );
}

function Button8() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[4px] h-[68px] items-center justify-center left-[195.7px] top-0 w-[97.85px]" data-name="Button">
      <Icon17 />
      <Text15 />
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

function Text16() {
  return (
    <div className="h-[16px] relative shrink-0 w-[26.283px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[16px] relative w-[26.283px]">
        <p className="absolute font-['Source_Sans_Pro:Regular',sans-serif] leading-[16px] left-0 not-italic text-[#4a5565] text-[12px] text-nowrap top-[-0.6px] whitespace-pre">Perfil</p>
      </div>
    </div>
  );
}

function Button9() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[4px] h-[68px] items-center justify-center left-[293.55px] top-0 w-[97.85px]" data-name="Button">
      <Icon18 />
      <Text16 />
    </div>
  );
}

function Container11() {
  return (
    <div className="absolute h-[68px] left-0 top-[1.27px] w-[391.4px]" data-name="Container">
      <Button6 />
      <Button7 />
      <Button8 />
      <Button9 />
    </div>
  );
}

function Container12() {
  return <div className="absolute bg-[#00a63e] h-[4px] left-0 top-[65.27px] w-[391.4px]" data-name="Container" />;
}

function App() {
  return (
    <div className="absolute bg-[#fbfbfb] h-[69.267px] left-0 top-[2877px] w-[391.4px]" data-name="App">
      <div aria-hidden="true" className="absolute border-[1.267px_0px_0px] border-gray-200 border-solid inset-0 pointer-events-none shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)]" />
      <Container11 />
      <Container12 />
    </div>
  );
}

export default function Recompensas() {
  return (
    <div className="bg-gray-50 relative size-full" data-name="Recompensas">
      <App />
      <RewardsPage16 />
    </div>
  );
}