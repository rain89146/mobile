import { LightBackButton } from '@/components/ui/ActionButtons'
import { DarkTitleAndRemark } from '@/components/ui/ContentComp'
import { primaryBackground, primaryColor } from '@/constants/Colors'
import { useAuthContext } from '@/contexts/AuthenticationContext'
import { SocketEvents, useSocketContext } from '@/contexts/SocketContext'
import { PlaidAuthButton } from '@/components/plaid/PlaidAuthButtons'
import { PlaidService } from '@/services/PlaidService'
import { PlaidAccountOverview, PlaidInstitutions } from '@/types/PlaidObjects'
import { router, useRouter } from 'expo-router'
import React, {useEffect, useCallback, useRef, useState} from 'react'
import { View, ScrollView, Text, RefreshControl, FlatList, ViewToken, Dimensions, TouchableOpacity } from 'react-native'
import { useFocusEffect } from '@react-navigation/native';
import { LogoBackgroundBankCardComp } from '@/components/bankAccounts/BankCardComp'
import { AccountsContent } from './accounts/[itemId]'
import { HorizontalFlatListLayout } from '@/components/layout/ScrollViewLayout'
import Animated, { Extrapolation, interpolate, SharedValue, useAnimatedStyle } from 'react-native-reanimated'
import Feather from '@expo/vector-icons/Feather';
import { BottomSheetContextLayout, DialogBoxBottomSheet } from '@/components/bottomSheet/BottomSheetComps'
import BottomSheet from '@gorhom/bottom-sheet'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useBankPageContext } from '@/contexts/account/bank/BankPageContext'

class UnauthorizedUserError extends Error {
    constructor() {
        super();
        this.name = this.constructor.name;
        this.message = 'User is not authenticated. Please log in first.';
    }
}

class InstitutionNotFoundException extends Error {
    constructor() {
        super();
        this.name = this.constructor.name;
        this.message = 'Institution not found';
    }
}

