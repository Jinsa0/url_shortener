// src/api/authApi.ts
import axios from "axios";
import type { User, UpdateUserData } from '../types/auth';

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

    const endpoint = slug
        ? `account/${encodeURIComponent(slug)}/`
        : 'account/';

        try {
            const { data } = await authApi.get(endpoint, { headers });
            return data as User;
        } catch (error) {
            throw error instanceof Error
                ? error
                : new Error("Не вдалося завантажити профіль");
        }
};

export const updateProfile = async (accessToken: string, userData: UpdateUserData): Promise<User> => {
    const headers = {
            Authorization: `Bearer ${accessToken}`,
        };

    const endpoint = 'account/';

        try {
            const { data } = await authApi.patch(endpoint, userData, { headers });
            return data as User;
        } catch (error) {
            throw error instanceof Error
                ? error
                : new Error("Не вдалося оновити профіль");
        }
};