import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export interface SelectOption {
  value: string | undefined;
  label: string;
  disabled?: boolean;
}

interface CustomSelectProps {
  options: SelectOption[];
  value?: string;
  placeholder?: string;
  onValueChange: (value: string) => void;
  className?: string;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
  label?: string; // Add label prop
  required?: boolean; // Optional required indicator
}

export const CustomSelect: React.FC<CustomSelectProps> = ({
  options,
  value,
  placeholder = "Select option",
  onValueChange,
  className = "",
  disabled = false,
  size = "md",
  label = "Select option",
  required = false,
}) => {
  const sizeClasses = {
    sm: "h-8 text-xs",
    md: "h-9 text-sm",
    lg: "h-10 text-base",
  };

  return (
    <div className="space-y-2 w-full">
      {label && (
        <Label className="text-[12px] font-normal text-gray-300">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
      )}
      <Select value={value} onValueChange={onValueChange} disabled={disabled}>
        <SelectTrigger
          className={`min-w-[150px] ${sizeClasses[size]} ${className}`}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem
              key={option.value}
              value={option.value == undefined ? "All" : option.value}
              disabled={option.disabled}
              className={sizeClasses[size]}
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
