import { CameraContextProvider } from '@/contexts/CameraContext'
import { Stack, useNavigation } from 'expo-router'
import { useEffect } from 'react';

export default function _layout() {
    const navigation = useNavigation();

    useEffect(() => {
        navigation.setOptions({ headerShown: false });
    }, [navigation]);

    return (
        <CameraContextProvider>
            <Stack screenOptions={{ headerShown: false }} />
        </CameraContextProvider>
    )
}
