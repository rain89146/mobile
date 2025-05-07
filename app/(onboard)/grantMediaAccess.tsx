import { useNavigation, useRouter } from 'expo-router';
import React, { useEffect } from 'react'
import { View, Text, Linking } from 'react-native'

export default function grantMediaAccess() {
    const navigation = useNavigation();
    const router = useRouter();

    useEffect(() => {
        navigation.setOptions({ 
            headerShown: false,
        });
    }, []);
    
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Media Access</Text>
            <Text>Grant Media Access</Text>
            <Text>We need to access your media to provide you with the best experience.</Text>
        </View>
    )
}
