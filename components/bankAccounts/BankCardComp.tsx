import { View, Text, Dimensions, TouchableOpacity } from 'react-native'
import React, { useMemo } from 'react'
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Helpers } from '@/utils/helpers';
import { Image } from 'expo-image';
import { dopaPrefixColor } from '@/constants/Colors';

export const RegularBankCardComp = ({item_id, name, isLastItem, primary_color, logo}: {item_id: string, name: string, isLastItem: boolean, primary_color: string, logo: any}) => {
    const router = useRouter();
    const deviceWidth = Dimensions.get('window').width;
    const fiftyShade = Helpers.shadeColor(primary_color, -50);
    const darkerShade = Helpers.shadeColor(primary_color, -80);

    return (
        <TouchableOpacity 
            key={item_id} 
            onPress={() => router.push(`/(protected)/(accountSettings)/bankAccounts/bankAccount/${item_id}`)}
        >
            <View style={{
                position: 'relative',
                height: 210,
                borderRadius: 16,
                marginBottom: isLastItem ? 0 : 20,
                width: deviceWidth - 50,
                alignSelf: 'center',
                overflow: 'hidden',
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.2,
                shadowRadius: 5,
                elevation: 5,
            }}>
                {/* Background gradient and color */}
                <LinearGradient
                    colors={[primary_color, fiftyShade, darkerShade]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                    }}
                />
                
                {/* Card pattern overlay */}
                <View style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    opacity: 0.05,
                    backgroundColor: 'transparent',
                    backgroundImage: 'radial-gradient(circle at 20px 20px, #fff 2px, transparent 0)',
                    backgroundSize: '20px 20px',
                }} />
                
                {/* Content container */}
                <View style={{
                    padding: 20,
                    flex: 1,
                    justifyContent: 'space-between',
                }}>
                    {/* Top section with logo */}
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                    }}>
                        {/* Logo in white circle */}
                        <View style={{
                            width: 50,
                            height: 50,
                            borderRadius: 25,
                            backgroundColor: '#fff',
                            justifyContent: 'center',
                            alignItems: 'center',
                            padding: 8,
                            shadowColor: "#000",
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.1,
                            shadowRadius: 2,
                        }}>
                            <Image
                                source={logo}
                                contentFit='contain'
                                style={{
                                    width: '100%',
                                    height: '100%',
                                }}
                            />
                        </View>
                        
                        {/* Card type indicator (optional) */}
                        <Text style={{
                            color: "#fff",
                            fontWeight: 'bold',
                            fontSize: 14,
                            opacity: 0.9,
                        }}>CHECKING</Text>
                    </View>
                    
                    {/* Bottom section with bank name */}
                    <View>
                        {/* Bank name */}
                        <Text style={{
                            color: "#fff",
                            fontWeight: 'bold',
                            fontSize: 16,
                            marginBottom: 8,
                        }}>{name}</Text>
                        
                        {/* Card number placeholder */}
                        <Text style={{
                            color: "#fff",
                            fontSize: 14,
                            opacity: 0.9,
                            letterSpacing: 2,
                        }}>•••• •••• •••• 1234</Text>
                        
                        {/* Card footer - expiry date */}
                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            marginTop: 10,
                        }}>
                            <Text style={{
                                color: "#fff",
                                fontSize: 12,
                                opacity: 0.8,
                            }}>Connected Account</Text>
                            <Text style={{
                                color: "#fff", 
                                fontSize: 12,
                                opacity: 0.8,
                            }}>Tap for details</Text>
                        </View>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    )
}

