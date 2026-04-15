// src/contexts/AuthContext.tsx
import { createContext, useState, useEffect, type ReactNode } from 'react';
import { api } from '../api/api';
import type {
    AuthContextType,
    AuthTokens,
    User,
    LoginCredentials,
    RegisterData,
    ApiError
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
                setTokens({ access, refresh });
                setUser(JSON.parse(userData) as User);
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
            const { data } = await api.post('login/', credentials);

            const { access, refresh } = data as AuthTokens;

            const me = await api.get('me/', {
                headers: {
                    Authorization: `Bearer ${access}`,
                },
            });

            const userData = me.data as User;

            setTokens({ access, refresh });
            setUser(userData);

            localStorage.setItem('accessToken', access);
            localStorage.setItem('refreshToken', refresh);
            localStorage.setItem('user', JSON.stringify(userData));
        } catch (error: unknown) {
            throw toApiError(error, 'Невірний логін або пароль');
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
            await api.post('register/', data);

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
            const { data } = await api.post('refresh/', {
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
                register,
                logout,
                refreshToken,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};