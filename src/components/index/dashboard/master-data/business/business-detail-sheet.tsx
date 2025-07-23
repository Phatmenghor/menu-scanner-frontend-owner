"use client";

import type React from "react";
import {
  Eye,
  Globe,
  Phone,
  Mail,
  MapPin,
  Clock,
  Users,
  Calendar,
  CreditCard,
  Facebook,
  Instagram,
  MessageCircle,
  Building2,
  ChefHat,
  DollarSign,
  Percent,
  Shield,
  CheckCircle,
  XCircle,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BusinessModel } from "@/models/dashboard/master-data/business/business.response.model";

interface BusinessDetailSheetProps {
  isOpen: boolean;
  onClose: () => void;
  business: BusinessModel | null;
  trigger?: React.ReactNode;
}

export function BusinessDetailSheet({
  isOpen,
  onClose,
  business,
  trigger,
}: BusinessDetailSheetProps) {
  const getStatusColor = (status: string | null) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending approval":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "suspended":
        return "bg-red-100 text-red-800 border-red-200";
      case "inactive":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-[600px] sm:w-[700px] sm:max-w-none">
        <SheetHeader className="space-y-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage
                src={`${process.env.NEXT_PUBLIC_API_BASE_URL}${business?.logoUrl}`}
                alt={business?.name}
              />
              <AvatarFallback className="text-lg">
                {business?.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <SheetTitle className="text-xl">{business?.name}</SheetTitle>
              <SheetDescription className="text-base">
                {business?.description || "---"}
              </SheetDescription>
              <div className="flex items-center gap-2 mt-2">
                <Badge className={getStatusColor(business?.status ?? null)}>
                  {business?.status}
                </Badge>
                {business?.hasActiveSubscription && (
                  <Badge
                    variant="outline"
                    className="text-green-600 border-green-200"
                  >
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Active Subscription
                  </Badge>
                )}
                {business?.isExpiringSoon && (
                  <Badge
                    variant="outline"
                    className="text-orange-600 border-orange-200"
                  >
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    Expiring Soon
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-200px)] mt-6">
          <div className="space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Business Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Business Type
                    </label>
                    <p className="flex items-center gap-2 mt-1">
                      <ChefHat className="h-4 w-4" />
                      {business?.businessType || "---"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Cuisine Type
                    </label>
                    <p className="mt-1">{business?.cuisineType || "---"}</p>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Operating Hours
                  </label>
                  <p className="flex items-center gap-2 mt-1">
                    <Clock className="h-4 w-4" />
                    {business?.operatingHours || "---"}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{business?.email || "---"}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{business?.phone || "---"}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <a
                      href={business?.website || "---"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {business?.website || "---"}
                    </a>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <span className="text-sm">
                      {business?.address || "---"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Social Media */}
            <Card>
              <CardHeader>
                <CardTitle>Social Media & Communication</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {business?.facebookUrl && (
                  <div className="flex items-center gap-3">
                    <Facebook className="h-4 w-4 text-blue-600" />
                    <a
                      href={business?.facebookUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      Facebook Page
                    </a>
                  </div>
                )}
                {business?.instagramUrl && (
                  <div className="flex items-center gap-3">
                    <Instagram className="h-4 w-4 text-pink-600" />
                    <a
                      href={business?.instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-pink-600 hover:underline"
                    >
                      Instagram Profile
                    </a>
                  </div>
                )}
                {business?.telegramContact && (
                  <div className="flex items-center gap-3">
                    <MessageCircle className="h-4 w-4 text-blue-500" />
                    <span>{business?.telegramContact || "---"}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Payment Methods */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payment Methods
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2">
                    {business?.acceptsOnlinePayment ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-600" />
                    )}
                    <span className="text-sm">Online Payment</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {business?.acceptsCashPayment ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-600" />
                    )}
                    <span className="text-sm">Cash Payment</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {business?.acceptsBankTransfer ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-600" />
                    )}
                    <span className="text-sm">Bank Transfer</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {business?.acceptsMobilePayment ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-600" />
                    )}
                    <span className="text-sm">Mobile Payment</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Financial Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Financial Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      USD to KHR Rate
                    </label>
                    <p className="text-lg font-semibold mt-1">
                      {business?.usdToKhrRate.toLocaleString()} KHR
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Tax Rate
                    </label>
                    <p className="text-lg font-semibold mt-1 flex items-center gap-1">
                      <Percent className="h-4 w-4" />
                      {business?.taxRate}%
                    </p>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Service Charge Rate
                  </label>
                  <p className="text-lg font-semibold mt-1 flex items-center gap-1">
                    <Percent className="h-4 w-4" />
                    {business?.serviceChargeRate}%
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Business Statistics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Business Statistics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">
                      {business?.totalStaff || "---"}
                    </p>
                    <p className="text-sm text-muted-foreground">Total Staff</p>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <p className="text-2xl font-bold text-green-600">
                      {business?.totalCustomers || "---"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Total Customers
                    </p>
                  </div>
                  <div className="text-center p-3 bg-orange-50 rounded-lg">
                    <p className="text-2xl font-bold text-orange-600">
                      {business?.totalMenuItems || "---"}
                    </p>
                    <p className="text-sm text-muted-foreground">Menu Items</p>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <p className="text-2xl font-bold text-purple-600">
                      {business?.totalTables || "---"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Total Tables
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Subscription Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Subscription Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Current Plan</span>
                  <Badge variant="outline">
                    {business?.currentSubscriptionPlan || "---"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Status</span>
                  <Badge
                    className={
                      business?.isSubscriptionActive
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }
                  >
                    {business?.isSubscriptionActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
                {business?.isSubscriptionActive && (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Start Date</span>
                      <span className="text-sm">
                        {formatDate(business?.subscriptionStartDate)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">End Date</span>
                      <span className="text-sm">
                        {formatDate(business?.subscriptionEndDate)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        Days Remaining
                      </span>
                      <span
                        className={`text-sm font-semibold ${
                          business?.daysRemaining <= 7
                            ? "text-red-600"
                            : "text-green-600"
                        }`}
                      >
                        {business?.daysRemaining || "---"} days
                      </span>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* System Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  System Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-muted-foreground">
                    Created
                  </span>
                  <span className="text-sm">
                    {formatDate(business?.createdAt)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-muted-foreground">
                    Last Updated
                  </span>
                  <span className="text-sm">
                    {formatDate(business?.updatedAt)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-muted-foreground">
                    Created By
                  </span>
                  <span className="text-sm">{business?.createdBy}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-muted-foreground">
                    Updated By
                  </span>
                  <span className="text-sm">{business?.updatedBy}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
