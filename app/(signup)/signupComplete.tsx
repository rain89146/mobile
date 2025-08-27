import React from 'react'
import { ActionButton } from '@/components/ui/ActionButtons'
import { TitleAndRemark } from '@/components/ui/ContentComp'
import { DopaAuthResponse, useAuthContext } from '@/contexts/AuthenticationContext';
import { useSignupContext } from '@/contexts/SignupContext';
import { Helpers } from '@/utils/helpers';
import { useNavigation, useRouter } from 'expo-router';
import { Alert, SafeAreaView, View } from 'react-native'
import { SignupService } from '@/services/SignupService';

class MissingRecordIdError extends Error {
    constructor(message?: string) {
        super(message);
        this.name = this.constructor.name;
        this.message = (message) ? message : 'Record ID is required';
    }
}

export default function SignupComplete() 
{
    //  hooks
    const authContext = useAuthContext();
    const signupContext = useSignupContext();
    const navigation = useNavigation();
    const router = useRouter();

    //  local states
    const [isLoading, setIsLoading] = React.useState(false);

    // set the header to false
    React.useEffect(() => {
        navigation.setOptions({ headerShown: false })
    }, [navigation]);

    /**
     * Complete account sign up
     * @param recordId Record ID to complete sign up
     * @returns {Promise<string>}
     */
    async function completeAccountSignUp(recordId: string): Promise<string>
    {
        try {
            //  check if record id is available
            if (!recordId) throw new MissingRecordIdError();

            //  call the signup service to complete the sign up process
            const apiResponse = await SignupService.completeSignUp(recordId);
            
            //  check if complete sign up response is successful
            if (!apiResponse.status)
            {
                const { message, exception } = apiResponse;
                const error = new Error(message || 'Failed to complete sign up');
                error.name = exception || 'UnknownError';
                throw error;
            }
            //  get user id from the response
            return apiResponse.response;

        } catch (error) {
            console.error("SignupComplete: completeAccountSignUp: error:", error);
            throw error;
        }
    }

    /**
     * Systematic login
     * @param userId User ID to log in
     * @description This function is called to log the user in after the sign up process is complete.
     * It will call the systematic login service with the user ID and return the login response
     * @returns {Promise<DopaAuthResponse>}
     */
    async function systematicLogin(userId: string): Promise<DopaAuthResponse>
    {
        try {
            //  call the login service to log the user in
            const apiResponse = await SignupService.systematicLogin(userId);

            //  check if login response is successful
            if (!apiResponse.status) 
            {
                const { message, exception } = apiResponse;
                const error = new Error(message || 'Failed to log in');
                error.name = exception || 'UnknownError';
                throw error;
            }

            //  return the login response
            return apiResponse.response;

        } catch (error) {
            console.error("SignupComplete: systematicLogin: error:", error);
            throw error;
        }
    }

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
            if (!recordId) throw new MissingRecordIdError();

            //  get user id from the response
            const userId = await completeAccountSignUp(recordId);

            //  login the user with the user id
            const loginResponse = await systematicLogin(userId);

            //  set the auth credentials
            await authContext.StoreAuthCred({
                authProvider: 'email',
                userId,
                dopa: {
                    accessToken: loginResponse.accessToken,
                    refreshToken: loginResponse.refreshToken
                },
                plaidUserToken: loginResponse.plaidUserToken
            });

            //  provide feedback to the user
            Helpers.impactSoftFeedback();

            //  start the onboarding process
            router.replace('/(protected)/(tabs)/(home)/home');    
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
