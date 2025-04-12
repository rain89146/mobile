import { useRouter } from 'expo-router';
import React from 'react'
import { View, Text, Button } from 'react-native'

export default function cameraPermission() {
    const router = useRouter();
    
    return (
        <View>
            <Text>cameraPermission</Text>
            <Button
                title="Go to Home"
                onPress={() => {
                    router.navigate('/(tabs)/home')
                }}
                color="#841584"
                accessibilityLabel="Tap me to go to home"
            />
        </View>
    )
}
