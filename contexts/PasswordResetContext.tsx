import { GeneralContextReducer } from "@/store/GeneralContextReducer";
import React, {createContext, useContext, useEffect, useRef, useState} from "react";
import { AppState, Platform } from "react-native";

const PasswordResetContext = createContext({
    email: "",
    setEmail: (email: string) => {},
});

const PasswordResetContextProvider = ({children}: {children: React.ReactNode}) => {

    const [email, setEmail] = useState<string>("");
    
    return (
        <PasswordResetContext.Provider value={{
            email,
            setEmail
        }}>
            {children}
        </PasswordResetContext.Provider>
    )
}

const usePasswordResetContext = () => useContext(PasswordResetContext);

export {PasswordResetContextProvider, usePasswordResetContext};