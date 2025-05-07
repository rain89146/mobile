import { BottomSheetMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import { RefObject, useState } from 'react'

export default function useBottomSheet(ref: RefObject<BottomSheetMethods>) {
    
    // This hook is used to manage the state of a bottom sheet component.
    const [isOpen, setIsOpen] = useState<boolean>(false);

    /**
     * Open the bottom sheet
     * @returns 
     */
    const openBottomSheet = () => {
        if (!ref.current) return;
        ref.current.expand();
    }

    /**
     * Close the bottom sheet
     * @returns 
     */
    const closeBottomSheet = () => {
        if (!ref.current) return;
        ref.current.close();
    }

    /**
     * listen to the bottom sheet change event
     * @param index 
     * @returns 
     */
    const bottomSheetOnChange = (index: number) => setIsOpen((index === -1));

    return {
        isOpen,
        openBottomSheet,
        closeBottomSheet,
        bottomSheetOnChange
    }
}
