import { LightBackButton } from '@/components/ui/ActionButtons'
import { DarkTitleAndRemark } from '@/components/ui/ContentComp'
import { ListDivider } from '@/components/ui/ListDivider'
import { dopaPrefixColor } from '@/constants/Colors'
import { useAuthContext } from '@/contexts/AuthenticationContext'
import { SocketEvents, useSocketContext } from '@/contexts/SocketContext'
import { PlaidService } from '@/services/PlaidService'
import { IncomeOverviewObj, TransactionObj } from '@/types/PlaidObjects'
import { useLocalSearchParams, useRouter } from 'expo-router'
import React, {useEffect, useCallback, useState, useMemo} from 'react'
import { View, Text } from 'react-native'
import { useFocusEffect } from '@react-navigation/native';
import { stackDataItem } from "react-native-gifted-charts";
import { StackBarChart } from '@/components/charts/StackBarChart'
import ParallaxScrollViewLayout from '@/components/layout/ParallaxScrollViewLayout'
import { useBankPageContext } from '@/contexts/account/bank/BankPageContext'
import { BarChartSkeleton, ParagraphSkeleton, TitleSkeleton } from '@/components/skeletons/skeletons';
import { GrowBadge } from '@/components/Badges'
import { BreakDownItem, TransactionRecordItem } from '@/components/ListItems'
import { LargeMoneyComponent } from '@/components/NumberComps'
import { MeterBar } from '@/components/MeterBars'

class UnauthorizedUserError extends Error {
    constructor() {
        super();
        this.name = this.constructor.name;
        this.message = 'User is not authenticated. Please log in first.';
    }
}

