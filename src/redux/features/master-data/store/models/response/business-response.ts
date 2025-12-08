import { Pagination } from "@/utils/common/pagination";

export interface AllBusinessResponseModel extends Pagination {
  content: BusinessResponseModel[];
}

export interface BusinessResponseModel {
  id: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  description: string;
  status: string;
  isSubscriptionActive: boolean;
  hasActiveSubscription: boolean;
}
