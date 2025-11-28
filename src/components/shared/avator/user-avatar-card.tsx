import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { X } from "lucide-react";
import { useState, useRef } from "react";
import Link from "next/link";

interface UserAvatarCardProps {
  user: {
    profileImageUrl?: string;
    fullName?: string;
    firstName?: string;
    lastName?: string;
    displayName?: string;
    email?: string;
  };
  collapsed?: boolean;
  isOnline?: boolean;
  isLoading?: boolean;
  profileLink?: string;
  showEmail?: boolean;
  showOnlineIndicator?: boolean;
  enableImagePreview?: boolean;
  className?: string;
  avatarSize?: "sm" | "md" | "lg" | "xl";
}

export const UserAvatarCard: React.FC<UserAvatarCardProps> = ({
  user,
  collapsed = false,
  isOnline = true,
  isLoading = false,
  profileLink,
  showEmail = true,
  showOnlineIndicator = true,
  enableImagePreview = true,
  className = "",
  avatarSize = "md",
}) => {
  const [showPreview, setShowPreview] = useState(false);
  const openTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const sizeClasses = {
    sm: { avatar: "h-8 w-8", indicator: "w-2 h-2" },
    md: { avatar: "h-10 w-10", indicator: "w-3 h-3" },
    lg: { avatar: "h-12 w-12", indicator: "w-3.5 h-3.5" },
    xl: { avatar: "h-16 w-16", indicator: "w-4 h-4" },
  };

  const size = collapsed ? "sm" : avatarSize;
  const sizes = sizeClasses[size];

  // Get user display name
  const displayName =
    user.displayName ||
    user.fullName ||
    `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
    "GUEST USER";

  // Get fallback letter
  const fallbackLetter =
    user.fullName?.charAt(0) || user.firstName?.charAt(0) || "U";

  // Get profile image URL
  const profileImageUrl = user.profileImageUrl
    ? user.profileImageUrl.startsWith("http")
      ? user.profileImageUrl
      : process.env.NEXT_PUBLIC_API_BASE_URL
      ? `${process.env.NEXT_PUBLIC_API_BASE_URL}${user.profileImageUrl}`
      : user.profileImageUrl
    : undefined;

  // Image preview handlers
  const handleMouseEnter = () => {
    if (!enableImagePreview || !profileImageUrl) return;

    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }

    openTimeoutRef.current = setTimeout(() => {
      setShowPreview(true);
    }, 600);
  };

  const handleMouseLeave = () => {
    if (openTimeoutRef.current) {
      clearTimeout(openTimeoutRef.current);
    }

    closeTimeoutRef.current = setTimeout(() => {
      setShowPreview(false);
    }, 100);
  };

  const handleClose = () => {
    if (openTimeoutRef.current) {
      clearTimeout(openTimeoutRef.current);
    }
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }
    setShowPreview(false);
  };

  const handlePreviewMouseEnter = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }
  };

  // Avatar component
  const AvatarComponent = (
    <div className="relative">
      <Avatar
        className={`${sizes.avatar} ${
          enableImagePreview && profileImageUrl
            ? "cursor-pointer hover:scale-110 transition-transform"
            : ""
        }`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <AvatarImage src={profileImageUrl} alt={displayName} />
        <AvatarFallback
          className={`${sizes.avatar} rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-white text-sm font-bold shadow-sm`}
        >
          {fallbackLetter}
        </AvatarFallback>
      </Avatar>

      {/* Online/Offline indicator */}
      {showOnlineIndicator && (
        <div
          className={`absolute -bottom-0.5 -right-0.5 ${
            sizes.indicator
          } rounded-full ${
            isOnline ? "bg-green-500 shadow-green-500/50" : "bg-gray-400"
          } shadow-sm ${collapsed ? "border" : "border-2"} border-background`}
        ></div>
      )}
    </div>
  );

  // Collapsed view
  if (collapsed) {
    return (
      <>
        <div className={`border-t border-border/50 p-2 ${className}`}>
          <div className="flex justify-center">{AvatarComponent}</div>
        </div>

        {/* Image Preview */}
        {profileImageUrl && showPreview && (
          <>
            <div
              className="fixed inset-0 bg-black/50 z-[9998] animate-in fade-in duration-200"
              onMouseEnter={handlePreviewMouseEnter}
              onClick={handleClose}
            />
            <div
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[9999] animate-in zoom-in-95 fade-in duration-200"
              onMouseEnter={handlePreviewMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <div className="relative bg-white dark:bg-gray-900 p-4 rounded-2xl shadow-2xl border-4 border-primary/30">
                <button
                  onClick={handleClose}
                  className="absolute -top-3 -right-3 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 shadow-lg transition-all hover:scale-110 z-10"
                >
                  <X className="h-5 w-5" />
                </button>
                <img
                  src={profileImageUrl}
                  alt={displayName}
                  className="max-w-[70vw] max-h-[70vh] w-auto h-auto object-contain rounded-lg"
                />
                <p className="text-lg font-semibold text-center mt-4 text-gray-900 dark:text-white">
                  {displayName}
                </p>
              </div>
            </div>
          </>
        )}
      </>
    );
  }

  // Expanded view
  const CardContent = (
    <div
      className={`flex items-center gap-3 p-3 rounded-xl bg-accent/30 hover:bg-accent/50 transition-colors duration-300 ${
        profileLink ? "cursor-pointer" : ""
      } group ${className}`}
    >
      {AvatarComponent}

      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-foreground truncate">
          {displayName}
        </p>
        {showEmail && (
          <p className="text-xs text-muted-foreground truncate">
            {user.email || "user@example.com"}
          </p>
        )}
      </div>

      {/* Loading indicator */}
      {isLoading && (
        <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse shadow-sm shadow-yellow-500/50"></div>
      )}
    </div>
  );

  return (
    <>
      <div className={`border-t border-border/50 p-4 ${className}`}>
        {profileLink ? (
          <Link href={profileLink}>{CardContent}</Link>
        ) : (
          CardContent
        )}
      </div>

      {/* Image Preview */}
      {profileImageUrl && showPreview && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-[9998] animate-in fade-in duration-200"
            onMouseEnter={handlePreviewMouseEnter}
            onClick={handleClose}
          />
          <div
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[9999] animate-in zoom-in-95 fade-in duration-200"
            onMouseEnter={handlePreviewMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <div className="relative bg-white dark:bg-gray-900 p-4 rounded-2xl shadow-2xl border-4 border-primary/30">
              <button
                onClick={handleClose}
                className="absolute -top-3 -right-3 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 shadow-lg transition-all hover:scale-110 z-10"
              >
                <X className="h-5 w-5" />
              </button>
              <img
                src={profileImageUrl}
                alt={displayName}
                className="max-w-[70vw] max-h-[70vh] w-auto h-auto object-contain rounded-lg"
              />
              <p className="text-lg font-semibold text-center mt-4 text-gray-900 dark:text-white">
                {displayName}
              </p>
            </div>
          </div>
        </>
      )}
    </>
  );
};
