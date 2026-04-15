// src/components/ui/LoginForm.tsx
import React, { useState } from 'react';
import Button from './Button';
import Card, { CardHeader, CardTitle, CardContent } from './Card';
import type { UrlFormProps } from "../../types/url"

const getErrorMessage = (error: unknown): string => {
    if (!error || typeof error !== 'object') {
        return 'Помилка створення URL';
    }

    const apiError = error as Record<string, unknown>;
    if (typeof apiError.detail === 'string') return apiError.detail;
    if (Array.isArray(apiError.detail) && typeof apiError.detail[0] === 'string') {
        return apiError.detail[0];
    }
    if (typeof apiError.message === 'string') return apiError.message;

    return 'Помилка створення URL';
};

export const AddUrlForm = ({ addUrl }: UrlFormProps) => {
    const [original_url, setOriginalUrl] = useState<string>("");
    const [notes, setNotes] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setLoading(true);
        setError('');
        if (!original_url.startsWith("http")) {
            setError("Введіть коректний URL (з http/https)");
            setLoading(false);
            return;
        }

        try {
            await addUrl({original_url, notes});

            setOriginalUrl("");
            setNotes("");
            setError("");
        } catch (err) {
            setError(getErrorMessage(err));
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="auth-section">
            <Card className="auth-card">
                <CardHeader>
                    <CardTitle>Скоротити URL</CardTitle>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleAdd} className="auth-form">
                        <div className="form-field">
                            <label className="form-label">Оригінальний URL</label>
                            <input
                                type="text"
                                value={original_url}
                                onChange={(e) => setOriginalUrl(e.target.value )}
                                className="form-input"
                                required
                            />
                        </div>

                        <div className="form-field">
                            <label className="form-label">Нотатки(опціонально)</label>
                            <input
                                type="text"
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                className="form-input"
                            />
                        </div>

                        {error && <p className="form-error">{error}</p>}

                        <Button
                            type="submit"
                            variant="primary"
                            size="lg"
                            fullWidth
                            isLoading={loading}
                            disabled={loading}
                        >
                            Створити
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </section>
    );
};