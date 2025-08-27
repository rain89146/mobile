import { RegInputKitty } from '@/components/form/input/InputKitty';
import { ActionButton, BackButton } from '@/components/ui/ActionButtons';
import { TitleAndRemark } from '@/components/ui/ContentComp';
import { usePasswordResetContext } from '@/contexts/PasswordResetContext';
import useToastHook from '@/hooks/useToastHook';
import { AuthService } from '@/services/AuthService';
import { Helpers } from '@/utils/helpers';
import Feather from '@expo/vector-icons/Feather';
import { useNavigation, useRouter } from 'expo-router';
import React, {useEffect, useState} from 'react'
import { View, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView } from 'react-native'

class EmailError extends Error {
    constructor(message: string) {
        super(message);
        this.name = this.constructor.name;
    }
}

export default function ForgotPassword() 
{
    const navigation = useNavigation();
    const router = useRouter();
    const passwordContext = usePasswordResetContext();
    const { showToast, hideToast } = useToastHook();

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [email, setEmail] = useState<string>('');
    const [emailError, setEmailError] = useState<string|null>(null);

    useEffect(() => {
        navigation.setOptions({ headerShown: false })
    }, [navigation])

    //  cleanup when the component unmounts
    useEffect(() => {
        return () => {
            setIsLoading(false);
            setEmail('');
            setEmailError(null);
        }
    }, [])

    const sendPasswordResetRequest = async (): Promise<void> => {
        setEmailError(null);
        setIsLoading(true);
        
        try {
            //  trim the email input
            const trimmedEmail = email.trim();

            // validation
            if (!trimmedEmail) throw new EmailError('Email is required');
            if (!Helpers.validateEmail(trimmedEmail)) throw new EmailError('Invalid email address');

            //  send password reset request
            const apiResponse = await AuthService.sendPasswordResetRequest(trimmedEmail);

            //  check if the response is successful
            if (!apiResponse.status)
            {
                const {message, exception} = apiResponse;
                const error = new Error(message || 'An error occurred while sending the password reset request');
                error.name = exception;
                throw error;
            }

            //  provide feedback to the user
            Helpers.impactSoftFeedback();

            //  store the email in the context
            passwordContext.setEmail(trimmedEmail);

            //  redirect to the confirmation screen
            router.replace('/(login)/(password)/emailConfirmation');
        } 
        catch (error: Error|any) 
        {
            console.log('ForgotPassword: sendPasswordResetRequest: error: ', error);

            // provide feedback to user
            Helpers.notificationErrorFeedback();

            //  default error message
            let defaultErrorMessage = 'We were unable to send the password reset request. Please try again later.';

            //
            if (error instanceof EmailError) 
            {
                //  show email error message
                if (error.name === 'EmailError') 
                {
                    setEmailError(error.message);
                    return;
                }

                defaultErrorMessage = error.message;
            }
            
            // 
            showToast({
                type: 'error',
                text1: 'Oops! Something went wrong',
                text2: defaultErrorMessage,
                position: 'bottom',
                onPress: () => hideToast()
            });
        } 
        finally 
        {
            setIsLoading(false);
        }
    }
    
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
            >
                <ScrollView
                    contentContainerStyle={{flexGrow: 1}}
                    keyboardShouldPersistTaps="handled"
                >
                    <View style={{ flex: 1, padding: 35 }}>
                        <View style={{
                            width: 'auto',
                            position: 'relative',
                            paddingBottom: 80,
                        }}>
                            <BackButton 
                                label={'Back'}
                                onPressEvent={() => router.back()}
                            />
                        </View>
                        <View style={{width: '100%'}}>
                            <TitleAndRemark 
                                title={'Forgot Password'}
                                remark={'Please enter your email address to reset your password. We will send you a link to reset your password.'}
                            />
                            <View style={{ marginBottom: 18 }}>
                                <RegInputKitty
                                    value={email} 
                                    onChangeText={setEmail} 
                                    label={'Email'} 
                                    placeholder={'Enter your email address'} 
                                    disabled={isLoading}
                                    iconLeft={<Feather name='mail' size={14} color="#bcbcbc" />}
                                    onFocusEvent={() => setEmailError(null)}
                                    error={emailError}
                                />
                            </View>
                            <View>
                                <ActionButton 
                                    isLoading={isLoading}
                                    buttonLabel={'Continue'}
                                    onPressEvent={sendPasswordResetRequest}
                                />
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}
