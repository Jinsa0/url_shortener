// src/components/ui/Button.tsx
import React from 'react';
import type { ButtonVariant, ButtonSize } from "../../types/other.ts"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    isLoading?: boolean;
    fullWidth?: boolean;
    children: React.ReactNode;
}


export const Button: React.FC<ButtonProps> = ({
    variant = 'primary',
    size = 'md',
    isLoading = false,
    fullWidth = false,
    className = '',
    disabled,
    children,
    ...props
}) => {
    const variantClasses: Record<ButtonVariant, string> = {
        primary: 'btn--primary',
        secondary: 'btn--secondary',
        outline: 'btn--outline',
        ghost: 'btn--ghost',
        danger: 'btn--danger',
    };

    const sizeClasses: Record<ButtonSize, string> = {
        sm: 'btn--sm',
        md: 'btn--md',
        lg: 'btn--lg',
    };

    const classes = [
        'btn',
        variantClasses[variant],
        sizeClasses[size],
        fullWidth ? 'btn--full' : '',
        isLoading || disabled ? 'btn--disabled' : '',
        className,
    ].join(' ');

    return (
        <button
            className={classes}
            disabled={isLoading || disabled}
            {...props}
        >
            {isLoading && (
                <span className="btn__spinner" />
            )}
            {children}
        </button>
    );
};

export default Button;