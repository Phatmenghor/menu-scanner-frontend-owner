// components/shared/form/index.ts
import { Control, FieldError } from "react-hook-form";

export interface BaseFieldProps {
  name: string;
  label: string;
  control: Control<any>;
  error?: FieldError;
  disabled?: boolean;
  required?: boolean;
  className?: string;
}

export interface TextFieldProps extends BaseFieldProps {
  type?: "text" | "email" | "tel" | "password";
  placeholder?: string;
}

export interface PasswordFieldProps extends BaseFieldProps {
  placeholder?: string;
  showPassword?: boolean;
  onTogglePassword?: () => void;
}

export interface SelectFieldProps extends BaseFieldProps {
  options: Array<{ value: string; label: string }>;
  placeholder?: string;
  onValueChange?: (value: string) => void;
}

export interface TextareaFieldProps extends BaseFieldProps {
  placeholder?: string;
  rows?: number;
}
