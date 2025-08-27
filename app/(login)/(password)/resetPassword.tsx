import { PassInputKitty } from '@/components/form/input/InputKitty';
import PasswordEvaluation from '@/components/PasswordEvaluation';
import { ActionButton, BackButton } from '@/components/ui/ActionButtons';
import { TitleAndRemark } from '@/components/ui/ContentComp';
import { usePasswordResetContext } from '@/contexts/PasswordResetContext';
import { usePasswordStrengthEvaluatorHook } from '@/hooks/usePasswordStrengthEvaluatorHook';
import useToastHook from '@/hooks/useToastHook';
import { AuthService } from '@/services/AuthService';
import { Helpers } from '@/utils/helpers';
import { useNavigation, useRouter } from 'expo-router';
import React, { useEffect } from 'react'
import { KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, View } from 'react-native';

class PasswordError extends Error {
    constructor(message: string) {
        super(message);
        this.name = this.constructor.name;
    }
}

export default function ResetPassword() {
    const passwordContext = usePasswordResetContext();
    const navigation = useNavigation();
    const router = useRouter();
    const { showToast, hideToast } = useToastHook();

    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const [password, setPassword] = React.useState<string>('');
    const [passwordError, setPasswordError] = React.useState<string | null>(null);

    //  Password strength evaluator hook
    const { passwordEvalScore, evaluatePassword, passwordEvalCleanup } = usePasswordStrengthEvaluatorHook();

    //  Set the header options
    useEffect(() => {
        navigation.setOptions({ headerShown: false })

        //  cleanup
        return () => {
            setIsLoading(false);
            setPassword('');
            setPasswordError(null);
            passwordEvalCleanup();
        }
    }, [navigation])

    // when mounted, check if the email is provided in the context
    useEffect(() => {
        if (!passwordContext.email) 
        {
            router.replace('/(login)/(password)/forgotPassword');
            return;
        }
    }, [passwordContext, router]);

    /**
     * Submit the password
     * @returns {Promise<void>}
     * @throws {Error} - If the password is invalid or if there is an error during submission
     */
    const submitPassword = async (): Promise<void> => {
        try {
            setIsLoading(true);

            //  validation
            if (!password) throw new PasswordError('Password is required');
            if (Helpers.validatePassword(password) === false) throw new PasswordError('Password must include at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character.');

            //  check if the email is set in the context
            if (!passwordContext.email) throw new Error('Email is missing from the context');

            //  complete the sign up process
            const response = await AuthService.resetPassword(passwordContext.email, password)

            //  when the response is not successful
            if (!response.status)
            {
                const { message, exception } = response;
                const error = new Error(message || 'An error occurred while resetting the password');
                error.name = exception;
                throw error;
            }

            //  provide feedback to user
            Helpers.impactSoftFeedback();

            //  redirect to complete sign up page
            router.replace('/(login)/(password)/completeReset');
        }
        catch (error: Error | any)
        {
            console.log('ResetPassword: submitPassword: ', error);

            //  provide feedback to user
            Helpers.notificationErrorFeedback();

            //  default error message
            let defaultErrorMessage = 'An error occurred while submitting the password. Please try again later.';

            //  when the error is an instance of Error
            if (error instanceof Error) 
            {
                //  when the error is a known error
                if (error.name === 'PasswordError') 
                {
                    setPasswordError(error.message);
                    return;
                }

                //  when other errors are thrown
                defaultErrorMessage = error.message;
            }

            //  alert other errors
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
     * When the password field changes, update the password state and evaluate the password
     * @param {string} value - The value of the password field
     * @returns {void}
     */
    const passwordFieldOnChange = (value: string): void => {
        setPassword(value);
        evaluatePassword(value);
    }

    /**
     * When the password field is blurred, validate the password
     * @returns {void}
     */
    const passwordFieldOnBlur = (): void => {
        if (!password) return;
        const err = Helpers.validatePassword(password) ? null : 'Invalid format for password';
        setPasswordError(err);
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
                                    title={'Reset Your Password'} 
                                    remark={'Please create a new password for your account. Make sure to use a strong password that you can remember.'}
                                />
                                <View style={{ marginBottom: 18}}>
                                    <PasswordEvaluation score={passwordEvalScore}/>
                                </View>
                                <View style={{ marginBottom: 18}}>
                                    <PassInputKitty
                                        value={password} 
                                        onChangeText={passwordFieldOnChange} 
                                        label={'Password'} 
                                        placeholder={'Enter the password'} 
                                        disabled={isLoading}
                                        onBlurEvent={passwordFieldOnBlur}
                                        onFocusEvent={() => setPasswordError(null)}
                                        error={passwordError}
                                    />
                                </View>
                                <View>
                                    <ActionButton 
                                        onPressEvent={submitPassword}
                                        isLoading={isLoading}
                                        buttonLabel={'Reset Password'}
                                    />
                                </View>
                            </View>
                        </View>
                    </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}
