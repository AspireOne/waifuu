import { getIdToken } from "@lib/firebase";
import { getLocale } from "@lib/i18n";
import { baseApiUrl } from "@lib/paths";
import { showErrorToast } from "@lib/utils";
// frontend api client
import axios from "axios";

const apiClient = axios.create({
  baseURL: baseApiUrl(),
  headers: {
    locale: getLocale(),
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
    showErrorToast(error);
    console.error(error);
    // Rejecting it will cause the error to be thrown in the place where it was called.
    return Promise.reject(error);
  },
);

export { apiClient };
