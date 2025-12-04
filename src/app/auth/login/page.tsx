'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';

export default function LoginPage() {
    const router = useRouter();
    const { login, socialLogin } = useAuth();
    const toast = useToast();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            toast.info('Autenticando', 'Verificando suas credenciais...');

            const success = await login(email, password, rememberMe);

            if (success) {
                toast.success('Login realizado!', 'Bem-vindo de volta ao ObraCalc!');
                setTimeout(() => {
                    router.push('/dashboard');
                }, 1000);
            } else {
                toast.error('Erro no login', 'Credenciais inválidas. Tente novamente.');
            }
        } catch {
            toast.error('Erro', 'Não foi possível fazer login. Tente novamente.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSocialLogin = async (provider: 'google' | 'microsoft') => {
        try {
            toast.info(`Conectando com ${provider}`, 'Redirecionando...');
            await socialLogin(provider);
            toast.success('Conectado!', `Login com ${provider} realizado com sucesso.`);
            setTimeout(() => {
                router.push('/dashboard');
            }, 1000);
        } catch {
            toast.error('Erro', `Não foi possível conectar com ${provider}.`);
        }
    };

    return (
        <div className="min-h-screen bg-white dark:bg-[#191919] flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Blobs - Igual ao Hero */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 pointer-events-none">
                <div className="absolute top-20 left-1/4 w-72 h-72 bg-primary/10 rounded-full blur-3xl mix-blend-multiply animate-blob" />
                <div className="absolute top-20 right-1/4 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl mix-blend-multiply animate-blob animation-delay-2000" />
                <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl mix-blend-multiply animate-blob animation-delay-4000" />
            </div>

            {/* Login Card */}
            <div className="w-full max-w-md relative z-10">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-6">
                        <Image
                            src="/obracalc-logo.png"
                            alt="ObraCalc Logo"
                            width={80}
                            height={80}
                            className="drop-shadow-xl"
                        />
                    </div>
                    <h1 className="text-4xl font-bold text-[#1a1a1a] dark:text-gray-100 mb-2">
                        Bem-vindo de volta
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400">
                        Entre na sua conta para continuar
                    </p>
                </div>

                {/* Form Card */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-8">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                E-mail
                            </label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="seu@email.com"
                                required
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Senha
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    className="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-gray-600 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                                    aria-label="Mostrar senha"
                                >
                                    <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M10 4C5 4 1.73 7.11 1 10c.73 2.89 4 6 9 6s8.27-3.11 9-6c-.73-2.89-4-6-9-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {/* Options */}
                        <div className="flex items-center justify-between">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                    className="w-4 h-4 accent-primary cursor-pointer rounded"
                                />
                                <span className="text-sm text-gray-700 dark:text-gray-300">Lembrar-me</span>
                            </label>
                            <Link href="/auth/recuperar-senha" className="text-sm font-medium text-primary hover:text-primary-hover transition-colors">
                                Esqueceu a senha?
                            </Link>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-primary hover:bg-primary-hover text-white font-semibold py-3 px-6 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    <span>Entrando...</span>
                                </>
                            ) : (
                                <span>Entrar</span>
                            )}
                        </button>

                        {/* Divider */}
                        <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-4 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">ou continue com</span>
                            </div>
                        </div>

                        {/* Social Login */}
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={() => handleSocialLogin('google')}
                                className="flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
                            >
                                <svg width="20" height="20" viewBox="0 0 20 20">
                                    <path fill="#4285F4" d="M19.6 10.23c0-.82-.1-1.42-.25-2.05H10v3.72h5.5c-.15.96-.74 2.31-2.04 3.22v2.45h3.16c1.89-1.73 2.98-4.3 2.98-7.34z" />
                                    <path fill="#34A853" d="M13.46 15.13c-.83.59-1.96 1-3.46 1-2.64 0-4.88-1.74-5.68-4.15H1.07v2.52C2.72 17.75 6.09 20 10 20c2.7 0 4.96-.89 6.62-2.42l-3.16-2.45z" />
                                    <path fill="#FBBC05" d="M3.99 10c0-.69.12-1.35.32-1.97V5.51H1.07A9.973 9.973 0 000 10c0 1.61.39 3.14 1.07 4.49l3.24-2.52c-.2-.62-.32-1.28-.32-1.97z" />
                                    <path fill="#EA4335" d="M10 3.88c1.88 0 3.13.81 3.85 1.48l2.84-2.76C14.96.99 12.7 0 10 0 6.09 0 2.72 2.25 1.07 5.51l3.24 2.52C5.12 5.62 7.36 3.88 10 3.88z" />
                                </svg>
                                <span className="font-medium text-gray-700 dark:text-gray-300">Google</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => handleSocialLogin('microsoft')}
                                className="flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
                            >
                                <svg width="20" height="20" viewBox="0 0 20 20">
                                    <path fill="#f25022" d="M0 0h9.5v9.5H0z" />
                                    <path fill="#00a4ef" d="M10.5 0H20v9.5h-9.5z" />
                                    <path fill="#7fba00" d="M0 10.5h9.5V20H0z" />
                                    <path fill="#ffb900" d="M10.5 10.5H20V20h-9.5z" />
                                </svg>
                                <span className="font-medium text-gray-700 dark:text-gray-300">Microsoft</span>
                            </button>
                        </div>
                    </form>

                    {/* Footer */}
                    <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
                        Não tem uma conta?{' '}
                        <Link href="/auth/cadastro" className="font-semibold text-primary hover:text-primary-hover transition-colors">
                            Cadastre-se
                        </Link>
                    </div>
                </div>

                {/* Back to Home */}
                <div className="mt-6 text-center">
                    <Link href="/" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors inline-flex items-center gap-2">
                        <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M10 18l-8-8 8-8 1.41 1.41L5.83 9H20v2H5.83l5.58 5.59L10 18z" />
                        </svg>
                        Voltar para página inicial
                    </Link>
                </div>
            </div>
        </div>
    );
}
