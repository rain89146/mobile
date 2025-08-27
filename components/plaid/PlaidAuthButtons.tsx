import { View, TouchableOpacity, Text } from 'react-native'
import usePlaidHook from './hooks/usePlaidHook';
import React from 'react';
import { DotIndicator } from 'react-native-indicators';
import { primaryColor, primaryCtaColor, primaryCtaDisabledColor } from '@/constants/Colors';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export function PlaidAuthButton({shouldRefresh = false}: { shouldRefresh: boolean; }) 
{    
    const {isDisabled, isLoading, openPlaidLink} = usePlaidHook(shouldRefresh);

    return (
        <TouchableOpacity 
            disabled={isDisabled ? true : isLoading} 
            onPress={() => openPlaidLink()}
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
                        <MaterialIcons name="add-link" size={20} color={primaryColor} />
                        <Text style={{
                            color: primaryColor,
                            fontWeight: 'bold',
                            fontSize: 14,
                        }}>
                            Link Bank Account
                        </Text>
                    </View>
                )
            }
        </TouchableOpacity>
    )
}