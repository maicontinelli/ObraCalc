'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
    id: string;
    type: ToastType;
    title: string;
    message: string;
}

interface ToastContextType {
    toasts: Toast[];
    showToast: (type: ToastType, title: string, message: string) => void;
    removeToast: (id: string) => void;
    success: (title: string, message: string) => void;
    error: (title: string, message: string) => void;
    warning: (title: string, message: string) => void;
    info: (title: string, message: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const removeToast = useCallback((id: string) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    }, []);

    const showToast = useCallback((type: ToastType, title: string, message: string) => {
        const id = Date.now().toString();
        const newToast: Toast = { id, type, title, message };

        setToasts(prev => [...prev, newToast]);

        // Auto-remover após 5 segundos
        setTimeout(() => {
            removeToast(id);
        }, 5000);
    }, [removeToast]);

    const success = useCallback((title: string, message: string) => {
        showToast('success', title, message);
    }, [showToast]);

    const error = useCallback((title: string, message: string) => {
        showToast('error', title, message);
    }, [showToast]);

    const warning = useCallback((title: string, message: string) => {
        showToast('warning', title, message);
    }, [showToast]);

    const info = useCallback((title: string, message: string) => {
        showToast('info', title, message);
    }, [showToast]);

    return (
        <ToastContext.Provider value={{ toasts, showToast, removeToast, success, error, warning, info }}>
            {children}
            <ToastContainer toasts={toasts} onRemove={removeToast} />
        </ToastContext.Provider>
    );
};

export const useToast = (): ToastContextType => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast deve ser usado dentro de um ToastProvider');
    }
    return context;
};

// Componente de Container de Toasts
const ToastContainer: React.FC<{ toasts: Toast[]; onRemove: (id: string) => void }> = ({ toasts, onRemove }) => {
    return (
        <div className="fixed top-4 right-4 z-50 flex flex-col gap-3 max-w-md">
            {toasts.map(toast => (
                <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
            ))}
        </div>
    );
};

// Componente individual de Toast
const ToastItem: React.FC<{ toast: Toast; onRemove: (id: string) => void }> = ({ toast, onRemove }) => {
    const typeStyles = {
        success: 'border-l-green-500 bg-green-50',
        error: 'border-l-red-500 bg-red-50',
        warning: 'border-l-yellow-500 bg-yellow-50',
        info: 'border-l-blue-500 bg-blue-50'
    };

    const iconStyles = {
        success: 'bg-green-500',
        error: 'bg-red-500',
        warning: 'bg-yellow-500',
        info: 'bg-blue-500'
    };

    const icons = {
        success: '✓',
        error: '✕',
        warning: '!',
        info: 'i'
    };

    return (
        <div
            className={`${typeStyles[toast.type]} border-l-4 bg-white rounded-lg shadow-xl p-4 flex items-start gap-3 animate-slideInRight`}
        >
            <div className={`${iconStyles[toast.type]} w-6 h-6 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0`}>
                {icons[toast.type]}
            </div>
            <div className="flex-1">
                <h4 className="font-semibold text-gray-900 mb-1">{toast.title}</h4>
                <p className="text-sm text-gray-600">{toast.message}</p>
            </div>
            <button
                onClick={() => onRemove(toast.id)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Fechar"
            >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M8 6.59L13.3 1.3l1.41 1.41L9.41 8l5.3 5.3-1.41 1.41L8 9.41l-5.3 5.3-1.41-1.41L6.59 8 1.3 2.7 2.7 1.3 8 6.59z" />
                </svg>
            </button>
        </div>
    );
};
