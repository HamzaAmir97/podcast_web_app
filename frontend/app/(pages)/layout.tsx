import React from 'react'
import AppHeader from '@/components/Core/AppHeader'

const layout = ({children}: {children: React.ReactNode}) => {
  return (
    <div>
        <AppHeader />
        {children}
    </div>
  )
}

export default layout