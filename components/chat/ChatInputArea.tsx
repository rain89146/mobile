import { View, TouchableOpacity } from 'react-native'
import React from 'react'
import { ChatInputKitty } from '@/components/form/input/InputKitty';
import Ionicons from '@expo/vector-icons/Ionicons';

export function ChatInputArea({
    msg,
    setMsg,
    sendMessage
}: {
    msg: string,
    setMsg: (value: string) => void,
    sendMessage: (msg: string) => Promise<void>
}) {
    return (
        <View
            style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: "#100b16",
                borderRadius: 30,
                borderCurve: 'continuous',
                padding: 5,
                borderWidth: 1,
                borderColor: '#623f84',
            }}
        >
            <View style={{ flex: 1 }}>
                <ChatInputKitty 
                    value={msg} 
                    onChangeText={(value) => setMsg(value)} 
                    label={''} 
                    placeholder={'Ask me anything'} 
                    disabled={false}                        
                />
            </View>
            <View style={{ flex: 0, marginLeft: 10 }}>
                <TouchableOpacity
                    onPress={async () => sendMessage(msg)}
                    activeOpacity={0.7}
                    style={{
                        alignItems: 'center',
                        padding: 15,
                    }}
                >
                    <Ionicons name="send" size={15} color="#ede6f3" />
                </TouchableOpacity>
            </View>
        </View>
    )
}