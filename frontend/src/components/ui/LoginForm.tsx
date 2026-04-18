// src/components/ui/LoginForm.tsx
import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import Button from './Button';
import Card, { CardHeader, CardTitle, CardContent, CardFooter } from './Card';
import { validateLoginData } from '../../utils/validation';

const getErrorMessage = (error: unknown): string => {
    if (!error || typeof error !== 'object') {
        return 'Невірний логін або пароль';
    }

    const apiError = error as Record<string, unknown>;
    if (typeof apiError.detail === 'string') return apiError.detail;
    if (Array.isArray(apiError.detail) && typeof apiError.detail[0] === 'string') {
        return apiError.detail[0];
    }
    if (typeof apiError.message === 'string') return apiError.message;

    return 'Невірний логін або пароль';
};

export const LoginForm = () => {
    const { login } = useAuth();

    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const validationError = validateLoginData(credentials);
        if (validationError) {
            setError(validationError);
            return;
        }

        setError('');
        setIsSubmitting(true);

        try {
            await login(credentials);
        } catch (err) {
            setError(getErrorMessage(err));
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section className="auth-section">
            <Card className="auth-card">
                <CardHeader>
                    <CardTitle>Увійти в акаунт</CardTitle>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleSubmit} className="auth-form">
                        <div className="form-field">
                            <label className="form-label">Ім'я користувача</label>
                            <input
                                type="text"
                                value={credentials.username}
                                onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                                className="form-input"
                                required
                            />
                        </div>

                        <div className="form-field">
                            <label className="form-label">Пароль</label>
                            <input
                                type="password"
                                value={credentials.password}
                                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
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
                            Увійти
                        </Button>
                    </form>
                </CardContent>

                <CardFooter className="auth-footer">
                    <p className="auth-footer__text">
                        Немає акаунту?{' '}
                        <a href="/register" className="auth-footer__link">
                            Зареєструватися
                        </a>
                    </p>
                </CardFooter>
            </Card>
        </section>
    );
};