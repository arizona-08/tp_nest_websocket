import PasswordForm from '@/app/components/PasswordForm'
import ProfileForm from '@/app/components/ProfileForm'
import React from 'react'

function ProfilePage() {
  return (
    <div className="p-5 w-full ">
      <h1 className="text-xl font-semibold mb-3">Profile</h1>
      <p>Personnalisez votre profile</p>
      

      <div className="flex flex-col md:flex-row gap-12 mt-6 md:items-start">
      <ProfileForm />
      <PasswordForm />
      </div>
    </div>
  )
}

export default ProfilePage