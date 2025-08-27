import { useAuthContext } from "@/contexts/AuthenticationContext";
import { useSocketContext } from "@/contexts/SocketContext";
import { Helpers } from "@/utils/helpers";
import { useCallback, useEffect, useState } from "react";

export interface MessageObj {
    userId: string;
    role: 'user' | 'assistant';
    message: string;
    timestamp: string;
}

export function useChatHook()
{
    const authContext = useAuthContext();
    const {socket, socketId} = useSocketContext();

    const [msg, setMsg] = useState<string>('');
    const [messages, setMessages] = useState<MessageObj[]>([]);
    const [isReplying, setIsReplying] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!socket) return;

        // listen to message event
        socket.on('ai-message-received', (message: any) => {
            // Handle incoming messages
            console.log('New message received:', message);

            // Provide haptic feedback to the user
            Helpers.impactSoftFeedback();

            // set replying state
            setIsReplying(false);

            // Add the message to the chat history
            setMessages(prevMessages => [...prevMessages, message]);
        });

        // listen to message reply event
        socket.on('ai-message-on-reply', (reply: {replying: boolean}) => {
            setIsReplying(reply.replying);
        });

        return () => {
            // Clean up socket listeners
            socket.off('ai-message-received');
            socket.off('ai-message-on-reply');

            // Reset state on unmount
            setIsReplying(false);
            setMessages([]);
            setError(null);
        }
    }, [socket, socketId])

    // Load chat history
    const loadChatHistory = useCallback(async () => {
        try {
            throw new Error('Not implemented yet');
        } catch (error) {
            console.log('useChatHook:loadChatHistory:error:', error);
            throw error;
        }
    }, []);

    //
    useEffect(() => {
        loadChatHistory()
    }, [loadChatHistory]);

    /**
     * Sends a message to the chat
     * @param msg The message to send
     */
    const sendMessage = async (msg: string) => {

        // Provide feedback to the user
        await Helpers.impactSoftFeedback();

        // Trim the message to remove leading/trailing whitespace
        const trimmedMsg = msg.trim();

        // Check if the message is not empty and socket is connected
        if (trimmedMsg && socket)
        {
            const msgObj = {
                userId: authContext.authCredential?.userId,
                message: trimmedMsg,
                role: 'user',
                timestamp: new Date().toISOString()
            } as MessageObj;

            // Emit the message to the server
            socket.emit(
                'user-message-sent', 
                msgObj, 
                (response: any)=>{
                    console.log('Message sent to server:', response);
                }
            );

            //  add the message to the chat history
            setMessages(prevMessages => [...prevMessages, msgObj]);

            //  clear the message input
            setMsg('');
        }
    }

    /**
     * Reconnects the socket connection.
     */
    const reconnect = (): void => {
        if (socket) {
            socket.connect();
        }
    }

    return {
        msg,
        setMsg,
        messages,
        sendMessage,
        isReplying,
        socketId,
        error,
        reconnect
    };
}