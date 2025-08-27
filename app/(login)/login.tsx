import { SecondaryBackground } from '@/components/background/LandingBackground';
import { DarkPassInputKitty, DarkRegInputKitty } from '@/components/form/input/InputKitty';
import { DarkActionButton, DarkAppleButton, LightBackButton } from '@/components/ui/ActionButtons';
import { DarkTitleAndRemark, DividerLineWithText } from '@/components/ui/ContentComp';
import { obsidian } from '@/constants/Colors';
import { SessionKeys } from '@/constants/SessionKeys';
import { authCredential, useAuthContext } from '@/contexts/AuthenticationContext';
import useToastHook from '@/hooks/useToastHook';
import { AsyncStorageService } from '@/services/AsyncStorageService';
import { AuthService } from '@/services/AuthService';
import { Helpers } from '@/utils/helpers';
import Feather from '@expo/vector-icons/Feather';
import { useRouter } from 'expo-router';
import React, { useEffect, useState, useRef } from 'react'
import { View, Text, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';

class EmailError extends Error {
    constructor(message: string) {
        super(message);
        this.name = this.constructor.name;
    }
}

class PasswordError extends Error {
    constructor(message: string) {
        super(message);
        this.name = this.constructor.name;
    }
}

const MAX_PASSWORD_ATTEMPTS = 3;

export default function Login() {

    const authContext = useAuthContext();
    const router = useRouter();
    const { showToast, hideToast } = useToastHook();
    
    //  local states
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [passwordError, setPasswordError] = useState<string|null>(null);
    const [emailError, setEmailError] = useState<string|null>(null);
    const [error, setError] = useState<string|null>(null);

    const [appleLoading, setAppleLoading] = useState<boolean>(false);
    const [counter, setCounter] = useState<number>(0);
    const [isDisabled, setIsDisabled] = useState<boolean>(false);

    //  timer ref
    const timerRef = useRef(0);
    const [lockTimer, setLockTimer] = useState<number>(30 * 1000); // 30 seconds

    // listen to the disabled state and start the timer
    useEffect(() => {
        if (isDisabled) {
            // start the countdown for 30 seconds
            timerRef.current = setInterval(() => {
                setLockTimer((prev) => {
                    if (prev <= 0) {
                        clearInterval(timerRef.current);

                        // reset the timer to 30 seconds
                        setLockTimer(30 * 1000); 

                        // reset the counter and enable the button
                        setCounter(0);

                        // enable the sign in button
                        setIsDisabled(false);
                        return 0;
                    }
                    return prev - 1000;
                });
            }, 1000);

        }

        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        }
    }, [isDisabled]);

    /**
     * Sign in the user with email and password
     * @returns {Promise<void>}
     */
    const signIn = async (): Promise<void> => {
        try {
            // validation
            if (!email) throw new EmailError('Email is required');
            if (!Helpers.validateEmail(email)) throw new EmailError('Invalid email address');
            if (!password) throw new PasswordError('Password is required');

            // set loading state
            setIsLoading(true);

            //  login the user
            const response = await AuthService.signInWithEmail(email, password);

            //  check if response is successful
            if (!response.response)
            {
                //  check if the counter is less than max attempts
                if (counter < MAX_PASSWORD_ATTEMPTS - 1) 
                {
                    //  accumulate the counter
                    setCounter(prev => prev + 1);

                    //  construct the error based on the response
                    const error = new Error(response.message || 'Unable to sign in with email');
                    error.name = response.exception || 'UnknownError';
                    throw error;
                }
                else 
                {
                    //  reset the counter
                    setCounter(0);

                    //  throw a max attempts error
                    const error = new Error('Maximum password attempts reached.');
                    error.name = 'MaxAttemptsError';
                    throw error;
                }
            }

            //  destructure the response
            const {userId, refreshToken, accessToken, plaidUserToken} = response.response;

            //  set the auth context
            await authContext.StoreAuthCred({
                authProvider: 'email',
                userId,
                dopa: { accessToken, refreshToken },
                plaidUserToken: plaidUserToken
            });

            //  redirect to the home screen
            router.replace('/(protected)/(tabs)/(home)/home');
        } 
        catch (error: unknown) 
        {
            console.warn("Login: signIn: error", error);

            //  provide feedback to the user 
            await Helpers.notificationErrorFeedback();

            //  default error message
            let defaultErrorMessage = 'An unknown error occurred. Please try again later.';

            //  check if the error is an instance of Error
            if (error instanceof Error) 
            {
                // when it's email error
                if (error.name === 'EmailError') 
                {
                    setEmailError(error.message);
                    return;
                }
                // when it's password error
                if (error.name === 'PasswordError')
                {
                    setPasswordError(error.message);
                    return;
                }

                // when it's max attempts error, lock the sign in button
                if (error.name === 'MaxAttemptsError')
                {
                    setIsDisabled(true);
                }

                defaultErrorMessage = error.message || defaultErrorMessage;
            }

            showToast({
                type: 'error',
                text1: 'Oops, something went wrong',
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
     * Sign in with Apple
     * @returns {Promise<void>}
     */
    const signInWithApple = async (): Promise<void> => {
        try 
        {
            setAppleLoading(true);
            console.log('Sign in with Apple is not implemented yet');
        }
        finally
        {
            setAppleLoading(false);
        }
    }

    return (
        <View style={{ flex: 1, backgroundColor: obsidian, position: 'relative' }}>
            <SecondaryBackground />
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
            >
                <ScrollView
                    contentContainerStyle={{flexGrow: 1}}
                    keyboardShouldPersistTaps="handled"
                    style={{
                        backgroundColor: "#100b16f2",
                    }}
                >
                    <View style={{ flex: 1, padding: 35, paddingTop: 80, paddingBottom: 30 }}>
                        <View style={{ flex: 1, flexDirection: 'column' }}>
                            <View style={{
                                width: 'auto',
                                position: 'relative',
                                paddingBottom: 60,
                            }}>
                                <LightBackButton 
                                    label={'Back'}
                                    onPressEvent={() => router.back()}
                                />
                            </View>
                            <DarkTitleAndRemark 
                                title={`Budget Like a Boss. Get Rich on Purpose`}
                                remark={'Please enter your email address and password to login to your account.'}
                            />
                            <View style={{ flex: 1 }}>
                                <View style={{ marginBottom: 18 }}>
                                    <DarkRegInputKitty
                                        value={email} 
                                        onChangeText={(val)=>{
                                            setEmail(val);
                                            setEmailError(null);
                                            setError(null);
                                        }} 
                                        label={'Email'} 
                                        placeholder={'Enter your email address'} 
                                        disabled={isLoading}
                                        iconLeft={<Feather name='mail' size={14} color="#bcbcbc" />}
                                        onFocusEvent={() => {
                                            setEmailError(null);
                                            setError(null);
                                        }}
                                        error={emailError}
                                    />
                                </View>
                                <View>
                                    <DarkPassInputKitty
                                        value={password} 
                                        onChangeText={(val) => {
                                            setPassword(val);
                                            setError(null);
                                            setPasswordError(null);
                                        }} 
                                        label={'Password'} 
                                        placeholder={'Enter the password'} 
                                        disabled={isLoading}
                                        onFocusEvent={() => {
                                            setError(null)
                                            setPasswordError(null);
                                        }}
                                        error={passwordError}
                                    />
                                </View>
                                <View style={{
                                    flexDirection: 'row',
                                    marginTop: 18,
                                }}>
                                    <TouchableOpacity onPress={() => router.push('/(login)/(password)/forgotPassword')}>
                                        <Text style={{
                                            fontSize: 14,
                                            color: '#f5f1f8',
                                            textDecorationLine: 'underline',
                                        }}>Forgot password?</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity onPress={() => router.push('/(signup)/accountRegister')} style={{marginLeft: 'auto'}}>
                                        <Text style={{
                                            fontSize: 14,
                                            color: '#f5f1f8',
                                            textDecorationLine: 'underline',
                                        }}>Register</Text>
                                    </TouchableOpacity>
                                </View>
                                {
                                    error && (
                                        <View style={{
                                            flexDirection: 'row',
                                            marginTop: 10,
                                            marginBottom: 18,
                                        }}>
                                            <Text style={{
                                                fontSize: 14,
                                                color: '#ff0000',
                                            }}>{error}</Text>
                                        </View>
                                    )
                                }
                                <View style={{
                                    marginTop: !error ? 18 : 0,
                                }}>
                                    <DarkActionButton 
                                        isLoading={isLoading}
                                        buttonLabel={isDisabled ? `Sign in unlock in ${lockTimer / 1000}s`: 'Sign in'}
                                        onPressEvent={signIn}
                                        isDisabled={isDisabled}
                                    />
                                </View>
                                <View>
                                    <DividerLineWithText text='or, you can also'/>                                
                                </View>
                                <View>
                                    <DarkAppleButton isLoading={appleLoading} label={'Continue with Apple Account'} onPressEvent={() => signInWithApple()}/>
                                </View>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    )
}
