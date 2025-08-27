import React, { useEffect } from 'react'
import { Stack, useNavigation } from 'expo-router'
import { BankPageContextProvider } from '@/contexts/account/bank/BankPageContext';


export default function Layout() {
	const navigation = useNavigation();

	useEffect(() => {
		navigation.setOptions({ headerShown: false });
	}, [navigation]);

	return (
		<BankPageContextProvider>
			<Stack screenOptions={{
				headerShown: false
			}} />
		</BankPageContextProvider>
	)
}
