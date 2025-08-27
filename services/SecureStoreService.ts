import * as expoStore from 'expo-secure-store';

class KeyNotFoundError extends Error {
    constructor() {
        super();
        this.name = this.constructor.name;
        this.message = 'Key not found in secure storage.';
    }
}
class ValueEmptyError extends Error {
    constructor() {
        super();
        this.name = this.constructor.name;
        this.message = 'Value is empty. Please provide a valid value.';
    }
}
class ValueTooLargeError extends Error {
    constructor() {
        super();
        this.name = this.constructor.name;
        this.message = 'Value exceeds maximum size of 2048 bytes.';
    }
}

/**
 * SecureStorageService class for managing secure storage operations.
 * This class provides methods to store, retrieve, and remove data securely.
 */
export class SecureStorageService 
{
    /**
     * Store data securely in the secure storage.
     * @param key - The key to store the data.
     * @param value - The value to store.
     * @returns void
     * @throws Error if the key or value is empty or if the size exceeds 2048 bytes.
     */
    static async storeData(key: string, value: string): Promise<void> {

        // check if the key is not empty
        if (!key) throw new KeyNotFoundError();

        // check if the value is not empty
        if (!value) throw new ValueEmptyError();

        // calculate the size of the value
        const size = new TextEncoder().encode(value).length;

        // check if the size exceeds the maximum limit
        if (size > 2048) throw new ValueTooLargeError();

        // store the data securely
        await expoStore.setItemAsync(key, value);
    }

    /**
     * Retrieve data from secure storage.
     * @param key - The key to retrieve the data.
     * @returns The value associated with the key or null if not found.
     */
    static async getData(key: string): Promise<string | null> {
        // check if the key is not empty
        if (!key) return null;

        // retrieve the data securely
        return await expoStore.getItemAsync(key);
    }

    /**
     * Remove data from secure storage.
     * @param key - The key to remove the data.
     * @returns void
     */
    static async removeData(key: string): Promise<void> {
        // check if the key is not empty
        if (!key) throw new Error('Key is empty');

        // remove the data securely
        await expoStore.deleteItemAsync(key);
    }
}