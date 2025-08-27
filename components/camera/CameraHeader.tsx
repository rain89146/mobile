import Ionicons from "@expo/vector-icons/Ionicons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import { View, TouchableOpacity, Text } from "react-native";
import { PulseIndicator } from "react-native-indicators";

export default function CameraHeader ({
    isRolling, 
    flashMode, 
    goBack, 
    switchFlashMode
}: {
    isRolling: boolean, 
    flashMode: 'off'|'auto'|'on', 
    goBack: () => void, 
    switchFlashMode: () => void
}) {

    const [stopWatch, setStopWatch] = useState<string>("00:00");

    // record the time of recording
    useEffect(() => {
        if (isRolling) {
            const interval = setInterval(() => {
                setStopWatch((prevTime) => {
                    const [minutes, seconds] = prevTime.split(':').map(Number);
                    let newSeconds = seconds + 1;
                    let newMinutes = minutes;

                    if (newSeconds >= 60) {
                        newSeconds = 0;
                        newMinutes += 1;
                    }
                    return `${String(newMinutes).padStart(2, '0')}:${String(newSeconds).padStart(2, '0')}`;
                });
            }, 1000);
            return () => clearInterval(interval);
        }else {
            setStopWatch("00:00");
        }
    }, [isRolling]);

    return (
        <LinearGradient
            colors={['rgba(0,0,0,0.7)', 'transparent']}
            style={{
                width: '100%',
                height: 'auto',
                position: 'absolute',
                zIndex: 5,
                borderTopLeftRadius: 30,
                borderTopRightRadius: 30,
                paddingTop: 20,
                paddingBottom: 20,
            }}
        >
            <View style={{
                width: '100%',
                height: '100%',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                paddingLeft: 20,
                paddingRight: 20,
                zIndex: 1,
            }}>
                <TouchableOpacity onPress={goBack}>
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 6
                    }}>
                        <Ionicons name="arrow-back" size={24} color="#fff" />
                        <Text style={{ color: '#efefef', fontSize: 16, fontWeight:'500' }}>Back</Text>
                    </View>
                </TouchableOpacity>
                <View style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginLeft: 'auto',
                }}>
                    {isRolling && (
                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                            gap: 12,
                        }}>
                            <PulseIndicator color='red' size={20} key={1}/>
                            <Text style={{
                                color: '#fff',
                                fontSize: 15,
                                fontWeight:'500',
                                textTransform: 'uppercase',
                                opacity: 0.8,
                            }}>{stopWatch}</Text>
                        </View>
                    )}
                </View>
                <TouchableOpacity onPress={switchFlashMode} style={{marginLeft: 'auto'}}>
                    <View
                        style={{
                            borderRadius: 100,
                            padding: 8,
                            paddingHorizontal: 22,
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 8,
                            borderColor: '#fff',
                            borderWidth: 1,
                        }}
                    >
                        <Ionicons size={15} name={
                            flashMode === 'off' ? 'flash-off' :
                            flashMode === 'on' ? 'flash' : 'flash-outline'
                        } color='#fff' />
                        <Text style={{ color: '#fff', fontSize: 16, fontWeight:'500' }}>
                        {
                            flashMode === 'off' ? 'Off' :
                            flashMode === 'on' ? 'On' : 'Auto'
                        }
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>
        </LinearGradient>
    )
}