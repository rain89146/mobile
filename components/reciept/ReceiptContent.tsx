import { ReceiptData } from '@/types/ReceiptData'
import Feather from '@expo/vector-icons/Feather'
import FontAwesome6 from '@expo/vector-icons/FontAwesome6'
import { Link } from 'expo-router'
import React from 'react'
import { TouchableOpacity, View, Text } from 'react-native'
import { DotIndicator } from 'react-native-indicators'

export function ReceiptContent({
    receiptData,
    isProcessing,
    processReceipt,
    retakeReceipt
}: {
    receiptData: ReceiptData | null
    isProcessing: boolean
    processReceipt: () => void
    retakeReceipt: () => void
}) {
    if (!receiptData) return <></>;
    return (
        <View style={{paddingTop: 20}}>
            <BusinessDetails receiptData={receiptData} />
            <ItemDetailList receiptData={receiptData} />
            <AmountDetails receiptData={receiptData} />
            <PaymentDetails receiptData={receiptData} />
            <ReceiptActions 
                isProcessing={isProcessing} 
                processReceipt={processReceipt} 
                retakeReceipt={retakeReceipt} 
            />
        </View>
    )
}

function ReceiptActions({
    isProcessing,
    processReceipt,
    retakeReceipt,
}: {
    isProcessing: boolean
    processReceipt: () => void
    retakeReceipt: () => void
}) {
    return (
        <View
            style={{
                paddingTop: 30,
                paddingLeft: 30,
                paddingRight: 30,
                paddingBottom: 30,
            }}
        >
            <TouchableOpacity
                onPress={() => processReceipt()}
                style={{
                    backgroundColor: isProcessing ? "#bcbcbc" : '#000',
                    padding: 15,
                    borderRadius: 5,
                    marginTop: 20,
                }}
                disabled={isProcessing}
            >
                {
                    isProcessing 
                    ? (
                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <DotIndicator color='#fff' size={10} count={3}/>
                        </View>
                    ) 
                    : (
                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 10,
                            }}
                        >
                            <Feather name='check' size={16} color="#fff" />
                            <Text
                                style={{
                                    color: '#fff',
                                    fontSize: 16,
                                    fontWeight: 'bold',
                                    textAlign: 'center',
                                }}
                            >Looks good to me</Text>
                        </View>
                    )
                }
            </TouchableOpacity>
            <View>
                <Text
                    style={{
                        fontSize: 12,
                        color: '#484848',
                        fontWeight: 'normal',
                        paddingTop: 10,
                    }}
                >By clicking on "Looks good to me", you are confirming that the receipt is correct and ready for processing.</Text>
            </View>
            <View style={{
                paddingTop: 20,
                marginTop: 20,
                borderTopWidth: 1,
                borderTopColor: '#e0e0e0',
            }}>
                <Text
                    style={{
                        fontSize: 12,
                        color: '#484848',
                        fontWeight: 'normal',
                    }}
                >
                    Don't like this receipt? Let's take another one!
                </Text>
                <TouchableOpacity
                    onPress={() => retakeReceipt()}
                    style={{
                        padding: 15,
                        marginTop: 15,
                        borderWidth: 1,
                        borderRadius: 5,
                        borderColor: 'black',
                    }}
                >
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 10,
                        }}
                    >
                        <Feather name="refresh-cw" size={16} color="black" />
                        <Text
                            style={{
                                color: 'black',
                                fontSize: 16,
                                textAlign: 'center',
                            }}
                        >Retake</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    )
}

function ItemDetailList({
    receiptData
}: {
    receiptData: ReceiptData
}) {
    return (
        <View style={{
            padding: 30,
            paddingTop: 0,
        }}>
            <View
                style={{
                    borderTopWidth: 1,
                    borderTopColor: '#e0e0e0',
                    paddingTop: 20,
                }}
            >
                <SectionSegment title='Item Details'>
                    {
                        receiptData.items.map((item, index) => {
                            const isLastItem = index === receiptData.items.length - 1;
                            return (
                                <View key={index} style={ !isLastItem && {paddingBottom: 15, marginBottom: 15, borderBottomWidth: 1, borderBottomColor: '#f8f8f8'}}>
                                    <ReceiptRowItem
                                        label={`${item.name} (${item.quantity})`}
                                        value={`$${(item.price * item.quantity).toFixed(2)}`}
                                    />
                                </View>
                            )
                        })
                    }
                </SectionSegment>
            </View>
        </View>
    )
}

