import { ActionButton } from '@/components/ui/ActionButtons'
import { TitleAndRemark } from '@/components/ui/ContentComp'
import { usePasswordResetContext } from '@/contexts/PasswordResetContext';
import { useNavigation, useRouter } from 'expo-router';
import React, { useEffect } from 'react'
import { SafeAreaView, View } from 'react-native'

export default function CompleteReset() 
{
    const [isLoading] = React.useState<boolean>(false);
    const passwordContext = usePasswordResetContext();
    const router = useRouter();
    const navigation = useNavigation();

    useEffect(() => {
        navigation.setOptions({ headerShown: false });
    }, [navigation]);

    //  Cleanup when the component unmounts
    useEffect(() => {
        return () => {
            passwordContext.setEmail('');
        }
    }, [passwordContext]);

    //  Close the modal
    const closeModal = () => router.back();

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
                            onPressEvent={() => closeModal()}
                            isLoading={isLoading}
                            buttonLabel={'Login Now'}
                        />
                    </View>
                </View>
            </View>
        </SafeAreaView>
    )
}
