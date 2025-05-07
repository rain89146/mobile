import { View, Text, TouchableOpacity } from 'react-native';
import CameraScreenOuterLayer from './CameraScreenOuterLayer';

export default function CameraPermissionSplashScreen({
    cameraPermission, 
    requestCameraPermission, 
    goToSettings
}: {
    goToSettings: () => void, 
    requestCameraPermission: () => void, 
    cameraPermission: {granted: boolean, canAskAgain: boolean, status: string} | null
}) {

    if (!cameraPermission) {
        return (
            <CameraScreenOuterLayer>
                <ContentLayer 
                    remark='To use camera feature you need to grant the camera permission. Your permission to access camera is required.' 
                    onPressEvent={goToSettings} 
                    buttonTest='System setting' 
                />
            </CameraScreenOuterLayer>
        )
    }

    const { granted, canAskAgain } = cameraPermission;

    // open the settings page if the permission is denied and cannot ask again
    if (granted === false && canAskAgain === false) {
        return (
            <CameraScreenOuterLayer>
                <ContentLayer
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
            <ContentLayer
                remark='To use camera feature you need to grant the camera permission. Your permission to access camera is required.'
                onPressEvent={requestCameraPermission}
                buttonTest='Grant Permission'
            />
        </CameraScreenOuterLayer>
    )
}

function ContentLayer({
    remark,
    onPressEvent,
    buttonTest
}: {
    remark: string,
    onPressEvent: () => void,
    buttonTest: string
}) {
    return (
        <>
            <Text style={{
                color: '#000',
                fontSize: 14,
            }}>
                {remark}
            </Text>
            <View style={{
                paddingTop: 40,
            }}>
                <TouchableOpacity
                    onPress={onPressEvent}
                    style={{
                        backgroundColor: '#000',
                        padding: 10,
                        borderRadius: 5,
                        paddingHorizontal: 20,
                    }}
                >
                    <Text style={{color:"#fff", fontWeight: "bold"}}>{buttonTest}</Text>
                </TouchableOpacity>
            </View>
        </>
    )
}