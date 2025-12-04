export interface AllUserRequest {
  search?: string;
  accountStatus?: string[];
  roles?: string[];
  userTypes?: string[];
  pageNo?: number;
  pageSize?: number;
  sortBy?: string;
  sortDirection?: string;
}

export interface CreateUserRequest {
  userIdentifier: string;
  email?: string;
  password: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  profileImageUrl?: string;
  userType: string;
  businessId?: string;
  roles: string[];
  position?: string;
  address?: string;
  notes?: string;
  accountStatus?: string;
}

export interface UpdateUserRequest {
  id?: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  profileImageUrl?: string;
  accountStatus?: string;
  businessId?: string;
  roles?: string[];
  position?: string;
  address?: string;
  notes?: string;
}

export interface ChangePasswordByAdminModel {
  userId: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ChangePasswordModel {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}
