// /src/components/Auth/InputField.tsx
import React from "react";
import { motion } from "framer-motion";

interface InputFieldProps {
  id: string;
  label: string;
  type: string;
  register: any;
  error?: string;
  autoComplete?: string;
  leadingIcon?: React.ReactNode;
  placeholder?: string;
}

const InputField: React.FC<InputFieldProps> = ({
  id,
  label,
  type,
  register,
  error,
  autoComplete,
  leadingIcon,
  placeholder,
}) => (
  <div className="mb-6">
    <label
      htmlFor={id}
      className="block text-sm font-medium text-brand-text mb-1.5"
    >
      {label}
    </label>
    <div className="relative group">
      {leadingIcon && (
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {React.cloneElement(leadingIcon as React.ReactElement, {
            className:
              "h-5 w-5 text-brand-text-muted group-focus-within:text-brand-primary transition-colors duration-200",
          })}
        </div>
      )}
      <input
        id={id}
        type={type}
        {...register}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className={`w-full px-3 py-2.5 border rounded-md bg-transparent text-brand-text
                    focus:outline-none focus:ring-1 
                    ${leadingIcon ? "pl-10" : ""}
                    ${
                      error
                        ? "border-error focus:border-error focus:ring-error"
                        : "border-brand-border focus:border-brand-primary focus:ring-brand-primary"
                    }`}
      />
    </div>
    {error && (
      <motion.p
        initial={{ opacity: 0, y: -3 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="text-xs text-error mt-1.5"
      >
        {error}
      </motion.p>
    )}
  </div>
);

export default InputField;
