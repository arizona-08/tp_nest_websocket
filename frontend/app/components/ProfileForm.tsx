'use client';
import React, { useEffect } from 'react'
import Input from '../ui/Input'
import { HexColorPicker } from 'react-colorful'
import CTA from '../ui/CTA';
import { useAuthStore } from '../stores/AuthStore';
import { Controller, useForm } from 'react-hook-form';
import { PersonalInfoDto, PersonalInfoSchema } from '../(app)/profile/dtos/personal-info.dto';
import { zodResolver } from '@hookform/resolvers/zod';
import { updateProfile } from '@/features/profile/updateProfile';
import { set } from 'zod';

function ProfileForm() {
  const authUser = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const [usernameColor, setUsernameColor] = React.useState(authUser?.usernameColor || '#000000');
  const [backendError, setBackendError] = React.useState<string | null>(null);
  const [backendSuccessMessage, setBackendSuccessMessage] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors },
  } = useForm<PersonalInfoDto>({
    resolver: zodResolver(PersonalInfoSchema),
    defaultValues: {
      username: '',
      email: '',
      usernameColor: '#000000',
    }
  });

  useEffect(() => {
    if (authUser) {
      reset({
        username: authUser.username,
        email: authUser.email,
        usernameColor: authUser.usernameColor,
      });
      
      setUsernameColor(authUser.usernameColor || '#000000');
    }
  }, [authUser, reset]);

  async function handleOnSubmit(data: PersonalInfoDto) {
    setBackendError(null);
    setBackendSuccessMessage(null);
    const response = await updateProfile(data);
    if(!response.ok){
      const data = await response.json();
      setBackendError(data.message);
      return;
    } else {
      const data = await response.json();
      setUser(data.user);
      setBackendSuccessMessage(data.message);
    }
  }

  return (
    <form className="mt-4 md:mt-0" onSubmit={handleSubmit(handleOnSubmit)}>
      <h3 className="text-xl font-semibold mb-2">Informations personnelles</h3>
      <div className="w-full max-w-120 flex flex-col gap-2 ">
        <div className="md:flex md:flex-row md:gap-4">
          <div className="flex-1">
            <Input
              label="Nom d'utilisateur"
              placeholder="nom d'utilisateur"
              style={{ color: usernameColor, borderColor: usernameColor }}
              {...register("username")}
            />
            {errors && errors.username && <p className="text-red-500 my-2">{errors.username.message}</p>}
          </div>
          <div className="flex-1">
            <Input
              label="Email"
              placeholder="johndoe@example.com"
              {...register("email")}
            />
            {errors && errors.email && <p className="text-red-500 my-2">{errors.email.message}</p>}
          </div>
        </div>

        <div>
          <Input
            label="Couleur du nom d'utilisateur"
            placeholder="#000000"
            {...register("usernameColor")}
            onChange={(event) => {
              const newColorValue = event.target.value;
              setUsernameColor(newColorValue); 
              setValue("usernameColor", newColorValue); 
            }}
          />
          {errors && errors.usernameColor && <p className="text-red-500 my-2">{errors.usernameColor.message}</p>}
          
          <Controller
            control={control}
            name="usernameColor"
            render={({ field }) => (
              <div className="flex items-center gap-4">
                <HexColorPicker 
                  color={field.value} 
                  onChange={(newColor) => {
                    field.onChange(newColor); 
                    setUsernameColor(newColor); 
                  }} 
                />
                <div 
                  className="w-12 h-12 rounded-full border shadow-sm" 
                  style={{ backgroundColor: field.value }}
                />
              </div>
            )}
          />
        </div>
      </div>
      
      {backendError && <p className="text-red-500 my-2">{backendError}</p>}
      {backendSuccessMessage && <p className="text-green-500 my-2">{backendSuccessMessage}</p>}
      <div className="mt-6">
        <CTA
          type="button"
          color="primary"
          text="Enregistrer"
        />
      </div>
    </form>
  )
}

export default ProfileForm