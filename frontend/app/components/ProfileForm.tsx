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
    const response = await updateProfile(data);
    if(!response.ok){
      console.error("Erreur lors de la mise à jour du profil");
      return;
    } else {
      const data = await response.json();
      setUser(data.user);
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
          </div>
          <div className="flex-1">
            <Input
              label="Email"
              placeholder="johndoe@example.com"
              {...register("email")}
            />
          </div>
        </div>

        <div>
          <Input
            label="Couleur du nom d'utilisateur"
            placeholder="#000000"
            {...register("usernameColor")}
            onChange={(event) => {
              const newColorValue = event.target.value;
              setUsernameColor(newColorValue); // Met à jour le style visuel
              setValue("usernameColor", newColorValue); // Met à jour les données du formulaire
            }}
          />
          <Controller
            control={control}
            name="usernameColor"
            render={({ field }) => (
              <div className="flex items-center gap-4">
                <HexColorPicker 
                  color={field.value} 
                  onChange={(newColor) => {
                    field.onChange(newColor); // 1. Met à jour React Hook Form
                    setUsernameColor(newColor); // 2. Met à jour votre useState pour le style
                  }} 
                />
                <div 
                  className="w-12 h-12 rounded-full border shadow-sm" 
                  style={{ backgroundColor: field.value }}
                />
              </div>
            )}
          />
          {/* <HexColorPicker color={usernameColor} onChange={setUsernameColor} /> */}
        </div>
      </div>

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