import { View, TouchableOpacity, Text } from 'react-native'
import usePlaidHook from './hooks/usePlaidHook';
import React from 'react';

export function PlaidAuthButton() 
{    
    const {isDisabled, handleOpenLink, error, isLoading} = usePlaidHook();

    return (
        <>
            <TouchableOpacity 
                disabled={isDisabled ? true : isLoading} 
                activeOpacity={0.7}
                onPress={handleOpenLink}
                style={{
                    backgroundColor: isDisabled ? '#bcbcbc' : '#000',
                    padding: 15,
                    borderRadius: 3,
                    marginTop: 10,
                    alignItems: 'center',
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
                            <Text style={{color: '#fff'}}>Loading...</Text>
                        </View>
                    )
                    : (
                        <View style={{
                            flexDirection: 'row',
                            gap: 6
                        }}>
                            <Text style={{
                                color: '#fff',
                                fontWeight: 'bold',
                                fontSize: 14,
                            }}>
                                Connect Bank Account
                            </Text>
                        </View>
                    )
                }
            </TouchableOpacity>
            {error && (
                <Text style={{ color: '#fff', marginTop: 10, fontSize: 14 }}>
                    Error: {error}
                </Text>
            )}
        </>
    )
}
