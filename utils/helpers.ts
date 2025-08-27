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

    static formatDate(timestamp: string)
    {
        const today = new Date();
        const isToday = new Date(timestamp).toDateString() === today.toDateString();

        let formattedDate = new Date(timestamp).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hourCycle: 'h12',
        });

        // // if the timestamp is today, format it to show only the time
        // if (isToday) {
        //     const hoursDiff = Math.floor((today.getTime() - new Date(timestamp).getTime()) / 1000 / 60 / 60);

        //     // if the difference is less than 24 hours and greater than 1 hour, show the hours difference
        //     if (hoursDiff < 24 && hoursDiff >= 1) 
        //     {
        //         formattedDate = `${hoursDiff} hours ago`;
        //         return;
        //     }

        //     // if the difference is less than 1 hour, show the minutes difference
        //     const minutesDiff = Math.floor((today.getTime() - new Date(timestamp).getTime()) / 1000 / 60);
        //     if (minutesDiff < 60 && minutesDiff >= 1) 
        //     {
        //         formattedDate = `${minutesDiff} minutes ago`;
        //         return;
        //     }

        //     // if the difference is less than 1 minute, show "Just now"
        //     formattedDate = 'Just now';
        // }

        return formattedDate;
    }

    // Helper function to darken/lighten colors for gradients
    static shadeColor(color: string, percent: number): string {
        let R = parseInt(color.substring(1, 3), 16);
        let G = parseInt(color.substring(3, 5), 16);
        let B = parseInt(color.substring(5, 7), 16);

        // Apply percentage change and round to integers
        R = Math.round(Math.min(255, Math.max(0, R + R * percent / 100)));
        G = Math.round(Math.min(255, Math.max(0, G + G * percent / 100)));
        B = Math.round(Math.min(255, Math.max(0, B + B * percent / 100)));

        const RR = R.toString(16).padStart(2, '0');
        const GG = G.toString(16).padStart(2, '0');
        const BB = B.toString(16).padStart(2, '0');

        return `#${RR}${GG}${BB}`;
    }
}