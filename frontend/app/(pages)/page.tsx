import EpisodeCard from '@/components/home/EpisodeCard'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { PODCASTS } from '@/lib/constants'
import PlayIcon from '@/components/home/playIcon'
import Image from 'next/image'
import React from 'react'

 const page = () => {
  return (
    <div className=' h-screen w-full flex flex-col gap-5 bg-white p-15 '  >
  


  {/* header */}
    <div className='flex flex-col gap-5'>
      <h1 className='text-3xl text-[#494D4B] font-bold'>Ultimos lançamentos</h1>
  
  <div className='flex gap-8'>
   <EpisodeCard title="O que é um bom código?" description="Diego e Richard" date="12 de outubro de 2025" imgURL="/Images/image (4).png"/>
   <EpisodeCard title="Como começar na programaçã...?" description="Tiago, Diego e Pellizzetti" date="8 Jan 21 - 35:40" imgURL="/Images/image (3).png"/>
   </div>

</div>


  {/*body */}
   
   
     <div className='flex flex-col gap-5'>
       <h1 className='text-3xl text-[#494D4B] font-bold'>Todos os episódios</h1>

       <Table>
         <TableHeader>
           <TableRow>
             <TableHead className='text-[#ABA8B2]'>Nome</TableHead>
             <TableHead className='text-[#ABA8B2]'>Descrição</TableHead>
             <TableHead className='text-[#ABA8B2]'>Data</TableHead>
             <TableHead className='text-[#ABA8B2]'>Duração</TableHead>
             </TableRow>
         </TableHeader>
         <TableBody>
  {PODCASTS.map((podcast ,index) => (
    <TableRow key={podcast.id}>
      <TableCell>
        <div className='flex gap-2'>
          <Image src={podcast.cover} alt="" width={40} height={40} />
          <p className='font-bold text-[#494D4B]'>{podcast.title}</p>
          
        </div>
        
        </TableCell>
      <TableCell className='text-[#AFB2B1]'>{podcast.members.join(", ")}</TableCell>
      <TableCell className='text-[#AFB2B1]'>{podcast.dateLabel}</TableCell>
      <TableCell className='text-[#AFB2B1]'>
        <div className='flex justify-between  gap-2'>
        {podcast.duration}
       
       {/* play icon */}
<div className='w-[32px] h-[32px] rounded-[10px]  border-[1px] border-[#E6E8EB] cursor-pointer'>
     <Image
    src="/icons/play__green_arrow.svg"
    alt="Logo"
    width={40}
    height={40}
    />
    
    </div>
        </div>
        </TableCell>
    </TableRow>
  ))}
           
           
         </TableBody>
       </Table>
     </div>
    </div>
  )
}

export default page
