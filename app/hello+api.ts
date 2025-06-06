import { ApiResponse } from "@/types/ApiResponse";

export function GET(request: Request) {
    try {
        console.log(request);
        const url = new URL(request.url).origin;
        return Response.json({
            status: true,
            message: "Hello World",
            exception: "",
            response: url
        } as ApiResponse<string>)
    } catch (error: Error | unknown) {
        const message = error instanceof Error ? error.message : "Unknown Error";
        const exception = error instanceof Error ? error.name : "Unknown Exception";

        return Response.json({
            status: false,
            message,
            exception,
            response: null
        } as ApiResponse<null>)
    }
}