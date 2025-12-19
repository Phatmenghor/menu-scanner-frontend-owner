import { BaseGetAllRequest } from "@/utils/common/get-all-request";

export interface AllCommuneRequest extends BaseGetAllRequest {
  districtCode?: string;
  provinceCode?: string;
}

export interface CreateCommuneRequest {
  communeCode: string;
  communeEn: string;
  communeKh: string;
  districtCode: string;
}

export interface UpdateCommuneRequest {
  communeCode: string;
  communeEn: string;
  communeKh: string;
  districtCode: string;
}

export interface UpdateCommuneParams {
  communeId: string;
  communeData: UpdateCommuneRequest;
}
