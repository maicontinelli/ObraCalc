'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Tipos
export interface User {
    id: string;
    name: string;
    email: string;
    verified: boolean;
    has2FA: boolean;
    plan: 'free' | 'professional' | 'business';
    planActive: boolean;
    createdAt?: string;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (email: string, password: string, rememberMe?: boolean) => Promise<boolean>;
    signup: (name: string, email: string, password: string) => Promise<boolean>;
    logout: () => void;
    forgotPassword: (email: string) => Promise<boolean>;
    verify2FA: (code: string) => Promise<boolean>;
    socialLogin: (provider: 'google' | 'microsoft') => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Utilitários
const generateToken = (userId: string, email: string): string => {
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = btoa(JSON.stringify({
        userId,
        email,
        iat: Date.now(),
        exp: Date.now() + (24 * 60 * 60 * 1000) // 24 horas
    }));
    const signature = btoa(`${header}.${payload}.secret`);
    return `${header}.${payload}.${signature}`;
};

const storeToken = (token: string, remember: boolean = false) => {
    if (remember) {
        localStorage.setItem('authToken', token);
    } else {
        sessionStorage.setItem('authToken', token);
    }
};

const getToken = (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
};

const clearToken = () => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('authToken');
    sessionStorage.removeItem('authToken');
    localStorage.removeItem('user');
};

const isValidEmail = (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};

const isStrongPassword = (password: string): boolean => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return regex.test(password);
};

// Provider
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Verificar autenticação ao carregar
    useEffect(() => {
        const initAuth = () => {
            const storedToken = getToken();
            if (storedToken) {
                setToken(storedToken);

                // Tentar recuperar usuário do localStorage
                const storedUser = localStorage.getItem('user');
                if (storedUser) {
                    try {
                        setUser(JSON.parse(storedUser));
                    } catch (error) {
                        console.error('Erro ao recuperar usuário:', error);
                        clearToken();
                    }
                }
            }
            setIsLoading(false);
        };

        initAuth();
    }, []);

    // Login
    const login = async (email: string, password: string, rememberMe: boolean = false): Promise<boolean> => {
        try {
            if (!isValidEmail(email)) {
                throw new Error('E-mail inválido');
            }

            if (!password) {
                throw new Error('Senha é obrigatória');
            }

            // Simular chamada API (substituir por chamada real)
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Mock user (em produção, virá do backend)
            const mockUser: User = {
                id: Date.now().toString(),
                name: 'Usuário Demo',
                email: email,
                verified: true,
                has2FA: false,
                plan: 'professional',
                planActive: true,
                createdAt: new Date().toISOString()
            };

            // Verificar plano ativo
            if (!mockUser.planActive) {
                throw new Error('Plano inativo. Redirecionando para planos...');
            }

            // Gerar token
            const newToken = generateToken(mockUser.id, mockUser.email);

            // Armazenar
            storeToken(newToken, rememberMe);
            localStorage.setItem('user', JSON.stringify(mockUser));

            setToken(newToken);
            setUser(mockUser);

            return true;
        } catch (error) {
            console.error('Erro no login:', error);
            return false;
        }
    };

    // Cadastro
    const signup = async (name: string, email: string, password: string): Promise<boolean> => {
        try {
            if (!name || name.length < 3) {
                throw new Error('Nome deve ter pelo menos 3 caracteres');
            }

            if (!isValidEmail(email)) {
                throw new Error('E-mail inválido');
            }

            if (!isStrongPassword(password)) {
                throw new Error('Senha fraca. Use no mínimo 8 caracteres, incluindo maiúsculas, minúsculas e números');
            }

            // Simular chamada API
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Em produção, o backend criaria o usuário
            return true;
        } catch (error) {
            console.error('Erro no cadastro:', error);
            return false;
        }
    };

    // Logout
    const logout = () => {
        clearToken();
        setUser(null);
        setToken(null);
    };

    // Recuperação de senha
    const forgotPassword = async (email: string): Promise<boolean> => {
        try {
            if (!isValidEmail(email)) {
                throw new Error('E-mail inválido');
            }

            // Simular envio de email
            await new Promise(resolve => setTimeout(resolve, 1000));

            return true;
        } catch (error) {
            console.error('Erro na recuperação:', error);
            return false;
        }
    };

    // Verificação 2FA
    const verify2FA = async (code: string): Promise<boolean> => {
        try {
            if (code.length !== 6) {
                throw new Error('Código deve ter 6 dígitos');
            }

            // Simular validação
            await new Promise(resolve => setTimeout(resolve, 1000));

            return true;
        } catch (error) {
            console.error('Erro na verificação 2FA:', error);
            return false;
        }
    };

    // Login Social
    const socialLogin = async (provider: 'google' | 'microsoft'): Promise<void> => {
        try {
            // Em produção, redirecionar para OAuth
            // window.location.href = `/api/auth/${provider}`;

            // Simulação
            await new Promise(resolve => setTimeout(resolve, 1500));

            const mockUser: User = {
                id: Date.now().toString(),
                name: `Usuário ${provider}`,
                email: `user@${provider}.com`,
                verified: true,
                has2FA: false,
                plan: 'free',
                planActive: true
            };

            const newToken = generateToken(mockUser.id, mockUser.email);
            storeToken(newToken, false);
            localStorage.setItem('user', JSON.stringify(mockUser));

            setToken(newToken);
            setUser(mockUser);
        } catch (error) {
            console.error('Erro no login social:', error);
            throw error;
        }
    };

    const value: AuthContextType = {
        user,
        token,
        isLoading,
        isAuthenticated: !!user && !!token,
        login,
        signup,
        logout,
        forgotPassword,
        verify2FA,
        socialLogin
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook personalizado
export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth deve ser usado dentro de um AuthProvider');
    }
    return context;
};
