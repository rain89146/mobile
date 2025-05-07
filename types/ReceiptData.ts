export interface ReceiptData {
    items: {
        name: string
        price: number
        quantity: number
    }[]
    business: {
        name: string
        address: string
        phone: string
    }
    payment: {
        method: string
        cardNumber: string
        cardType: string
    }
    amount: {
        label: string
        value: number
    }[],
    grandTotal: number
    date: string
}
