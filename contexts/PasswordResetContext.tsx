import React, {createContext, useContext, useEffect, useState} from "react";

interface PasswordResetContextType {
  email: string|null;
  setEmail: (email: string) => void;
}

const PasswordResetContext = createContext<PasswordResetContextType>({
    email: "",
    setEmail: (email: string) => {},
});

const PasswordResetContextProvider = ({children}: {children: React.ReactNode}) => {

    const [email, setEmail] = useState<string|null>(null);

    useEffect(() => {
        return () => {
            setEmail(null);
        }
    }, [])
    
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