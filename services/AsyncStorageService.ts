import AsyncStorage from '@react-native-async-storage/async-storage';

export class AsyncStorageService 
{
    /**
     * Store the data into the storage
     * @description Store the data into the storage
     * @param key - The key to store the data
     * @param value - The value to store
     * @returns void
     */
    static async storeDataIntoStorage<T>(key: string, value: T): Promise<void>
    { 
        try {
            //  check if the key is not empty
            if (!key) throw new Error('Key is empty');

            //  check if the value is not empty
            if (!value) throw new Error('Value is empty');

            //  store the data into the storage
            await AsyncStorage.setItem(key, JSON.stringify(value));

        } catch (error) {
            console.log("AsyncStorageService: storeDataIntoStorage", error);
            throw error;
        }
    }

    /**
     * Get the data from the storage
     * @param key - The key to get
     * @returns T - The value
     * @description Get the data from the storage
     */
    static async getDataFromStorage<T>(key: string): Promise<T|null>
    {
        try {
            //  check if the key is not empty
            if (!key) throw new Error('Key is empty');

            //  get the data from the storage
            const value = await AsyncStorage.getItem(key);

            //  check if the value is not empty
            if (!value) throw new Error(`Value is empty for key: ${key}`);

            //  return the value
            return JSON.parse(value) as T;

        } catch (error) {
            console.log("AsyncStorageService: getDataFromStorage", error);
            return null;
        }
    }

    /**
     * Remove the data from the storage
     * @param key - The key to remove
     * @returns void
     * @description Remove the data from the storage
     */
    static async removeDataFromStorage(key: string): Promise<void>
    {
        try {
            //  check if the key is not empty
            if (!key) throw new Error('Key is empty');

            //  remove the data from the storage
            await AsyncStorage.removeItem(key);

        } catch (error) {
            console.log("AsyncStorageService: removeDataFromStorage", error);
        }
    }

    /**
     * Clear the storage
     * @returns void
     * @description Clear the storage
     */
    static async clearStorage(): Promise<void>
    {
        try {
            //  clear the storage
            await AsyncStorage.clear();
        } catch (error) {
            console.log("AsyncStorageService: clearStorage", error);
            throw error;
        }
    }
}