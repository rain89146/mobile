import { router, useNavigation } from 'expo-router';
import React from 'react'
import { View, SafeAreaView, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native'
import { RegInputKitty } from '@/components/form/input/InputKitty';
import Feather from '@expo/vector-icons/Feather';
import { Helpers } from '@/utils/helpers';
import { useSignupContext } from '@/contexts/SignupContext';
import { ActionButton, BackButton } from '@/components/ui/ActionButtons';
import { SubContentComp, TitleAndRemark } from '@/components/ui/ContentComp';
import { ExternalLink } from '@/components/ExternalLink';
import { ThemedText } from '@/components/ThemedText';

class EmailError extends Error {
    constructor(message: string) {
        super(message);
        this.name = this.constructor.name;
    }
}

export default function accountRegister() 
{
    //  hooks
    const signupContext = useSignupContext();
    const navigation = useNavigation();

    //  local states
    const [isLoading, setIsLoading] = React.useState(false);
    const [email, setEmail] = React.useState<string>('');
    const [emailError, setEmailError] = React.useState<string|null>(null);

    //  set the header to false
    React.useEffect(() => {
        navigation.setOptions({ headerShown: false })
    }, [])

    /**
     * Sign up with email
     * @returns {Promise<void>}
     */
    const signUpWithEmail = async (): Promise<void> => {
        setEmailError(null);
        setIsLoading(true);

        try {
            // validation
            if (!email) throw new EmailError('Email is required');
            if (!Helpers.validateEmail(email)) throw new EmailError('Invalid email address');

            //  generate record id
            const recordResponse = await signupContext.generateSignUpRecord(email);

            //  when response is not successful
            if (!recordResponse.result) throw new Error(recordResponse.message);
            if (!recordResponse.response) throw new Error('Unable to generate record id');

            // get record id
            const recordId = recordResponse.response;

            //  send verification code
            const response = await signupContext.sendVerificationCode(email);

            //  check if response is successful
            if (!response.result) throw new Error(response.message);

            //  set email in signup context
            signupContext.setSignUpPayload({...signupContext.signUpPayload, email, recordId });

            //  provide feedback to user
            Helpers.impactSoftFeedback();

            //  redirect to email confirmation page
            router.replace('/(signup)/emailConfirmation');
        } 
        catch (error: Error|any) 
        {
            console.log('Error signing up with email', error);

            // provide feedback to user
            Helpers.notificationErrorFeedback();

            // when error is email error
            if (error.name === 'EmailError')
            {
                setEmailError(error.message);
                return;
            } 
            
            // for everything else
            Alert.alert('Oops! Something went wrong', 'We are unable to process your request at this time. Please try again later.');
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
            Helpers.validateEmail(email) ? setEmailError(null) : setEmailError('Invalid email address');
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
                                <SubContentComp>By clicking on Agree and Continue, I agree to Dopamine's <ExternalLink href="https://google.com"><ThemedText type="link">Terms of Service</ThemedText></ExternalLink>, <ExternalLink href='https://pornhub.com'><ThemedText type="link">Payments Terms of Service</ThemedText></ExternalLink> and <ExternalLink href='https://qa.rewards.boydgaming.com'><ThemedText type='link'>Non-discrimination Policy</ThemedText></ExternalLink> and acknowledge the Privacy Policy.</SubContentComp>
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
