import type { User } from "./auth"

export interface ShortenedURL {
    id: number,
    original_url: string,
    short_code: string,
    clicks: number,
    notes?: string | null,
    user?: User | null
    created_at: string,
    updated_at?: string | null,
}

export interface ShortenedURLCreate {
    original_url: string;
    notes?: string;
}

export interface UrlListProps { 
    urls: ShortenedURL[], 
    loading: boolean, 
    removeUrl: (id: number) => void 
}

export interface UrlFormProps {
    addUrl: (data: ShortenedURLCreate) => Promise<void>
}

export interface StatsUrlItem {
    id: number;
    original_url: string;
    short_code: string;
    clicks: number;
    created_at: string;
}

export interface LongestUrlItem {
    id: number;
    original_url: string;
    short_code: string;
    url_length: number;
}

export interface BusiestDayItem {
    day: string | null;
    total: number;
}

export interface UrlStatsResponse {
    global: {
        total_urls: number;
        total_clicks: number;
        average_clicks: number;
        top_popular_urls: StatsUrlItem[];
        top_newest_urls: StatsUrlItem[];
        longest_original_url: LongestUrlItem | null;
    };
    my: {
        total_urls: number;
        total_clicks: number;
        average_clicks: number;
        busiest_creation_days: BusiestDayItem[];
        top_popular_urls: StatsUrlItem[];
    };
}