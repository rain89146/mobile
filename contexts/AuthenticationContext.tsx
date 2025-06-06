import React, {createContext, useCallback, useContext, useEffect, useState} from "react";
import * as AppleAuthentication from 'expo-apple-authentication';
import { useRouter } from "expo-router";
import useAsyncStorageHook from "@/hooks/useAsyncStorageHook";
import { SessionKeys } from "@/constants/SessionKeys";
import { AppleUserInfo } from "@/types/AppleUserInfo";
import { ApiResponse } from "@/types/ApiResponse";

export type AuthContextType = {
    userId: string|null;
    identityToken: string|null;
    authorizationCode: string|null;
    appleUserInfo: AppleAuthentication.AppleAuthenticationCredential|null;
    signInWithApple: () => Promise<void>;
    signOutWithApple: () => Promise<void>;
    signUpUsingApple: () => Promise<AppleUserInfo>;
    signInWithEmail: (email: string, password: string) => Promise<void>;
    sendPasswordResetRequest: (email: string) => Promise<ApiResponse<boolean>>;
    verifyPasswordResetCode: (code: string) => Promise<ApiResponse<boolean>>;
    resetPassword: (code: string, password: string) => Promise<ApiResponse<boolean>>;
}

export interface authCredential {
    authProvider: 'apple' | 'email';
    userId: string|null;
    identityToken: string|null;
    authorizationCode: string|null;
}

const AuthContext = createContext<AuthContextType>({
    userId: null,
    identityToken: null,
    authorizationCode: null,
    appleUserInfo: null,
    signInWithApple: async () => {
        throw new Error('signInWithApple not implemented');
    },
    signOutWithApple: async () => {
        throw new Error('signOutWithApple not implemented');
    },
    signUpUsingApple: async () => {
        throw new Error('signUpUsingApple not implemented');
    },
    signInWithEmail: async () => {
        throw new Error('signInWithEmail not implemented');
    },
    sendPasswordResetRequest: async () => {
        throw new Error('sendPasswordResetRequest not implemented');
    },
    verifyPasswordResetCode: async () => {
        throw new Error('verifyPasswordResetCode not implemented');
    },
    resetPassword: async () => {
        throw new Error('resetPassword not implemented');
    }
});

