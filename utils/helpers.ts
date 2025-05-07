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
}