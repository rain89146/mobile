import { useReducer } from "react";

interface AuthState {
    userId: string|null;
    identityToken: string|null;
    authorizationCode: string|null;
}

function AuthReducer() {
    const initialState: AuthState = {
        userId: null,
        identityToken: null,
        authorizationCode: null
    }

    const contextReducer = (state: any, action: {stateName: string, payload: unknown}) => {
        return {
            ...state,
            [action.stateName]: action.payload
        }
    }

    const useAuthReducer: [AuthState, React.Dispatch<{stateName: string, payload: unknown}>] = useReducer(contextReducer, initialState);

    return {
        initialState,
        useAuthReducer
    }
}

export {AuthReducer, AuthState}