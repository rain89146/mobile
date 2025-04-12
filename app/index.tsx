import { useNavigation, useRouter } from 'expo-router';
import React, { useEffect } from 'react'
import { View, Text, Button } from 'react-native'
export default function index() {

    const router = useRouter();
    const navigation = useNavigation();
    
    useEffect(() => {
        navigation.setOptions({ headerShown: false });
    }, [navigation]);
    
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>
            index
        </Text>
        <Button
            title="Go to Home"
            onPress={() => {
                router.navigate('/cameraPermission')
            }}
            color="#841584"
            accessibilityLabel="Tap me to go to home"
        />
    </View>
  )
}
