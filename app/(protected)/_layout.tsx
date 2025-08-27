import ProtectedProviders from '@/components/layout/ProtectedProviders';
import { useAuthContext } from '@/contexts/AuthenticationContext';
import { Redirect, Stack, useNavigation } from 'expo-router'
import React, { useEffect } from 'react'
import Toast from 'react-native-toast-message'

export default function Layout() {
    const navigation = useNavigation();
    const authContext = useAuthContext();
    
    useEffect(() => {
        navigation.setOptions({ headerShown: false });
    }, [navigation]);

    // Check if the user is authenticated
    useEffect(() => {
        console.log('Checking authentication status...');
        return () => {
            console.log('Cleaning up authentication status check...');
        }
    }, []);

    // Check if the user is logged in
    if (!authContext.authCredential || !authContext.authCredential.dopa.accessToken) 
    {
        return <Redirect href="/" />;
    }
    
    return (
        <ProtectedProviders>
            <Stack />
            <Toast />
        </ProtectedProviders>
    )
}
