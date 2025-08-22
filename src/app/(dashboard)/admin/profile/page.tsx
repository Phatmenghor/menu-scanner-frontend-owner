"use client";

import { useCallback, useEffect, useState } from "react";
import {
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
  MessageCircle,
  CheckCircle,
  AlertCircle,
  User,
  Phone,
  Briefcase,
  FileText,
  Settings,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserModel } from "@/models/dashboard/user/plateform-user/user.response";
import {
  getUserProfileService,
  updateUserProfileService,
} from "@/services/dashboard/user/plateform-user/plateform-user.service";
import ChangePasswordModal from "@/components/shared/modal/change-password-modal";
import { UpdateUserRequest } from "@/models/dashboard/user/plateform-user/user.request";
import { useRouter } from "next/navigation";
import { AppToast } from "@/components/shared/toast/app-toast";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { STATUS_USER_OPTIONS } from "@/constants/AppResource/status/status";
import axios from "axios";

// Telegram types
interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
}

declare global {
  interface Window {
    Telegram?: {
      WebApp: {
        initDataUnsafe: {
          user?: TelegramUser;
        };
        ready(): void;
        expand(): void;
        showAlert(message: string): void;
      };
    };
  }
}

// Extended form data interface to handle local form state
interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  status: string;
  phoneNumber: string;
  address: string;
  profileImageUrl?: string;
  position: string;
  notes: string;
}

