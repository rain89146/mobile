import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import "../global.css"
import { GeneralContextProvider } from '@/contexts/GeneralContext';

import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet'
import { AuthContextProvider } from '@/contexts/AuthenticationContext';
import { PermissionContextProvider } from '@/contexts/PermissionContext';

import * as eva from '@eva-design/eva';
import { ApplicationProvider} from '@ui-kitten/components';
import { NetworkContextProvider } from '@/contexts/NetworkContext';
import React, { useEffect } from 'react';


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
		<ApplicationProvider {...eva} theme={eva.light}>
			<NetworkContextProvider>
				<GeneralContextProvider>
					<GestureHandlerRootView>
						<AuthContextProvider>
							<PermissionContextProvider>	
								<BottomSheetModalProvider>
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
								</BottomSheetModalProvider>
							</PermissionContextProvider>
						</AuthContextProvider>
					</GestureHandlerRootView>
				</GeneralContextProvider>
			</NetworkContextProvider>
		</ApplicationProvider>
	);
}
