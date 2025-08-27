import React from 'react'
import { View, Image, Text } from 'react-native'
import { SmallMoneyComponent } from './NumberComps'
import { dopaPrefixColor, primaryColor } from '@/constants/Colors';

export function TransactionRecordItem({
    logo,
    remark,
    title,
    date,
    amount,
}: {
    title?: string|null;
    remark?: string|null;
    logo?: string | null;
    date?: string | null;
    amount?: number|null;
}) {
    const randomBackground = dopaPrefixColor[Math.floor(Math.random() * dopaPrefixColor.length)];

    return (
        <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <View style={{ width: 35, height: 35, borderRadius: 25, overflow: 'hidden', backgroundColor: logo ? "#fff" : randomBackground, marginRight: 15 }}>
                {
                    logo ?
                        <Image source={{ uri: logo }} style={{ width: 35, height: 35 }} />
                        :
                        <Text style={{ color: "#fff", fontSize: 14, fontWeight: 'bold', textAlign: 'center', lineHeight: 35 }}>
                            {title?.replace(/[^a-zA-Z]/g, '').slice(0, 2).toUpperCase() ?? '?'}
                        </Text>
                }
            </View>
            <View style={{ flex: 1, flexDirection: 'column', minWidth: 0, marginRight: 10 }}>
                <View style={{ paddingBottom: 10 }}>
                    {
                        remark && <Text style={{color: "#fff", fontSize: 10, fontFamily: 'PlayfairDisplay-Regular', marginBottom: 5, textTransform: 'uppercase'}} numberOfLines={1} ellipsizeMode="tail">{remark}</Text>
                    }
                    <Text style={{color: primaryColor, fontSize: 12, fontWeight: 'bold'}} numberOfLines={1} ellipsizeMode="tail">{title}</Text>
                </View>
                <Text style={{fontSize: 10, color: "#99a7ad", marginBottom: 5}} numberOfLines={1} ellipsizeMode="tail">
                    {date ? new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : ''}
                </Text>
            </View>
            {
                amount &&
                <View style={{ marginLeft: 10, flexShrink: 0, paddingTop: 5 }}>
                    <SmallMoneyComponent amount={amount} />
                </View>
            }
        </View>
    )
}

export function BreakDownItem({item, isLastItem, percentage}: {isLastItem: boolean, percentage: string, item: {name: string, color: string, amount: number}}) {
    return (
        <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 16, marginBottom: isLastItem ? 0 : 15 }}>
            <View style={{ width: 12, height: 12, backgroundColor: item.color, borderRadius: 6, marginRight: 6 }} />
            <View style={{ flexDirection: 'row', alignItems: 'center', width: '100%' }}>
                <Text style={{ color: "#fff", fontSize: 12 }}>{item.name}</Text>
                <Text
                    numberOfLines={1}
                    ellipsizeMode="clip"
                    style={{
                        flex: 1,
                        marginHorizontal: 8,
                        color: "#fff",
                        fontSize: 12,
                        letterSpacing: 2,
                    }}
                >
                    {Array(40).fill('.').join('')}
                </Text>
                <Text style={{ color: "#fff", fontSize: 12 }}>{percentage}%</Text>
            </View>
        </View>
    )
}
