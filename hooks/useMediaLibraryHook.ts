import * as MediaLibrary from 'expo-media-library';

export default function useMediaLibraryHook() {

    const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();

    /**
     * Saves an image to the media library
     * @param uri The URI of the image to save to the media library
     * @returns void
     */
    const saveImageToLibrary = async (uri: string): Promise<void> => {
        try {
            if (permissionResponse?.status !== 'granted') throw new Error('Permission to access media library is required');

            await MediaLibrary.saveToLibraryAsync(uri);
        }
        catch (error) 
        {
            console.log('useMediaLibraryHook: saveImageToLibrary:', error);
            throw error;
        }
    }
    
    return {
        permissionResponse,
        requestPermission,
        saveImageToLibrary
    }
}
