import { View, Dimensions, Animated } from 'react-native'
import React, { memo, useEffect } from 'react'

const prefixColor = [
    '#f3a74c',
    '#7141ff',
    '#28c1b8',
    '#f96590',
];

const prefixDegree = [
    '0deg',
    '90deg',
    '180deg',
    '270deg',
    '360deg',
];

function RandomPieTriangle({columns}: {columns: number})
{
    const screenWidth = Dimensions.get('window').width;
    const widthOfPie = screenWidth / columns;
    const [pieSeed, setPieSeed] = React.useState(Date.now());

    useEffect(() => {
        const interval = setInterval(() => {
            setPieSeed(Date.now());
        }, 8000);
        return () => clearInterval(interval);
    }, []);

    function RowWithFade({ children, delay }: { children: React.ReactNode, delay: number }) {
        const fadeAnim = React.useRef(new Animated.Value(0)).current;
        const translateY = React.useRef(new Animated.Value(20)).current;

        useEffect(() => {
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 500,
                    delay,
                    useNativeDriver: true,
                }),
                Animated.timing(translateY, {
                    toValue: 0,
                    duration: 500,
                    delay,
                    useNativeDriver: true,
                }),
            ]).start();
        }, [pieSeed, delay]);

        return (
            <Animated.View
                style={{
                    opacity: fadeAnim,
                    transform: [{ translateY }],
                }}
            >
                {children}
            </Animated.View>
        );
    }

    return (
        <View style={{ flexDirection: 'column', width: '100%', height: '100%' }}>
            {Array.from({ length: columns }).map((_, rowIdx) => {
                const piesInRow = columns - rowIdx;
                const leftMargin = rowIdx * widthOfPie;

                return (
                    <RowWithFade key={rowIdx} delay={rowIdx * 80}>
                        <View
                            style={{
                                flexDirection: 'row',
                                marginLeft: leftMargin,
                                marginBottom: 2,
                                justifyContent: 'flex-end',
                            }}
                        >
                            {Array.from({ length: piesInRow }).map((_, colIdx) => {
                                const randomDegree = prefixDegree[Math.floor(Math.random() * prefixDegree.length)];
                                const randomColor = prefixColor[Math.floor(Math.random() * prefixColor.length)];
                                return (
                                    <Pie
                                        width={widthOfPie}
                                        height={widthOfPie}
                                        key={`${rowIdx}-${colIdx}-${pieSeed}`}
                                        color={randomColor}
                                        rotation={randomDegree}
                                    />
                                );
                            })}
                        </View>
                    </RowWithFade>
                );
            })}
        </View>
    );
}

function RandomPieBackground({rows, columns}: {rows: number, columns: number}) {
    
    // get the width and height of the screen
    const screenWidth = Dimensions.get('window').width;
    const widthOfPie = screenWidth / columns;
    const [pieSeed, setPieSeed] = React.useState(Date.now());

    useEffect(() => {
        const interval = setInterval(() => {
            setPieSeed(Date.now());
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    // PieWithFade: wraps Pie with fade-up animation
    function PieWithFade(props: React.ComponentProps<typeof Pie>) {
        return <Pie {...props} />;
    }

    // RowWithFade: wraps each row with fade-up animation
    function RowWithFade({ children, delay }: { children: React.ReactNode, delay: number }) {
        const fadeAnim = React.useRef(new Animated.Value(0)).current;
        const translateY = React.useRef(new Animated.Value(20)).current;

        useEffect(() => {
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 500,
                    delay,
                    useNativeDriver: true,
                }),
                Animated.timing(translateY, {
                    toValue: 0,
                    duration: 500,
                    delay,
                    useNativeDriver: true,
                }),
            ]).start();
        }, [pieSeed, delay]);

        return (
            <Animated.View
                style={{
                    opacity: fadeAnim,
                    transform: [{ translateY }],
                }}
            >
                {children}
            </Animated.View>
        );
    }

    return (
        <View style={{ flexDirection: 'column', flexWrap: 'wrap', width: '100%', height: '100%' }}>
            {Array.from({ length: rows }).map((_, rowIdx) => (
                <RowWithFade key={rowIdx} delay={rowIdx * 80}>
                    <View style={{ flexDirection: 'row' }}>
                        {Array.from({ length: columns }).map((_, colIdx) => {
                            const isEdge = colIdx === 0 || colIdx === columns - 1;
                            if (!isEdge && Math.random() < 0.2) return null;

                            const randomDegree = prefixDegree[Math.floor(Math.random() * prefixDegree.length)];
                            const randomColor = prefixColor[Math.floor(Math.random() * prefixColor.length)];

                            return (
                                <PieWithFade
                                    width={widthOfPie}
                                    height={widthOfPie}
                                    key={`${rowIdx}-${colIdx}-${pieSeed}`}
                                    color={randomColor}
                                    rotation={randomDegree}
                                />
                            );
                        })}
                    </View>
                </RowWithFade>
            ))}
        </View>
    )
}

function Pie({width, height, color, rotation}: {width: number, height: number, color: string, rotation: string}) {
    return (
        <View
            style={{
                width: width,
                height: height,
                borderTopLeftRadius: 120,
                backgroundColor: color,
                transform: [{ rotate: rotation }],
            }}
        />
    )
}

// Memoized version of SecondaryBackground
const MemoizedSecondaryBackground = memo(function SecondaryBackground() {
    return (
        <View style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
        }}>
            <RandomPieTriangle columns={5} />
        </View>
    )
});

// Memoized version of LandingBackground
const MemoizedLandingBackground = memo(function LandingBackground() {
    return (
        <View
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '100%',
                backgroundColor: '#000',
            }}
        >
            <RandomPieBackground rows={25} columns={5} />
        </View>
    )
});

const LandingBackground = MemoizedLandingBackground;
const SecondaryBackground = MemoizedSecondaryBackground;

export {
    LandingBackground,
    SecondaryBackground
}