import { CameraView } from 'expo-camera';
import React, { useEffect, useState } from 'react'
import { View } from 'react-native';
import CameraFocalBox from './CameraFocalBox';
import CameraPermissionSplashScreen from './CameraPermissionSplashScreen';
import CameraNotReadySplashScreen from './CameraNotReadySplashScreen';
import CameraRecordingReadySplashScreen from './CameraRecordingReadySplashScreen';
import CameraHeader from './CameraHeader';
import CameraShutterInterface from './CameraShutterInterface';
import CameraScannerOverlay from './CameraScannerOverlay';
import { useCameraHook } from '@/hooks/useCameraHook';
import { usePermissionContext } from '@/contexts/PermissionContext';
import AudioPermissionSplashScreen from './AudioPermissionSplashScreen';
import GalleryPermissionSplashScreen from './GalleryPermissionSplashScreen';
import MicrophonePermissionSplashScreen from './MicrophonePermissionSplashScreen';
import CameraLoadingSplashScreen from './CameraLoadingSplashScreen';
import useToolsHook from '@/hooks/useToolsHook';
import CameraErrorScreen from './CameraErrorScreen';

export default function CameraComp() 
{
    const camRef = React.useRef<CameraView>(null);
    const cameraLock = React.useRef<boolean>(false);
    const [cameraIsLoading, setCameraLoading] = useState<boolean>(true);
    const [cameraIsReady, setCameraReady] = useState<boolean>(false);
    const [onMountError, setOnMountError] = useState<any>(null);

    const {goToSetting, goBack} = useToolsHook();

    const {
        audioPermission,
        cameraPermission,
        galleryPermission,
        microphonePermission,
        allowAudioUse,
        allowMediaUse,
        allowCameraUse,
        allowMicrophoneUse,
        requestToAccessAudio,
        requestToAccessCamera,
        requestToEnableMicrophone,
        requestToAccessPhotoLibrary,
    } = usePermissionContext();

    const {
        error,
        isRecording,
        isRolling,
        flashMode,
        focusMode,
        isScanning,
        preparingForRecording,
        focusSquare,
        openBarcodeScanner,
        closeBarcodeScanner,
        switchFlashMode,
        onTouchStart,
        onTouchEnd,
        pressInHandle,
        pressOutHandle,
        barCodeScannedHandler
    } = useCameraHook(camRef as React.RefObject<CameraView>, cameraLock as React.RefObject<boolean>);

    useEffect(() => {
        return () => {
            setCameraLoading(true);
            setCameraReady(false);
            setOnMountError(null);
        }
    }, []);

    //  when the camera permission is not granted
    if (allowCameraUse === false) {
        return (
            <View style={{ flex: 1, margin: 10, borderRadius: 30 }}>
                <CameraPermissionSplashScreen 
                    cameraPermission={cameraPermission} 
                    goToSettings={goToSetting}
                    requestCameraPermission={requestToAccessCamera} 
                />
            </View>
        )
    }

    //  when the audio permission is not granted
    if (allowAudioUse === false) {
        return (
            <View style={{ flex: 1, margin: 10, borderRadius: 30 }}>
                <AudioPermissionSplashScreen 
                    audioPermission={audioPermission} 
                    goToSettings={goToSetting}
                    requestAudioPermission={requestToAccessAudio} 
                />
            </View>
        )
    }

    //  when the media permission is not granted
    if (allowMediaUse === false) {
        return (
            <View style={{ flex: 1, margin: 10, borderRadius: 30 }}>
                <GalleryPermissionSplashScreen 
                    galleryPermission={galleryPermission} 
                    goToSettings={goToSetting}
                    requestGalleryPermission={requestToAccessPhotoLibrary} 
                />
            </View>
        )
    }

    //  when the microphone permission is not granted
    if (allowMicrophoneUse === false) {
        return (
            <View style={{ flex: 1, margin: 10, borderRadius: 30 }}>
                <MicrophonePermissionSplashScreen 
                    microphonePermission={microphonePermission} 
                    goToSettings={goToSetting}
                    requestMicroPhonePermission={requestToEnableMicrophone} 
                />
            </View>
        )
    }

    //  when the camera is ready
    return (
        <View style={{ flex: 1, margin: 10, borderRadius: 30 }}>
            {(error || onMountError) && <CameraErrorScreen error={error||onMountError} goBack={goBack} />}
            {!cameraIsReady && <CameraNotReadySplashScreen goBack={goBack}/>}
            {cameraIsLoading && <CameraLoadingSplashScreen />}
            <CameraHeader 
                isRolling={isRolling} 
                goBack={goBack} 
                flashMode={flashMode} 
                switchFlashMode={switchFlashMode} 
            />
            <View style={{
                width: '100%',
                height: '100%',
                position: 'relative'
            }}>
                <View style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: 30,
                }}>
                    <CameraRecordingReadySplashScreen 
                        preparingForRecording={preparingForRecording} 
                    />
                    <CameraScannerOverlay isScanning={isScanning} />
                    {focusSquare.isVisible && <CameraFocalBox focusSquare={focusSquare} />}
                    <CameraView
                        ref={camRef}
                        autofocus={focusMode}
                        facing={'back'}
                        zoom={0}
                        flash={flashMode}
                        onCameraReady={() => {
                            setCameraReady(true)
                            setCameraLoading(false);
                        }}
                        onMountError={(err) => {
                            setOnMountError(err);
                            setCameraLoading(false);
                        }}
                        onTouchStart={onTouchStart}
                        onTouchEnd={onTouchEnd}
                        mode={isRecording ? 'video' : 'picture'}
                        barcodeScannerSettings={{
                            barcodeTypes: ['qr'],
                        }}
                        onBarcodeScanned={isScanning ? barCodeScannedHandler : undefined}
                        style={{
                            width: '100%',
                            height: '100%',
                            borderRadius: 30,
                            overflow: 'hidden',
                            backgroundColor: '#000',
                        }}
                    />
                </View>
            </View>
            <CameraShutterInterface 
                isRecording={isRecording}
                isScanning={isScanning}
                cameraReady={cameraIsReady} 
                pressInHandle={pressInHandle} 
                pressOutHandle={pressOutHandle}
                openScanner={openBarcodeScanner}
                closeScanner={closeBarcodeScanner}
            />
        </View>
    )
}
