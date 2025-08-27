import { Text, KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native'
import React, {useEffect, useRef} from 'react'
import { useNavigation } from 'expo-router';
import { ChatInputArea } from '@/components/chat/ChatInputArea';
import { MessageObj, useChatHook } from '@/components/chat/useChatHook';
import Ionicons from '@expo/vector-icons/Ionicons';
import {AnimatedChatBubble} from '@/components/chat/ChatBubble';
import { primaryColor } from '@/constants/Colors';

export default function Index()
{
    const navigation = useNavigation();
    const hook = useChatHook();
    const scrollViewRef = useRef<ScrollView>(null);
    const prevMessagesLength = useRef(0);

    useEffect(() => {
        navigation.setOptions({ 
            headerShown: false,
        });
    }, [navigation]);

    // when new messages are added
    useEffect(() => {
        if (scrollViewRef.current) {
            scrollViewRef.current.scrollToEnd({ animated: true });
        }
        prevMessagesLength.current = hook.messages.length;
    }, [hook.messages]);
    
    return (
        <View style={{ flex: 1 }}>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
            >
            </KeyboardAvoidingView>
        </View>
    )
}

function MessageArea({
    scrollViewRef,
    messages,
    error,
    isReplying
}: {
    scrollViewRef: React.RefObject<ScrollView|null>;
    messages: MessageObj[];
    error: string | null;
    isReplying: boolean;
})
{
    return (
        <ScrollView
            ref={scrollViewRef}
            contentContainerStyle={{
                flexGrow: 1
            }}
            style={{
                flex: 1,
                height: '100%',
                backgroundColor: primaryColor,
            }}
            keyboardShouldPersistTaps="handled"
            bounces={true}
            fadingEdgeLength={50}
        >
            {
                messages.map((msg: MessageObj, index) => <AnimatedChatBubble key={index} messageObj={msg} isNew={index >= messages.length - 1} />)
            }
            {
                error && <WarningMessage error={error}/>
            }
            {
                isReplying && <ReplyingIndicator />
            }
        </ScrollView>
    )
}

function ChatInterface({
    msg,
    setMsg,
    sendMessage,
}: {
    msg: string;
    setMsg: (msg: string) => void;
    sendMessage: (msg: string) => Promise<void>;
}) {
    return (
        <View style={{
            paddingHorizontal: 25,
        }}>
            <ChatInputArea
                msg={msg}
                setMsg={setMsg}
                sendMessage={sendMessage}
            />
        </View>
    );
}

function ReplyingIndicator() {
    return (
        <View style={{
            width: '100%',
            paddingVertical: 5,
        }}>
            <Text style={{
                color: "#e0d6eb",
                fontWeight: '500',
                fontSize: 14,
            }}>Replying...</Text>
        </View>
    )
}

function WarningMessage({ error }: { error?: string }) {
    return (
        <View
            style={{
                flex: 1,
                marginBottom: 10,
                flexDirection: 'row',
                alignItems: 'flex-start',
                gap: 8,
                borderWidth: 1,
                borderColor: '#ffe866',
                borderRadius: 30,
                padding: 8,
                paddingHorizontal: 15,
            }}
        >
            <Ionicons name="warning" size={15} color="#ffe866" />
            <Text style={{
                color: "#e0d6eb",
                fontWeight: '500',
                fontSize: 12,
                textTransform: 'capitalize',
            }}>
                {error}
            </Text>
        </View>
    )
}