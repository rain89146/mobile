import React, { useEffect, useRef } from 'react'
import { Animated, Easing, StyleSheet, View } from 'react-native';

export default function AnimatedProgressBar({
    progress,
    duration = 200,
}: {
    progress: number,
    duration?: number
}) {
    const animation = useRef(new Animated.Value(0)).current;
    useEffect(() => {
        Animated.timing(animation, {
        toValue: progress,
        duration,
        easing: Easing.linear,
        useNativeDriver: false,
        }).start();
    }, [progress, duration, animation]);

    const width = animation.interpolate({
        inputRange: [0, 1],
        outputRange: ['0%', '100%'],
        extrapolate: 'clamp',
    });

    const styles = StyleSheet.create({
        container: {
            width: '100%',
            height: 10,
            backgroundColor: '#f8f8f8',
            borderRadius: 4,
        },
        bar: {
            height: 10,
            backgroundColor: progress*100 >= 80 ? 'green' : progress*100 >= 60 ? 'orange' : 'red',
            borderRadius: 4,
        },
    });
    
    return (
        <View style={styles.container}>
            <Animated.View style={[
                styles.bar,
                { width }
            ]} />
        </View>
    )
}
