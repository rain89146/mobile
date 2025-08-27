import React from "react";
import { View, Text } from "react-native";

export function LargeMoneyComponent({amount}: {amount: number})
{
    amount = amount ?? 0;
    const formattedAmount = amount.toLocaleString('en-US', { style: "currency", currency: "USD" });
    return (
        <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
            <Text style={{color: "#fff", fontSize: 35}}>{formattedAmount}</Text>
        </View>
    )
}

export function SmallMoneyComponent({amount}: {amount: number})
{   
    amount = amount ?? 0;
    // Format without currency style and manually add $ sign
    const formattedAmount = amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    
    return (
        <View>
            <Text style={{color: "#fff", fontSize: 14, fontWeight: 'normal'}}>{'$' + formattedAmount}</Text>
        </View>
    )
}