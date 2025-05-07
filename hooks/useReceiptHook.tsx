import React, { RefObject, useCallback, useEffect, useState } from 'react'
import * as FileSystem from 'expo-file-system';
import * as Haptics from 'expo-haptics';
import { useNavigation, useRouter } from 'expo-router';
import { useCameraContext } from '@/contexts/CameraContext';
import useMediaLibraryHook from './useMediaLibraryHook';
import { ReceiptData } from '@/types/ReceiptData';
import { BottomSheetMethods } from '@gorhom/bottom-sheet/lib/typescript/types';

export default function useReceiptHook({
    imageError,
    imageLoading,
    photoContent,
    bottomSheetRef
}: {
    imageError: string|null
    photoContent: string|null
    imageLoading: boolean
    bottomSheetRef: RefObject<BottomSheetMethods>
}) : {
    isLoading: boolean
    waitingVerbiage: string
    isProcessing: boolean
    processResult: boolean|null
    receiptData: ReceiptData|null
    editReceipt: () => void
    tryAgainHandle: () => Promise<void>
    cancelHandle: () => Promise<void>
    onSuccessHandle: () => Promise<void>
    retakePicture: () => Promise<void>
    processReceipt: () => Promise<void>
} {
    const navigation = useNavigation();
    const router = useRouter();
    const cameraContext = useCameraContext();

    const {saveImageToLibrary} = useMediaLibraryHook();

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [waitingVerbiage, setWaitingVerbiage] = useState<string>('');
    const [receiptData, setReceiptData] = useState<ReceiptData | null>(null);

    const [isProcessing, setIsProcessing] = useState<boolean>(false);
    const [processResult, setProcessResult] = useState<boolean|null>(null);

    /**
     * analyze the receipt photo content
     * @param photoContent
     * @returns {Promise<void>}
     */
    const analyzeReceipt = useCallback(async (photoContent: string|null) => {
        try {
            //  if the photo content is not available, return
            if (!photoContent) throw new Error('No photo content available');

            //  close the bottom sheet
            if (imageError) throw new Error(imageError);

            //  convert the photo content to base64
            const base64 = await FileSystem.readAsStringAsync(photoContent, { encoding: FileSystem.EncodingType.Base64 });

            //  set the waiting verbiage
            setWaitingVerbiage('Please wait while your photo is being analyzed.');

            //  initialize the local state
            setProcessResult(null);

            //  analyze the photo content
            setIsLoading(true);
    
            // after 1 second past, update the waiting verbiage
            setTimeout(() => {
                setWaitingVerbiage('Analyzing your photo, almost there...');
            }, 1000);
    
            // after 3 seconds past, update the waiting verbiage
            setTimeout(() => {
                setWaitingVerbiage('Almost there...');
            }, 3000);

            //  send the base64 to the server for analysis
            //  simulate the analysis
            const request: Promise<ReceiptData> = new Promise((res, rej) => {
                setTimeout(() => {
                    try {
                        const data: ReceiptData = {
                            items: [
                                {
                                    name: 'Chicken Tikka Masala',
                                    price: 12.99,
                                    quantity: 1,
                                },
                                {
                                    name: 'Butter Chicken',
                                    price: 14.99,
                                    quantity: 1,
                                },
                                {
                                    name: 'Garlic Naan',
                                    price: 3.99,
                                    quantity: 2,
                                },
                            ],
                            business: {
                                name: 'Lazeez Indian Mediterranean Grill',
                                address: '8560 W Desert Inn Rd, Las Vegas, NV 89117',
                                phone: '(702) 123-4567',
                            },
                            payment: {
                                method: 'Credit Card',
                                cardNumber: '**** 1234',
                                cardType: 'Visa',
                            },
                            amount: [
                                {label: 'sales tax',value: 5.02},
                                {label: 'surcharge',value: 0.65},
                                {label: 'total',value: 64.99},
                                {label: 'tip',value: 5.00},
                            ],
                            grandTotal: 74.99,
                            date: '2023-10-01 12:00 PM',
                        }
                        res(data);
                    } catch (error) {
                        rej(error);
                    }
                }, 5000)
            });

            //  wait for the analysis to be done
            request.then((res: ReceiptData) => {
                setReceiptData(res);
                setWaitingVerbiage('Is this looks correct to you?');
                bottomSheetRef.current?.snapToIndex(1);
            }).catch((err: Error) => {
                bottomSheetRef.current?.snapToIndex(0);
                setWaitingVerbiage('Oops! Unable to analyze your photo at this moment. Please try again.');
                setProcessResult(false);
            });
        } 
        catch (error)
        {
            bottomSheetRef.current?.snapToIndex(0);
            setWaitingVerbiage('Oops! Unable to analyze your photo at this moment. Please try again.');
            setProcessResult(false);
        } 
        finally 
        {
            setIsLoading(false);
        }
    }, []);

    //  listen to the photo content change event
    useEffect(() => {
        if (photoContent) {
            
            //  when the image is loading, return
            if (imageLoading) {
                setIsLoading(true);
                return;
            }
    
            //  analyze the photo content
            analyzeReceipt(photoContent);
        } 
        else 
        {
            setWaitingVerbiage('There is no photo content available for us to analyze. Please take a picture and try again.');
            setProcessResult(false);
        }

        //  close the bottom sheet when the analysis is done
        return () => {
            setIsLoading(false);
            bottomSheetRef.current?.close();
        }

    }, [photoContent, imageLoading]);

    //  listen to state
    useEffect(() =>{
        return () => {
            cameraContext?.setPhotoUri(null);
        }
    }, [])

    /**
     * process the receipt data
     * @description this function will process the receipt data and add it to the account
     * @throws {Error} if no receipt data available
     * @throws {Error} if unable to process the receipt data
     * @returns {Promise<void>}
     */
    const processReceipt = async (): Promise<void> => {
        try {
            //  reset the process result
            setProcessResult(null);

            if (!receiptData) throw new Error('No receipt data available');
            
            //  provide haptic feedback
            await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
            
            //  set the processing state to true
            setIsProcessing(true);

            //  update the waiting verbiage
            bottomSheetRef.current?.snapToIndex(0);

            //  update the waiting verbiage
            setWaitingVerbiage('Adding your receipt record to your account...');

            //  simulate the processing of the receipt
            const request = new Promise((res, rej) => {
                setTimeout(() => {
                    res('done');
                }, 2000);
            });

            //  wait for the processing to be done
            const res = await request;

            //  set process result to success
            setProcessResult(true);

            //  update the waiting verbiage
            setWaitingVerbiage('Your receipt has been added to your account successfully!');
            
        } 
        catch (error: Error | any) 
        {
            //  update the waiting verbiage
            bottomSheetRef.current?.snapToIndex(0);

            //  set process result to failure
            setProcessResult(false);

            //  update the waiting verbiage
            setWaitingVerbiage('Oops! Unable to process your receipt at this moment. Please try again.');
        } 
        finally 
        {
            setIsProcessing(false);
        }
    }

    /**
     * edit the receipt data
     */
    const editReceipt = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    }

    /**
     * try again to process the receipt
     * @description this function will try again to process the receipt data
     * @returns {Promise<void>}
     */
    const tryAgainHandle = async (): Promise<void> => {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

        //  no receipt data available, analyze the receipt again
        if (!receiptData) {
            await analyzeReceipt(photoContent);
            return;
        }

        //  process the receipt data
        await processReceipt();
    }

    /**
     * cancel the process and go back to the camera
     * @description this function will cancel the process and go back to the camera
     * @returns {Promise<void>}
     */
    const cancelHandle = async (): Promise<void> => {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        navigation.goBack();
    }

    /**
     * handle the success of the process
     * @description this function will handle the success of the process
     * @returns {Promise<void>}
     */
    const onSuccessHandle = async (): Promise<void> => {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

        //  save the image to the library
        if (photoContent) await saveImageToLibrary(photoContent);

        //  go back to the account screen
        router.replace('/(tabs)/account');
    }

    /**
     * retake the picture
     * @description this function will retake the picture
     * @returns {Promise<void>}
     */
    const retakePicture = async (): Promise<void> => {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        router.replace('/(camera)/cameraModal');
    }

    return {
        isLoading,
        waitingVerbiage,
        isProcessing,
        processResult,
        receiptData,
        editReceipt,
        tryAgainHandle,
        cancelHandle,
        onSuccessHandle,
        retakePicture,
        processReceipt,
    }
}
