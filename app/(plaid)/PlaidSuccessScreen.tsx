import { TitleAndRemark } from '@/components/ui/ContentComp'
import React from 'react'
import { View, SafeAreaView, Text } from 'react-native'

export default function PlaidSuccessScreen() {
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={{ flex: 1, padding: 35 }}>
                <TitleAndRemark 
                    title={`Welcome to Dopa!`}
                    remark={'Please enter your email address and password to login to your account.'}
                />
                <View>
                    <Text>PlaidSuccessScreen</Text>
                </View>
            </View>
        </SafeAreaView>
    )
}
