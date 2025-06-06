import { RegInputKitty } from '@/components/form/input/InputKitty';
import { ActionButton, BackButton } from '@/components/ui/ActionButtons';
import { TitleAndRemark } from '@/components/ui/ContentComp';
import { useAuthContext } from '@/contexts/AuthenticationContext';
import { Helpers } from '@/utils/helpers';
import Feather from '@expo/vector-icons/Feather';
import { useNavigation, useRouter } from 'expo-router';
import React from 'react'
import { View, Text, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native'

class EmailError extends Error {
    constructor(message: string) {
        super(message);
        this.name = this.constructor.name;
    }
}

export default function forgotPassword() {
    const navigation = useNavigation();
    const authContext = useAuthContext();
    const router = useRouter();

    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const [email, setEmail] = React.useState<string>('');
    const [emailError, setEmailError] = React.useState<string|null>(null);

    React.useEffect(() => {
        navigation.setOptions({ headerShown: false })
    }, [])

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

    const sendPasswordResetRequest = async (): Promise<void> => {
        setEmailError(null);
        setIsLoading(true);
        
        try {
            // validation
            if (!email) throw new EmailError('Email is required');
            if (!Helpers.validateEmail(email)) throw new EmailError('Invalid email address');

            //  send password reset request
            const apiResponse = await authContext.sendPasswordResetRequest(email);

            //  check if the response is successful
            if (!apiResponse.result) throw new Error(apiResponse.message);
            if (!apiResponse.response) throw new Error('Unable to send password reset request');

            //  provide feedback to the user
            Helpers.impactSoftFeedback();

            //  redirect to the confirmation screen
            router.push({
                pathname: '/(login)/(password)/emailConfirmation',
                params: { email }
            });
        } 
        catch (error: Error|any) 
        {
            console.log('ForgotPassword: sendPasswordResetRequest: error: ', error);

            // provide feedback to user
            Helpers.notificationErrorFeedback();
            
            //  show email error message
            if (error.name === 'EmailError') 
            {
                setEmailError(error.message);
                return;
            }

            //  alert other errors
            Alert.alert('Oops! Something went wrong', error.message);
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
                                    onBlurEvent={onBlurEvent}
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
