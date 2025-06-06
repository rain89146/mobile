import { useOnBoardingContext } from '@/contexts/OnBoardingContext';
import { useNavigation } from 'expo-router';
import React, { useEffect } from 'react'
import { View, Text } from 'react-native'

export default function AddBankAccount() 
{
    const {
        onBoardingProgress,
    } = useOnBoardingContext();
    console.log(onBoardingProgress)
    const navigation = useNavigation();

    useEffect(() => {
        navigation.setOptions({ 
            headerShown: false,
        });
    }, [navigation]);
    
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Connect Banking</Text>
            <Text>Banking access</Text>
            <Text>We need to access your media to provide you with the best experience.</Text>
        </View>      
    )
}
