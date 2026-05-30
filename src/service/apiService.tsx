import axios, { AxiosInstance, AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { API_CONFIG } from '../config/api';

interface ApiResponse<T = any> {
  status: boolean;
  data: T | null;
  error: any | null;
  message?: string;
}

interface BackendApiResponse<T = any> {
  success: boolean;
  statusCode: number;
  message?: string;
  data?: T;
  errors?: any;
  timestamp?: string;
}

class ApiResponseWrapper<T> implements ApiResponse<T> {
  public status: boolean;
  public data: T | null;
  public error: any | null;
  public message?: string;

  constructor(
    status: boolean,
    data: T | null,
    error: any | null = null,
    message?: string
  ) {
    this.status = status;
    this.data = data;
    this.error = error;
    this.message = message;
  }

  static success<T>(data: T): ApiResponse<T> {
    return new ApiResponseWrapper(true, data);
  }

  static error(error: any, message?: string): ApiResponse<never> {
    return new ApiResponseWrapper(false, null, error, message);
  }
}

const isBackendApiResponse = (data: unknown): data is BackendApiResponse => {
  return (
    typeof data === 'object' &&
    data !== null &&
    'success' in data &&
    'statusCode' in data &&
    'data' in data
  );
};

const apiClient: AxiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: API_CONFIG.HEADERS,
  withCredentials: true,
});

// Request interceptor - attach token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// Response interceptor - handle errors
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest: any = error.config;

    // Handle 401 - try to refresh token
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      originalRequest.url !== '/api/Auth/refresh'
    ) {
      originalRequest._retry = true;

      try {
        const response = await apiClient.post('/api/Auth/refresh', {
          accessToken: localStorage.getItem('accessToken') || '',
        });
        const refreshData = isBackendApiResponse(response.data) ? response.data.data : response.data;
        const accessToken = refreshData?.accessToken || refreshData?.token;

        if (accessToken) {
          localStorage.setItem('accessToken', accessToken);
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed - logout user
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

const handleResponse = (response: AxiosResponse): ApiResponse<any> => {
  const { data } = response;

  if (isBackendApiResponse(data)) {
    if (data.success) {
      return ApiResponseWrapper.success(data.data ?? null);
    }

    return ApiResponseWrapper.error(
      {
        message: data.message,
        status: data.statusCode,
        errors: data.errors,
        response,
      },
      data.message
    );
  }

  if (data instanceof Blob) {
    return ApiResponseWrapper.success(window.URL.createObjectURL(data));
  }

  if (['boolean', 'number', 'string'].includes(typeof data)) {
    return ApiResponseWrapper.success(data);
  }

  if (Array.isArray(data)) {
    return ApiResponseWrapper.success(data || []);
  }

  if (typeof data === 'object' && data !== null) {
    return ApiResponseWrapper.success(data);
  }

  return ApiResponseWrapper.error({
    message: 'Unknown error',
    status: null,
    response,
  });
};

export const apiService = {
  async get<T>(endpoint: string, params: Record<string, any> = {}): Promise<ApiResponse<T>> {
    try {
      const response = await apiClient.get<T>(endpoint, { params });
      return handleResponse(response);
    } catch (error: any) {
      return ApiResponseWrapper.error(error);
    }
  },

  async post<T>(endpoint: string, data: Record<string, any> = {}): Promise<ApiResponse<T>> {
    try {
      const response = await apiClient.post<T>(endpoint, data);
      return handleResponse(response);
    } catch (error: any) {
      return ApiResponseWrapper.error(error);
    }
  },

  async put<T>(endpoint: string, data: Record<string, any> = {}): Promise<ApiResponse<T>> {
    try {
      const response = await apiClient.put<T>(endpoint, data);
      return handleResponse(response);
    } catch (error: any) {
      return ApiResponseWrapper.error(error);
    }
  },

  async patch<T>(endpoint: string, data: Record<string, any> = {}): Promise<ApiResponse<T>> {
    try {
      const response = await apiClient.patch<T>(endpoint, data);
      return handleResponse(response);
    } catch (error: any) {
      return ApiResponseWrapper.error(error);
    }
  },

  async delete<T>(endpoint: string, data?: Record<string, any>): Promise<ApiResponse<T>> {
    try {
      const response = await apiClient.delete<T>(endpoint, { data });
      return handleResponse(response);
    } catch (error: any) {
      return ApiResponseWrapper.error(error);
    }
  },
};
