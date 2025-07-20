import { storeRole } from "@/utils/local-storage/roles";
import { storeToken } from "@/utils/local-storage/token";

// Define the login request type (you probably already have this)
export interface LoginCredentials {
  username: string;
  password: string;
}

interface MockUser {
  id: string;
  email: string;
  password: string; // plaintext for mock only
  userRole: string; // e.g. "Admin", "Editor"
  accessToken: string; // mock token string
}

// Example mock users
const mockUsers: MockUser[] = [
  {
    id: "1",
    email: "admin@example.com",
    password: "88889999",
    userRole: "ADMIN",
    accessToken: "mocked-admin-token-abc123",
  },
];

export async function loginService(credentials: LoginCredentials) {
  try {
    // Simulate async call and delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    // Find user by email
    const user = mockUsers.find(
      (u) => u.email.toLowerCase() === credentials.username.toLowerCase()
    );

    if (!user) {
      throw {
        errorMessage: "User not found.",
        rawError: null,
      };
    }

    if (user.password !== credentials.password) {
      throw {
        errorMessage: "Incorrect password.",
        rawError: null,
      };
    }

    // On success, store token and role (simulate your original behavior)
    storeToken(user.accessToken);
    storeRole(user.userRole);

    // Return mock data structure similar to real API
    return {
      id: user.id,
      email: user.email,
      userRole: {
        userRole: user.userRole,
      },
      accessToken: user.accessToken,
    };
  } catch (error) {
    console.error("Login service error:", error);

    // Re-throw or transform error if needed
    throw {
      errorMessage: "An unexpected error occurred during login.",
      rawError: error,
    };
  }
}
