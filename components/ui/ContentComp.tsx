import { obsidian, primaryTextColor } from '@/constants/Colors'
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
                fontSize: 35,
                fontFamily: 'PlayfairDisplay-Bold',
                color: "#1d1227"
            }}>
                {title}
            </Text>
            <View style={{
                marginTop: 15
            }}>
                <Text style={{
                    fontSize: 16,
                    color: "#352248",
                    lineHeight: 25
                }}>
                    {remark}
                </Text>
            </View>
        </View>
    )
}

export function DarkTitleAndRemark({
    title,
    remark,
}: {
    title?: string|null
    remark?: string|null
}) {
    return (
        <View style={{
            paddingBottom: 25
        }}>
            {
                title && (
                    <Text style={{
                        fontWeight: 'bold',
                        fontSize: 35,
                        color: primaryTextColor,
                        lineHeight: 40,
                        fontFamily: 'PlayfairDisplay-Regular'
                    }}>
                        {title}
                    </Text>
                )
            }
            {remark && (
                <View style={{
                    marginTop: title ? 15 : 0
                }}>
                    <Text style={{
                        fontSize: 14,
                        color: "#d8dee0",
                        lineHeight: 20
                    }}>
                        {remark}
                    </Text>
                </View>
            )}
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
            marginTop: 35,
            marginBottom: 35,
            alignItems: 'center',
        }}>
            <View
                style={{
                    width: '100%',
                    height: 1,
                    backgroundColor: '#fff',
                }}
            >
            </View>
            <Text
                style={{
                    position: 'absolute',
                    top: -10,
                    backgroundColor: obsidian,
                    paddingHorizontal: 10,
                    fontSize: 14,
                    fontWeight: 'bold',
                    color: '#fff',
                }}
            >{text}</Text>
        </View>
    )
}