export default function Index()
{
    const router = useRouter();
    const authContext = useAuthContext();
    const bankPageContext = useBankPageContext();
    const {socket, socketId} = useSocketContext();
    const bottomSheetRef = useRef<BottomSheet>(null);

    // local state
    const [currentOverview, setCurrentOverview] = React.useState<PlaidAccountOverview | null>(null);
    const [refreshing, setRefreshing] = React.useState<boolean>(false);
    const [sessionFinished, setSessionFinished] = React.useState<boolean | null>(null);
    const [onPage, setOnPage] = React.useState<boolean>(true);

    // bottom sheet content state
    const [bottomSheetContent, setBottomSheetContent] = useState<React.ReactNode>(null);

    // Refresh function to fetch accounts
    const onRefresh = () => setRefreshing(true);

    // when the socket connection is established, listen for the Plaid session finished event
    useEffect(() => {
        if (!socket) return;

        // Listen for socket events to refresh institutions
        socket.on(SocketEvents.PLAID_SESSION_FINISHED, ({userId}) => {
            if (userId === authContext.authCredential?.userId) setSessionFinished(true);
        });

        // Cleanup the socket listener when the component unmounts
        return () => {
            socket.off(SocketEvents.PLAID_SESSION_FINISHED);
        }
    }, [authContext.authCredential?.userId, socket, socketId])

    // Component lifecycle logging
    useFocusEffect(() => {
        setOnPage(true);
        return () => setOnPage(false);
    });

    // Update the bank page context when the current overview changes
    useEffect(() => {
        if (currentOverview) {
            bankPageContext.setInstitution(currentOverview);
        }
    }, [currentOverview])

    // Open the unlink account dialog
    const openUnLinkAccountDialog = () => {
        try {
            if (!currentOverview) throw new InstitutionNotFoundException();

            // Set the bottom sheet content
            setBottomSheetContent(
                <BottomSheetContextLayout
                    title={`Remove accounts`}
                    description={`You are about to remove the accounts in ${currentOverview?.institution?.name} from Dopa, meaning you will lose all financial insight of this institution. Are you sure you want to continue?`}
                    primaryAction={() => unlinkAccount()}
                    primaryText={'Yes, I\'m sure'}
                    secondaryAction={() => bottomSheetRef.current?.close()}
                    secondaryText={'No, never mind'}
                />
            );            
        } 
        catch (error) 
        {
            console.error('openUnLinkAccountDialog: error', error);

            // Set the bottom sheet content
            setBottomSheetContent(
                <BottomSheetContextLayout
                    title={`Uh-oh, something went wrong`}
                    description={`We are sorry, we were unable to remove your accounts at this time. Please try again later`}
                    secondaryAction={() => bottomSheetRef.current?.close()}
                    secondaryText={'Okay, I\'ll try again later.'}
                />
            );     
        } 
        finally 
        {
            bottomSheetRef.current?.snapToIndex(0);
        }
    }

    // Unlink the account
    const unlinkAccount = async () => {
        try {
            // set the bottom sheet content to loading state
            setBottomSheetContent(
                <BottomSheetContextLayout
                    title={`Just a moment`}
                    description={`Please wait while we are processing your request, this may take a moment.`}
                />
            )

            // unlink the account using the PlaidService
            const apiResponse = await PlaidService.removePlaidItem(authContext.authCredential?.dopa.accessToken as string, currentOverview?.item_id as string );
            if (apiResponse.status === false) 
            {
                const error = new Error(apiResponse.message || 'Failed to remove accounts');
                error.name = apiResponse.exception || 'ApiError';
                throw error;
            }

            //  removed accounts successfully
            setBottomSheetContent(
                <BottomSheetContextLayout
                    title={`Accounts removed`}
                    description={`You have successfully removed your accounts from Dopa.`}
                    primaryAction={() => {
                        bottomSheetRef.current?.close();
                        setRefreshing(true);
                    }}
                    primaryText={'Got it, thanks!'}
                />
            )
        } 
        catch (error: unknown) 
        {
            console.error('InstitutionDetail: unlinkAccount: error: ', error);
            setBottomSheetContent(
                <BottomSheetContextLayout
                    title={`Uh-oh, something went wrong`}
                    description={`We are sorry, we were unable to remove your accounts at this time. Please try again later`}
                    primaryAction={() => unlinkAccount()}
                    primaryText={'Try again'}
                    secondaryAction={() => bottomSheetRef.current?.close()}
                    secondaryText={'I\'ll try again later.'}
                />
            )
        }
        finally {
            bottomSheetRef.current?.snapToIndex(0);
        }
    }

    // Refresh the account balance
    const refreshBalance = async (itemId: string) => {
        bottomSheetRef.current?.snapToIndex(0);
        try {
            // set the bottom sheet content to loading state
            setBottomSheetContent(
                <BottomSheetContextLayout
                    title={`Just a moment`}
                    description={`Please wait while we are refreshing your account balance, this may take a moment.`}
                />
            )

            // refresh the account balance using the PlaidService
            const apiResponse = await PlaidService.refreshBalance(authContext.authCredential?.dopa.accessToken as string, itemId);
            if (apiResponse.status === false) 
            {
                const error = new Error(apiResponse.message || 'Failed to refresh accounts');
                error.name = apiResponse.exception || 'ApiError';
                throw error;
            }

            //  refreshed accounts successfully
            setBottomSheetContent(
                <BottomSheetContextLayout
                    title={`Accounts refreshed`}
                    description={`You have successfully refreshed your accounts balance.`}
                    primaryAction={() => {
                        bottomSheetRef.current?.close();
                        setRefreshing(true);
                    }}
                    primaryText={'Got it, thanks!'}
                />
            )
        } 
        catch (error: unknown) 
        {
            console.error('InstitutionDetail: refreshBalance: error: ', error);
            setBottomSheetContent(
                <BottomSheetContextLayout
                    title={`Uh-oh, something went wrong`}
                    description={`We are sorry, we were unable to refresh your accounts at this time. Please try again later`}
                    primaryAction={() => refreshBalance(itemId)}
                    primaryText={'Try again'}
                    secondaryAction={() => bottomSheetRef.current?.close()}
                    secondaryText={'I\'ll try again later.'}
                />
            )
        }
    }

    return (
        <>
        <View style={{ flex: 1, backgroundColor: primaryBackground }}>
            <ScrollView
                contentContainerStyle={{flexGrow: 1}}
                bounces={true}
                fadingEdgeLength={50}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={[primaryColor]}
                        progressBackgroundColor={primaryColor}
                    />
                }
            >
                <View style={{ flex: 1, paddingTop: 80, paddingBottom: 160 }}>
                    <View style={{ flex: 1, flexDirection: 'column' }}>
                        <View style={{paddingHorizontal: 25}}>
                            <View style={{
                                width: 'auto',
                                position: 'relative',
                                paddingBottom: 30,
                            }}>
                                <LightBackButton 
                                    label={'Back'}
                                    onPressEvent={() => router.back()}
                                />
                            </View>
                            <DarkTitleAndRemark 
                                title={`Bank accounts`}
                                remark={'Manage your bank accounts and their settings.'}
                            />
                        </View>
                        <BankCardListComponent 
                            accessToken={authContext.authCredential?.dopa.accessToken || ''}
                            setRefreshing={setRefreshing}
                            setSessionFinished={setSessionFinished} 
                            onPage={onPage} 
                            refreshing={refreshing} 
                            sessionFinished={sessionFinished}
                            setCurrentOverview={setCurrentOverview}
                        />
                        {
                            currentOverview &&
                            <View style={{ 
                                paddingHorizontal: 25, 
                            }}>
                                <AccountOperationComponent
                                    currentOverview={currentOverview}
                                    unlinkAccount={openUnLinkAccountDialog}
                                    refreshBalance={refreshBalance}
                                />
                                {/* <BankAccountListSection 
                                    currentOverview={currentOverview}
                                /> */}
                            </View>
                        }
                    </View>
                </View>
            </ScrollView>
            <View
                style={{
                    position: 'absolute',
                    bottom: 60,
                    left: 0,
                    right: 0,
                    paddingHorizontal: 25,
                }}
            >
                <PlaidAuthButton shouldRefresh={onPage}/>
            </View>
        </View>
        <DialogBoxBottomSheet ref={bottomSheetRef} bottomSheetContent={bottomSheetContent}/>
        </>
    )
}


