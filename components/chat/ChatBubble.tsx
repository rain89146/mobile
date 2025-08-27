import { View, Text, Animated } from 'react-native'
import React, { useEffect, useRef } from 'react'
import { MessageObj } from '@/components/chat/useChatHook'
import { primaryColor } from '@/constants/Colors';
import { Helpers } from '@/utils/helpers';

// New animated chat bubble component
const AnimatedChatBubble = ({ messageObj, isNew }: { messageObj: MessageObj, isNew: boolean }) => {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const translateY = useRef(new Animated.Value(20)).current;
    
    useEffect(() => {
        if (isNew) {
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(translateY, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                })
            ]).start();
        } 
        else 
        {
            fadeAnim.setValue(1);
            translateY.setValue(0);
        }

        return () => {
            fadeAnim.setValue(0);
            translateY.setValue(20);
        }
    }, []);
    
    return (
        <Animated.View
            style={{
                opacity: fadeAnim,
                transform: [{ translateY }]
            }}
        >
            <ChatBubble messageObj={messageObj} />
        </Animated.View>
    );
}

function ChatBubble({ messageObj }: { messageObj: MessageObj })
{
    const { role, message, timestamp } = messageObj;

    // Format the timestamp to a readable date    
    const formattedDate = Helpers.formatDate(timestamp);

    // If the role is 'assistant', render an incoming chat bubble, otherwise render an outgoing chat bubble
    return role === 'assistant' 
    ? <IncomingChatBubble message={message} formattedDate={formattedDate} />
    : <OutgoingChatBubble message={message} formattedDate={formattedDate} />;
}

function IncomingChatBubble({ message, formattedDate }: { message: string, formattedDate: string }) {
    return (
        <View style={{
            alignItems: 'flex-start',
        }}>
            <View style={{
                maxWidth: '80%',
            }}>
                <Text style={{
                    backgroundColor: '#9772bc', 
                    padding: 18, 
                    borderRadius: 15,
                    borderBottomLeftRadius: 0, 
                    marginVertical: 5,
                    color: primaryColor,
                    lineHeight: 20,
                }}>{message}</Text>
            </View>
            <Text style={{ fontSize: 10, color: '#888', paddingTop: 5 }}>{formattedDate}</Text>
        </View>
    );
}

function OutgoingChatBubble({ message, formattedDate }: { message: string, formattedDate: string }) {
    return (
        <View style={{
            alignItems: 'flex-end',
        }}>
            <View style={{
                maxWidth: '80%',
            }}>
                <Text style={{
                    backgroundColor: '#4e3269', 
                    padding: 18, 
                    borderRadius: 15,
                    borderBottomRightRadius: 0, 
                    marginVertical: 5,
                    color: primaryColor,
                    lineHeight: 20,
                }}>{message}</Text>
            </View>
            <Text style={{ fontSize: 10, color: '#888', paddingTop: 5 }}>{formattedDate}</Text>
        </View>
    )
}

export {AnimatedChatBubble};