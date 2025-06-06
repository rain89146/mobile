import React, {createContext, useContext, useState} from "react";

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