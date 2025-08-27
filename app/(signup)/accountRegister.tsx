import { router, useNavigation } from 'expo-router';
import React from 'react'
import { View, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView } from 'react-native'
import { RegInputKitty } from '@/components/form/input/InputKitty';
import Feather from '@expo/vector-icons/Feather';
import { Helpers } from '@/utils/helpers';
import { useSignupContext } from '@/contexts/SignupContext';
import { ActionButton, BackButton } from '@/components/ui/ActionButtons';
import { SubContentComp, TitleAndRemark } from '@/components/ui/ContentComp';
import { ExternalLink } from '@/components/ExternalLink';
import { ThemedText } from '@/components/ThemedText';
import { SignupService } from '@/services/SignupService';
import useToastHook from '@/hooks/useToastHook';

class EmailError extends Error {
    constructor(message: string) {
        super(message);
        this.name = this.constructor.name;
    }
}

export default function AccountRegister() 
{
    //  hooks
    const signupContext = useSignupContext();
    const navigation = useNavigation();
    const { showToast, hideToast } = useToastHook();

    //  local states
    const [isLoading, setIsLoading] = React.useState(false);
    const [email, setEmail] = React.useState<string>('');
    const [emailError, setEmailError] = React.useState<string|null>(null);

    //  set the header to false
    React.useEffect(() => {
        navigation.setOptions({ headerShown: false })
    }, [navigation])

    /**
     * Generate a sign up record
     * @param email email address to generate sign up record for
     * @returns record id
     */
    const generateSignUpRecord = async (email: string): Promise<string> => {
        try {
            //  check if email is not empty
            if (!email) throw new EmailError('Email is required');

            // validation
            if (!Helpers.validateEmail(email)) throw new EmailError('Invalid email address');

            //  call the signup service to generate a sign up record
            const response = await SignupService.generateSignUpRecord(email);

            //  check if response is successful
            if (!response.status)
            {
                const {message, exception} = response;
                const error = new Error(message);
                error.name = exception || 'UnknownError';
                throw error;
            }

            //  return the record id
            return response.response;

        } catch (error) {
            console.log('AccountRegister: generateSignUpRecord: error:', error);
            throw error;
        }
    }

    /**
     * Send email verification code
     * @param email email address to send verification code to
     * @returns 
     */
    const sentEmailVerificationCode = async (email: string): Promise<boolean> => {
        try {
            
            //  check if email is not empty
            if (!email) throw new EmailError('Email is required');

            // validation
            if (!Helpers.validateEmail(email)) throw new EmailError('Invalid email address');

            //  call the signup service to send verification code
            const response = await SignupService.sendVerificationCode(email);

            //  check if response is successful
            if (!response.status)
            {
                const {message, exception} = response;
                const error = new Error(message);
                error.name = exception || 'UnknownError';
                throw error;
            }

            //  return the response
            return response.response;

        } catch (error) 
        {
            console.log('AccountRegister: sentEmailVerificationCode: error:', error);
            throw error;
        }
    }

    /**
     * Sign up with email
     * @returns {Promise<void>}
     */
    const signUpWithEmail = async (): Promise<void> => {
        setEmailError(null);
        setIsLoading(true);

        try {
            // get record id
            const recordId = await generateSignUpRecord(email);

            //  send verification code
            const hasSent = await sentEmailVerificationCode(email);

            //  check if the verification code is sent successfully
            if (!hasSent) throw new Error('Unable to send verification code. Please try again later.');
            
            //  set email in signup context
            signupContext.setSignUpPayload({...signupContext.signUpPayload, email, recordId });

            //  provide feedback to user
            Helpers.impactSoftFeedback();

            //  redirect to email confirmation page
            router.replace('/(signup)/emailConfirmation');
        } 
        catch (error: unknown) 
        {
            console.log('AccountRegister: signUpWithEmail: error:', error);

            // provide feedback to user
            Helpers.notificationErrorFeedback();

            //  default error message
            let defaultErrorMessage = 'We were unable to create your account. Please try again later.';

            // when error is email error
            if (error instanceof Error) 
            {
                if (error.name === 'EmailError') 
                {
                    setEmailError(error.message);
                    return;
                } 
                
                //  default error message
                defaultErrorMessage = error.message || defaultErrorMessage;
            }
            
            // for everything else
            showToast({
                type: 'error',
                text1: 'Oops! Something went wrong',
                text2: defaultErrorMessage,
                position: 'bottom',
                onPress: () => hideToast()
            })
        } 
        finally 
        {
            setIsLoading(false);
        }
    }

    /**
     * Handle the on blur event for the email input field
     * @param e 
     */
    const onBlurEvent = (e: any) => {
        if (email) {
            const err = Helpers.validateEmail(email) ? null : 'Invalid email address';
            setEmailError(err)
        } else {
            setEmailError(null)
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
                                title={'Create account'}
                                remark={'Let us get you started! Please fill out the form below to create your account'}
                            />
                            <View style={{ marginBottom: 18 }}>
                                <RegInputKitty
                                    value={email} 
                                    onChangeText={setEmail} 
                                    label={'Email'} 
                                    placeholder={'Enter your email address'} 
                                    disabled={isLoading}
                                    iconLeft={<Feather name='mail' size={14} color="#bcbcbc" />}
                                    onBlurEvent={onBlurEvent}
                                    onFocusEvent={() => setEmailError(null)}
                                    error={emailError}
                                />
                            </View>
                            <View style={{ marginBottom: 20 }}>
                                <SubContentComp>By clicking on Agree and Continue, I agree to Dopamine&lsquo;s <ExternalLink href="https://google.com"><ThemedText type="link">Terms of Service</ThemedText></ExternalLink>, <ExternalLink href='https://pornhub.com'><ThemedText type="link">Payments Terms of Service</ThemedText></ExternalLink> and <ExternalLink href='https://qa.rewards.boydgaming.com'><ThemedText type='link'>Non-discrimination Policy</ThemedText></ExternalLink> and acknowledge the Privacy Policy.</SubContentComp>
                            </View>
                            <View>
                                <ActionButton 
                                    isLoading={isLoading}
                                    buttonLabel={'Agree and Continue'}
                                    onPressEvent={signUpWithEmail}
                                />
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}
