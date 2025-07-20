// 2. Fixed InputFieldController (components/shared/inputFieldController.tsx)
import { Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";

const InputFieldController = ({
  control,
  name,
  label,
  placeholder,
  disabled,
  id,
  type = "text",
  className = "w-full bg-gray-100",
}: {
  control: any;
  name: string;
  label: string;
  placeholder?: string;
  disabled?: boolean;
  id?: string;
  type?: string;
  className?: string;
}) => (
  <div>
    {label && (
      <label htmlFor={id || name} className="mb-1 block text-sm font-bold">
        {label}
      </label>
    )}
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <Input
          id={id || name}
          name={field.name}
          type={type}
          disabled={disabled}
          placeholder={placeholder}
          className={className}
          value={field.value ?? ""}
          onChange={field.onChange}
          onBlur={field.onBlur}
          ref={field.ref}
        />
      )}
    />
  </div>
);

export default InputFieldController;
