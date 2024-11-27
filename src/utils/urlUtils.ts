import { URL } from 'url';

export function cleanUrl(url: string): string {
    if (!url) {
        throw new Error('URL is undefined or empty');
    }
    
    try {
        const parsedUrl = new URL(url);
        return `${parsedUrl.protocol}//${parsedUrl.host}${parsedUrl.pathname}`;
    } catch (error) {
        return url;
    }
}