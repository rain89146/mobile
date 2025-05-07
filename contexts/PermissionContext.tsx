import React, {createContext, useContext, useEffect, useRef, useState} from "react";
import { AppState, Platform } from "react-native";
import * as MediaLibrary from 'expo-media-library';
import * as Location from 'expo-location';
import { useCameraPermissions } from "expo-camera";

const PermissionContext = createContext(undefined);

const PermissionContextProvider = ({children}: {children: React.ReactNode}) => {

    const [allowCameraUse, setAllowCameraUse] = useState<boolean>(false);
    const [allowMediaUse, setAllowMediaUse] = useState<boolean>(false);
    const [allowAudioUse, setAllowAudioUse] = useState<boolean>(false);
    const [allowLocationUse, setAllowLocationUse] = useState<boolean>(false);
    const [allowNotificationsUse, setAllowNotificationsUse] = useState<boolean>(false);
    const [allowPushNotifications, setAllowPushNotifications] = useState<boolean>(false);
    const [allowBackgroundLocationUse, setAllowBackgroundLocationUse] = useState<boolean>(false);
    const [allowBackgroundAudioUse, setAllowBackgroundAudioUse] = useState<boolean>(false);

    const [permissionResponse, requestMediaPermission] = MediaLibrary.usePermissions();
    const [cameraPermission, requestCameraPermission] = useCameraPermissions();
    const [backgroundLocationPermission, requestBackgroundLocationPermission] = Location.useBackgroundPermissions();
    const [foregroundLocationPermission, requestForegroundLocationPermission] = Location.useForegroundPermissions();

    const appState = useRef(AppState.currentState);
    
    // 
    useEffect(() => {
        console.log('PermissionContextProvider mounted');

        return () => {
            console.log('PermissionContextProvider unmounted');
        };
    }, []);
    
    return (
        <PermissionContext.Provider value={undefined}>
            {children}
        </PermissionContext.Provider>
    )
}

const usePermissionContext = () => useContext(PermissionContext);

export {PermissionContextProvider, usePermissionContext};