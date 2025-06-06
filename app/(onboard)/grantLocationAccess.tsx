import { useOnBoardingContext } from '@/contexts/OnBoardingContext';
import { usePermissionContext } from '@/contexts/PermissionContext';
import { useNavigation, useRouter } from 'expo-router';
import React, { useEffect } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'

export default function GrantLocationAccess() {

    const {
        onBoardingProgress,
        updateOnBoardingProgress,
    } = useOnBoardingContext();
    console.log(onBoardingProgress)
    const {
        foregroundLocationPermission,
        allowForegroundLocationUse,
        requestAccessToForegroundLocation,
    } = usePermissionContext();

    const navigation = useNavigation();
    const router = useRouter();

    useEffect(() => {
        navigation.setOptions({ 
            headerShown: false,
        });
    }, [navigation]);

    const goToNextScreen = () => router.replace('/(onboard)/grantNotificationAccess');

    const skipLocationAccess = async () => {
        try {
            console.log('user skip location access');
            await updateOnBoardingProgress({step: 3, location: null });
            
        } catch (error) {
            console.log("Error skipping location access", error);
        }
        finally {
            goToNextScreen();
        }
    }

    const requestLocationAccess = async () => {
        try {
            const res = await requestAccessToForegroundLocation();
            if (res)
            {
                await updateOnBoardingProgress({step: 3, location: res.granted });
            }
        } catch (error) {
            console.log("Error requesting location access", error);
        } 
        finally {
            goToNextScreen();
        }
    }

    const alreadyPermitted = async () => {
        try {
            console.log('user already permitted location access');
            await updateOnBoardingProgress({step: 3, location: true });
        } catch (error) {
            console.log("Error already permitted location access", error);
        }
        finally {
            goToNextScreen();
        }
    }
    
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <TouchableOpacity onPress={() => skipLocationAccess()} style={{ position: 'absolute', top: 50, right: 20 }}>
                <Text style={{ fontSize: 18, color: '#007AFF' }}>Skip</Text>
            </TouchableOpacity>
            <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Location Access</Text>
            <Text>Grant Location Access</Text>
            <Text>We need to access your location to provide you with the best experience.</Text>
            {
                allowForegroundLocationUse ? (
                    <TouchableOpacity onPress={async () => await alreadyPermitted()} style={{ marginTop: 20, padding: 10, backgroundColor: '#007AFF', borderRadius: 5 }}>
                        <Text style={{ color: '#FFFFFF' }}>Next</Text>
                    </TouchableOpacity>
                ) : foregroundLocationPermission === null ? (
                    <TouchableOpacity onPress={() => requestLocationAccess()} style={{ marginTop: 20, padding: 10, backgroundColor: '#007AFF', borderRadius: 5 }}>
                        <Text style={{ color: '#FFFFFF' }}>Request Location Access</Text>
                    </TouchableOpacity>
                ) : foregroundLocationPermission.granted === false ? (
                    <TouchableOpacity onPress={() => requestLocationAccess()} style={{ marginTop: 20, padding: 10, backgroundColor: '#007AFF', borderRadius: 5 }}>
                        <Text style={{ color: '#FFFFFF' }}>Request Location Access</Text>
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
