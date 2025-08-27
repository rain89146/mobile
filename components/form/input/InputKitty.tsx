import React, { useState } from 'react'
import {View, Text, TouchableOpacity} from 'react-native'
import { Input } from '@ui-kitten/components';
import Feather from '@expo/vector-icons/Feather';
import { errorColor, inputBackgroundColor, primaryTextColor } from '@/constants/Colors';

export function RegInputKitty({
    value,
    onChangeText,
    label,
    placeholder,
    disabled,
    error,
    iconLeft,
    keyboardType = 'default',
    maxLength,
    onBlurEvent,
    onFocusEvent
}: {
    value: string,
    onChangeText: (value: string) => void,
    label: string,
    placeholder: string,
    disabled: boolean,
    maxLength?: number,
    error?: React.ReactNode,
    iconLeft?: React.JSX.Element,
    onBlurEvent?: (event: any) => void,
    onFocusEvent?: (event: any) => void,
    keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad' | 'decimal-pad' | 'number-pad' | 'visible-password',
}) {
    const [focus, setFocus] = useState<boolean>(false)

    const passwordIcon = () => {
        return iconLeft ? iconLeft : <></>;
    }

    return (
        <View style={{
            flexDirection: 'column',
            width: '100%',
        }}>
            <Input 
                value={value}
                label={(evaProps: any) => <Text style={{ fontSize: 14, color: error ? "red" : focus ? '#000' : '#000', marginBottom: 10, fontWeight: '600' }}>{label}</Text>}
                placeholder={placeholder}
                accessoryLeft={passwordIcon}
                onChangeText={(val: string) => onChangeText(val)}
                disabled={disabled}
                keyboardType={keyboardType}
                autoCapitalize='none'
                autoCorrect={false}
                size='medium'
                onFocus={(e) => {
                    setFocus(true)
                    if (onFocusEvent) onFocusEvent(e)
                }}
                onBlur={(e) => {
                    setFocus(false)
                    if (onBlurEvent) onBlurEvent(e)
                }}
                style={{
                    width: '100%',
                    backgroundColor: '#fff',
                    borderRadius: 4,
                    borderColor: error ? 'red' : '#bcbcbc',
                }}
                textStyle={{
                    minHeight: 30,
                    fontSize: 14,
                    color: '#000',
                }}
                maxLength={maxLength}
            />
            {error && (
                <Text style={{
                    fontSize: 14,
                    color: '#ff0000',
                    marginTop: 10,
                }}>{error}</Text>
            )}
        </View>
    )
}

export function PassInputKitty({
    value,
    onChangeText,
    label,
    placeholder,
    disabled,
    error,
    onBlurEvent,
    onFocusEvent
}: {
    value: string,
    onChangeText: (value: string) => void,
    label: string,
    placeholder: string,
    disabled: boolean,
    error?: React.ReactNode,
    onBlurEvent?: (event: any) => void,
    onFocusEvent?: (event: any) => void,
}) {

    const [show, setShow] = useState<boolean>(false)

    const passwordToggle = () => {
        return (
            <TouchableOpacity onPress={() => setShow(!show)}>
                <Feather name={show ? 'eye': 'eye-off'} size={20} color="black" />
            </TouchableOpacity>
        )
    }

    const passwordIcon = () => {
        return (
            <Feather name="lock" size={14} color="#bcbcbc" />
        )
    }
    
    return (
        <View style={{
            flexDirection: 'column',
            width: '100%',
        }}>
            <Input 
                value={value}
                label={(evaProps: any) => <Text style={{ fontSize: 14, color: error ? 'red' : '#000', marginBottom: 10, fontWeight: '600' }}>{label}</Text>}
                placeholder={placeholder}
                accessoryLeft={passwordIcon}
                accessoryRight={passwordToggle}
                secureTextEntry={!show}
                onChangeText={(val: string) => onChangeText(val)}
                disabled={disabled}
                autoCapitalize='none'
                autoCorrect={false}
                size='medium'
                status={error ? 'danger' : 'basic'}
                keyboardType='default'
                onFocus={(e) => {
                    if (onFocusEvent) onFocusEvent(e)
                }}
                onBlur={(e) => {
                    if (onBlurEvent) onBlurEvent(e)
                }}
                style={{
                    width: '100%',
                    backgroundColor: '#fff',
                    borderRadius: 4,
                    borderColor: error ? 'red' : '#bcbcbc',
                    color: '#000',
                }}
                textStyle={{
                    minHeight: 30,
                    fontSize: 14,
                    color: '#000',
                }}
            />
            {error && (
                <Text style={{
                    fontSize: 14,
                    color: '#ff0000',
                    marginTop: 10,
                }}>{error}</Text>
            )}
        </View>
    )
}

