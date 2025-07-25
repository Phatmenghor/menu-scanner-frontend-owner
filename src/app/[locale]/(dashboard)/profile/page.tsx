"use client";

import { useCallback, useEffect, useState } from "react";
import {
  ArrowLeft,
  Camera,
  Edit,
  Mail,
  MapPin,
  Calendar,
  Shield,
  Key,
  Bell,
  Trash2,
  Save,
  X,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserModel } from "@/models/dashboard/user/plateform-user/user.response";
import {
  getUserProfileService,
  updateUserProfileService,
} from "@/services/dashboard/user/plateform-user/plateform-user.service";
import ChangePasswordModal from "@/components/shared/modal/change-password-modal";
import { UpdateUserRequest } from "@/models/dashboard/user/plateform-user/user.request";
import { setUser } from "@/store/features/userSlice";
import { useRouter } from "next/navigation";
import { AppToast } from "@/components/shared/toast/app-toast";

// Extended form data interface to handle local form state
interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  address: string;
  profileImageUrl?: string;
}

export default function UserProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] =
    useState(false);
  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const [userProfile, setUserProfile] = useState<UserModel | null>(null);

  // Separate form data state for editing
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    address: "",
    profileImageUrl: "",
  });

  const router = useRouter();
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: false,
    securityAlerts: true,
    systemUpdates: false,
  });

  const loadProfile = useCallback(async () => {
    setIsProfileLoading(true);
    try {
      const response = await getUserProfileService();
      setUserProfile(response);

      // Initialize form data from user profile
      if (response) {
        // Split fullName into firstName and lastName
        const nameParts = response.fullName?.split(" ") || ["", ""];
        const firstName = nameParts[0] || "";
        const lastName = nameParts.slice(1).join(" ") || "";

        setFormData({
          firstName,
          lastName,
          email: response.email || "",
          phoneNumber: response.phoneNumber || "",
          address: response.address || "",
          profileImageUrl: response.profileImageUrl || "",
        });
      }
    } catch (error: any) {
      console.error(error?.message || "Error fetching profile");
    } finally {
      setIsProfileLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      const updateData: UpdateUserRequest = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phoneNumber: formData.phoneNumber,
        address: formData.address,
        profileImageUrl: formData.profileImageUrl,
      };

      const response = await updateUserProfileService(updateData);

      // Update the user profile state with new data
      setUserProfile(response);

      setIsEditing(false);
      AppToast({
        type: "success",
        message: "Profile updated successfully",
        duration: 3000,
        position: "top-right",
      });
      console.log("Profile updated successfully");
    } catch (error) {
      console.error("Error updating user profile:", error);
      AppToast({
        type: "error",
        message: "Fail to updated profile",
        duration: 3000,
        position: "top-right",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    // Reset form data to original values
    if (userProfile) {
      const nameParts = userProfile.fullName?.split(" ") || ["", ""];
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";

      setFormData({
        firstName,
        lastName,
        email: userProfile.email || "",
        phoneNumber: userProfile.phoneNumber || "",
        address: userProfile.address || "",
        profileImageUrl: userProfile.profileImageUrl || "",
      });
    }
    setIsEditing(false);
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  if (isProfileLoading) {
    return (
      <div className="min-h-screen text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-pink-600 mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white">
      {/* Header */}
      <div className="border-b border-gray-800 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => router.back()}
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
            </Button>
            <div>
              <h1 className="text-2xl text-black font-semibold">
                User Profile
              </h1>
              <p className="text-gray-400">
                Manage your account settings and preferences
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isEditing ? (
              <></>
            ) : (
              <Button onClick={() => setIsEditing(true)} size="sm">
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="max-w-full mx-auto">
          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList>
              <TabsTrigger
                value="profile"
                className="data-[state=active]:bg-primary"
              >
                Profile
              </TabsTrigger>
              <TabsTrigger
                value="security"
                className="data-[state=active]:bg-primary"
              >
                Security
              </TabsTrigger>
              <TabsTrigger
                value="notifications"
                className="data-[state=active]:bg-primary"
              >
                Notifications
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-6">
              {/* Profile Header Card */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-6">
                    <div className="relative">
                      <Avatar className="h-24 w-24">
                        <AvatarImage
                          src={`${process.env.NEXT_PUBLIC_API_BASE_URL}${userProfile?.profileImageUrl}`}
                        />
                        <AvatarFallback className="bg-primary text-white text-2xl">
                          {userProfile?.fullName?.charAt(0) || "U"}
                        </AvatarFallback>
                      </Avatar>
                      {isEditing && (
                        <Button
                          size="sm"
                          className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-pink-600 hover:bg-pink-700"
                        >
                          <Camera className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    <div className="flex-1 space-y-4">
                      <div className="flex items-center gap-4">
                        <div>
                          <h2 className="text-2xl font-semibold">
                            {isEditing
                              ? `${formData.firstName} ${formData.lastName}`.trim()
                              : userProfile?.fullName}
                          </h2>
                          <p className="text-gray-400">
                            {isEditing ? formData.email : userProfile?.email}
                          </p>
                        </div>
                        <Badge className="bg-pink-600/20 text-pink-400 border-pink-600/30">
                          <Shield className="h-3 w-3 mr-1" />
                          {userProfile?.userType}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div className="flex items-center gap-2 text-gray-400">
                          <Calendar className="h-4 w-4" />
                          Joined {userProfile?.createdAt}
                        </div>
                        <div className="flex items-center gap-2 text-gray-400">
                          <MapPin className="h-4 w-4" />
                          {isEditing ? formData.address : userProfile?.address}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Personal Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="h-5 w-5" />
                    Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) =>
                          handleInputChange("firstName", e.target.value)
                        }
                        disabled={!isEditing}
                        className="disabled:opacity-60"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) =>
                          handleInputChange("lastName", e.target.value)
                        }
                        disabled={!isEditing}
                        className="disabled:opacity-60"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                        disabled={true} // Email should typically not be editable
                        className="disabled:opacity-60"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        value={formData.phoneNumber}
                        onChange={(e) =>
                          handleInputChange("phoneNumber", e.target.value)
                        }
                        disabled={!isEditing}
                        className="disabled:opacity-60"
                      />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        value={formData.address}
                        onChange={(e) =>
                          handleInputChange("address", e.target.value)
                        }
                        disabled={!isEditing}
                        className="disabled:opacity-60"
                      />
                    </div>
                  </div>
                  {isEditing && (
                    <Card>
                      <CardContent className="flex gap-2 p-4 justify-end">
                        <Button
                          onClick={handleCancel}
                          variant="outline"
                          size="sm"
                          disabled={isSubmitting}
                        >
                          <X className="h-4 w-4 mr-2" />
                          Cancel
                        </Button>
                        <Button
                          onClick={handleSave}
                          className="bg-pink-600 hover:bg-pink-700"
                          size="sm"
                          disabled={isSubmitting}
                        >
                          <Save className="h-4 w-4 mr-2" />
                          {isSubmitting ? "Saving..." : "Save Changes"}
                        </Button>
                      </CardContent>
                    </Card>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Key className="h-5 w-5" />
                    Security Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Change Password</h3>
                        <p className="text-sm text-gray-400">
                          Update your password to keep your account secure
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => setIsChangePasswordModalOpen(true)}
                        className="border-gray-600 bg-transparent"
                      >
                        Change Password
                      </Button>
                    </div>
                    <Separator className="bg-gray-700" />
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">
                          Two-Factor Authentication
                        </h3>
                        <p className="text-sm text-gray-400">
                          Add an extra layer of security to your account
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        className="border-gray-600 bg-transparent"
                      >
                        Enable 2FA
                      </Button>
                    </div>
                    <Separator className="bg-gray-700" />
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Active Sessions</h3>
                        <p className="text-sm text-gray-400">
                          Manage your active sessions across devices
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        className="border-gray-600 bg-transparent"
                      >
                        View Sessions
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    Notification Preferences
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Email Notifications</h3>
                        <p className="text-sm text-gray-400">
                          Receive notifications via email
                        </p>
                      </div>
                      <Switch
                        checked={notifications.emailNotifications}
                        onCheckedChange={(checked) =>
                          setNotifications({
                            ...notifications,
                            emailNotifications: checked,
                          })
                        }
                      />
                    </div>
                    <Separator className="bg-gray-700" />
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Push Notifications</h3>
                        <p className="text-sm text-gray-400">
                          Receive push notifications in your browser
                        </p>
                      </div>
                      <Switch
                        checked={notifications.pushNotifications}
                        onCheckedChange={(checked) =>
                          setNotifications({
                            ...notifications,
                            pushNotifications: checked,
                          })
                        }
                      />
                    </div>
                    <Separator className="bg-gray-700" />
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Security Alerts</h3>
                        <p className="text-sm text-gray-400">
                          Get notified about security-related events
                        </p>
                      </div>
                      <Switch
                        checked={notifications.securityAlerts}
                        onCheckedChange={(checked) =>
                          setNotifications({
                            ...notifications,
                            securityAlerts: checked,
                          })
                        }
                      />
                    </div>
                    <Separator className="bg-gray-700" />
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">System Updates</h3>
                        <p className="text-sm text-gray-400">
                          Receive notifications about system updates
                        </p>
                      </div>
                      <Switch
                        checked={notifications.systemUpdates}
                        onCheckedChange={(checked) =>
                          setNotifications({
                            ...notifications,
                            systemUpdates: checked,
                          })
                        }
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Danger Zone */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-400">
                <Trash2 className="h-5 w-5" />
                Danger Zone
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-red-400">Delete Account</h3>
                  <p className="text-sm text-gray-400">
                    Permanently delete your account and all associated data
                  </p>
                </div>
                <Button
                  variant="destructive"
                  className="bg-red-600 hover:bg-red-700"
                >
                  Delete Account
                </Button>
              </div>
            </CardContent>
          </Card>

          <ChangePasswordModal
            isOpen={isChangePasswordModalOpen}
            onClose={() => setIsChangePasswordModalOpen(false)}
          />
        </div>
      </div>
    </div>
  );
}
