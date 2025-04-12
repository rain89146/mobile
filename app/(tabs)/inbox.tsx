import React, { useState } from 'react'
import { View, Text, Button } from 'react-native'
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';

export default function inbox() {

	const [facing, setFacing] = React.useState('front');
	const [permission, requestPermission] = useCameraPermissions();

	if (!permission) {
		return <View />;
	}

	if (!permission.granted) {
		return (
			<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
				<Text>Permission to access camera is required</Text>
				<Button 
					title="Grant Permission"
					onPress={requestPermission}
					color="#841584"
					accessibilityLabel="Tap me to grant permission"
				/>
			</View>
		);
	}
	console.log(permission)

	return (
		<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
			<Text>
				inbox
			</Text>
		</View>
	)
}
