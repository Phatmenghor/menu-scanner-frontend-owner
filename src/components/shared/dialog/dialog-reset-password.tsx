"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
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
  X,
} from "lucide-react";
import { toast } from "sonner";
import { AdminChangePasswordService } from "@/services/dashboard/user/user.service";

export default function ResetPasswordModal({
  userId,
  isOpen,
  userName,
  onClose,
}: {
  userId?: string;
  userName?: string;
  isOpen: boolean;
  onClose: () => void;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const defaultPassword = "88889999";

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

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md w-[95vw] mx-auto rounded-2xl border border-gray-200 bg-white shadow-2xl p-0 overflow-hidden">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 p-1 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="relative">
          <div className="relative p-8 space-y-6">
            {showSuccess ? (
              // Success State
              <>
                <div className="flex flex-col items-center space-y-4">
                  <div className="relative">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-500/20 to-green-400/10 rounded-full flex items-center justify-center border border-green-500/30">
                      <CheckCircle2 className="w-8 h-8 text-green-400" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center animate-pulse">
                      <div className="w-2 h-2 bg-white rounded-full" />
                    </div>
                  </div>

                  <div className="text-center space-y-2">
                    <DialogTitle className="text-2xl font-bold text-gray-900">
                      Password Reset Complete!
                    </DialogTitle>
                    <DialogDescription className="text-gray-600 text-base leading-relaxed">
                      The user's password has been successfully reset to the
                      default password.
                    </DialogDescription>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-green-50 to-green-25 border border-green-200 rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-green-600" />
                    <div className="flex-1">
                      <p className="text-green-700 font-medium text-sm">
                        Security Notice
                      </p>
                      <p className="text-green-600 text-sm">
                        User should change password on next login
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center pt-2">
                  <Button
                    type="button"
                    onClick={handleClose}
                    className="bg-green-600 hover:bg-green-700 text-white font-medium px-8 py-3 rounded-lg transition-all duration-200"
                  >
                    Got it
                  </Button>
                </div>
              </>
            ) : (
              // Confirmation State
              <>
                <div className="flex flex-col items-center space-y-4">
                  <div className="relative">
                    <div className="w-16 h-16 bg-gradient-to-br from-yellow-500/20 to-orange-500/10 rounded-full flex items-center justify-center border border-yellow-500/30">
                      <RotateCcw className="w-8 h-8 text-yellow-500" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
                      <AlertTriangle className="w-3 h-3 text-gray-900" />
                    </div>
                  </div>

                  <div className="text-center space-y-2">
                    <DialogTitle className="text-2xl font-bold text-white">
                      Reset Password?
                    </DialogTitle>
                    <DialogDescription className="text-gray-400 text-base leading-relaxed">
                      This will reset the user's password to the default value.
                      They'll need to change it on their next login.
                    </DialogDescription>
                  </div>
                </div>

                {/* User Info Card */}
                <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-5 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center border border-blue-500/30">
                      <User className="w-5 h-5 text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-medium">Target User</p>
                      <p className="text-gray-300 text-sm">
                        {userName || "Unknown User"}
                      </p>
                    </div>
                  </div>

                  <Separator className="bg-gray-700" />

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-yellow-500/20 rounded-full flex items-center justify-center border border-yellow-500/30">
                      <Key className="w-5 h-5 text-yellow-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-medium">New Password</p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex-1 bg-gray-700 border border-gray-600 px-3 py-2 rounded-md">
                          <code className="text-sm font-mono text-gray-300">
                            {showPassword ? defaultPassword : "••••••••"}
                          </code>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowPassword(!showPassword)}
                          className="h-8 w-8 p-0 hover:bg-gray-600 text-gray-400 hover:text-white"
                          title={
                            showPassword ? "Hide password" : "Show password"
                          }
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
                          className="h-8 w-8 p-0 hover:bg-gray-600 text-gray-400 hover:text-white"
                          title="Copy password"
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Warning Message */}
                <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/5 border border-amber-500/30 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-amber-300 font-medium text-sm">
                        This action cannot be undone
                      </p>
                      <p className="text-amber-200/70 text-sm">
                        The user will be logged out of all devices and must use
                        the new password to sign in.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <DialogFooter className="flex flex-row justify-center items-center gap-3 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleClose}
                    disabled={isSubmitting}
                    className="min-w-[120px] rounded-lg border-gray-600 bg-transparent hover:bg-gray-800 text-gray-300 hover:text-white font-medium transition-colors"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    onClick={onReset}
                    disabled={isSubmitting}
                    className="bg-red-600 hover:bg-red-700 text-white font-medium min-w-[120px] rounded-lg transition-all duration-200 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <RotateCcw className="w-4 h-4 animate-spin" />
                        Resetting...
                      </div>
                    ) : (
                      "Reset Password"
                    )}
                  </Button>
                </DialogFooter>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
