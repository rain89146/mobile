import { Tabs, useNavigation } from 'expo-router';
import React, { useEffect } from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';

export default function TabLayout() {
	const navigation = useNavigation();
	const colorScheme = useColorScheme();

	useEffect(() => {
		navigation.setOptions({ headerShown: false });
	}, [navigation]);

	return (
		<Tabs
			screenOptions={{
				tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
				headerShown: false,
				tabBarButton: HapticTab,
				tabBarBackground: TabBarBackground,
				tabBarStyle: Platform.select({
					ios: {
						// Use a transparent background on iOS to show the blur effect
						position: 'absolute',
					},
					default: {},
				}),
				animation: 'shift',
			} as BottomTabNavigationOptions}>
			<Tabs.Screen
				name="(home)"
				options={{
				title: 'Home',
				tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
				}}
			/>
			<Tabs.Screen
				name="(explore)"
				options={{
				title: 'Explore',
				tabBarIcon: ({ color }) => <IconSymbol size={28} name="paperplane.fill" color={color} />,
				}}
			/>
			<Tabs.Screen
				name="(inbox)"
				options={{
				title: 'Inbox',
				tabBarIcon: ({ color }) => <IconSymbol size={28} name="envelope.fill" color={color} />,
				}}
			/>
			<Tabs.Screen
				name="(account)"
				options={{
				title: 'account',
				tabBarIcon: ({ color }) => <IconSymbol size={28} name="gearshape.fill" color={color} />,
				}}
			/>
		</Tabs>
	);
}
