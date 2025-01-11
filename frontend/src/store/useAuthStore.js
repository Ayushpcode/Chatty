import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import { toast } from "react-hot-toast";
import { io } from "socket.io-client";

const BASE_URL = "http://localhost:5000";

export const useAuthStore = create((set, get) => ({
  authUser: null,
  token: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  onlineUsers: [],
  socket: null,

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: res.data });
      get().connectSocket();
    } catch (error) {
      console.error(
        "Authentication check failed:",
        error.response?.data?.message || error.message
      );
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      if (res.data.token) {
        set({ token: res.data.token });
      }
      set({ authUser: res.data });
      toast.success("Account created successfully!");
      get().connectSocket();
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Signup failed!";
      toast.error(errorMessage);
      console.error("Signup Error:", errorMessage);
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      if (res.data.token) {
        set({ token: res.data.token });
      }
      set({ authUser: res.data });
      toast.success("Logged in successfully!");

      get().connectSocket();
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Login failed!";
      toast.error(errorMessage);
      console.error("Login Error:", errorMessage);
    } finally {
      set({ isLoggingIn: false });
    }
  },

  forgotPassword: async (email) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/forgot-password", { email });
  
      // Success
      toast.success(res.data.message || "Password reset email sent!");
    } catch (error) {
      // Enhanced error handling and logging
      const errorMessage = error.response?.data?.message || "Failed to send reset email.";
  
      // Display error message to the user
      toast.error(errorMessage);
  
      // Log the full error for debugging
      console.error("Forgot Password Error:", error);
  
      // Check for specific error codes
      if (error.response?.status === 401) {
        console.error("Unauthorized: Please check authentication or token.");
      } else if (error.response?.status === 500) {
        console.error("Server Error: There might be a backend issue.");
      }
    } finally {
      set({ isLoggingIn: false }); // Hide loading state
    }
  },


  resetPassword: async (id, token, newPassword) => {
    try {
      const res = await axiosInstance.post(`/auth/reset-password/${id}/${token}`, {
        password: newPassword,
      });
      toast.success("Password reset successfully!");
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to reset password.";
      toast.error(errorMessage);
      console.error("Reset Password Error:", error);
    }
  },
  
  

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success("Logged out successfully!");
      get().disconnectSocket();
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Logout failed!";
      toast.error(errorMessage);
      console.error("Logout Error:", errorMessage);
    }
  },

  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });


    try {
      const res = await axiosInstance.post("/auth/update-profile", data);
      set({ authUser: res.data });
      toast.success("Profile updated successfully");
    } catch (error) {
      console.log("Error in update profile:", error);
      toast.error("Failed to update profile");
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  connectSocket: () => {
    const { authUser } = get();
    if (!authUser || get().socket?.connected) return;

    const socket = io(BASE_URL, {
      query: {
        userId: authUser._id,
      }
    })
    socket.connect();
    
    set({ socket: socket })

    socket.on("getOnlineUsers", (userIds) =>{
      set({ onlineUsers: userIds})
    })

  },

  disconnectSocket: () => {
    const socket = get().socket;
    if (socket) {
      socket.disconnect(); // Properly disconnect the socket
      set({ socket: null }); // Clear the socket reference
    }
  },
}));