export const LogoBackgroundBankCardComp = ({item_id, name, logo, primary_color, lastFour, onPressEvent}: {item_id: string, name?: string|null, logo?: string|null, primary_color?: string|null, lastFour?: string|null, onPressEvent?: () => void}) => {

    // Use the institution logo or a default logo if not available
    const cardLogo = logo || 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/16/SoFi_logo.svg/1200px-SoFi_logo.svg.png';

    // Generate a random primary color if not provided
    const primaryColor = useMemo(() => {
        const randIndex = Math.floor(Math.random() * dopaPrefixColor.length);
        const randomColor = dopaPrefixColor[randIndex];
        const primaryColor = primary_color || randomColor;
        return primaryColor;
    }, [primary_color]);

    // Calculate shades of the primary color for gradient background
    const fiftyShade = Helpers.shadeColor(primaryColor, -50);
    const darkerShade = Helpers.shadeColor(primaryColor, -80);
    const starterShade = Helpers.shadeColor(primaryColor, -30);

    return (
        <TouchableOpacity 
            key={item_id} 
            onPress={onPressEvent && onPressEvent}
            style={{
                width: '100%',
            }}
        >
            <View style={{
                position: 'relative',
                height: 230,
                borderRadius: 16,
                width: '100%',
                alignSelf: 'center',
                overflow: 'hidden',
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.2,
                shadowRadius: 5,
                elevation: 5,
            }}>
                {/* Background gradient and color */}
                <LinearGradient
                    colors={[starterShade, fiftyShade, darkerShade]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                    }}
                />
                
                {/* Logo as background with opacity */}
                <View style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    opacity: 0.1,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                    <Image
                        source={cardLogo}
                        contentFit="contain"
                        style={{
                            width: '70%',
                            height: '70%',
                        }}
                    />
                </View>
                
                {/* Content container */}
                <View style={{
                    padding: 20,
                    flex: 1,
                    justifyContent: 'space-between',
                }}>
                    {/* Top section with card type */}
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'flex-end',
                        alignItems: 'flex-start',
                    }}>
                        {/* Card type indicator */}
                        {/* <Text style={{
                            color: "#fff",
                            fontWeight: 'bold',
                            fontSize: 14,
                            opacity: 0.9,
                            backgroundColor: 'rgba(0,0,0,0.2)',
                            paddingVertical: 4,
                            paddingHorizontal: 8,
                            borderRadius: 4,
                        }}>CHECKING</Text> */}
                    </View>
                    
                    {/* Bottom section with bank name */}
                    <View>
                        {/* Bank name */}
                        {
                            name && 
                            <Text style={{
                                color: "#fff",
                                fontWeight: 'bold',
                                fontSize: 18,
                                marginBottom: 8,
                                textShadowColor: 'rgba(0,0,0,0.5)',
                                textShadowOffset: {width: 1, height: 1},
                                textShadowRadius: 3,
                            }}>{name}</Text>
                        }
                        
                        {/* Card number placeholder */}
                        <Text style={{
                            color: "#fff",
                            fontSize: 14,
                            opacity: 0.9,
                            letterSpacing: 2,
                        }}>•••• •••• •••• {lastFour}</Text>
                        
                        {/* Card footer - expiry date */}
                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            marginTop: 10,
                        }}>
                            {/* <Text style={{
                                color: "#fff",
                                fontSize: 12,
                                opacity: 0.8,
                            }}>Connected Account</Text> */}
                            <Text style={{
                                color: "#fff", 
                                fontSize: 12,
                                opacity: 0.8,
                            }}>Tap for details</Text>
                        </View>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    )
}

