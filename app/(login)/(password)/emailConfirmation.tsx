import { RegInputKitty } from '@/components/form/input/InputKitty';
import { ActionBetaButton, BackButton } from '@/components/ui/ActionButtons';
import { TitleAndRemark } from '@/components/ui/ContentComp';
import { Helpers } from '@/utils/helpers';
import Feather from '@expo/vector-icons/Feather';
import { useNavigation, useRouter } from 'expo-router';
import React, { useEffect, useState, useRef } from 'react'
import { SafeAreaView, View, Text, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native'
import { DotIndicator } from 'react-native-indicators';
import useToastHook from '@/hooks/useToastHook';
import { usePasswordResetContext } from '@/contexts/PasswordResetContext';
import { AuthService } from '@/services/AuthService';

class InvalidVerificationCode extends Error {
    constructor(message?: string) {
        super(message);
        this.name = this.constructor.name;
        this.message = (message) ? message : 'Invalid verification code';
    }
}

class MismatchVerificationCodeError extends Error {
    constructor(message?: string) {
        super(message);
        this.name = this.constructor.name;
        this.message = (message) ? message : 'Verification code does not match';
    }
}

// 30 seconds
const resendTime = 30 * 1000;

export default function EmailConfirmation() {

    //  hooks
    const passwordContext = usePasswordResetContext();
    const navigation = useNavigation();
    const router = useRouter();
    const { showToast, hideToast } = useToastHook();
    
    //  local states
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [verificationCode, setVerificationCode] = useState<string>('');
    const [verificationCodeError, setVerificationCodeError] = useState<string | null>(null);
    const [allowToSubmit, setAllowToSubmit] = useState<boolean>(false);
    const [resendLoading, setResendLoading] = useState<boolean>(false);
    const [canResend, setCanResend] = useState<boolean>(false);
    const [resendTimer, setResendTimer] = useState<number>(resendTime);

    const timerRef = useRef(0);

    //  set the header to false
    useEffect(() => {
        navigation.setOptions({ headerShown: false });

        //  cleanup
        return () => {
            setIsLoading(false);
            setVerificationCode('');
            setVerificationCodeError(null);
            setAllowToSubmit(false);
            setResendLoading(false);
            setCanResend(false);
            setResendTimer(resendTime);
        }
    }, [navigation])

    //  start the initial countdown for 30 seconds
    useEffect(() => {
        // start the countdown for 30 seconds
        timerRef.current = setInterval(() => {
            setResendTimer((prev) => {
                if (prev <= 0) {
                    clearInterval(timerRef.current);
                    setCanResend(true);
                    return 0;
                }
                return prev - 1000;
            });
        }, 1000);

        return () => {
            clearInterval(timerRef.current);
        }
    }, [])

    // when mounted, check if the email is provided in the context
    useEffect(() => {
        if (!passwordContext.email) 
        {
            router.replace('/(login)/(password)/forgotPassword');
            return;
        }
    }, [passwordContext, router]);

    /**
     * Submit the verification code to the server
     * @returns {Promise<void>}
     * @throws {Error} if the verification code is invalid
     */
    const submitVerificationCode = async (): Promise<void> => {
        try {
            setIsLoading(true);
            
            //  check if the verification code is valid
            if (verificationCode.length !== 6) throw new InvalidVerificationCode('Verification code must be 6 digits');
            
            //  check if the verification code is a number
            if (!Helpers.validateNumber(verificationCode)) throw new InvalidVerificationCode('Invalid format for verification code');

            //  check if the email is provided through context
            if (!passwordContext.email) throw new Error('Email is missing from the context');

            //  if the verification code is valid, navigate to the next screen
            const apiResponse = await AuthService.verifyPasswordResetCode(passwordContext.email, verificationCode);

            //  when unable to verify the verification code, we will show an error message
            if (!apiResponse.status)
            {
                const { message, exception } = apiResponse;
                const error = new Error(message || 'An error occurred while verifying the verification code');
                error.name = exception || 'UnknownError';
                console.log(error)
                throw error;
            }           

            //  when verification code is not matched, we will throw an error
            if (!apiResponse.response) throw new MismatchVerificationCodeError();

            //  provide feedback to user
            Helpers.impactSoftFeedback();

            //  navigate to the next screen
            router.replace('/(login)/(password)/resetPassword');
        } 
        catch (error: unknown)
        {
            console.log('ForgotPasswordEmailVerification: submitVerificationCode: ', error);

            //  provide feedback to user
            Helpers.notificationErrorFeedback();

            // default error handling
            let defaultErrorMessage = 'We were unable to verify the verification code. Please try again later.';

            //  when the error is a known error
            if (error instanceof Error)
            {
                //  when invalid verification code is thrown
                if (error.name === 'InvalidVerificationCode') 
                {
                    setVerificationCodeError(error.message);
                    return;
                }

                //  when other errors are thrown
                defaultErrorMessage = error.message;
            }

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

    /**
     * Once the user clicks on the resend verification code button, we will send a new verification code to the user's email address.
     * @returns {Promise<void>}
     * @throws {Error} if the email is not valid
     */
    const sendVerificationCode = async (): Promise<void> => {
        setResendLoading(true);
        try 
        {
            //  check if the email is valid
            if (!passwordContext.email) throw new Error('Email is required');

            //  send the verification code to the user's email address
            const apiResponse = await AuthService.sendPasswordResetRequest(passwordContext.email as string);

            //  when unable to send the verification code, we will show an error message
            if (!apiResponse.status) 
            {
                const error = new Error(apiResponse.message);
                error.name = apiResponse.exception || 'UnknownError';
                throw error;
            }

            //  after the code is sent, we will start the countdown for 30 seconds
            //  within the 30 seconds, the user will not be able to click on the resend button
            setResendTimer(resendTime);
            setCanResend(false);
            
            //  start the countdown for 30 seconds
            if (timerRef.current) clearInterval(timerRef.current);
            timerRef.current = setInterval(() => {
                setResendTimer((prev) => {
                    if (prev <= 0) {
                        clearInterval(timerRef.current);
                        setCanResend(true);
                        return 0;
                    }
                    return prev - 1000;
                });
            }, 1000);

            //  provide feedback to user
            Helpers.notificationSuccessFeedback();

            //  show toast message
            showToast({
                type: 'success',
                text1: 'Verification code sent',
                text2: `Please check your email.`,
                position: 'bottom',
                onPress: () => hideToast()
            })
        } 
        catch (error: unknown) 
        {
            console.log('forgotPasswordEmailVerification: sendVerificationCode: ', error);
            
            //  provide feedback to user
            Helpers.notificationErrorFeedback();

            //  when the error is a known error
            const defaultErrorMessage = (error instanceof Error) ? error.message : 'We were unable to send the verification code. Please try again later.';

            // other errors
            showToast({
                type: 'error',
                text1: 'Oops! Something went wrong',
                text2: defaultErrorMessage,
                position: 'bottom',
                onPress: () => hideToast()
            });
        } 
        finally {
            setResendLoading(false);
        }
    }

    /**
     * When the user clicks on the input field, we will check if the verification code is valid
     * @returns {void}
     */
    const onBlurEvent = (e: any): void => {
        if (verificationCode)
        {
            if (verificationCode.length !== 6) 
            {
                setVerificationCodeError('Invalid format of verification code');
                return;
            }

            const err = Helpers.validateNumber(verificationCode) ? null : 'Invalid format of verification code';
            setVerificationCodeError(err);
        }
        else 
        {
            setVerificationCodeError(null)
        }
    }

    /**
     * When the user changes the input field
     * @param value - The value of the input field
     * @returns {void}
     */
    const inputFieldOnChangeEvent = (value: string): void => {
        const trimmedValue = value.trim();

        //  make sure the value is number
        if (trimmedValue) {
            const err = Helpers.validateNumber(trimmedValue) ? null : 'Invalid format of verification code';
            setVerificationCodeError(err);
        }

        setVerificationCode(trimmedValue);
        setAllowToSubmit(trimmedValue.length === 6); 
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
            >
                <ScrollView
                    contentContainerStyle={{ flexGrow: 1 }}
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
                                title={'Enter Verification Code'}
                                remark={'We have sent a verification code to your email address. Please enter the code below to verify your request.'}
                            />
                            <View style={{ marginBottom: 18 }}>
                                <RegInputKitty
                                    value={verificationCode} 
                                    onChangeText={inputFieldOnChangeEvent} 
                                    label={'Verification Code'} 
                                    placeholder={'Enter the verification code'} 
                                    disabled={isLoading}
                                    iconLeft={<Feather name='hash' size={14} color="#bcbcbc" />}
                                    keyboardType='numeric'
                                    onBlurEvent={onBlurEvent}
                                    onFocusEvent={() => setVerificationCodeError(null)}
                                    error={verificationCodeError}
                                    maxLength={6}
                                />
                            </View>
                            <View style={{width: '100%'}}>
                                <ActionBetaButton 
                                    isLoading={isLoading}
                                    isAllow={allowToSubmit}
                                    buttonLabel={'Next, Reset Password'}
                                    onPressEvent={submitVerificationCode}
                                />
                                <TouchableOpacity 
                                    onPress={() => sendVerificationCode()}
                                    disabled={!canResend}
                                    activeOpacity={0.7}
                                    style={{
                                        backgroundColor: '#fff',
                                        padding: 15,
                                        borderRadius: 3,
                                        marginTop: 10,
                                        alignItems: 'center',
                                        borderWidth: 1,
                                        borderColor: !canResend ? "#adadad" : '#000',
                                    }}>
                                        {
                                            resendLoading 
                                            ? (
                                                <View style={{
                                                    flexDirection: 'row',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                }}>
                                                    <DotIndicator color={"#000"} count={3} size={7}/>
                                                </View>
                                            )
                                            : (
                                                <View style={{
                                                    flexDirection: 'row',
                                                    gap: 6
                                                }}>
                                                    <Text style={{
                                                        color: !canResend ? "#adadad" :'#000',
                                                        fontWeight: 'bold',
                                                        fontSize: 14,
                                                    }}>
                                                        Resend Verification Code {
                                                            ((resendTimer / 1000) !== 0) 
                                                            ? `(${Math.ceil(resendTimer / 1000)}s)`
                                                            : ''
                                                        }
                                                    </Text>
                                                </View>
                                            )
                                        }
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}
