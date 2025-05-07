import { Image, ImageErrorEventData, ImageLoadEventData, ImageProgressEventData, ImageProps } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { View, Text } from 'react-native';

export function ImageComp({
    photo, 
    setImageLoading,
    setPhotoProp,
    onImageDisplay,
    onImageError,
    onImageLoadingProgress,
}: {
    photo: string|null, 
    setImageLoading: (loading: boolean) => void,
    setPhotoProp: (photo: ImageProps) => void,
    onImageDisplay: () => void,
    onImageError: (error: string) => void,
    onImageLoadingProgress: (progress: number) => void,
}) {
    return (
        <Image 
            source={photo} 
            placeholder={{
                blurhash: '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj['
            }}
            alt="Camera Preview" 
            style={{width: '100%', height: '100%'}} 
            contentFit="cover"
            transition={1000}
            allowDownscaling={true}
            onDisplay={onImageDisplay}
            onError={(error: ImageErrorEventData) => onImageError(error.error)}
            onLoadStart={() => setImageLoading(true)}
            onProgress={(progress: ImageProgressEventData) => {
                const { loaded, total } = progress;
                const percentage = (loaded / total) * 100;
                onImageLoadingProgress(percentage);
            }}
            onLoad={(event: ImageLoadEventData) => {
                setImageLoading(false);
                onImageLoadingProgress(0);
                const {url, width, height} = event.source;
                setPhotoProp({
                    url,
                    width,
                    height,
                } as ImageProps);
            }}
        />
    )
}

export function NoImagePlaceholder() {
    return (
        <LinearGradient 
            colors={['#4c669f', '#3b5998', '#192f6a']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            locations={[0, 0.5, 1]}
            style={{
                flex: 1,
                width: '100%',
                height: '100%',
                position: 'relative',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <View style={{
                width: '100%',
                height: '100%',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'rgba(8, 22, 27, 0.8)',
            }}>
                <Text
                    style={{
                        color: '#fff',
                        fontSize: 16,
                        textAlign: 'center',
                    }}
                >No photo available</Text>
            </View>
        </LinearGradient>
    )
}
