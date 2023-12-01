import { getIdToken } from "@lib/firebase";
import { getCurrentLocale } from "@lib/i18n";
import { baseApiUrl } from "@lib/paths";
// frontend api client
import axios from "axios";
import { toast } from "react-toastify";

const apiClient = axios.create({
  baseURL: baseApiUrl(),
  headers: {
    locale: getCurrentLocale(),
  },
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
    toast(error?.message || "Something went wrong", {
      type: "error",
    });
    console.error(error);
    // Rejecting it will cause the error to be thrown in the place where it was called.
    return Promise.reject(error);
  },
);

export { apiClient };
