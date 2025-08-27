import BottomSheet, { BottomSheetView, BottomSheetScrollView, BottomSheetBackdrop } from '@gorhom/bottom-sheet'
import { BottomSheetMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import React, {ReactNode, RefObject} from 'react';

export interface BottomSheetProps {
    sheetRef: RefObject<BottomSheetMethods>;
    children: ReactNode;
    onChangeEvent: (index: number) => void;
}

export function GenericBottomSheet({
    sheetRef, 
    onChangeEvent,
    children
}: BottomSheetProps) {

    const bottomSheetBackdrop = (props: any) => {
        return (
            <BottomSheetBackdrop
                {...props}
                appearsOnIndex={1}
                disappearsOnIndex={-1}
                enableTouchThrough={false}
                pressBehavior="close"
                opacity={0.75}
            />
        )
    }
    
    return (
        <BottomSheet
            ref={sheetRef}
            snapPoints={["80%"]}
            style={{zIndex: 100}}
            enablePanDownToClose={true}
            enableContentPanningGesture={true}
            enableHandlePanningGesture={true}
            enableDynamicSizing={true}
            index={-1}
            backdropComponent={bottomSheetBackdrop}
            onChange={(index) => onChangeEvent(index)}
        >
            <BottomSheetView style={{ flex: 1, flexDirection: 'column', alignItems: 'center' }}>
                <BottomSheetScrollView>{children}</BottomSheetScrollView>
            </BottomSheetView>
        </BottomSheet>
    )
}