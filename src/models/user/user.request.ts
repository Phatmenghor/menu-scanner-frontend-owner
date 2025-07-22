export interface AllUserRequest {
  search?: string;
  businessId?: string;
  accountStatus?: string;
  userType?: string;
  pageNo?: number;
  pageSize?: number;
  sortBy?: string;
  sortDirection?: string;
}

export interface CreateUserRequest {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  profileImageUrl?: string;
  userType: string;
  businessId?: string;
  roles?: string[];
  position?: string;
  address?: string;
  notes?: string;
  accountStatus?: string;
}

export interface UpdateUserRequest {
  email?: string;
  firstName?: string;
  lastName?: string;
  profileImageUrl?: string;
  accountStatus?: string;
  phoneNumber?: string;
  roles?: string[];
  position?: string;
  address?: string;
  notes?: string;
}
