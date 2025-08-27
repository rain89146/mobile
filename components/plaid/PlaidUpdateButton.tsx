import { View, TouchableOpacity, Text } from 'react-native'
import React from 'react';
import { DotIndicator } from 'react-native-indicators';
import { primaryColor, primaryCtaColor, primaryCtaDisabledColor } from '@/constants/Colors';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import usePlaidUpdateLinkHook from './hooks/usePlaidUpdateLinkHook';

export function PlaidUpdateButton({itemId, setPlaidLinkFlowCompleted}: {itemId: string, setPlaidLinkFlowCompleted: (completed: boolean) => void}) 
{
    const {isDisabled, isLoading, openPlaidLink} = usePlaidUpdateLinkHook({itemId, setPlaidLinkFlowCompleted});

    return (
        <TouchableOpacity
            disabled={isDisabled ? true : isLoading}
            onPress={() => openPlaidLink()}
            activeOpacity={0.7}
            style={{
                backgroundColor: isDisabled ? primaryCtaDisabledColor : primaryCtaColor,
                padding: 15,
                borderRadius: 30,
                alignItems: 'center',
                width: '100%',
            }}
        >
            {
                isLoading
                ? (
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                        <DotIndicator color={primaryColor} count={3} size={7}/>
                    </View>
                )
                : (
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 6
                    }}>
                        <MaterialCommunityIcons name="bank-plus" size={14} color={primaryColor} />
                        <Text style={{
                            color: primaryColor,
                            fontWeight: 'bold',
                            fontSize: 14,
                            textTransform: 'capitalize'
                        }}>
                            update accounts
                        </Text>
                    </View>
                )
            }
        </TouchableOpacity>
    )
}