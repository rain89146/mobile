import { appConfig } from "@/config/config";
import { ApiResponse } from "@/types/ApiResponse";
import { IncomeSourceObj, PlaidAccountOverview, PlaidInstitutionAndAccounts, PlaidInstitutions, TransactionObj } from "@/types/PlaidObjects";
import axios, { AxiosRequestConfig } from "axios";

export class PlaidService
{
    /**
     * Creates a Plaid Link token for bank income.
     * @param access_token access_token is the access token obtained after exchanging the public token.
     * @returns linkToken is a string that is used to initialize the Plaid Link flow.
     */
    static async createPlaidLinkTokenForBankIncome (access_token: string, itemId?: string|null): Promise<string>
    {
        try {
            const url = `${appConfig.backendUrlBase}/bank/createBankIncomeLinkToken`;
            const headers = PlaidRequestHelper.getAuthorizedHeaders(access_token);
            const data: any = {};
            if (itemId) data.item_id = itemId;
            const apiResponse = await axios.post(url, data, headers);

            // Check if the response status is 200 OK
            if (apiResponse.status !== 200) throw new Error(`HTTP error! status: ${apiResponse.statusText}`);

            // Extract the link token from the response
            return apiResponse.data.response;
        } 
        catch (error: unknown) 
        {
            PlaidRequestHelper.errorHandler(error, 'createPlaidLinkTokenForBankIncome');
            throw error;
        }
    }

    /**
     * Creates a Plaid Link token for payroll income.
     * @param access_token access_token is the access token obtained after exchanging the public token.
     * @returns linkToken is a string that is used to initialize the Plaid Link flow.
     */
    static async createPlaidLinkTokenForPayrollIncome (access_token: string): Promise<string>
    {
        try {
            const url = `${appConfig.backendUrlBase}/link/createPayrollIncomeLinkToken`;
            
            const headers = PlaidRequestHelper.getAuthorizedHeaders(access_token);

            const apiResponse = await axios.post<ApiResponse<string>>(url, {}, headers);

            // Check if the response status is 200 OK
            if (apiResponse.status !== 200) throw new Error(`HTTP error! status: ${apiResponse.statusText}`);

            // Extract the link token from the response
            return apiResponse.data.response;
        } 
        catch (error: unknown) 
        {
            PlaidRequestHelper.errorHandler(error, 'createPlaidLinkTokenForPayrollIncome');
            throw error;
        }
    }

    /**
     * Creates a Plaid Link token for updating an existing item.
     * @param user_id userId is the unique identifier for the user in your application.
     * @param item_id itemId is the unique identifier for the Plaid item to be updated.
     * @returns linkToken is a string that is used to initialize the Plaid Link flow.
     */
    static async createPlaidLinkTokenForUpdate (user_id: string, item_id?: string): Promise<string>
    {
        try {
            const url = `${appConfig.backendUrlBase}/auth/p/createUpdateLinkToken`;

            const headers = PlaidRequestHelper.getDefaultHeaders();

            const apiResponse = await axios.post<ApiResponse<string>>(url, { user_id, item_id }, headers);

            // Check if the response status is 200 OK
            if (apiResponse.status !== 200) throw new Error(`HTTP error! status: ${apiResponse.statusText}`);

            // Extract the link token from the response
            return apiResponse.data.response;
        } 
        catch (error: unknown) 
        {
            PlaidRequestHelper.errorHandler(error, 'createPlaidLinkTokenForUpdate');
            throw error;
        }
    }

    /**
     * Gets a Plaid Link token from the backend.
     * @param user_id userId is the unique identifier for the user in your application.
     * @returns linkToken is a string that is used to initialize the Plaid Link flow.
     */
    static async createPlaidLinkToken (user_id: string, user_token: string): Promise<string>
    {
        try {
            const headers = PlaidRequestHelper.getDefaultHeaders();

            const apiResponse = await axios.post<ApiResponse<string>>(`${appConfig.backendUrlBase}/auth/p/createLinkToken`, { user_id, user_token }, headers);

            // Check if the response status is 200 OK
            if (apiResponse.status !== 200) throw new Error(`HTTP error! status: ${apiResponse.statusText}`);

            // Extract the link token from the response
            return apiResponse.data.response;
        } 
        catch (error: unknown) 
        {
            PlaidRequestHelper.errorHandler(error, 'createPlaidLinkToken');
            throw error;
        }
    }

