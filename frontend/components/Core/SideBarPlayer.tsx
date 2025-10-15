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

    {/* podcast player container */}
    <div>
    <div className=' absolute top-[160px] left-[70px] w-[296px] h-[346px]  bg-[#9F75FF]  border-dashed border-[2px]
     rounded-[24px] flex justify-center items-center border-[#E6E8EB]  opacity-30
    '>

  

    </div>

    <p className=' absolute top-[320px] left-[155px]     text-white text-center '>Selecione um <br/>
podcast para ouvir</p>
     

    </div>



  {/* podcast player progress and controls */}
    
    
     <div>
     {/* podcast player progress */}
     <div className='absolute top-[550px] left-[80px]
     flex justify-center items-center gap-3
     '>
       <label className='text-white'>00:00</label>
       <input type="range"
       min={0}
       max={100}
       className='w-[174px] h-[4px]  bg-[#9F75FF] [accent-color:#13c2a3]'
       />
       <label className='text-white'>00:00</label>
     </div>

    {/* podcast player controls */}
    <div className='
    absolute
    top-[610px] left-[90px]
    w-[256px] h-[64px]   
      flex justify-center items-center gap-5  opacity-50
   cursor-pointer
    '>
  
    <Image
    src="/icons/shuffle.png"
    alt="Logo"
    width={24}
    height={24}
    className=' hover:bg-[#6F48C9] hover:rounded-[16px]'
    />
    <Image
    src="/icons/play_right_arrow.png"
    alt="Logo"
    width={24}
    height={24}
    className=' hover:bg-[#6F48C9] hover:rounded-[16px]'
    />
    <div className='
    flex justify-center items-center
    w-[64px] h-[64px] rounded-[16px] bg-[#9164FA] hover:bg-[#6F48C9] hover:rounded-[16px]'>
    <Image
    src="/icons/play_arrow.png"
    alt="Logo"
    width={32}
    height={32}
    className=' '
    />
    </div>
    <Image
    src="/icons/play_left_arrow.png"
    alt="Logo"
    width={24}
    height={24}
    className=' hover:bg-[#6F48C9] hover:rounded-[16px]'
    />
    <Image
    src="/icons/repeat.svg"
    alt="Logo"
    width={24}
    height={24}
    className=' hover:bg-[#6F48C9] hover:rounded-[16px]'
    />

    </div>
 
    </div>
 


 </div>


    </div>
  )
}

export default SideBarPlayer