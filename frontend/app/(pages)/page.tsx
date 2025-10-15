import EpisodeCard from '@/components/home/EpisodeCard'
import React from 'react'

 const page = () => {
  return (
    <div className=' h-full w-full flex flex-col gap-5 bg-white p-12 '  >
      <h1 className='text-3xl text-[#494D4B] font-bold'>Ultimos lançamentos</h1>
  
  <div className='flex gap-4'>
   <EpisodeCard title="O que é um bom código?" description="Diego e Richard" date="12 de outubro de 2025" imgURL="/Images/image (4).png"/>
   <EpisodeCard title="Como começar na programaçã...?" description="Tiago, Diego e Pellizzetti" date="8 Jan 21 - 35:40" imgURL="/Images/image (3).png"/>
   </div>
    </div>
  )
}

export default page
