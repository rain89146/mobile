import React, { createContext, useContext, useEffect, useState } from "react";
import { SessionKeys } from "@/constants/SessionKeys";
import useAsyncStorageHook from "@/hooks/useAsyncStorageHook";

type OnBoardingContextType = {
    onBoardingProgress: OnBoardingProgress;
    onBoardingCompleted: boolean;
    updateOnBoardingProgress: (progress: OnBoardingProgress) => Promise<void>;
}

/**
 * The current step of the onboarding process
 * 0: not started
 * 1: location permission - Enable location to get the zip code to determine tax information
 * 2: microphone permission
 * 3: camera permission
 * 4: gallery permission
 * 5: plaid account selection
 * 
 * 'granted': meaning the user has granted the permission
 * 'denied': meaning the user has denied the permission
 * null: meaning the user skipped the permission
 */
export interface OnBoardingProgress {
    step: number;
    location?: boolean | null;
    camera?: boolean | null;
    notification?: boolean | null;
    plaid?: string | null;
}

//  context
const context = createContext<OnBoardingContextType>({
    onBoardingProgress: {
        step: 0,
        location: null,
        camera: null,
        notification: null,
        plaid: null
    },
    onBoardingCompleted: false,
    updateOnBoardingProgress: () => {
        throw new Error("updateOnBoardingProgress function is not implemented");
    }
});

//  hook
export const useOnBoardingContext = () => useContext(context);

//  provider
/**
 * The On-Boarding is not the sign up process, On-Boarding is the process of getting the user to use the app for the first time.
 * 
 * This is the context provider for the use onboarding process
 * Use this context to manage the onboarding process and to store the onboarding state in the storage.
 * 
 * While onboarding: 
 * 1. the user will provide us their permission to access their location, microphone, camera, and gallery.
 * 2. ask the user to pick their bank account from Plaid
 * @param param0 
 * @returns 
 */
export const OnBoardingContextProvider = ({children}: {children: React.ReactNode}) => {

    //  local state
    const [onBoardingCompleted, setOnBoardingCompleted] = useState<boolean>(false);
    const [onBoardingProgress, setOnBoardingProgress] = useState<OnBoardingProgress>({
        step: 0,
        location: null,
        camera: null,
        notification: null,
        plaid: null
    });

    //  storage
    const {
        storeDataIntoStorage, 
        getDataFromStorage
    } = useAsyncStorageHook();

    //  when mount, query the local storage to check
    useEffect(() => {
        const loadOnBoardingProgress = async () => {
            try {
                const progress = await getDataFromStorage(SessionKeys.ON_BOARDING_KEY) as OnBoardingProgress;
                if (progress)
                {
                    setOnBoardingProgress(progress);
                }     
            } catch (error) {
                console.log("OnBoardingContextProvider: on mount", error);
            }
        }
        loadOnBoardingProgress();
    }, []);

    /**
     * Update the onboarding progress
     * @param progress 
     */
    const updateOnBoardingProgress = async (progress: OnBoardingProgress) => {
        setOnBoardingProgress({
            ...onBoardingProgress,
            ...progress
        });
        
        await storeDataIntoStorage(SessionKeys.ON_BOARDING_KEY, {
            ...onBoardingProgress,
            ...progress
        });

        if (progress.step === 6)
        {
            setOnBoardingCompleted(true);
        }
    }

    return (
        <context.Provider value={{
            onBoardingProgress,
            onBoardingCompleted,
            updateOnBoardingProgress,
        }}>
            {children}
        </context.Provider>
    )
}