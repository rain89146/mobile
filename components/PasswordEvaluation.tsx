import { View, Text } from "react-native";
import AnimatedProgressBar from "./ui/AnimatedProgressBar";
import React from "react";

/**
 * Password strength evaluation component
 * This component displays the password strength based on the score provided.
 * It shows a label for password strength and an animated progress bar indicating the strength level.
 * Combine use with `usePasswordStrengthEvaluatorHook` for score calculation.
 * @param param: { score: number }
 */
export default function PasswordEvaluation({
    score,
}: {
    score: number
}) {

    const getPasswordStrength = (score: number) => {
        if (score === 20) return 'Very Weak';
        if (score === 40) return 'Weak';
        if (score === 60) return 'Medium';
        if (score === 80) return 'Strong';
        if (score === 100) return 'Very Strong';
        return "";
    }

    return (
        <View>
            <View style={{
                flexDirection: 'row',
                alignItems: 'center',
            }}>
                <Text style={{
                    fontSize: 14,
                    color: "#484848",
                    fontWeight: 'bold'
                }}>
                    Password Strength
                </Text>
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginLeft: 'auto',
                }}>
                    <Text style={{
                        fontSize: 14,
                        color: "#484848",
                    }}>{getPasswordStrength(score)}</Text>
                </View>
            </View>
            <View style={{ marginTop: 10 }}>
                <AnimatedProgressBar progress={score / 100}/>
            </View>
        </View>
    )
}