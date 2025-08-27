import { useAuthContext } from '@/contexts/AuthenticationContext';
import { Redirect, useNavigation, useRouter } from 'expo-router';
import React, { useEffect } from 'react'
import { View, Text } from 'react-native'
import { SecondaryButton } from '@/components/ui/ActionButtons';
import { obsidian } from '@/constants/Colors';
import AntDesign from '@expo/vector-icons/AntDesign';
import { LandingBackground } from '@/components/background/LandingBackground';

export default function Index() 
{
    const navigation = useNavigation();
    const authContext = useAuthContext();
    const router = useRouter();
    
    // Set the header to be hidden
    useEffect(() => {
        navigation.setOptions({ headerShown: false })
    }, [navigation])

    //  check if the user is logged in
    if (
        authContext.authCredential && 
        authContext.authCredential.dopa.accessToken
    ) {
        return <Redirect href="/(protected)/(tabs)/(home)/home" />
    }

    return (
        <View style={{ flex: 1, backgroundColor: obsidian }}>
            <View style={{ 
                flex: 1, 
                flexDirection: 'column', 
                position: 'relative',
            }}>
                <LandingBackground />
                <View
                    style={{
                        marginTop: 'auto',
                        borderRadius: 30,
                        borderCurve: 'continuous',
                        overflow: 'hidden',
                    }}
                >
                    <View
                        style={{
                            padding: 30,
                            paddingVertical: 60,
                            backgroundColor: "#100b16f2",
                        }}
                    >
                        <View style={{
                            paddingBottom: 15,
                        }}>
                            <Text style={{
                                color: '#fff',
                                fontWeight: 'bold',
                                textTransform: 'uppercase',
                            }}>Dopa</Text>
                        </View>
                        <View style={{
                            justifyContent: 'center',
                        }}>
                            <Text style={{ fontSize: 40, fontWeight: 'bold', color: '#fff', paddingBottom: 0, fontFamily: 'PlayfairDisplay-Regular' }}>
                                Budget Smart.
                            </Text>
                            <Text style={{ fontSize: 32, fontWeight: 'bold', color: '#fff', fontFamily: 'PlayfairDisplay-Regular' }}>
                                Quickly. Feel the Rush.
                            </Text>
                        </View>
                        <View style={{
                            paddingTop: 20,
                        }}>
                            <Text style={{ fontSize: 16, color: '#f1ecf6', lineHeight: 24 }}>
                                Turn your money moves into dopamine boosts with Dopa.
                            </Text>
                        </View>
                        <View style={{
                            paddingTop: 25,
                        }}>
                            <SecondaryButton 
                                onPressEvent={() => router.push('/(login)/login')}
                                isLoading={false}
                                buttonLabel="Let's get started"
                                icon={<AntDesign name="arrowright" size={14} color="#fff" />}
                            />
                        </View>
                    </View>
                </View>
            </View>
        </View>
    )
}