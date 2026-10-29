import axios from "axios";
import { config } from "../config.js";

export class ApiError extends Error {
  constructor({
    message,
    status = 0,
    fieldErrors = {},
    isNetworkError = false,
    cancelled = false,
  }) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.fieldErrors = fieldErrors;
    this.isNetworkError = isNetworkError;
    this.cancelled = cancelled;
  }
}

const client = axios.create({
  baseURL: config.apiBaseUrl,
  timeout: 15000,
  headers: { Accept: "application/json" },
});

function toApiError(error) {
  if (axios.isCancel(error))
    return new ApiError({ message: "Request cancelled", cancelled: true });

  if (error.response) {
    const { status, data } = error.response;
    const fallback =
      status >= 500
        ? "Something went wrong on our side. Please try again in a moment."
        : "The request could not be completed.";
    return new ApiError({
      status,
      message: (data && typeof data === "object" && data.message) || fallback,
      fieldErrors: (data && typeof data === "object" && data.fieldErrors) || {},
    });
  }

  if (error.code === "ECONNABORTED") {
    return new ApiError({
      message: "The server took too long to respond. Please try again.",
      isNetworkError: true,
    });
  }
  return new ApiError({
    message:
      "We couldn't reach the server. Check your connection and try again.",
    isNetworkError: true,
  });
}

client.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(toApiError(error))
);

export default client;
