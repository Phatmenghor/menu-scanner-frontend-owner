import { Pagination } from "@/utils/common/pagination";

export interface AllUserResponseModel extends Pagination {
  content: UserResponseModel[];
}

export interface UserResponseModel {
  id: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
  userIdentifier: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  phoneNumber: string;
  profileImageUrl: string;
  userType: string;
  accountStatus: string;
  roles: string[];
  position: string;
  address: string;
  notes: string;
  businessId: string;
  businessName: string;
}
