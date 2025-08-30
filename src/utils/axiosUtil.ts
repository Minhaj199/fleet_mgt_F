import axios, {
  type AxiosRequestConfig,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";


const client = axios.create({
  baseURL: import.meta.env.VITE_BACKENT_URL,
});


// Request Interceptor
client.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    return config;
  },
  (error) => Promise.reject(error)
);
// Response Interceptor
client.interceptors.response.use(
  (response: AxiosResponse) => response.data,
  async (error) => {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Something went wrong";
    return Promise.reject(new Error(message));
  }
);

export const request = async <T = any>(
  options: AxiosRequestConfig
): Promise<T> => {
  return client(options) as Promise<T>;
};



