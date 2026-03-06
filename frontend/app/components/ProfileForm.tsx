'use client';
import React from 'react'
import Input from '../ui/Input'
import { HexColorPicker } from 'react-colorful'
import CTA from '../ui/CTA';

function ProfileForm() {
  const [usernameColor, setUsernameColor] = React.useState("#000000")

  return (
    <form className="mt-4 md:mt-0">
      <h3 className="text-xl font-semibold mb-2">Informations personnelles</h3>
      <div className="w-full max-w-120 flex flex-col gap-2 ">
        <div className="md:flex md:flex-row md:gap-4">
          <div className="flex-1">
            <Input
              label="Nom d'utilisateur"
              name="username"
              placeholder="nom d'utilisateur"
              style={{ color: usernameColor, borderColor: usernameColor }}
            />
          </div>
          <div className="flex-1">
            <Input
              label="Email"
              name="email"
              placeholder="johndoe@example.com"
            />
          </div>
        </div>

        <div>
          <Input
            label="Couleur du nom d'utilisateur"
            name="usernameColor"
            placeholder="#000000"
            value={usernameColor}
          />
          <HexColorPicker color={usernameColor} onChange={setUsernameColor} />
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