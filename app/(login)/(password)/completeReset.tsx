import { ActionButton } from '@/components/ui/ActionButtons'
import { TitleAndRemark } from '@/components/ui/ContentComp'
import { useNavigation, useRouter } from 'expo-router';
import React, { useEffect } from 'react'
import { SafeAreaView, View } from 'react-native'

export default function completeReset() 
{
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const router = useRouter();
    const navigation = useNavigation();

    useEffect(() => {
        navigation.setOptions({ headerShown: false });
    }, []);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
            <View style={{ flex: 1, padding: 35 }}>
                <View style={{width: '100%'}}>
                    <TitleAndRemark 
                        title={'Reset Successful!'}
                        remark={'Your password has been successfully reset. You can now log in with your new password.'} 
                    />
                    <View>
                        <ActionButton 
                            onPressEvent={() => {
                                router.replace('/(login)/login')
                            }}
                            isLoading={isLoading}
                            buttonLabel={'Login Now'}
                        />
                    </View>
                </View>
            </View>
        </SafeAreaView>
    )
}
