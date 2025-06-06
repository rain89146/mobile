import { ActionButton } from '@/components/ui/ActionButtons'
import { TitleAndRemark } from '@/components/ui/ContentComp'
import { SessionKeys } from '@/constants/SessionKeys';
import { useSignupContext } from '@/contexts/SignupContext';
import useAsyncStorageHook from '@/hooks/useAsyncStorageHook';
import { Helpers } from '@/utils/helpers';
import { useNavigation, useRouter } from 'expo-router';
import React from 'react'
import { Alert, SafeAreaView, View } from 'react-native'

export default function SignupComplete() 
{
    //  hooks
    const signupContext = useSignupContext();
    const navigation = useNavigation();
    const router = useRouter();
    const {storeDataIntoStorage} = useAsyncStorageHook();
    
    //  local states
    const [isLoading, setIsLoading] = React.useState(false);

    // set the header to false
    React.useEffect(() => {
        navigation.setOptions({ headerShown: false })
    }, [navigation]);

    /**
     * Complete sign up
     * @description This function is called when the user clicks on the complete sign up button. It will log the user in with the recordId and navigate to the next screen.
     * @returns {Promise<void>}
     */
    const completeSignUp = async (): Promise<void> => {
        try {
            setIsLoading(true);

            //  pull the record id from the signup context
            const recordId = signupContext.signUpPayload?.recordId;

            //  check if record id is available
            if (!recordId) throw new Error('Record ID is required');

            //  login the user with the record id
            const loginResponse = await signupContext.loginWithRecordId(recordId);

            //  check if login response is successful
            if (!loginResponse.status) throw new Error(loginResponse.message);

            //  store the auth credentials in the storage
            await storeDataIntoStorage(SessionKeys.AUTH_STORAGE_KEY, loginResponse.response);

            //  provide feedback to the user
            Helpers.impactSoftFeedback();

            //  start the onboarding process
            router.replace('/(onboard)/grantCameraAccess');    
        } 
        catch (error: Error|any) 
        {
            console.log('Error completing sign up', error);

            //  provide feedback to the user
            Helpers.impactHeavyFeedback();

            //  show error message
            Alert.alert('Oops! Something went wrong', error.message);
        } 
        finally 
        {
            setIsLoading(false);
        }
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
            <View style={{ flex: 1, padding: 35 }}>
                <View style={{width: '100%'}}>
                    <TitleAndRemark 
                        title={'Thank you for signing up!'}
                        remark={'Your account has been created successfully. You are one step closer to unlock the financial freedom you deserve.'} 
                    />
                    <View>
                        <ActionButton 
                            onPressEvent={completeSignUp}
                            isLoading={isLoading}
                            buttonLabel={'Welcome aboard!'}
                        />
                    </View>
                </View>
            </View>
        </SafeAreaView>
    )
}
