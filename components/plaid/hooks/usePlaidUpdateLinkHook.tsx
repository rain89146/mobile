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

import { useState, useEffect } from 'react';
import { PlaidService } from '@/services/PlaidService';
import { useAuthContext } from '@/contexts/AuthenticationContext';

interface PlaidHookReturn {
    isDisabled: boolean;
    error: string | null;
    isLoading: boolean;
    openPlaidLink: () => void;
}

class UnauthorizedUserError extends Error {
    constructor() {
        super();
        this.name = this.constructor.name;
        this.message = 'User is not authenticated. Please log in first.';
    }
}

class UserIdNotFoundError extends Error {
    constructor() {
        super();
        this.name = this.constructor.name;
        this.message = 'User ID is not available. Please log in first.';
    }
}

export default function usePlaidUpdateLinkHook({itemId, setPlaidLinkFlowCompleted}: { itemId: string; setPlaidLinkFlowCompleted: (completed: boolean) => void; }): PlaidHookReturn
{
    const authContext = useAuthContext();

    const [isDisabled, setIsDisabled] = useState<boolean>(false);
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
            const {userId} = authContext.authCredential;

            //  if the user ID is not available, throw an error
            if (!userId) throw new UserIdNotFoundError();

            //  create a Plaid Link token using the PlaidService
            const newLinkToken = await PlaidService.createPlaidLinkTokenForUpdate(userId, itemId);
            
            //  return the link token
            return newLinkToken;
        } 
        catch (error: unknown) 
        {
            console.error('usePlaidUpdateLinkHook: createLinkToken: error', error);

            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError('An unknown error occurred while creating the Plaid Link token.');
            }

            return null;
        }
    };

    /**
     * Initializes the Plaid Link with the provided link token.
     * @param linkToken - The Plaid Link token to initialize the Plaid Link.
     */
    const initPlaidLink = async (linkToken: string) => {
        try {
            // First dismiss any existing link to reset state
            dismissLink();

            const config: LinkTokenConfiguration = {
                token: linkToken,
                noLoadingState: false,
                logLevel: LinkLogLevel.INFO,
            }
            create(config);

            // Plaid Link is ready to be opened
            setIsLoading(false);
            setIsDisabled(false);
        } 
        catch (error) 
        {
            console.error('usePlaidUpdateLinkHook: initPlaidLink: error', error);
            setError('Failed to initialize Plaid Link');
            setIsLoading(false);
            setIsDisabled(true);
        }
    }

    /**
     * Handles the success event from Plaid Link.
     * @description This function is called when the user successfully connects their bank account through Plaid Link.
     * @param success 
     */
    const handlePlaidSuccess = async (success: LinkSuccess) => {
        try {
            setIsLoading(true);
            setIsDisabled(true);

            if (success && success.publicToken) 
            {
                if (authContext.authCredential?.dopa.accessToken) 
                {
                    PlaidService.updatePlaidItem(authContext.authCredential?.dopa.accessToken, itemId, success.publicToken);
                    setPlaidLinkFlowCompleted(true);
                }
            }
        } 
        catch (error) 
        {
            console.error('usePlaidUpdateLinkHook: handlePlaidSuccess: error:', error);
        } 
        finally 
        {
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
    const handlePlaidExit = ({error}: LinkExit): void => {
        
        // dismiss the Plaid Link
        dismissLink();

        // reset the Plaid Link state
        resetPlaidLink();
    }

    /**
     * Resets the Plaid Link state.
     */
    const resetPlaidLink = () => {
        setIsDisabled(false);
        setIsLoading(false);
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
     * Opens the Plaid Link flow.
     * @description This function is called to open the Plaid Link flow.
     */
    const openPlaidLink = async () => {
        try {
            //  reset
            setIsLoading(true);
            setIsDisabled(true);
            setError(null);

            // Create a new link token
            const newLinkToken = await createLinkToken();
            if (newLinkToken === null) throw new Error('Failed to create a new Plaid Link token');

            // Initialize the Plaid Link with the new token
            await initPlaidLink(newLinkToken);

            // Enable the button
            setIsDisabled(false);
            setIsLoading(false);

            // Open the Plaid Link flow
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
    }
    
    return {
        isDisabled,
        error,
        isLoading,
        openPlaidLink
    }
}