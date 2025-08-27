import {
  LinkExit,
  LinkLogLevel,
  LinkSuccess,
  dismissLink,
  LinkOpenProps,
  LinkIOSPresentationStyle,
  LinkTokenConfiguration,
  create,
  open,
} from 'react-native-plaid-link-sdk';

import { useState, useEffect, use } from 'react';
import { PlaidService } from '@/services/PlaidService';
import { useAuthContext } from '@/contexts/AuthenticationContext';

interface PlaidHookReturn {
    isDisabled: boolean;
    error: string | null;
    isLoading: boolean;
    handleOpenLink: () => void;
}

class UnauthorizedUserError extends Error {
    constructor() {
        super();
        this.name = this.constructor.name;
        this.message = 'User is not authenticated. Please log in first.';
    }
}

export default function usePlaidBankIncomeLinkHook(shouldRefresh: boolean, itemId?: string|null, ): PlaidHookReturn
{
    const authContext = useAuthContext();

    const [linkToken, setLinkToken] = useState<string | null>(null);
    const [isDisabled, setIsDisabled] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    /**
     * This function creates a Plaid Link token by making a request to the backend.
     */
    const createLinkToken = async () => {
        try {
            setIsLoading(true);

            //  check if the user is authenticated
            if (!authContext.authCredential) throw new UnauthorizedUserError();
            
            //  get the user ID from the auth context
            const {dopa: {accessToken}} = authContext.authCredential;

            //  if the user ID is not available, throw an error
            if (!accessToken) throw new UnauthorizedUserError();

            //  create a Plaid Link token using the PlaidService
            const newLinkToken = await PlaidService.createPlaidLinkTokenForBankIncome(accessToken, itemId);

            //  set the link token in the state
            setLinkToken(newLinkToken);
        } 
        catch (error: unknown) 
        {
            console.error('usePlaidBankIncomeLinkHook: createLinkToken: error', error);

            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError('An unknown error occurred while creating the Plaid Link token.');
            }

            setLinkToken(null);
            setIsLoading(false);
        }
    }

    /**
     * Initializes the Plaid Link with the provided link token.
     * @param linkToken - The Plaid Link token to initialize the Plaid Link.
     */
    const initPlaidLink = async (linkToken: string) => {
        try {
            // First dismiss any existing link to reset state
            dismissLink();

            // Create the configuration for Plaid Link
            const config: LinkTokenConfiguration = {
                token: linkToken,
                noLoadingState: false,
                logLevel: LinkLogLevel.INFO,
            };
            create(config);

            // Plaid Link is ready to be opened
            setIsLoading(false);
            setIsDisabled(false);
        } 
        catch (error) 
        {
            console.error('usePlaidBankIncomeLinkHook: initPlaidLink: error', error);
            setError('Failed to initialize Plaid Link');
            setIsLoading(false);
            setIsDisabled(true);
        }
    }

    // Reset Plaid Link state if shouldRefresh is true
    useEffect(() => {
        console.log(shouldRefresh, 'shouldRefresh');
        if (shouldRefresh) {
            dismissLink();
            setLinkToken(null);
            setIsDisabled(true);
            setIsLoading(false);
            setError(null);
        }
    }, [shouldRefresh]);

    // This effect runs when the component mounts to create a Plaid Link token.
    useEffect(() => {
        (async ()=>{
            if (!linkToken) 
            {
                await createLinkToken();
            } 
            else 
            {
                await initPlaidLink(linkToken);
            }
        })()
    }, [linkToken]);

    /**
     * Handles the success event from Plaid Link.
     * @description This function is called when the user successfully connects their bank account through Plaid Link.
     * @param success 
     */
    const handlePlaidSuccess = async (success: LinkSuccess) => {
        try {
            setIsLoading(true);
            setIsDisabled(true);

            //  check if the user is authenticated
            if (!authContext.authCredential) throw new UnauthorizedUserError();

            // get access token from the success object
            const accessToken = authContext.authCredential?.dopa?.accessToken;

            // if the access token is not available, throw an error
            if (!accessToken) throw new UnauthorizedUserError();

            // send request to process the bank income data
            await PlaidService.processIncomeData(accessToken, success.publicToken, itemId);
        } 
        catch (error) 
        {
            console.error('usePlaidBankIncomeLinkHook: handlePlaidSuccess: error:', error);
        } 
        finally 
        {
            setLinkToken(null);
            setIsDisabled(false);
            setIsLoading(false);
            setError(null);
            dismissLink();
        }
    }

    /**
     * Handles the exit event from Plaid Link.
     * @description This function is called when the user exits the Plaid Link flow.
     * @param exit 
     */
    const handlePlaidExit = (linkExit: LinkExit): void => {

        // dismiss the Plaid Link UI
        dismissLink();

        // Log the exit event
        resetPlaidLink();

        // when the user exits the Plaid Link flow, we can check for errors
        if (linkExit.error) 
        {
            if (linkExit.error.errorCode === 'INVALID_LINK_TOKEN')
            {
                createLinkToken();
            }
        }
    }

    /**
     * Resets the Plaid Link state.
     */
    const resetPlaidLink = () => {
        setIsDisabled(false);
        setIsLoading(false);
        setLinkToken(null);
        setError(null);
    }

    /**
     * Opens the Plaid Link flow.
     * @description This function is called to open the Plaid Link flow.
     */
    const createLinkOpenProps = (): LinkOpenProps => {
        return {
            onSuccess: (success: LinkSuccess) => handlePlaidSuccess(success),
            onExit: (exit: LinkExit) => handlePlaidExit(exit),
            iOSPresentationStyle: LinkIOSPresentationStyle.FULL_SCREEN,
            logLevel: LinkLogLevel.INFO,
        }
    };

    /**
     * Handles the opening of the Plaid Link flow.
     */
    const handleOpenLink = () => {
        try {
            // Explicitly dismiss any existing link first
            dismissLink();

            setIsLoading(true);
            setIsDisabled(true);

            const openProps = createLinkOpenProps();
            open(openProps);

        } 
        catch (error) {
            console.error('Error opening Plaid Link:', error);
            setError('Failed to open Plaid Link');
        } 
        finally {
            setIsLoading(false);
        }
    };
    
    return {
        isDisabled,
        error,
        isLoading,
        handleOpenLink
    }
}