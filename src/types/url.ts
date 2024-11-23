export interface ShortUrl {
    urlId: string;
    originalUrl: string;
    shortUrl: string;
    clicks: number;
    createdAt: Date;
}

export interface CreateShortUrlRequest {
    url: string;
}

export interface UpdateShortUrlRequest {
    url: string;
}

export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
}