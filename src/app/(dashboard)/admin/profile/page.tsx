"use client";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Edit, Loader2, Trash2, Lock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TextField } from "@/components/shared/form-field/text-field";
import { TextareaField } from "@/components/shared/form-field/text-area-field";
import { ImageUploadField } from "@/components/shared/form-field/image-upload-field";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import {
  getProfileService,
  updateProfileService,
  deleteAccountService,
} from "@/redux/features/auth/store/thunks/auth-thunks";
import {
  selectProfile,
  selectIsProfileLoading,
  selectError,
} from "@/redux/features/auth/store/selectors/auth-selectors";
import { showToast } from "@/components/shared/common/show-toast";
import { clearError } from "@/redux/features/auth/store/slice/auth-slice";
import ChangePasswordModal from "@/components/shared/modal/change-password-modal";
import { DeleteConfirmationModal } from "@/components/shared/modal/delete-confirmation-modal";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants/app-routes/routes";
import { clearToken } from "@/utils/local-storage/token";
import { clearUserInfo } from "@/utils/local-storage/userInfo";
import { uploadImageService } from "@/services/image-service";
import { CustomAvatar } from "@/components/shared/avator/custom-avator";

// Profile update schema
const profileSchema = z.object({
  profileImageUrl: z.string().optional(),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  phoneNumber: z.string().min(1, "Phone number is required"),
  position: z.string().optional(),
  address: z.string().optional(),
  notes: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function UserProfilePage() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const userProfile = useAppSelector(selectProfile);
  const isProfileLoading = useAppSelector(selectIsProfileLoading);
  const reduxError = useAppSelector(selectError);

  const [isEditing, setIsEditing] = useState(false);
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] =
    useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("profile");

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      profileImageUrl: "",
      firstName: "",
      lastName: "",
      phoneNumber: "",
      position: "",
      address: "",
      notes: "",
    },
    mode: "onChange",
  });

  // Load profile on mount
  useEffect(() => {
    dispatch(getProfileService());
  }, [dispatch]);

  // Update form when profile loads
  useEffect(() => {
    if (userProfile) {
      reset({
        profileImageUrl: userProfile.profileImageUrl || "",
        firstName: userProfile.firstName || "",
        lastName: userProfile.lastName || "",
        phoneNumber: userProfile.phoneNumber || "",
        position: userProfile.position || "",
        address: userProfile.address || "",
        notes: userProfile.notes || "",
      });
    }
  }, [userProfile, reset]);

  // Clear errors when they appear
  useEffect(() => {
    if (reduxError) {
      showToast.error(reduxError);
      dispatch(clearError());
    }
  }, [reduxError, dispatch]);

  const onSubmit = async (data: ProfileFormData) => {
    try {
      let profileImageUrl = data.profileImageUrl || "";

      // Upload image if it's a base64 string
      if (profileImageUrl && profileImageUrl.startsWith("data:image")) {
        try {
          const imageType = profileImageUrl.split(";")[0].split("/")[1];

          const uploadResult = await uploadImageService({
            base64: profileImageUrl,
            type: imageType,
          });

          if (uploadResult && uploadResult.imageUrl) {
            profileImageUrl = uploadResult.imageUrl;
          } else {
            throw new Error("Failed to upload image");
          }
        } catch (uploadError) {
          console.error("Error uploading image:", uploadError);
          showToast.error("Failed to upload profile image. Please try again.");
          return;
        }
      }

      const payload = {
        profileImageUrl,
        firstName: data.firstName,
        lastName: data.lastName,
        phoneNumber: data.phoneNumber,
        position: data.position,
        address: data.address,
        notes: data.notes,
      };

      await dispatch(updateProfileService(payload)).unwrap();
      showToast.success("Profile updated successfully");
      setIsEditing(false);
    } catch (error: any) {
      console.error("Error updating profile:", error);
      showToast.error(error || "Failed to update profile");
    }
  };

  const handleCancel = () => {
    if (userProfile) {
      reset({
        profileImageUrl: userProfile.profileImageUrl || "",
        firstName: userProfile.firstName || "",
        lastName: userProfile.lastName || "",
        phoneNumber: userProfile.phoneNumber || "",
        position: userProfile.position || "",
        address: userProfile.address || "",
        notes: userProfile.notes || "",
      });
    }
    setIsEditing(false);
  };

  const handleDeleteAccount = async () => {
    try {
      await dispatch(deleteAccountService()).unwrap();
      showToast.success("Account deleted successfully");

      // Clear all auth data
      clearToken();
      clearUserInfo();

      // Redirect to login
      setTimeout(() => {
        router.replace(ROUTES.AUTH.LOGIN);
      }, 100);
    } catch (error: any) {
      showToast.error(error || "Failed to delete account");
    }
  };

  if (isProfileLoading && !userProfile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
          <p className="mt-3 text-sm text-muted-foreground">
            Loading profile...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b">
        <div className="container mx-auto px-4 py-3">
          <h1 className="text-lg font-semibold text-foreground">
            Profile Settings
          </h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Profile Header */}
        <Card className="mb-4">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <CustomAvatar
                  imageUrl={userProfile?.profileImageUrl}
                  name={userProfile?.fullName}
                  size="xl"
                />
              </div>

              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-foreground">
                      {userProfile?.fullName}
                    </h2>
                    <p className="text-muted-foreground text-sm">
                      {userProfile?.email}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="secondary" className="text-xs">
                        {userProfile?.userType}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {isEditing ? (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleCancel}
                          disabled={isProfileLoading}
                        >
                          Cancel
                        </Button>
                        <Button
                          size="sm"
                          onClick={handleSubmit(onSubmit)}
                          disabled={isProfileLoading || !isDirty}
                        >
                          {isProfileLoading ? (
                            <>
                              <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                              Saving...
                            </>
                          ) : (
                            "Save"
                          )}
                        </Button>
                      </>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsEditing(true)}
                      >
                        <Edit className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Navigation Tabs */}
        <div className="flex gap-1 mb-4 bg-card rounded-lg p-1 border">
          <Button
            variant={activeSection === "profile" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setActiveSection("profile")}
            className="flex-1"
          >
            <User className="h-4 w-4 mr-2" />
            Profile
          </Button>
          <Button
            variant={activeSection === "security" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setActiveSection("security")}
            className="flex-1"
          >
            <Lock className="h-4 w-4 mr-2" />
            Security
          </Button>
        </div>

        {/* Profile Section */}
        {activeSection === "profile" && (
          <Card>
            <CardContent className="p-6">
              {/* Error Display */}
              {reduxError && (
                <div className="p-4 bg-destructive/10 border border-destructive rounded-lg mb-4">
                  <p className="text-sm text-destructive font-medium">
                    {reduxError}
                  </p>
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="space-y-4">
                  {/* Profile Image Upload - Full Width */}
                  <Controller
                    control={control}
                    name="profileImageUrl"
                    render={({ field }) => (
                      <ImageUploadField
                        label="Profile Image"
                        value={field.value}
                        onChange={field.onChange}
                        disabled={!isEditing}
                        error={errors.profileImageUrl?.message}
                        accept="image/*"
                        maxSize={5}
                      />
                    )}
                  />

                  {/* First Name & Last Name */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <TextField
                      control={control}
                      name="firstName"
                      label="First Name"
                      placeholder="Enter first name"
                      disabled={!isEditing}
                      required
                      error={errors.firstName}
                    />

                    <TextField
                      control={control}
                      name="lastName"
                      label="Last Name"
                      placeholder="Enter last name"
                      disabled={!isEditing}
                      required
                      error={errors.lastName}
                    />
                  </div>

                  {/* Phone Number & Position */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <TextField
                      control={control}
                      name="phoneNumber"
                      label="Phone Number"
                      type="tel"
                      placeholder="Enter phone number"
                      disabled={!isEditing}
                      required
                      error={errors.phoneNumber}
                    />

                    <TextField
                      control={control}
                      name="position"
                      label="Position"
                      placeholder="e.g., Software Engineer"
                      disabled={!isEditing}
                      error={errors.position}
                    />
                  </div>

                  {/* Address - Full Width */}
                  <TextField
                    control={control}
                    name="address"
                    label="Address"
                    placeholder="Enter your address"
                    disabled={!isEditing}
                    error={errors.address}
                  />

                  {/* Notes - Full Width */}
                  <TextareaField
                    control={control}
                    name="notes"
                    label="Notes"
                    placeholder="Additional notes or information"
                    rows={4}
                    disabled={!isEditing}
                    error={errors.notes}
                  />
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Security Section */}
        {activeSection === "security" && (
          <div className="space-y-4">
            {/* Change Password */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-foreground">
                      Change Password
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Update your password to keep your account secure
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => setIsChangePasswordModalOpen(true)}
                  >
                    <Lock className="h-4 w-4 mr-2" />
                    Change Password
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Delete Account */}
            <Card className="border-destructive/50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-destructive">
                      Delete Account
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Permanently delete your account and all associated data
                    </p>
                  </div>
                  <Button
                    variant="destructive"
                    onClick={() => setIsDeleteDialogOpen(true)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Account
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Change Password Modal */}
      <ChangePasswordModal
        isOpen={isChangePasswordModalOpen}
        onClose={() => setIsChangePasswordModalOpen(false)}
      />

      {/* Delete Account Confirmation */}
      <DeleteConfirmationModal
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onDelete={handleDeleteAccount}
        title="Delete Account"
        description="Are you absolutely sure you want to delete your account? This will permanently delete your account and remove all your data from our servers."
        itemName={userProfile?.email}
        isSubmitting={isProfileLoading}
        variant="critical"
        requireConfirmation={true}
        confirmationText="DELETE"
      />
    </div>
  );
}
