import { ActionButton } from "@/components/shared/common/action-button";
import {
  AllUserResponse,
  UserModel,
} from "@/models/dashboard/user/plateform-user/user.response";
import { indexDisplay } from "@/utils/common/common";
import { dateTimeFormat } from "@/utils/date/date-time-format";
import { Edit, Eye, RotateCw, Trash } from "lucide-react";
import { CustomAvatar } from "@/components/shared/common/custom-avator";
import { TableColumn } from "@/components/shared/common/data-table";
import { RoleBadge } from "@/components/shared/badge/role-badge";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface BusinessUserTableHandlers {
  handleEditUser: (user: UserModel) => void;
  handleViewUserDetail: (user: UserModel) => void;
  handleResetPassword: (user: UserModel) => void;
  handleDeleteUser: (user: UserModel) => void;
  handleToggleStatus: (user: UserModel) => void;
}

interface BusinessUserTableOptions {
  data: AllUserResponse | null;
  handlers: BusinessUserTableHandlers;
  isSubmitting?: boolean;
}

export const createBusinessUserTableColumns = ({
  data,
  handlers,
  isSubmitting = false,
}: BusinessUserTableOptions): TableColumn<UserModel>[] => {
  const {
    handleEditUser,
    handleViewUserDetail,
    handleResetPassword,
    handleDeleteUser,
    handleToggleStatus,
  } = handlers;

  return [
    {
      key: "index",
      label: "#",
      className: "max-w-[80px]",
      render: (_, index) => (
        <span className="font-medium">
          {indexDisplay(data?.pageNo || 1, data?.pageSize || 10, index)}
        </span>
      ),
    },
    {
      key: "avatar",
      label: "Avatar",
      className: "max-w-[100px]",
      render: (user) => {
        const profileImageUrl =
          user?.profileImageUrl && process.env.NEXT_PUBLIC_API_BASE_URL
            ? `${process.env.NEXT_PUBLIC_API_BASE_URL}${user.profileImageUrl}`
            : undefined;

        return (
          <CustomAvatar
            imageUrl={profileImageUrl}
            name={user?.firstName || user?.email}
            size="md"
          />
        );
      },
    },
    {
      key: "userIdentifier",
      label: "User Identifier",
      className: "max-w-[150px]",
      render: (user) => (
        <span
          className="text-sm text-muted-foreground"
          title={user?.userIdentifier}
        >
          {user?.userIdentifier || "---"}
        </span>
      ),
    },
    {
      key: "email",
      label: "Email",
      className: "max-w-[250px]",
      render: (user) => (
        <span className="text-sm text-muted-foreground" title={user?.email}>
          {user?.email || "---"}
        </span>
      ),
    },
    {
      key: "fullName",
      label: "Full Name",
      className: "max-w-[200px]",
      render: (user) => (
        <span className="text-sm text-muted-foreground" title={user?.fullName}>
          {user?.fullName || `${user.firstName} ${user.lastName}`}
        </span>
      ),
    },
    {
      key: "businessName",
      label: "Business",
      className: "max-w-[200px]",
      render: (user) => (
        <span
          className="text-sm text-muted-foreground"
          title={user?.businessName}
        >
          {user?.businessName || "---"}
        </span>
      ),
    },
    {
      key: "roles",
      label: "Role",
      className: "max-w-[200px]",
      render: (user) => (
        <div className="flex flex-wrap gap-1">
          {user.roles?.length > 0 ? (
            user.roles.map((role: string) => (
              <RoleBadge key={role} role={role} />
            ))
          ) : (
            <span className="text-sm text-muted-foreground">---</span>
          )}
        </div>
      ),
    },
    {
      key: "status",
      label: "Status",
      className: "max-w-[100px]",
      render: (user) => (
        <Switch
          checked={user?.accountStatus === "ACTIVE"}
          onCheckedChange={() => handleToggleStatus(user)}
          disabled={isSubmitting}
          aria-label="Toggle user status"
          className={cn(
            "relative inline-flex h-5 w-9 items-center rounded-full transition-colors",
            "bg-gray-300 dark:bg-gray-600 data-[state=checked]:bg-primary dark:data-[state=checked]:bg-primary"
          )}
        >
          <div
            className={cn(
              "inline-block h-6 w-6 transform rounded-full bg-white dark:bg-gray-100 shadow-md transition-transform",
              "translate-x-1 data-[state=checked]:translate-x-5"
            )}
          >
            {user.accountStatus === "ACTIVE" && (
              <Check className="h-6 w-6 m-auto text-orange-600 dark:text-orange-300" />
            )}
          </div>
        </Switch>
      ),
    },
    {
      key: "createdAt",
      label: "Created At",
      className: "max-w-[180px]",
      render: (user) => (
        <span className="text-sm text-muted-foreground">
          {dateTimeFormat(user?.createdAt)}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      className: "w-[200px]",
      render: (user) => (
        <div className="flex items-center gap-2">
          <ActionButton
            icon={<Eye className="w-4 h-4" />}
            tooltip="View Details"
            onClick={() => handleViewUserDetail(user)}
          />
          <ActionButton
            icon={<Edit className="w-4 h-4" />}
            tooltip="Edit User"
            onClick={() => handleEditUser(user)}
          />
          <ActionButton
            icon={<RotateCw className="w-4 h-4" />}
            tooltip="Reset Password"
            onClick={() => handleResetPassword(user)}
          />
          <ActionButton
            icon={<Trash className="w-4 h-4" />}
            tooltip="Delete User"
            onClick={() => handleDeleteUser(user)}
            variant="destructive"
          />
        </div>
      ),
    },
  ];
};
