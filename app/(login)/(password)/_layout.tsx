import { Stack, useNavigation } from 'expo-router'
import React from 'react'

export default function _layout() {
    const navigation = useNavigation();

    React.useEffect(() => {
        navigation.setOptions({ headerShown: false, presentation: 'modal' })
    }, [])
    
    return (
        <Stack />
    )
}
