import React from 'react'
import Feather from '@expo/vector-icons/Feather';
import { View, Text } from 'react-native';

export function GrowBadge({growth}: {growth: number})
{
    const trend = growth < 0 ? 'down' : 'up';
    const backgroundColor = trend === 'up' ? '#bdf8bdff' : '#f8bdc4ff';
    const textColor = trend === 'up' ? '#015e01ff' : '#9e1c1cff';
    const icon = trend === 'up' ? 'trending-up' : 'trending-down';
    return (
        <View style={{ marginTop: 5, marginLeft: 10, flexDirection: 'row', alignItems: 'center', backgroundColor, paddingVertical: 3, paddingHorizontal: 10, borderRadius: 20 }}>
            <Feather name={icon} size={10} color={textColor} />
            <Text style={{ color: textColor, fontSize: 11, marginLeft: 5 }}>{growth.toFixed(2)}%</Text>
        </View>
    )
}