import { BaseGetAllRequest } from "@/utils/common/get-all-request";

export interface AllVillageRequest extends BaseGetAllRequest {
  communeCode?: string;
  districtCode?: string;
  provinceCode?: string;
}

export interface CreateVillageRequest {
  villageCode: string;
  villageEn: string;
  villageKh: string;
  communeCode: string;
}

export interface UpdateVillageRequest {
  villageCode: string;
  villageEn: string;
  villageKh: string;
  communeCode: string;
}

export interface UpdateVillageParams {
  villageId: string;
  villageData: UpdateVillageRequest;
}
