import React, { createContext, useContext, useState } from "react";

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
}

export const context = createContext<SignupContextType>({
    signUpPayload: null,
    setSignUpPayload: () => {},
});

export const SignupContextProvider = ({children}: {children: React.ReactNode}) => {

    //  local state
    const [signUpPayload, setSignUpPayload] = useState<SignupPayload | null>(null);

    return (
        <context.Provider value={{
            signUpPayload,
            setSignUpPayload,
        }}>
            {children}
        </context.Provider>
    )
}

export const useSignupContext = () => useContext(context);