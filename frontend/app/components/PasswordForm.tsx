'use client';
import CTA from '../ui/CTA';
import Input from '../ui/Input'

function PasswordForm() {
  return (
    <form className="w-full max-w-120 mt-3 md:mt-0">
      <h3 className="text-xl font-semibold mb-2">Sécurité</h3>
      <div>
        <Input
          label="Mot de passe actuel"
          name="currentPassword"
          type="password"
          placeholder="Mot de passe actuel"
        />

        <Input
          label="Nouveau mot de passe"
          name="newPassword"
          type="password"
          placeholder="Nouveau mot de passe"
        />
      </div>
      <div>
        <CTA
          type="button"
          color="primary"
          text="Changer le mot de passe"
        />
      </div>
    </form>
  )
}

export default PasswordForm