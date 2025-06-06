import CameraScreenOuterLayer from './CameraScreenOuterLayer';
import { PermissionResponse } from 'expo-camera';
import { PermissionContentComp } from './PermissionContentComp';

export default function CameraPermissionSplashScreen({
    cameraPermission, 
    requestCameraPermission, 
    goToSettings
}: {
    goToSettings: () => void, 
    requestCameraPermission: () => void, 
    cameraPermission: PermissionResponse | null
}) {
    if (cameraPermission === null) 
    {
        return (
            <CameraScreenOuterLayer>
                <PermissionContentComp 
                    remark='To use camera feature you need to grant the camera permission. Your permission to access camera is required.' 
                    onPressEvent={goToSettings} 
                    buttonTest='System setting' 
                />
            </CameraScreenOuterLayer>
        )
    }

    const { granted, canAskAgain } = cameraPermission;
    console.log({ granted, canAskAgain })

    // open the settings page if the permission is denied and cannot ask again
    if (granted === false && canAskAgain === false) 
    {
        return (
            <CameraScreenOuterLayer>
                <PermissionContentComp
                    remark='To use camera feature you need to grant the camera permission. Your permission to access camera is required.'
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
                remark='To use camera feature you need to grant the camera permission. Your permission to access camera is required.'
                onPressEvent={requestCameraPermission}
                buttonTest='Grant Permission'
            />
        </CameraScreenOuterLayer>
    )
}