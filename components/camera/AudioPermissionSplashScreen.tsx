import React from 'react';
import { PermissionResponse } from 'expo-av/build/Audio'
import CameraScreenOuterLayer from './CameraScreenOuterLayer';
import { PermissionContentComp } from './PermissionContentComp';

export default function AudioPermissionSplashScreen({
    audioPermission,
    goToSettings,
    requestAudioPermission
}: {
    goToSettings: () => void,
    requestAudioPermission: () => void,
    audioPermission: PermissionResponse | null
}) {
    if (audioPermission === null) 
    {
        return (
            <CameraScreenOuterLayer>
                <PermissionContentComp 
                    remark='To use camera feature you need to grant the audio permission. Your permission to access mic is required.' 
                    onPressEvent={goToSettings} 
                    buttonTest='System setting' 
                />
            </CameraScreenOuterLayer>
        )
    }

    const { granted, canAskAgain } = audioPermission;

    // open the settings page if the permission is denied and cannot ask again
    if (granted === false && canAskAgain === false) 
    {
        return (
            <CameraScreenOuterLayer>
                <PermissionContentComp
                    remark='To use camera feature you need to grant the audio permission. Your permission to access mic is required.'
                    onPressEvent={goToSettings}
                    buttonTest='System setting'
                />
            </CameraScreenOuterLayer>
        )
    }
    
    // request permission if the permission is denied and can ask again
    return granted === false && canAskAgain && (
        <CameraScreenOuterLayer>
            <PermissionContentComp
                remark='To use camera feature you need to grant the audio permission. Your permission to access mic is required.'
                onPressEvent={requestAudioPermission}
                buttonTest='Grant Audio Permission'
            />
        </CameraScreenOuterLayer>
    )
}