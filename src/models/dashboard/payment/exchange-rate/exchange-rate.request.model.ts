export interface SaveExchangeRateRequest {
  usdToKhrRate: number;
  notes?: string;
}

export interface AllExchangeRateRequest {
  search?: string;
  isActive?: boolean;
  pageNo?: number;
  pageSize?: number;
  sortBy?: string;
  sortDirection?: string;
}
