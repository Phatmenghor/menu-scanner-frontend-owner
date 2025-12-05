import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import z from "zod";
import { ChangePasswordService } from "@/services/dashboard/user/plateform-user/plateform-user.service";
import { AppToast } from "../common/app-toast";

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(1, "New password is required"),
    confirmNewPassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    path: ["confirmNewPassword"],
    message: "New passwords do not match",
  });

type ChangePasswordForm = z.infer<typeof changePasswordSchema>;

type Props = {
  onClose: () => void;
  isOpen: boolean;
};

export default function ChangePasswordModal({ isOpen, onClose }: Props) {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ChangePasswordForm>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      confirmNewPassword: "",
      currentPassword: "",
      newPassword: "",
    },
  });

  const onSubmit = async (data: ChangePasswordForm) => {
    try {
      const response = await ChangePasswordService({
        newPassword: data.newPassword,
        currentPassword: data.currentPassword,
        confirmPassword: data.confirmNewPassword,
      });
      AppToast({
        type: "success",
        message: `Password change successfully`,
        duration: 4000,
        position: "top-right",
      });
      reset();
      onClose();
    } catch (error: any) {
      AppToast({
        type: "error",
        message: `Failed to change user password`,
        duration: 4000,
        position: "top-right",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-lg md:max-w-xl lg:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Change password</DialogTitle>
          <DialogDescription>Change password below.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-2 pt-4">
          <div className="space-y-1">
            <Label htmlFor="currentPassword" className="text-sm">
              Current Password *
            </Label>
            <div className="relative">
              <Input
                id="currentPassword"
                placeholder="••••••••"
                type={showCurrentPassword ? "text" : "password"}
                className="h-10 text-sm placeholder:text-gray-400"
                {...register("currentPassword")}
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                {showCurrentPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.currentPassword && (
              <p className="text-xs text-red-500">
                {errors.currentPassword.message}
              </p>
            )}
          </div>
          <div className="space-y-1">
            <Label htmlFor="newPassword" className="text-sm">
              New Password *
            </Label>
            <div className="relative">
              <Input
                id="newPassword"
                placeholder="••••••••"
                type={showNewPassword ? "text" : "password"}
                className="h-10 text-sm placeholder:text-gray-400"
                {...register("newPassword")}
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                {showNewPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.newPassword && (
              <p className="text-xs text-red-500">
                {errors.newPassword.message}
              </p>
            )}
          </div>
          <div className="space-y-1">
            <Label htmlFor="confirmNewPassword" className="text-sm">
              Confirm New Password *
            </Label>
            <div className="relative">
              <Input
                id="confirmNewPassword"
                placeholder="••••••••"
                type={showConfirmNewPassword ? "text" : "password"}
                className="h-10 text-sm placeholder:text-gray-400 pr-10"
                {...register("confirmNewPassword")}
              />
              <button
                type="button"
                onClick={() =>
                  setShowConfirmNewPassword(!showConfirmNewPassword)
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                {showConfirmNewPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.confirmNewPassword && (
              <p className="text-xs text-red-500">
                {errors.confirmNewPassword.message}
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Processing..." : "Submit"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
