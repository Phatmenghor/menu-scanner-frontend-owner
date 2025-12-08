import { Pagination } from "@/utils/common/pagination";

export interface AllExchangeRateResponseModel extends Pagination {
  content: ExchangeRateResponseModel[];
}

export interface ExchangeRateResponseModel {
  id: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
  usdToKhrRate: number;
  isActive: boolean;
  notes: string;
}
