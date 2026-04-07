export class ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  errors?: Record<string, { message: string }>;

  static ok<T>(data: T, message?: string): ApiResponse<T> {
    return { success: true, data, message };
  }

  static fail(
    error: string,
    errors?: Record<string, { message: string }>,
  ): ApiResponse<null> {
    return { success: false, error, ...(errors ? { errors } : {}) };
  }
}
