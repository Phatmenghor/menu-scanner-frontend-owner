import React from "react";
import {
  AlertCircle,
  X,
  CheckCircle,
  AlertTriangle,
  Info,
  XCircle,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type IconType = "alert" | "success" | "warning" | "info" | "error" | "custom";
type ButtonVariant = "primary" | "secondary" | "danger" | "success" | "warning";
type DialogSize = "sm" | "md" | "lg" | "xl";

interface ButtonConfig {
  text: string;
  variant?: ButtonVariant;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children?: React.ReactNode;

  // Icon customization
  icon?: IconType | React.ReactNode;
  iconColor?: string;
  iconBackgroundColor?: string;
  hideIcon?: boolean;

  // Size and layout
  size?: DialogSize;
  centered?: boolean;

  // Buttons
  confirmButton?: ButtonConfig;
  cancelButton?: ButtonConfig;
  customButtons?: ButtonConfig[];
  hideButtons?: boolean;

  // Styling
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
  footerClassName?: string;

  // Behavior
  closeOnBackdropClick?: boolean;
  showCloseButton?: boolean;
  closeOnEscape?: boolean;

  // Callbacks
  onConfirm?: () => void;
  onCancel?: () => void;
  onClose?: () => void;
}

const iconMap = {
  alert: AlertCircle,
  success: CheckCircle,
  warning: AlertTriangle,
  info: Info,
  error: XCircle,
};

const iconColorMap = {
  alert: "text-pink-400",
  success: "text-green-400",
  warning: "text-yellow-400",
  info: "text-blue-400",
  error: "text-red-400",
};

const iconBgColorMap = {
  alert: "bg-pink-500/10 border border-pink-500/20",
  success: "bg-green-500/10 border border-green-500/20",
  warning: "bg-yellow-500/10 border border-yellow-500/20",
  info: "bg-blue-500/10 border border-blue-500/20",
  error: "bg-red-500/10 border border-red-500/20",
};

const sizeMap = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
};

const buttonVariantMap = {
  primary:
    "bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white border-0 shadow-lg hover:shadow-pink-500/25 hover:scale-105",
  secondary:
    "bg-gray-700 hover:bg-gray-600 text-gray-200 border border-gray-600 hover:border-gray-500",
  danger:
    "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white border-0 shadow-lg hover:shadow-red-500/25 hover:scale-105",
  success:
    "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white border-0 shadow-lg hover:shadow-green-500/25 hover:scale-105",
  warning:
    "bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white border-0 shadow-lg hover:shadow-yellow-500/25 hover:scale-105",
};

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  children,

  // Icon props
  icon = "alert",
  iconColor,
  iconBackgroundColor,
  hideIcon = false,

  // Size and layout
  size = "md",
  centered = true,

  // Button props
  confirmButton = { text: "Confirm", variant: "primary" },
  cancelButton = { text: "Cancel", variant: "secondary" },
  customButtons = [],
  hideButtons = false,

  // Styling
  className = "",
  headerClassName = "",
  contentClassName = "",
  footerClassName = "",

  // Behavior
  closeOnBackdropClick = true,
  showCloseButton = true,
  closeOnEscape = true,

  // Callbacks
  onConfirm,
  onCancel,
  onClose,
}: ConfirmDialogProps) {
  const handleClose = () => {
    onClose?.();
    onOpenChange(false);
  };

  const handleConfirmClick = () => {
    confirmButton.onClick?.();
    onConfirm?.();
    onOpenChange(false);
  };

  const handleCancelClick = () => {
    cancelButton.onClick?.();
    onCancel?.();
    onOpenChange(false);
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      handleClose();
    } else {
      onOpenChange(newOpen);
    }
  };

  const renderIcon = () => {
    if (hideIcon) return null;

    if (React.isValidElement(icon)) {
      return <div className="flex items-center justify-center">{icon}</div>;
    }

    const IconComponent = iconMap[icon as keyof typeof iconMap];
    if (!IconComponent) return null;

    const defaultIconColor = iconColorMap[icon as keyof typeof iconColorMap];
    const defaultBgColor = iconBgColorMap[icon as keyof typeof iconBgColorMap];

    return (
      <div className="flex items-center justify-center mb-2">
        <div
          className={`w-14 h-14 rounded-full flex items-center justify-center ${
            iconBackgroundColor || defaultBgColor
          }`}
        >
          <IconComponent
            className={`h-7 w-7 ${iconColor || defaultIconColor}`}
          />
        </div>
      </div>
    );
  };

  const renderButton = (button: ButtonConfig, onClick: () => void) => {
    const baseClasses =
      "rounded-lg font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[100px]";
    const variantClasses = buttonVariantMap[button.variant || "primary"];

    return (
      <Button
        key={button.text}
        onClick={onClick}
        disabled={button.disabled || button.loading}
        className={`${baseClasses} ${variantClasses} ${button.className || ""}`}
      >
        {button.loading ? (
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span>Loading...</span>
          </div>
        ) : (
          button.text
        )}
      </Button>
    );
  };

  const renderButtons = () => {
    if (hideButtons) return null;

    if (customButtons.length > 0) {
      return (
        <div
          className={`flex flex-wrap gap-3 justify-center pt-4 ${footerClassName}`}
        >
          {customButtons.map((button, index) =>
            renderButton(button, () => {
              button.onClick?.();
              onOpenChange(false);
            })
          )}
        </div>
      );
    }

    return (
      <div className={`flex space-x-3 justify-center pt-6 ${footerClassName}`}>
        {renderButton(cancelButton, handleCancelClick)}
        {renderButton(confirmButton, handleConfirmClick)}
      </div>
    );
  };

  return (
    <Dialog
      open={open}
      onOpenChange={handleOpenChange}
      modal={closeOnBackdropClick}
    >
      <DialogContent
        className={`
          md:max-w-xl max-w-sm mx-auto p-4 text-center ${sizeMap[size]} p-4
          ${centered ? "text-center" : "text-left"} ${className}
        `}
        style={{
          boxShadow:
            "0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.05)",
        }}
        onEscapeKeyDown={closeOnEscape ? undefined : (e) => e.preventDefault()}
        onPointerDownOutside={
          closeOnBackdropClick ? undefined : (e) => e.preventDefault()
        }
        onInteractOutside={
          closeOnBackdropClick ? undefined : (e) => e.preventDefault()
        }
      >
        <div
          className={`flex flex-col ${
            centered ? "items-center" : "items-start"
          } space-y-4`}
        >
          {/* Icon */}
          {renderIcon()}

          {/* Header */}
          <DialogHeader
            className={`space-y-2 ${headerClassName} ${
              centered ? "text-center" : "text-center"
            }`}
          >
            <DialogTitle className="text-lg font-bold text-white">
              {title}
            </DialogTitle>
            {description && (
              <DialogDescription className="text-gray-300 text-base leading-relaxed break-words overflow-hidden">
                {description}
              </DialogDescription>
            )}
          </DialogHeader>

          {/* Custom Content */}
          {children && (
            <div className={`w-full ${contentClassName}`}>{children}</div>
          )}

          {/* Separator */}
          {!hideButtons && (
            <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent" />
          )}

          {/* Buttons */}
          {renderButtons()}
        </div>
      </DialogContent>
    </Dialog>
  );
}
