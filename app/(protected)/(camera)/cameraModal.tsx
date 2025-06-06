import CameraComp from '@/components/camera/CameraComp';
import React from 'react';
import { SafeAreaView } from 'react-native';

export default function cameraModal() {
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <CameraComp />
        </SafeAreaView>
    )
}