function SectionSegment({
    title,
    children
}: {
    title: string,
    children: React.ReactNode
}) {
    return (
        <View>
            <View style={{
                paddingBottom: 20,
            }}>
                <Text style={{
                    fontSize: 18,
                    color: '#000',
                    fontWeight: 'bold',
                    textTransform: 'capitalize',
                }}>{title}</Text>
            </View>
            <View>{children}</View>
        </View>
    )
}

function BusinessDetails({
    receiptData
}: {
    receiptData: ReceiptData
}) {
    return (
        <View
            style={{
                paddingLeft: 30,
                paddingRight: 30,
                paddingBottom: 30,
            }}
        >
            <Text
                style={{
                    fontSize: 12,
                    color: '#484848',
                    fontWeight: 'normal',
                    paddingBottom: 15,
                }}
            >{receiptData.date}</Text>
            <Text style={{
                fontSize: 20,
                color: '#000',
                fontWeight: 'bold',
                textTransform: 'capitalize',
            }}>{receiptData.business.name}</Text>
            <View style={{
                paddingTop: 5,
            }}>
                <Link href={`https://www.google.com/maps/search/?api=1&query=${receiptData.business.address}`}>
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            gap: 8,
                        }}
                    >
                        <FontAwesome6 name="location-pin" size={14} color="#bcbcbc" />
                        <Text
                            style={{
                                fontSize: 14,
                                color: '#484848',
                                fontWeight: 'normal',
                                textDecorationLine: 'underline',
                                textDecorationColor: '#484848',
                                textDecorationStyle: 'solid',
                            }}
                        >{receiptData.business.address}</Text>
                    </View>
                </Link>
            </View>
        </View>
    )
}

function PaymentDetails({
    receiptData
}: {
    receiptData: ReceiptData
}) {
    return (
        <View
            style={{
                paddingTop: 30,
                paddingLeft: 30,
                paddingRight: 30,
            }}
        >
            <SectionSegment title='Payment Details'>
                <View style={{paddingBottom: 10}}>
                    <ReceiptRowItem
                        label={'Payment Method'}
                        value={receiptData.payment.method}
                    />
                </View>
                <View style={{paddingBottom: 10}}>
                    <ReceiptRowItem
                        label={'Card Number'}
                        value={receiptData.payment.cardNumber}
                    />
                </View>
                <ReceiptRowItem
                    label={'Card Type'}
                    value={receiptData.payment.cardType}
                />
            </SectionSegment>
        </View>
    )
}

function AmountDetails({
    receiptData
}: {
    receiptData: ReceiptData
}) {
    return (
        <View
            style={{
                backgroundColor: '#f8f8f8',
                padding: 30,
            }}
        >
            <SectionSegment title='Amount Details'>
                {
                    receiptData.amount.map((item, index) => {
                        const isLastItem = index === receiptData.amount.length - 1;
                        return (
                            <View key={index} style={ !isLastItem && {paddingBottom: 10}}>
                                <ReceiptRowItem
                                    label={item.label}
                                    value={`$${item.value.toFixed(2)}`}
                                />
                            </View>
                        )
                    })
                }
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingTop: 16,
                    marginTop: 16,
                    borderTopWidth: 1,
                    borderTopColor: '#e0e0e0',
                }}>
                    <View>
                        <Text style={{
                            fontSize: 16,
                            color: '#000',
                            textTransform: 'capitalize',
                            fontWeight: 'bold',
                        }}>Grand Total</Text>
                    </View>
                    <View style={{
                        marginLeft: 'auto',
                    }}>
                        <Text
                            style={{
                                fontSize: 18,
                                color: '#484848',
                                fontWeight: 'bold',
                            }}
                        >${receiptData.grandTotal}</Text>
                    </View>
                </View>
            </SectionSegment>
        </View>
    )
}

function ReceiptRowItem({
    label,
    value
}: {
    label: string,
    value: string
}) {
    return (
        <View style={{
            flexDirection: 'row',
            alignItems: 'center',
        }}>
            <View>
                <Text style={{
                    fontSize: 14,
                    color: '#000',
                    textTransform: 'capitalize',
                }}>{label}</Text>
            </View>
            <View style={{
                marginLeft: 'auto',
            }}>
                <Text
                    style={{
                        fontSize: 16,
                        color: '#484848',
                        fontWeight: 'normal',
                    }}
                >{value}</Text>
            </View>
        </View>
    )
}

