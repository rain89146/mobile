import React, {createContext, useContext, useEffect, useState} from "react";
import * as AppleAuthentication from 'expo-apple-authentication';
import { useRouter } from "expo-router";
import useAsyncStorageHook from "@/hooks/useAsyncStorageHook";

export type AuthContextType = {
    userId: string|null;
    identityToken: string|null;
    authorizationCode: string|null;
    signInWithApple: () => Promise<void>;
    signOutWithApple: () => Promise<void>;
}

export interface authCredential {
    userId: string|null;
    identityToken: string|null;
    authorizationCode: string|null;
}

const AuthContext = createContext<AuthContextType>({
    userId: null,
    identityToken: null,
    authorizationCode: null,
    signInWithApple: async () => {
        throw new Error('signInWithApple not implemented');
    },
    signOutWithApple: async () => {
        throw new Error('signOutWithApple not implemented');
    }
});

const AuthStorageKey = '@authStorageKey';

const AuthContextProvider = ({children}: {children: React.ReactNode}) => {

    //  local state
    const [userId, setUserId] = useState<string|null>(null);
    const [identityToken, setIdentityToken] = useState<string|null>(null);
    const [authorizationCode, setAuthorizationCode] = useState<string|null>(null);

    //  router
    const router = useRouter();

    //  storage
    const {storeDataIntoStorage, removeDataFromStorage, getDataFromStorage} = useAsyncStorageHook();

    //  listen to the state
    useEffect(() => {
        console.log('AuthContextProvider mounted');

        //  get the auth credentials from the storage
        const getAuthCredFromStorage = async () => {
            try {
                const res = await getDataFromStorage<authCredential>(AuthStorageKey);
                if (res) {
                    setUserId(res.userId);
                    setIdentityToken(res.identityToken);
                    setAuthorizationCode(res.authorizationCode);
                }
            } catch (error) {
                console.log(error);
            }
        }
        getAuthCredFromStorage();

        return () => {
            console.log('AuthContextProvider unmounted');
        }
    }, []);

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

            //  check the credential state
            const credState = await AppleAuthentication.getCredentialStateAsync(userId);

            //  check if the credential state is authorized
            if (credState !== AppleAuthentication.AppleAuthenticationCredentialState.AUTHORIZED) throw new Error('Apple sign in is not authorized');
            
            //  set the user in the auth context
            setUserId(userId);
            setIdentityToken(credential.identityToken);
            setAuthorizationCode(credential.authorizationCode);

            //  store the user in the local storage
            await storeDataIntoStorage<authCredential>(AuthStorageKey, {
                userId: userId,
                identityToken: credential.identityToken,
                authorizationCode: credential.authorizationCode,
            } as authCredential);

            //  if the credential state is authorized, return the credential
            router.replace('/(protected)/(tabs)/(home)/home');

        } catch (error) {
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
            await removeDataFromStorage(AuthStorageKey);
        } 
        catch (error) {

            console.log(error);

        } finally {
            
            //  set the user in the auth context
            setUserId(null);
            setIdentityToken(null);
            setAuthorizationCode(null);
            
            //  redirect to the login page
            router.replace('/');
        }
    }

    return (
        <AuthContext.Provider value={{
            userId,
            identityToken,
            authorizationCode,
            signInWithApple,
            signOutWithApple
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