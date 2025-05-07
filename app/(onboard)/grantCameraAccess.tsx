import { useNavigation, useRouter } from 'expo-router';
import React, { useEffect } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'

export default function grantCameraAccess() {
    
    const navigation = useNavigation();
    const router = useRouter();

    useEffect(() => {
        navigation.setOptions({ 
            headerShown: false,
        });
    }, []);

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Camera Access</Text>
            <Text>Grant Camera Access</Text>
            <Text>We need to access your camera to provide you with the best experience.</Text>
            <View style={{ marginTop: 20, padding: 10, backgroundColor: '#007AFF', borderRadius: 5 }}>
                <TouchableOpacity onPress={() => router.push('/(onboard)/grantAudioAccess')}>
                    <Text style={{ color: '#FFFFFF' }}>Next</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}
