import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { EXPO_PUBLIC_API_BASE_URL } from "@env";

export const HttpClient = axios.create({
  baseURL: "https://sharplook-backend-zd8j.onrender.com/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000, // 30 seconds timeout
});

HttpClient.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    // Add timestamp to prevent caching
    config.params = {
      ...config.params,
      _t: new Date().getTime(),
    };
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor for better error handling
HttpClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    // If request times out or fails, provide better error message
    if (error.code === 'ECONNABORTED') {
      console.error('Request timeout - server might be waking up');
      error.message = 'Server is starting up, please wait...';
    } else if (!error.response) {
      console.error('Network error:', error.message);
      error.message = 'Network error - please check your connection';
    }
    return Promise.reject(error);
  }
);