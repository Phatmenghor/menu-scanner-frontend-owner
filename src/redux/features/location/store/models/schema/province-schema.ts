import { z } from "zod";

/**
 * Create Province Schema
 */
export const createProvinceSchema = z.object({
  provinceCode: z.string().min(1, "Province Code is required"),
  provinceEn: z.string().min(1, "Province En is required"),
  provinceKh: z.string().min(1, "Province Kh is required"),
});

/**
 * Update Province Schema
 */
export const updateProvinceSchema = z.object({
  id: z.string().min(1, "Province ID is required"),
  provinceCode: z.string().min(1, "Province Code is required"),
  provinceEn: z.string().min(1, "Province En is required"),
  provinceKh: z.string().min(1, "Province Kh is required"),
});

/**
 * Combined form data type - includes all possible fields
 */
export type ProvinceFormData = {
  id: string;
  provinceCode: string;
  provinceEn: string;
  provinceKh: string;
};
