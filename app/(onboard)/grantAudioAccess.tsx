import { useNavigation, useRouter } from 'expo-router'
import React, { useEffect } from 'react'
import { View, Text, Linking, TouchableOpacity } from 'react-native'

export default function grantAudioAccess() {

    const navigation = useNavigation();
    const router = useRouter();

    useEffect(() => {
        navigation.setOptions({ 
            headerShown: false,
        });
    }, []);

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Audio Access</Text>
            <Text>Grant Audio Access</Text>
            <Text>We need to access your microphone to provide you with the best experience.</Text>
            <TouchableOpacity onPress={() => router.push('/(onboard)/grantLocationAccess')} style={{ marginTop: 20, padding: 10, backgroundColor: '#007AFF', borderRadius: 5 }}>
                <Text style={{ color: '#FFFFFF' }}>Next</Text>
            </TouchableOpacity>
        </View>
    )
}
