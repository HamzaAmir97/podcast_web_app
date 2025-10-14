import React from 'react'
import Image from 'next/image'

const AppHeader = () => {
  return (
    <div
    className='flex 
    items-center justify-between 
    w-[1016px]
    h-[104px]
    p-4 bg-[#E6E8EB] '
    >   


   {/* logo and top bar */}
        <div className='flex items-center justify-between p-8  '>

            <Image
            src="/top.svg"
            alt="Logo"
            width={163}
            height={40}
            />
       
          <span className='w-[24px h-[5px]  bg-[black] border-1  '/>
        </div>
        
           
           {/* date */}
            <p className='font-[14px]  text-[#808080]'>Qui, 8 Abril</p>
        </div>
  )
}

export default AppHeader