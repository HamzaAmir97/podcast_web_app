import Image from 'next/image'
import React from 'react'
import PlayIcon from './playIcon'

const  EpisodeCard = ({title ="O que é um bom código?"
    ,description ="Diego e Richard",
    date ="12 de outubro de 2025",
    imgURL ="/Images/image (4).png" 
}: {title: string, description: string, date: string, imgURL: string}) => {
  
  
    return (


    <div className=' relative w-[432px] h-[136px] bg-[#FFFFFF]
    flex p-4 gap-2
    rounded-[24px]
    border-[1px]  border-[#E6E8EB]
    '>


        {/* image */}
        <div>
<Image
src={imgURL}
alt="Logo"
width={96}
height={96}
/>
        </div>
       
 {/* title and description */}
       <div className='flex flex-col gap-2'>
<p className='text-[#494D4B]'>{title}</p>

<div className='flex  flex-col gap-2'>
<p className='text-[#808080]'>{description}</p>
<p className='text-[#808080]'>{date}</p>
</div>

       </div>

   

       <div className='absolute top-15 right-5'>
      <PlayIcon/>
       </div>
    </div>
  )
}

export default EpisodeCard