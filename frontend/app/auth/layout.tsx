import React from 'react'

interface AuthLayoutProps {
  children: React.ReactNode;
}
function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-3">
      {children}
    </main>
  )
}

export default AuthLayout