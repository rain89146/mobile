import { ImageProps } from 'expo-image';
import React, {useState} from 'react'

export default function useImageHook() {

    const [imageError, setImageError] = useState<string|null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [loadingProgress, setLoadingProgress] = useState<number>(0);
    const [photoProp, setPhotoProp] = useState<ImageProps>();

    return {
        imageError,
        isLoading,
        loadingProgress,
        photoProp,
        setImageError,
        setIsLoading,
        setLoadingProgress,
        setPhotoProp,
    }
}
