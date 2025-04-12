import useToastHook from '@/hooks/useToastHook';
import React from 'react'
import { View, Text, Button } from 'react-native'
import { Link, useRouter } from 'expo-router';

export default function account() {

  const {showToast, hideToast} = useToastHook();
  const router = useRouter();
  
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>
            Account
        </Text>
		<View>
			<View>
				<Link href={'/account/setting'} asChild>
					<Text>Setting</Text>
				</Link>
			</View>
		</View>
        <Button
            title="Go to Home"
            onPress={() => {
				showToast({
					type: 'info',
					text1: 'Hello',
					text2: `Let's go to home 👋`,
					position: 'bottom',
					onPress: () => {
						router.navigate('/')
						hideToast()
					}
				})
			}}
            color="#841584"
            accessibilityLabel="Tap me to go to home"
        />
    </View>
  )
}
