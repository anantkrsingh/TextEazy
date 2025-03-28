import axios from "axios";

export const baseURL = "http://localhost:3000/api";

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
      throw new Error(
        error.response?.data?.message || "Error occurred during GET request"
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
        withCredentials:true
      });
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Error occurred during POST request"
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
      throw new Error(
        error.response?.data?.message || "Error occurred during PUT request"
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
      throw new Error(
        error.response?.data?.message || "Error occurred during DELETE request"
      );
    }
  },
};

export default apiHelper;
