import React, {createContext, useContext, useState} from "react";
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
    requestToAccessPhotoLibrary: () => Promise<void>;
    requestToAccessCamera: () => Promise<void>;
    requestToAccessMic: () => Promise<void>;
    requestAccessToForegroundLocation: () => Promise<void>;
    requestAccessToBackgroundLocation: () => Promise<void>;
    requestToEnableNotifications: () => Promise<void>;
}

const PermissionContext = createContext<PermissionContextType>({
    allowCameraUse: false,
    allowMediaUse: false,
    allowAudioUse: false,
    allowForegroundLocationUse: false,
    allowNotificationsUse: false,
    allowBackgroundLocationUse: false,
    requestToAccessPhotoLibrary: async () => {
        throw new Error('requestToAccessPhotoLibrary not implemented');
    },
    requestToAccessCamera: async () => {
        throw new Error('requestToAccessCamera not implemented');
    },
    requestToAccessMic: async () => {
        throw new Error('requestToAccessMic not implemented');
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
});

const PermissionContextProvider = ({children}: {children: React.ReactNode}) => {

    const [allowCameraUse, setAllowCameraUse] = useState<boolean>(false);
    const [allowMediaUse, setAllowMediaUse] = useState<boolean>(false);
    const [allowAudioUse, setAllowAudioUse] = useState<boolean>(false);
    const [allowForegroundLocationUse, setAllowForegroundLocationUse] = useState<boolean>(false);
    const [allowBackgroundLocationUse, setAllowBackgroundLocationUse] = useState<boolean>(false);
    const [allowNotificationsUse, setAllowNotificationsUse] = useState<boolean>(false);

    const [permissionResponse, requestMediaPermission] = MediaLibrary.usePermissions();
    const [cameraPermission, requestCameraPermission] = Camera.useCameraPermissions();
    const [audioPermission, requestAudioPermission] = Audio.usePermissions();

    const [backgroundLocationPermission, requestBackgroundLocationPermission] = Location.useBackgroundPermissions();
    const [foregroundLocationPermission, requestForegroundLocationPermission] = Location.useForegroundPermissions();
    
    /**
     * Request permission to access the camera
     * @description This function will request permission to access the camera and set the state of allowCameraUse
     * @returns {Promise<void>}
     */
    async function requestToAccessPhotoLibrary(): Promise<void> {
        try 
        {
            if (permissionResponse) 
            {
                // check if permission is already granted
                if (permissionResponse.granted) 
                {
                    setAllowMediaUse(true);
                    return;
                }

                // check if permission was denied and can be asked again
                if (permissionResponse.status === MediaLibrary.PermissionStatus.DENIED && permissionResponse.canAskAgain)
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
    async function requestToAccessCamera(): Promise<void> {
        try
        {
            if (cameraPermission) 
            {
                // check if permission is already granted
                if (cameraPermission.granted) 
                {
                    setAllowCameraUse(true);
                    return;
                }

                // check if permission was denied and can be asked again
                if (cameraPermission.status === MediaLibrary.PermissionStatus.DENIED && cameraPermission.canAskAgain)
                {
                    const res = await requestCameraPermission();
                    setAllowCameraUse(res.granted);
                    return;
                } 

                // permission was denied and cannot be asked again
                setAllowCameraUse(false);
                return;
            } 
            
            //  request permission
            const res = await requestCameraPermission();
            setAllowCameraUse(res.status === MediaLibrary.PermissionStatus.GRANTED);
        }
        catch (error)
        {
            console.error('PermissionContextProvider: requestToAccessCamera', error);
            setAllowCameraUse(false);
        }
    }

    /**
     * Request permission to access microphone
     * @description This function will request permission to access the microphone and set the state of allowAudioUse
     * @returns {Promise<void>}
     */
    async function requestToAccessMic(): Promise<void> {
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
                if (audioPermission.status === MediaLibrary.PermissionStatus.DENIED && audioPermission.canAskAgain)
                {
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
    async function requestAccessToForegroundLocation(): Promise<void> {
        try
        {
            if (foregroundLocationPermission) 
            {
                // check if permission is already granted
                if (foregroundLocationPermission.granted) 
                {
                    setAllowForegroundLocationUse(true);
                    return;
                }

                // check if permission was denied and can be asked again
                if (foregroundLocationPermission.status === Location.PermissionStatus.DENIED && foregroundLocationPermission.canAskAgain)
                {
                    const res = await requestForegroundLocationPermission();
                    setAllowForegroundLocationUse(res.granted);
                    return;
                } 

                // permission was denied and cannot be asked again
                setAllowForegroundLocationUse(false);
                return;
            } 
            
            //  request permission
            const res = await requestForegroundLocationPermission();
            setAllowForegroundLocationUse(res.status === MediaLibrary.PermissionStatus.GRANTED);
        }
        catch (error)
        {
            console.error('PermissionContextProvider: requestToAccessLocation', error);
            setAllowForegroundLocationUse(false);
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
    async function requestToEnableNotifications(): Promise<void> {
        try {
            const {status: existingStatus, canAskAgain} = await Notifications.getPermissionsAsync();

            // check if permission is already granted
            if (existingStatus === Notifications.PermissionStatus.GRANTED) {
                setAllowNotificationsUse(true);
                return;
            }

            // check if permission was denied and can be asked again
            if (
                (existingStatus === Notifications.PermissionStatus.DENIED && canAskAgain) ||
                existingStatus === Notifications.PermissionStatus.UNDETERMINED
            ) {
                const res = await Notifications.requestPermissionsAsync({
                    ios: {
                        allowAlert: true,
                        allowBadge: true,
                        allowSound: true,
                    }
                });
                setAllowNotificationsUse(res.status === Notifications.PermissionStatus.GRANTED);
                return;
            }

            // permission was denied and cannot be asked again
            setAllowNotificationsUse(false);

        } catch (error) {
            console.error('PermissionContextProvider: requestToEnableNotifications', error);
            setAllowNotificationsUse(false);
        }
    }

    return (
        <PermissionContext.Provider value={{
            allowMediaUse,
            requestToAccessPhotoLibrary,
            allowCameraUse,
            requestToAccessCamera,
            allowAudioUse,
            requestToAccessMic,
            allowForegroundLocationUse,
            requestAccessToForegroundLocation,
            allowBackgroundLocationUse,
            requestAccessToBackgroundLocation,
            allowNotificationsUse,
            requestToEnableNotifications,
        }}>
            {children}
        </PermissionContext.Provider>
    )
}

const usePermissionContext = () => useContext(PermissionContext);

export {PermissionContextProvider, usePermissionContext};