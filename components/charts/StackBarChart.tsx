import { primaryColor } from '@/constants/Colors'
import React from 'react'
import { Dimensions, View, Text } from 'react-native';
import { BarChart, stackDataItem } from 'react-native-gifted-charts'

export function StackBarChart({data, setFocusedIndex}: {data: stackDataItem[], setFocusedIndex: (index: number) => void}) {
    // Check if data is valid
    if (!data || data.length === 0) {
        return (
            <View style={{ height: 280, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ color: '#ffffff' }}>No data available</Text>
            </View>
        );
    }
    
    const stacks = data.length;
    const chartWidth = Dimensions.get('window').width - 50; // Account for padding
    
    // Calculate barWidth
    const barWidth = Math.max(23, Math.min(30, chartWidth / (stacks * 2)));
    const endSpacing = 60;
    
    // Calculate spacing
    let spacing = 0;
    if (stacks > 1) {
        const totalBarWidth = barWidth * stacks;
        const availableSpaceForSpacing = chartWidth - totalBarWidth - endSpacing;
        spacing = Math.max(0, availableSpaceForSpacing / (stacks - 1));
    }

    return (
        <BarChart
            height={260}
            width={chartWidth}
            rotateLabel={false}
            barWidth={barWidth ?? 0}
            noOfSections={6}
            barBorderRadius={3}
            stackData={data}
            hideYAxisText={true}
            showValuesAsTopLabel={true}
            autoCenterTooltip={true}
            onPress={(_item: any, index: number) => setFocusedIndex(index)}
            // showLine={true}
            // lineConfig={{
            //     color: primaryColor,
            //     thickness: 2, // Slightly thicker line
            //     curved: true,
            //     curvature: 0.3,
            //     isAnimated: true,
            //     hideDataPoints: true,
            //     dataPointsColor: primaryColor, 
            //     dataPointsRadius: 4,
            // }}
            lineBehindBars={false}
            xAxisLabelTextStyle={{ color: "#ffffff", fontSize: 10 }}
            yAxisTextStyle={{ color: "#ffffff", fontSize: 10 }}
            frontColor="#000"
            xAxisThickness={0}
            yAxisThickness={0}
            disableScroll={true}
            showVerticalLines={false}
            initialSpacing={0}
            endSpacing={endSpacing}
            spacing={Math.max(0, spacing)} // Ensure spacing is never negative
            topLabelContainerStyle={{
                marginBottom: 6,
                borderRadius: 4,
                paddingVertical: 2, 
                paddingHorizontal: 6
            }}
        />
    )
}