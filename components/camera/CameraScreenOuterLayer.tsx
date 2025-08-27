import React from 'react';
import { View } from 'react-native'

export default function CameraScreenOuterLayer({children}: {children: React.ReactNode}) {
    return (
        <View style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 10,
            borderRadius: 30,
            backgroundColor: '#fff'
        }}>
            {children}
        </View>
    )
}
