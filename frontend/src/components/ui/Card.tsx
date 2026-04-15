// src/components/ui/Card.tsx
import React from 'react';

export interface CardProps {
    children: React.ReactNode;
    className?: string;
    padding?: 'none' | 'sm' | 'md' | 'lg';
    shadow?: 'none' | 'sm' | 'md' | 'lg';
    bordered?: boolean;
    onClick?: () => void;
}

const paddingClasses = {
    none: 'card--p-none',
    sm: 'card--p-sm',
    md: 'card--p-md',
    lg: 'card--p-lg',
};

const shadowClasses = {
    none: 'card--shadow-none',
    sm: 'card--shadow-sm',
    md: 'card--shadow-md',
    lg: 'card--shadow-lg',
};

export const Card: React.FC<CardProps> = ({
    children,
    className = '',
    padding = 'md',
    shadow = 'md',
    bordered = true,
    onClick,
}) => {
    const classes = [
        'card',
        paddingClasses[padding],
        shadowClasses[shadow],
        bordered ? 'card--bordered' : '',
        onClick ? 'card--interactive' : '',
        className,
    ].join(' ');

    return (
        <div 
            className={classes}
            onClick={onClick}
            role={onClick ? 'button' : undefined}
            tabIndex={onClick ? 0 : undefined}
        >
            {children}
        </div>
    );
};

// Додаткові складові компоненти для зручності (як у Django — partials)

export const CardHeader: React.FC<{ children: React.ReactNode; className?: string }> = ({
    children,
    className = '',
}) => (
    <div className={`card__header ${className}`}>
        {children}
    </div>
);

export const CardTitle: React.FC<{ children: React.ReactNode; className?: string }> = ({
    children,
    className = '',
}) => (
    <h3 className={`card__title ${className}`}>
        {children}
    </h3>
);

export const CardDescription: React.FC<{ children: React.ReactNode; className?: string }> = ({
    children,
    className = '',
}) => (
    <p className={`card__description ${className}`}>
        {children}
    </p>
);

export const CardContent: React.FC<{ children: React.ReactNode; className?: string }> = ({
    children,
    className = '',
}) => <div className={className}>{children}</div>;

export const CardFooter: React.FC<{ children: React.ReactNode; className?: string }> = ({
    children,
    className = '',
}) => (
    <div className={`card__footer ${className}`}>
        {children}
    </div>
);

export default Card;