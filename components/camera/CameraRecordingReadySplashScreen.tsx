import React, {useEffect} from 'react'
import { View, Text } from 'react-native';
import useAlertSoundHook from '@/hooks/useAlertSoundHook';

export default function CameraRecordingReadySplashScreen({preparingForRecording}: {preparingForRecording: boolean}) {
    const [counter, setCounter] = React.useState(3);
    const {beepSound} = useAlertSoundHook();
    
    
    //  give a user time to prepare for recording
    useEffect(() => {
        if (preparingForRecording) {
            const interval = setInterval(async () => {
                beepSound();
                setCounter((prevCounter) => {
                    if (prevCounter === 1) {
                        clearInterval(interval);
                        return 0;
                    }
                    return prevCounter - 1;
                });
            }, 1000);
            return () => clearInterval(interval);
        }
        setCounter(3);
    }, [preparingForRecording, beepSound]);
    
    return (
        <View style={{
            position: 'absolute',
            opacity: preparingForRecording ? 1 : 0,
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1,
            borderRadius: 30,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
        }}>
            <View style={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
            }}>
                <Text style={{color: '#fff', fontSize: 15}}>Get Ready in</Text>
                <Text style={{color: '#fff', fontSize: 80, fontWeight: 'bold'}}>
                    {counter === 0 ? 'Go!' : counter}
                </Text>
            </View>
        </View>
    )
}
