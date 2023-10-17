// frontend api client
import axios from "axios";
import { apiBase } from "~/lib/api";
import { getIdToken } from "~/lib/firebase/getIdToken";

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
