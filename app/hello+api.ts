import { ApiResponse } from "@/types/ApiResponse";

export function GET(request: Request) {
    try {
        console.log(request);
        const url = new URL(request.url);
        return Response.json({
            result: true,
            message: "Hello World",
            exception: "",
            response: null
        } as ApiResponse<null>)
    } catch (error: Error | unknown) {
        const message = error instanceof Error ? error.message : "Unknown Error";
        const exception = error instanceof Error ? error.name : "Unknown Exception";

        return Response.json({
            result: false,
            message,
            exception,
            response: null
        } as ApiResponse<null>)
    }
}