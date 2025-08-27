import React from 'react'
import { View, Text, Button, ScrollView } from 'react-native'
import { useRouter } from 'expo-router';
import { AnimatedNumbers } from '@/components/ui/AnimatedNumbers';
import { DarkTitleAndRemark } from '@/components/ui/ContentComp';
import { primaryBackground } from '@/constants/Colors';

export default function Inbox() {
	const router = useRouter();
	
	return (
		<View style={{ flex: 1, paddingHorizontal: 25, backgroundColor: primaryBackground }}>
			<ScrollView
				contentContainerStyle={{flexGrow: 1}}
				bounces={true}
				fadingEdgeLength={50}
				showsVerticalScrollIndicator={false}
			>
				<View style={{ flex: 1, paddingTop: 80, paddingBottom: 150 }}>
					<View style={{ flex: 1, flexDirection: 'column' }}>
						<DarkTitleAndRemark 
							title={`Financial reports and insights.`}
							remark={'View your all financial reports, insights, and analytics here.'}
						/>
					</View>
				</View>
			</ScrollView>
			{/* <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
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
			</View> */}
		</View>
	)
}