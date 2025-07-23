export interface AllBusinessRequest {
  search?: string;
  status?: string;
  hasActiveSubscription?: boolean;
  pageNo?: number;
  pageSize?: number;
  sortBy?: string;
  sortDirection?: string;
}

export interface CreateBusinessRequest {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  description?: string;
}

export interface UpdateBusinessRequest {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  description?: string;
  status?: string;
}