export default function Index()
{
    const router = useRouter();
    const authContext = useAuthContext();
    const {socket, socketId} = useSocketContext();
    const {itemId} = useLocalSearchParams();
    const bankPageContext = useBankPageContext();

    // local state
    const [incomeSources, setIncomeSources] = React.useState<TransactionObj[]>([]);
    const [growth, setGrowth] = React.useState<number | null>(null);
    const [lastMonthIncome, setLastMonthIncome] = React.useState<number | null>(null);
    const [isLoading, setIsLoading] = React.useState<boolean>(true);
    const [error, setError] = React.useState<string | null>(null);
    const [refreshing, setRefreshing] = React.useState<boolean>(false);
    const [onPage, setOnPage] = React.useState<boolean>(true);
    const [newIncomeSourceAdded, setNewIncomeSourceAdded] = React.useState<boolean | null>(null);

    const [chartFocusedIndex, setChartFocusedIndex] = useState<number>(new Date().getMonth() - 1);

    const [incomeOverview, setIncomeOverview] = React.useState<IncomeOverviewObj[]>([]);
    const [overviewLoading, setOverviewLoading] = React.useState<boolean>(true);

    // Page title
    const [pageTitle, setPageTitle] = useState<string>('Income Overview');
    const [pageRemark, setPageRemark] = useState<string>('Manage your income accounts and their settings.');

    // fetch income overview
    const fetchIncomeOverview = useCallback(async (hardPull: boolean = false) => {
        // set loading state
        setOverviewLoading(true);
        setIncomeOverview([]);
        setError(null);
        
        try {
            // check if the user is authenticated
            if (!authContext.authCredential?.dopa.accessToken) throw new UnauthorizedUserError();

            // Get the access token
            const access_token = authContext.authCredential?.dopa.accessToken;
            const response = await PlaidService.getAnnualIncomeOverview(access_token, hardPull, itemId as string);

            // Check if the API response is successful
            if (!response.status) {
                const error = new Error(response.message || 'Failed to fetch income overview');
                error.name = response.exception || 'ApiError';
                throw error;
            }

            // Process the income overview data
            const incomeOverview = response.response || [];
            setIncomeOverview(incomeOverview);

            // Update state with the income overview data
        } 
        catch (error: unknown) 
        {
            console.log("fetchIncomeOverview:error:", error);
            if (error instanceof Error) {
                setError(`Unable to fetch income overview, reason:${error.message}`);
            } else {
                setError('An unexpected error occurred while fetching income overview.');
            }
        } 
        finally 
        {
            setOverviewLoading(false);
        }
    }, [authContext.authCredential?.dopa.accessToken, itemId]);

    // fetch income sources
    const fetchIncomeSources = useCallback(async (hardPull: boolean = false) => {
        // check if the user is authenticated
        if (!authContext.authCredential?.dopa.accessToken) throw new UnauthorizedUserError();
        
        // reset state
        setIncomeSources([]);
        setIsLoading(true);
        setError(null);

        try {
            // fetch income sources from dopa
            const access_token = authContext.authCredential?.dopa.accessToken;
            const response = await PlaidService.getIncomeLastMonthTransactions(access_token, itemId as string, chartFocusedIndex + 1);

            // Check if the API response is successful
            if (!response.status)
            {
                const error = new Error(response.message || 'Failed to fetch income sources');
                error.name = response.exception || 'ApiError';
                throw error;
            }

            //  set income sources state
            const incomeSources = response.response || [];
            setIncomeSources(incomeSources.incomes);
            
            // set growth, lastMonthIncome, monthBeforeLastMonthIncome state
            setGrowth(incomeSources.growth);
            setLastMonthIncome(incomeSources.lastMonthIncome);
        } 
        catch (error: unknown) 
        {
            if (error instanceof Error) 
            {
                setError(`Unable to fetch income sources, reason:${error.message}`);
            } 
            else 
            {
                setError('An unexpected error occurred while fetching income sources.');
            }
        } 
        finally 
        {
            setIsLoading(false);
        }
    }, [authContext.authCredential?.dopa.accessToken, itemId, chartFocusedIndex]);

    // whenever on the page, initial load, fetch income sources
    useEffect(() => {
        if (onPage)
        {
            fetchIncomeSources();
            fetchIncomeOverview();
        }
    }, [onPage, fetchIncomeSources, fetchIncomeOverview]);

    // Component lifecycle logging
    useFocusEffect(
        useCallback(() => {
            setOnPage(true);
            return () => {
                setOnPage(false);
            };
        }, [])
    );

    // whenever new income source is added, refresh the income sources
    useEffect(() => {
        if (newIncomeSourceAdded) 
        {
            fetchIncomeSources(true);
            fetchIncomeOverview(true);
            setNewIncomeSourceAdded(null);
        }
    }, [fetchIncomeOverview, fetchIncomeSources, newIncomeSourceAdded]);

    // listen to socket events
    useEffect(() => {
        if (!socket || !socketId) return;

        // Listen for income data process completed event
        socket.on(SocketEvents.INCOME_DATA_PROCESS_COMPLETED, ({user_id}) => {
            console.log('Income data process completed for user:', user_id);
            setNewIncomeSourceAdded(true)
        });

        return () => {
            socket.off(SocketEvents.INCOME_DATA_PROCESS_COMPLETED);
        };
    }, [socket, socketId]);

    // Update the bank page context when the income overview changes
    useEffect(() => {
        if (bankPageContext.institution)
        {
            const {institution} = bankPageContext.institution;

            if (institution)
            {
                const {name} = institution;
                setPageTitle(`${name} Income Overview`);
                setPageRemark(`Below is your annual income overview of ${name}, tap on any bar to see the income details.`);
            }
        }
    }, [bankPageContext]);

    // render the income sources
    return (
        <ParallaxScrollViewLayout
            height={600}
            headerContent={
                <>
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
                    {
                        overviewLoading 
                        ? <TopPortionLoadingSkeleton />
                        : (
                            <>
                                <DarkTitleAndRemark 
                                    title={pageTitle}
                                    remark={pageRemark}
                                />
                                { incomeSources.length !== 0 && <IncomeBarChart incomeOverviews={incomeOverview} setChartFocusedIndex={setChartFocusedIndex} /> }
                            </>   
                        )
                    }
                </>
            }
        >
            <View style={{ flexDirection: 'column' }}>
                {
                    isLoading 
                    ? <BottomPortionLoadingSkeleton />
                    : (
                        <>
                            <View style={{ paddingBottom: 30}}>
                                <TotalIncomeAndBadge
                                    currentIndex={chartFocusedIndex}
                                    growth={growth} 
                                    lastMonthIncome={lastMonthIncome} 
                                />
                            </View>
                            <View style={{ paddingBottom: 30 }}>
                                <IncomeDistributionMeter 
                                    transactions={incomeSources} 
                                    lastMonthIncome={lastMonthIncome} 
                                />
                            </View>
                            <TransactionList transactions={incomeSources} />
                        </>
                    )
                }
            </View>
        </ParallaxScrollViewLayout>
    )
}

