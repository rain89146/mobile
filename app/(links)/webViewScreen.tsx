import { useLocalSearchParams } from 'expo-router'
import React from 'react'
import { SafeAreaView } from 'react-native';
import { WebView } from 'react-native-webview';

export default function WebViewScreen() {
    const { url } = useLocalSearchParams();
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <WebView source={{ uri: url as string }} />
        </SafeAreaView>
    )
}
