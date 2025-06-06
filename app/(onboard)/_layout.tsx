import { OnBoardingContextProvider } from '@/contexts/OnBoardingContext';
import { Stack, useNavigation } from 'expo-router'
import React from 'react'

export default function Layout() {

    const navigation = useNavigation();

    React.useEffect(() => {
        navigation.setOptions({
            headerShown: false,
        })
    }, [navigation])

    return (
        <OnBoardingContextProvider>
            <Stack screenOptions={{
                headerShown: false
            }}/>
        </OnBoardingContextProvider>
    )
}
