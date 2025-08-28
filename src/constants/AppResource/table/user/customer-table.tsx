import { ActionButton } from "@/components/shared/common/action-button";
import { Badge } from "@/components/ui/badge";
import {
  AllUserResponse,
  UserModel,
} from "@/models/dashboard/user/plateform-user/user.response";
import { indexDisplay } from "@/utils/common/common";
import { dateTimeFormat } from "@/utils/date/date-time-format";
import {
  Edit,
  Eye,
  RotateCw,
  Trash,
  Building2,
  Phone,
  MapPin,
} from "lucide-react";
import { CustomAvatar } from "@/components/shared/common/custom-avator";
import { TableColumn } from "@/components/shared/common/data-table";
import { Status } from "@/constants/AppResource/status/status";

interface CustomerUserTableHandlers {
  handleEditUser: (user: UserModel) => void;
  handleViewUserDetail: (user: UserModel) => void;
  handleResetPassword: (user: UserModel) => void;
  handleDeleteUser: (user: UserModel) => void;
  handleToggleStatus: (user: UserModel) => void;
}

interface CustomerUserTableOptions {
  data: AllUserResponse | null;
  handlers: CustomerUserTableHandlers;
}

export const createCustomerUserTableColumns = ({
  data,
  handlers,
}: CustomerUserTableOptions): TableColumn<UserModel>[] => {
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
      className: "max-w-[60px]",
      render: (_, index) => (
        <span className="font-medium text-sm">
          {indexDisplay(data?.pageNo || 1, data?.pageSize || 10, index)}
        </span>
      ),
    },
    {
      key: "avatar",
      label: "Profile",
      className: "max-w-[200px]",
      render: (user) => {
        return (
          <div className="flex items-center gap-3 min-w-[180px]">
            <CustomAvatar
              imageUrl={user.profileImageUrl}
              name={user?.firstName}
              size="md"
            />
            <div className="flex flex-col gap-1">
              <span className="font-medium text-sm truncate">
                {user?.fullName ||
                  `${user.firstName || ""} ${user.lastName || ""}`.trim()}
              </span>
              <span className="text-xs text-muted-foreground truncate">
                {user?.email || "---"}
              </span>
            </div>
          </div>
        );
      },
    },
    {
      key: "userIdentifier",
      label: "Customer ID",
      className: "max-w-[120px]",
      render: (user) => (
        <div className="flex flex-col gap-1">
          <span className="text-sm font-mono" title={user?.userIdentifier}>
            {user?.userIdentifier || "---"}
          </span>
          {user?.position && (
            <span className="text-xs text-muted-foreground truncate">
              {user.position}
            </span>
          )}
        </div>
      ),
    },
    {
      key: "businessInfo",
      label: "Business",
      className: "max-w-[200px]",
      render: (user) => (
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1">
            <Building2 className="w-3 h-3 text-muted-foreground" />
            <span className="text-sm truncate" title={user?.businessName}>
              {user?.businessName || "No Business"}
            </span>
          </div>
          {user?.phoneNumber && (
            <div className="flex items-center gap-1">
              <Phone className="w-3 h-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">
                {user.phoneNumber}
              </span>
            </div>
          )}
        </div>
      ),
    },
    {
      key: "location",
      label: "Location",
      className: "max-w-[180px]",
      render: (user) => (
        <div className="flex items-start gap-1">
          <MapPin className="w-3 h-3 text-muted-foreground mt-0.5 flex-shrink-0" />
          <span
            className="text-xs text-muted-foreground line-clamp-2"
            title={user?.address}
          >
            {user?.address || "No address"}
          </span>
        </div>
      ),
    },
    {
      key: "status",
      label: "Status",
      className: "max-w-[100px]",
      render: (user) => (
        <div className="flex flex-col gap-1">
          <Badge
            variant={
              user.accountStatus === Status.ACTIVE ? "default" : "secondary"
            }
            className={`text-xs w-fit ${
              user.accountStatus === Status.ACTIVE
                ? "bg-green-100 text-green-800 hover:bg-green-200"
                : "bg-gray-100 text-gray-800 hover:bg-gray-200"
            }`}
          >
            {user.accountStatus === Status.ACTIVE ? "Active" : "Inactive"}
          </Badge>
          <button
            onClick={() => handleToggleStatus(user)}
            className="text-xs text-blue-600 hover:text-blue-800 underline w-fit"
          >
            Toggle
          </button>
        </div>
      ),
    },
    {
      key: "roles",
      label: "Roles",
      className: "max-w-[150px]",
      render: (user) => (
        <div className="flex flex-wrap gap-1">
          {user.roles?.length > 0 ? (
            user.roles.slice(0, 2).map((role: string, index: number) => (
              <Badge
                key={role}
                variant="outline"
                className="text-xs px-2 py-0.5"
              >
                {role.replace(/_/g, " ").toLowerCase()}
              </Badge>
            ))
          ) : (
            <span className="text-xs text-muted-foreground">No roles</span>
          )}
          {user.roles && user.roles.length > 2 && (
            <Badge variant="outline" className="text-xs px-2 py-0.5">
              +{user.roles.length - 2}
            </Badge>
          )}
        </div>
      ),
    },
    {
      key: "createdAt",
      label: "Join Date",
      className: "max-w-[140px]",
      render: (user) => (
        <div className="flex flex-col gap-1">
          <span className="text-sm font-medium">
            {dateTimeFormat(user?.createdAt)}
          </span>
        </div>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      className: "w-[180px]",
      render: (user) => (
        <div className="flex items-center gap-1">
          <ActionButton
            icon={<Eye className="w-4 h-4" />}
            tooltip="View Customer Details"
            onClick={() => handleViewUserDetail(user)}
            size="sm"
          />
          <ActionButton
            icon={<Edit className="w-4 h-4" />}
            tooltip="Edit Customer"
            onClick={() => handleEditUser(user)}
            size="sm"
          />
          <ActionButton
            icon={<RotateCw className="w-4 h-4" />}
            tooltip="Reset Password"
            onClick={() => handleResetPassword(user)}
            size="sm"
          />
          <ActionButton
            icon={<Trash className="w-4 h-4" />}
            tooltip="Delete Customer"
            onClick={() => handleDeleteUser(user)}
            variant="destructive"
            size="sm"
          />
        </div>
      ),
    },
  ];
};
