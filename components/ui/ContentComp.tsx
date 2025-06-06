import React from 'react'
import { View, Text } from 'react-native'

export function TitleAndRemark({
    title,
    remark,
}: {
    title: string
    remark: string
}) {
    return (
        <View style={{
            paddingBottom: 25
        }}>
            <Text style={{
                fontWeight: 'bold',
                fontSize: 35
            }}>
                {title}
            </Text>
            <View style={{
                marginTop: 15
            }}>
                <Text style={{
                    fontSize: 16,
                    color: "#484848",
                    lineHeight: 25
                }}>
                    {remark}
                </Text>
            </View>
        </View>
    )
}

export function SubContentComp({
    children
}: {
    children: React.ReactNode
}) {
    return (
        <Text style={{fontSize: 14, color: "#484848", lineHeight: 25}}>{children}</Text>
    )
}

export function DividerLineWithText({
    text
}: {
    text: string
}) {
    return (
        <View style={{
            position: 'relative',
            marginTop: 30,
            marginBottom: 30,
            alignItems: 'center',
        }}>
            <View
                style={{
                    width: '100%',
                    height: 1,
                    backgroundColor: '#bcbcbc',
                }}
            >
            </View>
            <Text
                style={{
                    position: 'absolute',
                    top: -10,
                    backgroundColor: '#fff',
                    paddingHorizontal: 10,
                    fontSize: 14,
                    fontWeight: 'bold',
                    color: '#bcbcbc',
                }}
            >{text}</Text>
        </View>
    )
}
