import { GeneralContextReducer } from "@/store/GeneralContextReducer";
import React, {createContext, useContext, useEffect, useRef} from "react";
import { AppState } from "react-native";

const GeneralContext = createContext({
    appState: "",
    setAppState: (state: string) => {}
});

const GeneralContextProvider = ({children}: {children: React.ReactNode}) => {

    const {useGeneralContextReducer} = GeneralContextReducer();
    const [initialState, dispatch] = useGeneralContextReducer;
    const appState = useRef(AppState.currentState);
    
    const setAppState = (state: string) => dispatch({stateName: 'appState', payload: state});

    // 
    useEffect(() => {
        const subscription = AppState.addEventListener("change", (nextAppState) => {
            console.log({currentState: appState.current, nextAppState});
        });

        return () => {
            subscription.remove();
        };
    }, []);
    
    return (
        <GeneralContext.Provider value={{
            appState: initialState.appState,
            setAppState
        }}>
            {children}
        </GeneralContext.Provider>
    )
}

const useGeneralContext = () => useContext(GeneralContext);

export {GeneralContextProvider, useGeneralContext};