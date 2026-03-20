'use client';
import Link from 'next/link';
import React from 'react'

interface CTAProps {
  type: "button" | "link";
  text: string;
  href?: string;
  color: "primary" | "secondary" | "danger";
  onClick?: (e?: React.MouseEvent<HTMLButtonElement>) => void;
}

function CTA({ type, href, color, onClick, text }: CTAProps) {

  
  const bgClasses = {
    primary: "bg-black text-white",
    secondary: "bg-white text-black border border-black hover:bg-black hover:text-white",
    danger: "bg-red-500 text-white border border-red-500"
  }
  const baseClass = "inline-block font-medium px-4 py-2 rounded transition-colors duration-300";
  if (type === "button") {
    return (
      <button className={`${baseClass} ${bgClasses[color]}`} onClick={onClick}>
        {text}
      </button>
    );
  }

  return (
    <Link href={href as string} className={`${baseClass} ${bgClasses[color]}`}>
      {text}
    </Link>
  );
}

export default CTA