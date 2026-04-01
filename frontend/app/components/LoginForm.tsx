'use client';
import Input from '../ui/Input'
import { LoginDto, loginSchema } from '../auth/dtos/auth/login.dto';
import { zodResolver } from '@hookform/resolvers/zod';
import CTA from '../ui/CTA';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import { loginUser } from '@/features/auth/login';
import { useAuthStore } from '../stores/AuthStore';
import { useRouter } from 'next/navigation';

function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginDto>({
    resolver: zodResolver(loginSchema),
  });

  const setUser = useAuthStore((state) => state.setUser);
  const router = useRouter();

  async function handleOnSubmit(data: LoginDto) {
    console.log(data);
    const response = await loginUser(data);
    if(response.ok){
      const responseData = await response.json();
      console.log("Login successful:", responseData);
      setUser(responseData.user);
      router.push("/chat?type=private");
    } else {
      console.log("Login failed");
    }
  }

  return (
    <>
      <form 
        className="w-full max-w-96 border border-gray-200 p-4 rounded-md"
        onSubmit={handleSubmit(handleOnSubmit)}
      >
        <div className="text-center mb-6">
          <h1 className="mb-4 text-2xl font-semibold">Connexion</h1>
          <p className="text-sm text-gray-400">Connectez-vous pour avoir accès au chat!</p>
        </div>

        <div className="fields">
          <Input
            label="Nom d'utilisateur"
            type='text'
            placeholder="Nom d'utilisateur"
            {...register("username")}
          />

          <Input
            label="Mot de passe"
            type='password'
            placeholder="Mot de passe"
            {...register("password")}
          />
        </div>

        <div>
          <CTA
            type="button"
            color="primary"
            text="se connecter"

          />
        </div>
      </form>
      <p className="mt-2 text-gray-400">Pas encore de compte ? <Link href="/auth/register" className="font-medium text-black">S'inscrire</Link></p>
    </>
  )
}

export default LoginForm