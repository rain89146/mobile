import { Audio } from 'expo-av';

export default function useAlertSoundHook() {

    const playScanAlertSound = async () => {
        const { sound } = await Audio.Sound.createAsync(
            require('@/assets/alerts/scanAlert.wav')
        );
        await sound.playAsync();
    }

    const readyActionSound = async () => {
        const { sound } = await Audio.Sound.createAsync(
            require('@/assets/alerts/readyAction.wav')
        );
        await sound.playAsync();
    }

    const countDownSound = async () => {
        const { sound } = await Audio.Sound.createAsync(
            require('@/assets/alerts/countDown.wav')
        );
        await sound.playAsync();
    }

    const beepSound = async () => {
        const { sound } = await Audio.Sound.createAsync(
            require('@/assets/alerts/beep.wav')
        );
        await sound.playAsync();
    }

    return {
        playScanAlertSound,
        readyActionSound,
        countDownSound,
        beepSound
    }
}
