import { createContext, useContext, useState } from "react";

export type CameraContextType = {
    photoUri: string | null;
    setPhotoUri: (uri: string | null) => void;
}

const CameraContext = createContext<CameraContextType|undefined>(undefined);

const CameraContextProvider = ({children}: {children: React.ReactNode}) => {

    const [photoUri, setPhotoUri] = useState<string | null>(null);

    return (
        <CameraContext.Provider value={{
            photoUri,
            setPhotoUri,
        }}>{children}</CameraContext.Provider>
    )
}

const useCameraContext = () => useContext(CameraContext);

export {CameraContextProvider, useCameraContext};