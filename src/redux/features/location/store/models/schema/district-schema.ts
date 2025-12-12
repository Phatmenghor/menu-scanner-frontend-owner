import { z } from "zod";

/**
 * Create District Schema
 */
export const createDistrictSchema = z.object({
  districtCode: z.string().min(1, "District Code is required"),
  districtEn: z.string().min(1, "District En is required"),
  districtKh: z.string().min(1, "District Kh is required"),
  provinceCode: z.string().min(1, "Province code is required"),
});

/**
 * Update District Schema
 */
export const updateDistrictSchema = z.object({
  id: z.string().min(1, "District ID is required"),
  districtCode: z.string().min(1, "District Code is required"),
  districtEn: z.string().min(1, "District En is required"),
  districtKh: z.string().min(1, "District Kh is required"),
  provinceCode: z.string().min(1, "Province code is required"),
});

/**
 * Combined form data type - includes all possible fields
 */
export type DistrictFormData = {
  id: string;
  districtCode: string;
  districtEn: string;
  districtKh: string;
  provinceCode: string;
};
