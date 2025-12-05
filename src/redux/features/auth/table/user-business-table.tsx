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

export const userBusinessTableColumns = ({
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
      minWidth: "60px",
      maxWidth: "80px",
      render: (_, index) => (
        <span className="font-medium">
          {indexDisplay(data?.pageNo || 1, data?.pageSize || 10, index)}
        </span>
      ),
    },
    {
      key: "avatar",
      label: "Avatar",
      minWidth: "70px",
      maxWidth: "90px",
      render: (user) => {
        return (
          <CustomAvatar
            imageUrl={user.profileImageUrl}
            name={user?.firstName}
            size="lg"
          />
        );
      },
    },
    {
      key: "userIdentifier",
      label: "User Identifier",
      minWidth: "200px",
      maxWidth: "350px",
      truncate: true,
      render: (user) => (
        <span className="text-xs text-muted-foreground">
          {user?.userIdentifier || "---"}
        </span>
      ),
    },
    {
      key: "phoneNumber",
      label: "Phone Number",
      minWidth: "200px",
      maxWidth: "350px",
      truncate: true,
      render: (user) => (
        <span className="text-xs text-muted-foreground">
          {user?.phoneNumber || "---"}
        </span>
      ),
    },
    {
      key: "email",
      label: "Email",
      minWidth: "180px",
      maxWidth: "300px",
      truncate: true,
      render: (user) => (
        <span className="text-xs text-muted-foreground">
          {user?.email || "---"}
        </span>
      ),
    },
    {
      key: "fullName",
      label: "Full Name",
      minWidth: "150px",
      maxWidth: "250px",
      truncate: true,
      render: (user) => (
        <span className="text-xs text-muted-foreground">
          {user?.fullName || `${user.firstName} ${user.lastName}`}
        </span>
      ),
    },
    {
      key: "roles",
      label: "Role",
      minWidth: "120px",
      maxWidth: "200px",
      truncate: true,
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
      key: "accountStatus",
      label: "Account Status",
      minWidth: "150px",
      maxWidth: "250px",
      truncate: true,
      render: (user) => (
        <span className="text-xs text-muted-foreground">
          {user?.accountStatus || "---"}
        </span>
      ),
    },
    {
      key: "createdAt",
      label: "Created At",
      minWidth: "150px",
      maxWidth: "200px",
      render: (user) => (
        <span className="text-sm text-muted-foreground">
          {dateTimeFormat(user?.createdAt)}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      minWidth: "200px",
      maxWidth: "240px",
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
