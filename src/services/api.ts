// frontend api client
import axios from "axios";
import { apiBase } from "@/lib/api";
import { getIdToken } from "@/lib/firebase/getIdToken";
import { showErrorToast } from "@utils/utils";

const apiClient = axios.create({
  baseURL: apiBase(),
});

// Set interceptor because we need to always get the fresh id token on each request.
apiClient.interceptors.request.use(
  async (config) => {
    const token = await getIdToken();

    // Update config with new token.
    config.headers.Authorization = token ? `Bearer ${token}` : "";

    return config;
  },
  (error: Error) => {
    showErrorToast(error);
    console.error(error);
    // Rejecting it will cause the error to be thrown in the place where it was called.
    return Promise.reject(error);
  },
);

export { apiClient };
