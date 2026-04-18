// src/components/layout/Footer.tsx
import React from 'react';

export const Footer: React.FC = () => {
    return (
        <footer className="app-footer">
            <div className="app-container app-footer__inner">
                <p className="app-footer__text">
                    © {new Date().getFullYear()} Jinsa_0 — All Rights Reserved.
                </p>
            </div>
        </footer>
    );
};

export default Footer;