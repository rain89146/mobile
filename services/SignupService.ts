import { appConfig } from "@/config/config";
import { DopaAuthResponse } from "@/contexts/AuthenticationContext";
import { ApiResponse } from "@/types/ApiResponse";
import axios from "axios";

export class SignupService
{
    /**
     * Generate a signup record with the given email address.
     * @param email 
     */
    static async generateSignUpRecord(email: string): Promise<ApiResponse<string>>
    {
        try {
            const apiResponse = await axios.post(
                `${appConfig.backendUrlBase}/signup/createSignUpRecord`,
                {
                    email,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'x-api-key': `Basic ${appConfig.DOPA_API_AUTH}`,
                    }
                }
            );

            //  check if the response is successful
            if (apiResponse.status !== 200) throw new Error(`Unknown server error. error: ${apiResponse.statusText}`);

            //  return the response
            return apiResponse.data as ApiResponse<string>;

        } 
        catch (error)
        {
            console.log("SignupService: generateSignUpRecord: error:", error);
            throw error;
        }
    }

    /**
     * Send a verification code to the given email address.
     * @param email 
     */
    static async sendVerificationCode(email: string): Promise<ApiResponse<boolean>>
    {
        try {
            const apiResponse = await axios.post(
                `${appConfig.backendUrlBase}/signup/sendVerificationEmail`,
                {
                    email,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'x-api-key': `Basic ${appConfig.DOPA_API_AUTH}`,
                    }
                }
            );

            //  check if the response is successful
            if (apiResponse.status !== 200) throw new Error(`Unknown server error. error: ${apiResponse.statusText}`);

            //  return the response
            return apiResponse.data as ApiResponse<boolean>;

        }
        catch (error)
        {
            console.log("SignupService: sendVerificationCode: error:", error);
            throw error;
        }
    }

    /**
     * Verify the email address with the given code.
     * @param email 
     * @param code 
     */
    static async verifyEmailAddress(email: string, code: string): Promise<ApiResponse<boolean>>
    {
        try {
            const apiResponse = await axios.post(
                `${appConfig.backendUrlBase}/signup/verifyEmailAddress`,
                {
                    email,
                    code,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'x-api-key': `Basic ${appConfig.DOPA_API_AUTH}`,
                    }
                }
            );

            //  check if the response is successful
            if (apiResponse.status !== 200) throw new Error(`Unknown server error. error: ${apiResponse.statusText}`);

            //  return the response
            return apiResponse.data as ApiResponse<boolean>;

        }
        catch (error)
        {
            console.log("SignupService: verifyConfirmationCode: error:", error);
            throw error;
        }
    }

    /**
     * Add personal details to the signup record.
     * @param recordId The ID of the signup record.
     * @param firstName The first name of the user.
     * @param lastName The last name of the user.
     * @returns A promise that resolves to the API response.
     */
    static async addPersonalDetails(recordId: string, firstName: string, lastName: string): Promise<ApiResponse<boolean>>
    {
        try {
            const apiResponse = await axios.post(
                `${appConfig.backendUrlBase}/signup/addPersonalDetails`,
                {
                    recordId,
                    firstName,
                    lastName,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'x-api-key': `Basic ${appConfig.DOPA_API_AUTH}`,
                    }
                }
            );

            //  check if the response is successful
            if (apiResponse.status !== 200) throw new Error(`Unknown server error. error: ${apiResponse.statusText}`);

            //  return the response
            return apiResponse.data as ApiResponse<boolean>;

        } 
        catch (error)
        {
            console.log("SignupService: addPersonalDetails: error:", error);
            throw error;
        }
    }

    /**
     * Add a password to the signup record.
     * @description This function is used to add a password to the signup record.
     * @param recordId The ID of the signup record.
     * @param password Password to be added to the signup record.
     * @returns A promise that resolves to the API response.
     */
    static async addPassword(recordId: string, password: string): Promise<ApiResponse<boolean>>
    {
        try {
            const apiResponse = await axios.post(
                `${appConfig.backendUrlBase}/signup/addPassword`,
                {
                    recordId,
                    password,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'x-api-key': `Basic ${appConfig.DOPA_API_AUTH}`,
                    }
                }
            );

            //  check if the response is successful
            if (apiResponse.status !== 200) throw new Error(`Unknown server error. error: ${apiResponse.statusText}`);

            //  return the response
            return apiResponse.data as ApiResponse<boolean>;

        } 
        catch (error)
        {
            console.log("SignupService: addPassword: error:", error);
            throw error;
        }
    }

    /**
     * Complete the signup process.
     * @param recordId The ID of the signup record to complete.
     * @description This function is used to complete the signup process by marking the record as completed.
     * It is typically called after the user has provided all necessary information and verified their email.
     * @returns A promise that resolves to the API response.
     */
    static async completeSignUp(recordId: string): Promise<ApiResponse<string>>
    {
        try {
            const apiResponse = await axios.post(
                `${appConfig.backendUrlBase}/signup/completeSignUp`,
                {
                    recordId,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'x-api-key': `Basic ${appConfig.DOPA_API_AUTH}`,
                    }
                }
            );

            //  check if the response is successful
            if (apiResponse.status !== 200) throw new Error(`Unknown server error. error: ${apiResponse.statusText}`);

            //  return the response
            return apiResponse.data as ApiResponse<string>;

        } 
        catch (error) 
        {
            console.log("SignupService: completeSignUp: error:", error);
            throw error;
        }
    }
    
    /**
     * Login with user id
     * @param userId - user id
     * @description this function is used to login the user with the user id. This is typically used for systematic login after the user has completed the sign up process.
     * @returns ApiResponse<DopaAuthResponse>
     */
    static async systematicLogin(userId: string): Promise<ApiResponse<DopaAuthResponse>>
    {
        try {
            const apiResponse = await axios.post(
                `${appConfig.backendUrlBase}/auth/d/systematicLogin`,
                {
                    userId,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'x-api-key': `Basic ${appConfig.DOPA_API_AUTH}`,
                    }
                }
            );

            //  check if the response is successful
            if (apiResponse.status !== 200) throw new Error(`Unknown server error. error: ${apiResponse.statusText}`);

            //  return the response
            return apiResponse.data as ApiResponse<DopaAuthResponse>;

        } catch (error) 
        {
            console.log("SignupService: systematicLogin: error:", error);
            throw error;
        }
    }
}