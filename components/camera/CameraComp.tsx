import { BarcodeScanningResult, CameraType, CameraView, FocusMode } from 'expo-camera';
import React, { useEffect } from 'react'
import { View, GestureResponderEvent } from 'react-native';
import CameraFocalBox from './CameraFocalBox';
import CameraPermissionSplashScreen from './CameraPermissionSplashScreen';
import CameraNotReadySplashScreen from './CameraNotReadySplashScreen';
import CameraRecordingReadySplashScreen from './CameraRecordingReadySplashScreen';
import CameraHeader from './CameraHeader';
import CameraShutterInterface from './CameraShutterInterface';
import CameraScannerOverlay from './CameraScannerOverlay';
import { CameraContextType, useCameraContext } from '@/contexts/CameraContext';

export default function CameraComp({
    cameraPermission,
    requestCameraPermission,
    goToSettings,
    flashMode,
    focusMode,
    switchFlashMode,
    zoom,
    cameraReady,
    cameraRef,
    facing,
    handleCameraReady,
    isScanning,
    focusSquare,
    onMountError,
    goBack,
    onTouchStart,
    onTouchEnd,
    pressInHandle,
    pressOutHandle,
    onBarcodeScanned,
    error,
    isRolling,
    isRecording,
    preparingForRecording,
    openScanner,
    closeScanner,
}: {
    cameraPermission: {
        granted: boolean;
        canAskAgain: boolean;
        status: string;
    } | null;
    requestCameraPermission: () => void;
    goToSettings: () => void;
    flashMode: 'off'|'auto'|'on';
    focusMode: FocusMode;
    switchFlashMode: () => void;
    zoom: number;
    cameraReady: boolean;
    cameraRef: React.RefObject<CameraView>;
    facing: CameraType;
    isRefreshing: boolean;
    handleCameraReady: () => void;
    focusSquare: any;
    toggleCameraFacing: () => void;
    onMountError: (err: any) => void;
    goBack: () => void;
    onTouchStart: (e: GestureResponderEvent) => void;
    onTouchEnd: (e: GestureResponderEvent) => void;
    pressInHandle: (e: GestureResponderEvent) => void;
    pressOutHandle: (e: GestureResponderEvent) => void;
    error: string | null;
    isRolling: boolean;
    isRecording: boolean;
    preparingForRecording: boolean;
    onBarcodeScanned: (barCode: BarcodeScanningResult) => void;
    isScanning: boolean;
    openScanner: () => void;
    closeScanner: () => void;
}) {
    return (
        <View style={{ flex: 1, margin: 10, borderRadius: 30 }}>
            <CameraPermissionSplashScreen 
                cameraPermission={cameraPermission} 
                goToSettings={goToSettings}
                requestCameraPermission={requestCameraPermission} 
            />
            <CameraNotReadySplashScreen 
                cameraReady={cameraReady} 
                goBack={goBack}
            />
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
                    <CameraView
                        ref={cameraRef}
                        autofocus={focusMode}
                        facing={facing}
                        zoom={zoom}
                        flash={flashMode}
                        onCameraReady={() => handleCameraReady()}
                        onMountError={(err) => onMountError(err)}
                        onTouchStart={onTouchStart}
                        onTouchEnd={onTouchEnd}
                        mode={isRecording ? 'video' : 'picture'}
                        barcodeScannerSettings={{
                            barcodeTypes: ['qr'],
                        }}
                        onBarcodeScanned={onBarcodeScanned}
                        style={{
                            width: '100%',
                            height: '100%',
                            borderRadius: 30,
                            overflow: 'hidden',
                            backgroundColor: '#fff',
                        }}
                    >
                        {focusSquare.isVisible && <CameraFocalBox focusSquare={focusSquare} />}
                    </CameraView>
                </View>
            </View>
            <CameraShutterInterface 
                isRecording={isRecording}
                isScanning={isScanning}
                cameraReady={cameraReady} 
                pressInHandle={pressInHandle} 
                pressOutHandle={pressOutHandle}
                openScanner={openScanner}
                closeScanner={closeScanner}
            />
        </View>
    )
}
