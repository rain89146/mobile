import CameraScreenOuterLayer from './CameraScreenOuterLayer';
import * as MediaLibrary from 'expo-media-library';
import { PermissionContentComp } from './PermissionContentComp';

export default function GalleryPermissionSplashScreen({
    galleryPermission,
    goToSettings,
    requestGalleryPermission
}: {
    goToSettings: () => void,
    requestGalleryPermission: () => void,
    galleryPermission: MediaLibrary.PermissionResponse | null
}) {
    if (galleryPermission === null) 
    {
        return (
            <CameraScreenOuterLayer>
                <PermissionContentComp 
                    remark='To use camera feature you need to grant the gallery permission. Your permission to access gallery is required.' 
                    onPressEvent={goToSettings} 
                    buttonTest='System setting' 
                />
            </CameraScreenOuterLayer>
        )
    }

    const { granted, canAskAgain } = galleryPermission;

    // open the settings page if the permission is denied and cannot ask again
    if (granted === false && canAskAgain === false) 
    {
        return (
            <CameraScreenOuterLayer>
                <PermissionContentComp
                    remark='To use camera feature you need to grant the gallery permission. Your permission to access gallery is required.'
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
                remark='To use camera feature you need to grant the gallery permission. Your permission to access gallery is required.'
                onPressEvent={requestGalleryPermission}
                buttonTest='Grant Audio Permission'
            />
        </CameraScreenOuterLayer>
    )
}