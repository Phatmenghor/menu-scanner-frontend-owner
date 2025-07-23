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
  name: string;
  email: string;
  phone: string;
  address: string;
  description: string;
  logoUrl: string;
  website: string;
  businessType: string;
  cuisineType: string;
  operatingHours: string;
  facebookUrl: string;
  instagramUrl: string;
  telegramContact: string;
  usdToKhrRate: number;
  taxRate: number;
  serviceChargeRate: number;
  acceptsOnlinePayment: boolean;
  acceptsCashPayment: boolean;
  acceptsBankTransfer: boolean;
  acceptsMobilePayment: boolean;
  status: string;
  isSubscriptionActive: boolean;
  subscriptionStartDate: string;
  subscriptionEndDate: string;
  daysRemaining: number;
  isExpiringSoon: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
  totalStaff: number;
  totalCustomers: number;
  totalMenuItems: number;
  totalTables: number;
  hasActiveSubscription: boolean;
  currentSubscriptionPlan: string;
}
