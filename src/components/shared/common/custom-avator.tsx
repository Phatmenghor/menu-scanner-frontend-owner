import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface CustomerAvatarProps {
  imageUrl?: string;
  name?: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export const CustomAvatar: React.FC<CustomerAvatarProps> = ({
  imageUrl,
  name,
  size = "md",
  className = "",
}) => {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12",
    xl: "h-16 w-16",
  };

  const fallbackText = name?.charAt(0)?.toUpperCase() || "B";

  return (
    <Avatar
      className={`${sizeClasses[size]} border-2 border-background dark:border-card shadow-sm group-hover:border-primary/30 transition-all ${className}`}
    >
      <AvatarImage src={imageUrl || ""} alt={`${name || "Business"} logo`} />
      <AvatarFallback className="bg-primary/10 dark:bg-primary/20 text-primary font-semibold">
        {fallbackText}
      </AvatarFallback>
    </Avatar>
  );
};
