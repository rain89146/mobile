import { RegInputKitty } from '@/components/form/input/InputKitty';
import { ActionButton, BackButton } from '@/components/ui/ActionButtons';
import { TitleAndRemark } from '@/components/ui/ContentComp';
import { useSignupContext } from '@/contexts/SignupContext';
import useToastHook from '@/hooks/useToastHook';
import { SignupService } from '@/services/SignupService';
import { Helpers } from '@/utils/helpers';
import Feather from '@expo/vector-icons/Feather';
import { useNavigation, useRouter } from 'expo-router';
import React from 'react'
import { KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, View, Alert } from 'react-native';

class FirstNameError extends Error {
    constructor(message: string) {
        super(message);
        this.name = this.constructor.name;
    }
}

class LastNameError extends Error {
    constructor(message: string) {
        super(message);
        this.name = this.constructor.name;
    }
}

class RecordIdError extends Error {
    constructor(message: string) {
        super(message);
        this.name = this.constructor.name;
    }
}

export default function AddPersonalInfo() {

    const signupContext = useSignupContext();
    const navigation = useNavigation();
    const router = useRouter();

    const [isLoading, setIsLoading] = React.useState(false);
    const [firstName, setFirstName] = React.useState<string>('');
    const [firstNameError, setFirstNameError] = React.useState<string|null>(null);
    const [lastName, setLastName] = React.useState<string>('');
    const [lastNameError, setLastNameError] = React.useState<string|null>(null);

    //  toast hook
    const { showToast, hideToast } = useToastHook();
    
    // set the header to false
    React.useEffect(() => {
        navigation.setOptions({ headerShown: false })
    }, [navigation])

    /**
     * Submit personal information
     * @returns {Promise<void>}
     */
    const submitInformation = async (): Promise<void> => {
        setFirstNameError(null);
        setLastNameError(null);
        setIsLoading(true);

        try {
            // validation
            if (!signupContext.signUpPayload?.recordId) throw new RecordIdError('Record ID is required');
            
            if (!firstName) throw new FirstNameError('First name is required');            
            if (!Helpers.validatePersonName(firstName)) throw new FirstNameError('Invalid name format');

            if (!lastName) throw new LastNameError('Last name is required');
            if (!Helpers.validatePersonName(lastName)) throw new LastNameError('Invalid name format'); 

            //  store personal information
            const response = await SignupService.addPersonalDetails(signupContext.signUpPayload.recordId as string, firstName, lastName);

            //  check if response is successful
            if (!response.status)
            {
                const {message, exception} = response;
                const error = new Error(message || 'Unknown server error');
                error.name = exception || 'UnknownError';
                throw error;
            }

            //  provide feedback to user
            Helpers.impactSoftFeedback();

            //  store in the context
            signupContext.setSignUpPayload({...signupContext.signUpPayload, firstName, lastName });

            //  navigate to the next screen
            router.replace('/(signup)/createPassword');

        } 
        catch (error: unknown) 
        {
            console.log('AddPersonalInfo: submitInformation: error:', error);

            // provide feedback to user
            Helpers.notificationErrorFeedback();

            // default error message
            let defaultErrorMessage = 'We were unable to add your personal information. Please try again later.';

            // handle specific errors
            if (error instanceof Error) 
            {
                if (error.name === 'FirstNameError')
                {
                    setFirstNameError(error.message);
                    return;
                }
                if (error.name === 'LastNameError')
                {
                    setLastNameError(error.message);
                    return;
                }

                defaultErrorMessage = error.message || defaultErrorMessage;
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
     * Handle onBlur event
     * @param target - 'firstName' | 'lastName'
     * @returns {void}
     */
    const onBlurHandler = (target: 'firstName' | 'lastName'): void => {
        if (target === 'firstName') 
        {
            if (firstName) {
                const err = Helpers.validatePersonName(firstName) ? null : 'Invalid first name';
                setFirstNameError(err);
            } else {
                setFirstNameError(null)
            }
        } 
        else if (target === 'lastName') 
        {
            if (lastName) {
                const err = Helpers.validatePersonName(lastName) ? null : 'Invalid last name';
                setLastNameError(err);
            } else {
                setLastNameError(null)
            }
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
                                title={'Tell us about yourself'}
                                remark={'We need to know a little more about you to get started. This information will be used to create your account, you can change it later.'}
                            />
                            <View>
                                <View style={{ marginBottom: 18 }}>
                                    <RegInputKitty
                                        value={firstName} 
                                        onChangeText={setFirstName} 
                                        label={'First Name'} 
                                        placeholder={'Enter your first name'} 
                                        disabled={false}
                                        iconLeft={<Feather name='user' size={14} color="#bcbcbc" />}
                                        onBlurEvent={(e) => onBlurHandler('firstName')}
                                        onFocusEvent={() => setFirstNameError(null)}
                                        error={firstNameError}
                                    />
                                </View>
                                <View style={{ marginBottom: 18 }}>
                                    <RegInputKitty
                                        value={lastName} 
                                        onChangeText={setLastName} 
                                        label={'Last Name'} 
                                        placeholder={'Enter your last name'} 
                                        disabled={false}
                                        iconLeft={<Feather name='user' size={14} color="#bcbcbc" />}
                                        onBlurEvent={(e) => onBlurHandler('lastName')}
                                        onFocusEvent={() => setLastNameError(null)}
                                        error={lastNameError}
                                    />
                                </View>
                                <View>
                                    <ActionButton 
                                        isLoading={isLoading}
                                        buttonLabel={'Continue'}
                                        onPressEvent={submitInformation}
                                    />
                                </View>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}
