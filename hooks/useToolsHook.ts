import { useNavigation } from "expo-router";
import * as Haptics from 'expo-haptics';
import { Linking, Platform } from "react-native";
import * as IntentLauncher from 'expo-intent-launcher'

export default function useToolsHook() {

    const navigation = useNavigation();

    /**
     * takes the user to the system settings
     * @returns {void}
     */
    function goToSetting(): void {
        //  Check if the app is running on iOS
        if (Platform.OS === 'ios') 
        {
            Linking.openURL("App-prefs:root=General");
            return;
        }

        //  Check if the app is running on Android
        if (Platform.OS === 'android') 
        {
            IntentLauncher.startActivityAsync(
                IntentLauncher.ActivityAction.APPLICATION_DETAILS_SETTINGS,
                {
                    data: 'package:' + 'com.your_app.package', // replace with your app's package name
                }
            ).catch((error) => {
                console.error('Error opening settings:', error);
            })
        }
    }

    /**
     * Back to the previous screen
     * @returns {Promise<void>}
     */
    async function goBack (): Promise<void> {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);    
        navigation.goBack();
    }

    return {
        goToSetting,
        goBack
    }
}
