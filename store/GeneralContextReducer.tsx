import { useReducer } from "react";

interface GeneralContextState {
    appState: string;
}

function GeneralContextReducer() {
    const initialState: GeneralContextState = {
        appState: ""
    }

    const contextReducer = (state: any, action: any) => {
        return {
            ...state,
            [action.stateName]: action.payload
        }
    }

    const useGeneralContextReducer: [GeneralContextState, React.Dispatch<{stateName: 'appState', payload: unknown}>] = useReducer(contextReducer, initialState);

    return {
        initialState,
        useGeneralContextReducer
    }
}

export {GeneralContextReducer, GeneralContextState}