/**
 * Income bar chart component
 * @param {Object} param - Component props
 * @param {IncomeOverviewObj[]} param.incomeOverviews - Array of income overview objects
 * @param {function} param.setChartFocusedIndex - Function to set the focused index
 * @returns {JSX.Element} The rendered component
 */
function IncomeBarChart({incomeOverviews, setChartFocusedIndex}: {incomeOverviews: IncomeOverviewObj[], setChartFocusedIndex: (index: number) => void}): React.JSX.Element
{
    // Generate stack data for the bar chart
    const generateStackData = useCallback((): stackDataItem[] => {
        // Check if incomeOverviews exists and has items
        if (!incomeOverviews || incomeOverviews.length === 0) {
            return [];
        }
        
        // Prepare data for the bar chart
        const stackData: stackDataItem[] = [];

        // Create stack data for each date
        incomeOverviews.forEach((overview, dataIndex) => {
            const date = new Date();
            date.setMonth(overview.month - 1);
            const shortMonthName = date.toLocaleString('default', { month: 'short' });

            const totalAmount = overview.amount || 0; // Ensure we have a number, not undefined
            const stackObj: stackDataItem = {
                value: Number(totalAmount), // Add this line - required by the chart library
                label: shortMonthName,
                stacks: [
                    {
                        value: Number(totalAmount),
                        color: dopaPrefixColor[dataIndex % dopaPrefixColor.length],
                        marginBottom: 0
                    }
                ]
            };
            stackData.push(stackObj);
        });

        return stackData;

    }, [incomeOverviews]);

    // Memoized stack data
    const stackData = useMemo(() => generateStackData(), [generateStackData]);

    // Don't render if no data or loading
    if (!incomeOverviews || incomeOverviews.length === 0) return <></>

    //
    return (
        <View style={{ marginLeft: -10 }}>
            <StackBarChart data={stackData} setFocusedIndex={setChartFocusedIndex} />
        </View>
    );
}

/**
 * Total income and badge component
 * @param param
 * @param {number} param.currentIndex - Current month index (0-11)
 * @param {number | null} param.growth - Growth percentage
 * @param {number | null} param.lastMonthIncome - Last month's income
 * @returns 
 */
function TotalIncomeAndBadge({currentIndex, growth, lastMonthIncome}: {currentIndex: number, growth: number | null, lastMonthIncome: number | null}): React.JSX.Element {
    // Initialize growth and last month income
    growth = growth ?? 0;
    lastMonthIncome = lastMonthIncome ?? 0;

    //
    const date = new Date();
    date.setMonth(currentIndex);
    const monthName = date.toLocaleString('default', { month: 'long' });

    return (
        <View>
            <DarkTitleAndRemark 
                remark={`You are viewing the income report of ${monthName}. Here you can see the breakdown of your income.`}
            />
            <Text style={{ color: "#fff", fontSize: 14, fontWeight: 'bold', marginBottom: 5 }}>{`${monthName} Total income`}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                <LargeMoneyComponent amount={lastMonthIncome} />
                <GrowBadge growth={growth} />
            </View>
        </View>
    )
}

