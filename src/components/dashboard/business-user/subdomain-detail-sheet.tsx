"use client";

import type React from "react";

import {
  Globe,
  Building2,
  Mail,
  MapPin,
  Shield,
  Calendar,
  FileText,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ExternalLink,
  Activity,
  CreditCard,
  Clock,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { SubdomainModel } from "@/models/dashboard/sub-domain/sub-domain.response.model";

interface SubdomainDetailSheetProps {
  open: boolean;
  onClose: () => void;
  subdomain: SubdomainModel | null;
  trigger?: React.ReactNode;
}

export function SubdomainDetailSheet({
  onClose,
  open,
  subdomain,
  trigger,
}: SubdomainDetailSheetProps) {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "suspended":
        return "bg-red-100 text-red-800 border-red-200";
      case "inactive":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getSubscriptionColor = (plan: string) => {
    switch (plan?.toLowerCase()) {
      case "premium":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "pro":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "basic":
        return "bg-green-100 text-green-800 border-green-200";
      case "enterprise":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "free":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getAccessibilityColor = (isAccessible: boolean) => {
    return isAccessible
      ? "bg-green-100 text-green-800 border-green-200"
      : "bg-red-100 text-red-800 border-red-200";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffInDays === 0) return "Today";
    if (diffInDays === 1) return "Yesterday";
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    return `${Math.floor(diffInDays / 30)} months ago`;
  };

  const getDomainInitials = (domain: string) => {
    const parts = domain.split(".");
    return parts[0].substring(0, 2).toUpperCase();
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-[600px] sm:w-[700px] sm:max-w-none">
        <SheetHeader className="space-y-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="text-lg bg-blue-100 text-blue-800">
                {getDomainInitials(subdomain?.subdomain || "")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <SheetTitle className="text-xl flex items-center gap-2">
                <Globe className="h-5 w-5" />
                {subdomain?.subdomain}
              </SheetTitle>
              <SheetDescription className="text-base">
                {subdomain?.businessName}
              </SheetDescription>
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <Badge className={getStatusColor(subdomain?.status ?? "")}>
                  {subdomain?.status}
                </Badge>
                <Badge
                  className={getAccessibilityColor(
                    subdomain?.isAccessible ?? false
                  )}
                >
                  {subdomain?.isAccessible ? "Accessible" : "Not Accessible"}
                </Badge>
                {subdomain?.hasActiveSubscription && (
                  <Badge
                    className={getSubscriptionColor(
                      subdomain?.currentSubscriptionPlan ?? ""
                    )}
                  >
                    <CreditCard className="h-3 w-3 mr-1" />
                    {subdomain?.currentSubscriptionPlan}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-200px)] mt-6">
          <div className="space-y-6">
            {/* Domain Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Domain Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Subdomain
                    </label>
                    <p className="mt-1 font-medium">{subdomain?.subdomain}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Full Domain
                    </label>
                    <p className="mt-1 font-medium">{subdomain?.fullDomain}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Full URL
                    </label>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="font-medium">{subdomain?.fullUrl}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={() =>
                          window.open(subdomain?.fullUrl, "_blank")
                        }
                      >
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Business Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Business Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Business Name
                    </label>
                    <p className="mt-1 font-medium">
                      {subdomain?.businessName}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Access & Status Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Access & Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Status
                    </label>
                    <div className="mt-1 flex items-center gap-2">
                      {subdomain?.status.toLowerCase() === "active" ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : subdomain?.status.toLowerCase() === "pending" ? (
                        <AlertTriangle className="h-4 w-4 text-yellow-600" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-600" />
                      )}
                      <span className="font-medium">{subdomain?.status}</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Accessibility
                    </label>
                    <div className="mt-1 flex items-center gap-2">
                      {subdomain?.isAccessible ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-600" />
                      )}
                      <span className="font-medium">
                        {subdomain?.isAccessible
                          ? "Accessible"
                          : "Not Accessible"}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Can Access
                    </label>
                    <div className="mt-1 flex items-center gap-2">
                      {subdomain?.canAccess ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-600" />
                      )}
                      <span className="font-medium">
                        {subdomain?.canAccess ? "Yes" : "No"}
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Access Count
                    </label>
                    <div className="mt-1 flex items-center gap-2">
                      <Activity className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">
                        {subdomain?.accessCount?.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Last Accessed
                  </label>
                  <div className="mt-1 flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">
                      {formatRelativeTime(subdomain?.lastAccessed ?? "")}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      ({formatDate(subdomain?.lastAccessed ?? "")})
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Subscription Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Subscription Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Active Subscription
                    </label>
                    <div className="mt-1 flex items-center gap-2">
                      {subdomain?.hasActiveSubscription ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-600" />
                      )}
                      <span className="font-medium">
                        {subdomain?.hasActiveSubscription
                          ? "Active"
                          : "Inactive"}
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Current Plan
                    </label>
                    <p className="mt-1 font-medium">
                      {subdomain?.currentSubscriptionPlan || "No Plan"}
                    </p>
                  </div>
                </div>
                {subdomain?.hasActiveSubscription && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Days Remaining
                    </label>
                    <div className="mt-1 flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">
                        {subdomain?.subscriptionDaysRemaining} days
                      </span>
                      {subdomain?.subscriptionDaysRemaining <= 7 && (
                        <Badge variant="destructive" className="text-xs">
                          Expiring Soon
                        </Badge>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Notes */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Notes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">
                    Additional Notes
                  </label>
                  <div className="min-h-[100px] p-3 border rounded-md bg-gray-50">
                    {subdomain?.notes ? (
                      <p className="text-sm whitespace-pre-wrap">
                        {subdomain?.notes}
                      </p>
                    ) : (
                      <p className="text-sm text-muted-foreground italic">
                        No notes available
                      </p>
                    )}
                  </div>
                </div>
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
                    {formatDate(subdomain?.createdAt ?? "---")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-muted-foreground">
                    Last Updated
                  </span>
                  <span className="text-sm">
                    {formatDate(subdomain?.updatedAt ?? "---")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-muted-foreground">
                    Created By
                  </span>
                  <span className="text-sm">{subdomain?.createdBy}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-muted-foreground">
                    Updated By
                  </span>
                  <span className="text-sm">{subdomain?.updatedBy}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
