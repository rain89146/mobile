import { RegInputKitty } from '@/components/form/input/InputKitty';
import { ActionBetaButton, ActionButton, BackButton } from '@/components/ui/ActionButtons';
import { TitleAndRemark } from '@/components/ui/ContentComp';
import { useSignupContext } from '@/contexts/SignupContext';
import { Helpers } from '@/utils/helpers';
import Feather from '@expo/vector-icons/Feather';
import { useNavigation, useRouter } from 'expo-router';
import React, { useEffect } from 'react'
import { SafeAreaView, View, Text, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native'
import { DotIndicator } from 'react-native-indicators';
import useToastHook from '@/hooks/useToastHook';

class InvalidConfirmationCode extends Error {
    constructor(message?: string) {
        super(message);
        this.name = this.constructor.name;
        this.message = (message) ? message : 'Invalid confirmation code';
    }
}

// 30 seconds
const resendTime = 30 * 1000;

export default function emailConfirmation() {

    //  hooks
    const signupContext = useSignupContext();
    const navigation = useNavigation();
    const router = useRouter();
    const { showToast, hideToast } = useToastHook();

    //  local states
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const [confirmationCode, setConfirmationCode] = React.useState<string>('');
    const [confirmationCodeError, setConfirmationCodeError] = React.useState<string | null>(null);
    const [resendLoading, setResendLoading] = React.useState<boolean>(false);
    const [canResend, setCanResend] = React.useState<boolean>(false);
    const [resendTimer, setResendTimer] = React.useState<number>(resendTime);
    const [isAllowed, setIsAllowed] = React.useState<boolean>(false);
    const timerRef = React.useRef(0);

    //  set the header to false
    React.useEffect(() => {
        navigation.setOptions({ headerShown: false })
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
     * Submit the confirmation code to the server
     * @returns {Promise<void>}
     * @throws {Error} if the confirmation code is invalid
     */
    const submitConfirmationCode = async (): Promise<void> => {
        try {
            setIsLoading(true);
            
            //  check if the confirmation code is valid
            if (confirmationCode.length !== 6) throw new InvalidConfirmationCode('Confirmation code must be 6 digits');
            
            //  check if the confirmation code is a number
            if (!Helpers.validateNumber(confirmationCode)) throw new InvalidConfirmationCode('Invalid format for confirmation code');

            //  if the confirmation code is valid, navigate to the next screen
            const apiResponse = await signupContext.verifyConfirmationCode(confirmationCode);

            //  when unable to verify the confirmation code, we will show an error message
            if (!apiResponse.result) throw new Error(apiResponse.message);

            //  check if the confirmation code is valid
            if (!apiResponse.response) throw new InvalidConfirmationCode();

            //  if the confirmation code is valid, navigate to the next screen
            signupContext.setSignUpPayload({ ...signupContext.signUpPayload, emailVerificationCode: confirmationCode });

            //  provide feedback to user
            Helpers.impactSoftFeedback();

            //  navigate to the next screen
            router.replace('/(signup)/addPersonalInfo');
        } 
        catch (error: Error|any)
        {
            console.log('SignUpEmailVerification: submitConfirmationCode: ', error);
            Helpers.notificationErrorFeedback();

            //  when invalid confirmation code is thrown
            if (error.name === 'InvalidConfirmationCode') 
            {
                setConfirmationCodeError(error.message);
                return;
            }
            
            //  when the confirmation code is invalid
            Alert.alert('Oops! Something went wrong', 'We were unable to verify the confirmation code. Please try again later.');
        }
        finally 
        {
            setIsLoading(false);
        }
    }

    /**
     * Once the user clicks on the resend confirmation code button, we will send a new confirmation code to the user's email address.
     * @returns {Promise<void>}
     * @throws {Error} if the email is not valid
     */
    const sendConfirmationCode = async (): Promise<void> => {
        setResendLoading(true);
        try 
        {
            const email = signupContext.signUpPayload?.email;
            if (!email) throw new Error('Email is required');

            //  send the confirmation code to the user's email address
            const apiResponse = await signupContext.sendVerificationCode(email);

            //  when unable to send the confirmation code, we will show an error message
            if (!apiResponse.result) throw new Error('Failed to send confirmation code');

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
                text1: 'Confirmation code sent',
                text2: `Please check your email.`,
                position: 'bottom',
                onPress: () => hideToast()
            })
        } 
        catch (error) 
        {
            console.log('SignUpEmailConfirmationScreen: sendConfirmationCode: ', error);
            Alert.alert('Something went wrong', 'We were unable to send the confirmation code. Please try again later.');
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
        if (confirmationCode)
        {
            if (confirmationCode.length !== 6) 
            {
                setConfirmationCodeError('Confirmation code must be 6 digits');
                return;
            }

            Helpers.validateNumber(confirmationCode) 
            ? setConfirmationCodeError(null) 
            : setConfirmationCodeError('Invalid format for confirmation code');
        }
        else 
        {
            setConfirmationCodeError(null)
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
                                title={'Verify Email Address'}
                                remark={'We have sent a confirmation code to your email address. Please enter the code below to verify your email address.'}
                            />
                            <View style={{ marginBottom: 18 }}>
                                <RegInputKitty
                                    value={confirmationCode} 
                                    onChangeText={(value) => {
                                        setConfirmationCode(value)
                                        setIsAllowed(value.length > 0)
                                    }} 
                                    label={'Confirmation Code'} 
                                    placeholder={'Enter the confirmation code'} 
                                    disabled={isLoading}
                                    iconLeft={<Feather name='hash' size={14} color="#bcbcbc" />}
                                    keyboardType='numeric'
                                    onBlurEvent={onBlurEvent}
                                    onFocusEvent={() => setConfirmationCodeError(null)}
                                    error={confirmationCodeError}
                                />
                            </View>
                            <View style={{width: '100%'}}>
                                <ActionBetaButton 
                                    isLoading={isLoading}
                                    isAllow={isAllowed}
                                    buttonLabel={'Verify Email Address'}
                                    onPressEvent={submitConfirmationCode}
                                />
                                <TouchableOpacity 
                                    onPress={() => sendConfirmationCode()}
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
                                                        Resend Confirmation Code {
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