/**
 * Income distribution meter component
 * @param param
 * @param {TransactionObj[]} param.transactions - List of income transactions
 * @param {number | null} param.lastMonthIncome - Last month's income
 * @returns 
 */
function IncomeDistributionMeter({transactions, lastMonthIncome}: {transactions: TransactionObj[], lastMonthIncome: number | null,}) 
{
    // Calculate income distribution
    const distribution = useMemo(() => {

        // Define color palette for income sources
        const colors = dopaPrefixColor;
    
        // Group transactions by merchant name
        const grouped = transactions.reduce<{ [key: string]: { amount: number, color: string, name: string } }>((acc, t, idx) => {
            const key = t.merchant_name || t.name || `Other${idx}`;
            if (!acc[key]) {
                acc[key] = {
                    amount: 0,
                    color: colors[Object.keys(acc).length % colors.length],
                    name: key,
                };
            }
            acc[key].amount += typeof t.amount === 'number' ? t.amount : parseFloat(t.amount ?? '0');
            return acc;
        }, {});

        return Object.values(grouped);

    }, [transactions])

    // Initialize growth and last month income
    lastMonthIncome = lastMonthIncome ?? 0;

    // Check if there are any transactions
    if (!transactions || transactions.length === 0) return <></>;

    // Sort distribution by amount in descending order
    const sortedDistribution = [...distribution].sort((a, b) => b.amount - a.amount);

    return (
        <View style={{padding: 25, borderWidth: 1, borderColor: '#262048ba', borderRadius: 8, backgroundColor: "#1b1726ff"}}>
            <Text style={{ color: "#fff", fontWeight: 'bold', marginBottom: 15 }}>Income breakdown</Text>
            <MeterBar distribution={sortedDistribution} total={lastMonthIncome} />
            {
                sortedDistribution.map((item, idx) => {
                    const isLastItem = idx === sortedDistribution.length - 1;
                    const percentage = ((item.amount / (lastMonthIncome ?? 0)) * 100).toFixed(2);
                    return <BreakDownItem key={item.name + '_legend'} item={item} isLastItem={isLastItem} percentage={percentage} />;
                })
            }
        </View>
    );
}

/**
 * Transaction list component
 * @param {transactions: TransactionObj[]} 
 * @returns 
 */
function TransactionList({transactions}: {transactions: TransactionObj[]}) {
    return (
        <View style={{ flex: 1 }}>
            <Text style={{ color: "#fff", fontWeight: 'bold', marginBottom: 20 }}>Income transactions</Text>
            {
                transactions.map((transaction: TransactionObj, index) => {
                    return(
                        <View key={index}>
                            <TransactionRecordItem
                                logo={transaction.merchant_logo_url}
                                remark={transaction.merchant_name ? transaction.merchant_name : transaction.name}
                                title={transaction.name}
                                date={transaction.date ? transaction.date : transaction.authorized_date}
                                amount={transaction.amount}
                            />
                            {index < transactions.length - 1 && <ListDivider />}
                        </View>
                    )
                })
            }
        </View>
    );
}

/**
 * Skeleton loader for the top portion of the income details
 * @returns 
 */
function TopPortionLoadingSkeleton() {
    return (
        <>
            <View style={{marginBottom: 10}}>
                <TitleSkeleton />
            </View>
            <View style={{marginBottom: 20}}>
                <ParagraphSkeleton numberOfLines={2} />
            </View>
            <BarChartSkeleton height={300} />
        </>
    )
}

/**
 * Skeleton loader for the bottom portion of the income details
 * @returns 
 */
function BottomPortionLoadingSkeleton() {
    return (
        <View style={{ paddingBottom: 30}}>
            <View style={{marginBottom: 20}}>
                <ParagraphSkeleton numberOfLines={3} />
            </View>
            <TitleSkeleton />
            <View style={{marginTop: 20}}>
                <ParagraphSkeleton numberOfLines={3} />
            </View>
        </View>
    )
}