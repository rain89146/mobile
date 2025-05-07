import React from 'react'
import { Canvas, DiffRect, rect, rrect } from "@shopify/react-native-skia";
import { Dimensions, Platform, StyleSheet } from "react-native";
import { View, Text } from 'react-native'

export default function CameraScannerOverlay({isScanning}: {isScanning: boolean}) {

    const { width, height } = Dimensions.get("window");

    const innerDimension = 250;

    const outer = rrect(rect(0, 0, width, height), 0, 0);

    const inner = rrect(
        rect(
            (width / 2 - innerDimension / 2 - 5),
            (height / 2 - innerDimension / 2 - 60),
            innerDimension,
            innerDimension
        ),
        70,
        70
    );

    return isScanning && (
        <Canvas
            style={
                Platform.OS === "android" 
                ? { flex: 1 } 
                : {
                    ...StyleSheet.absoluteFillObject,
                    borderRadius: 30,
                    zIndex: 2,
                    overflow: "hidden",
                }
            }
        >
            <DiffRect inner={inner} outer={outer} color="black" opacity={0.8}/>
        </Canvas>
    )
}
