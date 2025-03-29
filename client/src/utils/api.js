import axios, { Axios, AxiosError } from "axios";

export const baseURL = "https://texteazy.onrender.com/api";

const apiHelper = {
  async get(endpoint) {
    try {
      const response = await axios.get(`${baseURL}${endpoint}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        withCredentials: true,
      });

      return response.data;
    } catch (error) {
      throw new AxiosError(
        error.response?.data?.message || "Error occurred during GET request",
        error.response?.status?.toString() || "UNKNOWN_ERROR"
      );
    }
  },

  async post(endpoint, data) {
    try {
      const response = await axios.post(`${baseURL}${endpoint}`, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      throw new AxiosError(
        error.response?.data?.message || "Error occurred during GET request",
        error.response?.status?.toString() || "UNKNOWN_ERROR"
      );
    }
  },

  async put(endpoint, data) {
    try {
      const response = await axios.put(`${baseURL}${endpoint}`, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return response.data;
    } catch (error) {
      throw new AxiosError(
        error.response?.data?.message || "Error occurred during GET request",
        error.response?.status?.toString() || "UNKNOWN_ERROR"
      );
    }
  },

  async delete(endpoint) {
    try {
      const response = await axios.delete(`${baseURL}${endpoint}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return response.data;
    } catch (error) {
      throw new AxiosError(
        error.response?.data?.message || "Error occurred during GET request",
        error.response?.status?.toString() || "UNKNOWN_ERROR"
      );
    }
  },
};

export default apiHelper;
