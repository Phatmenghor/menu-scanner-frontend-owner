import { Pagination } from "@/utils/common/pagination";
import { CommuneResponseModel } from "./commune-response";

export interface AllVillageResponseModel extends Pagination {
  content: VillageResponseModel[];
}

export interface VillageResponseModel {
  id: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
  villageCode: string;
  villageEn: string;
  villageKh: string;
  communeCode: string;
  commune: CommuneResponseModel;
}
