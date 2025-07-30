export interface AllSubDomainRequest {
  search: string;
  pageNo: number;
  pageSize: number;
  sortBy: string;
  sortDirection: string;
  businessId: string;
  status: string;
  hasActiveSubscription: boolean;
}
