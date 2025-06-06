import { useAuthContext } from '@/contexts/AuthenticationContext';
import { Redirect, useNavigation, useRouter } from 'expo-router';
import React, { useEffect } from 'react'
import { SafeAreaView, View } from 'react-native'
import { ActionButton, SecondaryButton } from '@/components/ui/ActionButtons';
import { PlaidAuthButton } from '@/lib/plaid/PlaidAuthButtons';

export default function Index() {

    const navigation = useNavigation();
    const authContext = useAuthContext();
    const router = useRouter();
    

    // Set the header to be hidden
    useEffect(() => {
        navigation.setOptions({
            headerShown: false,
        })
    }, [navigation])

    //  check if the user is logged in
    if (authContext.userId) {
        return <Redirect href="/(protected)/(tabs)/(home)/home" />
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#000' }}>
            <View style={{
                flex: 1,
                width: '100%',
                height: '100%',
            }}>
                <View style={{
                    marginTop: 'auto',
                    padding: 35
                }}>
                    <PlaidAuthButton />
                    <ActionButton
                        onPressEvent={() => router.push('/(signup)/accountRegister')}
                        isLoading={false}
                        buttonLabel="Create new account"
                    />
                    <View style={{
                        paddingTop: 20,
                    }}>
                        <SecondaryButton 
                            onPressEvent={() => router.push('/(login)/login')}
                            isLoading={false}
                            buttonLabel="Login"
                        />
                    </View>
                </View>
            </View>
        </SafeAreaView>
    )
}
