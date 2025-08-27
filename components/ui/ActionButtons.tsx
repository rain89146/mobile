import { Helpers } from '@/utils/helpers'
import Feather from '@expo/vector-icons/Feather'
import React, { ReactNode } from 'react'
import { TouchableOpacity, View, Text } from 'react-native'
import { DotIndicator } from 'react-native-indicators'
import Icon from '@expo/vector-icons/FontAwesome5';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { primaryColor, primaryCtaColor, primaryCtaDisabledColor } from '@/constants/Colors'
import AntDesign from '@expo/vector-icons/AntDesign';

export function ActionButton({
    onPressEvent,
    isLoading,
    buttonLabel,
    isDisabled = false
}: {
    onPressEvent: () => void,
    isLoading: boolean,
    buttonLabel: string
    isDisabled?: boolean
}) {
    return (
        <TouchableOpacity 
            onPress={async () => {
                await Helpers.impactSoftFeedback();
                onPressEvent();
            }}
            disabled={isDisabled ||isLoading}
            activeOpacity={0.7}
            style={{
                backgroundColor: isDisabled ? '#bcbcbc' : '#100b16',
                padding: 15,
                borderRadius: 30,
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

export function DarkActionButton({
    onPressEvent,
    isLoading,
    buttonLabel,
    isDisabled = false
}: {
    onPressEvent: () => void,
    isLoading: boolean,
    buttonLabel: string
    isDisabled?: boolean
}) {
    return (
        <TouchableOpacity 
            onPress={async () => {
                await Helpers.impactSoftFeedback();
                onPressEvent();
            }}
            disabled={isDisabled ||isLoading}
            activeOpacity={0.7}
            style={{
                backgroundColor: isDisabled ? primaryCtaDisabledColor : primaryCtaColor,
                padding: 15,
                borderRadius: 30,
                marginTop: 10,
                alignItems: 'center',
                borderWidth: 1.5,
                borderColor: "#251832",
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
                        <DotIndicator color={"#f5f1f8"} count={3} size={7}/>
                    </View>
                )
                : (
                    <View style={{
                        flexDirection: 'row',
                        gap: 6
                    }}>
                        <Text style={{
                            color: '#f5f1f8',
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
    buttonLabel,
    icon
}: {
    onPressEvent: () => void,
    isLoading: boolean,
    buttonLabel: string,
    icon?: ReactNode
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
                paddingHorizontal: 30,
                borderRadius: 30,
                marginTop: 10,
                alignItems: 'center',
                borderWidth: 1,
                borderColor: primaryColor,
        }}>
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
                        gap: 6
                    }}>
                        <Text style={{
                            color: primaryColor,
                            fontWeight: 'bold',
                            fontSize: 14,
                        }}>
                            {buttonLabel}
                        </Text>
                        {
                            icon && (
                                <View style={{
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}>
                                    {icon}
                                </View>
                            )
                        }
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
                <AntDesign name="arrowleft" size={20} color="#0c0811" />
                <Text style={{
                    fontSize: 16,
                    color: "#0c0811",
                }}>
                    {label}
                </Text>
            </View>
        </TouchableOpacity>
    )
}

export function LightBackButton({
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
            }}
        >
            <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 5,
                width: 'auto',
            }}>
                <Feather name='arrow-left' size={20} color="#fff" />
                <Text style={{
                    fontSize: 16,
                    color: "#fff",
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
                borderRadius: 30,
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

export function DarkAppleButton({
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
                backgroundColor: '#66428a',
                padding: 15,
                borderRadius: 30,
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
                            <DotIndicator color={"#f5f1f8"} count={3} size={7}/>
                        </View>
                    )
                    : (
                        <View style={{
                            flexDirection: 'row',
                            gap: 6
                        }}>
                            <Icon name="apple" size={16} color="#f5f1f8" />
                            <Text style={{
                                color: '#f5f1f8',
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

export function ButtonWithIcon({
    label,
    icon,
    color,
    onPressEvent
}: {
    label: string,
    color: string,
    onPressEvent: () => void
    icon?: ReactNode,
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
            }}
        >
            <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 5,
                width: 'auto',
            }}>
                {icon}
                <Text style={{
                    fontSize: 16,
                    color: color,
                }}>
                    {label}
                </Text>
            </View>
        </TouchableOpacity>
    )
}

export function LinkLikeButton({
    label,
    color,
    onPressEvent
}: {
    label: string,
    color: string,
    onPressEvent: () => void
}) {
    return (
        <TouchableOpacity 
            onPress={async () => {
                await Helpers.impactSoftFeedback();
                onPressEvent();
            }} 
            activeOpacity={0.7}
        >
            <Text style={{
                fontSize: 16,
                color,
                textDecorationLine: 'underline',
                fontWeight: 'bold',
            }}>
                {label}
            </Text>
        </TouchableOpacity>
    )
}