// src/utils/validation.ts
import type { LoginCredentials, RegisterData } from '../types/auth';

const DJANGO_USERNAME_REGEX = /^[\w.@+-]+$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Валідація даних для входу
 */
export const validateLoginData = (credentials: LoginCredentials): string | null => {
    if (!credentials.username?.trim()) {
        return "Поле 'Ім'я користувача' є обов'язковим.";
    }
    if (!credentials.password?.trim()) {
        return "Поле 'Пароль' є обов'язковим.";
    }
    return null;
};

/**
 * Валідація даних для реєстрації (email — опціональний)
 */
export const validateRegisterData = (data: RegisterData): string | null => {
    const username = data.username?.trim() ?? '';
    const email = data.email?.trim();

    if (!username) {
        return "Поле 'Ім'я користувача' є обов'язковим.";
    }

    if (username.length > 150) {
        return "Ім'я користувача має містити не більше 150 символів.";
    }

    if (!DJANGO_USERNAME_REGEX.test(username)) {
        return "Ім'я користувача може містити лише літери, цифри та символи @ . + - _";
    }

    // Email перевіряємо тільки якщо він заповнений
    if (email && !EMAIL_REGEX.test(email)) {
        return "Вкажіть коректний email адрес.";
    }

    if (!data.password) {
        return "Поле 'Пароль' є обов'язковим.";
    }

    if (data.password.length < 8) {
        return 'Пароль має містити щонайменше 8 символів.';
    }

    if (!data.password2) {
        return "Поле 'Підтвердження паролю' є обов'язковим.";
    }

    if (data.password !== data.password2) {
        return 'Паролі не співпадають.';
    }

    return null;
};