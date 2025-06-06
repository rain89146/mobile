import React, {useEffect} from 'react'
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { View, Text, TouchableOpacity, Linking } from 'react-native';
import Octicons from '@expo/vector-icons/Octicons';

export default function Modal() {

    const navigation = useNavigation();
    const {destination} = useLocalSearchParams();

    useEffect(() => {
        navigation.setOptions({ 
            headerShown: false,
            presentation: 'modal',
        });
    }, [navigation]);

    /**
     * Open the external link in the default browser
     * @param {string} url - The URL to open
     * @returns {void}
     */
    const openExternalLink = (url: string) => Linking.openURL(url);

    return (
        <View style={{
            flex: 1,
            backgroundColor: '#fff',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 20,
        }}>
            <View style={{paddingBottom: 20}}>
                <Text style={{
                    fontSize: 18,
                    fontWeight: 'bold',
                }}>External Redirect</Text>
            </View>
            <View style={{paddingBottom: 40}}>
                <Text style={{
                    fontSize: 14,
                    textAlign: 'center',
                    color: '#333',
                }}>You are about to get redirected to an external source (<Text style={{fontWeight: 'bold', textDecorationLine: 'underline'}}>{destination}</Text>). Please make sure you acknowledge this and click on redirect button below.</Text>
            </View>
            <TouchableOpacity
                onPress={() => openExternalLink(destination as string)}
                style={{
                    paddingTop: 10,
                    paddingBottom: 10,
                    paddingLeft: 25,
                    paddingRight: 25,
                    backgroundColor: '#fff',
                    borderRadius: 5,
                    borderWidth: 2,
                    borderColor: '#5294dc',
                }}
            >
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: 8,
                }}>
                    <Text style={{
                        fontSize: 14,
                        fontWeight: 'bold',
                        textTransform: 'uppercase',
                        color: '#5294dc',
                    }}>Redirect</Text>
                    <Octicons name="link-external" size={16} color="#5294dc" style={{paddingTop: 2}}/>
                </View>
            </TouchableOpacity>
        </View>
    )
}
