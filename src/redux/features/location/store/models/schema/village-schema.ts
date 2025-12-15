import { z } from "zod";

/**
 * Create Village Schema
 */
export const createVillageSchema = z.object({
  villageCode: z.string().min(1, "Village Code is required"),
  villageEn: z.string().min(1, "Village En is required"),
  villageKh: z.string().min(1, "Village Kh is required"),
  communeCode: z.string().min(1, "Commune code is required"),
});

/**
 * Update Village Schema
 */
export const updateVillageSchema = z.object({
  id: z.string().min(1, "Village ID is required"),
  villageCode: z.string().min(1, "Village Code is required"),
  villageEn: z.string().min(1, "Village En is required"),
  villageKh: z.string().min(1, "Village Kh is required"),
  communeCode: z.string().min(1, "Commune code is required"),
});

/**
 * Combined form data type - includes all possible fields
 */
export type VillageFormData = {
  id: string;
  villageCode: string;
  villageEn: string;
  villageKh: string;
  communeCode: string;
};
