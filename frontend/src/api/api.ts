// src/api/api.ts
import axios from "axios";

export const api = axios.create({
    baseURL: "http://127.0.0.1:8000/",
});

let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;

const clearSession = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
};

const refreshAccessToken = async (): Promise<string | null> => {
    const refresh = localStorage.getItem('refreshToken');
    if (!refresh) return null;

    try {
        const response = await axios.post("http://127.0.0.1:8000/refresh/", { refresh });
        const { access, refresh: newRefresh } = response.data as { access?: string; refresh?: string };

        if (!access) {
            clearSession();
            return null;
        }

        localStorage.setItem('accessToken', access);
        if (newRefresh) {
            localStorage.setItem('refreshToken', newRefresh);
        }

        return access;
    } catch {
        clearSession();
        return null;
    }
};

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Опціонально: обробка 401 (авто-логаут)
api.interceptors.response.use(
    response => response,
    async (error) => {
        const originalRequest = error.config;
        const isUnauthorized = error.response?.status === 401;
        const isRefreshRequest = originalRequest?.url?.includes('/refresh/');

        if (isUnauthorized && !isRefreshRequest && !originalRequest?._retry) {
            originalRequest._retry = true;

            if (!isRefreshing) {
                isRefreshing = true;
                refreshPromise = refreshAccessToken().finally(() => {
                    isRefreshing = false;
                });
            }

            const newAccessToken = await refreshPromise;
            if (newAccessToken) {
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                return api(originalRequest);
            }

            console.warn("Token expired or invalid - session cleared");
        }

        return Promise.reject(error);
    }
);