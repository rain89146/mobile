import AsyncStorage from '@react-native-async-storage/async-storage';

export default function useAsyncStorageHook() : {
    storeDataIntoStorage: <T>(key: string, value: T) => Promise<void>;
    getDataFromStorage: <T>(key: string) => Promise<T|null>;
    removeDataFromStorage: (key: string) => Promise<void>;
    clearStorage: () => Promise<void>;
}
{
    /**
     * Store the data into the storage
     * @description Store the data into the storage
     * @param key - The key to store the data
     * @param value - The value to store
     * @returns void
     */
    async function storeDataIntoStorage<T>(key: string, value: T): Promise<void>
    { 
        try {
            //  check if the key is not empty
            if (!key) throw new Error('Key is empty');

            //  check if the value is not empty
            if (!value) throw new Error('Value is empty');

            //  store the data into the storage
            await AsyncStorage.setItem(key, JSON.stringify(value));

        } catch (error) {
            console.log("useAsyncStorageHook: storeDataIntoStorage", error);
            throw error;
        }
    }

    /**
     * Get the data from the storage
     * @param key - The key to get
     * @returns T - The value
     * @description Get the data from the storage
     */
    async function getDataFromStorage<T>(key: string): Promise<T|null>
    {
        try {
            //  check if the key is not empty
            if (!key) throw new Error('Key is empty');

            //  get the data from the storage
            const value = await AsyncStorage.getItem(key);

            //  check if the value is not empty
            if (!value) throw new Error('Value is empty');

            //  return the value
            return JSON.parse(value) as T;

        } catch (error) {
            console.log("useAsyncStorageHook: getDataFromStorage", error);
            return null;
        }
    }

    /**
     * Remove the data from the storage
     * @param key - The key to remove
     * @returns void
     * @description Remove the data from the storage
     */
    async function removeDataFromStorage(key: string): Promise<void>
    {
        try {
            //  check if the key is not empty
            if (!key) throw new Error('Key is empty');

            //  remove the data from the storage
            await AsyncStorage.removeItem(key);

        } catch (error) {
            console.log("useAsyncStorageHook: removeDataFromStorage", error);
            throw error;
        }
    }

    /**
     * Clear the storage
     * @returns void
     * @description Clear the storage
     */
    async function clearStorage(): Promise<void>
    {
        try {
            //  clear the storage
            await AsyncStorage.clear();
        } catch (error) {
            console.log("useAsyncStorageHook: clearStorage", error);
            throw error;
        }
    }

    return {
        storeDataIntoStorage,
        getDataFromStorage,
        removeDataFromStorage,
        clearStorage
    }
}
