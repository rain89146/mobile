import type { PropsWithChildren, ReactElement } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  interpolate,
  useAnimatedRef,
  useAnimatedStyle,
  useScrollViewOffset,
} from 'react-native-reanimated';

import { ThemedView } from '@/components/ThemedView';
import React from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { primaryBackground } from '@/constants/Colors';

type Props = PropsWithChildren<{
	height: number;
	headerContent: ReactElement;
	gradientThreshold?: number;
}>;

export default function ParallaxScrollViewLayout({
	height,
	children,
	headerContent,
	gradientThreshold = 250,
}: Props) {
	const scrollRef = useAnimatedRef<Animated.ScrollView>();
	const scrollOffset = useScrollViewOffset(scrollRef);

	// Header animation
	const headerAnimatedStyle = useAnimatedStyle(() => {
		return {
		transform: [
			{
				translateY: interpolate(
					scrollOffset.value,
					[-height, 0, height],
					[-height / 2, 0, height * 0.75]
				),
			},
		],
		};
	});

	// Extract gradient opacity animation into its own useAnimatedStyle
    const gradientAnimatedStyle = useAnimatedStyle(() => {
        return {
            opacity: interpolate(
                scrollOffset.value,
                [0, gradientThreshold],
                [0, 1],
                'clamp'
            )
        };
    });

	const backgroundColor = "#0a0118ff";

  	return (
		<>
			<Animated.ScrollView
				ref={scrollRef}
				scrollEventThrottle={16}
				style={{
					backgroundColor: backgroundColor,
				}}
			>
				<Animated.View
					style={[
						styles.header,
						headerAnimatedStyle,
						{
							height: 'auto',
						}
					]}
				>
					<Animated.View style={[
                        {
                            position: 'absolute',
                            left: 0,
                            right: 0,
                            height: '100%',
							zIndex: 2
                        },
                        gradientAnimatedStyle
                    ]}>
						<LinearGradient
							colors={[backgroundColor, 'transparent']}
							style={{
								position: 'absolute',
								left: 0,
								right: 0,
								height: '100%'
							}}
						/>
					</Animated.View>
					<View style={{
						flex: 1,
						padding: 25,
						paddingTop: 80,
						flexDirection: 'column', 
					}}>
						{headerContent}
					</View>
				</Animated.View>
				<ThemedView style={styles.content}>{children}</ThemedView>
			</Animated.ScrollView>
			<View style={{
				position: 'absolute',
				bottom: 0,
				left: 0,
				right: 0,
				height: 100,
				overflow: 'hidden'
			}}>
				<LinearGradient
					colors={['transparent', backgroundColor]}
					style={{
						position: 'absolute',
						left: 0,
						right: 0,
						height: '100%'
					}}
				/>
			</View>
		</>
  	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	header: {
		overflow: 'hidden',
		position: 'relative',
	},
	content: {
		flex: 1,
		overflow: 'hidden',
		paddingVertical: 40,
		paddingBottom: 60,
		borderRadius: 30,
		backgroundColor: primaryBackground,
		paddingHorizontal: 25,
		zIndex: 2
	},
});
