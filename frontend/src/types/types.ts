// src/types/types.ts

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface User {
    id: number;
    username: string;
    email?: string;
    first_name?: string;
    last_name?: string;
}

export interface AuthTokens {
    access: string;
    refresh: string;
}

export interface LoginCredentials {
    username: string;
    password: string;
}

export interface RegisterData {
    username: string;
    email?: string;           // email — опціональний
    password: string;
    password2: string;
}

export interface ApiError {
    message?: string;
    detail?: string | string[];
    [key: string]: unknown;
}

export interface AuthContextType {
    user: User | null;
    tokens: AuthTokens | null;
    isLoading: boolean;
    login: (credentials: LoginCredentials) => Promise<void>;
    register: (data: RegisterData) => Promise<void>;
    logout: () => void;
    refreshToken: () => Promise<void>;
}