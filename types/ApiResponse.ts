export interface ApiResponse<T> {
    result: boolean;
    message: string;
    exception: string;
    response: T;
}