import Image from 'next/image'
import React from 'react'

const playIcon = () => {
  return (
    <div className='w-[40px] h-[40px] rounded-[10px]  border-[1px] border-[#E6E8EB] cursor-pointer'>
     <Image
    src="/icons/play__green_arrow.svg"
    alt="Logo"
    width={40}
    height={40}
    />
    
    </div>
  )
}

export default playIcon