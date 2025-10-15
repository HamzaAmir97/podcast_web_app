import Image from "next/image";
import Link from "next/link";
import React from "react";

const page = ({ params }: { params: { id: string } }) => {
  return (
    <div className="w-full h-screen flex  flex-col gap-2  items-center  p-8  ">
      {/* podcast header */}
      <div className="relative">
        <Image
          src="/images/image (2).png"
          alt="Logo"
          width={656}
          height={160}
        />
        
        {/*play button */}
        <div className='w-[40px] h-[40px] rounded-[10px]  cursor-pointer bg-secondary
        absolute top-[40%] -right-[15px] 
        flex items-center justify-center
        '>
             <Image
            src="/icons/play_arrow.png"
            alt="Logo"
            width={24}
            height={24}
            />
            
            </div>

        
        {/* back button */}
        <Link href="/">
        <div className='w-[40px] h-[40px] rounded-[10px]  cursor-pointer bg-primary
        absolute top-[40%] -left-[15px] 
        flex items-center justify-center
        '>
             <Image
            src="/icons/back.svg"
            alt="Logo"
            width={6.67}
            height={13.33}
            className=" "
            />
            
            </div>
            </Link>
      </div>
 
   
      {/* podcast content */}

      <div className="w-[642px] h-[379px] flex flex-col gap-5">
        <h1 className="text-[32px] text-[#494D4B] font-bold">
          Como começar na programação em <br /> 2021 do jeito certo
        </h1>

        <div className="flex gap-5 items-center">
          <p className="text-[#808080]">Diego e Richard</p>
          <span className="w-[4px] h-[4px] rounded-full bg-[#DDDDDD]" />
          <p className="text-[#808080]">8 Jan 21</p>
          <span className="w-[4px] h-[4px] rounded-full bg-[#DDDDDD]" />
          <p className="text-[#808080]">35:40</p>
        </div>

         {/* separator */}
           <span className="w-[623px] h-[0px] rounded-full border-[1px] border-[#E6E8EB]" />
          <article className="text-[16px] text-[#494D4B]">

            Nesse episódio do Faladev, Diego Fernandes se reúne com João Pedro Schmitz, Bruno Lemos e Diego Haz, para discutir sobre a importância da contribuição open source e quais desafios circulam na comunidade.<br /><br /> 

A gente passa a maior parte do tempo escrevendo código. Agora chegou o momento de falar sobre isso. Toda semana reunimos profissionais da tecnologia para discutir sobre tudo que circula na órbita da programação. O Faladev é um podcast original Rocketseat.
          </article>
      </div>




    </div>
  );
};

export default page;
