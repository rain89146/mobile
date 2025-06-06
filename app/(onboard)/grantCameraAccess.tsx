import { useOnBoardingContext } from '@/contexts/OnBoardingContext';
import { usePermissionContext } from '@/contexts/PermissionContext';
import { useNavigation, useRouter } from 'expo-router';
import React, { useEffect } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'

export default function GrantCameraAccess() {
    
    const {
        updateOnBoardingProgress,
    } = useOnBoardingContext();
    
    const {
        cameraPermission,
        allowCameraUse,
        requestToAccessCamera,
    } = usePermissionContext();

    const navigation = useNavigation();
    const router = useRouter();

    useEffect(() => {
        navigation.setOptions({ 
            headerShown: false,
        });
    }, [navigation]);

    const goToNextScreen = () => router.replace('/(onboard)/grantLocationAccess');

    const requestCameraAccess = async () => {
        try {
            const res = await requestToAccessCamera();
            if (res)
            {
                console.log("Camera access has: ", res.granted);
                await updateOnBoardingProgress({step: 2, camera: res.granted });
            }
        } catch (error) {
            console.log("Error requesting camera access", error);
        } 
        finally {
            goToNextScreen();
        }
    }

    const skipCameraAccess = async () => {
        try {
            console.log('user skip camera access');
            await updateOnBoardingProgress({step: 2, camera: null });
            
        } catch (error) {
            console.log("Error skipping camera access", error);
        }
        finally {
            goToNextScreen();
        }
    }

    const alreadyPermitted = async () => {
        try {
            console.log('user already permitted camera access');
            await updateOnBoardingProgress({step: 2, camera: true });
        } catch (error) {
            console.log("Error skipping camera access", error);
        }
        finally {
            goToNextScreen();
        }
    }

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <TouchableOpacity onPress={() => skipCameraAccess()} style={{ position: 'absolute', top: 50, right: 20 }}>
                <Text style={{ fontSize: 18, color: '#007AFF' }}>Skip</Text>
            </TouchableOpacity>
            <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Camera Access</Text>
            <Text>Grant Camera Access</Text>
            <Text>We need to access your camera to provide you with the best experience.</Text>
            <View style={{ marginTop: 20, padding: 10, backgroundColor: '#007AFF', borderRadius: 5 }}>
                {
                    allowCameraUse === true ? (
                        <TouchableOpacity onPress={async () => alreadyPermitted()}>
                            <Text style={{ color: '#FFFFFF' }}>Next</Text>
                        </TouchableOpacity>
                    ) : cameraPermission === null ? (
                        <TouchableOpacity onPress={() => requestCameraAccess()}>
                            <Text style={{ color: '#FFFFFF' }}>Request Camera Access</Text>
                        </TouchableOpacity>
                    ) : cameraPermission.granted === false ? (
                        <TouchableOpacity onPress={() => requestCameraAccess()}>
                            <Text style={{ color: '#FFFFFF' }}>Request Camera Access</Text>
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity onPress={async () => await alreadyPermitted()}>
                            <Text style={{ color: '#FFFFFF' }}>Next</Text>
                        </TouchableOpacity>
                    )
                }
            </View>
        </View>
    )
}
