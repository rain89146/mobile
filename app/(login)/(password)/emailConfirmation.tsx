import { RegInputKitty } from '@/components/form/input/InputKitty';
import { ActionBetaButton, ActionButton, BackButton } from '@/components/ui/ActionButtons';
import { TitleAndRemark } from '@/components/ui/ContentComp';
import { Helpers } from '@/utils/helpers';
import Feather from '@expo/vector-icons/Feather';
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import React, { useEffect } from 'react'
import { SafeAreaView, View, Text, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native'
import { DotIndicator } from 'react-native-indicators';
import useToastHook from '@/hooks/useToastHook';
import { useAuthContext } from '@/contexts/AuthenticationContext';

class InvalidVerificationCode extends Error {
    constructor(message?: string) {
        super(message);
        this.name = this.constructor.name;
        this.message = (message) ? message : 'Invalid verification code';
    }
}

// 30 seconds
const resendTime = 30 * 1000;

export default function emailConfirmation() {

    //  hooks
    const authContext = useAuthContext();
    const navigation = useNavigation();
    const router = useRouter();
    const { showToast, hideToast } = useToastHook();
    const {email} = useLocalSearchParams();
    
    //  local states
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const [verificationCode, setVerificationCode] = React.useState<string>('');
    const [verificationCodeError, setVerificationCodeError] = React.useState<string | null>(null);
    const [allowToSubmit, setAllowToSubmit] = React.useState<boolean>(false);
    const [resendLoading, setResendLoading] = React.useState<boolean>(false);
    const [canResend, setCanResend] = React.useState<boolean>(false);
    const [resendTimer, setResendTimer] = React.useState<number>(resendTime);
    
    const timerRef = React.useRef(0);

    //  set the header to false
    React.useEffect(() => {
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
    }, [])

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

            //  if the verification code is valid, navigate to the next screen
            const apiResponse = await authContext.verifyPasswordResetCode(verificationCode);

            //  when unable to verify the verification code, we will show an error message
            if (!apiResponse.result) throw new InvalidVerificationCode(apiResponse.message);

            //  check if the verification code is valid
            if (!apiResponse.response) throw new InvalidVerificationCode();

            //  provide feedback to user
            Helpers.impactSoftFeedback();

            //  navigate to the next screen
            router.push({
                pathname: '/(login)/(password)/resetPassword',
                params: {
                    code: verificationCode,
                }
            });
        } 
        catch (error: Error|any)
        {
            console.log('ForgotPasswordEmailVerification: submitVerificationCode: ', error);
            Helpers.notificationErrorFeedback();

            //  when invalid verification code is thrown
            if (error.name === 'InvalidVerificationCode') 
            {
                setVerificationCodeError(error.message);
                return;
            }
            
            //  when the verification code is invalid
            Alert.alert('Oops! Something went wrong', 'We were unable to verify the verification code. Please try again later.');
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
            if (!email) throw new Error('Email is required');
            if (!Helpers.validateEmail(email as string)) throw new Error('Invalid email address');

            //  send the verification code to the user's email address
            const apiResponse = await authContext.sendPasswordResetRequest(email as string);

            //  when unable to send the verification code, we will show an error message
            if (!apiResponse.result) throw new Error('Failed to send verification code');

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
        catch (error) 
        {
            console.log('forgotPasswordEmailVerification: sendVerificationCode: ', error);
            Alert.alert('Something went wrong', 'We were unable to send the verification code. Please try again later.');
        } 
        finally {
            setResendLoading(false);
        }
    }

    /**
     * When the user clicks on the back button, we will navigate to the previous screen
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

            Helpers.validateNumber(verificationCode) 
            ? setVerificationCodeError(null) 
            : setVerificationCodeError('Invalid format of verification code');
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
        setVerificationCode(value);
        setAllowToSubmit(value.length > 0) 
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
                                                            ? `(${resendTimer / 1000}s)`
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
