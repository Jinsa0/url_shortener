import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { authApi, fetchAccountProfile } from '../api/authApi';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/ui/Button';
import type { User } from '../types/auth';

export const ProfilePage = () => {
    const { slug } = useParams<{ slug?: string }>();
    const { user, tokens, logout } = useAuth();
    const [profile, setProfile] = useState<User | null>(user);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [avatarErrored, setAvatarErrored] = useState(false);

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

    if (loading) {
        return <p className="page-loader">Завантаження профілю...</p>;
    }

    const currentProfile = profile ?? user;
    const avatarUrl = currentProfile?.avatar
        ? currentProfile.avatar.startsWith('http')
            ? currentProfile.avatar
            : `http://127.0.0.1:8000${currentProfile.avatar.startsWith('/') ? currentProfile.avatar : `/${currentProfile.avatar}`}`
        : null;
    const initials = currentProfile?.username
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

                {currentProfile ? (
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
                    </div>
                ) : (
                    <p>Профіль недоступний</p>
                )}

                <div style={{ marginTop: '1.5rem' }}>
                    <Button variant="danger" onClick={handleLogout}>
                        Вийти з акаунту
                    </Button>
                </div>
            </div>
        </div>
    );
};
