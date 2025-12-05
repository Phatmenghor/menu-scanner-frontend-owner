import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
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
  const [imageLoading, setImageLoading] = useState(true);
  const openTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const justOpenedRef = useRef(false);

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

  // Image preview handlers - smooth like CustomAvatar
  const handleMouseEnter = () => {
    if (!enableImagePreview || !profileImageUrl) return;

    // Clear any pending close timeout
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }

    // Set 600ms delay before opening
    openTimeoutRef.current = setTimeout(() => {
      setShowPreview(true);
      setImageLoading(true); // Reset loading state when opening
      justOpenedRef.current = true;

      // Reset the justOpened flag after 500ms to allow closing
      setTimeout(() => {
        justOpenedRef.current = false;
      }, 500);
    }, 600);
  };

  const handleMouseLeave = () => {
    // Don't close if modal just opened
    if (justOpenedRef.current) return;

    // Clear the open timeout if user leaves before 600ms
    if (openTimeoutRef.current) {
      clearTimeout(openTimeoutRef.current);
    }

    // Delay before closing to allow moving mouse to preview
    closeTimeoutRef.current = setTimeout(() => {
      setShowPreview(false);
    }, 4000);
  };

  const handlePreviewMouseEnter = () => {
    // Clear close timeout when hovering preview
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }
  };

  // Avatar component with Dialog trigger
  const AvatarComponent = (
    <div className="relative">
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogTrigger asChild>
          <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            <Avatar
              className={`${sizes.avatar} ${
                enableImagePreview && profileImageUrl
                  ? "cursor-pointer hover:scale-110 transition-transform"
                  : ""
              }`}
            >
              <AvatarImage src={profileImageUrl} alt={displayName} />
              <AvatarFallback
                className={`${sizes.avatar} rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-white text-sm font-bold shadow-sm`}
              >
                {fallbackLetter}
              </AvatarFallback>
            </Avatar>
          </div>
        </DialogTrigger>

        {enableImagePreview && profileImageUrl && (
          <DialogContent
            className="max-w-fit border-none bg-transparent shadow-none p-0"
            onMouseEnter={handlePreviewMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <div className="relative bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-2xl border border-border">
              <div className="flex flex-col items-center gap-4">
                {/* Loading spinner */}
                {imageLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white/80 dark:bg-gray-900/80 rounded-2xl z-10">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                      <p className="text-sm text-muted-foreground">
                        Loading image...
                      </p>
                    </div>
                  </div>
                )}

                <img
                  src={profileImageUrl}
                  alt={displayName}
                  className="max-w-[70vw] max-h-[70vh] w-auto h-auto object-contain rounded-lg"
                  onLoad={() => setImageLoading(false)}
                  onError={() => setImageLoading(false)}
                  style={{
                    opacity: imageLoading ? 0 : 1,
                    transition: "opacity 0.3s",
                  }}
                />
                <p className="text-lg font-semibold text-center text-gray-900 dark:text-white">
                  {displayName}
                </p>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>

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
      <div className={`border-t border-border/50 p-2 ${className}`}>
        <div className="flex justify-center">{AvatarComponent}</div>
      </div>
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
    <div className={`border-t border-border/50 p-4 ${className}`}>
      {profileLink ? (
        <Link href={profileLink}>{CardContent}</Link>
      ) : (
        CardContent
      )}
    </div>
  );
};
