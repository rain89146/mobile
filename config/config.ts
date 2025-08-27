export const appConfig = {
    DOPA_API_AUTH: process.env.EXPO_PUBLIC_DOPA_API_AUTH,
    backendUrlBase: 'http://localhost:8080',
    
    // API Configuration
    api: {
        timeout: 30000, // 30 seconds
        retries: 3,
        retryDelay: 1000, // 1 second base delay
        
        // Environment-specific timeouts
        signup: {
            timeout: 45000, // 45 seconds for signup operations
            retries: 2,
        },
        
        auth: {
            timeout: 20000, // 20 seconds for auth operations
            retries: 1,
        }
    }
}