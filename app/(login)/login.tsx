import { PassInputKitty, RegInputKitty } from '@/components/form/input/InputKitty';
import { ActionButton, AppleButton, BackButton } from '@/components/ui/ActionButtons';
import { DividerLineWithText, TitleAndRemark } from '@/components/ui/ContentComp';
import { useAuthContext } from '@/contexts/AuthenticationContext';
import { Helpers } from '@/utils/helpers';
import Feather from '@expo/vector-icons/Feather';
import { useRouter } from 'expo-router';
import React from 'react'
import { View, Text, SafeAreaView, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';

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
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const [email, setEmail] = React.useState<string>('');
    const [password, setPassword] = React.useState<string>('');
    const [passwordError, setPasswordError] = React.useState<string|null>(null);
    const [emailError, setEmailError] = React.useState<string|null>(null);
    const [error, setError] = React.useState<string|null>(null);

    const [appleLoading, setAppleLoading] = React.useState<boolean>(false);
    const [counter, setCounter] = React.useState<number>(0);

    /**
     * Sign in the user with email and password
     * @returns {Promise<void>}
     */
    const signIn = async (): Promise<void> => {
        try {
            setIsLoading(true);

            // validation
            if (!email) throw new EmailError('Email is required');
            if (!Helpers.validateEmail(email)) throw new EmailError('Invalid email address');
            if (!password) throw new PasswordError('Password is required');

            //  login the user
            await authContext.signInWithEmail(email, password);
        } 
        catch (error: Error | any) 
        {
            await Helpers.notificationErrorFeedback();

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

                //  increase the counter
                setCounter(prev => prev + 1);

                //  generic error
                setError(error.message);
            }
            else
            {
                setError('An unknown error occurred');
            }
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
            await authContext.signInWithApple();
        }
        finally
        {
            setAppleLoading(false);
        }
    }

    /**
     * Handle the on blur event for the email input field
     * @param e 
     */
    const onBlurEvent = (e: any) => {
        if (email) {
            const err = Helpers.validateEmail(email) ? null : 'Invalid email address';
            setEmailError(err);
        } else {
            setEmailError(null)
        }
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#fff"}}>
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
                        <View style={{ flex: 1, flexDirection: 'column' }}>
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
                            <TitleAndRemark 
                                title={`Welcome to Dopa!`}
                                remark={'Please enter your email address and password to login to your account.'}
                            />
                            <View style={{ flex: 1 }}>
                                <View style={{ marginBottom: 18 }}>
                                    <RegInputKitty
                                        value={email} 
                                        onChangeText={setEmail} 
                                        label={'Email'} 
                                        placeholder={'Enter your email address'} 
                                        disabled={isLoading}
                                        iconLeft={<Feather name='mail' size={14} color="#bcbcbc" />}
                                        onBlurEvent={onBlurEvent}
                                        onFocusEvent={() => {
                                            setEmailError(null);
                                            setError(null);
                                        }}
                                        error={emailError}
                                    />
                                </View>
                                <View>
                                    <PassInputKitty
                                        value={password} 
                                        onChangeText={setPassword} 
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
                                            color: '#000',
                                            textDecorationLine: 'underline',
                                        }}>Forgot password?</Text>
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
                                    <ActionButton 
                                        isLoading={isLoading}
                                        buttonLabel={'Sign in'}
                                        onPressEvent={signIn}
                                    />
                                </View>
                                <View>
                                    <DividerLineWithText text='or, you can also'/>                                
                                </View>
                                <View>
                                    <AppleButton isLoading={appleLoading} label={'Continue with Apple Account'} onPressEvent={() => signInWithApple()}/>
                                </View>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}
