import { useOnBoardingContext } from '@/contexts/OnBoardingContext';
import { usePermissionContext } from '@/contexts/PermissionContext';
import { useNavigation, useRouter } from 'expo-router';
import React, { useEffect } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'

export default function grantNotificationAccess() {

    const {
        onBoardingProgress,
        updateOnBoardingProgress,
    } = useOnBoardingContext();
    
    const {
        notificationPermission,
        allowNotificationsUse,
        requestToEnableNotifications,
    } = usePermissionContext();

    const navigation = useNavigation();
    const router = useRouter();

    useEffect(() => {
        navigation.setOptions({ 
            headerShown: false,
        });
    }, []);

    const goToNextScreen = () => router.replace('/(onboard)/addBankAccount');

    const skipNotificationAccess = async () => {
        try {
            console.log('user skip notification access');
            await updateOnBoardingProgress({step: 4, notification: null });
            
        } catch (error) {
            console.log("Error skipping notification access", error);
        }
        finally {
            goToNextScreen();
        }
    }

    const requestLocationAccess = async () => {
        try {
            const res = await requestToEnableNotifications();
            if (res)
            {
                await updateOnBoardingProgress({step: 4, notification: res.granted });
            }
        } catch (error) {
            console.log("Error requesting notification access", error);
        } 
        finally {
            goToNextScreen();
        }
    }

    const alreadyPermitted = async () => {
        try {
            console.log('user already permitted notification access');
            await updateOnBoardingProgress({step: 4, notification: true });
            
        } catch (error) {
            console.log("Error skipping notification access", error);
        }
        finally {
            goToNextScreen();
        }
    }
    
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <TouchableOpacity onPress={() => skipNotificationAccess()} style={{ position: 'absolute', top: 50, right: 20 }}>
                <Text style={{ fontSize: 18, color: '#007AFF' }}>Skip</Text>
            </TouchableOpacity>
            <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Enable Notification</Text>
            <Text>Enable Notification</Text>
            <Text>We need to access your location to provide you with the best experience.</Text>
            {
                allowNotificationsUse ? (
                    <TouchableOpacity onPress={async () => await alreadyPermitted()} style={{ marginTop: 20, padding: 10, backgroundColor: '#007AFF', borderRadius: 5 }}>
                        <Text style={{ color: '#FFFFFF' }}>Next</Text>
                    </TouchableOpacity>
                ) : notificationPermission === null ? (
                    <TouchableOpacity onPress={() => requestLocationAccess()} style={{ marginTop: 20, padding: 10, backgroundColor: '#007AFF', borderRadius: 5 }}>
                        <Text style={{ color: '#FFFFFF' }}>Enable Notification</Text>
                    </TouchableOpacity>
                ) : notificationPermission.granted === false ? (
                    <TouchableOpacity onPress={() => requestLocationAccess()} style={{ marginTop: 20, padding: 10, backgroundColor: '#007AFF', borderRadius: 5 }}>
                        <Text style={{ color: '#FFFFFF' }}>Enable Notification</Text>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity onPress={async () => await alreadyPermitted()} style={{ marginTop: 20, padding: 10, backgroundColor: '#007AFF', borderRadius: 5 }}>
                        <Text style={{ color: '#FFFFFF' }}>Next</Text>
                    </TouchableOpacity>
                )
            }
        </View>
    )
}
