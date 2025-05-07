import { AuthReducer } from "@/store/AuthReducer";
import React, {createContext, useContext, useEffect, useRef} from "react";
import { AppState, Platform } from "react-native";
import * as AppleAuthentication from 'expo-apple-authentication';
import SessionStorage from 'react-native-session-storage';
import { useRouter } from "expo-router";

export type AuthContextType = {
    userId: string|null;
    identityToken: string|null;
    authorizationCode: string|null;
    setAuthState: (stateName: string, state: string|null) => void;
    signInWithApple: () => Promise<AppleAuthentication.AppleAuthenticationCredential>;
    signOutWithApple: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType|undefined>(undefined);

const AuthContextProvider = ({children}: {children: React.ReactNode}) => {

    const reducer = AuthReducer();
    const [initialState, dispatch] = reducer.useAuthReducer;
    
    const setAuthState = (stateName: string, state: string|null) => dispatch({stateName: stateName, payload: state});

    useEffect(() => {

        console.log('AuthContextProvider mounted');

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
            
            //  store the user in the local storage
            SessionStorage.setItem(userId, JSON.stringify(credential));

            //  set the user in the auth context
            setAuthState('userId', userId);

            //  if the credential state is authorized, return the credential
            return credential;

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
        if (!initialState.userId) return;

        //  get the user id from the auth context
        const userId = initialState.userId;

        //  remove the user from the local storage
        SessionStorage.removeItem(userId);

        //  set the user in the auth context
        setAuthState('userId', null);
    }

    return (
        <AuthContext.Provider value={{
            ...initialState,
            setAuthState,
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