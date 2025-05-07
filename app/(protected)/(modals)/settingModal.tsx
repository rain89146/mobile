import { useNavigation, useRouter } from 'expo-router';
import React, { useEffect } from 'react'
import { View, Text, Button } from 'react-native'
import * as Haptics from 'expo-haptics';
import { HapticButton } from '@/components/HapticComp';

export default function modal() {
    const navigation = useNavigation();
    const router = useRouter();

    useEffect(() => {
        navigation.setOptions({ 
            headerShown: false,
            presentation: 'modal',
        });
    }, [navigation]);

    const canGoBack = router.canGoBack();

    const closeModal = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        router.back();
    }
    
    return (
        <View>
            <Text>modal</Text>
            <Text>canGoBack: {canGoBack ? 'true' : 'false'}</Text>
            <Button
                title='Close modal with haptic'
                onPress={closeModal}
                color="#841584"
                accessibilityLabel="Tap me to close modal with haptic"
            />
        </View>
    )
}
