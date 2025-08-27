import { PlaidAccountOverview } from "@/types/PlaidObjects";
import React, { createContext, useContext, useState } from "react";

export type BankPageContextType = {
    institution: PlaidAccountOverview | null;
    setInstitution: (institution: PlaidAccountOverview | null) => void;
}

const BankPageContext = createContext<BankPageContextType>({
    institution: null,
    setInstitution: () => {},
});

const BankPageContextProvider = ({children}: {children: React.ReactNode}) => {

    const [institution, setInstitution] = useState<PlaidAccountOverview | null>(null);

    return (
        <BankPageContext.Provider value={{
            institution,
            setInstitution,
        }}>{children}</BankPageContext.Provider>
    )
}

const useBankPageContext = () => useContext(BankPageContext);

export {BankPageContextProvider, useBankPageContext};