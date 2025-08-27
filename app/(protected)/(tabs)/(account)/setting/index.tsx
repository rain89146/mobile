import { useNavigation, useRouter } from 'expo-router';
import React, { useEffect } from 'react'
import { View, Text, Button } from 'react-native'
import * as Haptics from 'expo-haptics';

export default function Index() {
    const navigation = useNavigation();
    const router = useRouter();

    useEffect(() => {
        navigation.setOptions({ headerShown: true });
    }, [navigation]);

    const openModal = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        // router.navigate('/(modals)/settingModal');
        router.push({
            pathname: '/(protected)/(modals)/settingModal',
            params: { 
                photo: 'https://images.unsplash.com/photo-1726064855881-3bbb7000b29f?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            }
        })
    }
    
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>index</Text>
            <Button
                title='Open modal'
                onPress={openModal}
                color="#841584"
            />
        </View>
    )
}
