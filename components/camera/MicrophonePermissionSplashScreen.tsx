import React from 'react';
import CameraScreenOuterLayer from './CameraScreenOuterLayer';
import { PermissionContentComp } from './PermissionContentComp';
import * as MediaLibrary from 'expo-media-library';

export default function MicrophonePermissionSplashScreen({
    microphonePermission,
    goToSettings,
    requestMicroPhonePermission
}: {
    goToSettings: () => void,
    requestMicroPhonePermission: () => void,
    microphonePermission: MediaLibrary.EXPermissionResponse | null
}) {
    if (microphonePermission === null) 
    {
        return (
            <CameraScreenOuterLayer>
                <PermissionContentComp 
                    remark='To use camera feature you need to grant the mic permission. Your permission to access mic is required.' 
                    onPressEvent={goToSettings} 
                    buttonTest='System setting' 
                />
            </CameraScreenOuterLayer>
        )
    }

    const { granted, canAskAgain } = microphonePermission;

    // open the settings page if the permission is denied and cannot ask again
    if (granted === false && canAskAgain === false) 
    {
        return (
            <CameraScreenOuterLayer>
                <PermissionContentComp
                    remark='To use camera feature you need to grant the mic permission. Your permission to access mic is required.'
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
                remark='To use camera feature you need to grant the mic permission. Your permission to access mic is required.'
                onPressEvent={requestMicroPhonePermission}
                buttonTest='Grant Audio Permission'
            />
        </CameraScreenOuterLayer>
    )
}
