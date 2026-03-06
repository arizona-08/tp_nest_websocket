import Link from 'next/link';
import React from 'react'

interface CTAProps {
  type: "button" | "link";
  text: string;
  href?: string;
  color: "primary" | "secondary";
  onClick?: (e?: React.MouseEvent<HTMLButtonElement>) => void;
}

function CTA({ type, href, color, onClick, text }: CTAProps) {

  const colorClass = color === "primary" ? "bg-black text-white" : "bg-white text-black border border-black";
  const baseClass = "inline-block font-medium px-4 py-2 rounded transition-colors duration-300";
  if (type === "button") {
    return (
      <button className={`${baseClass} ${colorClass}`} onClick={onClick}>
        {text}
      </button>
    );
  }

  return (
    <Link href={href as string} className={`${baseClass} ${colorClass}`}>
      {text}
    </Link>
  );
}

export default CTA