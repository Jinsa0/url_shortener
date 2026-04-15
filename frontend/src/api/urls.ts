import { api } from './api';
import type { ShortenedURL, ShortenedURLCreate } from '../types/url';

export const getUrls = async (): Promise<ShortenedURL[]> => {
    const res = await api.get('urls/');
    return res.data;
};

export const createUrl = async (data: ShortenedURLCreate) => {
    const res = await api.post('urls/', data);
    return res.data;
};

export const deleteUrl = async (id: number) => {
    await api.delete(`urls/${id}/`);
};