import React from 'react'
import Image from 'next/image'
const SideBarPlayer = () => {
  return (
    <div className='fixed right-0 '>
    <div
    className='relative w-[424px] p-10 h-[820px] bg-primary
    flex flex-col gap-10 items-center  
    '
    >

        {/* logo */}
        <div className='pb-15'>
    <Image  
    src="/Top.png"
    alt="Logo"
    width={169}
    height={36}
    />

    </div>
    

    {/* podcast player */}
    <div className=' absolute top-[187px] left-[64px] w-[296px] h-[346px]  bg-[#9F75FF]  border-dashed border-[2px]
     rounded-[24px] flex justify-center items-center border-[#E6E8EB]  opacity-30
    '>

  

    </div>

    <p className=' absolute top-[340px] left-[136px]     text-white text-center '>Selecione um <br/>
podcast para ouvir</p>
    </div>



    {/* podcast player controls */}
    {/* <div className='w-[296px] h-[346px]  bg-[#9F75FF]  border-dashed border-[2px]
     rounded-[24px] flex justify-center items-center border-[#E6E8EB]  opacity-50
    '>

  

    </div> */}


    </div>
  )
}

export default SideBarPlayer