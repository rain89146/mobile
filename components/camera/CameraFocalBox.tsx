import React from 'react'
import { View, Text } from 'react-native'

export default function CameraFocalBox({focusSquare}: {focusSquare: {x: number, y: number, isVisible: boolean}}) {
  return (
    <View style={{
        position: 'absolute',
        top: focusSquare.y - 60,
        left: focusSquare.x - 60,
        width: 110,
        height: 110,
        borderWidth: 1,
        borderColor: 'yellow',
        opacity: 0.8,
        borderRadius: 3,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 100,
    }}>
        <Text
            style={{
                fontSize: 24,
                color: 'yellow',
            }}
        >+</Text>
    </View>
  )
}
