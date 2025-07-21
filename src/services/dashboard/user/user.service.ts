import {
  AllUserRequest,
  CreateUserRequest,
  UpdateUserRequest,
} from "@/models/user/user.request";
import { axiosClientWithAuth, axiosServer } from "@/utils/axios";
import axios from "axios";
import { UUID } from "crypto";

export async function getAllUserService(data: AllUserRequest) {
  try {
    // POST request to fetch all staff matching the filters
    const response = await axiosClientWithAuth.post(
      `/api/v1/users/getAll`,
      data
    );
    return response.data.data; // Return the actual staff list data
  } catch (error: any) {
    // Check if the error response contains a message, throw it as Error
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    }
    console.error("Error get all users:", error); // Log error for debugging
    throw error; // Re-throw the error for further handling
  }
}

export async function createUserService(data: CreateUserRequest) {
  try {
    // POST request to fetch all staff matching the filters
    const response = await axiosClientWithAuth.post(`/api/v1/users`, data);
    return response.data.data; // Return the actual staff list data
  } catch (error: any) {
    // Check if the error response contains a message, throw it as Error
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    }
    console.error("Error create users:", error); // Log error for debugging
    throw error; // Re-throw the error for further handling
  }
}

export async function updateUserService(
  userId: string,
  data: UpdateUserRequest
) {
  try {
    // POST request to fetch all staff matching the filters
    const response = await axiosClientWithAuth.put(
      `/api/v1/users/${userId}`,
      data
    );
    return response.data.data; // Return the actual staff list data
  } catch (error: any) {
    // Check if the error response contains a message, throw it as Error
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    }
    console.error("Error update users:", error); // Log error for debugging
    throw error; // Re-throw the error for further handling
  }
}
