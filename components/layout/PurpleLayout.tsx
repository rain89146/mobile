import { View } from 'react-native'
import React from 'react'
import { primaryBackground } from '@/constants/Colors'
import { MatteLinearGradientBackground } from '../background/LinearBackgrounds'

const PurpleLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <View
            style={{
                flex: 1,
                paddingBottom: 0,
                backgroundColor: primaryBackground,
                position: 'relative',
            }}
        >
            <MatteLinearGradientBackground />
            <View style={{
                flex: 1,
                zIndex: 2,
            }}>
            {children}
            </View>
        </View>
    )
}

export default PurpleLayout