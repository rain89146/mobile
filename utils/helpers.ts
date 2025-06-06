import * as Haptics from 'expo-haptics';
import validator from 'validator';

export class Helpers
{
    /**
     * Is the given URL an external link?
     * @description This function checks if the given URL is an external link.
     * @param url - The URL to check
     * @returns {boolean} - True if the URL is an external link, false otherwise
     */
    static isExternalLink(url: string): boolean {
        const isExternalUrl = url.startsWith('http') || url.startsWith('https');
        return isExternalUrl;
    }

    static async notificationSuccessFeedback(): Promise<void> {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }

    static async notificationWarnFeedback(): Promise<void> {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    }

    static async notificationErrorFeedback(): Promise<void> {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }

    static async impactHeavyFeedback(): Promise<void> {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    }

    static async impactMediumFeedback(): Promise<void> {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    static async impactLightFeedback(): Promise<void> {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    static async impactRigidFeedback(): Promise<void> {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Rigid);
    }

    static async impactSoftFeedback(): Promise<void> {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
    }

    static async selectionFeedback(): Promise<void> {
        await Haptics.selectionAsync();
    }

    static validateEmail(email: string): boolean {
        return validator.isEmail(email);
    }

    static validatePassword(password: string): boolean {
        return validator.isStrongPassword(password, {
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1,
        })
    }

    static passwordEvaluation(password: string): number {
        return validator.isStrongPassword(password, {
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1,
            returnScore: true,
        })
    }

    // letter only, allow apostrophes, dashes and spaces
    // e.g. O'Connor, Anne-Marie, John Doe
    static validatePersonName(name: string): boolean {
        return validator.isAlpha(name, 'en-US', {
            ignore: ' -\''
        })
    }

    static validateNumber(number: string): boolean {
        return validator.isNumeric(number, {
            no_symbols: true,
        })
    }
}