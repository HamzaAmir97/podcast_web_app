import React from 'react'
import Image from 'next/image'

const AppHeader = () => {
  return (
    <div className='fixed left-0  '>
    <div
    className='flex 
    items-center justify-between 
    w-[1120px]
    h-[104px]
    p-4 bg-[#FFFFFF] '
    >   


   {/* logo and top bar */}
        <div className='flex items-center justify-between p-8 gap-5  '>

            <Image
            src="/top.svg"
            alt="Logo"
            width={163}
            height={40}
            />
       
          <span className='w-[24px] h-[0px] rotate-90  bg-[#E6E8EB] border-1  ' />
      
        <p className='font-[14px]  text-[#808080]'>O melhor para você ouvir, sempre</p>
        </div>
        
           
           {/* date */}
            <p className='font-[14px]  px-8 text-[#808080]'>Qui, 8 Abril</p>
        </div>
    </div>
    
  )
}

export default AppHeader