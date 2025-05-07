import React from 'react'
import { Button } from 'react-native'
import * as Haptics from 'expo-haptics';

export function HapticButton(props: any) {
  return (
    <Button
        {...props}
        onPressIn={() => {
          if (process.env.EXPO_OS === 'ios') {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
          }
          props.onPressIn?.();
        }}
    />
  )
}
