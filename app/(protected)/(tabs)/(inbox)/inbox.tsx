import React, { useEffect, useState } from 'react'
import { View, Text, Button } from 'react-native'
import { useRouter } from 'expo-router';
import { AnimatedNumbers } from '@/components/ui/AnimatedNumbers';

export default function inbox() {
	const router = useRouter();
	
	return (
		<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
			<Text>Inbox</Text>
			<View>
				<AnimatedNumbers 
					value={516879.45} 
					enableCompactNotation={true}
					textStyle={{
						fontSize: 30,
						color: '#000',
						fontWeight: 'bold',
					}} 
				/>
			</View>
			<Button
				title="Go to Camera"
				onPress={() => {
					router.navigate('/(protected)/(camera)/cameraModal')
				}}
				color="#841584"
				accessibilityLabel="Tap me to go to camera"
			/>
		</View>
	)
}