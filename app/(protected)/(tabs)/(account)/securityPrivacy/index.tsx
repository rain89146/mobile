import { View, ScrollView } from 'react-native'
import React from 'react'
import { DarkTitleAndRemark } from '@/components/ui/ContentComp'
import { primaryBackground } from '@/constants/Colors'

export default function Index() {
    return (
        <View style={{ flex: 1, paddingHorizontal: 25, backgroundColor: primaryBackground }}>
            <ScrollView
                contentContainerStyle={{flexGrow: 1}}
                bounces={true}
                fadingEdgeLength={50}
                showsVerticalScrollIndicator={false}
            >
                <View style={{ flex: 1, paddingTop: 80, paddingBottom: 150 }}>
                    <View style={{ flex: 1, flexDirection: 'column' }}>
                        <DarkTitleAndRemark 
                            title={`Security & Privacy`}
                            remark={'Manage your security and privacy settings.'}
                        />
                    </View>
                </View>
            </ScrollView>
        </View>
    )   
}