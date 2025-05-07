import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { View, TouchableOpacity, GestureResponderEvent } from "react-native";

export default function CameraShutterInterface ({
    isRecording,
    cameraReady,
    pressInHandle, 
    pressOutHandle, 
    openScanner,
    closeScanner,
    isScanning,
}: {
    isRecording: boolean,
    cameraReady: boolean, 
    pressInHandle: (e: GestureResponderEvent) => void, 
    pressOutHandle: (e: GestureResponderEvent) => void,
    openScanner: () => void,
    closeScanner: () => void,
    isScanning: boolean,
}) {
    return (
        <View style={{
            width: '100%',
            height: 'auto',
            position: 'absolute',
            bottom: 40,
            zIndex: 2,
        }}>
            <View style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                position: 'relative',
            }}>{
                !isScanning &&
                <TouchableOpacity disabled={!cameraReady} onPressIn={pressInHandle} onPressOut={pressOutHandle}>
                    <View style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: 100,
                        borderWidth: 4,
                        borderColor: '#fff',
                        opacity: 0.9
                    }}>
                        <View style={{
                            margin: 8,
                            width: 65,
                            height: 65,
                            borderRadius: 100,
                            backgroundColor: '#fff',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                            <Ionicons size={38} name='camera' color='#484848' />
                        </View>
                    </View>
                </TouchableOpacity>
            }
            {
                !isRecording && <View
                    style={{
                        position: 'absolute',
                        right: 20,
                        bottom: -20,
                    }}
                >
                    <TouchableOpacity onPress={isScanning ? closeScanner : openScanner} style={{
                    }}>
                        <View style={{
                            width: 65,
                            height: 65,
                            borderRadius: 100,
                            backgroundColor: '#00000078',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                            <Ionicons name="qr-code-outline" size={30} color="#fff" />
                        </View>
                    </TouchableOpacity>
                </View>
            }
            </View>
        </View>
    )
}