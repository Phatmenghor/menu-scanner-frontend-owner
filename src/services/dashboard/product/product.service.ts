import axios from "axios";

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  status: string; // e.g. "active" | "inactive" | "discontinued"
  stock: number;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

export interface PaginatedProductsResponse {
  content: Product[];
  total: number; // total number of products across all pages
  pageNo: number; // current page number
  pageSize: number; // number of products per page
  totalPages: number; // total number of pages
}

export const mockProducts: Product[] = [
  {
    id: "1",
    name: "Wireless Bluetooth Headphones",
    description: "High-quality wireless headphones with noise cancellation",
    price: 99.99,
    category: "Electronics",
    imageUrl: "",
    status: "ACTIVE",
    stock: 50,
    createdAt: "2024-01-15T09:30:00Z",
    updatedAt: "2024-01-20T10:00:00Z",
  },
  {
    id: "2",
    name: "Ergonomic Office Chair",
    description: "Comfortable office chair with lumbar support",
    price: 299.99,
    category: "Furniture",
    imageUrl: "",
    status: "ACTIVE",
    stock: 25,
    createdAt: "2023-11-22T14:45:00Z",
    updatedAt: "2024-01-10T08:30:00Z",
  },
  {
    id: "3",
    name: "Smart Watch Series 5",
    description: "Advanced smartwatch with fitness tracking",
    price: 349.99,
    category: "Electronics",
    imageUrl: "",
    status: "ACTIVE",
    stock: 0,
    createdAt: "2024-03-10T07:20:00Z",
    updatedAt: "2024-03-15T12:00:00Z",
  },
  {
    id: "4",
    name: "Organic Cotton T-Shirt",
    description: "Soft and comfortable organic cotton t-shirt",
    price: 24.99,
    category: "Clothing",
    imageUrl: "",
    status: "ACTIVE",
    stock: 100,
    createdAt: "2024-02-05T12:00:00Z",
    updatedAt: "2024-02-05T12:00:00Z",
  },
  {
    id: "5",
    name: "Stainless Steel Water Bottle",
    description: "Insulated water bottle that keeps drinks cold for 24 hours",
    price: 19.99,
    category: "Home & Kitchen",
    imageUrl: "",
    status: "INACTIVE",
    stock: 75,
    createdAt: "2023-12-30T16:15:00Z",
    updatedAt: "2024-01-05T09:00:00Z",
  },
  {
    id: "6",
    name: "Yoga Mat Premium",
    description: "Non-slip yoga mat with extra cushioning",
    price: 39.99,
    category: "Sports & Fitness",
    imageUrl: "",
    status: "ACTIVE",
    stock: 30,
    createdAt: "2024-04-01T10:05:00Z",
    updatedAt: "2024-04-01T10:05:00Z",
  },
  {
    id: "7",
    name: "Coffee Grinder Electric",
    description: "Burr coffee grinder for perfect grinding",
    price: 79.99,
    category: "Home & Kitchen",
    imageUrl: "",
    status: "DISCONTINUED",
    stock: 5,
    createdAt: "2023-10-18T08:50:00Z",
    updatedAt: "2024-01-15T14:30:00Z",
  },
  {
    id: "8",
    name: "LED Desk Lamp",
    description: "Adjustable LED desk lamp with USB charging port",
    price: 49.99,
    category: "Home & Office",
    imageUrl: "",
    status: "ACTIVE",
    stock: 40,
    createdAt: "2024-01-22T13:40:00Z",
    updatedAt: "2024-01-22T13:40:00Z",
  },
  {
    id: "9",
    name: "Bluetooth Speaker Portable",
    description: "Waterproof portable speaker with 12-hour battery life",
    price: 59.99,
    category: "Electronics",
    imageUrl: "",
    status: "ACTIVE",
    stock: 60,
    createdAt: "2023-09-29T11:30:00Z",
    updatedAt: "2024-01-12T16:45:00Z",
  },
  {
    id: "10",
    name: "Memory Foam Pillow",
    description: "Contour memory foam pillow for better sleep",
    price: 34.99,
    category: "Home & Bedroom",
    imageUrl: "",
    status: "ACTIVE",
    stock: 80,
    createdAt: "2024-03-28T15:25:00Z",
    updatedAt: "2024-03-28T15:25:00Z",
  },
];

export async function getProductsService(
  pageNo = 1,
  pageSize = 5
): Promise<PaginatedProductsResponse> {
  try {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Calculate pagination indices
    const startIndex = (pageNo - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    // Slice the mock products for current page
    const paginatedProducts = mockProducts.slice(startIndex, endIndex);

    // Return paginated data + metadata
    return {
      content: paginatedProducts,
      total: mockProducts.length,
      pageNo,
      pageSize,
      totalPages: Math.ceil(mockProducts.length / pageSize),
    };
  } catch (error) {
    // handle axios errors or unexpected errors
    if (axios.isAxiosError(error)) {
      const raw = error.response?.data;
      const message = raw?.message || "Failed to fetch products.";
      console.error("Axios error:", message);

      throw {
        errorMessage: message,
        rawError: raw,
      };
    } else {
      console.error("Unexpected error:", error);
      throw {
        errorMessage: "An unexpected error occurred while fetching products.",
        rawError: error,
      };
    }
  }
}
