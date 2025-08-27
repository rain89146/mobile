import React, {createContext, useCallback, useContext, useEffect, useRef, useState} from "react";
import * as AppleAuthentication from 'expo-apple-authentication';
import { SessionKeys } from "@/constants/SessionKeys";
import { AuthService } from "@/services/AuthService";
import { AsyncStorageService } from "@/services/AsyncStorageService";
import { SocketEvents, useSocketContext } from "./SocketContext";

export type AuthContextType = {
    authCredential: authCredential|null;
    signOut: () => Promise<void>;
    isLoading: boolean;
    StoreAuthCred: (params: authCredential) => Promise<void>;
}

export interface authCredential {
    authProvider: 'apple' | 'email' | 'google' | 'phone';
    userId: string|null;
    apple?: {
        identityToken: string|null; 
        authorizationCode: string|null;
        appleUserInfo?: AppleAuthentication.AppleAuthenticationCredential|null;
    };
    dopa: {
        accessToken: string|null; 
        refreshToken: string|null;
    };
    plaidUserToken?: string|null;
}

export interface DopaAuthResponse {
    accessToken: string;
    userId: string;
    refreshToken: string;
    plaidUserToken: string;
}

const AuthContext = createContext<AuthContextType>({
    isLoading: false,
    authCredential: null,
    signOut: async () => {},
    StoreAuthCred: async (params: authCredential) => {}
});

export class SessionVerificationError extends Error {
    constructor() {
        super();
        this.name = 'SessionVerificationError';
        this.message = 'Session is not verified. Please sign in again.';
    }
}

export class SessionNotFoundError extends Error {
    constructor() {
        super();
        this.name = 'SessionNotFoundError';
        this.message = 'Session not found. Please sign in again.';
    }
}

/**
 * AuthContextProvider component
 * @param children - The children components to be rendered inside the AuthContextProvider
 * @description This component provides the central authentication context to the children components.
 * It verifies the session in the storage when the component mounts, and syncs the auth credentials
 * with the storage whenever the authCredential state changes.
 * @returns 
 */
const AuthContextProvider = ({children}: {children: React.ReactNode}) => {

    //  context state
    const [authCredential, setAuthCredential] = useState<authCredential|null>(null);
    
    // local state
    const [isLoading, setIsLoading] = useState<boolean>(false);

    //  isMounted ref to track if the component is mounted
    const isMountedRef = useRef<boolean>(true);

    //  useCallback to verify the session in the storage
    const verifySessionInStorage = useCallback(async () => {
        try {
            setIsLoading(true);

            //  get the auth credentials from the storage
            const res = await AsyncStorageService.getDataFromStorage<authCredential>(SessionKeys.AUTH_STORAGE_KEY);
            if (!res) throw new SessionNotFoundError();
console.log(`getDataFromStorage: res:`, res);
            //  check if the auth credentials are not empty
            if (!res.dopa || !res.dopa.accessToken) throw new SessionVerificationError();

            //  check if the auth credentials are valid
            const isVerified = await AuthService.verifySession(res.dopa.accessToken);
            if (!isVerified) throw new SessionVerificationError();
console.log(`getDataFromStorage: isVerified:`, isVerified);
            //  set the auth credential to the state
            if (isMountedRef.current) setAuthCredential(res);
        } 
        catch (error: unknown) 
        {
            console.log("AuthenticationContext: verifySessionInStorage: ", error);

            //  if there is an error, set the auth credential to null
            setAuthCredential(null);
            
            //  remove the auth credential from the storage
            await AsyncStorageService.removeDataFromStorage(SessionKeys.AUTH_STORAGE_KEY);
        }
        finally {
            setIsLoading(false);
        }
    }, [])

    //  when the component mounts, get the auth credentials from the storage
    useEffect(() => {
        console.log('Authentication mounted')
        verifySessionInStorage();

        //  when the component unmounts, set the auth credential to null
        return () => {
            console.log('Authentication unmounted')
            isMountedRef.current = false;
        }
    }, []);

    //  store auth credentials in the storage
    async function StoreAuthCred(params: authCredential) {
        setAuthCredential(params);
        await AsyncStorageService.storeDataIntoStorage(SessionKeys.AUTH_STORAGE_KEY, params);
    }

    /**
     * Sign out function
     * @description This function is used to sign out the user by setting the auth credential to null
     * and trigger the removal of the auth credential from the session storage.
     * @returns Promise<void>
     */
    async function signOut(): Promise<void>
    {
        try {
            //  remove the auth credential from the storage
            await AsyncStorageService.removeDataFromStorage(SessionKeys.AUTH_STORAGE_KEY);
            
            //  update the server
            await AuthService.signOut(authCredential?.dopa.accessToken || '');

        } 
        catch (error) 
        {
            console.log("AuthenticationContext: signOut: ", error);
        }
        finally
        {
            setAuthCredential(null);
        }
    }

    return (
        <AuthContext.Provider value={{
            isLoading,
            authCredential,
            signOut,
            StoreAuthCred
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