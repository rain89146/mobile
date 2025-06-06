import React, {createContext, useContext, useEffect, useState} from "react";
import * as MediaLibrary from 'expo-media-library';
import * as Location from 'expo-location';
import * as Camera from "expo-camera";
import {Audio} from 'expo-av';
import * as Notifications from 'expo-notifications';

export type PermissionContextType = {
    allowCameraUse: boolean;
    allowMediaUse: boolean;
    allowAudioUse: boolean;
    allowForegroundLocationUse: boolean;
    allowNotificationsUse: boolean;
    allowBackgroundLocationUse: boolean;
    allowMicrophoneUse: boolean;
    galleryPermission: MediaLibrary.PermissionResponse | null;
    cameraPermission: Camera.PermissionResponse | null;
    audioPermission: Audio.PermissionResponse | null;
    backgroundLocationPermission: Location.PermissionResponse | null;
    foregroundLocationPermission: Location.PermissionResponse | null;
    notificationPermission: Notifications.PermissionResponse | null;
    microphonePermission: Camera.PermissionResponse | null;
    requestToAccessPhotoLibrary: () => Promise<void>;
    requestToAccessCamera: () => Promise<MediaLibrary.EXPermissionResponse|null>;
    requestToAccessAudio: () => Promise<void>;
    requestAccessToForegroundLocation: () => Promise<Location.LocationPermissionResponse|null>;
    requestAccessToBackgroundLocation: () => Promise<void>;
    requestToEnableNotifications: () => Promise<Notifications.NotificationPermissionsStatus|null>;
    requestToEnableMicrophone: () => Promise<void>;
}

const PermissionContext = createContext<PermissionContextType>({
    allowCameraUse: false,
    allowMediaUse: false,
    allowAudioUse: false,
    allowForegroundLocationUse: false,
    allowNotificationsUse: false,
    allowBackgroundLocationUse: false,
    allowMicrophoneUse: false,
    requestToEnableMicrophone: async () => {
        throw new Error('requestToEnableMicrophone not implemented');
    },
    requestToAccessPhotoLibrary: async () => {
        throw new Error('requestToAccessPhotoLibrary not implemented');
    },
    requestToAccessCamera: async () => {
        throw new Error('requestToAccessCamera not implemented');
    },
    requestToAccessAudio: async () => {
        throw new Error('requestToAccessAudio not implemented');
    },
    requestAccessToForegroundLocation: async () => {
        throw new Error('requestAccessToForegroundLocation not implemented');
    },
    requestAccessToBackgroundLocation: async () => {
        throw new Error('requestAccessToBackgroundLocation not implemented');
    },
    requestToEnableNotifications: async () => {
        throw new Error('requestToEnableNotifications not implemented');
    },
    galleryPermission: null,
    cameraPermission: null,
    audioPermission: null,
    backgroundLocationPermission: null,
    foregroundLocationPermission: null,
    notificationPermission: null,
    microphonePermission: null,
});

