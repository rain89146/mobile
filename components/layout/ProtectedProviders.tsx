import { NotificationContextProvider } from '@/contexts/NotificationContext'
import { PlaidContextProvider } from '@/contexts/PlaidContext'
import { SocketContextProvider } from '@/contexts/SocketContext'
import React from 'react'

export default function ProtectedProviders({ children }: { children: React.ReactNode }) {
    return (
        <SocketContextProvider>
            {/* <NotificationContextProvider> */}
                <PlaidContextProvider>
                    {children}
                </PlaidContextProvider>
            {/* </NotificationContextProvider> */}
        </SocketContextProvider>
    )
}
