import {useState, useEffect} from 'react'
import { GestureStateChangeEvent, TapGestureHandlerEventPayload } from 'react-native-gesture-handler';

export type focusSquare = {
	x: number;
	y: number;
	isVisible: boolean;
};

export function useAutoFocusHook() {

    const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
    const [focusSquare, setFocusSquare] = useState<focusSquare>({
        x: 0,
        y: 0,
        isVisible: false,
    });

    //  set refreshing to false when the focus square is not visible
    useEffect(() => {
        if (isRefreshing) {
            setIsRefreshing(false);
        }
    }, [isRefreshing]);

    /**
     * Camera focus function
     * @param event 
     */
    const cameraFocus = (event: GestureStateChangeEvent<TapGestureHandlerEventPayload>) => {
        // when the camera tapped, focus on the point
        setIsRefreshing(true);

        // this is the point where the camera will focus
        const { x, y } = event;
        console.log({ x, y })
        setFocusSquare({ x, y, isVisible: true })
        
        //	hide the focus square after 400ms
        setTimeout(() => {
            setFocusSquare((prev) => ({ ...prev, isVisible: false }));
        }, 400);
    }

    return {
        cameraFocus,
        focusSquare,
        isRefreshing,
        setIsRefreshing,
    }
}
