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
} from "lucide-react";
import { toast } from "sonner";

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

  // Simulate API call
  const AdminChangePasswordService = async (params: any) => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(true), 1500);
    });
  };

  const onReset = async () => {
    if (!userId) return toast.error("User ID missing");
    setIsSubmitting(true);
    try {
      const ok = await AdminChangePasswordService({
        userId: userId,
        newPassword: defaultPassword,
        confirmPassword: defaultPassword,
      });
      if (ok) {
        setShowSuccess(true);
        toast.success("Password reset successfully");
      } else {
        toast.error("Reset failed");
      }
    } catch (error) {
      toast.error("Reset failed");
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
      toast.error("Failed to copy password");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md w-[95vw] mx-auto rounded-2xl border border-gray-700 shadow-2xl bg-gray-900 p-0 overflow-hidden">
        <div className="relative">
          <div className="relative p-8 space-y-6">
            {showSuccess ? (
              // Success State
              <>
                <div className="flex flex-col items-center space-y-4">
                  <div className="relative">
                    <div className="w-16 h-16 bg-gradient-to-br from-pink-500/20 to-pink-400/10 rounded-full flex items-center justify-center border border-pink-500/30">
                      <CheckCircle2 className="w-8 h-8 text-pink-400" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center animate-pulse">
                      <div className="w-2 h-2 bg-white rounded-full" />
                    </div>
                  </div>

                  <div className="text-center space-y-2">
                    <DialogTitle className="text-2xl font-bold text-white">
                      Password Reset Complete!
                    </DialogTitle>
                    <DialogDescription className="text-gray-400 text-base leading-relaxed">
                      The user's password has been successfully reset to the
                      default password.
                    </DialogDescription>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-pink-500/10 to-pink-400/5 border border-pink-500/30 rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-pink-400" />
                    <div className="flex-1">
                      <p className="text-pink-300 font-medium text-sm">
                        Security Notice
                      </p>
                      <p className="text-pink-200/70 text-sm">
                        User should change password on next login
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center pt-2">
                  <Button
                    type="button"
                    onClick={handleClose}
                    className="bg-pink-500 hover:bg-pink-600 text-white font-medium px-8 py-3 rounded-lg transition-all duration-200"
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
                    <div className="w-16 h-16 bg-gradient-to-br from-yellow-500/20 to-orange-400/10 rounded-full flex items-center justify-center border border-yellow-500/30">
                      <RotateCcw className="w-8 h-8 text-yellow-400" />
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
                      <p className="text-gray-400 text-sm">
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
                        <code className="text-sm bg-gray-800 border border-gray-600 px-2 py-1 rounded font-mono text-gray-300">
                          {showPassword ? defaultPassword : "••••••••"}
                        </code>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowPassword(!showPassword)}
                          className="h-6 w-6 p-0 hover:bg-gray-700 text-gray-400 hover:text-white"
                        >
                          {showPassword ? (
                            <EyeOff className="w-3 h-3" />
                          ) : (
                            <Eye className="w-3 h-3" />
                          )}
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={copyPassword}
                          className="h-6 w-6 p-0 hover:bg-gray-700 text-gray-400 hover:text-white"
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <DialogFooter className="flex flex-row justify-center items-center gap-3 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onClose}
                    disabled={isSubmitting}
                    className="min-w-[120px] rounded-lg border-gray-600 bg-transparent hover:bg-gray-800 text-gray-300 hover:text-white font-medium"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    onClick={onReset}
                    disabled={isSubmitting}
                    className=" text-white font-medium min-w-[120px] rounded-lg transition-all duration-200 disabled:opacity-50"
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
