import React from 'react'
import { GestureResponderEvent, PanResponder, PanResponderGestureState, Text, ScrollView, View, FlatList } from 'react-native'
import Animated, { useAnimatedScrollHandler, useSharedValue, useAnimatedStyle, withTiming, SharedValue } from 'react-native-reanimated';
import { TypingAnimation } from 'react-native-typing-animation';
import type { ListRenderItem, ListRenderItemInfo, ViewabilityConfig } from 'react-native';
import type { ViewToken } from 'react-native';

export function ScrollViewLayout({ children }: { children: React.ReactNode }) {
    return (
        <ScrollView
            contentContainerStyle={{flexGrow: 1}}
            bounces={true}
            fadingEdgeLength={50}
            showsVerticalScrollIndicator={false}
        >
            <View style={{ flex: 1, paddingTop: 80, paddingBottom: 120 }}>
                <View style={{ flex: 1, flexDirection: 'column' }}>
                    {children}
                </View>
            </View>
        </ScrollView>
    )
}

export function ScrollViewRefreshLayout({
    data,
    refreshing,
    onRefresh,
}: {
    data: any[],
    refreshing: boolean,
    onRefresh: (done: () => void) => Promise<void>,
}) {

    // Use Animated.ScrollView for better performance with reanimated
    const pullDownPosition = useSharedValue(0);

    // Shared value to track scroll position
    const scrollPosition = useSharedValue(0);

    // Shared value to track if the pull down is ready to refresh
    const isReadyToRefresh = useSharedValue(false);

    // Animated scroll handler to track scroll position
    const scrollHandler = useAnimatedScrollHandler({
        onScroll: (event) => {
            scrollPosition.value = event.contentOffset.y;
        },
    });

    const pullDownStyles = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    translateY: pullDownPosition.value,
                },
            ],
        };
    });

    const onPanRelease = () => {

        pullDownPosition.value = withTiming(isReadyToRefresh.value ? 75 : 0, { duration: 180 });

        if (isReadyToRefresh.value) 
        {
            isReadyToRefresh.value = false;

            // Trigger the refresh action
            console.log('Refreshing...');

            const onRefreshComplete = () => {
                pullDownPosition.value = withTiming(0, { duration: 180 });
            };
            
            onRefresh(onRefreshComplete);
        }

        isReadyToRefresh.value = false;
        pullDownPosition.value = 0; // Reset position after release
    };

    const onPanResponderMove = (event: GestureResponderEvent, gestureState: PanResponderGestureState) => {
        const maxDistance = 150;
        pullDownPosition.value = Math.max(Math.min(maxDistance, gestureState.dy), 0);

        if (
            pullDownPosition.value >= maxDistance / 2 &&
            isReadyToRefresh.value === false
        ) {
            isReadyToRefresh.value = true;
            console.log('Ready to refresh');
        }

        if (
            pullDownPosition.value < maxDistance / 2 &&
            isReadyToRefresh.value === true
        ) {
            isReadyToRefresh.value = false;
            console.log('Will not refresh on release');
        }
    };

    const onMoveShouldSetPanResponder = (event: GestureResponderEvent, gestureState: PanResponderGestureState) => {
        return scrollPosition.value <= 0 && gestureState.dy >= 0;
    };

    const panResponderRef = React.useRef(
        PanResponder.create({
            onMoveShouldSetPanResponder: onMoveShouldSetPanResponder,
            onPanResponderMove: onPanResponderMove,
            onPanResponderRelease: onPanRelease,
            onPanResponderTerminate: onPanRelease,
        })
    );

    const refreshContainerStyles = useAnimatedStyle(() => {
        return {
            height: pullDownPosition.value,
        };
    });
    
    return (
        <View 
            pointerEvents={refreshing ? 'none' : 'auto'}
            style={{ 
                flex: 1, 
                paddingHorizontal: 25
            }}
        >
            <Animated.View style={[{}, refreshContainerStyles]}>
                {refreshing && <TypingAnimation 
                    dotColor="black"
                    dotMargin={3}
                    dotAmplitude={3}
                    dotSpeed={0.15}
                    dotRadius={2.5}
                    dotX={12}
                    dotY={6}
                />}
            </Animated.View>
            <Animated.View
                style={[{ flex: 1, paddingHorizontal: 25 }, pullDownStyles]}
                {...panResponderRef.current.panHandlers}
            >
                <Animated.FlatList
                    contentContainerStyle={{flexGrow: 1}}
                    bounces={true}
                    fadingEdgeLength={50}
                    showsVerticalScrollIndicator={false}
                    onScroll={scrollHandler}
                    scrollEventThrottle={16}
                    data={data}
                    renderItem={({ item }) => {
                        return (
                            <View style={{ padding: 10, backgroundColor: '#f0f0f0', marginVertical: 5 }}>
                                <Text>{item}</Text>
                            </View>
                        );
                    }}
                />
            </Animated.View>
        </View>
    )
}

export function HorizontalScrollViewLayout({ ref, snapToOffsets, children }: { ref: React.Ref<ScrollView>, snapToOffsets: number[], children: React.ReactNode }) {
    return (
        <ScrollView
            style={{
                flexGrow: 0,
                alignContent: "center",
            }}
            contentContainerStyle={{
                flexGrow: 1,
                position: "relative",
                gap: 10,
                paddingHorizontal: 25,
            }}
            ref={ref}
            showsVerticalScrollIndicator={false}
            pagingEnabled={true}
            horizontal={true}
            showsHorizontalScrollIndicator={false} 
            bounces={true} 
            fadingEdgeLength={50} 
            disableIntervalMomentum={true}
            snapToOffsets={snapToOffsets}
            decelerationRate="fast" // For smoother snapping
            snapToAlignment="center"
        >
            {children}
        </ScrollView>
    )
}

type HorizontalFlatListLayoutProps<T> = { 
    scrollEnabled: boolean, 
    ref: React.Ref<FlatList<T>>, 
    data: T[], 
    keyExtractor: (item: T) => string, 
    renderItem: (item: T, index: number, scrollX: SharedValue<number>) => React.ReactElement, 
    onViewableItemsChanged: (info: { viewableItems: ViewToken<T>[], changed: ViewToken<T>[] }) => void
};

export function HorizontalFlatListLayout<T>({ 
    ref, 
    data, 
    scrollEnabled,
    keyExtractor, 
    renderItem, 
    onViewableItemsChanged,
}: HorizontalFlatListLayoutProps<T>)
{
    const scrollX = useSharedValue(0);

    const onScrollHandler = useAnimatedScrollHandler({
        onScroll: (event) => {
            scrollX.value = event.contentOffset.x;
        },
    });

    return (
        <Animated.FlatList
            ref={ref}
            bounces={true}
            horizontal={true}
            fadingEdgeLength={50} 
            data={data} 
            renderItem={({item, index}) => renderItem(item, index, scrollX)}
            showsHorizontalScrollIndicator={false}
            pagingEnabled={true}
            keyExtractor={keyExtractor}
            onViewableItemsChanged={onViewableItemsChanged}
            viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
            onScroll={onScrollHandler}
            scrollEnabled={scrollEnabled}
        />
    )
}