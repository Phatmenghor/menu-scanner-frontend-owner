import { FieldError } from "react-hook-form";

export const getFieldError = (error: unknown): FieldError | undefined => {
  if (!error) return undefined;
  if (typeof error === "object" && error !== null && "message" in error) {
    return error as FieldError;
  }
  return undefined;
};
