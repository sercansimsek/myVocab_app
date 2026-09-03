import axios from "axios";

interface ApiErrorResponse {
  error: {
    code: string;
    message: string;
  };
}

export const getApiErrorMessage = (
  error: unknown,
  fallbackMessage: string,
): string => {
  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    return error.response?.data.error.message ?? fallbackMessage;
  }

  return fallbackMessage;
};
