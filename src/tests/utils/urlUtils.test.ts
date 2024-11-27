import { cleanUrl } from '../../utils/urlUtils';

describe('urlUtils', () => {
    it('should clean URL correctly', () => {
        const url = 'https://example.com/path?query=123#hash';
        expect(cleanUrl(url)).toBe('https://example.com/path');
    });

    it('should throw error for empty URL', () => {
        expect(() => cleanUrl('')).toThrow('URL is undefined or empty');
    });

    it('should return original URL for invalid URL', () => {
        const invalidUrl = 'not-a-url';
        expect(cleanUrl(invalidUrl)).toBe(invalidUrl);
    });
});