import { GetAllRequest } from "@/utils/common/get-all-request";

export interface AllVillageRequest extends GetAllRequest {
  communeCode?: string;
  districtCode?: string;
  provinceCode?: string;
}

export interface CreateVillageRequest {
  businessId: string;
  planId: string;
  startDate: string;
  autoRenew: boolean;
}

export interface UpdateVillageRequest {
  planId: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  autoRenew: boolean;
}

export interface UpdateVillageParams {
  villageId: string;
  villageData: UpdateVillageRequest;
}
