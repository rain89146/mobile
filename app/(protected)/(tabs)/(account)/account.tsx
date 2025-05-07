import useToastHook from '@/hooks/useToastHook';
import React from 'react'
import { View, Text, Button, TouchableOpacity } from 'react-native'
import { Link, useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useAuthContext } from '@/contexts/AuthenticationContext';
import { NavigationOptions } from 'expo-router/build/global-state/routing';

export default function account() {

	const {showToast, hideToast} = useToastHook();
	const router = useRouter();
	const authContext = useAuthContext();


	const openModal = () => {
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
		// router.navigate('/(modals)/settingModal');
		router.push({
			pathname: '/(protected)/(camera)/cameraPreview',
			params: { 
				photo: 'https://images.unsplash.com/photo-1726064855881-3bbb7000b29f?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
			}
		})
	}

	const signOut = async () => {
		await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
		await authContext?.signOutWithApple();
		router.replace('/');
	}
  
	return (
		<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
			<Text>
				Account
			</Text>
			<View>
				<View>
					<Link href={'/account/setting'} asChild>
						<Text>Setting</Text>
					</Link>
				</View>
				<View>
					<Link href={'/account/profile'} asChild>
						<Text>Profile</Text>
					</Link>
				</View>
				<TouchableOpacity
					onPress={openModal}>
					<Text>Open modal</Text>
				</TouchableOpacity>
				<TouchableOpacity
					onPress={() => signOut()}
					style={{
						backgroundColor: '#000',
						padding: 10,
						borderRadius: 5,
						marginTop: 10
					}}>
					<Text style={{ color: '#fff' }}>Sign out</Text>
				</TouchableOpacity>
			</View>
			<Button
				title="Go to Home"
				onPress={() => {
					showToast({
						type: 'info',
						text1: 'Hello',
						text2: `Let's go to home 👋`,
						position: 'bottom',
						onPress: () => {
							hideToast()
						}
					})
				}}
				color="#841584"
				accessibilityLabel="Tap me to go to home"
			/>
		</View>
	)
}
