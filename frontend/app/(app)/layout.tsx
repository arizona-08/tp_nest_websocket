'use client';
import React, { useEffect } from 'react'
import AppSidebar from '../components/AppSidebar'
import { me } from '@/features/auth/me';
import { useAuthStore } from '../stores/AuthStore';

interface AppLayoutProps {
  children: React.ReactNode
}

function AppLayout({ children }: AppLayoutProps) {
  const setUser = useAuthStore((state) => state.setUser);

  useEffect(() => {
    async function fetchAuthUser(){
      const response = await me();
      if(response.ok){
        const data = await response.json();
        console.log("Authenticated user:", data.user);
        setUser(data.user);
      } else {
        console.log("No authenticated user");
      }
    }
    fetchAuthUser();
  }, []);

  return (
    <>
      <div className="flex flex-col lg:flex-row h-screen">
        <AppSidebar />

        <main className="flex overflow-hidden flex-1 w-full h-screen overflow-y-scroll">
          {children}
        </main>
      </div>
      
    </>
  )
}

export default AppLayout