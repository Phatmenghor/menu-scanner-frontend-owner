import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface SelectOption {
  value: string;
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
}

export const CustomSelect: React.FC<CustomSelectProps> = ({
  options,
  value,
  placeholder = "Select option",
  onValueChange,
  className = "",
  disabled = false,
  size = "md",
}) => {
  const sizeClasses = {
    sm: "h-8 text-xs",
    md: "h-9 text-sm",
    lg: "h-10 text-base",
  };

  return (
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
            value={option.value}
            disabled={option.disabled}
            className={sizeClasses[size]}
          >
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
