import React, { forwardRef } from 'react'

// On ajoute ...props pour récupérer tout ce que register() envoie (onBlur, name, etc.)
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

// On utilise forwardRef pour laisser React Hook Form accéder à l'élément DOM
const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, ...props }, ref) => {
    return (
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
        <input
          ref={ref} // Très important : on lie la ref ici
          {...props} // On déverse le reste des props (type, name, onChange, onBlur)
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;