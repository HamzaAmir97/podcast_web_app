import React from 'react'
import AppHeader from '@/components/Core/AppHeader'
import SideBarPlayer from '@/components/Core/SideBarPlayer'

const layout = ({children}: {children: React.ReactNode}) => {
  return (
    <div className='w-screen h-screen '>
    <div className='flex flex-col md:flex-row h-screen w-screen '>
        <div className=' '>
        <AppHeader />
 
        {children}
        </div>

        <SideBarPlayer />
        
    </div>
    </div>
  )
}

export default layout