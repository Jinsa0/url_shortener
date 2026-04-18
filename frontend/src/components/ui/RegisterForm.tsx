// src/components/ui/RegisterForm.tsx
import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import Button from './Button';
import Card, { CardHeader, CardTitle, CardContent, CardFooter } from './Card';
import { validateRegisterData } from '../../utils/validation';

const getRegisterErrorMessage = (error: unknown): string => {
    if (!error || typeof error !== 'object') {
        return 'Помилка реєстрації';
    }

    const apiError = error as Record<string, unknown>;
    const fieldOrder = ['username', 'email', 'password', 'password2', 'detail', 'message'];

    for (const field of fieldOrder) {
        const value = apiError[field];
        if (typeof value === 'string') return value;
        if (Array.isArray(value) && typeof value[0] === 'string') return value[0];
    }

    return 'Помилка реєстрації';
};

export const RegisterForm = () => {
    const { register } = useAuth();

    const [data, setData] = useState({
        username: '',
        email: '',
        password: '',
        password2: '',
    });

    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const validationError = validateRegisterData(data);
        if (validationError) {
            setError(validationError);
            return;
        }

        setError('');
        setIsSubmitting(true);

        try {
            await register(data);
        } catch (err) {
            setError(getRegisterErrorMessage(err));
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section className="auth-section">
            <Card className="auth-card">
                <CardHeader>
                    <CardTitle>Створити акаунт</CardTitle>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleSubmit} className="auth-form">
                        <div className="form-field">
                            <label className="form-label">Ім'я користувача</label>
                            <input
                                type="text"
                                value={data.username}
                                onChange={(e) => setData({ ...data, username: e.target.value })}
                                className="form-input"
                                required
                            />
                        </div>

                        <div className="form-field">
                            <label className="form-label">Email (необов'язково)</label>
                            <input
                                type="email"
                                value={data.email}
                                onChange={(e) => setData({ ...data, email: e.target.value })}
                                className="form-input"
                            />
                        </div>

                        <div className="form-field">
                            <label className="form-label">Пароль</label>
                            <input
                                type="password"
                                value={data.password}
                                onChange={(e) => setData({ ...data, password: e.target.value })}
                                className="form-input"
                                required
                            />
                        </div>

                        <div className="form-field">
                            <label className="form-label">Підтвердіть пароль</label>
                            <input
                                type="password"
                                value={data.password2}
                                onChange={(e) => setData({ ...data, password2: e.target.value })}
                                className="form-input"
                                required
                            />
                        </div>

                        {error && <p className="form-error">{error}</p>}

                        <Button
                            type="submit"
                            variant="primary"
                            size="lg"
                            fullWidth
                            isLoading={isSubmitting}
                        >
                            Зареєструватися
                        </Button>
                    </form>
                </CardContent>

                <CardFooter className="auth-footer">
                    <p className="auth-footer__text">
                        Вже є акаунт?{' '}
                        <a href="/login" className="auth-footer__link">
                            Увійти
                        </a>
                    </p>
                </CardFooter>
            </Card>
        </section>
    );
};