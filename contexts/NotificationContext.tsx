import React, {createContext, useContext, useEffect, useRef, useState} from "react";
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { usePermissionContext } from "./PermissionContext";
import Constants from 'expo-constants';
import useAsyncStorageHook from "@/hooks/useAsyncStorageHook";

export type NotificationContextType = {
    expoPushToken: string|null;
    notification: Notifications.Notification | undefined;
    sendNotification: (message: Notifications.NotificationContentInput) => Promise<string|null>;
}

const NotificationContext = createContext<NotificationContextType>({
    expoPushToken: null,
    notification: undefined,
    sendNotification: async () => null
});

const NOTIFICATION_KEY = "@notificationKey";

const NotificationContextProvider = ({children}: {children: React.ReactNode}) => {
    
    //  get the permission context
    const {allowNotificationsUse, requestToEnableNotifications} = usePermissionContext();

    //  storage
    const {storeDataIntoStorage, getDataFromStorage} = useAsyncStorageHook();
    
    //  local notification state
    const [expoPushToken, setExpoPushToken] = useState<string|null>(null);
    const [notification, setNotification] = useState<Notifications.Notification | undefined>(undefined);
    const notificationListener = useRef<Notifications.EventSubscription>();
    const responseListener = useRef<Notifications.EventSubscription>();
    
    // 
    useEffect(() => {

        //  register the device for push notifications 
        _registerForPushNotificationsAsync()
        .then((token: string | null) => token && setExpoPushToken(token))
        .catch((error: Error) => console.error('Error registering for push notifications:', error));

        //  listen for notifications
        notificationListener.current = Notifications.addNotificationReceivedListener(
            (notification: Notifications.Notification) => {
                console.log(notification);
                setNotification(notification);
            }
        )

        //  listen for notification responses
        responseListener.current = Notifications.addNotificationResponseReceivedListener(
            (response: Notifications.NotificationResponse) => {
                console.log(response);
            }
        );

        return () => {

            // Clean up the notification listeners
            notificationListener.current &&
                Notifications.removeNotificationSubscription(notificationListener.current);

            // Clean up the response listeners
            responseListener.current &&
                Notifications.removeNotificationSubscription(responseListener.current);
        };
    }, []);

    /**
     * Registers the device for push notifications and returns the token
     * @returns {Promise<string|null>} - The push notification token or null if an error occurred
     */
    const _registerForPushNotificationsAsync = async (): Promise<string|null> => {
        try {
            
            if (!Device.isDevice) throw new Error('Must use physical device for Push Notifications'); 
            
            //  check for permissions
            if (!allowNotificationsUse) await requestToEnableNotifications();

            //  check if the token is already stored
            const storedToken = await getDataFromStorage<string>(NOTIFICATION_KEY);

            //  get project id
            const projectId = Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
            if (!projectId) throw new Error('Project ID not found');

            //  get the token
            const notificationTokenObj: Notifications.ExpoPushToken = await Notifications.getExpoPushTokenAsync({ projectId: projectId });
            if (!notificationTokenObj) throw new Error('Token not found');

            //  return the token
            const token = notificationTokenObj.data;

            //  store the token in the storage
            if (token && token !== storedToken) await storeDataIntoStorage<string>(NOTIFICATION_KEY, token);
            
            //  return the token
            return token;

        } catch (error) {
            console.error('Error getting push token:', error);
            return null;
        }
    }

    /**
     * Sends a local notification
     * @param message - The message to send
     * @returns {Promise<string|null>} - The notification ID or null if an error occurred
     */
    const sendNotification = async (message: Notifications.NotificationContentInput): Promise<string|null> => {
        try {
            const request: Notifications.NotificationRequestInput = {
                content: {
                    title: message.title,
                    body: message.body,
                    data: message.data,
                },
                trigger: null
            }
            const id = await Notifications.scheduleNotificationAsync(request);
            return id;
        } catch (error) {
            console.error('NotificationContextProvider: sendNotification:', error);
            return null;
        }
    }

    return (
        <NotificationContext.Provider value={{
            expoPushToken,
            notification,
            sendNotification
        }}>
            {children}
        </NotificationContext.Provider>
    )
}

const useNotificationContext = () => useContext(NotificationContext);

export {NotificationContextProvider, useNotificationContext};