import EncryptedStorage from 'react-native-encrypted-storage';

export default function useSecureStorageHook(): {
    storeEncryptedSession: <T>(key: string, value: T) => Promise<void>;
    getEncryptedSession: <T>(key: string) => Promise<T|null>;
    removeEncryptedSession: (key: string) => Promise<void>;
    clearEncryptedSession: () => Promise<void>;
} {
    /**
     * Get the data from the storage
     * @param key - The key to get
     * @returns T - The value
     * @description Get the data from the storage
     */
    async function storeEncryptedSession<T>(key: string, value: T): Promise<void> {
        try {
            //  check if the key is not empty
            if (!key) throw new Error('Key is empty');
            
            //  check if the value is not empty
            if (!value) throw new Error('Value is empty');

            //  store the data into the storage
            await EncryptedStorage.setItem(key, JSON.stringify(value));    

        } catch (error) {
            console.log("useSecureStorageHook: storeUserSession", error);
            throw error;
        }
    }

    /**
     * Get the data from the storage
     * @param key - The key to get
     * @returns T - The value
     * @description Get the data from the storage
     */
    async function getEncryptedSession<T>(key: string): Promise<T|null> {
        try {
            //  check if the key is not empty
            if (!key) throw new Error('Key is empty');
            
            //  get the data from the storage
            const value = await EncryptedStorage.getItem(key);
            
            //  check if the value is not empty
            if (!value) throw new Error('Value is empty');
            
            //  return the value
            return JSON.parse(value) as T;

        } catch (error) {
            console.log("useSecureStorageHook: getUserSession", error);
            return null;
        }
    }

    /**
     * Remove the data from the storage
     * @param key - The key to remove
     * @returns void
     * @description Remove the data from the storage
     */
    async function removeEncryptedSession(key: string): Promise<void> {
        try {
            //  check if the key is not empty
            if (!key) throw new Error('Key is empty');

            //  remove the data from the storage
            await EncryptedStorage.removeItem(key);

        } catch (error) {
            console.log("useSecureStorageHook: removeUserSession", error);
            throw error;
        }
    }

    /**
     * Clear the storage
     * @returns void
     * @description Clear the storage
     */
    async function clearEncryptedSession(): Promise<void> {
        try {
            //  clear the storage
            await EncryptedStorage.clear();
        } catch (error) {
            console.log("useSecureStorageHook: clearUserSession", error);
            throw error;
        }
    }

    return {
        storeEncryptedSession,
        getEncryptedSession,
        removeEncryptedSession,
        clearEncryptedSession
    }
}
