export interface AllBusinessResponse {
  content: BusinessModel[];
  pageNo: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
  first: boolean;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface BusinessModel {
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
  imageUrl: string;
  businessType: string;
  facebookUrl: string;
  instagramUrl: string;
  telegramUrl: string;
  usdToKhrRate: number;
  taxRate: number;
  status: string;
  isSubscriptionActive: boolean;
  subscriptionStartDate: string;
  subscriptionEndDate: string;
  daysRemaining: number;
  isExpiringSoon: boolean;
  totalStaff: number;
  totalCustomers: number;
  totalMenuItems: number;
  totalTables: number;
  hasActiveSubscription: boolean;
  currentSubscriptionPlan: string;
}
