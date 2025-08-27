import React from 'react'
import { View } from 'react-native'
import { useLinkBuilder } from '@react-navigation/native';
import { Text, PlatformPressable } from '@react-navigation/elements';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { greyColor, obsidian, primaryColor } from '@/constants/Colors';

export default function FloatingTabBar({state, descriptors, navigation, onChatPress}: {
    state: any;
    descriptors: any;
    navigation: any;
    onChatPress: () => void;
}) {

    //  useLinkBuilder is used to build the href for the tab
    const { buildHref } = useLinkBuilder();
    
    //  get icon for the tab
    const Icons = (name: string, props: any): React.ReactElement | undefined => {
        const icons: Record<string, React.ReactElement> = {
            '(home)': <MaterialIcons name="home" size={20} color="black" {...props}/>,
            '(explore)': <MaterialCommunityIcons name="trophy" size={20} color="black" {...props}/>,
            '(chat)': <MaterialIcons name="person-pin" size={22} color="black" {...props}/>,
            '(inbox)': <FontAwesome6 name="chart-simple" size={20} color="black" {...props}/>,
            '(account)': <MaterialIcons name="person" size={20} color="black" {...props}/>,
        }
        return (icons[name]) ? icons[name] : <></>;
    }

    //  render the tabs
    const renderTabs = () => {
        const tabs: any = [];

        for(let i = 0; i < state.routes.length; i++) {
            const route = state.routes[i];
            const { options } = descriptors[route.key];
            const isFocused = state.index === i;

            //  get the label for the tab
            const label = options.tabBarLabel !== undefined
                ? options.tabBarLabel
                : options.title !== undefined
                    ? options.title
                    : route.name;

            //  when the tab is pressed
            const onPress = () => {
                const event = navigation.emit({
                    type: 'tabPress',
                    target: route.key,
                    canPreventDefault: true,
                });

                if (!isFocused && !event.defaultPrevented) {
                    navigation.navigate(route.name, route.params);
                }
            };

            //  when the tab is long pressed
            const onLongPress = () => {
                navigation.emit({
                    type: 'tabLongPress',
                    target: route.key,
                });
            };

            if (route.name === '(chat)')
            {
                tabs.push(
                    <PlatformPressable
                        key="chat"
                        onPress={onChatPress}
                        style={{
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                        >
                        <View
                            style={{
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: 100,
                                width: 45,
                                height: 45,
                                backgroundColor: "#8b62b4",
                            }}
                        >
                            {Icons('(chat)', {
                                color: "#f5f1f8",
                            })}
                        </View>
                    </PlatformPressable>
                );
            }
            else
            {
                tabs.push(
                    <PlatformPressable
                        href={buildHref(route.name, route.params)}
                        accessibilityState={isFocused ? { selected: true } : {}}
                        accessibilityLabel={options.tabBarAccessibilityLabel}
                        testID={options.tabBarButtonTestID}
                        key={route.name}
                        onPress={onPress}
                        onLongPress={onLongPress}
                        style={{
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <View
                            style={{
                                backgroundColor: isFocused ? "#161a1b" : 'transparent',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: 100,
                                width: 40,
                                height: 40,
                            }}
                        >
                            {Icons(route.name, {
                                color: isFocused ? "#f5f1f8" : greyColor,
                            })}
                        </View>
                        <Text style={{
                            color: isFocused ? primaryColor : greyColor,
                            fontSize: 11,
                            textTransform: 'capitalize',
                            marginTop: 3,
                        }}>
                            {label}
                        </Text>
                    </PlatformPressable>
                )
            }
        }

        return tabs;
    }

    return (
        <View
            style={{
                flexDirection: 'row',
                backgroundColor: obsidian,
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: 20,
                paddingBottom: 30,
                marginHorizontal: 3,
                borderRadius: 35,
                borderCurve: 'continuous',
                elevation: 25,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 9 },
                shadowOpacity: 0.25,
                shadowRadius: 20,
                zIndex: 1000,
                position: 'absolute',
                bottom: 0
            }}
        >
            {renderTabs()}
        </View>
    )
}