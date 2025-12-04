'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';

export default function SignupPage() {
    const router = useRouter();
    const { signup } = useAuth();
    const toast = useToast();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [acceptTerms, setAcceptTerms] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Calcular força da senha
    const getPasswordStrength = (pwd: string) => {
        let strength = 0;
        if (pwd.length >= 8) strength++;
        if (pwd.length >= 12) strength++;
        if (/[a-z]/.test(pwd)) strength++;
        if (/[A-Z]/.test(pwd)) strength++;
        if (/\d/.test(pwd)) strength++;
        if (/[^a-zA-Z\d]/.test(pwd)) strength++;

        if (strength <= 2) return { level: 'weak', width: '33%', color: 'bg-red-500', text: 'Fraca' };
        if (strength <= 4) return { level: 'medium', width: '66%', color: 'bg-yellow-500', text: 'Média' };
        return { level: 'strong', width: '100%', color: 'bg-green-500', text: 'Forte' };
    };

    const passwordStrength = password ? getPasswordStrength(password) : null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!acceptTerms) {
            toast.error('Termos não aceitos', 'Você precisa aceitar os termos para continuar.');
            return;
        }

        if (password !== confirmPassword) {
            toast.error('Erro de validação', 'As senhas não coincidem.');
            return;
        }

        setIsLoading(true);

        try {
            toast.info('Criando conta', 'Aguarde enquanto criamos sua conta...');

            const success = await signup(name, email, password);

            if (success) {
                toast.success('Conta criada!', 'Enviamos um e-mail de verificação. Por favor, verifique sua caixa de entrada.');
                setTimeout(() => {
                    router.push('/auth/login');
                }, 2000);
            } else {
                toast.error('Erro no cadastro', 'Não foi possível criar sua conta. Tente novamente.');
            }
        } catch {
            toast.error('Erro', 'Não foi possível criar sua conta. Tente novamente.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white dark:bg-[#191919] flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Blobs */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 pointer-events-none">
                <div className="absolute top-20 left-1/4 w-72 h-72 bg-primary/10 rounded-full blur-3xl mix-blend-multiply animate-blob" />
                <div className="absolute top-20 right-1/4 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl mix-blend-multiply animate-blob animation-delay-2000" />
                <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl mix-blend-multiply animate-blob animation-delay-4000" />
            </div>

            {/* Signup Card */}
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
                        Criar conta
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400">
                        Comece sua jornada com o ObraCalc
                    </p>
                </div>

                {/* Form Card */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-8">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Name */}
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Nome completo
                            </label>
                            <input
                                type="text"
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="João Silva"
                                required
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                            />
                        </div>

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
                            {/* Password Strength */}
                            {passwordStrength && (
                                <div className="mt-2">
                                    <div className="h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full ${passwordStrength.color} transition-all duration-300`}
                                            style={{ width: passwordStrength.width }}
                                        ></div>
                                    </div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Força da senha: {passwordStrength.text}</p>
                                </div>
                            )}
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Confirmar senha
                            </label>
                            <div className="relative">
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    id="confirmPassword"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    className="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-gray-600 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                                    aria-label="Mostrar senha"
                                >
                                    <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M10 4C5 4 1.73 7.11 1 10c.73 2.89 4 6 9 6s8.27-3.11 9-6c-.73-2.89-4-6-9-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {/* Terms */}
                        <label className="flex items-start gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={acceptTerms}
                                onChange={(e) => setAcceptTerms(e.target.checked)}
                                className="w-4 h-4 mt-1 accent-primary cursor-pointer rounded"
                                required
                            />
                            <span className="text-sm text-gray-700 dark:text-gray-300">
                                Aceito os{' '}
                                <Link href="/termos" className="font-medium text-primary hover:text-primary-hover">
                                    Termos de Uso
                                </Link>
                                {' '}e{' '}
                                <Link href="/privacidade" className="font-medium text-primary hover:text-primary-hover">
                                    Política de Privacidade
                                </Link>
                            </span>
                        </label>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-primary hover:bg-primary-hover text-white font-semibold py-3 px-6 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    <span>Criando conta...</span>
                                </>
                            ) : (
                                <span>Criar conta</span>
                            )}
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
                        Já tem uma conta?{' '}
                        <Link href="/auth/login" className="font-semibold text-primary hover:text-primary-hover transition-colors">
                            Entrar
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
