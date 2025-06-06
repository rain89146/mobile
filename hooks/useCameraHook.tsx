import { BarcodeScanningResult, CameraCapturedPicture, CameraType, CameraView, FocusMode } from 'expo-camera';
import { useState, RefObject, useCallback } from 'react'
import { useRouter, useFocusEffect } from 'expo-router';
import { GestureResponderEvent, Linking} from 'react-native';
import useAlertSoundHook from './useAlertSoundHook';
import { useCameraContext } from '@/contexts/CameraContext';
import { cameraConfig } from '@/config/cameraConfig';
import * as MediaLibrary from 'expo-media-library';
import { Helpers } from '@/utils/helpers';

export type focusSquare = {
	x: number;
	y: number;
	isVisible: boolean;
};

export function useCameraHook(
    ref: RefObject<CameraView>,
    cameraLockRef: RefObject<boolean>,
) {
    const [error, setError] = useState<string | null>(null);
    const [flashMode, setFlashMode] = useState<'off'|'auto'|'on'>('off');
    const [focusMode, setFocusMode] = useState<FocusMode>('on');
    const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
    const [recordingTimeout, setRecordingTimeout] = useState<NodeJS.Timeout | null>(null);
    const [isRecording, setIsRecording] = useState<boolean>(false);
    const [isRolling, setIsRolling] = useState<boolean>(false);
    const [focusSquare, setFocusSquare] = useState<focusSquare>({
        x: 0,
        y: 0,
        isVisible: false,
    });
    const [preparingForRecording, setPreparingForRecording] = useState<boolean>(false);
    const [isScanning, setIsScanning] = useState<boolean>(false);
    const router = useRouter();
    const {playScanAlertSound} = useAlertSoundHook();
    const {setPhotoUri} = useCameraContext();

    //  listen to focus effect
    useFocusEffect(
        useCallback(() => {
            if (ref.current) ref.current.resumePreview();
            cameraLockRef.current = false;

            return () => {
                if (ref.current) ref.current.pausePreview();
                if (cameraLockRef.current) cameraLockRef.current = false;
                if (recordingTimeout) {
                    clearTimeout(recordingTimeout);
                    setRecordingTimeout(null);
                }                
            }
        }, [])
    )

    /**
     * Takes a picture using the camera
     * @returns {Promise<CameraCapturedPicture>}
     */
    const takePicture = async (): Promise<CameraCapturedPicture|null> => {
        try {
            throw new Error('Camera ref is not set');
            await Helpers.impactHeavyFeedback();
            return await ref.current.takePictureAsync();
        } catch (error: Error | any) {
            throw error;
        }
	}

    /**
     * Cycles through flash modes: 'off' -> 'on' -> 'auto'
     * @returns {Promise<void>}
     */
    const switchFlashMode = async (): Promise<void> => {
        await Helpers.impactSoftFeedback();
        setFlashMode((prevMode) => {
            if (prevMode === 'off') {
                return 'on';
            } else if (prevMode === 'on') {
                return 'auto';
            } else {
                return 'off';
            }
        });
    }

    /**
     * Handles camera focus on tap
     * @param event 
     */
    const onTouchStart = (e: GestureResponderEvent) => {
        const {locationX, locationY} = e.nativeEvent;
        setIsRefreshing(true);
        setFocusSquare({ x: locationX, y: locationY, isVisible: true });
        setFocusMode('on');
    }

    /**
     * Handles camera focus on tap
     * @param event 
     */
    const onTouchEnd = (e: GestureResponderEvent) => {
        setIsRefreshing(false);
        setFocusSquare((prev) => ({ ...prev, isVisible: false }));
        setFocusMode('off');
    }

    /**
     * Starts the recording
     * @returns {Promise<void>}
     */
    const startedRecording = async (): Promise<void> => {
        try {
            if (!ref.current) throw new Error('Camera ref is not set');
            
            //  set recording
            setIsRecording(true);
            
            // wait for 1 second
            const response: {uri: string|undefined} = await new Promise((resolve) => {

                //  set the camera to prepare for recording
                setPreparingForRecording(true);

                //  wait for 3 seconds
                setTimeout(async () => {

                    //  done preparing for recording
                    setPreparingForRecording(false);

                    //  set the rolling state
                    setIsRolling(true);

                    //  start recording
                    const response = await ref.current.recordAsync({
                        maxDuration: cameraConfig.MAX_RECORDING_DURATION,
                    });

                    //  check if the response is null
                    if (!response) throw new Error('Unable to record video');
                    
                    // return the response
                    resolve(response);

                }, cameraConfig.RECORDING_PREP_TIME);
            });

            //  check if the response is null
            if (!response.uri) throw new Error('Unable to save video');

            //  save the video to the media library
            await MediaLibrary.saveToLibraryAsync(response.uri);

        }
        catch (error: Error|any) 
        {
            setIsRecording(false);
            setIsRolling(false);
            setPreparingForRecording(false);

            console.log(error)
            setError(`Unable to start recording. reason: ${error.message}`);
        }
    }

    /**
     * Stops the recording
     * @returns {Promise<void>}
     */
    const stopRecording = async (): Promise<void> => {
        try {

            await Helpers.notificationSuccessFeedback();
            setIsRecording(false);
            setIsRolling(false);
            ref.current.stopRecording();
            
        } 
        catch (error: Error|any) 
        {
            setIsRecording(false);
            setIsRolling(false);

            console.log(error);
            setError(`Unable to stop recording. reason: ${error.message}`);
        }
    }

    /**
     * Press in handle
     * @returns {void}
     * @param e 
     */
    const pressInHandle = (e: GestureResponderEvent): void => {
        if (recordingTimeout) {
            clearTimeout(recordingTimeout);
            setRecordingTimeout(null);
        }
        
        const timeout = setTimeout(() => {
            startedRecording();
            setRecordingTimeout(null);
        }, 500);

        setRecordingTimeout(timeout as unknown as NodeJS.Timeout);
    }

    /**
     * Press out handle
     * @returns {Promise<void>}
     * @param e 
     */
    const pressOutHandle = async (e: GestureResponderEvent): Promise<void> => {
        try {
            if (recordingTimeout) {
                clearTimeout(recordingTimeout);
                setRecordingTimeout(null);
            }
    
            if (isRecording) 
            {            
                await stopRecording();
            } 
            else 
            {
                //  take a picture, pass on the photo to another screen
                const photo = await takePicture();
                if (photo)
                {
                    //  pause before navigation
                    await ref.current.pausePreview();
         
                    //  set the photo uri to the camera context
                    setPhotoUri(photo.uri);
    
                    //  go to the camera preview screen
                    router.replace('/(protected)/(camera)/cameraPreview');
                }
            }
        } 
        catch (error: Error | any) 
        {
            console.log(error);
            if (ref.current) ref.current.pausePreview();
            setError(error.message);
        }
    }

    /**
     * Open the barcode scanner
     * @returns {Promise<void>}
     */
    const openBarcodeScanner = async (): Promise<void> => {
        await Helpers.impactHeavyFeedback();
        setIsScanning(true);
    }
    
    /**
     * Close the barcode scanner
     * @returns {Promise<void>}
     */
    const closeBarcodeScanner = async (): Promise<void> => {
        await Helpers.impactMediumFeedback();
        setIsScanning(false);
    }

    /**
     * Handle barcode scanned event
     * @param barCode 
     * @returns {Promise<void>}
     */
    const barCodeScannedHandler = async (barCode: BarcodeScanningResult): Promise<void> => {
        if (!isScanning) return;
        if (!barCode) return;

        //  deconstruct the barcode
        const { data, type } = barCode;

        //  check if the barcode is a valid URL
        if (cameraLockRef.current === false && isScanning && data && type && type === 'qr')
        {   
            cameraLockRef.current = true;
            setIsScanning(false);
            
            await new Promise((resolve, reject) => {
                setTimeout(async () => {
                    
                    // lock the camera
                    ref.current.pausePreview();
                    
                    //  feedback
                    await Helpers.notificationSuccessFeedback();
                    await playScanAlertSound();

                    try {

                        //  check if the url is external or internal
                        const isExternalUrl = Helpers.isExternalLink(data);
                        if (isExternalUrl) 
                        {
                            //  go to the external link
                            router.push({ pathname: "/(protected)/(modals)/externalRedirect", params: { destination: data } });
                        }
                        else 
                        {
                            // go to the internal link
                            Linking.openURL(data);
                        }
                    } 
                    catch (error) 
                    {
                        console.log(error)
                    } 
                    finally 
                    {                    
                        ref.current.resumePreview();
                        cameraLockRef.current = false;
                    }
                }, 600)
            });
        }
    }
    
    return {
        error, 
        flashMode,
        focusMode,
        focusSquare, 
        isRolling,
        isRecording,
        isScanning,
        isRefreshing, 
        preparingForRecording,
        onTouchEnd,
        takePicture, 
        onTouchStart,
        switchFlashMode,
        pressInHandle,
        pressOutHandle,
        openBarcodeScanner,
        closeBarcodeScanner,
        barCodeScannedHandler
    }
}
