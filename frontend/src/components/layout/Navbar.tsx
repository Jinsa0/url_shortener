// src/components/layout/Navbar.tsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../ui/Button';
import type { User } from '../../types/auth';

interface NavbarProps {
    user: User | null;
    onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ user, onLogout }) => {
    const navigate = useNavigate();

    return (
        <header className="app-header">
            <nav className="app-container app-nav">
                <Link to="/" className="app-brand">
                    MyApp
                </Link>

                <div className="app-nav__actions">
                    <Link
                        to="/"
                        className="app-nav__link"
                    >
                        Головна
                    </Link>

                    {user ? (
                        <>
                            <span className="app-nav__user">
                                Привіт, <strong>{user.username}</strong>
                            </span>
                            <Button variant="ghost" size="sm" onClick={onLogout}>
                                Вийти
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => navigate('/login')}
                            >
                                Увійти
                            </Button>
                            <Button
                                variant="primary"
                                size="sm"
                                onClick={() => navigate('/register')}
                            >
                                Реєстрація
                            </Button>
                        </>
                    )}
                </div>
            </nav>
        </header>
    );
};

export default Navbar;