import React from 'react'
import AppSidebar from '../components/AppSidebar'

interface AppLayoutProps {
  children: React.ReactNode
}

function AppLayout({ children }: AppLayoutProps) {
  return (
    <>
      <div className="flex flex-col lg:flex-row h-screen">
        {/* sidebar container */}
        <AppSidebar />

        {/* main container */}
        <main className="flex overflow-hidden flex-1 w-full h-screen overflow-y-scroll">
          {children}
        </main>
      </div>
      
    </>
  )
}

export default AppLayout