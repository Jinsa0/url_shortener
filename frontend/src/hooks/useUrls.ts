import { useEffect, useState } from 'react';
import { getUrls, createUrl, deleteUrl } from '../api/urls';
import type { ShortenedURL, ShortenedURLCreate } from '../types/url';

export const useUrls = () => {
    const [urls, setUrls] = useState<ShortenedURL[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchUrls = async () => {
        try {
            const data = await getUrls();
            setUrls(data);
        } catch(e) {
            console.error("Помилка отримавння URL", e);
        } finally {
            setLoading(false)
        }
    };

    const addUrl = async ({original_url, notes }: ShortenedURLCreate) => {
        const newUrl = await createUrl({original_url, notes});
        setUrls(prev => [newUrl, ...prev]);
    };

    const removeUrl = async (id: number) => {
        await deleteUrl(id);
        setUrls(prev => prev.filter(u => u.id !== id))
    }

    useEffect(() => {
        fetchUrls();
    }, [])

    return { urls, loading, addUrl, removeUrl}
};
