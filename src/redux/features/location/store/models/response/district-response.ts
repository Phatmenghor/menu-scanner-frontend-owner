import { Pagination } from "@/utils/common/pagination";
import { ProvinceResponseModel } from "./province-response";

export interface AllDistrictResponseModel extends Pagination {
  content: DistrictResponseModel[];
}

export interface DistrictResponseModel {
  id: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
  districtCode: string;
  districtEn: string;
  districtKh: string;
  provinceCode: string;
  province: ProvinceResponseModel;
}
