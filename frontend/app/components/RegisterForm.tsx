'use client';
import Input from '../ui/Input'
import { RegisterDto, registerSchema } from '../auth/dtos/auth/register.dto';
import { zodResolver } from '@hookform/resolvers/zod';
import CTA from '../ui/CTA';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import { registerUser } from '@/features/auth/register';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

function RegisterForm() {
  const router = useRouter();
  const [backendError, setBackendError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterDto>({
    resolver: zodResolver(registerSchema),
  });

  async function handleOnSubmit(data: RegisterDto) {
    const response = await registerUser(data);
    if(!response.ok){
      const data = await response.json();
      if(data && data.message){
        setBackendError(data.message);
      } else {
        setBackendError("Une erreur est survenue lors de l'inscription");
      }
      return;
    }

    router.push('/auth/login');
  }

  return (
    <>
      <form 
        className="w-full max-w-96 border border-gray-200 p-4 rounded-md"
        onSubmit={handleSubmit(handleOnSubmit)}
      >
        <div className="text-center mb-6">
          <h1 className="mb-4 text-2xl font-semibold">Inscription</h1>
          <p className="text-sm text-gray-400">Inscrivez-vous sur notre plateform de chat!</p>
        </div>

        <div className="fields space-y-2">
          <div>
            <Input
              label="Nom d'utilisateur"
              type='text'
              placeholder="Nom d'utilisateur"
              {...register("username")}
            />
            {errors && errors.username && <p className="text-red-500 text-sm">{errors.username.message}</p>}
          </div>

          <div>
            <Input
              label="Email"
              type='email'
              placeholder="johndoe@example.com"
              {...register("email")}
            />
            {errors && errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
          </div>

          <div>
            <Input
              label="Mot de passe"
              type='password'
              placeholder="Mot de passe"
              {...register("password")}
            />
            {errors && errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
          </div>

          <div>
            <Input
              label="Confirmation du mot de passe"
              type='password'
              placeholder="Confirmation du mot de passe"
              {...register("confirmation")}
            />
          
            {errors && errors.confirmation && <p className="text-red-500 text-sm">{errors.confirmation.message}</p>}
          </div>
        </div>

        <div>
          <CTA
            type="button"
            color="primary"
            text="S'inscrire"

          />
        </div>
        
        
        {backendError && 
          <div className="mt-4">
            <p className="text-red-500 text-sm">{backendError}</p>
          </div>
        }
      </form>
      <p className="mt-2 text-gray-400">Vous possédez déjà un compte ? <Link href="/auth/login" className="font-medium text-black">Se connecter</Link></p>
    </>
  )
}

export default RegisterForm