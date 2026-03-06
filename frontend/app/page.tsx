import Image from "next/image";
import CTA from "./ui/CTA";

export default function Home() {
  return (
    <div className="min-h-screen w-screen flex flex-col items-center justify-center gap-6">
      <h1 className="text-3xl font-semibold">Bienvenue sur NestChat</h1>
      <p className="text-lg text-gray-600">Une simple application de chat en temps réel</p>
      <div className="actions flex items-center gap-2">
        <CTA
          type="link"
          color="primary"
          href="/auth/register"
          text="S'inscrire"
        />

        <CTA
          type="link"
          color="secondary"
          href="/auth/login"
          text="Se connecter"
        />
      </div>
    </div>
  );
}
