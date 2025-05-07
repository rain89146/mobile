import { useNavigation, useRouter } from 'expo-router';
import { useEffect, useRef, RefObject, useState, useCallback, Children } from 'react';
import {View, Text, TouchableOpacity} from 'react-native'
import { BottomSheetMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import BottomSheet, { BottomSheetBackdrop, BottomSheetScrollView, BottomSheetView } from '@gorhom/bottom-sheet';
import {ImageComp, NoImagePlaceholder} from '@/components/image/ImageComp';
import useImageHook from '@/components/image/useImageHook';
import Ionicons from '@expo/vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import * as FileSystem from 'expo-file-system';
import * as Haptics from 'expo-haptics';
import { ReceiptContent } from '@/components/reciept/ReceiptContent';
import { ReceiptData } from '@/types/ReceiptData';
import useMediaLibraryHook from '@/hooks/useMediaLibraryHook';
import { useCameraContext } from '@/contexts/CameraContext';
import useReceiptHook from '@/hooks/useReceiptHook';

export default function cameraPreview() {

    const bottomSheetRef: RefObject<BottomSheetMethods> = useRef<BottomSheet>(null);
    const navigation = useNavigation();
    const cameraContext = useCameraContext();
    const {photoUri: photo} = cameraContext!;

    const {
        imageError,
        isLoading,
        setImageError,
        setIsLoading,
        setLoadingProgress,
        setPhotoProp,
    } = useImageHook();

    useEffect(() => {
        navigation.setOptions({ 
            headerShown: false,
        });
    }, [navigation]);

    //  bottom sheet backdrop
    const bottomSheetBackdrop = (props: any) => {
        return (
            <BottomSheetBackdrop
                {...props}
                appearsOnIndex={1}
                disappearsOnIndex={0}
                enableTouchThrough={false}
                opacity={0.75}
                pressBehavior={'none'}
            />
        )
    }

    //  open the bottom sheet when the image is displayed
    const openBottomSheet = () => bottomSheetRef.current?.snapToIndex(0)
    
    //  display the photo
    return (
        <LinearGradient 
            colors={['#4c669f', '#3b5998', '#192f6a']}
            style={{
                flex: 1,
                width: '100%',
                height: '100%',
                position: 'relative',
                backgroundColor: '#000',
            }}
        >
            <View style={{
                width: '100%',
                height: '70%',
                position: 'relative',
            }}>
                {
                    photo ? <ImageComp 
                        photo={photo} 
                        setImageLoading={setIsLoading}
                        setPhotoProp={setPhotoProp}
                        onImageDisplay={() => openBottomSheet()}
                        onImageError={(error: string) => setImageError(error)}
                        onImageLoadingProgress={(progress: number) => setLoadingProgress(progress)}
                    /> : <NoImagePlaceholder/>
                }
            </View>
            <BottomSheet
                ref={bottomSheetRef}
                snapPoints={['35%', '75%']}
                style={{zIndex: 100}}
                enablePanDownToClose={false}
                enableContentPanningGesture={false}
                enableHandlePanningGesture={false}
                enableDynamicSizing={false}
                backdropComponent={bottomSheetBackdrop}
                index={0}
            >
                <BottomSheetView style={{ flex: 1 }}>
                    <BottomSheetScrollView style={{ width: '100%' }}>
                        <ContentPreview 
                            imageError={imageError}
                            photoContent={photo as string}
                            imageLoading={isLoading}
                            bottomSheetRef={bottomSheetRef}
                        />
                    </BottomSheetScrollView>
                </BottomSheetView>
            </BottomSheet>
        </LinearGradient>
    )
}

function ContentPreview({
    imageError,
    imageLoading,
    photoContent,
    bottomSheetRef
}: {
    imageError: string|null
    photoContent: string|null
    imageLoading: boolean
    bottomSheetRef: RefObject<BottomSheetMethods>
}) {
    const {
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
    } = useReceiptHook({
        imageError,
        imageLoading,
        photoContent,
        bottomSheetRef,
    })
    
    return (
        <View style={{
            flex: 1,
            width: '100%',
            height: '100%',
            position: 'relative',
            paddingTop: 20,
            paddingBottom: 40,
        }}>
            <View>
                <BottomSheetHeader waitingVerbiage={waitingVerbiage} />
                {
                    processResult === true && 
                    <SuccessResult onSuccessHandle={() => onSuccessHandle()}/>
                }
                {
                    processResult === false && 
                    <ErrorResult tryAgainHandle={() => tryAgainHandle()} cancelHandle={() => cancelHandle()}/>
                }
                {
                    !isLoading && 
                    isProcessing === false && 
                    processResult === null &&
                    <ReceiptContent 
                        receiptData={receiptData}
                        isProcessing={isProcessing}
                        processReceipt={processReceipt}
                        retakeReceipt={retakePicture}
                    />
                }
            </View>
        </View>
    )
}

function BottomSheetHeader({waitingVerbiage}: {waitingVerbiage: string}) {
    return (
        <View style={{
            paddingLeft: 30,
            paddingRight: 30,
            paddingBottom: 20,
        }}>
            <Text
                style={{
                    fontSize: 25,
                    color: '#000',
                }}
            >
                {waitingVerbiage}
            </Text>
        </View>
    )
}

function SuccessResult({
    onSuccessHandle
}: {
    onSuccessHandle: () => void
}) {
    return (
        <View style={{
            padding: 30,
            paddingTop: 10,
        }}>
            <TouchableOpacity
                onPress={onSuccessHandle}
                style={{
                    backgroundColor: '#000',
                    padding: 15,
                    borderRadius: 5,
                    marginTop: 20,
                }}
            >
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 10,
                    }}
                >
                    <Ionicons name='checkmark-circle' size={16} color="#fff" />
                    <Text
                        style={{
                            color: '#fff',
                            fontSize: 16,
                            fontWeight: 'bold',
                            textAlign: 'center',
                        }}
                    >Done</Text>
                </View>
            </TouchableOpacity>
        </View>
    )
}

function ErrorResult({
    tryAgainHandle,
    cancelHandle
}: {
    tryAgainHandle: () => void
    cancelHandle: () => void
}) {
    return (
        <View style={{
            padding: 30,
            paddingTop: 0,
            flexDirection: 'column',
        }}>
            <TouchableOpacity
                onPress={tryAgainHandle}
                style={{
                    backgroundColor: '#000',
                    padding: 15,
                    borderRadius: 5,
                    marginTop: 20,
                }}
            >
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <Text
                        style={{
                            color: '#fff',
                            fontSize: 16,
                            fontWeight: 'bold',
                            textAlign: 'center',
                        }}
                    >Try again</Text>
                </View>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={cancelHandle}
                style={{
                    paddingTop: 10,
                }}
            >
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <Text
                        style={{
                            color: 'red',
                            fontSize: 16,
                            textAlign: 'center',
                            textDecorationLine: 'underline',
                            textDecorationColor: 'red',
                        }}
                    >Cancel</Text>
                </View>
            </TouchableOpacity>
        </View>
    )
}