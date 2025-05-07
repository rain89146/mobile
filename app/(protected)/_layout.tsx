import { useAuthContext } from '@/contexts/AuthenticationContext';
import { CameraContextProvider } from '@/contexts/CameraContext'
import { Redirect, Stack, useNavigation } from 'expo-router'
import React, { useEffect } from 'react'
import Toast from 'react-native-toast-message'

export default function _layout() {
    const navigation = useNavigation();
    const authContext = useAuthContext();

    useEffect(() => {
        navigation.setOptions({ headerShown: false });
    }, [navigation]);
    
    return (
        <CameraContextProvider>
            <Stack />
            <Toast />
        </CameraContextProvider>
    )
}
