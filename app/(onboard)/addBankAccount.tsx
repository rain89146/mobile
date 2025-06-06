import { useOnBoardingContext } from '@/contexts/OnBoardingContext';
import { PlaidAuthButton } from '@/lib/plaid/PlaidAuthButtons';
import { useNavigation, useRouter } from 'expo-router';
import React, { useEffect } from 'react'
import { View, Text, Linking } from 'react-native'

export default function addBankAccount() 
{
    const {
        onBoardingProgress,
        updateOnBoardingProgress,
    } = useOnBoardingContext();
    
    const navigation = useNavigation();
    const router = useRouter();

    useEffect(() => {
        navigation.setOptions({ 
            headerShown: false,
        });
        console.log({
            onBoardingProgress
        })
    }, []);
    
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Connect Banking</Text>
            <Text>Banking access</Text>
            <Text>We need to access your media to provide you with the best experience.</Text>
        </View>      
    )
}
