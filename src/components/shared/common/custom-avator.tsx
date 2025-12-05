"use client";

import { useState, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

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

  const fallbackText = name?.charAt(0)?.toUpperCase() || "B";

  // Image preview handlers
  const handleMouseEnter = () => {
    if (!imageUrl) return;

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

  return (
    <Dialog open={showPreview} onOpenChange={setShowPreview}>
      <DialogTrigger asChild>
        <div
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className="inline-block"
        >
          <Avatar
            className={`${
              sizeClasses[size].avatar
            } border-2 border-background dark:border-card shadow-sm group-hover:border-primary/30 transition-all ${
              imageUrl ? "cursor-pointer hover:scale-110" : ""
            } ${className}`}
          >
            <AvatarImage src={imageUrl || ""} alt={name || "User"} />
            <AvatarFallback className="bg-primary/10 dark:bg-primary/20 text-primary font-semibold">
              {fallbackText}
            </AvatarFallback>
          </Avatar>
        </div>
      </DialogTrigger>

      {/* Large Preview */}
      {imageUrl && (
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
                src={imageUrl}
                alt={name || "User"}
                className="max-w-[70vw] max-h-[70vh] w-auto h-auto object-contain rounded-lg"
                onLoad={() => setImageLoading(false)}
                onError={() => setImageLoading(false)}
                style={{
                  opacity: imageLoading ? 0 : 1,
                  transition: "opacity 0.3s",
                }}
              />
              <p className="text-lg font-semibold text-center text-gray-900 dark:text-white">
                {name || "User"}
              </p>
            </div>
          </div>
        </DialogContent>
      )}
    </Dialog>
  );
};
