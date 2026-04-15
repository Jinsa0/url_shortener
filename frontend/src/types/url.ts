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