function BankAccountListSection({currentOverview}: {currentOverview: PlaidAccountOverview | null}) 
{
    return (
        <View style={{marginTop: 15}}>
            {
                (currentOverview) 
                ? <AccountsContent accounts={currentOverview.accounts}/>
                : <Text>No accounts found</Text>
            }
        </View>
    )
}

type BankCardListComponentProps = {
    onPage: boolean,
    accessToken: string,
    refreshing: boolean,
    sessionFinished: boolean|null,
    setRefreshing: (refreshing: boolean) => void,
    setSessionFinished: (sessionFinished: boolean|null) => void,
    setCurrentOverview: (overview: PlaidAccountOverview | null) => void
}

function BankCardListComponent({
    onPage,
    accessToken,
    refreshing,
    sessionFinished,
    setRefreshing,
    setSessionFinished,
    setCurrentOverview
}: BankCardListComponentProps) 
{
    // local state
    const [isLoading, setIsLoading] = React.useState<boolean>(true);
    const [error, setError] = React.useState<string | null>(null);
    const [institutions, setInstitutions] = React.useState<PlaidInstitutions[]>([]);
    const [overviews, setOverviews] = useState<PlaidAccountOverview[]>([]);

    // Reference to the FlatList
    const flatListRef = useRef<FlatList>(null);

    //  when the viewable items change, update the active index
    const onViewItemChanged = useCallback((info: {
        viewableItems: ViewToken<any>[];
        changed: ViewToken<any>[];
    }) => {
        const { viewableItems } = info;
        if (viewableItems.length > 0) {
            const itemInView = viewableItems.find(item => item.isViewable === true);
            if (
                itemInView && 
                itemInView.index !== undefined &&
                itemInView.index !== null 
            ) {
                setCurrentOverview(overviews[itemInView.index])
            }
        }
    }, [setCurrentOverview, overviews]);

    // fetch institutions when the component mounts
    const fetchInstitutions = useCallback(async (hardPull: boolean = false) => {
        try {
            // check if the user is authenticated
            if (!accessToken) throw new UnauthorizedUserError();

            // reset state
            setIsLoading(true);
            setError(null);

            // fetch accounts from Plaid
            const apiResponse = await PlaidService.getAccountOverview(accessToken, hardPull);

            //  Check if the API response is successful
            if (!apiResponse.status) 
            {
                const error = new Error(apiResponse.message || 'Failed to fetch accounts');
                error.name = apiResponse.exception || 'ApiError';
                throw error;
            }

            //  get institutions from the API response
            const overviews = apiResponse.response || [] as PlaidAccountOverview[];
            setOverviews(overviews);

            //  Check if the response contains institutions
            if (overviews.length === 0)
            {
                setInstitutions([]);
                return;
            }

            //  Map the overviews to institutions
            const institutions: PlaidInstitutions[] = overviews.map((overview) => {
                const {item_id, institution} = overview;
                return {
                    id: institution.id,
                    item_id,
                    name: institution.name,
                    primary_color: institution.primary_color,
                    logo: institution.logo
                };
            });

            // set accounts state
            setInstitutions(institutions);
        } 
        catch (error: unknown) 
        {
            console.log("fetchInstitutions:error:", error);

            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError('An unexpected error occurred while fetching institutions.');
            }
        } 
        finally
        {
            setIsLoading(false);
        }
    }, [accessToken]);

    // when on the page, fetch institutions
    useEffect(() => {
        if (onPage) fetchInstitutions();
    }, [onPage, fetchInstitutions]);

    // when session is finished, fetch institutions
    useEffect(() => {
        if (sessionFinished) fetchInstitutions(true).finally(() => setSessionFinished(null));
    }, [sessionFinished, fetchInstitutions, setSessionFinished]);

    // when refreshing, fetch institutions
    useEffect(() => {
        if (refreshing) fetchInstitutions(true).finally(() => setRefreshing(false));
    }, [refreshing, fetchInstitutions, setRefreshing]);

    // when loading, show a loading indicator
    if (isLoading) return <SkeletonLoadingComponent />;

    // when there is an error, show the error message
    if (error) return <ErrorFoundComponent error={error} />;

    // when there are no institutions, show a message
    if (institutions.length === 0) return <NoAccountFoundComponent />;

    // Render the horizontal flat list of bank cards
    return (
        <HorizontalFlatListLayout
            ref={flatListRef}
            data={institutions}
            keyExtractor={(item) => item.item_id}
            onViewableItemsChanged={onViewItemChanged}
            scrollEnabled={!(isLoading || refreshing)}
            renderItem={(item: any, index: number, scrollX: SharedValue<number>) => {
                return <BankCardSliderItem
                    key={item.item_id}
                    item={item}
                    index={index}
                    scrollX={scrollX}
                />
            }}
        />
    )
}

