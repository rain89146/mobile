import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import "../global.css"
import { GeneralContextProvider } from '@/contexts/GeneralContext';

import Toast from 'react-native-toast-message';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet'
import { CameraContextProvider } from '@/contexts/CameraContext';
import { AuthContextProvider } from '@/contexts/AuthenticationContext';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
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
		<GeneralContextProvider>
			<GestureHandlerRootView>
				<AuthContextProvider>
					<BottomSheetModalProvider>
						<ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
							<Stack>
								<Stack.Screen 
									name="index" 
									options={{ headerShown: false }}
								/>
							</Stack>
						</ThemeProvider>
					</BottomSheetModalProvider>
				</AuthContextProvider>
			</GestureHandlerRootView>
		</GeneralContextProvider>
	);
}
