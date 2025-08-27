import { View, TouchableOpacity, Text } from 'react-native'
import React from 'react';
import { DotIndicator } from 'react-native-indicators';
import { primaryColor, primaryCtaColor, primaryCtaDisabledColor } from '@/constants/Colors';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import usePlaidBankIncomeLinkHook from './hooks/usePlaidBankIncomeLinkHook';

export function PlaidIncomeAuthButton({itemId, shouldRefresh = false, mode}: { itemId?: string|null; shouldRefresh: boolean; mode: 'create' | 'update'; }) 
{    
    const {isDisabled, handleOpenLink, isLoading} = usePlaidBankIncomeLinkHook(shouldRefresh, itemId);

    return (
        <TouchableOpacity 
            disabled={isDisabled ? true : isLoading} 
            onPress={handleOpenLink}
            activeOpacity={0.7}
            style={{
                backgroundColor: isDisabled ? primaryCtaDisabledColor : primaryCtaColor,
                padding: 15,
                borderRadius: 30,
                marginTop: 10,
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
                        {
                            mode === 'create' ?
                            (
                                <>
                                    <MaterialIcons name="add-link" size={20} color={primaryColor} />
                                    <Text style={{
                                        color: primaryColor,
                                        fontWeight: 'bold',
                                        fontSize: 14,
                                    }}>
                                        Add Income Source
                                    </Text>
                                </>
                            ):
                            (
                                <>
                                    <MaterialIcons name="edit" size={20} color={primaryColor} />
                                    <Text style={{
                                        color: primaryColor,
                                        fontWeight: 'bold',
                                        fontSize: 14,
                                    }}>
                                        Update Income Source
                                    </Text>
                                </>
                            )
                        }
                    </View>
                )
            }
        </TouchableOpacity>
    )
}