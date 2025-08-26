"use client";

import type React from "react";
import {
  Eye,
  Globe,
  Lock,
  Calendar,
  CreditCard,
  DollarSign,
  Users,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Crown,
  Gift,
  Clock,
  TrendingUp,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { SubscriptionPlanModel } from "@/models/dashboard/master-data/subscription-plan/subscription-plan-response";

interface SubscriptionPlanDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  subPlan: SubscriptionPlanModel | null;
}

export function SubscriptionPlanDetailModal({
  isOpen,
  onClose,
  subPlan,
}: SubscriptionPlanDetailModalProps) {
  const getStatusColor = (status: string | null) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "inactive":
        return "bg-red-100 text-red-800 border-red-200";
      case "draft":
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

  const formatDuration = (days: number) => {
    if (days === 0) return "Unlimited";
    if (days < 30) return `${days} days`;
    if (days < 365) return `${Math.round(days / 30)} months`;
    return `${Math.round(days / 365)} years`;
  };

  const getPlanIcon = () => {
    if (subPlan?.isFree) return <Gift className="h-6 w-6 text-green-600" />;
    if (subPlan?.price && subPlan.price > 100)
      return <Crown className="h-6 w-6 text-yellow-600" />;
    return <CreditCard className="h-6 w-6 text-blue-600" />;
  };

  if (!subPlan) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[90vh] p-0 gap-0 flex flex-col">
        {/* Header */}
        <DialogHeader className="px-6 py-4 border-b bg-muted/30 flex-shrink-0">
          <div className="flex items-center gap-4 pr-8">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="text-lg bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                {getPlanIcon()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <DialogTitle className="text-xl flex items-center gap-2">
                {subPlan.name}
                {subPlan.isFree && (
                  <Badge
                    variant="outline"
                    className="text-green-600 border-green-200"
                  >
                    <Gift className="h-3 w-3 mr-1" />
                    Free
                  </Badge>
                )}
              </DialogTitle>
              <p className="text-muted-foreground text-base">
                {subPlan.description || "No description available"}
              </p>
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <Badge className={getStatusColor(subPlan.status)}>
                  {subPlan.status}
                </Badge>
                {subPlan.isPublic && (
                  <Badge
                    variant="outline"
                    className="text-blue-600 border-blue-200"
                  >
                    <Globe className="h-3 w-3 mr-1" />
                    Public
                  </Badge>
                )}
                {subPlan.isPrivate && (
                  <Badge
                    variant="outline"
                    className="text-orange-600 border-orange-200"
                  >
                    <Lock className="h-3 w-3 mr-1" />
                    Private
                  </Badge>
                )}
                {subPlan.activeSubscriptionsCount > 0 && (
                  <Badge
                    variant="outline"
                    className="text-green-600 border-green-200"
                  >
                    <TrendingUp className="h-3 w-3 mr-1" />
                    {subPlan.activeSubscriptionsCount} Active
                  </Badge>
                )}
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-4 top-4"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        {/* Content */}
        <ScrollArea className="flex-1 min-h-0">
          <div className="space-y-6 p-6">
            {/* Plan Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Crown className="h-5 w-5" />
                  Plan Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Status
                    </label>
                    <div className="mt-1">
                      <Badge className={getStatusColor(subPlan.status)}>
                        {subPlan.status}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Plan Type
                    </label>
                    <div className="mt-1 flex items-center gap-2">
                      {subPlan.isFree ? (
                        <>
                          <Gift className="h-4 w-4 text-green-600" />
                          <span className="font-medium text-green-600">
                            Free Plan
                          </span>
                        </>
                      ) : (
                        <>
                          <CreditCard className="h-4 w-4 text-blue-600" />
                          <span className="font-medium">Paid Plan</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Description
                  </label>
                  <p className="mt-1 text-sm leading-relaxed">
                    {subPlan.description || "No description provided"}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Two Column Layout for Pricing and Duration */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Pricing Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <DollarSign className="h-5 w-5" />
                    Pricing Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Price
                    </label>
                    <div className="mt-1">
                      {subPlan.isFree ? (
                        <div className="flex items-center gap-2">
                          <span className="text-2xl font-bold text-green-600">
                            FREE
                          </span>
                          <Gift className="h-5 w-5 text-green-600" />
                        </div>
                      ) : (
                        <span className="text-2xl font-bold">
                          {formatCurrency(subPlan.price)}
                        </span>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Pricing Display
                    </label>
                    <p className="mt-1 text-lg font-medium text-blue-600">
                      {subPlan.pricingDisplay || "Standard pricing"}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Duration Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Clock className="h-5 w-5" />
                    Duration Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Duration
                    </label>
                    <p className="text-lg font-semibold mt-1 flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      {formatDuration(subPlan.durationDays)}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Duration (Days)
                    </label>
                    <p className="text-lg font-semibold text-blue-600">
                      {subPlan.durationDays === 0
                        ? "Unlimited"
                        : `${subPlan.durationDays} days`}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Visibility & Access */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Eye className="h-5 w-5" />
                  Visibility & Access
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    {subPlan.isPublic ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-600" />
                    )}
                    <span className="text-sm">Public Access</span>
                    {subPlan.isPublic && (
                      <Globe className="h-4 w-4 text-blue-500 ml-auto" />
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {subPlan.isPrivate ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-600" />
                    )}
                    <span className="text-sm">Private Access</span>
                    {subPlan.isPrivate && (
                      <Lock className="h-4 w-4 text-orange-500 ml-auto" />
                    )}
                  </div>
                </div>
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-800">
                      Access Level
                    </span>
                  </div>
                  <p className="text-sm text-blue-700 mt-1">
                    {subPlan.isPublic && subPlan.isPrivate
                      ? "This plan has both public and private access"
                      : subPlan.isPublic
                      ? "This plan is publicly available to all users"
                      : subPlan.isPrivate
                      ? "This plan is restricted to specific users"
                      : "This plan has no specific access restrictions"}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Usage Statistics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Users className="h-5 w-5" />
                  Usage Statistics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <TrendingUp className="h-6 w-6 text-blue-600" />
                    <span className="text-3xl font-bold text-blue-600">
                      {subPlan.activeSubscriptionsCount}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Active Subscriptions
                  </p>
                  <div className="mt-3">
                    <Badge
                      variant="outline"
                      className={
                        subPlan.activeSubscriptionsCount > 0
                          ? "text-green-600 border-green-200"
                          : "text-gray-600 border-gray-200"
                      }
                    >
                      {subPlan.activeSubscriptionsCount > 0
                        ? "In Use"
                        : "No Active Users"}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Two Column Layout for System Info */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* System Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
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
                      {formatDate(subPlan.createdAt)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-muted-foreground">
                      Last Updated
                    </span>
                    <span className="text-sm">
                      {formatDate(subPlan.updatedAt)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-muted-foreground">
                      Created By
                    </span>
                    <span className="text-sm font-medium">
                      {subPlan.createdBy || "System"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-muted-foreground">
                      Updated By
                    </span>
                    <span className="text-sm font-medium">
                      {subPlan.updatedBy || "System"}
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Additional Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <TrendingUp className="h-5 w-5" />
                    Plan Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <p className="text-lg font-bold text-green-600">
                        {subPlan.activeSubscriptionsCount || 0}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Active Users
                      </p>
                    </div>
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <p className="text-lg font-bold text-blue-600">
                        {subPlan.isFree ? "Free" : "Paid"}
                      </p>
                      <p className="text-xs text-muted-foreground">Plan Type</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-sm text-muted-foreground">
                      This {subPlan.isFree ? "free" : "premium"} plan has been{" "}
                      {subPlan.status?.toLowerCase()}
                      {subPlan.activeSubscriptionsCount > 0
                        ? ` and is currently used by ${subPlan.activeSubscriptionsCount} users.`
                        : " but has no active users yet."}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
