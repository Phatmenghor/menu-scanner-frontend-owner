// src/redux/features/auth/table/users-business-monitor-table.tsx
import { ActionButton } from "@/components/button/action-button";
import { indexDisplay } from "@/utils/common/common";
import { dateTimeFormat } from "@/utils/date/date-time-format";
import { Eye, Trash, RefreshCw, XCircle, ArrowRightLeft } from "lucide-react";
import { CustomAvatar } from "@/components/shared/avator/custom-avator";
import { TableColumn } from "@/components/shared/common/data-table";
import {
  AllBusinessOwnerResponseModel,
  BusinessOwnerResponseModel,
} from "../store/models/response/business-owner-response";

interface BusinessOwnerTableHandlers {
  handleViewUserDetail: (user: BusinessOwnerResponseModel) => void;
  handleDeleteUser: (user: BusinessOwnerResponseModel) => void;
  handleRenewSubscription: (user: BusinessOwnerResponseModel) => void;
  handleCancelSubscription: (user: BusinessOwnerResponseModel) => void;
  handleChangePlan: (user: BusinessOwnerResponseModel) => void;
}

interface BusinessOwnerTableOptions {
  data: AllBusinessOwnerResponseModel | null;
  handlers: BusinessOwnerTableHandlers;
}

export const userBusinessOwnerTableColumns = ({
  data,
  handlers,
}: BusinessOwnerTableOptions): TableColumn<BusinessOwnerResponseModel>[] => {
  const {
    handleViewUserDetail,
    handleDeleteUser,
    handleRenewSubscription,
    handleCancelSubscription,
    handleChangePlan,
  } = handlers;

  return [
    {
      key: "index",
      label: "#",
      minWidth: "10px",
      maxWidth: "400px",
      render: (_, index) => (
        <span className="font-medium">
          {indexDisplay(data?.pageNo || 1, data?.pageSize || 10, index + 1)}
        </span>
      ),
    },
    {
      key: "avatar",
      label: "Avatar",
      minWidth: "10px",
      maxWidth: "400px",
      render: (user) => {
        return (
          <CustomAvatar
            imageUrl={user.ownerProfileImageUrl}
            name={user?.ownerFullName}
            size="lg"
          />
        );
      },
    },
    {
      key: "userIdentifier",
      label: "User Identifier",
      minWidth: "10px",
      maxWidth: "400px",
      truncate: true,
      render: (user) => (
        <span className="text-xs text-muted-foreground">
          {user?.ownerUserIdentifier || "---"}
        </span>
      ),
    },
    {
      key: "ownerFullName",
      label: "Full Name",
      minWidth: "10px",
      maxWidth: "400px",
      truncate: true,
      render: (user) => (
        <span className="text-xs text-muted-foreground font-medium">
          {user?.ownerFullName || "---"}
        </span>
      ),
    },
    {
      key: "phoneNumber",
      label: "Phone Number",
      minWidth: "10px",
      maxWidth: "400px",
      truncate: true,
      render: (user) => (
        <span className="text-xs text-muted-foreground">
          {user?.ownerPhone || "---"}
        </span>
      ),
    },
    {
      key: "businessName",
      label: "Business Name",
      minWidth: "10px",
      maxWidth: "400px",
      truncate: true,
      render: (user) => (
        <span className="text-xs text-muted-foreground font-medium">
          {user?.businessName || "---"}
        </span>
      ),
    },
    {
      key: "businessEmail",
      label: "Business Email",
      minWidth: "10px",
      maxWidth: "400px",
      truncate: true,
      render: (user) => (
        <span className="text-xs text-muted-foreground">
          {user?.businessEmail || "---"}
        </span>
      ),
    },
    {
      key: "currentPlanName",
      label: "Current Plan",
      minWidth: "10px",
      maxWidth: "400px",
      truncate: true,
      render: (user) => (
        <span className="text-xs text-muted-foreground font-medium">
          {user?.currentPlanName || "---"}
        </span>
      ),
    },
    {
      key: "daysRemaining",
      label: "Days Remaining",
      minWidth: "10px",
      maxWidth: "400px",
      render: (user) => {
        const daysRemaining = user?.daysRemaining || 0;
        const colorClass =
          daysRemaining <= 7
            ? "text-red-600 font-semibold"
            : daysRemaining <= 30
            ? "text-yellow-600 font-medium"
            : "text-green-600";

        return (
          <span className={`text-xs ${colorClass}`}>{daysRemaining} days</span>
        );
      },
    },
    {
      key: "daysActive",
      label: "Days Active",
      minWidth: "10px",
      maxWidth: "400px",
      render: (user) => (
        <span className="text-xs text-muted-foreground">
          {user?.daysActive || 0} days
        </span>
      ),
    },
    {
      key: "subscriptionStatus",
      label: "Status",
      minWidth: "10px",
      maxWidth: "400px",
      render: (user) => {
        const isActive = user?.subscriptionStatus === "ACTIVE";
        return (
          <span
            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
              isActive
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {isActive ? "Active" : "Expired"}
          </span>
        );
      },
    },
    {
      key: "autoRenew",
      label: "Auto Renew",
      minWidth: "10px",
      maxWidth: "400px",
      render: (user) => {
        const autoRenew = user?.autoRenew === true;
        return (
          <span
            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
              autoRenew
                ? "bg-blue-100 text-blue-700"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            {autoRenew ? "Enabled" : "Disabled"}
          </span>
        );
      },
    },
    {
      key: "createdAt",
      label: "Created At",
      minWidth: "10px",
      maxWidth: "400px",
      render: (user) => (
        <span className="text-xs text-muted-foreground">
          {dateTimeFormat(user?.createdAt)}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      minWidth: "10px",
      maxWidth: "400px",
      render: (user) => {
        const isActive = user?.subscriptionStatus === "ACTIVE";

        return (
          <div className="flex items-center gap-1">
            {/* View Details */}
            <ActionButton
              icon={<Eye className="w-4 h-4" />}
              tooltip="View Details"
              onClick={() => handleViewUserDetail(user)}
              size="sm"
            />

            <ActionButton
              icon={<RefreshCw className="w-4 h-4" />}
              tooltip="Renew Subscription"
              onClick={() => handleRenewSubscription(user)}
              size="sm"
              variant="outline"
              className="text-blue-600 hover:text-blue-700"
            />

            {/* Change Plan */}
            <ActionButton
              icon={<ArrowRightLeft className="w-4 h-4" />}
              tooltip="Change Plan"
              onClick={() => handleChangePlan(user)}
              size="sm"
              variant="outline"
              className="text-purple-600 hover:text-purple-700"
            />

            {/* Cancel Subscription - Only show if active */}
            {isActive && (
              <ActionButton
                icon={<XCircle className="w-4 h-4" />}
                tooltip="Cancel Subscription"
                onClick={() => handleCancelSubscription(user)}
                size="sm"
                variant="outline"
                className="text-orange-600 hover:text-orange-700"
              />
            )}

            {/* Delete User */}
            <ActionButton
              icon={<Trash className="w-4 h-4" />}
              tooltip="Delete User"
              onClick={() => handleDeleteUser(user)}
              size="sm"
              variant="destructive"
            />
          </div>
        );
      },
    },
  ];
};
