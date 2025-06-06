import CameraComp from '@/components/camera/CameraComp';
import { SafeAreaView } from 'react-native';

export default function cameraModal() {
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <CameraComp />
        </SafeAreaView>
    )
}
