import { useAuthContext } from '@/contexts/AuthenticationContext';
import useAuthenticationHook from '@/hooks/useAuthenticationHook';
import { AppleAuthenticationCredential } from 'expo-apple-authentication';
import { Redirect, useNavigation, useRouter } from 'expo-router';
import React, { useEffect } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'

export default function index() {

    const navigation = useNavigation();
    const authContext = useAuthContext();
    
    // Set the header to be hidden
    useEffect(() => {
        navigation.setOptions({
            headerShown: false,
        })
    }, [])

    //
    const accountLogin = async () => {
        const res: AppleAuthenticationCredential|undefined = await authContext?.signInWithApple();
        console.log(res);
    }

    //
    const accountRegister = () => {
    }

    //  check if the user is logged in
    if (authContext?.userId) {
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
