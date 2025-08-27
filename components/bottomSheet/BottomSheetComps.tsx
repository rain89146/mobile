import BottomSheet, { BottomSheetBackdrop, BottomSheetScrollView, BottomSheetView } from "@gorhom/bottom-sheet"
import React from "react"
import { Text, View } from "react-native";
import { DarkActionButton, LinkLikeButton } from "../ui/ActionButtons";
import { obsidian } from "@/constants/Colors";
import { BottomSheetMethods } from "@gorhom/bottom-sheet/lib/typescript/types";

export const bottomSheetBackdrop = (props: any) => {
    return (
        <BottomSheetBackdrop
            {...props}
            appearsOnIndex={1}
            disappearsOnIndex={-1}
            enableTouchThrough={false}
            opacity={0.9}
            pressBehavior={'none'}
        />
    )
}

export function BottomSheetContextLayout({
    title,
    description,
    primaryAction,
    primaryText,
    secondaryAction,
    secondaryText
}: {
    title: string;
    description: string;
    primaryAction?: () => void;
    primaryText?: string;
    secondaryAction?: () => void;
    secondaryText?: string;
}) {
    return (
        <View style={{ flex: 1, paddingHorizontal: 20, paddingVertical: 40, height: '100%' }}>
            <View style={{marginBottom: 20}}>
                <View>
                    <Text style={{ fontWeight: 'bold', fontSize: 35, fontFamily: 'PlayfairDisplay-Regular', textAlign: 'center' }}>{title}</Text>
                </View>
                <View style={{ marginTop: 15 }}>
                    <Text style={{ fontSize: 14, lineHeight: 22, textAlign: 'center' }}>{description}</Text>
                </View>
            </View>
            <View style={{ marginTop: 'auto', paddingBottom: 35 }}>
            {
                primaryAction &&
                <View>
                    <DarkActionButton
                        onPressEvent={() => primaryAction()}
                        isLoading={false}
                        buttonLabel={primaryText || 'Got it, thanks!'}
                        isDisabled={false}
                    />
                </View>
            }
            {
                secondaryAction &&
                <View style={{ marginTop: 30, justifyContent: 'center', alignItems: 'center' }}>
                    <LinkLikeButton 
                        label={secondaryText || 'No, never mind'}
                        onPressEvent={() => secondaryAction()}
                        color={obsidian}
                    />
                </View>
            }
            </View>
        </View>
    )
}

export function DialogBoxBottomSheet({ref, bottomSheetContent}: {
    ref: React.RefObject<BottomSheetMethods | null>;
    bottomSheetContent: React.ReactNode;
}) {
    return (
        <BottomSheet
            ref={ref}
            snapPoints={['55%']}
            style={{zIndex: 100}}
            enablePanDownToClose={false}
            enableDynamicSizing={false}
            backdropComponent={bottomSheetBackdrop}
            index={-1}
        >
            <BottomSheetView style={{ width: '100%', height: '100%' }}>
                {bottomSheetContent}
            </BottomSheetView>
        </BottomSheet>
    )
}

export function FullHeightBottomSheet({ref, bottomSheetContent}: {
    ref: React.RefObject<BottomSheetMethods | null>;
    bottomSheetContent: React.ReactNode;
}) {
    return (
        <BottomSheet
            ref={ref}
            snapPoints={['90%']}
            style={{zIndex: 1000}}
            enablePanDownToClose={false}
            enableDynamicSizing={false}
            backdropComponent={bottomSheetBackdrop}
            index={-1}
        >
            <BottomSheetView style={{ width: '100%', height: '100%' }}>
                <BottomSheetScrollView
                    contentContainerStyle={{ flexGrow: 1 }}
                    bounces={true}
                    fadingEdgeLength={50}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={{ padding: 20 }}>
                        {bottomSheetContent}
                    </View>
                </BottomSheetScrollView>
            </BottomSheetView>
        </BottomSheet>
    )
}