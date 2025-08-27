import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native'

export default function CameraErrorScreen({
    error,
    goBack
}: {
    error: string
    goBack: () => void
}) {
    return (
        <View style={{ 
            position: 'absolute', 
            top: 0, 
            left: 0, 
            right: 0, 
            bottom: 0, 
            justifyContent: 'center', 
            alignItems: 'center', 
            zIndex: 100, 
            backgroundColor: "#fff",
            borderRadius: 30
        }}>
            <Text style={{ color: '#000', fontSize: 20 }}>{error}</Text>
            <View style={{
                paddingTop: 40,
            }}>
                <TouchableOpacity
                    onPress={goBack}
                    accessibilityLabel="Tap me to close this"
                    style={{
                        backgroundColor: '#000',
                        padding: 10,
                        borderRadius: 5,
                        paddingHorizontal: 20,
                    }}
                ><Text style={{color:"#fff", fontWeight: "bold"}}>Close</Text></TouchableOpacity>
            </View>
        </View>
    )
}
