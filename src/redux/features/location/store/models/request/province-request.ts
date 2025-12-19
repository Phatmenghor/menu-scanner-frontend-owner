import { BaseGetAllRequest } from "@/utils/common/get-all-request";

export interface AllProvinceRequest extends BaseGetAllRequest {}

export interface CreateProvinceRequest {
  provinceCode: string;
  provinceEn: string;
  provinceKh: string;
}

export interface UpdateProvinceRequest {
  provinceCode: string;
  provinceEn: string;
  provinceKh: string;
}

export interface UpdateProvinceParams {
  provinceId: string;
  provinceData: UpdateProvinceRequest;
}
