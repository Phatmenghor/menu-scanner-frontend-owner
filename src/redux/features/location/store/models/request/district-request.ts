import { BaseGetAllRequest } from "@/utils/common/get-all-request";

export interface AllDistrictRequest extends BaseGetAllRequest {
  provinceCode?: string;
}

export interface CreateDistrictRequest {
  districtCode: string;
  districtEn: string;
  districtKh: string;
  provinceCode: string;
}

export interface UpdateDistrictRequest {
  districtCode: string;
  districtEn: string;
  districtKh: string;
  provinceCode: string;
}

export interface UpdateDistrictParams {
  districtId: string;
  districtData: UpdateDistrictRequest;
}
