import { PasswordResetContextProvider } from '@/contexts/PasswordResetContext';
import { Stack, useNavigation } from 'expo-router'
import React, {useEffect} from 'react'
import Toast from 'react-native-toast-message';

/**
 * Layout component for the password reset flow
 * This component sets up the navigation options and provides the context for password reset operations.
 * @returns Layout component
 */
export default function Layout() {
    const navigation = useNavigation();

    useEffect(() => {
        navigation.setOptions({ headerShown: false, presentation: 'modal' })
    }, [navigation])
    
    return (
        <PasswordResetContextProvider>
            <Stack />
            <Toast />
        </PasswordResetContextProvider>
    )
}