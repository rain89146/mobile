import React, { useState } from 'react'
import { View, Text, Button, Pressable } from 'react-native'
import BottomSheet, { BottomSheetView, BottomSheetScrollView } from '@gorhom/bottom-sheet'
import { BottomSheetMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import useBottomSheet from '@/hooks/useBottomSheet';
import { GenericBottomSheet } from '@/components/BottomSheetComp';

export default function index() {

    const bottomSheetRef: React.RefObject<BottomSheetMethods> = React.useRef<BottomSheet>(null);

    const { openBottomSheet, closeBottomSheet, bottomSheetOnChange } = useBottomSheet(bottomSheetRef);

    const [ content, setContent ] = useState<React.ReactNode>(null);

    const openSheet = () => {
        setContent(
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>Bottom Sheet Content</Text>
                <Button
                    title="Close Bottom Sheet"
                    onPress={() => closeSheet()}
                    color="#841584"
                    accessibilityLabel="Tap me to close bottom sheet"
                />
            </View>
        );
        openBottomSheet();
    }

    const closeSheet = () => {
        setContent(null);
        closeBottomSheet();
    }

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>
                Profile
            </Text>
            <Pressable
                onPress={openSheet}
                accessibilityLabel="Tap me to open bottom sheet"
            >
                <Text>Open bottom sheet</Text>
            </Pressable>
            <GenericBottomSheet 
                sheetRef={bottomSheetRef} 
                onChangeEvent={bottomSheetOnChange}
            >
               {content}
            </GenericBottomSheet>
        </View>
    )
}
