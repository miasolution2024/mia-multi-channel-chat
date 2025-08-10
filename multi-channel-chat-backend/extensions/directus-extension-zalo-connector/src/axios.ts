import axios from "axios";

const axiosInstance = axios.create({ baseURL: 'https://oauth.zaloapp.com/v4/oa' });

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) =>
    Promise.reject(
      (error.response && error.response.data && error.response.data.error) ||
        "Something went wrong!"
    )
);

export default axiosInstance;