import { BarcodeScanningResult, CameraCapturedPicture, CameraType, CameraView, FocusMode, useCameraPermissions } from 'expo-camera';
import { useState, RefObject, useEffect, useRef, useCallback } from 'react'
import * as Haptics from 'expo-haptics';
import { useNavigation, useRouter } from 'expo-router';
import { GestureResponderEvent, Platform, Linking, AppState, AppStateStatus } from 'react-native';
import useMediaLibraryHook from './useMediaLibraryHook';
import { PermissionResponse } from 'expo-media-library';
import * as IntentLauncher from 'expo-intent-launcher'
import { Helpers } from '@/utils/helpers';
import useAlertSoundHook from './useAlertSoundHook';
import { useFocusEffect } from '@react-navigation/native';
import { useCameraContext } from '@/contexts/CameraContext';

export type focusSquare = {
	x: number;
	y: number;
	isVisible: boolean;
};

export function useCameraHook(ref: RefObject<CameraView>) {
    const appState = useRef(AppState.currentState);
    const cameraLocked = useRef(false);
    const navigation = useNavigation();
    const [permission, requestPermission] = useCameraPermissions();
    const { 
        saveImageToLibrary, 
        requestPermission: requestLibraryPermission, 
        permissionResponse: mediaLibraryPermissionResponse 
    } = useMediaLibraryHook();
    const [allowCameraUse, setAllowCameraUse] = useState<boolean>(false);
    const [facing, setFacing] = useState<CameraType>('back');
    const [cameraReady, setCameraReady] = useState<boolean>(false);
    const [zoom, setZoom] = useState<number>(0);
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
    const cameraContext = useCameraContext();

    //  handle app state change
    const handleAppStateChange = useCallback((nextAppState: AppStateStatus) => {
        if (appState.current !== 'active' && nextAppState === 'active') 
        {
            cameraLocked.current = false;

            if (ref.current && cameraReady) 
            {
                ref.current.resumePreview();
            }
        }
        appState.current = nextAppState;
    }, [])

    //  listen to permission change
    useEffect(() => {
        try {
            // Check if permissionResponse is null
            if (!mediaLibraryPermissionResponse) return;

            // Check if permissionResponse is granted
            if (mediaLibraryPermissionResponse.status === 'granted') {
                setAllowCameraUse(true);
                return;
            }
            
            // Check if permissionResponse is not granted
            if (mediaLibraryPermissionResponse.canAskAgain) 
            {
                requestMediaLibraryPermission();
            } 
            else 
            {
                setAllowCameraUse(false);
                setError('Permission to access media library is required');
            }
        }
        catch (error) {
            console.log("useCameraHook: useEffect: mediaPermission", error);
            setError('Something went wrong while requesting permission');
        }
    }, [mediaLibraryPermissionResponse]);

    //  listen to app state change
    useEffect(() => {

        //  add event listener to app state
        const listener = AppState.addEventListener('change', handleAppStateChange);

        //  cleanup the event listener
        return () => {
            listener.remove();
        }
    }, [cameraReady]);

    //  listen to focus effect
    useFocusEffect(
        useCallback(() => {
            if (ref.current) 
            {
                ref.current.resumePreview();
            }

            return () => {
                if (ref.current) 
                {
                    ref.current.pausePreview();
                }

                if (recordingTimeout) {
                    clearTimeout(recordingTimeout);
                    setRecordingTimeout(null);
                }

                if (cameraLocked.current) {
                    cameraLocked.current = false;
                }
            }
        }, [])
    )

    /**
     * Requests permission to access the media library
     * @returns {Promise<void>}
     */
    const requestMediaLibraryPermission = async (): Promise<void> => {
        try {
            const response: PermissionResponse = await requestLibraryPermission();
            setAllowCameraUse(response.granted);

            if (response.granted === false) 
            {
                setError('Permission to access media library is required');
                return;
            }
        } 
        catch (error) 
        {
            console.error('Error requesting permission:', error);
            throw error;
        }
    }

    /**
     * takes the user to the system settings
     * @returns {void}
     */
    const goToSettings = () => {
        //  Check if the app is running on iOS
        if (Platform.OS === 'ios') {
            Linking.openURL("App-prefs:root=General");
            return;
        }

        //  Check if the app is running on Android
        IntentLauncher.startActivityAsync(
            IntentLauncher.ActivityAction.APPLICATION_DETAILS_SETTINGS,
            {
                data: 'package:' + 'com.your_app.package', // replace with your app's package name
            }
        ).catch((error) => {
            console.error('Error opening settings:', error);
        })
    }
    
    /**
     * Toggles the camera facing between front and back
     * @returns {void}
     */
    const toggleCameraFacing = (): void => {
		setFacing(current => (current === 'back' ? 'front' : 'back'));
	}

    /**
     * Listen for camera mount error
     * @param error 
     */
    const onMountError = (error: Error | any) =>{
        console.log(error)
        setError(error.message);
    }

    /**
     * Takes a picture using the camera
     * @returns {Promise<CameraCapturedPicture>}
     */
    const takePicture = async (): Promise<CameraCapturedPicture> => {
		try {
            //  Ensure the camera is mounted
            ensureCameraReady();

            //  Provide haptic feedback
            await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

            //  check if the camera is mounted
            if (!ref.current) throw new Error('Camera ref is not set');

            //  capture the photo
			const photo = await ref.current.takePictureAsync();
            if (!photo) throw new  Error('Unable to take picture');
            return photo;
	
		} catch (error) {
			console.log('Error taking picture:', error);	
            throw error;
		}
	}

    /**
     * Handles camera ready event
     * @returns {void}
     */
	const handleCameraReady = (): void => setCameraReady(true);

    /**
     * Cycles through flash modes: 'off' -> 'on' -> 'auto'
     * @returns {Promise<void>}
     */
    const switchFlashMode = async (): Promise<void> => {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
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
     * @returns {Promise<void>}
     */
    const canGoBack = async (): Promise<void> => {
        try {
            //  Ensure the camera is mounted
            await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    
            //  check if the camera is mounted
            navigation.goBack();

        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    /**
     * Handles camera focus on tap
     * @param event 
     */
    const onTouchStart = (e: GestureResponderEvent) => {
        const {locationX, locationY} = e.nativeEvent;

        // when the camera tapped, focus on the point
        setIsRefreshing(true);

        //  this is the point where the camera will focus
        setFocusSquare({ x: locationX, y: locationY, isVisible: true });

        //  set the focus mode
        setFocusMode('on');
    }

    /**
     * Handles camera focus on tap
     * @param event 
     */
    const onTouchEnd = (e: GestureResponderEvent) => {

        // when the camera tapped, focus on the point
        setIsRefreshing(false);

        //  this is the point where the camera will focus
        setFocusSquare((prev) => ({ ...prev, isVisible: false }));

        //  set the focus mode
        setFocusMode('off');
    }

    /**
     * Starts the recording
     * @returns {Promise<void>}
     */
    const startedRecording = async (): Promise<void> => {
        try {
            ensureCameraReady();
            
            //  set recording
            setIsRecording(true);
            
            // wait for 1 second
            const response: {uri: string|undefined} = await new Promise((resolve) => {

                //  set the camera to prepare for recording
                setPreparingForRecording(true);

                //  wait for 3 seconds
                setTimeout(async () => {
                    if (!ref.current) return;

                    //  done preparing for recording
                    setPreparingForRecording(false);

                    //  set the rolling state
                    setIsRolling(true);

                    //  start recording
                    const response = await ref.current.recordAsync({
                        maxDuration: 60000
                    });

                    //  check if the response is null
                    if (!response) throw new Error('Unable to record video');
                    
                    // return the response
                    resolve(response);
                }, 4000);
            });

            //  check if the response is null
            if (!response.uri) throw new Error('Unable to save video');

            //  save the video to the media library
            await saveImageToLibrary(response.uri);

        } catch (error) {
            console.log(error)
            throw error;
        }
    }

    /**
     * Stops the recording
     * @returns {Promise<void>}
     */
    const stopRecording = async (): Promise<void> => {
        try {
            //
            ensureCameraReady();

            // stop recording haptic feedback
            await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    
            // stop recording
            setIsRecording(false);

            // set rolling state
            setIsRolling(false);
            
            // stop recording
            ref.current!.stopRecording();

        } catch (error) {
            console.log(error)
            throw error;
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

        setRecordingTimeout(timeout);
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
                const photo: CameraCapturedPicture = await takePicture();
                if (!photo) return;
    
                //  pause before navigation
                if (ref.current)
                {
                    ref.current.pausePreview();
                }
     
                //  
                cameraContext?.setPhotoUri(photo.uri);

                //
                router.replace('/(camera)/cameraPreview');
            }
            
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    /**
     * Open the barcode scanner
     * @returns {Promise<void>}
     */
    const openBarcodeScanner = async (): Promise<void> => {
        ensureCameraReady();
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        setIsScanning(true);
    }
    
    /**
     * Close the barcode scanner
     * @returns {Promise<void>}
     */
    const closeBarcodeScanner = async (): Promise<void> => {
        ensureCameraReady();
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
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
        if (data && type && !cameraLocked.current && type === 'qr')
        {
            //  close the scanner
            setIsScanning(false);

            //  feedback
            await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            await playScanAlertSound();
            
            //  pause the camera preview
            if (ref.current) ref.current.pausePreview();
            
            //
            setTimeout(async () => {
                try {

                    //  check if the url is external or internal
                    const isExternalUrl = Helpers.isExternalLink(data);
    
                    //  lock the camera
                    cameraLocked.current = true;
    
                    if (isExternalUrl) 
                    {
                        //  go to the external link
                        router.push({ pathname: "/(modals)/externalRedirect", params: { destination: data } });
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
                finally {                    
                    if (ref.current) ref.current.resumePreview();
                    cameraLocked.current = false;
                }
            }, 500);
        }
    }

    /**
     * Ensures the camera is ready before performing any actions
     * @throws {Error} If the camera is not ready
     */
    function ensureCameraReady() {
        if (!ref.current) throw new Error('Camera ref is not set');
        if (!cameraReady) throw new Error('Camera is not ready');
    }
    
    return {
        zoom, 
        error, 
        facing,
        flashMode,
        focusMode,
        cameraReady, 
        focusSquare, 
        isRolling,
        isRecording,
        isScanning,
        isRefreshing, 
        allowCameraUse,
        preparingForRecording,
        cameraPermission: permission, 
        requestCameraPermission: requestPermission,
        goToSettings,
        setZoom, 
        canGoBack,
        onTouchEnd,
        takePicture, 
        onTouchStart,
        onMountError, 
        switchFlashMode,
        handleCameraReady, 
        toggleCameraFacing, 
        pressInHandle,
        pressOutHandle,
        openBarcodeScanner,
        closeBarcodeScanner,
        barCodeScannedHandler
    }
}
