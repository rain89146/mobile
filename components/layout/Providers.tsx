import { AuthContextProvider } from '@/contexts/AuthenticationContext'
import { GeneralContextProvider } from '@/contexts/GeneralContext'
import { NetworkContextProvider } from '@/contexts/NetworkContext'
import { PermissionContextProvider } from '@/contexts/PermissionContext'
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet'
import React from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <NetworkContextProvider>
            <GeneralContextProvider>
                <GestureHandlerRootView>
                    <AuthContextProvider>
                        <PermissionContextProvider>
                            <BottomSheetModalProvider>
                                {children}
                            </BottomSheetModalProvider>
                        </PermissionContextProvider>
                    </AuthContextProvider>
                </GestureHandlerRootView>
            </GeneralContextProvider>
        </NetworkContextProvider>
    )
}
