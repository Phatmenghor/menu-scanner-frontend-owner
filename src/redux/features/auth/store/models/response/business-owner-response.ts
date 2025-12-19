import { Pagination } from "@/utils/common/pagination";

export interface AllBusinessOwnerResponseModel extends Pagination {
  content: BusinessOwnerResponseModel[];
}

export interface BusinessOwnerResponseModel {
  id: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
  ownerId: string;
  ownerUserIdentifier: string;
  ownerEmail: string;
  ownerFullName: string;
  ownerPhone: string;
  ownerAccountStatus: string;
  ownerProfileImageUrl: string;
  businessId: string;
  businessName: string;
  businessEmail: string;
  businessPhone: string;
  businessAddress: string;
  businessStatus: string;
  isSubscriptionActive: boolean;
  businessCreatedAt: string;
  currentSubscriptionId: string;
  currentPlanName: string;
  currentPlanPrice: number;
  currentPlanDurationDays: number;
  subscriptionStartDate: string;
  subscriptionEndDate: string;
  daysRemaining: number;
  daysActive: number;
  subscriptionStatus: string;
  autoRenew: boolean;
  isExpiringSoon: boolean;
  totalPaid: number;
  totalPending: number;
  totalPayments: number;
  completedPayments: number;
  pendingPayments: number;
  paymentStatus: string;
  lastPaymentDate: string;
}
