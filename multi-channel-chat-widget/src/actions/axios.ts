import axios from "axios";
import { CONFIG } from "../config-global";

// ----------------------------------------------------------------------

const axiosInstance = axios.create({
  baseURL: CONFIG.serverUrl
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    Promise.reject(
      (error.response &&
        error.response.data &&
        error.response.data.errorMessage) ||
        "Something went wrong!"
    );
  }
);

export default axiosInstance;