import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { View } from "react-native";

function MatteLinearGradientBackground() {
    return (
        <LinearGradient
            colors={[
                'rgba(53, 30, 80, 0.95)', 
                'rgba(13, 4, 26, 0.85)', 
                'rgba(21, 9, 38, 0.25)', 
                'transparent'
            ]}
            start={{ x: 0.1, y: 0 }}
            end={{ x: 0.8, y: 1 }}
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '100%',
                overflow: 'hidden',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.3,
                shadowRadius: 12,
                elevation: 10,
            }}
        >
            {/* Matte texture overlay */}
            <View style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                opacity: 0.04,
                backgroundColor: '#FFF',
            }}>
                {Array(50).fill(0).map((_, i) => {
                    // Generate random positions as percentages of the parent container's width/height
                    const leftPercent = Math.random();
                    const topPercent = Math.random();
                    return (
                        <View 
                            key={i}
                            style={{
                                position: 'absolute',
                                width: Math.random() * 100 + 30,
                                height: 1,
                                backgroundColor: '#FFF',
                                left: `${leftPercent * 100}%`,
                                top: `${topPercent * 100}%`,
                                transform: [{ rotate: `${Math.random() * 360}deg` }],
                                opacity: Math.random() * 0.3 + 0.1,
                            } as any} // Cast as any to allow percentage strings for left/top
                        />
                    );
                })}
            </View>
            
            {/* Secondary gradient overlay */}
            <View style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                opacity: 0.2,
                backgroundColor: 'transparent',
                backgroundImage: 'linear-gradient(180deg, transparent 60%, #190d28 100%)'
            }} />
        </LinearGradient>
    );
}

export { MatteLinearGradientBackground }