export const LogoRepeatingBackgroundBankCardComp = ({item_id, name, isLastItem, logo, primary_color, lastFour}: {item_id: string, name?: string|null, isLastItem: boolean, logo?: string|null, primary_color?: string|null, lastFour?: string|null}) => {
    const router = useRouter();
    const deviceWidth = Dimensions.get('window').width;

    // Use the institution logo or a default logo if not available
    const cardLogo = logo || 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/16/SoFi_logo.svg/1200px-SoFi_logo.svg.png';

    // Generate a random primary color if not provided
    const primaryColor = useMemo(() => {
        const randIndex = Math.floor(Math.random() * dopaPrefixColor.length);
        const randomColor = dopaPrefixColor[randIndex];
        const primaryColor = primary_color || randomColor;
        return primaryColor;
    }, [primary_color]);

    // Calculate shades of the primary color for gradient background
    const fiftyShade = Helpers.shadeColor(primaryColor, -50);
    const darkerShade = Helpers.shadeColor(primaryColor, -80);
    const starterShade = Helpers.shadeColor(primaryColor, -30);

    // Create an alternating pattern array
    const createHoneycombPattern = () => {
        const cardWidth = deviceWidth - 50;
        const cardHeight = 210;
        
        // Size configuration
        const baseSize = 32;
        const spacing = 50; // Space between logos
        
        // Calculate rows and columns
        const rows = Math.ceil(cardHeight / spacing) + 2; // Add extra rows for overflow
        const cols = Math.ceil(cardWidth / spacing) + 2; // Add extra columns for overflow
        
        const pattern = [];
        
        // Generate the honeycomb/alternating pattern
        for (let row = 0; row < rows; row++) {
            const isOffsetRow = row % 2 === 0;
            const rowOffset = isOffsetRow ? spacing / 2 : 0; // Offset alternate rows
            
            for (let col = 0; col < cols; col++) {
                // Calculate position
                const left = (col * spacing) + rowOffset - spacing/2;
                const top = (row * spacing) - spacing/2;
                
                // Add small randomness
                const size = baseSize + (Math.random() * 6 - 3);
                const rotate = 0; // -20 to +20 degrees
                const opacity = 0.7 + Math.random() * 0.3; // 0.7 to 1.0
                
                pattern.push({
                    left,
                    top,
                    size,
                    rotate,
                    opacity
                });
            }
        }
        
        return pattern;
    };
    
    const logoPattern = useMemo(() => createHoneycombPattern(), [deviceWidth]);

    return (
        <TouchableOpacity 
            onPress={() => router.push(`/(protected)/(accountSettings)/bankAccounts/bankAccount/${item_id}`)}
        >
            <View style={{
                position: 'relative',
                height: 210,
                borderRadius: 16,
                marginBottom: isLastItem ? 0 : 20,
                width: deviceWidth - 50,
                alignSelf: 'center',
                overflow: 'hidden',
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.2,
                shadowRadius: 5,
                elevation: 5,
            }}>
                {/* Background gradient and color */}
                <LinearGradient
                    colors={[starterShade, fiftyShade, darkerShade]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                    }}
                />
                
                {/* Logo honeycomb pattern background */}
                <View style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    opacity: 0.1,
                }}>
                    {logoPattern.map((item, i) => (
                        <View 
                            key={i} 
                            style={{
                                position: 'absolute',
                                width: item.size,
                                height: item.size,
                                left: item.left,
                                top: item.top,
                                transform: [{ rotate: `${item.rotate}deg` }],
                            }}
                        >
                            <Image
                                source={cardLogo}
                                contentFit="contain"
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    opacity: item.opacity,
                                }}
                            />
                        </View>
                    ))}
                </View>
                
                {/* Content container */}
                <View style={{
                    padding: 20,
                    flex: 1,
                    justifyContent: 'space-between',
                }}>
                    {/* Top section with card type */}
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'flex-end',
                        alignItems: 'flex-start',
                    }}>
                        {/* Card type indicator if needed */}
                    </View>
                    
                    {/* Bottom section with bank name */}
                    <View>
                        {/* Bank name */}
                        {
                            name && 
                            <Text style={{
                                color: "#fff",
                                fontWeight: 'bold',
                                fontSize: 18,
                                marginBottom: 8,
                                textShadowColor: 'rgba(0,0,0,0.5)',
                                textShadowOffset: {width: 1, height: 1},
                                textShadowRadius: 3,
                            }}>{name}</Text>
                        }
                        
                        {/* Card number placeholder */}
                        <Text style={{
                            color: "#fff",
                            fontSize: 14,
                            opacity: 0.9,
                            letterSpacing: 2,
                        }}>•••• •••• •••• {lastFour}</Text>
                        
                        {/* Card footer */}
                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            marginTop: 10,
                        }}>
                            <Text style={{
                                color: "#fff", 
                                fontSize: 12,
                                opacity: 0.8,
                            }}>Tap for details</Text>
                        </View>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    )
}