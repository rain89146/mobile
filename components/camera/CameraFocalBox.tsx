import React from 'react'
import { View, Text } from 'react-native'

export default function CameraFocalBox({focusSquare}: {focusSquare: {x: number, y: number, isVisible: boolean}}) {
  return (
    <View style={{
        position: 'absolute',
        top: focusSquare.y - 40,
        left: focusSquare.x - 40,
        width: 80,
        height: 80,
        borderWidth: 1,
        borderColor: 'yellow',
        opacity: 0.8,
        borderRadius: 3,
        justifyContent: 'center',
        alignItems: 'center',
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
