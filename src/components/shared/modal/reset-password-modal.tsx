"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AlertTriangle,
  CheckCircle2,
  RotateCcw,
  User,
  Key,
  Shield,
  Copy,
  Eye,
  EyeOff,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { AdminChangePasswordService } from "@/services/dashboard/user/plateform-user/plateform-user.service";
import { AppDefault } from "@/constants/AppResource/default/default";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ResetPasswordModalProps {
  userId?: string;
  userName?: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function ResetPasswordModal({
  userId,
  isOpen,
  userName,
  onClose,
}: ResetPasswordModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const defaultPassword = AppDefault.RESET_PASSWORD;

  const onReset = async () => {
    if (!userId) {
      toast.error("User ID missing");
      return;
    }
    setIsSubmitting(true);
    try {
      await AdminChangePasswordService({
        userId: userId,
        newPassword: defaultPassword,
        confirmPassword: defaultPassword,
      });
      setShowSuccess(true);
      toast.success("Password reset successfully");
    } catch (error) {
      console.error("Password reset failed:", error);
      toast.error("Reset failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setShowSuccess(false);
    setShowPassword(false);
    onClose();
  };

  const copyPassword = async () => {
    try {
      await navigator.clipboard.writeText(defaultPassword);
      toast.success("Password copied to clipboard");
    } catch (error) {
      console.error("Failed to copy password:", error);
      toast.error("Failed to copy password");
    }
  };

  if (showSuccess) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-md">
          <div className="text-center space-y-6">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>

            <div className="space-y-2">
              <DialogTitle className="text-xl font-semibold text-gray-900">
                Password Reset Complete!
              </DialogTitle>
              <DialogDescription className="text-gray-600">
                The user's password has been successfully reset to the default
                password.
              </DialogDescription>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div className="text-left">
                  <p className="text-sm font-medium text-green-800">
                    Security Notice
                  </p>
                  <p className="text-sm text-green-700">
                    User should change password on next login
                  </p>
                </div>
              </div>
            </div>

            <Button onClick={handleClose} className="w-full">
              Got it
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl h-[90vh] p-0 gap-0 flex flex-col">
        {/* Header */}
        <DialogHeader className="px-6 py-4 border-b bg-muted/30 flex-shrink-0">
          <div className="flex items-center gap-4 pr-8">
            <div className="p-2 bg-yellow-100 rounded-full">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
            </div>
            <div className="flex-1">
              <DialogTitle className="text-xl font-semibold">
                Reset User Password
              </DialogTitle>
              <DialogDescription className="text-base text-muted-foreground">
                This will reset the user's password to the default value.
                They'll need to change it on their next login.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Content */}
        <ScrollArea className="flex-1 min-h-0">
          <div className="p-6">
            <div className="space-y-6">
              {/* User Information Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-6 bg-blue-600 rounded-full"></div>
                  <h3 className="text-lg font-semibold text-foreground">
                    User Information
                  </h3>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-blue-700">
                        Target User
                      </Label>
                      <p className="text-sm text-blue-900 font-medium">
                        {userName || "Unknown User"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Password Information Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-6 bg-green-600 rounded-full"></div>
                  <h3 className="text-lg font-semibold text-foreground">
                    New Password Information
                  </h3>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center">
                      <Key className="w-5 h-5" />
                    </div>
                    <Label className="text-sm font-medium text-gray-700">
                      Default Password
                    </Label>
                  </div>

                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      value={defaultPassword}
                      readOnly
                      className="pr-20 font-mono bg-gray-50 border-gray-200"
                    />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowPassword(!showPassword)}
                        className="h-8 w-8 p-0 hover:bg-gray-200"
                        title={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={copyPassword}
                        className="h-8 w-8 p-0 hover:bg-gray-200"
                        title="Copy password"
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Warning Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-6 bg-red-600 rounded-full"></div>
                  <h3 className="text-lg font-semibold text-foreground">
                    Important Notice
                  </h3>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-yellow-800">
                        This action cannot be undone
                      </p>
                      <p className="text-sm text-yellow-700 mt-1">
                        The user will be logged out of all devices and must use
                        the new password to sign in.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>

        {/* Footer */}
        <div className="flex justify-between items-center p-6 border-t bg-muted/30 flex-shrink-0">
          <div className="text-sm text-muted-foreground">
            {isSubmitting ? "Resetting password..." : "Ready to reset password"}
          </div>
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={onReset}
              disabled={isSubmitting}
              variant="destructive"
              className="min-w-[140px]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Resetting...
                </>
              ) : (
                "Reset Password"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
