import { getIdToken } from "@lib/firebase";
import { hmacEncode } from "@lib/hmacEncode";
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
    const encoded = hmacEncode(config.data);
    config.headers.Authorization = token ? `Bearer ${token}` : "";
    config.headers["X-Signature"] = encoded.headers["X-Signature"];
    config.headers["X-Nonce"] = encoded.headers["X-Nonce"];
    config.headers["X-Timestamp"] = encoded.headers["X-Timestamp"];

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
