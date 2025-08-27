import { useOnBoardingContext } from '@/contexts/OnBoardingContext';
import { PlaidAuthButton } from '@/components/plaid/PlaidAuthButtons';
import { useNavigation } from 'expo-router';
import React, { useEffect } from 'react'
import { View, Text } from 'react-native'

export default function AddBankAccount() 
{
    const {
        onBoardingProgress,
    } = useOnBoardingContext();

    const navigation = useNavigation();

    useEffect(() => {
        navigation.setOptions({ headerShown: false });
    }, [navigation]);
    
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Connect Banking</Text>
            <Text>Banking access</Text>
            <Text>We need to access your media to provide you with the best experience.</Text>
            <PlaidAuthButton redirectUrl={'/(protected)/(tabs)/(home)/home'}/>
        </View>      
    )
}
