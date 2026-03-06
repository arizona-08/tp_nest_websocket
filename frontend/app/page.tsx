import Image from "next/image";
import CTA from "./ui/CTA";

export default function Home() {
  return (
    <div>
      <h1>Bienvenue sur NestChat</h1>
      <p>Bienvenue dans notre application de chat en temps réel !</p>
      <div className="actions">
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
