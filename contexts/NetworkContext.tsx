import { ApiResponse } from "@/types/ApiResponse";
import React, {createContext, useContext} from "react";

type NetworkContextType = {
    getPlaidLinkToken: (userId: string) => Promise<string>;
    exchangePlaidPublicToken: (userId: string, publicToken: string) => Promise<string>;
}

const NetworkContext = createContext<NetworkContextType>({
    getPlaidLinkToken: async () => {
        throw new Error("getPlaidLinkToken not implemented");
    },
    exchangePlaidPublicToken: async () => {
        throw new Error("exchangePlaidPublicToken not implemented");
    }
});

// This context can be used to manage network-related state or effects
const NetworkContextProvider = ({children}: {children: React.ReactNode}) => {
    const backendUrlBase = 'http://localhost:8080';

    /**
     * Gets a Plaid Link token from the backend.
     * @param user_id userId is the unique identifier for the user in your application.
     * @returns linkToken is a string that is used to initialize the Plaid Link flow.
     */
    const getPlaidLinkToken = async (user_id: string): Promise<string> => {
        console.log(user_id)
        try {
            const response = await fetch(`${backendUrlBase}/auth/createLinkToken`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ user_id }),
            })

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json() as ApiResponse<string>;

            if (!data.status) {
                throw new Error(data.message || 'Failed to fetch Plaid Link token');
            }

            return data.response;
        } 
        catch (error: unknown) 
        {
            if (error instanceof Error) {
                console.error('Error fetching Plaid Link token:', error.message);
            } else {
                console.error('Error fetching Plaid Link token:', error);
            }
            throw error;
        }
    }

    /**
     * Exchanges a Plaid public token for an access token.
     * @param user_id userId is the unique identifier for the user in your application.
     * @param public_token public_token is the token returned by Plaid Link after a user successfully connects their bank account.
     * @returns 
     */
    const exchangePlaidPublicToken = async (user_id: string, public_token: string): Promise<string> => {
        try {
            const response = await fetch(`${backendUrlBase}/auth/exchangePublicToken`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ user_id, public_token }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json() as ApiResponse<string>;

            if (!data.status) {
                throw new Error(data.message || 'Failed to exchange Plaid public token');
            }

            return data.response;
        } 
        catch (error: unknown) 
        {
            if (error instanceof Error) {
                console.error('Error exchanging Plaid public token:', error.message);
            } else {
                console.error('Error exchanging Plaid public token:', error);
            }
            throw error;
        }
    }

    
    return (
        <NetworkContext.Provider value={{
            getPlaidLinkToken,
            exchangePlaidPublicToken
        }}>
            {children}
        </NetworkContext.Provider>
    )
}

const useNetworkContext = () => useContext(NetworkContext);

export {NetworkContextProvider, useNetworkContext, NetworkContextType};