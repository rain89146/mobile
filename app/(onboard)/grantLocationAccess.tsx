import { useNavigation, useRouter } from 'expo-router';
import React, { useEffect } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'

export default function grantLocationAccess() {
    const navigation = useNavigation();
    const router = useRouter();

    useEffect(() => {
        navigation.setOptions({ 
            headerShown: false,
        });
    }, []);
    
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Location Access</Text>
            <Text>Grant Location Access</Text>
            <Text>We need to access your location to provide you with the best experience.</Text>
            <TouchableOpacity onPress={() => router.push('/(onboard)/grantMediaAccess')} style={{ marginTop: 20, padding: 10, backgroundColor: '#007AFF', borderRadius: 5 }}>
                <Text style={{ color: '#FFFFFF' }}>Next</Text>
            </TouchableOpacity>
        </View>
    )
}
