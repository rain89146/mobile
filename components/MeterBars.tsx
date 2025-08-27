import { obsidian } from '@/constants/Colors';
import React from 'react'
import { View } from 'react-native';

export type DistributionItem = {
    name: string;
    color: string;
    amount: number;
}

export function MeterBar({distribution, total}: {distribution: DistributionItem[], total: number}) {
    return (
        <View style={{ flexDirection: 'row', height: 30, borderRadius: 3, overflow: 'hidden', backgroundColor: obsidian, marginBottom: 25, width: '100%' }}>
            {distribution.map((item, idx) => {
            const percentage = total > 0 ? (item.amount / total) * 100 : 0;
            return (
                <View
                    key={item.name + idx}
                    style={{
                        width: `${percentage}%`,
                        backgroundColor: item.color,
                        height: '100%',
                    }}
                />
            );
            })}
        </View>
    )
}

