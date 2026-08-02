// src/api/authApi.ts
import axios from "axios";
import type { User } from '../types/auth';

export const authApi = axios.create({
    baseURL: "http://127.0.0.1:8000/",
    headers: {
        'Content-Type': 'application/json',
    },
});

export const fetchAccountProfile = async (accessToken: string, slug?: string): Promise<User> => {
    const headers = {
        Authorization: `Bearer ${accessToken}`,
    };

    const endpoints = slug
        ? [`account/${encodeURIComponent(slug)}/`, 'account/']
        : ['account/', 'me/'];

    let lastError: unknown = null;

    for (const endpoint of endpoints) {
        try {
            const { data } = await authApi.get(endpoint, { headers });
            return data as User;
        } catch (error) {
            lastError = error;
            const status = typeof error === 'object' && error !== null && 'response' in error
                ? (error as { response?: { status?: number } }).response?.status
                : undefined;

            if (status && status !== 404 && status !== 400) {
                throw error;
            }
        }
    }

    throw lastError instanceof Error
        ? lastError
        : new Error('Не вдалося завантажити профіль');
};