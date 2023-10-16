// frontend api client
import axios from "axios";
import { apiBase } from "~/utils/constants";
import { getIdToken } from "~/lib/idToken";

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
  (err) => Promise.reject(err),
);

export { apiClient };
