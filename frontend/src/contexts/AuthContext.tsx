// src/contexts/AuthContext.tsx
import { createContext, useState, useEffect, type ReactNode } from 'react';
import axios from 'axios';
import type { AuthContextType, AuthTokens, User, LoginCredentials, RegisterData, ApiError } from '../types/types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export { AuthContext };

const API_BASE = 'http://127.0.0.1:8000/';

const toApiError = (error: unknown, fallbackMessage: string): ApiError => {
    if (axios.isAxiosError(error)) {
        return (error.response?.data as ApiError) ?? { message: error.message };
    }
    if (error instanceof Error) {
        return { message: error.message };
    }
    return { message: fallbackMessage };
};

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [user, setUser] = useState<User | null>(null);
    const [tokens, setTokens] = useState<AuthTokens | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Ініціалізація при старті додатка
    useEffect(() => {
        const savedAccess = localStorage.getItem('accessToken');
        const savedRefresh = localStorage.getItem('refreshToken');
        const savedUser = localStorage.getItem('user');

        if (savedAccess && savedRefresh && savedUser) {
            try {
                setTokens({ access: savedAccess, refresh: savedRefresh });
                setUser(JSON.parse(savedUser));
            } catch (e) {
                console.error('Failed to parse saved user data', e);
                localStorage.clear(); // очищуємо пошкоджені дані
            }
        }
        setIsLoading(false);
    }, []);

    // Axios request interceptor
    useEffect(() => {
        const interceptorId = axios.interceptors.request.use((config) => {
            if (tokens?.access) {
                config.headers.Authorization = `Bearer ${tokens.access}`;
            }
            return config;
        });

        return () => {
            axios.interceptors.request.eject(interceptorId);
        };
    }, [tokens]);

    const login = async (credentials: LoginCredentials): Promise<void> => {
        setIsLoading(true);
        try {
            const response = await axios.post(`${API_BASE}login/`, credentials);
            const { access, refresh } = response.data;

            const userResponse = await axios.get(`${API_BASE}me/`, {
                headers: { Authorization: `Bearer ${access}` },
            });

            const userData = userResponse.data as User;

            setTokens({ access, refresh });
            setUser(userData);

            localStorage.setItem('accessToken', access);
            localStorage.setItem('refreshToken', refresh);
            localStorage.setItem('user', JSON.stringify(userData));
        } catch (error) {
            throw toApiError(error, 'Невірний логін або пароль');
        } finally {
            setIsLoading(false);
        }
    };

    const register = async (data: RegisterData): Promise<void> => {
        setIsLoading(true);
        try {
            await axios.post(`${API_BASE}register/`, data);
            // Після реєстрації одразу логуємо користувача
            await login({ username: data.username, password: data.password });
        } catch (error) {
            throw toApiError(error, 'Помилка реєстрації');
        } finally {
            setIsLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        setTokens(null);
        setUser(null);
    };

    const refreshToken = async (): Promise<void> => {
        if (!tokens?.refresh) return;

        try {
            const response = await axios.post(`${API_BASE}refresh/`, { refresh: tokens.refresh });
            const newAccess = response.data.access;

            setTokens((prev) => (prev ? { ...prev, access: newAccess } : null));
            localStorage.setItem('accessToken', newAccess);
        } catch {
            logout();
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                tokens,
                isLoading,
                login,
                register,
                logout,
                refreshToken,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};