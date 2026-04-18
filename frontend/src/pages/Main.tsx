// src/pages/Main.tsx
import { useEffect, useMemo, useState } from 'react';
import { useUrls } from '../hooks/useUrls';
import Modal from '../components/ui/Modal';
import { AddUrlForm } from '../components/ui/AddUrlForm';
import Button from '../components/ui/Button';
import { UrlItem } from '../components/ui/UrlItem';
import { getUrlStats } from '../api/urls';
import type { StatsUrlItem, UrlStatsResponse } from '../types/url';

const formatDate = (date: string | null | undefined) => {
    if (!date) return '—';
    return new Date(date).toLocaleDateString('uk-UA');
};

const UrlTopList = ({ title, items }: { title: string; items: StatsUrlItem[] }) => (
    <section className="stats-card stats-card--alive">
        <h3 className="stats-card__title">{title}</h3>
        {items.length === 0 ? (
            <p className="stats-empty">Дані відсутні</p>
        ) : (
            <div className="stats-url-items">
                {items.map((item) => (
                    <UrlItem key={item.id} url={item} />
                ))}
            </div>
        )}
    </section>
);

export const Main = () => {
    const urlsData = useUrls();
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [stats, setStats] = useState<UrlStatsResponse | null>(null);
    const [statsLoading, setStatsLoading] = useState(true);
    const [statsError, setStatsError] = useState('');

    const fetchStats = async () => {
        setStatsLoading(true);
        setStatsError('');
        try {
            const data = await getUrlStats();
            setStats(data);
        } catch (error) {
            console.error('Помилка завантаження статистики', error);
            setStatsError('Не вдалося завантажити статистику');
        } finally {
            setStatsLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    const busiestDaysText = useMemo(() => {
        if (!stats?.my.busiest_creation_days.length) return '—';
        return stats.my.busiest_creation_days
            .map((day) => `${formatDate(day.day)} (${day.total})`)
            .join(', ');
    }, [stats]);


    return (
        <div className="app-content">
            <div className="stats-header">
                <h1 className="stats-header__title">Аналітика URL</h1>
                <Button
                    variant="primary"
                    size="lg"
                    onClick={() => setIsAddModalOpen(true)}
                >
                    + Скоротити URL
                </Button>
            </div>

            {statsLoading ? (
                <p>Завантаження статистики...</p>
            ) : statsError ? (
                <p className="form-error">{statsError}</p>
            ) : stats ? (
                <div className="stats-layout">
                    <div className="stats-columns">
                        <div className="stats-column">
                            <section className="stats-card stats-card--alive">
                                <h2 className="stats-card__title">Загальна статистика</h2>
                                <div className="stats-grid">
                                    <div className="stats-grid__item"><strong>К-сть всіх URL:</strong> {stats.global.total_urls}</div>
                                    <div className="stats-grid__item"><strong>К-сть всіх кліків:</strong> {stats.global.total_clicks}</div>
                                    <div className="stats-grid__item"><strong>Середні кліки на URL:</strong> {stats.global.average_clicks}</div>
                                    <div className="stats-grid__item">
                                        <strong>Найдовший original_url:</strong>{' '}
                                        {stats.global.longest_original_url
                                            ? `${stats.global.longest_original_url.url_length} симв. (${stats.global.longest_original_url.short_code})`
                                            : '—'}
                                    </div>
                                </div>
                                {stats.global.longest_original_url && (
                                    <p className="stats-long-url">
                                        {stats.global.longest_original_url.original_url}
                                    </p>
                                )}
                            </section>

                            <UrlTopList title="Топ 3 популярних URL (всі)" items={stats.global.top_popular_urls} />
                            <UrlTopList title="Топ 3 найновіших URL (всі)" items={stats.global.top_newest_urls} />
                        </div>

                        <div className="stats-column">
                            <section className="stats-card stats-card--alive">
                                <h2 className="stats-card__title">Твоя статистика</h2>
                                <div className="stats-grid">
                                    <div className="stats-grid__item"><strong>Ти створив URL:</strong> {stats.my.total_urls}</div>
                                    <div className="stats-grid__item"><strong>Кліки на твоїх URL:</strong> {stats.my.total_clicks}</div>
                                    <div className="stats-grid__item"><strong>Середні кліки на твої URL:</strong> {stats.my.average_clicks}</div>
                                    <div className="stats-grid__item"><strong>Найпродуктивніші дні:</strong> {busiestDaysText}</div>
                                </div>
                            </section>

                            <UrlTopList title="Твої найпопулярніші URL" items={stats.my.top_popular_urls} />
                        </div>
                    </div>
                </div>
            ) : null}

            {/* Модальне вікно створення URL */}
            <Modal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                title="Скоротити новий URL"
                size="md"
            >
                <AddUrlForm 
                    addUrl={urlsData.addUrl} 
                    onSuccess={() => {
                        setIsAddModalOpen(false);
                        fetchStats();
                    }}
                />
            </Modal>
        </div>
    );
};