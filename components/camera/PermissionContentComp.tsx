import React from 'react'
import { TouchableOpacity, View, Text } from 'react-native'

export function PermissionContentComp({
    remark,
    onPressEvent,
    buttonTest
}: {
    remark: string,
    onPressEvent: () => void,
    buttonTest: string
}) {
    return (
        <>
            <Text style={{
                color: '#000',
                fontSize: 14,
            }}>
                {remark}
            </Text>
            <View style={{
                paddingTop: 40,
            }}>
                <TouchableOpacity
                    onPress={onPressEvent}
                    style={{
                        backgroundColor: '#000',
                        padding: 10,
                        borderRadius: 5,
                        paddingHorizontal: 20,
                    }}
                >
                    <Text style={{color:"#fff", fontWeight: "bold"}}>{buttonTest}</Text>
                </TouchableOpacity>
            </View>
        </>
    )
}
