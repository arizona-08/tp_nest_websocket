import React from 'react'
import Input from '../ui/Input'

function ProfileForm() {
  return (
    <form>
      <div>
        <Input
          label="Nom d'utilisateur"
          name="username"
        />
      </div>
    </form>
  )
}

export default ProfileForm