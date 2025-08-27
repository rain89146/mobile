import React from "react";
import { AnimatedRollingNumber, AnimatedRollingNumberProps } from "react-native-animated-rolling-numbers";
import { StyleProp, TextStyle } from "react-native";

export function AnimatedNumbers({
    value, 
    textStyle,
    enableCompactNotation = false,
}: {
    value: number, 
    textStyle: StyleProp<TextStyle>,
    enableCompactNotation: boolean,
}) {

    let prop = {
        value: value,
        showPlusSign: false,
        showMinusSign: false,
        useGrouping: true,
        enableCompactNotation: false,
        textStyle: textStyle,
        locale: "en-US",
    } as AnimatedRollingNumberProps;

    if (enableCompactNotation) {
        prop = {
            ...prop,
            enableCompactNotation: true,
            compactToFixed: 0,
        }
    }

    return (
        <AnimatedRollingNumber {...prop}/>
    )
}