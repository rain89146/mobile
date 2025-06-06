import { Helpers } from '@/utils/helpers'
import Feather from '@expo/vector-icons/Feather'
import React from 'react'
import { TouchableOpacity, View, Text } from 'react-native'
import { DotIndicator } from 'react-native-indicators'
import Icon from '@expo/vector-icons/FontAwesome5';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export function ActionButton({
    onPressEvent,
    isLoading,
    buttonLabel
}: {
    onPressEvent: () => void,
    isLoading: boolean,
    buttonLabel: string
}) {
    return (
        <TouchableOpacity 
            onPress={async () => {
                await Helpers.impactSoftFeedback();
                onPressEvent();
            }}
            disabled={isLoading}
            activeOpacity={0.7}
            style={{
                backgroundColor: '#000',
                padding: 15,
                borderRadius: 3,
                marginTop: 10,
                alignItems: 'center',
        }}>
            {
                isLoading 
                ? (
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                        <DotIndicator color={"#fff"} count={3} size={7}/>
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
                            {buttonLabel}
                        </Text>
                    </View>
                )
            }
        </TouchableOpacity>
    )
}

export function ActionBetaButton({
    onPressEvent,
    isAllow,
    isLoading,
    buttonLabel
}: {
    onPressEvent: () => void,
    isAllow: boolean,
    isLoading: boolean,
    buttonLabel: string
}) {
    return (
        <TouchableOpacity 
            onPress={async () => {
                await Helpers.impactSoftFeedback();
                onPressEvent();
            }}
            disabled={isAllow === false ? true : isLoading }
            activeOpacity={0.7}
            style={{
                backgroundColor: isAllow ? '#000' : '#bcbcbc',
                padding: 15,
                borderRadius: 3,
                marginTop: 10,
                alignItems: 'center',
        }}>
            {
                isLoading 
                ? (
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                        <DotIndicator color={"#fff"} count={3} size={7}/>
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
                            {buttonLabel}
                        </Text>
                    </View>
                )
            }
        </TouchableOpacity>
    )
}

export function SecondaryButton({
    onPressEvent,
    isLoading,
    buttonLabel
}: {
    onPressEvent: () => void,
    isLoading: boolean,
    buttonLabel: string
}) {
    return (
        <TouchableOpacity 
            onPress={async () => {
                await Helpers.impactSoftFeedback();
                onPressEvent();
            }}
            disabled={isLoading}
            activeOpacity={0.7}
            style={{
                backgroundColor: 'transparent',
                padding: 15,
                borderRadius: 3,
                marginTop: 10,
                alignItems: 'center',
                borderWidth: 1,
                borderColor: '#fff',
        }}>
            {
                isLoading 
                ? (
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                        <DotIndicator color={"#fff"} count={3} size={7}/>
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
                            {buttonLabel}
                        </Text>
                    </View>
                )
            }
        </TouchableOpacity>
    )
}

export function BackButton({
    label,
    onPressEvent
}: {
    label: string,
    onPressEvent: () => void
})
{
    return (
        <TouchableOpacity 
            onPress={() => {
                Helpers.impactSoftFeedback().then(() => {
                    onPressEvent();
                });
            }} 
            activeOpacity={0.7} 
            style={{
                width: 'auto',
                position: 'absolute',
            }}
        >
            <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 5,
                width: 'auto',
            }}>
                <Feather name='chevron-left' size={20} color="#000" />
                <Text style={{
                    fontSize: 16,
                    color: "#484848",
                }}>
                    {label}
                </Text>
            </View>
        </TouchableOpacity>
    )
}

export function CloseButton({
    label,
    onPressEvent
}: {
    label: string,
    onPressEvent: () => void
})
{
    return (
        <TouchableOpacity 
            onPress={() => {
                Helpers.impactSoftFeedback().then(() => {
                    onPressEvent();
                });
            }} 
            activeOpacity={0.7} 
            style={{
                width: 'auto',
                position: 'absolute',
            }}
        >
            <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 5,
                width: 'auto',
            }}>
                <MaterialIcons name='close' size={20} color="#000" />
                <Text style={{
                    fontSize: 16,
                    color: "#484848",
                    fontWeight: 'bold',
                    textTransform: 'capitalize',
                }}>
                    {label}
                </Text>
            </View>
        </TouchableOpacity>
    )
}

export function AppleButton({
    isLoading,
    label,
    onPressEvent
}: {
    isLoading: boolean,
    label: string,
    onPressEvent: () => void
}) {
    return (
        <TouchableOpacity 
            onPress={onPressEvent}
            disabled={isLoading}
            activeOpacity={0.7}
            style={{
                backgroundColor: '#000',
                padding: 15,
                borderRadius: 3,
                alignItems: 'center',
            }}>
                {
                    isLoading 
                    ? (
                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                            <DotIndicator color={"#fff"} count={3} size={7}/>
                        </View>
                    )
                    : (
                        <View style={{
                            flexDirection: 'row',
                            gap: 6
                        }}>
                            <Icon name="apple" size={16} color="#fff" />
                            <Text style={{
                                color: '#fff',
                                fontWeight: 'bold',
                                fontSize: 14,
                            }}>
                                {label}
                            </Text>
                        </View>
                    )
                }
        </TouchableOpacity>
    )
}