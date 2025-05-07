import {Text, View, TouchableOpacity} from 'react-native'
import CameraScreenOuterLayer from './CameraScreenOuterLayer'

export default function CameraNotReadySplashScreen({cameraReady, goBack}: {cameraReady: boolean, goBack: () => void}) {
  return !cameraReady && (
    <CameraScreenOuterLayer>
        <Text style={{
            color: '#000',
            fontSize: 14,
        }}>
            The camera is not ready to use for now
        </Text>
        <View style={{
            paddingTop: 40,
        }}>
            <TouchableOpacity
                onPress={goBack}
                accessibilityLabel="Tap me to close this"
                style={{
                    backgroundColor: '#000',
                    padding: 10,
                    borderRadius: 5,
                    paddingHorizontal: 20,
                }}
            ><Text style={{color:"#fff", fontWeight: "bold"}}>Close</Text></TouchableOpacity>
        </View>
    </CameraScreenOuterLayer>
  )
}
