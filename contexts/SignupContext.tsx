import React, { createContext, useContext, useEffect, useState } from "react";
import { ApiResponse } from "@/types/ApiResponse";
import { authCredential } from "./AuthenticationContext";

export interface SignupPayload {
    recordId?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    emailVerificationCode?: string;
    password?: string;
}

export type SignupContextType = {
    signUpPayload: SignupPayload| null;
    setSignUpPayload: (payload: SignupPayload | null) => void;
    sendVerificationCode: (email: string) => Promise<ApiResponse<boolean>>;
    verifyConfirmationCode: (code: string) => Promise<ApiResponse<boolean>>;
    storePersonalInformation: (recordId: string, firstName: string, lastName: string) => Promise<ApiResponse<boolean>>;
    generateSignUpRecord: (email: string) => Promise<ApiResponse<string>>;
    createAccount: (recordId: string, password: string) => Promise<ApiResponse<boolean>>;
    loginWithRecordId: (recordId: string) => Promise<ApiResponse<authCredential>>;
}

export const context = createContext<SignupContextType>({
    signUpPayload: null,
    setSignUpPayload: () => {},
    sendVerificationCode: async () => {
        return {
            status: false,
            message: '',
            exception: '',
            response: false
        } as ApiResponse<boolean>;
    },
    verifyConfirmationCode: async () => {
        return {
            status: false,
            message: '',
            exception: '',
            response: false
        } as ApiResponse<boolean>;
    },
    storePersonalInformation: async () => {
        return {
            status: false,
            message: '',
            exception: '',
            response: false
        } as ApiResponse<boolean>;
    },
    generateSignUpRecord: async () => {
        return {
            status: false,
            message: '',
            exception: '',
            response: ''
        } as ApiResponse<string>;
    },
    createAccount: async () => {
        return {
            status: false,
            message: '',
            exception: '',
            response: false
        } as ApiResponse<boolean>;
    },
    loginWithRecordId: async () => {
        return {
            status: false,
            message: '',
            exception: '',
            response: {
                authProvider: 'email',
                authorizationCode: '',
                identityToken: '',
                userId: '',
            }
        } as ApiResponse<authCredential>;
    }
});

export const useSignupContext = () => useContext(context);

export const SignupContextProvider = ({children}: {children: React.ReactNode}) => {

    //  local state
    const [signUpPayload, setSignUpPayload] = useState<SignupPayload | null>(null);
    
    //
    useEffect(() => {
        console.log('SignupContextProvider mounted');
        //  get the auth credentials from the storage
        return () => {
            console.log('SignupContextProvider unmounted');
        }
    }, []);

    /**
     * Generate record id for the app to track sign up process
     * @param email - email address
     * @returns 
     */
    const generateSignUpRecord = async (email: string): Promise<ApiResponse<string>> => {
        try {
            // simulate sending verification code
            const apiRequest: Promise<ApiResponse<string>> = new Promise((resolve) => {
                setTimeout(() => {
                    resolve({
                        status: true,
                        message: '',
                        exception: '',
                        response: '123456'
                    } as ApiResponse<string>);
                }, 2000);
            });
            return await apiRequest;
        } 
        catch (error) 
        {
            throw error;
        }
    }

    /**
     * Send verification code to the email address
     * @description send verification code to the email address
     * @param email - email address
     * @returns ApiResponse<boolean>
     */
    const sendVerificationCode = async (email: string): Promise<ApiResponse<boolean>> => {
        try {
            // simulate sending verification code
            const apiRequest: Promise<ApiResponse<boolean>> = new Promise((resolve) => {
                setTimeout(() => {
                    resolve({
                        status: true,
                        message: '',
                        exception: '',
                        response: true
                    } as ApiResponse<boolean>);
                }, 2000);
            });
            return await apiRequest;
        } 
        catch (error) 
        {
            throw error;
        }
    }

    /**
     * Send verification code to the email address
     * @description send verification code to the email address
     * @param email - email address
     * @returns ApiResponse<boolean>
     */
    const verifyConfirmationCode = async (code: string): Promise<ApiResponse<boolean>> => {
        try {
            // simulate sending verification code
            const apiRequest: Promise<ApiResponse<boolean>> = new Promise((resolve) => {
                setTimeout(() => {
                    resolve({
                        status: true,
                        message: '',
                        exception: '',
                        response: (code === '123456')
                    } as ApiResponse<boolean>);
                }, 2000);
            });
            return await apiRequest;
        } 
        catch (error) 
        {
            throw error;
        }
    }

    /**
     * Store personal information into the database
     * @param firstName - first name
     * @param lastName - last name
     * @returns ApiResponse<boolean>
     */
    const storePersonalInformation = async (recordId: string, firstName: string, lastName: string): Promise<ApiResponse<boolean>> => {
        try {
            // simulate sending verification code
            const apiRequest: Promise<ApiResponse<boolean>> = new Promise((resolve) => {
                setTimeout(() => {
                    resolve({
                        status: true,
                        message: '',
                        exception: '',
                        response: true
                    } as ApiResponse<boolean>);
                }, 2000);
            });
            return await apiRequest;
        } 
        catch (error) 
        {
            throw error;
        }
    }

    /**
     * Complete sign up process
     * @param email - email address
     * @param password - password
     * @param firstName - first name
     * @param lastName - last name
     * @returns ApiResponse<boolean>
     */
    const createAccount = async (recordId: string, password: string): Promise<ApiResponse<boolean>> => {
        try {
            const apiRequest: Promise<ApiResponse<boolean>> = new Promise((resolve) => {
                setTimeout(() => {
                    resolve({
                        status: true,
                        message: '',
                        exception: '',
                        response: true
                    } as ApiResponse<boolean>);
                }, 2000);
            });
            return await apiRequest;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Login with record id
     * @description this login method is used to login the user with the record id ONLY during the sign up process
     * @param recordId - record id
     * @returns ApiResponse<authCredential>
     */
    const loginWithRecordId = async (recordId: string): Promise<ApiResponse<authCredential>> => {
        try {
            const apiRequest: Promise<ApiResponse<authCredential>> = new Promise((resolve) => {
                setTimeout(() => {
                    resolve({
                        status: true,
                        message: '',
                        exception: '',
                        response: {
                            authProvider: 'email',
                            authorizationCode: 'mock.authorizationCode',
                            identityToken: 'mock.identityToken',
                            userId: 'mock.userId',
                        }
                    } as ApiResponse<authCredential>);
                }, 2000);
            });
            return await apiRequest;
            
        } catch (error) {
            throw error;
        }
    }

    return (
        <context.Provider value={{
            signUpPayload,
            setSignUpPayload,
            sendVerificationCode,
            verifyConfirmationCode,
            storePersonalInformation,
            generateSignUpRecord,
            createAccount,
            loginWithRecordId
        }}>
            {children}
        </context.Provider>
    )
}