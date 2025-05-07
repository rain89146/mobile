import CameraComp from '@/components/camera/CameraComp';
import { useCameraHook } from '@/hooks/useCameraHook';
import { CameraView } from 'expo-camera';
import { useNavigation } from 'expo-router';
import React, { useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';

export default function modal() {
    
    const cameraRef = React.useRef<CameraView>(null);
    const navigation = useNavigation();

    useEffect(() => {
        navigation.setOptions({ 
            headerShown: false,
        });
    }, [navigation]);
    
    const {
        error,
        cameraReady, 
        onMountError, 
        handleCameraReady, 
        facing, 
        toggleCameraFacing, 
        zoom, 
        focusSquare, 
        isRefreshing, 
        isRecording,
        isScanning,
        flashMode,
        focusMode,
        preparingForRecording,
        cameraPermission,
        requestCameraPermission,
        goToSettings,
        switchFlashMode,
        canGoBack,
        onTouchStart,
        onTouchEnd,
        pressInHandle,
        pressOutHandle,
        isRolling,
        barCodeScannedHandler,
        openBarcodeScanner,
        closeBarcodeScanner
    } = useCameraHook(cameraRef);

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <CameraComp
                focusMode={focusMode}
                goToSettings={goToSettings}
                cameraPermission={cameraPermission}
                requestCameraPermission={requestCameraPermission}
                isRolling={isRolling}
                isRecording={isRecording}
                flashMode={flashMode}
                switchFlashMode={switchFlashMode}
                cameraRef={cameraRef}
                cameraReady={cameraReady}
                zoom={zoom}
                focusSquare={focusSquare}
                isRefreshing={isRefreshing}
                handleCameraReady={handleCameraReady}
                facing={facing}
                toggleCameraFacing={toggleCameraFacing}
                onMountError={onMountError}
                goBack={canGoBack}
                onTouchStart={onTouchStart}
                onTouchEnd={onTouchEnd}
                pressInHandle={pressInHandle}
                pressOutHandle={pressOutHandle}
                error={error}
                preparingForRecording={preparingForRecording}
                onBarcodeScanned={barCodeScannedHandler}
                isScanning={isScanning}
                openScanner={openBarcodeScanner}
                closeScanner={closeBarcodeScanner}
            />
        </SafeAreaView>
    )
}
