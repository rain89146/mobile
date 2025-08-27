import React from 'react'
import { View, Text, TouchableOpacity, ScrollView} from 'react-native'
import { Link } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useAuthContext } from '@/contexts/AuthenticationContext';
import { dangerColor, primaryBackground, primaryTextColor, secondaryTextColor } from '@/constants/Colors';
import { DarkTitleAndRemark } from '@/components/ui/ContentComp';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { DotIndicator } from 'react-native-indicators';

interface MenuSection {
	title: string;
	menu: MenuItem[]
}

interface MenuItem {
	title: string;
	remark: string;
	linkTo: string;
}

const menuContent: MenuSection[] = [
	{
		title: "",
		menu: [
			{
				title: 'Family Members',
				remark: 'Manage your family members and their access',
				linkTo: '/(protected)/(tabs)/(account)/familyMembers'
			},
			{
				title: 'Incomes',
				remark: 'Manage your payment methods',
				linkTo: '/(protected)/(accountSettings)/incomes'
			},
			{
				title: 'Bank Accounts',
				remark: 'Manage your bank accounts',
				linkTo: '/(protected)/(accountSettings)/bankAccounts'
			},
			{
				title: 'My Financial Preferences',
				remark: 'Personalize your financial preferences',
				linkTo: '/(protected)/(tabs)/(account)/financialPreferences'
			},
		]
	},
	{
		title: 'General',
		menu: [
			{
				title: 'Account Information',
				remark: 'View and edit your account information',
				linkTo: '/(protected)/(tabs)/(account)/accountInformation'
			},
			{
				title: 'Security & Privacy',
				remark: 'Manage your security and privacy settings',
				linkTo: '/(protected)/(tabs)/(account)/securityPrivacy'
			},
			{
				title: 'Notifications',
				remark: 'Manage your notification preferences',
				linkTo: '/(protected)/(tabs)/(account)/notifications'
			}
		]
	},
	{
		title: 'Others',
		menu: [
			{
				title: 'About',
				remark: 'Learn more about this app',
				linkTo: '/(protected)/(tabs)/(account)/about'
			},
			{
				title: 'Terms & Conditions',
				remark: 'Review our terms and conditions',
				linkTo: '/(protected)/(tabs)/(account)/termsConditions'
			},
			{
				title: 'Contact Us',
				remark: 'Get in touch with our support team',
				linkTo: '/(protected)/(tabs)/(account)/contactUs'
			}
		]
	},
]

export default function Account() {
	return (
		<View style={{ flex: 1, paddingHorizontal: 25, backgroundColor: primaryBackground }}>
			<ScrollView
				contentContainerStyle={{flexGrow: 1}}
				bounces={true}
				fadingEdgeLength={50}
				showsVerticalScrollIndicator={false}
			>
				<View style={{ flex: 1, paddingTop: 80, paddingBottom: 150 }}>
					<View style={{ flex: 1, flexDirection: 'column' }}>
						<DarkTitleAndRemark 
							title={`Account Settings`}
							remark={'Manage your account settings and preferences.'}
						/>
						<MenuContent menuContent={menuContent} />
						<SignOutButton />
					</View>
				</View>
			</ScrollView>
		</View>
	)
}

function SignOutButton() {
	
	const authContext = useAuthContext();
	const [isLoading, setIsLoading] = React.useState(false);

	const signOut = async () => {
		try {
			setIsLoading(true);	

			// provide haptic feedback
			await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

			// sign out the user
			await authContext.signOut();		
		} 
		catch (error) 
		{
			console.log('Error during sign out:', error);
		} 
		finally 
		{
			setIsLoading(false);
		}
	}

	return (
		<TouchableOpacity
			onPress={() => signOut()}
			activeOpacity={0.7}
			disabled={isLoading}
			style={{
				padding: 15,
				borderRadius: 30,
				marginTop: 50,
				borderColor: isLoading ? "#880909" : dangerColor,
				backgroundColor: isLoading ? "#880909" : dangerColor,
				borderWidth: 2,
				width: '100%',
				alignItems: 'center',
			}}>
			{
				isLoading 
				? (
					<View style={{
						flexDirection: 'row',
						alignItems: 'center',
						justifyContent: 'center',
					}}>
						<DotIndicator color={"#f5f1f8"} count={3} size={7}/>
					</View>
				) : (
					<Text style={{ 
						color: primaryTextColor, 
						fontWeight: 'bold',
						textTransform: 'capitalize',
					}}>
						Account Sign Out
					</Text>
				)
			}
		</TouchableOpacity>
	)
}

function MenuContent({ menuContent }: { menuContent: MenuSection[] })
{
	return (
		menuContent.map((section, index) => (
			<View key={index} style={{ marginBottom: (index === menuContent.length - 1) ? 0 : 60 }}>
				{
					section.title && (
						<Text
							style={{ 
								color: primaryTextColor, 
								fontSize: 16, 
								fontWeight: 'bold',
								marginBottom: 25,
							}}>
							{section.title}
						</Text>
					)
				}
				{
					section.menu.map((item, itemIndex) => {
						const isLastItem = itemIndex === section.menu.length - 1;
						return (
							<React.Fragment key={itemIndex}>
								<AccountSettingItem 
									title={item.title}
									remark={item.remark}
									linkTo={item.linkTo}
								/>
								{!isLastItem && <Divider/>}
							</React.Fragment>
						)
					})
				}
			</View>
		))
	)
}

function Divider() {
	return (
		<View style={{
			borderBottomWidth: 1,
			borderBottomColor: "#242b2d",
			marginVertical: 20,
		}}/>
	)
}

function AccountSettingItem({
	title,
	remark,
	linkTo
}: {
	title: string;
	remark: string;
	linkTo: string;
}) {
	return (
		<Link href={linkTo as any}>
			<View style={{ flexDirection: 'row', alignItems: 'center', width: '100%' }}>
				<View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
					<View>
						<Text style={{ color: primaryTextColor, fontSize: 16 }}>{title}</Text>
						<Text style={{ color: secondaryTextColor, fontSize: 12, marginTop: 5 }}>{remark}</Text>
					</View>
				</View>
				<View style={{ marginLeft: 'auto' }}>
					<MaterialCommunityIcons name="chevron-right" size={20} color={primaryTextColor} />
				</View>
			</View>
		</Link>
	)
}