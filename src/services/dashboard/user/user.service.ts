import { axiosServer } from "@/utils/axios";
import axios from "axios";

export interface User {
  id: string;
  name: string;
  email: string;
  profileUrl: string;
  status: string; // e.g. "active" | "inactive"
  createdAt: string; // ISO date string
  role: string; // e.g. "Admin" | "Editor" | "Viewer"
}

export interface PaginatedUsersResponse {
  content: User[];
  total: number; // total number of users across all pages
  pageNo: number; // current page number
  pageSize: number; // number of users per page
  totalPages: number; // total number of pages
}

export const mockUsers: User[] = [
  {
    id: "1",
    name: "Alice Johnson",
    email: "alice.johnson@example.com",
    role: "ADMIN",
    profileUrl: "",
    status: "ACTIVE",
    createdAt: "2024-01-15T09:30:00Z",
  },
  {
    id: "2",
    name: "Bob Smith",
    email: "bob.smith@example.com",
    role: "DEVELOPER",
    profileUrl: "",
    status: "inACTIVE",
    createdAt: "2023-11-22T14:45:00Z",
  },
  {
    id: "3",
    name: "Charlie Nguyen",
    email: "charlie.nguyen@example.com",
    role: "ADMIN",
    profileUrl: "",
    status: "ACTIVE",
    createdAt: "2024-03-10T07:20:00Z",
  },
  {
    id: "4",
    name: "Diana Lopez",
    email: "diana.lopez@example.com",
    role: "USER",
    profileUrl: "",
    status: "ACTIVE",
    createdAt: "2024-02-05T12:00:00Z",
  },
  {
    id: "5",
    name: "Ethan Wang",
    email: "ethan.wang@example.com",
    role: "USER",
    profileUrl: "",
    status: "INACTIVE",
    createdAt: "2023-12-30T16:15:00Z",
  },
  {
    id: "6",
    name: "Fiona Patel",
    email: "fiona.patel@example.com",
    role: "USER",
    profileUrl: "",
    status: "active",
    createdAt: "2024-04-01T10:05:00Z",
  },
  {
    id: "7",
    name: "George Kim",
    email: "george.kim@example.com",
    role: "ADMIN",
    profileUrl: "",
    status: "INACTIVE",
    createdAt: "2023-10-18T08:50:00Z",
  },
  {
    id: "8",
    name: "Hannah Davis",
    email: "hannah.davis@example.com",
    role: "USER",
    profileUrl: "",
    status: "ACTIVE",
    createdAt: "2024-01-22T13:40:00Z",
  },
  {
    id: "9",
    name: "Ivan Martinez",
    email: "ivan.martinez@example.com",
    role: "USER",
    profileUrl: "",
    status: "INACTIVE",
    createdAt: "2023-09-29T11:30:00Z",
  },
  {
    id: "10",
    name: "Julia Thompson",
    email: "julia.thompson@example.com",
    role: "USER",
    profileUrl: "",
    status: "ACTIVE",
    createdAt: "2024-03-28T15:25:00Z",
  },
];

export async function getUsersService(
  pageNo = 1,
  pageSize = 5
): Promise<PaginatedUsersResponse> {
  try {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Calculate pagination indices
    const startIndex = (pageNo - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    // Slice the mock users for current page
    const paginatedUsers = mockUsers.slice(startIndex, endIndex);

    // Return paginated data + metadata
    return {
      content: paginatedUsers,
      total: mockUsers.length,
      pageNo,
      pageSize,
      totalPages: Math.ceil(mockUsers.length / pageSize),
    };
  } catch (error) {
    // handle axios errors or unexpected errors
    if (axios.isAxiosError(error)) {
      const raw = error.response?.data;
      const message = raw?.message || "Failed to fetch users.";
      console.error("Axios error:", message);

      throw {
        errorMessage: message,
        rawError: raw,
      };
    } else {
      console.error("Unexpected error:", error);
      throw {
        errorMessage: "An unexpected error occurred while fetching users.",
        rawError: error,
      };
    }
  }
}
