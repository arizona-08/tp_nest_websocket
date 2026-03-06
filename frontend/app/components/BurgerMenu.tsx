'use client'
import { useBurgerMenuStore } from '../stores/BurgerMenuStore'

function BurgerMenu() {
  const isBurgerMenuOpen = useBurgerMenuStore((state) => state.isOpen);
  const toggleBurgerMenu = useBurgerMenuStore((state) => state.toggleMenu);

  return (
    <div className="w-5 h-2 relative cursor-pointer" onClick={toggleBurgerMenu}>
      <span className={`w-full h-0.5 bg-white block rounded-md absolute  ${isBurgerMenuOpen ? 'rotate-45 top-1/2' : 'top-0'} transition-all duration-150`}></span>
      <span className={`w-1/2 h-0.5 bg-white block rounded-md absolute  ${isBurgerMenuOpen ? 'w-full -rotate-45 top-1/2' : 'top-full right-0'} transition-all duration-150`}></span>
    </div>
  )
}

export default BurgerMenu