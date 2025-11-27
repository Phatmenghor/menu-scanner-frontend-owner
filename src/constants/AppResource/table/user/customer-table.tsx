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
  } = handlers;

  return [
    {
      key: "index",
      label: "#",
      className: "max-w-[60px]",
      render: (_, index) =>
        indexDisplay(data?.pageNo || 1, data?.pageSize || 10, index),
    },
    {
      key: "avatar",
      label: "Profile",
      className: "max-w-[200px]",
      render: (user) => (
        <CustomAvatar
          imageUrl={user.profileImageUrl}
          name={user?.firstName}
          size="md"
        />
      ),
    },
    {
      key: "userIdentifier",
      label: "Customer ID",
      className: "max-w-[120px]",
      render: (user) => user?.userIdentifier,
    },
    {
      key: "location",
      label: "Location",
      className: "max-w-[180px]",
      render: (user) => user?.address || "No address",
    },
    {
      key: "status",
      label: "Status",
      className: "max-w-[100px]",
      render: (user) => user.accountStatus,
    },
    {
      key: "createdAt",
      label: "Join Date",
      className: "max-w-[140px]",
      render: (user) => dateTimeFormat(user?.createdAt),
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
