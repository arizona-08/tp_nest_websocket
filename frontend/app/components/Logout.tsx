'use client';
import { logoutUser } from '@/features/auth/logout';
import CTA from '../ui/CTA'
import { useRouter } from 'next/navigation';

function Logout() {
  const router = useRouter();

  async function handleLogout(){
    const response = await logoutUser();
    if(!response.ok){
      console.error("Erreur lors de la déconnexion");
    } else {
      router.push("/auth/login");
    }
  }
  return (
    <>
      <CTA
        type='button'
        color='danger'
        text='Déconnexion'
        onClick={() => handleLogout()}
       />
    </>
  )
}

export default Logout