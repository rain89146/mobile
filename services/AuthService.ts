import { appConfig } from "@/config/config";
import { DopaAuthResponse } from "@/contexts/AuthenticationContext";
import { ApiResponse } from "@/types/ApiResponse";
import { AppleUserInfo } from "@/types/AppleUserInfo";
import * as AppleAuthentication from 'expo-apple-authentication';
import axios from 'axios';

export class AuthService
{
    /**
     * Sign in with email and password
     * @param email 
     * @param password 
     */
    static async signInWithEmail(email: string, password: string): Promise<ApiResponse<DopaAuthResponse>>
    {
        try {
            const apiResponse = await axios.post(
                `${appConfig.backendUrlBase}/auth/d/login`,
                {
                    email,
                    password,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'x-api-key': `Basic ${appConfig.DOPA_API_AUTH}`,
                    }
                }
            );

            //  check if the response is successful
            if (apiResponse.status !== 200) throw new Error(`Unknown server error. error: ${apiResponse.statusText}`);

            //  return the response
            return apiResponse.data as ApiResponse<DopaAuthResponse>;
    
        } catch (error) 
        {
            console.log("AuthenticationContext: signInWithEmail: ", error);
            throw error;
        }
    }

    /**
     * Sign out
     * @description This function is used to sign out the user from the application
     * @param accessToken - access token of the user
     * @returns ApiResponse<boolean>
     */
    static async signOut(accessToken: string): Promise<ApiResponse<boolean>>
    {
        try {
            const apiResponse = await axios.post(
                `${appConfig.backendUrlBase}/account/logout`,
                {},
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'x-api-key': `Basic ${appConfig.DOPA_API_AUTH}`,
                        'authorization': `Bearer ${accessToken}`,
                    }
                }
            );

            //  check if the response is successful
            if (apiResponse.status !== 200) throw new Error(`Unknown server error. error: ${apiResponse.statusText}`);
            
            //  return the response
            return apiResponse.data;
        }
        catch (error) 
        {
            console.log("AuthService: signOut: ", error);
            throw error;
        }
    }
    
    /**
     * Send password reset request
     * @description This function is used to send a password reset request to the user
     * @param email - email address
     * @returns ApiResponse<boolean>
     */
    static async sendPasswordResetRequest(email: string): Promise<ApiResponse<boolean>>
    {
        try {
            const apiResponse = await axios.post(
                `${appConfig.backendUrlBase}/auth/d/forgotPassword`,
                {
                    email,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'x-api-key': `Basic ${appConfig.DOPA_API_AUTH}`,
                    }
                }
            );

            //  check if the response is successful
            if (apiResponse.status !== 200) throw new Error(`Unknown server error. error: ${apiResponse.statusText}`);

            //  return the response
            return apiResponse.data as ApiResponse<boolean>;
        } 
        catch (error) 
        {
            console.log("AuthenticationContext: sendPasswordResetRequest: ", error);
            throw error;
        }
    }
    
    /**
     * Verify password reset code
     * @description This function is used to verify the password reset code
     * @param code - password reset code
     * @returns ApiResponse<boolean>
     */
    static async verifyPasswordResetCode(email: string, code: string): Promise<ApiResponse<boolean>>
    {
        try {
            const apiResponse = await axios.post(
                `${appConfig.backendUrlBase}/auth/d/checkVerificationCode`,
                {
                    email,
                    code,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'x-api-key': `Basic ${appConfig.DOPA_API_AUTH}`,
                    }
                }
            );

            //  check if the response is successful
            if (apiResponse.status !== 200) throw new Error(`Unknown server error. error: ${apiResponse.statusText}`);

            //  return the response
            return apiResponse.data as ApiResponse<boolean>;
        } 
        catch (error) 
        {
            console.log("AuthenticationContext: verifyPasswordResetCode: ", error);
            throw error;    
        }
    }
    
    /**
     * Reset password
     * @param email - email address
     * @param password - new password
     * @returns ApiResponse<boolean>
     */
    static async resetPassword(email: string, password:string): Promise<ApiResponse<boolean>>
    {
        try {
            const request = await fetch(
                `${appConfig.backendUrlBase}/auth/d/resetPassword`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-api-key': `Basic ${appConfig.DOPA_API_AUTH}`,
                    },
                    body: JSON.stringify({
                        email,
                        password,
                    })
                }
            );
            if (!request.ok) throw new Error(`Unable to reset password at this moment. Please try again later.`);
            
            //  parse the response
            const response = await request.json() as ApiResponse<boolean>;
            
            //  return the response
            return response;
        } 
        catch (error) 
        {
            console.log("AuthenticationContext: resetPassword: ", error);
            throw error;    
        }
    }
    
    /**
     * Verify session
     * @param accessToken access token
     * @returns 
     */
    static async verifySession(accessToken: string|null): Promise<boolean> {
        try {    
            //  make a request to the backend to verify the session
            const apiResponse = await axios.post(
                `${appConfig.backendUrlBase}/account/isAuthenticated`,
                {},
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'x-api-key': `Basic ${appConfig.DOPA_API_AUTH}`,
                        'Authorization': `Bearer ${accessToken}`
                    }
                }
            );

            //  check if the response is successful
            if (apiResponse.status !== 200) throw new Error(`Unable to verify session at this moment. Please try again later.`);

            //  return the response
            return apiResponse.data.response as boolean;
        } 
        catch (error) 
        {
            console.log("AuthenticationContext: verifySession: ", error);
            return false;
        }
    }

    /**
     * Sign in with Apple
     * @returns void
     * @description Sign in with Apple
     */
    // TODO: refactor this to use the AuthService class
    async signInWithApple()
    {
        try {

            //  check if the apple sign in is available
            const isAvailable: boolean = await AppleAuthentication.isAvailableAsync();

            //  if not available, throw an error
            if (!isAvailable) throw new Error('Apple Sign In is not available on this device');

            // start the sign-in with Apple flow
            const credential: AppleAuthentication.AppleAuthenticationCredential = await AppleAuthentication.signInAsync({
                requestedScopes: [
                    AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
                    AppleAuthentication.AppleAuthenticationScope.EMAIL,
                ],
            });

            //
            const userId = credential.user;

            //  check the credential state
            const credState = await AppleAuthentication.getCredentialStateAsync(userId);

            //  check if the credential state is authorized
            if (credState !== AppleAuthentication.AppleAuthenticationCredentialState.AUTHORIZED) throw new Error('Apple sign in is not authorized');
            
            //TODO: link the apple user with the dopa user, make a request to the backend to link the apple user with the dopa user

            // //  store the user in the local storage
            // await storeDataIntoStorage<authCredential>(SessionKeys.AUTH_STORAGE_KEY, {
            //     authProvider: 'apple',
            //     userId: userId,
            //     identityToken: credential.identityToken,
            //     authorizationCode: credential.authorizationCode,
            // } as authCredential);

        }
        catch (error) 
        {
            console.log("AuthenticationContext: signInWithApple: ", error);
            throw error;
        }
    }

    /**
     * Sign up using Apple Sign In
     * @description Sign up using Apple Sign In
     * @returns AppleUserInfo
     * @throws Error
     */
    // TODO: refactor this to use the AuthService class
    async signUpUsingApple(): Promise<AppleUserInfo>
    {
        try {
            //  check if the apple sign in is available
            const isAvailable: boolean = await AppleAuthentication.isAvailableAsync();

            //  if not available, throw an error
            if (!isAvailable) throw new Error('Apple Sign In is not available on this device');

            // start the sign-in with Apple flow
            const credential: AppleAuthentication.AppleAuthenticationCredential = await AppleAuthentication.signInAsync({
                requestedScopes: [
                    AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
                    AppleAuthentication.AppleAuthenticationScope.EMAIL,
                ],
            });

            //
            const userId = credential.user;

            //  check the credential state
            const credState = await AppleAuthentication.getCredentialStateAsync(userId);

            //  check if the credential state is authorized
            if (credState !== AppleAuthentication.AppleAuthenticationCredentialState.AUTHORIZED) throw new Error('Apple sign in is not authorized');

            //
            return {
                userId: userId,
                name: {
                    givenName: credential.fullName?.givenName,
                    familyName: credential.fullName?.familyName,
                },
                email: credential.email ?? null,
                identityToken: credential.identityToken,
                authorizationCode: credential.authorizationCode,
                isAuthorized: (credState === AppleAuthentication.AppleAuthenticationCredentialState.AUTHORIZED)
            }
            
        } catch (error) {
            console.log("AuthenticationContext: signUpUsingApple: ", error);
            throw error;
        }
    }
}