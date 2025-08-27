import React, {createContext, useContext, useEffect, useState} from "react";
import ioClient, { Socket } from "socket.io-client";
import { useAuthContext } from "./AuthenticationContext";
import { appConfig } from "@/config/config";

export interface ISocketContext {
    error: string | null;
    socket: Socket | null;
    socketId: string | null;
    isConnected: boolean;
}

export const SocketEvents = {
    CONNECT: 'connect',
    DISCONNECT: 'disconnect',
    CONNECT_ERROR: 'connect_error',
    REGISTER_USER: 'register_user',
    REGISTRATION_COMPLETE: 'registration_complete',
    PLAID_ITEM_ADDED: 'plaid:item:added',
    PLAID_SESSION_FINISHED: 'plaid:session:finished',
    PLAID_NEW_ACCOUNT_AVAILABLE: 'plaid:new:account:available',
    USER_LOGOUT: 'user:logout',
    SYNC_UPDATE_AVAILABLE: 'sync:update:available',
    TRANSACTION_RECORD_ADDED: 'transaction:record:added',
    INCOME_DATA_PROCESS_COMPLETED: 'income:data:process:completed'
}

const SocketContext = createContext<ISocketContext>({
    error: null,
    socket: null,
    socketId: null,
    isConnected: false
});

const SocketContextProvider = ({children}: {children: React.ReactNode}) => {

    const authContext = useAuthContext();

    const [socket, setSocket] = useState<Socket | null>(null);
    const [socketId, setSocketId] = useState<string | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // when mount, initialize the socket connection
    useEffect(() => {
        // Initialize the socket connection
        const newSocket = ioClient('http://localhost:8080', {
            transports: ['websocket'],
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
            auth: {
                basicToken: `Basic ${appConfig.DOPA_API_AUTH}`,
                accessToken: `Bearer ${authContext.authCredential?.dopa.accessToken}`
            }
        });

        // listen to connect event
        newSocket.on(SocketEvents.CONNECT, () => {
            setSocketId((newSocket?.id) ? newSocket.id : null);
            setIsConnected(true);
            setError(null);
        });

        // listen to disconnect event
        newSocket.on(SocketEvents.DISCONNECT, () => {
            setIsConnected(false);
        });

        // listen to connect_error event
        newSocket.on(SocketEvents.CONNECT_ERROR, (err) => {
            setError(`Connection error: ${err.message}`);
        });

        // Set the socket state
        setSocket(newSocket);

        // load the messages from chat history
        return () => {
            newSocket.off(SocketEvents.CONNECT);
            newSocket.off(SocketEvents.DISCONNECT);
            newSocket.off(SocketEvents.CONNECT_ERROR);
            
            newSocket.disconnect();
            setSocket(null);
            setIsConnected(false);
            setError(null);

        }
    }, [authContext.authCredential]);

    // Listen for socket events
    useEffect(() => {
        if (!socket) return;
        if (!socketId) return;

        //  Register the user if authenticated
        if (authContext.authCredential?.userId) 
        {
            const userId = authContext.authCredential.userId;

            // Register the user with the socket server
            socket.emit(SocketEvents.REGISTER_USER, userId);

            // listen to registration complete event
            socket.on(SocketEvents.REGISTRATION_COMPLETE, (data)=> {
                console.log('Socket registration complete:', data);
            })

            socket.on(SocketEvents.SYNC_UPDATE_AVAILABLE, (data) => {
                console.log('Sync update available:', data);
            })

            socket.on(SocketEvents.PLAID_ITEM_ADDED, (data) => {
                console.log('Plaid item added:', data);
            });
        }

        return () => {
            socket.off(SocketEvents.REGISTER_USER);
            socket.off(SocketEvents.REGISTRATION_COMPLETE);
            socket.off(SocketEvents.PLAID_ITEM_ADDED);
            socket.off(SocketEvents.SYNC_UPDATE_AVAILABLE);
            socket.off(SocketEvents.PLAID_NEW_ACCOUNT_AVAILABLE);
            socket.off(SocketEvents.TRANSACTION_RECORD_ADDED);
        }
    }, [socket, socketId, authContext.authCredential]);

    return (
        <SocketContext.Provider value={{
            error,
            socket,
            socketId,
            isConnected
        }}>
            {children}
        </SocketContext.Provider>
    )
}

const useSocketContext = () => useContext(SocketContext);

export {SocketContextProvider, useSocketContext};