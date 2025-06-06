export interface ApiResponse<T> {
    status: boolean;
    message: string;
    exception: string;
    response: T;
}