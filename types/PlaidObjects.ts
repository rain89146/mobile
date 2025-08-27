export interface PlaidInstitutions{
    name: string | null;
    logo?: string | null | undefined;
    primary_color?: string | null | undefined;
    id: string;
    item_id: string;
}

export interface PlaidAccountOverview {
    item_id: string, 
    institution: {
        id: string, 
        name: string, 
        logo: string, 
        primary_color: string
    }, 
    accounts: PlaidBankAccount[], 
    disposableValue: number
}

export interface PlaidInstitutionAndAccounts {
    item_id: string;
    institution: {
        name: string;
        logo: string;
        primary_color: string;
    };
    accounts: PlaidBankAccount[];
}

export interface PlaidBankAccount {
    account_id: string;
    balances: PlaidBankAccountBalanceObject;
    mask: string;
    name: string;
    official_name: string | null;
    subtype: string;
    type: string;
}

export interface PlaidBankAccountBalanceObject {
    available: number | null;
    current: number;
    iso_currency_code: string;
    limit: number | null;
    unofficial_currency_code: string | null;
}

export interface PlaidLinkSessionObject {
    created_at: string;
    expiration: string;
    link_sessions: {
        finished_at: string;
        link_session_id: string;
        results: {
            bank_income_results: never[];
            cra_item_add_results: never[];
            document_income_results: null;
            item_add_results: {
                accounts: {
                    class_type: null;
                    id: string;
                    mask: string;
                    name: string;
                    subtype: string;
                    type: string;
                    verification_status: null;
                }[];
                institution: {
                    institution_id: string;
                    name: string;
                };
                public_token: string;
            }[];
            payroll_income_results: never[];
        };
        started_at: string;
    }[];
    link_token: string;
    metadata: {
        client_name: string;
        country_codes: string[];
        initial_products: string[];
        language: string;
        redirect_uri: null;
        webhook: null;
    };
    request_id: string;
}

export interface IncomeSourceObj {
    id: string;
    user_id: string;
    item_id: string;
    source_type: string;
    created_at: Date;
    updated_at: Date;
    last_fetched_at: Date;
    source_id: string;
    source_name: string;
    institution_id: string;
    institution_name: string;
    frequency: string;
    income_type: string;
}

export interface TransactionObj {
    id?: string;
    account_id: string,
    account_owner?: string|null,
    item_id: string,
    user_id: string,
    name: string|null,
    transaction_id: string|null,
    transaction_code: string|null,
    transaction_took_place: object|null,
    payment_channel: string|null,
    payment_meta: object|null,
    amount: number|null,
    iso_currency_code: string|null,
    authorized_date: string|null,
    authorized_datetime: string|null,
    date: string|null,
    datetime?: string|null,
    pending: boolean|null,
    pending_transaction_id: string|null,
    merchant_entity_id?: string|null,
    merchant_website?: string|null,
    merchant_logo_url?: string|null,
    merchant_name?: string|null,
    original_description?: string|null,
    transaction_type?: string|null,
    parties_involved?: object|null,
    personal_finance_category?: object|null,
    personal_finance_category_icon_url?: string|null,
    category?: string|null,
    subCategory?: string|null
    created_at: string;
    updated_at: string;
}

export interface IncomeOverviewObj {
    year: number;
    month: number;
    amount: number;
}