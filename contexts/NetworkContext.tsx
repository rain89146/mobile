import React, {createContext, useContext} from "react";

type NetworkContextType = {
}

const NetworkContext = createContext<NetworkContextType>({
});

// This context can be used to manage network-related state or effects
const NetworkContextProvider = ({children}: {children: React.ReactNode}) => {
    
    return (
        <NetworkContext.Provider value={{
        }}>
            {children}
        </NetworkContext.Provider>
    )
}

const useNetworkContext = () => useContext(NetworkContext);

export {NetworkContextProvider, useNetworkContext, NetworkContextType};