const AuthContextProvider = ({children}: {children: React.ReactNode}) => {

    //  local state
    const [userId, setUserId] = useState<string|null>(null);
    const [identityToken, setIdentityToken] = useState<string|null>(null);
    const [authorizationCode, setAuthorizationCode] = useState<string|null>(null);

    const [appleUserInfo, setAppleUserInfo] = useState<AppleAuthentication.AppleAuthenticationCredential|null>(null);

    //  router
    const router = useRouter();

    //  storage
    const {storeDataIntoStorage, removeDataFromStorage, getDataFromStorage} = useAsyncStorageHook();

    //  get the auth credentials from the storage
    const getAuthCredFromStorage = useCallback(async () => {
        try {
            const res = await getDataFromStorage<authCredential>(SessionKeys.AUTH_STORAGE_KEY);
            if (res) {
                setUserId(res.userId);
                setIdentityToken(res.identityToken);
                setAuthorizationCode(res.authorizationCode);
            }
        } catch (error) {
            console.log(error);
        }
    }, [getDataFromStorage]);

    //  listen to the state
    useEffect(() => {
        console.log('AuthContextProvider mounted');

        getAuthCredFromStorage();

        return () => {
            console.log('AuthContextProvider unmounted');
        }
    }, [getAuthCredFromStorage]);

    /**
     * Sign in with Apple
     * @returns void
     * @description Sign in with Apple
     */
    async function signInWithApple()
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
            setAppleUserInfo(credential);

            //  check the credential state
            const credState = await AppleAuthentication.getCredentialStateAsync(userId);

            //  check if the credential state is authorized
            if (credState !== AppleAuthentication.AppleAuthenticationCredentialState.AUTHORIZED) throw new Error('Apple sign in is not authorized');
            
            //  set the user in the auth context
            setUserId(userId);
            setIdentityToken(credential.identityToken);
            setAuthorizationCode(credential.authorizationCode);

            //  store the user in the local storage
            await storeDataIntoStorage<authCredential>(SessionKeys.AUTH_STORAGE_KEY, {
                authProvider: 'apple',
                userId: userId,
                identityToken: credential.identityToken,
                authorizationCode: credential.authorizationCode,
            } as authCredential);

            //  if the credential state is authorized, return the credential
            router.replace('/(protected)/(tabs)/(home)/home');
        }
        catch (error) 
        {
            console.log("AuthenticationContext: signInWithApple: ", error);
            throw error;
        }
    }

    /**
     * Sign out the user from Apple Sign In
     * @returns void
     * @description Sign out the user from Apple Sign In
     */
    async function signOutWithApple()
    {
        try {
            //  remove the user from the local storage
            await removeDataFromStorage(SessionKeys.AUTH_STORAGE_KEY);
        } 
        catch (error) {

            console.log("AuthenticationContext: signOutWithApple: ", error);

        } finally {
            
            //  set the user in the auth context
            setUserId(null);
            setIdentityToken(null);
            setAuthorizationCode(null);
            
            //  redirect to the login page
            router.replace('/');
        }
    }

    /**
     * Sign up using Apple Sign In
     * @description Sign up using Apple Sign In
     * @returns AppleUserInfo
     * @throws Error
     */
    async function signUpUsingApple(): Promise<AppleUserInfo>
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
            setAppleUserInfo(credential);

            //  check the credential state
            const credState = await AppleAuthentication.getCredentialStateAsync(userId);

            //  check if the credential state is authorized
            if (credState !== AppleAuthentication.AppleAuthenticationCredentialState.AUTHORIZED) throw new Error('Apple sign in is not authorized');
            
            //  set the user in the auth context
            setUserId(userId);
            setIdentityToken(credential.identityToken);
            setAuthorizationCode(credential.authorizationCode);

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

    /**
     * Sign in with email and password
     * @param email 
     * @param password 
     */
    async function signInWithEmail(email: string, password: string): Promise<void>
    {
        try {
            //  mock api request
            const apiRequest: Promise<ApiResponse<authCredential>> = new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve({
                        status: true,
                        message: '',
                        exception: '',
                        response: {
                            authProvider: 'email',
                            authorizationCode: 'mock.authorizationCode',
                            identityToken: 'mock.identityToken',
                            userId: 'mock.userId',
                        }
                    } as ApiResponse<authCredential>);
                }, 2000);
            });

            //  login the user
            const response = await apiRequest;

            //  check if the response is successful
            if (!response.status) throw new Error(response.message);
            if (!response.response) throw new Error('Unable to sign in with email');

            //  store the user in the auth context
            setUserId(response.response.userId);
            setIdentityToken(response.response.identityToken);
            setAuthorizationCode(response.response.authorizationCode);
            
            //  store the user in the local storage
            await storeDataIntoStorage<authCredential>(SessionKeys.AUTH_STORAGE_KEY, {
                authProvider: 'email',
                userId: response.response.userId,
                identityToken: response.response.identityToken,
                authorizationCode: response.response.authorizationCode,
            } as authCredential);

            //  if the credential state is authorized, return the credential
            router.replace('/(protected)/(tabs)/(home)/home');

        } catch (error) {
            throw error;
        }
    }

    /**
     * Send password reset request
     * @description This function is used to send a password reset request to the user
     * @param email - email address
     * @returns ApiResponse<boolean>
     */
    async function sendPasswordResetRequest(email: string): Promise<ApiResponse<boolean>>
    {
        try {
            //  mock api request
            const apiRequest: Promise<ApiResponse<boolean>> = new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve({
                        status: true,
                        message: '',
                        exception: '',
                        response: true,
                    })
                }, 2000);
            });

            //  send the password reset request
            return await apiRequest;
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
    async function verifyPasswordResetCode(code: string): Promise<ApiResponse<boolean>>
    {
        try {
            //  mock api request
            const apiRequest: Promise<ApiResponse<boolean>> = new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve({
                        status: (code === '123456'),
                        message: (code === '123456') ? '' : 'Invalid code',
                        exception: (code === '123456') ? '' : 'InvalidVerificationCodeException',
                        response: (code === '123456'),
                    })
                }, 2000);
            });

            //  verify the password reset code
            return await apiRequest;
        } 
        catch (error) 
        {
            console.log("AuthenticationContext: verifyPasswordResetCode: ", error);
            throw error;    
        }
    }

    /**
     * Reset password
     * @param code - password reset code
     * @param password - new password
     * @returns ApiResponse<boolean>
     */
    async function resetPassword(code: string, password:string): Promise<ApiResponse<boolean>>
    {
        try {
            //  mock api request
            const apiRequest: Promise<ApiResponse<boolean>> = new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve({
                        status: true,
                        message: '',
                        exception: '',
                        response: true,
                    })
                }, 2000);
            });

            //  reset the password
            return await apiRequest;
        } 
        catch (error) 
        {
            console.log("AuthenticationContext: resetPassword: ", error);
            throw error;    
        }
        
    }

    return (
        <AuthContext.Provider value={{
            userId,
            identityToken,
            authorizationCode,
            appleUserInfo,
            signInWithApple,
            signOutWithApple,
            signUpUsingApple,
            signInWithEmail,
            sendPasswordResetRequest,
            verifyPasswordResetCode,
            resetPassword
        }}>
            {children}
        </AuthContext.Provider>
    )
}

const useAuthContext = () => useContext(AuthContext);

export {
    AuthContextProvider, 
    useAuthContext,
};