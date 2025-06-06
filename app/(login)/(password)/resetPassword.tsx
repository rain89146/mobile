import { PassInputKitty } from '@/components/form/input/InputKitty';
import PasswordEvaluation from '@/components/PasswordEvaluation';
import { ActionButton, BackButton } from '@/components/ui/ActionButtons';
import { TitleAndRemark } from '@/components/ui/ContentComp';
import { useAuthContext } from '@/contexts/AuthenticationContext';
import { Helpers } from '@/utils/helpers';
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import React, { useEffect } from 'react'
import { KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, View, Alert } from 'react-native';

class PasswordError extends Error {
    constructor(message: string) {
        super(message);
        this.name = this.constructor.name;
    }
}

export default function ResetPassword() {
    const authContext = useAuthContext();
    const navigation = useNavigation();
    const router = useRouter();
    const {code} = useLocalSearchParams();

    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const [password, setPassword] = React.useState<string>('');
    const [passwordError, setPasswordError] = React.useState<string | null>(null);

    const [containLowercase, setContainLowercase] = React.useState<boolean>(false);
    const [containUppercase, setContainUppercase] = React.useState<boolean>(false);
    const [containNumber, setContainNumber] = React.useState<boolean>(false);
    const [containSpecial, setContainSpecial] = React.useState<boolean>(false);
    const [lengthMet, setLengthMet] = React.useState<boolean>(false);
    const [passwordEvalScore, setPasswordEvalScore] = React.useState<number>(0);

    //  Set the header options
    useEffect(() => {
        navigation.setOptions({ headerShown: false })

        //  cleanup
        return () => {
            setIsLoading(false);
            setPassword('');
            setPasswordError(null);
            setContainLowercase(false);
            setContainUppercase(false);
            setContainNumber(false);
            setContainSpecial(false);
            setLengthMet(false);
            setPasswordError(null);
        }
    }, [navigation])

    //  Set the password evaluation score
    //  This is a simple evaluation score based on the password criteria
    //  Each criteria is worth 20 points, for a total of 100 points
    useEffect(() => {
        const score = (containLowercase ? 20 : 0) + (containUppercase ? 20 : 0) + (containNumber ? 20 : 0) + (containSpecial ? 20 : 0) + (lengthMet ? 20 : 0);
        setPasswordEvalScore(score);
    }, [containLowercase, containUppercase, containNumber, containSpecial, lengthMet])

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

            //  complete the sign up process
            const response = await authContext.resetPassword(code as string, password)

            //  when the response is not successful
            if (!response.status) throw new Error(response.message);
            if (!response.response) throw new Error('Unable to complete sign up process');

            //  provide feedback to user
            Helpers.impactSoftFeedback();

            //  redirect to complete sign up page
            router.replace('/(login)/(password)/completeReset');
        }
        catch (error: Error | any)
        {
            console.log('Error submitting password: ', error);
            
            Helpers.notificationErrorFeedback();

            if (error.name === 'PasswordError')
            {
                setPasswordError(error.message);
            } 
            else {
                Alert.alert('Error', 'An error occurred while submitting the password. Please try again.');
            }
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
        if (value) 
        {
            setContainLowercase(/[a-z]/.test(value));
            setContainUppercase(/[A-Z]/.test(value));
            setContainNumber(/[0-9]/.test(value));
            setContainSpecial(/[!@#$%^&*?:{}|<>_\-~;=+]/.test(value));
            setLengthMet(value.length >= 8);
        } else {
            setPasswordEvalScore(0);
        }
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