    /**
     * Exchanges a Plaid public token for an access token.
     * @param user_id userId is the unique identifier for the user in your application.
     * @param public_token public_token is the token returned by Plaid Link after a user successfully connects their bank account.
     * @returns 
     */
    static async exchangePlaidPublicToken (user_id: string, public_token: string): Promise<string>
    {
        try {
            const url = `${appConfig.backendUrlBase}/auth/p/exchangePublicToken`;

            const headers = PlaidRequestHelper.getDefaultHeaders();

            const apiResponse = await axios.post<ApiResponse<string>>(url, { user_id, public_token }, headers);

            // Check if the response status is 200 OK
            if (apiResponse.status !== 200) throw new Error(`HTTP error! status: ${apiResponse.statusText}`);

            // Extract the access token from the response
            return apiResponse.data.response;
        } 
        catch (error: unknown) 
        {
            PlaidRequestHelper.errorHandler(error, 'exchangePlaidPublicToken');
            throw error;
        }
    }

    /**
     * Updates a Plaid item with a new public token.
     * @param access_token The access token obtained after exchanging the public token.
     * @param item_id The ID of the Plaid item to update.
     * @param public_token The new public token to use for the update.
     * @returns A promise that resolves to a boolean indicating the success of the update.
     */
    static async updatePlaidItem (access_token: string, item_id: string, public_token: string): Promise<boolean>
    {
        try {
            const url = `${appConfig.backendUrlBase}/bank/updatePlaidItem`;

            const headers = PlaidRequestHelper.getAuthorizedHeaders(access_token);

            const apiResponse = await axios.post<ApiResponse<boolean>>(url, { item_id, public_token }, headers);

            // Check if the response status is 200 OK
            if (apiResponse.status !== 200) throw new Error(`HTTP error! status: ${apiResponse.statusText}`);

            // Extract the access token from the response
            return apiResponse.data.response;
        } 
        catch (error: unknown) 
        {
            PlaidRequestHelper.errorHandler(error, 'exchangePlaidPublicToken');
            throw error;
        }
    }

    /**
     * Fetches the user's Plaid accounts using the access token.
     * @param access_token The access token obtained after exchanging the public token.
     * @returns A promise that resolves to the user's Plaid accounts.
     */
    static async getPlaidAccounts (access_token: string): Promise<ApiResponse<PlaidInstitutionAndAccounts[]>>
    {
        try {
            const url = `${appConfig.backendUrlBase}/bank/getAccounts`;

            const headers = PlaidRequestHelper.getAuthorizedHeaders(access_token);

            const apiResponse = await axios.post(url, {}, headers);

            // Check if the response status is 200 OK
            if (apiResponse.status !== 200) throw new Error(`HTTP error! status: ${apiResponse.statusText}`);

            // Extract the accounts from the response
            return apiResponse.data;

        } 
        catch (error: unknown) 
        {
            PlaidRequestHelper.errorHandler(error, 'getPlaidAccounts');
            throw error;
        }
    }

    /**
     * Fetches the list of institutions from Plaid.
     * @param access_token The access token obtained after exchanging the public token.
     * @returns A promise that resolves to the list of institutions.
     */
    static async getInstitutions (access_token: string, hardPull: boolean = false): Promise<ApiResponse<PlaidInstitutions[]>>
    {
        try {
            const url = `${appConfig.backendUrlBase}/bank/getInstitutions`;

            const headers = PlaidRequestHelper.getAuthorizedHeaders(access_token);

            const apiResponse = await axios.post(url, { access_token, hardPull }, headers);

            // Check if the response status is 200 OK
            if (apiResponse.status !== 200) throw new Error(`HTTP error! status: ${apiResponse.statusText}`);

            // Extract the accounts from the response
            return apiResponse.data;

        } 
        catch (error: unknown) 
        {
            PlaidRequestHelper.errorHandler(error, 'getPlaidAccounts');
            throw error;
        }
    }

