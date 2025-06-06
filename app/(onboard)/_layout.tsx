import { OnBoardingContextProvider } from '@/contexts/OnBoardingContext';
import { Stack, useNavigation } from 'expo-router'
import React from 'react'

export default function _layout() {

    const navigation = useNavigation();

    React.useEffect(() => {
        navigation.setOptions({
            headerShown: false,
        })
    }, [])

    return (
        <OnBoardingContextProvider>
            <Stack screenOptions={{
                headerShown: false
            }}/>
        </OnBoardingContextProvider>
    )
}