type BankCardSliderItemProps = {
    item: PlaidInstitutions;
    index: number;
    scrollX: SharedValue<number>;
}

function BankCardSliderItem({item, index, scrollX}: BankCardSliderItemProps)
{
    const { width } = Dimensions.get('window');
    const {id, item_id, name, primary_color, logo} = item;
    
    // Adjust the card width as needed
    const cardWidth = width;

    // Animated style for the item
    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [
                { 
                    translateX: interpolate(
                        scrollX.value,
                        [(index - 1) * cardWidth, index * cardWidth, (index + 1) * cardWidth],
                        [-cardWidth * 0.15, 0, cardWidth * 0.15],
                        Extrapolation.CLAMP
                    )
                },
                {
                    scale: interpolate(
                        scrollX.value,
                        [(index - 1) * cardWidth, index * cardWidth, (index + 1) * cardWidth],
                        [0.85, 1, 0.85],
                        Extrapolation.CLAMP
                    )
                }
            ],
        };
    });

    return (
        <Animated.View style={[{
            width: cardWidth,
            justifyContent: 'center', 
            alignItems: 'center',
        }, animatedStyle]}>
            <View style={{ 
                flex: 1, 
                width: '90%',
            }}>
                <LogoBackgroundBankCardComp
                    key={item_id}
                    item_id={item_id}
                    name={name}
                    primary_color={primary_color}
                    logo={logo}
                    lastFour={id?.slice(-4) || '0000'}
                />
            </View>
        </Animated.View>
    )
}

