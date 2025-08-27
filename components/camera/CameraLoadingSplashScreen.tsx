import React from 'react';
import {Text} from 'react-native'
import CameraScreenOuterLayer from './CameraScreenOuterLayer'

export default function CameraLoadingSplashScreen() 
{
    return (
        <CameraScreenOuterLayer>
            <Text style={{
                color: '#000',
                fontSize: 14,
            }}>
                Camera is loading...
            </Text>
        </CameraScreenOuterLayer>
    )
}
