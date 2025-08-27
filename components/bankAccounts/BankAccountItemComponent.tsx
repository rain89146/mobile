import { primaryColor } from "@/constants/Colors";
import { PlaidBankAccount } from "@/types/PlaidObjects";
import React from "react";
import { View, Text } from "react-native";

export function BankAccountItemComponent({account}: {account: PlaidBankAccount}) 
{
    return (
        <View key={account.account_id} style={{
            flexDirection: 'column',
            alignItems: 'flex-start',
        }}>
            <View
                style={{
                    marginBottom: 10,
                }}
            >
                <Text style={{color: "#fff", fontSize: 10, fontFamily: 'PlayfairDisplay-Regular'}}>{account.subtype.toUpperCase()}</Text>
            </View>
            <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                width: '100%',
            }}>
                <Text style={{color: primaryColor, fontSize: 14, fontWeight: 'bold'}}>{account.name}</Text>
                <Text style={{color: primaryColor, marginLeft: 'auto', fontSize: 12}}>**** {account.mask}</Text>
            </View>
            {
                account.official_name &&
                <View style={{
                    marginTop: 5
                }}>
                    <Text style={{
                        fontSize: 10,
                        color: "#99a7ad"
                    }}>{account.official_name}</Text>
                </View>
            }
            <View style={{
                marginTop: 15
            }}>
                <Text style={{
                    fontSize: 14,
                    color: primaryColor
                }}>{formatCurrency(account.balances.current, account.balances.iso_currency_code)}</Text>
            </View>
        </View>
    )
}

function formatCurrency(value: number, currencyCode: string): string {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currencyCode,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(value);
}