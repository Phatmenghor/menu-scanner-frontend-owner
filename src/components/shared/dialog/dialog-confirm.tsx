import React from "react";
import {
  AlertCircle,
  X,
  CheckCircle,
  AlertTriangle,
  Info,
  XCircle,
} from "lucide-react";

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
  alert: "text-teal-600",
  success: "text-green-600",
  warning: "text-yellow-600",
  info: "text-blue-600",
  error: "text-red-600",
};

const iconBgColorMap = {
  alert: "bg-teal-100",
  success: "bg-green-100",
  warning: "bg-yellow-100",
  info: "bg-blue-100",
  error: "bg-red-100",
};

const sizeMap = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
};

const buttonVariantMap = {
  primary: "bg-blue-600 hover:bg-blue-700 text-white",
  secondary: "bg-gray-600 hover:bg-gray-700 text-white",
  danger: "bg-red-600 hover:bg-red-700 text-white",
  success: "bg-green-600 hover:bg-green-700 text-white",
  warning: "bg-yellow-600 hover:bg-yellow-700 text-white",
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
  // Handle escape key
  React.useEffect(() => {
    if (!open || !closeOnEscape) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [open, closeOnEscape]);

  const handleClose = () => {
    onClose?.();
    onOpenChange(false);
  };

  const handleBackdropClick = () => {
    if (closeOnBackdropClick) {
      handleClose();
    }
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
      <div className="flex items-center justify-center">
        <div
          className={`w-12 h-12 rounded-full flex items-center justify-center ${
            iconBackgroundColor || defaultBgColor
          }`}
        >
          <IconComponent
            className={`h-6 w-6 ${iconColor || defaultIconColor}`}
          />
        </div>
      </div>
    );
  };

  const renderButton = (button: ButtonConfig, onClick: () => void) => {
    const baseClasses =
      "px-6 py-2.5 rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed";
    const variantClasses = buttonVariantMap[button.variant || "primary"];

    return (
      <button
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
      </button>
    );
  };

  const renderButtons = () => {
    if (hideButtons) return null;

    if (customButtons.length > 0) {
      return (
        <div
          className={`flex flex-wrap gap-3 justify-center ${footerClassName}`}
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
      <div className={`flex space-x-3 ${footerClassName}`}>
        {renderButton(cancelButton, handleCancelClick)}
        {renderButton(confirmButton, handleConfirmClick)}
      </div>
    );
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={handleBackdropClick}
      />

      {/* Dialog */}
      <div
        className={`relative bg-white rounded-lg shadow-xl ${
          sizeMap[size]
        } w-full mx-4 p-6 ${
          centered ? "text-center" : "text-left"
        } ${className}`}
      >
        {/* Close button */}
        {showCloseButton && (
          <button
            onClick={handleClose}
            className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        )}

        <div
          className={`flex flex-col ${
            centered ? "items-center" : "items-start"
          } space-y-6`}
        >
          {/* Icon */}
          {renderIcon()}

          {/* Header */}
          <div className={`space-y-3 ${headerClassName}`}>
            <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
            {description && (
              <p className="text-gray-600 text-base">{description}</p>
            )}
          </div>

          {/* Custom Content */}
          {children && (
            <div className={`w-full ${contentClassName}`}>{children}</div>
          )}

          {/* Separator */}
          {!hideButtons && <div className="w-full h-px bg-gray-200" />}

          {/* Buttons */}
          {renderButtons()}
        </div>
      </div>
    </div>
  );
}

// Demo component with multiple examples
// export default function ConfirmDialogDemo() {
//   const [dialogs, setDialogs] = React.useState({
//     basic: false,
//     custom: false,
//     warning: false,
//     success: false,
//     multiButton: false,
//     customContent: false,
//     noIcon: false,
//     loading: false,
//   });

//   const [loading, setLoading] = React.useState(false);

//   const openDialog = (key: string) => {
//     setDialogs(prev => ({ ...prev, [key]: true }));
//   };

//   const closeDialog = (key: string) => {
//     setDialogs(prev => ({ ...prev, [key]: false }));
//   };

//   const handleAsyncAction = async () => {
//     setLoading(true);
//     // Simulate async operation
//     await new Promise(resolve => setTimeout(resolve, 2000));
//     setLoading(false);
//     closeDialog('loading');
//   };

//   return (
//     <div className="p-8 space-y-4">
//       <h1 className="text-3xl font-bold text-gray-900 mb-8">Reusable Confirm Dialog</h1>

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//         <button
//           onClick={() => openDialog('basic')}
//           className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
//         >
//           Basic Dialog
//         </button>

//         <button
//           onClick={() => openDialog('warning')}
//           className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors"
//         >
//           Warning Dialog
//         </button>

//         <button
//           onClick={() => openDialog('success')}
//           className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
//         >
//           Success Dialog
//         </button>

//         <button
//           onClick={() => openDialog('multiButton')}
//           className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
//         >
//           Multi-Button Dialog
//         </button>

//         <button
//           onClick={() => openDialog('customContent')}
//           className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
//         >
//           Custom Content
//         </button>

//         <button
//           onClick={() => openDialog('loading')}
//           className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
//         >
//           Loading Dialog
//         </button>
//       </div>

//       {/* Basic Dialog */}
//       <ConfirmDialog
//         open={dialogs.basic}
//         onOpenChange={() => closeDialog('basic')}
//         title="Delete Item"
//         description="Are you sure you want to delete this item? This action cannot be undone."
//         confirmButton={{ text: 'Delete', variant: 'danger' }}
//         onConfirm={() => alert('Item deleted!')}
//       />

//       {/* Warning Dialog */}
//       <ConfirmDialog
//         open={dialogs.warning}
//         onOpenChange={() => closeDialog('warning')}
//         title="Warning"
//         description="This action may have unintended consequences."
//         icon="warning"
//         confirmButton={{ text: 'Proceed', variant: 'warning' }}
//         onConfirm={() => alert('Proceeded with warning!')}
//       />

//       {/* Success Dialog */}
//       <ConfirmDialog
//         open={dialogs.success}
//         onOpenChange={() => closeDialog('success')}
//         title="Success!"
//         description="Your action was completed successfully."
//         icon="success"
//         confirmButton={{ text: 'Great!', variant: 'success' }}
//         hideButtons={false}
//         cancelButton={{ text: 'Close', variant: 'secondary' }}
//       />

//       {/* Multi-Button Dialog */}
//       <ConfirmDialog
//         open={dialogs.multiButton}
//         onOpenChange={() => closeDialog('multiButton')}
//         title="Choose an Option"
//         description="What would you like to do?"
//         customButtons={[
//           { text: 'Save', variant: 'success', onClick: () => alert('Saved!') },
//           { text: 'Save & Exit', variant: 'primary', onClick: () => alert('Saved and exited!') },
//           { text: 'Discard', variant: 'danger', onClick: () => alert('Discarded!') },
//           { text: 'Cancel', variant: 'secondary' },
//         ]}
//       />

//       {/* Custom Content Dialog */}
//       <ConfirmDialog
//         open={dialogs.customContent}
//         onOpenChange={() => closeDialog('customContent')}
//         title="Custom Content Example"
//         size="lg"
//         centered={false}
//         icon="info"
//       >
//         <div className="space-y-4">
//           <div className="bg-blue-50 p-4 rounded-lg">
//             <h3 className="font-semibold text-blue-900">Custom Content Area</h3>
//             <p className="text-blue-800 mt-2">You can add any custom content here, including forms, lists, or other components.</p>
//           </div>

//           <div className="grid grid-cols-2 gap-4">
//             <div className="bg-gray-50 p-3 rounded text-center">
//               <div className="text-2xl font-bold text-gray-900">42</div>
//               <div className="text-sm text-gray-600">Items</div>
//             </div>
//             <div className="bg-gray-50 p-3 rounded text-center">
//               <div className="text-2xl font-bold text-gray-900">$1,234</div>
//               <div className="text-sm text-gray-600">Total</div>
//             </div>
//           </div>
//         </div>
//       </ConfirmDialog>

//       {/* Loading Dialog */}
//       <ConfirmDialog
//         open={dialogs.loading}
//         onOpenChange={() => closeDialog('loading')}
//         title="Processing..."
//         description="Please wait while we process your request."
//         icon="info"
//         confirmButton={{ text: 'Process', variant: 'primary', loading: loading }}
//         onConfirm={handleAsyncAction}
//         closeOnBackdropClick={false}
//         closeOnEscape={false}
//       />
//     </div>
//   );
// }
