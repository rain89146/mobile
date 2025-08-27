import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef } from 'react'
import { Animated, DimensionValue, View, Easing } from 'react-native'

export function SkeletonBar({
    marginBottom = 10,
    height = 20,
    width = '100%',
    backgroundColor = '#222222ff', // Darker base color
    highlightColor = 'rgba(142, 133, 186, 0.16)', // Configurable highlight intensity
}: {
    marginBottom?: number,
    height?: DimensionValue,
    width?: DimensionValue,
    backgroundColor?: string,
    highlightColor?: string,
}) {
    const animatedValue = useRef(new Animated.Value(0)).current;
    
    useEffect(() => {
        Animated.loop(
            Animated.timing(animatedValue, {
                toValue: 1,
                duration: 1800, // slightly slower for a more natural feel
                useNativeDriver: false,
                easing: Easing.bezier(0.4, 0.0, 0.2, 1), // using Easing.bezier instead
            })
        ).start();
    }, [animatedValue]);
    
    const translateX = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['-80%', '100%'], // adjusted to match gradient width
    });

    // Extract highlight opacity for gradient
    const highlightOpacity = parseFloat(highlightColor.split(',')[3]) || 0.4;
    const midOpacity = highlightOpacity;
    const edgeOpacity = 0;

    return (
        <View 
            style={{
                height,
                width: width,
                borderRadius: 3,
                backgroundColor: backgroundColor,
                overflow: 'hidden',
                marginBottom: marginBottom
            }}
        >
            <Animated.View
                style={{
                    height: '100%',
                    width: '100%',
                    transform: [{ translateX }],
                }}
            >
                <LinearGradient
                    colors={[
                        `rgba(255, 255, 255, ${edgeOpacity})`,
                        `rgba(255, 255, 255, ${highlightOpacity * 0.6})`,
                        `rgba(255, 255, 255, ${midOpacity})`,
                        `rgba(255, 255, 255, ${highlightOpacity * 0.6})`,
                        `rgba(255, 255, 255, ${edgeOpacity})`
                    ]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={{ height: '100%', width: '80%' }}
                />
            </Animated.View>
        </View>
    )
}

export function ParagraphSkeleton({numberOfLines = 3}: {numberOfLines?: number}) {
    return (
        <View>
            {Array.from({ length: numberOfLines }).map((_, index) => {
                const isLastLine = index === numberOfLines - 1;
                // Generate random width between 70% and 100%
                const randomWidth = `${75 + Math.floor(Math.random() * 31)}%`;
                // Make the last line always shorter (70-90%)
                const width = isLastLine ? `${75 + Math.floor(Math.random() * 21)}%` : randomWidth;
                
                return (
                    <SkeletonBar 
                        key={index} 
                        height={12} 
                        width={width as DimensionValue} 
                        marginBottom={isLastLine ? 0 : 9} 
                    />
                )
            })}
        </View>
    )
}

export function TitleSkeleton() {
    return (
        <SkeletonBar 
            height={40} 
            width={`${50 + Math.floor(Math.random() * 21)}%`} 
        />
    )
}

export function TitleRemarkSkeleton() {
    return (
        <>
            <View style={{marginBottom: 12}}>
                <TitleSkeleton />
            </View>
            <ParagraphSkeleton numberOfLines={2} />
        </>
    )
}

export function BarChartSkeleton({height = 300}: {height?: number}) {
    return (
        <View style={{ height: height }}>
            <SkeletonBar height={"100%"} width="100%" />
        </View>
    )
}