    /**
     * Fetches the list of institutions from Plaid.
     * @param access_token The access token obtained after exchanging the public token.
     * @returns A promise that resolves to the list of institutions.
     */
    static async getAccountOverview (access_token: string, hardPull: boolean = false): Promise<ApiResponse<PlaidAccountOverview[]>>
    {
        try {
            const url = `${appConfig.backendUrlBase}/bank/getAccountOverview`;

            const headers = PlaidRequestHelper.getAuthorizedHeaders(access_token);

            const apiResponse = await axios.post(url, { access_token, hardPull }, headers);

            // Check if the response status is 200 OK
            if (apiResponse.status !== 200) throw new Error(`HTTP error! status: ${apiResponse.statusText}`);

            // Extract the accounts from the response
            return apiResponse.data;

        } 
        catch (error: unknown) 
        {
            PlaidRequestHelper.errorHandler(error, 'getPlaidAccounts');
            throw error;
        }
    }

    /**
     * Fetches the institution details by item ID.
     * @param access_token The access token obtained after exchanging the public token.
     * @param item_id The item ID for which to fetch institution details.
     * @param hardPull Whether to perform a hard pull for the institution data.
     * @returns A promise that resolves to the institution details.
     */
    static async getInstitutionByItemId (access_token: string, item_id: string, hardPull: boolean = false): Promise<ApiResponse<PlaidInstitutionAndAccounts>>
    {
        try {
            const url = `${appConfig.backendUrlBase}/bank/getInstitutionByItemId`;

            const headers = PlaidRequestHelper.getAuthorizedHeaders(access_token);

            const apiResponse = await axios.post<ApiResponse<PlaidInstitutionAndAccounts>>(url, { item_id, hardPull }, headers);

            // Check if the response status is 200 OK
            if (apiResponse.status !== 200) throw new Error(`HTTP error! status: ${apiResponse.statusText}`);

            // Extract the institution details from the response
            return apiResponse.data;

        } 
        catch (error: unknown) 
        {
            PlaidRequestHelper.errorHandler(error, 'getInstitutionByItemId');
            throw error;
        }
    }

    /**
     * Removes a Plaid item.
     * @param access_token The access token obtained after exchanging the public token.
     * @param item_id The item ID to remove.
     * @returns A promise that resolves to the API response.
     */
    static async removePlaidItem (access_token: string, item_id: string): Promise<ApiResponse<boolean>>
    {
        try {
            const url = `${appConfig.backendUrlBase}/bank/removeItem`;

            const headers = PlaidRequestHelper.getAuthorizedHeaders(access_token);

            const apiResponse = await axios.post<ApiResponse<boolean>>(url, { item_id }, headers);

            // Check if the response status is 200 OK
            if (apiResponse.status !== 200) throw new Error(`HTTP error! status: ${apiResponse.statusText}`);

            // Extract the response data
            return apiResponse.data;

        } 
        catch (error: unknown) 
        {
            PlaidRequestHelper.errorHandler(error, 'removePlaidItem');
            throw error;
        }
    }

    /**
     * Sends a request to the backend to process income data.
     * @param access_token access_token is the access token obtained after exchanging the public token.
     * @returns 
     */
    static async processIncomeData (access_token: string, public_token: string, item_id?: string|null): Promise<ApiResponse<any>>
    {
        try {
            const url = `${appConfig.backendUrlBase}/bank/processBankIncome`;

            const headers = PlaidRequestHelper.getAuthorizedHeaders(access_token);

            const data: any = {public_token}

            if (item_id) data.item_id = item_id;

            const apiResponse = await axios.post<ApiResponse<any>>(url, data, headers);

            // Check if the response status is 200 OK
            if (apiResponse.status !== 200) throw new Error(`HTTP error! status: ${apiResponse.statusText}`);

            // Extract the income data from the response
            return apiResponse.data;
        } 
        catch (error: unknown) 
        {
            PlaidRequestHelper.errorHandler(error, 'getIncome');
            throw error;
        }
    }

