import { useNavigation } from 'expo-router';
import React, { useEffect } from 'react'
import { View, Text } from 'react-native'

export default function index() {
    const navigation = useNavigation();

    useEffect(() => {
        navigation.setOptions({ headerShown: true });
    }, [navigation]);
    
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>index</Text>
        </View>
    )
}