export function DarkRegInputKitty({
    value,
    onChangeText,
    label,
    placeholder,
    disabled,
    error,
    iconLeft,
    keyboardType = 'default',
    maxLength,
    onBlurEvent,
    onFocusEvent
}: {
    value: string,
    onChangeText: (value: string) => void,
    label: string,
    placeholder: string,
    disabled: boolean,
    maxLength?: number,
    error?: React.ReactNode,
    iconLeft?: React.JSX.Element,
    onBlurEvent?: (event: any) => void,
    onFocusEvent?: (event: any) => void,
    keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad' | 'decimal-pad' | 'number-pad' | 'visible-password',
}) {
    const [focus, setFocus] = useState<boolean>(false)

    const passwordIcon = () => {
        return iconLeft ? iconLeft : <></>;
    }

    return (
        <View style={{
            flexDirection: 'column',
            width: '100%',
        }}>
            <Input 
                value={value}
                label={(evaProps: any) => <Text style={{ fontSize: 14, color: error ? errorColor : focus ? primaryTextColor : primaryTextColor, marginBottom: 10, fontWeight: '600' }}>{label}</Text>}
                placeholder={placeholder}
                accessoryLeft={passwordIcon}
                onChangeText={(val: string) => onChangeText(val)}
                disabled={disabled}
                keyboardType={keyboardType}
                autoCapitalize='none'
                autoCorrect={false}
                size='medium'
                onFocus={(e) => {
                    setFocus(true)
                    if (onFocusEvent) onFocusEvent(e)
                }}
                onBlur={(e) => {
                    setFocus(false)
                    if (onBlurEvent) onBlurEvent(e)
                }}
                style={{
                    width: '100%',
                    backgroundColor: inputBackgroundColor,
                    borderRadius: 10,
                    borderColor: error ? errorColor : '#452d5e',
                }}
                textStyle={{
                    minHeight: 30,
                    fontSize: 14,
                    color: primaryTextColor,
                }}
                maxLength={maxLength}
            />
            {error && (
                <Text style={{
                    fontSize: 14,
                    color: errorColor,
                    marginTop: 10,
                }}>{error}</Text>
            )}
        </View>
    )
}

export function DarkPassInputKitty({
    value,
    onChangeText,
    label,
    placeholder,
    disabled,
    error,
    onBlurEvent,
    onFocusEvent
}: {
    value: string,
    onChangeText: (value: string) => void,
    label: string,
    placeholder: string,
    disabled: boolean,
    error?: React.ReactNode,
    onBlurEvent?: (event: any) => void,
    onFocusEvent?: (event: any) => void,
}) {

    const [show, setShow] = useState<boolean>(false)

    const passwordToggle = () => {
        return (
            <TouchableOpacity onPress={() => setShow(!show)}>
                <Feather name={show ? 'eye': 'eye-off'} size={20} color={primaryTextColor} />
            </TouchableOpacity>
        )
    }

    const passwordIcon = () => {
        return (
            <Feather name="lock" size={14} color={primaryTextColor} />
        )
    }
    
    return (
        <View style={{
            flexDirection: 'column',
            width: '100%',
        }}>
            <Input 
                value={value}
                label={(evaProps: any) => <Text style={{ fontSize: 14, color: error ? errorColor : primaryTextColor, marginBottom: 10, fontWeight: '600' }}>{label}</Text>}
                placeholder={placeholder}
                accessoryLeft={passwordIcon}
                accessoryRight={passwordToggle}
                secureTextEntry={!show}
                onChangeText={(val: string) => onChangeText(val)}
                disabled={disabled}
                autoCapitalize='none'
                autoCorrect={false}
                size='medium'
                status={error ? 'danger' : 'basic'}
                keyboardType='default'
                onFocus={(e) => {
                    if (onFocusEvent) onFocusEvent(e)
                }}
                onBlur={(e) => {
                    if (onBlurEvent) onBlurEvent(e)
                }}
                style={{
                    color: '#000',
                    width: '100%',
                    backgroundColor: inputBackgroundColor,
                    borderRadius: 10,
                    borderColor: error ? errorColor : '#452d5e',
                }}
                textStyle={{
                    minHeight: 30,
                    fontSize: 14,
                    color: primaryTextColor,
                }}
            />
            {error && (
                <Text style={{
                    fontSize: 14,
                    color: errorColor,
                    marginTop: 10,
                }}>{error}</Text>
            )}
        </View>
    )
}

export function ChatInputKitty({
    value,
    onChangeText,
    label,
    placeholder,
    disabled,
    error,
    iconLeft,
    keyboardType = 'default',
    maxLength,
    onBlurEvent,
    onFocusEvent
}: {
    value: string,
    onChangeText: (value: string) => void,
    label: string,
    placeholder: string,
    disabled: boolean,
    maxLength?: number,
    error?: React.ReactNode,
    iconLeft?: React.JSX.Element,
    onBlurEvent?: (event: any) => void,
    onFocusEvent?: (event: any) => void,
    keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad' | 'decimal-pad' | 'number-pad' | 'visible-password',
}) {
    const [focus, setFocus] = useState<boolean>(false)

    const passwordIcon = () => {
        return iconLeft ? iconLeft : <></>;
    }

    return (
        <View style={{
            flexDirection: 'column',
            width: '100%',
        }}>
            <Input 
                value={value}
                placeholder={placeholder}
                accessoryLeft={passwordIcon}
                onChangeText={(val: string) => onChangeText(val)}
                disabled={disabled}
                keyboardType={keyboardType}
                autoCapitalize='none'
                autoCorrect={false}
                size='medium'
                multiline={true}
                textAlignVertical='top'
                onFocus={(e) => {
                    setFocus(true)
                    if (onFocusEvent) onFocusEvent(e)
                }}
                onBlur={(e) => {
                    setFocus(false)
                    if (onBlurEvent) onBlurEvent(e)
                }}
                style={{
                    width: '100%',
                    backgroundColor: 'transparent',
                    borderColor: 'transparent',
                    padding: 0,
                    margin: 0,
                }}
                placeholderTextColor="#c8b5db"
                textStyle={{
                    minHeight: 30,
                    fontSize: 14,
                    color: '#fff',
                }}
                maxLength={maxLength}
            />
            {error && (
                <Text style={{
                    fontSize: 14,
                    color: '#ff0000',
                    marginTop: 10,
                }}>{error}</Text>
            )}
        </View>
    )
}