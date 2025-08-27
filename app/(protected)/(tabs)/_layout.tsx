import { router, Tabs, useNavigation } from 'expo-router';
import React, { useEffect } from 'react';
import { HapticTab } from '@/components/HapticTab';
import { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';
import FloatingTabBar from '@/components/customTabBar/FloatingTabBar';

export default function TabLayout() 
{
	const navigation = useNavigation();

	// hide the header for this layout
	useEffect(() => {
		navigation.setOptions({ headerShown: false });
	}, [navigation]);

	// open the chat in modal
	const handleChatPress = () => router.push('/(protected)/(tabs)/(chat)/chat');
	
	return (
		<Tabs
			tabBar={props => <FloatingTabBar {...props} onChatPress={handleChatPress} />}
			screenOptions={{
				headerShown: false,
				tabBarButton: HapticTab,
				animation: 'none',
			} as BottomTabNavigationOptions}
		>
			<Tabs.Screen
				name="(home)"
				options={{ title: 'home' }}
			/>
			<Tabs.Screen
				name="(explore)"
				options={{ title: 'goals' }}
			/>
			<Tabs.Screen
				name="(inbox)"
				options={{ title: 'reports' }}
			/>
			<Tabs.Screen
				name="(account)"
				options={{ title: 'mine' }}
			/>
		</Tabs>
	);
}