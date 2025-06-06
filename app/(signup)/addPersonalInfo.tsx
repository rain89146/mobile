import { RegInputKitty } from '@/components/form/input/InputKitty';
import { ActionButton, BackButton } from '@/components/ui/ActionButtons';
import { TitleAndRemark } from '@/components/ui/ContentComp';
import { useAuthContext } from '@/contexts/AuthenticationContext';
import { useSignupContext } from '@/contexts/SignupContext';
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

export default function addPersonalInfo() {

    const signupContext = useSignupContext();
    const navigation = useNavigation();
    const router = useRouter();

    const [isLoading, setIsLoading] = React.useState(false);
    const [firstName, setFirstName] = React.useState<string>('');
    const [firstNameError, setFirstNameError] = React.useState<string|null>(null);
    const [lastName, setLastName] = React.useState<string>('');
    const [lastNameError, setLastNameError] = React.useState<string|null>(null);

    // set the header to false
    React.useEffect(() => {
        navigation.setOptions({ headerShown: false })
    }, [])

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

            //  store in the context
            signupContext.setSignUpPayload({...signupContext.signUpPayload, firstName, lastName });

            //  store personal information
            const response = await signupContext.storePersonalInformation(signupContext.signUpPayload.recordId as string, firstName, lastName);

            //  check if response is successful
            if (!response.result) throw new Error(response.message);

            //  check if response is successful
            if (!response.response) throw new Error('Unable to store personal information');

            //  provide feedback to user
            Helpers.impactSoftFeedback();

            //  navigate to the next screen
            router.replace('/(signup)/createPassword');

        } 
        catch (error: Error|any) 
        {
            Helpers.notificationErrorFeedback();

            if (error.name === 'FirstNameError')
            {
                setFirstNameError(error.message);
            } 
            else if (error.name === 'LastNameError') 
            {
                setLastNameError(error.message);
            }
            else 
            {
                console.log('Error signing up with email', error);
                Alert.alert('Something went wrong', error.message);
            }
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
                Helpers.validatePersonName(firstName) ? setFirstNameError(null) : setFirstNameError('Invalid first name');
            } else {
                setFirstNameError(null)
            }
        } 
        else if (target === 'lastName') 
        {
            if (lastName) {
                Helpers.validatePersonName(lastName) ? setLastNameError(null) : setLastNameError('Invalid last name');
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
