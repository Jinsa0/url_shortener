import { useEffect, useState, type FormEvent } from 'react';
import { useParams } from 'react-router-dom';
import { authApi, fetchAccountProfile } from '../api/authApi';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/ui/Button';
import type { User, UpdateUserData } from '../types/auth';
import { validateUpdateUserData } from '../utils/validation';

export const ProfilePage = () => {
    const { slug } = useParams<{ slug?: string }>();
    const { user, tokens, logout, updateUser } = useAuth();
    const [profile, setProfile] = useState<User | null>(user);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [avatarErrored, setAvatarErrored] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState<UpdateUserData>({});

    useEffect(() => {
        const loadProfile = async () => {
            if (!tokens?.access) {
                setLoading(false);
                setProfile(null);
                return;
            }

            setLoading(true);
            setError('');
            setAvatarErrored(false);

            try {
                const requestedSlug = slug || user?.slug || user?.username;
                const data = await fetchAccountProfile(tokens.access, requestedSlug);
                setProfile(data);
            } catch (err) {
                console.error(err);
                setProfile(null);
                setError('Не вдалося завантажити профіль');
            } finally {
                setLoading(false);
            }
        };

        loadProfile();
    }, [slug, tokens?.access, user?.slug, user?.username]);

    const currentProfile = profile ?? user;
    const canEdit = Boolean(currentProfile?.slug && user?.slug && currentProfile.slug === user.slug);

    const handleLogout = async () => {
        try {
            if (tokens?.refresh) {
                await authApi.post('logout/', { refresh: tokens.refresh });
            }
        } catch (err) {
            console.error(err);
        } finally {
            logout();
        }
    };

    const startEditing = () => {
        if (!currentProfile) return;

        setFormData({
            username: currentProfile.username,
            email: currentProfile.email,
            first_name: currentProfile.first_name,
            last_name: currentProfile.last_name,
            bio: currentProfile.bio,
        });
        setError('');
        setSuccess('');
        setIsEditing(true);
    };

    const cancelEditing = () => {
        setError('');
        setSuccess('');
        setIsEditing(false);
    };

    const handleFieldChange = (field: keyof UpdateUserData, value: string) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleSave = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError('');
        setSuccess('');

        const validationError = validateUpdateUserData(formData);
        if (validationError) {
            setError(validationError);
            return;
        }

        if (!tokens?.access) {
            setError('Не авторизовано. Спробуйте перезавантажити сторінку.');
            return;
        }

        setIsSubmitting(true);

        try {
            await updateUser(formData);
            setSuccess('Профіль успішно оновлено.');
            setIsEditing(false);
            setProfile((prev) => (prev ? { ...prev, ...formData } as User : prev));
        } catch (err) {
            setError('Не вдалося оновити профіль. Спробуйте ще раз.');
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return <p className="page-loader">Завантаження профілю...</p>;
    }

    if (!currentProfile) {
        return (
            <div className="app-content">
                <div className="card card--bordered card--shadow-sm card--p-md">
                    <h1 style={{ marginTop: 0 }}>Профіль користувача</h1>
                    <p>Профіль недоступний.</p>
                </div>
            </div>
        );
    }

    const avatarUrl = currentProfile.avatar
        ? currentProfile.avatar.startsWith('http')
            ? currentProfile.avatar
            : `http://127.0.0.1:8000${currentProfile.avatar.startsWith('/') ? currentProfile.avatar : `/${currentProfile.avatar}`}`
        : null;

    const initials = currentProfile.username
        ? currentProfile.username
            .split(/\s+/)
            .slice(0, 2)
            .map((part) => part[0]?.toUpperCase() || '')
            .join('')
        : 'U';

    return (
        <div className="app-content">
            <div className="card card--bordered card--shadow-sm card--p-md">
                <h1 style={{ marginTop: 0 }}>Профіль користувача</h1>

                {error && <p className="form-error">{error}</p>}
                {success && <p className="form-success">{success}</p>}

                {isEditing ? (
                    <form onSubmit={handleSave} style={{ display: 'grid', gap: '1rem' }}>
                        <div className="form-field">
                            <label className="form-label">Логін</label>
                            <input
                                className="form-input"
                                type="text"
                                value={formData.username ?? ''}
                                onChange={(e) => handleFieldChange('username', e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-field">
                            <label className="form-label">Email</label>
                            <input
                                className="form-input"
                                type="email"
                                value={formData.email ?? ''}
                                onChange={(e) => handleFieldChange('email', e.target.value)}
                            />
                        </div>

                        <div className="form-field">
                            <label className="form-label">Ім'я</label>
                            <input
                                className="form-input"
                                type="text"
                                value={formData.first_name ?? ''}
                                onChange={(e) => handleFieldChange('first_name', e.target.value)}
                            />
                        </div>

                        <div className="form-field">
                            <label className="form-label">Прізвище</label>
                            <input
                                className="form-input"
                                type="text"
                                value={formData.last_name ?? ''}
                                onChange={(e) => handleFieldChange('last_name', e.target.value)}
                            />
                        </div>

                        <div className="form-field">
                            <label className="form-label">Bio</label>
                            <textarea
                                className="form-input"
                                rows={4}
                                value={formData.bio ?? ''}
                                onChange={(e) => handleFieldChange('bio', e.target.value)}
                            />
                        </div>

                        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                            <Button type="submit" variant="primary" isLoading={isSubmitting}>
                                Зберегти
                            </Button>
                            <Button type="button" variant="secondary" onClick={cancelEditing} disabled={isSubmitting}>
                                Скасувати
                            </Button>
                        </div>
                    </form>
                ) : (
                    <div style={{ display: 'grid', gap: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            {avatarUrl && !avatarErrored ? (
                                <img
                                    src={avatarUrl}
                                    alt={currentProfile.username}
                                    style={{ width: 96, height: 96, borderRadius: '50%', objectFit: 'cover', border: '2px solid #d9e2f0' }}
                                    onError={() => setAvatarErrored(true)}
                                />
                            ) : null}
                            <div
                                style={{
                                    width: 96,
                                    height: 96,
                                    borderRadius: '50%',
                                    background: '#4f46e5',
                                    color: '#fff',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '1.75rem',
                                    fontWeight: 700,
                                }}
                            >
                                {initials}
                            </div>
                        </div>

                        <p><strong>Логін:</strong> {currentProfile.username}</p>
                        <p><strong>Email:</strong> {currentProfile.email || '—'}</p>
                        <p><strong>Slug:</strong> {currentProfile.slug || '—'}</p>
                        <p><strong>Bio:</strong> {currentProfile.bio || '—'}</p>

                        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                            {canEdit && (
                                <Button type="button" variant="primary" onClick={startEditing}>
                                    Редагувати профіль
                                </Button>
                            )}
                            <Button variant="danger" onClick={handleLogout}>
                                Вийти з акаунту
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