export default function UserProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] =
    useState(false);
  const [isPolicyModalOpen, setIsPolicyModalOpen] = useState(false);
  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const [userProfile, setUserProfile] = useState<UserModel | null>(null);
  const [activeSection, setActiveSection] = useState("profile");

  // Telegram states
  const [telegramLoading, setTelegramLoading] = useState(false);
  const [telegramError, setTelegramError] = useState("");
  const [telegramSuccess, setTelegramSuccess] = useState("");
  const [telegramAvailable, setTelegramAvailable] = useState(false);
  const [telegramUser, setTelegramUser] = useState<TelegramUser | null>(null);

  // Separate form data state for editing
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    status: "",
    phoneNumber: "",
    address: "",
    position: "",
    profileImageUrl: "",
    notes: "",
  });

  const router = useRouter();
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: false,
    securityAlerts: true,
    systemUpdates: false,
  });

  const API_BASE =
    process.env.NEXT_PUBLIC_API_URL || "http://152.42.219.13:8080";

  // Get auth token
  const getAuthToken = () => {
    return localStorage.getItem("accessToken");
  };

  // Check if running in Telegram
  useEffect(() => {
    if (typeof window !== "undefined" && window.Telegram?.WebApp) {
      setTelegramAvailable(true);
      const webApp = window.Telegram.WebApp;
      webApp.ready();
      webApp.expand();

      if (webApp.initDataUnsafe.user) {
        setTelegramUser(webApp.initDataUnsafe.user);
      }
    }
  }, []);

  const loadProfile = useCallback(async () => {
    setIsProfileLoading(true);
    try {
      const response: UserModel = await getUserProfileService();
      setUserProfile(response);

      // Initialize form data from user profile
      if (response) {
        setFormData({
          firstName: response.firstName,
          lastName: response.lastName,
          position: response.position,
          email: response.email || "",
          status: response.accountStatus,
          phoneNumber: response.phoneNumber || "",
          address: response.address || "",
          profileImageUrl: response.profileImageUrl || "",
          notes: response.notes || "",
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
        notes: formData.notes,
        accountStatus: formData.status,
        position: formData.position,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phoneNumber: formData.phoneNumber,
        address: formData.address,
        profileImageUrl: formData.profileImageUrl,
      };

      const response = await updateUserProfileService(updateData);
      setUserProfile(response);
      setIsEditing(false);

      AppToast({
        type: "success",
        message: "Profile updated successfully",
        duration: 3000,
        position: "top-right",
      });
    } catch (error) {
      console.error("Error updating user profile:", error);
      AppToast({
        type: "error",
        message: "Failed to update profile",
        duration: 3000,
        position: "top-right",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (userProfile) {
      setFormData({
        firstName: userProfile.firstName,
        lastName: userProfile.lastName,
        status: userProfile.accountStatus,
        position: userProfile.position,
        email: userProfile.email || "",
        phoneNumber: userProfile.phoneNumber || "",
        address: userProfile.address || "",
        profileImageUrl: userProfile.profileImageUrl || "",
        notes: userProfile.notes || "",
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

  // Telegram functions
  const handleLinkTelegramClick = () => {
    setIsPolicyModalOpen(true);
  };

  const handleLinkTelegram = async () => {
    setIsPolicyModalOpen(false);

    if (!telegramUser) {
      setTelegramError(
        "Telegram user data not available. Please open this page from Telegram."
      );
      return;
    }

    const token = getAuthToken();
    if (!token) {
      setTelegramError("Please login first");
      return;
    }

    setTelegramLoading(true);
    setTelegramError("");
    setTelegramSuccess("");

    try {
      const telegramData = {
        telegramUserId: telegramUser.id,
        telegramUsername: telegramUser.username,
        telegramFirstName: telegramUser.first_name,
        telegramLastName: telegramUser.last_name,
        telegramPhotoUrl: telegramUser.photo_url,
        authDate: Math.floor(Date.now() / 1000).toString(),
        hash: "web_app_hash",
      };

      await axios.post(`${API_BASE}/api/v1/auth/telegram/link`, telegramData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setTelegramSuccess("Telegram account linked successfully!");
      await loadProfile();
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to link Telegram account";
      setTelegramError(errorMessage);
    } finally {
      setTelegramLoading(false);
    }
  };

  const handleUnlinkTelegram = async () => {
    const token = getAuthToken();
    if (!token) {
      setTelegramError("Please login first");
      return;
    }

    setTelegramLoading(true);
    setTelegramError("");
    setTelegramSuccess("");

    try {
      await axios.post(
        `${API_BASE}/api/v1/auth/telegram/unlink`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTelegramSuccess("Telegram account unlinked successfully.");
      await loadProfile();
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to unlink Telegram account";
      setTelegramError(errorMessage);
    } finally {
      setTelegramLoading(false);
    }
  };

  if (isProfileLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-3 text-sm text-muted-foreground">
            Loading profile...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Simple Header */}
      <div className="bg-card border-b">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <h1 className="text-lg font-semibold text-foreground">
            Profile Settings
          </h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Profile Header - Compact like Facebook */}
        <Card className="mb-4">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Avatar className="h-20 w-20">
                  <AvatarImage
                    src={`${process.env.NEXT_PUBLIC_API_BASE_URL}${userProfile?.profileImageUrl}`}
                  />
                  <AvatarFallback className="bg-primary text-primary-foreground text-xl font-bold">
                    {userProfile?.fullName?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                {isEditing && (
                  <Button
                    size="sm"
                    className="absolute -bottom-1 -right-1 h-7 w-7 rounded-full p-0"
                  >
                    <Camera className="h-3 w-3" />
                  </Button>
                )}
              </div>

              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-foreground">
                      {isEditing
                        ? `${formData.firstName} ${formData.lastName}`.trim()
                        : userProfile?.fullName}
                    </h2>
                    <p className="text-muted-foreground text-sm">
                      {userProfile?.email}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary" className="text-xs">
                        {userProfile?.userType}
                      </Badge>
                      {userProfile?.hasTelegramLinked && (
                        <Badge
                          variant="outline"
                          className="text-xs border-success text-success"
                        >
                          Telegram
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {isEditing ? (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleCancel}
                          disabled={isSubmitting}
                        >
                          Cancel
                        </Button>
                        <Button
                          size="sm"
                          onClick={handleSave}
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? "Saving..." : "Save"}
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

        {/* Navigation Pills */}
        <div className="flex gap-1 mb-4 bg-card rounded-lg p-1 border">
          {[
            { id: "profile", label: "Profile" },
            { id: "security", label: "Security" },
            { id: "notifications", label: "Notifications" },
          ].map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeSection === section.id
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              {section.label}
            </button>
          ))}
        </div>

        {/* Content Sections */}
        {activeSection === "profile" && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base text-foreground">
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-foreground">
                    First Name
                  </Label>
                  {isEditing ? (
                    <Input
                      value={formData.firstName}
                      onChange={(e) =>
                        handleInputChange("firstName", e.target.value)
                      }
                      className="mt-1"
                    />
                  ) : (
                    <p className="mt-1 text-sm text-foreground">
                      {userProfile?.firstName || "—"}
                    </p>
                  )}
                </div>
                <div>
                  <Label className="text-sm font-medium text-foreground">
                    Last Name
                  </Label>
                  {isEditing ? (
                    <Input
                      value={formData.lastName}
                      onChange={(e) =>
                        handleInputChange("lastName", e.target.value)
                      }
                      className="mt-1"
                    />
                  ) : (
                    <p className="mt-1 text-sm text-foreground">
                      {userProfile?.lastName || "—"}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-foreground">
                    Phone Number
                  </Label>
                  {isEditing ? (
                    <Input
                      value={formData.phoneNumber}
                      onChange={(e) =>
                        handleInputChange("phoneNumber", e.target.value)
                      }
                      className="mt-1"
                    />
                  ) : (
                    <p className="mt-1 text-sm text-foreground">
                      {userProfile?.phoneNumber || "—"}
                    </p>
                  )}
                </div>
                <div>
                  <Label className="text-sm font-medium text-foreground">
                    Position
                  </Label>
                  {isEditing ? (
                    <Input
                      value={formData.position}
                      onChange={(e) =>
                        handleInputChange("position", e.target.value)
                      }
                      className="mt-1"
                    />
                  ) : (
                    <p className="mt-1 text-sm text-foreground">
                      {userProfile?.position || "—"}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-foreground">
                  Address
                </Label>
                {isEditing ? (
                  <Input
                    value={formData.address}
                    onChange={(e) =>
                      handleInputChange("address", e.target.value)
                    }
                    className="mt-1"
                  />
                ) : (
                  <p className="mt-1 text-sm text-foreground">
                    {userProfile?.address || "—"}
                  </p>
                )}
              </div>

              <div>
                <Label className="text-sm font-medium text-foreground">
                  Notes
                </Label>
                {isEditing ? (
                  <Textarea
                    value={formData.notes}
                    onChange={(e) => handleInputChange("notes", e.target.value)}
                    className="mt-1"
                    rows={3}
                  />
                ) : (
                  <p className="mt-1 text-sm text-foreground">
                    {userProfile?.notes || "—"}
                  </p>
                )}
              </div>

              {!isEditing && (
                <div>
                  <Label className="text-sm font-medium text-foreground">
                    User ID
                  </Label>
                  <p className="mt-1 text-sm font-mono bg-muted text-foreground px-2 py-1 rounded">
                    {userProfile?.userIdentifier || "—"}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {activeSection === "security" && (
          <div className="space-y-4">
            {/* Telegram */}
            <Card>
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-foreground">
                        Telegram Account
                      </h3>
                      <p
                        className={`text-sm ${
                          userProfile?.hasTelegramLinked
                            ? "text-success"
                            : "text-error"
                        }`}
                      >
                        {userProfile?.hasTelegramLinked
                          ? "Connected"
                          : "Not connected"}
                      </p>
                    </div>
                    {userProfile?.hasTelegramLinked ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleUnlinkTelegram}
                        disabled={telegramLoading}
                      >
                        {telegramLoading ? "Unlinking..." : "Unlink"}
                      </Button>
                    ) : (
                      <>
                        {telegramAvailable && telegramUser ? (
                          <Button
                            size="sm"
                            onClick={handleLinkTelegramClick}
                            disabled={telegramLoading}
                          >
                            {telegramLoading ? "Linking..." : "Link"}
                          </Button>
                        ) : null}
                      </>
                    )}
                  </div>

                  {/* Show policy and requirements when can't link */}
                  {!userProfile?.hasTelegramLinked &&
                    (!telegramAvailable || !telegramUser) && (
                      <div className="p-3 bg-error/10 border border-error/20 rounded-md">
                        <p className="text-sm text-error font-medium mb-2">
                          Cannot link Telegram account
                        </p>
                        <p className="text-xs text-muted-foreground mb-3">
                          To link your Telegram account, please open this page
                          from Telegram WebApp.
                        </p>

                        <div className="text-xs text-muted-foreground">
                          <p className="font-medium mb-1">Linking Policy:</p>
                          <ul className="list-disc list-inside space-y-1 ml-2">
                            <li>Allow notifications via Telegram</li>
                            <li>Share Telegram username and profile</li>
                            <li>Enable secure authentication</li>
                            <li>Follow privacy policy and terms</li>
                          </ul>
                        </div>
                      </div>
                    )}

                  {telegramSuccess && (
                    <div className="p-3 bg-success/10 border border-success/20 text-success rounded-md">
                      <p className="text-sm">{telegramSuccess}</p>
                    </div>
                  )}

                  {telegramError && (
                    <div className="p-3 bg-error/10 border border-error/20 text-error rounded-md">
                      <p className="text-sm">{telegramError}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Password */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-foreground">Password</h3>
                    <p className="text-sm text-muted-foreground">
                      Change your password
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsChangePasswordModalOpen(true)}
                  >
                    Change
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Delete Account */}
            <Card className="border-destructive/50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-destructive">
                      Delete Account
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Permanently delete your account
                    </p>
                  </div>
                  <Button variant="destructive" size="sm">
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeSection === "notifications" && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base text-foreground">
                Notification Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                {
                  key: "emailNotifications",
                  title: "Email Notifications",
                  description: "Receive notifications via email",
                },
                {
                  key: "pushNotifications",
                  title: "Push Notifications",
                  description: "Browser push notifications",
                },
                {
                  key: "securityAlerts",
                  title: "Security Alerts",
                  description: "Security-related notifications",
                },
                {
                  key: "systemUpdates",
                  title: "System Updates",
                  description: "System and feature updates",
                },
              ].map((item) => (
                <div
                  key={item.key}
                  className="flex items-center justify-between py-2"
                >
                  <div>
                    <h4 className="font-medium text-sm text-foreground">
                      {item.title}
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                  <Switch
                    checked={
                      notifications[item.key as keyof typeof notifications]
                    }
                    onCheckedChange={(checked) =>
                      setNotifications({
                        ...notifications,
                        [item.key]: checked,
                      })
                    }
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        <ChangePasswordModal
          isOpen={isChangePasswordModalOpen}
          onClose={() => setIsChangePasswordModalOpen(false)}
        />

        {/* Policy Modal */}
        {isPolicyModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-card rounded-lg p-6 max-w-md mx-4 border">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Telegram Integration Policy
              </h3>
              <div className="space-y-3 text-sm text-muted-foreground mb-6">
                <p>By linking your Telegram account, you agree to:</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>
                    Allow this application to send notifications via Telegram
                  </li>
                  <li>Share your Telegram username and profile information</li>
                  <li>Enable secure authentication through Telegram</li>
                  <li>Follow our privacy policy and terms of service</li>
                </ul>
                <p className="text-xs">
                  You can unlink your account at any time from the security
                  settings.
                </p>
              </div>
              <div className="flex gap-3 justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsPolicyModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleLinkTelegram}
                  disabled={
                    telegramLoading || !telegramAvailable || !telegramUser
                  }
                >
                  I Agree & Link
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
