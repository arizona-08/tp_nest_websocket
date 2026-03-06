'use client'
import { Cloud, Home, LogOut, MessageCircle, User, Users } from 'lucide-react'
import BurgerMenu from './BurgerMenu'
import { useBurgerMenuStore } from '../stores/BurgerMenuStore'
import Link from 'next/link'

function AppSidebar() {
  const navLinks = [
    { name: 'Messages', href: '/chat?type=messages' },
    { name: 'Groupes', href: '/chat?type=groups' },
    { name: 'Profile', href: '/profile' },
  ]

  function pickIcon(name: string) {
    switch (name) {
      case 'Home':
        return <Home />
      case 'Messages':
        return <MessageCircle />
      case 'Groupes':
        return <Users />
      case 'Profile':
        return <User />
      default:
        return ''
    }
  }

  const isBurgerMenuOpen = useBurgerMenuStore((state) => state.isOpen);


  return (
    <div className="relative bg-gray-800 text-white w-full p-4 flex items-center justify-between lg:w-60 lg:flex-col lg:items-start">
      <h1 className="font-semibold text-xl">NestChat</h1>
      <div className="lg:hidden">
        <BurgerMenu />
      </div>
      {/* mobile nav */}
      <nav className={`absolute top-full left-0 w-full bg-gray-700 px-4 lg:static lg:w-auto lg:bg-transparent lg:p-0 ${isBurgerMenuOpen ? 'h-fit py-4' : 'h-0 overflow-hidden py-0'} transition-all duration-300 lg:h-auto lg:hidden`}>
        <ul className="space-y-2">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a href={link.href} className="hover:bg-gray-600 p-2 rounded flex items-center gap-2">
                {pickIcon(link.name)} {link.name}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* desktop nav */}
      <nav className="hidden lg:flex lg:flex-col lg:justify-between lg:flex-1 mt-4 w-full">
        <div className="w-full">
          <ul className="space-y-2">
            <li><Link href="/chat?type=messages" className="flex gap-2 hover:bg-gray-600 p-2 rounded "><MessageCircle/> Messages</Link></li>
            <li><Link href="/chat?type=groups" className="flex gap-2 hover:bg-gray-600 p-2 rounded "><Users /> Groupes</Link></li>
            
          </ul>
        </div>

        <div>
          <ul>
            <li><Link href="/profile" className="flex gap-2 hover:bg-gray-600 p-2 rounded "><User />Profile</Link></li>
          </ul>
        </div>
      </nav>
    </div>
  )
}

export default AppSidebar