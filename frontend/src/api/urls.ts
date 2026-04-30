import { api } from './api';
import type { ShortenedURL, ShortenedURLCreate, UrlStatsResponse } from '../types/url';

export const getUrl = async (id: number): Promise<ShortenedURL> => {
    const res = await api.get(`/api/urls/${id}/`);
    return res.data;
};

export const getUrls = async (): Promise<ShortenedURL[]> => {
    const res = await api.get('/api/urls/');
    return res.data;
};

export const createUrl = async (data: ShortenedURLCreate) => {
    const res = await api.post('/api/urls/', data);
    return res.data;
};

export const deleteUrl = async (id: number) => {
    await api.delete(`/api/urls/${id}/`);
};

export const getUrlStats = async (): Promise<UrlStatsResponse> => {
    const res = await api.get('/api/urls/stats/');
    return res.data;
};