import React, {useState, useEffect} from 'react'
import * as AppleAuthentication from 'expo-apple-authentication';
import SessionStorage from 'react-native-session-storage';
import { AuthContextType, useAuthContext } from '@/contexts/AuthenticationContext';

export default function useAuthenticationHook() 
{
    const { userId }  = useAuthContext();

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

            //  if the credential state is authorized, return the credential
            return credential;

        } catch (error) {
            throw error;
        }
    }

    async function signOutWithApple()
    {
        if (!userId) return;

        try {

            //  check if the apple sign in is available
            const isAvailable: boolean = await AppleAuthentication.isAvailableAsync();

            //  if not available, throw an error
            if (!isAvailable) throw new Error('Apple Sign In is not available on this device');

            // sign out the user
            await AppleAuthentication.signOutAsync({
                user: userId,
            });

        } finally {

            //  remove the user from the local storage
            SessionStorage.removeItem(userId);
        }
    }

    async function signInWithEmail(login: string, password: string)
    {
        try {
        } catch (error) {
            throw error;
        }
    }

    return {
        signInWithApple,
        signOutWithApple,
    }
}
