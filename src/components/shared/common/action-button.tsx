import { ReactNode } from "react";
import { Button, ButtonProps } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ActionButtonProps extends Omit<ButtonProps, "children" | "onClick"> {
  icon: ReactNode;
  tooltip: string;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
}

export const ActionButton = ({
  icon,
  tooltip,
  onClick,
  variant = "outline",
  size = "sm",
  disabled = false,
  className = "",
  ...rest
}: ActionButtonProps) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant={variant}
          size={size}
          disabled={disabled}
          className={className}
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
          {...rest}
        >
          {icon}
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>{tooltip}</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

// Alternative version with conditional tooltip (only shows if tooltip is provided)
export const ConditionalActionButton = ({
  icon,
  tooltip,
  onClick,
  variant = "outline",
  size = "sm",
  disabled = false,
  className = "",
  ...rest
}: ActionButtonProps & { tooltip?: string }) => {
  const buttonElement = (
    <Button
      variant={variant}
      size={size}
      disabled={disabled}
      className={className}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      {...rest}
    >
      {icon}
    </Button>
  );

  if (!tooltip) {
    return buttonElement;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{buttonElement}</TooltipTrigger>
        <TooltipContent>
          <p>{tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
