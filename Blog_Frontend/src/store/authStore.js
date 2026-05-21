import { create } from "zustand";
import axios from "axios";

export const useAuth = create((set) => ({
  currentUser: null,
  loading: false,
  isAuthenticated: false,
  isCheckingAuth: true,
  error: null,
  login: async (userCred) => {
    try {
      set({ loading: true, currentUser: null, isAuthenticated: false, error: null });
      let res = await axios.post(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/common-api/login`, userCred, { withCredentials: true });
      if (res.status === 200 || res.status === 201) {
        set({
          currentUser: res.data?.payload,
          loading: false,
          isAuthenticated: true,
          error: null,
        });
      } else {
        set({
          loading: false,
          isAuthenticated: false,
          currentUser: null,
          error: "Login failed",
        });
      }
    } catch (err) {
      console.log("err is ", err);
      set({
        loading: false,
        isAuthenticated: false,
        currentUser: null,
        error: err.response?.data?.message || err.response?.data?.error || "Login failed",
      });
    }
  },
  logout: async () => {
    try {
      let res = await axios.get(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/common-api/logout`, { withCredentials: true });
      if (res.status === 200) {
        set({
          currentUser: null,
          isAuthenticated: false,
          error: null,
          loading: false,
        });
      }
    } catch (err) {
      set({
        loading: false,
        isAuthenticated: false,
        currentUser: null,
        error: err.response?.data?.message || err.response?.data?.error || "Logout failed",
      });
    }
  },
  checkAuth: async () => {
    try {
      set({ isCheckingAuth: true });
      const res = await axios.get(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/common-api/check-auth`, { withCredentials: true });

      set({
        currentUser: res.data.payload,
        isAuthenticated: true,
        isCheckingAuth: false,
      });
    } catch (err) {
      if (err.response?.status === 401) {
        set({
          currentUser: null,
          isAuthenticated: false,
          isCheckingAuth: false,
        });
        return;
      }
      console.error("Auth check failed:", err);
      set({
        currentUser: null,
        isAuthenticated: false,
        isCheckingAuth: false,
      });
    }
  },
}));