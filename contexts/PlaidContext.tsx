import React, {createContext, useContext, useState} from "react";

export interface IPlaidContext {
    tokens: string[];
}

const PlaidContext = createContext<IPlaidContext>({
    tokens: []
});

const PlaidContextProvider = ({children}: {children: React.ReactNode}) => {

    const [tokens, setTokens] = useState<string[]>([]);
    
    return (
        <PlaidContext.Provider value={{
            tokens,
        }}>
            {children}
        </PlaidContext.Provider>
    )
}

const usePlaidContext = () => useContext(PlaidContext);

export {PlaidContextProvider, usePlaidContext};