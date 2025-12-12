import { Pagination } from "@/utils/common/pagination";

export interface AllProvinceResponseModel extends Pagination {
  content: ProvinceResponseModel[];
}

export interface ProvinceResponseModel {
  id: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
  provinceCode: string;
  provinceEn: string;
  provinceKh: string;
}
