"use client";

import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageUploadFieldProps {
  label: string;
  value?: string;
  onChange: (base64: string) => void;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  className?: string;
  accept?: string;
  maxSize?: number;
}

export function ImageUploadField({
  label,
  value,
  onChange,
  disabled = false,
  required = false,
  error,
  className = "",
  accept = "image/*",
  maxSize = 5,
}: ImageUploadFieldProps) {
  const [preview, setPreview] = useState<string | null>(value || null);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxSize) {
      alert(`File size must be less than ${maxSize}MB`);
      return;
    }

    try {
      const base64 = await fileToBase64(file);

      setPreview(base64);

      onChange(base64);
    } catch (error) {
      console.error("Error reading image:", error);
      alert("Failed to read image. Please try again.");
      setPreview(null);
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          resolve(reader.result);
        } else {
          reject(new Error("Failed to convert file to base64"));
        }
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleRemove = () => {
    setPreview(null);
    onChange("");
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <Label className="text-[12px] font-normal text-gray-300">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>

      <div className="space-y-3">
        {/* Preview */}
        {preview && (
          <div className="relative w-full h-48 bg-muted rounded-lg overflow-hidden border">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-full object-contain"
            />
            {!disabled && (
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="absolute top-2 right-2"
                onClick={handleRemove}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        )}

        {/* Upload Button */}
        {!preview && (
          <div
            className={cn(
              "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
              error ? "border-red-500" : "border-border hover:border-primary",
              disabled && "opacity-50 cursor-not-allowed"
            )}
          >
            <input
              type="file"
              id="image-upload"
              accept={accept}
              onChange={handleFileChange}
              disabled={disabled}
              className="hidden"
            />
            <label
              htmlFor="image-upload"
              className={cn(
                "cursor-pointer flex flex-col items-center gap-2",
                disabled && "cursor-not-allowed"
              )}
            >
              <ImageIcon className="h-10 w-10 text-muted-foreground" />
              <div className="space-y-1">
                <p className="text-sm font-medium">Click to upload image</p>
                <p className="text-xs text-muted-foreground">
                  PNG, JPG, GIF up to {maxSize}MB
                </p>
              </div>
            </label>
          </div>
        )}

        {/* Change Image Button (when preview exists) */}
        {preview && (
          <div>
            <input
              type="file"
              id="image-change"
              accept={accept}
              onChange={handleFileChange}
              disabled={disabled}
              className="hidden"
            />
            <label htmlFor="image-change">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="w-full cursor-pointer"
                disabled={disabled}
                asChild
              >
                <span>
                  <Upload className="h-4 w-4 mr-2" />
                  Change Image
                </span>
              </Button>
            </label>
          </div>
        )}
      </div>

      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
