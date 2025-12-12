import { z } from "zod";

/**
 * Create Commune Schema
 */
export const createCommuneSchema = z.object({
  communeCode: z.string().min(1, "Commune Code is required"),
  communeEn: z.string().min(1, "Commune En is required"),
  communeKh: z.string().min(1, "Commune Kh is required"),
  districtCode: z.string().min(1, "District code is required"),
});

/**
 * Update Commune Schema
 */
export const updateCommuneSchema = z.object({
  id: z.string().min(1, "Commune ID is required"),
  communeCode: z.string().min(1, "Commune Code is required"),
  communeEn: z.string().min(1, "Commune En is required"),
  communeKh: z.string().min(1, "Commune Kh is required"),
  districtCode: z.string().min(1, "District code is required"),
});

/**
 * Combined form data type - includes all possible fields
 */
export type CommuneFormData = {
  id: string;
  communeCode: string;
  communeEn: string;
  communeKh: string;
  districtCode: string;
};
