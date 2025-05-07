import { useAuthContext } from '@/contexts/AuthenticationContext';
import { AppleAuthenticationCredential } from 'expo-apple-authentication';
import { Redirect, useNavigation, useRouter } from 'expo-router';
import React, { useEffect } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import * as Haptics from 'expo-haptics';

export default function index() {

    const navigation = useNavigation();
    const authContext = useAuthContext();
    const router = useRouter();
    

    // Set the header to be hidden
    useEffect(() => {
        navigation.setOptions({
            headerShown: false,
        })
    }, [])

    //
    const accountLogin = async () => {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        await authContext.signInWithApple();
    }

    //
    const accountRegister = () => {
        router.push('/(onboard)/grantCameraAccess');
    }

    //  check if the user is logged in
    if (authContext.userId) {
        return <Redirect href="/(protected)/(tabs)/(home)/home" />
    }

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>index</Text>
            <View style={{
                paddingTop: 20,
                paddingBottom: 20,
            }}>
                <TouchableOpacity onPress={() => accountLogin()}>
                    <Text>Go to Home</Text>
                </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={() => accountRegister()}>
                <Text>Go to Register</Text>
            </TouchableOpacity>
        </View>
    )
}
