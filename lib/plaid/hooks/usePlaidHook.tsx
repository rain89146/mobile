import {
  LinkExit,
  LinkEvent,
  LinkLogLevel,
  LinkSuccess,
  dismissLink,
  LinkOpenProps,
  usePlaidEmitter,
  LinkIOSPresentationStyle,
  LinkTokenConfiguration,
  FinanceKitError,
  create,
  open,
  syncFinanceKit,
  submit,
  SubmissionData,
} from 'react-native-plaid-link-sdk';

import { useState, useEffect, useCallback } from 'react';
import { Platform } from 'react-native';
import { useNetworkContext } from '@/contexts/NetworkContext';
import { NativeModules } from 'react-native';

interface PlaidHookReturn {
    isDisabled: boolean;
    error: string | null;
    isLoading: boolean;
    handleOpenLink: () => void;
}

export default function usePlaidHook(): PlaidHookReturn
{
    const {getPlaidLinkToken, exchangePlaidPublicToken} = useNetworkContext();
    const [linkToken, setLinkToken] = useState<string | null>(null);
    const [isDisabled, setIsDisabled] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    
    // Replace with actual user ID or context
    const userId = '1234567890'; 

    console.log("PlaidLink NativeModule:", NativeModules.PlaidLink);

    /**
     * This function creates a Plaid Link token by making a request to the backend.
     */
    const createLinkToken = useCallback(async () => {
        try {
            setIsLoading(true);

            //  get the Plaid Link token from the backend
            const linkToken = await getPlaidLinkToken(userId);
            setLinkToken(linkToken);
            console.log('usePlaidHook: createLinkToken: linkToken', linkToken);
        } 
        catch (error: unknown) 
        {
            console.error('usePlaidHook: createLinkToken: error', error);

            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError('An unknown error occurred while creating the Plaid Link token.');
            }

            setLinkToken(null);
            setIsLoading(false);
        }
    }, [setLinkToken]);

    /**
     * Initializes the Plaid Link with the provided link token.
     * @param linkToken - The Plaid Link token to initialize the Plaid Link.
     */
    const initPlaidLink = useCallback(async (linkToken: string) => {
        try {
            const config: LinkTokenConfiguration = {
                token: linkToken,
                noLoadingState: false,
                logLevel: LinkLogLevel.INFO,
            }
            create(config);
            console.log('usePlaidHook: plaid initialized:');
            // Plaid Link is ready to be opened
            setIsLoading(false);
            setIsDisabled(false);
        } 
        catch (error) 
        {
            console.error('usePlaidHook: initPlaidLink: error', error);
            setError('Failed to initialize Plaid Link');
            setIsLoading(false);
            setIsDisabled(true);
        }
    }, [])

    // This effect runs when the component mounts to create a Plaid Link token.
    useEffect(() => {
        if (linkToken === null) {
            createLinkToken();
        } else {
            initPlaidLink(linkToken);
        }
    }, [linkToken]);

    /**
     * Handles the success event from Plaid Link.
     * @description This function is called when the user successfully connects their bank account through Plaid Link.
     * @param success 
     */
    const handlePlaidSuccess = async (success: LinkSuccess) => {
        try {
            console.log('Plaid Link success:', success);
            setIsLoading(true);
            setIsDisabled(true);

            //  check if the success object contains a public token
            const {publicToken} = success;
            if (!publicToken) 
            {
                throw new Error('No public token received from Plaid Link');
            }

            //  exchange the public token for an access token
            const response = await exchangePlaidPublicToken(userId, publicToken);
            console.log('Plaid Link success:', response);

            //  navigate to next screen
        } 
        catch (error) 
        {
            console.error('Plaid Link success handler error:', error);
        } 
        finally 
        {
            setIsLoading(false);
            dismissLink();
        }
    }

    /**
     * Handles the exit event from Plaid Link.
     * @description This function is called when the user exits the Plaid Link flow.
     * @param exit 
     */
    const handlePlaidExit = (linkExit: LinkExit): void => {
        const report = {
            error: linkExit.error,
            institution: linkExit.metadata.institution,
            linkSessionId: linkExit.metadata.linkSessionId,
            requestId: linkExit.metadata.requestId,
            status: linkExit.metadata.status,
        }
        console.log('Plaid Link exit:', report);
        dismissLink();
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

    const handleOpenLink = () => {
        console.log('Opening Plaid Link...');
        try {
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