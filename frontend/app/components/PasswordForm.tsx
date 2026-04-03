'use client';
import { useForm } from 'react-hook-form';
import CTA from '../ui/CTA';
import Input from '../ui/Input'
import { ChangePasswordDto, ChangePasswordSchema } from '../(app)/profile/dtos/password-change.dto';
import { zodResolver } from '@hookform/resolvers/zod';
import { changePassword } from '@/features/profile/changePassword';
import { useState } from 'react';

function PasswordForm() {
  const [backendError, setBackendError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ChangePasswordDto>({
    resolver: zodResolver(ChangePasswordSchema)
  });

  async function handleOnSubmit(data: ChangePasswordDto){
    const response = await changePassword(data);
    if(!response.ok){
      const error = await response.json();
      setBackendError(error.message);
      return;
    }
  }

  return (
    <form className="w-full max-w-120 mt-3 md:mt-0" onSubmit={handleSubmit(handleOnSubmit)}>
      <h3 className="text-xl font-semibold mb-2">Sécurité</h3>
      <div>
        <Input
          label="Mot de passe actuel"
          type="password"
          placeholder="Mot de passe actuel"
          {...register("currentPassword")}
        />

        <Input
          label="Nouveau mot de passe"
          type="password"
          placeholder="Nouveau mot de passe"
          {...register("newPassword")}  
        />
      </div>
      {backendError && <p className="text-red-500 my-2">{backendError}</p>}

      <div>
        <CTA
          type="button"
          color="danger"
          text="Changer le mot de passe"
        />
      </div>
    </form>
  )
}

export default PasswordForm