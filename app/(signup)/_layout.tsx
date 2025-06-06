import { SignupContextProvider } from '@/contexts/SignupContext';
import { Stack, useNavigation } from 'expo-router'
import React from 'react'
import Toast from 'react-native-toast-message';

export default function _layout() {
    const navigation = useNavigation();

    React.useEffect(() => {
        navigation.setOptions({ headerShown: false })
    }, [])
    
    return (
        <SignupContextProvider>
            <Stack />
            <Toast />
        </SignupContextProvider>
    )
}
