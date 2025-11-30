// src/components/Auth/FormInput/index.tsx
// src/components/Auth/FormInput/index.tsx
import type { FC, InputHTMLAttributes } from 'react';
import type { LucideIcon } from 'lucide-react';

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  icon?: LucideIcon;
}

const FormInput: FC<FormInputProps> = ({ 
  label, 
  error, 
  icon: Icon, 
  ...props 
}) => {
  return (
    <div>
      <label className="block text-gray-700 font-semibold mb-2">{label}</label>
      <div className="relative">
        {Icon && <Icon className="absolute left-3 top-3 text-gray-400" size={20} />}
        <input
          {...props}
          className={`w-full ${Icon ? 'pl-10' : 'px-4'} pr-4 py-2 border rounded-lg
            focus:outline-none focus:ring-2 transition
            ${error 
              ? 'border-red-500 focus:ring-red-200' 
              : 'border-gray-300 focus:border-blue-600 focus:ring-blue-200'
            }`}
        />
      </div>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default FormInput;