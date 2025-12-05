"use client";

import { useCallback, useEffect, useState, useRef } from "react";
import {
  Camera,
  Edit,
  MessageCircle,
  CheckCircle,
  AlertCircle,
  Loader2,
  ExternalLink,
  Copy,
  Check,
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
import { AppToast } from "@/components/shared/common/app-toast";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";

// Form data interface
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
  // Component states
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] =
    useState(false);
  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const [userProfile, setUserProfile] = useState<UserModel | null>(null);
  const [activeSection, setActiveSection] = useState("profile");

  // Telegram states
  const [telegramLoading, setTelegramLoading] = useState(false);
  const [telegramError, setTelegramError] = useState("");
  const [telegramSuccess, setTelegramSuccess] = useState("");
  const [showWidgetBackup, setShowWidgetBackup] = useState(false);
  const [pendingConnectionCode, setPendingConnectionCode] =
    useState<string>("");

  // Form data state
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

  // Notification preferences
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: false,
    securityAlerts: true,
    systemUpdates: false,
    telegramNotifications: true,
  });

  const router = useRouter();

  // Configuration
  const API_BASE =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://152.42.219.13:8080";
  const TELEGRAM_BOT_NAME = process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME || "";

  // Get auth token
  const getAuthToken = () => {
    return localStorage.getItem("accessToken");
  };

  // Load user profile
  const loadProfile = useCallback(async () => {
    setIsProfileLoading(true);
    try {
      const response: UserModel = await getUserProfileService();
      setUserProfile(response);

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

        setNotifications((prev) => ({
          ...prev,
          telegramNotifications: response.telegramNotificationsEnabled || false,
        }));
      }
    } catch (error: any) {
      console.error(
        "Profile loading error:",
        error?.message || "Error fetching profile"
      );
      AppToast({
        type: "error",
        message: "Failed to load profile",
        duration: 3000,
        position: "top-right",
      });
    } finally {
      setIsProfileLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  // Poll for connection status when using deep-link method
  useEffect(() => {
    if (pendingConnectionCode && telegramLoading) {
      const pollInterval = setInterval(async () => {
        try {
          // Reload profile to check if linking was successful
          const response: UserModel = await getUserProfileService();
          if (response.hasTelegramLinked) {
            setTelegramLoading(false);
            setTelegramSuccess(
              "🎉 Telegram account linked successfully! You'll now receive notifications via Telegram."
            );
            setPendingConnectionCode("");
            setUserProfile(response);
            clearInterval(pollInterval);
          }
        } catch (error) {
          console.error("Polling error:", error);
        }
      }, 2000);

      // Stop polling after 5 minutes
      const timeoutId = setTimeout(() => {
        clearInterval(pollInterval);
        if (telegramLoading && pendingConnectionCode) {
          setTelegramLoading(false);
          setTelegramError(
            "Connection timeout. Please try again or contact support if the issue persists."
          );
          setPendingConnectionCode("");
        }
      }, 300000); // 5 minutes

      return () => {
        clearInterval(pollInterval);
        clearTimeout(timeoutId);
      };
    }
  }, [pendingConnectionCode, telegramLoading]);

  // Handle Telegram widget authentication (backup method)
  const handleTelegramAuth = async (telegramUser: any) => {
    const token = getAuthToken();
    if (!token) {
      setTelegramError("Authentication required. Please login first.");
      return;
    }

    setTelegramLoading(true);
    setTelegramError("");
    setTelegramSuccess("");

    try {
      const linkData = {
        telegramUserId: parseInt(telegramUser.id),
        telegramUsername: telegramUser.username || null,
        telegramFirstName: telegramUser.first_name || null,
        telegramLastName: telegramUser.last_name || null,
        telegramPhotoUrl: telegramUser.photo_url || null,
        authDate: telegramUser.auth_date
          ? telegramUser.auth_date.toString()
          : null,
        hash: telegramUser.hash,
        chatId: null,
        languageCode: telegramUser.language_code || "en",
        isPremium: telegramUser.is_premium || false,
      };

      console.log("####Telegram linking successfullinkData:", linkData);

      const response = await axios.post(
        `${API_BASE}/api/v1/auth/telegram/link`,
        linkData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setTelegramSuccess(
        response.data?.message || "🎉 Telegram account linked successfully!"
      );

      console.log("####Telegram linking successful:", response.data);

      await loadProfile();
    } catch (error: any) {
      console.error("Telegram linking error:", error);
      let errorMessage = "Failed to link Telegram account. Please try again.";

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.status === 400) {
        errorMessage = "Invalid Telegram authentication data.";
      } else if (error.response?.status === 409) {
        errorMessage =
          "This Telegram account is already linked to another user.";
      }

      setTelegramError(errorMessage);
    } finally {
      setTelegramLoading(false);
    }
  };

  // Handle deep-link connection method (primary method)
  const handleDeepLinkConnection = (connectionCode: string) => {
    setTelegramLoading(true);
    setTelegramError("");
    setTelegramSuccess("");
    setPendingConnectionCode(connectionCode);

    console.log("Starting deep-link connection with code:", connectionCode);

    AppToast({
      type: "info",
      message:
        "Complete the connection in Telegram. We'll automatically detect when it's done!",
      duration: 5000,
      position: "top-right",
    });
  };

  // Handle widget domain error (show backup options)
  const handleWidgetDomainError = () => {
    console.log("Widget domain error detected, showing backup options");
    setShowWidgetBackup(false); // Hide widget, rely on deep-link
  };

  // Handle unlinking
  const handleUnlinkTelegram = async () => {
    const token = getAuthToken();
    if (!token) {
      setTelegramError("Authentication required. Please login first.");
      return;
    }

    setTelegramLoading(true);
    setTelegramError("");
    setTelegramSuccess("");

    try {
      const response = await axios.post(
        `${API_BASE}/api/v1/auth/telegram/unlink`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setTelegramSuccess("Telegram account unlinked successfully.");
      await loadProfile();
    } catch (error: any) {
      console.error("Telegram unlinking error:", error);
      setTelegramError(
        error.response?.data?.message ||
          "Failed to unlink Telegram account. Please try again."
      );
    } finally {
      setTelegramLoading(false);
    }
  };

  // Profile update handlers
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

  // Clear messages after delay
  useEffect(() => {
    if (telegramSuccess) {
      const timer = setTimeout(() => setTelegramSuccess(""), 10000);
      return () => clearTimeout(timer);
    }
  }, [telegramSuccess]);

  useEffect(() => {
    if (telegramError) {
      const timer = setTimeout(() => setTelegramError(""), 10000);
      return () => clearTimeout(timer);
    }
  }, [telegramError]);

  if (isProfileLoading) {
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
      {/* Telegram Widget Styles */}
      <style jsx global>{`
        .telegram-login-widget {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 40px;
        }
        .telegram-login-widget iframe {
          border-radius: 6px !important;
          transition: all 0.2s ease-in-out;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .telegram-login-widget iframe:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
        }
      `}</style>

      {/* Header */}
      <div className="bg-card border-b">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <h1 className="text-lg font-semibold text-foreground">
            Profile Settings
          </h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Profile Header */}
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
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="secondary" className="text-xs">
                        {userProfile?.userType}
                      </Badge>
                      {userProfile?.hasTelegramLinked && (
                        <Badge
                          variant="outline"
                          className="text-xs border-success text-success"
                        >
                          <MessageCircle className="h-3 w-3 mr-1" />
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
                          {isSubmitting ? (
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

        {/* Profile Section */}
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
                    placeholder="Add any additional notes..."
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

        {/* Security Section */}
        {activeSection === "security" && (
          <div className="space-y-4">
            {/* Password Management Card */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-foreground">Password</h3>
                    <p className="text-sm text-muted-foreground">
                      Change your account password
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsChangePasswordModalOpen(true)}
                  >
                    Change Password
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Account Deletion Card */}
            <Card className="border-destructive/50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-destructive">
                      Delete Account
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Permanently delete your account and all data
                    </p>
                  </div>
                  <Button variant="destructive" size="sm">
                    Delete Account
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Notifications Section */}
        {activeSection === "notifications" && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base text-foreground">
                Notification Preferences
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Choose how you want to receive notifications
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                {
                  key: "emailNotifications",
                  title: "Email Notifications",
                  description: "Receive notifications via email",
                  icon: "📧",
                },
                {
                  key: "telegramNotifications",
                  title: "Telegram Notifications",
                  description: "Receive instant notifications via Telegram",
                  icon: "💬",
                  disabled: !userProfile?.hasTelegramLinked,
                  helper: !userProfile?.hasTelegramLinked
                    ? "Link your Telegram account to enable"
                    : undefined,
                },
                {
                  key: "pushNotifications",
                  title: "Browser Push Notifications",
                  description: "Browser push notifications",
                  icon: "🔔",
                },
                {
                  key: "securityAlerts",
                  title: "Security Alerts",
                  description: "Important security-related notifications",
                  icon: "🔒",
                },
                {
                  key: "systemUpdates",
                  title: "System Updates",
                  description: "System maintenance and feature updates",
                  icon: "⚙️",
                },
              ].map((item) => (
                <div
                  key={item.key}
                  className="flex items-start justify-between py-3 border-b border-border/50 last:border-b-0"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-lg">{item.icon}</span>
                    <div>
                      <h4 className="font-medium text-sm text-foreground">
                        {item.title}
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        {item.description}
                      </p>
                      {item.helper && (
                        <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                          {item.helper}
                        </p>
                      )}
                    </div>
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
                    disabled={item.disabled}
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Change Password Modal */}
        <ChangePasswordModal
          isOpen={isChangePasswordModalOpen}
          onClose={() => setIsChangePasswordModalOpen(false)}
        />
      </div>
    </div>
  );
}
