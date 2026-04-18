// src/components/layout/BaseLayout.tsx
import React, { useEffect } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import type { User } from '../../types/auth';

/**
 * Пропси компонента BaseLayout
 */
interface BaseLayoutProps {
    /** Контент, який буде відображатися між Navbar і Footer */
    children: React.ReactNode;

    /** Поточний авторизований користувач (null, якщо гість) */
    user: User | null;

    /** Функція для виходу з акаунту */
    onLogout: () => void;

    /** Назва сторінки для <title> у вкладці браузера */
    title?: string;
}

/**
 * Базовий layout всього застосунку.
 * Обгортає сторінки в Navbar + основний контент + Footer.
 * Також керує document.title.
 */
export const BaseLayout = ({
    children,
    user,
    onLogout,
    title = 'MyApp',
}: BaseLayoutProps): React.ReactElement => {
    // Оновлюємо заголовок сторінки при зміні title
    useEffect(() => {
        const newTitle = title ? `${title} | MyApp` : 'MyApp';
        document.title = newTitle;

        // Опціонально: повертаємо попередній title при розмонтуванні компонента
        return () => {
            document.title = 'MyApp'; // або можна зберегти попередній title
        };
    }, [title]);

    return (
        <div className="app-shell">
            {/* Верхня навігація */}
            <Navbar user={user} onLogout={onLogout} />

            {/* Основний контент сторінки */}
            <main className="app-main">
                <section className="app-container app-content">
                    {children}
                </section>
            </main>

            {/* Нижній футер */}
            <Footer />
        </div>
    );
};

// Default export для зручності імпорту
export default BaseLayout;