    /**
     * Fetches the bank income sources for the user.
     * @param access_token The access token obtained after exchanging the public token.
     * @returns A promise that resolves to the bank income sources.
     */
    static async getBankIncomeSources (access_token: string, item_id: string, hardPull: boolean): Promise<ApiResponse<IncomeSourceObj[]>>
    {
        try {
            const url = `${appConfig.backendUrlBase}/bank/getBankIncomeSources`;

            const headers = PlaidRequestHelper.getAuthorizedHeaders(access_token);

            const apiResponse = await axios.post<ApiResponse<IncomeSourceObj[]>>(url, { item_id, hardPull }, headers);

            // Check if the response status is 200 OK
            if (apiResponse.status !== 200) throw new Error(`HTTP error! status: ${apiResponse.statusText}`);

            // Extract the income data from the response
            return apiResponse.data;
        } 
        catch (error: unknown) 
        {
            PlaidRequestHelper.errorHandler(error, 'getBankIncomeSources');
            throw error;
        }
    }

    static async refreshBalance(access_token: string, item_id: string): Promise<ApiResponse<boolean>>
    {
        try {
            const url = `${appConfig.backendUrlBase}/bank/refreshBalance`;

            const headers = PlaidRequestHelper.getAuthorizedHeaders(access_token);

            const apiResponse = await axios.post<ApiResponse<boolean>>(url, { item_id }, headers);

            // Check if the response status is 200 OK
            if (apiResponse.status !== 200) throw new Error(`HTTP error! status: ${apiResponse.statusText}`);

            // Extract the response data
            return apiResponse.data;
        } 
        catch (error: unknown) 
        {
            PlaidRequestHelper.errorHandler(error, 'refreshBalance');
            throw error;
        }
    }

    static async getIncomeLastMonthTransactions (access_token: string, item_id: string, month: number): Promise<ApiResponse<{ growth: number, lastMonthIncome: number, monthBeforeLastMonthIncome: number, incomes: TransactionObj[] }>>
    {
        try {
            const url = `${appConfig.backendUrlBase}/bank/getLastMonthTransactions`;

            const headers = PlaidRequestHelper.getAuthorizedHeaders(access_token);

            const apiResponse = await axios.post<ApiResponse<{ growth: number, lastMonthIncome: number, monthBeforeLastMonthIncome: number, incomes: TransactionObj[] }>>(url, { item_id, month }, headers);

            // Check if the response status is 200 OK
            if (apiResponse.status !== 200) throw new Error(`HTTP error! status: ${apiResponse.statusText}`);

            // Extract the income data from the response
            return apiResponse.data;
        } 
        catch (error: unknown) 
        {
            PlaidRequestHelper.errorHandler(error, 'getIncomeLastMonthTransactions');
            throw error;
        }
    }

    static async getAnnualIncomeOverview(access_token: string, hardPull: boolean, item_id?: string|null): Promise<ApiResponse<{ year: number, month: number, amount: number }[]>>
    {
        try {
            const url = `${appConfig.backendUrlBase}/bank/getAnnualIncomeOverview`;

            const headers = PlaidRequestHelper.getAuthorizedHeaders(access_token);

            const data: any = {hardPull};
            if (item_id) data.item_id = item_id;

            const apiResponse = await axios.post<ApiResponse<{ year: number, month: number, amount: number }[]>>(url, data, headers);

            // Check if the response status is 200 OK
            if (apiResponse.status !== 200) throw new Error(`HTTP error! status: ${apiResponse.statusText}`);

            // Extract the income data from the response
            return apiResponse.data;
        } 
        catch (error: unknown) 
        {
            PlaidRequestHelper.errorHandler(error, 'getAllMonthIncomeOverview');
            throw error;
        }
    }
}


class PlaidRequestHelper
{
    static getAuthorizedHeaders (access_token: string): AxiosRequestConfig<any>
    {
        return {
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': `Basic ${appConfig.DOPA_API_AUTH}`,
                'Authorization': `Bearer ${access_token}`,
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0'
            }
        };
    }

    static getDefaultHeaders (): AxiosRequestConfig<any>
    {
        return {
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': `Basic ${appConfig.DOPA_API_AUTH}`,
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0'
            }
        }
    }

    static errorHandler (error: unknown, methodName: string): void
    {
        console.warn(error);
        if (error instanceof Error) {
            console.error(`PlaidRequestHelper: ${methodName}: error:`, error.message);
        } else {
            console.error(`PlaidRequestHelper: ${methodName}: error:`, error);
        }
    }
}