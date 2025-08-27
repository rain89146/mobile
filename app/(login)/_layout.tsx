import { Stack, useNavigation } from 'expo-router'
import React from 'react'
import Toast from 'react-native-toast-message'

export default function Layout() {
    const navigation = useNavigation();

    React.useEffect(() => {
        navigation.setOptions({ headerShown: false})
    }, [navigation])
    
    return (
        <>
            <Stack screenOptions={{ headerShown: false }}/>
            <Toast />
        </>
    )
}
