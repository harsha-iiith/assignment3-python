import axiosInstance from "./axiosInstance";

// Get current user profile
export const getUserProfile = async () => {
  try {
    const response = await axiosInstance.get("/users/me");
    return response.data;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
};