export interface AllSubdomainResponse {
  content: SubdomainModel[];
  pageNo: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
  first: boolean;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface SubdomainModel {
  id: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
  subdomain: string;
  businessId: string;
  businessName: string;
  status: string;
  lastAccessed: string;
  accessCount: number;
  notes: string;
  fullDomain: string;
  fullUrl: string;
  isAccessible: boolean;
  canAccess: boolean;
  hasActiveSubscription: boolean;
  currentSubscriptionPlan: string;
  subscriptionDaysRemaining: number;
}
