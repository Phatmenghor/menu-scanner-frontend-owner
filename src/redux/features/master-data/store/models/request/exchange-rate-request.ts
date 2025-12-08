export interface AllExchangeRateRequest {
  search?: string;
  isActive?: boolean;
  pageNo?: number;
  pageSize?: number;
  sortBy?: string;
  sortDirection?: string;
}

export interface CreateExchangeRateRequest {
  usdToKhrRate: number;
  notes?: string;
}

export interface UpdateExchangeRateRequest {
  usdToKhrRate: number;
  notes?: string;
}

export interface UpdateExchangeRateParams {
  exchangeRateId: string;
  exchangeRateData: UpdateExchangeRateRequest;
}
