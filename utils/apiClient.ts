import { ApiResponse } from "@/types/ApiResponse";
import { appConfig } from "@/config/config";

export interface ApiConfig {
    timeout?: number;
    retries?: number;
    retryDelay?: number;
    retryCondition?: (error: Error, attempt: number) => boolean;
}

export interface RequestOptions extends RequestInit {
    timeout?: number;
    retries?: number;
    retryDelay?: number;
    retryCondition?: (error: Error, attempt: number) => boolean;
}

class ApiError extends Error {
    public status?: number;
    public exception?: string;
    public response?: Response;

    constructor(message: string, status?: number, exception?: string, response?: Response) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
        this.exception = exception;
        this.response = response;
        
        if (exception) {
            this.name = exception;
        }
    }
}

class ApiClient {
    private defaultConfig: Required<ApiConfig> = {
        timeout: 30000, // 30 seconds
        retries: 3,
        retryDelay: 1000, // 1 second
        retryCondition: (error: Error, attempt: number) => {
            // Retry on network errors, timeouts, and 5xx server errors
            if (error.name === 'AbortError' || error.name === 'TypeError') {
                return attempt < 3;
            }
            if (error instanceof ApiError && error.status) {
                return error.status >= 500 && attempt < 3;
            }
            return false;
        }
    };

    private createTimeoutController(timeout: number): AbortController {
        const controller = new AbortController();
        setTimeout(() => controller.abort(), timeout);
        return controller;
    }

    private async delay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    private getDefaultHeaders(): HeadersInit {
        return {
            'Content-Type': 'application/json',
            'x-api-key': `Basic ${appConfig.DOPA_API_AUTH}`,
        };
    }

    private async makeRequest<T>(
        url: string,
        options: RequestOptions = {}
    ): Promise<ApiResponse<T>> {
        const {
            timeout = this.defaultConfig.timeout,
            retries = this.defaultConfig.retries,
            retryDelay = this.defaultConfig.retryDelay,
            retryCondition = this.defaultConfig.retryCondition,
            ...fetchOptions
        } = options;

        const headers = {
            ...this.getDefaultHeaders(),
            ...fetchOptions.headers,
        };

        let lastError: Error;
        let attempt = 0;

        while (attempt <= retries) {
            try {
                const controller = this.createTimeoutController(timeout);
                
                const response = await fetch(url, {
                    ...fetchOptions,
                    headers,
                    signal: controller.signal,
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    let errorData: any = {};
                    
                    try {
                        errorData = JSON.parse(errorText);
                    } catch {
                        // If response is not JSON, use the text as message
                        errorData = { message: errorText };
                    }

                    throw new ApiError(
                        errorData.message || `HTTP ${response.status}: ${response.statusText}`,
                        response.status,
                        errorData.exception,
                        response
                    );
                }

                const data = await response.json() as ApiResponse<T>;

                // Check if the API response indicates failure
                if (!data.status) {
                    throw new ApiError(
                        data.message || 'API request failed',
                        response.status,
                        data.exception,
                        response
                    );
                }

                return data;

            } catch (error) {
                lastError = error as Error;
                attempt++;

                // If this is the last attempt or retry condition is not met, throw the error
                if (attempt > retries || !retryCondition(lastError, attempt)) {
                    throw lastError;
                }

                // Wait before retrying with exponential backoff
                const delayTime = retryDelay * Math.pow(2, attempt - 1);
                await this.delay(delayTime);
            }
        }

        throw lastError!;
    }

    async get<T>(url: string, options: RequestOptions = {}): Promise<ApiResponse<T>> {
        return this.makeRequest<T>(url, {
            ...options,
            method: 'GET',
        });
    }

    async post<T>(
        url: string,
        data?: any,
        options: RequestOptions = {}
    ): Promise<ApiResponse<T>> {
        return this.makeRequest<T>(url, {
            ...options,
            method: 'POST',
            body: data ? JSON.stringify(data) : undefined,
        });
    }

    async put<T>(
        url: string,
        data?: any,
        options: RequestOptions = {}
    ): Promise<ApiResponse<T>> {
        return this.makeRequest<T>(url, {
            ...options,
            method: 'PUT',
            body: data ? JSON.stringify(data) : undefined,
        });
    }

    async delete<T>(url: string, options: RequestOptions = {}): Promise<ApiResponse<T>> {
        return this.makeRequest<T>(url, {
            ...options,
            method: 'DELETE',
        });
    }

    // Method to update default configuration
    updateConfig(config: Partial<ApiConfig>): void {
        this.defaultConfig = { ...this.defaultConfig, ...config };
    }
}

// Create a singleton instance
export const apiClient = new ApiClient();

// Convenience function for signup-specific API calls
export const signupApi = {
    createSignUpRecord: (email: string, options?: RequestOptions) =>
        apiClient.post<string>(`${appConfig.backendUrlBase}/signup/createSignUpRecord`, { email }, options),
    
    sendVerificationEmail: (email: string, options?: RequestOptions) =>
        apiClient.post<boolean>(`${appConfig.backendUrlBase}/signup/sendVerificationEmail`, { email }, options),
    
    verifyEmailAddress: (email: string, code: string, options?: RequestOptions) =>
        apiClient.post<boolean>(`${appConfig.backendUrlBase}/signup/verifyEmailAddress`, { email, code }, options),
    
    addPersonalDetails: (recordId: string, firstName: string, lastName: string, options?: RequestOptions) =>
        apiClient.post<boolean>(`${appConfig.backendUrlBase}/signup/addPersonalDetails`, { recordId, firstName, lastName }, options),
    
    addPassword: (recordId: string, password: string, options?: RequestOptions) =>
        apiClient.post<boolean>(`${appConfig.backendUrlBase}/signup/addPassword`, { recordId, password }, options),
    
    completeSignUp: (recordId: string, options?: RequestOptions) =>
        apiClient.post<string>(`${appConfig.backendUrlBase}/signup/completeSignUp`, { recordId }, options),
};

export { ApiError };