function AccountOperationComponent({
    currentOverview,
    unlinkAccount,
    refreshBalance
}: {
    currentOverview: PlaidAccountOverview | null
    unlinkAccount: () => void
    refreshBalance: (itemId: string) => Promise<void>
}) {

    if (!currentOverview) return <></>;

    const {
        institution: {
            name,
        },
        item_id,
        accounts,
        disposableValue
    } = currentOverview;

    return (
        <View>
            {
                name && (
                    <View style={{
                        paddingTop: 30,
                        paddingBottom: 20,
                    }}>
                        <Text style={{color: "#fff", fontSize: 12 }}>Total disposable assets</Text>
                        <Text style={{color: "#fff", fontSize: 40, marginTop: 5, fontWeight: 'bold'}}>{formatAssetsValue(disposableValue)}</Text>
                    </View>
                )
            }
            <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginVertical: 10,
            }}>
                <ActionButton
                    icon={<Feather name="refresh-cw" size={20} color="#2ee8dcff" />}
                    label="Refresh"
                    onPressEvent={() => refreshBalance(item_id)}
                    colors={{ backgroundColor: "#222222c4", borderColor: "#292929ff", textColor: '#cecece' }}
                />
                <ActionButton
                    icon={<Feather name="dollar-sign" size={20} color="#ac93f9ff" />}
                    label="Income"
                    onPressEvent={() => router.push(`/bankAccounts/incomes/${item_id}`)}
                    colors={{ backgroundColor: "#222222c4", borderColor: "#292929ff", textColor: '#cecece' }}
                />
                <ActionButton
                    icon={<MaterialCommunityIcons name="bank-outline" size={20} color="#ffbd6dff" />}
                    label="Accounts"
                    onPressEvent={() => router.push(`/bankAccounts/accounts/${item_id}`)}
                    colors={{ backgroundColor: "#222222c4", borderColor: "#292929ff", textColor: '#cecece' }}
                />
                <ActionButton
                    icon={<Feather name="minus" size={20} color="#fb8cacff" />}
                    label="Unlink"
                    onPressEvent={() => unlinkAccount()}
                    colors={{ backgroundColor: "#222222c4", borderColor: "#292929ff", textColor: '#cecece' }}
                />
            </View>
            {/* <Text style={{color: "#fff", fontSize: 14, marginTop: 30}}>
                Total {accounts.length} account{accounts.length > 1 ? 's' : ''}.
            </Text> */}
        </View>
    )
}

function ActionButton({
    icon,
    label,
    colors,
    disabled,
    isLoading,
    onPressEvent
}: {
    icon: React.ReactNode;
    label: string;
    disabled?: boolean;
    isLoading?: boolean;
    colors: { backgroundColor: string, borderColor: string, textColor: string };
    onPressEvent: () => void;
}) {
    return (
        <View style={{
            alignItems: 'center',
            justifyContent: 'center',
        }}>
            <TouchableOpacity
                disabled={disabled ? true : isLoading}
                onPress={() => onPressEvent()}
            >
                <View style={{
                    width: 60,
                    height: 60,
                    backgroundColor: colors.backgroundColor,
                    borderRadius: 100,
                    borderWidth: 1,
                    borderColor: colors.borderColor,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                    {icon}
                </View>
            </TouchableOpacity>
            <Text style={{color: colors.textColor, fontSize: 12, marginTop: 15}}>{label}</Text>
        </View>
    )
}

function formatAssetsValue(value: number): string
{
    if (!value) return 0..toLocaleString('en-US', { style: 'currency', currency: 'USD' });

    // convert to a fixed decimal format
    value = parseFloat(value.toFixed(2));

    // format to usd
    return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
}








function NoAccountFoundComponent() {
    return (
        <View style={{marginTop: 20}}>
            <Text style={{color: "#fff", textAlign: 'center'}}>
                You have not connected any bank accounts yet. Please click the button below to connect your bank account.
            </Text>
        </View>
    )
}

function ErrorFoundComponent({error}: {error: string}) {
    return (
        <View>
            <Text style={{color: "red"}}>{error}</Text>
        </View>
    )
}

function SkeletonLoadingComponent() {
    return (
        <View>
            <Text>Please wait while we fetch your bank accounts...</Text>
        </View>
    )
}