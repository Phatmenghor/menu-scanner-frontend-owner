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

interface UserTableHandlers {
  handleEditUser: (user: UserModel) => void;
  handleViewUserDetail: (user: UserModel) => void;
  handleResetPassword: (user: UserModel) => void;
  handleDeleteUser: (user: UserModel) => void;
  handleToggleStatus: (user: UserModel) => void;
}

interface UserTableOptions {
  data: AllUserResponse | null;
  handlers: UserTableHandlers;
}

export const createUserPlatformTableColumns = ({
  data,
  handlers,
}: UserTableOptions): TableColumn<UserModel>[] => {
  const {
    handleEditUser,
    handleViewUserDetail,
    handleResetPassword,
    handleDeleteUser,
  } = handlers;

  return [
    {
      key: "index",
      label: "#",
      className: "max-w-[120px]",
      render: (_, index) => (
        <span className="font-medium">
          {indexDisplay(data?.pageNo || 1, data?.pageSize || 10, index)}
        </span>
      ),
    },
    {
      key: "avatar",
      label: "Avatar",
      className: "max-w-[80px]",
      render: (user) => {
        return (
          <CustomAvatar
            imageUrl={user.profileImageUrl}
            name={user?.firstName}
            size="md"
          />
        );
      },
    },
    {
      key: "userIdentifier",
      label: "User Identifier",
      className: "max-w-[120px]",
      render: (user) => (
        <span
          className="text-xs text-muted-foreground"
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
        <span className="text-xs text-muted-foreground" title={user?.email}>
          {user?.email || "---"}
        </span>
      ),
    },
    {
      key: "fullName",
      label: "Full Name",
      className: "max-w-[200px]",
      render: (user) => (
        <span className="text-xs text-muted-foreground" title={user?.fullName}>
          {user?.fullName || `${user.firstName} ${user.lastName}`}
        </span>
      ),
    },
    {
      key: "roles",
      label: "Role",
      className: "max-w-[200px]",
      render: (user) => (
        <>
          {user.roles?.length > 0
            ? user.roles.map((role: string) => (
                <span key={role} className="text-xs text-muted-foreground">
                  {role}
                </span>
              ))
            : "---"}
        </>
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
