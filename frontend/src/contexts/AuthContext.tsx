// src/contexts/AuthContext.tsx
import { createContext, useState, useEffect, type ReactNode } from 'react';
import { authApi, fetchAccountProfile, updateProfile } from '../api/authApi';

import type {
    AuthContextType,
    AuthTokens,
    User,
    LoginCredentials,
    RegisterData,
    ApiError,
    UpdateUserData
} from '../types/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);
export { AuthContext };

interface AuthProviderProps {
    children: ReactNode;
}

/**
 * Type-safe error guard for axios-like errors
 */
const isApiError = (error: unknown): error is { response?: { data?: unknown }; message?: string } => {
    return typeof error === 'object' && error !== null;
};

const toApiError = (error: unknown, fallbackMessage: string): ApiError => {
    if (isApiError(error) && error.response?.data) {
        return error.response.data as ApiError;
    }

    if (error instanceof Error) {
        return { message: error.message };
    }

    return { message: fallbackMessage };
};

const normalizeUser = (data: Partial<User> | Record<string, unknown>, fallbackUsername: string): User => ({
    id: Number(data.id ?? 0),
    username: String(data.username ?? fallbackUsername),
    email: typeof data.email === 'string' ? data.email : undefined,
    first_name: typeof data.first_name === 'string' ? data.first_name : undefined,
    last_name: typeof data.last_name === 'string' ? data.last_name : undefined,
    slug: typeof data.slug === 'string' ? data.slug : undefined,
    bio: typeof data.bio === 'string' ? data.bio : undefined,
    avatar: typeof data.avatar === 'string' ? data.avatar : null,
});

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [user, setUser] = useState<User | null>(null);
    const [tokens, setTokens] = useState<AuthTokens | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    /**
     * Restore session
     */
    useEffect(() => {
        const access = localStorage.getItem('accessToken');
        const refresh = localStorage.getItem('refreshToken');
        const userData = localStorage.getItem('user');

        if (access && refresh && userData) {
            try {
                const parsedUser = JSON.parse(userData) as User;
                setTokens({ access, refresh });
                setUser(normalizeUser(parsedUser, parsedUser.username || 'user'));
            } catch {
                localStorage.clear();
            }
        }

        setIsLoading(false);
    }, []);

    /**
     * LOGIN
     */
    const login = async (credentials: LoginCredentials): Promise<void> => {
        setIsLoading(true);

        try {
            const { data } = await authApi.post('login/', credentials);

            const { access, refresh } = data as AuthTokens;
            const userData = await fetchAccountProfile(access);
            const normalizedUser = normalizeUser(userData, credentials.username);

            setTokens({ access, refresh });
            setUser(normalizedUser);

            localStorage.setItem('accessToken', access);
            localStorage.setItem('refreshToken', refresh);
            localStorage.setItem('user', JSON.stringify(normalizedUser));
        } catch (error: unknown) {
            throw toApiError(error, 'Невірний логін або пароль');
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * UPDATE USER
     */
    const updateUser = async (data: UpdateUserData): Promise<void> => {
        setIsLoading(true);

        try {
            if (!tokens) {logout(); return}
            const access = tokens.access;
            const updatedUser = await updateProfile(access, data)

            setUser(updatedUser)
            localStorage.setItem('user', JSON.stringify(updatedUser));
        } catch (error: unknown) {
            throw toApiError(error, 'Не знайдено користувача');
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * REGISTER
     */
    const register = async (data: RegisterData): Promise<void> => {
        setIsLoading(true);

        try {
            await authApi.post('register/', data);

            await login({
                username: data.username,
                password: data.password,
            });
        } catch (error: unknown) {
            throw toApiError(error, 'Помилка реєстрації');
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * LOGOUT
     */
    const logout = (): void => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');

        setTokens(null);
        setUser(null);
    };

    /**
     * REFRESH TOKEN
     */
    const refreshToken = async (): Promise<void> => {
        if (!tokens?.refresh) return;

        try {
            const { data } = await authApi.post('refresh/', {
                refresh: tokens.refresh,
            });

            const newAccess = (data as AuthTokens).access;

            setTokens((prev) =>
                prev ? { ...prev, access: newAccess } : null
            );

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
                updateUser,
                register,
                logout,
                refreshToken,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};