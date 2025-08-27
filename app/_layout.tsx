import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import {
	PlayfairDisplay_400Regular,
	PlayfairDisplay_700Bold,
	PlayfairDisplay_900Black,
  	useFonts as usePlayfairDisplayFonts,
} from '@expo-google-fonts/playfair-display'
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import "../global.css"

import * as eva from '@eva-design/eva';
import { ApplicationProvider} from '@ui-kitten/components';
import React, { useEffect } from 'react';
import Providers from '@/components/layout/Providers';


// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
	'PlayfairDisplay-Regular': PlayfairDisplay_400Regular,
	'PlayfairDisplay-Bold': PlayfairDisplay_700Bold,
	'PlayfairDisplay-Black': PlayfairDisplay_900Black,
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

	return (
		<ApplicationProvider {...eva} theme={eva.light}>
			<Providers>
				<ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
					<Stack>
						<Stack.Screen 
							name='(protected)'
							options={{
								headerShown: false,
								animation: 'none'
							}}
						/>
						<Stack.Screen 
							name='index'
							options={{
								headerShown: false,
								animation: 'none'
							}}
						/>
					</Stack>
				</ThemeProvider>
			</Providers>
		</ApplicationProvider>
	);
}
