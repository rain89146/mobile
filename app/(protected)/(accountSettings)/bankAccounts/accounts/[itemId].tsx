import React, { Fragment, useCallback, useEffect, useState } from 'react'
import { View, Text } from 'react-native'
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { primaryBackground, primaryCtaDisabledColor } from '@/constants/Colors';
import { ScrollViewLayout } from '@/components/layout/ScrollViewLayout';
import { LightBackButton } from '@/components/ui/ActionButtons';
import { DarkTitleAndRemark } from '@/components/ui/ContentComp';
import { PlaidService } from '@/services/PlaidService';
import { useAuthContext } from '@/contexts/AuthenticationContext';
import { PlaidBankAccount, PlaidInstitutionAndAccounts } from '@/types/PlaidObjects';
import { ListDivider } from '@/components/ui/ListDivider';
import { BankAccountItemComponent } from '@/components/bankAccounts/BankAccountItemComponent';
import { PlaidUpdateButton } from '@/components/plaid/PlaidUpdateButton';
import { SocketEvents, useSocketContext } from '@/contexts/SocketContext';
import { LinearGradient } from 'expo-linear-gradient';

class InstitutionNotFoundException extends Error {
    constructor() {
        super();
        this.name = this.constructor.name;
        this.message = 'Institution not found';
    }
}

export default function InstitutionDetail() 
{
    const {itemId} = useLocalSearchParams();

    const router = useRouter();
    const authContext = useAuthContext();
    const {socket, socketId} = useSocketContext();

    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [institutionData, setInstitutionData] = useState<PlaidInstitutionAndAccounts | null>(null);

    // track when the Plaid Link flow is completed, null means not started, true means completed, false means failed
    const [plaidLinkFlowCompleted, setPlaidLinkFlowCompleted] = useState<boolean|null>(null);

    // Fetch institution details
    const fetchInstitutionDetails = useCallback(async (hardPull: boolean = false) => {
        try {
            setLoading(true);
            setError(null);

            // Ensure access token is available
            if (!authContext.authCredential?.dopa?.accessToken) throw new Error('Access token is not available');

            //  Validate institution parameter
            if (!itemId) throw new InstitutionNotFoundException();
            
            // Fetch institution details from the API
            const access_token = authContext.authCredential?.dopa.accessToken;
            const response = await PlaidService.getInstitutionByItemId(access_token, itemId as string, hardPull);

            //
            if (!response.status)
            {
                const error = new Error(response.message || 'Failed to fetch institution details');
                error.name = response.exception || 'UnknownError';
                throw error;  
            }

            const institutionData = response.response as PlaidInstitutionAndAccounts;

            // Check if the response contains institution data
            if (!institutionData) throw new InstitutionNotFoundException();

            // Set the institution data
            setInstitutionData(institutionData);
        } 
        catch (error: unknown) 
        {
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError('An unknown error occurred');
            }
        } 
        finally 
        {
            setLoading(false);
        }
    }, [itemId, authContext.authCredential]);

    // Listen for socket events to refresh institution data
    useEffect(() => {
        if (!socket) return;

        // Listen for socket events to refresh institution data
        socket.on(SocketEvents.PLAID_NEW_ACCOUNT_AVAILABLE, async ({ userId }) => {
            if (userId === authContext.authCredential?.userId) await fetchInstitutionDetails(true);
        });

        // Cleanup the socket listener when the component unmounts
        return () => {
            socket.off(SocketEvents.PLAID_NEW_ACCOUNT_AVAILABLE);
        };
    }, [socketId, socket, authContext.authCredential?.userId, fetchInstitutionDetails]);

    // Fetch institution details when the component is focused
    useFocusEffect(
        useCallback(() => {
            fetchInstitutionDetails();
        }, [fetchInstitutionDetails])
    );

    //  When plaid link flow is completed, refetch institution details
    useEffect(() => {
        if (plaidLinkFlowCompleted === true) 
        {
            // set to true, wait for when the fetch institution details is finished
            setLoading(true);
        }
    }, [plaidLinkFlowCompleted])

    return (
        <>
            <View style={{ flex: 1, paddingHorizontal: 25, backgroundColor: primaryBackground }}>
                <ScrollViewLayout>
                    <View style={{
                        width: 'auto',
                        position: 'relative',
                        flexDirection: 'row',
                        paddingBottom: 30,
                        backgroundColor: 'transparent'
                    }}>
                        <LightBackButton label={'Back'} onPressEvent={() => router.back()} />
                    </View>
                    {
                        loading ? <LoadingContent /> :
                        error ? <ErrorContent error={error} /> :
                        institutionData ? (
                            <>
                                <DarkTitleAndRemark 
                                    title={`Accounts in ${institutionData.institution.name}`}
                                    remark={`You can view all and manage accounts linked to ${institutionData.institution.name} here.`}
                                />
                                <AccountsContent accounts={institutionData.accounts} />
                            </>
                        ) : <NoContentFound />
                    }
                </ScrollViewLayout>
                {
                    itemId && 
                    <View style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        paddingHorizontal: 25,
                        height: 100,
                        overflow: 'hidden'
                    }}>
                        <LinearGradient
                            colors={['transparent', "#170f20ff"]}
                            style={{
                                position: 'absolute',
                                left: 0,
                                right: 0,
                                height: '100%'
                            }}
                        />
                        <PlaidUpdateButton itemId={itemId as string} setPlaidLinkFlowCompleted={setPlaidLinkFlowCompleted}/>
                    </View>
                }
            </View>
        </>
    )
}

function LoadingContent() {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Loading...</Text>
        </View>
    );
}

function ErrorContent({ error }: { error: string }) {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ color: 'red' }}>{error}</Text>
        </View>
    );
}

export function AccountsContent({ accounts }: { accounts: PlaidBankAccount[] }) {
    // sort accounts by name, and handle the case where there are no accounts
    const sortedAccountDetails = accounts.sort((a, b) => a.subtype.localeCompare(b.subtype));
    const totalAccounts = sortedAccountDetails.length;
    //
    return (
        sortedAccountDetails.map((account, index) => {
            const isLastBank = index === totalAccounts - 1;
            return (
                <Fragment key={account.account_id}>
                    <BankAccountItemComponent account={account} />
                    {!isLastBank && <ListDivider />}
                </Fragment>
            )
        })
    );
}

function NoContentFound() {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>No accounts found for this institution.</Text>
        </View>
    );
}