const PermissionContextProvider = ({children}: {children: React.ReactNode}) => {
    const [allowCameraUse, setAllowCameraUse] = useState<boolean>(false);
    const [allowMediaUse, setAllowMediaUse] = useState<boolean>(false);
    const [allowAudioUse, setAllowAudioUse] = useState<boolean>(false);
    const [allowForegroundLocationUse, setAllowForegroundLocationUse] = useState<boolean>(false);
    const [allowBackgroundLocationUse, setAllowBackgroundLocationUse] = useState<boolean>(false);
    const [allowNotificationsUse, setAllowNotificationsUse] = useState<boolean>(false);
    const [allowMicrophoneUse, setAllowMicrophoneUse] = useState<boolean>(false);

    const [galleryPermission, requestMediaPermission] = MediaLibrary.usePermissions();
    const [cameraPermission, requestCameraPermission, getCameraPermissionsAsync] = Camera.useCameraPermissions();
    const [microphonePermission, requestMicrophonePermission, getMicrophonePermissionsAsync] = Camera.useMicrophonePermissions();
    const [audioPermission, requestAudioPermission] = Audio.usePermissions();
    const [backgroundLocationPermission, requestBackgroundLocationPermission] = Location.useBackgroundPermissions();
    const [foregroundLocationPermission, requestForegroundLocationPermission] = Location.useForegroundPermissions();
    const [notificationPermission, setNotificationPermission] = useState<Notifications.PermissionResponse|null>(null);
    
    //  Request permissions on mount
    useEffect(() => {
        let isMounted = true;
        if (!isMounted) return;

        if (galleryPermission === null) 
        {
            MediaLibrary.getPermissionsAsync()
            .then((res: MediaLibrary.PermissionResponse) => setAllowMediaUse(res.status === MediaLibrary.PermissionStatus.GRANTED))
            .catch((error) => setAllowMediaUse(false));
        }
        if (audioPermission === null)
        {
            Audio.getPermissionsAsync()
            .then((res: Audio.PermissionResponse) => setAllowAudioUse(res.status === Audio.PermissionStatus.GRANTED))
            .catch((error) => setAllowAudioUse(false));
        }
        if (backgroundLocationPermission === null)
        {
            Location.getBackgroundPermissionsAsync()
            .then((res: Location.PermissionResponse) => setAllowBackgroundLocationUse(res.status === Location.PermissionStatus.GRANTED))
            .catch((error) => setAllowBackgroundLocationUse(false));
        }
        if (foregroundLocationPermission === null)
        {
            Location.getForegroundPermissionsAsync()
            .then((res: Location.PermissionResponse) => setAllowForegroundLocationUse(res.status === Location.PermissionStatus.GRANTED))
            .catch((error) => setAllowForegroundLocationUse(false));
        }
        if (cameraPermission === null)
        {
            getCameraPermissionsAsync()
            .then((res: Camera.PermissionResponse) => {
                console.log(res)
                setAllowCameraUse(res.status === Camera.PermissionStatus.GRANTED)
            })
            .catch((error) => setAllowCameraUse(false));
        }
        if (notificationPermission === null)
        {
            Notifications.getPermissionsAsync()
            .then((res: Notifications.PermissionResponse) => setNotificationPermission(res))
            .catch((error) => setAllowNotificationsUse(false));
        }
        if (microphonePermission === null)
        {
            getMicrophonePermissionsAsync()
            .then((res: MediaLibrary.EXPermissionResponse) => setAllowMicrophoneUse(res.status === MediaLibrary.PermissionStatus.GRANTED))
            .catch((error) => setAllowMicrophoneUse(false));
        }

        return () => {
            isMounted = false;
            setAllowCameraUse(false);
            setAllowMediaUse(false);
            setAllowAudioUse(false);
            setAllowForegroundLocationUse(false);
            setAllowBackgroundLocationUse(false);
            setAllowNotificationsUse(false);
            setAllowMicrophoneUse(false);
            setNotificationPermission(null);
        }
    }, [])

    /**
     * Request permission to access the camera
     * @description This function will request permission to access the camera and set the state of allowCameraUse
     * @returns {Promise<void>}
     */
    async function requestToAccessPhotoLibrary(): Promise<void> {
        try 
        {
            if (galleryPermission) 
            {
                // check if permission is already granted
                if (galleryPermission.granted) 
                {
                    setAllowMediaUse(true);
                    return;
                }

                // check if permission was denied and can be asked again
                if (galleryPermission.status === MediaLibrary.PermissionStatus.DENIED && galleryPermission.canAskAgain)
                {
                    const res = await requestMediaPermission();
                    setAllowMediaUse(res.granted);
                    return;
                } 

                // permission was denied and cannot be asked again
                setAllowMediaUse(false);
                return;
            } 
            
            //  request permission
            const res = await requestMediaPermission();
            setAllowMediaUse(res.status === MediaLibrary.PermissionStatus.GRANTED);
        }
        catch (error) 
        {
            console.error('PermissionContextProvider: requestToAccessPhotoLibrary', error);
            setAllowMediaUse(false);
        }
    }

    /**
     * Request permission to access the camera
     * @description This function will request permission to access the camera and set the state of allowCameraUse
     * @returns {Promise<void>}
     */
    async function requestToAccessCamera(): Promise<MediaLibrary.EXPermissionResponse|null> {
        try
        {
            if (cameraPermission) 
            {
                // check if permission is already granted
                if (cameraPermission.granted) 
                {
                    setAllowCameraUse(true);
                    return cameraPermission;
                }

                // check if permission was denied and can be asked again
                if (cameraPermission.status === Camera.PermissionStatus.DENIED && cameraPermission.canAskAgain)
                {
                    const res = await requestCameraPermission();
                    setAllowCameraUse(res.granted);
                    return res;
                } 

                // permission was denied and cannot be asked again
                setAllowCameraUse(false);
                return null;
            } 
            
            //  request permission
            const res = await requestCameraPermission();
            setAllowCameraUse(res.status === MediaLibrary.PermissionStatus.GRANTED);
            return res;
        }
        catch (error)
        {
            console.error('PermissionContextProvider: requestToAccessCamera', error);
            setAllowCameraUse(false);
            return null;
        }
    }

    /**
     * Request permission to access microphone
     * @description This function will request permission to access the microphone and set the state of allowAudioUse
     * @returns {Promise<void>}
     */
    async function requestToAccessAudio(): Promise<void> {
        try
        {
            if (audioPermission) 
            {
                // check if permission is already granted
                if (audioPermission.granted) 
                {
                    setAllowAudioUse(true);
                    return;
                }

                // check if permission was denied and can be asked again
                if (
                    (audioPermission.status === MediaLibrary.PermissionStatus.DENIED && audioPermission.canAskAgain)
                    || audioPermission.status === MediaLibrary.PermissionStatus.UNDETERMINED
                ) {
                    const res = await requestAudioPermission();
                    setAllowAudioUse(res.granted);
                    return;
                } 

                // permission was denied and cannot be asked again
                setAllowAudioUse(false);
                return;
            }

            //  request permission
            const res = await requestAudioPermission();
            setAllowAudioUse(res.status === MediaLibrary.PermissionStatus.GRANTED);
        }
        catch (error)
        {
            console.error('PermissionContextProvider: requestToAccessMic', error);
            setAllowAudioUse(false);
        }
    }

    /**
     * Request permission to access location
     * @description This function will request permission to access the location and set the state of allowLocationUse
     * @returns {Promise<void>}
     */
    async function requestAccessToForegroundLocation(): Promise<Location.LocationPermissionResponse|null> {
        try
        {
            if (foregroundLocationPermission) 
            {
                // check if permission is already granted
                if (foregroundLocationPermission.granted) 
                {
                    setAllowForegroundLocationUse(true);
                    return foregroundLocationPermission;
                }

                // check if permission was denied and can be asked again
                if (
                    (
                        foregroundLocationPermission.status === Location.PermissionStatus.DENIED || 
                        foregroundLocationPermission.status === Location.PermissionStatus.UNDETERMINED
                    ) 
                    && foregroundLocationPermission.canAskAgain)
                {
                    const res = await requestForegroundLocationPermission();
                    setAllowForegroundLocationUse(res.granted);
                    return res;
                } 

                // permission was denied and cannot be asked again
                setAllowForegroundLocationUse(false);
                return null;
            } 
            
            //  request permission
            const res = await requestForegroundLocationPermission();
            setAllowForegroundLocationUse(res.status === MediaLibrary.PermissionStatus.GRANTED);
            return res;
        }
        catch (error: unknown)
        {
            if (error instanceof Error) {
                console.error('PermissionContextProvider: requestAccessToForegroundLocation', error.message);
            }else {
                console.error('PermissionContextProvider: requestAccessToForegroundLocation', error);
            }
            
            setAllowForegroundLocationUse(false);
            return null;
        }
    }

    /**
     * Request permission to access location
     * @description This function will request permission to access the location and set the state of allowLocationUse
     * @returns {Promise<void>}
     */
    async function requestAccessToBackgroundLocation(): Promise<void> {
        try
        {
            if (backgroundLocationPermission) 
            {
                // check if permission is already granted
                if (backgroundLocationPermission.granted) 
                {
                    setAllowBackgroundLocationUse(true);
                    return;
                }

                // check if permission was denied and can be asked again
                if (backgroundLocationPermission.status === MediaLibrary.PermissionStatus.DENIED && backgroundLocationPermission.canAskAgain)
                {
                    const res = await requestBackgroundLocationPermission();
                    setAllowBackgroundLocationUse(res.granted);
                    return;
                } 

                // permission was denied and cannot be asked again
                setAllowBackgroundLocationUse(false);
                return;
            } 
            
            //  request permission
            const res = await requestBackgroundLocationPermission();
            setAllowBackgroundLocationUse(res.status === MediaLibrary.PermissionStatus.GRANTED);
        }
        catch (error)
        {
            console.error('PermissionContextProvider: requestToAccessLocation', error);
            setAllowBackgroundLocationUse(false);
        }
    }

    /**
     * Request permission to enable notifications
     * @description This function will request permission to enable the notifications and set the state of allowNotificationsUse
     * @returns {Promise<void>}
     */
    async function requestToEnableNotifications(): Promise<Notifications.NotificationPermissionsStatus|null> {
        try {
            const res = await Notifications.getPermissionsAsync();
            const {status, canAskAgain} = res;

            // check if permission is already granted
            if (status === Notifications.PermissionStatus.GRANTED) {
                setAllowNotificationsUse(true);
                return res;
            }

            // check if permission was denied and can be asked again
            if (
                (
                    status === Notifications.PermissionStatus.DENIED ||
                    status === Notifications.PermissionStatus.UNDETERMINED
                ) &&
                canAskAgain
            ) {
                const res = await Notifications.requestPermissionsAsync({
                    ios: {
                        allowAlert: true,
                        allowBadge: true,
                        allowSound: true,
                    }
                });
                setAllowNotificationsUse(res.status === Notifications.PermissionStatus.GRANTED);
                return res;
            }

            // permission was denied and cannot be asked again
            setAllowNotificationsUse(false);
            return null;

        } catch (error) {
            console.error('PermissionContextProvider: requestToEnableNotifications', error);
            setAllowNotificationsUse(false);
            return null;
        }
    }

    /**
     * Request permission to enable microphone
     * @description This function will request permission to enable the microphone and set the state of allowMicrophoneUse
     * @returns {Promise<void>}
     */
    async function requestToEnableMicrophone(): Promise<void> {
        try {
            if (microphonePermission) 
            {
                // check if permission is already granted
                if (microphonePermission.granted) 
                {
                    setAllowMicrophoneUse(true);
                    return;
                }

                // check if permission was denied and can be asked again
                if (
                    (microphonePermission.status === MediaLibrary.PermissionStatus.DENIED && microphonePermission.canAskAgain) || 
                    microphonePermission.status === MediaLibrary.PermissionStatus.UNDETERMINED
                )
                {
                    const res = await requestMicrophonePermission();
                    setAllowMicrophoneUse(res.granted);
                    return;
                } 

                // permission was denied and cannot be asked again
                setAllowMicrophoneUse(false);
                return;
            }

            //  request permission
            const res = await requestMicrophonePermission();
            setAllowMicrophoneUse(res.status === Camera.PermissionStatus.GRANTED);

        } catch (error) {
            console.error('PermissionContextProvider: requestToEnableMicrophone', error);
            setAllowMicrophoneUse(false);
        }
    }

    return (
        <PermissionContext.Provider value={{
            galleryPermission,
            allowMediaUse,
            requestToAccessPhotoLibrary,

            cameraPermission,
            allowCameraUse,
            requestToAccessCamera,

            audioPermission,
            allowAudioUse,
            requestToAccessAudio,

            foregroundLocationPermission,
            allowForegroundLocationUse,
            requestAccessToForegroundLocation,

            backgroundLocationPermission,
            allowBackgroundLocationUse,
            requestAccessToBackgroundLocation,

            notificationPermission,
            allowNotificationsUse,
            requestToEnableNotifications,

            microphonePermission,
            allowMicrophoneUse,
            requestToEnableMicrophone
        }}>
            {children}
        </PermissionContext.Provider>
    )
}

const usePermissionContext = () => useContext(PermissionContext);

export {PermissionContextProvider, usePermissionContext};