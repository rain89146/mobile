import { useAuthContext } from '@/contexts/AuthenticationContext';
import { NotificationContextProvider } from '@/contexts/NotificationContext';
import { Redirect, Stack, useNavigation } from 'expo-router'
import React, { useEffect } from 'react'
import Toast from 'react-native-toast-message'

export default function Layout() {
    const navigation = useNavigation();
    const authContext = useAuthContext();

    useEffect(() => {
        navigation.setOptions({ headerShown: false });
    }, [navigation]);

    // Check if the user is logged in
    if (!authContext.userId) {
        return <Redirect href="/" />
    }
    
    return (
        <NotificationContextProvider>
            <Stack />
            <Toast />
        </NotificationContextProvider>
    )
}
